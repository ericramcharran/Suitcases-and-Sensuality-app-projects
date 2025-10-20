import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import mainLogo from "@assets/logo transparent_1760961066655.png";

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="w-full max-w-md"
      >
        <img 
          src={mainLogo}
          alt="The Executive Society"
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </div>
  );
}
