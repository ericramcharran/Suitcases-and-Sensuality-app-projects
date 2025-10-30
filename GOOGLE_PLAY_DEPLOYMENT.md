# Google Play Store Deployment Guide

## 📱 Overview

This guide will help you deploy **Spark It!** and **The Executive Society** to the Google Play Store using Capacitor.

---

## ✅ Prerequisites

- [ ] Google Play Developer Account ($25 one-time fee)
- [ ] Android Studio installed on your local machine
- [ ] Java Development Kit (JDK) 17+ installed

---

## 🚀 Quick Start

### 1. Install Android Studio

Download from: https://developer.android.com/studio

**Required SDK Components:**
- Android SDK Platform 33 (Android 13)
- Android SDK Build-Tools 33.0.0+
- Android SDK Command-line Tools

### 2. Set Environment Variables

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export JAVA_HOME=/path/to/your/jdk-17
```

---

## 📦 Building for Spark It!

### Step 1: Build the Web App

```bash
npm run build
```

### Step 2: Sync with Capacitor

```bash
npx cap sync android
```

### Step 3: Open in Android Studio

```bash
npx cap open android
```

### Step 4: Configure App Details

Edit `android/app/build.gradle`:

```gradle
android {
    namespace "com.sparkit.app"
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.sparkit.app"
        minSdkVersion 22
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Step 5: Generate Signed APK/AAB

#### Create Keystore (first time only):

```bash
keytool -genkey -v -keystore sparkit-release-key.keystore -alias sparkit -keyalg RSA -keysize 2048 -validity 10000
```

**IMPORTANT:** Save the keystore file and passwords securely - you'll need them for all future updates!

#### Configure Signing in Android Studio:

1. Build → Generate Signed Bundle/APK
2. Choose **Android App Bundle (AAB)** - required by Google Play
3. Select your keystore
4. Choose **release** build variant
5. Sign it!

---

## 🎯 Building for The Executive Society

Since this is a multi-app project, you'll need to create a separate Android app:

### Step 1: Update Capacitor Config

Create a new config file `capacitor.executive.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.executivesociety.app',
  appName: 'The Executive Society',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false  // Disable for production
  }
};

export default config;
```

### Step 2: Initialize Separate Android Project

```bash
# Remove existing android folder
rm -rf android

# Add android with Executive Society config
npx cap add android --config capacitor.executive.config.ts

# Sync
npx cap sync android --config capacitor.executive.config.ts
```

### Step 3: Follow same build process as Spark It!

---

## 🎨 App Icons & Splash Screens

### Generate App Icons

Use the Capacitor Asset Generator or create manually:

**Required Sizes:**
- `mipmap-hdpi` (72x72)
- `mipmap-mdpi` (48x48)
- `mipmap-xhdpi` (96x96)
- `mipmap-xxhdpi` (144x144)
- `mipmap-xxxhdpi` (192x192)

Place in: `android/app/src/main/res/mipmap-*/`

### Spark It! Icon:
Use `/sparkit-logo.png` (purple lightning bolt)

### Executive Society Icon:
Create a rose-themed icon matching the brand

---

## 📝 Google Play Console Setup

### 1. Create App Listing

**Spark It! Details:**
- **App Name:** Spark It!
- **Category:** Lifestyle → Relationships
- **Content Rating:** Teen (13+)
- **Target Audience:** Ages 18-65
- **Privacy Policy URL:** Required (host on your domain)

**The Executive Society Details:**
- **App Name:** The Executive Society
- **Category:** Lifestyle → Dating
- **Content Rating:** Mature 17+ (Adult content)
- **Target Audience:** Ages 18+
- **Privacy Policy URL:** Required - must address adult content

### 2. Store Listing Assets

**Screenshots (minimum 2, maximum 8):**
- **Phone:** 1080x1920 or 1080x2340
- **Tablet (optional):** 1536x2048

**Feature Graphic:**
- Size: 1024x500
- Shows at top of store listing

**App Icon:**
- Size: 512x512
- PNG format, no transparency

### 3. Upload AAB File

1. Go to **Production → Create new release**
2. Upload your `.aab` file
3. Add release notes
4. Review and rollout

---

## 🔒 Permissions & Privacy

### Required Permissions

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Internet access for API calls -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Push notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Camera for photo uploads (premium feature) -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Photo library access -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

<!-- Video calling (Daily.co) -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

### Privacy Policy Requirements

**Must Include:**
- Data collection practices
- How user data is stored and used
- Third-party services (Stripe, Twilio, Daily.co)
- User rights (data deletion, access)
- Contact information

---

## 🧪 Testing Before Release

### Internal Testing Track

1. Upload AAB to **Internal Testing** track first
2. Add test users via email
3. Test thoroughly:
   - Sign up flow
   - Premium subscription (use Stripe test mode)
   - Activity generation
   - Video calling
   - Push notifications
   - SMS messaging

### Closed Beta Testing

1. Create **Closed Testing** track
2. Recruit 20-100 testers
3. Gather feedback for 1-2 weeks
4. Fix critical issues

---

## 📊 App Store Optimization (ASO)

### Spark It! Keywords

Use in app description:
- couples app
- date night ideas
- relationship activities
- decision fatigue
- activities for couples
- romantic date ideas

### The Executive Society Keywords

Use in app description:
- BDSM dating (if allowed by Google)
- alternative lifestyle
- power dynamics
- verified profiles
- premium dating

**Note:** Google has strict policies on adult content. Be careful with explicit terms.

---

## ⚠️ Common Issues & Solutions

### Issue: "App uses implicit intents"

**Solution:** Add to `AndroidManifest.xml`:
```xml
<queries>
  <intent>
    <action android:name="android.intent.action.VIEW" />
    <data android:scheme="https" />
  </intent>
</queries>
```

### Issue: "App targets old SDK version"

**Solution:** Update `build.gradle`:
```gradle
targetSdkVersion 33  // Or latest
```

### Issue: "App is repackaged website"

**Google's biggest rejection reason!**

**Solutions:**
1. Add native features:
   - Push notifications ✅ (already implemented)
   - Camera access for avatars ✅ (premium feature)
   - Offline mode (consider adding)
   - Native sharing
   
2. Optimize for mobile:
   - Fast load times
   - Mobile-first UI
   - Gesture support

3. Provide unique value:
   - Not just a wrapped website
   - Native integrations
   - Better UX than web version

---

## 🚀 Release Checklist

### Pre-Launch
- [ ] Test on multiple Android devices
- [ ] Test all payment flows (Stripe)
- [ ] Test push notifications
- [ ] Test video calling (Daily.co)
- [ ] Test SMS messaging (Twilio)
- [ ] Verify privacy policy is live
- [ ] Create screenshots and feature graphic
- [ ] Write compelling app description
- [ ] Set up app support email
- [ ] Configure content rating questionnaire

### Launch Day
- [ ] Upload final AAB to Production track
- [ ] Write release notes
- [ ] Set pricing (free with IAP)
- [ ] Configure in-app products (Stripe subscriptions)
- [ ] Submit for review
- [ ] Monitor for early reviews/crashes

### Post-Launch
- [ ] Monitor Google Play Console for crashes
- [ ] Respond to user reviews
- [ ] Track analytics (installs, retention)
- [ ] Iterate based on feedback

---

## 💰 Monetization Setup

### In-App Products (Spark It!)

1. Go to **Monetize → Products → Subscriptions**
2. Create products:
   - **Monthly Plan:** $6.99/month
   - **Yearly Plan:** $59.99/year

3. Link to Stripe webhooks
4. Handle subscription status in app

---

## 📈 Expected Timeline

| Phase | Duration |
|-------|----------|
| Setup & Build | 1-2 hours |
| Internal Testing | 1-3 days |
| Beta Testing | 1-2 weeks |
| Review Process | 1-7 days |
| **Total** | **2-3 weeks** |

**Success Rate:** 80-90% approval for Capacitor apps (if you follow best practices)

---

## 🎉 Success Tips

1. **Add Real Value:** Make sure your app provides value beyond just a website wrapper
2. **Test Thoroughly:** Use internal/beta testing tracks before production
3. **Professional Assets:** High-quality screenshots and icons matter
4. **Clear Description:** Explain what makes your app unique
5. **Follow Guidelines:** Read Google's quality guidelines carefully
6. **Be Patient:** First review can take up to 7 days

---

## 🔗 Useful Links

- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Google Play Console](https://play.google.com/console)
- [Android Publishing Guide](https://developer.android.com/studio/publish)
- [App Signing Guide](https://developer.android.com/studio/publish/app-signing)

---

## 💡 Next Steps

1. **Spark It! First:** Start with Spark It! as it has fewer content restrictions
2. **Learn from Process:** Use experience to refine The Executive Society
3. **Monitor Metrics:** Track downloads, retention, and revenue
4. **Iterate:** Release updates based on user feedback

Good luck with your deployment! 🚀
