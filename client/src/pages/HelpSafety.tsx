import { ChevronLeft, Shield, AlertTriangle, Lock, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useCallback } from "react";

export default function HelpSafety() {
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
        <h2 className="text-2xl sm:text-3xl font-light mb-2 text-foreground">Safety & Verification</h2>
        <p className="text-muted-foreground mb-6">Your safety and security are our top priorities</p>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              ID Verification Process
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Every member must complete ID verification before accessing the platform. This ensures a safe, authentic community.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Age Verification:</strong> You must be 21+ to join. We verify this through government-issued ID.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Photo ID Upload:</strong> Upload a clear photo of your driver's license, passport, or state ID.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Secure Processing:</strong> IDs are encrypted and processed through secure third-party verification systems.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Privacy Protected:</strong> Your ID information is never displayed to other members or stored permanently.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Verification Badge:</strong> Verified members display a badge on their profile, indicating trustworthiness.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Escrow Verification for Dominants
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Dominant, Domme, and Master members complete additional financial verification through trusted escrow services.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Purpose:</strong> Demonstrates financial responsibility, commitment, and seriousness about the platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Trusted Partners:</strong> We partner with Escrow.com and FinFitLife.com - industry-leading verification services.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>What It Shows:</strong> Escrow verification creates an additional layer of trust for potential matches.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Balance Display:</strong> Verified Dominants can choose to display their escrow balance on their profile.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Security:</strong> Financial details are encrypted and never shared beyond verification purposes.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Recognizing and Reporting Suspicious Behavior
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Help us maintain a safe community by reporting suspicious profiles or behavior immediately.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Red Flags:</strong> Requests for money, overly aggressive messages, inconsistent information, or pressure to move off-platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Report Function:</strong> Every profile and message has a report button. Use it if something feels wrong.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Quick Response:</strong> Our safety team reviews all reports within 24 hours and takes appropriate action.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Confidential:</strong> Reports are completely anonymous. The reported user won't know who reported them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Zero Tolerance:</strong> Scammers, harassment, and abusive behavior result in immediate account termination.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Financial Safety Guidelines
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Protect yourself financially by following these essential safety rules.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Never Send Money:</strong> Do not send money, gift cards, or cryptocurrency to anyone you meet on the platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>No Financial Information:</strong> Never share bank account details, credit card numbers, or social security numbers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Investment Scams:</strong> Be wary of anyone offering investment opportunities or financial advice.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Legitimate Relationships:</strong> Real connections develop over time and never involve urgent financial requests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Platform Payments Only:</strong> All legitimate platform-related payments happen through our secure billing system.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Meeting in Person Safety
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                When you're ready to meet someone in person, prioritize your safety with these guidelines.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Public First Meetings:</strong> Always meet in public places (coffee shops, restaurants, parks) for first meetings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Tell Someone:</strong> Let a trusted friend or family member know where you're going and when you'll check in.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Your Own Transportation:</strong> Drive yourself or arrange your own ride so you can leave whenever you want.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Stay Sober:</strong> Keep a clear head during first meetings. Avoid excessive alcohol consumption.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Trust Your Instincts:</strong> If something feels off, it's okay to end the meeting and leave.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Video Chat First:</strong> Consider a video call before meeting in person to verify identity.</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
