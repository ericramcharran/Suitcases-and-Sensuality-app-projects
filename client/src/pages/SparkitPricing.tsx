import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SparkitPricing() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  // Get couple ID from localStorage (same key as SparkButton)
  const coupleId = localStorage.getItem("sparkitCoupleId");

  const subscribeMutation = useMutation({
    mutationFn: async (billingPeriod: "monthly" | "yearly") => {
      if (!coupleId) {
        throw new Error("No couple ID found");
      }

      const response = await apiRequest<{ url: string }>("/api/sparkit/create-subscription", {
        method: "POST",
        body: JSON.stringify({ coupleId, billingPeriod }),
      });

      return response;
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (plan: "monthly" | "yearly") => {
    if (!coupleId) {
      toast({
        title: "Not Logged In",
        description: "Please sign up or join a couple first.",
        variant: "destructive",
      });
      navigate("/sparkit");
      return;
    }

    subscribeMutation.mutate(plan);
  };

  const trialFeatures = [
    "10 free sparks to try",
    "Full access to 70 activities",
    "7 days to explore together",
    "No credit card required",
  ];

  const premiumFeatures = [
    "Unlimited sparks every day",
    "Access to all 70+ activities",
    "Activity ratings & scoreboard",
    "Trivia challenges",
    "No decision fatigue, ever",
    "Cancel anytime",
  ];

  return (
    <div className="nexus-app min-h-screen bg-gradient-to-br from-purple-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-nexus-purple" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-nexus-purple to-nexus-red bg-clip-text text-transparent">
              Spark It! Premium
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Never waste time deciding again. Get instant, exciting activity suggestions that you both love.
          </p>
        </div>

        {/* Trial Info Card */}
        <Card className="max-w-3xl mx-auto mb-12 border-2 border-nexus-purple/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-nexus-purple" />
              <CardTitle className="text-2xl">Your Trial Is Active!</CardTitle>
            </div>
            <CardDescription className="text-base">
              Enjoying Spark It? Here's what you're getting for free:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {trialFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPlan === "monthly"
                  ? "bg-gradient-to-r from-nexus-purple to-nexus-red text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              data-testid="button-monthly-plan"
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${
                selectedPlan === "yearly"
                  ? "bg-gradient-to-r from-nexus-purple to-nexus-red text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              data-testid="button-yearly-plan"
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save $24
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card
            className={`relative transition-all ${
              selectedPlan === "monthly"
                ? "border-2 border-nexus-purple shadow-2xl scale-105"
                : "border border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-2xl">Monthly Premium</CardTitle>
              <CardDescription>Perfect for trying things out</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$6.99</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe("monthly")}
                disabled={subscribeMutation.isPending}
                className="w-full bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 text-white"
                data-testid="button-subscribe-monthly"
              >
                {subscribeMutation.isPending && selectedPlan === "monthly" ? "Processing..." : "Get Monthly"}
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Plan */}
          <Card
            className={`relative transition-all ${
              selectedPlan === "yearly"
                ? "border-2 border-nexus-red shadow-2xl scale-105"
                : "border border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100"
            }`}
          >
            {selectedPlan === "yearly" && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Best Value
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">Yearly Premium</CardTitle>
              <CardDescription>Save $24 vs monthly billing</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$59.99</span>
                <span className="text-gray-600 dark:text-gray-400">/year</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
                Just $5/month when billed annually
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe("yearly")}
                disabled={subscribeMutation.isPending}
                className="w-full bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 text-white"
                data-testid="button-subscribe-yearly"
              >
                {subscribeMutation.isPending && selectedPlan === "yearly" ? "Processing..." : "Get Yearly"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What happens when my trial ends?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                After you've used your 10 free sparks or 7 days pass (whichever comes first), you'll need to
                subscribe to continue sparking activities. Your progress and scoreboard data will be saved.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! You can cancel your subscription at any time. You'll continue to have access until
                the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is the yearly plan really worth it?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! The yearly plan saves you $24 compared to paying monthly ($83.88 vs $59.99). That's like
                getting 3.5 months free!
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/spark")}
            variant="outline"
            data-testid="button-back-spark"
          >
            Back to Spark Button
          </Button>
        </div>
      </div>
    </div>
  );
}
