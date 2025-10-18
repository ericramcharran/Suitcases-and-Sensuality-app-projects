import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { personalityQuestions } from "@/data/testQuestions";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PersonalityTest() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const { toast } = useToast();

  const question = personalityQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

  const submitTest = useMutation({
    mutationFn: async (answerIndices: number[]) => {
      // For now, using a hardcoded userId - will be replaced with real auth
      const userId = localStorage.getItem('userId') || 'temp-user';
      const res = await apiRequest('POST', '/api/personality-test', {
        userId,
        answers: answerIndices
      });
      return await res.json();
    },
    onSuccess: (data) => {
      // Store result data for the result page
      localStorage.setItem('personalityResult', JSON.stringify(data));
      setLocation("/personality-test-processing");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit personality test. Please try again."
      });
    }
  });

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit test to backend
      submitTest.mutate(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-light text-foreground">Personality Assessment</h2>
            <span className="text-sm text-muted-foreground" data-testid="text-progress">
              {currentQuestion + 1} of {personalityQuestions.length}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
              data-testid="progress-bar"
            ></div>
          </div>
        </div>
        <Card className="p-6 mb-6">
          <h3 className="text-2xl font-light mb-6 text-foreground leading-relaxed" data-testid="text-question">
            {question.question}
          </h3>
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <Button
                key={i}
                data-testid={`button-answer-${i}`}
                onClick={() => handleAnswer(i)}
                variant="outline"
                disabled={submitTest.isPending}
                className="w-full text-left p-4 rounded-xl h-auto whitespace-normal justify-start hover-elevate active-elevate-2"
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>
        {currentQuestion > 0 && (
          <button
            data-testid="button-previous"
            onClick={handlePrevious}
            className="text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
        )}
      </div>
    </div>
  );
}
