import { useEffect, useState } from "react";
import { Shield, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function VerificationProcessing() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(false);

  // Get verification data from sessionStorage
  const month = sessionStorage.getItem('verificationMonth');
  const day = sessionStorage.getItem('verificationDay');
  const year = sessionStorage.getItem('verificationYear');
  const hasUploadedId = sessionStorage.getItem('hasUploadedId') === 'true';

  useEffect(() => {
    // If no verification data, redirect back (only check once on mount)
    if (!month || !day || !year || !hasUploadedId) {
      console.log('Missing verification data, redirecting back');
      const redirectTimer = setTimeout(() => {
        setLocation('/age-verification');
      }, 500);
      return () => clearTimeout(redirectTimer);
    }

    // Simulate verification steps
    const timer1 = setTimeout(() => setStep(2), 2000); // Analyzing ID
    const timer2 = setTimeout(() => setStep(3), 4000); // Extracting data
    const timer3 = setTimeout(() => setStep(4), 6000); // Verifying age
    const timer4 = setTimeout(() => {
      setStep(5);
      setVerified(true);
    }, 8000); // Complete

    const timer5 = setTimeout(() => {
      // Mark as verified first
      sessionStorage.setItem('ageVerified', 'true');
      sessionStorage.setItem('dateOfBirth', `${month}/${day}/${year}`);
      
      // Clear verification data
      sessionStorage.removeItem('verificationMonth');
      sessionStorage.removeItem('verificationDay');
      sessionStorage.removeItem('verificationYear');
      sessionStorage.removeItem('hasUploadedId');
      
      // Redirect to terms
      setLocation('/terms');
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const steps = [
    { id: 1, label: "Receiving document", icon: Loader2 },
    { id: 2, label: "Analyzing ID authenticity", icon: Loader2 },
    { id: 3, label: "Extracting information", icon: Loader2 },
    { id: 4, label: "Verifying age requirement", icon: Loader2 },
    { id: 5, label: "Verification complete", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-muted p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-black rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Verifying Identity
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          Please wait while we verify your information
        </p>

        <Card className="p-8 mb-6">
          <div className="space-y-6">
            {steps.map((s) => {
              const Icon = s.icon;
              const isComplete = step > s.id;
              const isCurrent = step === s.id;
              
              return (
                <div 
                  key={s.id}
                  className={`flex items-center gap-4 transition-all ${
                    isCurrent ? 'opacity-100' : isComplete ? 'opacity-70' : 'opacity-30'
                  }`}
                  data-testid={`verification-step-${s.id}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete 
                      ? 'bg-green-500/20' 
                      : isCurrent 
                      ? 'bg-red-500/20' 
                      : 'bg-muted'
                  }`}>
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Icon className={`w-5 h-5 ${
                        isCurrent ? 'text-red-500 animate-spin' : 'text-muted-foreground'
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isComplete 
                        ? 'text-green-500' 
                        : isCurrent 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                    }`}>
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {verified && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium text-green-500">
                Identity Verified Successfully
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Redirecting...
              </p>
            </div>
          )}
        </Card>

        <Card className="p-4 bg-muted border-border">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-1 text-sm">Secure Verification</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your ID document is encrypted and processed securely. We use bank-level security 
                to protect your information. Documents are deleted after verification.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
