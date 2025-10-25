import { Trophy, TrendingUp, Award, BarChart3, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { getScoreboardSummary } from "../lib/scoreTracker";
import "../nexus-styles.css";

export default function Scoreboard() {
  const [, setLocation] = useLocation();
  const summary = getScoreboardSummary();

  const getStreakMessage = () => {
    if (summary.streak.count === 0) {
      return "No active streak";
    }
    const partner = summary.streak.winner === 'partner1' ? 'Partner 1' : 'Partner 2';
    return `${partner} on a ${summary.streak.count} win streak!`;
  };

  const getLeadMessage = () => {
    if (summary.partner1.wins === summary.partner2.wins) {
      return "It's tied! Perfectly balanced.";
    }
    const leader = summary.partner1.wins > summary.partner2.wins ? 'Partner 1' : 'Partner 2';
    const diff = Math.abs(summary.partner1.wins - summary.partner2.wins);
    return `${leader} leads by ${diff} ${diff === 1 ? 'win' : 'wins'}`;
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
          fontSize: '1.5em', 
          background: 'var(--nexus-gradient-full)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
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
              fontSize: '2em', 
              marginBottom: '10px',
              background: 'var(--nexus-gradient-full)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {getLeadMessage()}
            </h1>
            <p style={{ fontSize: '1.2em', color: 'rgba(255,255,255,0.7)' }}>
              {summary.total} {summary.total === 1 ? 'activity' : 'activities'} completed together
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
              <h3 style={{ 
                fontSize: '1.3em', 
                marginBottom: '15px', 
                color: '#667eea' 
              }}>
                Partner 1
              </h3>
              <div style={{ 
                fontSize: '3em', 
                fontWeight: 'bold', 
                color: '#667eea',
                marginBottom: '10px'
              }}>
                {summary.partner1.wins}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1em' }}>
                {summary.partner1.percentage}% win rate
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
                fontSize: '3em', 
                fontWeight: 'bold', 
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '10px'
              }}>
                {summary.ties}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1em' }}>
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
              <h3 style={{ 
                fontSize: '1.3em', 
                marginBottom: '15px', 
                color: '#e74c3c' 
              }}>
                Partner 2
              </h3>
              <div style={{ 
                fontSize: '3em', 
                fontWeight: 'bold', 
                color: '#e74c3c',
                marginBottom: '10px'
              }}>
                {summary.partner2.wins}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1em' }}>
                {summary.partner2.percentage}% win rate
              </p>
            </div>
          </div>

          {/* Streak Indicator */}
          {summary.streak.count > 0 && (
            <div style={{
              background: summary.streak.winner === 'partner1' 
                ? 'rgba(102, 126, 234, 0.2)' 
                : 'rgba(231, 76, 60, 0.2)',
              border: `2px solid ${summary.streak.winner === 'partner1' ? 'rgba(102, 126, 234, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <TrendingUp size={24} color={summary.streak.winner === 'partner1' ? '#667eea' : '#e74c3c'} />
                <span style={{ 
                  fontSize: '1.3em', 
                  fontWeight: 'bold',
                  color: summary.streak.winner === 'partner1' ? '#667eea' : '#e74c3c'
                }}>
                  {getStreakMessage()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {summary.recentResults.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h3 style={{ 
              fontSize: '1.5em', 
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
              {summary.recentResults.map((result, index) => (
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
                      {result.activityTitle}
                    </p>
                    <p style={{ 
                      fontSize: '0.9em', 
                      color: 'rgba(255,255,255,0.5)' 
                    }}>
                      {new Date(result.timestamp).toLocaleDateString()}
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
                      {result.winner === 'partner1' ? 'P1 Won' : 
                       result.winner === 'partner2' ? 'P2 Won' : 'Tie'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {summary.total === 0 && (
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
        {summary.total > 0 && (
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
