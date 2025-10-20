import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Award } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function Pricing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <section className="py-16 sm:py-24 px-4 sm:px-6" data-testid="section-pricing">
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl font-light text-foreground mb-4 text-center" 
            data-testid="heading-pricing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Subscription Plans
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto" 
            data-testid="text-pricing-intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose the plan that fits your role and commitment level. All plans include verification, matching, and messaging.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* submissive */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-pricing-submissive">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-medium mb-2">submissive</h3>
                    <p className="text-muted-foreground text-sm mb-4">For submissives</p>
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
                    className="w-full rounded-full"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Dominant */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="hover-elevate border-primary h-full" data-testid="card-pricing-dominant">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-medium mb-2">Dominant</h3>
                    <p className="text-muted-foreground text-sm mb-4">For Masters, Dommes & Dominants</p>
                    
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
            </motion.div>

            {/* Switch */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-pricing-switch">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-medium mb-2">Switch</h3>
                    <p className="text-muted-foreground text-sm mb-4">For Switches</p>
                    
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
                    className="w-full rounded-full"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Fully Funded */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-pricing-fully-funded">
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
                    className="w-full rounded-full"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
