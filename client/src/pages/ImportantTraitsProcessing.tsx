import { useLocation } from "wouter";
import HeartTransition from "@/components/HeartTransition";

export default function ImportantTraitsProcessing() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    const userRole = localStorage.getItem('userRole') || '';
    const isDominant = userRole === 'Dominant' || userRole === 'Domme' || userRole === 'Master';
    
    if (isDominant) {
      setLocation('/subscription-dom');
    } else {
      setLocation('/subscription-sub');
    }
  };

  return <HeartTransition duration={5000} onComplete={handleComplete} />;
}
