import { Check } from "lucide-react";

interface PricingProps {
  onGetStarted: () => void;
}

export default function Pricing({ onGetStarted }: PricingProps) {
  return (
    <section className="bg-[#03070b] py-16 sm:py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-12">
        {/* Section Label & Header */}
        <div className="space-y-6">
          <span className="text-[10px] font-black tracking-[0.2em] text-[#f97316] uppercase">
            Simple Pricing
          </span>

          <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter text-white">
            One flat rate. <br className="hidden sm:block" />
            <span className="text-orange-500">Zero hidden fees.</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Get your AI voice agent answering calls and capturing leads 24/7 without worrying about per-minute charges.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="w-full max-w-md bg-[#090e14] border border-white/10 p-8 sm:p-10 rounded-3xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-500 shadow-2xl z-10">
          {/* Subtle Glow Effect inside the card */}
          <div className="absolute top-0 right-0 bg-orange-500/10 blur-[80px] w-full h-full rounded-full pointer-events-none group-hover:bg-orange-500/20 transition-all duration-700 -z-10" />
          
          <div className="space-y-8 text-left">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black text-orange-500">$220</span>
                <span className="text-zinc-500 font-medium">/ month</span>
              </div>
              <p className="text-xs text-zinc-500 mt-2 font-medium">(incl GST)</p>
            </div>

            <div className="w-full h-px bg-white/5" />

            <ul className="space-y-4">
              {[
                "24/7 AI Call Answering",
                "Instant SMS Lead Notifications",
                "Unlimited Call Handling",
                "Easy Set Up & Onboarding"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 bg-orange-500/10 p-1 rounded-full text-orange-500">
                    <Check size={14} strokeWidth={4} />
                  </div>
                  <span className="text-zinc-300 font-medium text-sm sm:text-base">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={onGetStarted}
              className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-xl text-lg font-black transition-all-shadow duration-300 shadow-[0_5px_20px_rgba(249,115,22,0.2)] hover:scale-[1.02]"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Background ambient glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-[500px] bg-orange-500/5 blur-[120px] pointer-events-none rounded-full" />
    </section>
  );
}
