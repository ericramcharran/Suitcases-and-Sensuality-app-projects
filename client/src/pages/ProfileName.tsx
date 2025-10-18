import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface UserData {
  id: string;
  profileName?: string;
}

export default function ProfileName() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const currentUserId = localStorage.getItem("userId");
  const [profileName, setProfileName] = useState("");

  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ['/api/users', currentUserId],
    enabled: !!currentUserId,
  });

  // Set initial value when user data loads
  useState(() => {
    if (user?.profileName) {
      setProfileName(user.profileName);
    }
  });

  const updateProfileNameMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest('PATCH', `/api/users/${currentUserId}`, {
        profileName: name,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId] });
      toast({
        title: "Profile name updated",
        description: "Your profile name has been saved successfully.",
      });
      setLocation("/profile");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile name. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!profileName.trim()) {
      toast({
        title: "Required",
        description: "Please enter a profile name.",
        variant: "destructive",
      });
      return;
    }

    if (profileName.length > 20) {
      toast({
        title: "Too long",
        description: "Profile name must be 20 characters or less.",
        variant: "destructive",
      });
      return;
    }

    updateProfileNameMutation.mutate(profileName);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const remainingChars = 20 - profileName.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/profile")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-light text-foreground">Profile Name</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Set Your Profile Name
              </CardTitle>
              <CardDescription>
                Choose a name that represents you. This is how other members will see you. Maximum 20 characters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileName">Profile Name</Label>
                <Input
                  id="profileName"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter your profile name"
                  maxLength={20}
                  data-testid="input-profile-name"
                />
                <p className="text-xs text-muted-foreground">
                  {remainingChars} character{remainingChars !== 1 ? 's' : ''} remaining
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm text-foreground">Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Choose something memorable and meaningful</li>
                  <li>Avoid using your full real name for privacy</li>
                  <li>Make it professional and respectful</li>
                  <li>You can change it anytime</li>
                </ul>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={updateProfileNameMutation.isPending || !profileName.trim()}
                className="w-full"
                data-testid="button-save"
              >
                {updateProfileNameMutation.isPending ? "Saving..." : "Save Profile Name"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
