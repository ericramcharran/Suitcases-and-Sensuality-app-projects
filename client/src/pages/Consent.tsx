import { useState } from "react";
import { ChevronLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";

const consentContent = [
  {
    title: '1. Informed Consent',
    content: 'All activities require clear, informed, and enthusiastic consent from all parties.'
  },
  {
    title: '2. Ongoing Communication',
    content: 'Consent is not one-time. It requires ongoing communication and can be withdrawn anytime.'
  },
  {
    title: '3. Negotiation and Boundaries',
    content: 'Negotiate boundaries, limits, and safe words before any activities.'
  },
  {
    title: '4. Personal Responsibility',
    content: 'You are solely responsible for your own safety and decisions.'
  },
  {
    title: '5. Risk Awareness',
    content: 'BDSM carries inherent risks. Educate yourself and take appropriate precautions.'
  },
  {
    title: '6. Meeting Safety',
    content: 'Meet in public first, inform trusted person, maintain own transportation, trust instincts.'
  },
  {
    title: '7. Reporting Violations',
    content: 'Report any non-consensual behavior or violations immediately.'
  }
];

export default function Consent() {
  const [, setLocation] = useLocation();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/terms")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Consent and Safety Agreement
        </h2>
        <p className="text-muted-foreground mb-6 text-center">Consent is the cornerstone of all BDSM activities</p>
        
        <Card className="p-6 mb-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {consentContent.map((item, i) => (
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
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Your Commitment</h3>
              <p className="text-sm text-muted-foreground">
                I understand consent is mandatory, ongoing, and revocable. I commit to practicing safe, consensual interactions.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-6">
          <div className="flex items-start gap-3">
            <Checkbox
              data-testid="checkbox-consent"
              id="consent"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="consent"
              className="text-sm text-foreground/80 cursor-pointer"
            >
              I agree to follow these consent principles and safety guidelines
            </label>
          </div>
        </Card>
        <div className="flex justify-center">
          <Button
            data-testid="button-continue"
            onClick={() => setLocation("/privacy")}
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
