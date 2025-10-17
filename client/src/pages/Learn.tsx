import { Heart, MessageCircle, User, BookOpen, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

const educationTopics = [
  {
    title: "Understanding BDSM Basics",
    description: "Core principles, terminology, and foundational concepts",
    duration: "10 min read"
  },
  {
    title: "Consent & Communication",
    description: "Essential skills for healthy power exchange relationships",
    duration: "15 min read"
  },
  {
    title: "Safety & Risk Awareness",
    description: "Physical and emotional safety practices",
    duration: "12 min read"
  },
  {
    title: "Negotiation Techniques",
    description: "How to discuss boundaries, limits, and desires",
    duration: "8 min read"
  },
  {
    title: "Aftercare Essentials",
    description: "Post-scene care and emotional support",
    duration: "10 min read"
  },
  {
    title: "Red Flags & Warning Signs",
    description: "Identifying unhealthy dynamics and abuse",
    duration: "12 min read"
  },
];

export default function Learn() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto h-screen w-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <h2 className="text-2xl font-light text-foreground">Education</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Resources for safe, informed practice
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {educationTopics.map((topic, i) => (
              <Card
                key={i}
                data-testid={`card-topic-${i}`}
                className="p-4 hover-elevate active-elevate-2 cursor-pointer"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {topic.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{topic.duration}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 mt-6 bg-primary/10 border-primary/20">
            <h4 className="font-medium text-primary mb-2">Emergency Resources</h4>
            <div className="text-sm text-primary/90 space-y-1">
              <p>Sexual Assault Hotline: 1-800-656-4673</p>
              <p>Domestic Violence Hotline: 1-800-799-7233</p>
              <p>Crisis Text Line: Text HOME to 741741</p>
            </div>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-background p-4 flex justify-around border-t border-border">
          <button
            data-testid="nav-discover"
            onClick={() => setLocation("/discover")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-education"
            className="text-primary p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-messages"
            onClick={() => setLocation("/messages")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-profile"
            onClick={() => setLocation("/profile")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <User className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </div>
  );
}
