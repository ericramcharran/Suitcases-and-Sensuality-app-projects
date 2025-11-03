import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Copy, CheckCircle, MessageSquare, ArrowLeft, Trophy, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { NotificationManager } from "@/lib/notifications";

export default function SparkitTriviaShare() {
  const [, params] = useRoute("/sparkit/trivia/share/:contestId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [partnerRole, setPartnerRole] = useState<string | null>(null);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [acceptedByName, setAcceptedByName] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [completionData, setCompletionData] = useState<{
    receiverName: string;
    score: number;
    totalQuestions: number;
  } | null>(null);

  const contestId = params?.contestId;
  const contestUrl = `${window.location.origin}/sparkit/trivia/contest/${contestId}`;

  // Get couple ID and partner role from localStorage
  useEffect(() => {
    const storedCoupleId = localStorage.getItem("sparkitCoupleId");
    const storedPartnerRole = localStorage.getItem("sparkitPartnerRole");
    setCoupleId(storedCoupleId);
    setPartnerRole(storedPartnerRole);
  }, []);

  // Fetch couple data from database
  const { data: couple } = useQuery({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
  });

  // Poll contest status as fallback for WebSocket reconnection scenarios
  const { data: contestStatus } = useQuery({
    queryKey: [`/api/sparkit/trivia/contests/${contestId}`],
    enabled: !!contestId && !challengeCompleted,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Check if contest was accepted or completed (via polling as fallback)
  useEffect(() => {
    if (!contestStatus) return;

    // Check if challenge was accepted (receiverName set but not yet completed)
    if (contestStatus.receiverName && contestStatus.status === 'pending' && !challengeAccepted) {
      console.log('[Trivia Share] Contest accepted via polling');
      setChallengeAccepted(true);
      setAcceptedByName(contestStatus.receiverName);
      setCountdown(3); // Start countdown to redirect
    }

    // Check if challenge was completed
    if (contestStatus.status === 'completed' && !challengeCompleted) {
      console.log('[Trivia Share] Contest completed via polling');
      setChallengeCompleted(true);
      setCompletionData({
        receiverName: contestStatus.receiverName,
        score: contestStatus.score,
        totalQuestions: 5
      });

      toast({
        title: "Challenge Completed!",
        description: `${contestStatus.receiverName} scored ${contestStatus.score}/5!`,
      });
    }
  }, [contestStatus, challengeAccepted, challengeCompleted, toast]);

  // Handle countdown and auto-redirect when challenge is accepted
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      // Redirect to contest page so sender can also answer the questions
      setLocation(`/sparkit/trivia/contest/${contestId}`);
      return;
    }

    // Countdown timer
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, contestId, setLocation]);

  // Initialize WebSocket listener for trivia acceptance and completion
  useEffect(() => {
    if (!coupleId || !partnerRole) return;

    const notifManager = NotificationManager.getInstance();
    const userId = `sparkit-${coupleId}-${partnerRole}`;
    
    // Initialize WebSocket connection
    notifManager.initialize(userId);

    // Handle trivia acceptance notification
    const handleTriviaAccepted = (data: any) => {
      console.log('[Trivia Share] Received trivia-accepted event:', data);
      
      if (data.contestId === contestId) {
        setChallengeAccepted(true);
        setAcceptedByName(data.receiverName);
        setCountdown(3); // Start countdown to redirect

        toast({
          title: "Challenge Accepted!",
          description: `${data.receiverName} is taking your ${data.categoryName} challenge!`,
        });
      }
    };

    // Handle trivia completion notification
    const handleTriviaCompleted = (data: any) => {
      console.log('[Trivia Share] Received trivia-completed event:', data);
      
      // Guard against duplicate events
      if (challengeCompleted) {
        console.log('[Trivia Share] Already completed, ignoring duplicate event');
        return;
      }
      
      if (data.contestId === contestId) {
        setChallengeCompleted(true);
        setCompletionData({
          receiverName: data.receiverName,
          score: data.score,
          totalQuestions: data.totalQuestions
        });

        toast({
          title: "Challenge Completed!",
          description: `${data.receiverName} scored ${data.score}/${data.totalQuestions}!`,
        });
      }
    };

    // Register the handlers
    notifManager.on('trivia-accepted', handleTriviaAccepted);
    notifManager.on('trivia-completed', handleTriviaCompleted);

    // Cleanup on unmount
    return () => {
      notifManager.off('trivia-accepted');
      notifManager.off('trivia-completed');
    };
  }, [coupleId, partnerRole, contestId, challengeCompleted, toast]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contestUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share it with your partner"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const handleShareSMS = () => {
    const message = `I challenge you to a trivia contest! Can you beat me? ${contestUrl}`;
    const smsUrl = `sms:?&body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  const handleShareWhatsApp = () => {
    const message = `I challenge you to a trivia contest! Can you beat me? ${contestUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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
          Back
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-red-500 mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Challenge Created!</h1>
          <p className="text-muted-foreground">
            Share this challenge with {
              couple?.loggedInPartnerRole === 'partner1' 
                ? couple?.partner2Name 
                : couple?.partner1Name
            } or anyone else!
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Challenge Link</CardTitle>
            <CardDescription>
              Send this link to your partner so they can answer the questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={contestUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                data-testid="input-contest-url"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                data-testid="button-copy-link"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShareSMS}
                variant="outline"
                className="w-full"
                data-testid="button-share-sms"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Text Message
              </Button>
              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                className="w-full"
                data-testid="button-share-whatsapp"
              >
                <Share2 className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {challengeCompleted && completionData ? (
          <Card className="mb-6 bg-gradient-to-r from-purple-500 to-red-500 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Challenge Complete!</h3>
                <p className="text-lg mb-4">
                  {completionData.receiverName} scored {completionData.score}/{completionData.totalQuestions}!
                </p>
                <Button
                  onClick={() => setLocation(`/sparkit/trivia/results/${contestId}`)}
                  variant="outline"
                  className="bg-white text-purple-600 hover:bg-white/90"
                  data-testid="button-view-results"
                >
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : challengeAccepted && acceptedByName ? (
          <Card className="mb-6 bg-gradient-to-r from-purple-500 to-red-500 text-white animate-in fade-in zoom-in-95 duration-500">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4 animate-pulse">
                  {countdown !== null && countdown > 0 ? (
                    <span className="text-4xl font-bold">{countdown}</span>
                  ) : (
                    <Zap className="w-10 h-10" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">Challenge Accepted!</h3>
                <p className="text-lg mb-4">
                  {acceptedByName} is ready to compete!
                </p>
                {countdown !== null && countdown > 0 ? (
                  <p className="text-sm opacity-90">
                    Get ready to compete in {countdown}...
                  </p>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="font-medium">Starting your challenge...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-gradient-to-r from-purple-500/10 to-red-500/10 border-purple-500/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Waiting for your partner...</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Your partner will click the link and answer 5 trivia questions</li>
                <li>• Their score will be saved automatically</li>
                <li>• You'll get notified when they complete it</li>
                <li>• Then you can view the results together!</li>
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => setLocation("/spark")}
            variant="outline"
            className="flex-1"
            data-testid="button-home"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => setLocation("/sparkit/trivia/categories")}
            className="flex-1"
            data-testid="button-new-challenge"
          >
            New Challenge
          </Button>
        </div>
      </div>
    </div>
  );
}
