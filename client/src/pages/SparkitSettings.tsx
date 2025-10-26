import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Save, User, Sparkles } from "lucide-react";
import type { SparkitCouple } from "@shared/schema";

export default function SparkitSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const coupleId = localStorage.getItem("sparkitCoupleId");

  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");

  const { data: couple, isLoading } = useQuery<SparkitCouple>({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
  });

  // Initialize form values when couple data loads
  useEffect(() => {
    if (couple) {
      setPartner1Name(couple.partner1Name || "");
      setPartner2Name(couple.partner2Name || "");
    }
  }, [couple]);

  const updateNamesMutation = useMutation({
    mutationFn: async () => {
      // Only send non-empty names to match Zod validation
      const payload: { partner1Name?: string; partner2Name?: string } = {};
      if (partner1Name.trim()) payload.partner1Name = partner1Name.trim();
      if (partner2Name.trim()) payload.partner2Name = partner2Name.trim();
      
      const res = await apiRequest("PATCH", `/api/sparkit/couples/${coupleId}/names`, payload);
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update names");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sparkit/couples", coupleId] });
      toast({
        title: "Names updated!",
        description: "Your partner names have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update partner names. Please try again.",
      });
    },
  });

  if (!coupleId) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-nexus-purple/20 to-nexus-red/20">
        <Card className="p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-nexus-purple" />
          <h2 className="text-xl font-bold mb-2">No Couple Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please create or join a couple first.
          </p>
          <Button onClick={() => setLocation("/sparkit")} data-testid="button-go-home">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading || !couple) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nexus-purple"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  const handleSaveNames = () => {
    if (!partner1Name.trim()) {
      toast({
        variant: "destructive",
        title: "Partner 1 name required",
        description: "Please enter a name for Partner 1.",
      });
      return;
    }


    updateNamesMutation.mutate();
  };

  return (
    <div className="nexus-app min-h-screen bg-gradient-to-br from-nexus-purple/20 to-nexus-red/20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/spark")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-nexus-purple to-nexus-red bg-clip-text text-transparent">
            Settings
          </h1>
        </div>

        {/* Partner Names Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-nexus-purple" />
            <h2 className="text-xl font-semibold">Partner Names</h2>
          </div>

          <div className="space-y-6">
            {/* Partner 1 Name */}
            <div className="space-y-2">
              <Label htmlFor="partner1Name" className="text-sm font-medium">
                Partner 1 Name
              </Label>
              <Input
                id="partner1Name"
                type="text"
                value={partner1Name}
                onChange={(e) => setPartner1Name(e.target.value)}
                placeholder="Enter Partner 1 name"
                maxLength={50}
                data-testid="input-partner1-name"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This is the name that will be displayed for Partner 1
              </p>
            </div>

            {/* Partner 2 Name */}
            <div className="space-y-2">
              <Label htmlFor="partner2Name" className="text-sm font-medium">
                Partner 2 Name
              </Label>
              <Input
                id="partner2Name"
                type="text"
                value={partner2Name}
                onChange={(e) => setPartner2Name(e.target.value)}
                placeholder="Enter Partner 2 name"
                maxLength={50}
                data-testid="input-partner2-name"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This is the name that will be displayed for Partner 2
              </p>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveNames}
              disabled={updateNamesMutation.isPending}
              className="w-full bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 transition-opacity"
              data-testid="button-save-names"
            >
              {updateNamesMutation.isPending ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Names
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Couple Info Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Couple Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Couple Code:</span>
              <span className="font-mono font-semibold">{couple.coupleCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Plan:</span>
              <span className="font-medium capitalize">{couple.subscriptionPlan}</span>
            </div>
            {couple.subscriptionPlan === "trial" && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sparks Remaining:</span>
                <span className="font-medium">{couple.sparksRemaining} / 10</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
