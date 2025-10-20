import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-card" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl font-light text-foreground mb-4 text-center" 
            data-testid="heading-faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h1>
          
          <motion.p
            className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything you need to know about The Executive Society
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
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
                  You can choose the Switch pricing structure. Your profile clearly indicates your Switch role, and our matching algorithm accounts for this flexibility when calculating compatibility.
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
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
