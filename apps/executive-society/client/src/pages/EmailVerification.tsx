import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";

export default function EmailVerification() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Get email from localStorage (should be set during signup)
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const sendCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/verification/send-email", { email });
      return await res.json();
    },
    onSuccess: () => {
      setCodeSent(true);
      setResendTimer(60); // 60 second cooldown
      toast({
        title: "Code sent",
        description: "Check your email for the verification code",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/verification/verify-email", { email, code });
      return await res.json();
    },
    onSuccess: async () => {
      // Update user record to mark email as verified
      const userId = localStorage.getItem('userId');
      if (userId) {
        await apiRequest("PATCH", `/api/users/${userId}`, {
          emailVerified: true,
        });
      }

      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      });

      // Continue to phone verification
      setLocation("/phone-verification");
    },
    onError: () => {
      toast({
        title: "Invalid code",
        description: "The code you entered is invalid or expired. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendCode = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    sendCodeMutation.mutate();
  };

  const handleVerify = () => {
    if (!code || code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      });
      return;
    }
    verifyCodeMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Mail className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-light mb-2 text-foreground">Verify Your Email</h2>
          <p className="text-muted-foreground">
            {!codeSent
              ? "We'll send a 6-digit verification code to your email"
              : "Enter the code we sent to your email"}
          </p>
        </div>

        <div className="space-y-4">
          {!codeSent ? (
            <>
              <Input
                data-testid="input-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                disabled={sendCodeMutation.isPending}
              />
              <Button
                data-testid="button-send-code"
                onClick={handleSendCode}
                disabled={!email || sendCodeMutation.isPending}
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
                Code sent to: <span className="font-medium text-foreground">{email}</span>
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
                onClick={handleVerify}
                disabled={code.length !== 6 || verifyCodeMutation.isPending}
                className="w-full rounded-full"
                size="lg"
              >
                {verifyCodeMutation.isPending ? "Verifying..." : "Verify Email"}
              </Button>
              <Button
                data-testid="button-resend"
                variant="ghost"
                onClick={handleSendCode}
                disabled={resendTimer > 0 || sendCodeMutation.isPending}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </Button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          This helps us ensure your account is secure and you can recover it if needed.
        </p>
      </div>
    </div>
  );
}
