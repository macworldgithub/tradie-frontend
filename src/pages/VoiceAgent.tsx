import { useState } from "react";
import { LogOut, Lock, ChevronDown, Eye, EyeOff } from "lucide-react";
import Dashboard from "../components/dashboard/Dashboard";
import RegisterTradieForm from "../components/dashboard/RegisterTradieForm";
import StripePayment from "./StripePayment";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

interface VoiceAgentProps {
  onLogout: () => void;
}

export default function VoiceAgent({ onLogout }: VoiceAgentProps) {
  const [view, setView] = useState<"dashboard" | "register" | "payment">("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsChangingPassword(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      setIsChangingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      setIsChangingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      setIsChangingPassword(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPasswordError("Your session has expired. Please login again.");
      setIsChangingPassword(false);
      return;
    }

    try {
      const res = await authService.changePassword(currentPassword, newPassword, token);
      if (res.message) {
        setPasswordSuccess(res.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success(res.message);
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setIsDropdownOpen(false);
        }, 2000);
      } else {
        setPasswordError(res.error || res.message || "Failed to change password.");
      }
    } catch (err: any) {
      setPasswordError(err.message || "An error occurred while changing password.");
    } finally {
      setIsChangingPassword(false);
    }
  };


  if (view === "payment") {
    return <StripePayment onBack={() => setView("dashboard")} />;
  }

  if (view === "register") {
    return <RegisterTradieForm onBack={() => setView("dashboard")} />;
  }

  return (
    <div className="fixed inset-0 bg-[#03070b] text-white flex flex-col font-jakarta z-50">
      {/* BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      {/* NAVBAR */}
      <nav className="w-full h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#03070b]/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-orange-500 font-bold">~</span>
            <span className="text-white font-black tracking-tighter uppercase text-sm">
              TRADIE
            </span>
            <span className="text-orange-500 font-black tracking-tighter uppercase text-sm">
              DASHBOARD
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 text-zinc-400 hover:text-orange-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            My Profile
            <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f151c] border border-white/10 rounded-2xl shadow-lg z-50">
              <button
                onClick={() => {
                  setIsPasswordModalOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-zinc-300 hover:text-orange-400 hover:bg-orange-500/10 transition-all text-sm font-bold text-left rounded-t-2xl border-b border-white/5"
              >
                <Lock size={14} />
                Change Password
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-zinc-300 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-bold text-left rounded-b-2xl"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>

      
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 relative overflow-y-auto">
        <Dashboard
          onRegisterClick={() => setView("register")}
          onPaymentClick={() => setView("payment")}
        />
          {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" onClick={() => setIsPasswordModalOpen(false)}>
            <div className="bg-[#0a0f17] border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white">Change Password</h3>
                  <p className="text-zinc-400 text-sm mt-2">Update your account password securely.</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Current Password</span>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full rounded-xl border border-white/10 bg-[#090e14] px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">New Password</span>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full rounded-xl border border-white/10 bg-[#090e14] px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Confirm Password</span>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full rounded-xl border border-white/10 bg-[#090e14] px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </label>

                  {passwordError && (
                    <p className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{passwordError}</p>
                  )}

                  {passwordSuccess && (
                    <p className="text-emerald-500 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">{passwordSuccess}</p>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-black transition-all hover:bg-orange-400 disabled:opacity-50"
                    >
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full h-10 bg-black/50 border-t border-white/5 px-6 flex items-center justify-between font-mono text-[9px] font-black tracking-[0.2em] text-zinc-700 shrink-0 mt-auto">
        <div>TRADIE DASHBOARD</div>
        <div className="text-orange-500/30">OmniSuite AI</div>
      </footer>
    </div>
  );
}