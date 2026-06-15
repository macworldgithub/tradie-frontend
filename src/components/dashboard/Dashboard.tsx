import { useState, useEffect } from "react";
import { Plus, UserPlus, RefreshCw, AlertTriangle, Users, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "../../config/apiConfig";
import ProfileCard from "./ProfileCard";
import TradieCard from "./TradieCard";

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
}

interface DashboardProps {
  onRegisterClick: () => void;
}

export default function Dashboard({ onRegisterClick }: DashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [tradies, setTradies] = useState<Tradie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTradies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await axios.get(`${API_CONFIG.BASE_URL}/tradies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setTradies(response.data);
      } else {
        setTradies([]);
      }
    } catch (err: any) {
      console.error("Fetch tradies error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch tradies list. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load user profile details
    const savedUserStr = localStorage.getItem("user");
    if (savedUserStr) {
      try {
        setUser(JSON.parse(savedUserStr));
      } catch (e) {
        console.error("Error parsing user profile data:", e);
      }
    }

    fetchTradies();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10 animate-in fade-in duration-500">
      
      {/* Welcome & Profile Section */}
      <ProfileCard user={user} />

      {/* Payment Summary Card */}
      <div className="w-full bg-[#090e14]/50 border border-white/5 rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-black uppercase tracking-[0.2em]">
              <CreditCard size={14} />
              Payment Overview
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Enfonica Billing Preview</h3>
              <p className="text-zinc-500 text-sm mt-1 max-w-2xl">
                Enfonica payment flow will be redirected from here once the portal is live. For now, this card shows your current billing status.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 rounded-3xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-orange-300 text-sm font-bold">
            <ShieldCheck size={18} />
            Ready to connect
      
          </div>
          <div className="rounded-3xl bg-white/5 border border-white/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Next Action</p>
            <p className="mt-3 text-sm font-black text-white">Redirect to Enfonica</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-zinc-400 text-sm leading-relaxed">
            Enfonica did payment will be redirected from there. This card is currently static and will be wired into the billing flow later.
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black uppercase tracking-wider text-black shadow-[0_10px_25px_rgba(249,115,22,0.15)] disabled:opacity-50"
            disabled
          >
            Proceed to payment
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Tradies Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              Registered Tradies
              {!isLoading && !error && (
                <span className="text-xs bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20 font-mono">
                  {tradies.length}
                </span>
              )}
            </h2>
            <p className="text-zinc-500 text-xs font-medium mt-0.5">
              Manage your active operators and phone channel configurations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTradies}
            disabled={isLoading}
            className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-2xl text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw size={18} className={`${isLoading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={onRegisterClick}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-[0_10px_25px_rgba(249,115,22,0.15)] hover:translate-y-[-1px] active:scale-[0.985] uppercase tracking-wider"
          >
            <Plus size={16} className="stroke-[3]" />
            Register a new tradie
          </button>
        </div>
      </div>

      {/* Grid Content / Loader / Error */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TradieCardSkeleton />
          <TradieCardSkeleton />
          <TradieCardSkeleton />
        </div>
      ) : error ? (
        <div className="bg-rose-500/5 border border-rose-500/25 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-white font-black text-lg">Unable to Load Tradies</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{error}</p>
          <button
            onClick={fetchTradies}
            className="bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-2.5 rounded-2xl text-sm text-white font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      ) : tradies.length === 0 ? (
        <div className="bg-[#090e14]/40 border border-white/5 rounded-[36px] p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mx-auto">
            <UserPlus size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-black text-xl">No Tradies Registered</h3>
            <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
              To start utilizing the call-routing and assistant automation features, add your first tradie partner.
            </p>
          </div>
          <button
            onClick={onRegisterClick}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-6 py-3.5 rounded-2xl text-sm font-black transition-all shadow-[0_10px_25px_rgba(249,115,22,0.15)] uppercase tracking-wider"
          >
            <Plus size={16} className="stroke-[3]" />
            Register Your First Tradie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          {tradies.map((tradie) => (
            <TradieCard key={tradie._id} tradie={tradie} />
          ))}
        </div>
      )}
    </div>
  );
}

function TradieCardSkeleton() {
  return (
    <div className="w-full bg-[#090e14]/50 border border-white/5 rounded-3xl p-6 min-h-[260px] flex flex-col justify-between animate-pulse">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/5" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-white/10 rounded w-2/3" />
            <div className="h-3 bg-white/5 rounded w-1/3" />
          </div>
        </div>
        <div className="space-y-2.5 pt-2">
          <div className="h-3 bg-white/5 rounded w-1/2" />
          <div className="h-3 bg-white/5 rounded w-3/4" />
        </div>
      </div>
      <div className="flex gap-2 pt-4 border-t border-white/5">
        <div className="h-5 bg-white/5 rounded-full w-16" />
        <div className="h-5 bg-white/5 rounded-full w-20" />
      </div>
    </div>
  );
}
