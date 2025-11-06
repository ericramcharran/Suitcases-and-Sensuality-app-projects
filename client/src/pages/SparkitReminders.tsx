import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bell, Clock, Mail, MessageSquare, Smartphone, Sparkles, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReminderPreferences {
  id: string;
  coupleId: string;
  enabled: boolean;
  reminderTime: string;
  notificationMethod: 'sms' | 'email' | 'push' | 'all';
  createdAt: string;
  updatedAt: string;
}

interface DailyContentPreview {
  question: string | null;
  activity: string | null;
  conversationStarter: string | null;
}

export default function SparkitReminders() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch current preferences
  const { data: preferences, isLoading: prefsLoading } = useQuery<ReminderPreferences>({
    queryKey: ['/api/sparkit/reminders/preferences']
  });

  // Fetch preview content
  const { data: preview, isLoading: previewLoading } = useQuery<DailyContentPreview>({
    queryKey: ['/api/sparkit/reminders/preview']
  });

  // Local state for form
  const [enabled, setEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [notificationMethod, setNotificationMethod] = useState<'sms' | 'email' | 'push' | 'all'>('sms');

  // Update local state when preferences load
  useEffect(() => {
    if (preferences) {
      setEnabled(preferences.enabled);
      setReminderTime(preferences.reminderTime);
      setNotificationMethod(preferences.notificationMethod);
      setHasChanges(false); // Reset changes flag when loading saved preferences
    }
  }, [preferences]);

  // Save preferences mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { enabled: boolean; reminderTime: string; notificationMethod: string }) => {
      return await apiRequest('PUT', '/api/sparkit/reminders/preferences', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sparkit/reminders/preferences'] });
      setHasChanges(false);
      toast({
        title: "Settings saved",
        description: "Your daily reminder preferences have been updated."
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your preferences. Please try again."
      });
    }
  });

  const handleSave = () => {
    saveMutation.mutate({
      enabled,
      reminderTime,
      notificationMethod
    });
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  const getNotificationIcon = (method: string) => {
    switch (method) {
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'push': return <Smartphone className="h-4 w-4" />;
      case 'all': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (prefsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-muted-foreground">Loading...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
      <div className="max-w-2xl mx-auto pt-8 space-y-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                <CardTitle>Daily Reminders</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLocation("/sparkit/settings")}
                  data-testid="button-settings"
                  className="border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] backdrop-blur-sm bg-white/5"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLocation("/spark")}
                  data-testid="button-back"
                  className="border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] backdrop-blur-sm bg-white/5"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Stay connected with daily questions, activities, and conversation starters delivered right to you
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reminder Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enabled" className="text-base">Enable Daily Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily content to keep your relationship fresh
                </p>
              </div>
              <Switch
                id="enabled"
                data-testid="switch-reminders-enabled"
                checked={enabled}
                onCheckedChange={(checked) => {
                  setEnabled(checked);
                  handleChange();
                }}
              />
            </div>

            <Separator />

            {/* Reminder Time */}
            <div className="space-y-2">
              <Label htmlFor="reminderTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Reminder Time
              </Label>
              <Input
                id="reminderTime"
                data-testid="input-reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => {
                  setReminderTime(e.target.value);
                  handleChange();
                }}
                disabled={!enabled}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Choose what time you'd like to receive your daily reminder
              </p>
            </div>

            <Separator />

            {/* Notification Method */}
            <div className="space-y-2">
              <Label htmlFor="notificationMethod" className="flex items-center gap-2">
                {getNotificationIcon(notificationMethod)}
                Notification Method
              </Label>
              <Select
                value={notificationMethod}
                onValueChange={(value: 'sms' | 'email' | 'push' | 'all') => {
                  setNotificationMethod(value);
                  handleChange();
                }}
                disabled={!enabled}
              >
                <SelectTrigger id="notificationMethod" data-testid="select-notification-method" className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="push" data-testid="option-push">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Push Notification</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sms" data-testid="option-sms">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>SMS Text Message</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="email" data-testid="option-email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="all" data-testid="option-all">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>All Methods</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How would you like to receive your daily reminders?
              </p>
            </div>

            <Separator />

            {/* Save Button */}
            <Button
              data-testid="button-save-preferences"
              onClick={handleSave}
              disabled={!hasChanges || saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        {!previewLoading && preview && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Today's Preview</CardTitle>
              </div>
              <CardDescription>
                Here's a sample of the kind of content you'll receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {preview.question && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Daily Question</p>
                  <p className="text-base" data-testid="text-preview-question">{preview.question}</p>
                </div>
              )}
              
              {preview.activity && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Activity Idea</p>
                  <p className="text-base" data-testid="text-preview-activity">{preview.activity}</p>
                </div>
              )}
              
              {preview.conversationStarter && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Conversation Starter</p>
                  <p className="text-base" data-testid="text-preview-conversation">{preview.conversationStarter}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
