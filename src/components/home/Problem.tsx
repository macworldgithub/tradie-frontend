import manIllustration from "../../assets/man.png";
import { PhoneOff, TrendingDown } from "lucide-react";

export default function Problem() {
  return (
    <section className="bg-[#03070b] py-16 sm:py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center gap-12 lg:gap-20">
        {/* LEFT COLUMN: Text Content */}
        <div className="w-full xl:w-1/2 space-y-8 sm:space-y-10 order-2 xl:order-1 text-left">
          {/* Section Label */}
          <span className="text-[10px] font-black tracking-[0.2em] text-[#ff3b3b] uppercase">
            The Problem
          </span>

          {/* Main Headline */}
          <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter text-white">
            Missed calls mean <br className="hidden sm:block" />
            <span className="text-[#ff3b3b]">missed business.</span>
          </h2>

          {/* Body Text */}
          <p className="text-zinc-400 text-base sm:text-lg font-medium leading-relaxed max-w-xl">
            You're on a job, your hands are full, and the phone keeps ringing.
            By the time you check, the customer's already called someone else.
            It happens every single day to tradies across Australia.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
            {/* Card 1 */}
            <div className="bg-[#090e14] border border-white/5 p-4 rounded-2xl flex items-start gap-4 transition-all hover:border-[#ff3b3b]/30 group">
              <div className="bg-[#ff3b3b]/10 p-3 rounded-lg text-[#ff3b3b] group-hover:scale-110 transition-transform">
                <PhoneOff size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold text-base sm:text-lg">
                  1 in 3 calls are missed
                </h4>
                <p className="text-zinc-500 text-xs sm:text-sm">
                  Home service businesses miss a third of all inbound calls
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#090e14] border border-white/5 p-5 rounded-2xl flex items-start gap-4 transition-all hover:border-[#ff3b3b]/30 group">
              <div className="bg-[#ff3b3b]/10 p-3 rounded-lg text-[#ff3b3b] group-hover:scale-110 transition-transform">
                <TrendingDown size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold text-base sm:text-lg">
                  80% call the next tradie
                </h4>
                <p className="text-zinc-500 text-xs sm:text-sm">
                  Customers don't leave voicemails — they move on immediately
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Illustration/Image */}
        <div className="w-full xl:w-1/2 relative order-1 xl:order-2 group">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 h-[300px] sm:min-h-[400px] lg:min-h-[550px]">
            <img
              src={manIllustration}
              alt="Tradie working on a job"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Dark Overlay for bottom text stability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* Illustration Label Overlay */}
            <div className="absolute bottom-8 sm:bottom-12 left-8 sm:left-12">
              <div className="inline-block text-[8px] sm:text-[10px] font-black tracking-widest text-[#ff3b3b] uppercase bg-black/60 backdrop-blur-xl px-5 py-3 rounded-xl border border-[#ff3b3b]/30 shadow-2xl">
                Every missed call is a lost job.
              </div>
            </div>
          </div>

          {/* Enhanced background glow */}
          <div className="absolute -inset-10 bg-[#ff3b3b]/10 blur-[100px] -z-10 rounded-full opacity-50" />
        </div>
      </div>
    </section>
  );
}
