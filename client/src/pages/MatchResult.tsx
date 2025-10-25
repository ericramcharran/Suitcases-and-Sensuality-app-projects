import { Heart, MessageCircle, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { CelebrationEffect } from "@/components/CelebrationEffect";
import { useState, useEffect } from "react";

export default function MatchResult() {
  const [, setLocation] = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Trigger celebration effect on mount
    setShowCelebration(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-background dark:via-background dark:to-background flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Celebration particles */}
      <CelebrationEffect show={showCelebration} />

      {/* Animated background sparkles */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 2, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="max-w-md w-full relative z-10">
        {/* Header with icon */}
        <motion.div
          initial={!shouldReduceMotion ? { scale: 0, rotate: -180 } : false}
          animate={!shouldReduceMotion ? { scale: 1, rotate: 0 } : {}}
          transition={!shouldReduceMotion ? {
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          } : {}}
          className="text-center mb-8"
        >
          <motion.div
            animate={!shouldReduceMotion ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={!shouldReduceMotion ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            } : {}}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
          >
            <Heart className="w-12 h-12 text-white fill-white" />
          </motion.div>

          <motion.h2
            initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : false}
            animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
            transition={!shouldReduceMotion ? { delay: 0.4 } : {}}
            className="text-4xl sm:text-5xl font-light text-foreground mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            It's a Match!
          </motion.h2>
          <motion.p
            initial={!shouldReduceMotion ? { opacity: 0 } : false}
            animate={!shouldReduceMotion ? { opacity: 1 } : {}}
            transition={!shouldReduceMotion ? { delay: 0.6 } : {}}
            className="text-muted-foreground text-base sm:text-lg"
          >
            You and Alex both liked each other
          </motion.p>
        </motion.div>

        {/* Profiles with connecting heart */}
        <motion.div
          initial={!shouldReduceMotion ? { opacity: 0, y: 50 } : false}
          animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
          transition={!shouldReduceMotion ? { delay: 0.8, type: "spring", stiffness: 100 } : {}}
        >
          <Card className="p-6 mb-6 relative overflow-visible shadow-xl">
            {/* Profile comparison with animated heart connector */}
            <div className="flex items-center justify-between mb-8 relative">
              {/* Left profile (You) */}
              <motion.div
                initial={!shouldReduceMotion ? { x: -100, opacity: 0 } : false}
                animate={!shouldReduceMotion ? { x: 0, opacity: 1 } : {}}
                transition={!shouldReduceMotion ? { delay: 1, type: "spring", stiffness: 100 } : {}}
                className="flex flex-col items-center"
              >
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary shadow-lg">
                  <AvatarFallback className="text-2xl sm:text-3xl bg-primary text-primary-foreground">
                    Y
                  </AvatarFallback>
                </Avatar>
                <p className="mt-2 text-sm font-medium text-muted-foreground">You</p>
              </motion.div>

              {/* Animated heart in center */}
              <motion.div
                initial={!shouldReduceMotion ? { scale: 0, rotate: 0 } : false}
                animate={!shouldReduceMotion ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                } : {}}
                transition={!shouldReduceMotion ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                } : {}}
                className="absolute left-1/2 top-8 sm:top-10 transform -translate-x-1/2 z-20"
              >
                <div className="relative">
                  <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500 fill-pink-500 drop-shadow-2xl" />
                  {!shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    >
                      <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400 fill-pink-400" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Right profile (Match) */}
              <motion.div
                initial={!shouldReduceMotion ? { x: 100, opacity: 0 } : false}
                animate={!shouldReduceMotion ? { x: 0, opacity: 1 } : {}}
                transition={!shouldReduceMotion ? { delay: 1, type: "spring", stiffness: 100 } : {}}
                className="flex flex-col items-center"
              >
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-purple-500 shadow-lg">
                  <AvatarFallback className="text-2xl sm:text-3xl bg-purple-500 text-white">
                    A
                  </AvatarFallback>
                </Avatar>
                <p className="mt-2 text-sm font-medium text-muted-foreground">Alex</p>
              </motion.div>
            </div>

            {/* Match info */}
            <motion.div
              initial={!shouldReduceMotion ? { opacity: 0 } : false}
              animate={!shouldReduceMotion ? { opacity: 1 } : {}}
              transition={!shouldReduceMotion ? { delay: 1.2 } : {}}
              className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-xl"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-light text-foreground" data-testid="text-match-name">
                  Alex, 28
                </h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium">submissive</p>
              </div>
              <div className="text-center">
                <motion.div
                  initial={!shouldReduceMotion ? { scale: 0 } : false}
                  animate={!shouldReduceMotion ? { scale: 1 } : {}}
                  transition={!shouldReduceMotion ? { delay: 1.4, type: "spring", stiffness: 200 } : {}}
                  className="text-3xl sm:text-4xl font-light bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                >
                  95%
                </motion.div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  Match
                </div>
              </div>
            </motion.div>

            {/* Common traits */}
            <motion.div
              initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : false}
              animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={!shouldReduceMotion ? { delay: 1.4 } : {}}
            >
              <Card className="p-4 bg-muted/50 border-border mb-6">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  What You Have in Common
                </h4>
                <ul className="text-sm text-foreground/80 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Both seeking long-term commitment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>High emotional intelligence scores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Compatible relationship styles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Similar communication preferences</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : false}
              animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={!shouldReduceMotion ? { delay: 1.6 } : {}}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                data-testid="button-send-message"
                onClick={() => setLocation("/messages")}
                size="lg"
                className="flex-1 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </Button>
              <Button
                data-testid="button-keep-swiping"
                onClick={() => setLocation("/discover")}
                variant="outline"
                size="lg"
                className="flex-1 rounded-full text-base font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart className="w-5 h-5 mr-2" />
                Keep Swiping
              </Button>
            </motion.div>
          </Card>
        </motion.div>

        {/* Safety reminder */}
        <motion.div
          initial={!shouldReduceMotion ? { opacity: 0 } : false}
          animate={!shouldReduceMotion ? { opacity: 1 } : {}}
          transition={!shouldReduceMotion ? { delay: 1.8 } : {}}
        >
          <Card className="p-4 bg-blue-500/10 border-blue-500/20">
            <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
              Remember: Always meet in public first and practice safe, consensual interactions
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
