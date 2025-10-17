import { useState } from "react";
import { ChevronLeft, Shield, Phone } from "lucide-react";
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
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">Community Guidelines</h2>
        <p className="text-muted-foreground mb-6 text-center">Built on respect, consent, and safety</p>
        
        <Card className="p-6 mb-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {guidelinesContent.map((item, i) => (
              <div key={i} className="border-b border-border last:border-0 pb-3 last:pb-0">
                <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/80">✓ {item.dos}</p>
                  <p className="text-sm text-muted-foreground">✗ {item.donts}</p>
                </div>
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
              <h3 className="font-medium text-foreground mb-1">Zero Tolerance Policy</h3>
              <p className="text-sm text-muted-foreground">
                Non-consent, harassment, hate speech, illegal activity, minors, threats, and doxxing result in immediate account termination.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 bg-gradient-to-r from-black/5 to-red-500/5 border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Emergency Resources</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Sexual Assault: 1-800-656-4673</p>
                <p>Domestic Violence: 1-800-799-7233</p>
                <p>Crisis Text Line: Text HOME to 741741</p>
              </div>
            </div>
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

        <div className="flex justify-center">
          <Button
            data-testid="button-continue"
            onClick={() => setLocation("/signup")}
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
