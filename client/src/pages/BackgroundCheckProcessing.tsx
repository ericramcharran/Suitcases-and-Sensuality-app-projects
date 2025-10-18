import { useEffect } from "react";
import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function BackgroundCheckProcessing() {
  const [, setLocation] = useLocation();

  // Get data from sessionStorage
  const hasSubmitted = localStorage.getItem('backgroundCheckSubmitted') === 'true';

  useEffect(() => {
    // If no submission data, redirect back (only check once on mount)
    if (!hasSubmitted) {
      console.log('Missing background check data, redirecting back');
      const redirectTimer = setTimeout(() => {
        setLocation('/background-check');
      }, 500);
      return () => clearTimeout(redirectTimer);
    }
  }, []);

  const handleComplete = () => {
    // Mark as verified first
    localStorage.setItem('backgroundCheckComplete', 'true');
    localStorage.setItem('backgroundCheckStatus', 'clear');
    
    // Clear background check data
    sessionStorage.removeItem('backgroundCheckSubmitted');
    sessionStorage.removeItem('backgroundCheckName');
    
    // Get user role to determine which subscription page
    const userRole = localStorage.getItem('userRole') || '';
    const isDominant = userRole === 'Dominant' || userRole === 'Domme' || userRole === 'Master';
    
    // Redirect to appropriate subscription page based on role
    if (isDominant) {
      setLocation('/subscription-dom');
    } else {
      setLocation('/subscription-sub');
    }
  };

  return <HeartTransition duration={10000} onComplete={handleComplete} />;
}
