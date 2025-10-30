# Multi-App Project

## Overview

This Replit project contains two distinct applications: "The Executive Society" and "Spark It!".

**The Executive Society** is a premium BDSM dating platform for professionals, focusing on authentic power exchange relationships. It emphasizes trust, safety, consent, and sophisticated user matching through detailed assessments. The platform offers role-specific features, including escrow verification for Dominants, aiming to be the leading platform for discerning individuals in serious power exchange dynamics.

**Spark It!** is a couples activity app designed to combat decision fatigue. It offers a unique simultaneous button press mechanic where both partners press a button together to receive a single, instant activity suggestion. The business model is freemium (10 total sparks OR 7 days trial, whichever comes first) with premium subscriptions (Monthly: $6.99, Yearly: $59.99). Key features include activity suggestions, trivia challenges, and competitive scoreboard.

**Branding:** The official Spark It! logo is a vibrant lightning bolt with purple-to-red gradient background (`/sparkit-logo.png`), used throughout the app including landing page, PWA icons, and notifications.

**SEO Optimization (October 2025):**
- **Dynamic Meta Tags:** JavaScript-based dynamic SEO in `client/index.html` that updates title, description, keywords, Open Graph, Twitter Cards, and Schema.org based on route
- **Spark It! Keywords:** couples app, relationship app, date night ideas, activities for couples, decision fatigue, long distance relationship app, couple games, romantic date ideas, quality time together, instant activity suggestions, spontaneous date ideas
- **Executive Society Keywords:** BDSM dating, power exchange relationships, BDSM dating app, kink dating, fetish dating, Dom sub dating, Master slave dating, TPE relationships, D/s relationships, verified BDSM profiles, premium BDSM dating, safe BDSM dating, alternative lifestyle dating, consensual power dynamics, professional kinksters, exclusive BDSM dating
- **Search Discovery:** Both apps optimized for their target audiences with 30+ keywords each
- **Sitemap:** `client/public/sitemap.xml` includes both Executive Society and Spark It! public pages
- **Robots.txt:** `client/public/robots.txt` allows indexing of public pages for both apps, blocks all authenticated pages
- **Rich Results:** Separate Schema.org structured data for each app (MobileApplication type) with ratings, pricing, category
- **Social Sharing:** Dynamic Open Graph and Twitter Card tags ensure proper preview when shared on social media

## Project Navigation

**Development Mode Project Selector (Root URL: /)**
- The root URL displays a developer-friendly project selector
- Choose which app to work on: Executive Society or Spark It!
- Visual indicators show which project is active

**Project Pathways:**
1. **Executive Society** 
   - Entry point: `/landing` 
   - Routes: /login, /signup, /discover, /messages, /profile, etc.
   - Visual indicator: Rose badge with Heart icon in top-left corner (dev mode only)
   
2. **Spark It!**
   - Entry point: `/sparkit`
   - Routes: /spark, /sparkit/signup, /scoreboard, /sparkit/trivia/*, etc.
   - Visual indicator: Purple badge with Sparkles icon in top-left corner (dev mode only)

**Navigation Features:**
- Dev indicators appear only in development mode (not in production)
- Home button in each indicator returns to project selector
- Clear visual separation: Rose for Executive Society, Purple for Spark It!

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The project integrates both applications within a single Express/Vite server infrastructure while maintaining separate styling and branding.

### Frontend

Both applications utilize React 18+ with TypeScript, Vite for bundling, and Wouter for routing.
**The Executive Society** frontend uses a design system leveraging shadcn/ui and Radix UI, styled with Tailwind CSS for dark/light mode theming. It's built as a mobile-first Progressive Web App (PWA) with a professional, clean aesthetic, rose accent color, and Inter typography. It includes a multi-page marketing site.
**Spark It!** frontend uses a custom NEXUS design system scoped under `.nexus-app` with brand colors transitioning from purple royal to passion red gradients, ensuring styling isolation.

**Key UI/UX Decisions:**
- Mobile-first PWA design for The Executive Society.
- Responsive design principles; avoid hardcoded pixel dimensions.
- Professional, clean aesthetic with rose accents for The Executive Society.
- Vibrant, gradient-based branding for Spark It!.

**Technical Implementations:**
- State management relies on TanStack Query for server state.
- Backend developed with Express.js and TypeScript, designed with a RESTful API.
- Zod for request/response schema validation.
- PWA configuration (`manifest.json`, `start_url`).
- Favicon requirements (1:1 square aspect ratio).

**Feature Specifications:**
- **User Onboarding (The Executive Society):** Multi-step process including age/ID verification, legal agreement acceptance (Terms, Consent, Privacy, Guidelines) with digital signatures, background checks, email and phone verification, and role-specific flows (subscription, profile creation, personality/relationship assessments). Dominants undergo escrow/financial verification.
- **Matching & Discovery (The Executive Society):** Sophisticated compatibility algorithm based on personality, relationship style, important traits, and kink compatibility. Features a Tinder-style card swiping interface with filtering options.
- **Core Features (The Executive Society):** Email (Resend) & optional Phone (Twilio) verification, Digital Signatures, Email Notifications, Web Push Notifications, Real-Time Messaging (WebSocket-enabled chat), Device Permissions Manager, Travel Mode, Verified & Fully Funded Badge for Dominants, Custom Privacy-focused Profile Names.
- **Spark It! Features:** Simultaneous button press with SMS and browser push notification alerts (when one partner presses, the other receives both a text message if phone number is saved AND a browser push notification if enabled), activity reveal with rating, winner selection, competitive scoreboard, spark counter with freemium/premium tiers, localStorage persistence, in-app video calling for long-distance couples, partner name customization through Settings page, avatar selection and custom upload (premium-only), AI-powered location-based activity discovery, SMS text messaging to send activities to partner.
- **Spark It! Premium Subscription:** Stripe-powered subscription system with two tiers:
  - **Monthly Plan:** $6.99/month - Unlimited sparks, custom avatars, video calling access
  - **Yearly Plan:** $59.99/year - All monthly features at discounted rate
  - **Trial System:** New couples get 10 total sparks OR 7 days (whichever first); trial users do NOT receive premium features
  - **Premium Gating:** Avatar selection (80+ predefined Lucide icons across 12 categories: Romantic, Food & Drinks, Sports, Hobbies, Tech, Adventure, Entertainment, Nature, Travel, Animals, Symbols, Luxury) and custom uploads (via object storage) restricted to monthly/yearly subscribers with both client-side early returns and server-side 403 validation; secure validation prevents XSS (allows only "icon:*", "/objects/*", or HTTPS URLs)
  - **Subscription Flow:** SparkitPremium page with pricing cards → Stripe Checkout redirect → Payment processing → Plan upgrade
- **Spark It! Activity Database:** 253 activities across 19 categories with properties like duration, energy level, location, cost, spice level, and tips.
  - **In-Person Categories (110 activities):** Playful, Romantic, Connection, Silly, Creative, Adventure, Flirty Physical, Verbal Seduction, Teasing, Intimate Connection, Role Play, Boredom Buster
  - **Long-Distance Categories (50 activities):** Video Call, Async, Text Games, Romantic LDR, Creative LDR, Planning LDR - designed for couples who are apart, across different time zones, or maintaining connection remotely
  - **Boredom Buster Category (18 activities):** Quick, engaging activities (1-15 minutes) designed to pull couples away from doom scrolling and phone addiction. Features phone-free challenges, rapid-fire games, instant connection boosters, and awareness exercises.
  - **Polyamorous Category (75 activities):** Activities for ethical non-monogamy (ENM) and polyamorous relationships. Includes both G-rated (40) and PG-13 rated (35) activities. G-rated focus areas: group communication (10), one-on-one time management (8), communication exercises (7), personal growth (5), and household/nesting partner coordination (10). PG-13 focus areas: group intimacy (8), jealousy & compersion work (7), dyad intimate time (8), metamour connection (4), and spicy group dynamics (8). Addresses unique challenges like scheduling multiple partners, metamour bonding, jealousy processing, compersion practice, maintaining healthy polycules, physical intimacy in group contexts, and navigating new relationship energy.
- **Spark It! AI Activity Discovery (Feature Flag Controlled):** OpenAI GPT-4 Turbo powered location-based activity suggestions using Replit AI Integrations (no API key required, billed to Replit credits). Couples provide city/state during signup or update in Settings. AI generates personalized local activities based on location, preferences, and relationship type. Endpoint: GET `/api/sparkit/couples/:id/ai-activities`. 
  - **Enable/Disable:** Set environment variables `ENABLE_AI_ACTIVITIES=true` (backend) and `VITE_ENABLE_AI_ACTIVITIES=true` (frontend) in Secrets to activate the feature
  - **Default State:** Currently disabled by default to control when feature goes live
  - **Requirements:** Both environment variables must be set to `true` for the AI button to appear and API to respond
  - **When Disabled:** AI button is hidden from UI and API returns 503 "feature disabled" error
- **Spark It! Trivia System:** 225+ trivia questions across 10 categories for competitive engagement, with a sender-selected 5-question challenge.
- **Spark It! Video Calling:** Daily.co integration for embedded video calls during LDR activities. Features include camera/mic toggle, pop-out window option, and automatic room cleanup. Premium feature to offset bandwidth costs.

**System Design Choices:**
- Both applications share the same Express/Vite server infrastructure.
- PostgreSQL database with Drizzle ORM for all persistent data (`sparkit_couples`, `sparkit_activity_ratings`, `sparkit_activity_results`, `sparkit_trivia_categories`, `sparkit_trivia_questions`, `sparkit_trivia_contests`, `sparkit_trivia_answers`, `sparkit_video_sessions`, `users` table for Executive Society, `push_subscriptions` shared by both apps).
- In-memory storage abstraction (`MemStorage`) for backend, designed for PostgreSQL migration.
- `react-signature-canvas` for digital signatures.
- VAPID and service worker for web push notifications (shared by both Executive Society and Spark It).
- `push_subscriptions` table supports both Executive Society users (using user IDs) and Spark It couples (using composite IDs: `sparkit-{coupleId}-{partnerRole}`) - no foreign key constraint to allow flexibility.
- Daily.co integration for video calling with @daily-co/daily-react SDK.

**Spark It! Authentication & State Management:**
- **Session-based authentication:** Express sessions with PostgreSQL store (via `connect-pg-simple`)
- **Session persistence:** 30-day cookie maxAge keeps users logged in until explicit logout
- **Login entry points:** 
  - Direct URL: `/sparkit/login`
  - Landing page: "Already have an account? Login" links on NexusLanding (hero section & final CTA)
- **localStorage pattern:** `sparkitCoupleId` stored after successful login/signup/join to enable client-side couple context
  - **Set on:** Login success, signup success, join success
  - **Clear on:** Logout, couple not found errors
  - **Why:** Activity pages (SparkActivity, Scoreboard, etc.) need couple ID to fetch correct data before auth session loads
- **API Response Shapes (Critical for frontend compatibility):**
  - `POST /api/sparkit/auth/login` → `{ coupleId: string, partnerRole: string }`
  - `POST /api/sparkit/couples` (signup) → `{ id: string, partner1Name: string, ... }`
  - `POST /api/sparkit/couples/join` → `{ id: string, partner1Name: string, partner2Name: string, ... }`
  - `GET /api/sparkit/auth/me` → `{ coupleId: string, partnerRole: string }` (session check)
- **Known Issue (October 2025):** If session expires but localStorage persists, pages will show harmless fetch failures until user logs back in. Pages already redirect to login when no session detected.

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
-   **SMS Messaging**: Twilio for SMS text messaging to send activity suggestions to partner.
-   **Video Calling**: Daily.co (@daily-co/daily-react, @daily-co/daily-js).
-   **AI Integration**: OpenAI via Replit AI Integrations (blueprint:javascript_openai_ai_integrations).