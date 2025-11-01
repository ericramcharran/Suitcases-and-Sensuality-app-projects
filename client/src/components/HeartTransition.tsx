import { Lock, Key, Link, Circle } from "lucide-react";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HeartTransitionProps {
  duration?: number;
  onComplete?: () => void;
}

export default function HeartTransition({ duration = 10000, onComplete }: HeartTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (shouldReduceMotion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950/20 via-background to-background dark:from-background dark:via-background dark:to-background flex items-center justify-center p-10">
        <Lock className="w-24 h-24 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950/20 via-background to-background dark:from-gray-950 dark:via-rose-950/10 dark:to-background flex items-center justify-center p-10 relative overflow-hidden">
      
      {/* Rotating lock and key ring */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 250;
          const Icon = i % 2 === 0 ? Lock : Key;
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                top: `calc(50% + ${Math.sin(angle) * radius}px)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            >
              <Icon className="w-6 h-6 text-rose-400/80" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating chains and links */}
      {Array.from({ length: 8 }).map((_, i) => {
        const side = i % 4;
        let startX, startY;
        
        if (side === 0) { startX = Math.random() * 100; startY = -10; }
        else if (side === 1) { startX = 110; startY = Math.random() * 100; }
        else if (side === 2) { startX = Math.random() * 100; startY = 110; }
        else { startX = -10; startY = Math.random() * 100; }

        return (
          <motion.div
            key={`float-${i}`}
            className="absolute"
            initial={{
              left: `${startX}%`,
              top: `${startY}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              left: "50%",
              top: "50%",
              opacity: [0, 0.6, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          >
            <Link 
              className="w-8 h-8 text-rose-400/70" 
              strokeWidth={2}
            />
          </motion.div>
        );
      })}

      {/* Pulsing background circles - representing collars */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 100 + i * 100,
            height: 100 + i * 100,
            border: "2px solid rgba(225, 29, 72, 0.3)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Center lock container */}
      <div className="relative flex items-center justify-center w-full max-w-md aspect-[9/16]">
        
        {/* Dramatic ripple waves */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={`ripple-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 4],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          >
            <Lock 
              className="w-32 h-32 text-primary"
              strokeWidth={2}
            />
          </motion.div>
        ))}

        {/* Orbiting keys */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 120;
            return (
              <motion.div
                key={`key-${i}`}
                className="absolute"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                  top: `calc(50% + ${Math.sin(angle) * radius}px)`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Key className="w-6 h-6 text-rose-400/80" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main pulsing lock with glow */}
        <motion.div
          className="relative z-10"
          animate={{
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 blur-2xl"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
          >
            <Lock 
              className="w-32 h-32 text-primary" 
            />
          </motion.div>
          
          {/* Solid lock */}
          <Lock 
            className="w-32 h-32 text-primary relative" 
          />
        </motion.div>

        {/* Particle burst from center - alternating locks and chains */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const Icon = i % 3 === 0 ? Lock : i % 3 === 1 ? Key : Link;
          return (
            <motion.div
              key={`burst-${i}`}
              className="absolute top-1/2 left-1/2"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: Math.cos(angle) * 150,
                y: Math.sin(angle) * 150,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5 + (i * 0.05),
                ease: "easeOut",
              }}
            >
              <Icon className="w-4 h-4 text-rose-400/70" />
            </motion.div>
          );
        })}
      </div>

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(225, 29, 72, 0.1) 100%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
