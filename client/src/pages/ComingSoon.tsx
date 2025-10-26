import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, ArrowRight, Code2 } from "lucide-react";
import { Link } from "wouter";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Code2 className="w-8 h-8 text-purple-600" />
            <Badge variant="secondary" className="text-sm">Development Mode</Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent">
            Project Selector
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose which project you want to work on
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Executive Society */}
          <Card className="hover-elevate active-elevate-2 h-full border-2">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-purple-500 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline" className="bg-rose-50 dark:bg-rose-950">
                  BDSM Dating
                </Badge>
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">The Executive Society</CardTitle>
                <CardDescription className="text-base">
                  Premium BDSM dating platform for professionals seeking authentic power exchange relationships
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <span>Multi-step onboarding with verification</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <span>Personality & compatibility matching</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <span>Real-time messaging & discovery</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <span>Routes: /landing, /login, /signup, etc.</span>
                </div>
              </div>
              <Link href="/landing">
                <Button 
                  className="w-full group" 
                  variant="default"
                  data-testid="button-executive-society"
                >
                  Work on Executive Society
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Spark It! */}
          <Card className="hover-elevate active-elevate-2 h-full border-2">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-rose-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950">
                  Couples App
                </Badge>
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">Spark It!</CardTitle>
                <CardDescription className="text-base">
                  Couples activity app with instant suggestions, trivia challenges, and competitive scoreboard
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                  <span>Simultaneous button press mechanic</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                  <span>70 activities + trivia challenges</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                  <span>Freemium trial + Stripe subscriptions</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                  <span>Routes: /sparkit, /spark, /scoreboard</span>
                </div>
              </div>
              <Link href="/sparkit">
                <Button 
                  className="w-full group" 
                  variant="default"
                  data-testid="button-spark-it"
                >
                  Work on Spark It!
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Both projects share the same codebase but have separate routes and styling
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span>Executive Society = Rose accent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              <span>Spark It! = Purple/Red gradient</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
