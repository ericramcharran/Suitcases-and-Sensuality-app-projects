import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Save, User, Sparkles, Crown, Upload, Check, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVATAR_ICONS, getIconAvatarUrl, isIconAvatar, getIconIdFromUrl, type AvatarIcon } from "@/data/avatarIcons";
import { AvatarUploader } from "@/components/AvatarUploader";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import type { SparkitCouple } from "@shared/schema";

export default function SparkitSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<"partner1" | "partner2">("partner1");

  // Check authentication via session
  const { data: authData } = useQuery<{ coupleId: string; partnerRole: string } | null>({
    queryKey: ["/api/sparkit/auth/me"],
    retry: false,
  });

  const coupleId = authData?.coupleId ?? null;

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

  const updateAvatarMutation = useMutation({
    mutationFn: async ({ partner, avatarUrl }: { partner: "partner1" | "partner2"; avatarUrl: string }) => {
      const res = await apiRequest("PATCH", `/api/sparkit/couples/${coupleId}/avatars`, {
        partner,
        avatarUrl,
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update avatar");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sparkit/couples", coupleId] });
      toast({
        title: "Avatar updated!",
        description: "Your avatar has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Could not update avatar. Please try again.",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sparkit/auth/logout", {});
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      setLocation("/sparkit/login");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Could not log out. Please try again.",
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

  const handleSelectIconAvatar = (iconId: string) => {
    // Check if user has premium access (trial, monthly, or yearly - anything except 'free')
    const hasPremiumAccess = couple?.subscriptionPlan !== "free";
    
    if (!hasPremiumAccess) {
      toast({
        variant: "destructive",
        title: "Premium Feature",
        description: "Avatars are available with Premium subscription. Upgrade to customize your profile!",
      });
      return;
    }

    const avatarUrl = getIconAvatarUrl(iconId);
    updateAvatarMutation.mutate({ partner: selectedPartner, avatarUrl });
  };

  const handleGetUploadParameters = async () => {
    // Check if user has premium access (trial, monthly, or yearly - anything except 'free')
    const hasPremiumAccess = couple?.subscriptionPlan !== "free";
    
    if (!hasPremiumAccess) {
      toast({
        variant: "destructive",
        title: "Premium Feature",
        description: "Custom avatars are available with Premium subscription. Upgrade now!",
      });
      throw new Error("Premium feature");
    }

    // Get upload URL
    const uploadUrlRes = await apiRequest("POST", "/api/sparkit/avatar/upload-url", {
      coupleId,
    });

    if (!uploadUrlRes.ok) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Could not get upload URL. Please try again.",
      });
      throw new Error("Failed to get upload URL");
    }

    const { uploadURL } = await uploadUrlRes.json();
    
    return {
      method: "PUT" as const,
      url: uploadURL,
    };
  };

  const handleUploadComplete = (objectPath: string) => {
    // Update avatar with object path
    updateAvatarMutation.mutate({ partner: selectedPartner, avatarUrl: objectPath });
  };

  const getCurrentAvatar = (partner: "partner1" | "partner2") => {
    return partner === "partner1" ? couple?.partner1AvatarUrl : couple?.partner2AvatarUrl;
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

        {/* Avatar Selection Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-nexus-purple" />
              <h2 className="text-xl font-semibold">Avatars</h2>
            </div>
            {couple.subscriptionPlan === "free" && (
              <Badge variant="secondary" className="bg-gradient-to-r from-nexus-purple to-nexus-red text-white">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {/* Partner Selector Tabs */}
          <Tabs value={selectedPartner} onValueChange={(value) => setSelectedPartner(value as "partner1" | "partner2")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="partner1" data-testid="tab-partner1-avatar">
                {partner1Name || "Partner 1"}
              </TabsTrigger>
              <TabsTrigger value="partner2" data-testid="tab-partner2-avatar">
                {partner2Name || "Partner 2"}
              </TabsTrigger>
            </TabsList>

            {/* Partner 1 Avatar */}
            <TabsContent value="partner1" className="space-y-6">
              {/* Current Avatar Preview */}
              <div className="flex flex-col items-center gap-4">
                <Label className="text-sm font-medium">Current Avatar</Label>
                <AvatarDisplay 
                  avatarUrl={getCurrentAvatar("partner1")} 
                  size="xl" 
                  data-testid="avatar-preview-partner1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {getCurrentAvatar("partner1") ? "Your selected avatar" : "No avatar selected"}
                </p>
              </div>

              {/* Icon Gallery */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Choose an Icon</Label>
                <ScrollArea className="h-64 rounded-md border p-4">
                  <div className="grid grid-cols-6 gap-3">
                    {AVATAR_ICONS.map((icon) => {
                      const IconComponent = icon.icon;
                      const isSelected = getCurrentAvatar("partner1") === getIconAvatarUrl(icon.id);
                      
                      return (
                        <button
                          key={icon.id}
                          onClick={() => handleSelectIconAvatar(icon.id)}
                          disabled={updateAvatarMutation.isPending}
                          className={`
                            relative p-3 rounded-md border-2 transition-all hover-elevate active-elevate-2
                            ${isSelected ? "border-nexus-purple bg-nexus-purple/10" : "border-gray-200 dark:border-gray-700"}
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                          data-testid={`icon-avatar-${icon.id}`}
                          aria-label={icon.label}
                        >
                          <IconComponent className="w-6 h-6 mx-auto" />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-nexus-purple rounded-full p-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Custom Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Or Upload Custom Avatar</Label>
                <AvatarUploader
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  maxFileSize={5242880}
                  buttonClassName="w-full bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 transition-opacity"
                  disabled={couple.subscriptionPlan === "free" || updateAvatarMutation.isPending}
                />
                {couple.subscriptionPlan === "free" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Custom avatars require Premium subscription
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Partner 2 Avatar */}
            <TabsContent value="partner2" className="space-y-6">
              {/* Current Avatar Preview */}
              <div className="flex flex-col items-center gap-4">
                <Label className="text-sm font-medium">Current Avatar</Label>
                <AvatarDisplay 
                  avatarUrl={getCurrentAvatar("partner2")} 
                  size="xl" 
                  data-testid="avatar-preview-partner2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {getCurrentAvatar("partner2") ? "Your selected avatar" : "No avatar selected"}
                </p>
              </div>

              {/* Icon Gallery */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Choose an Icon</Label>
                <ScrollArea className="h-64 rounded-md border p-4">
                  <div className="grid grid-cols-6 gap-3">
                    {AVATAR_ICONS.map((icon) => {
                      const IconComponent = icon.icon;
                      const isSelected = getCurrentAvatar("partner2") === getIconAvatarUrl(icon.id);
                      
                      return (
                        <button
                          key={icon.id}
                          onClick={() => handleSelectIconAvatar(icon.id)}
                          disabled={updateAvatarMutation.isPending}
                          className={`
                            relative p-3 rounded-md border-2 transition-all hover-elevate active-elevate-2
                            ${isSelected ? "border-nexus-purple bg-nexus-purple/10" : "border-gray-200 dark:border-gray-700"}
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                          data-testid={`icon-avatar-${icon.id}`}
                          aria-label={icon.label}
                        >
                          <IconComponent className="w-6 h-6 mx-auto" />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-nexus-purple rounded-full p-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Custom Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Or Upload Custom Avatar</Label>
                <AvatarUploader
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  maxFileSize={5242880}
                  buttonClassName="w-full bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 transition-opacity"
                  disabled={couple.subscriptionPlan === "free" || updateAvatarMutation.isPending}
                />
                {couple.subscriptionPlan === "free" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Custom avatars require Premium subscription
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Couple Info Card */}
        <Card className="p-6 mb-6">
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

        {/* Logout Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account</h3>
          <Button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            variant="outline"
            className="w-full"
            data-testid="button-logout"
          >
            {logoutMutation.isPending ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </>
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}
