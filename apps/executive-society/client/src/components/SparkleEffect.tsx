import { motion, useReducedMotion } from "framer-motion";
import { Lock, Key, Link } from "lucide-react";

interface SparkleEffectProps {
  show: boolean;
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

export function SparkleEffect({ show }: SparkleEffectProps) {
  const shouldReduceMotion = useReducedMotion();
  
  if (!show || shouldReduceMotion) return null;

  const iconPositions = [
    { top: "10%", left: "10%" },
    { top: "20%", right: "15%" },
    { top: "60%", left: "5%" },
    { top: "70%", right: "10%" },
    { top: "40%", left: "15%" },
    { top: "50%", right: "20%" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {iconPositions.map((pos, i) => {
        const getIcon = () => {
          if (i % 6 === 0) return <Lock className="w-4 h-4" />;
          if (i % 6 === 1) return <Key className="w-4 h-4" />;
          if (i % 6 === 2) return <Link className="w-4 h-4" />;
          if (i % 6 === 3) return <RopeKnot className="w-4 h-4" />;
          if (i % 6 === 4) return <CollarLeash className="w-4 h-4" />;
          return <Lock className="w-4 h-4" />;
        };

        return (
          <motion.div
            key={i}
            className="absolute text-rose-400/80"
            style={pos}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          >
            {getIcon()}
          </motion.div>
        );
      })}
    </div>
  );
}
