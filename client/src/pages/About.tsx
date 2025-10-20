import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-card" data-testid="section-about">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-light text-foreground mb-8 text-center" data-testid="heading-about">
            Welcome to The Executive Society
          </h1>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p data-testid="text-about-intro">
              We've created a premium space for professionals exploring BDSM and power exchange dynamics. Unlike typical dating apps, we prioritize trust, safety, and compatibility through comprehensive verification and sophisticated matching algorithms.
            </p>
            
            <p data-testid="text-about-details">
              Every member is verified, background-checked, and committed to ethical, consensual relationships. Our platform combines advanced personality assessments with role-specific features to help you find truly compatible partners.
            </p>

            <p>
              The Executive Society was founded on the principle that power exchange relationships deserve the same level of sophistication, safety, and respect as any other meaningful connection. We believe that discerning professionals should have access to a platform that understands their unique needs and values.
            </p>

            <p>
              Our commitment goes beyond simple matchmaking. We've built a comprehensive ecosystem that supports every stage of your journey - from initial verification and education to finding compatible partners and building lasting relationships.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Button
              data-testid="button-about-get-started"
              onClick={() => setLocation("/download")}
              size="lg"
              className="rounded-full"
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
