# Spark It! Demo Accounts

## Production App URL
https://app-projects-ericramcharran.replit.app/sparkit/login

---

## Premium Accounts (5 couples = 10 logins)
**Features:** 999 sparks, unlimited video calling, custom avatars, AI activity suggestions

### 1. Devin & Stephanie (Empty Nesters)
- **Couple Code:** `DEVST1`
- **Devin:** `devin@demo.com` / `demo123`
- **Stephanie:** `stephanie@demo.com` / `demo123`
- **Subscription:** Monthly Premium | 999 Sparks

### 2. Sam & Riley (Engaged)
- **Couple Code:** `PREMM1`
- **Sam:** `sam@demo.com` / `demo123`
- **Riley:** `riley@demo.com` / `demo123`
- **Subscription:** Monthly Premium | 999 Sparks

### 3. Cliff & Christi (Monogamous)
- **Couple Code:** `PREM02`
- **Cliff:** `cliff@demo.com` / `demo123`
- **Christi:** `christi@demo.com` / `demo123`
- **Subscription:** Monthly Premium | 999 Sparks

### 4. Keith & Dawn (Empty Nesters)
- **Couple Code:** `PREM03`
- **Keith:** `keith@demo.com` / `demo123`
- **Dawn:** `dawn@demo.com` / `demo123`
- **Subscription:** Monthly Premium | 999 Sparks

### 5. Drew & Blake (Monogamous)
- **Couple Code:** `DREW01`
- **Drew:** `drew@demo.com` / `demo123`
- **Blake:** `blake@demo.com` / `demo123`
- **Subscription:** Monthly Premium | 999 Sparks

---

## Trial Accounts (5 couples = 10 logins)
**Features:** 20 total sparks, limited features

### 1. Alex & Jordan (Newly Dating)
- **Couple Code:** `DEMO01`
- **Alex:** `alex@demo.com` / `demo123`
- **Jordan:** `jordan@demo.com` / `demo123`
- **Subscription:** Trial | 20 Sparks Total

### 2. Taylor & Morgan (Long Distance)
- **Couple Code:** `DEMO02`
- **Taylor:** `taylor@demo.com` / `demo123`
- **Morgan:** `morgan@demo.com` / `demo123`
- **Subscription:** Trial | 20 Sparks Total

### 3. Casey & Jamie (Couple with Kids)
- **Couple Code:** `DEMO03`
- **Casey:** `casey@demo.com` / `demo123`
- **Jamie:** `jamie@demo.com` / `demo123`
- **Subscription:** Trial | 20 Sparks Total

### 4. Quinn & Sage (Polyamorous)
- **Couple Code:** `DEMO04`
- **Quinn:** `quinn@demo.com` / `demo123`
- **Sage:** `sage@demo.com` / `demo123`
- **Subscription:** Trial | 20 Sparks Total

### 5. Avery & Kaitlyn (Long Term Dating)
- **Couple Code:** `DEMO05`
- **Avery:** `avery@demo.com` / `demo123`
- **Kaitlyn:** `kaitlyn@demo.com` / `demo123`
- **Subscription:** Trial | 20 Sparks Total

---

## Summary
- **Total:** 10 couples (20 individual logins)
- **All Passwords:** `demo123`
- **Email Domain:** `@demo.com`
- **Couple Codes:** Easy to remember (DEVST1, PREMM1, PREM02, PREM03, DREW01, DEMO01-05)

---

## How Couple Codes Work
1. Partner 1 signs up → Receives couple code (e.g., `DEVST1`)
2. Partner 1 shares code with Partner 2 (via text, email, etc.)
3. Partner 2 enters code during signup → Both partners are now linked
4. Both can login independently and see the same activities/sparks/scoreboard

---

## For Beta Testing
Share these credentials with beta testers to demonstrate:
- **Premium Features:** Unlimited sparks, video calling, custom avatars (Devin/Stephanie, Sam/Riley, etc.)
- **Trial Experience:** Limited sparks, freemium restrictions (Alex/Jordan, Taylor/Morgan, etc.)
- **Different Relationship Types:** Empty nesters, engaged, newly dating, long distance, polyamorous, couple with kids

---

## Demo User Monitoring System

The app now includes real-time activity monitoring for all demo accounts. This helps you track user behavior, identify issues, and monitor engagement during beta testing.

### What Gets Tracked

**Authentication Events:**
- User logins, logouts, signups, and couple joins
- Tracks which demo accounts are actively using the app

**Feature Usage:**
- Button presses (when users click to start an activity)
- Activity reveals (when activities are displayed)
- Spark consumption tracking

**Errors & Issues:**
- Automatically logs high-severity errors to console
- Tracks error details with severity levels (low, medium, high, critical)

### How to View Activity Logs

Use the admin API endpoint to query activity logs:

**Basic Query (last 24 hours):**
```bash
curl "http://localhost:5000/api/admin/demo-activity"
```

**Filter by Time Window:**
```bash
# Last 24 hours (default)
curl "http://localhost:5000/api/admin/demo-activity?window=24h"

# Last 7 days
curl "http://localhost:5000/api/admin/demo-activity?window=7d"

# Last 30 days
curl "http://localhost:5000/api/admin/demo-activity?window=30d"
```

**Filter by Couple Code:**
```bash
# View activity for Devin & Stephanie
curl "http://localhost:5000/api/admin/demo-activity?coupleCode=DEVST1"

# View activity for trial couple
curl "http://localhost:5000/api/admin/demo-activity?coupleCode=DEMO01"
```

**Filter by Event Type:**
```bash
# Authentication events only
curl "http://localhost:5000/api/admin/demo-activity?eventType=auth"

# Spark usage only
curl "http://localhost:5000/api/admin/demo-activity?eventType=spark"
```

**Filter by Error Severity:**
```bash
# High-priority errors only
curl "http://localhost:5000/api/admin/demo-activity?severity=high"

# Critical errors only
curl "http://localhost:5000/api/admin/demo-activity?severity=critical"
```

**Combine Filters:**
```bash
# All DEVST1 activity in the last 7 days
curl "http://localhost:5000/api/admin/demo-activity?coupleCode=DEVST1&window=7d"

# All authentication issues in last 24 hours
curl "http://localhost:5000/api/admin/demo-activity?eventType=auth&severity=high"
```

**Pagination:**
```bash
# First 50 results (default)
curl "http://localhost:5000/api/admin/demo-activity?limit=50&offset=0"

# Next 50 results
curl "http://localhost:5000/api/admin/demo-activity?limit=50&offset=50"
```

### Response Format

```json
{
  "logs": [
    {
      "id": 1,
      "coupleCode": "DEVST1",
      "actorEmail": "devin@demo.com",
      "eventType": "auth",
      "eventName": "login",
      "payload": { "method": "password" },
      "errorMessage": null,
      "errorSeverity": null,
      "createdAt": "2025-11-01T10:30:00.000Z"
    }
  ],
  "count": 1,
  "filters": {
    "window": "24h",
    "limit": 50,
    "offset": 0
  }
}
```

### Event Types Reference

| Event Type | Event Name | Description |
|------------|------------|-------------|
| `auth` | `login` | User logged in |
| `auth` | `logout` | User logged out |
| `auth` | `signup` | New user signed up |
| `auth` | `join_couple` | User joined existing couple |
| `spark` | `button_press` | User pressed activity button |
| `spark` | `activity_reveal` | Activity was revealed to user |

### Severity Levels

- **low:** Informational events, normal operations
- **medium:** Minor issues, warnings
- **high:** Significant errors requiring attention (auto-logged to console)
- **critical:** Severe failures, app-breaking issues (auto-logged to console)

### Automatic Console Logging

High and critical severity errors are automatically logged to the server console for immediate visibility:

```
[HIGH SEVERITY] Demo couple DEVST1: spark_insufficient
Details: {"sparksNeeded": 1, "sparksAvailable": 0}
```

### How It Works

1. **Automatic Detection:** The system automatically detects demo users based on:
   - Email ending with `@demo.com`
   - Couple code matching demo list (DEVST1, PREMM1, PREM02, etc.)

2. **Zero Performance Impact:** Non-demo users are not tracked, ensuring no performance overhead in production

3. **Comprehensive Logging:** All key user journeys are tracked from signup through feature usage

4. **Efficient Queries:** Database indexes ensure fast log retrieval even with thousands of events

### Use Cases

**Monitor Beta Engagement:**
```bash
# See which couples are most active
curl "http://localhost:5000/api/admin/demo-activity?window=7d&eventType=spark"
```

**Debug User Issues:**
```bash
# Check recent errors for a specific couple
curl "http://localhost:5000/api/admin/demo-activity?coupleCode=DEMO01&severity=high"
```

**Track Authentication:**
```bash
# See all login activity today
curl "http://localhost:5000/api/admin/demo-activity?window=24h&eventType=auth"
```

**Validate Features:**
```bash
# Verify button press tracking is working
curl "http://localhost:5000/api/admin/demo-activity?eventType=spark&limit=10"
```
