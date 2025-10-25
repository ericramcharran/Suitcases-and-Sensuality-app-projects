import AppIcon from "../components/AppIcon";
import { Zap, Users, Sparkles, DollarSign, Clock, Heart } from "lucide-react";
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
          <p className="hero-tagline">Stop Scrolling. Start Connecting.</p>
          <p className="hero-subtext">
            Both press the button. Get one instant activity. No menus. No choices. Just do it.
          </p>
          <button className="cta-button cta-button-large" data-testid="button-get-started">
            Try Spark It Free
          </button>
          <p className="hero-fine-print">3 free sparks/day • No credit card required</p>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="problem-solution">
        <div className="problem-solution-content">
          <div className="problem-box">
            <h2>The Problem</h2>
            <p>
              You spend hours scrolling on phones next to each other instead of connecting. 
              You want to do something together, but decision fatigue stops you every time.
            </p>
          </div>
          
          <div className="solution-box">
            <h2>The Solution</h2>
            <p>
              <strong>Both people press a button simultaneously.</strong> Get one instant activity. 
              No menus. No choices. <strong>Just do it.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - Simple 3 Steps */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card" data-testid="step-1">
            <div className="step-number">1</div>
            <Users size={48} color="#e74c3c" />
            <h3>Both Press</h3>
            <p>You and your partner press the Spark button at the same time</p>
          </div>
          
          <div className="step-card" data-testid="step-2">
            <div className="step-number">2</div>
            <Zap size={48} color="#e74c3c" />
            <h3>Get Activity</h3>
            <p>One instant activity appears - perfectly matched to your couple type</p>
          </div>
          
          <div className="step-card" data-testid="step-3">
            <div className="step-number">3</div>
            <Sparkles size={48} color="#e74c3c" />
            <h3>Just Do It</h3>
            <p>No overthinking. No scrolling. Go make memories together</p>
          </div>
        </div>
      </section>

      {/* For Every Type of Couple */}
      <section className="couple-types">
        <h2>Built for Real Couples</h2>
        <div className="couple-types-grid">
          <div className="couple-type-card">
            <Heart size={32} color="#e74c3c" />
            <h4>Long Distance</h4>
            <p>Virtual activities that keep you close across the miles</p>
          </div>
          
          <div className="couple-type-card">
            <Heart size={32} color="#e74c3c" />
            <h4>With Kids</h4>
            <p>Quick 15-minute sparks when the kids are finally asleep</p>
          </div>
          
          <div className="couple-type-card">
            <Heart size={32} color="#e74c3c" />
            <h4>Empty Nest</h4>
            <p>Rediscover each other with adventurous new experiences</p>
          </div>
          
          <div className="couple-type-card">
            <Heart size={32} color="#e74c3c" />
            <h4>Polyamorous</h4>
            <p>Activities designed for multiple partners and unique dynamics</p>
          </div>
          
          <div className="couple-type-card">
            <Heart size={32} color="#e74c3c" />
            <h4>Newly Dating</h4>
            <p>Break the ice and discover each other through fun activities</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <h2>Simple Pricing</h2>
        <div className="pricing-grid">
          <div className="pricing-card pricing-free" data-testid="pricing-free">
            <h3>Free</h3>
            <div className="price">$0</div>
            <p className="price-period">forever</p>
            <ul className="pricing-features">
              <li><Clock size={20} /> 3 Sparks per day</li>
              <li><Users size={20} /> Perfect for trying it out</li>
              <li><Heart size={20} /> All couple types supported</li>
            </ul>
            <button className="pricing-button pricing-button-free" data-testid="button-start-free">
              Start Free
            </button>
          </div>
          
          <div className="pricing-card pricing-premium" data-testid="pricing-premium">
            <div className="pricing-badge">MOST POPULAR</div>
            <h3>Premium</h3>
            <div className="price">$6.99</div>
            <p className="price-period">per month</p>
            <ul className="pricing-features">
              <li><Zap size={20} /> Unlimited Sparks</li>
              <li><Sparkles size={20} /> Priority activity matching</li>
              <li><DollarSign size={20} /> Exclusive partner deals</li>
              <li><Heart size={20} /> Save favorite activities</li>
            </ul>
            <button className="pricing-button pricing-button-premium" data-testid="button-upgrade-premium">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </section>

      {/* Partner Integrations Teaser */}
      <section className="partners">
        <h2>More Coming Soon</h2>
        <p className="partners-subtitle">
          Exclusive deals from our partners - book activities, order food, plan getaways
        </p>
        <div className="partners-logos">
          <div className="partner-logo">DoorDash</div>
          <div className="partner-logo">Amazon</div>
          <div className="partner-logo">Airbnb</div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="hero" style={{ minHeight: '70vh' }}>
        <div className="hero-content">
          <h1 style={{ fontSize: '3.5em' }}>Ready to Spark Connection?</h1>
          <p style={{ fontSize: '1.3em', maxWidth: '600px', margin: '0 auto 40px' }}>
            Join thousands of couples who stopped scrolling and started connecting
          </p>
          <button 
            className="cta-button cta-button-large" 
            data-testid="button-start-journey"
          >
            Get Started Free
          </button>
          <p className="hero-fine-print">3 sparks/day free • Upgrade anytime</p>
        </div>
      </section>
    </div>
  );
}
