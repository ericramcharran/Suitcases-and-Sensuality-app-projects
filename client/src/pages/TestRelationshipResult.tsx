import { useEffect } from "react";
import { useLocation } from "wouter";

export default function TestRelationshipResult() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Set up test data in session storage
    sessionStorage.setItem('userRole', 'Master');
    sessionStorage.setItem('personalityResult', JSON.stringify({
      personalityType: 'Empathetic Leader',
      scores: { emotional: 85, ethics: 90, sensuality: 75, stability: 80, ds: 85 }
    }));
    sessionStorage.setItem('relationshipResult', JSON.stringify({
      relationshipStyle: 'Deep Connection Seeker',
      scores: { sexPersonality: 80, boundaries: 85, listening: 90, openness: 75, communication: 85 }
    }));
    
    // Immediately redirect to the actual page
    setLocation('/relationship-result');
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">Loading test data...</p>
    </div>
  );
}
