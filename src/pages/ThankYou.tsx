import { useEffect } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import logo from "../assets/logo.png";

interface ThankYouProps {
  onBack: () => void;
}

export default function ThankYou({ onBack }: ThankYouProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#03070b] text-white flex flex-col overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 w-full px-6 py-6 border-b border-white/5 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Home</span>
        </button>
        <img src={logo} alt="Logo" className="h-14 w-auto" />
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full mx-auto text-center space-y-12">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-ping" />
              <div className="absolute -inset-6 bg-orange-500/10 blur-2xl rounded-full" />
              <div className="relative w-28 h-28 rounded-full border-2 border-orange-500 bg-orange-500/10 flex items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.25)]">
                <CheckCircle size={52} className="text-orange-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <span className="inline-block text-[10px] font-black tracking-[0.25em] text-orange-500 uppercase">Message Received</span>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-tight">Thank You!</h1>
            <p className="text-zinc-400 text-base sm:text-lg font-medium leading-relaxed max-w-lg mx-auto">
              Thank you for submitting the form. Our team has received your details and will be in touch with you soon.
            </p>
          </div>
        </div>
      </div>

      <footer className="relative z-10 w-full border-t border-white/5 py-6 px-6 flex items-center justify-center text-zinc-600 text-xs font-medium">
        <span>© 2025 Tradie AI. All rights reserved.</span>
      </footer>
    </div>
  );
}
