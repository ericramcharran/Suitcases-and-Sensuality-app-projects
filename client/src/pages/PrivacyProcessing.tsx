import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function PrivacyProcessing() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    setLocation('/guidelines');
  };

  return <HeartTransition duration={5000} onComplete={handleComplete} />;
}
