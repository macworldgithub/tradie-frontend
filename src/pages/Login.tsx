import { useState } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

interface LoginProps {
  onBack: () => void;
  onSuccess: (user: any, token: string) => void;
  onForgotPassword: () => void;
  onSignup: () => void;
  initialRole?: 'company' | 'admin';
}

export default function Login({ onBack, onSuccess, onForgotPassword, onSignup, initialRole = 'company' }: LoginProps) {
  const [role, setRole] = useState<'company' | 'admin'>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (role === 'admin' && email.trim().toLowerCase() !== 'burhanfani92@gmail.com') {
      toast.error("Only the admin email is authorized for admin login");
      setIsSubmitting(false);
      return;
    }

    if (role === 'company' && email.trim().toLowerCase() === 'burhanfani92@gmail.com') {
      toast.error("This email is not assosiated with company");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await authService.login({ email, password });
      if (res.accessToken) {
        onSuccess(res.user, res.accessToken);
      } else {
        const msg = res.message || res.error || "Invalid email or password";
        if (msg.toLowerCase().includes("not associated") || msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("no company")) {
          toast.error("This email is not associated with the company");
        } else {
          setError(msg);
        }
      }
    } catch (err: any) {
      const msg = err.message || "An error occurred during login";
      if (msg.toLowerCase().includes("not associated") || msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("no company")) {
        toast.error("This email is not associated with the company");
      } else {
        setError(msg);
      }
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
            <img src={logo} alt="Logo" className="h-20 w-auto" />
          </div>
        </div>
      </header>

      <main className="w-full max-w-md px-6 pt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-10">
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-black tracking-tighter">
              {role === 'admin' ? "Admin Portal" : "Welcome Back"}
            </h2>
            <p className="text-zinc-500 font-medium tracking-wide">
              {role === 'admin' ? "Sign in to manage systems & companies." : "Sign in to manage your AI agent."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex bg-[#12181e] p-1 rounded-xl border border-white/5 mb-8">
              <button
                type="button"
                onClick={() => {
                  setRole('company');
                  setError(null);
                }}
                className={`flex-1 py-3 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 ${role === 'company'
                    ? 'bg-[#f97316] text-black shadow-lg shadow-orange-500/10'
                    : 'text-zinc-400 hover:text-white'
                  }`}
              >
                Company Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setError(null);
                }}
                className={`flex-1 py-3 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 ${role === 'admin'
                    ? 'bg-[#f97316] text-black shadow-lg shadow-orange-500/10'
                    : 'text-zinc-400 hover:text-white'
                  }`}
              >
                Admin Portal
              </button>
            </div>

            <div className="space-y-4">
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
                  placeholder={role === 'admin' ? "admin@example.com" : "jon@plumbing.com.au"}
                  className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2 text-orange-500">
                    <Lock size={14} />
                    <label className="text-[10px] font-black uppercase tracking-widest">
                      Password
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    {role !== 'admin' && (
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-orange-500 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>



            {error && (
              <p className="text-red-500 text-xs font-bold text-center">
                {error}
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
                "Sign In"
              )}
            </button>
          </form>


          {role !== 'admin' && (
            <p className="text-center text-zinc-500 text-xs font-medium">
              Don't have an account?{" "}
              <button
                onClick={onSignup}
                className="text-orange-500 font-bold hover:underline"
              >
                Sign up now
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
