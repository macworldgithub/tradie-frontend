import { Zap, Play, ArrowRight } from "lucide-react";

interface MindsetProps {
  onGetStarted: () => void;
}

export default function Mindset({ onGetStarted }: MindsetProps) {
  const principles = [
    "Is it right for the customer?",
    "Is it simple?",
    "Can it be automated?",
  ];

  return (
    <section className="bg-[#03070b] py-24 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* MINDSET HEADER */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-zinc-500 uppercase">
            Our Mindset
          </span>
          <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tighter text-white">
            A "no frills" approach.
          </h2>
        </div>

        {/* PRINCIPLES LIST */}
        <div className="w-full max-w-2xl space-y-4 mb-12">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="bg-[#090e14]/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4 transition-all hover:border-orange-500/30 group"
            >
              <div className="text-orange-500 group-hover:scale-110 transition-transform">
                <Zap size={24} fill="currentColor" fillOpacity={0.2} />
              </div>
              <p className="text-white font-bold text-lg sm:text-xl tracking-tight">
                {principle}
              </p>
            </div>
          ))}
        </div>

        {/* MISSION STATEMENT */}
        <p className="text-zinc-500 text-center text-sm sm:text-base leading-relaxed max-w-2xl mb-32">
          Our mission is to revolutionise utilities through simplicity and
          automation. Just Tradie Mobile is built for tradies who want to focus
          on the job — not the phone.
        </p>

        {/* FINAL CTA SECTION */}
        <div className="text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white">
              Ready to stop losing jobs?
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl font-medium">
              Set up in minutes. No contracts. Just more customers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-black px-6 py-3 rounded-2xl text-lg font-black transition-all duration-300 shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95"
            >
              Get Started Now
              <ArrowRight size={20} />
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-white/10 hover:border-orange-500/50 text-white hover:text-orange-500 px-3 py-3 rounded-2xl text-lg font-black transition-all duration-300 group">
              <Play size={20} className="group-hover:fill-orange-500/20" />
              Watch Demo First
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
