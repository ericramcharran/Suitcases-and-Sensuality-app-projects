# The Executive Society

## Overview

The Executive Society is a premium BDSM dating platform for professionals, focusing on authentic power exchange relationships. It emphasizes trust, safety, consent, and sophisticated matching through detailed personality and relationship assessments. The platform provides role-specific features for Dominant and submissive users, including escrow account verification for Dominants. Its business vision is to become the leading platform for discerning individuals seeking serious power exchange dynamics, offering significant market potential in a niche yet growing segment.

## User Preferences

Preferred communication style: Simple, everyday language.

## Critical Configuration Requirements

**⚠️ THESE MUST BE CORRECT - DO NOT BREAK THESE AGAIN:**

### PWA Manifest Configuration
- **File:** `client/public/manifest.json`
- **REQUIRED:** `"start_url": "/splash"` (shows animated splash screen, then redirects to app)
- **File:** `client/src/pages/Splash.tsx`
- **REQUIRED:** Must redirect to `"/landing"` (NOT "/home" which is marketing)
- **Issue History:** User had to request this fix multiple times. The PWA was opening to the marketing home page instead of the app login/interface.
- **Why:** Route "/splash" shows animated video logo (4 seconds), then redirects to "/landing" (app login) not "/home" (marketing site).

### Favicon Requirements
- **Files:** `client/public/favicon-16x16.png`, `client/public/favicon-32x32.png`
- **REQUIRED:** Must be 1:1 square aspect ratio (crop the user's logo to square using ImageMagick)
- **Command:** `convert "attached_assets/logo transparent no name_1760959575281.png" -gravity center -crop 1:1 +repage client/public/favicon-32x32.png`
- **Issue History:** Generated AI images instead of using actual logo, causing repeated requests.
- **Why:** Non-square favicons appear squeezed in browser tabs.

### Mobile Responsiveness
- **NEVER use hardcoded pixel dimensions** (like `w-[380px]` or `h-[240px]`) for logos or images
- **ALWAYS use responsive classes** (like `w-full max-w-md`, `w-72 h-auto`)
- **Issue History:** Hardcoded dimensions broke mobile layouts across Splash, Landing, Home, Download pages
- **Critical:** Test mobile responsiveness before claiming fixes are complete

## System Architecture

### Frontend Architecture

The frontend uses React 18+ with TypeScript, Vite for building, and Wouter for routing. It features a design system based on shadcn/ui and Radix UI, styled with Tailwind CSS for dark/light mode theming. The application is designed as a mobile-first Progressive Web App (PWA) with extensive mobile and touch optimizations for both Android and iOS. State management primarily uses TanStack Query for server state, avoiding a global state library. UI/UX is inspired by premium dating apps, prioritizing a professional, clean aesthetic with a rose accent color and Inter typography.

**Marketing Site Architecture**: The marketing site uses a multi-page structure instead of a single scrolling page:
- **Home (/)**: Hero page with Feeld-style looping video background featuring The Executive Society logo, tagline, and CTA buttons. Uses lazy-loaded video transitions with gradient fallback.
- **About (/about)**: Information about The Executive Society platform and mission
- **Features (/features)**: Card-based showcase of platform features
- **How It Works (/how-it-works)**: Step-by-step onboarding process explanation
- **Pricing (/pricing)**: Four subscription tiers (submissive, Dominant, Switch, Fully Funded) with special introductory offers
- **FAQ (/faq)**: Accordion-style frequently asked questions

All marketing pages share consistent MarketingHeader (with hamburger menu navigation) and MarketingFooter components for a cohesive user experience. The marketing site is designed to attract and educate potential users before they enter the application flow at "/landing".

### Backend Architecture

The backend is built with Express.js and TypeScript, designed with a RESTful API structure. It currently uses an in-memory storage abstraction (`MemStorage`) but is configured to migrate to PostgreSQL using Drizzle ORM. The Drizzle schema defines a comprehensive user model, including identity, verification status, assessment results, legal agreement details with digital signatures, and subscription information. Zod is used for request/response schema validation.

### Database Schema (Drizzle ORM)

The `users` table captures identity, role (Dominant/submissive/Switch), profile name (max 20 characters for display), verification status (including `escrowBalance` for Dominants), detailed personality and relationship assessment results, and records for agreed-upon terms, consent, privacy, and guidelines, each with a digital signature and timestamp. It also includes subscription plan details and creation timestamps.

### User Onboarding Flow

The onboarding is a multi-step process for all users, including age and ID verification, agreement to various legal policies (Terms, Consent, Privacy, Guidelines) with digital signatures, and a background check. Users then proceed to role-specific flows involving subscription plan selection, profile detailing, personality assessment, relationship assessment, and important traits selection (which is used in the compatibility algorithm). Dominants also complete escrow/financial verification after subscription selection.

### Matching & Discovery System

The platform features a comprehensive compatibility algorithm based on multiple factors:
- **Personality Assessment** (5 dimensions): Emotional Intelligence, Ethics, Sensuality, Stability, D/s Dynamics
- **Relationship Style**: Compatibility based on relationship preferences and commitment levels
- **Role Compatibility**: Dominant/submissive/Switch matching with complementary pairing bonuses
- **Important Traits**: User-selected values and characteristics weighted heavily in scoring
- **Kink Compatibility** (NEW): BDSM test results integration providing up to 30 points based on complementary kink preferences and shared interests

The discovery interface is a Tinder-style card swiping system displaying compatibility percentages with detailed hover tooltips explaining the score breakdown. Users can filter potential matches by age range, compatibility score, role, experience level, relationship preferences, body type, drinking/smoking habits, and fitness level.

**BDSM Test Integration**: Users can upload screenshots of external BDSM test results (e.g., from BDSMtest.org) during onboarding. The system captures kink preferences and percentages, then uses complementary pairing logic (e.g., sadist/masochist, rigger/rope bottom) to calculate enhanced compatibility scores.

### Core Features

-   **Digital Signatures**: Legal agreement tracking using `react-signature-canvas`.
-   **Email Notifications**: Resend integration for transactional emails, including mutual match notifications with detailed user profiles.
-   **Push Notifications**: Web Push Notifications using VAPID authentication and a service worker, with a backend API for managing subscriptions and sending notifications.
-   **Real-Time Messaging**: Complete messaging system with conversation list showing mutual matches, individual chat pages with real-time delivery via WebSocket, message read receipts, unread counts, and timestamps. Users can only message mutual matches.
-   **Device Permissions**: A centralized utility (`Permissions Manager`) for managing camera, location, notification, and gallery access, with a user-friendly UI for managing permissions.
-   **Travel Mode**: Allows users to set a temporary location to match in other cities, accessible from the user profile and managed through a dedicated travel mode page.
-   **Verified & Fully Funded Badge**: Premium verification system for Dominants with escrow/mutual fund verification (`escrowVerified` and `fullyFunded` database fields). Gold gradient badge (amber-to-yellow) displays at top-left of profile images in Discover, replacing standard blue verification badge. Includes premium status card on profile pages with detailed verification explanation.
-   **Profile Names**: Users can set a custom profile name (max 20 characters) separate from their real name for privacy. Profile names are displayed throughout the app in Discover, Messages, Chat, and Profile pages. Editable via dedicated Profile Name page accessible from the Profile.

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

## Testing Guide

### Testing Chat Functionality

The chat feature requires mutual matches to function. Here's how to test it:

**Test Accounts Available:**
- **Marcus Sterling** (Dominant - Verified & Fully Funded)
  - Email: dom_funded@test.com
  - Password: password123
  - Profile Name: MarcusS
  - User ID: 38ad30cf-f254-4ebb-ab47-c2260e2a2faa

- **Sarah** (submissive - Verified)
  - Email: sarah@test.com
  - Password: password123
  - Profile Name: Sarah_T
  - User ID: d939ab1d-b9dc-4d93-a699-a4192f9a4086

**Quick Login (No Password Required):**
- Navigate to `/user-select` to instantly login as any test user

**Steps to Test Chat:**

1. **Login as Marcus**: Navigate to `/user-select` and select Marcus Sterling
2. **Navigate to Messages**: Click the Messages icon in the bottom navigation
3. **View Conversation**: You should see a conversation with Sarah (they have a mutual match)
4. **Open Chat**: Click on Sarah's conversation to open the chat
5. **Send Messages**: Type a message and press Enter or click Send
6. **Test Real-Time**: Open a second browser window/tab, login as Sarah, and both users can chat in real-time via WebSocket

**How Mutual Matches Work:**
- Users can only message each other if both have liked each other in Discover
- The database has a `matches` table with `mutualMatch` boolean flag
- When both users like each other, `mutualMatch` is set to `true` for both match records
- The Messages page shows all mutual matches with their latest message
- Chat requires a valid `matchId` from a mutual match

**Recent Optimizations:**
- Optimized mark-as-read logic to avoid redundant API calls
- Added Error Boundary to gracefully handle rendering errors
- Fixed TypeScript type errors in storage operations