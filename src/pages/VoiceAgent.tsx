import { useState } from "react";
import { ArrowLeft, User, Phone, Mail, Bell, MapPin, CheckCircle } from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";


interface TradieFormProps {
  onBack: () => void;
}

interface CreatedTradie {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  companyId: string;
  notificationPreference: string;
  callMode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function TradieForm({ onBack }: TradieFormProps) {
  const [step, setStep] = useState<"tradie" | "did">("tradie");
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    notificationPreference: "email",
    callMode: "geo",
  });

  const [createdTradie, setCreatedTradie] = useState<CreatedTradie | null>(null);
  const [didFormData, setDidFormData] = useState({
    didNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [didSubmitting, setDidSubmitting] = useState(false);
  const [didSubmitStatus, setDidSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [didMessage, setDidMessage] = useState("");

  const BASE_URL = API_CONFIG.BASE_URL;
const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDidFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTradieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        `${BASE_URL}/tradies`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Tradie Registration Success:", response.data);
      setSubmitStatus("success");
      setMessage("Tradie registered successfully! 🎉");

      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        notificationPreference: "email",
        callMode: "geo",
      });

      setCreatedTradie(response.data);
      setTimeout(() => {
        setSubmitStatus("idle");
        setMessage("");
      }, 3000);

      setStep("did");
    } catch (error: any) {
      console.error("Tradie Registration Error:", error.response?.data || error.message);
      setSubmitStatus("error");
      setMessage(error.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!didFormData.didNumber.trim()) {
      setDidSubmitStatus("error");
      setDidMessage("Please enter a DID number before submitting.");
      return;
    }

    if (!createdTradie) {
      setDidSubmitStatus("error");
      setDidMessage("No tradie available for assignment. Please register a tradie first.");
      return;
    }

    setDidSubmitting(true);
    setDidSubmitStatus("idle");
    setDidMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const body: Record<string, unknown> = {
        didNumber: didFormData.didNumber,
        assignedTradieId: createdTradie._id,
      };

      const response = await axios.post(`${BASE_URL}/dids`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("DID Creation Success:", response.data);
      setDidSubmitStatus("success");
      setDidMessage("DID created successfully! 🎉");
      setDidFormData({ didNumber: "" });
    } catch (error: any) {
      console.error("DID Creation Error:", error.response?.data || error.message);
      setDidSubmitStatus("error");
      setDidMessage(error.response?.data?.message || "Failed to create DID. Please try again.");
    } finally {
      setDidSubmitting(false);
    }
  };

  const renderTradieForm = () => (
    <form onSubmit={handleTradieSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <User size={16} /> Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="John Smith"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <Phone size={16} /> Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="+61412345678"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <Mail size={16} /> Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="john@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <Bell size={16} /> Notification Preference
        </label>
        <select
          name="notificationPreference"
          value={formData.notificationPreference}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="both">Both Email &amp; SMS</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <MapPin size={16} /> Call Mode
        </label>
        <select
          name="callMode"
          value={formData.callMode}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
        >
          <option value="geo">Geo</option>
          <option value="ussd">USSD</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-8 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-black px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:translate-y-[-1px] active:scale-[0.985] uppercase tracking-widest flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>Processing...</>
        ) : submitStatus === "success" ? (
          <>
            <CheckCircle size={20} /> Registered Successfully
          </>
        ) : (
          "REGISTER TRADIE"
        )}
      </button>

      {message && (
        <div
          className={`text-center text-sm font-medium p-4 rounded-2xl border ${
            submitStatus === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );

  const renderDidForm = () => (
    <form onSubmit={handleDidSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <Phone size={16} /> DID Number
        </label>
        <input
          type="text"
          name="didNumber"
          value={didFormData.didNumber}
          onChange={handleDidChange}
          required
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="+61468112021"
        />
      </div>

      {!createdTradie ? (
        <div className="text-sm text-zinc-400">No tradie data available. Please complete tradie registration first.</div>
      ) : (
        <div className="space-y-4 p-4 rounded-3xl border border-white/10 bg-zinc-950/80">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-zinc-500">Name</p>
              <p className="mt-2 text-sm text-white">{createdTradie.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500">Phone</p>
              <p className="mt-2 text-sm text-white">{createdTradie.phoneNumber}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500">Email</p>
              <p className="mt-2 text-sm text-white">{createdTradie.email}</p>
            </div>
            {/* <div>
              <p className="text-xs uppercase text-zinc-500">Company ID</p>
              <p className="mt-2 text-sm text-white">{createdTradie.companyId}</p>
            </div> */}
            <div>
                <p className="text-xs uppercase text-zinc-500">Notification</p>
                <p className="mt-2 text-sm text-white">  {capitalize(createdTradie.notificationPreference)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500">Call Mode</p>
              <p className="mt-2 text-sm text-white">  {capitalize(createdTradie.callMode)}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={didSubmitting || !createdTradie}
        className="w-full mt-4 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-black px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:translate-y-[-1px] active:scale-[0.985] uppercase tracking-widest flex items-center justify-center gap-3"
      >
        {didSubmitting ? (
          <>Assigning DID...</>
        ) : didSubmitStatus === "success" ? (
          <>
            <CheckCircle size={20} /> DID Created
          </>
        ) : (
          "CREATE DID"
        )}
      </button>

      {didMessage && (
        <div
          className={`text-center text-sm font-medium p-4 rounded-2xl border ${
            didSubmitStatus === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          {didMessage}
        </div>
      )}
    </form>
  );

  return (
    <div className="fixed inset-0 bg-[#03070b] text-white flex flex-col font-jakarta z-50">
      {/* BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      {/* NAVBAR */}
      <nav className="w-full h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#03070b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-zinc-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-orange-500 font-bold">~</span>
            <span className="text-white font-black tracking-tighter uppercase text-sm">
              {step === "tradie" ? "TRADIE" : "DID"}
            </span>
            <span className="text-orange-500 font-black tracking-tighter uppercase text-sm">
              {step === "tradie" ? "REGISTRATION" : "ASSIGNMENT"}
            </span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
        <div className="w-full max-w-lg bg-[#090e14]/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-4">
                <User size={32} className="text-orange-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                {step === "tradie" ? "Register as a Tradie" : "Create a DID"}
              </h1>
              <p className="text-zinc-500 text-sm">
                {step === "tradie"
                  ? "Fill in your details to get started with Tradie platform"
                  : "Assign a DID to the newly created tradie with /dids."}
              </p>
            </div>

            {step === "tradie" ? renderTradieForm() : renderDidForm()}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full h-10 bg-black/50 border-t border-white/5 px-6 flex items-center justify-between font-mono text-[9px] font-black tracking-[0.2em] text-zinc-700">
        <div>{step === "tradie" ? "TRADIE REGISTRATION" : "DID ASSIGNMENT"}</div>
        <div className="text-orange-500/30">OmniSuite AI</div>
      </footer>
    </div>
  );
}