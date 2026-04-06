import { useState } from "react";
import {
  ArrowLeft,
  User,
  Briefcase,
  FileText,
  Mail,
  Hammer,
  Phone,
  Clock,
  Check,
  MessageSquare,
  Plus,
} from "lucide-react";

interface SignupProps {
  onBack: () => void;
}

export default function Signup({ onBack }: SignupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    acn: "",
    trade: "",
    mobile: "",
    portMobile: false,
    wantGeo: false,
    portGeo: false,
    geoNumber: "",
    openingTime: "07:00 AM",
    closingTime: "06:00 PM",
    secondarySMS: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const steps = [
    { id: 1, label: "Your Details", icon: <User size={16} /> },
    { id: 2, label: "Your Trade", icon: <Hammer size={16} /> },
    { id: 3, label: "Number Setup", icon: <Phone size={16} /> },
    { id: 4, label: "Hours & Delivery", icon: <Clock size={16} /> },
    { id: 5, label: "Confirm", icon: <Check size={16} /> },
  ];

  const trades = [
    "Plumber",
    "Electrician",
    "Carpenter",
    "HVAC Technician",
    "Locksmith",
    "Painter",
    "Roofer",
    "General Tradesperson",
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep((prev) => prev - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#03070b] text-white flex flex-col items-center">
      {/* HEADER BAR */}
      <header className="w-full px-6 py-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={prevStep}
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

        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
          Step {step}/5
        </span>
      </header>

      {/* STEPPER NAVIGATION */}
      <div className="w-full max-w-3xl mt-12 mb-16 overflow-x-auto no-scrollbar px-6">
        <div className="flex items-center justify-between min-w-[500px] relative">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 pb-4 border-b-2 transition-all cursor-pointer z-10 ${
                step === s.id
                  ? "border-orange-500 text-orange-500"
                  : step > s.id
                    ? "border-emerald-500 text-emerald-500"
                    : "border-transparent text-zinc-600"
              }`}
            >
              {step > s.id ? <Check size={16} /> : s.icon}
              <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
                {s.label}
              </span>
            </div>
          ))}
          {/* BACKGROUND LINE */}
          <div className="absolute bottom-4 left-0 w-full h-[2px] bg-white/5 -z-10" />
        </div>
      </div>

      {/* FORM CONTAINER */}
      <main className="w-full max-w-2xl px-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* STEP 1: YOUR DETAILS */}
        {step === 1 && (
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter">
                Your Details
              </h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                Tell us about yourself and your business.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <InputField
                label="Your Name"
                value={formData.name}
                icon={<User size={14} />}
                placeholder="Jon Smith"
                onChange={(v: string) => handleInputChange("name", v)}
              />
              <InputField
                label="Company Name"
                value={formData.company}
                icon={<Briefcase size={14} />}
                placeholder="Jon's Plumbing"
                onChange={(v: string) => handleInputChange("company", v)}
              />
              <InputField
                label="ACN (optional)"
                value={formData.acn}
                icon={<FileText size={14} />}
                placeholder="123 456 789"
                highlight
                onChange={(v: string) => handleInputChange("acn", v)}
              />
              <InputField
                label="Email"
                value={formData.email}
                icon={<Mail size={14} />}
                placeholder="jon@plumbing.com.au"
                onChange={(v: string) => handleInputChange("email", v)}
              />
            </div>
          </div>
        )}

        {/* STEP 2: YOUR TRADE */}
        {step === 2 && (
          <div className="space-y-10 text-center sm:text-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter">
                What Trade Are You?
              </h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                This helps Bele.Ai qualify callers and check they need the right
                trade.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trades.map((t) => (
                <button
                  key={t}
                  onClick={() => setFormData({ ...formData, trade: t })}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                    formData.trade === t
                      ? "border-orange-500 bg-orange-500/5 text-orange-500"
                      : "border-white/5 bg-[#090e14] text-zinc-500 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Hammer
                      size={18}
                      className={
                        formData.trade === t
                          ? "text-orange-500"
                          : "text-zinc-700 group-hover:text-zinc-400"
                      }
                    />
                    <span className="font-bold tracking-tight">{t}</span>
                  </div>
                  {formData.trade === t && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: NUMBER SETUP */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter">
                Number Setup
              </h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                Your mobile number and optional geographic (landline) number.
              </p>
            </div>
            <div className="space-y-4">
              <InputField
                label="Mobile Number"
                value={formData.mobile}
                icon={<Phone size={14} />}
                placeholder="0412 345 678"
                onChange={(v: string) => handleInputChange("mobile", v)}
              />

              <div
                onClick={() =>
                  setFormData({ ...formData, portMobile: !formData.portMobile })
                }
              >
                <CheckboxField
                  checked={formData.portMobile}
                  label="Port this mobile number?"
                  sub="CAT-A port typically takes 24-48 hours"
                />
              </div>

              <div className="border-t border-white/5" />

              <div
                onClick={() =>
                  setFormData({ ...formData, wantGeo: !formData.wantGeo })
                }
              >
                <CheckboxField
                  checked={formData.wantGeo}
                  label="Do you want a Geo (landline) number?"
                  sub="e.g. 02 XXXX XXXX for a local presence"
                />
              </div>

              {formData.wantGeo && (
                <div className="pl-4 space-y-4 border-l-2 border-orange-500/20 animate-in slide-in-from-left-4 pt-1">
                  <div
                    onClick={() =>
                      setFormData({ ...formData, portGeo: !formData.portGeo })
                    }
                  >
                    <CheckboxField
                      checked={formData.portGeo}
                      label="Port an existing Geo number"
                    />
                  </div>
                  <InputField
                    label="Existing Geo Number"
                    value={formData.geoNumber}
                    icon={<Plus size={14} />}
                    placeholder="02 XXXX XXXX"
                    onChange={(v: string) => handleInputChange("geoNumber", v)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: HOURS & DELIVERY */}
        {step === 4 && (
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter">
                Working Hours & Delivery
              </h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                Set your business hours so Bele.Ai can greet callers differently
                after hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField
                label="Opening Time"
                value={formData.openingTime}
                icon={<Clock size={14} />}
                placeholder="07:00 AM"
                onChange={(v: string) => handleInputChange("openingTime", v)}
              />
              <InputField
                label="Closing Time"
                value={formData.closingTime}
                icon={<Clock size={14} />}
                placeholder="06:00 PM"
                onChange={(v: string) => handleInputChange("closingTime", v)}
              />
            </div>

            <InputField
              label="Secondary SMS Delivery (optional)"
              value={formData.secondarySMS}
              icon={<MessageSquare size={14} />}
              placeholder="111XXXXXXXX"
              subLabel="A copy of each lead SMS will also be sent to this number (e.g. partner fielding calls)."
              highlight
              onChange={(v: string) => handleInputChange("secondarySMS", v)}
            />

            <div className="p-6 bg-[#090e14] border border-orange-500/20 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-orange-500">
                <Briefcase size={16} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Payment
                </span>
              </div>
              <p className="text-zinc-500 text-sm font-medium">
                Payment details would be collected here. Upfront payment
                required before activation.
              </p>
              <p className="text-[#ff3b3b] text-[10px] font-black uppercase tracking-widest">
                (Demo only — no payment processing)
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION */}
        {step === 5 && (
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter">
                Confirm & Sign Up
              </h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                Review your details and accept the terms.
              </p>
            </div>

            <div className="bg-[#090e14] border border-white/5 p-10 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-zinc-600 mb-2 justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Your Details
                </span>
              </div>
              <div className="space-y-4">
                <SummaryItem label="Name" value={formData.name || "—"} />
                <SummaryItem label="Company" value={formData.company || "—"} />
                <SummaryItem label="Email" value={formData.email || "—"} />
                <SummaryItem label="Trade" value={formData.trade || "—"} />
                <SummaryItem
                  label="Mobile"
                  value={`${formData.mobile || "—"} ${formData.portMobile ? "(porting)" : ""}`}
                />
                <SummaryItem
                  label="Hours"
                  value={`${formData.openingTime} — ${formData.closingTime}`}
                />
              </div>
            </div>

            <div
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={`bg-[#090e14] border p-4 rounded-2xl flex items-start gap-4 transition-all group cursor-pointer ${
                agreedToTerms
                  ? "border-orange-500/50 bg-orange-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  agreedToTerms
                    ? "bg-orange-500 border-orange-500"
                    : "border-white/20 group-hover:border-white/40"
                }`}
              >
                {agreedToTerms && (
                  <Check size={16} className="text-black stroke-[4]" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-white font-bold text-sm">
                  I agree to the Terms and Conditions
                </p>
                <p className="text-zinc-500 text-[10px] leading-relaxed">
                  Including payment terms, porting authorisation (if
                  applicable), and Bele.Ai service agreement.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: SUCCESS */}
        {step === 6 && (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-10 animate-in fade-in zoom-in-95 duration-1000">
            {/* SUCCESS ICON */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                <Check size={48} className="text-emerald-500" />
              </div>
              <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full -z-10" />
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
                You're All Set!
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base max-w-md leading-relaxed font-medium">
                In a real sign-up, you'd receive a confirmation email at <br />
                <span className="text-white font-bold tracking-tight">
                  {formData.email}
                </span>{" "}
                <br />
                and your Bele.Ai agent would be activated immediately.
              </p>
            </div>

            {/* MINI SUMMARY BOX */}
            <div className="w-full max-w-sm bg-[#090e14]/50 border border-white/5 p-8 rounded-3xl text-left space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
                Summary
              </span>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">
                    Business:
                  </span>
                  <span className="text-white font-black">
                    {formData.company}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">
                    Trade:
                  </span>
                  <span className="text-white font-black">
                    {formData.trade}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">
                    Mobile:
                  </span>
                  <span className="text-white font-black">
                    {formData.mobile}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">
                    Hours:
                  </span>
                  <span className="text-white font-black">
                    {formData.openingTime} — {formData.closingTime}
                  </span>
                </div>
              </div>
            </div>

            {/* FINAL BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-xl text-lg font-black transition-all group">
                Try the Demo
                <ArrowLeft className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onBack}
                className="w-full sm:w-auto border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-xl text-lg font-black transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* GLOBAL ACTIONS - Hidden on Success screen */}
        {step < 6 && (
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors text-sm font-black uppercase tracking-widest group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back
            </button>

            <button
              onClick={nextStep}
              disabled={step === 5 && !agreedToTerms}
              className={`flex items-center gap-2 px-10 py-3 rounded-2xl text-lg font-black transition-all duration-300 shadow-xl hover:scale-[1.03] active:scale-95 group ${
                step === 5
                  ? agreedToTerms
                    ? "bg-[#10b981] text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                    : "bg-[#12181e] text-zinc-700 border border-white/5 cursor-not-allowed opacity-50"
                  : "bg-orange-500 text-black shadow-orange-500/20 hover:bg-orange-400"
              }`}
            >
              {step === 5 ? <Check size={20} className="stroke-[3]" /> : null}
              {step === 5 ? "Complete Sign Up" : "Next"}
              {step !== 5 && (
                <ArrowLeft className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function InputField({
  label,
  value,
  icon,
  placeholder,
  highlight = false,
  subLabel,
  onChange,
}: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-orange-500">
        {icon}
        <label className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </label>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#12181e] border rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500 transition-all ${
          highlight
            ? "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.05)]"
            : "border-white/5"
        }`}
      />
      {subLabel && (
        <p className="text-zinc-600 text-[10px] font-medium leading-relaxed">
          {subLabel}
        </p>
      )}
    </div>
  );
}

function CheckboxField({ checked, label, sub }: any) {
  return (
    <div className="bg-[#090e14] border border-white/5 p-6 rounded-2xl flex items-center gap-5 transition-all hover:border-white/10 group cursor-pointer">
      <div
        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border-2 transition-colors ${
          checked ? "bg-orange-500 border-orange-500" : "border-white/10"
        }`}
      >
        {checked && <Check size={16} className="text-black" />}
      </div>
      <div className="space-y-0.5">
        <p className="text-white font-bold text-sm tracking-tight">{label}</p>
        {sub && (
          <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest opacity-60">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: any) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4">
      <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
        {label}:
      </span>
      <span className="text-white font-black tracking-tight">{value}</span>
    </div>
  );
}
