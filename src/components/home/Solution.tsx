import solutionIllustration from "../../assets/solution.png";
import {
  Mic,
  Fingerprint,
  ShieldCheck,
  MessageSquare,
  Clock,
  Users,
} from "lucide-react";

export default function Solution() {
  const features = [
    {
      icon: <Mic size={20} />,
      title: "AI Voice Agent",
      description: "Natural conversation, not a robot",
    },
    {
      icon: <Fingerprint size={20} />,
      title: "CLI Detection",
      description: "Auto-detects caller number",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Call Qualification",
      description: "Checks if it's the right trade",
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Instant SMS",
      description: "Lead details sent immediately",
    },
    {
      icon: <Clock size={20} />,
      title: "After Hours",
      description: "Different greeting outside hours",
    },
    {
      icon: <Users size={20} />,
      title: "Secondary SMS",
      description: "Copy to partner or office",
    },
  ];

  return (
    <section className="bg-[#03070b] py-24 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center gap-16 lg:gap-24">
        {/* LEFT COLUMN: Illustration/Image */}
        <div className="w-full xl:w-1/2 relative group">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 h-[350px] sm:min-h-[450px] lg:min-h-[550px]">
            <img
              src={solutionIllustration}
              alt="Bele.Ai Solution Illustration"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Dark Overlay for bottom text stability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Illustration Label Overlay */}
            <div className="absolute bottom-6 left-8 sm:bottom-12 sm:left-12">
              <div className="inline-block text-[8px] sm:text-[10px] font-black tracking-widest text-[#f97316] uppercase bg-black/50 backdrop-blur-md px-5 py-3 rounded-md border border-[#f97316]/20">
                AI answers. You get the job.
              </div>
            </div>
          </div>

          {/* Subtle glow behind image */}
          <div className="absolute -inset-10 bg-orange-500/5 blur-[120px] -z-10 rounded-full opacity-50" />
        </div>

        {/* RIGHT COLUMN: Text Content & Features */}
        <div className="w-full xl:w-1/2 space-y-10">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-[#f97316] uppercase">
              The Solution
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tighter text-white">
              Bele.Ai answers <br />
              <span className="text-[#f97316]">so you don't have to.</span>
            </h2>
          </div>

          <p className="text-zinc-400 text-base md:text-md font-medium leading-relaxed max-w-3xl">
            When a customer calls and you can't answer, Bele.Ai picks up after 3
            rings. It greets the caller professionally, qualifies the job,
            captures all their details, and sends you an SMS instantly.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#090e14]/50 border border-white/5 p-5 rounded-xl flex items-start gap-4 transition-all hover:border-[#f97316]/30 hover:bg-[#0c121a] group"
              >
                <div className="bg-[#f97316]/10 p-2.5 rounded-lg text-[#f97316] group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-sm sm:text-base leading-tight">
                    {feature.title}
                  </h4>
                  <p className="text-zinc-500 text-[11px] sm:text-xs tracking-wide">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
