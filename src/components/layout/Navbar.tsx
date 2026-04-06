import { useState } from "react";
import { Menu, X, Play } from "lucide-react";

interface NavbarProps {
  onGetStarted: () => void;
}

export default function Navbar({ onGetStarted }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[#03070b] text-white border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LEFT: Logo Section */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">
            JUST
          </h1>

          <div className="border border-[#f97316] text-[#f97316] text-[10px] px-2 py-1 rounded-md font-bold tracking-wider uppercase whitespace-nowrap">
            TRADIE MOBILE
          </div>
        </div>

        {/* RIGHT (Desktop) - Shows only on LG screens (1024px) and above */}
        <div className="hidden lg:flex items-center gap-6">
          <span className="text-[10px] text-zinc-500 font-bold tracking-[0.15em] uppercase whitespace-nowrap">
            POWERED BY BELE.AI
          </span>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-black px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 shadow-[0_4px_15px_rgba(249,115,22,0.3)] whitespace-nowrap">
              <Play size={14} fill="black" strokeWidth={0} />
              Live Demo
            </button>

            <button 
            onClick={onGetStarted}
            className="border border-orange-500/50 hover:bg-orange-500 hover:text-black text-orange-500 px-5 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Sign Up
          </button>
          </div>
        </div>

        {/* MOBILE MENU BUTTON - Shows on all screens below LG (1024px) */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU - Hidden on LG+ */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#03070b] border-t border-white/10 px-6 py-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-bold tracking-[0.15em] uppercase">
              POWERED BY
            </span>
            <span className="text-xs text-zinc-200 font-black tracking-widest leading-none">
              BELE.AI
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 bg-[#f97316] text-black py-4 rounded-xl text-md font-bold shadow-lg active:scale-95 transition-transform">
              <Play size={18} fill="black" strokeWidth={0} />
              Live Demo
            </button>

            <button 
            onClick={onGetStarted}
            className="bg-[#12181e] border border-white/5 w-full p-4 rounded-xl text-orange-500 font-bold hover:bg-orange-500 hover:text-black transition-all"
          >
            Sign Up
          </button>
          </div>
        </div>
      )}
    </nav>
  );
}
