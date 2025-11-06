import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Save, User, Sparkles, Crown, Upload, Check, LogOut, MapPin, Bell, BellOff } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVATAR_ICONS, getIconAvatarUrl, isIconAvatar, getIconIdFromUrl, type AvatarIcon } from "@/data/avatarIcons";
import { AvatarUploader } from "@/components/AvatarUploader";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { NotificationManager } from "@/lib/notifications";
import type { SparkitCouple } from "@shared/schema";

export default function SparkitSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [partner1Phone, setPartner1Phone] = useState("");
  const [partner2Phone, setPartner2Phone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<"partner1" | "partner2">("partner1");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [checkingNotifications, setCheckingNotifications] = useState(true);

  // Check authentication via session
  const { data: authData } = useQuery<{ coupleId: string; partnerRole: string } | null>({
    queryKey: ["/api/sparkit/auth/me"],
    retry: false,
  });

  const coupleId = authData?.coupleId ?? null;
  const partnerRole = authData?.partnerRole ?? null;

  const { data: couple, isLoading } = useQuery<SparkitCouple>({
    queryKey: ["/api/sparkit/couples", coupleId],
    enabled: !!coupleId,
  });

  // Initialize form values when couple data loads
  useEffect(() => {
    if (couple) {
      setPartner1Name(couple.partner1Name || "");
      setPartner2Name(couple.partner2Name || "");
      setPartner1Phone(couple.partner1Phone || "");
      setPartner2Phone(couple.partner2Phone || "");
      setCity(couple.city || "");
      setState(couple.state || "");
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

  const updatePhonesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/sparkit/couples/${coupleId}/phones`, {
        partner1Phone: partner1Phone.trim(),
        partner2Phone: partner2Phone.trim()
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update phone numbers");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sparkit/couples", coupleId] });
      toast({
        title: "Phone numbers updated!",
        description: "You can now send activities via SMS to your partner.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update phone numbers. Please try again.",
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/sparkit/couples/${coupleId}/location`, {
        city: city.trim(),
        state: state.trim()
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update location");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sparkit/couples", coupleId] });
      toast({
        title: "Location updated!",
        description: "Your location has been saved for AI activity suggestions.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update location. Please try again.",
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
      // Unsubscribe from push notifications before logging out
      // This prevents notifications from being sent to the wrong user on shared devices
      try {
        const notifManager = NotificationManager.getInstance();
        
        // Attempt to unsubscribe from push notifications
        // unsubscribeFromPush() is safe to call even if not initialized (lazy loads registration)
        const unsubscribed = await notifManager.unsubscribeFromPush();
        if (unsubscribed) {
          console.log('[Logout] Successfully unsubscribed from push notifications');
        } else {
          console.log('[Logout] No active push subscription to unsubscribe');
        }
        
        // Disconnect websocket connection (safe even if ws is null)
        notifManager.disconnect();
        console.log('[Logout] Disconnected websocket');
      } catch (error) {
        console.error('[Logout] Failed to cleanup push notifications:', error);
        // Continue with logout even if cleanup fails - user intent to logout is paramount
      }

      const res = await apiRequest("POST", "/api/sparkit/auth/logout", {});
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      // Clear ALL localStorage to prevent stale couple ID and partner role
      localStorage.removeItem("sparkitCoupleId");
      localStorage.removeItem("sparkitPartnerRole");
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

  // Check notification permission and subscription status on mount
  useEffect(() => {
    const checkNotificationStatus = async () => {
      if (!coupleId || !partnerRole) {
        setCheckingNotifications(false);
        return;
      }

      if ('Notification' in window) {
        const permission = Notification.permission;
        if (permission === 'granted') {
          try {
            const notifManager = NotificationManager.getInstance();
            const browserHasSubscription = await notifManager.isSubscribed();
            
            if (browserHasSubscription) {
              // Verify subscription is still valid on backend
              const userId = `sparkit-${coupleId}-${partnerRole}`;
              const verifyResponse = await fetch(`/api/push/verify/${userId}`);
              
              if (verifyResponse.ok) {
                const { valid } = await verifyResponse.json();
                if (valid) {
                  setNotificationsEnabled(true);
                } else {
                  // Backend says invalid - clear browser subscription
                  console.log('Subscription exists in browser but not on server, cleaning up...');
                  await notifManager.unsubscribeFromPush();
                  setNotificationsEnabled(false);
                }
              } else {
                // Can't verify, assume not enabled
                setNotificationsEnabled(false);
              }
            } else {
              setNotificationsEnabled(false);
            }
          } catch (error) {
            console.error('Error checking subscription status:', error);
            setNotificationsEnabled(false);
          }
        } else {
          setNotificationsEnabled(false);
        }
      }
      setCheckingNotifications(false);
    };
    
    checkNotificationStatus();
  }, [coupleId, partnerRole]);

  // Handle enabling push notifications
  const handleEnableNotifications = async () => {
    if (!coupleId || !partnerRole) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not enable notifications. Please try logging in again.",
      });
      return;
    }

    try {
      // Check current permission status
      if ('Notification' in window) {
        const currentPermission = Notification.permission;
        
        // If already denied, provide instructions
        if (currentPermission === 'denied') {
          toast({
            variant: "destructive",
            title: "Notifications blocked",
            description: "You previously blocked notifications. To enable them, click the lock icon in your browser's address bar and allow notifications, then try again.",
          });
          return;
        }
      }

      const notifManager = NotificationManager.getInstance();
      const userId = `sparkit-${coupleId}-${partnerRole}`;
      
      // Initialize and subscribe
      await notifManager.initialize(userId);
      const success = await notifManager.subscribeToPush(userId);
      
      if (success) {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications enabled!",
          description: "You'll now receive alerts when your partner wants to spark!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Notifications not enabled",
          description: "Please click 'Allow' when your browser asks for notification permission.",
        });
      }
    } catch (error) {
      console.error('Enable notifications error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not enable notifications. Please try again.",
      });
    }
  };

  // Handle disabling push notifications
  const handleDisableNotifications = async () => {
    try {
      const notifManager = NotificationManager.getInstance();
      const success = await notifManager.unsubscribeFromPush();
      
      if (success) {
        // Optionally disconnect websocket
        notifManager.disconnect();
        setNotificationsEnabled(false);
        toast({
          title: "Notifications disabled",
          description: "You won't receive push notifications anymore.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not disable notifications. Please try again.",
        });
      }
    } catch (error) {
      console.error('Disable notifications error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not disable notifications. Please try again.",
      });
    }
  };

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

  const handleSavePhones = () => {
    updatePhonesMutation.mutate();
  };

  const handleSaveLocation = () => {
    if (!city.trim() || !state.trim()) {
      toast({
        variant: "destructive",
        title: "Location required",
        description: "Please enter both city and state.",
      });
      return;
    }

    updateLocationMutation.mutate();
  };

  const handleSelectIconAvatar = (iconId: string) => {
    // Check if couple data is loaded first
    if (!couple || isLoading) {
      toast({
        variant: "destructive",
        title: "Loading",
        description: "Please wait for your account data to load...",
      });
      return;
    }

    // Check if user has premium access (monthly or yearly subscription only)
    const hasPremiumAccess = couple.subscriptionPlan === 'monthly' || couple.subscriptionPlan === 'yearly';
    
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
    // Check if couple data is loaded first
    if (!couple || isLoading) {
      toast({
        variant: "destructive",
        title: "Loading",
        description: "Please wait for your account data to load...",
      });
      throw new Error("Data still loading");
    }

    // Check if user has premium access (monthly or yearly subscription only)
    const hasPremiumAccess = couple.subscriptionPlan === 'monthly' || couple.subscriptionPlan === 'yearly';
    
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
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation("/spark")}
            data-testid="button-back"
            className="mb-4 border-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
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

        {/* Phone Numbers Card for SMS */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-nexus-purple" />
            <h2 className="text-xl font-semibold">Phone Numbers</h2>
          </div>

          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add phone numbers to send activity ideas to each other via text message
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partner1Phone" className="text-sm font-medium">
                  Partner 1 Phone
                </Label>
                <Input
                  id="partner1Phone"
                  type="tel"
                  value={partner1Phone}
                  onChange={(e) => setPartner1Phone(e.target.value)}
                  placeholder="+1234567890"
                  data-testid="input-partner1-phone"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Include country code (e.g., +1 for US)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner2Phone" className="text-sm font-medium">
                  Partner 2 Phone
                </Label>
                <Input
                  id="partner2Phone"
                  type="tel"
                  value={partner2Phone}
                  onChange={(e) => setPartner2Phone(e.target.value)}
                  placeholder="+1234567890"
                  data-testid="input-partner2-phone"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Include country code (e.g., +1 for US)
                </p>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSavePhones}
              disabled={updatePhonesMutation.isPending}
              className="w-full bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 transition-opacity"
              data-testid="button-save-phones"
            >
              {updatePhonesMutation.isPending ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Phone Numbers
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Push Notifications Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-nexus-purple" />
            <h2 className="text-xl font-semibold">Push Notifications</h2>
          </div>

          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get instant notifications when your partner presses the Spark It! button
            </p>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5 text-green-500" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">
                    {notificationsEnabled ? "Notifications Enabled" : "Notifications Disabled"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {notificationsEnabled 
                      ? "You'll receive alerts when your partner wants to spark"
                      : "Enable to receive instant alerts"}
                  </p>
                </div>
              </div>
              
              {!checkingNotifications && (
                <Button
                  onClick={notificationsEnabled ? handleDisableNotifications : handleEnableNotifications}
                  variant={notificationsEnabled ? "outline" : "default"}
                  className={notificationsEnabled ? "" : "bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 transition-opacity"}
                  data-testid={notificationsEnabled ? "button-disable-notifications" : "button-enable-notifications"}
                >
                  {notificationsEnabled ? "Disable" : "Enable"}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Location Card for AI Activities */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-nexus-purple" />
            <h2 className="text-xl font-semibold">Location</h2>
          </div>

          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set your location to get AI-powered local activity suggestions
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  data-testid="input-city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="CA"
                  maxLength={20}
                  data-testid="input-state"
                />
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveLocation}
              disabled={updateLocationMutation.isPending}
              className="w-full bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 transition-opacity"
              data-testid="button-save-location"
            >
              {updateLocationMutation.isPending ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Location
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Subscription Status Card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Subscription</h2>
          </div>

          <div className="space-y-4">
            {/* Current Plan */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
                <p className="text-lg font-bold">
                  {couple.subscriptionPlan === 'monthly' && 'Premium Monthly'}
                  {couple.subscriptionPlan === 'yearly' && 'Premium Yearly'}
                  {couple.subscriptionPlan === 'trial' && 'Trial'}
                  {couple.subscriptionPlan === 'free' && 'Free'}
                </p>
              </div>
              {(couple.subscriptionPlan === 'monthly' || couple.subscriptionPlan === 'yearly') && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold" data-testid="badge-premium-active">
                  <Crown className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>

            {/* Sparks Remaining */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sparks Remaining</p>
              <p className="text-lg font-semibold text-nexus-purple">
                {couple.subscriptionPlan === 'monthly' || couple.subscriptionPlan === 'yearly'
                  ? '∞ Unlimited'
                  : `${couple.sparksRemaining || 0} sparks`}
              </p>
            </div>

            {/* Upgrade/Manage Button */}
            {couple.subscriptionPlan === 'free' || couple.subscriptionPlan === 'trial' ? (
              <Button
                onClick={() => setLocation("/sparkit/premium")}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
                data-testid="button-upgrade-to-premium"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thank you for being a Premium member! 🎉
                </p>
                <Button
                  onClick={() => setLocation("/sparkit/premium")}
                  variant="outline"
                  className="w-full"
                  data-testid="button-manage-subscription"
                >
                  View Premium Features
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Avatar Selection Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-nexus-purple" />
              <h2 className="text-xl font-semibold">Avatars</h2>
            </div>
            {(couple.subscriptionPlan === "free" || couple.subscriptionPlan === "trial") && (
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
                <ScrollArea className="h-80 rounded-md border p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {AVATAR_ICONS.map((icon) => {
                      const isSelected = getCurrentAvatar("partner1") === getIconAvatarUrl(icon.id);
                      
                      return (
                        <button
                          key={icon.id}
                          onClick={() => handleSelectIconAvatar(icon.id)}
                          disabled={updateAvatarMutation.isPending}
                          className={`
                            relative p-4 rounded-md border-2 transition-all hover-elevate active-elevate-2
                            ${isSelected ? "border-nexus-purple bg-nexus-purple/10" : "border-gray-200 dark:border-gray-700"}
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                          data-testid={`icon-avatar-${icon.id}`}
                          aria-label={icon.label}
                        >
                          {icon.imagePath ? (
                            <img 
                              src={icon.imagePath} 
                              alt={icon.label} 
                              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto object-contain rounded-md"
                            />
                          ) : icon.icon && (
                            <icon.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto" />
                          )}
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload a square image (JPG, PNG, GIF, or WebP) under 5MB. Most phone photos work great!
                </p>
                <AvatarUploader
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  maxFileSize={5242880}
                  buttonClassName="w-full bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 transition-opacity"
                  disabled={(couple.subscriptionPlan !== 'monthly' && couple.subscriptionPlan !== 'yearly') || updateAvatarMutation.isPending}
                />
                {(couple.subscriptionPlan === "free" || couple.subscriptionPlan === "trial") && (
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
                <ScrollArea className="h-80 rounded-md border p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {AVATAR_ICONS.map((icon) => {
                      const isSelected = getCurrentAvatar("partner2") === getIconAvatarUrl(icon.id);
                      
                      return (
                        <button
                          key={icon.id}
                          onClick={() => handleSelectIconAvatar(icon.id)}
                          disabled={updateAvatarMutation.isPending}
                          className={`
                            relative p-4 rounded-md border-2 transition-all hover-elevate active-elevate-2
                            ${isSelected ? "border-nexus-purple bg-nexus-purple/10" : "border-gray-200 dark:border-gray-700"}
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                          data-testid={`icon-avatar-${icon.id}`}
                          aria-label={icon.label}
                        >
                          {icon.imagePath ? (
                            <img 
                              src={icon.imagePath} 
                              alt={icon.label} 
                              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto object-contain rounded-md"
                            />
                          ) : icon.icon && (
                            <icon.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto" />
                          )}
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload a square image (JPG, PNG, GIF, or WebP) under 5MB. Most phone photos work great!
                </p>
                <AvatarUploader
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  maxFileSize={5242880}
                  buttonClassName="w-full bg-gradient-to-r from-nexus-purple to-nexus-red hover:opacity-90 transition-opacity"
                  disabled={(couple.subscriptionPlan !== 'monthly' && couple.subscriptionPlan !== 'yearly') || updateAvatarMutation.isPending}
                />
                {(couple.subscriptionPlan === "free" || couple.subscriptionPlan === "trial") && (
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
              <span className="text-gray-600 dark:text-gray-400">Logged in as:</span>
              <span className="font-medium">{partnerRole === 'partner1' ? couple.partner1Email : couple.partner2Email}</span>
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
            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">Session Debug Info:</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Couple ID:</span>
                <span className="font-mono">{couple.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-600 dark:text-gray-400">localStorage ID:</span>
                <span className="font-mono">
                  {(() => {
                    try {
                      const storedId = typeof window !== 'undefined' ? window.localStorage.getItem("sparkitCoupleId") : null;
                      return storedId ? `${storedId.slice(0, 8)}...` : 'none';
                    } catch {
                      return 'unavailable';
                    }
                  })()}
                </span>
              </div>
            </div>
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
