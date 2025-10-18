import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Shield, Phone, ArrowDown } from "lucide-react";
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
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Check if scrolled to bottom (with 5px threshold for smoother detection)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      
      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Check initial state in case content is already fully visible
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasScrolledToBottom]);

  // Auto-navigate when checkbox is checked
  useEffect(() => {
    if (agreed) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setLocation("/guidelines-processing");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [agreed, setLocation]);

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
        <p className="text-muted-foreground mb-6 text-center">
          {hasScrolledToBottom ? "Please accept our community guidelines to continue" : "Scroll to read all guidelines"}
        </p>
        
        <div className="relative">
          <Card 
            ref={scrollContainerRef}
            className="p-6 mb-6 max-h-96 overflow-y-auto"
            data-testid="guidelines-content"
          >
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

              <div className="border-b border-border pb-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Zero Tolerance Policy</h3>
                    <p className="text-sm text-muted-foreground">
                      Non-consent, harassment, hate speech, illegal activity, minors, threats, and doxxing result in immediate account termination.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
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
              </div>
            </div>
          </Card>
          
          {/* Scroll indicator - only show if not scrolled to bottom */}
          {!hasScrolledToBottom && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-gradient-to-t from-muted via-muted to-transparent pt-8 pb-4 px-6 rounded-lg">
                <div className="flex flex-col items-center gap-2 animate-bounce">
                  <ArrowDown className="w-5 h-5 text-primary" />
                  <p className="text-xs font-medium text-primary">Scroll to continue</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checkbox - only appears after scrolling */}
        {hasScrolledToBottom && (
          <Card className="p-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        )}
      </div>
    </div>
  );
}
