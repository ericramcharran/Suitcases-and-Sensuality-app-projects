import { useState } from "react";
import { ChevronLeft } from "lucide-react";
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
        <h2 className="text-3xl font-light mb-6 text-foreground">
          Consent and Safety Agreement
        </h2>
        <Card className="p-6 mb-6 max-h-96 overflow-y-auto">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">Understanding Consent</h3>
              <p>Consent is the cornerstone of all BDSM activities.</p>
            </div>
            {consentContent.map((item, i) => (
              <div key={i}>
                <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))}
            <Card className="p-4 bg-muted border-border">
              <p className="font-medium text-foreground mb-2">Your Commitment:</p>
              <p className="text-sm">
                I understand consent is mandatory, ongoing, and revocable. I commit to practicing safe, consensual interactions.
              </p>
            </Card>
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
        <Button
          data-testid="button-continue"
          onClick={() => setLocation("/privacy")}
          disabled={!agreed}
          className="w-full rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
