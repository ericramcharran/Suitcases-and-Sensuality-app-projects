import { useState, useEffect } from "react";
import { Zap, Users, Check } from "lucide-react";
import { useLocation } from "wouter";
import "../nexus-styles.css";

const DAILY_SPARKS_KEY = "spark_it_daily_sparks";
const LAST_RESET_KEY = "spark_it_last_reset";

function getStoredSparks(): number {
  const stored = localStorage.getItem(DAILY_SPARKS_KEY);
  const lastReset = localStorage.getItem(LAST_RESET_KEY);
  const today = new Date().toDateString();

  // Reset daily sparks if it's a new day
  if (lastReset !== today) {
    localStorage.setItem(LAST_RESET_KEY, today);
    localStorage.setItem(DAILY_SPARKS_KEY, "3");
    return 3;
  }

  return stored ? parseInt(stored, 10) : 3;
}

function setStoredSparks(count: number) {
  localStorage.setItem(DAILY_SPARKS_KEY, count.toString());
}

export default function SparkButton() {
  const [, setLocation] = useLocation();
  const [user1Pressed, setUser1Pressed] = useState(false);
  const [user2Pressed, setUser2Pressed] = useState(false);
  const [sparksRemaining, setSparksRemaining] = useState(getStoredSparks());

  // Handle navigation when both press
  useEffect(() => {
    if (user1Pressed && user2Pressed) {
      const timer = setTimeout(() => {
        // Decrement spark count and persist
        const newCount = sparksRemaining - 1;
        setSparksRemaining(newCount);
        setStoredSparks(newCount);
        setLocation("/spark-activity");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [user1Pressed, user2Pressed, sparksRemaining, setLocation]);

  const handleUser1Press = () => {
    if (sparksRemaining <= 0) {
      setLocation("/sparkit#pricing");
      return;
    }
    setUser1Pressed(true);
  };

  const handleUser2Press = () => {
    if (sparksRemaining <= 0) {
      setLocation("/sparkit#pricing");
      return;
    }
    setUser2Pressed(true);
  };

  const handleReset = () => {
    setUser1Pressed(false);
    setUser2Pressed(false);
  };

  const bothPressed = user1Pressed && user2Pressed;

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
        <h2 style={{ 
          fontSize: '1.5em', 
          background: 'var(--nexus-gradient-full)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Spark It!
        </h2>
        <div data-testid="sparks-remaining" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          color: sparksRemaining === 0 ? '#e74c3c' : 'rgba(255,255,255,0.8)'
        }}>
          <Zap size={20} color="#e74c3c" />
          <span>
            {sparksRemaining === 0 ? 'No sparks left today' : `${sparksRemaining} sparks left today`}
          </span>
        </div>
      </div>

      {/* Main Spark Area */}
      <section className="hero" style={{ minHeight: '80vh' }}>
        <div className="hero-content">
          <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>Ready to Spark?</h1>
          <p style={{ fontSize: '1.3em', marginBottom: '50px', maxWidth: '700px', lineHeight: '1.6' }}>
            <strong>Demo:</strong> Both partners press their button at the same time. 
            For this demo, press both buttons below to simulate the experience.
          </p>
          
          {sparksRemaining === 0 && (
            <div style={{
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(231, 76, 60, 0.1) 100%)',
              borderRadius: '15px',
              border: '2px solid #e74c3c',
              marginBottom: '40px',
              maxWidth: '600px',
            }}>
              <h3 style={{ color: '#e74c3c', fontSize: '1.8em', marginBottom: '15px' }}>
                Out of Sparks!
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px', fontSize: '1.1em' }}>
                You've used your 3 free sparks today. Upgrade to Premium for unlimited sparks!
              </p>
              <button
                onClick={() => setLocation("/sparkit#pricing")}
                className="cta-button"
                style={{
                  background: 'var(--nexus-gradient-passion)',
                  padding: '15px 35px',
                }}
                data-testid="button-upgrade-now"
              >
                Upgrade to Premium
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
            opacity: sparksRemaining === 0 ? 0.4 : 1,
            pointerEvents: sparksRemaining === 0 ? 'none' : 'auto',
          }}>
            {/* Partner 1 Button */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>
                <Users size={20} style={{ display: 'inline', marginRight: '8px' }} />
                Partner 1
              </p>
              <button 
                onClick={handleUser1Press}
                disabled={user1Pressed || bothPressed || sparksRemaining === 0}
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
                Partner 2
              </p>
              <button 
                onClick={handleUser2Press}
                disabled={user2Pressed || bothPressed || sparksRemaining === 0}
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
          {sparksRemaining > 0 && !user1Pressed && !user2Pressed && (
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1em' }}>
              Press both buttons to generate your activity
            </p>
          )}

          {(user1Pressed || user2Pressed) && !bothPressed && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#e74c3c', fontSize: '1.3em', marginBottom: '20px' }}>
                {user1Pressed && !user2Pressed && "Partner 1 ready! Waiting for Partner 2..."}
                {user2Pressed && !user1Pressed && "Partner 2 ready! Waiting for Partner 1..."}
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
    </div>
  );
}
