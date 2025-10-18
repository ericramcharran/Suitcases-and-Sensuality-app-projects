import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Clear subscription data from session storage
    sessionStorage.removeItem('selectedPlanType');
    sessionStorage.removeItem('selectedBillingPeriod');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Subscription Activated!</CardTitle>
          <CardDescription className="mt-2">
            Welcome to The Executive Society. Your premium membership is now active.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You now have full access to our exclusive matching platform and all premium features.
          </p>
          <Button
            onClick={() => setLocation('/discover')}
            className="w-full"
            data-testid="button-start-matching"
          >
            Start Matching
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
