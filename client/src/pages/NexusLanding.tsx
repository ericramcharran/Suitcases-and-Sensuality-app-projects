import AppIcon from "../components/AppIcon";
import { Sparkles, Heart, Calendar, Lightbulb, Gamepad2, Coffee } from "lucide-react";
import "../nexus-styles.css";

export default function NexusLanding() {
  return (
    <div className="nexus-app" data-testid="nexus-landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="icon-container" style={{ marginBottom: '40px' }}>
            <AppIcon size={300} />
          </div>
          <h1>Spark It!</h1>
          <p>Never Run Out of Date Ideas Again</p>
          <button className="cta-button" data-testid="button-get-started">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Beat Boredom Together</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Lightbulb size={32} color="#e74c3c" />
              <h3>Endless Ideas</h3>
            </div>
            <p>
              From adventurous outings to cozy nights in, discover thousands of 
              activities perfectly suited for couples.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Sparkles size={32} color="#e74c3c" />
              <h3>Personalized Suggestions</h3>
            </div>
            <p>
              Get activity recommendations based on your interests, budget, 
              and available time together.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Calendar size={32} color="#e74c3c" />
              <h3>Plan Together</h3>
            </div>
            <p>
              Save favorite activities, schedule date nights, and keep track 
              of your couple adventures.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Gamepad2 size={32} color="#e74c3c" />
              <h3>Fun Challenges</h3>
            </div>
            <p>
              Spice things up with couple challenges, games, and conversation 
              starters to deepen your connection.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Coffee size={32} color="#e74c3c" />
              <h3>Quick Picks</h3>
            </div>
            <p>
              Don't have much time? Get instant 15-minute activity ideas 
              for spontaneous moments together.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Heart size={32} color="#e74c3c" />
              <h3>Build Memories</h3>
            </div>
            <p>
              Track your favorite dates, add photos, and create a timeline 
              of your relationship adventures.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section with Phone Mockup */}
      <section className="demo">
        <div className="demo-content">
          <div className="demo-text">
            <h2>Swipe Through Ideas</h2>
            <p>
              Browse fun activities tailored to your relationship. Both love it? Save it. 
              One of you not feeling it? Swipe to the next idea.
            </p>
            <button className="cta-button" data-testid="button-try-now">
              Try It Now
            </button>
          </div>
          
          <div className="phone-mockup" data-testid="phone-mockup">
            <div className="phone-screen">
              <div className="screen-header">
                <svg width="80" height="80" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="15" fill="white"/>
                  <circle cx="60" cy="60" r="10" fill="rgba(255,255,255,0.8)"/>
                  <circle cx="140" cy="60" r="10" fill="rgba(255,255,255,0.8)"/>
                  <circle cx="60" cy="140" r="10" fill="rgba(255,255,255,0.8)"/>
                  <circle cx="140" cy="140" r="10" fill="rgba(255,255,255,0.8)"/>
                </svg>
                <h2>Spark It!</h2>
              </div>
              
              <div className="screen-content">
                <div className="match-card" data-testid="activity-card-1">
                  <h4>Sunset Picnic at the Park</h4>
                  <p>Outdoor • 2 hours • $20</p>
                  <div className="compatibility-bar">
                    <div className="compatibility-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="match-card" data-testid="activity-card-2">
                  <h4>Cook a New Recipe Together</h4>
                  <p>At Home • 1 hour • $15</p>
                  <div className="compatibility-bar">
                    <div className="compatibility-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="match-card" data-testid="activity-card-3">
                  <h4>Midnight Stargazing</h4>
                  <p>Outdoor • 1.5 hours • Free</p>
                  <div className="compatibility-bar">
                    <div className="compatibility-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero" style={{ minHeight: '60vh' }}>
        <div className="hero-content">
          <h1 style={{ fontSize: '3em' }}>Ready to Spark Connection?</h1>
          <p>Join couples who keep their relationships exciting</p>
          <button 
            className="cta-button" 
            style={{ fontSize: '1.5em', padding: '25px 50px' }}
            data-testid="button-start-journey"
          >
            Start Sparking
          </button>
        </div>
      </section>
    </div>
  );
}
