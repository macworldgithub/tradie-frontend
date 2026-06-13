import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Dashboard from "../components/dashboard/Dashboard";
import RegisterTradieForm from "../components/dashboard/RegisterTradieForm";

interface VoiceAgentProps {
  onBack: () => void;
}

export default function VoiceAgent({ onBack }: VoiceAgentProps) {
  const [view, setView] = useState<"dashboard" | "register">("dashboard");

  if (view === "register") {
    return <RegisterTradieForm onBack={() => setView("dashboard")} />;
  }

  return (
    <div className="fixed inset-0 bg-[#03070b] text-white flex flex-col font-jakarta z-50">
      {/* BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      {/* NAVBAR */}
      <nav className="w-full h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#03070b]/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-zinc-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-orange-500 font-bold">~</span>
            <span className="text-white font-black tracking-tighter uppercase text-sm">
              TRADIE
            </span>
            <span className="text-orange-500 font-black tracking-tighter uppercase text-sm">
              DASHBOARD
            </span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 relative overflow-y-auto">
        <Dashboard
          onRegisterClick={() => setView("register")}
        />
      </main>

      {/* FOOTER */}
      <footer className="w-full h-10 bg-black/50 border-t border-white/5 px-6 flex items-center justify-between font-mono text-[9px] font-black tracking-[0.2em] text-zinc-700 shrink-0 mt-auto">
        <div>TRADIE DASHBOARD</div>
        <div className="text-orange-500/30">OmniSuite AI</div>
      </footer>
    </div>
  );
}