import { motion, useReducedMotion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  type: "heart" | "sparkle" | "star";
  delay: number;
}

interface CelebrationEffectProps {
  show: boolean;
}

export function CelebrationEffect({ show }: CelebrationEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!show || shouldReduceMotion) return;

    // Create 20 celebration particles
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => {
      const types: Array<"heart" | "sparkle" | "star"> = ["heart", "sparkle", "star"];
      return {
        id: Date.now() + i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.8,
        type: types[Math.floor(Math.random() * types.length)],
        delay: Math.random() * 0.5
      };
    });

    setParticles(newParticles);
  }, [show, shouldReduceMotion]);

  if (!show || shouldReduceMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => {
        const Icon = particle.type === "heart" ? Heart : particle.type === "sparkle" ? Sparkles : Star;
        const color = particle.type === "heart" ? "#ec4899" : particle.type === "sparkle" ? "#fbbf24" : "#a855f7";

        return (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              opacity: 0,
              scale: 0,
              rotate: 0
            }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              scale: particle.scale,
              rotate: particle.rotation
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: particle.delay,
              ease: "easeOut"
            }}
            style={{ position: "absolute" }}
          >
            <Icon 
              className="w-6 h-6"
              style={{ color }}
              fill={color}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
