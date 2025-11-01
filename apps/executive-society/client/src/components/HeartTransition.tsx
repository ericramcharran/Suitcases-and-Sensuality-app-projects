import { Lock, Key, Link, Circle } from "lucide-react";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HeartTransitionProps {
  duration?: number;
  onComplete?: () => void;
}

// Simple rope knot SVG component
const RopeKnot = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path d="M6 6 Q 12 2, 18 6 Q 22 12, 18 18 Q 12 22, 6 18 Q 2 12, 6 6 Z" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" strokeWidth="2"/>
    <path d="M 9 9 L 15 15 M 15 9 L 9 15" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Collar with leash SVG component
const CollarLeash = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="12" cy="8" r="6" strokeWidth="2.5"/>
    <circle cx="12" cy="8" r="2" fill="currentColor"/>
    <path d="M 12 10 L 12 22" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="8" r="0.8" fill="currentColor"/>
    <circle cx="15" cy="8" r="0.8" fill="currentColor"/>
  </svg>
);

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
      
      {/* Rotating symbols ring - locks, keys, rope knots, collars */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const radius = 250;
          let Icon;
          if (i % 4 === 0) Icon = Lock;
          else if (i % 4 === 1) Icon = Key;
          else if (i % 4 === 2) Icon = () => <RopeKnot className="w-6 h-6" />;
          else Icon = () => <CollarLeash className="w-6 h-6" />;
          
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
              {i % 4 <= 1 ? (
                <Icon className="w-6 h-6 text-rose-400/80" />
              ) : (
                <div className="text-rose-400/80">
                  <Icon />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating chains, rope knots, and collar symbols */}
      {Array.from({ length: 12 }).map((_, i) => {
        const side = i % 4;
        let startX, startY;
        
        if (side === 0) { startX = Math.random() * 100; startY = -10; }
        else if (side === 1) { startX = 110; startY = Math.random() * 100; }
        else if (side === 2) { startX = Math.random() * 100; startY = 110; }
        else { startX = -10; startY = Math.random() * 100; }

        const getIcon = () => {
          if (i % 3 === 0) return <Link className="w-8 h-8" strokeWidth={2} />;
          if (i % 3 === 1) return <RopeKnot className="w-8 h-8" />;
          return <CollarLeash className="w-8 h-8" />;
        };

        return (
          <motion.div
            key={`float-${i}`}
            className="absolute text-rose-400/70"
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
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          >
            {getIcon()}
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
        
        {/* Dramatic ripple waves - alternating lock and collar */}
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
            {i % 2 === 0 ? (
              <Lock className="w-32 h-32 text-primary" strokeWidth={2} />
            ) : (
              <div className="text-primary">
                <CollarLeash className="w-32 h-32" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Orbiting keys and rope knots */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 120;
            return (
              <motion.div
                key={`orbit-${i}`}
                className="absolute text-rose-400/80"
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
                {i % 2 === 0 ? (
                  <Key className="w-6 h-6" />
                ) : (
                  <RopeKnot className="w-6 h-6" />
                )}
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

        {/* Particle burst from center - locks, keys, chains, rope knots, collars */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const getIcon = () => {
            if (i % 5 === 0) return <Lock className="w-4 h-4" />;
            if (i % 5 === 1) return <Key className="w-4 h-4" />;
            if (i % 5 === 2) return <Link className="w-4 h-4" />;
            if (i % 5 === 3) return <RopeKnot className="w-4 h-4" />;
            return <CollarLeash className="w-4 h-4" />;
          };

          return (
            <motion.div
              key={`burst-${i}`}
              className="absolute top-1/2 left-1/2 text-rose-400/70"
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
              {getIcon()}
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
