import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Subscription() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState("");
  const role = sessionStorage.getItem('userRole') || "";

  const handleContinue = () => {
    if (role === 'Dominant') {
      setLocation("/escrow");
    } else {
      setLocation("/discover");
    }
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-light mb-2 text-foreground">Choose Plan</h2>
        <p className="text-muted-foreground mb-6">30-day free trial</p>
        {role === 'Dominant' && (
          <Card className="p-4 mb-6 bg-blue-500/10 border-blue-500/20">
            <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-1">
              Dom Verification Required
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Escrow account setup required to match with submissives.
            </p>
          </Card>
        )}
        <div className="space-y-4 mb-6">
          <Card
            data-testid="card-plan-trial"
            onClick={() => setSelectedPlan('trial')}
            className={`p-6 cursor-pointer transition-all hover-elevate active-elevate-2 ${
              selectedPlan === 'trial' ? 'ring-2 ring-primary' : ''
            }`}
          >
            <h3 className="text-xl font-medium text-foreground">Free Trial</h3>
            <p className="text-3xl font-light text-primary mt-2">Free</p>
            <p className="text-sm text-muted-foreground">30 days</p>
          </Card>
        </div>
        <Button
          data-testid="button-continue"
          onClick={handleContinue}
          disabled={!selectedPlan}
          className="w-full rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
