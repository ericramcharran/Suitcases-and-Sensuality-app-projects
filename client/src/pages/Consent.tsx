import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Shield, ArrowDown } from "lucide-react";
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
        setLocation("/privacy");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [agreed, setLocation]);

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
        <p className="text-muted-foreground mb-6 text-center">
          {hasScrolledToBottom ? "Please accept our safety principles to continue" : "Scroll to read all safety guidelines"}
        </p>
        
        <div className="relative">
          <Card 
            ref={scrollContainerRef}
            className="p-6 mb-6 max-h-96 overflow-y-auto"
            data-testid="consent-content"
          >
            <div className="space-y-4">
              {consentContent.map((item, i) => (
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

        {/* Checkbox - only appears after scrolling */}
        {hasScrolledToBottom && (
          <Card className="p-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        )}
      </div>
    </div>
  );
}
