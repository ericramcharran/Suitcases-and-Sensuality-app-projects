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
      <div className="flex items-center justify-center" style={{ marginTop: '2cm' }}>
        <video 
          src={animatedLogo} 
          autoPlay
          muted
          playsInline
          className="w-96 sm:w-[480px] h-auto object-contain border-2 border-primary rounded-md"
          style={{
            maxHeight: '240px',
            objectPosition: 'center'
          }}
        />
      </div>
    </div>
  );
}
