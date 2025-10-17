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
- Legal: agreedTerms, agreedConsent, agreedPrivacy, agreedGuidelines flags
- Subscription: plan field for tiered access
- Timestamps: createdAt

### User Onboarding Flow

**Multi-Step Journey**
1. Landing page introduction
2. Age verification (21+ requirement)
3. Terms of Service agreement
4. Consent framework agreement
5. Privacy policy agreement
6. Community guidelines agreement
7. Basic signup (name, role selection)
8. Personality assessment (5-category test covering emotional intelligence, ethics, sensuality, stability, D/s compatibility)
9. Relationship style assessment
10. Subscription plan selection (30-day free trial)
11. Escrow setup (Dominants only - $1,000 minimum, $50,000 final match requirement)
12. Discover/matching interface

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

### Future Integration Points
- **Session Management** - connect-pg-simple configured for PostgreSQL session store (not yet active)
- **Payment Processing** - Escrow system requires payment gateway integration (Stripe recommended)
- **Age Verification Service** - ID verification API integration needed
- **Geolocation API** - For distance-based matching
- **Image Upload/Storage** - Profile photos and verification documents (S3 or similar CDN)