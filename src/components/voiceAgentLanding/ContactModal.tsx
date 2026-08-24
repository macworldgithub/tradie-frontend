import { useState } from "react";
import { Send, CheckCircle, AlertTriangle, X } from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "../../config/apiConfig";
import { trackPixelEvent } from "../../utils/pixel";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThankYou?: () => void;
}

export default function ContactModal({ isOpen, onClose, onThankYou }: ContactModalProps) {
  const defaultPhoneCode = Intl.DateTimeFormat().resolvedOptions().timeZone.includes("Auckland") || Intl.DateTimeFormat().resolvedOptions().timeZone.includes("Pacific") ? "+64" : "+61";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: defaultPhoneCode,
    phoneNumber: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      await axios.post(`${API_CONFIG.BASE_URL}/contact-form`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      trackPixelEvent("Lead", {
        content_name: "Voice Agent Contact Modal Inquiry",
        email: formData.email,
      });
      setFormData({ firstName: "", lastName: "", email: "", phoneCode: defaultPhoneCode, phoneNumber: "", message: "" });
      if (onThankYou) {
        onThankYou();
      } else {
        setSubmitStatus("success");
        setSubmitMessage("Your message has been sent successfully!");
        setTimeout(() => {
          setSubmitStatus("idle");
          onClose();
        }, 3000);
      }
    } catch (err: any) {
      setSubmitStatus("error");
      setSubmitMessage(
        err.response?.data?.message || "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#090e14] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle Glow */}
        <div className="absolute top-0 right-0 bg-orange-500/10 blur-[80px] w-full h-full rounded-full pointer-events-none -z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  name="phoneCode"
                  value={formData.phoneCode}
                  onChange={handleChange}
                  className="bg-[#12181e] border border-white/5 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm w-[90px] sm:w-[100px]"
                >
                  <option value="+61">+61</option>
                  <option value="+64">+64</option>
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="412 345 678"
                  className="flex-1 bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Message <span className="normal-case font-normal text-zinc-500">(Optional)</span>
              </label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none text-sm"
              />
            </div>

            {submitStatus !== "idle" && (
              <div
                className={`flex items-center gap-2 text-sm font-bold p-3.5 rounded-xl ${submitStatus === "success"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
              >
                {submitStatus === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-8 py-3.5 rounded-xl text-base font-black transition-all duration-300 shadow-[0_5px_20px_rgba(249,115,22,0.2)] hover:scale-[1.01] mt-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {!isSubmitting && <Send size={16} strokeWidth={2.5} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
