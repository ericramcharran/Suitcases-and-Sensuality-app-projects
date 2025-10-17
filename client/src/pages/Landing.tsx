import { Shield } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <h1 className="text-5xl font-light mb-3 text-foreground text-center">
        The Executive Society
      </h1>
      <p className="text-muted-foreground text-lg mb-12 text-center">
        Where Power Meets Passion
      </p>
      <p className="text-foreground/80 mb-12 max-w-md text-center leading-relaxed">
        A safe space for authentic BDSM connections. Match, learn, and grow together.
      </p>
      <div className="space-y-4 w-full max-w-sm">
        <Button
          data-testid="button-get-started"
          onClick={() => setLocation("/age-verification")}
          className="w-full rounded-full bg-black text-white hover:bg-red-500 transition-colors"
          size="lg"
        >
          Get Started
        </Button>
        <Button
          data-testid="button-view-subscriptions"
          onClick={() => setLocation("/subscription")}
          variant="outline"
          className="w-full rounded-full border-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
          size="lg"
        >
          View Subscriptions
        </Button>
        <Button
          data-testid="button-sign-in"
          onClick={() => setLocation("/discover")}
          variant="outline"
          className="w-full rounded-full border-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
          size="lg"
        >
          Sign In
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground mt-16 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        <span>21+ Only · Safe · Consensual · Private</span>
      </div>
    </div>
  );
}
