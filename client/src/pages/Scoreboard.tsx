import { useState, useEffect } from "react";
import { Trophy, TrendingUp, Award, BarChart3, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import "../nexus-styles.css";

export default function Scoreboard() {
  const [, setLocation] = useLocation();
  const [coupleId, setCoupleId] = useState<string | null>(null);

  // Get couple ID from localStorage
  useEffect(() => {
    const storedCoupleId = localStorage.getItem("sparkitCoupleId");
    setCoupleId(storedCoupleId);
  }, []);

  // Fetch couple data
  const { data: couple, isError: coupleError } = useQuery({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
  });

  // Fetch scoreboard data
  const { data: scoreboardData, isLoading, isError: scoreboardError } = useQuery({
    queryKey: ["/api/sparkit/couples", coupleId, "scoreboard"],
    queryFn: async () => {
      if (!coupleId) return null;
      const res = await fetch(`/api/sparkit/couples/${coupleId}/scoreboard`);
      if (!res.ok) throw new Error("Failed to fetch scoreboard");
      return await res.json();
    },
    enabled: !!coupleId,
  });

  if (!coupleId || !couple) {
    return (
      <div className="nexus-app" data-testid="scoreboard-page">
        <section style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '1em', color: 'rgba(255,255,255,0.7)' }}>
            Please sign up or join a couple to view the scoreboard
          </p>
          <button
            onClick={() => setLocation("/sparkit/signup")}
            className="cta-button"
            style={{
              background: 'var(--nexus-gradient-passion)',
              border: 'none',
              padding: '18px 40px',
              fontSize: '1.2em',
              marginTop: '20px'
            }}
            data-testid="button-signup"
          >
            Get Started
          </button>
        </section>
      </div>
    );
  }

  if (coupleError || scoreboardError) {
    return (
      <div className="nexus-app" data-testid="scoreboard-page">
        <section style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '1em', color: '#e74c3c', marginBottom: '20px' }}>
            Error loading scoreboard data. Please try again.
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

  if (isLoading || !scoreboardData) {
    return (
      <div className="nexus-app" data-testid="scoreboard-page">
        <section style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '1em', color: 'rgba(255,255,255,0.7)' }}>
            Loading scoreboard...
          </p>
        </section>
      </div>
    );
  }

  const stats = scoreboardData.stats || {
    partner1Wins: 0,
    partner2Wins: 0,
    ties: 0,
    total: 0,
    partner1Percentage: 0,
    partner2Percentage: 0
  };

  const recentResults = scoreboardData.recentResults || [];
  const partner1Name = couple.partner1Name || "Partner 1";
  const partner2Name = couple.partner2Name || "Partner 2";

  const getLeadMessage = () => {
    if (stats.partner1Wins === stats.partner2Wins) {
      return "It's tied! Perfectly balanced.";
    }
    const leader = stats.partner1Wins > stats.partner2Wins ? partner1Name : partner2Name;
    const diff = Math.abs(stats.partner1Wins - stats.partner2Wins);
    return `${leader} leads by ${diff} ${diff === 1 ? 'win' : 'wins'}`;
  };

  // Calculate streak from recent results
  const calculateStreak = () => {
    if (recentResults.length === 0) {
      return { winner: 'none', count: 0 };
    }

    let count = 0;
    const latestWinner = recentResults[0].winner;
    
    if (latestWinner === 'tie') {
      return { winner: 'none', count: 0 };
    }

    for (const result of recentResults) {
      if (result.winner === latestWinner) {
        count++;
      } else {
        break;
      }
    }

    return { winner: latestWinner, count };
  };

  const streak = calculateStreak();

  const getStreakMessage = () => {
    if (streak.count === 0) {
      return "No active streak";
    }
    const partner = streak.winner === 'partner1' ? partner1Name : partner2Name;
    return `${partner} on a ${streak.count} win streak!`;
  };

  return (
    <div className="nexus-app" data-testid="scoreboard-page">
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <button
          onClick={() => setLocation("/spark")}
          className="cta-button"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            padding: '10px 15px',
            display: 'flex',
            alignItems: 'center'
          }}
          data-testid="button-back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ 
          fontSize: '1.3em', 
          background: 'var(--nexus-gradient-full)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.3'
        }}>
          Couple Scoreboard
        </h2>
      </div>

      {/* Main Content */}
      <section style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Overall Stats */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(231, 76, 60, 0.15) 100%)',
          borderRadius: '30px',
          padding: '40px',
          marginBottom: '30px',
          border: '2px solid var(--nexus-red-bright)',
          boxShadow: '0 20px 50px rgba(231, 76, 60, 0.3)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Trophy size={60} color="#e74c3c" style={{ margin: '0 auto 15px' }} />
            <h1 style={{ 
              fontSize: '1.5em', 
              marginBottom: '10px',
              background: 'var(--nexus-gradient-full)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.3'
            }}>
              {getLeadMessage()}
            </h1>
            <p style={{ fontSize: '1em', color: 'rgba(255,255,255,0.7)' }}>
              {stats.total} {stats.total === 1 ? 'activity' : 'activities'} completed together
            </p>
          </div>

          {/* Score Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Partner 1 */}
            <div style={{
              background: 'rgba(102, 126, 234, 0.2)',
              border: '2px solid rgba(102, 126, 234, 0.4)',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '15px' }}>
                <AvatarDisplay 
                  avatarUrl={couple.partner1AvatarUrl} 
                  size="md" 
                  data-testid="avatar-partner1-scoreboard"
                />
                <h3 style={{ 
                  fontSize: '1.3em', 
                  color: '#667eea',
                  margin: 0
                }}>
                  {partner1Name}
                </h3>
              </div>
              <div style={{ 
                fontSize: '2.5em', 
                fontWeight: 'bold', 
                color: '#667eea',
                marginBottom: '10px'
              }}>
                {stats.partner1Wins}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95em' }}>
                {stats.partner1Percentage}% win rate
              </p>
            </div>

            {/* Ties */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                fontSize: '1.3em', 
                marginBottom: '15px', 
                color: 'rgba(255,255,255,0.9)' 
              }}>
                Ties
              </h3>
              <div style={{ 
                fontSize: '2.5em', 
                fontWeight: 'bold', 
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '10px'
              }}>
                {stats.ties}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95em' }}>
                Both winners
              </p>
            </div>

            {/* Partner 2 */}
            <div style={{
              background: 'rgba(231, 76, 60, 0.2)',
              border: '2px solid rgba(231, 76, 60, 0.4)',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '15px' }}>
                <AvatarDisplay 
                  avatarUrl={couple.partner2AvatarUrl} 
                  size="md" 
                  data-testid="avatar-partner2-scoreboard"
                />
                <h3 style={{ 
                  fontSize: '1.3em', 
                  color: '#e74c3c',
                  margin: 0
                }}>
                  {partner2Name}
                </h3>
              </div>
              <div style={{ 
                fontSize: '2.5em', 
                fontWeight: 'bold', 
                color: '#e74c3c',
                marginBottom: '10px'
              }}>
                {stats.partner2Wins}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95em' }}>
                {stats.partner2Percentage}% win rate
              </p>
            </div>
          </div>

          {/* Streak Indicator */}
          {streak.count > 0 && (
            <div style={{
              background: streak.winner === 'partner1' 
                ? 'rgba(102, 126, 234, 0.2)' 
                : 'rgba(231, 76, 60, 0.2)',
              border: `2px solid ${streak.winner === 'partner1' ? 'rgba(102, 126, 234, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <TrendingUp size={24} color={streak.winner === 'partner1' ? '#667eea' : '#e74c3c'} />
                <span style={{ 
                  fontSize: '1.1em', 
                  fontWeight: 'bold',
                  color: streak.winner === 'partner1' ? '#667eea' : '#e74c3c'
                }}>
                  {getStreakMessage()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {recentResults.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h3 style={{ 
              fontSize: '1.2em', 
              marginBottom: '20px', 
              color: '#e74c3c',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <BarChart3 size={24} />
              Recent Results
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recentResults.map((result: any, index: number) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 20px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}
                  data-testid={`result-${index}`}
                >
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <p style={{ 
                      fontSize: '1.1em', 
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '5px'
                    }}>
                      Activity #{result.activityId}
                    </p>
                    <p style={{ 
                      fontSize: '0.9em', 
                      color: 'rgba(255,255,255,0.5)' 
                    }}>
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: result.winner === 'partner1' 
                      ? 'rgba(102, 126, 234, 0.2)' 
                      : result.winner === 'partner2'
                      ? 'rgba(231, 76, 60, 0.2)'
                      : 'rgba(255,255,255,0.1)',
                    border: result.winner === 'partner1'
                      ? '1px solid rgba(102, 126, 234, 0.4)'
                      : result.winner === 'partner2'
                      ? '1px solid rgba(231, 76, 60, 0.4)'
                      : '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Award size={16} color={
                      result.winner === 'partner1' ? '#667eea' :
                      result.winner === 'partner2' ? '#e74c3c' : 'rgba(255,255,255,0.7)'
                    } />
                    <span style={{
                      fontWeight: 'bold',
                      color: result.winner === 'partner1' ? '#667eea' :
                            result.winner === 'partner2' ? '#e74c3c' : 'rgba(255,255,255,0.9)'
                    }}>
                      {result.winner === 'partner1' ? `${partner1Name} Won` : 
                       result.winner === 'partner2' ? `${partner2Name} Won` : 'Tie'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats.total === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <Trophy size={80} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ 
              fontSize: '1.8em', 
              marginBottom: '15px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              No Activities Yet
            </h2>
            <p style={{ 
              fontSize: '1.2em', 
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '30px'
            }}>
              Complete activities and track who's winning!
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
              data-testid="button-start-sparking"
            >
              Start Sparking
            </button>
          </div>
        )}

        {/* Call to Action */}
        {stats.total > 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: '40px'
          }}>
            <button
              onClick={() => setLocation("/spark")}
              className="cta-button"
              style={{
                background: 'var(--nexus-gradient-passion)',
                border: 'none',
                padding: '18px 40px',
                fontSize: '1.2em'
              }}
              data-testid="button-get-spark"
            >
              Get Another Spark
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
