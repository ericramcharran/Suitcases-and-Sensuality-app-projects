import { useState, useEffect, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle, XCircle, Zap, Trophy, Target } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
interface DbQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  wrongAnswer1: string;
  wrongAnswer2: string;
  wrongAnswer3: string;
  difficulty: string;
}

interface Contest {
  id: string;
  coupleId: string;
  categoryId: string;
  categoryName: string;
  questionIds: string[];
  questions: DbQuestion[];
  senderName: string;
  senderPartnerRole: string;
  receiverPartnerRole: string | null;
  status: string;
  score: number | null;
  senderScore: number | null;
  receiverScore: number | null;
  receiverName: string | null;
  createdAt: string;
}

export default function SparkitTriviaContest() {
  const [, params] = useRoute("/sparkit/trivia/contest/:contestId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Array<{
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }>>([]);

  const contestId = params?.contestId;

  // Check if user is logged in (has session)
  useEffect(() => {
    const checkAuth = async () => {
      const coupleId = localStorage.getItem('sparkitCoupleId');
      if (!coupleId) {
        // Not logged in - redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.pathname);
        setLocation(`/sparkit/login?returnUrl=${returnUrl}`);
      }
    };
    checkAuth();
  }, [setLocation]);

  const { data: contest, isLoading } = useQuery<Contest>({
    queryKey: [`/api/sparkit/trivia/contests/${contestId}`],
    enabled: !!contestId
  });

  // Determine if current user is the sender or receiver
  const myPartnerRole = localStorage.getItem('sparkitPartnerRole');
  const isSender = contest && myPartnerRole === contest.senderPartnerRole;
  // Receiver is anyone who is NOT the sender (initially receiverPartnerRole will be null)
  const isReceiver = contest && myPartnerRole !== contest.senderPartnerRole;
  
  // Auto-start for sender when challenge has been accepted (skip "Accept Challenge" button)
  useEffect(() => {
    if (contest && isSender && contest.status === 'in_progress' && !started) {
      setStarted(true);
    }
  }, [contest, isSender, started]);

  const questions = contest?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  // Convert database format to options array for rendering (memoized to prevent reshuffling on re-renders)
  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return [
      currentQuestion.wrongAnswer1,
      currentQuestion.correctAnswer,
      currentQuestion.wrongAnswer2,
      currentQuestion.wrongAnswer3
    ].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const submitAnswersMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/sparkit/trivia/contests/${contestId}/answers`, {
        answers
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sparkit/trivia/contests/${contestId}`] });
      setLocation(`/sparkit/trivia/results/${contestId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit answers",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleStart = async () => {
    try {
      // Notify backend that challenge has been accepted (no body needed - auth from session)
      await apiRequest("POST", `/api/sparkit/trivia/contests/${contestId}/start`, {});
      
      setStarted(true);
    } catch (error: any) {
      console.error('Failed to start challenge:', error);
      
      // Handle specific error cases
      if (error.message?.includes('already been started')) {
        toast({
          title: "Challenge Already Started",
          description: "Someone else has already accepted this challenge",
          variant: "destructive"
        });
        return;
      }
      
      if (error.message?.includes('cannot accept your own challenge')) {
        toast({
          title: "Invalid Action",
          description: "You cannot accept your own challenge",
          variant: "destructive"
        });
        return;
      }
      
      // For other errors (network, server errors), show error but don't proceed
      toast({
        title: "Connection Error",
        description: "Failed to start challenge. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect
    };
    
    setAnswers([...answers, newAnswer]);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        submitAnswersMutation.mutate();
      }
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Challenge Not Found</CardTitle>
            <CardDescription>
              This trivia challenge doesn't exist or has been deleted
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (contest.status === 'completed') {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Challenge Already Completed</CardTitle>
            <CardDescription>
              This challenge has already been answered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation(`/sparkit/trivia/results/${contestId}`)}
              className="w-full"
              data-testid="button-view-results"
            >
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only show "Accept Challenge" UI if user is the receiver and hasn't started yet
  if (!started && isReceiver) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-500/10 via-transparent to-red-500/10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-red-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-red-500 shadow-lg">
                <Brain className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
              You've Been Challenged!
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
              <span className="text-lg font-semibold">{contest.senderName}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-lg font-semibold text-purple-600">{contest.categoryName}</span>
            </div>
          </div>

          <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-purple-500/20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <CardContent className="pt-6 space-y-6">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500/10 to-red-500/10 p-6 border border-purple-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="relative space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>Challenge Rules</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>5 challenging questions about {contest.categoryName}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Choose wisely - only one answer per question!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Trophy className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Beat {contest.senderName}'s score and claim victory!</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button 
                onClick={handleStart}
                size="lg"
                className="w-full text-lg font-semibold bg-gradient-to-r from-purple-600 to-red-600 shadow-lg"
                data-testid="button-start-challenge"
              >
                <Target className="w-5 h-5 mr-2" />
                Accept Challenge
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Think you can beat {contest.senderName}? Let's find out!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (submitAnswersMutation.isPending) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold">Calculating your score...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="nexus-app min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="text-sm font-semibold">
            {contest.categoryName}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index < currentQuestionIndex
                    ? "bg-purple-500"
                    : index === currentQuestionIndex
                    ? "bg-purple-300"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentOptions.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showResult = selectedAnswer !== null;

              let buttonClass = "w-full justify-start text-left h-auto py-3 px-4";
              let variant: "outline" | "default" = "outline";

              if (showResult) {
                if (isSelected && isCorrect) {
                  buttonClass += " bg-green-500/20 border-green-500 hover:bg-green-500/20";
                } else if (isSelected && !isCorrect) {
                  buttonClass += " bg-red-500/20 border-red-500 hover:bg-red-500/20";
                } else if (!isSelected && isCorrect) {
                  buttonClass += " bg-green-500/10 border-green-500";
                }
              }

              return (
                <Button
                  key={index}
                  variant={variant}
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                  data-testid={`option-${index}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option}</span>
                    {showResult && isSelected && (
                      isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                    {showResult && !isSelected && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
