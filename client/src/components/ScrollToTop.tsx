import { useEffect } from "react";
import { useLocation } from "wouter";

export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll immediately
    window.scrollTo(0, 0);
    
    // Also scroll after a brief delay to handle page transitions
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
}
