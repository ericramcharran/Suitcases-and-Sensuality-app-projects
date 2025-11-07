import { useState, useEffect } from "react";
import { Zap, Users, Check, UserPlus, Brain, Trophy, Settings, Crown, Sparkles, Send, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SparkitCouple } from "@shared/schema";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import "../nexus-styles.css";

export default function SparkButton() {
  const [, setLocation] = useLocation();
  const [myButtonPressed, setMyButtonPressed] = useState(false);
  const [partnerButtonPressed, setPartnerButtonPressed] = useState(false);
  const [coupleIdFromStorage, setCoupleIdFromStorage] = useState<string | null>(null);
  const [showPremiumAnimation, setShowPremiumAnimation] = useState(true);

  // Get couple ID from localStorage on mount
  useEffect(() => {
    const storedCoupleId = localStorage.getItem("sparkitCoupleId");
    setCoupleIdFromStorage(storedCoupleId);
  }, []);

  // Disable premium animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPremiumAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
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
    gcTime: 0, // Don't cache in memory
    staleTime: 0, // Always fetch fresh data
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
        } else if (message.type === 'spark-used') {
          console.log('[WebSocket] Spark used - navigating to activity page');
          const navigateTo = message.data.navigateTo;
          if (navigateTo) {
            // Invalidate cache before navigating so we get fresh activity data
            queryClient.invalidateQueries({ queryKey: ["/api/sparkit/couples", coupleId] });
            setLocation(navigateTo);
          }
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

    // If both timestamps are null, ensure buttons are fully reset
    if (!partnerPressTime && !myPressTime) {
      console.log('[Button State] Both timestamps null - resetting all button states');
      setPartnerButtonPressed(false);
      setMyButtonPressed(false);
      return;
    }

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
  // IMPORTANT: Only partner1 calls the API to prevent duplicate activity generation
  useEffect(() => {
    console.log('[Navigation Check]', {
      myButtonPressed,
      partnerButtonPressed,
      hasCouple: !!couple,
      isPending: useSparkMutation.isPending,
      partnerRole,
      willTrigger: myButtonPressed && partnerButtonPressed && couple && !useSparkMutation.isPending && partnerRole === 'partner1'
    });
    
    // Only partner1 makes the API call to prevent duplicate activity generation
    if (myButtonPressed && partnerButtonPressed && couple && !useSparkMutation.isPending && partnerRole === 'partner1') {
      console.log('[Navigation] Both buttons pressed! Partner1 will use spark in 800ms');
      const timer = setTimeout(() => {
        console.log('[Navigation] Calling use-spark mutation now (partner1 only)');
        // Use a spark via API - navigation handled in onSuccess/onError
        useSparkMutation.mutate();
      }, 800);

      return () => {
        console.log('[Navigation] Clearing timeout (component unmounting or state changed)');
        clearTimeout(timer);
      };
    }
  }, [myButtonPressed, partnerButtonPressed, couple, useSparkMutation.isPending, partnerRole]);

  const handleMyButtonPress = async () => {
    if (!couple) return;
    
    // Check if user is premium (monthly or yearly subscription)
    const isPremium = couple.subscriptionPlan === 'monthly' || couple.subscriptionPlan === 'yearly';
    
    // Only check spark limit for non-premium users (premium users have unlimited sparks)
    if (!isPremium && (couple.sparksRemaining ?? 0) <= 0) {
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

  // Check if trial has expired
  const trialExpired = isOnTrial && sparksRemaining === 0;

  return (
    <div className="nexus-app" data-testid="spark-button-page">
      {/* Trial Expired Modal - Blocks all interaction */}
      {trialExpired && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }} data-testid="modal-trial-expired">
          <div style={{
            maxWidth: '600px',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15) 0%, rgba(231, 76, 60, 0.15) 100%)',
            border: '3px solid #e74c3c',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(231, 76, 60, 0.6)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 30px',
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(231, 76, 60, 0.5)',
            }}>
              <Zap size={50} fill="white" stroke="white" />
            </div>

            <h2 style={{
              fontSize: '2.2em',
              fontWeight: 'bold',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #e74c3c 0%, #FFD700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Trial Limit Reached!
            </h2>

            <p style={{
              fontSize: '1.2em',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '30px',
              lineHeight: '1.6',
            }}>
              {trialDaysRemaining === 0 
                ? "Your 7-day trial has ended. Upgrade to Premium to continue using Spark It! and enjoy unlimited sparks, custom avatars, and video calling!"
                : "You've used all 20 trial sparks! Upgrade to Premium for unlimited sparks and exclusive features."}
            </p>

            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '2px solid #FFD700',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '35px',
            }}>
              <h3 style={{
                fontSize: '1.4em',
                color: '#FFD700',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}>
                <Crown size={24} />
                Premium Features
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                textAlign: 'left',
                fontSize: '1em',
                color: 'rgba(255, 255, 255, 0.85)',
              }}>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Zap size={18} color="#FFD700" />
                  <span>Unlimited Sparks - Never run out!</span>
                </li>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={18} color="#FFD700" />
                  <span>Custom Avatars - Personalize your profile</span>
                </li>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} color="#FFD700" />
                  <span>Video Calling - Connect face-to-face</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setLocation("/sparkit/pricing")}
              className="cta-button"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                padding: '18px 45px',
                fontSize: '1.3em',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 215, 0, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.4)';
              }}
              data-testid="button-upgrade-required"
            >
              <Crown size={24} />
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}
      {/* Header - Mobile Responsive */}
      <div style={{ 
        padding: '12px 4vw', 
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Top row: Logo, Avatars, and Premium Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Logo and Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2.5vw, 12px)' }}>
            <img 
              src="/sparkit-logo.png" 
              alt="Spark It!"
              style={{ 
                width: 'clamp(45px, 11vw, 60px)', 
                height: 'clamp(45px, 11vw, 60px)', 
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <div style={{ minWidth: 0 }}>
              <h2 style={{ 
                fontSize: 'clamp(1.1em, 4vw, 1.4em)',
                fontWeight: '800',
                background: 'var(--nexus-gradient-full)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                whiteSpace: 'nowrap',
                letterSpacing: '-0.3px'
              }}>
                Spark It!
              </h2>
              <p style={{
                fontSize: 'clamp(0.65em, 2.2vw, 0.75em)',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                marginTop: '2px',
                whiteSpace: 'nowrap'
              }}>
                Stop Scrolling. Start Connecting.
              </p>
            </div>
          </div>

          {/* Settings and Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Settings Icon Button */}
            <button
              onClick={() => setLocation("/sparkit/settings")}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isPremium 
                  ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(231, 76, 60, 0.2) 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: isPremium
                  ? '2px solid rgba(138, 43, 226, 0.5)'
                  : '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative',
                flexShrink: 0,
              }}
              data-testid="button-settings"
              title="Settings"
            >
              <Settings size={20} />
              {isPremium && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
                }}>
                  <Sparkles size={11} strokeWidth={3} />
                </span>
              )}
            </button>
            
            {/* Avatars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AvatarDisplay 
                avatarUrl={couple.partner1AvatarUrl} 
                size="md" 
                data-testid="avatar-partner1"
              />
              {couple.partner2Name && (
                <AvatarDisplay 
                  avatarUrl={couple.partner2AvatarUrl} 
                  size="md" 
                  data-testid="avatar-partner2"
                />
              )}
            </div>
            {isPremium && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <style>
                  {`
                    @keyframes premiumPulse {
                      0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
                      }
                      50% {
                        transform: scale(1.1);
                        box-shadow: 0 0 25px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.6);
                      }
                    }
                  `}
                </style>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  borderRadius: '15px',
                  fontSize: '0.7em',
                  fontWeight: 'bold',
                  color: '#000',
                  animation: showPremiumAnimation ? 'premiumPulse 1.5s ease-in-out 2' : 'none',
                  transition: 'all 0.3s ease',
                }} data-testid="badge-premium">
                  <Crown size={12} />
                  PREMIUM
                </div>
                <div data-testid="sparks-remaining" style={{ 
                  fontSize: '0.65em',
                  color: 'rgba(255,255,255,0.8)',
                  whiteSpace: 'nowrap'
                }}>
                  Unlimited Sparks
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Couple Avatar Hero Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          padding: '20px 10px 10px',
          background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.12) 0%, rgba(231, 76, 60, 0.12) 100%)',
          borderRadius: '20px',
          margin: '0 auto',
          maxWidth: '500px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow effect */}
          <div aria-hidden="true" style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          
          {/* Avatars with Heart Separator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
            zIndex: 1,
          }}>
            <AvatarDisplay 
              avatarUrl={couple.partner1AvatarUrl} 
              size="lg" 
              data-testid="hero-avatar-partner1"
            />
            
            {/* Heart Icon */}
            <div aria-hidden="true" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--nexus-purple-royal) 0%, var(--nexus-red-bright) 100%)',
              boxShadow: '0 4px 15px rgba(138, 43, 226, 0.4)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            
            {couple.partner2Name ? (
              <AvatarDisplay 
                avatarUrl={couple.partner2AvatarUrl} 
                size="lg" 
                data-testid="hero-avatar-partner2"
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '2px dashed rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <UserPlus size={28} color="rgba(255,255,255,0.4)" />
              </div>
            )}
          </div>
          
          {/* Names with & Symbol */}
          <p style={{ 
            fontSize: '1.1em', 
            fontWeight: '600',
            textAlign: 'center',
            margin: 0,
            position: 'relative',
            zIndex: 1,
          }}>
            <span style={{ 
              background: 'linear-gradient(135deg, var(--nexus-purple-royal) 0%, rgba(138, 43, 226, 0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {couple.partner1Name}
            </span>
            {couple.partner2Name && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.5)', margin: '0 8px' }}>&</span>
                <span style={{ 
                  background: 'linear-gradient(135deg, var(--nexus-red-bright) 0%, rgba(231, 76, 60, 0.7) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {couple.partner2Name}
                </span>
              </>
            )}
            {!couple.partner2Name && (
              <span style={{ color: 'rgba(255,255,255,0.4)' }}> (waiting for partner)</span>
            )}
          </p>
        </div>

        {/* Sparks counter (for non-premium users) */}
        {!isPremium && (
          <div style={{ textAlign: 'center' }}>
            <div data-testid="sparks-remaining" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              color: sparksRemaining === 0 ? '#e74c3c' : 'rgba(255,255,255,0.8)',
              fontSize: '0.9em'
            }}>
              <Zap size={18} color="#e74c3c" />
              <span>
                {sparksRemaining === 0 
                  ? 'Trial limit reached' 
                  : `${sparksRemaining} sparks remaining`
                }
              </span>
            </div>
            {isOnTrial && couple.partner2JoinedAt && (
              <div style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.5)', marginTop: '5px' }} data-testid="trial-status">
                Trial: {trialSparksUsed}/10 sparks used • {trialDaysRemaining} days left
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Completion Banner */}
      {(() => {
        const myPhone = partnerRole === 'partner1' ? couple.partner1Phone : couple.partner2Phone;
        const needsSettings = !myPhone;
        
        if (needsSettings) {
          return (
            <div style={{
              margin: '20px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(231, 76, 60, 0.1) 100%)',
              border: '2px solid #e74c3c',
              borderRadius: '15px',
              textAlign: 'center',
            }} data-testid="settings-banner">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <Settings size={24} color="#e74c3c" />
                <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#e74c3c' }}>
                  Complete Your Settings
                </h3>
              </div>
              <p style={{ fontSize: '1em', marginBottom: '15px', color: 'rgba(255,255,255,0.9)' }}>
                To receive notifications when your partner presses their button, please add your phone number and enable at least one notification method (Push or SMS).
              </p>
              <button
                onClick={() => setLocation("/sparkit/settings")}
                style={{
                  padding: '12px 24px',
                  borderRadius: '25px',
                  background: '#e74c3c',
                  border: 'none',
                  color: 'white',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#c0392b'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#e74c3c'}
                data-testid="button-go-to-settings"
              >
                <Settings size={18} />
                Go to Settings
              </button>
            </div>
          );
        }
        return null;
      })()}

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
            title="Challenge your partner to head-to-head trivia"
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
            title="View your couple's stats and trivia records"
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
              title="Get unlimited sparks, custom avatars, and video calling"
            >
              <Crown size={20} />
              Upgrade to Premium
            </button>
          )}
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
              {bothPressed ? '✨ SPARK IGNITED! ✨' : partnerButtonPressed ? `Waiting for you, ${myName}!` : 'Ready to Spark It!?'}
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
                  {bothPressed ? (
                    <Sparkles size={80} />
                  ) : myButtonPressed ? (
                    <Check size={80} />
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <Zap 
                        size={100} 
                        fill="white"
                        stroke="white"
                        strokeWidth={2}
                        style={{
                          filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.6))',
                        }}
                      />
                      <Sparkles 
                        size={24} 
                        style={{ 
                          position: 'absolute', 
                          top: '-10px', 
                          right: '-10px',
                          color: '#FFD700',
                          filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
                        }} 
                      />
                      <Sparkles 
                        size={20} 
                        style={{ 
                          position: 'absolute', 
                          bottom: '10px', 
                          left: '-8px',
                          color: '#FFA500',
                          filter: 'drop-shadow(0 0 8px rgba(255, 165, 0, 0.8))',
                        }} 
                      />
                    </div>
                  )}
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
