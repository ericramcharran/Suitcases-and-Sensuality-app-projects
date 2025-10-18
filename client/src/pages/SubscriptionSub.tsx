import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check, Heart, Sparkles } from "lucide-react";

const plans = [
  {
    id: 'trial',
    name: 'Free Trial',
    price: 'Free',
    duration: '30 days',
    description: 'Explore the platform',
    features: [
      'Full platform access',
      'Advanced matching algorithm',
      'Unlimited messages',
      'Profile verification',
      'Browse verified Dom profiles'
    ]
  },
  {
    id: 'monthly',
    name: 'Premium Monthly',
    price: '$99',
    duration: 'per month',
    description: 'Flexible monthly access',
    features: [
      'Full platform access',
      'Advanced compatibility matching',
      'Unlimited messages',
      'Profile verification badge',
      'Priority support',
      'Match with verified Doms only',
      'Safety tools & resources',
      'Community support groups'
    ],
    popular: false
  },
  {
    id: '6-month',
    name: 'Premium 6-Month',
    price: '$79',
    duration: 'per month',
    totalPrice: '$474',
    description: 'Save 20% - Best for serious seekers',
    features: [
      'All Monthly features',
      'Save $120 vs monthly',
      'Exclusive sub community events',
      'Relationship coaching session',
      'Enhanced privacy controls',
      'Featured profile boost',
      'VIP customer service',
      'Educational workshops'
    ],
    popular: true
  },
  {
    id: 'yearly',
    name: 'Premium Annual',
    price: '$59',
    duration: 'per month',
    totalPrice: '$708',
    description: 'Maximum value - Save 40%',
    features: [
      'All 6-Month features',
      'Save $480 vs monthly',
      'Quarterly coaching sessions',
      'Premium profile visibility',
      'Early access to new features',
      'Annual retreat invitation',
      'Dedicated support specialist',
      'Monthly educational webinars'
    ],
    popular: false
  }
];

export default function SubscriptionSub() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleContinue = () => {
    sessionStorage.setItem('selectedPlan', selectedPlan);
    setLocation("/discover");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-4xl font-light text-foreground">Submissive Membership</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Premium plans designed for authentic power exchange connections
          </p>
        </div>
        
        {/* Safety Notice */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-red-500/10 to-black/10 border-red-500/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2 text-lg">
                Your Safety is Our Priority
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All Dominant members are financially verified through our escrow system, ensuring you connect 
                only with serious, committed individuals. Every Master/Dom maintains a minimum escrow balance 
                and is required to deposit $50,000 before finalizing any match.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This creates a safe, trustworthy environment where you can explore authentic connections 
                with confidence.
              </p>
            </div>
          </div>
        </Card>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              data-testid={`card-plan-${plan.id}`}
              onClick={() => setSelectedPlan(plan.id)}
              className={`p-6 cursor-pointer transition-all hover-elevate active-elevate-2 relative ${
                selectedPlan === plan.id ? 'ring-2 ring-red-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-4 py-1.5 rounded-full font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-xl font-medium text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-light text-red-500">{plan.price}</span>
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
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex flex-col items-center gap-3">
          <Button
            data-testid="button-continue"
            onClick={handleContinue}
            disabled={!selectedPlan}
            className="rounded-full bg-red-500 hover:bg-black text-white transition-colors px-12"
            size="lg"
          >
            {selectedPlan === 'trial' ? 'Start Free Trial' : 'Continue to Matching'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {selectedPlan === 'trial' 
              ? 'Start your trial today. All Doms are verified for your safety.'
              : 'Next: Discover verified Dominant members who match your preferences'}
          </p>
        </div>
      </div>
    </div>
  );
}
