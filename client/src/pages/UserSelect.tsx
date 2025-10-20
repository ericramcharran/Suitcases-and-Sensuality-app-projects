import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TestUser {
  id: string;
  name: string;
  role: string;
  age: number;
  city: string;
  state: string;
}

const testUsers: TestUser[] = [
  {
    id: '38ad30cf-f254-4ebb-ab47-c2260e2a2faa',
    name: 'Marcus Sterling (MarcusS)',
    role: 'Dominant',
    age: 42,
    city: 'New York',
    state: 'NY'
  },
  {
    id: 'd939ab1d-b9dc-4d93-a699-a4192f9a4086',
    name: 'Sarah (Sarah_T)',
    role: 'Submissive',
    age: 28,
    city: 'Los Angeles',
    state: 'CA'
  }
];

export default function UserSelect() {
  const [, setLocation] = useLocation();

  const handleSelectUser = (userId: string, userName: string) => {
    localStorage.setItem('userId', userId);
    setLocation('/discover');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-foreground mb-2">Select Test User</h1>
          <p className="text-muted-foreground">Choose a user to access the Discover page</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testUsers.map((user) => (
            <Card key={user.id} className="p-4 hover-elevate">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-foreground" data-testid={`text-user-name-${user.id}`}>
                    {user.name}, {user.age}
                  </h3>
                  <p className="text-sm text-primary font-medium">{user.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.city}, {user.state}
                  </p>
                  <p className="text-xs text-muted-foreground/50 mt-1 font-mono">
                    ID: {user.id.slice(0, 8)}...
                  </p>
                </div>
                <Button
                  onClick={() => handleSelectUser(user.id, user.name)}
                  variant="default"
                  className="rounded-full"
                  data-testid={`button-select-${user.id}`}
                >
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => setLocation('/')}
            variant="ghost"
            className="rounded-full"
            data-testid="button-back"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
