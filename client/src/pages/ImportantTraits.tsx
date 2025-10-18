import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, Check } from "lucide-react";

const TRAIT_OPTIONS = [
  "Trust & Honesty",
  "Open Communication",
  "Emotional Intelligence",
  "Respect for Boundaries",
  "Mutual Growth",
  "Physical Attraction",
  "Physical Appearance",
  "Sex Appeal",
  "Sexual Compatibility",
  "Intellectual Connection",
  "Sense of Humor",
  "Financial Stability",
  "Shared Values",
  "Adventurous Spirit",
  "Consistency",
  "Aftercare",
  "Consent Focus",
  "Patience",
  "Ambition",
  "Creativity",
  "Loyalty",
  "Independence",
  "Vulnerability",
  "Playfulness",
  "Reliability",
  "Passion",
  "Empathy",
  "Authenticity"
];

export default function ImportantTraits() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  
  const userId = sessionStorage.getItem('userId');

  // Redirect if no userId
  useEffect(() => {
    if (!userId) {
      setLocation('/signup');
    }
  }, [userId, setLocation]);

  // Fetch existing traits
  const { data: userData } = useQuery({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return await res.json();
    },
    enabled: Boolean(userId)
  });

  // Initialize selected traits from user data
  useEffect(() => {
    if (userData?.importantTraits) {
      setSelectedTraits(userData.importantTraits);
    }
  }, [userData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (traits: string[]) => {
      const res = await apiRequest('PATCH', `/api/users/${userId}`, {
        importantTraits: traits
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: "Saved!",
        description: "Your important traits have been updated"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save traits. Please try again."
      });
    }
  });

  const toggleTrait = (trait: string) => {
    setSelectedTraits(prev => {
      if (prev.includes(trait)) {
        return prev.filter(t => t !== trait);
      } else {
        return [...prev, trait];
      }
    });
  };

  const handleSave = () => {
    if (selectedTraits.length === 0) {
      toast({
        variant: "destructive",
        title: "No traits selected",
        description: "Please select at least one important trait"
      });
      return;
    }
    saveMutation.mutate(selectedTraits);
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <h2 className="text-2xl font-light text-foreground text-center">
            Things Important to Me
          </h2>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Select the traits that matter most in a relationship
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto pb-24">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  Select Your Values
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select as many as you wish
                </p>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedTraits.length} selected
              </span>
            </div>

            {/* Trait Pills - Random Layout */}
            <div className="flex flex-wrap gap-2 justify-center">
              {TRAIT_OPTIONS.map((trait) => {
                const isSelected = selectedTraits.includes(trait);
                return (
                  <button
                    key={trait}
                    data-testid={`button-trait-${trait.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => toggleTrait(trait)}
                    className={`
                      relative px-4 py-2 rounded-full border-2 transition-all
                      flex items-center gap-2
                      hover-elevate active-elevate-2
                      ${isSelected 
                        ? 'border-primary bg-primary/10 text-foreground' 
                        : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium whitespace-nowrap">
                      {trait}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">
                💡 <span className="font-medium text-foreground">Tip:</span> Select the values and qualities that are non-negotiable in your ideal relationship. This helps us find better matches for you.
              </p>
            </div>
          </Card>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 max-w-2xl mx-auto w-full">
          <div className="flex gap-3">
            <Button
              data-testid="button-back"
              onClick={() => setLocation("/profile")}
              variant="outline"
              className="flex-1 rounded-full"
              size="lg"
            >
              Back to Profile
            </Button>
            <Button
              data-testid="button-save"
              onClick={handleSave}
              disabled={saveMutation.isPending || selectedTraits.length === 0}
              className="flex-1 rounded-full bg-red-500 hover:bg-black text-white transition-colors"
              size="lg"
            >
              <Heart className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Save Traits'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
