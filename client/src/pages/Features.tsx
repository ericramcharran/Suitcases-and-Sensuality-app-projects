import { Card, CardContent } from "@/components/ui/card";
import { Shield, Sparkles, Heart, MessageCircle, Lock, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function Features() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6" data-testid="section-features">
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl font-light text-foreground mb-4 text-center" 
            data-testid="heading-features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Premium Features
          </motion.h1>
          
          <motion.p
            className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Designed for discerning professionals seeking authentic power exchange relationships
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
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
              animate={{ opacity: 1, y: 0 }}
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
              animate={{ opacity: 1, y: 0 }}
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
              animate={{ opacity: 1, y: 0 }}
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
              animate={{ opacity: 1, y: 0 }}
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
              animate={{ opacity: 1, y: 0 }}
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

          <div className="mt-12 text-center">
            <Button
              data-testid="button-features-get-started"
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
