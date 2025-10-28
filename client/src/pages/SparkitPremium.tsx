import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, Zap, Palette, Flame, BarChart3, BookText, Target, Brain, Crown } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthData = {
  coupleId: string;
  partnerRole: 'partner1' | 'partner2';
  partnerName: string;
};

type CoupleData = {
  id: string;
  subscriptionPlan: 'free' | 'trial' | 'monthly' | 'yearly';
  subscriptionStatus: string;
  sparksRemaining: number;
};

export default function SparkitPremium() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const { data: authData, isLoading: authLoading } = useQuery<AuthData>({
    queryKey: ['/api/sparkit/auth/me'],
  });

  const { data: coupleData } = useQuery<CoupleData>({
    queryKey: authData ? ['/api/sparkit/couples', authData.coupleId] : [],
    enabled: !!authData?.coupleId,
  });

  const createCheckoutMutation = useMutation({
    mutationFn: async (billingPeriod: 'monthly' | 'yearly') => {
      const response = await apiRequest('POST', '/api/sparkit/create-subscription', {
        coupleId: authData?.coupleId,
        billingPeriod
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }
      
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleUpgrade = () => {
    if (!authData?.coupleId) {
      navigate('/sparkit/login');
      return;
    }
    createCheckoutMutation.mutate(selectedPlan);
  };

  if (authLoading) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const isPremium = coupleData?.subscriptionPlan === 'monthly' || coupleData?.subscriptionPlan === 'yearly';

  return (
    <div className="nexus-app min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-red-600 p-4">
      <div className="max-w-6xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">Spark It! Premium</h1>
          </div>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Unlock unlimited sparks and powerful features to keep your relationship vibrant
          </p>
        </div>

        {/* Premium Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
            <CardHeader>
              <Sparkles className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Unlimited Sparks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">No more daily limits - spark as many activities as you want!</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
            <CardHeader>
              <Palette className="w-8 h-8 text-pink-400 mb-2" />
              <CardTitle className="text-white">Custom Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">Build your own unique activities tailored to your relationship</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
            <CardHeader>
              <Flame className="w-8 h-8 text-red-400 mb-2" />
              <CardTitle className="text-white">Spice Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">Unlock intimate categories and adjust heat levels</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Advanced Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">Track streaks, patterns, and relationship insights</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
            <CardHeader>
              <BookText className="w-8 h-8 text-green-400 mb-2" />
              <CardTitle className="text-white">Activity Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">Keep a history of all your favorite memories</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Quick Pick Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">Get instant suggestions without partner sync</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
            <CardHeader>
              <Brain className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">Smart AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">ML-powered recommendations based on your preferences</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
            <CardHeader>
              <Target className="w-8 h-8 text-orange-400 mb-2" />
              <CardTitle className="text-white">Priority Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">Get help faster with premium support access</p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card 
            className={`relative cursor-pointer transition-all ${
              selectedPlan === 'monthly' 
                ? 'ring-4 ring-yellow-400 bg-white/20 backdrop-blur-lg' 
                : 'bg-white/10 backdrop-blur-lg hover-elevate'
            }`}
            onClick={() => !isPremium && setSelectedPlan('monthly')}
            data-testid="card-monthly-plan"
          >
            <CardHeader>
              <CardTitle className="text-white text-2xl">Monthly</CardTitle>
              <CardDescription className="text-purple-100">Perfect for trying premium</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$6.99</span>
                  <span className="text-purple-200">/month</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-purple-100">All premium features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-purple-100">Cancel anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-purple-100">Instant activation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card 
            className={`relative cursor-pointer transition-all ${
              selectedPlan === 'yearly' 
                ? 'ring-4 ring-yellow-400 bg-white/20 backdrop-blur-lg' 
                : 'bg-white/10 backdrop-blur-lg hover-elevate'
            }`}
            onClick={() => !isPremium && setSelectedPlan('yearly')}
            data-testid="card-yearly-plan"
          >
            <Badge className="absolute -top-3 -right-3 bg-yellow-400 text-black font-bold px-3 py-1">
              SAVE $24
            </Badge>
            <CardHeader>
              <CardTitle className="text-white text-2xl">Yearly</CardTitle>
              <CardDescription className="text-purple-100">Best value for committed couples</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$59.99</span>
                  <span className="text-purple-200">/year</span>
                </div>
                <p className="text-sm text-purple-200 mt-1">Just $5/month when billed annually</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-purple-100">All premium features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-purple-100">2 months free</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-purple-100">Lock in current price</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          {isPremium ? (
            <div className="space-y-4">
              <Badge className="bg-yellow-400 text-black font-bold px-6 py-2 text-lg">
                <Crown className="w-5 h-5 inline mr-2" />
                You're Premium!
              </Badge>
              <p className="text-purple-100">
                Enjoying {coupleData?.subscriptionPlan === 'yearly' ? 'Yearly' : 'Monthly'} Premium
              </p>
              <Button
                onClick={() => navigate('/spark')}
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-lg border-white/30 text-white hover:bg-white/20"
                data-testid="button-back-to-spark"
              >
                Back to Spark It!
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleUpgrade}
              disabled={createCheckoutMutation.isPending}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-12 py-6 text-xl hover:from-yellow-500 hover:to-orange-600 shadow-2xl"
              data-testid="button-upgrade-premium"
            >
              {createCheckoutMutation.isPending ? (
                "Processing..."
              ) : (
                <>
                  <Crown className="w-6 h-6 mr-2" />
                  Upgrade to Premium - ${selectedPlan === 'monthly' ? '6.99' : '59.99'}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/spark')}
            variant="ghost"
            className="text-purple-200 hover:text-white"
            data-testid="button-back-link"
          >
            Back to Spark It!
          </Button>
        </div>
      </div>
    </div>
  );
}
