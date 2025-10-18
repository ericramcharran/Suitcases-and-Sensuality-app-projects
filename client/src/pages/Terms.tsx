import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ArrowDown } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/age-verification")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">Terms of Service</h2>
        <p className="text-muted-foreground mb-6 text-center">
          {hasScrolledToBottom ? "Please accept our terms to continue" : "Scroll to read all terms"}
        </p>
        
        <div className="relative">
          <Card 
            ref={scrollContainerRef}
            className="p-6 mb-6 max-h-96 overflow-y-auto"
            data-testid="terms-content"
          >
            <div className="space-y-4">
              {termsContent.map((item, i) => (
                <div key={i} className="border-b border-border last:border-0 pb-3 last:pb-0">
                  <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Scroll indicator - only show if not scrolled to bottom */}
          {!hasScrolledToBottom && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-gradient-to-t from-muted via-muted to-transparent pt-8 pb-4 px-6 rounded-lg">
                <div className="flex flex-col items-center gap-2 animate-bounce">
                  <ArrowDown className="w-5 h-5 text-red-500" />
                  <p className="text-xs font-medium text-red-500">Scroll to continue</p>
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
        )}
        <div className="flex justify-center">
          <Button
            data-testid="button-continue"
            onClick={() => setLocation("/consent")}
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
