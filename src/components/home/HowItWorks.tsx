import { PhoneCall, Bot, ClipboardList, Send, Play } from "lucide-react";

interface HowItWorksProps {
  onGetStarted: () => void;
}

export default function HowItWorks({ onGetStarted }: HowItWorksProps) {
  const steps = [
    {
      number: "01",
      icon: <PhoneCall size={24} className="text-orange-500" />,
      title: "Customer Calls",
      description:
        "A customer calls your business number. The phone rings 3 times.",
    },
    {
      number: "02",
      icon: <Bot size={24} className="text-orange-500" />,
      title: "Bele.Ai Picks Up",
      description:
        "If you don't answer, Bele.Ai answers with a professional greeting using your business name.",
    },
    {
      number: "03",
      icon: <ClipboardList size={24} className="text-orange-500" />,
      title: "Qualifies & Captures",
      description:
        "Detects their number via CLI, captures name, address, and reason — then checks if it's the right trade.",
    },
    {
      number: "04",
      icon: <Send size={24} className="text-orange-500" />,
      title: "SMS Delivered",
      description:
        "Full lead details sent to your phone instantly. Optional copy to a partner or office manager.",
    },
  ];

  return (
    <section className="bg-[#03070b] py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* HEADER */}
        <div className="text-center space-y-4 mb-20 max-w-2xl">
          <span className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-[#f97316] uppercase">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tighter text-white">
            Four steps. Zero missed leads.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg font-medium">
            From missed call to qualified lead in under 60 seconds.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#090e14] border border-white/5 p-8 rounded-[2rem] space-y-6 transition-all hover:border-[#f97316]/30 hover:bg-[#0c121a] group relative overflow-hidden"
            >
              {/* SHINE EFFECT */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -z-10 group-hover:bg-orange-500/10 transition-colors" />

              <div className="flex justify-between items-start">
                <span className="text-3xl font-black text-zinc-800 transition-colors group-hover:text-orange-500/20">
                  {step.number}
                </span>
                <div className="bg-[#f97316]/10 p-3 rounded-xl transition-transform group-hover:scale-110">
                  {step.icon}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-bold text-xl leading-tight">
                  {step.title}
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-20 flex justify-center">
          <button 
            onClick={onGetStarted}
            className="flex items-center gap-3 bg-[#090e14] border border-white/5 hover:border-orange-500/30 text-white px-8 py-4 rounded-2xl text-lg font-black transition-all duration-300 hover:scale-105"
          >
            Build Your AI Agent
            <Play size={18} fill="white" />
          </button>
        </div>
      </div>
    </section>
  );
}
