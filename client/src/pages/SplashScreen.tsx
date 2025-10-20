import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import mainLogo from "@assets/logo transparent_1760961066655.png";

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <img 
          src={mainLogo}
          alt="The Executive Society"
          className="w-96 h-auto object-contain"
        />
      </motion.div>
    </div>
  );
}
