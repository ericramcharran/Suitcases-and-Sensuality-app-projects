import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function BDSMTestProcessing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/important-traits");
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <Card className="p-12 max-w-md w-full text-center" data-testid="card-processing">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-light mb-3 text-foreground">
          Test Results Saved!
        </h2>
        <p className="text-muted-foreground mb-6">
          Your BDSM test results have been added to improve your matches
        </p>
        
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </Card>
    </div>
  );
}
