import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check, Shield, Crown } from "lucide-react";

const plans = [
  {
    id: 'trial',
    billingPeriod: null,
    name: 'Free Trial',
    price: 'Free',
    duration: '30 days',
    description: 'Experience the platform',
    features: [
      'Full platform access',
      'Advanced matching algorithm',
      'Unlimited messages',
      'Profile verification pending',
      'Browse submissive profiles'
    ]
  },
  {
    id: 'monthly',
    billingPeriod: 'monthly',
    name: 'Executive Monthly',
    price: '$249',
    duration: 'per month',
    description: 'Premium access for serious Doms',
    features: [
      'Full platform access',
      'Advanced compatibility matching',
      'Unlimited messages',
      'Verified Dom badge',
      'Priority support',
      'Concierge matching service',
      'Escrow or mutual fund account setup',
      'Featured profile placement'
    ],
    popular: false
  },
  {
    id: '3-month',
    billingPeriod: '3month',
    name: 'Executive 3-Month',
    price: '$229',
    duration: 'per month',
    totalPrice: '$687 (paid upfront)',
    description: 'Save 8% - Commitment pays',
    features: [
      'All Monthly features',
      'Save $60 vs monthly',
      'Price lock for 3 months',
      'Priority matching',
      'Concierge services'
    ],
    popular: false
  },
  {
    id: '6-month',
    billingPeriod: '6month',
    name: 'Executive 6-Month',
    price: '$199',
    duration: 'per month',
    totalPrice: '$1,194 (paid upfront)',
    description: 'Save 20% - Serious commitment',
    features: [
      'All Monthly features',
      'Save $300 vs monthly',
      'Price lock for 6 months',
      'Enhanced priority matching',
      'Elite concierge services'
    ],
    popular: false
  },
  {
    id: '1-year',
    billingPeriod: '1year',
    name: 'Executive Yearly',
    price: '$149',
    duration: 'per month',
    totalPrice: '$1,788 (paid upfront)',
    description: 'Save 40% - Best value',
    features: [
      'All Monthly features',
      'Save $1,200 vs monthly',
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
    name: 'Executive 5-Year',
    price: '$119',
    duration: 'per month',
    totalPrice: '$7,140 (paid upfront)',
    description: 'Save 52% - Ultimate commitment',
    features: [
      'All Monthly features',
      'Save $7,800 vs monthly',
      'Lifetime price lock guarantee',
      'Elite Dom concierge services',
      'Priority matching forever',
      'Exclusive 5-year member benefits',
      'Free premium upgrades',
      'VIP summit attendance',
      'Personal relationship advisor',
      'Annual luxury gifts'
    ],
    popular: false
  }
];

export default function SubscriptionDom() {
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

    // For trial, skip payment and go to escrow
    if (plan.id === 'trial') {
      sessionStorage.setItem('selectedPlan', selectedPlan);
      setLocation("/escrow");
      return;
    }

    // Get user role from storage to ensure correct pricing
    const userRole = sessionStorage.getItem('userRole') || 'Domme';
    
    // For paid plans, store details and go to Stripe checkout
    sessionStorage.setItem('selectedPlanType', userRole);
    sessionStorage.setItem('selectedBillingPeriod', plan.billingPeriod || 'monthly');
    setLocation("/subscribe");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-red-500" />
            <h2 className="text-4xl font-light text-foreground">Master/Dom/Domme Membership</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Premium plans designed for leaders in power exchange
          </p>
        </div>
        
        {/* Verification Notice */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-red-500/10 to-black/10 border-red-500/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2 text-lg">
                Masters/Doms/Dommes Must Be Verified
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All Dominant members are required to complete financial verification after subscription. 
                Choose escrow (secure holding) or mutual funds (growing investment). 
                Initial deposit: <span className="font-medium text-foreground">$1,000</span> | 
                Final match requirement: <span className="font-medium text-foreground">$50,000+</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Mutual fund option allows your commitment to earn value over time while ensuring financial 
                stability and creating a safe environment for all community members.
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
            {selectedPlan === 'trial' ? 'Start Free Trial' : 'Continue to Financial Setup'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {selectedPlan === 'trial' 
              ? 'Start your trial today. Financial verification (escrow or mutual fund) required before matching.'
              : 'Next: Choose between escrow or mutual fund investment to verify your membership'}
          </p>
        </div>
      </div>
    </div>
  );
}
