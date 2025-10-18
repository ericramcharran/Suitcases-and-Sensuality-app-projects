import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Camera, 
  Bell, 
  MapPin, 
  Image, 
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { permissionsManager, type PermissionStatus } from "@/lib/permissions";
import { notificationManager } from "@/lib/notifications";

interface PermissionsState {
  camera: PermissionStatus;
  notifications: PermissionStatus;
  location: PermissionStatus;
  gallery: PermissionStatus;
}

export default function PermissionsSettings() {
  const [, setLocation] = useLocation();
  const [permissions, setPermissions] = useState<PermissionsState>({
    camera: { granted: false, denied: false, prompt: true },
    notifications: { granted: false, denied: false, prompt: true },
    location: { granted: false, denied: false, prompt: true },
    gallery: { granted: false, denied: false, prompt: true }
  });
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    const status = await permissionsManager.checkAllPermissions();
    setPermissions(status);
  };

  const requestCamera = async () => {
    setLoading('camera');
    setError(null);
    const granted = await permissionsManager.requestCameraPermission();
    await checkAllPermissions();
    setLoading(null);
    
    if (!granted) {
      setError('Camera access was denied. To enable it, go to your device settings → find this app → enable Camera permission.');
    }
  };

  const requestNotifications = async () => {
    setLoading('notifications');
    setError(null);
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      setLoading(null);
      setError('Please log in to enable notifications.');
      return;
    }

    await notificationManager.initialize(userId);
    const granted = await notificationManager.subscribeToPush(userId);
    
    await checkAllPermissions();
    setLoading(null);
    
    if (!granted) {
      const permission = Notification.permission;
      if (permission === 'denied') {
        setError('Notification access was denied. To enable it, go to your device settings → find this app → enable Notifications permission.');
      } else {
        setError('Failed to set up push notifications. Please try again.');
      }
    }
  };

  const requestLocation = async () => {
    setLoading('location');
    setError(null);
    const granted = await permissionsManager.requestLocationPermission();
    await checkAllPermissions();
    setLoading(null);
    
    if (!granted) {
      setError('Location access was denied. To enable it, go to your device settings → find this app → enable Location permission.');
    }
  };

  const getStatusIcon = (status: PermissionStatus) => {
    if (status.granted) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    } else if (status.denied) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: PermissionStatus) => {
    if (status.granted) {
      return <span className="text-sm text-green-500">Granted</span>;
    } else if (status.denied) {
      return <span className="text-sm text-red-500">Denied</span>;
    } else {
      return <span className="text-sm text-muted-foreground">Not requested</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/settings")}
            data-testid="button-back"
            className="hover-elevate active-elevate-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">App Permissions</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <p className="text-sm text-muted-foreground mb-6">
          The Executive Society needs access to certain device features to provide you with the best experience. You can manage these permissions below.
        </p>

        <Card className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">Camera Access</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Take photos for profile verification and ID uploads
                </p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(permissions.camera)}
                  {getStatusText(permissions.camera)}
                </div>
              </div>
            </div>
            {!permissions.camera.granted && (
              <Button
                onClick={requestCamera}
                disabled={loading === 'camera'}
                size="sm"
                data-testid="button-request-camera"
                className="hover-elevate active-elevate-2 shrink-0"
              >
                {loading === 'camera' ? 'Requesting...' : 'Enable'}
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                <Image className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">Photo Gallery</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Select photos from your gallery for profile pictures
                </p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(permissions.gallery)}
                  {getStatusText(permissions.gallery)}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">Location Access</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Find matches near you and show distance estimates
                </p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(permissions.location)}
                  {getStatusText(permissions.location)}
                </div>
              </div>
            </div>
            {!permissions.location.granted && (
              <Button
                onClick={requestLocation}
                disabled={loading === 'location'}
                size="sm"
                data-testid="button-request-location"
                className="hover-elevate active-elevate-2 shrink-0"
              >
                {loading === 'location' ? 'Requesting...' : 'Enable'}
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">Push Notifications</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Get notified about matches, messages, and important updates
                </p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(permissions.notifications)}
                  {getStatusText(permissions.notifications)}
                </div>
              </div>
            </div>
            {!permissions.notifications.granted && (
              <Button
                onClick={requestNotifications}
                disabled={loading === 'notifications'}
                size="sm"
                data-testid="button-request-notifications"
                className="hover-elevate active-elevate-2 shrink-0"
              >
                {loading === 'notifications' ? 'Requesting...' : 'Enable'}
              </Button>
            )}
          </div>
        </Card>

        {error && (
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-destructive">{error}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="shrink-0 h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-4 bg-muted/50">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Note:</strong> If you denied a permission, you'll need to enable it manually in your device settings.
              </p>
              <p>
                Some features may not work properly without the necessary permissions enabled.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
