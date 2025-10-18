import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import AgeVerification from "@/pages/AgeVerification";
import Terms from "@/pages/Terms";
import Consent from "@/pages/Consent";
import Privacy from "@/pages/Privacy";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TravelMode from "@/pages/TravelMode";
import VerificationProcessing from "@/pages/VerificationProcessing";
import BackgroundCheck from "@/pages/BackgroundCheck";
import BackgroundCheckProcessing from "@/pages/BackgroundCheckProcessing";
import Guidelines from "@/pages/Guidelines";
import Signup from "@/pages/Signup";
import ProfileDetails from "@/pages/ProfileDetails";
import PersonalityTest from "@/pages/PersonalityTest";
import PersonalityResult from "@/pages/PersonalityResult";
import RelationshipTest from "@/pages/RelationshipTest";
import RelationshipResult from "@/pages/RelationshipResult";
import Subscription from "@/pages/Subscription";
import SubscriptionRoleSelect from "@/pages/SubscriptionRoleSelect";
import SubscriptionDom from "@/pages/SubscriptionDom";
import SubscriptionSub from "@/pages/SubscriptionSub";
import Subscribe from "@/pages/Subscribe";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import Escrow from "@/pages/Escrow";
import AgreementTimeline from "@/pages/AgreementTimeline";
import Discover from "@/pages/Discover";
import Learn from "@/pages/Learn";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import ImportantTraits from "@/pages/ImportantTraits";
import Settings from "@/pages/Settings";
import LegalDocuments from "@/pages/LegalDocuments";
import MatchResult from "@/pages/MatchResult";
import AboutApp from "@/pages/AboutApp";
import TestRelationshipResult from "@/pages/TestRelationshipResult";

function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <AnimatePresence mode="wait">
            <Switch location={location} key={location}>
              <Route path="/">
                <PageTransition><Landing /></PageTransition>
              </Route>
              <Route path="/login">
                <PageTransition><Login /></PageTransition>
              </Route>
              <Route path="/age-verification">
                <PageTransition><AgeVerification /></PageTransition>
              </Route>
              <Route path="/verification-processing">
                <PageTransition><VerificationProcessing /></PageTransition>
              </Route>
              <Route path="/terms">
                <PageTransition><Terms /></PageTransition>
              </Route>
              <Route path="/consent">
                <PageTransition><Consent /></PageTransition>
              </Route>
              <Route path="/privacy">
                <PageTransition><Privacy /></PageTransition>
              </Route>
              <Route path="/privacy-policy">
                <PageTransition><PrivacyPolicy /></PageTransition>
              </Route>
              <Route path="/travel-mode">
                <PageTransition><TravelMode /></PageTransition>
              </Route>
              <Route path="/background-check">
                <PageTransition><BackgroundCheck /></PageTransition>
              </Route>
              <Route path="/background-check-processing">
                <PageTransition><BackgroundCheckProcessing /></PageTransition>
              </Route>
              <Route path="/guidelines">
                <PageTransition><Guidelines /></PageTransition>
              </Route>
              <Route path="/signup">
                <PageTransition><Signup /></PageTransition>
              </Route>
              <Route path="/profile-details">
                <PageTransition><ProfileDetails /></PageTransition>
              </Route>
              <Route path="/personality-test">
                <PageTransition><PersonalityTest /></PageTransition>
              </Route>
              <Route path="/personality-result">
                <PageTransition><PersonalityResult /></PageTransition>
              </Route>
              <Route path="/relationship-test">
                <PageTransition><RelationshipTest /></PageTransition>
              </Route>
              <Route path="/relationship-result">
                <PageTransition><RelationshipResult /></PageTransition>
              </Route>
              <Route path="/subscription">
                <PageTransition><SubscriptionRoleSelect /></PageTransition>
              </Route>
              <Route path="/subscription-dom">
                <PageTransition><SubscriptionDom /></PageTransition>
              </Route>
              <Route path="/subscription-sub">
                <PageTransition><SubscriptionSub /></PageTransition>
              </Route>
              <Route path="/subscribe">
                <PageTransition><Subscribe /></PageTransition>
              </Route>
              <Route path="/subscription-success">
                <PageTransition><SubscriptionSuccess /></PageTransition>
              </Route>
              <Route path="/escrow">
                <PageTransition><Escrow /></PageTransition>
              </Route>
              <Route path="/agreement-timeline">
                <PageTransition><AgreementTimeline /></PageTransition>
              </Route>
              <Route path="/discover">
                <PageTransition><Discover /></PageTransition>
              </Route>
              <Route path="/learn">
                <PageTransition><Learn /></PageTransition>
              </Route>
              <Route path="/messages">
                <PageTransition><Messages /></PageTransition>
              </Route>
              <Route path="/profile">
                <PageTransition><Profile /></PageTransition>
              </Route>
              <Route path="/important-traits">
                <PageTransition><ImportantTraits /></PageTransition>
              </Route>
              <Route path="/settings">
                <PageTransition><Settings /></PageTransition>
              </Route>
              <Route path="/legal-documents">
                <PageTransition><LegalDocuments /></PageTransition>
              </Route>
              <Route path="/match-result">
                <PageTransition><MatchResult /></PageTransition>
              </Route>
              <Route path="/about">
                <PageTransition><AboutApp /></PageTransition>
              </Route>
              <Route path="/test-relationship">
                <PageTransition><TestRelationshipResult /></PageTransition>
              </Route>
              <Route>
                <PageTransition><Landing /></PageTransition>
              </Route>
            </Switch>
          </AnimatePresence>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
