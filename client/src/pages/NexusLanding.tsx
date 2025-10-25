import AppIcon from "../components/AppIcon";
import { Dna, Target, Lock, Zap, MessageCircle, CheckCircle } from "lucide-react";
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
          <p>Find Your Perfect Match Through Advanced Compatibility</p>
          <button className="cta-button" data-testid="button-get-started">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Spark It?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Dna size={32} color="#e74c3c" />
              <h3>DNA-Level Matching</h3>
            </div>
            <p>
              Our advanced algorithm analyzes personality types, relationship styles, 
              and compatibility factors to find your perfect match.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Target size={32} color="#e74c3c" />
              <h3>93% Success Rate</h3>
            </div>
            <p>
              Users who match at 90%+ compatibility have a 93% success rate 
              in forming lasting relationships.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Lock size={32} color="#e74c3c" />
              <h3>Privacy First</h3>
            </div>
            <p>
              Your data is encrypted and secure. We never share your information 
              without explicit permission.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Zap size={32} color="#e74c3c" />
              <h3>Real-Time Matching</h3>
            </div>
            <p>
              Get instant compatibility scores and match suggestions as soon as 
              you complete your profile.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <MessageCircle size={32} color="#e74c3c" />
              <h3>Smart Conversations</h3>
            </div>
            <p>
              AI-powered conversation starters based on your shared interests 
              and compatibility factors.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <CheckCircle size={32} color="#e74c3c" />
              <h3>Verified Profiles</h3>
            </div>
            <p>
              All users are verified to ensure authentic connections and 
              a safe dating environment.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section with Phone Mockup */}
      <section className="demo">
        <div className="demo-content">
          <div className="demo-text">
            <h2>See Your Matches</h2>
            <p>
              Browse through highly compatible matches with detailed compatibility 
              breakdowns. Know exactly why you match before you even say hello.
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
                <div className="match-card" data-testid="match-card-1">
                  <h4>Alex • 32 • INTJ</h4>
                  <p>93% Compatibility</p>
                  <div className="compatibility-bar">
                    <div className="compatibility-fill" style={{ width: '93%' }}></div>
                  </div>
                </div>
                
                <div className="match-card" data-testid="match-card-2">
                  <h4>Jordan • 28 • ENFP</h4>
                  <p>88% Compatibility</p>
                  <div className="compatibility-bar">
                    <div className="compatibility-fill" style={{ width: '88%' }}></div>
                  </div>
                </div>
                
                <div className="match-card" data-testid="match-card-3">
                  <h4>Sam • 30 • INFJ</h4>
                  <p>91% Compatibility</p>
                  <div className="compatibility-bar">
                    <div className="compatibility-fill" style={{ width: '91%' }}></div>
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
          <h1 style={{ fontSize: '3em' }}>Ready to Find Your Match?</h1>
          <p>Join thousands of users who found meaningful connections</p>
          <button 
            className="cta-button" 
            style={{ fontSize: '1.5em', padding: '25px 50px' }}
            data-testid="button-start-journey"
          >
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  );
}
