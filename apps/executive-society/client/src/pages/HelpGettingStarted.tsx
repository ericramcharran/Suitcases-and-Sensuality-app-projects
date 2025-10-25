import { ChevronLeft, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useCallback } from "react";

export default function HelpGettingStarted() {
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
        <h2 className="text-2xl sm:text-3xl font-light mb-2 text-foreground">Getting Started</h2>
        <p className="text-muted-foreground mb-6">Everything you need to know to begin your journey</p>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Complete Your Profile
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Your profile is your first impression. Take time to complete it thoughtfully and honestly.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Personal Information:</strong> Provide accurate details about your age, location, physical attributes, and lifestyle preferences.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Bio:</strong> Write a genuine bio that reflects your personality, interests, and what you're seeking. Be authentic and specific.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Important Traits:</strong> Select the traits that matter most to you in a partner. This helps our matching algorithm find compatible connections.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Upload Clear, Recent Photos
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Quality photos significantly increase your chances of making meaningful connections.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Main Photo:</strong> Choose a clear, recent headshot where your face is visible. Smile and make eye contact with the camera.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Additional Photos:</strong> Include full-body shots and photos that show your personality, hobbies, or lifestyle.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Photo Quality:</strong> Use high-resolution images with good lighting. Avoid heavy filters, group photos, or outdated pictures.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Variety:</strong> Upload up to 6 photos showing different aspects of your life and personality.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Complete Personality and Relationship Assessments
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Our comprehensive assessments are the foundation of our sophisticated matching algorithm.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Personality Assessment:</strong> 20 questions designed to understand your core personality traits, communication style, and preferences.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Relationship Assessment:</strong> 20 questions focused on your relationship style, compatibility factors, and what you seek in a power exchange dynamic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Be Honest:</strong> Answer truthfully rather than what you think sounds good. Authentic answers lead to better matches.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Take Your Time:</strong> These assessments typically take 15-20 minutes each. Find a quiet moment to complete them thoughtfully.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Review Your Matches in Discover
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                The Discover section is where you'll find potential matches curated specifically for you.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Compatibility Percentage:</strong> Each profile shows a percentage indicating how well you match based on your assessments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Review Profiles:</strong> Take time to read bios, view photos, and review their assessment results before making a decision.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Navigation:</strong> Use the arrow buttons or thumbnail navigation to view all profile photos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Distance:</strong> See approximate distance to understand geographic proximity.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Like Profiles You're Interested In
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                When you like someone and they like you back, it creates a mutual match and opens messaging.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Like:</strong> Tap the heart icon if you're interested in connecting with someone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Pass:</strong> Tap the X icon if you're not interested. They won't be notified and won't appear in your feed again.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Mutual Match:</strong> When both users like each other, you'll be notified and can start messaging.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Be Selective:</strong> Focus on quality connections rather than liking everyone. Thoughtful choices lead to better conversations.</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
