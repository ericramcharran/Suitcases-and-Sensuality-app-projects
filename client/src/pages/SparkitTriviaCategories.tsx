import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { triviaCategories, getRandomQuestionsByCategory } from "../data/triviaQuestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Trophy, Film, Atom, Landmark, Globe, Utensils, Music, BookOpen, Lightbulb, Heart, Settings } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Map icon names to components
const iconMap: Record<string, any> = {
  Film,
  Atom,
  Landmark,
  Globe,
  Utensils,
  Trophy,
  Music,
  BookOpen,
  Lightbulb,
  Heart
};

export default function SparkitTriviaCategories() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);

  // Get couple ID from localStorage
  useEffect(() => {
    const storedCoupleId = localStorage.getItem("sparkitCoupleId");
    setCoupleId(storedCoupleId);
  }, []);

  // Fetch couple data from database
  const { data: couple, isLoading } = useQuery({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
  });

  const createContestMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const category = triviaCategories.find(c => c.id === categoryId);
      if (!category) throw new Error("Category not found");
      
      // Fetch random questions from the database API instead of using local file
      const url = `/api/sparkit/trivia/questions/random/${categoryId}?count=5`;
      
      const questionsRes = await fetch(url, {
        credentials: 'include'
      });
      
      if (!questionsRes.ok) {
        const errorText = await questionsRes.text();
        throw new Error(`Failed to fetch trivia questions: ${questionsRes.status}`);
      }
      const questions = await questionsRes.json();
      
      if (!questions || questions.length === 0) {
        throw new Error("No questions available for this category");
      }
      
      const questionIds = questions.map((q: any) => q.id);

      // Use the logged-in partner's name as sender
      const senderName = couple?.loggedInPartnerRole === 'partner1' 
        ? couple?.partner1Name 
        : couple?.partner2Name;

      const res = await apiRequest("POST", "/api/sparkit/trivia/contests", {
        coupleId,
        categoryId: category.id,
        categoryName: category.name,
        questionIds,
        senderName: senderName || "Partner"
      });
      
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sparkit/trivia/contests"] });
      setLocation(`/sparkit/trivia/share/${data.id}`);
    },
    onError: (error: Error) => {
      console.error('[Trivia] Contest creation error:', error);
      toast({
        title: "Failed to create challenge",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    createContestMutation.mutate(categoryId);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If no couple ID, redirect to signup
  if (!coupleId || !couple) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Connected</CardTitle>
            <CardDescription>
              You need to create or join a couple first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation("/sparkit/signup")}
              className="w-full"
              data-testid="button-go-to-signup"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="nexus-app min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/spark")}
              className="border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] backdrop-blur-sm bg-white/5"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation("/sparkit/settings")}
              className="border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] backdrop-blur-sm bg-white/5"
              data-testid="button-settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-red-500 mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Trivia Challenge</h1>
            <p className="text-muted-foreground">
              Choose a category to challenge {
                couple.loggedInPartnerRole === 'partner1' 
                  ? couple.partner2Name 
                  : couple.partner1Name
              }!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {triviaCategories.map((category) => {
            const IconComponent = iconMap[category.icon];
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
                  selectedCategory === category.id ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => handleCategorySelect(category.id)}
                data-testid={`category-${category.id}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-red-500">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-sm">
                        5 questions
                      </CardDescription>
                    </div>
                    {selectedCategory === category.id && createContestMutation.isPending && (
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-purple-500/10 to-red-500/10 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Trophy className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">How it works</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Choose a category to challenge your partner</li>
                  <li>2. Share the challenge link with them</li>
                  <li>3. They answer 5 trivia questions</li>
                  <li>4. See who knows more and celebrate the winner!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
