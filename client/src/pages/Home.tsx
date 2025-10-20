import { Button } from "@/components/ui/button";
import { Shield, Lock, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import mainLogo from "@assets/logo transparent_1760961066655.png";
import { VideoBackground } from "@/components/VideoBackground";
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Video Background - Feeld Style with Crossfade */}
      <VideoBackground />

      {/* Header with Hamburger Menu */}
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 pt-24">
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
              onClick={() => setLocation("/features")}
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

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}
