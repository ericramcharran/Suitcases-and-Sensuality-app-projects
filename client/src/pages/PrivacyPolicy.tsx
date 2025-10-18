import { ChevronLeft, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useCallback } from "react";

const privacyContent = [
  {
    title: '1. Information We Collect',
    content: 'We collect account information (name, email, role preferences), profile data (bio, physical attributes, images), approximate location for matching purposes, usage data to improve our service, and payment information processed securely through third-party providers. All data collection is transparent and necessary for platform functionality.'
  },
  {
    title: '2. How We Use Information',
    content: 'Your information is used exclusively to: provide matching services based on compatibility, improve platform features and user experience, ensure safety through verification systems, process payments securely, and communicate important updates. We never use your data for purposes outside of delivering our core service.'
  },
  {
    title: '3. Data Security',
    content: 'We employ industry-leading security measures including end-to-end encryption for sensitive data, SSL/TLS connections for all communications, encrypted database storage, regular security audits by third-party experts, and optional two-factor authentication (2FA). Your privacy and security are our highest priorities.'
  },
  {
    title: '4. Information Sharing',
    content: 'We do NOT sell, rent, or trade your personal data. Information is shared only with: other users (only what you choose to display on your profile), trusted service providers under strict confidentiality agreements, and law enforcement when legally required. Your trust is paramount to us.'
  },
  {
    title: '5. Your Privacy Rights',
    content: 'You have the right to access all your personal data, request corrections to inaccurate information, delete your account and all associated data, opt-out of non-essential communications, and download your information in a portable format. We respect your control over your data.'
  },
  {
    title: '6. Location Privacy',
    content: 'We only store approximate location data for matching purposes - never your exact location. Distance shown to other users is approximate and generalized. All location data is encrypted and you can disable location services at any time through your privacy settings.'
  },
  {
    title: '7. Data Retention',
    content: 'Active data is retained while your account exists to provide continuous service. Upon account deletion, all personal data is permanently removed from our systems within 30 days. Backup copies are securely destroyed within 90 days to ensure complete data removal.'
  },
  {
    title: '8. GDPR and CCPA Compliance',
    content: 'We fully comply with GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act) regulations. Users in applicable jurisdictions have enhanced rights including data portability, right to be forgotten, and the right to restrict processing. Contact us to exercise these rights.'
  },
  {
    title: '9. Cookies and Tracking',
    content: 'We use essential cookies required for platform functionality (login sessions, security) and analytics cookies with your consent to understand usage patterns. You can manage cookie preferences in your browser settings. We do not use tracking cookies for advertising purposes.'
  },
  {
    title: '10. Third-Party Services',
    content: 'We work with trusted third-party services for payment processing, cloud hosting, and analytics. All providers are contractually bound to protect your data with the same standards we uphold. We conduct regular audits of our partners to ensure compliance.'
  },
  {
    title: '11. Age Verification',
    content: 'We require all users to be 21 years or older. Age verification data is handled with strict confidentiality and used solely to ensure platform compliance. We do not share age verification details with other users or third parties beyond what is legally required.'
  },
  {
    title: '12. Changes to Privacy Policy',
    content: 'We may update this Privacy Policy to reflect changes in our practices or legal requirements. Users will be notified of significant changes via email and in-app notifications. Continued use of the platform after changes indicates acceptance of the updated policy.'
  }
];

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/settings");
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-6">
      <button
        data-testid="button-back"
        onClick={handleBack}
        className="mb-4 sm:mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-2 rounded-md min-h-[44px]"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-light mb-2 text-center text-foreground">
          Privacy Policy
        </h2>
        <p className="text-muted-foreground mb-6 text-center text-sm sm:text-base">
          Your privacy and data security matter to us
        </p>
        
        <Card className="p-4 sm:p-6 mb-6">
          <div className="space-y-6">
            {privacyContent.map((item, i) => (
              <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <h3 className="font-medium text-foreground mb-2 text-base sm:text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 mb-6 bg-gradient-to-r from-red-500/5 to-black/5 border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Data Protection Commitment</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use end-to-end encryption and never sell your data. Your information is protected with industry-leading security measures and used only to provide our services. We are committed to transparency and your right to privacy.
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Last Updated: October 2025
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Questions? Contact us at privacy@theexecutivesociety.com
          </p>
        </div>
      </div>
    </div>
  );
}
