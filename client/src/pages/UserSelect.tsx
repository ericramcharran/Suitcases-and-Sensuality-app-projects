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
    id: 'fd98f1e3-5ae3-4ef8-9c47-963530b78b06',
    name: 'Sarah Bennett',
    role: 'Submissive',
    age: 25,
    city: 'Portland',
    state: 'OR'
  },
  {
    id: 'b4f14b16-41dc-46bd-adc2-914b228748cc',
    name: 'Victoria Monroe',
    role: 'Domme',
    age: 50,
    city: 'Miami',
    state: 'FL'
  },
  {
    id: '258e8b5a-161e-4f8a-84ac-a4bc29d3cd97',
    name: 'Alexander Stone',
    role: 'Dominant',
    age: 42,
    city: 'San Diego',
    state: 'CA'
  },
  {
    id: '1b37865d-22fd-46b5-ab61-3d10b54745d1',
    name: 'Marcus Chen',
    role: 'Submissive',
    age: 28,
    city: 'Seattle',
    state: 'WA'
  },
  {
    id: '779dbef8-09d4-47ea-b7ca-8a9eb600ccf0',
    name: 'Isabella Martinez',
    role: 'Dominant',
    age: 32,
    city: 'Miami',
    state: 'FL'
  },
  {
    id: '41ea0351-f316-4f09-95f0-6cd9fbed48e6',
    name: 'David Thompson',
    role: 'Submissive',
    age: 28,
    city: 'Seattle',
    state: 'WA'
  },
  {
    id: 'fe11972a-7c98-4718-9f8c-e843a00f97c0',
    name: 'Jasmine Williams',
    role: 'Switch',
    age: 30,
    city: 'Atlanta',
    state: 'GA'
  },
  {
    id: 'f11939a1-3dc2-464e-9d12-b322a68a34d8',
    name: 'Ryan O\'Connor',
    role: 'Dominant',
    age: 35,
    city: 'Boston',
    state: 'MA'
  },
  {
    id: '1e6c1d1c-9f26-4203-8161-e0a2ac560933',
    name: 'Sophie Chen',
    role: 'Submissive',
    age: 26,
    city: 'San Francisco',
    state: 'CA'
  },
  {
    id: 'fad4084f-20af-4e8e-bfcf-784c3da4f59d',
    name: 'Alex',
    role: 'Dominant',
    age: 34,
    city: 'New York',
    state: 'NY'
  }
];

export default function UserSelect() {
  const [, setLocation] = useLocation();

  const handleSelectUser = (userId: string, userName: string) => {
    console.log('Selecting user:', userName, 'with ID:', userId);
    localStorage.setItem('userId', userId);
    console.log('Stored userId:', localStorage.getItem('userId'));
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
