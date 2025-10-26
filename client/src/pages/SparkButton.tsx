import { useState, useEffect } from "react";
import { Zap, Users, Check, UserPlus, Brain, Trophy, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SparkitCouple } from "@shared/schema";
import "../nexus-styles.css";

export default function SparkButton() {
  const [, setLocation] = useLocation();
  const [user1Pressed, setUser1Pressed] = useState(false);
  const [user2Pressed, setUser2Pressed] = useState(false);

  // Check authentication via session
  const { data: authData, isLoading: authLoading } = useQuery<{ coupleId: string; partnerRole: string } | null>({
    queryKey: ["/api/sparkit/auth/me"],
    retry: false,
  });

  const coupleId = authData?.coupleId ?? null;

  // Fetch couple data from database
  const { data: couple, isLoading } = useQuery<SparkitCouple>({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
    refetchInterval: 5000, // Refresh every 5 seconds to check for partner joining
  });

  // Mutation to use a spark
  const useSparkMutation = useMutation({
    mutationFn: async () => {
      if (!coupleId) throw new Error("No couple ID");
      const res = await apiRequest("POST", `/api/sparkit/couples/${coupleId}/use-spark`, {});
      
      // Check if request failed (403 = trial expired)
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to use spark");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      // Spark successfully used - navigate to activity page
      queryClient.invalidateQueries({ queryKey: ["/api/sparkit/couples", coupleId] });
      setLocation("/spark-activity");
    },
    onError: (error: any) => {
      // Trial expired or other error - navigate to pricing
      console.error("Spark error:", error.message);
      setLocation("/sparkit/pricing");
    },
  });

  // Handle navigation when both press
  useEffect(() => {
    if (user1Pressed && user2Pressed && couple && !useSparkMutation.isPending) {
      const timer = setTimeout(() => {
        // Use a spark via API - navigation handled in onSuccess/onError
        useSparkMutation.mutate();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [user1Pressed, user2Pressed, couple, useSparkMutation.isPending]);

  const handleUser1Press = () => {
    if (!couple || (couple.sparksRemaining ?? 0) <= 0) {
      setLocation("/sparkit/pricing");
      return;
    }
    setUser1Pressed(true);
  };

  const handleUser2Press = () => {
    if (!couple || (couple.sparksRemaining ?? 0) <= 0) {
      setLocation("/sparkit/pricing");
      return;
    }
    setUser2Pressed(true);
  };

  const handleReset = () => {
    setUser1Pressed(false);
    setUser2Pressed(false);
  };

  const bothPressed = user1Pressed && user2Pressed;

  // If not authenticated, redirect to login
  if (!authLoading && !coupleId) {
    return (
      <div className="nexus-app" data-testid="spark-button-page">
        <section className="hero" style={{ minHeight: '100vh' }}>
          <div className="hero-content">
            <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>Welcome to Spark It!</h1>
            <p style={{ fontSize: '1.3em', marginBottom: '50px', maxWidth: '700px', lineHeight: '1.6' }}>
              You need to log in to start sparking.
            </p>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setLocation("/sparkit/login")}
                className="cta-button"
                data-testid="button-login"
              >
                Log In
              </button>

              <button
                onClick={() => setLocation("/sparkit/signup")}
                className="cta-button"
                data-testid="button-create-couple"
              >
                <UserPlus size={20} style={{ marginRight: '10px' }} />
                Create Couple Account
              </button>
              
              <button
                onClick={() => setLocation("/sparkit/join")}
                className="cta-button"
                style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid #667eea' }}
                data-testid="button-join-couple"
              >
                Join with Code
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="nexus-app" data-testid="spark-button-page">
        <section className="hero" style={{ minHeight: '100vh' }}>
          <div className="hero-content">
            <p style={{ fontSize: '1.3em' }}>Loading...</p>
          </div>
        </section>
      </div>
    );
  }

  // If couple not found
  if (!couple) {
    return (
      <div className="nexus-app" data-testid="spark-button-page">
        <section className="hero" style={{ minHeight: '100vh' }}>
          <div className="hero-content">
            <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>Couple Not Found</h1>
            <p style={{ fontSize: '1.3em', marginBottom: '50px', maxWidth: '700px', lineHeight: '1.6' }}>
              We couldn't find your couple account. Please try signing up again.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("sparkitCoupleId");
                setLocation("/sparkit/signup");
              }}
              className="cta-button"
              data-testid="button-create-new-couple"
            >
              Create New Account
            </button>
          </div>
        </section>
      </div>
    );
  }

  const sparksRemaining = couple.sparksRemaining || 0;
  const isPremium = couple.subscriptionPlan === 'premium_monthly' || couple.subscriptionPlan === 'premium_yearly';
  const isOnTrial = couple.subscriptionPlan === 'trial';
  
  // Calculate trial status
  const trialSparksUsed = couple.totalSparksUsed || 0;
  const trialSparksRemaining = Math.max(0, 10 - trialSparksUsed);
  
  let trialDaysRemaining = 0;
  if (couple.partner2JoinedAt && isOnTrial) {
    const joinDate = new Date(couple.partner2JoinedAt);
    const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    trialDaysRemaining = Math.max(0, 7 - daysSinceJoin);
  }

  return (
    <div className="nexus-app" data-testid="spark-button-page">
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '1.5em', 
            background: 'var(--nexus-gradient-full)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Spark It!
          </h2>
          <p style={{ fontSize: '0.9em', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
            {couple.partner1Name} {couple.partner2Name ? `& ${couple.partner2Name}` : '(waiting for partner)'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          <div data-testid="sparks-remaining" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            color: sparksRemaining === 0 && !isPremium ? '#e74c3c' : 'rgba(255,255,255,0.8)'
          }}>
            <Zap size={20} color="#e74c3c" />
            <span>
              {isPremium 
                ? 'Unlimited Sparks' 
                : sparksRemaining === 0 
                  ? 'Trial limit reached' 
                  : `${sparksRemaining} sparks remaining`
              }
            </span>
          </div>
          {isOnTrial && couple.partner2JoinedAt && (
            <div style={{ fontSize: '0.85em', color: 'rgba(255,255,255,0.5)' }} data-testid="trial-status">
              Trial: {trialSparksUsed}/10 sparks used • {trialDaysRemaining} days left
            </div>
          )}
        </div>
      </div>

      {/* Navigation section for additional features */}
      {couple.partner2Name && (
        <div style={{ 
          padding: '20px', 
          display: 'flex', 
          justifyContent: 'center',
          gap: '15px',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={() => setLocation("/sparkit/trivia/categories")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '30px',
              background: 'rgba(102, 126, 234, 0.2)',
              border: '2px solid #667eea',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'all 0.3s',
            }}
            data-testid="button-trivia"
          >
            <Brain size={20} />
            Trivia Challenge
          </button>
          <button
            onClick={() => setLocation("/scoreboard")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '30px',
              background: 'rgba(231, 76, 60, 0.2)',
              border: '2px solid #e74c3c',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'all 0.3s',
            }}
            data-testid="button-scoreboard"
          >
            <Trophy size={20} />
            Scoreboard
          </button>
          <button
            onClick={() => setLocation("/sparkit/settings")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '30px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'all 0.3s',
            }}
            data-testid="button-settings"
          >
            <Settings size={20} />
            Settings
          </button>
        </div>
      )}

      {/* Partner 2 not yet joined */}
      {!couple.partner2Name && (
        <section className="hero" style={{ minHeight: '80vh' }}>
          <div className="hero-content">
            <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>Waiting for Your Partner</h1>
            <p style={{ fontSize: '1.3em', marginBottom: '50px', maxWidth: '700px', lineHeight: '1.6' }}>
              Share your couple code <strong style={{ color: '#e74c3c' }}>{couple.coupleCode}</strong> with your partner so they can join.
            </p>
            
            <div style={{
              padding: '40px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '15px',
              border: '2px solid rgba(102, 126, 234, 0.5)',
              maxWidth: '500px',
            }}>
              <p style={{ fontSize: '2.5em', fontWeight: 'bold', letterSpacing: '0.2em', marginBottom: '20px' }}>
                {couple.coupleCode}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(couple.coupleCode);
                }}
                className="cta-button"
                data-testid="button-copy-code"
              >
                Copy Code
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Spark Area - Only show when partner has joined */}
      {couple.partner2Name && (
        <section className="hero" style={{ minHeight: '80vh' }}>
          <div className="hero-content">
            <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>Ready to Spark?</h1>
            <p style={{ fontSize: '1.3em', marginBottom: '50px', maxWidth: '700px', lineHeight: '1.6' }}>
              <strong>Demo:</strong> Both partners press their button at the same time. 
              For this demo, press both buttons below to simulate the experience.
            </p>
            
            {sparksRemaining === 0 && !isPremium && (
              <div style={{
                padding: '30px',
                background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(231, 76, 60, 0.1) 100%)',
                borderRadius: '15px',
                border: '2px solid #e74c3c',
                marginBottom: '40px',
                maxWidth: '600px',
              }}>
                <h3 style={{ color: '#e74c3c', fontSize: '1.8em', marginBottom: '15px' }}>
                  Trial Limit Reached!
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px', fontSize: '1.1em' }}>
                  {trialDaysRemaining === 0 
                    ? "Your 7-day trial has ended. Upgrade to Premium for unlimited sparks!"
                    : "You've used all 10 trial sparks. Upgrade to Premium for unlimited daily sparks!"}
                </p>
                <button
                  onClick={() => setLocation("/sparkit/pricing")}
                  className="cta-button"
                  style={{
                    background: 'var(--nexus-gradient-passion)',
                    padding: '15px 35px',
                  }}
                  data-testid="button-upgrade-now"
                >
                  View Premium Plans
                </button>
              </div>
            )}

            {/* Dual Button Interface */}
            <div style={{ 
              display: 'flex', 
              gap: '60px', 
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '40px',
              opacity: sparksRemaining === 0 && !isPremium ? 0.4 : 1,
              pointerEvents: sparksRemaining === 0 && !isPremium ? 'none' : 'auto',
            }}>
              {/* Partner 1 Button */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>
                  <Users size={20} style={{ display: 'inline', marginRight: '8px' }} />
                  {couple.partner1Name}
                </p>
                <button 
                  onClick={handleUser1Press}
                  disabled={user1Pressed || bothPressed || (sparksRemaining === 0 && !isPremium)}
                  className="spark-button-demo"
                  data-testid="button-spark-user1"
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: user1Pressed 
                      ? 'var(--nexus-gradient-royal)' 
                      : 'var(--nexus-gradient-passion)',
                    border: 'none',
                    cursor: user1Pressed ? 'default' : 'pointer',
                    boxShadow: user1Pressed 
                      ? '0 15px 40px rgba(102, 126, 234, 0.6)' 
                      : '0 20px 60px rgba(231, 76, 60, 0.6)',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                    fontSize: '1.8em',
                    fontWeight: 'bold',
                    color: 'white',
                    opacity: user1Pressed ? 0.8 : 1,
                  }}
                >
                  {user1Pressed ? <Check size={60} /> : <Zap size={60} />}
                  {user1Pressed ? 'Ready!' : 'PRESS'}
                </button>
              </div>

              {/* Partner 2 Button */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>
                  <Users size={20} style={{ display: 'inline', marginRight: '8px' }} />
                  {couple.partner2Name}
                </p>
                <button 
                  onClick={handleUser2Press}
                  disabled={user2Pressed || bothPressed || (sparksRemaining === 0 && !isPremium)}
                  className="spark-button-demo"
                  data-testid="button-spark-user2"
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: user2Pressed 
                      ? 'var(--nexus-gradient-royal)' 
                      : 'var(--nexus-gradient-passion)',
                    border: 'none',
                    cursor: user2Pressed ? 'default' : 'pointer',
                    boxShadow: user2Pressed 
                      ? '0 15px 40px rgba(102, 126, 234, 0.6)' 
                      : '0 20px 60px rgba(231, 76, 60, 0.6)',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                    fontSize: '1.8em',
                    fontWeight: 'bold',
                    color: 'white',
                    opacity: user2Pressed ? 0.8 : 1,
                  }}
                >
                  {user2Pressed ? <Check size={60} /> : <Zap size={60} />}
                  {user2Pressed ? 'Ready!' : 'PRESS'}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {(sparksRemaining > 0 || isPremium) && !user1Pressed && !user2Pressed && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1em' }}>
                Press both buttons to generate your activity
              </p>
            )}

            {(user1Pressed || user2Pressed) && !bothPressed && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#e74c3c', fontSize: '1.3em', marginBottom: '20px' }}>
                  {user1Pressed && !user2Pressed && `${couple.partner1Name} ready! Waiting for ${couple.partner2Name}...`}
                  {user2Pressed && !user1Pressed && `${couple.partner2Name} ready! Waiting for ${couple.partner1Name}...`}
                </p>
                <button 
                  onClick={handleReset}
                  style={{
                    padding: '15px 30px',
                    borderRadius: '30px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.1em',
                    transition: 'all 0.3s',
                  }}
                  data-testid="button-cancel"
                >
                  Reset
                </button>
              </div>
            )}

            {bothPressed && (
              <p style={{ color: '#e74c3c', fontSize: '1.5em', fontWeight: 'bold' }}>
                Spark Ignited! Getting your activity...
              </p>
            )}

            {/* Info Box */}
            <div style={{
              marginTop: '60px',
              maxWidth: '600px',
              padding: '30px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>
                How It Works in the Real App:
              </h3>
              <ul style={{ 
                textAlign: 'left', 
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.8',
                listStyle: 'none',
                padding: 0,
              }}>
                <li style={{ marginBottom: '10px' }}>
                  <strong style={{ color: 'white' }}>1.</strong> Each partner opens the app on their device
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong style={{ color: 'white' }}>2.</strong> Both press their SPARK button within seconds of each other
                </li>
                <li>
                  <strong style={{ color: 'white' }}>3.</strong> When both are ready, you instantly get your activity
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
