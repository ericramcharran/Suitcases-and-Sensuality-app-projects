import { useState, useEffect } from "react";
import { ChevronLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

const commonKinkCategories = [
  { key: "dominant", label: "Dominant" },
  { key: "submissive", label: "submissive" },
  { key: "switch", label: "Switch" },
  { key: "master", label: "Master/Mistress" },
  { key: "slave", label: "Slave" },
  { key: "brat", label: "Brat" },
  { key: "bratTamer", label: "Brat Tamer" },
  { key: "sadist", label: "Sadist" },
  { key: "masochist", label: "Masochist" },
  { key: "degrader", label: "Degrader" },
  { key: "degradee", label: "Degradee" },
  { key: "rigger", label: "Rigger (Rope Top)" },
  { key: "ropeBottom", label: "Rope Bottom" },
  { key: "primal", label: "Primal" },
  { key: "vanilla", label: "Vanilla" }
];

export default function BDSMTestInput() {
  const [, setLocation] = useLocation();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [kinkValues, setKinkValues] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const savedImage = localStorage.getItem('bdsmTestImage');
    if (savedImage) {
      setUploadedImage(savedImage);
    } else {
      setLocation("/bdsm-test-upload");
    }
  }, [setLocation]);

  const saveMutation = useMutation({
    mutationFn: async (data: { userId: string; kinkPreferences: Record<string, number>; testImageUrl: string }) => {
      return await apiRequest("POST", "/api/bdsm-test-results", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', userId] });
      toast({
        title: "Test results saved",
        description: "Your BDSM test results have been added to your profile"
      });
      localStorage.removeItem('bdsmTestImage');
      setLocation("/bdsm-test-processing");
    },
    onError: () => {
      toast({
        title: "Error saving results",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  const handleValueChange = (key: string, value: string) => {
    setKinkValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive"
      });
      return;
    }

    // Convert string values to numbers and filter out empty values
    const kinkPreferences: Record<string, number> = {};
    Object.entries(kinkValues).forEach(([key, value]) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        kinkPreferences[key] = numValue;
      }
    });

    if (Object.keys(kinkPreferences).length === 0) {
      toast({
        title: "No values entered",
        description: "Please enter at least one percentage value",
        variant: "destructive"
      });
      return;
    }

    saveMutation.mutate({
      userId,
      kinkPreferences,
      testImageUrl: uploadedImage || ''
    });
  };

  const handleSkip = () => {
    localStorage.removeItem('bdsmTestImage');
    setLocation("/important-traits");
  };

  return (
    <div className="min-h-screen bg-muted p-6 pb-20">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/bdsm-test-upload")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Enter Your Test Results
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          Enter the percentage values from your BDSM test results
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          {uploadedImage && (
            <div className="lg:sticky lg:top-6 h-fit">
              <Card className="p-4" data-testid="card-image-preview">
                <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Your Uploaded Results
                </h3>
                <img 
                  src={uploadedImage} 
                  alt="BDSM Test Results" 
                  className="w-full rounded-md border border-border max-h-96 object-contain bg-background"
                  data-testid="img-test-results"
                />
              </Card>
            </div>
          )}

          {/* Input Form */}
          <div>
            <Card className="p-6 mb-6" data-testid="card-kink-inputs">
              <h3 className="font-medium text-foreground mb-4">
                Enter Percentage Values (0-100%)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Fill in the categories that appear in your test results. You can skip any that don't apply.
              </p>

              <div className="space-y-4">
                {commonKinkCategories.map((category) => (
                  <div key={category.key} className="grid grid-cols-[1fr,100px] gap-3 items-center">
                    <Label htmlFor={category.key} className="text-sm">
                      {category.label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={category.key}
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        placeholder="0"
                        value={kinkValues[category.key] || ''}
                        onChange={(e) => handleValueChange(category.key, e.target.value)}
                        className="pr-8"
                        data-testid={`input-${category.key}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
                data-testid="button-skip"
              >
                Skip for Now
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1"
                data-testid="button-save"
              >
                {saveMutation.isPending ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
