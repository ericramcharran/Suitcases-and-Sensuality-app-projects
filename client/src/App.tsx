import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "@/pages/Landing";
import AgeVerification from "@/pages/AgeVerification";
import Terms from "@/pages/Terms";
import Consent from "@/pages/Consent";
import Privacy from "@/pages/Privacy";
import Guidelines from "@/pages/Guidelines";
import Signup from "@/pages/Signup";
import PersonalityTest from "@/pages/PersonalityTest";
import PersonalityResult from "@/pages/PersonalityResult";
import RelationshipTest from "@/pages/RelationshipTest";
import RelationshipResult from "@/pages/RelationshipResult";
import Subscription from "@/pages/Subscription";
import Escrow from "@/pages/Escrow";
import Discover from "@/pages/Discover";
import Learn from "@/pages/Learn";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import MatchResult from "@/pages/MatchResult";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/age-verification" component={AgeVerification} />
            <Route path="/terms" component={Terms} />
            <Route path="/consent" component={Consent} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/guidelines" component={Guidelines} />
            <Route path="/signup" component={Signup} />
            <Route path="/personality-test" component={PersonalityTest} />
            <Route path="/personality-result" component={PersonalityResult} />
            <Route path="/relationship-test" component={RelationshipTest} />
            <Route path="/relationship-result" component={RelationshipResult} />
            <Route path="/subscription" component={Subscription} />
            <Route path="/escrow" component={Escrow} />
            <Route path="/discover" component={Discover} />
            <Route path="/learn" component={Learn} />
            <Route path="/messages" component={Messages} />
            <Route path="/profile" component={Profile} />
            <Route path="/settings" component={Settings} />
            <Route path="/match-result" component={MatchResult} />
            <Route>
              <Landing />
            </Route>
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
