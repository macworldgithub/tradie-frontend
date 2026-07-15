import { User, Mail, Briefcase } from "lucide-react";

interface ProfileCardProps {
  user: {
    customerName?: string;
    name?: string;
    email?: string;
    companyName?: string;
    company?: string;
  } | null;
  daysRemaining?: number | null;
  didNumber?: string | null;
}

export default function ProfileCard({
  user,
  daysRemaining,
  didNumber,
}: ProfileCardProps) {
  if (!user) return null;
  console.log(daysRemaining, "DAYS");
  const displayName = user.customerName || user.name || "N/A";
  const displayEmail = user.email || "N/A";
  const displayCompany = user.companyName || user.company || "N/A";

  return (
    <div className="w-full bg-[#090e14]/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full pointer-events-none transition-all duration-500 group-hover:bg-orange-500/10" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
            <User size={30} className="stroke-[1.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80">
              Welcome back
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
              {displayName}
            </h2>
          </div>
        </div>

        <div className="h-px md:h-12 w-full md:w-px bg-white/10" />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <Mail size={16} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                Email Address
              </p>
              <p className="text-sm font-medium text-zinc-200 mt-0.5 break-all">
                {displayEmail}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <Briefcase size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                Company Name
              </p>
              <p className="text-sm font-medium text-zinc-200 mt-0.5">
                {displayCompany}
              </p>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                  DID Number
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${didNumber ? "text-white" : "text-zinc-400"}`}
                >
                  {didNumber || "You have already paid, wait for DID Porting"}
                </p>
              </div>
              {/* {typeof daysRemaining !== 'undefined' && daysRemaining !== null && ( */}
              <p className="text-[11px] mt-3 text-zinc-400 font-bold">
                Days Remaining: {daysRemaining}
              </p>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
