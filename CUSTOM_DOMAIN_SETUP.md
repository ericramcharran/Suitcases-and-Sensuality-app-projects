# Setting Up theexecutivesociety.co Custom Domain

## 📋 Overview

This guide will help you connect **theexecutivesociety.co** to your Replit app for The Executive Society.

---

## 🚀 Step 1: Publish Your Replit App (Required First!)

Before you can add a custom domain, you **must publish** your app to get a stable `.replit.app` URL.

### How to Publish:

1. **Click the "Publish" button** in the top-right corner of Replit
2. **Choose deployment settings:**
   - **Name:** The Executive Society
   - **Type:** Web Service
   - **Auto-deploy:** ON (recommended)
   
3. **Wait for deployment** (usually 1-2 minutes)
4. **Get your URL:** You'll receive something like `https://your-app.replit.app`

**Important:** Don't skip this step! Custom domains only work with published apps, not development servers.

---

## 🌐 Step 2: Configure DNS Records at Your Domain Registrar

You'll need to log in to wherever you registered **theexecutivesociety.co** (GoDaddy, Namecheap, Google Domains, etc.)

### Find Your DNS Management Panel:

**GoDaddy:**
1. Go to My Products → Domains
2. Click on theexecutivesociety.co
3. Click "DNS" or "Manage DNS"

**Namecheap:**
1. Go to Domain List
2. Click "Manage" next to theexecutivesociety.co
3. Go to "Advanced DNS" tab

**Google Domains:**
1. Go to My Domains
2. Click on theexecutivesociety.co
3. Click "DNS" in the left sidebar

---

## 📝 Step 3: Get DNS Records from Replit

After publishing your app:

1. Go to the **Deployments** tab in Replit
2. Click on **Settings**
3. Click **"Link a domain"** or **"Manually connect from another registrar"**
4. Enter: `theexecutivesociety.co`
5. **Copy the DNS records** Replit provides

You'll get something like:

```
A Record:
Host: @
Value: 35.241.42.XX (example IP)

TXT Record:
Host: _replit-challenge
Value: abc123xyz456 (verification code)
```

---

## ⚙️ Step 4: Add Records to Your Registrar

### Add A Record:

| Field | Value |
|-------|-------|
| **Type** | A |
| **Host/Name** | @ (or leave blank for root domain) |
| **Value/Points to** | [IP from Replit] |
| **TTL** | 3600 (or Auto) |

### Add TXT Record:

| Field | Value |
|-------|-------|
| **Type** | TXT |
| **Host/Name** | _replit-challenge |
| **Value** | [Verification code from Replit] |
| **TTL** | 3600 (or Auto) |

### Important Notes:

❌ **Remove conflicting records:**
- Delete any existing A records for `@` or `www`
- Delete any AAAA records (Replit only supports A records)
- If using Cloudflare, turn OFF the proxy (orange cloud) - set to "DNS only" (grey cloud)

---

## 🕐 Step 5: Wait for DNS Propagation

DNS changes can take anywhere from **5 minutes to 48 hours** to propagate globally.

### Check Propagation Status:

Use these free tools to monitor:
- **DNSChecker:** https://dnschecker.org/
- **WhatsMyDNS:** https://www.whatsmydns.net/

Enter `theexecutivesociety.co` and check the A record. When it shows Replit's IP address globally, you're good!

---

## ✅ Step 6: Verify in Replit

Back in Replit:

1. Go to **Deployments → Settings**
2. Your domain should show **"Verified"** status (green checkmark)
3. SSL certificate will be automatically generated (takes 5-10 minutes)
4. Your site will be live at `https://theexecutivesociety.co`

---

## 🔒 SSL Certificate (HTTPS)

Replit automatically provides **free SSL certificates** via Let's Encrypt once your domain is verified.

**Timeline:**
- Domain verification: Instant (after DNS propagation)
- SSL certificate: 5-10 minutes after verification
- Full HTTPS: Usually within 15 minutes total

---

## 📧 Optional: Add www Subdomain

If you also want `www.theexecutivesociety.co` to work:

### Option 1: CNAME Record (Recommended)

| Field | Value |
|-------|-------|
| **Type** | CNAME |
| **Host/Name** | www |
| **Value/Points to** | theexecutivesociety.co |
| **TTL** | 3600 |

### Option 2: Additional A Record

| Field | Value |
|-------|-------|
| **Type** | A |
| **Host/Name** | www |
| **Value** | [Same IP from Replit] |
| **TTL** | 3600 |

Then in Replit, add `www.theexecutivesociety.co` as an additional custom domain.

---

## 🎯 Multi-App Strategy (Spark It! + Executive Society)

Since you have two apps sharing one Replit, here are your options:

### Option 1: Use Subdomain for Spark It! (Recommended)

**Buy a second domain:**
- `sparkit.app` → Spark It! landing
- `theexecutivesociety.co` → Executive Society landing

**Or use subdomain:**
- `app.sparkit.app` → Spark It!
- `theexecutivesociety.co` → Executive Society

### Option 2: Use URL Routing

Keep both apps on same domain, route by path:
- `theexecutivesociety.co/landing` → Executive Society
- `theexecutivesociety.co/sparkit` → Spark It!

**Note:** This works but is less ideal for SEO and branding.

### Option 3: Separate Repls (Best for Production)

1. **Clone this Repl twice:**
   - Repl 1: Executive Society only
   - Repl 2: Spark It! only

2. **Publish separately:**
   - `theexecutivesociety.co` → Executive Society Repl
   - `sparkit.app` → Spark It! Repl

3. **Benefits:**
   - Independent scaling
   - Better SEO
   - Clearer analytics
   - Easier debugging

---

## 🐛 Troubleshooting

### "Domain not verified" after 48 hours

**Check:**
1. DNS records are exactly as Replit provided (no typos!)
2. No conflicting A or AAAA records
3. Cloudflare proxy is OFF (DNS only mode)
4. TTL is not too high (should be 3600 or less)

**Solution:**
- Delete and re-add DNS records
- Wait another 24 hours
- Contact your registrar support

### "SSL certificate pending" for hours

**Normal:** Can take up to 24 hours in rare cases

**If stuck:**
1. Remove domain from Replit
2. Wait 1 hour
3. Re-add domain
4. SSL should generate within 15 minutes

### App loads but shows wrong content

**Issue:** Your app might be routing both apps from one domain

**Solution:**
- Use separate domains for each app, OR
- Update your React routing logic to detect the domain:

```typescript
// In App.tsx
const isDomain = (domain: string) => {
  return window.location.hostname.includes(domain);
};

function Router() {
  // If on theexecutivesociety.co, only show Executive Society routes
  if (isDomain('theexecutivesociety.co')) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {/* Executive Society routes only */}
      </Switch>
    );
  }
  
  // Otherwise show all routes (for .replit.app domain)
  return <NormalRouter />;
}
```

---

## 📊 DNS Configuration Summary

### For theexecutivesociety.co:

```
Type    Host                    Value                           TTL
----    --------------------    ---------------------------     ----
A       @                       [Replit IP]                     3600
TXT     _replit-challenge       [Verification code]             3600
CNAME   www                     theexecutivesociety.co          3600
```

---

## ✨ Post-Setup Checklist

After your domain is live:

- [ ] Test `https://theexecutivesociety.co` loads correctly
- [ ] Test `https://www.theexecutivesociety.co` redirects (if configured)
- [ ] Verify SSL certificate (green lock icon in browser)
- [ ] Update SEO meta tags with new domain (already done in your code!)
- [ ] Update Google Play Store listing with custom domain
- [ ] Create privacy policy page at `theexecutivesociety.co/privacy`
- [ ] Set up email forwarding (optional) for contact@theexecutivesociety.co

---

## 🎉 You're Live!

Once complete, your app will be accessible at:
- ✅ `https://theexecutivesociety.co` (custom domain)
- ✅ `https://your-app.replit.app` (still works as backup)

**Next Steps:**
1. Update all marketing materials with new domain
2. Share on social media (Open Graph tags will work!)
3. Submit to app stores with custom domain in listing
4. Monitor analytics and traffic

---

## 💡 Pro Tips

### Email Setup

Your registrar likely offers email forwarding. Set up:
- `support@theexecutivesociety.co` → Your personal email
- `privacy@theexecutivesociety.co` → For privacy policy requests

### Analytics

Add Google Analytics to track:
- Traffic sources
- User behavior
- Conversion rates

### Performance

Use Replit's always-on feature to ensure your app never sleeps (paid plan).

---

## 📞 Need Help?

If you get stuck:
1. Check Replit's deployment logs for errors
2. Verify DNS propagation with dnschecker.org
3. Contact your domain registrar support
4. Ask me for help with specific error messages!

Good luck with your domain setup! 🚀
