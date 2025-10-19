import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import animatedLogo from "@assets/animate-logo_1760885812763.mp4";

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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute inset-0 z-40 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 0%, transparent 5%, black 30%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="absolute inset-0 z-50 pointer-events-none bg-black"
          />
        </>
      )}

      <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10">
        {/* Logo - rises to center with curve, then zooms into keyhole */}
        <motion.div
          className="mb-0 w-full"
          style={{
            transformOrigin: "center 75%",
            marginTop: '2cm'
          }}
          animate={isAnimating ? {
            y: "calc(50vh - 75%)",
            x: [0, -15, 5, 0],
            scale: 60,
            rotate: [0, -2, 3, 5],
          } : {
            y: 0,
            x: 0,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            y: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
            x: { duration: 2.0, delay: 0.8, ease: "easeInOut" },
            scale: { duration: 2.0, delay: 0.8, ease: [0.4, 0.0, 0.2, 1] },
            rotate: { duration: 2.0, delay: 0.8, ease: "easeInOut" },
          }}
        >
          <div className="flex items-center justify-center">
            <video 
              src={animatedLogo}
              autoPlay
              muted
              playsInline
              className="w-96 sm:w-[480px] h-auto object-contain"
              style={{
                maxHeight: '240px',
                objectPosition: 'center',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                willChange: 'transform',
              } as React.CSSProperties}
            />
          </div>
        </motion.div>

        {/* Text and Buttons - fade out on animation */}
        <motion.div
          className="w-full"
          style={{
            marginTop: '-2cm'
          }}
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
