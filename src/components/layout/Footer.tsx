export default function Footer() {
  return (
    <footer className="w-full bg-[#03070b] border-t border-white/5 py-12 px-6 sm:px-12 md:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* LEFT: Branding */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black tracking-tighter text-white">
            JUST
          </h2>
          <div className="border border-orange-500/30 px-3 py-1 rounded-md">
            <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">
              Tradie Mobile
            </span>
          </div>
        </div>

        {/* RIGHT: Attribution */}
        <div className="text-center md:text-right">
          <p className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] leading-relaxed">
            Powered by Bele.Ai — Revolutionising utilities Through{" "}
            <br className="sm:hidden" /> Simplicity and Automation
          </p>
        </div>
      </div>
    </footer>
  );
}
