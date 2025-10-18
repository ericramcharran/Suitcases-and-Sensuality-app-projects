import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get userId, planType, and billingPeriod from sessionStorage
    const userId = localStorage.getItem('userId');
    const planType = localStorage.getItem('selectedPlanType');
    const billingPeriod = localStorage.getItem('selectedBillingPeriod');

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

    // Create checkout session and redirect to Stripe
    apiRequest("POST", "/api/create-subscription", { userId, planType, billingPeriod })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        // Redirect to Stripe Checkout
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No checkout URL returned");
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
        setIsLoading(false);
        setTimeout(() => {
          setLocation('/subscription');
        }, 2000);
      });
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Redirecting to Payment</CardTitle>
          <CardDescription>
            Please wait while we redirect you to secure checkout...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-center">
              You will be redirected to Stripe's secure payment page
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
