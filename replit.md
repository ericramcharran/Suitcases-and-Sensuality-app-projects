# Multi-App Project

## Overview

This Replit project hosts two distinct applications: "The Executive Society" and "Spark It!".

**The Executive Society** is a premium BDSM dating platform designed for professionals seeking authentic power exchange relationships. It focuses on trust, safety, consent, and sophisticated user matching, aiming to be a leading platform for discerning individuals in serious power exchange dynamics.

**Spark It!** is a couples activity app created to alleviate decision fatigue. It features a unique simultaneous button press mechanic for instant activity suggestions. The app operates on a freemium model with premium subscriptions, offering activity suggestions, trivia challenges, and a competitive scoreboard.

## Recent Fixes (November 5, 2025)

**Data Freshness Fix**: Resolved critical caching issue where premium accounts displayed incorrect trial subscription data. 
- Updated `queryClient.ts`: Changed `staleTime` from `Infinity` to `0` to ensure fresh data fetching
- Updated `SparkButton.tsx`: Added `gcTime: 0` and `staleTime: 0` to couple data query for real-time subscription updates
- Updated `sw.js`: Service worker now only caches images/icons/manifest, never HTML/JS/CSS/API responses
- Updated `routes.ts`: Added `no-cache` headers to couple data endpoint
- Removed `TooltipProvider` from `App.tsx` temporarily (was causing React hook errors after cache clearing)

**Push/Email Notifications Default Enabled**: Changed notification preferences to be enabled by default for new signups.
- Updated `schema.ts`: Changed `notificationMethod` default from `'sms'` to `'all'` (enables push, email, and SMS)
- Updated `routes.ts`: Automatically create reminder preferences when couples sign up with all notification methods enabled
- Admin endpoint available at `/admin/enable-push-notifications` to enable notifications for existing production accounts

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
-   **Spark It! Trivia System:** 225+ trivia questions across 10 categories. Head-to-head competition where both partners answer the same questions. Real-time WebSocket notifications for challenge acceptance and completion.
-   **Spark It! Video Calling:** Daily.co integration for embedded video calls.
-   **Spark It! Daily Reminders:** Automated daily reminder system with 45 seeded content entries (questions, activities, conversation starters). Couples configure reminder time and delivery method (SMS, email, push, or all). Scheduler runs every minute, sends once per day at configured time, tracks delivery success to prevent duplicates. SMS via Twilio fully implemented; email and push are placeholder stubs for future implementation.

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