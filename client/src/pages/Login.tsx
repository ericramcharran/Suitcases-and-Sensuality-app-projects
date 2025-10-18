import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter both username and password"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message || "Invalid credentials"
        });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      sessionStorage.setItem('userId', data.user.id);
      sessionStorage.setItem('userName', data.user.name);
      
      toast({
        title: "Welcome Back, " + data.user.name,
        description: "Login successful!"
      });
      setLocation("/discover");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset link will be sent to your email"
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-4 sm:p-6 text-center">
          <div>
            <Logo />
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back
          </p>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-light text-foreground mb-6 text-center">
              Sign In
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm text-muted-foreground">
                  Username or Email
                </Label>
                <Input
                  id="username"
                  data-testid="input-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  className="rounded-xl mt-1"
                  autoComplete="username"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm text-muted-foreground">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    data-testid="input-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="rounded-xl pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    data-testid="button-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    data-testid="checkbox-remember"
                    className="w-3.5 h-3.5 rounded border-border cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  data-testid="button-forgot-password"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                data-testid="button-login"
                disabled={isLoading}
                className="w-full rounded-xl"
                size="lg"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  data-testid="button-signup"
                  onClick={() => setLocation("/age-verification")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
