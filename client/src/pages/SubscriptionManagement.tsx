import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  CreditCard, 
  Crown, 
  Heart,
  Calendar,
  Check,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import type { User } from "@shared/schema";

export default function SubscriptionManagement() {
  const [, setLocation] = useLocation();
  const userId = localStorage.getItem('userId');

  const { data: user, isLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-light mb-2">No Subscription Found</h3>
          <p className="text-muted-foreground mb-6">
            Please complete your profile setup to manage your subscription.
          </p>
          <Button onClick={() => setLocation("/signup")}>
            Complete Profile
          </Button>
        </Card>
      </div>
    );
  }

  const getRoleIcon = () => {
    if (user.role === 'Dominant' || user.role === 'Domme' || user.role === 'Master') {
      return <Crown className="w-5 h-5" />;
    }
    return <Heart className="w-5 h-5" />;
  };

  const getPlanPrice = () => {
    if (!user.plan) return null;
    
    const isDom = user.role === 'Dominant' || user.role === 'Domme' || user.role === 'Master';
    
    const prices: Record<string, { dom: string; sub: string }> = {
      'monthly': { dom: '$249', sub: '$25' },
      '3-month': { dom: '$229', sub: '$23' },
      '6-month': { dom: '$199', sub: '$20' },
      '1-year': { dom: '$149', sub: '$18' },
      '5-year': { dom: '$119', sub: '$15' },
    };

    return isDom ? prices[user.plan]?.dom : prices[user.plan]?.sub;
  };

  const getPlanName = () => {
    const planNames: Record<string, string> = {
      'monthly': 'Monthly',
      '3-month': '3-Month',
      '6-month': '6-Month',
      '1-year': '1-Year',
      '5-year': '5-Year',
    };
    return planNames[user.plan || ''] || 'Unknown';
  };

  const planFeatures = user.role === 'Dominant' || user.role === 'Domme' || user.role === 'Master'
    ? [
        'Unlimited matches and connections',
        'Priority profile placement',
        'Advanced compatibility filtering',
        'Escrow account verification',
        'Premium support access',
        'Read receipts and priority messaging',
      ]
    : [
        'Unlimited matches and connections',
        'Full profile customization',
        'Advanced compatibility testing',
        'Secure messaging',
        'Community access',
        'Safety and verification features',
      ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/settings")}
            data-testid="button-back"
            className="hover-elevate active-elevate-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Subscription & Billing</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Current Plan Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {getRoleIcon()}
              </div>
              <div>
                <h2 className="text-lg font-semibold">Current Plan</h2>
                <p className="text-sm text-muted-foreground">{user.role} Membership</p>
              </div>
            </div>
            <Badge className="bg-primary text-primary-foreground">Active</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Plan Type</p>
              <p className="font-medium">{getPlanName()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <p className="font-medium">{getPlanPrice()}/month</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">Plan Features</p>
            <ul className="space-y-2">
              {planFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Billing Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Billing Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">•••• •••• •••• {user.stripeCustomerId ? '4242' : 'Not connected'}</p>
              </div>
              <Button variant="outline" size="sm" className="hover-elevate active-elevate-2">
                Update
              </Button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="font-medium">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Manage Subscription Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Manage Subscription</h2>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start hover-elevate active-elevate-2"
              onClick={() => setLocation(user.role === 'Dominant' || user.role === 'Domme' || user.role === 'Master' ? '/subscription-dom' : '/subscription-sub')}
              data-testid="button-change-plan"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Change Plan
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start hover-elevate active-elevate-2"
              data-testid="button-billing-history"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              View Billing History
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive hover-elevate active-elevate-2"
              data-testid="button-cancel-subscription"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Cancel Subscription
            </Button>
          </div>
        </Card>

        {/* Support Card */}
        <Card className="p-6 bg-muted/50">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Need help with your subscription?</strong>
              </p>
              <p>
                Contact our support team for assistance with billing, plan changes, or cancellations.
              </p>
              <button 
                className="h-auto p-0 text-primary hover:underline"
                onClick={() => setLocation("/help-billing")}
              >
                Visit Help & Support →
              </button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
