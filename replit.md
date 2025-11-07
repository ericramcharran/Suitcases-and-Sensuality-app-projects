# Multi-App Project

## Overview

This Replit project integrates two distinct applications: "The Executive Society" and "Spark It!".

**The Executive Society** is a premium BDSM dating platform for professionals seeking authentic power exchange relationships, emphasizing trust, safety, consent, and sophisticated matching. It aims to be a leading platform for discerning individuals in serious power exchange dynamics.

**Spark It!** is a couples activity app designed to alleviate decision fatigue. It features a unique simultaneous button press mechanic for instant activity suggestions and operates on a freemium model with premium subscriptions, offering activity suggestions, trivia challenges, and a competitive scoreboard.

## User Preferences

Preferred communication style: Simple, everyday language.

**Publishing Notifications:** Always notify the user whenever code changes require republishing to production.

## System Architecture

The project hosts both applications within a single Express/Vite server infrastructure, maintaining separate styling and branding.

### Frontend

Both applications utilize React 18+ with TypeScript, Vite for bundling, and Wouter for routing.

**The Executive Society** features a mobile-first PWA design, a shadcn/ui and Radix UI design system, and Tailwind CSS with dark/light mode theming and a rose accent color.

**Spark It!** employs a custom NEXUS design system with purple-to-red gradient branding, ensuring styling isolation. Key UI/UX decisions include mobile-first PWA design, responsive layouts, and professional aesthetics for The Executive Society, contrasted with vibrant, gradient-based branding for Spark It!.

### Technical Implementations

-   State management is handled by TanStack Query.
-   The backend is developed with Express.js and TypeScript, exposing a RESTful API.
-   Zod is used for request/response schema validation.
-   PWA configuration includes `manifest.json` and `start_url`.
-   Favicons are required to be 1:1 square aspect ratio.

### Feature Specifications

-   **The Executive Society:** Multi-step user onboarding (age/ID verification, legal agreements, background checks, email/phone verification, Dominant escrow verification), sophisticated compatibility matching with a Tinder-style interface, email & optional phone verification, digital signatures, email & web push notifications, real-time messaging (WebSocket), device permissions manager, travel mode, verified & fully funded badges for Dominants, and custom privacy-focused profile names.
-   **Spark It!:** Simultaneous button press for activity suggestions, SMS and browser push notifications, activity reveal with rating, winner selection, competitive scoreboard, spark counter (freemium/premium), localStorage persistence, in-app video calling, partner name customization, avatar selection/custom upload (premium-only), AI-powered location-based activity discovery, and SMS text messaging for activities.
    -   **Premium Subscription:** Stripe-powered monthly/yearly plans offering unlimited sparks, custom avatars, and video calling, with a trial system providing 10 sparks or 7 days.
    -   **Activity Database:** 253 activities across 19 categories.
    -   **AI Activity Discovery:** OpenAI GPT-4 Turbo powered, controlled by a feature flag.
    -   **Trivia System:** 325+ questions across 10 categories for head-to-head competition, with real-time WebSocket notifications.
    -   **Video Calling:** Integrated via Daily.co.
    -   **Daily Reminders:** Automated daily reminder system with 45 seeded content entries. Couples configure time and delivery method (SMS, email, push, or all) via settings. Scheduler runs every minute.

### System Design Choices

-   Shared Express/Vite server infrastructure.
-   PostgreSQL database with Drizzle ORM for all persistent data.
-   In-memory storage abstraction (`MemStorage`) for the backend.
-   `react-signature-canvas` for digital signatures.
-   VAPID and service worker for web push notifications (shared).
-   `push_subscriptions` table supports both applications.
-   WebSocket infrastructure for real-time updates (spark button synchronization, trivia notifications).
-   Daily.co integration for video calling.
-   Session-based authentication for Spark It! with PostgreSQL store and 30-day cookie persistence.
-   `localStorage` for `sparkitCoupleId` for client-side couple context.
-   Trivia challenges use WebSocket with polling fallback for real-time completion notifications.
-   Daily reminder scheduler runs automatically on server startup.
-   Admin announcement system allows broadcasting push notifications to Spark It! users (accessible at `/sparkit/admin/announce`).

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