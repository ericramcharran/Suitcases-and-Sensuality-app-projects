import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

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

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <button
        onClick={() => setLocation("/profile")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-2 rounded-md"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light mb-2 text-foreground">User Data</h1>
        <p className="text-muted-foreground mb-6">Internal data view - Actual names linked to profile names</p>

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
