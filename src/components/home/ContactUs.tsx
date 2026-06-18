import { Mail, Phone, Send } from "lucide-react";

export default function ContactUs() {
  return (
    <section className="bg-[#03070b] py-16 sm:py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-20">
        
        {/* Left Column: Info */}
        <div className="w-full lg:w-5/12 space-y-10">
          <div className="space-y-6">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#f97316] uppercase">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter text-white">
              Let's talk about <br className="hidden sm:block" />
              <span className="text-orange-500">your business.</span>
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg font-medium leading-relaxed">
              Have questions about how our AI agent works? Fill out the form and our team will get back to you as soon as possible.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="bg-orange-500/10 p-4 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-all">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-bold">Email</p>
                <p className="text-white font-medium">hello@mia.ai</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group cursor-default">
              <div className="bg-orange-500/10 p-4 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-all">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-bold">Phone</p>
                <p className="text-white font-medium">1300 MIA AI (1300 642 24)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full lg:w-7/12">
          <div className="bg-[#090e14] border border-white/10 p-8 sm:p-10 rounded-3xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-500 shadow-2xl z-10">
            {/* Subtle Glow */}
            <div className="absolute top-0 right-0 bg-orange-500/5 blur-[80px] w-full h-full rounded-full pointer-events-none group-hover:bg-orange-500/10 transition-all duration-700 -z-10" />
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    placeholder="John" 
                    className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe" 
                    className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Message</label>
                <textarea 
                  rows={4}
                  placeholder="How can we help you?" 
                  className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-xl text-lg font-black transition-all-shadow duration-300 shadow-[0_5px_20px_rgba(249,115,22,0.2)] hover:scale-[1.02] mt-4"
              >
                Send Message
                <Send size={18} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
