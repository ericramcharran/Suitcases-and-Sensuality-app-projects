import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SparkleEffectProps {
  show: boolean;
}

export function SparkleEffect({ show }: SparkleEffectProps) {
  const shouldReduceMotion = useReducedMotion();
  
  if (!show || shouldReduceMotion) return null;

  const sparklePositions = [
    { top: "10%", left: "10%" },
    { top: "20%", right: "15%" },
    { top: "60%", left: "5%" },
    { top: "70%", right: "10%" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparklePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
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
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </motion.div>
      ))}
    </div>
  );
}
