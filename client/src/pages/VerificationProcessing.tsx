import { useEffect } from "react";
import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function VerificationProcessing() {
  const [, setLocation] = useLocation();

  // Get verification data from sessionStorage
  const month = localStorage.getItem('verificationMonth');
  const day = localStorage.getItem('verificationDay');
  const year = localStorage.getItem('verificationYear');
  const hasUploadedId = localStorage.getItem('hasUploadedId') === 'true';

  useEffect(() => {
    // If no verification data, redirect back (only check once on mount)
    if (!month || !day || !year || !hasUploadedId) {
      console.log('Missing verification data, redirecting back');
      const redirectTimer = setTimeout(() => {
        setLocation('/age-verification');
      }, 500);
      return () => clearTimeout(redirectTimer);
    }
  }, []);

  const handleComplete = () => {
    // Mark as verified first
    localStorage.setItem('ageVerified', 'true');
    localStorage.setItem('dateOfBirth', `${month}/${day}/${year}`);
    
    // Clear verification data
    sessionStorage.removeItem('verificationMonth');
    sessionStorage.removeItem('verificationDay');
    sessionStorage.removeItem('verificationYear');
    sessionStorage.removeItem('hasUploadedId');
    
    // Redirect to terms
    setLocation('/terms');
  };

  return <HeartTransition duration={10000} onComplete={handleComplete} />;
}
