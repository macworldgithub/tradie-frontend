import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import Problem from "./components/home/Problem";
import Solution from "./components/home/Solution";
import HowItWorks from "./components/home/HowItWorks";
import Mindset from "./components/home/Mindset";
import Footer from "./components/layout/Footer";
import Signup from "./pages/Signup";
import VoiceAgent from "./pages/VoiceAgent";
import "./App.css";

function App() {
  const [view, setView] = useState<'landing' | 'signup' | 'voice-agent'>('landing');

  return (
    <div className="bg-[#03070b] overflow-x-hidden min-h-screen">
      {view === 'landing' && (
        <>
          <Navbar 
            onGetStarted={() => setView('signup')} 
            onWatchDemo={() => setView('voice-agent')}
          />
          <Hero 
            onGetStarted={() => setView('signup')} 
            onWatchDemo={() => setView('voice-agent')}
          />
          <Problem />
          <Solution />
          <HowItWorks onGetStarted={() => setView('signup')} />
          <Mindset 
            onGetStarted={() => setView('signup')} 
            onWatchDemo={() => setView('voice-agent')}
          />
          <Footer />
        </>
      )}

      {view === 'signup' && (
        <Signup onBack={() => setView('landing')} />
      )}

      {view === 'voice-agent' && (
        <VoiceAgent onBack={() => setView('landing')} />
      )}
    </div>
  );
}

export default App;
