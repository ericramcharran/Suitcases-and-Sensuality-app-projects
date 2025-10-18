import { ChevronLeft, Heart, MessageCircle, Users, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useCallback } from "react";

export default function HelpMatching() {
  const [, setLocation] = useLocation();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/help-support");
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
        <h2 className="text-2xl sm:text-3xl font-light mb-2 text-foreground">Matching & Messages</h2>
        <p className="text-muted-foreground mb-6">Learn how to connect with compatible members</p>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              How Our Matching Algorithm Works
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                The Executive Society uses a sophisticated matching algorithm that considers multiple factors to find your most compatible connections.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Personality Compatibility:</strong> Your personality assessment results are analyzed across 5 key dimensions to find complementary matches.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Relationship Style:</strong> We match based on your relationship preferences, power exchange dynamics, and communication style.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Role Compatibility:</strong> Dominant, Submissive, and Switch roles are matched according to preference and compatibility.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Important Traits:</strong> The traits you selected as most important are prioritized in your matches.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Location:</strong> Geographic proximity is factored in for practical compatibility.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Match Percentage:</strong> Each profile shows a percentage (0-100%) indicating overall compatibility.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Mutual Matching System
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Both users must express interest before a match is created and messaging becomes available.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Like a Profile:</strong> When you like someone, they'll see your profile in their Discover feed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Mutual Match Created:</strong> When both people like each other, you'll receive a notification and can begin messaging.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Privacy Protected:</strong> If you like someone who doesn't like you back, they'll never know unless they also like you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Pass Option:</strong> Passing on a profile removes them from your feed. This action is private and reversible.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Review Before Liking:</strong> Take time to read full profiles, view all photos, and check compatibility before making decisions.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Messaging Best Practices
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                After a mutual match, messages are the key to building meaningful connections.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Start with Substance:</strong> Reference something specific from their profile to show genuine interest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Be Respectful:</strong> Maintain courtesy and respect in all communications, regardless of your dynamic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Ask Questions:</strong> Show interest by asking thoughtful questions about their interests and preferences.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Response Time:</strong> Be patient. People have different schedules and communication styles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>No Copy-Paste:</strong> Generic messages are obvious. Personalize each conversation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Establish Boundaries:</strong> Discuss expectations, boundaries, and preferences early in conversation.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Understanding Important Traits
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Important traits help us understand what matters most to you in a potential partner.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Selection Process:</strong> During onboarding, you select traits that are non-negotiable or highly important to you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Algorithm Priority:</strong> The matching algorithm gives higher priority to profiles that align with your important traits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Examples:</strong> Experience level, communication style, lifestyle choices, relationship goals, specific dynamic preferences.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Be Selective:</strong> Choose 3-5 truly important traits rather than selecting everything.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Update Anytime:</strong> You can modify your important traits in your profile settings as your preferences evolve.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Viewing Your Matches
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Access and manage all your matches and conversations from the Messages page.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Messages Tab:</strong> Tap the Messages icon in the bottom navigation to see all your mutual matches.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Active Conversations:</strong> Matches with ongoing conversations appear at the top.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>New Matches:</strong> Fresh matches without messages yet are clearly indicated.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Profile Access:</strong> Tap any match to view their full profile and review compatibility before messaging.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Unmatch Option:</strong> If a connection isn't working out, you can unmatch to remove them from your list.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-medium mb-3 text-foreground">Pro Tips for Better Matches</h3>
            <div className="space-y-2 text-foreground/80 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Complete your profile thoroughly - incomplete profiles receive fewer quality matches</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Upload multiple high-quality photos showing different aspects of your life</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Be honest in your assessments - authentic answers lead to better compatibility</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Review full profiles before liking - compatibility percentage is just one factor</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Start conversations with substance and genuine interest</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
