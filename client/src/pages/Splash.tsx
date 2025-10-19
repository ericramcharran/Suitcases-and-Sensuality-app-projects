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
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </div>
    </div>
  );
}
