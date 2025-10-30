# How to Build a Signed APK/AAB for Google Play Store

**Date: October 30, 2025**

This guide walks you through building a production-ready, signed Android app package (APK or AAB) for Spark It! to submit to Google Play Store.

---

## 📋 What You'll Need

- ✅ Replit project with Capacitor configured
- ✅ Java Development Kit (JDK) 17+ installed
- ✅ Android Studio installed (optional but recommended)
- ✅ Keystore file for app signing
- ✅ 30-60 minutes of time

---

## 🔑 Step 1: Generate App Signing Key (One-Time Setup)

Google Play requires all apps to be digitally signed. You'll create a keystore file to sign your app.

### **Generate Keystore with `keytool`**

```bash
# Run this command from your project root directory
keytool -genkey -v \
  -keystore sparkit-release-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias sparkit-key-alias
```

### **You'll be prompted for:**

1. **Keystore password:** (Choose a strong password - SAVE THIS!)
2. **Key password:** (Can be same as keystore password)
3. **First and last name:** Your name or company name
4. **Organizational unit:** (e.g., "Development")
5. **Organization:** Your company name
6. **City/Locality:** Your city
7. **State/Province:** Your state
8. **Country code:** US, UK, etc.

### **Example Output:**
```
Enter keystore password: MySecurePassword123!
Re-enter new password: MySecurePassword123!
What is your first and last name?
  [Unknown]:  John Doe
What is the name of your organizational unit?
  [Unknown]:  Development
What is the name of your organization?
  [Unknown]:  Spark It
What is the name of your City or Locality?
  [Unknown]:  San Francisco
What is the name of your State or Province?
  [Unknown]:  California
What is the two-letter country code for this unit?
  [Unknown]:  US
Is CN=John Doe, OU=Development, O=Spark It, L=San Francisco, ST=California, C=US correct?
  [no]:  yes

Enter key password for <sparkit-key-alias>
	(RETURN if same as keystore password):
```

### **Result:**
You now have a file called `sparkit-release-key.jks` in your project root.

### **⚠️ CRITICAL: Backup Your Keystore!**

```bash
# Copy to a secure location OUTSIDE your project
cp sparkit-release-key.jks ~/Desktop/BACKUPS/sparkit-release-key.jks

# Better: Upload to secure cloud storage (Google Drive, 1Password, etc.)
```

**If you lose this keystore file, you can NEVER update your app on Google Play!**

Store safely:
- ✅ Cloud backup (Google Drive, Dropbox)
- ✅ Password manager (1Password, LastPass)
- ✅ External hard drive
- ❌ Don't commit to GitHub (add to .gitignore)

---

## 🔒 Step 2: Configure Keystore in Project

### **Create `android/key.properties` file:**

```bash
# Navigate to android directory
cd android

# Create key.properties file
cat > key.properties << EOF
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=sparkit-key-alias
storeFile=../sparkit-release-key.jks
EOF
```

**Replace:**
- `YOUR_KEYSTORE_PASSWORD` with your actual keystore password
- `YOUR_KEY_PASSWORD` with your actual key password
- Ensure `storeFile` path points to your `.jks` file

### **Add to `.gitignore`:**

```bash
# Prevent committing sensitive files to Git
echo "android/key.properties" >> .gitignore
echo "*.jks" >> .gitignore
```

---

## ⚙️ Step 3: Update `android/app/build.gradle`

### **Add signing configuration:**

Open `android/app/build.gradle` and add this code:

```gradle
// At the top of the file, before "android {" block
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    
    // Add this signingConfigs block BEFORE buildTypes
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    
    buildTypes {
        release {
            // Update this line to use signing config
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 🏗️ Step 4: Build the Release APK/AAB

You can build either:
- **APK** - For direct installation and testing
- **AAB (Android App Bundle)** - Required for Google Play Store (recommended)

### **Option A: Build AAB (Recommended for Google Play)**

```bash
# Navigate to android directory
cd android

# Build release AAB
./gradlew bundleRelease

# Output location:
# android/app/build/outputs/bundle/release/app-release.aab
```

### **Option B: Build APK (For Testing)**

```bash
# Navigate to android directory
cd android

# Build release APK
./gradlew assembleRelease

# Output location:
# android/app/build/outputs/apk/release/app-release.apk
```

### **Common Build Errors:**

#### **"JDK not found"**
```bash
# Set JAVA_HOME environment variable
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64  # Linux
export JAVA_HOME=$(/usr/libexec/java_home)  # macOS

# Or install JDK
sudo apt install openjdk-17-jdk  # Linux
brew install openjdk@17  # macOS
```

#### **"Gradle version incompatible"**
```bash
# Update Gradle wrapper
cd android
./gradlew wrapper --gradle-version=8.4
```

#### **"Build failed: missing dependency"**
```bash
# Sync and clean
./gradlew clean
./gradlew build --refresh-dependencies
```

---

## ✅ Step 5: Verify the Signed APK/AAB

### **Check Signature:**

```bash
# For AAB
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab

# For APK
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```

**Look for:**
```
jar verified.
```

### **Extract Certificate Info:**

```bash
# For AAB
jarsigner -verify -verbose android/app/build/outputs/bundle/release/app-release.aab | grep "SHA256"

# For APK
jarsigner -verify -verbose android/app/build/outputs/apk/release/app-release.apk | grep "SHA256"
```

**Save the SHA256 fingerprint** - you'll need it for Google Play Console!

---

## 📱 Step 6: Test the APK on a Device

Before uploading to Google Play, test your signed APK:

### **Install APK on Android Device:**

```bash
# Connect device via USB (enable USB debugging)
adb devices  # Verify device is connected

# Install the APK
adb install android/app/build/outputs/apk/release/app-release.apk

# If already installed, use -r to replace
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

### **What to Test:**
- ✅ App launches without errors
- ✅ Login/signup flow works
- ✅ Spark button press works
- ✅ Activities display correctly
- ✅ Premium features work
- ✅ Push notifications work
- ✅ No crashes or ANRs (App Not Responding)

---

## 📤 Step 7: Upload to Google Play Console

### **7.1: Create Google Play Developer Account**

1. Go to: https://play.google.com/console/signup
2. Pay the **$25 one-time registration fee**
3. Fill out account details
4. Accept agreements

### **7.2: Create New App**

1. Click **"Create app"**
2. Fill in details:
   - **App name:** Spark It!
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
3. Accept declarations
4. Click **"Create app"**

### **7.3: Upload AAB**

```
1. Navigate to: Production → Releases → Create new release
2. Click "Upload" and select your AAB file:
   android/app/build/outputs/bundle/release/app-release.aab
3. Enter release notes:
   "Initial release of Spark It! - Beat decision fatigue together"
4. Click "Review release"
5. Click "Start rollout to Production"
```

### **7.4: Complete Store Listing**

**Main store listing:**
- App name: Spark It!
- Short description: (from APP_STORE_DESCRIPTIONS_SPARKIT.md)
- Full description: (from APP_STORE_DESCRIPTIONS_SPARKIT.md)
- App icon: Upload `attached_assets/generated_images/Spark_It_app_icon_design_*.png`
- Feature graphic: Create a 1024x500 banner
- Screenshots: Upload 2-8 screenshots (see SCREENSHOT_GUIDE.md)
- Privacy policy URL: https://spark-itapp.com/privacy
- Category: Lifestyle
- Content rating: Complete questionnaire (likely ESRB: Everyone)
- Contact email: support@spark-itapp.com

**Pricing & distribution:**
- Free app: Yes
- Contains ads: No
- In-app purchases: Yes (Premium subscription)
- Countries: Worldwide (or select specific countries)
- Content rating: Complete questionnaire
- App content: Complete declarations

**App content:**
- Privacy policy: https://spark-itapp.com/privacy
- Terms of Service: https://spark-itapp.com/terms
- Data safety:
  - Collect email, name, location
  - Data encrypted in transit
  - Users can request deletion
- Ads: No third-party ads

---

## 🎯 Step 8: Set Up In-App Purchases (Premium Subscriptions)

### **8.1: Create Products**

```
Products → Subscriptions → Create subscription
```

**Monthly Subscription:**
- Product ID: `sparkit_premium_monthly`
- Name: Premium Monthly
- Description: Unlimited sparks, custom avatars, and video calling
- Billing period: 1 month
- Base plan price: $6.99 USD
- Free trial: 7 days (optional)

**Yearly Subscription:**
- Product ID: `sparkit_premium_yearly`
- Name: Premium Yearly
- Description: Unlimited sparks, custom avatars, and video calling - Save 28%!
- Billing period: 1 year
- Base plan price: $59.99 USD
- Free trial: 7 days (optional)

### **8.2: Link Subscriptions in Code**

Ensure these IDs match in your app code:
- `sparkit_premium_monthly`
- `sparkit_premium_yearly`

---

## 🔍 Step 9: Submit for Review

### **Pre-Launch Checklist:**

- [ ] AAB uploaded and signed
- [ ] Store listing completed (name, description, screenshots)
- [ ] App icon uploaded (512x512)
- [ ] Privacy policy URL added
- [ ] Terms of Service URL added
- [ ] Content rating questionnaire completed
- [ ] App category selected
- [ ] Pricing set (Free with in-app purchases)
- [ ] Countries/regions selected
- [ ] In-app purchases configured
- [ ] Data safety form completed
- [ ] All required declarations accepted

### **Submit:**

```
1. Review → Check all sections are complete (green checkmarks)
2. Click "Send for review" or "Start rollout to Production"
3. Wait for Google's review (typically 1-7 days)
```

---

## ⏱️ Review Timeline

**Typical review times:**
- **First submission:** 3-7 days
- **Updates:** 1-3 days
- **Urgent issues:** Can request expedited review

**Review stages:**
1. ⏳ **Pending publication** - In review queue
2. 🔍 **Under review** - Google is testing your app
3. ✅ **Approved** - App goes live!
4. ❌ **Rejected** - Fix issues and resubmit

---

## 🚨 Common Rejection Reasons

1. **Missing privacy policy**
   - Solution: Add URL in store listing

2. **Missing screenshots**
   - Solution: Upload at least 2 screenshots

3. **App crashes on startup**
   - Solution: Test APK thoroughly before submission

4. **Permission violations**
   - Solution: Only request necessary permissions

5. **Misleading description**
   - Solution: Accurately describe app features

6. **Inappropriate content**
   - Solution: Ensure all content is family-friendly

---

## 🔄 Updating Your App

When you make changes to Spark It!:

```bash
# 1. Update version in android/app/build.gradle
versionCode 2  # Increment by 1
versionName "1.0.1"  # Increment version number

# 2. Rebuild AAB
cd android
./gradlew bundleRelease

# 3. Upload to Google Play Console
# Production → Releases → Create new release
# Upload new AAB file
# Add release notes
# Submit for review
```

---

## 📊 Post-Launch Monitoring

After your app goes live:

1. **Monitor crashes:**
   - Google Play Console → Quality → Android vitals
   - Fix critical crashes immediately

2. **Track installs:**
   - Dashboard → Statistics
   - Monitor install/uninstall rates

3. **Read reviews:**
   - Respond to user feedback
   - Address common issues

4. **Update regularly:**
   - Bug fixes and new features
   - Keep app compliant with Play Store policies

---

## 🆘 Troubleshooting

### **"Keystore tampered with or password incorrect"**
- Verify password in `key.properties`
- Ensure keystore file path is correct

### **"Gradle build failed"**
```bash
cd android
./gradlew clean
./gradlew bundleRelease --stacktrace
```

### **"App not compatible with device"**
- Check `minSdkVersion` in `android/app/build.gradle`
- Recommended: `minSdkVersion 24` (Android 7.0+)

### **"Upload rejected - version code already exists"**
- Increment `versionCode` in `build.gradle`

---

## 📚 Additional Resources

- **Google Play Console:** https://play.google.com/console
- **Android Developer Docs:** https://developer.android.com/studio/publish
- **Capacitor Android Guide:** https://capacitorjs.com/docs/android
- **Signing Your App:** https://developer.android.com/studio/publish/app-signing

---

## ✅ Quick Reference Checklist

**Before Building:**
- [ ] Keystore generated and backed up
- [ ] `key.properties` configured
- [ ] `build.gradle` updated with signing config
- [ ] App version incremented

**Building:**
- [ ] Run `./gradlew bundleRelease` successfully
- [ ] Verify AAB signature with `jarsigner`
- [ ] Test APK on physical device

**Google Play:**
- [ ] Developer account created ($25 paid)
- [ ] Store listing completed
- [ ] Screenshots uploaded (2-8)
- [ ] Privacy policy & TOS URLs added
- [ ] AAB uploaded
- [ ] In-app purchases configured
- [ ] Submitted for review

---

**You're ready to launch Spark It! on Google Play Store! 🚀**

Questions? Email support@spark-itapp.com
