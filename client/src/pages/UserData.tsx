import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  name: string;
  profileName?: string;
  role: string;
  email?: string;
  age?: number;
  city?: string;
  state?: string;
}

export default function UserData() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const userEmail = localStorage.getItem('userEmail');

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const exportToDriveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/users/export-to-drive', { email: userEmail });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `User data exported to Google Drive: ${data.fileName}`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: error.message || "Failed to export to Google Drive. Make sure you have admin access.",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <button
        onClick={() => setLocation("/profile")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-3 py-2 rounded-md border-2 border-border"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-light mb-2 text-foreground">User Data</h1>
            <p className="text-muted-foreground">Internal data view - Actual names linked to profile names</p>
          </div>
          <Button
            onClick={() => exportToDriveMutation.mutate()}
            disabled={exportToDriveMutation.isPending}
            data-testid="button-export-drive"
          >
            <Upload className="w-4 h-4 mr-2" />
            {exportToDriveMutation.isPending ? 'Exporting...' : 'Export to Drive'}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading user data...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Profile Name (Public)</p>
                    <p className="font-medium text-foreground">
                      {user.profileName || <span className="text-muted-foreground italic">Not set</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Actual Name (Private)</p>
                    <p className="font-medium text-foreground">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <p className="text-sm text-foreground">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm text-foreground">{user.email || <span className="italic">Not set</span>}</p>
                  </div>
                  {user.age && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Age</p>
                      <p className="text-sm text-foreground">{user.age}</p>
                    </div>
                  )}
                  {(user.city || user.state) && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm text-foreground">
                        {user.city && user.state ? `${user.city}, ${user.state}` : user.city || user.state}
                      </p>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">User ID</p>
                    <p className="text-xs font-mono text-foreground break-all">{user.id}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
