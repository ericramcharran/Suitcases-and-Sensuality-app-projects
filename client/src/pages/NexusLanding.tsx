import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppIcon from "../components/AppIcon";
import { Zap, Users, Sparkles, DollarSign, Clock, Heart, PhoneOff } from "lucide-react";
import { useLocation } from "wouter";
import "../nexus-styles.css";

function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, isVisible };
}

export default function NexusLanding() {
  const [, setLocation] = useLocation();
  
  const problemSolution = useScrollAnimation();
  const howItWorks = useScrollAnimation();
  const coupleTypes = useScrollAnimation();
  const pricing = useScrollAnimation();
  const partners = useScrollAnimation();
  const finalCta = useScrollAnimation();

  const handleGetStarted = () => {
    setLocation("/sparkit/signup");
  };
  
  const handleJoin = () => {
    setLocation("/sparkit/join");
  };
  
  const handleLogin = () => {
    setLocation("/sparkit/login");
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="nexus-app" data-testid="nexus-landing">
      {/* Header with Logo */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 5vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 3vw, 15px)' }}>
          <div style={{ width: 'clamp(50px, 12vw, 65px)', height: 'clamp(50px, 12vw, 65px)' }}>
            <AppIcon size={65} showShadow={false} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: 'clamp(1.2em, 4vw, 1.8em)', 
              fontWeight: '800',
              background: 'var(--nexus-gradient-full)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              letterSpacing: '-0.5px',
              whiteSpace: 'nowrap'
            }}>
              Spark It!
            </h1>
            <p style={{
              fontSize: 'clamp(0.7em, 2.5vw, 0.9em)',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              marginTop: '2px'
            }}>
              Stop Scrolling. Start Connecting.
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogin}
          className="login-link"
          data-testid="button-header-login"
          style={{
            background: 'rgba(102, 126, 234, 0.2)',
            border: '2px solid #667eea',
            borderRadius: '25px',
            padding: '8px 20px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.95em',
            fontWeight: '600'
          }}
        >
          Login
        </button>
      </header>

      {/* Hero Section - No animation, always visible */}
      <section className="hero" style={{ paddingTop: '100px' }}>
        <div className="hero-content">
          <p className="hero-subtext" style={{ fontSize: '1.3em', marginBottom: '30px' }}>
            Press the button together. One instant activity appears. Zero menus. Zero scrolling. Just Spark It! and GO!
          </p>
          <button 
            onClick={handleGetStarted}
            className="cta-button cta-button-large" 
            data-testid="button-get-started"
          >
            Try Spark It! Free
          </button>
          <p className="hero-fine-print">3 free sparks/day • No credit card required</p>
          <p className="hero-fine-print" style={{ marginTop: '12px' }}>
            Already have an account? <button 
              onClick={handleLogin}
              className="login-link"
              data-testid="link-login"
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
                opacity: 0.9
              }}
            >
              Login
            </button>
          </p>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <motion.section 
        ref={problemSolution.ref}
        initial="hidden"
        animate={problemSolution.isVisible ? "visible" : "hidden"}
        variants={fadeInVariants}
        className="problem-solution"
      >
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
              <strong>You both press the button together.</strong> One instant activity appears. 
              Zero menus. Zero decisions. <strong>Just Spark It! and go!</strong>
            </p>
          </div>
        </div>
      </motion.section>

      {/* How It Works - Simple 3 Steps */}
      <motion.section 
        ref={howItWorks.ref}
        initial="hidden"
        animate={howItWorks.isVisible ? "visible" : "hidden"}
        variants={fadeInVariants}
        className="how-it-works"
      >
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
            <h3>Just Spark It! and Go</h3>
            <p>No overthinking. No scrolling. Go make memories together</p>
          </div>

          <div className="step-card" data-testid="step-4">
            <div className="step-number">4</div>
            <PhoneOff size={48} color="#e74c3c" />
            <h3>Phones Down</h3>
            <p>Put the screens away and reconnect with your partner in real life</p>
          </div>
        </div>
      </motion.section>

      {/* For Every Type of Couple */}
      <motion.section 
        ref={coupleTypes.ref}
        initial="hidden"
        animate={coupleTypes.isVisible ? "visible" : "hidden"}
        variants={fadeInVariants}
        className="couple-types"
      >
        <h2>Built for Real Couples</h2>
        <div className="couple-types-grid">
          <div className="couple-type-card">
            <Heart size={32} color="#e74c3c" />
            <h4>Doom Scrollers</h4>
            <p>Activities to help you reconnect with your partner</p>
          </div>
          
          <div className="couple-type-card">
            <Heart size={32} color="#e74c3c" />
            <h4>With Kids</h4>
            <p>Quick 15-minute sparks when the kids are finally asleep</p>
          </div>
          
          <div className="couple-type-card">
            <Heart size={32} color="#e74c3c" />
            <h4>Newly Dating</h4>
            <p>Break the ice and discover each other through fun activities</p>
          </div>
          
          <div className="couple-type-card">
            <Heart size={32} color="#e74c3c" />
            <h4>Long Distance</h4>
            <p>Virtual activities that keep you close across the miles</p>
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
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        ref={pricing.ref}
        initial="hidden"
        animate={pricing.isVisible ? "visible" : "hidden"}
        variants={fadeInVariants}
        className="pricing"
      >
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
            <button 
              onClick={handleGetStarted}
              className="pricing-button pricing-button-free" 
              data-testid="button-start-free"
            >
              Start Free
            </button>
          </div>
          
          <div className="pricing-card pricing-premium" data-testid="pricing-premium">
            <div className="pricing-badge">MOST POPULAR</div>
            <h3>Premium Monthly</h3>
            <div className="price">$6.99</div>
            <p className="price-period">per month</p>
            <ul className="pricing-features">
              <li><Zap size={20} /> Unlimited Sparks</li>
              <li><Sparkles size={20} /> Priority activity matching</li>
              <li><DollarSign size={20} /> Exclusive partner deals</li>
              <li><Heart size={20} /> Save favorite activities</li>
            </ul>
            <button 
              onClick={handleGetStarted}
              className="pricing-button pricing-button-premium" 
              data-testid="button-upgrade-premium"
            >
              Upgrade to Premium
            </button>
          </div>

          <div className="pricing-card pricing-premium" data-testid="pricing-yearly">
            <div className="pricing-badge">BEST VALUE</div>
            <h3>Premium Yearly</h3>
            <div className="price">$59.99</div>
            <p className="price-period">per year</p>
            <p className="savings">Save $24 vs monthly</p>
            <ul className="pricing-features">
              <li><Zap size={20} /> Unlimited Sparks</li>
              <li><Sparkles size={20} /> Priority activity matching</li>
              <li><DollarSign size={20} /> Exclusive partner deals</li>
              <li><Heart size={20} /> Save favorite activities</li>
            </ul>
            <button 
              onClick={handleGetStarted}
              className="pricing-button pricing-button-premium" 
              data-testid="button-upgrade-yearly"
            >
              Get Best Deal
            </button>
          </div>
        </div>
      </motion.section>

      {/* Partner Integrations Teaser */}
      <motion.section 
        ref={partners.ref}
        initial="hidden"
        animate={partners.isVisible ? "visible" : "hidden"}
        variants={fadeInVariants}
        className="partners"
      >
        <h2>More Coming Soon</h2>
        <p className="partners-subtitle">
          Exclusive deals from our partners - book activities, order food, plan getaways
        </p>
        <div className="partners-logos">
          <div className="partner-logo">DoorDash</div>
          <div className="partner-logo">Amazon</div>
          <div className="partner-logo">Airbnb</div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        ref={finalCta.ref}
        initial="hidden"
        animate={finalCta.isVisible ? "visible" : "hidden"}
        variants={fadeInVariants}
        className="hero" 
        style={{ minHeight: '70vh' }}
      >
        <div className="hero-content">
          <h1 style={{ fontSize: '3.5em' }}>Ready to Spark It! Connection?</h1>
          <p style={{ fontSize: '1.3em', maxWidth: '600px', margin: '0 auto 40px' }}>
            Join thousands of couples who stopped scrolling and started connecting
          </p>
          <button 
            onClick={handleGetStarted}
            className="cta-button cta-button-large" 
            data-testid="button-start-journey"
          >
            Get Started Free
          </button>
          <p className="hero-fine-print">3 sparks/day free • Upgrade anytime</p>
          <p className="hero-fine-print" style={{ marginTop: '12px' }}>
            Already have an account? <button 
              onClick={handleLogin}
              className="login-link"
              data-testid="link-login-footer"
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
                opacity: 0.9
              }}
            >
              Login
            </button>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
