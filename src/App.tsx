import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import Problem from "./components/home/Problem";
import Solution from "./components/home/Solution";
import HowItWorks from "./components/home/HowItWorks";
import Mindset from "./components/home/Mindset";
import Footer from "./components/layout/Footer";
import Signup from "./pages/Signup";
import VoiceAgent from "./pages/VoiceAgent";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import "./App.css";

function App() {
  const [view, setView] = useState<'landing' | 'signup' | 'login' | 'forgot-password' | 'change-password' | 'voice-agent'>('landing');
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const handleLoginSuccess = (userData: any, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setView('voice-agent');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setView('landing');
  };

  return (
    <div className="bg-[#03070b] overflow-x-hidden min-h-screen">
      {view === 'landing' && (
        <>
          <Navbar 
            onGetStarted={() => setView('signup')} 
            onWatchDemo={() => setView('voice-agent')}
            onLogin={() => setView('login')}
            isLoggedIn={!!user}
            onLogout={handleLogout}
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
        <Signup onBack={() => setView('landing')} onSuccess={handleLoginSuccess} />
      )}

      {view === 'voice-agent' && (
        <VoiceAgent onBack={() => setView('landing')} />
      )}

      {view === 'login' && (
        <Login 
          onBack={() => setView('landing')} 
          onSuccess={handleLoginSuccess}
          onForgotPassword={() => setView('forgot-password')}
          onSignup={() => setView('signup')}
        />
      )}

      {view === 'forgot-password' && (
        <ForgotPassword onBack={() => setView('login')} />
      )}

      {view === 'change-password' && token && (
        <ChangePassword onBack={() => setView('voice-agent')} token={token} />
      )}
    </div>
  );
}

export default App;
