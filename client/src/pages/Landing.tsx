import { useState, useEffect, useMemo } from "react";
import { Shield, Heart, Sparkles, Star, Lock, Crown, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import animatedLogo from "@assets/crop animate logo_1760889514164.mp4";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Memoize particle configuration to prevent re-creation on each render
  const particles = useMemo(() => {
    const icons = [Heart, Flower2, Star, Sparkles, Lock, Crown];
    const colors = [
      'text-rose-400/80',
      'text-pink-400/80',
      'text-purple-400/80',
      'text-blue-400/80',
      'text-indigo-400/80',
      'text-fuchsia-400/80'
    ];
    
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      Icon: icons[i % 6],
      color: colors[i % 6],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.03,
      duration: 6 + Math.random() * 6,
      yOffset: Math.random() * 40 - 20,
      xOffset: Math.random() * 30 - 15,
      scale: 0.9 + Math.random() * 0.5,
    }));
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 relative">
      {/* Animated background particles */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                y: [0, particle.yOffset, 0],
                x: [0, particle.xOffset, 0],
                rotate: [0, 360],
                scale: particle.scale,
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            >
              <particle.Icon className={`w-8 h-8 ${particle.color}`} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Dramatic zoom vignette effect */}
      {isAnimating && (
        <>
          {/* White flash at the start */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 pointer-events-none bg-white"
          />
          
          {/* Fast closing circular vignette */}
          <motion.div
            initial={{ 
              opacity: 0,
              clipPath: "circle(150% at 50% 50%)"
            }}
            animate={{ 
              opacity: 1,
              clipPath: "circle(0% at 50% 50%)"
            }}
            transition={{ 
              opacity: { duration: 0.3 },
              clipPath: { duration: 1.5, ease: "easeInOut", delay: 0.2 }
            }}
            className="absolute inset-0 z-40 pointer-events-none bg-black"
          />
          
          {/* Particle burst effect */}
          <div className="absolute inset-0 z-45 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const distance = 200 + Math.random() * 200;
              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                  }}
                  transition={{
                    duration: 1.0,
                    delay: 0.1,
                    ease: "easeOut"
                  }}
                >
                  {i % 3 === 0 ? (
                    <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
                  ) : i % 3 === 1 ? (
                    <Star className="w-6 h-6 text-purple-500" fill="currentColor" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-blue-500" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10">
        {/* Logo - rises to center with curve, then zooms into keyhole */}
        <motion.div
          className="mb-0 w-full px-4"
          style={{
            transformOrigin: "center 75%"
          }}
          initial={!shouldReduceMotion ? { opacity: 0, scale: 0.5, y: -100 } : false}
          animate={!shouldReduceMotion && !isAnimating ? { 
            opacity: 1, 
            scale: 1, 
            y: 0 
          } : isAnimating ? {
            scale: 5,
            opacity: 0,
            filter: "blur(20px)",
          } : {}}
          transition={!isAnimating ? {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.2,
          } : {
            scale: { duration: 1.5, ease: [0.4, 0.0, 0.2, 1] },
            opacity: { duration: 1.2, delay: 0.3 },
            filter: { duration: 1.0, delay: 0.5 },
          }}
        >
          <motion.div 
            className="flex items-center justify-center overflow-hidden rounded-md mx-auto w-full max-w-md shadow-2xl" 
            style={{ 
              aspectRatio: '19 / 12'
            }}
            animate={!shouldReduceMotion && !isAnimating ? {
              boxShadow: [
                "0 0 20px rgba(236, 72, 153, 0.3)",
                "0 0 40px rgba(168, 85, 247, 0.4)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
              ],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <video 
              src={animatedLogo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center center'
              }}
            />
          </motion.div>
        </motion.div>

        {/* Text and Buttons - fade out on animation */}
        <motion.div
          className="w-full"
          initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : false}
          animate={!shouldReduceMotion && !isAnimating ? { opacity: 1, y: 0 } : isAnimating ? { opacity: 0 } : {}}
          transition={!isAnimating ? { 
            delay: 0.4,
            duration: 0.6,
          } : { 
            duration: 0.5, 
            ease: "easeOut" 
          }}
        >
          <motion.p 
            className="text-muted-foreground text-lg sm:text-xl mb-2 text-center font-light"
            initial={!shouldReduceMotion ? { opacity: 0 } : false}
            animate={!shouldReduceMotion && !isAnimating ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            Where Power Meets Passion
          </motion.p>
          <motion.p 
            className="text-foreground/80 text-base mb-6 sm:mb-8 max-w-md text-center leading-relaxed px-2"
            initial={!shouldReduceMotion ? { opacity: 0 } : false}
            animate={!shouldReduceMotion && !isAnimating ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
          >
            A safe space for authentic BDSM connections. Match, learn, and grow together.
          </motion.p>

          {/* Terms Agreement Checkbox */}
          <motion.div 
            className="mb-6 sm:mb-8 px-2"
            initial={!shouldReduceMotion ? { opacity: 0, y: 10 } : false}
            animate={!shouldReduceMotion && !isAnimating ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/80 backdrop-blur-sm border-2 shadow-lg">
              <Checkbox
                id="terms-agreement"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                data-testid="checkbox-terms-agreement"
                className="mt-0.5"
              />
              <label
                htmlFor="terms-agreement"
                className="text-sm text-foreground leading-relaxed cursor-pointer select-none"
              >
                I am 21 years of age or older and agree to the{" "}
                <Link 
                  href="/terms" 
                  className="text-primary hover:underline font-medium"
                  data-testid="link-terms"
                >
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link 
                  href="/privacy-policy" 
                  className="text-primary hover:underline font-medium"
                  data-testid="link-privacy"
                >
                  Privacy Policy
                </Link>
                . I understand this platform contains adult content and BDSM-related material.
              </label>
            </div>
          </motion.div>

          <div className="space-y-3 w-full">
            <motion.div
              initial={!shouldReduceMotion ? { opacity: 0, x: -20 } : false}
              animate={!shouldReduceMotion && !isAnimating ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.9 }}
            >
              <Button
                data-testid="button-get-started"
                onClick={() => handleNavigation("/age-verification")}
                disabled={isAnimating || !agreedToTerms}
                className="w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                size="lg"
              >
                Get Started
              </Button>
            </motion.div>
            <motion.div
              initial={!shouldReduceMotion ? { opacity: 0, x: -20 } : false}
              animate={!shouldReduceMotion && !isAnimating ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.0 }}
            >
              <Button
                data-testid="button-view-subscriptions"
                onClick={() => handleNavigation("/subscription")}
                disabled={isAnimating || !agreedToTerms}
                variant="outline"
                className="w-full rounded-full border-2 hover:bg-primary/20 hover:scale-105 transition-all duration-300 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                size="lg"
              >
                View Subscriptions
              </Button>
            </motion.div>
            <motion.div
              initial={!shouldReduceMotion ? { opacity: 0, x: -20 } : false}
              animate={!shouldReduceMotion && !isAnimating ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.1 }}
            >
              <Button
                data-testid="button-sign-in"
                onClick={() => handleNavigation("/login")}
                disabled={isAnimating || !agreedToTerms}
                variant="outline"
                className="w-full rounded-full border-2 hover:bg-primary/20 hover:scale-105 transition-all duration-300 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                size="lg"
              >
                Sign In
              </Button>
            </motion.div>
          </div>
          <motion.div 
            className="text-center text-sm text-muted-foreground mt-8 sm:mt-16 flex items-center justify-center gap-2 flex-wrap"
            initial={!shouldReduceMotion ? { opacity: 0 } : false}
            animate={!shouldReduceMotion && !isAnimating ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
          >
            <Shield className="w-4 h-4" />
            <span>21+ Only · Safe · Consensual · Private</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
