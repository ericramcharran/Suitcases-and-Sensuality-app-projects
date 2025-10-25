import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function HowItWorks() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 bg-card" data-testid="section-how-it-works">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl font-light text-foreground mb-4 text-center" 
            data-testid="heading-how-it-works"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h1>
          
          <motion.p
            className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your journey to authentic power exchange relationships in four simple steps
          </motion.p>

          <div className="space-y-8">
            <motion.div 
              className="flex gap-6" 
              data-testid="step-verify"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
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
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
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

          <div className="mt-12 text-center">
            <Button
              data-testid="button-how-it-works-get-started"
              onClick={() => setLocation("/download")}
              size="lg"
              className="rounded-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
