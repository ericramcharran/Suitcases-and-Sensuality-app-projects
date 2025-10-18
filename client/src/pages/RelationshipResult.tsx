import { Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function RelationshipResult() {
  const [, setLocation] = useLocation();
  
  // Get real data from backend
  const personalityData = JSON.parse(sessionStorage.getItem('personalityResult') || '{}');
  const relationshipData = JSON.parse(sessionStorage.getItem('relationshipResult') || '{}');
  const personalityType = personalityData.personalityType || "Balanced";
  const relationshipStyle = relationshipData.relationshipStyle || "Flexible Explorer";
  const role = sessionStorage.getItem('userRole') || "Dominant";

  const getLookingForByStyle = (style: string) => {
    const lookingForMap: Record<string, string[]> = {
      "24/7 TPE Devotee": [
        "Total power exchange partnership",
        "24/7 lifestyle integration",
        "Deep commitment and dedication",
        "Structured protocols and rituals"
      ],
      "Monogamous Lifestyle Partner": [
        "Long-term committed partnership",
        "Monogamous relationship",
        "Deep emotional connection",
        "Lifestyle integration and growth"
      ],
      "Scene-Based Player": [
        "Exciting scene experiences",
        "Skill development and exploration",
        "Flexible play arrangements",
        "Community connections"
      ],
      "Polyamorous Explorer": [
        "Multiple meaningful connections",
        "Open and honest communication",
        "Diverse relationship experiences",
        "Mutual respect and boundaries"
      ],
      "Full Lifestyle Practitioner": [
        "Complete lifestyle integration",
        "Daily practice and protocols",
        "Dedicated partnership",
        "Community involvement"
      ],
      "Deep Connection Seeker": [
        "Profound emotional intimacy",
        "Authentic vulnerability",
        "Long-term partnership potential",
        "Mutual growth and understanding"
      ],
      "Growth-Oriented Learner": [
        "Skill development and training",
        "Personal growth together",
        "Open communication",
        "Exploration and discovery"
      ],
      "Flexible Explorer": [
        "Adaptable relationship structure",
        "Open to different experiences",
        "Communication and consent",
        "Discovering preferences together"
      ]
    };
    return lookingForMap[style] || lookingForMap["Flexible Explorer"];
  };

  const lookingFor = getLookingForByStyle(relationshipStyle);

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Your Relationship Style
        </h2>
        <h3 className="text-2xl text-primary mb-8 text-center font-medium" data-testid="text-relationship-style">
          {relationshipStyle}
        </h3>

        <Card className="p-6 mb-6">
          <h4 className="font-medium mb-3 text-foreground">Your Relationship Profile</h4>
          <p className="text-foreground/80 text-sm mb-6 leading-relaxed">
            As a {relationshipStyle}, you seek deep, meaningful connections that integrate into
            your life. You value long-term compatibility, emotional intimacy, and building a life
            together with your partner within the power exchange dynamic.
          </p>

          <h4 className="font-medium mb-3 text-foreground">What You're Looking For</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            {lookingFor.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 mb-6">
          <h4 className="font-medium mb-4 text-foreground">Your Match Profile</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">Personality Type</span>
              <span className="font-medium text-foreground" data-testid="text-personality-type">{personalityType}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">Relationship Style</span>
              <span className="font-medium text-foreground" data-testid="text-relationship-style-value">{relationshipStyle}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium text-foreground" data-testid="text-role">{role}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-6 bg-green-500/10 border-green-500/20">
          <p className="text-sm text-green-600 dark:text-green-400 flex items-start gap-2">
            <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Your matching profile is complete! We'll use these results to find your most
              compatible matches.
            </span>
          </p>
        </Card>

        <Button
          data-testid="button-continue"
          onClick={() => {
            if (role === 'Dominant') {
              setLocation("/subscription-dom");
            } else {
              setLocation("/subscription-sub");
            }
          }}
          className="w-full rounded-full bg-red-500 hover:bg-black text-white transition-colors"
        >
          Continue to Subscription
        </Button>
      </div>
    </div>
  );
}
