import { useEffect, useState } from "react";
import { Shield, CheckCircle, Loader2, FileSearch, Database, UserCheck, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function BackgroundCheckProcessing() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(false);

  // Get data from sessionStorage
  const hasSubmitted = sessionStorage.getItem('backgroundCheckSubmitted') === 'true';
  const userName = sessionStorage.getItem('backgroundCheckName');

  useEffect(() => {
    // If no submission data, redirect back (only check once on mount)
    if (!hasSubmitted) {
      console.log('Missing background check data, redirecting back');
      const redirectTimer = setTimeout(() => {
        setLocation('/background-check');
      }, 500);
      return () => clearTimeout(redirectTimer);
    }

    // Simulate background check processing steps
    const timer1 = setTimeout(() => setStep(2), 2500); // SSN validation
    const timer2 = setTimeout(() => setStep(3), 5000); // Criminal records
    const timer3 = setTimeout(() => setStep(4), 7500); // Sex offender registry
    const timer4 = setTimeout(() => setStep(5), 10000); // Address verification
    const timer5 = setTimeout(() => setStep(6), 12500); // Final review
    const timer6 = setTimeout(() => {
      setStep(7);
      setVerified(true);
    }, 15000); // Complete

    const timer7 = setTimeout(() => {
      // Mark as verified first
      sessionStorage.setItem('backgroundCheckComplete', 'true');
      sessionStorage.setItem('backgroundCheckStatus', 'clear');
      
      // Clear background check data
      sessionStorage.removeItem('backgroundCheckSubmitted');
      sessionStorage.removeItem('backgroundCheckName');
      
      // Get user role to determine which subscription page
      const userRole = sessionStorage.getItem('userRole') || '';
      const isDominant = userRole === 'Dominant' || userRole === 'Domme' || userRole === 'Master';
      
      // Redirect to appropriate subscription page based on role
      if (isDominant) {
        setLocation('/subscription-dom');
      } else {
        setLocation('/subscription-sub');
      }
    }, 17000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
    };
  }, []);

  const steps = [
    { id: 1, label: "Validating personal information", icon: Loader2 },
    { id: 2, label: "Verifying SSN and identity", icon: UserCheck },
    { id: 3, label: "Searching criminal records", icon: FileSearch },
    { id: 4, label: "Checking sex offender registry", icon: Database },
    { id: 5, label: "Verifying address history", icon: FileSearch },
    { id: 6, label: "Conducting final review", icon: Loader2 },
    { id: 7, label: "Verification complete", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-muted p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-black rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Processing Background Check
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          {userName ? `Verifying ${userName}` : 'Please wait while we complete your verification'}
        </p>

        <Card className="p-8 mb-6">
          <div className="space-y-5">
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
                  data-testid={`background-step-${s.id}`}
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
                    {isCurrent && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This may take a moment...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {verified && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium text-green-500">
                Background Check Complete
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No issues found - Redirecting...
              </p>
            </div>
          )}
        </Card>

        <Card className="p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-1 text-sm">Industry Standard Verification</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We partner with leading background check providers to ensure accurate and compliant 
                verification. All searches are conducted in accordance with the Fair Credit Reporting Act (FCRA).
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
