import { useState } from "react";
import { Shield, ChevronLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export default function AgeVerification() {
  const [, setLocation] = useLocation();
  const [dateOfBirth, setDateOfBirth] = useState("");

  const isOver21 = () => {
    if (!dateOfBirth) return false;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 21;
    }
    return age >= 21;
  };

  const canContinue = isOver21();

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
          <div className="mb-6">
            <Label htmlFor="dob" className="text-foreground mb-2 block">
              Date of Birth
            </Label>
            <Input
              data-testid="input-dob"
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="rounded-xl"
            />
            {dateOfBirth && !isOver21() && (
              <p className="text-sm text-destructive mt-2">
                You must be 21 or older to use this platform
              </p>
            )}
          </div>

          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-6 hover:border-red-500 cursor-pointer transition-colors" data-testid="upload-area">
            <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-foreground">Upload ID (Optional)</p>
          </div>
          
          <Button
            data-testid="button-verify"
            onClick={() => setLocation("/terms")}
            disabled={!canContinue}
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
