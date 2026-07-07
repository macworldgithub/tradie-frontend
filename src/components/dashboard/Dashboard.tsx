import { useState, useEffect, useRef } from "react";
import { Plus, UserPlus, RefreshCw, AlertTriangle, Users, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "../../config/apiConfig";
import ProfileCard from "./ProfileCard";
import TradieCard from "./TradieCard";
import toast from "react-hot-toast";

interface Tradie {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  companyId: string;
  notificationPreference: string;
  callReceivedOn: string;
  createdAt: string;
  updatedAt: string;
  isMapped?: boolean;
}

interface DashboardProps {
  onRegisterClick: () => void;
}

export default function Dashboard({ onRegisterClick }: DashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [tradies, setTradies] = useState<Tradie[]>([]);
  const [companyDetails, setCompanyDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [companyDidNumber, setCompanyDidNumber] = useState<string | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

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

  const fetchCompanyDetails = async (companyId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_CONFIG.BASE_URL}/admin/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanyDetails(res.data);
    } catch (err: any) {
      console.error("Fetch company details error:", err);
      setCompanyDetails(null);
    }
  };

  const handleCreateCheckout = async () => {
    setIsCreatingCheckout(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        setIsCreatingCheckout(false);
        return;
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/payments/create-checkout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else if (response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Failed to create checkout session.");
      }
    } catch (err: any) {
      console.error("Create checkout error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create checkout session.";
      toast.error(errorMessage);
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  useEffect(() => {
    const savedUserStr = localStorage.getItem("user");
    if (savedUserStr) {
      try {
        setUser(JSON.parse(savedUserStr));
      } catch (e) {
        console.error("Error parsing user profile data:", e);
      }
    }
  }, []);

  // Handle Stripe session sync on redirect
  const syncAttemptedRef = useRef(false);
  
  useEffect(() => {
    if (!user) return;

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    if (sessionId && !syncAttemptedRef.current) {
      syncAttemptedRef.current = true;
      const syncSession = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            await axios.post(
              `${API_CONFIG.BASE_URL}/payments/sync-session`,
              { session_id: sessionId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
          toast.success("Payment successful! Your subscription is now active.");
          
          // Refresh company details if user is already loaded
          const companyId = user.id || user._id || user.companyId || user.company;
          if (companyId) {
            fetchCompanyDetails(companyId);
          }
        } catch (err: any) {
          console.error("Failed to sync session:", err);
        } finally {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      };
      
      syncSession();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchTradies();
    const companyId = user.id || user._id || user.companyId || user.company;
    if (companyId) {
      fetchCompanyDetails(companyId);
    } else {
      setCompanyDetails(null);
    }
  }, [user]);

// compute daysRemaining and DID number when user, tradies or companies change
  useEffect(() => {
    if (!user) return;
    const userCompanyId = user.id || user._id || user.companyId || user.company || null;
    if (!userCompanyId) {
      setDaysRemaining(null);
      setCompanyDidNumber(null);
      return;
    }
    const hasMappedTradie = tradies.some((t) => t.companyId === userCompanyId && !!t.isMapped);
    setDaysRemaining(hasMappedTradie ? (companyDetails?.daysRemaining ?? null) : null);
    setCompanyDidNumber(
      companyDetails?.didNumber || companyDetails?.did?.didNumber || null
    );
  }, [user, tradies, companyDetails]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10 animate-in fade-in duration-500">
      
      {/* Welcome & Profile Section */}
      <ProfileCard user={user} daysRemaining={daysRemaining} didNumber={companyDidNumber} />

      {/* Payment Summary Card */}
      <div className="w-full bg-[#090e14]/50 border border-white/5 rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-black uppercase tracking-[0.2em]">
              <CreditCard size={14} />
          Billing and Payments
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Stripe Billing Preview</h3>
              <p className="text-zinc-500 text-sm mt-1 max-w-2xl">
                Securely manage your subscription, Payment methods, invoices, and billing details through our Stripe-powered billing portal.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 rounded-3xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-orange-300 text-sm font-bold">
            <ShieldCheck size={18} />
         Secure Billing Portal
      
          </div>
          {/* <div className="rounded-3xl bg-white/5 border border-white/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Next Action</p>
            <p className="mt-3 text-sm font-black text-white">Redirect to Stripe</p>
          </div> */}
        </div>

        <div className=" space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-zinc-400 text-sm leading-relaxed">
              Stripe payment portal is now available.
            </div>
           <button
  type="button"
  onClick={handleCreateCheckout}
  disabled={isCreatingCheckout}
  className={`inline-flex items-center justify-center gap-2 rounded-2xl md:px-3 sm:px-2 sm:text-xs py-3 md:text-sm font-black uppercase tracking-wider text-black transition-all ${
    isCreatingCheckout
      ? "bg-orange-500 opacity-50 cursor-not-allowed"
      : "bg-orange-500 hover:bg-orange-400 hover:translate-y-[-1px] active:scale-[0.98] shadow-[0_10px_25px_rgba(249,115,22,0.15)] hover:shadow-[0_10px_25px_rgba(249,115,22,0.3)]"
  }`}
>
  {isCreatingCheckout ? "Loading..." : "Manage Billing"}
  {!isCreatingCheckout && <ArrowRight size={16} />}
</button>
          </div>
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
          
          {/* <button
            onClick={onRegisterClick}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-[0_10px_25px_rgba(249,115,22,0.15)] hover:translate-y-[-1px] active:scale-[0.985] uppercase tracking-wider"
          >
            <Plus size={16} className="stroke-[3]" />
            Register a new tradie
          </button> */}
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
            <TradieCard key={tradie._id} tradie={tradie} onDelete={fetchTradies} />
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
