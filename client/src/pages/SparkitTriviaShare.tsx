import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Copy, CheckCircle, MessageSquare, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function SparkitTriviaShare() {
  const [, params] = useRoute("/sparkit/trivia/share/:contestId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [coupleId, setCoupleId] = useState<string | null>(null);

  const contestId = params?.contestId;
  const contestUrl = `${window.location.origin}/sparkit/trivia/contest/${contestId}`;

  // Get couple ID from localStorage
  useEffect(() => {
    const storedCoupleId = localStorage.getItem("sparkitCoupleId");
    setCoupleId(storedCoupleId);
  }, []);

  // Fetch couple data from database
  const { data: couple } = useQuery({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
  });

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

        <Card className="bg-gradient-to-r from-purple-500/10 to-red-500/10 border-purple-500/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Your partner clicks the link and answers 5 trivia questions</li>
              <li>• Their score is saved automatically</li>
              <li>• You can view the results together afterwards</li>
              <li>• Keep challenging each other to see who wins!</li>
            </ul>
          </CardContent>
        </Card>

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
