# Spark It! - Complete Deployment Checklist

**Last Updated: October 30, 2025**

---

## 🎉 What's Complete

### ✅ App Store Assets

**App Icons:**
- `attached_assets/generated_images/Spark_It_app_icon_design_1d05f159.png` - Purple-to-red gradient lightning bolt design
- Ready for both Google Play and Apple App Store

**Privacy Policy:**
- `PRIVACY_POLICY_SPARKIT.md` - Comprehensive 15-section policy covering:
  - Couples data handling
  - SMS & push notifications
  - Video calling privacy (Daily.co)
  - AI location features (OpenAI)
  - GDPR & CCPA compliance
  - Children's privacy (18+)
  - Data retention policies

**Store Descriptions:**
- `APP_STORE_DESCRIPTIONS_SPARKIT.md` - Complete listing copy including:
  - Google Play short description (3 options)
  - Google Play full description (4000 chars)
  - Apple App Store subtitle (3 options)
  - Apple App Store description (4000 chars)
  - Keywords, categories, age ratings
  - Screenshot captions
  - Developer reply templates
  - App preview video script

### ✅ Email Forwarding Setup

**Domain: spark-itapp.com (GoDaddy)**
- Email forwarding configured via ImprovMX (free)
- MX records added to GoDaddy DNS
- Aliases created:
  - `support@spark-itapp.com`
  - `privacy@spark-itapp.com`
  - `hi@spark-itapp.com`
  - `team@spark-itapp.com`

**Status:** Waiting for DNS propagation (1-24 hours)

**Documentation:**
- `EMAIL_FORWARDING_SETUP.md` - General guide for any domain
- `REPLIT_DOMAIN_EMAIL_SETUP.md` - Specific to Replit-purchased domains

### ✅ Android Deployment (Google Play)

**Capacitor Setup:**
- Installed: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`
- Configured: `capacitor.config.ts`
- Built: React app compiled
- Synced: Web assets to Android native project

**Status:** Ready for APK/AAB build

**Documentation:**
- `GOOGLE_PLAY_DEPLOYMENT.md` - Complete deployment guide including:
  - Android build instructions (APK/AAB)
  - Signing key generation
  - Google Play Console setup
  - Store listing requirements
  - Review process tips

### ✅ Custom Domain Setup

**Domain: spark-itapp.com (GoDaddy)**

**Documentation:**
- `CUSTOM_DOMAIN_SETUP.md` - How to connect GoDaddy domain to Replit deployment

**Note:** Custom domains require publishing your Replit app first (to get stable .replit.app URL)

### ✅ SEO Optimization

**Implementation:**
- `client/index.html` - Dynamic JavaScript-based SEO that switches meta tags based on route
- `client/public/sitemap.xml` - Sitemap including Spark It! public pages
- `client/public/robots.txt` - Search engine indexing rules

**Keywords Optimized (40+):**
- couples app, relationship app, date night ideas, activities for couples, decision fatigue, long distance relationship app, couple games, romantic date ideas, quality time together, instant activity suggestions, spontaneous date ideas, etc.

**Rich Results:**
- Schema.org MobileApplication structured data
- Open Graph tags for social sharing
- Twitter Card tags

---

## 📋 Pre-Launch Checklist

### Phase 1: Email & Domain (In Progress)

**Email Forwarding:**
- [x] Add MX records to GoDaddy
- [x] Create aliases in ImprovMX
- [ ] Wait 24 hours for DNS propagation
- [ ] Test email delivery (send to support@spark-itapp.com)
- [ ] Verify spam score (use mail-tester.com)
- [ ] Set up "Send Mail As" in Gmail (optional)

**Custom Domain:**
- [ ] Publish Replit app (get stable .replit.app URL)
- [ ] Add CNAME record in GoDaddy pointing to .replit.app
- [ ] Wait for SSL certificate provisioning
- [ ] Test custom domain access

---

### Phase 2: Google Play Store Submission

**App Preparation:**
- [x] App icon designed
- [x] Privacy policy written
- [x] Store descriptions written
- [ ] Generate signed APK/AAB (see GOOGLE_PLAY_DEPLOYMENT.md)
- [ ] Create app signing key
- [ ] Test APK on physical Android device

**Store Listing:**
- [ ] Create Google Play Developer account ($25 one-time fee)
- [ ] Upload APK/AAB
- [ ] Add app icon (512x512 PNG)
- [ ] Upload screenshots (minimum 2, up to 8)
- [ ] Write short description (80 chars)
- [ ] Write full description (4000 chars)
- [ ] Set category: Lifestyle
- [ ] Set age rating: Teen (13+) or Mature (17+)
- [ ] Add support email: support@spark-itapp.com
- [ ] Add privacy policy URL: https://spark-itapp.com/privacy
- [ ] Add content rating questionnaire
- [ ] Set pricing: Free with in-app purchases

**In-App Purchases (Stripe Subscriptions):**
- [ ] Configure Google Play Billing (if using Play Billing instead of Stripe)
- [ ] OR: Keep Stripe for subscriptions (requires clear disclosure)
- [ ] Note: Google takes 30% cut if using Play Billing; Stripe has no cut but violates Play policy for digital goods

**Submit for Review:**
- [ ] Review all listing details
- [ ] Submit for review (3-7 days)
- [ ] Monitor review status
- [ ] Respond to any rejection feedback

---

### Phase 3: Apple App Store Submission (Future)

**App Preparation:**
- [x] App icon designed
- [x] Privacy policy written
- [x] Store descriptions written
- [ ] Install Capacitor iOS support: `npx cap add ios`
- [ ] Generate signed IPA (requires macOS + Xcode)
- [ ] Test on physical iPhone/iPad
- [ ] Enroll in Apple Developer Program ($99/year)

**Store Listing:**
- [ ] Create App Store Connect account
- [ ] Upload IPA via Xcode or Transporter
- [ ] Add app icon (1024x1024 PNG, no transparency)
- [ ] Upload screenshots (iPhone, iPad required)
- [ ] Write subtitle (30 chars)
- [ ] Write description (4000 chars)
- [ ] Set category: Lifestyle + Social Networking
- [ ] Set age rating: 17+ (Mature/Suggestive Themes)
- [ ] Add support URL: https://spark-itapp.com/support
- [ ] Add privacy policy URL: https://spark-itapp.com/privacy
- [ ] Add keywords (100 chars)

**Important for Apple:**
- [ ] Ensure Stripe subscriptions comply with Apple's IAP policies
- [ ] Consider implementing Sign in with Apple
- [ ] Review App Store Review Guidelines (especially for dating/relationship apps)

**Submit for Review:**
- [ ] Submit for review (1-3 days, or weeks if issues)
- [ ] Apple is more strict than Google (expect rejections)

---

### Phase 4: App Features & Testing

**Core Features (Already Built):**
- [x] Simultaneous button press mechanic
- [x] SMS notifications (Twilio)
- [x] Browser push notifications (VAPID)
- [x] 250+ activities across 19 categories
- [x] Competitive scoreboard
- [x] Trivia challenges (225+ questions)
- [x] Freemium trial (10 sparks OR 7 days)
- [x] Premium subscriptions (Stripe: $6.99/mo, $59.99/yr)
- [x] Video calling (Daily.co)
- [x] Avatar selection (80+ icons + custom uploads for premium)
- [x] AI activity discovery (OpenAI, feature-flagged)

**Testing Checklist:**
- [ ] Test signup flow (both partners)
- [ ] Test simultaneous button press
- [ ] Verify SMS notifications arrive
- [ ] Verify browser push notifications arrive
- [ ] Test activity rating and scoreboard
- [ ] Test trivia challenge flow
- [ ] Test free trial limits (10 sparks, 7 days)
- [ ] Test Stripe subscription purchase
- [ ] Test premium features unlock (video, avatars, AI)
- [ ] Test video calling quality
- [ ] Test on multiple devices (Android, iOS web, desktop)
- [ ] Test logout and session persistence

**Known Issues to Fix:**
- [ ] **CRITICAL:** Browser push notifications may appear on wrong device when partner presses button
  - Issue: Push subscriptions not properly scoped to specific devices
  - Impact: Partner 2 might get notification on wrong device
  - Priority: HIGH

**Performance Testing:**
- [ ] Test app load time
- [ ] Test database query performance
- [ ] Test video call bandwidth usage
- [ ] Test with slow network (3G simulation)
- [ ] Test concurrent users (stress test)

---

### Phase 5: Legal & Compliance

**Privacy & Legal:**
- [x] Privacy policy written
- [ ] Host privacy policy at: https://spark-itapp.com/privacy
- [ ] Terms of Service (not yet written)
- [ ] Host Terms of Service at: https://spark-itapp.com/terms
- [ ] Community Guidelines (optional but recommended)
- [ ] GDPR compliance audit
- [ ] CCPA compliance audit

**Payment Compliance:**
- [x] Stripe integration active
- [ ] Ensure Stripe account fully verified
- [ ] Set up tax reporting (1099-K threshold)
- [ ] Review subscription refund policy
- [ ] Add refund policy to Terms of Service

**App Store Policies:**
- [ ] Review Google Play Developer Policy
- [ ] Review Apple App Store Review Guidelines
- [ ] Ensure no policy violations (especially around payments)

---

### Phase 6: Marketing & Launch

**Pre-Launch:**
- [ ] Create landing page at spark-itapp.com
- [ ] Set up social media accounts (Instagram, TikTok, Twitter)
- [ ] Create demo video for social media
- [ ] Prepare launch announcement email
- [ ] Create press kit (app description, screenshots, logo)

**Launch Day:**
- [ ] Publish to Google Play
- [ ] Announce on social media
- [ ] Email early supporters
- [ ] Submit to Product Hunt (optional)
- [ ] Submit to App Store directories (AppAdvice, 148Apps, etc.)

**Post-Launch:**
- [ ] Monitor reviews and respond
- [ ] Track analytics (downloads, active users, retention)
- [ ] Monitor error logs and crash reports
- [ ] Gather user feedback
- [ ] Plan feature updates

---

## 🔧 Technical Requirements

### Environment Variables (Production)

**Required for Spark It!:**
```
# Database
DATABASE_URL=<from Replit>

# Session
SESSION_SECRET=<from Replit>

# Stripe (Subscriptions)
STRIPE_SECRET_KEY=<from Replit>
VITE_STRIPE_PUBLIC_KEY=<from Replit>

# Twilio (SMS Notifications)
TWILIO_ACCOUNT_SID=<from Replit>
TWILIO_AUTH_TOKEN=<from Replit>
TWILIO_PHONE_NUMBER=<from Replit>

# Push Notifications (VAPID)
VAPID_PUBLIC_KEY=<from Replit>
VAPID_PRIVATE_KEY=<from Replit>
VAPID_SUBJECT=mailto:support@spark-itapp.com

# Daily.co (Video Calling)
DAILY_API_KEY=<from Replit>

# Email (Resend)
RESEND_API_KEY=<from Replit>

# Object Storage (Avatar Uploads)
DEFAULT_OBJECT_STORAGE_BUCKET_ID=<from Replit>
PUBLIC_OBJECT_SEARCH_PATHS=<from Replit>
PRIVATE_OBJECT_DIR=<from Replit>

# AI Activity Discovery (Optional, Feature-Flagged)
ENABLE_AI_ACTIVITIES=false  # Set to true when ready to launch
VITE_ENABLE_AI_ACTIVITIES=false  # Set to true when ready to launch

# Database Config
PGHOST=<from Replit>
PGPORT=<from Replit>
PGUSER=<from Replit>
PGPASSWORD=<from Replit>
PGDATABASE=<from Replit>
```

### Database Tables (PostgreSQL)

**Spark It! Tables:**
- `sparkit_couples` - Couple account data
- `sparkit_activity_ratings` - Activity rating history
- `sparkit_activity_results` - Activity reveal history
- `sparkit_trivia_categories` - Trivia categories
- `sparkit_trivia_questions` - Trivia question bank
- `sparkit_trivia_contests` - Trivia challenge instances
- `sparkit_trivia_answers` - User trivia answers
- `sparkit_video_sessions` - Video call metadata
- `push_subscriptions` - Browser push notification subscriptions (shared)

**Executive Society Tables:**
- `users` - User profiles (not used by Spark It!)

---

## 📊 Success Metrics

**Key Performance Indicators (KPIs):**
- Downloads (target: 1,000 in first month)
- Active couples (target: 500 in first month)
- Daily active users (DAU)
- Sparks generated per day
- Free trial → Premium conversion rate (target: 5-10%)
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (LTV)
- Churn rate (target: <10% monthly)

**User Engagement:**
- Average sparks per couple per week
- Scoreboard engagement (wins tracked)
- Trivia participation rate
- Video call usage (long-distance couples)
- AI activity discovery usage (when enabled)

---

## 🚀 Next Immediate Steps

**Priority 1: Email Forwarding (Waiting for DNS)**
- Wait 24 hours for DNS propagation
- Test email delivery
- Verify all aliases work

**Priority 2: Publish Replit App**
- Click "Publish" in Replit Deployments
- Get stable .replit.app URL
- Update all documentation with live URL

**Priority 3: Custom Domain**
- Add CNAME record in GoDaddy
- Point to .replit.app URL
- Test spark-itapp.com access

**Priority 4: Privacy Policy Hosting**
- Create `/privacy` route in app
- Display PRIVACY_POLICY_SPARKIT.md content
- Ensure accessible at spark-itapp.com/privacy

**Priority 5: Google Play APK Build**
- Follow GOOGLE_PLAY_DEPLOYMENT.md steps
- Generate signed APK
- Test on Android device
- Upload to Google Play Console

---

## 💡 Recommendations

**Before Google Play Submission:**
1. Fix the browser push notification routing bug (CRITICAL)
2. Write Terms of Service
3. Create at least 4 screenshots for store listing
4. Record app preview video (optional but recommended)
5. Test free trial limits thoroughly

**Marketing Strategy:**
1. Focus on couples struggling with decision fatigue
2. Target long-distance relationships (video calling USP)
3. Emphasize "simultaneous button press" as unique mechanic
4. Use TikTok/Reels to show app in action
5. Partner with relationship coaches/therapists

**Monetization:**
1. Keep free trial generous (10 sparks is good)
2. Consider lowering yearly price for Black Friday launch ($49.99)
3. Add "gift subscription" for Valentine's Day
4. Consider "couples bundle" (invite friends, get discount)

---

## 📞 Support Contacts

**Email Addresses (spark-itapp.com):**
- General: hi@spark-itapp.com
- Support: support@spark-itapp.com
- Privacy: privacy@spark-itapp.com
- Team: team@spark-itapp.com

**ImprovMX Dashboard:**
- Login: improvmx.com
- Manage aliases and SMTP credentials

**GoDaddy DNS:**
- Login: godaddy.com
- Manage domain and DNS records

---

## 🎯 Launch Timeline (Suggested)

**Week 1:**
- [ ] Fix notification bug
- [ ] Write Terms of Service
- [ ] Publish Replit app
- [ ] Connect custom domain

**Week 2:**
- [ ] Create store screenshots
- [ ] Build and test APK
- [ ] Set up Google Play Developer account
- [ ] Submit to Google Play

**Week 3-4:**
- [ ] Address Google Play review feedback
- [ ] Prepare marketing materials
- [ ] Create social media accounts
- [ ] Plan launch announcement

**Launch Day (Week 4):**
- [ ] App goes live on Google Play
- [ ] Social media announcement
- [ ] Email early supporters
- [ ] Monitor reviews and support requests

---

## ✅ You're Almost There!

**What's Done:**
- App is fully built and functional
- Android build system is ready (Capacitor)
- Email forwarding is configured (waiting for DNS)
- Privacy policy is comprehensive
- Store listings are written and optimized
- SEO is implemented

**What's Left:**
- Test email delivery (24 hours)
- Publish Replit app
- Fix notification routing bug
- Build signed APK
- Submit to Google Play

**You're 90% of the way to launch!** 🚀

---

**Questions? Issues?**
Refer to the detailed guides:
- `GOOGLE_PLAY_DEPLOYMENT.md`
- `EMAIL_FORWARDING_SETUP.md`
- `CUSTOM_DOMAIN_SETUP.md`
- `PRIVACY_POLICY_SPARKIT.md`
- `APP_STORE_DESCRIPTIONS_SPARKIT.md`

Good luck with the launch! 💜⚡❤️
