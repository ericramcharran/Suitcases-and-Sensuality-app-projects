import { ArrowLeft, Lock, Shield, Eye, FileText, Database, Globe, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const privacyContent = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: 'We collect account information (name, email, role preferences), profile data (bio, physical attributes, images), approximate location for matching purposes, usage data to improve our service, and payment information processed securely through third-party providers. All data collection is transparent and necessary for platform functionality.'
  },
  {
    icon: FileText,
    title: 'How We Use Information',
    content: 'Your information is used exclusively to: provide matching services based on compatibility, improve platform features and user experience, ensure safety through verification systems, process payments securely, and communicate important updates. We never use your data for purposes outside of delivering our core service.'
  },
  {
    icon: Shield,
    title: 'Data Security',
    content: 'We employ industry-leading security measures including end-to-end encryption for sensitive data, SSL/TLS connections for all communications, encrypted database storage, regular security audits by third-party experts, and optional two-factor authentication (2FA). Your privacy and security are our highest priorities.'
  },
  {
    icon: Lock,
    title: 'Information Sharing',
    content: 'We do NOT sell, rent, or trade your personal data. Information is shared only with: other users (only what you choose to display on your profile), trusted service providers under strict confidentiality agreements, and law enforcement when legally required. Your trust is paramount to us.'
  },
  {
    icon: Eye,
    title: 'Your Privacy Rights',
    content: 'You have the right to access all your personal data, request corrections to inaccurate information, delete your account and all associated data, opt-out of non-essential communications, and download your information in a portable format. We respect your control over your data.'
  },
  {
    icon: Globe,
    title: 'Location Privacy',
    content: 'We only store approximate location data for matching purposes - never your exact location. Distance shown to other users is approximate and generalized. All location data is encrypted and you can disable location services at any time through your privacy settings.'
  },
  {
    icon: Database,
    title: 'Data Retention',
    content: 'Active data is retained while your account exists to provide continuous service. Upon account deletion, all personal data is permanently removed from our systems within 30 days. Backup copies are securely destroyed within 90 days to ensure complete data removal.'
  },
  {
    icon: Shield,
    title: 'GDPR and CCPA Compliance',
    content: 'We fully comply with GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act) regulations. Users in applicable jurisdictions have enhanced rights including data portability, right to be forgotten, and the right to restrict processing. Contact us to exercise these rights.'
  },
  {
    icon: FileText,
    title: 'Cookies and Tracking',
    content: 'We use essential cookies required for platform functionality (login sessions, security) and analytics cookies with your consent to understand usage patterns. You can manage cookie preferences in your browser settings. We do not use tracking cookies for advertising purposes.'
  },
  {
    icon: Globe,
    title: 'Third-Party Services',
    content: 'We work with trusted third-party services for payment processing, cloud hosting, and analytics. All providers are contractually bound to protect your data with the same standards we uphold. We conduct regular audits of our partners to ensure compliance.'
  },
  {
    icon: Shield,
    title: 'Age Verification',
    content: 'We require all users to be 21 years or older. Age verification data is handled with strict confidentiality and used solely to ensure platform compliance. We do not share age verification details with other users or third parties beyond what is legally required.'
  },
  {
    icon: AlertCircle,
    title: 'Changes to Privacy Policy',
    content: 'We may update this Privacy Policy to reflect changes in our practices or legal requirements. Users will be notified of significant changes via email and in-app notifications. Continued use of the platform after changes indicates acceptance of the updated policy.'
  }
];

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8">
          <Button
            data-testid="button-back"
            onClick={() => setLocation(-1 as any)}
            variant="outline"
            size="sm"
            className="mb-4 border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] backdrop-blur-sm bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-4xl font-light text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Your privacy and data security matter to us
          </p>
        </div>

        {/* Privacy Commitment */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-black/5">
          <h2 className="text-2xl font-light text-foreground mb-4">Our Commitment</h2>
          <p className="text-foreground leading-relaxed">
            At The Executive Society, we understand the importance of privacy, especially in the context of 
            power exchange relationships. We are committed to protecting your personal information with 
            industry-leading security measures and transparent practices. You control your data, and we respect that.
          </p>
        </Card>

        {/* Privacy Details */}
        <div className="space-y-4 mb-6">
          {privacyContent.map((item, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-black/10 text-center">
          <h3 className="text-xl font-light text-foreground mb-2">
            Questions About Privacy?
          </h3>
          <p className="text-muted-foreground mb-2 text-sm">
            Contact us at privacy@theexecutivesociety.com
          </p>
          <p className="text-xs text-muted-foreground">
            Last Updated: October 2025
          </p>
        </Card>
      </div>
    </div>
  );
}
