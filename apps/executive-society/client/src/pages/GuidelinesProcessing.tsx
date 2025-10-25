import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function GuidelinesProcessing() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    setLocation('/background-check');
  };

  return <HeartTransition duration={5000} onComplete={handleComplete} />;
}
