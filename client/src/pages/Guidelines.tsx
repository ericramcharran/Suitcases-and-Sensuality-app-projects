import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";

const guidelinesContent = [
  { title: '1. Respect', dos: 'Treat all with dignity', donts: 'No insults outside scenes' },
  { title: '2. Consent', dos: 'Obtain clear consent always', donts: 'No pressure or coercion' },
  { title: '3. Honesty', dos: 'Be truthful about experience', donts: 'No catfishing or lying' },
  { title: '4. Privacy', dos: 'Keep conversations confidential', donts: 'No screenshots or outing' },
  { title: '5. Safety', dos: 'Prioritize wellbeing', donts: 'No unsafe practices' },
  { title: '6. No Harassment', dos: 'Accept rejection gracefully', donts: 'No stalking or spam' },
  { title: '7. Inclusive', dos: 'Welcome all identities', donts: 'No discrimination or hate' },
  { title: '8. Appropriate Content', dos: 'Keep it legal', donts: 'No illegal or extreme content' },
  { title: '9. No Solicitation', dos: 'Build genuine connections', donts: 'No commercial promotion' },
  { title: '10. Report Issues', dos: 'Help maintain safety', donts: "Don't ignore red flags" },
];

export default function Guidelines() {
  const [, setLocation] = useLocation();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/privacy")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light mb-6 text-foreground">Community Guidelines</h2>
        <Card className="p-6 mb-6 max-h-96 overflow-y-auto">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">Our Community Values</h3>
              <p>Built on respect, consent, and safety.</p>
            </div>
            {guidelinesContent.map((item, i) => (
              <div key={i}>
                <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                <p className="text-green-600 text-xs">DO: {item.dos}</p>
                <p className="text-destructive text-xs">DON'T: {item.donts}</p>
              </div>
            ))}
            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <h4 className="font-medium text-destructive mb-2">Zero Tolerance</h4>
              <p className="text-destructive text-xs">
                Non-consent, harassment, hate speech, illegal activity, minors, threats, doxxing.
              </p>
            </Card>
            <Card className="p-4 bg-blue-500/10 border-blue-500/20">
              <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Emergency Resources</h4>
              <p className="text-blue-600 dark:text-blue-400 text-xs">
                Sexual Assault: 1-800-656-4673 | Domestic Violence: 1-800-799-7233 | Crisis: Text HOME to 741741
              </p>
            </Card>
          </div>
        </Card>
        <Card className="p-4 mb-6">
          <div className="flex items-start gap-3">
            <Checkbox
              data-testid="checkbox-guidelines"
              id="guidelines"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="guidelines"
              className="text-sm text-foreground/80 cursor-pointer"
            >
              I agree to follow Community Guidelines
            </label>
          </div>
        </Card>
        <Button
          data-testid="button-continue"
          onClick={() => setLocation("/signup")}
          disabled={!agreed}
          className="w-full rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
