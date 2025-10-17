import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check } from "lucide-react";

const plans = [
  {
    id: 'trial',
    name: 'Free Trial',
    price: 'Free',
    duration: '30 days',
    description: 'Try all premium features',
    features: [
      'Full platform access',
      'Advanced matching algorithm',
      'Unlimited messages',
      'Profile verification'
    ]
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$149',
    duration: 'per month',
    description: 'Flexible monthly plan',
    features: [
      'Full platform access',
      'Advanced matching algorithm',
      'Unlimited messages',
      'Profile verification',
      'Priority support',
      'Concierge matching service'
    ],
    popular: false
  },
  {
    id: '6-month',
    name: '6 Months',
    price: '$99',
    duration: 'per month',
    totalPrice: '$594',
    description: 'Save 34% with 6 months',
    features: [
      'Full platform access',
      'Advanced matching algorithm',
      'Unlimited messages',
      'Profile verification',
      'Priority support',
      'Concierge matching service',
      'Save $300 vs monthly',
      'Exclusive community events'
    ],
    popular: true
  },
  {
    id: 'yearly',
    name: '1 Year',
    price: '$79',
    duration: 'per month',
    totalPrice: '$948',
    description: 'Best value - Save 47%',
    features: [
      'Full platform access',
      'Advanced matching algorithm',
      'Unlimited messages',
      'Profile verification',
      'Priority support',
      'Concierge matching service',
      'Save $840 vs monthly',
      'Exclusive community events',
      'VIP matching priority'
    ],
    popular: false
  }
];

export default function Subscription() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState("");
  const role = sessionStorage.getItem('userRole') || "";

  const handleContinue = () => {
    // Store selected plan
    sessionStorage.setItem('selectedPlan', selectedPlan);
    
    if (role === 'Dominant') {
      setLocation("/escrow");
    } else {
      setLocation("/discover");
    }
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">Choose Your Plan</h2>
        <p className="text-muted-foreground mb-6 text-center">Start with a 30-day free trial, then select your subscription</p>
        
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

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              data-testid={`card-plan-${plan.id}`}
              onClick={() => setSelectedPlan(plan.id)}
              className={`p-6 cursor-pointer transition-all hover-elevate active-elevate-2 relative ${
                selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-xl font-medium text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-light text-primary">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.duration}</span>
                </div>
                {plan.totalPrice && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed as {plan.totalPrice}
                  </p>
                )}
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Button
          data-testid="button-continue"
          onClick={handleContinue}
          disabled={!selectedPlan}
          className="w-full rounded-full"
        >
          {selectedPlan === 'trial' ? 'Start Free Trial' : 'Continue to Payment'}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Cancel anytime. No commitments. Your trial starts today.
        </p>
      </div>
    </div>
  );
}
