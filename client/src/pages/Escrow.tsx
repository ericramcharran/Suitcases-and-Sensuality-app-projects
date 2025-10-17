import { ChevronLeft, Shield } from "lucide-react";
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

        <div className="flex justify-center">
          <Button
            data-testid="button-setup-escrow"
            onClick={() => setLocation("/discover")}
            className="rounded-full bg-red-500 hover:bg-black text-white transition-colors px-12"
            size="lg"
          >
            Set Up Escrow
          </Button>
        </div>
      </div>
    </div>
  );
}
