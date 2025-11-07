# Multi-App Project

## Overview

This Replit project hosts two distinct applications: "The Executive Society" and "Spark It!".

**The Executive Society** is a premium BDSM dating platform designed for professionals seeking authentic power exchange relationships. It focuses on trust, safety, consent, and sophisticated user matching, aiming to be a leading platform for discerning individuals in serious power exchange dynamics.

**Spark It!** is a couples activity app created to alleviate decision fatigue. It features a unique simultaneous button press mechanic for instant activity suggestions. The app operates on a freemium model with premium subscriptions, offering activity suggestions, trivia challenges, and a competitive scoreboard.

## Recent Fixes (November 7, 2025)

**Daily Reminders Full Implementation** (November 7, 2025): Completed email and push notification delivery for daily reminders, consolidated UI into Settings page.
- **Email Delivery**: Implemented HTML email templates with Spark It! branding using Resend API. Emails include gradient header, daily question/activity/conversation starter content, and professional formatting.
- **Push Notification Delivery**: Implemented web push notifications using VAPID keys. System iterates through both partners' push subscriptions and sends notifications to all devices.
- **SMS Delivery**: Already implemented via Twilio (sends to both partners' phone numbers).
- **Multi-Channel Success Logic**: Reminder delivery succeeds if ANY channel (SMS, email, or push) works. Granular error logging for each failed channel.
- **Settings Page Integration**: Moved daily reminders UI from standalone `/sparkit/reminders` page into `/sparkit/settings` page. All functionality preserved (enable/disable toggle, time selection, notification method, save button, preview button).
- **Routing Update**: `/sparkit/reminders` now redirects to `/sparkit/settings` for backwards compatibility.
- **Improved UX**: Settings always save successfully even if push notifications are blocked. Users see success toast after every save, with optional permission warning if push is unavailable.
- **Testing**: End-to-end tests confirm all functionality works correctly (settings save, redirects work, UI reflects saved values).
- **Note**: These changes require republishing to production to take effect for live users.

**Service Worker Registration Fix** (November 6, 2025): Resolved critical issue preventing push notification service worker from registering.
- Added `updateViaCache: 'none'` option to service worker registration in `notifications.ts` to prevent browser from caching broken versions
- Added `await navigator.serviceWorker.ready` to ensure service worker is fully ready before proceeding
- Updated service worker cache version from v4 to v5 to force cache refresh
- Fixed service worker not registering due to browser caching the old broken version
- **Critical learning**: Changes to service workers require republishing to production to take effect for users

**Settings Icon Navigation**: Added universal Settings icon to all Spark It! pages for easy access.
- Added Settings icon (lucide-react) to top-right of all pages except SparkitSettings.tsx itself
- Consistent styling: white outline (`border-white/40`), glow shadow, backdrop blur, subtle background (`bg-white/5`)
- Positioned absolutely at top-right or paired with existing navigation elements
- Navigates to /sparkit/settings when clicked
- Includes `data-testid="button-settings"` for testing consistency
- Updated 11 pages: SparkitReminders, SparkitTriviaCategories, SparkitTriviaShare, SparkitTriviaResults, SparkitVideoSpark, SparkitTriviaContest, SparkitLogin, SparkitCoupleSignup, SparkitJoinCouple, SparkitPremium, SparkitPricing
- Improves app discoverability and UX by providing consistent access to settings from anywhere

**Avatar Gallery Performance Optimization**: Improved avatar selection loading speed in Settings.
- Renamed "Choose an Icon" to "Avatars" for clarity
- Added lazy loading (`loading="lazy"`) to all 82 avatar images
- Images now load only as they come into view when scrolling, significantly improving page load time
- Applied to both Partner 1 and Partner 2 avatar galleries

**Trivia Content Expansion**: Added 100 new trivia questions (IDs 226-325), bringing total to 325+ questions.
- Evenly distributed across all 10 categories (Pop Culture, Science & Nature, History, Geography, Food & Drink, Sports, Music, Literature, General Knowledge, Love & Relationships)
- Each category received 10 additional questions
- Provides more variety and replayability for couples' trivia challenges
- Each contest uses 5 random questions from the selected category's pool of 35 questions

**Consistent Back Button Styling**: Unified all back buttons across Spark It! app with white outline highlight and narrower spacing.
- Applied consistent styling: white border (`border-white/40`), white glow shadow, backdrop blur, and subtle background
- Reduced spacing between arrow and "Back" text (changed `mr-2` to `mr-1` for tighter appearance)
- Updated 11 pages: SparkitSettings, SparkitTriviaShare, SparkitTriviaResults, SparkitVideoSpark, SparkitTriviaCategories, AboutApp, PrivacyPolicy, Scoreboard, SparkitReminders, Download
- Creates cohesive "cut out" appearance across the entire app

**Data Freshness Fix** (November 5, 2025): Resolved critical caching issue where premium accounts displayed incorrect trial subscription data. 
- Updated `queryClient.ts`: Changed `staleTime` from `Infinity` to `0` to ensure fresh data fetching
- Updated `SparkButton.tsx`: Added `gcTime: 0` and `staleTime: 0` to couple data query for real-time subscription updates
- Updated `sw.js`: Service worker now only caches images/icons/manifest, never HTML/JS/CSS/API responses
- Updated `routes.ts`: Added `no-cache` headers to couple data endpoint
- Removed `TooltipProvider` from `App.tsx` temporarily (was causing React hook errors after cache clearing)

**Push/Email Notifications Default Enabled** (November 5, 2025): Changed notification preferences to be enabled by default for ALL users (new and existing).
- Updated `schema.ts`: Changed `notificationMethod` default from `'sms'` to `'all'` (enables push, email, and SMS)
- Updated `routes.ts`: 
  - Automatically create reminder preferences at signup with all notification methods enabled
  - GET endpoint now auto-creates preferences with `'all'` if none exist (fixes existing production accounts)
  - PUT endpoint defaults to `'all'` when creating new preferences
- This means when any existing production user (like sam from PREMM1) visits the reminder settings page, preferences are automatically created with push and email enabled
- Admin endpoint available at `/admin/enable-push-notifications` to bulk-enable notifications for existing production accounts (optional, as GET endpoint now handles it automatically)

## User Preferences

Preferred communication style: Simple, everyday language.

**Publishing Notifications:** Always notify the user whenever code changes require republishing to production.

## System Architecture

The project integrates both applications within a single Express/Vite server infrastructure, maintaining separate styling and branding for each.

### Frontend

Both applications use React 18+ with TypeScript, Vite for bundling, and Wouter for routing.

**The Executive Society** frontend utilizes a mobile-first PWA design, a shadcn/ui and Radix UI design system, and Tailwind CSS for styling with dark/light mode theming and a rose accent color.

**Spark It!** frontend uses a custom NEXUS design system with purple-to-red gradient branding, ensuring styling isolation.

**Key UI/UX Decisions:**
- Mobile-first PWA design for The Executive Society.
- Responsive design principles.
- Professional, clean aesthetic with rose accents for The Executive Society.
- Vibrant, gradient-based branding for Spark It!.

**Technical Implementations:**
- State management with TanStack Query.
- Backend developed with Express.js and TypeScript, using a RESTful API.
- Zod for request/response schema validation.
- PWA configuration including `manifest.json` and `start_url`.
- Favicon requirements (1:1 square aspect ratio).

**Feature Specifications:**
-   **User Onboarding (The Executive Society):** Multi-step process including age/ID verification, legal agreements with digital signatures, background checks, email/phone verification, and role-specific flows (Dominants undergo escrow verification).
-   **Matching & Discovery (The Executive Society):** Sophisticated compatibility algorithm and a Tinder-style card swiping interface.
-   **Core Features (The Executive Society):** Email & optional Phone verification, Digital Signatures, Email & Web Push Notifications, Real-Time Messaging (WebSocket-enabled), Device Permissions Manager, Travel Mode, Verified & Fully Funded Badge for Dominants, Custom Privacy-focused Profile Names.
-   **Spark It! Features:** Simultaneous button press with SMS and browser push notifications, activity reveal with rating, winner selection, competitive scoreboard, spark counter (freemium/premium), localStorage persistence, in-app video calling, partner name customization, avatar selection/custom upload (premium-only), AI-powered location-based activity discovery, SMS text messaging for activities.
-   **Spark It! Premium Subscription:** Stripe-powered monthly ($6.99) and yearly ($59.99) plans offering unlimited sparks, custom avatars, and video calling. A trial system provides 10 total sparks OR 7 days. Premium features are gated.
-   **Spark It! Activity Database:** 253 activities across 19 categories (In-Person, Long-Distance, Boredom Buster, Polyamorous).
-   **Spark It! AI Activity Discovery (Feature Flag Controlled):** OpenAI GPT-4 Turbo powered location-based activity suggestions using Replit AI Integrations.
-   **Spark It! Trivia System:** 325+ trivia questions across 10 categories. Head-to-head competition where both partners answer the same questions. Real-time WebSocket notifications for challenge acceptance and completion.
-   **Spark It! Video Calling:** Daily.co integration for embedded video calls.
-   **Spark It! Daily Reminders:** Automated daily reminder system with 45 seeded content entries (questions, activities, conversation starters). Couples configure reminder time and delivery method (SMS, email, push, or all) via Settings page. Scheduler runs every minute, sends once per day at configured time, tracks delivery success to prevent duplicates. All three delivery channels fully implemented: SMS via Twilio, email via Resend (HTML templates with Spark It! branding), and push notifications via web-push (VAPID). Multi-channel delivery succeeds if ANY method works. Settings always save successfully, even if push notifications are blocked by the browser.

**System Design Choices:**
-   Shared Express/Vite server infrastructure.
-   PostgreSQL database with Drizzle ORM for all persistent data.
-   In-memory storage abstraction (`MemStorage`) for backend.
-   `react-signature-canvas` for digital signatures.
-   VAPID and service worker for web push notifications (shared).
-   `push_subscriptions` table supports both applications.
-   WebSocket infrastructure for real-time updates (spark button synchronization, trivia completion notifications).
-   Daily.co integration for video calling.
-   Session-based authentication for Spark It! with PostgreSQL store and 30-day cookie persistence.
-   `localStorage` for `sparkitCoupleId` to enable client-side couple context.
-   Trivia challenges use WebSocket + polling fallback for real-time completion notifications.
-   Daily reminder scheduler runs automatically on server startup, checking for reminders to send every minute.
-   Admin announcement system allows broadcasting push notifications to all Spark It! users who have enabled notifications (accessible at `/sparkit/admin/announce` with ADMIN_EMAIL authentication).

## Demo Accounts

**Spark It! Demo Couples** (all passwords: demo123)

**Premium Accounts (999 sparks, unlimited access):**
- **DEVST1**: Devin (`devin1@demo.com`) & Stephanie (`stephanie1@demo.com`) - Monthly Premium
- **PREMM1**: Sam (`sam@demo.com`) & Riley (`riley@demo.com`) - Monthly Premium
- **PREM02**: Cliff (`cliff@demo.com`) & Christi (`christi@demo.com`) - Monthly Premium
- **PREM03**: Keith (`keith@demo.com`) & Dawn (`dawn@demo.com`) - Yearly Premium
- **DREW01**: Drew (`drew@demo.com`) & Blake (`blake@demo.com`) - Monthly Premium
- **BRCHR1**: Brett (`brett@demo.com`) & Christina (`christina@demo.com`) - Monthly Premium, Long-Distance
- **DEMO05**: Avery (`avery@demo.com`) & Kaitlyn (`kaitlyn@demo.com`) - Monthly Premium, Long-Term Dating

**Trial Accounts (20 sparks each):**
- **DEMO01**: Alex (`alex@demo.com`) & Jordan (`jordan@demo.com`)
- **DEMO02**: Taylor (`taylor@demo.com`) & Morgan (`morgan@demo.com`)
- **DEMO03**: Casey (`casey@demo.com`) & Jamie (`jamie@demo.com`)
- **DEMO04**: Quinn (`quinn@demo.com`) & Sage (`sage@demo.com`)

## External Dependencies

-   **UI Component Libraries**: Radix UI, shadcn/ui, Lucide React, cmdk, Embla Carousel, Vaul.
-   **Form & Validation**: React Hook Form, Zod, @hookform/resolvers.
-   **Styling**: Tailwind CSS, class-variance-authority, tailwind-merge, clsx.
-   **Data Fetching**: TanStack Query (v5) and @tanstack/react-query.
-   **Database & ORM**: Drizzle ORM, Drizzle Zod, @neondatabase/serverless, drizzle-kit.
-   **Payment & Subscription**: Stripe Integration.
-   **Email Service**: Resend.
-   **Push Notifications**: web-push, ws.
-   **Digital Signatures**: react-signature-canvas.
-   **SMS Messaging**: Twilio.
-   **Video Calling**: Daily.co (@daily-co/daily-react, @daily-co/daily-js).
-   **AI Integration**: OpenAI via Replit AI Integrations.