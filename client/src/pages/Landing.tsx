import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import logoImage from "@assets/logo-1_1760791670509.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    setDestination(path);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating && destination) {
      // Navigate after animation completes (2500ms total)
      const timer = setTimeout(() => {
        setLocation(destination);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, destination, setLocation]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      {/* Keyhole vignette that closes in during zoom */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 z-50 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, transparent 0%, transparent 10%, black 40%)",
          }}
        />
      )}

      <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10">
        {/* Logo - rises to center, then zooms into keyhole */}
        <motion.div
          className="mb-0 w-full"
          style={{
            transformOrigin: "center 35%"
          }}
          animate={isAnimating ? {
            y: "calc(50vh - 35%)",
            scale: 10,
          } : {
            y: 0,
            scale: 1,
          }}
          transition={{
            y: { duration: 0.8, ease: "easeOut" },
            scale: { duration: 1.6, delay: 0.8, ease: "easeIn" },
          }}
        >
          <div className="flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="The Executive Society Logo" 
              className="w-96 sm:w-[480px] h-auto object-contain"
              style={{
                maxHeight: '240px',
                objectPosition: 'center'
              }}
            />
          </div>
        </motion.div>

        {/* Text and Buttons - fade out on animation */}
        <motion.div
          className="w-full"
          animate={isAnimating ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-muted-foreground text-lg sm:text-xl mb-2 text-center font-light">
            Where Power Meets Passion
          </p>
          <p className="text-foreground/80 text-base mb-8 sm:mb-12 max-w-md text-center leading-relaxed px-2">
            A safe space for authentic BDSM connections. Match, learn, and grow together.
          </p>
          <div className="space-y-3 w-full">
            <Button
              data-testid="button-get-started"
              onClick={() => handleNavigation("/age-verification")}
              disabled={isAnimating}
              className="w-full rounded-full bg-black text-white hover:bg-primary/20 transition-colors min-h-[48px]"
              size="lg"
            >
              Get Started
            </Button>
            <Button
              data-testid="button-view-subscriptions"
              onClick={() => handleNavigation("/subscription")}
              disabled={isAnimating}
              variant="outline"
              className="w-full rounded-full border-2 hover:bg-primary/20 transition-colors min-h-[48px]"
              size="lg"
            >
              View Subscriptions
            </Button>
            <Button
              data-testid="button-sign-in"
              onClick={() => handleNavigation("/login")}
              disabled={isAnimating}
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
        </motion.div>
      </div>
    </div>
  );
}
