import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function SwitchesPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 overflow-hidden pt-24">
        <div className="w-full max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-light text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Switches
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experience the flexibility of power exchange from both perspectives. Our platform recognizes and celebrates your versatility.
          </motion.p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-card" data-testid="section-switches-pricing">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4 text-center" data-testid="heading-switches-pricing">
            Switch Subscription
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            As a Switch, you'll have access to the Dominant tier features and pricing, allowing you to explore both sides of power exchange dynamics.
          </p>

          <div className="flex justify-center">
            <Card className="hover-elevate border-primary max-w-md w-full" data-testid="card-pricing-switch">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium mb-3">
                    SWITCH PLAN
                  </div>
                  <h3 className="text-2xl font-medium mb-2">Switch Flexibility Plan</h3>
                  <p className="text-muted-foreground text-sm mb-4">Full flexibility for Switches</p>
                  
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
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Switch role clearly displayed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Compatibility matching for versatility</span>
                  </li>
                </ul>
                <Button
                  data-testid="button-pricing-switch"
                  onClick={() => setLocation("/download")}
                  className="w-full rounded-full"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-12 text-center">
            Why Choose The Executive Society as a Switch?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-3">Recognized Versatility</h3>
                <p className="text-muted-foreground">
                  Your Switch identity is prominently displayed on your profile, ensuring potential matches understand and appreciate your flexibility in power dynamics.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-3">Smart Compatibility</h3>
                <p className="text-muted-foreground">
                  Our algorithm accounts for your versatility when calculating compatibility, helping you find partners who appreciate and complement your dynamic nature.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-3">Full Feature Access</h3>
                <p className="text-muted-foreground">
                  Enjoy all the premium features of the Dominant tier, including priority placement, enhanced visibility, and optional verification options.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-3">Community Recognition</h3>
                <p className="text-muted-foreground">
                  Connect with others who understand the nuances of switching, and build relationships based on mutual understanding and flexibility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-6">
            Ready to Embrace Your Versatility?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join The Executive Society today and connect with others who appreciate the full spectrum of power exchange.
          </p>
          
          <Button
            data-testid="button-switches-cta"
            onClick={() => setLocation("/download")}
            size="lg"
            className="rounded-full"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
