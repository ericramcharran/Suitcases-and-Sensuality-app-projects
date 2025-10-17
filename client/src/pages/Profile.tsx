import { Heart, MessageCircle, User, BookOpen, Settings, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";

export default function Profile() {
  const [, setLocation] = useLocation();
  
  // Get data from sessionStorage (will be replaced with real user data)
  const userName = sessionStorage.getItem('userName') || "User";
  const userRole = sessionStorage.getItem('userRole') || "Dominant";
  const personalityType = "Caring Guide";
  const relationshipStyle = "Committed Partnership Builder";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col pb-20">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background flex justify-between items-center">
          <h2 className="text-2xl font-light text-foreground">Profile</h2>
          <button
            data-testid="button-settings"
            onClick={() => setLocation("/settings")}
            className="text-foreground/70 hover-elevate active-elevate-2 p-2 rounded-md"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Profile Header */}
          <div className="text-center mb-6">
            <Avatar className="w-24 h-24 mx-auto mb-3">
              <AvatarFallback className="text-3xl">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-light text-foreground" data-testid="text-profile-name">
              {userName}
            </h3>
            <p className="text-primary font-medium" data-testid="text-profile-role">
              {userRole}
            </p>
          </div>

          {/* Verification Status */}
          {userRole === 'Dominant' && (
            <Card className="p-4 mb-4 bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-600 dark:text-green-400">Verified Dom</h4>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Escrow account active and verified
              </p>
            </Card>
          )}

          {/* Assessment Results */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-primary" />
              <h4 className="font-medium text-foreground">Assessment Results</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Personality Type</span>
                <span className="font-medium text-foreground" data-testid="text-profile-personality">
                  {personalityType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relationship Style</span>
                <span className="font-medium text-foreground" data-testid="text-profile-relationship">
                  {relationshipStyle}
                </span>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="p-3 text-center">
              <div className="text-2xl font-light text-foreground mb-1">0</div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-light text-foreground mb-1">0</div>
              <div className="text-xs text-muted-foreground">Likes Sent</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-light text-foreground mb-1">95%</div>
              <div className="text-xs text-muted-foreground">Avg Match</div>
            </Card>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              data-testid="button-edit-profile"
              variant="outline"
              className="w-full rounded-xl"
            >
              Edit Profile
            </Button>
            <Button
              data-testid="button-retake-tests"
              variant="outline"
              className="w-full rounded-xl"
            >
              Retake Assessments
            </Button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-background p-4 flex justify-around border-t border-border fixed bottom-0 left-0 right-0 max-w-md mx-auto">
          <button
            data-testid="nav-discover"
            onClick={() => setLocation("/discover")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-education"
            onClick={() => setLocation("/learn")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-messages"
            onClick={() => setLocation("/messages")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-profile"
            className="text-primary p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <User className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </div>
  );
}
