import { ChevronLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

const howItWorks = [
  {
    step: "1",
    title: "Initial Deposit",
    description: "Deposit $1,000 minimum",
  },
  {
    step: "2",
    title: "First Meeting",
    description: "$2,000 held in escrow",
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
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-light mb-4 text-center text-foreground">
          Partner Escrow Account
        </h2>
        <p className="text-foreground/70 mb-8 text-center">
          Set up escrow to match with submissives
        </p>

        <Card className="p-6 mb-6">
          <h4 className="font-medium mb-4 text-foreground">How It Works</h4>
          <div className="space-y-4 text-sm text-foreground/80">
            {howItWorks.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400 font-semibold">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 mb-6 bg-primary/10 border-primary/20">
          <h4 className="font-medium text-primary mb-3">Financial Structure</h4>
          <div className="text-sm text-primary/90 space-y-2">
            <div className="flex justify-between">
              <span>Initial deposit</span>
              <span className="font-semibold">$1,000</span>
            </div>
            <div className="flex justify-between">
              <span>First meeting</span>
              <span className="font-semibold">$2,000</span>
            </div>
            <div className="pt-2 border-t border-primary/20">
              <p className="font-semibold">
                Final Match - $50,000 held in escrow to be transferred to submissive
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-6 bg-blue-500/10 border-blue-500/20">
          <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
            Account Transfer
          </h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Upon final match, entire escrow account transfers to submissive for their financial
            security.
          </p>
        </Card>

        <Button
          data-testid="button-setup-escrow"
          onClick={() => setLocation("/discover")}
          className="w-full rounded-full"
        >
          Set Up Escrow
        </Button>
      </div>
    </div>
  );
}
