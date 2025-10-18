import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function PaymentDemo() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [planDetails, setPlanDetails] = useState<{ role: string; price: string; period: string } | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const planType = sessionStorage.getItem('selectedPlanType');
    const billingPeriod = sessionStorage.getItem('selectedBillingPeriod');

    if (!userId || !planType || !billingPeriod) {
      toast({
        title: "Missing Information",
        description: "Please select a membership plan first",
        variant: "destructive",
      });
      setLocation('/subscription');
      return;
    }

    const prices: Record<string, Record<string, string>> = {
      "Dominant": { 
        "monthly": "$249/mo", 
        "3month": "$229/mo", 
        "6month": "$199/mo", 
        "1year": "$149/mo", 
        "5year": "$119/mo" 
      },
      "Domme": { 
        "monthly": "$249/mo", 
        "3month": "$229/mo", 
        "6month": "$199/mo", 
        "1year": "$149/mo", 
        "5year": "$119/mo" 
      },
      "Master": { 
        "monthly": "$249/mo", 
        "3month": "$229/mo", 
        "6month": "$199/mo", 
        "1year": "$149/mo", 
        "5year": "$119/mo" 
      },
      "Submissive": { 
        "monthly": "$25/mo", 
        "3month": "$23/mo", 
        "6month": "$20/mo", 
        "1year": "$18/mo", 
        "5year": "$15/mo" 
      },
      "submissive": { 
        "monthly": "$25/mo", 
        "3month": "$23/mo", 
        "6month": "$20/mo", 
        "1year": "$18/mo", 
        "5year": "$15/mo" 
      },
      "Switch": { 
        "monthly": "$25/mo", 
        "3month": "$23/mo", 
        "6month": "$20/mo", 
        "1year": "$18/mo", 
        "5year": "$15/mo" 
      }
    };

    const periodLabels: Record<string, string> = {
      "monthly": "Monthly",
      "3month": "3-Month Commitment",
      "6month": "6-Month Commitment",
      "1year": "Yearly Commitment",
      "5year": "5-Year Commitment"
    };

    setPlanDetails({
      role: planType,
      price: prices[planType]?.[billingPeriod] || '',
      period: periodLabels[billingPeriod] || billingPeriod
    });
  }, [setLocation, toast]);

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const planType = sessionStorage.getItem('selectedPlanType');
      const billingPeriod = sessionStorage.getItem('selectedBillingPeriod');
      const userId = sessionStorage.getItem('userId');

      // Mark subscription as active (simulate successful payment)
      sessionStorage.setItem('subscriptionActive', 'true');
      sessionStorage.setItem('subscriptionPlan', `${planType}-${billingPeriod}`);

      toast({
        title: "Payment Successful (Demo)",
        description: "Your test subscription is now active!",
      });

      // Redirect based on role
      const isDominant = planType === 'Dominant' || planType === 'Domme' || planType === 'Master';
      
      if (isDominant) {
        setLocation('/escrow');
      } else {
        setLocation('/subscription-success');
      }
    }, 2000);
  };

  const handleCancel = () => {
    const planType = sessionStorage.getItem('selectedPlanType');
    const isDominant = planType === 'Dominant' || planType === 'Domme' || planType === 'Master';
    
    if (isDominant) {
      setLocation('/subscription-dom');
    } else {
      setLocation('/subscription-sub');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
              <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">DEMO MODE</p>
            </div>
          </div>
          <CardTitle className="text-2xl">Test Payment Checkout</CardTitle>
          <CardDescription>
            This is a demo payment page for testing. No real charges will be made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {planDetails && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Subscription Details</h3>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Plan: <span className="text-foreground font-medium">{planDetails.role} Membership</span></p>
                <p className="text-muted-foreground">Billing: <span className="text-foreground font-medium">{planDetails.period}</span></p>
                <p className="text-xl font-semibold text-primary mt-2">{planDetails.price}</p>
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground mb-1 text-sm">Testing Information</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This demo simulates a successful payment without connecting to Stripe. 
                  In production, this would process real payments through Stripe's secure checkout.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full"
              size="lg"
              data-testid="button-simulate-payment"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Simulate Successful Payment
                </>
              )}
            </Button>

            <Button 
              onClick={handleCancel}
              disabled={isProcessing}
              variant="outline"
              className="w-full"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            After simulating payment, you'll be redirected to the next step in the onboarding flow.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
