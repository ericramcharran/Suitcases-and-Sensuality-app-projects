# The Executive Society

## Overview

The Executive Society is a premium BDSM dating platform designed for professionals, focusing on authentic power exchange relationships. It prioritizes trust, safety, consent, and sophisticated user matching through detailed personality and relationship assessments. The platform offers role-specific features for Dominant and submissive users, including escrow account verification for Dominants. The project aims to become the leading platform for discerning individuals seeking serious power exchange dynamics, targeting a niche yet growing market segment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with React 18+ and TypeScript, using Vite for bundling and Wouter for routing. It incorporates a design system leveraging shadcn/ui and Radix UI, styled with Tailwind CSS for dark/light mode theming. The application is a mobile-first Progressive Web App (PWA) with extensive mobile and touch optimizations. State management relies on TanStack Query for server state. The UI/UX features a professional, clean aesthetic with a rose accent color and Inter typography, inspired by premium dating apps.

The marketing site is a multi-page application with dedicated sections for Home, About, Features, How It Works, Pricing, and FAQ. It includes consistent headers and footers for a cohesive user experience.

**Critical PWA Configuration:**
- `client/public/manifest.json`: `"start_url": "/splash"`
- `client/src/pages/Splash.tsx`: Must redirect to `"/landing"` (not "/home") after splash animation.

**Favicon Requirements:**
- Favicons (`favicon-16x16.png`, `favicon-32x32.png`) must be a 1:1 square aspect ratio, cropped from the provided logo.

**Mobile Responsiveness:**
- Avoid hardcoded pixel dimensions for images; always use responsive Tailwind CSS classes (e.g., `w-full max-w-md`, `w-72 h-auto`).

### Backend

The backend is developed with Express.js and TypeScript, following a RESTful API design. It uses an in-memory storage abstraction (`MemStorage`) but is designed for migration to PostgreSQL with Drizzle ORM. Zod is employed for request/response schema validation.

### Database Schema (Drizzle ORM)

The `users` table stores comprehensive user data including identity, D/s role, profile name, verification status (with `escrowBalance` for Dominants), detailed personality and relationship assessment results, legal agreement records with digital signatures, and subscription plan details.

### User Onboarding

The onboarding process is multi-step, covering age and ID verification, acceptance of legal policies (Terms, Consent, Privacy, Guidelines) with digital signatures, and a background check. Users then proceed to role-specific flows for subscription selection, profile creation, and personality/relationship assessments. Dominants also undergo escrow/financial verification. A required checkbox on the `/landing` page ensures users are 21+ and agree to terms before accessing the app content.

### Matching & Discovery

The platform features a sophisticated compatibility algorithm based on:
- **Personality Assessment**: Emotional Intelligence, Ethics, Sensuality, Stability, D/s Dynamics.
- **Relationship Style & Role Compatibility**.
- **Important Traits**: User-selected values.
- **Kink Compatibility**: Integration of external BDSM test results for enhanced scoring.

The discovery interface is a Tinder-style card swiping system displaying compatibility percentages with detailed breakdowns. Users can filter matches by various criteria including age, compatibility score, role, and lifestyle preferences.

### Core Features

-   **Digital Signatures**: For legal agreements using `react-signature-canvas`.
-   **Email Notifications**: Transactional emails via Resend, including mutual match notifications.
-   **Push Notifications**: Web Push Notifications using VAPID and a service worker.
-   **Real-Time Messaging**: Complete system with mutual match requirement, WebSocket-enabled chat, read receipts, and unread counts.
-   **Device Permissions**: A `Permissions Manager` utility for camera, location, notification, and gallery access.
-   **Travel Mode**: Allows users to set temporary locations for matching in other cities.
-   **Verified & Fully Funded Badge**: Premium verification for Dominants with escrow/mutual fund verification.
-   **Profile Names**: Custom, privacy-focused profile names (max 20 characters) displayed throughout the app.

### Future Roadmap: Native Standalone Apps

The project plans to transition from a PWA to true native iOS and Android applications. This can be achieved either by wrapping the existing web app in a WebView (faster launch) or by building native UIs (recommended long-term for optimal performance and platform-specific features). Native apps will adapt existing features like push notifications and payments to platform-specific APIs and will implement native onboarding screens for terms agreement.

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