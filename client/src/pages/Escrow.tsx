import { ChevronLeft, Shield, ExternalLink, CreditCard, Building2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

const howItWorks = [
  {
    step: "1",
    title: "Initial Deposit",
    description: "Deposit $1,000 minimum to activate account",
  },
  {
    step: "2",
    title: "First Meeting",
    description: "$2,000 held in escrow for security",
  },
  {
    step: "3",
    title: "Final Match",
    description: "$50,000 held in escrow transfers to submissive",
  },
];

export default function Escrow() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/subscription")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      
      <div className="max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-black rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Partner Escrow Account
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          Financial verification ensures trust and commitment within our community
        </p>

        <Card className="p-6 mb-6">
          <h3 className="font-medium mb-4 text-foreground">How It Works</h3>
          <div className="space-y-4">
            {howItWorks.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 font-semibold">{item.step}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-6 bg-gradient-to-r from-red-500/5 to-black/5 border-red-500/20">
          <h3 className="font-medium text-foreground mb-3">Financial Structure</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Initial deposit</span>
              <span className="font-semibold text-foreground">$1,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">First meeting escrow</span>
              <span className="font-semibold text-foreground">$2,000</span>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Final match escrow</span>
                <span className="font-semibold text-red-500">$50,000</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Transferred to submissive upon final match
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 bg-gradient-to-r from-black/5 to-red-500/5 border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Account Transfer & Security
              </h3>
              <p className="text-sm text-muted-foreground">
                Upon final match, the entire escrow account transfers to your submissive partner, ensuring their financial security and demonstrating your commitment to the relationship.
              </p>
            </div>
          </div>
        </Card>

        {/* Escrow Provider Options */}
        <Card className="p-6 mb-6 border-2 border-red-500/30">
          <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Secure Escrow Partners
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            We partner with licensed and regulated escrow services to ensure your funds are held 
            securely with built-in compliance and zero chargebacks.
          </p>
          
          {/* Provider Options */}
          <div className="space-y-3 mb-4">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Escrow.com</h4>
                  <p className="text-xs text-muted-foreground">Licensed & regulated since 1999</p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">Available Now</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Over $5 billion in transactions protected. Full compliance and multiple payment methods.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border border-border opacity-75">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-foreground">FinFitLife.com</h4>
                  <p className="text-xs text-muted-foreground">Financial wellness partner</p>
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded">Coming Soon</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Specialized escrow services for relationship-based financial commitments. Integration in progress.
              </p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Licensed & regulated escrow service</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Built-in KYC/AML compliance verification</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Funds protected in tier-1 banks</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-foreground">No chargebacks - permanent settlement</span>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <h4 className="font-medium text-foreground text-sm mb-3">Payment Methods Available</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4 text-red-500" />
                <span>Wire Transfer</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 text-red-500" />
                <span>Credit Card</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="w-4 h-4 text-red-500" />
                <span>PayPal</span>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
            <p className="text-sm text-foreground mb-2">
              <strong>Setup Process (Escrow.com):</strong>
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
              <li>Click "Create Escrow Account with Escrow.com" below</li>
              <li>Complete the secure account registration</li>
              <li>Verify your identity (required for compliance)</li>
              <li>Fund your account with minimum $1,000 deposit</li>
              <li>Return here to complete your profile setup</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Note: Additional providers including FinFitLife.com will be available soon for enhanced options.
            </p>
          </div>
        </Card>

        <div className="flex flex-col items-center gap-3">
          <Button
            data-testid="button-create-escrow"
            onClick={() => window.open('https://www.escrow.com/integrations/signup', '_blank')}
            className="rounded-full bg-red-500 hover:bg-black text-white transition-colors px-12 flex items-center gap-2"
            size="lg"
          >
            Create Escrow Account with Escrow.com
            <ExternalLink className="w-4 h-4" />
          </Button>
          <p className="text-xs text-muted-foreground text-center max-w-md">
            You'll be securely redirected to Escrow.com to complete account setup and deposit funds
          </p>
          
          <div className="text-center mt-2">
            <p className="text-xs text-muted-foreground">
              More providers coming soon • FinFitLife.com integration in progress
            </p>
          </div>
          
          <Button
            data-testid="button-skip-for-now"
            onClick={() => setLocation("/discover")}
            variant="outline"
            className="rounded-full mt-4"
            size="lg"
          >
            I'll Set This Up Later
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Note: Matching will be limited until escrow verification is complete
          </p>
        </div>
      </div>
    </div>
  );
}
