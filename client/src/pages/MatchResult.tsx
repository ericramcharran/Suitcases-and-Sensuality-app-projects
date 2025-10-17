import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";

export default function MatchResult() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-light text-foreground mb-2">It's a Match!</h2>
          <p className="text-muted-foreground">
            You and Alex both liked each other
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-2xl">A</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-light text-foreground" data-testid="text-match-name">
                Alex, 28
              </h3>
              <p className="text-primary font-medium">Submissive</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-primary mb-1">95%</div>
              <div className="text-xs text-muted-foreground">Match</div>
            </div>
          </div>

          <Card className="p-4 bg-muted border-border mb-4">
            <h4 className="font-medium text-foreground mb-2">What You Have in Common</h4>
            <ul className="text-sm text-foreground/80 space-y-1">
              <li>• Both seeking long-term commitment</li>
              <li>• High emotional intelligence scores</li>
              <li>• Compatible relationship styles</li>
              <li>• Similar communication preferences</li>
            </ul>
          </Card>

          <div className="flex gap-3">
            <Button
              data-testid="button-send-message"
              onClick={() => setLocation("/messages")}
              className="flex-1 rounded-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button
              data-testid="button-keep-swiping"
              onClick={() => setLocation("/discover")}
              variant="outline"
              className="flex-1 rounded-full"
            >
              <Heart className="w-4 h-4 mr-2" />
              Keep Swiping
            </Button>
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
            Remember: Always meet in public first and practice safe, consensual interactions
          </p>
        </Card>
      </div>
    </div>
  );
}
