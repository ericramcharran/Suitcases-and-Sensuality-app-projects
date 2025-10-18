import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check, Heart, Sparkles } from "lucide-react";

const plans = [
  {
    id: 'trial',
    billingPeriod: null,
    name: 'Free Trial',
    price: 'Free',
    duration: '3 months',
    description: 'Extended trial period',
    features: [
      'Full platform access for 3 months',
      'Advanced matching algorithm',
      'Unlimited messages',
      'Profile verification',
      'Browse verified Dom profiles'
    ]
  },
  {
    id: 'monthly',
    billingPeriod: 'monthly',
    name: 'Monthly',
    price: '$25',
    duration: 'per month',
    description: 'Flexible month-to-month',
    features: [
      'Full platform access',
      'Advanced compatibility matching',
      'Unlimited messages',
      'Profile verification badge',
      'Match with verified Doms only',
      'Safety tools & resources',
      'Community support groups'
    ],
    popular: false
  },
  {
    id: '3-month',
    billingPeriod: '3month',
    name: '3-Month',
    price: '$23',
    duration: 'per month',
    totalPrice: '$69 (paid upfront)',
    description: 'Save 8% - Get started',
    features: [
      'All Monthly features',
      'Save $6 vs monthly',
      'Price lock for 3 months',
      'Priority matching'
    ],
    popular: false
  },
  {
    id: '6-month',
    billingPeriod: '6month',
    name: '6-Month',
    price: '$20',
    duration: 'per month',
    totalPrice: '$120 (paid upfront)',
    description: 'Save 20% - Great value',
    features: [
      'All Monthly features',
      'Save $30 vs monthly',
      'Price lock for 6 months',
      'Enhanced priority matching',
      'VIP concierge services'
    ],
    popular: false
  },
  {
    id: '1-year',
    billingPeriod: '1year',
    name: 'Yearly',
    price: '$18',
    duration: 'per month',
    totalPrice: '$216 (paid upfront)',
    description: 'Save 28% - Best value',
    features: [
      'All Monthly features',
      'Save $84 vs monthly',
      'Lifetime price lock guarantee',
      'VIP concierge services',
      'Top priority matching',
      'Exclusive yearly member benefits',
      'Free account upgrades'
    ],
    popular: true
  },
  {
    id: '5-year',
    billingPeriod: '5year',
    name: '5 Years',
    price: '$15',
    duration: 'per month',
    totalPrice: '$900 (paid upfront)',
    description: 'Save 40% - Ultimate value',
    features: [
      'All Monthly features',
      'Save $600 vs monthly',
      'Lifetime price lock guarantee',
      'VIP concierge services',
      'Priority matching forever',
      'Exclusive 5-year member benefits',
      'Free account upgrades',
      'Annual membership gifts'
    ],
    popular: false
  }
];

export default function SubscriptionSub() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleContinue = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setLocation('/signup');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    // For trial, skip payment and go to discover
    if (plan.id === 'trial') {
      sessionStorage.setItem('selectedPlan', selectedPlan);
      setLocation("/discover");
      return;
    }

    // Get user role from storage to ensure correct pricing
    const userRole = sessionStorage.getItem('userRole') || 'Submissive';
    
    // For paid plans, store details and go to demo payment page
    sessionStorage.setItem('selectedPlanType', userRole);
    sessionStorage.setItem('selectedBillingPeriod', plan.billingPeriod || 'monthly');
    setLocation("/payment-demo");
  };

  const handleSkipPayment = () => {
    // Skip payment and go directly to subscription success for testing
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    sessionStorage.setItem('selectedPlan', selectedPlan);
    sessionStorage.setItem('subscriptionActive', 'true');
    sessionStorage.setItem('subscriptionPlan', `Submissive-${plan.billingPeriod || 'trial'}`);
    setLocation("/subscription-success");
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
                All Dominant members are financially verified through our escrow or mutual fund investment system, 
                ensuring you connect only with serious, committed individuals. Every Master/Dom/Domme maintains a 
                minimum account balance and is required to secure $50,000+ before finalizing any match.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Mutual fund option means their commitment grows over time, demonstrating long-term dedication. 
                This creates a safe, trustworthy environment where you can explore authentic connections with confidence.
              </p>
            </div>
          </div>
        </Card>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
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
          
          {/* Testing Skip Button */}
          {selectedPlan && selectedPlan !== 'trial' && (
            <Button
              data-testid="button-skip-payment"
              onClick={handleSkipPayment}
              variant="outline"
              size="sm"
              className="text-xs opacity-70 hover:opacity-100"
            >
              Skip Payment (Testing)
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground text-center">
            {selectedPlan === 'trial' 
              ? 'Enjoy 3 months free. All Doms are verified for your safety.'
              : 'Next: Discover verified Dominant members who match your preferences'}
          </p>
        </div>
      </div>
    </div>
  );
}
