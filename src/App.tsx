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
import { Toaster } from "react-hot-toast";
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
  const [initialLoginRole, setInitialLoginRole] = useState<'company' | 'admin'>('company');
  const [view, setView] = useState<'landing' | 'signup' | 'login' | 'forgot-password' | 'change-password' | 'voice-agent' | 'admin'>(() => {
    if (window.location.search.includes('admin=true')) return 'admin';
    const savedUserStr = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUserStr && savedToken) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && savedUser.email === 'burhanfani92@gmail.com') {
          return 'admin';
        }
      } catch (e) {}
      return 'voice-agent';
    }
    return 'landing';
  });

  const handleLoginSuccess = (userData: any, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    if (userData && userData.email === 'burhanfani92@gmail.com') {
      setView('admin');
    } else {
      setView('voice-agent');
    }
  };

  const handleLoginClick = (role: 'company' | 'admin') => {
    setInitialLoginRole(role);
    setView('login');
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
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#090e14',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          },
          error: {
            style: {
              background: 'rgba(239, 68, 68, 0.1)', // bg-red-500/10
              border: '1px solid rgba(239, 68, 68, 0.2)', // border-red-500/20
              color: '#f87171', // text-red-400
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#090e14',
            },
          },
          success: {
            style: {
              background: 'rgba(16, 185, 129, 0.1)', // emerald-500/10
              border: '1px solid rgba(16, 185, 129, 0.2)', // emerald-500/20
              color: '#34d399', // emerald-400
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#090e14',
            },
          },
        }}
      />
      {view === 'landing' && (
        <>
          <Navbar 
            onGetStarted={() => setView('signup')} 
            onWatchDemo={() => setView('voice-agent')}
            onLogin={handleLoginClick}
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
        <Signup onBack={() => setView('landing')} onSuccess={handleLoginSuccess} onGoToLogin={() => setView('login')} />
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
          initialRole={initialLoginRole}
        />
      )}

      {view === 'forgot-password' && (
        <ForgotPassword onBack={() => setView('login')} />
      )}

      {view === 'change-password' && token && (
        <ChangePassword onBack={() => setView('voice-agent')} token={token} />
      )}

      {view === 'admin' && token && (
        <AdminPanel 
          token={token}
          onLogout={() => {
            handleLogout();
          }} 
        />
      )}
    </div>
  );
}

export default App;
