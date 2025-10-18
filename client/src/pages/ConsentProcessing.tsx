import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function ConsentProcessing() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    setLocation('/privacy');
  };

  return <HeartTransition duration={5000} onComplete={handleComplete} />;
}
