import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Heart, Sparkles, Star, Flower2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { motion, useReducedMotion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Memoize particle configuration to prevent re-creation on each render
  const particles = useMemo(() => {
    const icons = [Heart, Flower2, Star, Sparkles];
    const colors = ['text-rose-400/80', 'text-pink-400/80', 'text-purple-400/80', 'text-blue-400/80'];
    
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      Icon: icons[i % 4],
      color: colors[i % 4],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.04,
      duration: 4 + Math.random() * 4,
      yOffset: Math.random() * 20 - 10,
    }));
  }, []);

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
      console.log('Attempting login with:', { email: username });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message || "Please check your username and password for correct spelling and try again."
        });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userRole', data.user.role);
      
      toast({
        description: `Welcome, ${data.user.profileName || data.user.name}!`
      });
      setLocation("/discover");
    } catch (error) {
      console.error('Login exception:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again."
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-background dark:via-background dark:to-background flex flex-col relative overflow-hidden">
      {/* Animated background particles */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, particle.yOffset, 0],
                opacity: [0.3, 0.9, 0.3],
                rotate: [0, 360],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            >
              <particle.Icon className={`w-8 h-8 ${particle.color}`} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <motion.div
          initial={!shouldReduceMotion ? { opacity: 0, y: -50 } : false}
          animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
          transition={!shouldReduceMotion ? { 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            delay: 0.1 
          } : {}}
          className="p-4 sm:p-6 text-center"
        >
          <div>
            <Logo />
          </div>
          <motion.p
            initial={!shouldReduceMotion ? { opacity: 0 } : false}
            animate={!shouldReduceMotion ? { opacity: 1 } : {}}
            transition={!shouldReduceMotion ? { delay: 0.3 } : {}}
            className="text-sm text-muted-foreground"
          >
            Welcome back
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={!shouldReduceMotion ? { 
              opacity: 0, 
              scale: 0.8, 
              y: 50 
            } : false}
            animate={!shouldReduceMotion ? { 
              opacity: 1, 
              scale: 1, 
              y: 0 
            } : {}}
            transition={!shouldReduceMotion ? {
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            } : {}}
            className="w-full"
          >
            <Card className="w-full p-6 sm:p-8 shadow-2xl border-2">
              <motion.h2
                initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : false}
                animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
                transition={!shouldReduceMotion ? { delay: 0.4 } : {}}
                className="text-xl sm:text-2xl font-light text-foreground mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
              >
                Sign In
              </motion.h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div
                  initial={!shouldReduceMotion ? { opacity: 0, x: -20 } : false}
                  animate={!shouldReduceMotion ? { opacity: 1, x: 0 } : {}}
                  transition={!shouldReduceMotion ? { delay: 0.5 } : {}}
                >
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
                </motion.div>

                <motion.div
                  initial={!shouldReduceMotion ? { opacity: 0, x: -20 } : false}
                  animate={!shouldReduceMotion ? { opacity: 1, x: 0 } : {}}
                  transition={!shouldReduceMotion ? { delay: 0.6 } : {}}
                >
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
                </motion.div>

                <motion.div
                  initial={!shouldReduceMotion ? { opacity: 0 } : false}
                  animate={!shouldReduceMotion ? { opacity: 1 } : {}}
                  transition={!shouldReduceMotion ? { delay: 0.7 } : {}}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      data-testid="checkbox-remember"
                      className="rounded border-border cursor-pointer"
                      style={{ width: '10px', height: '10px', minWidth: '10px', minHeight: '10px' }}
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
                </motion.div>

                <motion.div
                  initial={!shouldReduceMotion ? { opacity: 0, y: 20, scale: 0.95 } : false}
                  animate={!shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={!shouldReduceMotion ? { 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.8 
                  } : {}}
                >
                  <Button
                    type="submit"
                    data-testid="button-login"
                    disabled={isLoading}
                    className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    size="lg"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                initial={!shouldReduceMotion ? { opacity: 0 } : false}
                animate={!shouldReduceMotion ? { opacity: 1 } : {}}
                transition={!shouldReduceMotion ? { delay: 0.9 } : {}}
                className="mt-6 text-center"
              >
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
              </motion.div>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : false}
          animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
          transition={!shouldReduceMotion ? { delay: 1.0 } : {}}
          className="p-4 text-center"
        >
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
