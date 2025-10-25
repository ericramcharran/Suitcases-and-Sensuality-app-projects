import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Phone, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";

export default function PhoneVerification() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [twilioNotConfigured, setTwilioNotConfigured] = useState(false);

  const sendCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/verification/send-phone", { phone });
      if (!res.ok) {
        const error = await res.json();
        if (res.status === 503) {
          setTwilioNotConfigured(true);
          throw new Error(error.message || "Service not available");
        }
        throw new Error(error.error || "Failed to send code");
      }
      return await res.json();
    },
    onSuccess: () => {
      setCodeSent(true);
      setResendTimer(60);
      toast({
        title: "Code sent",
        description: "Check your phone for the verification code",
      });
    },
    onError: (error: any) => {
      if (twilioNotConfigured) {
        toast({
          title: "Phone verification not yet available",
          description: "We're still setting up SMS verification. Please skip for now.",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to send verification code",
          variant: "destructive",
        });
      }
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/verification/verify-phone", { phone, code });
      return await res.json();
    },
    onSuccess: async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await apiRequest("PATCH", `/api/users/${userId}`, {
          phone,
          phoneVerified: true,
        });
      }

      toast({
        title: "Phone verified!",
        description: "Your phone has been successfully verified.",
      });

      // Continue to next onboarding step (profile details)
      setLocation("/profile-details");
    },
    onError: () => {
      toast({
        title: "Invalid code",
        description: "The code you entered is invalid or expired.",
        variant: "destructive",
      });
    },
  });

  const handleSkip = () => {
    toast({
      title: "Skipped",
      description: "You can verify your phone number later in settings",
    });
    setLocation("/profile-details");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Phone className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-light mb-2 text-foreground">Verify Your Phone</h2>
          <p className="text-muted-foreground">
            {!codeSent
              ? "Add an extra layer of security to your account"
              : "Enter the code we sent to your phone"}
          </p>
        </div>

        {twilioNotConfigured ? (
          <div className="bg-muted/50 border border-border rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium mb-1">
                  Phone verification coming soon
                </p>
                <p className="text-xs text-muted-foreground">
                  We're still setting up SMS verification. You can skip this step for now and verify your phone later in settings.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!codeSent ? (
              <>
                <Input
                  data-testid="input-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl"
                  disabled={sendCodeMutation.isPending}
                />
                <Button
                  data-testid="button-send-code"
                  onClick={() => sendCodeMutation.mutate()}
                  disabled={!phone || sendCodeMutation.isPending}
                  className="w-full rounded-full"
                  size="lg"
                >
                  {sendCodeMutation.isPending ? "Sending..." : "Send Verification Code"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Code sent to: <span className="font-medium text-foreground">{phone}</span>
                </div>
                <Input
                  data-testid="input-code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="rounded-xl text-center text-2xl tracking-wider"
                  maxLength={6}
                  disabled={verifyCodeMutation.isPending}
                />
                <Button
                  data-testid="button-verify"
                  onClick={() => verifyCodeMutation.mutate()}
                  disabled={code.length !== 6 || verifyCodeMutation.isPending}
                  className="w-full rounded-full"
                  size="lg"
                >
                  {verifyCodeMutation.isPending ? "Verifying..." : "Verify Phone"}
                  <CheckCircle className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  data-testid="button-resend"
                  variant="ghost"
                  onClick={() => sendCodeMutation.mutate()}
                  disabled={resendTimer > 0 || sendCodeMutation.isPending}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                </Button>
              </>
            )}
          </div>
        )}

        <Button
          data-testid="button-skip"
          variant="ghost"
          onClick={handleSkip}
          className="w-full mt-6"
        >
          Skip for now
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Phone verification helps prevent unauthorized access to your account.
        </p>
      </div>
    </div>
  );
}
