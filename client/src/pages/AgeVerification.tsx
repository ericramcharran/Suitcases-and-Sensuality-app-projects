import { Shield, ChevronLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function AgeVerification() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-black rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Age Verification
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          You must be 21+ to continue
        </p>
        <Card className="p-8 mb-6">
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-6 hover:border-red-500 cursor-pointer transition-colors" data-testid="upload-area">
            <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-foreground">Upload ID</p>
          </div>
          <Button
            data-testid="button-verify"
            onClick={() => setLocation("/terms")}
            className="w-full rounded-full bg-red-500 hover:bg-black text-white transition-colors"
            size="lg"
          >
            Verify Identity
          </Button>
        </Card>
      </div>
    </div>
  );
}
