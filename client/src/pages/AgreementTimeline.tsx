import { useState, useRef } from "react";
import { ChevronLeft, Calendar, Shield, TrendingUp, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import SignatureCanvas from "react-signature-canvas";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const vestingSchedule = [
  {
    year: "Year 1",
    percentage: "20%",
    amount: "~$10,000",
    description: "First year commitment",
  },
  {
    year: "Year 2",
    percentage: "40%",
    amount: "~$20,000",
    description: "Building trust and connection",
  },
  {
    year: "Year 3",
    percentage: "60%",
    amount: "~$30,000",
    description: "Deepening the relationship",
  },
  {
    year: "Year 4",
    percentage: "80%",
    amount: "~$40,000",
    description: "Long-term commitment demonstrated",
  },
  {
    year: "5+ Years",
    percentage: "100%",
    amount: "$50,000+",
    description: "Full vesting - complete financial security",
  },
];

export default function AgreementTimeline() {
  const [, setLocation] = useLocation();
  const [isSigning, setIsSigning] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);
  const { toast } = useToast();

  const handleClearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleContinue = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setLocation('/signup');
      return;
    }

    // Check if signature is provided
    if (signatureRef.current?.isEmpty()) {
      toast({
        title: "Signature Required",
        description: "Please provide your digital signature to continue",
        variant: "destructive"
      });
      return;
    }

    setIsSigning(true);

    try {
      // Get signature as data URL
      const signatureData = signatureRef.current?.toDataURL();
      const signedDate = new Date().toISOString();

      // Save signature for vesting agreement
      await apiRequest("PATCH", `/api/users/${userId}`, {
        guidelinesSignature: signatureData,
        guidelinesSignedDate: signedDate,
        agreedGuidelines: true
      });

      toast({
        title: "Agreement Signed",
        description: "Your vesting agreement has been recorded",
      });
      
      // Mark escrow as acknowledged and continue to discover
      sessionStorage.setItem('escrowAcknowledged', 'true');
      setLocation("/discover");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save signature. Please try again.",
        variant: "destructive"
      });
      setIsSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/escrow")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      
      <div className="max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-black rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Agreement Timeline & Vesting Schedule
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          Understanding financial security over time
        </p>

        <Card className="p-6 mb-6 bg-gradient-to-r from-red-500/5 to-black/5 border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Protecting Both Parties
              </h3>
              <p className="text-sm text-muted-foreground">
                Our vesting schedule ensures fairness for both partners. If a submissive chooses to end 
                the relationship, they receive a portion of the committed funds based on the time invested 
                in building the connection.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="font-medium mb-4 text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            5-Year Vesting Schedule
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Financial commitment grows over time, reflecting the deepening relationship:
          </p>
          
          <div className="space-y-3">
            {vestingSchedule.map((item, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg border ${
                  i === vestingSchedule.length - 1 
                    ? 'bg-red-500/5 border-red-500/20' 
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-foreground">{item.year}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-500">{item.percentage}</p>
                    <p className="text-xs text-muted-foreground">{item.amount}</p>
                  </div>
                </div>
                <div className="w-full bg-border/30 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-black transition-all"
                    style={{ width: item.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="font-medium mb-4 text-foreground">How It Works</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-red-500 text-xs font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Relationship Begins</p>
                <p className="text-muted-foreground">
                  Dominant member establishes $50,000+ account (escrow or mutual fund investment)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-red-500 text-xs font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Vesting Period</p>
                <p className="text-muted-foreground">
                  Each year, an additional 20% of the funds become vested to the submissive partner
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-red-500 text-xs font-semibold">3</span>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Early Termination</p>
                <p className="text-muted-foreground">
                  If submissive ends the relationship, they receive the vested percentage based on years completed. Remaining funds return to the Dominant.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-red-500 text-xs font-semibold">4</span>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Full Vesting (5 Years)</p>
                <p className="text-muted-foreground">
                  After 5 years, the submissive is entitled to the full amount ($50,000+ including any investment growth). This represents complete financial security.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 bg-gradient-to-r from-black/5 to-red-500/5 border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Investment Growth Benefits
              </h3>
              <p className="text-sm text-muted-foreground">
                If the funds are held in mutual fund investments, the account value may grow over time. 
                The submissive receives their vested percentage of the total account value, including any 
                investment gains. This means the longer the relationship, the more valuable the commitment becomes.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="font-medium mb-3 text-foreground">Example Scenarios</h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="font-medium text-foreground mb-2">Scenario 1: Ending After 2 Years</p>
              <p className="text-sm text-muted-foreground">
                Submissive has completed 2 years and is 40% vested. They receive approximately $20,000 
                (or 40% of the total account value if invested). The remaining $30,000 returns to the Dominant.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="font-medium text-foreground mb-2">Scenario 2: Ending After 4 Years</p>
              <p className="text-sm text-muted-foreground">
                Submissive has completed 4 years and is 80% vested. They receive approximately $40,000 
                (or 80% of the total account value). The remaining $10,000 returns to the Dominant.
              </p>
            </div>

            <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
              <p className="font-medium text-foreground mb-2">Scenario 3: 5+ Years (Full Vesting)</p>
              <p className="text-sm text-muted-foreground">
                After 5 years, the submissive receives 100% of the account - the full $50,000+ including 
                any investment growth. This ensures complete financial security for long-term committed relationships.
              </p>
            </div>
          </div>
        </Card>

        {/* Digital Signature Section */}
        <Card className="p-6 mb-6">
          <h3 className="font-medium mb-4 text-foreground flex items-center gap-2">
            <PenTool className="w-5 h-5 text-red-500" />
            Digital Signature Required
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            By signing below, you acknowledge that you have read and understood the vesting agreement timeline 
            and financial terms outlined above. This signature will be recorded with today's date.
          </p>
          
          <div className="border-2 border-border rounded-lg p-2 bg-white mb-3">
            <SignatureCanvas
              ref={signatureRef}
              data-testid="signature-canvas"
              canvasProps={{
                className: 'w-full h-40',
                style: { touchAction: 'none' }
              }}
              backgroundColor="white"
            />
          </div>
          
          <div className="flex justify-between items-center text-sm mb-4">
            <p className="text-muted-foreground">Sign above</p>
            <Button
              data-testid="button-clear-signature"
              variant="ghost"
              size="sm"
              onClick={handleClearSignature}
              className="text-red-500 hover:text-red-600"
            >
              Clear
            </Button>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Date:</strong> {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button
            data-testid="button-continue"
            onClick={handleContinue}
            className="rounded-full bg-red-500 hover:bg-black text-white transition-colors px-12"
            size="lg"
            disabled={isSigning}
          >
            {isSigning ? "Saving..." : "Sign & Continue to Platform"}
          </Button>
        </div>
      </div>
    </div>
  );
}
