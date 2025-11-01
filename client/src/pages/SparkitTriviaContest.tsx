import { useState, useEffect, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle, XCircle } from "lucide-react";
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
  status: string;
  score: number | null;
  receiverName: string | null;
  createdAt: string;
}

export default function SparkitTriviaContest() {
  const [, params] = useRoute("/sparkit/trivia/contest/:contestId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [receiverName, setReceiverName] = useState("");
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Array<{
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }>>([]);

  const contestId = params?.contestId;

  const { data: contest, isLoading } = useQuery<Contest>({
    queryKey: [`/api/sparkit/trivia/contests/${contestId}`],
    enabled: !!contestId
  });

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
        answers,
        receiverName
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

  const handleStart = () => {
    if (!receiverName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to start the challenge",
        variant: "destructive"
      });
      return;
    }
    setStarted(true);
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

  if (!started) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-red-500 mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Trivia Challenge!</CardTitle>
              <CardDescription>
                {contest.senderName} has challenged you to a trivia contest in{" "}
                <strong>{contest.categoryName}</strong>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiverName">Your Name</Label>
              <Input
                id="receiverName"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Enter your name"
                data-testid="input-receiver-name"
              />
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
              <p className="font-semibold">Challenge Details:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 5 questions about {contest.categoryName}</li>
                <li>• Choose the best answer for each</li>
                <li>• See your score at the end</li>
              </ul>
            </div>

            <Button 
              onClick={handleStart}
              className="w-full"
              data-testid="button-start-challenge"
            >
              Start Challenge
            </Button>
          </CardContent>
        </Card>
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
