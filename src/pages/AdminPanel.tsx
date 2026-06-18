import { useState } from "react";
import { Building2, Users, Phone, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";

// Mock Data
const MOCK_COMPANIES = [
  {
    id: "c1",
    name: "Apex Plumbing Solutions",
    status: "active",
    tier: "Professional",
    tradies: [
      { id: "t1", name: "John Doe", email: "john@apex.com", phone: "0412345678", role: "Master Plumber" },
      { id: "t2", name: "Mike Smith", email: "mike@apex.com", phone: "0498765432", role: "Apprentice" },
    ],
    dids: [
      { id: "d1", number: "+61 4 1111 2222", status: "active", assignedTo: "John Doe" },
      { id: "d2", number: "+61 4 3333 4444", status: "active", assignedTo: "Mike Smith" },
    ]
  },
  {
    id: "c2", 
    name: "Sparky Electricals",
    status: "active",
    tier: "Basic",
    tradies: [
      { id: "t3", name: "Sarah Connor", email: "sarah@sparky.com", phone: "0455555555", role: "Electrician" },
    ],
    dids: [
      { id: "d3", number: "+61 4 5555 6666", status: "active", assignedTo: "Sarah Connor" },
    ]
  },
  {
    id: "c3",
    name: "BuildRight Carpentry",
    status: "inactive",
    tier: "Professional",
    tradies: [
      { id: "t4", name: "Tom Builder", email: "tom@buildright.com", phone: "0477777777", role: "Carpenter" },
    ],
    dids: [
      { id: "d4", number: "+61 4 7777 8888", status: "inactive", assignedTo: "Tom Builder" },
    ]
  }
];

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCompanyId(expandedCompanyId === id ? null : id);
  };

  const totalCompanies = MOCK_COMPANIES.length;
  const totalTradies = MOCK_COMPANIES.reduce((acc, c) => acc + c.tradies.length, 0);
  const totalDids = MOCK_COMPANIES.reduce((acc, c) => acc + c.dids.length, 0);

  return (
    <div className="min-h-screen bg-[#03070b] text-white">
      {/* Top Navbar */}
      <nav className="bg-[#090e14] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500 text-black font-black px-3 py-1 rounded-md text-sm">ADMIN</div>
          <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">Mia.Ai Dashboard</h1>
        </div>
        <button 
          onClick={onLogout}
          className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold"
        >
          Back to Site
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#090e14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute top-0 right-0 bg-orange-500/5 w-32 h-32 blur-[40px] rounded-full group-hover:bg-orange-500/10 transition-all pointer-events-none" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500">
                <Building2 size={24} />
              </div>
              <h3 className="text-zinc-400 font-semibold">Total Companies</h3>
            </div>
            <p className="text-4xl font-black text-white relative z-10">{totalCompanies}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#090e14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/30 transition-all">
             <div className="absolute top-0 right-0 bg-orange-500/5 w-32 h-32 blur-[40px] rounded-full group-hover:bg-orange-500/10 transition-all pointer-events-none" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500">
                <Users size={24} />
              </div>
              <h3 className="text-zinc-400 font-semibold">Registered Tradies</h3>
            </div>
            <p className="text-4xl font-black text-white relative z-10">{totalTradies}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#090e14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/30 transition-all">
             <div className="absolute top-0 right-0 bg-orange-500/5 w-32 h-32 blur-[40px] rounded-full group-hover:bg-orange-500/10 transition-all pointer-events-none" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500">
                <Phone size={24} />
              </div>
              <h3 className="text-zinc-400 font-semibold">Total DIDs</h3>
            </div>
            <p className="text-4xl font-black text-white relative z-10">{totalDids}</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Companies Directory</h2>
          </div>

          <div className="space-y-4">
            {MOCK_COMPANIES.map((company) => (
              <div 
                key={company.id}
                className={`bg-[#090e14] border rounded-2xl overflow-hidden transition-all duration-300 ${
                  expandedCompanyId === company.id ? "border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]" : "border-white/5 hover:border-white/10"
                }`}
              >
                {/* Accordion Header */}
                <div 
                  className="px-6 py-5 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(company.id)}
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-12 h-12 rounded-full bg-[#12181e] border border-white/5 flex items-center justify-center text-xl font-black text-zinc-300 shrink-0">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex flex-wrap items-center gap-2 sm:gap-3">
                        {company.name}
                        {company.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">Tier: <span className="text-zinc-300">{company.tier}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-8 ml-4">
                    <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-400 font-medium">
                      <div className="flex items-center gap-2"><Users size={16} className="text-orange-500"/> {company.tradies.length}</div>
                      <div className="flex items-center gap-2"><Phone size={16} className="text-orange-500"/> {company.dids.length}</div>
                    </div>
                    <div className="text-zinc-500 p-2 hover:bg-white/5 rounded-full transition-colors shrink-0">
                      {expandedCompanyId === company.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Accordion Content */}
                {expandedCompanyId === company.id && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-white/5 bg-[#0a1017]">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6">
                      
                      {/* Tradies List */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider flex items-center gap-2">
                          <Users size={16} /> Registered Tradies
                        </h4>
                        <div className="space-y-3">
                          {company.tradies.map(tradie => (
                            <div key={tradie.id} className="bg-[#12181e] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <p className="font-semibold text-white">{tradie.name}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">{tradie.role}</p>
                              </div>
                              <div className="sm:text-right">
                                <p className="text-sm text-zinc-300">{tradie.email}</p>
                                <p className="text-xs text-zinc-500">{tradie.phone}</p>
                              </div>
                            </div>
                          ))}
                          {company.tradies.length === 0 && (
                            <p className="text-sm text-zinc-500 italic">No tradies registered.</p>
                          )}
                        </div>
                      </div>

                      {/* DIDs List */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider flex items-center gap-2">
                          <Phone size={16} /> Assigned DIDs
                        </h4>
                        <div className="space-y-3">
                          {company.dids.map(did => (
                            <div key={did.id} className="bg-[#12181e] p-4 rounded-xl border border-white/5 flex items-center justify-between gap-2">
                              <div className="truncate">
                                <p className="font-semibold text-white tracking-wide truncate">{did.number}</p>
                                <p className="text-xs text-zinc-500 mt-0.5 truncate">Assigned to: <span className="text-zinc-300">{did.assignedTo}</span></p>
                              </div>
                              <div className="shrink-0">
                                <span className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wider ${did.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {did.status}
                                </span>
                              </div>
                            </div>
                          ))}
                          {company.dids.length === 0 && (
                            <p className="text-sm text-zinc-500 italic">No DIDs assigned.</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
