import { useEffect } from "react";
import { useLocation } from "wouter";
import animatedLogo from "@assets/crop animate logo_1760889514164.mp4";

export default function Splash() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/landing");
    }, 4000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div 
        className="flex items-center justify-center overflow-hidden rounded-md w-full max-w-2xl" 
        style={{ 
          aspectRatio: '19 / 12'
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
      </div>
    </div>
  );
}
