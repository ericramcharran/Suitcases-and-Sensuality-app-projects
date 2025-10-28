# AI Activity Discovery Feature

## Overview
The AI Activity Discovery feature uses OpenAI GPT-4 Turbo (via Replit AI Integrations) to generate personalized, location-based date activities for Spark It! couples.

## Current Status
**DISABLED BY DEFAULT** - The feature is fully implemented but turned off until you're ready to enable it.

## How to Enable

### Step 1: Add Environment Variables
Add these two secrets in your Replit project's Secrets tab:

1. **Backend Flag:**
   - Name: `ENABLE_AI_ACTIVITIES`
   - Value: `true`

2. **Frontend Flag:**
   - Name: `VITE_ENABLE_AI_ACTIVITIES`
   - Value: `true`

### Step 2: Restart Your Application
After adding both secrets, restart your app to apply the changes.

### Step 3: Verify It Works
1. Sign up a new couple with a city and state (e.g., "Austin, TX")
2. Complete the spark flow to get to the activity page
3. You should see an "AI Local Activity" button at the bottom
4. Click it to generate a location-specific activity

## How It Works

### User Experience
- Couples provide their city/state during signup (optional) or can add it later in Settings
- When both city and state are set, an "AI Local Activity" button appears on the activity page
- Clicking generates a unique activity specific to their location (takes 5-20 seconds)
- Each generation creates one new activity based on their city, state, and relationship type

### Technical Details
- **API Endpoint:** `GET /api/sparkit/couples/:id/ai-activities`
- **Model:** GPT-4 Turbo (via Replit AI Integrations)
- **Cost:** Billed to your Replit credits (no personal OpenAI API key needed)
- **Response Time:** 5-20 seconds per activity
- **Location Required:** Both city AND state must be set for the button to appear

### When Disabled
- AI button is hidden from the UI
- API endpoint returns 503 "feature disabled" error
- All other features work normally

## How to Disable

To turn off the AI feature, either:
1. Delete the `ENABLE_AI_ACTIVITIES` and `VITE_ENABLE_AI_ACTIVITIES` secrets, OR
2. Change their values to anything other than `true` (e.g., `false`)

Then restart your application.

## Costs & Billing

This feature uses **Replit AI Integrations**, which means:
- No need for your own OpenAI API key
- Costs are billed directly to your Replit account
- You're charged based on usage (tokens consumed)
- Typical cost per activity generation: ~$0.01-0.03

**Recommended:** Monitor your Replit usage if you enable this feature in production.

## Feature Flag Architecture

The feature uses a two-part flag system:
- **Backend:** Checks `process.env.ENABLE_AI_ACTIVITIES === 'true'`
- **Frontend:** Checks `import.meta.env.VITE_ENABLE_AI_ACTIVITIES === 'true'`

Both must be enabled for the feature to work. This gives you fine-grained control and prevents accidental partial enablement.
