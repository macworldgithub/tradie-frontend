import { Phone, Mail, Bell, Settings, Calendar, CheckCircle2 } from "lucide-react";

interface Tradie {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  companyId: string;
  notificationPreference: string;
  callMode: string;
  createdAt: string;
  updatedAt: string;
  isMapped?: boolean;
}

interface TradieCardProps {
  tradie: Tradie;
}

export default function TradieCard({ tradie }: TradieCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPrefBadgeStyle = (pref: string) => {
    switch (pref.toLowerCase()) {
      case "both":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "sms":
        return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      case "email":
        return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
      default:
        return "bg-zinc-500/10 border-zinc-500/20 text-zinc-400";
    }
  };

  const formattedDate = new Date(tradie.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="w-full bg-[#090e14]/50 border border-white/5 hover:border-orange-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(249,115,22,0.08)] transition-all duration-300 flex flex-col justify-between min-h-[260px]">
      {/* Decorative vertical bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header section with Name & Initials */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-sm font-black tracking-wider shrink-0">
              {getInitials(tradie.name)}
            </div>
            <div>
              <h3 className="font-black text-lg text-white leading-tight group-hover:text-orange-400 transition-colors">
                {tradie.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-500 font-medium">
                <Calendar size={11} />
                <span>Registered {formattedDate}</span>
              </div>
            </div>
          </div>
          {tradie.isMapped && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-[6px] font-bold uppercase tracking-[0.18em]">
              <CheckCircle2 size={14} />
              Mapped to DID
            </div>
          )}
    
        </div>

        {/* Details list */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2.5 text-zinc-400 text-xs">
            <Phone size={14} className="text-zinc-600 shrink-0" />
            <span className="font-mono tracking-tight text-zinc-300">{tradie.phoneNumber}</span>
          </div>

          <div className="flex items-center gap-2.5 text-zinc-400 text-xs">
            <Mail size={14} className="text-zinc-600 shrink-0" />
            <span className="truncate text-zinc-300">{tradie.email}</span>
          </div>
        </div>
      </div>

      {/* Badges footer section */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5 mt-4">
        {/* Notification preference badge */}
        <div className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${getPrefBadgeStyle(tradie.notificationPreference)}`}>
          <Bell size={10} />
          <span>{tradie.notificationPreference}</span>
        </div>

        {/* Call mode badge */}
        <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300">
          <Settings size={10} />
          <span>{tradie.callMode} Call</span>
        </div>
      </div>
    </div>
  );
}
