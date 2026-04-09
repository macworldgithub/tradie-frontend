import { useState } from "react";
import {
  Phone,
  Sun,
  Moon,
  User,
  MapPin,
  Settings,
  Volume2,
  ArrowLeft,
} from "lucide-react";

interface DemoProps {
  onBack: () => void;
}

export default function Demo({ onBack }: DemoProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const rings = 0;
  const status = "SYSTEM IDLE";

  return (
    <div className="fixed inset-0 bg-[#03070b] text-white flex flex-col font-jakarta z-50">
      {/* TOP NAVBAR */}
      <nav className="w-full h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#03070b] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-zinc-500 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-orange-500 font-bold">~</span>
            <span className="text-white font-black tracking-tighter uppercase text-sm">
              JUST
            </span>
            <span className="text-orange-500 font-black tracking-tighter uppercase text-sm">
              TRADIE MOBILE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Volume2
            size={20}
            className="text-orange-500 hover:text-orange-400 cursor-pointer"
          />
          <Settings
            size={20}
            className="text-zinc-600 hover:text-white cursor-pointer transition-all"
            onClick={() => setShowConfig(!showConfig)}
          />
        </div>
      </nav>

      {/* BUSINESS CONFIGURATION MODAL (Bar at top) */}
      {showConfig && (
        <div className="w-full bg-[#090e14] border-b border-orange-500/20 p-6 animate-in slide-in-from-top duration-300">
          <div className="max-w-[1400px] mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                Business Configuration
              </span>
              <button
                onClick={() => setShowConfig(false)}
                className="text-[10px] font-black uppercase text-zinc-600 hover:text-white flex items-center gap-2"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ConfigInput
                label="Business Name"
                defaultValue="Jon's Plumbing"
              />
              <ConfigInput label="Owner Name" defaultValue="Jon" />
              <ConfigInput
                label="Trade Type"
                defaultValue="Tradesperson"
                isSelect
              />
              <ConfigInput label="Phone Number" defaultValue="02 8488 8484" />
            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* CENTER CONTENT (Main Demo) */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black/40 relative overflow-y-auto">
          <div className="max-w-xl w-full flex flex-col items-center text-center space-y-8 py-12">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 bg-[#12181e] border border-orange-500/20 px-4 py-2 rounded-full">
              <Phone size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                Live Demo
              </span>
            </div>

            {/* HEADERS */}
            <div className="space-y-4">
              <h1 className="text-xl md:text-3xl font-black tracking-tight text-white leading-tight">
                Experience Bele.Ai in Action
              </h1>
              <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed font-medium">
                Watch how Bele.Ai handles a missed call, captures the lead, and
                sends a real SMS to your phone.
              </p>
            </div>

            {/* INPUT SECTION */}
            <div className="w-full space-y-2 text-left">
              <div className="flex items-center gap-2 text-orange-500 ml-1">
                <div className="w-4 h-5 border-2 border-orange-500 rounded-sm flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-orange-500 rounded-full mb-3" />
                </div>
                <label className="text-[10px] font-black uppercase tracking-widest">
                  Your Mobile Number
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="0412 345 678"
                  className="w-full bg-[#090e14] border border-white/5 rounded-2xl px-6 py-3 text-white placeholder-zinc-700 font-mono tracking-wider focus:outline-none focus:border-orange-500/50 transition-all"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-700">
                  AU
                </span>
              </div>
              <p className="text-zinc-600 text-[10px] font-bold text-center">
                You'll receive a real SMS confirmation when the demo completes
              </p>
            </div>

            {/* BUTTONS */}
            <div className="w-full space-y-4">
              <button className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-black px-8 py-3 rounded-2xl text-sm font-black transition-all shadow-[0_10px_30px_rgba(249,115,22,0.2)]">
                <Sun size={20} className="stroke-[3]" />
                BUSINESS HOURS DEMO
              </button>
              <button className="w-full flex items-center justify-center gap-3 bg-[#090e14] hover:bg-[#12181e] border border-white/5 text-white px-8 py-3 rounded-2xl text-sm font-black transition-all">
                <Moon size={20} className="text-orange-500" />
                AFTER HOURS DEMO
              </button>
            </div>

            {/* FOOTNOTE */}
            <p className="text-[10px] text-zinc-600 leading-relaxed font-bold max-w-sm uppercase tracking-wider">
              Business hours: Tradie gets 3 rings to answer. After hours:
              Bele.Ai picks up automatically.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL (Workflow Sidebar) */}
        <aside className="w-full lg:w-[380px] xl:w-[450px] bg-[#03070b] border-l border-white/5 flex flex-col">
          {/* CALL FLOW SECTION */}
          <div className="p-8 pb-12 border-b border-white/5 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 text-orange-500">
              <Phone size={16} className="rotate-90" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Call Flow
              </span>
            </div>

            <div className="flex flex-col items-center space-y-4 relative">
              {/* FLOW STEP 1 */}
              <FlowCard
                title="CUSTOMER"
                sub="Incoming Call"
                icon={<User size={18} />}
                active
              />

              {/* CONNECTING LINE */}
              <div className="w-[1px] h-10 bg-gradient-to-b from-orange-500/50 to-transparent relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border border-orange-500/30 bg-[#03070b]" />
              </div>

              {/* FLOW STEP 2 */}
              <FlowCard
                title="JON'S PLUMBING"
                sub="02 8488 8484"
                icon={<Phone size={18} />}
              />

              {/* CONNECTING LINE */}
              <div className="w-[1px] h-10 bg-white/10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border border-white/10 bg-[#03070b]" />
              </div>

              {/* DECISION NODE */}
              <div className="w-24 h-24 rotate-45 border border-white/10 flex items-center justify-center relative translate-y-2">
                <span className="-rotate-45 text-[10px] font-black uppercase tracking-widest text-zinc-700 text-center leading-tight">
                  Call <br /> Answered?
                </span>
                <div className="absolute -right-4 -top-4 w-1.5 h-1.5 rounded-full bg-zinc-800" />
              </div>
            </div>
          </div>

          {/* CAPTURED DATA SECTION */}
          <div className="p-8 space-y-4">
            <div className="flex items-center gap-2 text-orange-500">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Captured Data
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <CapturedItem label="NAME" icon={<User size={14} />} />
              <CapturedItem label="NUMBER" icon={<Phone size={14} />} />
              <CapturedItem label="ADDRESS" icon={<MapPin size={14} />} />
              <CapturedItem label="REASON" icon={<Settings size={14} />} />
            </div>
          </div>

          {/* BOTTOM STATUS BAR */}
          <div className="w-full h-12 bg-black/50 border-t border-white/5 px-6 flex items-center justify-between font-mono text-[10px] font-black tracking-widest text-zinc-700">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-zinc-600" />
              {status}
            </div>
            <div className="flex items-center gap-6">
              <span>00:00</span>
              <span>RINGS: {rings}/3</span>
              <span className="text-orange-500 opacity-60">BELE.AI</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ConfigInput({ label, defaultValue, isSelect }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        {isSelect ? (
          <select className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-xs text-white appearance-none focus:outline-none focus:border-orange-500/50">
            <option>Plumber</option>
            <option>Electrician</option>
            <option>Carpenter</option>
            <option>HVAC Technician</option>
            <option>Locksmith</option>
            <option>Painter</option>
            <option>Roofer</option>
            <option>Tradesperson</option>
          </select>
        ) : (
          <input
            type="text"
            defaultValue={defaultValue}
            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 font-mono"
          />
        )}
      </div>
    </div>
  );
}

function FlowCard({ title, sub, icon, active = false }: any) {
  return (
    <div
      className={`w-full max-w-[280px] p-4 rounded-xl border flex items-center gap-4 transition-all ${
        active
          ? "bg-orange-500/5 border-orange-500/40 text-white"
          : "bg-[#090e14] border-white/5 text-zinc-500"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-orange-500/10 text-orange-500" : "bg-black/40 text-zinc-700"}`}
      >
        {icon}
      </div>
      <div className="space-y-0.5">
        <p
          className={`text-xs font-black tracking-widest uppercase ${active ? "text-white" : "text-zinc-500"}`}
        >
          {title}
        </p>
        <p
          className={`text-[10px] font-bold ${active ? "text-zinc-400" : "text-zinc-700"}`}
        >
          {sub}
        </p>
      </div>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]" />
      )}
    </div>
  );
}

function CapturedItem({ label, icon }: any) {
  return (
    <div className="w-full bg-[#090e14]/50 border border-white/5 rounded-xl px-5 py-4 flex items-center gap-4 group hover:border-white/10 transition-all">
      <div className="text-zinc-700 group-hover:text-zinc-500 transition-colors">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[9px] font-black tracking-[0.2em] text-zinc-600">
          {label}
        </p>
        <p className="text-xs font-bold text-zinc-800 tracking-widest">—</p>
      </div>
    </div>
  );
}
