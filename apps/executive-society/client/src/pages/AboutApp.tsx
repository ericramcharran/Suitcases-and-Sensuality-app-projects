import { Shield, Heart, Award, Lock, Users, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function AboutApp() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8">
          <Button
            data-testid="button-back"
            onClick={() => setLocation(-1 as any)}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-light text-foreground mb-2">
            About The Executive Society
          </h1>
          <p className="text-lg text-muted-foreground">
            A premium platform for professionals seeking authentic power exchange relationships
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-black/5">
          <h2 className="text-2xl font-light text-foreground mb-4">Our Mission</h2>
          <p className="text-foreground leading-relaxed">
            The Executive Society was created to provide a sophisticated, safe, and trustworthy space for 
            professionals to explore power exchange dynamics in their relationships. We believe that authentic 
            connections are built on mutual respect, clear communication, and deep compatibility.
          </p>
        </Card>

        {/* What Makes Us Different */}
        <div className="mb-6">
          <h2 className="text-2xl font-light text-foreground mb-4">What Makes Us Different</h2>
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Verified Dominant Members</h3>
                  <p className="text-sm text-muted-foreground">
                    All Dominant members are required to maintain an escrow account with a minimum balance 
                    ($1,000 entry, $50,000 for final matches), ensuring serious commitment and financial stability.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Comprehensive Assessments</h3>
                  <p className="text-sm text-muted-foreground">
                    Our proprietary personality and relationship assessments analyze five critical dimensions 
                    including emotional intelligence, ethics, sensuality, stability, and D/s compatibility.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Compatibility Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Our advanced algorithm calculates compatibility scores based on personality, relationship 
                    style, role dynamics, and personal preferences to help you find truly compatible matches.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Privacy & Discretion</h3>
                  <p className="text-sm text-muted-foreground">
                    We understand the need for privacy in the professional world. Your information is protected 
                    with enterprise-grade security, and you control what you share.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Exclusive Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Our members are successful professionals who understand the importance of trust, consent, 
                    and authentic connection in power exchange relationships.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-6">
          <h2 className="text-2xl font-light text-foreground mb-4">Our Core Values</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Consent First</h4>
                  <p className="text-sm text-muted-foreground">
                    All interactions are based on enthusiastic, informed, and ongoing consent from all parties.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Safety & Trust</h4>
                  <p className="text-sm text-muted-foreground">
                    We prioritize the physical and emotional safety of our community through verification, 
                    moderation, and clear guidelines.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Authenticity</h4>
                  <p className="text-sm text-muted-foreground">
                    We encourage genuine self-expression and honest communication about desires, boundaries, 
                    and expectations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Respect</h4>
                  <p className="text-sm text-muted-foreground">
                    Every member deserves to be treated with dignity and respect, regardless of their role 
                    or preferences.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-6">
          <h2 className="text-2xl font-light text-foreground mb-4">How It Works</h2>
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Create Your Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete our onboarding process including legal agreements, role selection, and photo uploads.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Take Assessments</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete our personality and relationship style assessments to help us understand your 
                    compatibility factors.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Choose Your Plan</h4>
                  <p className="text-sm text-muted-foreground">
                    Select from our premium subscription tiers with a 30-day free trial to get started.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Discover Matches</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse curated profiles with compatibility scores and connect with members who align 
                    with your desires.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  5
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Build Connections</h4>
                  <p className="text-sm text-muted-foreground">
                    Message your matches, establish trust, and develop meaningful power exchange relationships.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-black/10 text-center">
          <h3 className="text-xl font-light text-foreground mb-2">
            Ready to Begin Your Journey?
          </h3>
          <p className="text-muted-foreground mb-4">
            Join The Executive Society and discover authentic power exchange relationships
          </p>
          <Button
            data-testid="button-get-started"
            onClick={() => setLocation("/")}
            className="rounded-full bg-primary hover:bg-primary/20 text-white transition-colors px-8"
            size="lg"
          >
            Get Started
          </Button>
        </Card>
      </div>
    </div>
  );
}
