import { useState, useEffect } from "react";
import { Sparkles, Clock, DollarSign, MapPin, Heart, Share2, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { getRandomActivity, type Activity } from "../data/activities";
import "../nexus-styles.css";

export default function SparkActivity() {
  const [, setLocation] = useLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    // Get a random activity when component mounts
    setActivity(getRandomActivity());
  }, []);

  const handleSave = () => {
    setIsSaved(true);
    // TODO: Save to Firebase
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert("Share functionality coming soon!");
  };

  const handleNewSpark = () => {
    setLocation("/spark");
  };

  if (!activity) {
    return null; // Loading state
  }

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
            fontSize: '2.5em', 
            marginBottom: '20px', 
            textAlign: 'center',
            background: 'var(--nexus-gradient-full)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {activity.title}
          </h1>

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
              fontSize: '1.2em', 
              lineHeight: '1.8', 
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
                fontSize: '1.5em', 
                marginBottom: '20px', 
                color: '#e74c3c' 
              }}>
                Tips to Make It Great
              </h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {activity.tips.map((tip, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'start', 
                    gap: '10px',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '1.1em'
                  }}>
                    <span style={{ color: '#e74c3c', fontSize: '1.2em' }}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
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
            Get Another Spark
          </button>
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
