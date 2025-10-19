import { useEffect } from "react";
import { useLocation } from "wouter";
import animatedLogo from "@assets/animated-logo2_1760887393286.mp4";

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
        className="flex items-center justify-center overflow-hidden border-2 border-primary rounded-md" 
        style={{ 
          marginTop: '2cm',
          width: '380px',
          height: '240px'
        }}
      >
        <video 
          src={animatedLogo} 
          autoPlay
          muted
          playsInline
          style={{
            width: 'calc(100% + 1cm)',
            height: 'calc(100% + 1cm)',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: 'scale(1.2)'
          }}
        />
      </div>
    </div>
  );
}
