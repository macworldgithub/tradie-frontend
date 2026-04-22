import { ArrowRight, ChevronDown, Mic } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export default function Hero({ onGetStarted, onWatchDemo }: HeroProps) {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center xl:items-start justify-center pt-24 pb-20 px-6 sm:px-12 xl:px-24 overflow-hidden bg-[#03070b]">
      {/* BACKGROUND ELEMENTS */}
      {/* Network nodes/lines could be an SVG or image, using a placeholder/simulated look for now */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-20 pointer-events-none -z-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="400" r="1" fill="#f97316" />
          <path
            d="M400 400L600 200M400 400L200 600M400 400L600 600M400 400L200 200"
            stroke="#f97316"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          {/* Simulated complex nodes */}
          <path
            d="M600 200L700 350M200 600L100 450M600 600L750 500M200 200L50 300"
            stroke="#f97316"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
        </svg>
      </div>

      {/* Large Hammer Silhouette (Low Opacity) */}
      <div className="absolute left-[40%] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none -z-20 scale-150 rotate-12">
        <svg
          width="400"
          height="400"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" />
        </svg>
      </div>

      <div className="max-w-7xl w-full flex flex-col items-center xl:items-start text-center xl:text-left z-10">
        {/* BADGE */}
        <div className="inline-flex items-center gap-2 bg-[#12181e] border border-white/5 px-4 py-2 rounded-full mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#f97316]">
            AI-Powered Call Answering for Tradies
          </span>
        </div>

        {/* MAIN HEADLINE */}
        <h1 className="text-3xl md:text-6xl font-black leading-[1.05] tracking-tight text-white mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          Never miss a <br />
          <span className="text-orange-500">customer call</span> <br />
          again.
        </h1>

        {/* SUBHEADLINE */}
        <p className="max-w-2xl text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
          When you can't answer, our AI voice agent picks up, qualifies the
          caller, captures their details, and sends you an SMS — so you never
          lose a job.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
          <button
            onClick={onWatchDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-xl text-lg font-black transition-all-shadow duration-300 shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:scale-[1.02]"
          >
            <Mic size={20} strokeWidth={2.5} />
            Watch the Demo
          </button>

          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-3 border border-zinc-800 hover:border-orange-500/50 text-orange-500 px-6 py-4 rounded-xl text-lg font-black transition-all group"
          >
            Get Started
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* STATS BAR (Divider & 4 items) */}
        <div className="w-full max-w-3xl pt-12 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4 animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="flex flex-col space-y-2">
            <span className="text-5xl font-black text-orange-500">1 in 3</span>
            <span className="text-[12px] font-bold leading-tight text-zinc-600 max-w-[120px]">
              calls to tradies <br /> are missed
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-5xl font-black text-orange-500">80%</span>
            <span className="text-[12px] font-bold leading-tight text-zinc-600 max-w-[120px]">
              hang up and call <br /> the next tradie
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-5xl font-black text-orange-500">$70k</span>
            <span className="text-[12px] font-bold leading-tight text-zinc-600 max-w-[120px]">
              lost per year in <br /> missed business
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-5xl font-black text-emerald-500">0</span>
            <span className="text-[12px] font-bold leading-tight text-zinc-600 max-w-[120px]">
              calls missed <br /> with Bele.Ai
            </span>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden xl:flex text-zinc-700 animate-bounce">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
