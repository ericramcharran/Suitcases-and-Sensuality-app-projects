import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import "../nexus-styles.css";

export default function AdminAnnounce() {
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("New Feature Available!");
  const [body, setBody] = useState("Daily reminders are now live! Set up your daily reminder in Settings to stay connected with your partner.");
  const [url, setUrl] = useState("/sparkit/reminders");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  
  // Version check to ensure fresh code
  const VERSION = "v1.1";

  const handleSend = async () => {
    console.log(`[AdminAnnounce ${VERSION}] Sending announcement...`);
    if (!email || !title || !body) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      console.log(`[AdminAnnounce ${VERSION}] Making request to /api/admin/sparkit/announce`);
      const response = await fetch("/api/admin/sparkit/announce", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${email}`
        },
        body: JSON.stringify({ title, body, url })
      });

      const data = await response.json();
      console.log(`[AdminAnnounce ${VERSION}] Response:`, data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to send announcement");
      }

      toast({
        title: "Announcement Sent",
        description: `Successfully sent to ${data.sent} subscriptions across ${data.totalCouples} couples. ${data.failed} failed.`
      });

      // Clear form
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen nexus-bg p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="nexus-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 nexus-gradient-text" />
                <CardTitle className="nexus-gradient-text">Spark It! Admin</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">{VERSION}</span>
            </div>
            <CardDescription>
              Send push notifications to all Spark It! users who have enabled notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Token (Required)</Label>
              <Input
                id="email"
                type="password"
                placeholder="Enter admin token from ADMIN_EMAIL secret"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-admin-token"
              />
              <p className="text-xs text-muted-foreground">
                Use the value from your ADMIN_EMAIL environment variable
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="input-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                placeholder="Enter notification message"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                data-testid="input-body"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Destination URL (Optional)</Label>
              <Input
                id="url"
                placeholder="/sparkit/reminders"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                data-testid="input-url"
              />
            </div>

            <Button 
              onClick={handleSend} 
              disabled={sending}
              className="w-full nexus-button"
              data-testid="button-send"
            >
              {sending ? "Sending..." : "Send Announcement"}
            </Button>

            <div className="rounded-md bg-muted p-4 space-y-2 text-sm">
              <p className="font-medium">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Only users who have enabled push notifications will receive this</li>
                <li>Invalid subscriptions are automatically cleaned up</li>
                <li>The notification will appear on their device</li>
                <li>Clicking the notification takes them to the specified URL</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
