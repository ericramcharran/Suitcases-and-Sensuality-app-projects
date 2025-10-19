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
        className="flex items-center justify-center overflow-hidden border-2 border-primary rounded-md" 
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
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        />
      </div>
    </div>
  );
}
