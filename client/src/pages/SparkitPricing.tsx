import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AuthData = {
  coupleId: string;
  partnerRole: 'partner1' | 'partner2';
};

type SparkitCouple = {
  id: string;
  subscriptionPlan: 'free' | 'trial' | 'monthly' | 'yearly';
  sparksRemaining: number | null;
};

export default function SparkitPricing() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  // Get auth data
  const { data: authData } = useQuery<AuthData>({
    queryKey: ['/api/sparkit/auth/me'],
    retry: false,
  });

  // Get couple data
  const coupleIdFromStorage = localStorage.getItem("sparkitCoupleId");
  const coupleId = authData?.coupleId ?? coupleIdFromStorage;

  const { data: couple } = useQuery<SparkitCouple>({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
  });

  const isPremium = couple?.subscriptionPlan === 'monthly' || couple?.subscriptionPlan === 'yearly';

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
    <div className="nexus-app" data-testid="pricing-page">
      <section className="hero" style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="hero-content" style={{ maxWidth: '1200px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              <Sparkles size={32} style={{ color: '#667eea' }} />
              <h1 style={{ 
                fontSize: '2.5em', 
                fontWeight: 'bold',
                background: 'var(--nexus-gradient-full)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Spark It! Premium
              </h1>
            </div>
            <p style={{ fontSize: '1.1em', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              Never waste time deciding again. Get instant, exciting activity suggestions that you both love.
            </p>
          </div>

          {/* Premium Active Card (for premium users) */}
          {isPremium && (
            <div style={{
              maxWidth: '700px',
              margin: '0 auto 50px',
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(231, 76, 60, 0.2) 100%)',
              border: '2px solid rgba(102, 126, 234, 0.5)',
              borderRadius: '20px',
              textAlign: 'center',
            }} data-testid="premium-status-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                <Crown size={32} style={{ color: '#FFD700' }} />
                <h2 style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'white' }}>You're Premium!</h2>
              </div>
              <p style={{ fontSize: '1em', color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
                You have unlimited sparks and access to all premium features. Want to switch plans?
              </p>
              <p style={{ fontSize: '0.95em', color: 'rgba(255,255,255,0.7)', marginBottom: '25px' }}>
                Current Plan: <span style={{ fontWeight: 'bold', textTransform: 'capitalize', color: 'white' }}>{couple?.subscriptionPlan}</span>
              </p>
              <button
                onClick={() => navigate("/spark")}
                style={{
                  padding: '12px 30px',
                  borderRadius: '25px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                data-testid="button-back-to-spark"
              >
                Back to Spark Button
              </button>
            </div>
          )}

          {/* Trial Info Card (for trial users only) */}
          {!isPremium && (
            <div style={{
              maxWidth: '700px',
              margin: '0 auto 50px',
              padding: '30px',
              background: 'rgba(102, 126, 234, 0.15)',
              border: '2px solid rgba(102, 126, 234, 0.4)',
              borderRadius: '20px',
              textAlign: 'center',
            }} data-testid="trial-info-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                <Zap size={28} style={{ color: '#667eea' }} />
                <h2 style={{ fontSize: '1.6em', fontWeight: 'bold', color: 'white' }}>Your Trial Is Active!</h2>
              </div>
              <p style={{ fontSize: '1em', color: 'rgba(255,255,255,0.8)', marginBottom: '25px' }}>
                Enjoying Spark It? Here's what you're getting for free:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', textAlign: 'left' }}>
                {trialFeatures.map((feature, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Check size={20} style={{ color: '#4ade80', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.95em', color: 'rgba(255,255,255,0.9)' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Toggle and Cards (only for non-premium users) */}
          {!isPremium && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  borderRadius: '12px', 
                  border: '2px solid rgba(255,255,255,0.2)', 
                  padding: '5px',
                  background: 'rgba(255,255,255,0.05)'
                }}>
                  <button
                    onClick={() => setSelectedPlan("monthly")}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontSize: '0.95em',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      border: 'none',
                      cursor: 'pointer',
                      background: selectedPlan === "monthly" ? 'var(--nexus-gradient-full)' : 'transparent',
                      color: 'white',
                    }}
                    data-testid="button-monthly-plan"
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedPlan("yearly")}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontSize: '0.95em',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      border: 'none',
                      cursor: 'pointer',
                      background: selectedPlan === "yearly" ? 'var(--nexus-gradient-full)' : 'transparent',
                      color: 'white',
                      position: 'relative',
                    }}
                    data-testid="button-yearly-plan"
                  >
                    Yearly
                    <span style={{ 
                      position: 'absolute', 
                      top: '-8px', 
                      right: '-8px', 
                      background: '#4ade80', 
                      color: '#0a0a0a', 
                      fontSize: '0.7em', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}>
                      Save $24
                    </span>
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '900px', margin: '0 auto' }}>
                {/* Monthly Plan */}
                <div style={{
                  position: 'relative',
                  padding: '30px',
                  background: selectedPlan === "monthly" 
                    ? 'rgba(102, 126, 234, 0.2)' 
                    : 'rgba(255,255,255,0.05)',
                  border: selectedPlan === "monthly"
                    ? '3px solid #667eea'
                    : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  transition: 'all 0.3s',
                  transform: selectedPlan === "monthly" ? 'scale(1.05)' : 'scale(1)',
                  opacity: selectedPlan === "monthly" ? 1 : 0.8,
                }} data-testid="card-monthly-plan">
                  <h3 style={{ fontSize: '1.6em', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>Monthly Premium</h3>
                  <p style={{ fontSize: '0.95em', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>Perfect for trying things out</p>
                  <div style={{ marginBottom: '25px' }}>
                    <span style={{ fontSize: '2.5em', fontWeight: 'bold', color: 'white' }}>$6.99</span>
                    <span style={{ fontSize: '1em', color: 'rgba(255,255,255,0.6)' }}>/month</span>
                  </div>
                  <div style={{ marginBottom: '25px' }}>
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                        <Check size={18} style={{ color: '#4ade80', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.9em', color: 'rgba(255,255,255,0.9)' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSubscribe("monthly")}
                    disabled={subscribeMutation.isPending}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'var(--nexus-gradient-full)',
                      border: 'none',
                      color: 'white',
                      fontSize: '1em',
                      fontWeight: 'bold',
                      cursor: subscribeMutation.isPending ? 'not-allowed' : 'pointer',
                      opacity: subscribeMutation.isPending ? 0.6 : 1,
                      transition: 'opacity 0.3s',
                    }}
                    onMouseEnter={(e) => !subscribeMutation.isPending && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !subscribeMutation.isPending && (e.currentTarget.style.opacity = '1')}
                    data-testid="button-subscribe-monthly"
                  >
                    {subscribeMutation.isPending && selectedPlan === "monthly" ? "Processing..." : "Get Monthly"}
                  </button>
                </div>

                {/* Yearly Plan */}
                <div style={{
                  position: 'relative',
                  padding: '30px',
                  background: selectedPlan === "yearly" 
                    ? 'rgba(231, 76, 60, 0.2)' 
                    : 'rgba(255,255,255,0.05)',
                  border: selectedPlan === "yearly"
                    ? '3px solid #e74c3c'
                    : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  transition: 'all 0.3s',
                  transform: selectedPlan === "yearly" ? 'scale(1.05)' : 'scale(1)',
                  opacity: selectedPlan === "yearly" ? 1 : 0.8,
                }} data-testid="card-yearly-plan">
                  {selectedPlan === "yearly" && (
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#4ade80',
                      color: '#0a0a0a',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontSize: '0.85em',
                      fontWeight: 'bold',
                    }}>
                      Best Value
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.6em', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>Yearly Premium</h3>
                  <p style={{ fontSize: '0.95em', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>Save $24 vs monthly billing</p>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '2.5em', fontWeight: 'bold', color: 'white' }}>$59.99</span>
                    <span style={{ fontSize: '1em', color: 'rgba(255,255,255,0.6)' }}>/year</span>
                  </div>
                  <p style={{ fontSize: '0.9em', color: '#4ade80', fontWeight: '600', marginBottom: '20px' }}>
                    Just $5/month when billed annually
                  </p>
                  <div style={{ marginBottom: '25px' }}>
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                        <Check size={18} style={{ color: '#4ade80', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.9em', color: 'rgba(255,255,255,0.9)' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSubscribe("yearly")}
                    disabled={subscribeMutation.isPending}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'var(--nexus-gradient-full)',
                      border: 'none',
                      color: 'white',
                      fontSize: '1em',
                      fontWeight: 'bold',
                      cursor: subscribeMutation.isPending ? 'not-allowed' : 'pointer',
                      opacity: subscribeMutation.isPending ? 0.6 : 1,
                      transition: 'opacity 0.3s',
                    }}
                    onMouseEnter={(e) => !subscribeMutation.isPending && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !subscribeMutation.isPending && (e.currentTarget.style.opacity = '1')}
                    data-testid="button-subscribe-yearly"
                  >
                    {subscribeMutation.isPending && selectedPlan === "yearly" ? "Processing..." : "Get Yearly"}
                  </button>
                </div>
              </div>

              {/* FAQ Section */}
              <div style={{ maxWidth: '700px', margin: '80px auto 0' }}>
                <h2 style={{ fontSize: '1.8em', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px', color: 'white' }}>
                  Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '10px', color: 'white' }}>
                      What happens when my trial ends?
                    </h3>
                    <p style={{ fontSize: '0.95em', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                      After you've used your 10 free sparks or 7 days pass (whichever comes first), you'll need to
                      subscribe to continue sparking activities. Your progress and scoreboard data will be saved.
                    </p>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '10px', color: 'white' }}>
                      Can I cancel anytime?
                    </h3>
                    <p style={{ fontSize: '0.95em', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                      Absolutely! You can cancel your subscription at any time. You'll continue to have access until
                      the end of your billing period.
                    </p>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '10px', color: 'white' }}>
                      Is the yearly plan really worth it?
                    </h3>
                    <p style={{ fontSize: '0.95em', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                      Yes! The yearly plan saves you $24 compared to paying monthly ($83.88 vs $59.99). That's like
                      getting 3.5 months free!
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Back Button */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <button
              onClick={() => navigate("/spark")}
              style={{
                padding: '12px 30px',
                borderRadius: '25px',
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: 'white',
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              data-testid="button-back-spark"
            >
              Back to Spark Button
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
