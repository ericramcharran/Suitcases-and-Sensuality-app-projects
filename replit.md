# The Executive Society

## Overview

The Executive Society is a premium BDSM dating platform designed for professionals seeking authentic power exchange relationships. The application emphasizes trust, safety, consent, and sophisticated matching through comprehensive personality and relationship assessments. The platform caters to both Dominant and Submissive users with role-specific features including escrow account verification for Dominants.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (no React Router dependency)
- Design system based on shadcn/ui with Radix UI primitives
- Tailwind CSS with custom design tokens for dark/light mode theming

**Mobile App Configuration**
- Progressive Web App (PWA) with manifest.json for Android
- iOS Web App meta tags for standalone mode (no browser chrome)
- Safe area support for iPhone notches and home indicators
- Theme colors configured for both iOS and Android
- Viewport optimized with viewport-fit=cover
- Touch-optimized with 44px minimum touch targets
- Smooth scrolling and overscroll prevention
- Platform-specific app icons and splash screens configured

**State Management**
- TanStack Query (React Query) for server state management and caching
- Session storage for temporary user data during onboarding flow
- No global state library - relies on React Query and component state

**UI/UX Design Principles**
- Reference-based design inspired by premium dating platforms (Hinge, Match, The League)
- Dark mode as primary theme with sophisticated rose accent color (346 77% 50%)
- Inter font family for professional, clean typography
- Mobile-first responsive design with maximum 768px mobile breakpoint
- Component-driven architecture using shadcn/ui patterns

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for API routes
- In-memory storage abstraction (MemStorage) with interface for future database migration
- Session-based approach currently using sessionStorage client-side
- RESTful API design with `/api/*` prefix

**Data Layer**
- Drizzle ORM configured for PostgreSQL (schema defined, database not yet connected)
- Schema includes comprehensive user model with personality/relationship test results
- Prepared for migration from in-memory to PostgreSQL database
- Database configuration in `drizzle.config.ts` ready for connection

**API Structure**
- `POST /api/users` - Create new user profile
- `GET /api/users/:id` - Retrieve user by ID
- `PATCH /api/users/:id` - Update user profile
- Zod validation for request/response schemas
- Error handling middleware with standardized JSON responses

### Database Schema (Drizzle ORM)

**Users Table**
- Identity: id (UUID), name, role (Dominant/Submissive/Switch)
- Verification: verified flag, escrowBalance for Dominants
- Assessments: personalityType, relationshipStyle, personality/relationship answers (JSONB)
- Legal: agreedTerms, agreedConsent, agreedPrivacy, agreedGuidelines flags with digital signatures
  - Each agreement has signature (base64 PNG) and signedDate timestamp fields
  - termsSignature/termsSignedDate, consentSignature/consentSignedDate, privacySignature/privacySignedDate, guidelinesSignature/guidelinesSignedDate
- Subscription: plan field for tiered access, stripeCustomerId, stripeSubscriptionId
- Timestamps: createdAt

### User Onboarding Flow

**Multi-Step Journey (Shared)**
1. Landing page introduction
2. Age verification (21+ requirement with DOB and ID upload)
3. ID verification processing (5-step realistic flow)
4. Terms of Service agreement (scroll-to-read required)
5. Consent framework agreement (scroll-to-read required)
6. Privacy policy agreement (scroll-to-read required)
7. Community guidelines agreement (scroll-to-read required)
8. Background check (7-step verification with FCRA compliance)

**Dominant/Domme/Master Flow**
9. Subscription plan selection (premium tiers with Stripe payment)
10. Payment processing (demo or real Stripe checkout)
11. Basic signup (name, role selection)
12. Profile details (13 fields: physical attributes, location, lifestyle preferences)
13. Personality assessment (20 questions)
14. Relationship assessment (20 questions)
15. Important traits selection
16. Escrow/financial verification setup (Escrow.com or FinFitLife.com)
17. Discover/matching interface

**Submissive/Switch Flow**
9. Subscription plan selection (affordable tiers with free trial option)
10. Payment processing (demo or real Stripe checkout)
11. Basic signup (name, role selection)
12. Profile details (13 fields: physical attributes, location, lifestyle preferences)
13. Personality assessment (20 questions)
14. Relationship assessment (20 questions)
15. Important traits selection
16. Discover/matching interface

### Matching & Discovery System

**Compatibility Algorithm Foundation**
- Personality test results across 5 dimensions
- Relationship style preferences
- Role compatibility (Dom/Sub/Switch)
- Percentage-based compatibility scoring
- Location-based distance calculation (approximate only, privacy-focused)

**Discovery Interface**
- Tinder-style card swiping interface
- Profile cards show: compatibility percentage, verification status, role badge, distance
- User interactions tracked for refinement

## External Dependencies

### UI Component Libraries
- **Radix UI** - Headless UI primitives for accessibility (20+ components: Dialog, Dropdown, Select, etc.)
- **shadcn/ui** - Pre-built component library with customizable design tokens
- **Lucide React** - Icon system
- **cmdk** - Command menu component
- **Embla Carousel** - Carousel/slider functionality
- **Vaul** - Drawer component

### Form & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation (shared between client/server)
- **@hookform/resolvers** - Zod integration with React Hook Form

### Styling & Theming
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Conditional class merging
- **clsx** - Class name utility

### Data Fetching & State
- **TanStack Query v5** - Server state management, caching, and data synchronization
- **@tanstack/react-query** - React-specific bindings

### Database & ORM
- **Drizzle ORM** - TypeScript ORM for PostgreSQL
- **Drizzle Zod** - Zod schema generation from Drizzle tables
- **@neondatabase/serverless** - Neon serverless PostgreSQL driver
- **drizzle-kit** - Migration and schema management CLI

### Development Tools
- **Replit Plugins** - Development tooling (cartographer, dev banner, runtime error overlay)
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety across full stack
- **ESBuild** - Production build bundler

### Payment & Subscription System
- **Stripe Integration** - Full subscription payment processing with tiered pricing
- **Digital Signatures** - react-signature-canvas for legal agreement tracking
- **Testing Features for Development**:
  - Demo Payment Page (`/payment-demo`) - Simulates payment without real Stripe checkout
  - "Skip Payment (Testing Mode)" button on subscription pages - Bypasses payment flow entirely
  - Both testing methods redirect to appropriate next step (Dominants to /escrow, Submissives to /subscription-success)
- **Subscription Tiers** (Dominant/Domme/Master):
  - Monthly: $249/mo
  - 3-Month: $229/mo (save 8%)
  - 6-Month: $199/mo (save 20%)
  - 1-Year: $149/mo (save 40%)
  - 5-Year: $119/mo (save 52%)
- **Subscription Tiers** (Submissive/Switch):
  - Monthly: $25/mo
  - 3-Month: $23/mo
  - 6-Month: $20/mo
  - 1-Year: $18/mo
  - 5-Year: $15/mo
- **Payment Flow**: Subscription selection → Stripe checkout → Role-based redirect (Dominants to escrow, others to success page)

### Email Notification System
- **Resend Integration** - Transactional email service for match notifications
- **Match Notifications** - Automated emails sent when mutual matches occur
  - Includes complete user profiles for both matched users
  - Displays personality assessment results (type, scores, answers)
  - Displays relationship assessment results (style, scores, answers)
  - Sent to admin email (ADMIN_EMAIL environment variable)
  - Graceful error handling - match creation succeeds even if email fails
- **Email Template** - Professional HTML email with brand colors and collapsible sections
- **Environment Variables Required**:
  - `RESEND_API_KEY` - API key from resend.com
  - `ADMIN_EMAIL` - Email address to receive match notifications

### Push Notification & Real-Time Messaging System
- **Web Push Notifications** - Browser push notifications using VAPID authentication
  - Service worker (`client/public/sw.js`) handles push events and notification clicks
  - Database table `push_subscriptions` stores user push endpoints with encryption keys
  - Graceful degradation - app functions normally when push notifications unavailable
  - Automatic subscription cleanup for invalid/expired endpoints
- **WebSocket Real-Time Notifications** - In-app instant messaging and alerts
  - WebSocket server integrated with Express HTTP server
  - Per-user WebSocket connections with automatic reconnection logic
  - Heartbeat mechanism (30s intervals) to maintain connections
  - Connection tracking by user ID for targeted message delivery
- **Notification Manager** - Frontend singleton class (`client/src/lib/notifications.ts`)
  - Handles service worker registration and push subscription lifecycle
  - Manages WebSocket connections with exponential backoff reconnection
  - Event-based message routing with type handlers
  - Utility functions for sending push and WebSocket notifications
- **Backend API Routes**:
  - `GET /api/push/vapid-public-key` - Retrieve VAPID public key for push subscription
  - `POST /api/push/subscribe` - Save push subscription with welcome notification
  - `POST /api/push/unsubscribe` - Remove push subscription
  - `POST /api/push/send` - Send push notification to specific user (all devices)
  - `POST /api/ws/send` - Send WebSocket message to connected user
- **Database Schema**:
  - `push_subscriptions` table with userId, endpoint, p256dh key, auth key
  - Foreign key relationship to users table
  - Unique constraint on endpoint to prevent duplicate subscriptions
- **Environment Variables Required**:
  - `VAPID_PUBLIC_KEY` - VAPID public key for web push (base64 URL-safe format)
  - `VAPID_PRIVATE_KEY` - VAPID private key for web push authentication
  - `VAPID_SUBJECT` - VAPID subject (mailto: or https: URL)
- **Dependencies**:
  - `web-push` - Node.js library for sending web push notifications
  - `ws` - WebSocket server and client library
- **Usage Example**:
  ```typescript
  // Initialize notifications for logged-in user
  await notificationManager.initialize(userId);
  
  // Subscribe to push notifications
  await notificationManager.subscribeToPush(userId);
  
  // Listen for WebSocket messages
  notificationManager.on('new_match', (data) => {
    console.log('New match:', data);
  });
  
  // Send push notification to user
  await sendPushNotification({
    userId: targetUserId,
    title: 'New Match!',
    body: 'You have a new mutual match',
    url: '/matches'
  });
  ```

### Device Permissions System
- **Permissions Manager** - Centralized utility class for managing device permissions (`client/src/lib/permissions.ts`)
  - Camera access with facingMode support (front/rear camera selection)
  - Location access with high accuracy positioning
  - Notification permissions integrated with push notification system
  - Gallery/file access for photo uploads
  - Automatic fallback for devices without specific camera types
  - Proper stream lifecycle management and cleanup
- **Permissions Settings UI** - User-friendly interface at `/permissions`
  - Real-time permission status checking (granted/denied/not requested)
  - One-click permission request buttons
  - Visual status indicators (checkmark/X/alert icons)
  - In-app error messaging with device settings guidance
  - Accessible from Settings page via "App Permissions" option
- **Camera Features**:
  - Stream management with automatic cleanup
  - Video element lifecycle handling (prevents memory leaks)
  - Photo capture with canvas rendering
  - Support for both front and rear cameras with graceful fallback
  - Compatible with desktop and mobile devices
- **Location Features**:
  - High accuracy geolocation requests
  - Privacy-focused distance calculations
  - Timeout and error handling
- **Gallery Features**:
  - File API support detection
  - Multiple file selection
  - Image/video filtering
  - Mobile-optimized file picker
- **Integration Points**:
  - `/permissions` route in App.tsx
  - Settings page link at `/settings`
  - Used in profile photo uploads and ID verification
  - Location data for match distance calculations
  - Push notification enrollment

### Future Integration Points
- **Session Management** - connect-pg-simple configured for PostgreSQL session store (not yet active)
- **Age Verification Service** - ID verification API integration needed
- **Geolocation API** - For distance-based matching
- **Image Upload/Storage** - Profile photos and verification documents (S3 or similar CDN)