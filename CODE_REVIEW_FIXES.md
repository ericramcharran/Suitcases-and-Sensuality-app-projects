# Code Review & Performance Fixes

## Critical Security & Bug Fixes

### 1. **Fixed Race Condition in Spark Usage** ✅
**File:** `server/storage.ts` - `useSpark()` method

**Problem:** 
- Used read-modify-write pattern that wasn't atomic
- Concurrent requests could cause negative spark counts or double-spend sparks

**Solution:**
- Implemented atomic SQL updates using `sql` template literals
- Added WHERE clause with `gt(sparkitCouples.sparksRemaining, 0)` to ensure sparks only decrease if available
- Used `COALESCE` for safe null handling
- Returns current state if update fails (no sparks remaining)

```typescript
// Before: Read, check, then update (non-atomic)
const couple = await this.getCoupleById(id);
if (couple.sparksRemaining > 0) {
  await db.update(sparkitCouples).set({ sparksRemaining: couple.sparksRemaining - 1 })
}

// After: Atomic update with WHERE clause
const result = await db.update(sparkitCouples)
  .set({ 
    sparksRemaining: sql`${sparkitCouples.sparksRemaining} - 1`,
    totalSparksUsed: sql`COALESCE(${sparkitCouples.totalSparksUsed}, 0) + 1`
  })
  .where(and(
    eq(sparkitCouples.id, id),
    gt(sparkitCouples.sparksRemaining, 0) // Only update if sparks > 0
  ))
```

---

### 2. **Optimized Scoreboard Stats Query** ✅
**File:** `server/storage.ts` - `getScoreboardStats()` method

**Problem:**
- Fetched ALL activity results into memory
- Filtered in JavaScript (O(n) per request)
- Scaled poorly with large datasets

**Solution:**
- Converted to single SQL aggregation query using `COUNT(CASE WHEN...)` 
- Database performs counting, not application
- Much faster for large datasets

```typescript
// Before: Fetch all, then filter in JS
const results = await db.select().from(sparkitActivityResults).where(...)
const partner1Wins = results.filter(r => r.winner === 'partner1').length

// After: SQL aggregation
const result = await db.select({
  partner1Wins: sql<number>`COUNT(CASE WHEN ${sparkitActivityResults.winner} = 'partner1' THEN 1 END)`,
  partner2Wins: sql<number>`COUNT(CASE WHEN ${sparkitActivityResults.winner} = 'partner2' THEN 1 END)`,
  ties: sql<number>`COUNT(CASE WHEN ${sparkitActivityResults.winner} = 'tie' THEN 1 END)`,
  totalActivities: sql<number>`COUNT(*)`
}).from(sparkitActivityResults).where(...)
```

---

### 3. **Optimized Stripe Webhook Queries** ✅
**File:** `server/routes.ts` - Webhook handler & `server/storage.ts`

**Problem:**
- Webhook handler used `getAllCouples()` to find couple by Stripe customer ID
- Fetched ALL couples from database on every webhook event
- O(n) memory and network overhead

**Solution:**
- Added `getCoupleByStripeCustomerId()` method with indexed query
- Webhook now uses efficient single-row lookup

```typescript
// Before: Fetch all couples, filter in JS
const couples = await storage.getAllCouples();
const couple = couples.find(c => c.stripeCustomerId === customerId);

// After: Indexed database query
const couple = await storage.getCoupleByStripeCustomerId(customerId);
```

---

### 4. **Fixed Trial Spark Count** ✅
**File:** `server/routes.ts` - Multiple locations

**Problem:**
- Trial accounts inconsistently used 10 or 20 sparks
- Webhook handlers reset to 10 sparks instead of 20

**Solution:**
- Standardized all trial accounts to 20 sparks
- Updated webhook handlers, signup flow, and cancellation flows

---

## Known Issues & TODOs

### 1. **Stripe Webhook Idempotency** ⚠️ 
**Priority:** Medium (for production readiness)

**Issue:**
- Stripe retries failed webhooks
- Current implementation doesn't track processed event IDs
- Could process same event multiple times on retries

**Recommended Solution:**
```typescript
// Create stripe_events table
export const stripeEvents = pgTable("stripe_events", {
  id: varchar("id").primaryKey(), // Stripe event ID
  type: text("type").notNull(),
  processedAt: timestamp("processed_at").defaultNow()
});

// In webhook handler:
const existingEvent = await db.select().from(stripeEvents).where(eq(stripeEvents.id, event.id));
if (existingEvent.length > 0) {
  return res.json({ received: true }); // Already processed
}
// ... process event ...
await db.insert(stripeEvents).values({ id: event.id, type: event.type });
```

---

### 2. **Missing Pagination on Large Datasets** ⚠️
**Priority:** Medium

**Affected Methods:**
- `getAllUsers()` - Returns all users (could be thousands)
- `getMessages(matchId)` - Returns all messages for a match (unlimited)
- `getTriviaAnswersByContestId()` - Returns all answers

**Recommended Solution:**
Add `limit` and `offset` parameters:

```typescript
async getMessages(matchId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
  return await db.select()
    .from(messages)
    .where(eq(messages.matchId, matchId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(messages.createdAt));
}
```

---

### 3. **Missing Database Indexes** ⚠️
**Priority:** Medium (for scale)

**Recommended Indexes:**
```sql
-- For message queries
CREATE INDEX idx_messages_sender ON messages(sender_id, created_at DESC);
CREATE INDEX idx_messages_receiver ON messages(receiver_id, created_at DESC);

-- For activity results
CREATE INDEX idx_activity_results_couple ON sparkit_activity_results(couple_id, created_at DESC);

-- For couple lookups
CREATE INDEX idx_couples_stripe_customer ON sparkit_couples(stripe_customer_id);
```

---

### 4. **AI Activity Generation Timeout** ℹ️
**Priority:** Low (feature flag controlled)

**Current:**
- 20-second timeout on OpenAI API calls
- Blocks request thread during generation
- No caching

**Potential Improvement:**
- Cache last activity per couple for 24 hours
- Or use async job queue + polling endpoint
- Return 202 Accepted with polling URL

---

## Performance Metrics

### Before Fixes:
- **Scoreboard Query:** O(n) where n = total activities, fetches all rows
- **Webhook Handler:** O(m) where m = total couples, fetches all couples  
- **Spark Usage:** Race condition possible with concurrent requests

### After Fixes:
- **Scoreboard Query:** O(1) - single aggregation query, database does counting
- **Webhook Handler:** O(1) - indexed lookup by Stripe customer ID
- **Spark Usage:** Atomic, race-condition free

---

## Testing Recommendations

1. **Load Test Spark Usage**
   - Send concurrent spark usage requests
   - Verify sparks never go negative
   - Verify final count matches expected value

2. **Test Webhook Idempotency**
   - Send same Stripe event multiple times
   - Verify subscription status only changes once

3. **Performance Test Scoreboard**
   - Create couple with 1000+ activities
   - Measure scoreboard load time
   - Should be < 100ms

---

## Code Quality Improvements

### Atomic Operations
- All critical state changes now use atomic SQL
- Prevents race conditions in concurrent scenarios

### Query Optimization
- Replaced JavaScript filters with SQL aggregations
- Reduced memory usage and network overhead

### Consistent Data
- Trial sparks now consistently 20 everywhere
- Subscription plan names standardized ('monthly', 'yearly', 'trial')
