import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function PersonalityTestProcessing() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    setLocation('/personality-result');
  };

  return <HeartTransition duration={5000} onComplete={handleComplete} />;
}
