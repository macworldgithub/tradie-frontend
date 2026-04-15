import { useState } from "react";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { authService } from "../services/authService";

interface ChangePasswordProps {
  onBack: () => void;
  token: string;
}

export default function ChangePassword({ onBack, token }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await authService.changePassword(matchPassword(currentPassword, newPassword) ? currentPassword : currentPassword, newPassword, token);
      if (res.message === "Password changed successfully") {
        setMessage(res.message);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setError(res.message || "Failed to change password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const matchPassword = (p1: string, p2: string) => p1 === p2;

  return (
    <div className="min-h-screen bg-[#03070b] text-white flex flex-col items-center">
      <header className="w-full px-6 py-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tighter">JUST</span>
            <div className="border border-orange-500/50 px-2 py-0.5 rounded-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#f97316]">
                Tradie Mobile
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-md px-6 pt-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-10">
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-black tracking-tighter">
              Change Password
            </h2>
            <p className="text-zinc-500 font-medium tracking-wide">
              Update your account password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-500">
                  <Lock size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">
                    Current Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-500">
                  <Lock size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">
                    New Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold text-center">
                {error}
              </p>
            )}

            {message && (
              <p className="text-emerald-500 text-xs font-bold text-center bg-emerald-500/10 py-3 rounded-lg border border-emerald-500/20">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-xl text-lg font-black transition-all shadow-xl shadow-orange-500/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
