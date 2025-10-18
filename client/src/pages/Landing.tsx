import { Shield } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="mb-0">
          <Logo />
        </div>
        <p className="text-muted-foreground text-lg sm:text-xl mb-2 text-center font-light">
          Where Power Meets Passion
        </p>
        <p className="text-foreground/80 text-base mb-8 sm:mb-12 max-w-md text-center leading-relaxed px-2">
          A safe space for authentic BDSM connections. Match, learn, and grow together.
        </p>
        <div className="space-y-3 w-full">
          <Button
            data-testid="button-get-started"
            onClick={() => setLocation("/age-verification")}
            className="w-full rounded-full bg-black text-white hover:bg-primary/20 transition-colors min-h-[48px]"
            size="lg"
          >
            Get Started
          </Button>
          <Button
            data-testid="button-view-subscriptions"
            onClick={() => setLocation("/subscription")}
            variant="outline"
            className="w-full rounded-full border-2 hover:bg-primary/20 transition-colors min-h-[48px]"
            size="lg"
          >
            View Subscriptions
          </Button>
          <Button
            data-testid="button-sign-in"
            onClick={() => setLocation("/login")}
            variant="outline"
            className="w-full rounded-full border-2 hover:bg-primary/20 transition-colors min-h-[48px]"
            size="lg"
          >
            Sign In
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-8 sm:mt-16 flex items-center justify-center gap-2 flex-wrap">
          <Shield className="w-4 h-4" />
          <span>21+ Only · Safe · Consensual · Private</span>
        </div>
      </div>
    </div>
  );
}
