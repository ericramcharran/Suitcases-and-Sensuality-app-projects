import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function TermsProcessing() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    setLocation('/consent');
  };

  return <HeartTransition duration={5000} onComplete={handleComplete} />;
}
