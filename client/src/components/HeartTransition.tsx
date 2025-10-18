import { Heart } from "lucide-react";
import { useEffect } from "react";

interface HeartTransitionProps {
  duration?: number; // Duration in milliseconds
  onComplete?: () => void;
}

export default function HeartTransition({ duration = 10000, onComplete }: HeartTransitionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-10">
        <div className="w-full max-w-md aspect-[9/16] flex items-center justify-center border border-black rounded-lg">
          <div className="relative flex items-center justify-center">
            {/* Ripple outlines */}
            {[1, 2, 3, 4].map((i) => (
              <Heart 
                key={i}
                className="absolute w-24 h-24 text-red-500 animate-ripple"
                fill="none"
                strokeWidth={2}
                stroke="currentColor"
                style={{ animationDelay: `${(i - 1) * 2.5}s` }}
              />
            ))}
            {/* Main beating heart */}
            <Heart 
              className="w-24 h-24 text-red-500 animate-heartbeat relative z-10" 
              fill="currentColor"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { 
            transform: scale(1);
          }
          10%, 30% { 
            transform: scale(1.3);
          }
          20%, 40% { 
            transform: scale(1);
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(5);
            opacity: 0;
          }
        }
        
        .animate-heartbeat { 
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        .animate-ripple {
          animation: ripple 10s ease-out infinite;
        }
      `}</style>
    </>
  );
}
