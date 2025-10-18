import { ChevronLeft, Shield, ExternalLink, CreditCard, Building2, Wallet, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

const howItWorks = [
  {
    step: "1",
    title: "Initial Deposit",
    description: "$1,000 non-refundable deposit via escrow or mutual fund",
  },
  {
    step: "2",
    title: "Service Fee",
    description: "$2,000 platform service fee for matching and verification",
  },
  {
    step: "3",
    title: "Final Match",
    description: "$50,000+ account (plus growth) for submissive's financial security",
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
          Partner Escrow & Investment Account
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          Secure your commitment with funds that grow over time through escrow or mutual fund investments
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
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Initial deposit</span>
                <span className="text-xs text-muted-foreground italic">Non-refundable</span>
              </div>
              <span className="font-semibold text-foreground">$1,000</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Platform service fee</span>
                <span className="text-xs text-muted-foreground italic">Matching & verification</span>
              </div>
              <span className="font-semibold text-foreground">$2,000</span>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Final match requirement</span>
                  <span className="text-xs text-muted-foreground italic">For submissive's security</span>
                </div>
                <span className="font-semibold text-red-500">$50,000+</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Transferred to submissive upon final match (includes investment growth if applicable)
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
                Financial Security for Your Partner
              </h3>
              <p className="text-sm text-muted-foreground">
                Upon final match, the $50,000+ account (escrow or mutual fund investment) transfers to your 
                submissive partner, ensuring their financial security. If held in mutual funds, your commitment 
                grows over time, demonstrating long-term dedication and providing enhanced value.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                The initial $1,000 deposit is non-refundable and demonstrates serious commitment. 
                The $2,000 service fee covers our comprehensive matching, verification, and safety services.
              </p>
            </div>
          </div>
        </Card>

        {/* Escrow & Investment Provider Options */}
        <Card className="p-6 mb-6 border-2 border-red-500/30">
          <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Secure Escrow & Investment Partners
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose between traditional escrow (secure holding) or mutual fund investments (growing value over time). 
            Both options ensure your funds are held securely with built-in compliance.
          </p>
          
          {/* Provider Options */}
          <div className="space-y-3 mb-4">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Escrow.com</h4>
                  <p className="text-xs text-muted-foreground">Traditional escrow - Licensed & regulated since 1999</p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">Available Now</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Secure holding of funds with over $5 billion in transactions protected. Full compliance and multiple payment methods.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border border-border opacity-75">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-foreground">FinFitLife.com</h4>
                  <p className="text-xs text-muted-foreground">Escrow + mutual fund investment options</p>
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded">Coming Soon</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Specialized services combining secure escrow with mutual fund investments that grow over time. 
                Your commitment earns value while demonstrating long-term dedication.
              </p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Escrow: Secure holding with guaranteed protection</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Mutual Funds: Investment growth over time (coming soon)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Built-in KYC/AML compliance verification</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Funds protected in tier-1 financial institutions</span>
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
              <strong>Setup Process (Escrow.com - Traditional Holding):</strong>
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
              <li>Click "Create Account with Escrow.com" below</li>
              <li>Complete the secure account registration</li>
              <li>Verify your identity (required for compliance)</li>
              <li>Fund your account with minimum $1,000 deposit</li>
              <li>Return here to complete your profile setup</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3 italic">
              <strong>Investment Option Coming Soon:</strong> FinFitLife.com will offer mutual fund investments 
              where your commitment grows over time, earning market returns while securing your relationship commitment.
            </p>
          </div>
        </Card>

        <Card className="p-6 mb-6 bg-gradient-to-r from-red-500/5 to-black/5 border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">
                Understanding the Agreement Timeline
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Learn about our 5-year vesting schedule and what happens if the relationship ends at different points in time.
              </p>
              <Button
                data-testid="button-view-timeline"
                onClick={() => setLocation("/agreement-timeline")}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                View Agreement Timeline
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex flex-col items-center gap-3">
          <Button
            data-testid="button-create-escrow"
            onClick={() => {
              // Open escrow signup in new tab
              window.open('https://www.escrow.com/integrations/signup', '_blank');
              // Mark as initiated
              sessionStorage.setItem('escrowInitiated', 'true');
            }}
            className="rounded-full bg-red-500 hover:bg-black text-white transition-colors px-12 flex items-center gap-2"
            size="lg"
          >
            Create Account with Escrow.com
            <ExternalLink className="w-4 h-4" />
          </Button>
          <p className="text-xs text-muted-foreground text-center max-w-md">
            Traditional escrow: Secure holding of funds with guaranteed protection
          </p>
          
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground font-medium">
              Coming Soon: Mutual Fund Investment Option
            </p>
            <p className="text-xs text-muted-foreground">
              FinFitLife.com integration • Grow your commitment over time while maintaining security
            </p>
          </div>
          
          <Button
            data-testid="button-skip-for-now"
            onClick={() => {
              // Mark escrow as acknowledged
              sessionStorage.setItem('escrowAcknowledged', 'true');
              // Continue to discover page
              setLocation("/discover");
            }}
            variant="outline"
            className="rounded-full mt-4"
            size="lg"
          >
            Continue to Matching
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Start discovering compatible matches
          </p>
        </div>
      </div>
    </div>
  );
}
