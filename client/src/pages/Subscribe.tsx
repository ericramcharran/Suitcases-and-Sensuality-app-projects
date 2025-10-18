// Stripe subscription checkout page (from blueprint:javascript_stripe)
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';

// Initialize Stripe (from blueprint:javascript_stripe)
// Guard initialization to allow development without keys
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface SubscribeFormProps {
  onSuccess: () => void;
}

const SubscribeForm = ({ onSuccess }: SubscribeFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription-success`,
        },
        redirect: 'if_required',
      });

      const { error } = result;

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
      } else {
        toast({
          title: "Payment Successful",
          description: "You are now subscribed!",
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
        data-testid="button-complete-subscription"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Subscription'
        )}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [planDetails, setPlanDetails] = useState<{ role: string; price: string; period: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get userId, planType, and billingPeriod from sessionStorage
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

    // Check if Stripe is configured
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      toast({
        title: "Configuration Error",
        description: "Stripe is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    // Set plan details for display
    const prices: Record<string, Record<string, string>> = {
      "Dominant": { "monthly": "$249/mo", "5year": "$119/mo (5 years)" },
      "Domme": { "monthly": "$249/mo", "5year": "$119/mo (5 years)" },
      "Submissive": { "monthly": "$25/mo", "5year": "$15/mo (5 years)" },
      "submissive": { "monthly": "$25/mo", "5year": "$15/mo (5 years)" },
      "Switch": { "monthly": "$25/mo", "5year": "$15/mo (5 years)" }
    };

    setPlanDetails({
      role: planType,
      price: prices[planType]?.[billingPeriod] || '',
      period: billingPeriod === 'monthly' ? 'Monthly' : '5 Year Commitment'
    });

    // Create subscription and get client secret
    apiRequest("POST", "/api/create-subscription", { userId, planType, billingPeriod })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
        setLocation('/subscription');
      });
  }, [setLocation, toast]);

  const handleSuccess = () => {
    setLocation('/subscription-success');
  };

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 border-4 border-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Subscription</CardTitle>
          <CardDescription>
            {planDetails && (
              <div className="mt-2 space-y-1">
                <p className="text-foreground font-medium">{planDetails.role} Membership</p>
                <p className="text-xl text-primary font-semibold">{planDetails.price}</p>
                <p className="text-sm">{planDetails.period}</p>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SubscribeForm onSuccess={handleSuccess} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
