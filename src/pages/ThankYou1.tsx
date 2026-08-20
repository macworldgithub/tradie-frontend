import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import logo from "../assets/logo.png";

interface ThankYou1Props {
  onGoToLogin: () => void;
  onBack?: () => void;
}

export default function ThankYou1({ onGoToLogin }: ThankYou1Props) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onGoToLogin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onGoToLogin]);

  return (
    <div className="min-h-screen bg-[#03070b] text-white flex flex-col overflow-hidden relative selection:bg-orange-500/30">
      {/* Background glowing gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-6 border-b border-white/5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
        </div>
        <button
          onClick={onGoToLogin}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-orange-400 transition-colors group"
        >
          <span>Go to Login</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
          {/* Animated Success Badge */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping duration-1000" />
              <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-500/20 to-orange-500/20 blur-2xl rounded-full" />
              <div className="relative w-28 h-28 rounded-full border-2 border-emerald-500/80 bg-emerald-950/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)]">
                <CheckCircle size={56} className="text-emerald-400" strokeWidth={1.75} />
              </div>
            </div>
          </div>

          {/* Heading and Description */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={13} className="text-orange-400" />
              <span>Payment & Account Sync Complete</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-white">
              Thank You!
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg font-medium leading-relaxed max-w-md mx-auto">
              Your account has been created and your subscription is active. You are all set to start using your AI receptionist.
            </p>
          </div>

          {/* Auto Redirect Card */}
          <div className="bg-[#090e14]/80 backdrop-blur-xl border border-white/5 p-6 rounded-2xl max-w-md mx-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center font-black text-orange-400 text-sm">
                {countdown}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-zinc-300">
                Redirecting to login in <span className="text-orange-400 font-bold">{countdown}s</span>...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>

            <button
              onClick={onGoToLogin}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-6 py-3.5 rounded-xl text-sm font-black transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              <span>Go to Login Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 py-6 px-6 flex items-center justify-center text-zinc-600 text-xs font-medium">
        <span>© {new Date().getFullYear()} Tradie AI. All rights reserved.</span>
      </footer>
    </div>
  );
}
