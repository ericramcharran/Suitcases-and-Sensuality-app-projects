import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Crown, Heart } from "lucide-react";

export default function SubscriptionRoleSelect() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-foreground mb-3">
            Select Your Role
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your membership type to view plans
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Dominant Card */}
          <Card 
            data-testid="card-dominant-role"
            onClick={() => setLocation("/subscription-dom")}
            className="p-8 cursor-pointer hover-elevate active-elevate-2 transition-all group"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <Crown className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-medium text-foreground mb-3">
                Master / Dom / Domme
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Premium membership for leaders in power exchange relationships. Includes escrow verification and exclusive features.
              </p>
              <Button 
                className="w-full rounded-full bg-primary hover:bg-primary/20 text-white transition-colors"
                size="lg"
              >
                View Dominant plans
              </Button>
            </div>
          </Card>

          {/* Submissive Card */}
          <Card 
            data-testid="card-submissive-role"
            onClick={() => setLocation("/subscription-sub")}
            className="p-8 cursor-pointer hover-elevate active-elevate-2 transition-all group"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <Heart className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-medium text-foreground mb-3">
                Submissive
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Premium membership for those seeking authentic power exchange connections. All Doms are verified for your safety.
              </p>
              <Button 
                className="w-full rounded-full bg-primary hover:bg-primary/20 text-white transition-colors"
                size="lg"
              >
                View submissive plans
              </Button>
            </div>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Submissives get <span className="font-medium text-foreground">3 months free</span> · 
            Doms get <span className="font-medium text-foreground">30 days free</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Cancel anytime. No commitments.
          </p>
        </div>
      </div>
    </div>
  );
}
