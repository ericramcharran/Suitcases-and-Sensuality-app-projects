import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users, Lock, CheckCircle, Sparkles, Phone, MessageCircle, Award, Menu } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import mainLogo from "@assets/logo transparent_1760961066655.png";
import heartLogo from "@assets/logo transparent no name_1760959575281.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function MarketingLanding() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Hamburger Menu */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setLocation("/download")}
            data-testid="link-header-logo"
          >
            <motion.img 
              src={heartLogo} 
              alt="Heart Logo" 
              className="w-20 h-20 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            />
            <h1 className="text-2xl font-medium" style={{ marginLeft: '-0.6cm' }}>
              <motion.span 
                className="text-black dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                The Executive{" "}
              </motion.span>
              <motion.span 
                className="text-red-600 font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                Society
              </motion.span>
            </h1>
          </div>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                data-testid="button-menu-toggle"
                variant="ghost" 
                size="icon"
                className="hover-elevate active-elevate-2"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 mt-6">
                <button
                  data-testid="nav-about"
                  className="text-left py-2 px-3 text-sm text-foreground hover-elevate active-elevate-2 rounded-md"
                  onClick={() => scrollToSection("about")}
                >
                  About
                </button>
                <button
                  data-testid="nav-features"
                  className="text-left py-2 px-3 text-sm text-foreground hover-elevate active-elevate-2 rounded-md"
                  onClick={() => scrollToSection("features")}
                >
                  Features
                </button>
                <button
                  data-testid="nav-how-it-works"
                  className="text-left py-2 px-3 text-sm text-foreground hover-elevate active-elevate-2 rounded-md"
                  onClick={() => scrollToSection("how-it-works")}
                >
                  How It Works
                </button>
                <button
                  data-testid="nav-pricing"
                  className="text-left py-2 px-3 text-sm text-foreground hover-elevate active-elevate-2 rounded-md"
                  onClick={() => scrollToSection("pricing")}
                >
                  Pricing
                </button>
                <button
                  data-testid="nav-faq"
                  className="text-left py-2 px-3 text-sm text-foreground hover-elevate active-elevate-2 rounded-md"
                  onClick={() => scrollToSection("faq")}
                >
                  FAQ
                </button>
                <button
                  data-testid="nav-download"
                  className="text-left py-2 px-3 text-sm text-foreground hover-elevate active-elevate-2 rounded-md"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setLocation("/download");
                  }}
                >
                  Download App
                </button>
                <div className="mt-4">
                  <Button
                    data-testid="button-menu-get-started"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setLocation("/download");
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 overflow-hidden pt-24">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Main Logo */}
          <motion.div 
            className="mb-8 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img 
              src={mainLogo}
              alt="The Executive Society"
              className="w-72 h-auto object-contain"
            />
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-light text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Where Power Meets Passion
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            The premier platform for sophisticated individuals seeking authentic power exchange relationships. Verified, safe, and built for discerning professionals.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              data-testid="button-hero-get-started"
              onClick={() => setLocation("/download")}
              size="lg"
              className="w-full sm:w-auto rounded-full"
            >
              Get Started
            </Button>
            <Button
              data-testid="button-hero-learn-more"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full"
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>21+ Only</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>Verified Users</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Safe & Consensual</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-8 sm:py-12 px-4 sm:px-6 bg-card" data-testid="section-about">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-6" data-testid="heading-about">
            Welcome to The Executive Society
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6" data-testid="text-about-intro">
            We've created a premium space for professionals exploring BDSM and power exchange dynamics. Unlike typical dating apps, we prioritize trust, safety, and compatibility through comprehensive verification and sophisticated matching algorithms.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed" data-testid="text-about-details">
            Every member is verified, background-checked, and committed to ethical, consensual relationships. Our platform combines advanced personality assessments with role-specific features to help you find truly compatible partners.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-8 sm:py-12 px-4 sm:px-6" data-testid="section-features">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl font-light text-foreground mb-8 text-center" 
            data-testid="heading-features"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Premium Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-feature-verification">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Verified Profiles</h3>
                    <p className="text-muted-foreground">
                      Age verification, background checks, and optional financial verification for Dominants ensure authentic, trustworthy connections.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-feature-matching">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Smart Matching</h3>
                    <p className="text-muted-foreground">
                      Advanced compatibility algorithm based on personality tests, relationship preferences, and important traits.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-feature-roles">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Role-Specific Experience</h3>
                    <p className="text-muted-foreground">
                      Tailored features for Dominants and submissives with appropriate subscription tiers and verification.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-feature-messaging">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Real-Time Messaging</h3>
                    <p className="text-muted-foreground">
                      Instant messaging with read receipts and push notifications. Only connect with verified mutual matches.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-feature-privacy">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Privacy First</h3>
                    <p className="text-muted-foreground">
                      Display names separate from real identities, secure data handling, and complete control over your information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-feature-mobile">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Mobile Optimized</h3>
                    <p className="text-muted-foreground">
                      Progressive Web App technology provides a native app experience on any device. Add to your home screen.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-8 sm:py-12 px-4 sm:px-6 bg-card" data-testid="section-how-it-works">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl font-light text-foreground mb-8 text-center" 
            data-testid="heading-how-it-works"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>

          <div className="space-y-8">
            <motion.div 
              className="flex gap-6" 
              data-testid="step-verify"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Verify & Sign Up</h3>
                <p className="text-muted-foreground">
                  Complete age verification (21+), background check, and agree to our community guidelines. We take safety seriously.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex gap-6" 
              data-testid="step-profile"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Build Your Profile</h3>
                <p className="text-muted-foreground">
                  Take our personality and relationship assessments, select your role, add photos, and share what matters most to you.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex gap-6" 
              data-testid="step-discover"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Discover & Match</h3>
                <p className="text-muted-foreground">
                  Swipe through compatible profiles with detailed compatibility scores. Filter by preferences and see who's verified.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex gap-6" 
              data-testid="step-connect"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-lg">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Connect & Grow</h3>
                <p className="text-muted-foreground">
                  Message your mutual matches, learn from educational resources, and build meaningful power exchange relationships.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-8 sm:py-12 px-4 sm:px-6" data-testid="section-pricing">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4 text-center" data-testid="heading-pricing">
            Subscription Plans
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto" data-testid="text-pricing-intro">
            Choose the plan that fits your role and commitment level. All plans include verification, matching, and messaging.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* submissive */}
            <Card className="hover-elevate" data-testid="card-pricing-submissive">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-medium mb-2">submissive</h3>
                  <p className="text-muted-foreground text-sm mb-4">For submissives</p>
                  {/* Special Offer Badge */}
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-full mb-4 shadow-lg">
                    <span className="text-2xl font-bold">FREE for 3 Months</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-1 mb-2">
                    <p className="text-sm text-muted-foreground mb-1">Special Introductory Offer</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-light">$29</span>
                      <span className="text-muted-foreground text-sm">/month after trial</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Plans: 3, 6, 12 month & 5 year</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Complete verification & background check</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Unlimited matching & messaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Personality & relationship assessments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Advanced filtering & search</span>
                  </li>
                </ul>
                <Button
                  data-testid="button-pricing-submissive"
                  onClick={() => setLocation("/download")}
                  variant="outline"
                  className="w-full rounded-full"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Dominant */}
            <Card className="hover-elevate border-primary" data-testid="card-pricing-dominant">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-medium mb-2">Dominant</h3>
                  <p className="text-muted-foreground text-sm mb-4">For Masters, Dommes & Dominants</p>
                  
                  {/* Special Offer Badge */}
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-full mb-4 shadow-lg">
                    <span className="text-2xl font-bold">FREE for 1 Month</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-1 mb-2">
                    <p className="text-sm text-muted-foreground mb-1">Special Introductory Offer</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-light">$79</span>
                      <span className="text-muted-foreground text-sm">/month after trial</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Plans: 3, 6, 12 month & 5 year</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">All submissive plan features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Priority in discovery feed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Optional escrow verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Enhanced profile visibility</span>
                  </li>
                </ul>
                <Button
                  data-testid="button-pricing-dominant"
                  onClick={() => setLocation("/download")}
                  className="w-full rounded-full"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Switch Flexibility Plan */}
            <Card className="hover-elevate" data-testid="card-pricing-switch">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-medium mb-2">Switch</h3>
                  <p className="text-muted-foreground text-sm mb-4">For Switches</p>
                  
                  {/* Special Offer Badge */}
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-full mb-4 shadow-lg">
                    <span className="text-2xl font-bold">FREE for 1 Month</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-1 mb-2">
                    <p className="text-sm text-muted-foreground mb-1">Special Introductory Offer</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-light">$79</span>
                      <span className="text-muted-foreground text-sm">/month after trial</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Plans: 3, 6, 12 month & 5 year</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">All submissive plan features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Priority in discovery feed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Enhanced profile visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Switch role clearly displayed</span>
                  </li>
                </ul>
                <Button
                  data-testid="button-pricing-switch"
                  onClick={() => setLocation("/download")}
                  variant="outline"
                  className="w-full rounded-full"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Fully Funded */}
            <Card className="hover-elevate" data-testid="card-pricing-fully-funded">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-medium mb-2">Fully Funded</h3>
                  <p className="text-muted-foreground text-sm mb-4">Premium Verification</p>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-4xl font-light">$199</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">All Dominant plan features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Premium "Fully Funded" gold badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Financial verification included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Maximum trust & credibility</span>
                  </li>
                </ul>
                <Button
                  data-testid="button-pricing-fully-funded"
                  onClick={() => setLocation("/download")}
                  variant="outline"
                  className="w-full rounded-full"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-8 sm:py-12 px-4 sm:px-6 bg-card" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-8 text-center" data-testid="heading-faq">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full" data-testid="accordion-faq">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                What makes The Executive Society different from other dating apps?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We're specifically designed for BDSM and power exchange relationships. Every user is verified and background-checked. Our sophisticated matching algorithm considers personality traits, relationship preferences, and role compatibility. We prioritize safety, consent, and authentic connections over casual encounters.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                How does the verification process work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                All members must complete age verification (21+), agree to our terms and community guidelines with digital signatures, and pass a background check. Dominants can optionally complete financial verification through escrow or mutual fund services to receive enhanced badges.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                What is the "Fully Funded" verification badge?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The Fully Funded badge is a premium verification option for Dominants who complete financial verification. This gold gradient badge shows commitment and financial stability, appearing prominently on profiles to build additional trust with potential matches.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Is my privacy protected?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely. You create a profile name separate from your real identity. Your real name is never shown publicly. We use industry-standard encryption, secure data storage, and strict privacy policies. You control what information you share and with whom.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                How does the matching algorithm work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our algorithm analyzes 5-dimensional personality test results, relationship style preferences, role compatibility (Dominant/submissive/Switch), important traits you select, and approximate location. Each potential match receives a compatibility percentage to help you make informed decisions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                Can I use this on my phone?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! The Executive Society is a Progressive Web App (PWA) that works beautifully on all devices. You can add it to your home screen for a native app-like experience. We're optimized for mobile with touch gestures, swipe interactions, and full offline support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left">
                What if I identify as a Switch?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can choose either the submissive or Dominant subscription plan based on your primary preference. Your profile clearly indicates your Switch role, and our matching algorithm accounts for this flexibility when calculating compatibility.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left">
                How do I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can manage or cancel your subscription at any time from your Settings page. Navigate to Subscription Management to view your current plan, billing details, and cancellation options. No long-term commitments required.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Download CTA Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6" data-testid="section-cta">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-6" data-testid="heading-cta">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-cta-intro">
            Join The Executive Society today and discover authentic, compatible power exchange relationships with verified professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              data-testid="button-cta-get-started"
              onClick={() => setLocation("/download")}
              size="lg"
              className="w-full sm:w-auto rounded-full"
            >
              Get Started Now
            </Button>
            <Button
              data-testid="button-cta-sign-in"
              onClick={() => setLocation("/login")}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full"
            >
              Already a Member? Sign In
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Questions? Visit our{" "}
            <button
              onClick={() => {
                document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-primary hover-elevate underline"
              data-testid="link-faq"
            >
              FAQ
            </button>
            {" "}or contact support.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 px-4 sm:px-6" data-testid="section-footer">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 mb-8">
            <div>
              <h3 className="font-medium mb-3">Platform</h3>
              <ul className="space-y-1 text-sm text-muted-foreground leading-relaxed">
                <li>
                  <button
                    onClick={() => setLocation("/landing")}
                    className="hover-elevate py-0.5"
                    data-testid="link-footer-home"
                  >
                    Get Started
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover-elevate py-0.5"
                    data-testid="link-footer-features"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover-elevate py-0.5"
                    data-testid="link-footer-pricing"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/download")}
                    className="hover-elevate py-0.5"
                    data-testid="link-footer-download"
                  >
                    Download App
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Support</h3>
              <ul className="space-y-1 text-sm text-muted-foreground leading-relaxed">
                <li>
                  <button
                    onClick={() => {
                      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover-elevate py-0.5"
                    data-testid="link-footer-faq"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/help-support")}
                    className="hover-elevate py-0.5"
                    data-testid="link-footer-help"
                  >
                    Help Center
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Legal</h3>
              <ul className="space-y-1 text-sm text-muted-foreground leading-relaxed">
                <li>
                  <button
                    onClick={() => setLocation("/privacy-policy")}
                    className="hover-elevate py-0.5"
                    data-testid="link-footer-privacy"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/terms")}
                    className="hover-elevate py-0.5"
                    data-testid="link-footer-terms"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">About</h3>
              <ul className="space-y-1 text-sm text-muted-foreground leading-relaxed">
                <li>
                  <button
                    onClick={() => setLocation("/about")}
                    className="hover-elevate py-0.5"
                    data-testid="link-footer-about"
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © 2025 The Executive Society. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>21+ Only · Safe · Consensual · Private</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
