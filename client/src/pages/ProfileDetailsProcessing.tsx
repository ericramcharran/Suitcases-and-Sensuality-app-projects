import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function ProfileDetailsProcessing() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    setLocation('/personality-test');
  };

  return <HeartTransition duration={5000} onComplete={handleComplete} />;
}
