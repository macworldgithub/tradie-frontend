import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import Problem from "./components/home/Problem";
import Solution from "./components/home/Solution";
import HowItWorks from "./components/home/HowItWorks";
import Mindset from "./components/home/Mindset";
import Pricing from "./components/home/Pricing";
import ContactUs from "./components/home/ContactUs";
import Footer from "./components/layout/Footer";
import Signup from "./pages/Signup";
import VoiceAgent from "./pages/VoiceAgent";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import AdminPanel from "./pages/AdminPanel";
import "./App.css";

function App() {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [view, setView] = useState<'landing' | 'signup' | 'login' | 'forgot-password' | 'change-password' | 'voice-agent' | 'admin'>(() => {
    if (window.location.search.includes('admin=true')) return 'admin';
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    return savedUser && savedToken ? 'voice-agent' : 'landing';
  });

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
          <Pricing onGetStarted={() => setView('signup')} />
          <HowItWorks onGetStarted={() => setView('signup')} />
          <Mindset 
            onGetStarted={() => setView('signup')} 
            onWatchDemo={() => setView('voice-agent')}
          />
          <ContactUs />
          <Footer />
        </>
      )}

      {view === 'signup' && (
        <Signup onBack={() => setView('landing')} onSuccess={handleLoginSuccess} />
      )}

      {view === 'voice-agent' && (
        <VoiceAgent onLogout={handleLogout} />
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

      {view === 'admin' && (
        <AdminPanel onLogout={() => {
          window.history.replaceState({}, '', window.location.pathname);
          setView('landing');
        }} />
      )}
    </div>
  );
}

export default App;
