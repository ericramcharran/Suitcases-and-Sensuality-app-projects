import { useState } from "react";
import { ChevronLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";

const privacyContent = [
  {
    title: '1. Information We Collect',
    content: 'Account info, profile data, location (approximate), usage data, payment info (via secure third parties).'
  },
  {
    title: '2. How We Use Information',
    content: 'Provide matching services, improve features, ensure safety, process payments, communicate updates.'
  },
  {
    title: '3. Data Security',
    content: 'End-to-end encryption, SSL connections, encrypted storage, regular audits, 2FA options.'
  },
  {
    title: '4. Information Sharing',
    content: 'We do NOT sell data. Shared only with: users (what you choose), processors (under contract), law enforcement (when required).'
  },
  {
    title: '5. Your Privacy Rights',
    content: 'Access data, request corrections, delete account, opt-out, download information.'
  },
  {
    title: '6. Location Privacy',
    content: 'Approximate distance only. Never exact location. Encrypted and can be disabled.'
  },
  {
    title: '7. Data Retention',
    content: 'Active data retained while account exists. Deleted within 30 days of account deletion.'
  },
  {
    title: '8. GDPR and CCPA Compliance',
    content: 'We comply with GDPR and CCPA regulations. Enhanced rights under these laws.'
  },
  {
    title: '9. Cookies',
    content: 'Essential cookies for functionality, analytics cookies with consent.'
  }
];

export default function Privacy() {
  const [, setLocation] = useLocation();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/consent")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Privacy Policy
        </h2>
        <p className="text-muted-foreground mb-6 text-center">Your privacy and data security matter to us</p>
        
        <Card className="p-6 mb-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {privacyContent.map((item, i) => (
              <div key={i} className="border-b border-border last:border-0 pb-3 last:pb-0">
                <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.content}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-6 bg-gradient-to-r from-red-500/5 to-black/5 border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Data Protection</h3>
              <p className="text-sm text-muted-foreground">
                We use end-to-end encryption and never sell your data. Your information is protected and used only to provide our services.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-6">
          <div className="flex items-start gap-3">
            <Checkbox
              data-testid="checkbox-privacy"
              id="privacy"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="privacy"
              className="text-sm text-foreground/80 cursor-pointer"
            >
              I understand the Privacy Policy and how my data will be used
            </label>
          </div>
        </Card>
        <div className="flex justify-center">
          <Button
            data-testid="button-continue"
            onClick={() => setLocation("/guidelines")}
            disabled={!agreed}
            className="rounded-full bg-red-500 hover:bg-black text-white transition-colors px-12"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
