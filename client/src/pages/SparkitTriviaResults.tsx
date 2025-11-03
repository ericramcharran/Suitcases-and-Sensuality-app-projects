import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, ArrowLeft, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { triviaQuestions } from "../data/triviaQuestions";

interface Contest {
  id: string;
  coupleId: string;
  categoryId: string;
  categoryName: string;
  questionIds: number[];
  senderName: string;
  senderPartnerRole: string;
  receiverName: string;
  receiverPartnerRole: string | null;
  senderScore: number | null;
  receiverScore: number | null;
  status: string;
  score: number;
  createdAt: string;
}

interface Answer {
  id: string;
  contestId: string;
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

interface ResultsData {
  contest: Contest;
  answers: Answer[];
  score: number;
  totalQuestions: number;
}

export default function SparkitTriviaResults() {
  const [, params] = useRoute("/sparkit/trivia/results/:contestId");
  const [, setLocation] = useLocation();

  const contestId = params?.contestId;

  // Poll for results every 2 seconds if contest not completed yet
  const { data, isLoading, error } = useQuery<ResultsData>({
    queryKey: [`/api/sparkit/trivia/contests/${contestId}/results`],
    enabled: !!contestId,
    refetchInterval: (query) => {
      // If we get a "not yet completed" error, poll every 2 seconds
      if (query.state.error) {
        return 2000;
      }
      // If successful, stop polling
      return false;
    },
    retry: true
  });

  const handleShare = () => {
    const scorePercent = data ? Math.round((data.score / data.totalQuestions) * 100) : 0;
    const message = `I just scored ${data?.score}/${data?.totalQuestions} (${scorePercent}%) on the ${data?.contest.categoryName} trivia challenge! Can you beat my score?`;
    
    if (navigator.share) {
      navigator.share({
        title: "Trivia Challenge Results",
        text: message
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(message);
    }
  };

  if (isLoading) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Check if error is "not yet completed" (waiting for partner)
  const isWaitingForPartner = error && (error as any).message?.includes("not yet completed");

  if (!data) {
    if (isWaitingForPartner) {
      return (
        <div className="nexus-app min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <CardTitle className="mb-2">Waiting for Partner</CardTitle>
              <CardDescription className="mb-4">
                Waiting for your partner to complete the challenge...
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                Results will appear automatically when they're done
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Results Not Found</CardTitle>
            <CardDescription>
              This challenge hasn't been completed yet or doesn't exist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation("/spark")}
              className="w-full"
              data-testid="button-home"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { contest, score, totalQuestions } = data;
  const scorePercent = Math.round((score / totalQuestions) * 100);
  
  let performance = "Keep practicing!";
  let performanceColor = "text-red-500";
  
  if (scorePercent >= 80) {
    performance = "Excellent!";
    performanceColor = "text-green-500";
  } else if (scorePercent >= 60) {
    performance = "Good job!";
    performanceColor = "text-blue-500";
  } else if (scorePercent >= 40) {
    performance = "Not bad!";
    performanceColor = "text-yellow-500";
  }

  return (
    <div className="nexus-app min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation("/spark")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-red-500 mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Challenge Complete!</h1>
          <p className="text-muted-foreground">
            {contest.receiverName} answered {contest.senderName}'s challenge
          </p>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-purple-500/10 to-red-500/10 border-purple-500/20">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <div className={`text-6xl font-bold ${performanceColor}`}>
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl font-semibold text-muted-foreground mt-2">
                {scorePercent}% Correct
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.ceil(score) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className={`text-xl font-semibold ${performanceColor}`}>
              {performance}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Challenge Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-semibold">{contest.categoryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Challenged by:</span>
              <span className="font-semibold">{contest.senderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Answered by:</span>
              <span className="font-semibold">{contest.receiverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions:</span>
              <span className="font-semibold">{totalQuestions}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>See which questions you got right</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contest.questionIds.map((qId, index) => {
              const question = triviaQuestions.find(q => q.id === qId);
              const answer = data.answers.find(a => a.questionId === qId);
              
              if (!question || !answer) return null;

              return (
                <div
                  key={qId}
                  className={`p-4 rounded-lg border ${
                    answer.isCorrect
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        answer.isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-2">{question.question}</p>
                      <div className="space-y-1 text-sm">
                        <p className={answer.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                          Your answer: {question.options[answer.selectedAnswer]}
                        </p>
                        {!answer.isCorrect && (
                          <p className="text-green-600 dark:text-green-400">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleShare}
            variant="outline"
            data-testid="button-share-results"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Button
            onClick={() => setLocation("/sparkit/trivia/categories")}
            data-testid="button-new-challenge"
          >
            <Trophy className="w-4 h-4 mr-2" />
            New Challenge
          </Button>
        </div>
      </div>
    </div>
  );
}
