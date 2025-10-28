import { useState, useEffect } from "react";
import { Zap, Users, Check, UserPlus, Brain, Trophy, Settings, Crown, Sparkles, Send, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SparkitCouple } from "@shared/schema";
import "../nexus-styles.css";

export default function SparkButton() {
  const [, setLocation] = useLocation();
  const [myButtonPressed, setMyButtonPressed] = useState(false);
  const [partnerButtonPressed, setPartnerButtonPressed] = useState(false);
  const [coupleIdFromStorage, setCoupleIdFromStorage] = useState<string | null>(null);

  // Get couple ID from localStorage on mount
  useEffect(() => {
    const storedCoupleId = localStorage.getItem("sparkitCoupleId");
    setCoupleIdFromStorage(storedCoupleId);
  }, []);

  // Check authentication via session
  const { data: authData, isLoading: authLoading} = useQuery<{ coupleId: string; partnerRole: string } | null>({
    queryKey: ["/api/sparkit/auth/me"],
    retry: false,
  });

  // Use localStorage coupleId as fallback if session auth hasn't loaded yet
  const coupleId = authData?.coupleId ?? coupleIdFromStorage;
  const partnerRole = authData?.partnerRole ?? null;

  // Fetch couple data from database
  const { data: couple, isLoading } = useQuery<SparkitCouple>({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
    refetchInterval: 5000, // Refresh every 5 seconds to check for partner joining
  });

  // WebSocket connection for real-time button press synchronization
  useEffect(() => {
    if (!coupleId || !partnerRole) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}?userId=sparkit-${coupleId}-${partnerRole}`);

    ws.onopen = () => {
      console.log('[WebSocket] Connected for spark synchronization');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(`[WebSocket] Received message:`, message);
        
        if (message.type === 'spark-button-press') {
          const pressedPartner = message.data.partner;
          console.log(`[WebSocket] Button press from ${pressedPartner}, my role is ${partnerRole}`);
          
          // If the pressed partner matches my role, update MY button
          // If the pressed partner is different, update PARTNER button
          if (pressedPartner === partnerRole) {
            console.log('[WebSocket] My button was pressed');
            setMyButtonPressed(true);
          } else {
            console.log('[WebSocket] Partner button was pressed');
            setPartnerButtonPressed(true);
          }
        } else if (message.type === 'spark-button-reset') {
          console.log('[WebSocket] Reset button states');
          setMyButtonPressed(false);
          setPartnerButtonPressed(false);
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [coupleId, partnerRole]);

  // Check for recent partner button press from database (for when partner wasn't connected)
  useEffect(() => {
    if (!couple || !partnerRole) return;

    const otherPartner = partnerRole === 'partner1' ? 'partner2' : 'partner1';
    const partnerPressTime = otherPartner === 'partner1' ? couple.partner1LastPressed : couple.partner2LastPressed;
    const myPressTime = partnerRole === 'partner1' ? couple.partner1LastPressed : couple.partner2LastPressed;
    const fiveMinutes = 5 * 60 * 1000;

    // Check if partner pressed within last 5 minutes
    if (partnerPressTime) {
      const timeSincePress = Date.now() - new Date(partnerPressTime).getTime();
      
      if (timeSincePress < fiveMinutes) {
        console.log('[Button State] Partner pressed recently, setting partnerButtonPressed = true');
        setPartnerButtonPressed(true);
      } else {
        console.log('[Button State] Partner press expired, setting partnerButtonPressed = false');
        setPartnerButtonPressed(false);
      }
    } else {
      // No timestamp = no recent press
      setPartnerButtonPressed(false);
    }

    // Check if I pressed recently (restore my button state)
    if (myPressTime) {
      const timeSincePress = Date.now() - new Date(myPressTime).getTime();
      
      if (timeSincePress < fiveMinutes) {
        console.log('[Button State] I pressed recently, setting myButtonPressed = true');
        setMyButtonPressed(true);
      } else {
        console.log('[Button State] My press expired, setting myButtonPressed = false');
        setMyButtonPressed(false);
      }
    } else {
      // No timestamp = no recent press
      setMyButtonPressed(false);
    }
  }, [couple, partnerRole]);

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
      // Clear button states before navigation to prevent stale state on return
      console.log('[Spark Mutation] Clearing button states before navigation');
      setMyButtonPressed(false);
      setPartnerButtonPressed(false);
      
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

  // Handle navigation when both partners press
  useEffect(() => {
    if (myButtonPressed && partnerButtonPressed && couple && !useSparkMutation.isPending) {
      const timer = setTimeout(() => {
        // Use a spark via API - navigation handled in onSuccess/onError
        useSparkMutation.mutate();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [myButtonPressed, partnerButtonPressed, couple, useSparkMutation.isPending]);

  const handleMyButtonPress = async () => {
    if (!couple || (couple.sparksRemaining ?? 0) <= 0) {
      setLocation("/sparkit/pricing");
      return;
    }
    
    // Notify partner via WebSocket (backend derives partner from session)
    try {
      console.log('[Button] Notifying backend of my button press');
      await apiRequest("POST", `/api/sparkit/couples/${coupleId}/button-press`, {});
      console.log('[Button] Backend notified successfully - setting myButtonPressed = true');
      setMyButtonPressed(true);
    } catch (error) {
      console.error('Failed to notify partner:', error);
      // Don't set pressed state if API call failed
    }
  };

  const handleSendSparkRequest = async () => {
    const sparkUrl = `${window.location.origin}/spark`;
    const partnerName = partnerRole === 'partner1' ? couple?.partner2Name : couple?.partner1Name;
    const myName = partnerRole === 'partner1' ? couple?.partner1Name : couple?.partner2Name;
    
    const shareText = `${myName} wants to Spark It! with you! 🎯\n\nClick this link to start sparking together:\n${sparkUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Let's Spark It!",
          text: shareText,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareText);
      // Show toast notification
      alert("Spark request copied to clipboard! Send it to your partner.");
    }
  };

  const handleReset = async () => {
    setMyButtonPressed(false);
    setPartnerButtonPressed(false);
    
    // Notify partner to reset as well
    try {
      await apiRequest("POST", `/api/sparkit/couples/${coupleId}/button-reset`, {});
    } catch (error) {
      console.error('Failed to notify partner of reset:', error);
    }
  };

  const bothPressed = myButtonPressed && partnerButtonPressed;
  const myName = partnerRole === 'partner1' ? couple?.partner1Name : couple?.partner2Name;
  const partnerName = partnerRole === 'partner1' ? couple?.partner2Name : couple?.partner1Name;

  // If not authenticated, redirect to login
  if (!authLoading && !coupleId) {
    return (
      <div className="nexus-app" data-testid="spark-button-page">
        <section className="hero" style={{ minHeight: '100vh' }}>
          <div className="hero-content">
            <h1 style={{ fontSize: '1.8em', marginBottom: '20px', lineHeight: '1.3' }}>Welcome to Spark It!</h1>
            <p style={{ fontSize: '1em', marginBottom: '50px', maxWidth: '700px', lineHeight: '1.6' }}>
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
            <p style={{ fontSize: '1em' }}>Loading...</p>
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
            <h1 style={{ fontSize: '1.8em', marginBottom: '20px', lineHeight: '1.3' }}>Couple Not Found</h1>
            <p style={{ fontSize: '1em', marginBottom: '50px', maxWidth: '700px', lineHeight: '1.6' }}>
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
  const isPremium = couple.subscriptionPlan === 'monthly' || couple.subscriptionPlan === 'yearly';
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ 
              fontSize: '1.5em', 
              background: 'var(--nexus-gradient-full)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Spark It!
            </h2>
            {isPremium && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                borderRadius: '20px',
                fontSize: '0.75em',
                fontWeight: 'bold',
                color: '#000',
              }} data-testid="badge-premium">
                <Crown size={14} />
                PREMIUM
              </div>
            )}
          </div>
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
          {!isPremium && (
            <button
              onClick={() => setLocation("/sparkit/premium")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)',
                border: '2px solid #FFD700',
                color: '#FFD700',
                cursor: 'pointer',
                fontSize: '1em',
                transition: 'all 0.3s',
                fontWeight: 'bold',
              }}
              data-testid="button-upgrade-premium"
            >
              <Crown size={20} />
              Upgrade to Premium
            </button>
          )}
          <button
            onClick={() => setLocation("/sparkit/settings")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '30px',
              background: isPremium 
                ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(231, 76, 60, 0.2) 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              border: isPremium
                ? '2px solid rgba(138, 43, 226, 0.5)'
                : '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'all 0.3s',
              position: 'relative',
            }}
            data-testid="button-settings"
            title="Customize display names and avatars"
          >
            <Settings size={20} />
            Settings
            {isPremium && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
              }}>
                <Sparkles size={14} strokeWidth={3} />
              </span>
            )}
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
            <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>
              {bothPressed ? '✨ SPARK IGNITED! ✨' : partnerButtonPressed ? `Waiting for you, ${myName}!` : 'Ready to Spark?'}
            </h1>
            <p style={{ fontSize: '1.2em', marginBottom: '30px', maxWidth: '700px', lineHeight: '1.6' }}>
              {bothPressed 
                ? 'Both partners pressed! Getting your activity...'
                : partnerButtonPressed 
                  ? `${partnerName} is ready and waiting for you to press your button!`
                  : 'Press your button when you\'re both ready to discover a fun activity together!'
              }
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
                  onClick={() => setLocation("/sparkit/premium")}
                  className="cta-button"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    padding: '15px 35px',
                    fontWeight: 'bold',
                  }}
                  data-testid="button-upgrade-now"
                >
                  <Crown size={20} style={{ display: 'inline', marginRight: '8px' }} />
                  Upgrade to Premium
                </button>
              </div>
            )}

            {/* Celebration Sparkles */}
            {bothPressed && (
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 1000,
              }}>
                {[...Array(8)].map((_, i) => (
                  <Sparkles
                    key={i}
                    size={40}
                    color="#FFD700"
                    style={{
                      position: 'absolute',
                      top: `${Math.cos((i * Math.PI) / 4) * 150}px`,
                      left: `${Math.sin((i * Math.PI) / 4) * 150}px`,
                      animation: 'nexus-sparkle 1s ease-out infinite',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Single Button for Current User */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '40px', 
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '40px',
            }}>
              {/* My Spark Button */}
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '1.1em' }}>
                  <Users size={20} style={{ display: 'inline', marginRight: '8px' }} />
                  {myName}'s Button
                </p>
                <button 
                  onClick={handleMyButtonPress}
                  disabled={myButtonPressed || bothPressed || (sparksRemaining === 0 && !isPremium)}
                  className="spark-button-demo"
                  data-testid="button-spark-my"
                  style={{
                    position: 'relative',
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    background: bothPressed
                      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                      : myButtonPressed 
                        ? 'var(--nexus-gradient-royal)' 
                        : 'var(--nexus-gradient-passion)',
                    border: bothPressed ? '4px solid #FFD700' : myButtonPressed ? '3px solid #667eea' : '3px solid transparent',
                    cursor: myButtonPressed || (sparksRemaining === 0 && !isPremium) ? 'default' : 'pointer',
                    boxShadow: bothPressed
                      ? '0 0 60px rgba(255, 215, 0, 0.8), 0 0 100px rgba(255, 215, 0, 0.5)'
                      : myButtonPressed 
                        ? '0 15px 40px rgba(102, 126, 234, 0.6), inset 0 0 30px rgba(102, 126, 234, 0.3)' 
                        : '0 20px 60px rgba(231, 76, 60, 0.6), inset 0 0 30px rgba(231, 76, 60, 0.2)',
                    transition: 'all 0.4s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                    fontSize: '2em',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    animation: !myButtonPressed && !bothPressed ? 'nexus-button-pulse 2s ease-in-out infinite' : bothPressed ? 'nexus-spark-celebration 0.6s ease-in-out' : 'none',
                    opacity: sparksRemaining === 0 && !isPremium ? 0.4 : 1,
                    pointerEvents: sparksRemaining === 0 && !isPremium ? 'none' : 'auto',
                  }}
                >
                  {bothPressed ? <Sparkles size={80} /> : myButtonPressed ? <Check size={80} /> : <Zap size={80} />}
                  <span style={{ fontSize: '0.55em', letterSpacing: '3px' }}>
                    {bothPressed ? 'SPARK!' : myButtonPressed ? 'READY!' : 'PRESS'}
                  </span>
                </button>
              </div>

              {/* Partner Status Indicator */}
              {partnerButtonPressed && !bothPressed && (
                <div style={{
                  padding: '20px 40px',
                  background: 'rgba(102, 126, 234, 0.2)',
                  borderRadius: '15px',
                  border: '2px solid #667eea',
                  textAlign: 'center',
                  animation: 'nexus-button-pulse 1.5s ease-in-out infinite',
                }}>
                  <p style={{ fontSize: '1.3em', fontWeight: 'bold', marginBottom: '5px' }}>
                    {partnerName} is READY!
                  </p>
                  <p style={{ fontSize: '1em', color: 'rgba(255,255,255,0.7)' }}>
                    Press your button to Spark it together!
                  </p>
                </div>
              )}

              {/* Send Spark Request Button */}
              {!partnerButtonPressed && !myButtonPressed && (
                <button
                  onClick={handleSendSparkRequest}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '15px 30px',
                    borderRadius: '30px',
                    background: 'rgba(102, 126, 234, 0.2)',
                    border: '2px solid #667eea',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.1em',
                    transition: 'all 0.3s',
                  }}
                  data-testid="button-send-spark-request"
                >
                  <Share2 size={20} />
                  Send Spark It! Request to {partnerName}
                </button>
              )}

              {/* Reset button (for testing) */}
              {(myButtonPressed || partnerButtonPressed) && !bothPressed && (
                <button
                  onClick={handleReset}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                  }}
                  data-testid="button-reset"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
