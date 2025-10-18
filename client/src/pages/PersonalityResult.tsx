import { Award, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function PersonalityResult() {
  const [, setLocation] = useLocation();
  
  // Get real data from backend
  const resultData = JSON.parse(localStorage.getItem('personalityResult') || '{}');
  const personalityType = resultData.personalityType || "Balanced";
  const scores = resultData.scores || {
    emotionalIntelligence: 0,
    ethics: 0,
    sensuality: 0,
    stability: 0,
    dsCompatibility: 0
  };

  // Convert scores to percentages
  const categoryScores = [
    { name: "Emotional Intelligence", score: Math.round((scores.emotionalIntelligence / 4) * 100) },
    { name: "Ethical Alignment", score: Math.round((scores.ethics / 4) * 100) },
    { name: "Sensuality", score: Math.round((scores.sensuality / 4) * 100) },
    { name: "Emotional Stability", score: Math.round((scores.stability / 4) * 100) },
    { name: "D/s Compatibility", score: Math.round((scores.dsCompatibility / 4) * 100) },
  ];

  const getStrengthsForType = (type: string) => {
    const strengthMap: Record<string, string[]> = {
      "Empathetic Leader": [
        "Highly attuned to partner emotions and needs",
        "Strong ethical framework and integrity",
        "Natural leadership with compassion",
        "Excellent communication skills"
      ],
      "Sensual Dominant": [
        "Strong sensual awareness and presence",
        "Deep understanding of D/s dynamics",
        "Physically expressive and connected",
        "Values both pleasure and power"
      ],
      "Grounded Nurturer": [
        "Emotionally stable and reliable",
        "High emotional intelligence",
        "Provides strong support and care",
        "Balanced approach to relationships"
      ],
      "Protocol Enthusiast": [
        "Deep commitment to D/s protocols",
        "Values structure and consistency",
        "Strong sense of duty and service",
        "Thrives in clear power dynamics"
      ],
      "Balanced": [
        "Well-rounded personality traits",
        "Adaptable to different dynamics",
        "Open to growth and exploration",
        "Values communication and consent"
      ]
    };
    return strengthMap[type] || strengthMap["Balanced"];
  };

  const strengths = getStrengthsForType(personalityType);

  const matches = [
    { name: "Devoted Companion", compatibility: 95 },
    { name: "Mindful Servant", compatibility: 92 },
    { name: "Curious Explorer", compatibility: 88 },
  ];

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
          <Award className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Your Comprehensive Profile
        </h2>
        <h3 className="text-2xl text-primary mb-8 text-center font-medium" data-testid="text-personality-type">
          {personalityType}
        </h3>

        <Card className="p-6 mb-4">
          <h4 className="font-medium mb-3 text-foreground">Overall Assessment</h4>
          <p className="text-foreground/80 text-sm leading-relaxed">
            As a {personalityType}, you demonstrate high emotional intelligence, strong ethical
            values, balanced sensuality, and stable emotional regulation. You're well-suited for
            deep, meaningful power exchange relationships.
          </p>
        </Card>

        <Card className="p-6 mb-4">
          <h4 className="font-medium mb-4 text-foreground">Your Scores by Category</h4>
          <div className="space-y-4">
            {categoryScores.map((category, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{category.name}</span>
                  <span className="text-sm font-medium text-foreground" data-testid={`text-score-${i}`}>{category.score}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-4">
          <h4 className="font-medium mb-3 text-foreground">Key Strengths</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            {strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 mb-6">
          <h4 className="font-medium mb-3 text-foreground">Best Matches</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            {matches.map((match, i) => (
              <li key={i} className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  {match.name} - {match.compatibility}% compatible
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 mb-6 bg-blue-500/10 border-blue-500/20">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            These comprehensive results will help us match you with highly compatible partners who
            share your values and approach.
          </p>
        </Card>

        <Button
          data-testid="button-continue"
          onClick={() => setLocation("/relationship-test")}
          className="w-full rounded-full"
        >
          Continue to Relationship Assessment
        </Button>
      </div>
    </div>
  );
}
