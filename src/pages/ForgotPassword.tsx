import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { authService } from "../services/authService";

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await authService.forgotPassword(email);
      if (res.message) {
        setMessage(res.message);
      } else {
        setError("Failed to send reset link");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Forgot Password
            </h2>
            <p className="text-zinc-500 font-medium tracking-wide">
              Enter your email and we'll send you a new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-orange-500">
                <Mail size={14} />
                <label className="text-[10px] font-black uppercase tracking-widest">
                  Email Address
                </label>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jon@plumbing.com.au"
                className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500 transition-all"
              />
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
              disabled={isSubmitting || message !== null}
              className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-xl text-lg font-black transition-all shadow-xl shadow-orange-500/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
