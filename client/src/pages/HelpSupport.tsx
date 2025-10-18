import { ChevronLeft, MessageCircle, Mail, Shield, FileText, HelpCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useCallback } from "react";

const helpTopics = [
  {
    icon: HelpCircle,
    title: "Getting Started",
    description: "Learn how to set up your profile and start matching",
    content: [
      "Complete your profile with accurate information",
      "Upload clear, recent photos",
      "Complete personality and relationship assessments",
      "Review your matches in the Discover section",
      "Like profiles you're interested in"
    ]
  },
  {
    icon: Shield,
    title: "Safety & Verification",
    description: "Understanding our verification process",
    content: [
      "All members undergo ID verification",
      "Dominants complete escrow verification",
      "Report suspicious profiles immediately",
      "Never share financial information",
      "Meet in public places for first meetings"
    ]
  },
  {
    icon: MessageCircle,
    title: "Matching & Messages",
    description: "How to connect with other members",
    content: [
      "Both users must like each other to match",
      "Messages appear after mutual matches",
      "Be respectful in all communications",
      "Review important traits before matching",
      "Check compatibility percentage"
    ]
  },
  {
    icon: FileText,
    title: "Subscription & Billing",
    description: "Manage your membership",
    content: [
      "View your current plan in Settings",
      "Subscriptions auto-renew unless cancelled",
      "Cancel anytime through your account",
      "Refunds processed within 5-7 business days",
      "Contact support for billing questions"
    ]
  }
];

const faqs = [
  {
    question: "How does matching work?",
    answer: "Our sophisticated algorithm considers your personality assessment, relationship preferences, role compatibility, and important traits to suggest compatible matches. When both users like each other, it creates a mutual match."
  },
  {
    question: "Is my information secure?",
    answer: "Yes. We use industry-standard encryption for all data. Your personal information is never shared with third parties. All communications are private and secure."
  },
  {
    question: "What is escrow verification?",
    answer: "For Dominant/Domme/Master members, escrow verification demonstrates financial responsibility and commitment. This adds an additional layer of trust and seriousness to the platform."
  },
  {
    question: "Can I change my role after signing up?",
    answer: "Your primary role is set during signup. If you selected 'Switch', you can indicate preferences in both directions. Contact support for questions about role changes."
  }
];

export default function HelpSupport() {
  const [, setLocation] = useLocation();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/settings");
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-6">
      <button
        data-testid="button-back"
        onClick={handleBack}
        className="mb-4 sm:mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-2 rounded-md min-h-[44px]"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-light mb-2 text-foreground">Help & Support</h2>
        <p className="text-muted-foreground mb-6">Find answers and get assistance</p>

        {/* Help Topics */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-foreground">Help Topics</h3>
          <div className="space-y-3">
            {helpTopics.map((topic, i) => (
              <Card key={i} className="p-4" data-testid={`help-topic-${i}`}>
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <topic.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{topic.title}</h4>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </div>
                </div>
                <ul className="ml-13 space-y-2">
                  {topic.content.map((item, idx) => (
                    <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-foreground">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-4" data-testid={`faq-${i}`}>
                <h4 className="font-medium text-foreground mb-2">{faq.question}</h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-foreground mb-1">Need More Help?</h3>
              <p className="text-sm text-muted-foreground">Our support team is here to assist you</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <a 
              href="mailto:support@executivesociety.com"
              className="flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 bg-background"
              data-testid="link-email-support"
            >
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Email Support</p>
                <p className="text-sm text-muted-foreground">support@executivesociety.com</p>
              </div>
            </a>
            
            <button
              onClick={() => setLocation("/messages")}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 bg-background"
              data-testid="button-live-chat"
            >
              <MessageCircle className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">Live Chat</p>
                <p className="text-sm text-muted-foreground">Chat with our support team</p>
              </div>
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-primary/10">
            <p className="text-xs text-muted-foreground text-center">
              Response time: Usually within 24 hours
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
