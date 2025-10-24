import { motion, useReducedMotion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface ParticleEffectProps {
  type: "like" | "pass";
  trigger: number;
}

export function ParticleEffect({ type, trigger }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (trigger === 0 || shouldReduceMotion) return;

    // Spawn particles near the button location (bottom corners)
    const isLike = type === "like";
    const centerX = isLike ? window.innerWidth - 80 : 80;
    const centerY = window.innerHeight - 80;

    // Reduced to 6 particles for better performance
    const newParticles: Particle[] = Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const distance = 100 + Math.random() * 100;
      return {
        id: Date.now() + i,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.6
      };
    });

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 600);

    return () => clearTimeout(timer);
  }, [trigger, type, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  const Icon = type === "like" ? Heart : X;
  const color = type === "like" ? "#10b981" : "#ef4444";
  const centerX = type === "like" ? window.innerWidth - 80 : 80;
  const centerY = window.innerHeight - 80;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: centerX,
            y: centerY,
            opacity: 1,
            scale: 0,
            rotate: 0
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: particle.scale,
            rotate: particle.rotation
          }}
          transition={{
            duration: 0.6,
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
      ))}
    </div>
  );
}
