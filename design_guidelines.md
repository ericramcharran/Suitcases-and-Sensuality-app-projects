# Design Guidelines: The Executive Society

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium dating platforms (Hinge, Match, The League) with elevated sophistication reflecting the "Executive Society" brand positioning. This is a trust-first, safety-focused dating platform requiring professional credibility while maintaining warmth and approachability.

**Key Design Principles**:
- Trust and safety as visual cornerstones
- Sophisticated minimalism over playful aesthetics
- Clear information hierarchy for legal/consent content
- Premium feel reflecting executive positioning
- Restrained color palette emphasizing professionalism

---

## Core Design Elements

### A. Color Palette

**Dark Mode** (Primary):
- **Background**: 220 13% 9% (deep charcoal)
- **Surface**: 220 13% 13% (elevated panels)
- **Primary Brand**: 346 77% 50% (sophisticated rose)
- **Text Primary**: 0 0% 98%
- **Text Secondary**: 0 0% 60%
- **Border**: 220 13% 20%
- **Success**: 142 71% 45%
- **Warning**: 38 92% 50%

**Light Mode**:
- **Background**: 0 0% 100%
- **Surface**: 0 0% 98%
- **Primary Brand**: 346 77% 50% (rose-500)
- **Text Primary**: 220 13% 9%
- **Text Secondary**: 0 0% 40%
- **Border**: 0 0% 88%

### B. Typography

**Font Families**:
- **Primary**: Inter (Google Fonts) - clean, professional, excellent readability
- **Headings**: Light to Medium weights (300-500) for sophistication
- **Body**: Regular (400) for readability

**Type Scale**:
- **Hero Heading**: text-5xl (3rem) font-light
- **Section Heading**: text-3xl (1.875rem) font-light
- **Subheading**: text-xl (1.25rem) font-normal
- **Body**: text-base (1rem) font-normal
- **Small/Caption**: text-sm (0.875rem) text-gray-600

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Compact: p-4, gap-2
- Standard: p-6, p-8, gap-4
- Generous: p-12, py-20, gap-8
- **Consistent vertical rhythm**: py-12 mobile, py-20 desktop for sections

**Container Widths**:
- Forms/Content: max-w-md (28rem)
- Legal/Reading: max-w-2xl (42rem)
- Cards Grid: max-w-6xl (72rem)

**Layout Patterns**:
- Single column for onboarding flows
- Card-based layouts for profiles and matches
- Full-width sections with contained inner content

### D. Component Library

**Buttons**:
- **Primary**: rounded-full, bg-gray-900 dark:bg-white, py-3 px-8, hover state with subtle opacity change
- **Secondary**: rounded-full, border-2 border-gray-900, bg-transparent, py-3 px-8
- **Disabled**: bg-gray-300, cursor-not-allowed
- **Icon Buttons**: Minimal, icon-only with hover:bg-gray-100 dark:hover:bg-gray-800

**Cards**:
- **Profile Cards**: rounded-2xl, shadow-sm, p-6, bg-white dark:bg-surface
- **Info Cards**: rounded-xl, border border-gray-200, p-4
- **Feature Cards**: Centered icon, heading, description, hover lift effect

**Form Elements**:
- **Inputs**: rounded-xl, border border-gray-200, p-3, focus:ring-2 ring-rose-500
- **Checkboxes**: w-5 h-5, accent-rose-500
- **Upload Areas**: border-2 border-dashed, rounded-xl, p-8, hover:border-rose-400

**Navigation**:
- **Back Button**: Minimal text + ChevronLeft icon, text-gray-500
- **Tab Bar**: Fixed bottom on mobile, icons + labels, active state with rose-500
- **Settings**: Icon-based access, slide-in panel

**Legal/Consent Screens**:
- **Scrollable Content**: max-h-96, overflow-y-auto, shadow-sm
- **Section Headers**: font-medium, mb-2, text-gray-900
- **Agreement Checkboxes**: Large touch targets, clear labels, integrated with content cards

**Profile Elements**:
- **Avatar**: Circular, gradient placeholder when empty, size variants (w-16, w-20, w-24)
- **Verification Badge**: Small shield icon, rose-500 color
- **Stats Display**: Grid layout, number + label pairs
- **Bio/Description**: max-w-prose, leading-relaxed

**Matching Interface**:
- **Match Cards**: Large images, overlay gradients, swipe gestures
- **Action Buttons**: Circular, shadow-lg, positioned over content
- **Match List**: Horizontal scroll or grid, preview images

**Icons** (Lucide React):
- Heart, MessageCircle, Settings, User, Camera, MapPin, Shield, CreditCard, Lock, Check, ChevronLeft, BookOpen, Award, Play
- Size: w-5 h-5 for inline, w-8 h-8 for featured, w-12 h-12 for hero elements

**Overlays/Modals**:
- **Background**: backdrop-blur-sm bg-black/50
- **Content**: rounded-2xl, max-w-md, p-6, shadow-2xl
- **Close Button**: Absolute top-right, X icon

### E. Animations

**Minimal and Purpose-Driven**:
- **Screen Transitions**: Fade in/out only, no sliding
- **Button Hover**: Subtle opacity change (0.9)
- **Card Hover**: Very subtle lift (translate-y-1)
- **Loading States**: Simple spinner or pulse
- **NO**: Elaborate scroll animations, parallax effects, or decorative motion

---

## Images

**Hero Section**:
- No large hero image on landing page
- Focus on logo, clear typography, and call-to-action
- Trust indicators (Shield icon, "21+ Only · Safe · Consensual · Private")

**Profile Images**:
- Circular avatars throughout
- Placeholder gradients (from-gray-900 to-gray-700)
- Upload areas with Camera icon

**Verification Screens**:
- Icon-based illustrations (Shield, Camera, Lock)
- No decorative photography
- Focus on functional UI elements

**Match Interface**:
- User-uploaded photos as primary content
- Card-based layout with image backgrounds
- Gradient overlays for text readability (from-transparent to-black/60)

---

## Screen-Specific Notes

**Landing**: Centered, minimal, logo prominence, dual CTAs (Get Started + Sign In)

**Onboarding Flow**: Progressive disclosure, one concept per screen, clear back navigation, sticky continue buttons

**Legal Screens**: Scannable headings, scrollable content areas, integrated checkboxes with content cards, disabled state on continue button until agreed

**Profile Setup**: Step indicators, form validation, photo upload prominence, personality testing with clean question cards

**Discovery/Matching**: Image-first cards, quick actions, filter controls, list/grid view toggle

**Messaging**: Clean conversation threads, timestamps, read receipts, media sharing controls

**Settings**: Grouped sections, toggle switches, clear destructive actions (red for account deletion)