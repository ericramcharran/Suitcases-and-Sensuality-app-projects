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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div 
        className="flex items-center justify-center overflow-hidden rounded-md" 
        style={{ 
          marginTop: '2cm',
          width: '760px',
          height: '480px'
        }}
      >
        <video 
          src={animatedLogo} 
          autoPlay
          muted
          playsInline
          style={{
            width: '120%',
            height: '120%',
            objectFit: 'cover',
            objectPosition: 'center center',
            filter: 'brightness(1.3) saturate(0.3) contrast(1.1)'
          }}
        />
      </div>
    </div>
  );
}
