# Multi-App Project

## Overview

This Replit project contains two distinct applications: "The Executive Society" and "Spark It!".

**The Executive Society** is a premium BDSM dating platform for professionals, focusing on authentic power exchange relationships. It emphasizes trust, safety, consent, and sophisticated user matching through detailed assessments. The platform offers role-specific features, including escrow verification for Dominants, aiming to be the leading platform for discerning individuals in serious power exchange dynamics.

**Spark It!** is a couples activity app designed to combat decision fatigue. It offers a unique simultaneous button press mechanic where both partners press a button together to receive a single, instant activity suggestion. The business model is freemium (10 total sparks OR 7 days trial, whichever comes first) with premium subscriptions (Monthly: $6.99, Yearly: $59.99). Key features include activity suggestions, trivia challenges, and competitive scoreboard.

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
- **Spark It! Features:** Simultaneous button press, activity reveal with rating, winner selection, competitive scoreboard, daily spark counter with freemium/premium tiers, localStorage persistence.
- **Spark It! Activity Database:** 120 activities across 17 categories with properties like duration, energy level, location, cost, spice level, and tips.
  - **In-Person Categories (70 activities):** Playful, Romantic, Connection, Silly, Creative, Adventure, Flirty Physical, Verbal Seduction, Teasing, Intimate Connection, Role Play
  - **Long-Distance Categories (50 activities):** Video Call, Async, Text Games, Romantic LDR, Creative LDR, Planning LDR - designed for couples who are apart, across different time zones, or maintaining connection remotely
- **Spark It! Trivia System:** 225+ trivia questions across 10 categories for competitive engagement, with a sender-selected 5-question challenge.

**System Design Choices:**
- Both applications share the same Express/Vite server infrastructure.
- PostgreSQL database with Drizzle ORM for all persistent data (`sparkit_couples`, `sparkit_activity_ratings`, `sparkit_activity_results`, `sparkit_trivia_categories`, `sparkit_trivia_questions`, `sparkit_trivia_contests`, `sparkit_trivia_answers`, `users` table for Executive Society).
- In-memory storage abstraction (`MemStorage`) for backend, designed for PostgreSQL migration.
- `react-signature-canvas` for digital signatures.
- VAPID and service worker for web push notifications.

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
-   **SMS Verification**: Twilio (pending credentials for phone verification).