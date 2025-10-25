import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";

import Splash from "@/pages/Splash";
import SplashScreen from "@/pages/SplashScreen";
import Landing from "@/pages/Landing";
import NexusLanding from "@/pages/NexusLanding";
import SparkButton from "@/pages/SparkButton";
import SparkActivity from "@/pages/SparkActivity";
import Scoreboard from "@/pages/Scoreboard";
import SparkitCoupleSignup from "@/pages/SparkitCoupleSignup";
import SparkitJoinCouple from "@/pages/SparkitJoinCouple";
import SparkitPricing from "@/pages/SparkitPricing";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Features from "@/pages/Features";
import HowItWorks from "@/pages/HowItWorks";
import Pricing from "@/pages/Pricing";
import FAQ from "@/pages/FAQ";
import LogoCrop from "@/pages/LogoCrop";
import LogoCropLive from "@/pages/LogoCropLive";
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
import PaymentDemo from "@/pages/PaymentDemo";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import Escrow from "@/pages/Escrow";
import AgreementTimeline from "@/pages/AgreementTimeline";
import Discover from "@/pages/Discover";
import Learn from "@/pages/Learn";
import Messages from "@/pages/Messages";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import ProfileName from "@/pages/ProfileName";
import ImportantTraits from "@/pages/ImportantTraits";
import Settings from "@/pages/Settings";
import LegalDocuments from "@/pages/LegalDocuments";
import MatchResult from "@/pages/MatchResult";
import AboutApp from "@/pages/AboutApp";
import TestRelationshipResult from "@/pages/TestRelationshipResult";
import UserSelect from "@/pages/UserSelect";
import HelpSupport from "@/pages/HelpSupport";
import HelpGettingStarted from "@/pages/HelpGettingStarted";
import HelpSafety from "@/pages/HelpSafety";
import HelpMatching from "@/pages/HelpMatching";
import HelpBilling from "@/pages/HelpBilling";
import PermissionsSettings from "@/pages/PermissionsSettings";
import SubscriptionManagement from "@/pages/SubscriptionManagement";
import UserData from "@/pages/UserData";
import Download from "@/pages/Download";
import SwitchesPage from "@/pages/SwitchesPage";
import TermsProcessing from "@/pages/TermsProcessing";
import ConsentProcessing from "@/pages/ConsentProcessing";
import PrivacyProcessing from "@/pages/PrivacyProcessing";
import GuidelinesProcessing from "@/pages/GuidelinesProcessing";
import ProfileDetailsProcessing from "@/pages/ProfileDetailsProcessing";
import PersonalityTestProcessing from "@/pages/PersonalityTestProcessing";
import RelationshipTestProcessing from "@/pages/RelationshipTestProcessing";
import ImportantTraitsProcessing from "@/pages/ImportantTraitsProcessing";
import BDSMTestUpload from "@/pages/BDSMTestUpload";
import BDSMTestInput from "@/pages/BDSMTestInput";
import BDSMTestProcessing from "@/pages/BDSMTestProcessing";
import EmailVerification from "@/pages/EmailVerification";
import PhoneVerification from "@/pages/PhoneVerification";
import Resources from "@/pages/Resources";

function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <div className="min-h-screen">
            <ScrollToTop />
            <AnimatePresence mode="wait">
              <Switch location={location} key={location}>
              <Route path="/">
                <PageTransition><SplashScreen /></PageTransition>
              </Route>
              <Route path="/home">
                <PageTransition><Home /></PageTransition>
              </Route>
              <Route path="/splash-screen">
                <PageTransition><SplashScreen /></PageTransition>
              </Route>
              <Route path="/about">
                <PageTransition><About /></PageTransition>
              </Route>
              <Route path="/features">
                <PageTransition><Features /></PageTransition>
              </Route>
              <Route path="/how-it-works">
                <PageTransition><HowItWorks /></PageTransition>
              </Route>
              <Route path="/pricing">
                <PageTransition><Pricing /></PageTransition>
              </Route>
              <Route path="/faq">
                <PageTransition><FAQ /></PageTransition>
              </Route>
              <Route path="/landing">
                <PageTransition><Landing /></PageTransition>
              </Route>
              <Route path="/splash">
                <PageTransition><Splash /></PageTransition>
              </Route>
              <Route path="/sparkit">
                <PageTransition><NexusLanding /></PageTransition>
              </Route>
              <Route path="/sparkit/signup">
                <PageTransition><SparkitCoupleSignup /></PageTransition>
              </Route>
              <Route path="/sparkit/join">
                <PageTransition><SparkitJoinCouple /></PageTransition>
              </Route>
              <Route path="/sparkit/pricing">
                <PageTransition><SparkitPricing /></PageTransition>
              </Route>
              <Route path="/spark">
                <PageTransition><SparkButton /></PageTransition>
              </Route>
              <Route path="/spark-activity">
                <PageTransition><SparkActivity /></PageTransition>
              </Route>
              <Route path="/scoreboard">
                <PageTransition><Scoreboard /></PageTransition>
              </Route>
              <Route path="/logo-crop">
                <PageTransition><LogoCrop /></PageTransition>
              </Route>
              <Route path="/logo-crop-live">
                <PageTransition><LogoCropLive /></PageTransition>
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
              <Route path="/terms-processing">
                <PageTransition><TermsProcessing /></PageTransition>
              </Route>
              <Route path="/consent">
                <PageTransition><Consent /></PageTransition>
              </Route>
              <Route path="/consent-processing">
                <PageTransition><ConsentProcessing /></PageTransition>
              </Route>
              <Route path="/privacy">
                <PageTransition><Privacy /></PageTransition>
              </Route>
              <Route path="/privacy-processing">
                <PageTransition><PrivacyProcessing /></PageTransition>
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
              <Route path="/guidelines-processing">
                <PageTransition><GuidelinesProcessing /></PageTransition>
              </Route>
              <Route path="/signup">
                <PageTransition><Signup /></PageTransition>
              </Route>
              <Route path="/email-verification">
                <PageTransition><EmailVerification /></PageTransition>
              </Route>
              <Route path="/phone-verification">
                <PageTransition><PhoneVerification /></PageTransition>
              </Route>
              <Route path="/profile-details">
                <PageTransition><ProfileDetails /></PageTransition>
              </Route>
              <Route path="/profile-details-processing">
                <PageTransition><ProfileDetailsProcessing /></PageTransition>
              </Route>
              <Route path="/personality-test">
                <PageTransition><PersonalityTest /></PageTransition>
              </Route>
              <Route path="/personality-test-processing">
                <PageTransition><PersonalityTestProcessing /></PageTransition>
              </Route>
              <Route path="/personality-result">
                <PageTransition><PersonalityResult /></PageTransition>
              </Route>
              <Route path="/relationship-test">
                <PageTransition><RelationshipTest /></PageTransition>
              </Route>
              <Route path="/relationship-test-processing">
                <PageTransition><RelationshipTestProcessing /></PageTransition>
              </Route>
              <Route path="/relationship-result">
                <PageTransition><RelationshipResult /></PageTransition>
              </Route>
              <Route path="/bdsm-test-upload">
                <PageTransition><BDSMTestUpload /></PageTransition>
              </Route>
              <Route path="/bdsm-test-input">
                <PageTransition><BDSMTestInput /></PageTransition>
              </Route>
              <Route path="/bdsm-test-processing">
                <PageTransition><BDSMTestProcessing /></PageTransition>
              </Route>
              <Route path="/important-traits">
                <PageTransition><ImportantTraits /></PageTransition>
              </Route>
              <Route path="/important-traits-processing">
                <PageTransition><ImportantTraitsProcessing /></PageTransition>
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
              <Route path="/payment-demo">
                <PageTransition><PaymentDemo /></PageTransition>
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
              <Route path="/chat/:matchId">
                <PageTransition><Chat /></PageTransition>
              </Route>
              <Route path="/profile">
                <PageTransition><Profile /></PageTransition>
              </Route>
              <Route path="/profile-name">
                <PageTransition><ProfileName /></PageTransition>
              </Route>
              <Route path="/important-traits">
                <PageTransition><ImportantTraits /></PageTransition>
              </Route>
              <Route path="/settings">
                <PageTransition><Settings /></PageTransition>
              </Route>
              <Route path="/resources">
                <PageTransition><Resources /></PageTransition>
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
              <Route path="/user-select">
                <PageTransition><UserSelect /></PageTransition>
              </Route>
              <Route path="/help-support">
                <PageTransition><HelpSupport /></PageTransition>
              </Route>
              <Route path="/help-getting-started">
                <PageTransition><HelpGettingStarted /></PageTransition>
              </Route>
              <Route path="/help-safety">
                <PageTransition><HelpSafety /></PageTransition>
              </Route>
              <Route path="/help-matching">
                <PageTransition><HelpMatching /></PageTransition>
              </Route>
              <Route path="/help-billing">
                <PageTransition><HelpBilling /></PageTransition>
              </Route>
              <Route path="/permissions">
                <PageTransition><PermissionsSettings /></PageTransition>
              </Route>
              <Route path="/subscription-management">
                <PageTransition><SubscriptionManagement /></PageTransition>
              </Route>
              <Route path="/user-data">
                <PageTransition><UserData /></PageTransition>
              </Route>
              <Route path="/download">
                <PageTransition><Download /></PageTransition>
              </Route>
              <Route path="/switches">
                <PageTransition><SwitchesPage /></PageTransition>
              </Route>
              <Route>
                <PageTransition><Splash /></PageTransition>
              </Route>
              </Switch>
            </AnimatePresence>
          </div>
          <Toaster />
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
