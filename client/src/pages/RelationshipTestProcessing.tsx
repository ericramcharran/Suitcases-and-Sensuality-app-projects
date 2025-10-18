import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function RelationshipTestProcessing() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    setLocation('/relationship-result');
  };

  return <HeartTransition duration={5000} onComplete={handleComplete} />;
}
