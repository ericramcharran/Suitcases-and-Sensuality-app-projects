import { useState, useEffect } from "react";
import { Sparkles, Clock, DollarSign, MapPin, Heart, Share2, Zap, Flame, ThumbsUp, ThumbsDown, Trophy, Users, Video, Wand2, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getRandomActivity, type Activity } from "../data/activities";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { useToast } from "@/hooks/use-toast";
import type { SparkitCouple } from "@shared/schema";
import "../nexus-styles.css";

export default function SparkActivity() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [rating, setRating] = useState<'loved' | 'meh' | null>(null);
  const [showWinnerPicker, setShowWinnerPicker] = useState(false);
  const [winnerRecorded, setWinnerRecorded] = useState(false);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [isAiActivity, setIsAiActivity] = useState(false);

  // Get couple ID from localStorage
  useEffect(() => {
    const storedCoupleId = localStorage.getItem("sparkitCoupleId");
    setCoupleId(storedCoupleId);
  }, []);

  // Check authentication via session
  const { data: authData } = useQuery<{ coupleId: string; partnerRole: string } | null>({
    queryKey: ["/api/sparkit/auth/me"],
    retry: false,
  });

  // Fetch couple data
  const { data: couple, isLoading: coupleLoading, isError: coupleError } = useQuery<SparkitCouple>({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
  });

  // Get a random activity when component mounts or couple data changes
  useEffect(() => {
    if (couple) {
      const newActivity = getRandomActivity(couple.relationshipType);
      setActivity(newActivity);
    }
  }, [couple]);

  // Mutation to save rating
  const saveRatingMutation = useMutation({
    mutationFn: async (ratingValue: 'loved' | 'meh') => {
      if (!coupleId || !activity) throw new Error("Missing data");
      const res = await apiRequest("POST", "/api/sparkit/activity-ratings", {
        coupleId,
        activityId: activity.id,
        activityTitle: activity.title,
        rating: ratingValue
      });
      return await res.json();
    },
  });

  // Mutation to save winner
  const saveWinnerMutation = useMutation({
    mutationFn: async (winner: 'partner1' | 'partner2' | 'tie') => {
      if (!coupleId || !activity) throw new Error("Missing data");
      const res = await apiRequest("POST", "/api/sparkit/activity-results", {
        coupleId,
        activityId: activity.id,
        activityTitle: activity.title,
        winner
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sparkit/couples", coupleId, "scoreboard"] });
      setWinnerRecorded(true);
      setShowWinnerPicker(false);
    },
  });

  // Mutation to get AI-generated activities
  const getAiActivitiesMutation = useMutation({
    mutationFn: async () => {
      // Use couple.id directly if available, fallback to coupleId from localStorage
      const id = couple?.id || coupleId;
      if (!id) {
        console.error('[AI Activity] No couple ID available', { couple, coupleId });
        throw new Error("Missing couple ID");
      }
      console.log('[AI Activity] Requesting activities for couple:', id);
      const res = await apiRequest("GET", `/api/sparkit/couples/${id}/ai-activities`, {});
      if (!res.ok) {
        const error = await res.json();
        console.error('[AI Activity] Error response:', error);
        throw new Error(error.error || "Failed to generate AI activities");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.activities && data.activities.length > 0) {
        // Pick a random activity from the AI suggestions
        const randomIndex = Math.floor(Math.random() * data.activities.length);
        const aiActivity = data.activities[randomIndex];
        
        // Create an Activity object from AI response
        const newActivity: Activity = {
          id: Date.now(),
          title: aiActivity.title,
          description: aiActivity.description,
          category: aiActivity.category || 'AI Suggested',
          duration: aiActivity.estimated_duration || '30-60 min',
          energyLevel: aiActivity.energy_level || 'medium',
          location: aiActivity.location_type || 'varies',
          cost: aiActivity.cost_range || '$',
          spiceLevel: 'G-Rated',
          tips: aiActivity.tips || []
        };
        
        setActivity(newActivity);
        setIsAiActivity(true);
        setRating(null);
        setShowWinnerPicker(false);
        setWinnerRecorded(false);
      }
    },
  });

  // Mutation to send activity via SMS
  const sendSmsMutation = useMutation({
    mutationFn: async () => {
      if (!coupleId || !activity || !authData?.partnerRole) {
        throw new Error("Missing required data");
      }
      const res = await apiRequest("POST", `/api/sparkit/couples/${coupleId}/send-sms`, {
        activityTitle: activity.title,
        activityDescription: activity.description,
        partnerRole: authData.partnerRole
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || error.error || "Failed to send SMS");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "SMS Sent!",
        description: data.message || "Activity sent to your partner via text message.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "SMS Failed",
        description: error.message || "Could not send SMS. Make sure phone numbers are set in Settings.",
      });
    },
  });

  const handleSave = () => {
    setIsSaved(true);
  };

  const handleShare = () => {
    if (activity && typeof navigator.share !== 'undefined') {
      navigator.share({
        title: `Spark It! - ${activity.title}`,
        text: `We just sparked this activity: ${activity.title}!`,
      }).catch(() => {
        // Share cancelled
      });
    }
  };

  const handleNewSpark = () => {
    setLocation("/spark");
  };

  const handleRating = (newRating: 'loved' | 'meh') => {
    if (!activity || !coupleId) return;
    setRating(newRating);
    saveRatingMutation.mutate(newRating);
  };

  const handleWinnerSelect = (winner: 'partner1' | 'partner2' | 'tie') => {
    if (!activity || !coupleId) return;
    saveWinnerMutation.mutate(winner);
  };

  const viewScoreboard = () => {
    setLocation("/scoreboard");
  };

  const handleVideoSpark = () => {
    if (!activity) return;
    sessionStorage.setItem('currentVideoActivity', JSON.stringify(activity));
    setLocation('/sparkit/video');
  };

  const isLDRActivity = activity && ['Video Call', 'Async', 'Text Games', 'Romantic LDR', 'Creative LDR', 'Planning LDR'].includes(activity.category);

  if (!activity) {
    return null; // Loading state
  }

  if (coupleError) {
    return (
      <div className="nexus-app" data-testid="spark-activity-page">
        <section style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2em', color: '#e74c3c', marginBottom: '20px' }}>
            Error loading couple data. Please try again.
          </p>
          <button
            onClick={() => setLocation("/spark")}
            className="cta-button"
            style={{
              background: 'var(--nexus-gradient-passion)',
              border: 'none',
              padding: '18px 40px',
              fontSize: '1.2em'
            }}
            data-testid="button-back-to-spark"
          >
            Back to Spark
          </button>
        </section>
      </div>
    );
  }

  const partner1Name = couple?.partner1Name || "Partner 1";
  const partner2Name = couple?.partner2Name || "Partner 2";

  return (
    <div className="nexus-app" data-testid="spark-activity-page">
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '1.5em', 
          background: 'var(--nexus-gradient-full)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center'
        }}>
          Your Spark Activity
        </h2>
      </div>

      {/* Activity Card */}
      <section style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Reveal Animation */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(231, 76, 60, 0.15) 100%)',
            borderRadius: '30px',
            padding: '50px 40px',
            border: '2px solid var(--nexus-red-bright)',
            boxShadow: '0 25px 60px rgba(231, 76, 60, 0.4)',
            animation: 'sparkReveal 0.8s ease-out',
          }}
          data-testid="activity-card"
        >
          {/* Activity Icon */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto',
              borderRadius: '50%',
              background: 'var(--nexus-gradient-passion)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 15px 40px rgba(231, 76, 60, 0.5)',
            }}>
              <Sparkles size={50} color="white" />
            </div>
          </div>

          {/* Activity Title */}
          <h1 style={{ 
            fontSize: '1.8em', 
            marginBottom: '20px', 
            textAlign: 'center',
            background: 'var(--nexus-gradient-full)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.3'
          }}>
            {activity.title}
          </h1>

          {/* Category & Spice Level Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '20px',
              background: 'rgba(231, 76, 60, 0.2)',
              border: '1px solid rgba(231, 76, 60, 0.4)',
              color: '#e74c3c',
              fontWeight: 'bold',
              fontSize: '0.9em',
              textTransform: 'uppercase'
            }}>
              {activity.category}
            </div>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '20px',
              background: activity.spiceLevel === 'PG-13' 
                ? 'rgba(255, 107, 107, 0.3)' 
                : 'rgba(102, 126, 234, 0.2)',
              border: activity.spiceLevel === 'PG-13'
                ? '1px solid rgba(255, 107, 107, 0.5)'
                : '1px solid rgba(102, 126, 234, 0.4)',
              color: activity.spiceLevel === 'PG-13' ? '#ff6b6b' : '#667eea',
              fontWeight: 'bold',
              fontSize: '0.9em',
              textTransform: 'uppercase'
            }}>
              {activity.spiceLevel === 'PG-13' && <Flame size={16} />}
              {activity.spiceLevel}
            </div>
          </div>

          {/* Activity Meta */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px', 
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
              <Clock size={20} color="#e74c3c" />
              <span>{activity.duration}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
              <DollarSign size={20} color="#e74c3c" />
              <span>{activity.cost}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
              <MapPin size={20} color="#e74c3c" />
              <span>{activity.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
              <Zap size={20} color="#e74c3c" />
              <span>{activity.energyLevel} Energy</span>
            </div>
          </div>

          {/* Description (optional) */}
          {activity.description && (
            <p style={{ 
              fontSize: '1em', 
              lineHeight: '1.6', 
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              {activity.description}
            </p>
          )}

          {/* Tips */}
          {activity.tips && activity.tips.length > 0 && (
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '20px', 
              padding: '30px',
              marginBottom: '30px'
            }}>
              <h3 style={{ 
                fontSize: '1.2em', 
                marginBottom: '15px', 
                color: '#e74c3c' 
              }}>
                Tips to Make It Great
              </h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {activity.tips.map((tip, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '10px',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.95em',
                    lineHeight: '1.5'
                  }}>
                    <span style={{ 
                      color: '#e74c3c', 
                      fontSize: '1.3em',
                      lineHeight: '1',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>•</span>
                    <span style={{ flex: 1 }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rating Section */}
          <div style={{
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1em', 
              marginBottom: '15px', 
              color: 'rgba(255,255,255,0.9)' 
            }}>
              How was this activity?
            </h3>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleRating('loved')}
                className="cta-button"
                disabled={saveRatingMutation.isPending}
                style={{
                  background: rating === 'loved' ? 'var(--nexus-gradient-royal)' : 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(102, 126, 234, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '16px 24px',
                  opacity: rating && rating !== 'loved' ? 0.5 : 1,
                  minWidth: '120px',
                  borderRadius: '20px',
                  fontSize: '0.95em'
                }}
                data-testid="button-rate-loved"
              >
                <ThumbsUp size={24} fill={rating === 'loved' ? 'white' : 'none'} />
                <span>Loved It!</span>
              </button>
              <button
                onClick={() => handleRating('meh')}
                className="cta-button"
                disabled={saveRatingMutation.isPending}
                style={{
                  background: rating === 'meh' ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,107,107,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '16px 24px',
                  opacity: rating && rating !== 'meh' ? 0.5 : 1,
                  minWidth: '120px',
                  borderRadius: '20px',
                  fontSize: '0.95em'
                }}
                data-testid="button-rate-meh"
              >
                <ThumbsDown size={24} fill={rating === 'meh' ? 'white' : 'none'} />
                <span>Not My Vibe</span>
              </button>
            </div>
          </div>

          {/* Winner Selection */}
          {!showWinnerPicker && !winnerRecorded && (
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <button
                onClick={() => setShowWinnerPicker(true)}
                className="cta-button"
                style={{
                  background: 'var(--nexus-gradient-passion)',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px 30px',
                  fontSize: '1.1em'
                }}
                data-testid="button-who-won"
              >
                <Trophy size={20} />
                Who Won?
              </button>
            </div>
          )}

          {showWinnerPicker && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '30px',
              border: '2px solid rgba(231, 76, 60, 0.3)'
            }}>
              <h3 style={{ 
                fontSize: '1.5em', 
                marginBottom: '20px', 
                color: '#e74c3c',
                textAlign: 'center'
              }}>
                Who Won This Round?
              </h3>
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => handleWinnerSelect('partner1')}
                  className="cta-button"
                  disabled={saveWinnerMutation.isPending}
                  style={{
                    background: 'var(--nexus-gradient-royal)',
                    border: 'none',
                    padding: '15px 30px',
                    fontSize: '1.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  data-testid="button-partner1-won"
                >
                  <AvatarDisplay 
                    avatarUrl={couple?.partner1AvatarUrl} 
                    size="sm" 
                    data-testid="avatar-partner1-winner"
                  />
                  {partner1Name}
                </button>
                <button
                  onClick={() => handleWinnerSelect('partner2')}
                  className="cta-button"
                  disabled={saveWinnerMutation.isPending}
                  style={{
                    background: 'var(--nexus-gradient-passion)',
                    border: 'none',
                    padding: '15px 30px',
                    fontSize: '1.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  data-testid="button-partner2-won"
                >
                  <AvatarDisplay 
                    avatarUrl={couple?.partner2AvatarUrl} 
                    size="sm" 
                    data-testid="avatar-partner2-winner"
                  />
                  {partner2Name}
                </button>
                <button
                  onClick={() => handleWinnerSelect('tie')}
                  className="cta-button"
                  disabled={saveWinnerMutation.isPending}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    padding: '15px 30px',
                    fontSize: '1.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  data-testid="button-tie"
                >
                  <Trophy size={20} />
                  It's a Tie!
                </button>
              </div>
            </div>
          )}

          {winnerRecorded && (
            <div style={{
              background: 'rgba(102, 126, 234, 0.15)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '30px',
              textAlign: 'center',
              border: '2px solid rgba(102, 126, 234, 0.3)'
            }}>
              <p style={{ 
                fontSize: '1.2em', 
                color: '#667eea',
                marginBottom: '10px'
              }}>
                Score Recorded!
              </p>
              <button
                onClick={viewScoreboard}
                className="cta-button"
                style={{
                  background: 'var(--nexus-gradient-royal)',
                  border: 'none',
                  padding: '12px 25px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                data-testid="button-view-scoreboard"
              >
                <Users size={18} />
                View Scoreboard
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleSave}
              className="cta-button"
              style={{
                background: isSaved ? 'var(--nexus-gradient-royal)' : 'rgba(255,255,255,0.1)',
                border: isSaved ? 'none' : '2px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 35px'
              }}
              data-testid="button-save-activity"
            >
              <Heart size={20} fill={isSaved ? 'white' : 'none'} />
              {isSaved ? 'Saved!' : 'Save for Later'}
            </button>

            <button
              onClick={handleShare}
              className="cta-button"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 35px'
              }}
              data-testid="button-share-activity"
            >
              <Share2 size={20} />
              Share
            </button>

            <button
              onClick={() => sendSmsMutation.mutate()}
              disabled={sendSmsMutation.isPending}
              className="cta-button"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 35px',
                opacity: sendSmsMutation.isPending ? 0.6 : 1
              }}
              data-testid="button-send-sms"
            >
              {sendSmsMutation.isPending ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare size={20} />
                  Send to Partner
                </>
              )}
            </button>

            {isLDRActivity && (
              <button
                onClick={handleVideoSpark}
                className="cta-button"
                style={{
                  background: 'var(--nexus-gradient-royal)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '18px 35px'
                }}
                data-testid="button-video-spark"
              >
                <Video size={20} />
                Start Video Spark
              </button>
            )}
          </div>
        </div>

        {/* Just Do It CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '50px',
          padding: '40px',
          background: 'var(--nexus-gradient-passion)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(231, 76, 60, 0.4)',
        }}>
          <h2 style={{ fontSize: '2.5em', marginBottom: '20px' }}>
            Ready? Just Do It!
          </h2>
          <p style={{ fontSize: '1.2em', marginBottom: '30px', color: 'rgba(255,255,255,0.9)' }}>
            No overthinking. No scrolling. Make memories together.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            <button
              onClick={handleNewSpark}
              className="cta-button"
              style={{
                background: 'white',
                color: '#e74c3c',
                fontSize: '1.3em',
                padding: '20px 50px',
              }}
              data-testid="button-new-spark"
            >
              <Sparkles size={24} style={{ marginRight: '10px', display: 'inline' }} />
              Get Another Spark
            </button>
            
            {couple?.city && couple?.state && import.meta.env.VITE_ENABLE_AI_ACTIVITIES === 'true' && (
              <button
                onClick={() => getAiActivitiesMutation.mutate()}
                disabled={getAiActivitiesMutation.isPending}
                className="cta-button"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.5)',
                  color: 'white',
                  fontSize: '1.3em',
                  padding: '20px 50px',
                  opacity: getAiActivitiesMutation.isPending ? 0.6 : 1
                }}
                data-testid="button-ai-activity"
              >
                {getAiActivitiesMutation.isPending ? (
                  <>
                    <div style={{ display: 'inline-block', marginRight: '10px' }}>
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={24} style={{ marginRight: '10px', display: 'inline' }} />
                    AI Local Activity
                  </>
                )}
              </button>
            )}
          </div>
          
          {isAiActivity && (
            <p style={{ 
              fontSize: '1em', 
              color: 'rgba(255,255,255,0.8)',
              fontStyle: 'italic'
            }}>
              This activity was AI-generated based on your location: {couple?.city}, {couple?.state}
            </p>
          )}
        </div>
      </section>

      <style>{`
        @keyframes sparkReveal {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
