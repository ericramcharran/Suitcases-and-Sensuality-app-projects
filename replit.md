# The Executive Society

## Overview

The Executive Society is a premium BDSM dating platform for professionals, focusing on authentic power exchange relationships. It emphasizes trust, safety, consent, and sophisticated matching through detailed personality and relationship assessments. The platform provides role-specific features for Dominant and Submissive users, including escrow account verification for Dominants. Its business vision is to become the leading platform for discerning individuals seeking serious power exchange dynamics, offering significant market potential in a niche yet growing segment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18+ with TypeScript, Vite for building, and Wouter for routing. It features a design system based on shadcn/ui and Radix UI, styled with Tailwind CSS for dark/light mode theming. The application is designed as a mobile-first Progressive Web App (PWA) with extensive mobile and touch optimizations for both Android and iOS. State management primarily uses TanStack Query for server state, avoiding a global state library. UI/UX is inspired by premium dating apps, prioritizing a professional, clean aesthetic with a rose accent color and Inter typography.

### Backend Architecture

The backend is built with Express.js and TypeScript, designed with a RESTful API structure. It currently uses an in-memory storage abstraction (`MemStorage`) but is configured to migrate to PostgreSQL using Drizzle ORM. The Drizzle schema defines a comprehensive user model, including identity, verification status, assessment results, legal agreement details with digital signatures, and subscription information. Zod is used for request/response schema validation.

### Database Schema (Drizzle ORM)

The `users` table captures identity, role (Dominant/Submissive/Switch), verification status (including `escrowBalance` for Dominants), detailed personality and relationship assessment results, and records for agreed-upon terms, consent, privacy, and guidelines, each with a digital signature and timestamp. It also includes subscription plan details and creation timestamps.

### User Onboarding Flow

The onboarding is a multi-step process for all users, including age and ID verification, agreement to various legal policies (Terms, Consent, Privacy, Guidelines) with digital signatures, and a background check. Dominants and Submissives then proceed to role-specific flows involving subscription plan selection, profile detailing, personality and relationship assessments, and important trait selection. Dominants also complete escrow/financial verification.

### Matching & Discovery System

The platform features a compatibility algorithm based on 5-dimensional personality test results, relationship style preferences, role compatibility, and approximate location. The discovery interface is a Tinder-style card swiping system displaying compatibility percentages, verification status, role badges, and distance.

### Core Features

-   **Digital Signatures**: Legal agreement tracking using `react-signature-canvas`.
-   **Email Notifications**: Resend integration for transactional emails, including mutual match notifications with detailed user profiles.
-   **Push Notifications**: Web Push Notifications using VAPID authentication and a service worker, with a backend API for managing subscriptions and sending notifications.
-   **Real-Time Messaging**: WebSocket integration for in-app instant messaging and alerts, with per-user connections and a heartbeat mechanism.
-   **Device Permissions**: A centralized utility (`Permissions Manager`) for managing camera, location, notification, and gallery access, with a user-friendly UI for managing permissions.
-   **Travel Mode**: Allows users to set a temporary location to match in other cities, accessible from the user profile and managed through a dedicated travel mode page.
-   **Verified & Fully Funded Badge**: Premium verification system for Dominants with escrow/mutual fund verification (`escrowVerified` and `fullyFunded` database fields). Gold gradient badge (amber-to-yellow) displays at top-left of profile images in Discover, replacing standard blue verification badge. Includes premium status card on profile pages with detailed verification explanation.

## External Dependencies

-   **UI Component Libraries**: Radix UI (headless primitives), shadcn/ui (customizable components), Lucide React (icons), cmdk (command menu), Embla Carousel, Vaul (drawer).
-   **Form & Validation**: React Hook Form, Zod, @hookform/resolvers.
-   **Styling**: Tailwind CSS, class-variance-authority, tailwind-merge, clsx.
-   **Data Fetching**: TanStack Query (v5) and @tanstack/react-query.
-   **Database & ORM**: Drizzle ORM, Drizzle Zod, @neondatabase/serverless (Neon PostgreSQL driver), drizzle-kit.
-   **Development Tools**: Replit Plugins, Vite, TypeScript, ESBuild.
-   **Payment & Subscription**: Stripe Integration for tiered subscription payment processing.
-   **Email Service**: Resend for transactional emails.
-   **Push Notifications**: web-push (Node.js library) and ws (WebSocket library).
-   **Digital Signatures**: react-signature-canvas.