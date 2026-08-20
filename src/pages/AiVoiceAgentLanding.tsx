import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import ContactUs from "../components/voiceAgentLanding/ContactUs";
import Pricing from "../components/voiceAgentLanding/Pricing";
import HowItWorks from "../components/voiceAgentLanding/HowItWorks";
import Hero from "../components/voiceAgentLanding/Hero";
import Solution from "../components/voiceAgentLanding/Solution";
import Problem from "../components/voiceAgentLanding/Problem";
import Mindset from "../components/voiceAgentLanding/Mindset";
import Footer from "../components/layout/Footer";
import ContactModal from "../components/voiceAgentLanding/ContactModal";

interface AiVoiceAgentLandingProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
  onLogin: (role: "company" | "admin") => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function AiVoiceAgentLanding({
  onGetStarted,
  onWatchDemo,
  onLogin,
  isLoggedIn,
  onLogout,
}: AiVoiceAgentLandingProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <Navbar
        onGetStarted={onGetStarted}
        onWatchDemo={onWatchDemo}
        onLogin={onLogin}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        showLogin={false}
      />
      <Hero
        onGetStarted={onGetStarted}
        onWatchDemo={onWatchDemo}
        onContactClick={() => setIsContactModalOpen(true)}
      />
      <Problem onContactClick={() => setIsContactModalOpen(true)} />
      <Solution onContactClick={() => setIsContactModalOpen(true)} />
      <Pricing onGetStarted={() => setIsContactModalOpen(true)} />
      <HowItWorks onGetStarted={() => setIsContactModalOpen(true)} />
      <Mindset
        onGetStarted={() => setIsContactModalOpen(true)}
        onWatchDemo={onWatchDemo}
      />
      <ContactUs onThankYou={() => (window.location.href = "/thank-you?from=/lp/ai-voice-agent")} />
      <Footer />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onThankYou={() => (window.location.href = "/thank-you?from=/lp/ai-voice-agent")}
      />
    </>
  );
}
