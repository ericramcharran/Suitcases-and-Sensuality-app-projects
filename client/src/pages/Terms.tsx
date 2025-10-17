import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";

const termsContent = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing and using The Executive Society, you accept and agree to be bound by these Terms of Service.'
  },
  {
    title: '2. Eligibility',
    content: 'You must be at least 21 years of age. All information provided must be accurate.'
  },
  {
    title: '3. User Conduct',
    content: 'Use responsibly and respectfully. Harassment, abuse, non-consensual behavior, hate speech, or illegal activities are prohibited.'
  },
  {
    title: '4. Content Standards',
    content: 'All content must comply with applicable laws. No illegal, defamatory, or threatening content.'
  },
  {
    title: '5. Account Security',
    content: 'You are responsible for maintaining account credentials confidentiality.'
  },
  {
    title: '6. Limitation of Liability',
    content: 'The Executive Society is a platform for connection. Users engage at their own risk.'
  },
  {
    title: '7. Termination',
    content: 'We reserve the right to suspend or terminate accounts that violate these terms.'
  },
  {
    title: '8. Changes to Terms',
    content: 'We may update these terms. Continued use constitutes acceptance.'
  }
];

export default function Terms() {
  const [, setLocation] = useLocation();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light mb-6 text-foreground">Terms of Service</h2>
        <Card className="p-6 mb-6 max-h-96 overflow-y-auto">
          <div className="space-y-4 text-sm text-muted-foreground">
            {termsContent.map((item, i) => (
              <div key={i}>
                <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4 mb-6">
          <div className="flex items-start gap-3">
            <Checkbox
              data-testid="checkbox-terms"
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-sm text-foreground/80 cursor-pointer"
            >
              I have read and agree to the Terms of Service
            </label>
          </div>
        </Card>
        <Button
          data-testid="button-continue"
          onClick={() => setLocation("/consent")}
          disabled={!agreed}
          className="w-full rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
