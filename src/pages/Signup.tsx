// import { useState, useEffect, useRef } from "react";
// import {
//   ArrowLeft,
//   User,
//   Briefcase,
//   FileText,
//   Mail,
//   Hammer,
//   Phone,
//   Clock,
//   Check,
//   Info,
// } from "lucide-react";
// import { authService } from "../services/authService";
// import logo from "../assets/logo.png";
// import Select from "react-select";

// interface SignupProps {
//   onBack: () => void;
//   onSuccess?: (user: any, token: string) => void;
//   onGoToLogin?: () => void;
// }

// export default function Signup({ onBack, onGoToLogin }: SignupProps) {
//   const [step, setStep] = useState(1);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [showMobileInfo, setShowMobileInfo] = useState(false);
//   const [showCityInfo, setShowCityInfo] = useState(false);
//   const [formData, setFormData] = useState(() => {
//     const saved = localStorage.getItem("signupFormData");
//     if (saved) {
//       try {
//         return JSON.parse(saved);
//       } catch (e) {
//         // ignore error
//       }
//     }
//     return {
//       name: "",
//       company: "",
//       email: "",
//       password: "",
//       acn: "",
//       trade: "",
//       mobile: "",
//       setBusinessHours: true,
//       openingTime: "07:00", // 24-hour format
//       closingTime: "18:00", // 24-hour format
//       notificationPreference: "both",
//       callReceivedOn: "mobile",
//       country: "AU",
//       cityCode: "",
//     };
//   });

//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   //@ts-ignore
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const steps = [
//     { id: 1, label: "Your Details", icon: <User size={16} /> },
//     { id: 2, label: "Your Trade", icon: <Hammer size={16} /> },
//     { id: 3, label: "Number Setup", icon: <Phone size={16} /> },
//     { id: 4, label: "Delivery", icon: <Clock size={16} /> },
//     { id: 5, label: "Confirm", icon: <Check size={16} /> },
//     { id: 6, label: "Verify", icon: <Mail size={16} /> },
//   ];

//   const trades = [
//     "Plumber",
//     "Electrician",
//     "Carpenter",
//     "HVAC Technician",
//     "Locksmith",
//     "Painter",
//     "Roofer",
//     "General Tradesperson",
//     "Pest Control",
//   ];

//   const australianCityOptions = [
//     {
//       group: "Australian Capital Territory (ACT)",
//       options: [{ value: "ACT-CANBERRA", label: "Canberra" }],
//     },
//     {
//       group: "New South Wales (NSW)",
//       options: [
//         { value: "NSW-SYDNEY", label: "Sydney" },
//         { value: "NSW-NEWCASTLE", label: "Newcastle" },
//         { value: "NSW-GOSFORD", label: "Gosford" },
//         { value: "NSW-NOWRA", label: "Nowra" },
//         { value: "NSW-CAMPBELLTOWN", label: "Campbelltown" },
//         { value: "NSW-PENRITH", label: "Penrith" },
//         { value: "NSW-TAREE", label: "Taree" },
//         { value: "NSW-COFFS-HARBOUR", label: "Coffs Harbour" },
//         { value: "NSW-ALBURY", label: "Albury" },
//       ],
//     },
//     {
//       group: "Queensland (QLD)",
//       options: [
//         { value: "QLD-BRISBANE", label: "Brisbane" },
//         { value: "QLD-CAIRNS", label: "Cairns" },
//         { value: "QLD-TOWNSVILLE", label: "Townsville" },
//         { value: "QLD-TOOWOOMBA", label: "Toowoomba" },
//         { value: "QLD-ROCKHAMPTON", label: "Rockhampton" },
//         { value: "QLD-MARYBOROUGH", label: "Maryborough" },
//         { value: "QLD-SOUTHPORT", label: "Southport" },
//         { value: "QLD-BEAUDESERT", label: "Beaudesert" },
//       ],
//     },
//     {
//       group: "Victoria (VIC)",
//       options: [
//         { value: "VIC-MELBOURNE", label: "Melbourne" },
//         { value: "VIC-GEELONG", label: "Geelong" },
//       ],
//     },
//     {
//       group: "South Australia (SA)",
//       options: [{ value: "SA-ADELAIDE", label: "Adelaide" }],
//     },
//     {
//       group: "Western Australia (WA)",
//       options: [
//         { value: "WA-PERTH", label: "Perth" },
//         { value: "WA-BUNBURY", label: "Bunbury" },
//         { value: "WA-PINJARRA", label: "Pinjarra" },
//       ],
//     },
//     {
//       group: "Tasmania (TAS)",
//       options: [
//         { value: "TAS-HOBART", label: "Hobart" },
//         { value: "TAS-LAUNCESTON", label: "Launceston" },
//       ],
//     },
//     {
//       group: "Northern Territory (NT)",
//       options: [{ value: "NT-DARWIN", label: "Darwin" }],
//     },
//   ];

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [otp, setOtp] = useState("");
//   const STRIPE_PENDING_TOKEN_KEY = "pendingStripeAuthToken";
//   const [hasRegisteredSuccess, setHasRegisteredSuccess] = useState(false);
//   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
//   const [isSyncingStripe, setIsSyncingStripe] = useState(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     return !!urlParams.get("session_id");
//   });
//   const [loginToken, setLoginToken] = useState<string | null>(() => {
//     return localStorage.getItem(STRIPE_PENDING_TOKEN_KEY);
//   });

//   useEffect(() => {
//     if (formData.callReceivedOn === "mobile") {
//       showMobileInfoMessage();
//     } else {
//       setShowMobileInfo(false);

//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     }

//     return () => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     };
//   }, [formData.callReceivedOn]);

//   const nextStep = () => {
//     setError(null);
//     const newErrors: Record<string, string> = {};
//     let isValid = true;

//     if (step === 1) {
//       if (!formData.name.trim()) {
//         newErrors.name = "Name is required";
//         isValid = false;
//       }
//       if (!formData.company.trim()) {
//         newErrors.company = "Company Name is required";
//         isValid = false;
//       }
//       if (!formData.email.trim()) {
//         newErrors.email = "Email is required";
//         isValid = false;
//       } else {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData.email)) {
//           newErrors.email = "Please enter a valid email address";
//           isValid = false;
//         }
//       }
//       if (!formData.password.trim()) {
//         newErrors.password = "Password is required";
//         isValid = false;
//       } else if (formData.password.length < 8) {
//         newErrors.password = "Password must be at least 8 characters";
//         isValid = false;
//       }
//       // City is required only for Australia
//       if (formData.country === "AU" && !formData.cityCode) {
//         newErrors.cityCode = "Please select a city";
//         isValid = false;
//       }
//     }

//     if (step === 2) {
//       if (!formData.trade) {
//         setError("Please select a trade");
//         isValid = false;
//       }
//     }

//     if (step === 3) {
//       if (!formData.mobile.trim()) {
//         newErrors.mobile = "Mobile number is required";
//         isValid = false;
//       }
//     }

//     setErrors(newErrors);

//     if (!isValid) return;

//     setStep((prev) => Math.min(prev + 1, 7));
//   };

//   const prevStep = () => {
//     if (hasRegisteredSuccess) return;
//     if (step === 1) onBack();
//     else setStep((prev) => prev - 1);
//   };

//   const handleSignup = async () => {
//     setIsSubmitting(true);
//     setError(null);
//     try {
//       const openingHours = formData.setBusinessHours
//         ? `${formData.openingTime}-${formData.closingTime} MON-FRI`
//         : "24/7";

//       const payload = {
//         customerName: formData.name,
//         companyName: formData.company,
//         acn: formData.acn,
//         email: formData.email,
//         password: formData.password,
//         trade: formData.trade,
//         mobileNumber: formData.mobile,

//         wantsGeoNumber: false,
//         geoNumberType: "NONE",
//         portingNumber: "",

//         openingHours,
//         paymentDetails: {},

//         country: formData.country,
//         notificationPreference: formData.notificationPreference,
//         callReceivedOn: formData.callReceivedOn,
//         cityCode: formData.country === "AU" ? formData.cityCode : "",
//       };

//       const res = await authService.register(payload);
//       if (res.userId) {
//         setHasRegisteredSuccess(true);
//         setStep(6);
//       } else {
//         setError(res.message || "Failed to register");
//       }
//     } catch (err) {
//       setError("An error occurred during signup");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     setIsSubmitting(true);
//     setError(null);
//     try {
//       const res = await authService.verifyOtp(formData.email, otp);
//       if (res.message === "Email verified successfully") {
//         await loginAfterSignup();
//       } else {
//         setError(res.message || "Invalid OTP");
//         console.log(res.message, "Error verifying OTP");
//       }
//     } catch (err) {
//       setError("An error occurred during verification");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const loginAfterSignup = async () => {
//     try {
//       const loginRes = await authService.login({
//         email: formData.email,
//         password: formData.password,
//       });

//       if (loginRes.accessToken) {
//         const token = loginRes.accessToken;
//         setLoginToken(token);
//         localStorage.setItem(STRIPE_PENDING_TOKEN_KEY, token);
//         localStorage.setItem("signupFormData", JSON.stringify(formData));
//         await processPaymentAndLogout(token);
//       } else {
//         console.error("Login failed after signup", loginRes);
//       }
//     } catch (loginErr) {
//       console.error("Error logging in after signup", loginErr);
//     }
//   };

//   const processPaymentAndLogout = async (token: string) => {
//     setIsPaymentProcessing(true);
//     setError(null);

//     try {
//       const checkoutRes = await authService.createCheckout(token);
//       const checkoutUrl = checkoutRes.url || checkoutRes.checkoutUrl;

//       if (!checkoutUrl) {
//         setError("Unable to start payment checkout.");
//         return;
//       }

//       window.location.href = checkoutUrl;
//     } catch (err: any) {
//       console.error("Payment checkout failed", err);
//       setError("Payment checkout failed. Please try again later.");
//     } finally {
//       setIsPaymentProcessing(false);
//     }
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const sessionId = urlParams.get("session_id");

//     if (!sessionId) {
//       setIsSyncingStripe(false);
//       return;
//     }
//     if (!loginToken) {
//       setIsSyncingStripe(false);
//       return;
//     }

//     // Clear session_id from URL to prevent re-running if other dependencies change
//     window.history.replaceState({}, document.title, window.location.pathname);

//     const syncStripe = async () => {
//       try {
//         await authService.syncSession(sessionId, loginToken);
//       } catch (err) {
//         console.error("Stripe session sync failed", err);
//       } finally {
//         localStorage.removeItem(STRIPE_PENDING_TOKEN_KEY);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("signupFormData");

//         setIsSyncingStripe(false);
//         setStep(7);

//         setTimeout(() => {
//           if (onGoToLogin) onGoToLogin();
//           else onBack();
//         }, 5000);
//       }
//     };

//     syncStripe();
//   }, [loginToken, onBack, onGoToLogin]);

//   const showMobileInfoMessage = () => {
//     setShowMobileInfo(true);

//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }

//     timerRef.current = setTimeout(() => {
//       setShowMobileInfo(false);
//     }, 5000);
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => {
//       if (field === "country" && value !== "AU") {
//         return { ...prev, [field]: value, cityCode: "" };
//       }

//       return { ...prev, [field]: value };
//     });

//     if (field === "password") {
//       if (value.length > 0 && value.length < 8) {
//         setErrors((prev) => ({
//           ...prev,
//           password: "Password must be at least 8 characters",
//         }));
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           password: "",
//         }));
//       }

//       return;
//     }

//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   if (isSyncingStripe) {
//     return (
//       <div className="min-h-screen bg-[#03070b] text-white flex flex-col items-center justify-center">
//         <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
//         <p className="mt-4 text-zinc-400 font-medium">Verifying payment...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#03070b] text-white flex flex-col items-center">
//       {/* HEADER BAR */}
//       <header className="w-full px-6 py-6 border-b border-white/5 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={prevStep}
//             disabled={hasRegisteredSuccess}
//             className={`flex items-center gap-2 transition-colors ${hasRegisteredSuccess ? "text-zinc-500 cursor-not-allowed" : "text-zinc-500 hover:text-white"}`}
//           >
//             <ArrowLeft
//               size={18}
//               className={
//                 hasRegisteredSuccess
//                   ? "transition-transform"
//                   : "group-hover:-translate-x-1 transition-transform"
//               }
//             />
//           </button>
//           <div className="flex items-center gap-2">
//             <img src={logo} alt="Logo" className="h-16 w-auto" />
//           </div>
//         </div>

//         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
//           Step {step}/5
//         </span>
//       </header>

//       {/* STEPPER NAVIGATION */}
//       <div className="w-full max-w-4xl mt-12 mb-16 overflow-x-auto no-scrollbar px-6">
//         <div className="flex items-center justify-between min-w-[500px] relative">
//           {steps.map((s) => (
//             <div
//               key={s.id}
//               className={`flex items-center gap-2 pb-4 border-b-2 transition-all cursor-pointer z-10 ${step === s.id
//                 ? "border-orange-500 text-orange-500"
//                 : step > s.id
//                   ? "border-emerald-500 text-emerald-500"
//                   : "border-transparent text-zinc-600"
//                 }`}
//             >
//               {step > s.id ? <Check size={16} /> : s.icon}
//               <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
//                 {s.label}
//               </span>
//             </div>
//           ))}
//           <div className="absolute bottom-4 left-0 w-full h-[2px] bg-white/5 -z-10" />
//         </div>
//       </div>

//       {/* FORM CONTAINER */}
//       <main className="w-full max-w-2xl px-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
//         {/* STEP 1 & STEP 2 & STEP 3 unchanged */}

//         {step === 1 && (
//           <div className="space-y-10">
//             <div className="space-y-2">
//               <h2 className="text-4xl font-black tracking-tighter">
//                 Your Details
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 Tell us about yourself and your business.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
//               <InputField
//                 label="Your Name *"
//                 value={formData.name}
//                 icon={<User size={14} />}
//                 placeholder="Jon Smith"
//                 error={errors.name}
//                 onChange={(v: string) => handleInputChange("name", v)}
//               />

//               <InputField
//                 label="Company Name *"
//                 value={formData.company}
//                 icon={<Briefcase size={14} />}
//                 placeholder="Jon's Plumbing"
//                 error={errors.company}
//                 onChange={(v: string) => handleInputChange("company", v)}
//               />

//               <InputField
//                 label="ACN (optional)"
//                 value={formData.acn}
//                 icon={<FileText size={14} />}
//                 placeholder="123 456 789"
//                 highlight
//                 onChange={(v: string) => handleInputChange("acn", v)}
//               />

//               <InputField
//                 label="Email *"
//                 value={formData.email}
//                 icon={<Mail size={14} />}
//                 placeholder="jon@plumbing.com.au"
//                 error={errors.email}
//                 onChange={(v: string) => handleInputChange("email", v)}
//               />

//               <InputField
//                 label="Password *"
//                 type="password"
//                 value={formData.password}
//                 icon={<FileText size={14} />}
//                 placeholder=""
//                 error={errors.password}
//                 onChange={(v: string) => handleInputChange("password", v)}
//               />

//               {/* Notification Preference */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
//                   Notification Preference
//                 </label>

//                 <select
//                   value={formData.notificationPreference}
//                   onChange={(e) =>
//                     handleInputChange("notificationPreference", e.target.value)
//                   }
//                   className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white"
//                 >
//                   <option value="email">Email</option>
//                   <option value="sms">SMS</option>
//                   <option value="both">Both</option>
//                 </select>
//               </div>

//               {/* Call Mode */}
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
//                     Call Received On
//                   </label>
//                   {/* {formData.callReceivedOn === "mobile" && (
//   <Info size={14} className="text-orange-400" />
// )} */}
//                   {formData.callReceivedOn === "mobile" && (
//                     <button
//                       type="button"
//                       onClick={showMobileInfoMessage}
//                       className="text-orange-400 hover:text-orange-300"
//                     >
//                       <Info size={14} />
//                     </button>
//                   )}
//                 </div>

//                 <select
//                   value={formData.callReceivedOn}
//                   onChange={(e) =>
//                     handleInputChange("callReceivedOn", e.target.value)
//                   }
//                   className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white"
//                 >
//                   <option value="mobile">Mobile</option>
//                   <option value="landline">Landline</option>
//                 </select>
//               </div>
//               {showMobileInfo && (
//                 <div className="mt-3 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 animate-in fade-in duration-300">
//                   <p className="text-xs leading-6 text-orange-100 text-justify">
//                     <span className="font-semibold">Note:</span> Mobile call
//                     forwarding uses your network operator's USSD service. Most
//                     operators do not support USSD call forwarding on prepaid
//                     mobile plans. If you have a prepaid SIM, please switch to a
//                     postpaid plan or select <strong>Landline</strong> instead.
//                   </p>
//                 </div>
//               )}
//               {/* Country */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
//                   Country
//                 </label>

//                 <select
//                   value={formData.country}
//                   onChange={(e) => handleInputChange("country", e.target.value)}
//                   className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white"
//                 >
//                   <option value="AU">Australia</option>
//                   <option value="NZ">New Zealand</option>
//                 </select>
//               </div>

//               {formData.country === "AU" && (
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2">
//                     <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
//                       City *
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() => setShowCityInfo((prev) => !prev)}
//                       className="text-orange-400 hover:text-orange-300"
//                     >
//                       <Info size={14} />
//                     </button>
//                   </div>

//                   <Select
//                     options={australianCityOptions.map((group) => ({
//                       label: group.group,
//                       options: group.options,
//                     }))}
//                     value={
//                       australianCityOptions
//                         .flatMap((g) => g.options)
//                         .find((city) => city.label === formData.cityCode) ||
//                       null
//                     }
//                     onChange={(selectedOption) =>
//                       handleInputChange("cityCode", selectedOption?.label || "")
//                     }
//                     placeholder="Search or select a city..."
//                     isSearchable
//                     className="text-black"
//                     styles={{
//                       control: (base) => ({
//                         ...base,
//                         backgroundColor: "#12181e",
//                         borderColor: "#2a2a2a",
//                         minHeight: "56px",
//                         borderRadius: "12px",
//                         color: "white",
//                       }),
//                       singleValue: (base) => ({
//                         ...base,
//                         color: "white",
//                       }),
//                       input: (base) => ({
//                         ...base,
//                         color: "white",
//                       }),
//                       menu: (base) => ({
//                         ...base,
//                         backgroundColor: "#12181e",
//                       }),
//                       option: (base, state) => ({
//                         ...base,
//                         backgroundColor: state.isFocused
//                           ? "#f97316"
//                           : "#12181e",
//                         color: "white",
//                         cursor: "pointer",
//                       }),
//                       groupHeading: (base) => ({
//                         ...base,
//                         color: "#f97316",
//                         fontWeight: "bold",
//                         fontSize: "12px",
//                         textTransform: "uppercase",
//                       }),
//                       placeholder: (base) => ({
//                         ...base,
//                         color: "#71717a",
//                       }),
//                     }}
//                   />
//                   {errors.cityCode && (
//                     <p className="text-red-500 text-xs font-medium mt-2">
//                       {errors.cityCode}
//                     </p>
//                   )}
//                   {showCityInfo && (
//                     <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 animate-in fade-in duration-300">
//                       <p className="text-xs leading-6 text-orange-100 text-justify">
//                         <span className="font-semibold">Note:</span> If your
//                         city is not listed, please select the city closest to
//                         your location.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-10 text-center sm:text-left">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-black tracking-tighter">
//                 What Trade Are You?
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 This helps Mia.Ai qualify callers and check they need the right
//                 trade.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {trades.map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setFormData({ ...formData, trade: t })}
//                   className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${formData.trade === t
//                     ? "border-orange-500 bg-orange-500/5 text-orange-500"
//                     : "border-white/5 bg-[#090e14] text-zinc-500 hover:border-white/10"
//                     }`}
//                 >
//                   <div className="flex items-center gap-4">
//                     <Hammer
//                       size={18}
//                       className={
//                         formData.trade === t
//                           ? "text-orange-500"
//                           : "text-zinc-700 group-hover:text-zinc-400"
//                       }
//                     />
//                     <span className="font-bold tracking-tight">{t}</span>
//                   </div>
//                   {formData.trade === t && <Check size={16} />}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-black tracking-tighter">
//                 Number Setup
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 Enter your mobile number.
//               </p>
//             </div>
//             <InputField
//               label="Mobile Number *"
//               value={formData.mobile}
//               icon={<Phone size={14} />}
//               placeholder={
//                 formData.country === "AU"
//                   ? "+61 412 345 678"
//                   : "+64 21 123 4567"
//               }
//               error={errors.mobile}
//               onChange={(v: string) =>
//                 // allow digits, spaces and leading + for country code
//                 handleInputChange("mobile", v.replace(/[^+\d\s]/g, ""))
//               }
//             />
//             <p className="mt-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-zinc-400">
//               <span className="font-semibold text-orange-400">Note:</span> Write
//               your mobile number including the country code, for example{" "}
//               {formData.country === "AU"
//                 ? "+61 412 345 678"
//                 : "+64 21 123 4567"}
//               .
//             </p>
//           </div>
//         )}

//         {/* STEP 4: DELIVERY - ONLY BUSINESS HOURS WITH TIME PICKER */}
//         {step === 4 && (
//           <div className="space-y-10">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-black tracking-tighter">Delivery</h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 Set when you want to receive leads.
//               </p>
//             </div>

//             <div
//               onClick={() =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   setBusinessHours: !prev.setBusinessHours,
//                 }))
//               }
//             >
//               <CheckboxField
//                 checked={formData.setBusinessHours}
//                 label="Set business hours"
//                 sub="Recommended â€” allows after-hours messaging"
//               />
//             </div>

//             {formData.setBusinessHours && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
//                 <InputField
//                   label="Opening Time"
//                   value={formData.openingTime}
//                   icon={<Clock size={14} />}
//                   type="time"
//                   onChange={(v: string) => handleInputChange("openingTime", v)}
//                 />
//                 <InputField
//                   label="Closing Time"
//                   value={formData.closingTime}
//                   icon={<Clock size={14} />}
//                   type="time"
//                   onChange={(v: string) => handleInputChange("closingTime", v)}
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* STEP 5: CONFIRMATION */}
//         {step === 5 && (
//           <div className="space-y-10">
//             <div className="space-y-2">
//               <h2 className="text-4xl font-black tracking-tighter">
//                 Confirm & Sign Up
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 Review your details and accept the terms.
//               </p>
//             </div>

//             <div className="bg-[#090e14] border border-white/5 p-10 rounded-3xl space-y-2">
//               <div className="flex items-center gap-2 text-zinc-600 mb-2 justify-center">
//                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">
//                   Your Details
//                 </span>
//               </div>
//               <div className="space-y-4">
//                 <SummaryItem label="Name" value={formData.name || "â€”"} />
//                 <SummaryItem
//                   label="Company"
//                   value={formData.company || "â€”"}
//                 />
//                 <SummaryItem label="Email" value={formData.email || "â€”"} />
//                 <SummaryItem label="Trade" value={formData.trade || "â€”"} />
//                 <SummaryItem label="Mobile" value={formData.mobile || "â€”"} />
//                 <SummaryItem
//                   label="Hours"
//                   value={
//                     formData.setBusinessHours
//                       ? `${formData.openingTime} â€” ${formData.closingTime}`
//                       : "24/7 (No out of hours)"
//                   }
//                 />
//               </div>
//             </div>

//             <div
//               onClick={() => setAgreedToTerms(!agreedToTerms)}
//               className={`bg-[#090e14] border p-4 rounded-2xl flex items-start gap-4 transition-all group cursor-pointer ${agreedToTerms
//                 ? "border-orange-500/50 bg-orange-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
//                 : "border-white/5 hover:border-white/10"
//                 }`}
//             >
//               <div
//                 className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${agreedToTerms
//                   ? "bg-orange-500 border-orange-500"
//                   : "border-white/20 group-hover:border-white/40"
//                   }`}
//               >
//                 {agreedToTerms && (
//                   <Check size={16} className="text-black stroke-[4]" />
//                 )}
//               </div>
//               <div className="space-y-2">
//                 <p className="text-white font-bold text-sm">
//                   I agree to the Terms and Conditions
//                 </p>
//                 <p className="text-zinc-500 text-[10px] leading-relaxed">
//                   Including payment terms for a recurring monthly subscription
//                   (your payment method will be charged automatically each month)
//                   and the Mia.Ai Service Agreement.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* STEP 6 & 7 (unchanged) */}
//         {step === 6 && (
//           <div className="space-y-10">
//             <div className="space-y-2 text-center">
//               <h2 className="text-4xl font-black tracking-tighter">
//                 Verify Your Email
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 We've sent a 6-digit code to{" "}
//                 <span className="text-white">{formData.email}</span>
//               </p>
//             </div>

//             <div className="flex flex-col items-center space-y-6">
//               <input
//                 type="text"
//                 maxLength={6}
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="000000"
//                 className="w-full max-w-xs bg-[#12181e] border border-white/5 rounded-2xl px-6 py-5 text-center text-4xl font-black tracking-[0.5em] text-orange-500 placeholder-zinc-800 focus:outline-none focus:border-orange-500 transition-all"
//               />

//               {error && (
//                 <p className="text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-2">
//                   {error}
//                 </p>
//               )}

//               <button
//                 onClick={handleVerifyOtp}
//                 disabled={otp.length !== 6 || isSubmitting}
//                 className="w-full max-w-xs flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-10 py-4 rounded-xl text-lg font-black transition-all shadow-xl shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? "Verifying..." : "Verify OTP"}
//               </button>
//             </div>
//           </div>
//         )}

//         {step === 7 && (
//           <div className="flex flex-col items-center justify-center text-center py-10 space-y-10 animate-in fade-in zoom-in-95 duration-1000">
//             <div className="relative">
//               <div className="w-24 h-24 rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
//                 <Check size={48} className="text-emerald-500" />
//               </div>
//               <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full -z-10" />
//             </div>

//             <div className="space-y-4">
//               <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
//                 You're All Set!
//               </h2>
//               <p className="text-zinc-500 text-sm sm:text-base max-w-md leading-relaxed font-medium">
//                 In a real sign-up, you'd receive a confirmation email at <br />
//                 <span className="text-white font-bold tracking-tight">
//                   {formData.email}
//                 </span>
//               </p>
//             </div>

//             <div className="w-full max-w-sm bg-[#090e14]/50 border border-white/5 p-8 rounded-3xl text-left space-y-4">
//               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
//                 Summary
//               </span>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center text-xs">
//                   <span className="text-zinc-500 font-bold uppercase tracking-widest">
//                     Business:
//                   </span>
//                   <span className="text-white font-black">
//                     {formData.company}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center text-xs">
//                   <span className="text-zinc-500 font-bold uppercase tracking-widest">
//                     Trade:
//                   </span>
//                   <span className="text-white font-black">
//                     {formData.trade}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center text-xs">
//                   <span className="text-zinc-500 font-bold uppercase tracking-widest">
//                     Mobile:
//                   </span>
//                   <span className="text-white font-black">
//                     {formData.mobile}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center text-xs">
//                   <span className="text-zinc-500 font-bold uppercase tracking-widest">
//                     Hours:
//                   </span>
//                   <span className="text-white font-black">
//                     {formData.setBusinessHours
//                       ? `${formData.openingTime} â€” ${formData.closingTime}`
//                       : "24/7"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
//               <button
//                 onClick={onGoToLogin || onBack}
//                 className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-xl text-lg font-black transition-all"
//               >
//                 Go to Login
//               </button>
//             </div>
//           </div>
//         )}

//         {/* GLOBAL ACTIONS */}
//         {step < 6 && (
//           <div className="mt-10 flex items-center justify-between">
//             <button
//               onClick={prevStep}
//               disabled={hasRegisteredSuccess}
//               className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest group transition-colors ${hasRegisteredSuccess ? "text-zinc-500 cursor-not-allowed" : "text-zinc-600 hover:text-white"}`}
//             >
//               <ArrowLeft
//                 size={16}
//                 className="group-hover:-translate-x-1 transition-transform"
//               />
//               Back
//             </button>

//             {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

//             <button
//               onClick={step === 5 ? handleSignup : nextStep}
//               disabled={
//                 (step === 5 && (!agreedToTerms || isSubmitting)) || isSubmitting
//               }
//               className={`flex items-center gap-2 px-10 py-3 rounded-2xl text-lg font-black transition-all duration-300 shadow-xl hover:scale-[1.03] active:scale-95 group ${step === 5
//                 ? agreedToTerms
//                   ? "bg-orange-500 text-black shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
//                   : "bg-[#12181e] text-zinc-700 border border-white/5 cursor-not-allowed opacity-50"
//                 : "bg-orange-500 text-black shadow-orange-500/20 hover:bg-orange-400"
//                 }`}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center gap-2">
//                   <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                   Processing...
//                 </span>
//               ) : (
//                 <>
//                   {step === 5 ? (
//                     <Check size={20} className="stroke-[3]" />
//                   ) : null}
//                   {step === 5 ? "Complete Sign Up" : "Next"}
//                   {step !== 5 && (
//                     <ArrowLeft className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1" />
//                   )}
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// /* InputField, CheckboxField, SummaryItem (same as before) */
// function InputField({
//   label,
//   value,
//   icon,
//   placeholder,
//   highlight = false,
//   subLabel,
//   type = "text",
//   error,
//   onChange,
//   disabled = false,
// }: any) {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-2 text-orange-500">
//         {icon}
//         <label className="text-[10px] font-black uppercase tracking-widest">
//           {label}
//         </label>
//       </div>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange && onChange(e.target.value)}
//         placeholder={placeholder}
//         disabled={disabled}
//         className={`w-full bg-[#12181e] border rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none transition-all ${disabled
//           ? "opacity-60 cursor-not-allowed border-white/10"
//           : error
//             ? "border-red-500"
//             : highlight
//               ? "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.05)]"
//               : "border-white/5"
//           }`}
//       />
//       {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
//       {subLabel && (
//         <p className="text-zinc-600 text-[10px] font-medium leading-relaxed">
//           {subLabel}
//         </p>
//       )}
//     </div>
//   );
// }

// function CheckboxField({ checked, label, sub }: any) {
//   return (
//     <div className="bg-[#090e14] border border-white/5 p-6 rounded-2xl flex items-center gap-5 transition-all hover:border-white/10 group cursor-pointer">
//       <div
//         className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border-2 transition-colors ${checked ? "bg-orange-500 border-orange-500" : "border-white/10"
//           }`}
//       >
//         {checked && <Check size={16} className="text-black" />}
//       </div>
//       <div className="space-y-0.5">
//         <p className="text-white font-bold text-sm tracking-tight">{label}</p>
//         {sub && (
//           <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest opacity-60">
//             {sub}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// function SummaryItem({ label, value }: any) {
//   return (
//     <div className="flex items-center justify-between border-b border-white/5 pb-4">
//       <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
//         {label}:
//       </span>
//       <span className="text-white font-black tracking-tight">{value}</span>
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import {
//   ArrowLeft,
//   User,
//   Briefcase,
//   FileText,
//   Mail,
//   Hammer,
//   Phone,
//   Clock,
//   Check,
//   Info,
//   Building2,
//   MapPin,
//   Hash,
//   UploadCloud,
//   X,
// } from "lucide-react";
// import { authService } from "../services/authService";
// import logo from "../assets/logo.png";
// import Select from "react-select";

// interface SignupProps {
//   onBack: () => void;
//   onSuccess?: (user: any, token: string) => void;
//   onGoToLogin?: () => void;
// }

// interface PortAuthorisedContact {
//   givenName: string;
//   familyName: string;
//   contactNumber: string;
// }

// interface PortDetails {
//   displayName: string;
//   numberToPort: string;
//   providerName: string;
//   accountNumber: string;
//   entityType: string;
//   identificationNumber: string;
//   address: string;
//   city: string;
//   state: string;
//   postcode: string;
//   country: string;
//   supportingDocumentPath: string;
//   authorisedContact: PortAuthorisedContact;
// }

// const emptyPortDetails: PortDetails = {
//   displayName: "",
//   numberToPort: "",
//   providerName: "",
//   accountNumber: "",
//   entityType: "",
//   identificationNumber: "",
//   address: "",
//   city: "",
//   state: "",
//   postcode: "",
//   country: "AU",
//   supportingDocumentPath: "",
//   authorisedContact: {
//     givenName: "",
//     familyName: "",
//     contactNumber: "",
//   },
// };

// // Assumption: entity type is a required, backend-defined enum. Adjust this
// // list to match whatever values your API expects.
// const entityTypes = [
//   "Individual",
//   "Company",
//   "Partnership",
//   "Trust",
//   "Sole Trader",
//   "Government",
// ];

// export default function Signup({ onBack, onGoToLogin }: SignupProps) {
//   const [step, setStep] = useState(1);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [showMobileInfo, setShowMobileInfo] = useState(false);
//   const [showCityInfo, setShowCityInfo] = useState(false);
//   const [formData, setFormData] = useState(() => {
//     const saved = localStorage.getItem("signupFormData");
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         // Guard against old saved data that predates the porting fields
//         return {
//           wantsPortNumber: false,
//           portDetails: emptyPortDetails,
//           ...parsed,
//         };
//       } catch (e) {
//         // ignore error
//       }
//     }
//     return {
//       name: "",
//       company: "",
//       email: "",
//       password: "",
//       acn: "",
//       trade: "",
//       mobile: "",
//       setBusinessHours: true,
//       openingTime: "07:00", // 24-hour format
//       closingTime: "18:00", // 24-hour format
//       notificationPreference: "both",
//       callReceivedOn: "mobile",
//       country: "AU",
//       cityCode: "",
//       wantsPortNumber: false,
//       portDetails: emptyPortDetails,
//     };
//   });

//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   //@ts-ignore
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const steps = [
//     { id: 1, label: "Your Details", icon: <User size={16} /> },
//     { id: 2, label: "Your Trade", icon: <Hammer size={16} /> },
//     { id: 3, label: "Number Setup", icon: <Phone size={16} /> },
//     { id: 4, label: "Delivery", icon: <Clock size={16} /> },
//     { id: 5, label: "Confirm", icon: <Check size={16} /> },
//     { id: 6, label: "Verify", icon: <Mail size={16} /> },
//   ];

//   const trades = [
//     "Plumber",
//     "Electrician",
//     "Carpenter",
//     "HVAC Technician",
//     "Locksmith",
//     "Painter",
//     "Roofer",
//     "General Tradesperson",
//     "Pest Control",
//   ];

//   const australianCityOptions = [
//     {
//       group: "Australian Capital Territory (ACT)",
//       options: [{ value: "ACT-CANBERRA", label: "Canberra" }],
//     },
//     {
//       group: "New South Wales (NSW)",
//       options: [
//         { value: "NSW-SYDNEY", label: "Sydney" },
//         { value: "NSW-NEWCASTLE", label: "Newcastle" },
//         { value: "NSW-GOSFORD", label: "Gosford" },
//         { value: "NSW-NOWRA", label: "Nowra" },
//         { value: "NSW-CAMPBELLTOWN", label: "Campbelltown" },
//         { value: "NSW-PENRITH", label: "Penrith" },
//         { value: "NSW-TAREE", label: "Taree" },
//         { value: "NSW-COFFS-HARBOUR", label: "Coffs Harbour" },
//         { value: "NSW-ALBURY", label: "Albury" },
//       ],
//     },
//     {
//       group: "Queensland (QLD)",
//       options: [
//         { value: "QLD-BRISBANE", label: "Brisbane" },
//         { value: "QLD-CAIRNS", label: "Cairns" },
//         { value: "QLD-TOWNSVILLE", label: "Townsville" },
//         { value: "QLD-TOOWOOMBA", label: "Toowoomba" },
//         { value: "QLD-ROCKHAMPTON", label: "Rockhampton" },
//         { value: "QLD-MARYBOROUGH", label: "Maryborough" },
//         { value: "QLD-SOUTHPORT", label: "Southport" },
//         { value: "QLD-BEAUDESERT", label: "Beaudesert" },
//       ],
//     },
//     {
//       group: "Victoria (VIC)",
//       options: [
//         { value: "VIC-MELBOURNE", label: "Melbourne" },
//         { value: "VIC-GEELONG", label: "Geelong" },
//       ],
//     },
//     {
//       group: "South Australia (SA)",
//       options: [{ value: "SA-ADELAIDE", label: "Adelaide" }],
//     },
//     {
//       group: "Western Australia (WA)",
//       options: [
//         { value: "WA-PERTH", label: "Perth" },
//         { value: "WA-BUNBURY", label: "Bunbury" },
//         { value: "WA-PINJARRA", label: "Pinjarra" },
//       ],
//     },
//     {
//       group: "Tasmania (TAS)",
//       options: [
//         { value: "TAS-HOBART", label: "Hobart" },
//         { value: "TAS-LAUNCESTON", label: "Launceston" },
//       ],
//     },
//     {
//       group: "Northern Territory (NT)",
//       options: [{ value: "NT-DARWIN", label: "Darwin" }],
//     },
//   ];

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [otp, setOtp] = useState("");
//   const STRIPE_PENDING_TOKEN_KEY = "pendingStripeAuthToken";
//   const [hasRegisteredSuccess, setHasRegisteredSuccess] = useState(false);
//   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
//   const [isUploadingDoc, setIsUploadingDoc] = useState(false);
//   const [uploadedFileName, setUploadedFileName] = useState("");
//   const [isSyncingStripe, setIsSyncingStripe] = useState(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     return !!urlParams.get("session_id");
//   });
//   const [loginToken, setLoginToken] = useState<string | null>(() => {
//     return localStorage.getItem(STRIPE_PENDING_TOKEN_KEY);
//   });

//   useEffect(() => {
//     if (formData.callReceivedOn === "mobile") {
//       showMobileInfoMessage();
//     } else {
//       setShowMobileInfo(false);

//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     }

//     return () => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     };
//   }, [formData.callReceivedOn]);

//   const nextStep = () => {
//     setError(null);
//     const newErrors: Record<string, string> = {};
//     let isValid = true;

//     if (step === 1) {
//       if (!formData.name.trim()) {
//         newErrors.name = "Name is required";
//         isValid = false;
//       }
//       if (!formData.company.trim()) {
//         newErrors.company = "Company Name is required";
//         isValid = false;
//       }
//       if (!formData.email.trim()) {
//         newErrors.email = "Email is required";
//         isValid = false;
//       } else {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData.email)) {
//           newErrors.email = "Please enter a valid email address";
//           isValid = false;
//         }
//       }
//       if (!formData.password.trim()) {
//         newErrors.password = "Password is required";
//         isValid = false;
//       } else if (formData.password.length < 8) {
//         newErrors.password = "Password must be at least 8 characters";
//         isValid = false;
//       }
//       // City is required only for Australia
//       if (formData.country === "AU" && !formData.cityCode) {
//         newErrors.cityCode = "Please select a city";
//         isValid = false;
//       }
//     }

//     if (step === 2) {
//       if (!formData.trade) {
//         setError("Please select a trade");
//         isValid = false;
//       }
//     }

//     if (step === 3) {
//       if (!formData.mobile.trim()) {
//         newErrors.mobile = "Mobile number is required";
//         isValid = false;
//       }

//       if (formData.wantsPortNumber) {
//         const p: PortDetails = formData.portDetails;

//         if (!p.displayName.trim()) {
//           newErrors.port_displayName = "Display name is required";
//           isValid = false;
//         }
//         if (!p.numberToPort.trim()) {
//           newErrors.port_numberToPort = "Number to port is required";
//           isValid = false;
//         }
//         if (!p.providerName.trim()) {
//           newErrors.port_providerName = "Provider name is required";
//           isValid = false;
//         }
//         if (!p.accountNumber.trim()) {
//           newErrors.port_accountNumber = "Account number is required";
//           isValid = false;
//         }
//         if (!p.entityType) {
//           newErrors.port_entityType = "Entity type is required";
//           isValid = false;
//         }
//         if (!p.identificationNumber.trim()) {
//           newErrors.port_identificationNumber =
//             "Identification number is required";
//           isValid = false;
//         }
//         if (!p.address.trim()) {
//           newErrors.port_address = "Address is required";
//           isValid = false;
//         }
//         if (!p.city.trim()) {
//           newErrors.port_city = "City is required";
//           isValid = false;
//         }
//         if (!p.state.trim()) {
//           newErrors.port_state = "State is required";
//           isValid = false;
//         }
//         if (!p.postcode.trim()) {
//           newErrors.port_postcode = "Postcode is required";
//           isValid = false;
//         }
//         if (!p.country) {
//           newErrors.port_country = "Country is required";
//           isValid = false;
//         }
//         if (!p.authorisedContact.givenName.trim()) {
//           newErrors.port_authGivenName = "Given name is required";
//           isValid = false;
//         }
//         if (!p.authorisedContact.familyName.trim()) {
//           newErrors.port_authFamilyName = "Family name is required";
//           isValid = false;
//         }
//         if (!p.authorisedContact.contactNumber.trim()) {
//           newErrors.port_authContactNumber = "Contact number is required";
//           isValid = false;
//         }
//         if (!p.supportingDocumentPath) {
//           newErrors.port_supportingDocument =
//             "Please attach a supporting document";
//           isValid = false;
//         }
//       }
//     }

//     setErrors(newErrors);

//     if (!isValid) return;

//     setStep((prev) => Math.min(prev + 1, 7));
//   };

//   const prevStep = () => {
//     if (hasRegisteredSuccess) return;
//     if (step === 1) onBack();
//     else setStep((prev) => prev - 1);
//   };

//   const handleSignup = async () => {
//     setIsSubmitting(true);
//     setError(null);
//     try {
//       const openingHours = formData.setBusinessHours
//         ? `${formData.openingTime}-${formData.closingTime} MON-FRI`
//         : "24/7";

//       const payload: Record<string, any> = {
//         customerName: formData.name,
//         companyName: formData.company,
//         acn: formData.acn,
//         email: formData.email,
//         password: formData.password,
//         trade: formData.trade,
//         mobileNumber: formData.mobile,

//         wantsGeoNumber: false,
//         geoNumberType: "NONE",

//         wantsPortNumber: formData.wantsPortNumber,

//         openingHours,
//         paymentDetails: {},

//         country: formData.country,
//         notificationPreference: formData.notificationPreference,
//         callReceivedOn: formData.callReceivedOn,
//         cityCode: formData.country === "AU" ? formData.cityCode : "",
//       };

//       // Only include the porting fields when the user actually opted in.
//       // Field names match the backend's expected request body exactly.
//       if (formData.wantsPortNumber) {
//         const p: PortDetails = formData.portDetails;
//         payload.displayName = p.displayName;
//         payload.numberToPort = p.numberToPort;
//         payload.providerName = p.providerName;
//         payload.accountNumber = p.accountNumber;
//         payload.entityType = p.entityType;
//         payload.identificationNumber = p.identificationNumber;
//         payload.address = p.address;
//         payload.city = p.city;
//         payload.state = p.state;
//         payload.postcode = p.postcode;
//         payload.country = p.country;
//         payload.supportingDocumentPath = p.supportingDocumentPath;
//         payload.authorisedContact = {
//           givenName: p.authorisedContact.givenName,
//           familyName: p.authorisedContact.familyName,
//           contactNumber: p.authorisedContact.contactNumber,
//         };
//       }

//       const res = await authService.register(payload);
//       if (res.userId) {
//         setHasRegisteredSuccess(true);
//         setStep(6);
//       } else {
//         setError(res.message || "Failed to register");
//       }
//     } catch (err) {
//       setError("An error occurred during signup");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     setIsSubmitting(true);
//     setError(null);
//     try {
//       const res = await authService.verifyOtp(formData.email, otp);
//       if (res.message === "Email verified successfully") {
//         await loginAfterSignup();
//       } else {
//         setError(res.message || "Invalid OTP");
//         console.log(res.message, "Error verifying OTP");
//       }
//     } catch (err) {
//       setError("An error occurred during verification");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const loginAfterSignup = async () => {
//     try {
//       const loginRes = await authService.login({
//         email: formData.email,
//         password: formData.password,
//       });

//       if (loginRes.accessToken) {
//         const token = loginRes.accessToken;
//         setLoginToken(token);
//         localStorage.setItem(STRIPE_PENDING_TOKEN_KEY, token);
//         localStorage.setItem("signupFormData", JSON.stringify(formData));
//         await processPaymentAndLogout(token);
//       } else {
//         console.error("Login failed after signup", loginRes);
//       }
//     } catch (loginErr) {
//       console.error("Error logging in after signup", loginErr);
//     }
//   };

//   const processPaymentAndLogout = async (token: string) => {
//     setIsPaymentProcessing(true);
//     setError(null);

//     try {
//       const checkoutRes = await authService.createCheckout(token);
//       const checkoutUrl = checkoutRes.url || checkoutRes.checkoutUrl;

//       if (!checkoutUrl) {
//         setError("Unable to start payment checkout.");
//         return;
//       }

//       window.location.href = checkoutUrl;
//     } catch (err: any) {
//       console.error("Payment checkout failed", err);
//       setError("Payment checkout failed. Please try again later.");
//     } finally {
//       setIsPaymentProcessing(false);
//     }
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const sessionId = urlParams.get("session_id");

//     if (!sessionId) {
//       setIsSyncingStripe(false);
//       return;
//     }
//     if (!loginToken) {
//       setIsSyncingStripe(false);
//       return;
//     }

//     // Clear session_id from URL to prevent re-running if other dependencies change
//     window.history.replaceState({}, document.title, window.location.pathname);

//     const syncStripe = async () => {
//       try {
//         await authService.syncSession(sessionId, loginToken);
//       } catch (err) {
//         console.error("Stripe session sync failed", err);
//       } finally {
//         localStorage.removeItem(STRIPE_PENDING_TOKEN_KEY);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("signupFormData");

//         setIsSyncingStripe(false);
//         setStep(7);

//         setTimeout(() => {
//           if (onGoToLogin) onGoToLogin();
//           else onBack();
//         }, 5000);
//       }
//     };

//     syncStripe();
//   }, [loginToken, onBack, onGoToLogin]);

//   const showMobileInfoMessage = () => {
//     setShowMobileInfo(true);

//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }

//     timerRef.current = setTimeout(() => {
//       setShowMobileInfo(false);
//     }, 5000);
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => {
//       if (field === "country" && value !== "AU") {
//         return { ...prev, [field]: value, cityCode: "" };
//       }

//       return { ...prev, [field]: value };
//     });

//     if (field === "password") {
//       if (value.length > 0 && value.length < 8) {
//         setErrors((prev) => ({
//           ...prev,
//           password: "Password must be at least 8 characters",
//         }));
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           password: "",
//         }));
//       }

//       return;
//     }

//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   // Updates a top-level field inside formData.portDetails
//   const handlePortDetailChange = (field: keyof PortDetails, value: string) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       portDetails: { ...prev.portDetails, [field]: value },
//     }));

//     const errorKey = `port_${field}`;
//     if (errors[errorKey]) {
//       setErrors((prev) => ({ ...prev, [errorKey]: "" }));
//     }
//   };

//   // Updates a field inside formData.portDetails.authorisedContact
//   const handleAuthorisedContactChange = (
//     field: keyof PortAuthorisedContact,
//     value: string,
//   ) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       portDetails: {
//         ...prev.portDetails,
//         authorisedContact: {
//           ...prev.portDetails.authorisedContact,
//           [field]: value,
//         },
//       },
//     }));

//     const errorKeyMap: Record<string, string> = {
//       givenName: "port_authGivenName",
//       familyName: "port_authFamilyName",
//       contactNumber: "port_authContactNumber",
//     };
//     const errorKey = errorKeyMap[field];
//     if (errorKey && errors[errorKey]) {
//       setErrors((prev) => ({ ...prev, [errorKey]: "" }));
//     }
//   };

//   const togglePortNumber = () => {
//     setFormData((prev: any) => ({
//       ...prev,
//       wantsPortNumber: !prev.wantsPortNumber,
//     }));
//   };

//   const handleSupportingDocumentUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsUploadingDoc(true);
//     setError(null);
//     try {
//       const res = await authService.uploadSupportingDocument(file);
//       const path = res.path || res.filePath || res.supportingDocumentPath;

//       if (path) {
//         handlePortDetailChange("supportingDocumentPath", path);
//         setUploadedFileName(file.name);
//       } else {
//         setError(res.message || "Failed to upload the supporting document");
//       }
//     } catch (err) {
//       setError("An error occurred while uploading the supporting document");
//     } finally {
//       setIsUploadingDoc(false);
//       // reset the input so the same file can be re-selected if needed
//       e.target.value = "";
//     }
//   };

//   const removeSupportingDocument = () => {
//     handlePortDetailChange("supportingDocumentPath", "");
//     setUploadedFileName("");
//   };

//   if (isSyncingStripe) {
//     return (
//       <div className="min-h-screen bg-[#03070b] text-white flex flex-col items-center justify-center">
//         <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
//         <p className="mt-4 text-zinc-400 font-medium">Verifying payment...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#03070b] text-white flex flex-col items-center">
//       {/* HEADER BAR */}
//       <header className="w-full px-6 py-6 border-b border-white/5 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={prevStep}
//             disabled={hasRegisteredSuccess}
//             className={`flex items-center gap-2 transition-colors ${hasRegisteredSuccess ? "text-zinc-500 cursor-not-allowed" : "text-zinc-500 hover:text-white"}`}
//           >
//             <ArrowLeft
//               size={18}
//               className={
//                 hasRegisteredSuccess
//                   ? "transition-transform"
//                   : "group-hover:-translate-x-1 transition-transform"
//               }
//             />
//           </button>
//           <div className="flex items-center gap-2">
//             <img src={logo} alt="Logo" className="h-16 w-auto" />
//           </div>
//         </div>

//         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
//           Step {step}/5
//         </span>
//       </header>

//       {/* STEPPER NAVIGATION */}
//       <div className="w-full max-w-4xl mt-12 mb-16 overflow-x-auto no-scrollbar px-6">
//         <div className="flex items-center justify-between min-w-[500px] relative">
//           {steps.map((s) => (
//             <div
//               key={s.id}
//               className={`flex items-center gap-2 pb-4 border-b-2 transition-all cursor-pointer z-10 ${step === s.id
//                 ? "border-orange-500 text-orange-500"
//                 : step > s.id
//                   ? "border-emerald-500 text-emerald-500"
//                   : "border-transparent text-zinc-600"
//                 }`}
//             >
//               {step > s.id ? <Check size={16} /> : s.icon}
//               <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
//                 {s.label}
//               </span>
//             </div>
//           ))}
//           <div className="absolute bottom-4 left-0 w-full h-[2px] bg-white/5 -z-10" />
//         </div>
//       </div>

//       {/* FORM CONTAINER */}
//       <main className="w-full max-w-2xl px-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
//         {/* STEP 1 & STEP 2 unchanged */}

//         {step === 1 && (
//           <div className="space-y-10">
//             <div className="space-y-2">
//               <h2 className="text-4xl font-black tracking-tighter">
//                 Your Details
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 Tell us about yourself and your business.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
//               <InputField
//                 label="Your Name *"
//                 value={formData.name}
//                 icon={<User size={14} />}
//                 placeholder="Jon Smith"
//                 error={errors.name}
//                 onChange={(v: string) => handleInputChange("name", v)}
//               />

//               <InputField
//                 label="Company Name *"
//                 value={formData.company}
//                 icon={<Briefcase size={14} />}
//                 placeholder="Jon's Plumbing"
//                 error={errors.company}
//                 onChange={(v: string) => handleInputChange("company", v)}
//               />

//               <InputField
//                 label="ACN (optional)"
//                 value={formData.acn}
//                 icon={<FileText size={14} />}
//                 placeholder="123 456 789"
//                 highlight
//                 onChange={(v: string) => handleInputChange("acn", v)}
//               />

//               <InputField
//                 label="Email *"
//                 value={formData.email}
//                 icon={<Mail size={14} />}
//                 placeholder="jon@plumbing.com.au"
//                 error={errors.email}
//                 onChange={(v: string) => handleInputChange("email", v)}
//               />

//               <InputField
//                 label="Password *"
//                 type="password"
//                 value={formData.password}
//                 icon={<FileText size={14} />}
//                 placeholder=""
//                 error={errors.password}
//                 onChange={(v: string) => handleInputChange("password", v)}
//               />

//               {/* Notification Preference */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
//                   Notification Preference
//                 </label>

//                 <select
//                   value={formData.notificationPreference}
//                   onChange={(e) =>
//                     handleInputChange("notificationPreference", e.target.value)
//                   }
//                   className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white"
//                 >
//                   <option value="email">Email</option>
//                   <option value="sms">SMS</option>
//                   <option value="both">Both</option>
//                 </select>
//               </div>

//               {/* Call Mode */}
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
//                     Call Received On
//                   </label>
//                   {formData.callReceivedOn === "mobile" && (
//                     <button
//                       type="button"
//                       onClick={showMobileInfoMessage}
//                       className="text-orange-400 hover:text-orange-300"
//                     >
//                       <Info size={14} />
//                     </button>
//                   )}
//                 </div>

//                 <select
//                   value={formData.callReceivedOn}
//                   onChange={(e) =>
//                     handleInputChange("callReceivedOn", e.target.value)
//                   }
//                   className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white"
//                 >
//                   <option value="mobile">Mobile</option>
//                   <option value="landline">Landline</option>
//                 </select>
//               </div>
//               {showMobileInfo && (
//                 <div className="mt-3 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 animate-in fade-in duration-300">
//                   <p className="text-xs leading-6 text-orange-100 text-justify">
//                     <span className="font-semibold">Note:</span> Mobile call
//                     forwarding uses your network operator's USSD service. Most
//                     operators do not support USSD call forwarding on prepaid
//                     mobile plans. If you have a prepaid SIM, please switch to a
//                     postpaid plan or select <strong>Landline</strong> instead.
//                   </p>
//                 </div>
//               )}
//               {/* Country */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
//                   Country
//                 </label>

//                 <select
//                   value={formData.country}
//                   onChange={(e) => handleInputChange("country", e.target.value)}
//                   className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white"
//                 >
//                   <option value="AU">Australia</option>
//                   <option value="NZ">New Zealand</option>
//                 </select>
//               </div>

//               {formData.country === "AU" && (
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2">
//                     <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
//                       City *
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() => setShowCityInfo((prev) => !prev)}
//                       className="text-orange-400 hover:text-orange-300"
//                     >
//                       <Info size={14} />
//                     </button>
//                   </div>

//                   <Select
//                     options={australianCityOptions.map((group) => ({
//                       label: group.group,
//                       options: group.options,
//                     }))}
//                     value={
//                       australianCityOptions
//                         .flatMap((g) => g.options)
//                         .find((city) => city.label === formData.cityCode) ||
//                       null
//                     }
//                     onChange={(selectedOption) =>
//                       handleInputChange("cityCode", selectedOption?.label || "")
//                     }
//                     placeholder="Search or select a city..."
//                     isSearchable
//                     className="text-black"
//                     styles={{
//                       control: (base) => ({
//                         ...base,
//                         backgroundColor: "#12181e",
//                         borderColor: "#2a2a2a",
//                         minHeight: "56px",
//                         borderRadius: "12px",
//                         color: "white",
//                       }),
//                       singleValue: (base) => ({
//                         ...base,
//                         color: "white",
//                       }),
//                       input: (base) => ({
//                         ...base,
//                         color: "white",
//                       }),
//                       menu: (base) => ({
//                         ...base,
//                         backgroundColor: "#12181e",
//                       }),
//                       option: (base, state) => ({
//                         ...base,
//                         backgroundColor: state.isFocused
//                           ? "#f97316"
//                           : "#12181e",
//                         color: "white",
//                         cursor: "pointer",
//                       }),
//                       groupHeading: (base) => ({
//                         ...base,
//                         color: "#f97316",
//                         fontWeight: "bold",
//                         fontSize: "12px",
//                         textTransform: "uppercase",
//                       }),
//                       placeholder: (base) => ({
//                         ...base,
//                         color: "#71717a",
//                       }),
//                     }}
//                   />
//                   {errors.cityCode && (
//                     <p className="text-red-500 text-xs font-medium mt-2">
//                       {errors.cityCode}
//                     </p>
//                   )}
//                   {showCityInfo && (
//                     <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 animate-in fade-in duration-300">
//                       <p className="text-xs leading-6 text-orange-100 text-justify">
//                         <span className="font-semibold">Note:</span> If your
//                         city is not listed, please select the city closest to
//                         your location.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-10 text-center sm:text-left">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-black tracking-tighter">
//                 What Trade Are You?
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 This helps Mia.Ai qualify callers and check they need the right
//                 trade.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {trades.map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setFormData({ ...formData, trade: t })}
//                   className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${formData.trade === t
//                     ? "border-orange-500 bg-orange-500/5 text-orange-500"
//                     : "border-white/5 bg-[#090e14] text-zinc-500 hover:border-white/10"
//                     }`}
//                 >
//                   <div className="flex items-center gap-4">
//                     <Hammer
//                       size={18}
//                       className={
//                         formData.trade === t
//                           ? "text-orange-500"
//                           : "text-zinc-700 group-hover:text-zinc-400"
//                       }
//                     />
//                     <span className="font-bold tracking-tight">{t}</span>
//                   </div>
//                   {formData.trade === t && <Check size={16} />}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-black tracking-tighter">
//                 Number Setup
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 Enter your mobile number.
//               </p>
//             </div>
//             <InputField
//               label="Mobile Number *"
//               value={formData.mobile}
//               icon={<Phone size={14} />}
//               placeholder={
//                 formData.country === "AU"
//                   ? "+61 412 345 678"
//                   : "+64 21 123 4567"
//               }
//               error={errors.mobile}
//               onChange={(v: string) =>
//                 // allow digits, spaces and leading + for country code
//                 handleInputChange("mobile", v.replace(/[^+\d\s]/g, ""))
//               }
//             />
//             <p className="mt-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-zinc-400">
//               <span className="font-semibold text-orange-400">Note:</span> Write
//               your mobile number including the country code, for example{" "}
//               {formData.country === "AU"
//                 ? "+61 412 345 678"
//                 : "+64 21 123 4567"}
//               .
//             </p>

//             {/* PORT AN EXISTING NUMBER */}
//             <div
//               onClick={togglePortNumber}
//               className={`mt-4 bg-[#090e14] border p-6 rounded-2xl flex items-center gap-5 transition-all cursor-pointer group ${formData.wantsPortNumber
//                 ? "border-orange-500/50 bg-orange-500/5"
//                 : "border-white/5 hover:border-white/10"
//                 }`}
//             >
//               <div
//                 className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border-2 transition-colors ${formData.wantsPortNumber
//                   ? "bg-orange-500 border-orange-500"
//                   : "border-white/10"
//                   }`}
//               >
//                 {formData.wantsPortNumber && (
//                   <Check size={16} className="text-black stroke-[4]" />
//                 )}
//               </div>
//               <div className="space-y-0.5">
//                 <p className="text-white font-bold text-sm tracking-tight">
//                   Do you want to port an existing number?
//                 </p>
//                 <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest opacity-60">
//                   Move a number you already own onto Mia.Ai
//                 </p>
//               </div>
//             </div>

//             {formData.wantsPortNumber && (
//               <PortNumberForm
//                 portDetails={formData.portDetails}
//                 errors={errors}
//                 isUploadingDoc={isUploadingDoc}
//                 uploadedFileName={uploadedFileName}
//                 onFieldChange={handlePortDetailChange}
//                 onAuthContactChange={handleAuthorisedContactChange}
//                 onFileSelected={handleSupportingDocumentUpload}
//                 onRemoveFile={removeSupportingDocument}
//               />
//             )}
//           </div>
//         )}

//         {/* STEP 4: DELIVERY - ONLY BUSINESS HOURS WITH TIME PICKER */}
//         {step === 4 && (
//           <div className="space-y-10">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-black tracking-tighter">Delivery</h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 Set when you want to receive leads.
//               </p>
//             </div>

//             <div
//               onClick={() =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   setBusinessHours: !prev.setBusinessHours,
//                 }))
//               }
//             >
//               <CheckboxField
//                 checked={formData.setBusinessHours}
//                 label="Set business hours"
//                 sub="Recommended â€” allows after-hours messaging"
//               />
//             </div>

//             {formData.setBusinessHours && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
//                 <InputField
//                   label="Opening Time"
//                   value={formData.openingTime}
//                   icon={<Clock size={14} />}
//                   type="time"
//                   onChange={(v: string) => handleInputChange("openingTime", v)}
//                 />
//                 <InputField
//                   label="Closing Time"
//                   value={formData.closingTime}
//                   icon={<Clock size={14} />}
//                   type="time"
//                   onChange={(v: string) => handleInputChange("closingTime", v)}
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* STEP 5: CONFIRMATION */}
//         {step === 5 && (
//           <div className="space-y-10">
//             <div className="space-y-2">
//               <h2 className="text-4xl font-black tracking-tighter">
//                 Confirm & Sign Up
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 Review your details and accept the terms.
//               </p>
//             </div>

//             <div className="bg-[#090e14] border border-white/5 p-10 rounded-3xl space-y-2">
//               <div className="flex items-center gap-2 text-zinc-600 mb-2 justify-center">
//                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">
//                   Your Details
//                 </span>
//               </div>
//               <div className="space-y-4">
//                 <SummaryItem label="Name" value={formData.name || "â€”"} />
//                 <SummaryItem
//                   label="Company"
//                   value={formData.company || "â€”"}
//                 />
//                 <SummaryItem label="Email" value={formData.email || "â€”"} />
//                 <SummaryItem label="Trade" value={formData.trade || "â€”"} />
//                 <SummaryItem label="Mobile" value={formData.mobile || "â€”"} />
//                 {formData.wantsPortNumber && (
//                   <SummaryItem
//                     label="Porting Number"
//                     value={formData.portDetails.numberToPort || "â€”"}
//                   />
//                 )}
//                 <SummaryItem
//                   label="Hours"
//                   value={
//                     formData.setBusinessHours
//                       ? `${formData.openingTime} â€” ${formData.closingTime}`
//                       : "24/7 (No out of hours)"
//                   }
//                 />
//               </div>
//             </div>

//             <div
//               onClick={() => setAgreedToTerms(!agreedToTerms)}
//               className={`bg-[#090e14] border p-4 rounded-2xl flex items-start gap-4 transition-all group cursor-pointer ${agreedToTerms
//                 ? "border-orange-500/50 bg-orange-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
//                 : "border-white/5 hover:border-white/10"
//                 }`}
//             >
//               <div
//                 className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${agreedToTerms
//                   ? "bg-orange-500 border-orange-500"
//                   : "border-white/20 group-hover:border-white/40"
//                   }`}
//               >
//                 {agreedToTerms && (
//                   <Check size={16} className="text-black stroke-[4]" />
//                 )}
//               </div>
//               <div className="space-y-2">
//                 <p className="text-white font-bold text-sm">
//                   I agree to the Terms and Conditions
//                 </p>
//                 <p className="text-zinc-500 text-[10px] leading-relaxed">
//                   Including payment terms for a recurring monthly subscription
//                   (your payment method will be charged automatically each month)
//                   and the Mia.Ai Service Agreement.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* STEP 6 & 7 (unchanged) */}
//         {step === 6 && (
//           <div className="space-y-10">
//             <div className="space-y-2 text-center">
//               <h2 className="text-4xl font-black tracking-tighter">
//                 Verify Your Email
//               </h2>
//               <p className="text-zinc-500 font-medium tracking-wide">
//                 We've sent a 6-digit code to{" "}
//                 <span className="text-white">{formData.email}</span>
//               </p>
//             </div>

//             <div className="flex flex-col items-center space-y-6">
//               <input
//                 type="text"
//                 maxLength={6}
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="000000"
//                 className="w-full max-w-xs bg-[#12181e] border border-white/5 rounded-2xl px-6 py-5 text-center text-4xl font-black tracking-[0.5em] text-orange-500 placeholder-zinc-800 focus:outline-none focus:border-orange-500 transition-all"
//               />

//               {error && (
//                 <p className="text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-2">
//                   {error}
//                 </p>
//               )}

//               <button
//                 onClick={handleVerifyOtp}
//                 disabled={otp.length !== 6 || isSubmitting}
//                 className="w-full max-w-xs flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-10 py-4 rounded-xl text-lg font-black transition-all shadow-xl shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? "Verifying..." : "Verify OTP"}
//               </button>
//             </div>
//           </div>
//         )}

//         {step === 7 && (
//           <div className="flex flex-col items-center justify-center text-center py-10 space-y-10 animate-in fade-in zoom-in-95 duration-1000">
//             <div className="relative">
//               <div className="w-24 h-24 rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
//                 <Check size={48} className="text-emerald-500" />
//               </div>
//               <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full -z-10" />
//             </div>

//             <div className="space-y-4">
//               <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
//                 You're All Set!
//               </h2>
//               <p className="text-zinc-500 text-sm sm:text-base max-w-md leading-relaxed font-medium">
//                 In a real sign-up, you'd receive a confirmation email at <br />
//                 <span className="text-white font-bold tracking-tight">
//                   {formData.email}
//                 </span>
//               </p>
//             </div>

//             <div className="w-full max-w-sm bg-[#090e14]/50 border border-white/5 p-8 rounded-3xl text-left space-y-4">
//               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
//                 Summary
//               </span>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center text-xs">
//                   <span className="text-zinc-500 font-bold uppercase tracking-widest">
//                     Business:
//                   </span>
//                   <span className="text-white font-black">
//                     {formData.company}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center text-xs">
//                   <span className="text-zinc-500 font-bold uppercase tracking-widest">
//                     Trade:
//                   </span>
//                   <span className="text-white font-black">
//                     {formData.trade}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center text-xs">
//                   <span className="text-zinc-500 font-bold uppercase tracking-widest">
//                     Mobile:
//                   </span>
//                   <span className="text-white font-black">
//                     {formData.mobile}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center text-xs">
//                   <span className="text-zinc-500 font-bold uppercase tracking-widest">
//                     Hours:
//                   </span>
//                   <span className="text-white font-black">
//                     {formData.setBusinessHours
//                       ? `${formData.openingTime} â€” ${formData.closingTime}`
//                       : "24/7"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
//               <button
//                 onClick={onGoToLogin || onBack}
//                 className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-xl text-lg font-black transition-all"
//               >
//                 Go to Login
//               </button>
//             </div>
//           </div>
//         )}

//         {/* GLOBAL ACTIONS */}
//         {step < 6 && (
//           <div className="mt-10 flex items-center justify-between">
//             <button
//               onClick={prevStep}
//               disabled={hasRegisteredSuccess}
//               className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest group transition-colors ${hasRegisteredSuccess ? "text-zinc-500 cursor-not-allowed" : "text-zinc-600 hover:text-white"}`}
//             >
//               <ArrowLeft
//                 size={16}
//                 className="group-hover:-translate-x-1 transition-transform"
//               />
//               Back
//             </button>

//             {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

//             <button
//               onClick={step === 5 ? handleSignup : nextStep}
//               disabled={
//                 (step === 5 && (!agreedToTerms || isSubmitting)) || isSubmitting
//               }
//               className={`flex items-center gap-2 px-10 py-3 rounded-2xl text-lg font-black transition-all duration-300 shadow-xl hover:scale-[1.03] active:scale-95 group ${step === 5
//                 ? agreedToTerms
//                   ? "bg-orange-500 text-black shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
//                   : "bg-[#12181e] text-zinc-700 border border-white/5 cursor-not-allowed opacity-50"
//                 : "bg-orange-500 text-black shadow-orange-500/20 hover:bg-orange-400"
//                 }`}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center gap-2">
//                   <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                   Processing...
//                 </span>
//               ) : (
//                 <>
//                   {step === 5 ? (
//                     <Check size={20} className="stroke-[3]" />
//                   ) : null}
//                   {step === 5 ? "Complete Sign Up" : "Next"}
//                   {step !== 5 && (
//                     <ArrowLeft className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1" />
//                   )}
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// /* ---------------------------------------------------------------------- */
// /* Port-an-existing-number form (Step 3 sub-form)                          */
// /* ---------------------------------------------------------------------- */
// function PortNumberForm({
//   portDetails,
//   errors,
//   isUploadingDoc,
//   uploadedFileName,
//   onFieldChange,
//   onAuthContactChange,
//   onFileSelected,
//   onRemoveFile,
// }: {
//   portDetails: PortDetails;
//   errors: Record<string, string>;
//   isUploadingDoc: boolean;
//   uploadedFileName: string;
//   onFieldChange: (field: keyof PortDetails, value: string) => void;
//   onAuthContactChange: (
//     field: keyof PortAuthorisedContact,
//     value: string,
//   ) => void;
//   onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onRemoveFile: () => void;
// }) {
//   return (
//     <div className="mt-4 bg-[#090e14] border border-white/5 rounded-2xl p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
//       {/* Number to port */}
//       <div className="space-y-6">
//         <SectionHeading title="Number to Port" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <InputField
//             label="Display Name *"
//             value={portDetails.displayName}
//             icon={<User size={14} />}
//             placeholder="e.g. Jon's Plumbing Main Line"
//             error={errors.port_displayName}
//             onChange={(v: string) => onFieldChange("displayName", v)}
//           />
//           <InputField
//             label="Number to Port *"
//             value={portDetails.numberToPort}
//             icon={<Phone size={14} />}
//             placeholder="e.g. 07 3123 4567"
//             error={errors.port_numberToPort}
//             onChange={(v: string) => onFieldChange("numberToPort", v)}
//           />
//         </div>
//       </div>

//       {/* Current provider */}
//       <div className="space-y-6">
//         <SectionHeading
//           title="Current Provider"
//           sub="Details of the provider you're porting this number away from."
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <InputField
//             label="Provider Name *"
//             value={portDetails.providerName}
//             icon={<Building2 size={14} />}
//             placeholder="e.g. Telstra"
//             error={errors.port_providerName}
//             onChange={(v: string) => onFieldChange("providerName", v)}
//           />
//           <InputField
//             label="Account Number *"
//             value={portDetails.accountNumber}
//             icon={<Hash size={14} />}
//             placeholder="Provider account number"
//             error={errors.port_accountNumber}
//             onChange={(v: string) => onFieldChange("accountNumber", v)}
//           />
//         </div>
//       </div>

//       {/* Authorised contact */}
//       <div className="space-y-6">
//         <SectionHeading
//           title="Authorised Contact"
//           sub="The person authorised to submit this port-in request."
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <InputField
//             label="Given Name *"
//             value={portDetails.authorisedContact.givenName}
//             icon={<User size={14} />}
//             placeholder="First name"
//             error={errors.port_authGivenName}
//             onChange={(v: string) => onAuthContactChange("givenName", v)}
//           />
//           <InputField
//             label="Family Name *"
//             value={portDetails.authorisedContact.familyName}
//             icon={<User size={14} />}
//             placeholder="Last name"
//             error={errors.port_authFamilyName}
//             onChange={(v: string) => onAuthContactChange("familyName", v)}
//           />
//         </div>
//         <InputField
//           label="Contact Number *"
//           value={portDetails.authorisedContact.contactNumber}
//           icon={<Phone size={14} />}
//           placeholder="e.g. 0412 345 678"
//           error={errors.port_authContactNumber}
//           onChange={(v: string) => onAuthContactChange("contactNumber", v)}
//         />
//       </div>

//       {/* Entity details */}
//       <div className="space-y-6">
//         <SectionHeading
//           title="Entity Details"
//           sub="The legal entity and address of the account holder. This should match the name on your current provider's invoice."
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-3">
//             <div className="flex items-center gap-2 text-orange-500">
//               <Briefcase size={14} />
//               <label className="text-[10px] font-black uppercase tracking-widest">
//                 Entity Type *
//               </label>
//             </div>
//             <select
//               value={portDetails.entityType}
//               onChange={(e) => onFieldChange("entityType", e.target.value)}
//               className={`w-full bg-[#12181e] border rounded-xl px-5 py-4 text-white ${errors.port_entityType ? "border-red-500" : "border-white/5"
//                 }`}
//             >
//               <option value="">Select entity type</option>
//               {entityTypes.map((t) => (
//                 <option key={t} value={t}>
//                   {t}
//                 </option>
//               ))}
//             </select>
//             {errors.port_entityType && (
//               <p className="text-red-500 text-xs font-medium">
//                 {errors.port_entityType}
//               </p>
//             )}
//           </div>
//           <InputField
//             label="Identification Number (ABN / ACN) *"
//             value={portDetails.identificationNumber}
//             icon={<Hash size={14} />}
//             placeholder="e.g. 12 345 678 901"
//             error={errors.port_identificationNumber}
//             onChange={(v: string) => onFieldChange("identificationNumber", v)}
//           />
//         </div>

//         <InputField
//           label="Address *"
//           value={portDetails.address}
//           icon={<MapPin size={14} />}
//           placeholder="Street address"
//           error={errors.port_address}
//           onChange={(v: string) => onFieldChange("address", v)}
//         />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <InputField
//             label="City *"
//             value={portDetails.city}
//             icon={<MapPin size={14} />}
//             placeholder="e.g. Melbourne"
//             error={errors.port_city}
//             onChange={(v: string) => onFieldChange("city", v)}
//           />
//           <InputField
//             label="State *"
//             value={portDetails.state}
//             icon={<MapPin size={14} />}
//             placeholder="e.g. VIC"
//             error={errors.port_state}
//             onChange={(v: string) => onFieldChange("state", v)}
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <InputField
//             label="Postcode *"
//             value={portDetails.postcode}
//             icon={<Hash size={14} />}
//             placeholder="e.g. 3000"
//             error={errors.port_postcode}
//             onChange={(v: string) => onFieldChange("postcode", v)}
//           />
//           <div className="space-y-3">
//             <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
//               Country *
//             </label>
//             <select
//               value={portDetails.country}
//               onChange={(e) => onFieldChange("country", e.target.value)}
//               className={`w-full bg-[#12181e] border rounded-xl px-5 py-4 text-white ${errors.port_country ? "border-red-500" : "border-white/5"
//                 }`}
//             >
//               <option value="AU">Australia</option>
//               <option value="NZ">New Zealand</option>
//             </select>
//             {errors.port_country && (
//               <p className="text-red-500 text-xs font-medium">
//                 {errors.port_country}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Supporting document */}
//       <div className="space-y-3">
//         <SectionHeading
//           title="Supporting Documents *"
//           sub="A recent invoice with your current provider is required."
//         />

//         {uploadedFileName ? (
//           <div className="w-full flex items-center justify-between bg-[#12181e] border border-white/5 rounded-xl px-5 py-4">
//             <span className="text-sm text-white font-medium truncate">
//               {uploadedFileName}
//             </span>
//             <button
//               type="button"
//               onClick={onRemoveFile}
//               className="text-zinc-500 hover:text-red-500 transition-colors shrink-0 ml-3"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         ) : (
//           <label
//             className={`w-full flex items-center justify-center gap-2 border rounded-xl px-5 py-4 cursor-pointer transition-colors ${errors.port_supportingDocument
//               ? "border-red-500 text-red-400"
//               : "border-white/10 text-zinc-400 hover:border-white/20"
//               } ${isUploadingDoc ? "opacity-60 pointer-events-none" : ""}`}
//           >
//             <UploadCloud size={16} />
//             <span className="font-bold text-sm">
//               {isUploadingDoc ? "Uploading..." : "Add Attachment"}
//             </span>
//             <input
//               type="file"
//               accept=".pdf,.png,.jpg,.jpeg"
//               className="hidden"
//               onChange={onFileSelected}
//               disabled={isUploadingDoc}
//             />
//           </label>
//         )}

//         {errors.port_supportingDocument && (
//           <p className="text-red-500 text-xs font-medium">
//             {errors.port_supportingDocument}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// function SectionHeading({ title, sub }: { title: string; sub?: string }) {
//   return (
//     <div className="space-y-1">
//       <h3 className="text-sm font-black uppercase tracking-widest text-white">
//         {title}
//       </h3>
//       {sub && (
//         <p className="text-zinc-500 text-xs font-medium leading-relaxed">
//           {sub}
//         </p>
//       )}
//     </div>
//   );
// }

// /* InputField, CheckboxField, SummaryItem (same as before) */
// function InputField({
//   label,
//   value,
//   icon,
//   placeholder,
//   highlight = false,
//   subLabel,
//   type = "text",
//   error,
//   onChange,
//   disabled = false,
// }: any) {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-2 text-orange-500">
//         {icon}
//         <label className="text-[10px] font-black uppercase tracking-widest">
//           {label}
//         </label>
//       </div>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange && onChange(e.target.value)}
//         placeholder={placeholder}
//         disabled={disabled}
//         className={`w-full bg-[#12181e] border rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none transition-all ${disabled
//           ? "opacity-60 cursor-not-allowed border-white/10"
//           : error
//             ? "border-red-500"
//             : highlight
//               ? "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.05)]"
//               : "border-white/5"
//           }`}
//       />
//       {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
//       {subLabel && (
//         <p className="text-zinc-600 text-[10px] font-medium leading-relaxed">
//           {subLabel}
//         </p>
//       )}
//     </div>
//   );
// }

// function CheckboxField({ checked, label, sub }: any) {
//   return (
//     <div className="bg-[#090e14] border border-white/5 p-6 rounded-2xl flex items-center gap-5 transition-all hover:border-white/10 group cursor-pointer">
//       <div
//         className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border-2 transition-colors ${checked ? "bg-orange-500 border-orange-500" : "border-white/10"
//           }`}
//       >
//         {checked && <Check size={16} className="text-black" />}
//       </div>
//       <div className="space-y-0.5">
//         <p className="text-white font-bold text-sm tracking-tight">{label}</p>
//         {sub && (
//           <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest opacity-60">
//             {sub}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// function SummaryItem({ label, value }: any) {
//   return (
//     <div className="flex items-center justify-between border-b border-white/5 pb-4">
//       <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
//         {label}:
//       </span>
//       <span className="text-white font-black tracking-tight">{value}</span>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
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
  Info,
  Building2,
  MapPin,
  Hash,
  UploadCloud,
  X,
} from "lucide-react";
import { authService } from "../services/authService";
import logo from "../assets/logo.png";
import Select from "react-select";

interface SignupProps {
  onBack: () => void;
  onSuccess?: (user: any, token: string) => void;
  onGoToLogin?: () => void;
}

interface PortAuthorisedContact {
  givenName: string;
  familyName: string;
  contactNumber: string;
}

interface PortDetails {
  displayName: string;
  numberToPort: string;
  providerName: string;
  accountNumber: string;
  entityType: string;
  identificationNumber: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  // NOTE: supportingDocumentPath is NOT set by the frontend.
  // It is populated by the backend after receiving the uploaded file.
  // We keep it in the interface for type-safety but never write to it manually.
  supportingDocumentPath: string;
  authorisedContact: PortAuthorisedContact;
}

const emptyPortDetails: PortDetails = {
  displayName: "",
  numberToPort: "",
  providerName: "",
  accountNumber: "",
  entityType: "",
  identificationNumber: "",
  address: "",
  city: "",
  state: "",
  postcode: "",
  country: "AU",
  supportingDocumentPath: "",
  authorisedContact: {
    givenName: "",
    familyName: "",
    contactNumber: "",
  },
};

const entityTypes = [
  "Company",
  "Business",
];

export default function Signup({ onBack, onGoToLogin }: SignupProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [showCityInfo, setShowCityInfo] = useState(false);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("signupFormData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          wantsPortNumber: false,
          portDetails: emptyPortDetails,
          ...parsed,
        };
      } catch (e) {
        // ignore
      }
    }
    return {
      name: "",
      company: "",
      email: "",
      password: "",
      acn: "",
      trade: "",
      mobile: "",
      setBusinessHours: true,
      openingTime: "07:00",
      closingTime: "18:00",
      notificationPreference: "both",
      callReceivedOn: "mobile",
      country: "AU",
      cityCode: "",
      wantsPortNumber: false,
      portDetails: emptyPortDetails,
    };
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  //@ts-ignore
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // -----------------------------------------------------------------------
  // Stores the raw File object selected by the user for the porting document.
  // No pre-upload happens — the file is sent together with the register call.
  // -----------------------------------------------------------------------
  const [portDocumentFile, setPortDocumentFile] = useState<File | null>(null);

  const steps = [
    { id: 1, label: "Your Details", icon: <User size={16} /> },
    { id: 2, label: "Your Trade", icon: <Hammer size={16} /> },
    { id: 3, label: "Number Setup", icon: <Phone size={16} /> },
    { id: 4, label: "Delivery", icon: <Clock size={16} /> },
    { id: 5, label: "Confirm", icon: <Check size={16} /> },
    { id: 6, label: "Verify", icon: <Mail size={16} /> },
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
    "Pest Control",
  ];

  const australianCityOptions = [
    {
      group: "Australian Capital Territory (ACT)",
      options: [{ value: "ACT-CANBERRA", label: "Canberra" }],
    },
    {
      group: "New South Wales (NSW)",
      options: [
        { value: "NSW-SYDNEY", label: "Sydney" },
        { value: "NSW-NEWCASTLE", label: "Newcastle" },
        { value: "NSW-GOSFORD", label: "Gosford" },
        { value: "NSW-NOWRA", label: "Nowra" },
        { value: "NSW-CAMPBELLTOWN", label: "Campbelltown" },
        { value: "NSW-PENRITH", label: "Penrith" },
        { value: "NSW-TAREE", label: "Taree" },
        { value: "NSW-COFFS-HARBOUR", label: "Coffs Harbour" },
        { value: "NSW-ALBURY", label: "Albury" },
      ],
    },
    {
      group: "Queensland (QLD)",
      options: [
        { value: "QLD-BRISBANE", label: "Brisbane" },
        { value: "QLD-CAIRNS", label: "Cairns" },
        { value: "QLD-TOWNSVILLE", label: "Townsville" },
        { value: "QLD-TOOWOOMBA", label: "Toowoomba" },
        { value: "QLD-ROCKHAMPTON", label: "Rockhampton" },
        { value: "QLD-MARYBOROUGH", label: "Maryborough" },
        { value: "QLD-SOUTHPORT", label: "Southport" },
        { value: "QLD-BEAUDESERT", label: "Beaudesert" },
      ],
    },
    {
      group: "Victoria (VIC)",
      options: [
        { value: "VIC-MELBOURNE", label: "Melbourne" },
        { value: "VIC-GEELONG", label: "Geelong" },
      ],
    },
    {
      group: "South Australia (SA)",
      options: [{ value: "SA-ADELAIDE", label: "Adelaide" }],
    },
    {
      group: "Western Australia (WA)",
      options: [
        { value: "WA-PERTH", label: "Perth" },
        { value: "WA-BUNBURY", label: "Bunbury" },
        { value: "WA-PINJARRA", label: "Pinjarra" },
      ],
    },
    {
      group: "Tasmania (TAS)",
      options: [
        { value: "TAS-HOBART", label: "Hobart" },
        { value: "TAS-LAUNCESTON", label: "Launceston" },
      ],
    },
    {
      group: "Northern Territory (NT)",
      options: [{ value: "NT-DARWIN", label: "Darwin" }],
    },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const STRIPE_PENDING_TOKEN_KEY = "pendingStripeAuthToken";
  const [hasRegisteredSuccess, setHasRegisteredSuccess] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isSyncingStripe, setIsSyncingStripe] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return !!urlParams.get("session_id");
  });
  const [loginToken, setLoginToken] = useState<string | null>(() => {
    return localStorage.getItem(STRIPE_PENDING_TOKEN_KEY);
  });

  useEffect(() => {
    if (formData.callReceivedOn === "mobile") {
      showMobileInfoMessage();
    } else {
      setShowMobileInfo(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [formData.callReceivedOn]);

  const nextStep = () => {
    setError(null);
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
        isValid = false;
      }
      if (!formData.company.trim()) {
        newErrors.company = "Company Name is required";
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
          isValid = false;
        }
      }
      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
        isValid = false;
      }
      if (formData.country === "AU" && !formData.cityCode) {
        newErrors.cityCode = "Please select a city";
        isValid = false;
      }
    }

    if (step === 2) {
      if (!formData.trade) {
        setError("Please select a trade");
        isValid = false;
      }
    }

    if (step === 3) {
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
        isValid = false;
      }

      if (formData.wantsPortNumber) {
        const p: PortDetails = formData.portDetails;

        if (!p.displayName.trim()) {
          newErrors.port_displayName = "Display name is required";
          isValid = false;
        }
        if (!p.numberToPort.trim()) {
          newErrors.port_numberToPort = "Number to port is required";
          isValid = false;
        }
        if (!p.providerName.trim()) {
          newErrors.port_providerName = "Provider name is required";
          isValid = false;
        }
        if (!p.accountNumber.trim()) {
          newErrors.port_accountNumber = "Account number is required";
          isValid = false;
        }
        if (!p.entityType) {
          newErrors.port_entityType = "Entity type is required";
          isValid = false;
        }
        if (!p.identificationNumber.trim()) {
          newErrors.port_identificationNumber =
            "Identification number is required";
          isValid = false;
        }
        if (!p.address.trim()) {
          newErrors.port_address = "Address is required";
          isValid = false;
        }
        if (!p.city.trim()) {
          newErrors.port_city = "City is required";
          isValid = false;
        }
        if (!p.state.trim()) {
          newErrors.port_state = "State is required";
          isValid = false;
        }
        if (!p.postcode.trim()) {
          newErrors.port_postcode = "Postcode is required";
          isValid = false;
        }
        if (!p.country) {
          newErrors.port_country = "Country is required";
          isValid = false;
        }
        if (!p.authorisedContact.givenName.trim()) {
          newErrors.port_authGivenName = "Given name is required";
          isValid = false;
        }
        if (!p.authorisedContact.familyName.trim()) {
          newErrors.port_authFamilyName = "Family name is required";
          isValid = false;
        }
        if (!p.authorisedContact.contactNumber.trim()) {
          newErrors.port_authContactNumber = "Contact number is required";
          isValid = false;
        }
        // Validate that the user has actually selected a file
        if (!portDocumentFile) {
          newErrors.port_supportingDocument =
            "Please attach a supporting document";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    if (!isValid) return;
    setStep((prev) => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    if (hasRegisteredSuccess) return;
    if (step === 1) onBack();
    else setStep((prev) => prev - 1);
  };

  const handleSignup = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const openingHours = formData.setBusinessHours
        ? `${formData.openingTime}-${formData.closingTime} MON-FRI`
        : "24/7";

      const payload: Record<string, any> = {
        customerName: formData.name,
        companyName: formData.company,
        acn: formData.acn,
        email: formData.email,
        password: formData.password,
        trade: formData.trade,
        mobileNumber: formData.mobile,
        wantsGeoNumber: false,
        geoNumberType: "NONE",
        wantsPortNumber: formData.wantsPortNumber,
        porting: Boolean(formData.wantsPortNumber),
        openingHours,
        paymentDetails: {},
        country: formData.country,
        notificationPreference: formData.notificationPreference,
        callReceivedOn: formData.callReceivedOn,
        cityCode: formData.country === "AU" ? formData.cityCode : "",
      };

      // Only attach porting fields when the user opted in.
      // supportingDocumentPath is intentionally omitted — the backend
      // derives it from the uploaded file and sets it automatically.
      if (formData.wantsPortNumber) {
        const p: PortDetails = formData.portDetails;
        payload.displayName = p.displayName;
        payload.numberToPort = p.numberToPort;
        payload.providerName = p.providerName;
        payload.accountNumber = p.accountNumber;
        payload.entityType = p.entityType;
        payload.identificationNumber = p.identificationNumber;
        payload.address = p.address;
        payload.city = p.city;
        payload.state = p.state;
        payload.postcode = p.postcode;
        payload.country = p.country;
        payload.authorisedContact = {
          givenName: p.authorisedContact.givenName,
          familyName: p.authorisedContact.familyName,
          contactNumber: p.authorisedContact.contactNumber,
        };
      }

      let res: any;

      if (formData.wantsPortNumber && portDocumentFile) {
        // Send as multipart/form-data so the backend receives the file
        // and can save it, generating supportingDocumentPath on its side.
        res = await authService.registerWithDocument(payload, portDocumentFile);
      } else {
        // No porting — plain JSON register
        res = await authService.register(payload);
      }

      if (res.userId) {
        setHasRegisteredSuccess(true);
        setStep(6);
      } else {
        setError(res.message || "Failed to register");
      }
    } catch (err) {
      setError("An error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await authService.verifyOtp(formData.email, otp);
      if (res.message === "Email verified successfully") {
        await loginAfterSignup();
      } else {
        setError(res.message || "Invalid OTP");
      }
    } catch (err) {
      setError("An error occurred during verification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginAfterSignup = async () => {
    try {
      const loginRes = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      if (loginRes.accessToken) {
        const token = loginRes.accessToken;
        setLoginToken(token);
        localStorage.setItem(STRIPE_PENDING_TOKEN_KEY, token);
        localStorage.setItem("signupFormData", JSON.stringify(formData));
        await processPaymentAndLogout(token);
      } else {
        console.error("Login failed after signup", loginRes);
      }
    } catch (loginErr) {
      console.error("Error logging in after signup", loginErr);
    }
  };

  const processPaymentAndLogout = async (token: string) => {
    setIsPaymentProcessing(true);
    setError(null);
    try {
      const checkoutRes = await authService.createCheckout(token);
      const checkoutUrl = checkoutRes.url || checkoutRes.checkoutUrl;
      if (!checkoutUrl) {
        setError("Unable to start payment checkout.");
        return;
      }
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("Payment checkout failed", err);
      setError("Payment checkout failed. Please try again later.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    if (!sessionId) { setIsSyncingStripe(false); return; }
    if (!loginToken) { setIsSyncingStripe(false); return; }

    window.history.replaceState({}, document.title, window.location.pathname);

    const syncStripe = async () => {
      try {
        await authService.syncSession(sessionId, loginToken);
      } catch (err) {
        console.error("Stripe session sync failed", err);
      } finally {
        localStorage.removeItem(STRIPE_PENDING_TOKEN_KEY);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("signupFormData");
        setIsSyncingStripe(false);
        setStep(7);
        setTimeout(() => {
          if (onGoToLogin) onGoToLogin();
          else onBack();
        }, 5000);
      }
    };

    syncStripe();
  }, [loginToken, onBack, onGoToLogin]);

  const showMobileInfoMessage = () => {
    setShowMobileInfo(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowMobileInfo(false), 5000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      if (field === "country" && value !== "AU") {
        return { ...prev, [field]: value, cityCode: "" };
      }
      return { ...prev, [field]: value };
    });

    if (field === "password") {
      if (value.length > 0 && value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 8 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
      return;
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePortDetailChange = (field: keyof PortDetails, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      portDetails: { ...prev.portDetails, [field]: value },
    }));
    const errorKey = `port_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleAuthorisedContactChange = (
    field: keyof PortAuthorisedContact,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      portDetails: {
        ...prev.portDetails,
        authorisedContact: {
          ...prev.portDetails.authorisedContact,
          [field]: value,
        },
      },
    }));
    const errorKeyMap: Record<string, string> = {
      givenName: "port_authGivenName",
      familyName: "port_authFamilyName",
      contactNumber: "port_authContactNumber",
    };
    const errorKey = errorKeyMap[field];
    if (errorKey && errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const togglePortNumber = () => {
    setFormData((prev: any) => ({
      ...prev,
      wantsPortNumber: !prev.wantsPortNumber,
    }));
  };

  // Simply store the selected File in state — NO API call here.
  // The file will be sent to the backend together with the register payload.
  const handleSupportingDocumentSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPortDocumentFile(file);
    // Clear the file-related validation error if it was showing
    if (errors.port_supportingDocument) {
      setErrors((prev) => ({ ...prev, port_supportingDocument: "" }));
    }
    // Reset input so the same file can be re-selected later if needed
    e.target.value = "";
  };

  const removePortDocumentFile = () => {
    setPortDocumentFile(null);
  };

  if (isSyncingStripe) {
    return (
      <div className="min-h-screen bg-[#03070b] text-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-zinc-400 font-medium">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03070b] text-white flex flex-col items-center">
      {/* HEADER BAR */}
      <header className="w-full px-6 py-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={prevStep}
            disabled={hasRegisteredSuccess}
            className={`flex items-center gap-2 transition-colors ${hasRegisteredSuccess ? "text-zinc-500 cursor-not-allowed" : "text-zinc-500 hover:text-white"}`}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
          Step {step}/5
        </span>
      </header>

      {/* STEPPER NAVIGATION */}
      <div className="w-full max-w-4xl mt-12 mb-16 overflow-x-auto no-scrollbar px-6">
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
          <div className="absolute bottom-4 left-0 w-full h-[2px] bg-white/5 -z-10" />
        </div>
      </div>

      {/* FORM CONTAINER */}
      <main className="w-full max-w-2xl px-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {step === 1 && (
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter">Your Details</h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                Tell us about yourself and your business.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <InputField
                label="Your Name *"
                value={formData.name}
                icon={<User size={14} />}
                placeholder="Jon Smith"
                error={errors.name}
                onChange={(v: string) => handleInputChange("name", v)}
              />
              <InputField
                label="Company Name *"
                value={formData.company}
                icon={<Briefcase size={14} />}
                placeholder="Jon's Plumbing"
                error={errors.company}
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
                label="Email *"
                value={formData.email}
                icon={<Mail size={14} />}
                placeholder="jon@plumbing.com.au"
                error={errors.email}
                onChange={(v: string) => handleInputChange("email", v)}
              />
              <InputField
                label="Password *"
                type="password"
                value={formData.password}
                icon={<FileText size={14} />}
                placeholder=""
                error={errors.password}
                onChange={(v: string) => handleInputChange("password", v)}
              />
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  Notification Preference
                </label>
                <select
                  value={formData.notificationPreference}
                  onChange={(e) =>
                    handleInputChange("notificationPreference", e.target.value)
                  }
                  className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                    Call Received On
                  </label>
                  {formData.callReceivedOn === "mobile" && (
                    <button
                      type="button"
                      onClick={showMobileInfoMessage}
                      className="text-orange-400 hover:text-orange-300"
                    >
                      <Info size={14} />
                    </button>
                  )}
                </div>
                <select
                  value={formData.callReceivedOn}
                  onChange={(e) =>
                    handleInputChange("callReceivedOn", e.target.value)
                  }
                  className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white"
                >
                  <option value="mobile">Mobile</option>
                  <option value="landline">Landline</option>
                </select>
              </div>
              {showMobileInfo && (
                <div className="mt-3 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 animate-in fade-in duration-300">
                  <p className="text-xs leading-6 text-orange-100 text-justify">
                    <span className="font-semibold">Note:</span> Mobile call
                    forwarding uses your network operator's USSD service. Most
                    operators do not support USSD call forwarding on prepaid
                    mobile plans. If you have a prepaid SIM, please switch to a
                    postpaid plan or select <strong>Landline</strong> instead.
                  </p>
                </div>
              )}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full bg-[#12181e] border border-white/5 rounded-xl px-5 py-4 text-white"
                >
                  <option value="AU">Australia</option>
                  <option value="NZ">New Zealand</option>
                </select>
              </div>
              {formData.country === "AU" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                      City *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCityInfo((prev) => !prev)}
                      className="text-orange-400 hover:text-orange-300"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <Select
                    options={australianCityOptions.map((group) => ({
                      label: group.group,
                      options: group.options,
                    }))}
                    value={
                      australianCityOptions
                        .flatMap((g) => g.options)
                        .find((city) => city.label === formData.cityCode) ||
                      null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange("cityCode", selectedOption?.label || "")
                    }
                    placeholder="Search or select a city..."
                    isSearchable
                    className="text-black"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#12181e",
                        borderColor: "#2a2a2a",
                        minHeight: "56px",
                        borderRadius: "12px",
                        color: "white",
                      }),
                      singleValue: (base) => ({ ...base, color: "white" }),
                      input: (base) => ({ ...base, color: "white" }),
                      menu: (base) => ({ ...base, backgroundColor: "#12181e" }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "#f97316" : "#12181e",
                        color: "white",
                        cursor: "pointer",
                      }),
                      groupHeading: (base) => ({
                        ...base,
                        color: "#f97316",
                        fontWeight: "bold",
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }),
                      placeholder: (base) => ({ ...base, color: "#71717a" }),
                    }}
                  />
                  {errors.cityCode && (
                    <p className="text-red-500 text-xs font-medium mt-2">
                      {errors.cityCode}
                    </p>
                  )}
                  {showCityInfo && (
                    <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 animate-in fade-in duration-300">
                      <p className="text-xs leading-6 text-orange-100 text-justify">
                        <span className="font-semibold">Note:</span> If your
                        city is not listed, please select the city closest to
                        your location.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 text-center sm:text-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter">
                What Trade Are You?
              </h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                This helps Mia.Ai qualify callers and check they need the right trade.
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

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter">Number Setup</h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                Enter your mobile number.
              </p>
            </div>

            <InputField
              label="Mobile Number *"
              value={formData.mobile}
              icon={<Phone size={14} />}
              placeholder={
                formData.country === "AU" ? "+61 412 345 678" : "+64 21 123 4567"
              }
              error={errors.mobile}
              onChange={(v: string) =>
                handleInputChange("mobile", v.replace(/[^+\d\s]/g, ""))
              }
            />
            <p className="mt-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-zinc-400">
              <span className="font-semibold text-orange-400">Note:</span> Write
              your mobile number including the country code, for example{" "}
              {formData.country === "AU" ? "+61 412 345 678" : "+64 21 123 4567"}.
            </p>

            {/* PORT AN EXISTING NUMBER TOGGLE */}
            <div
              onClick={togglePortNumber}
              className={`mt-4 bg-[#090e14] border p-6 rounded-2xl flex items-center gap-5 transition-all cursor-pointer group ${
                formData.wantsPortNumber
                  ? "border-orange-500/50 bg-orange-500/5"
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border-2 transition-colors ${
                  formData.wantsPortNumber
                    ? "bg-orange-500 border-orange-500"
                    : "border-white/10"
                }`}
              >
                {formData.wantsPortNumber && (
                  <Check size={16} className="text-black stroke-[4]" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-white font-bold text-sm tracking-tight">
                  Do you want to port an existing number?
                </p>
                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest opacity-60">
                  Move a number you already own onto Mia.Ai
                </p>
              </div>
            </div>

            {formData.wantsPortNumber && (
              <PortNumberForm
                portDetails={formData.portDetails}
                errors={errors}
                portDocumentFile={portDocumentFile}
                onFieldChange={handlePortDetailChange}
                onAuthContactChange={handleAuthorisedContactChange}
                onFileSelected={handleSupportingDocumentSelect}
                onRemoveFile={removePortDocumentFile}
              />
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter">Delivery</h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                Set when you want to receive leads.
              </p>
            </div>
            <div
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  setBusinessHours: !prev.setBusinessHours,
                }))
              }
            >
              <CheckboxField
                checked={formData.setBusinessHours}
                label="Set business hours"
                sub="Recommended - allows after-hours messaging"
              />
            </div>
            {formData.setBusinessHours && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <InputField
                  label="Opening Time"
                  value={formData.openingTime}
                  icon={<Clock size={14} />}
                  type="time"
                  onChange={(v: string) => handleInputChange("openingTime", v)}
                />
                <InputField
                  label="Closing Time"
                  value={formData.closingTime}
                  icon={<Clock size={14} />}
                  type="time"
                  onChange={(v: string) => handleInputChange("closingTime", v)}
                />
              </div>
            )}
          </div>
        )}

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
                <SummaryItem label="Name" value={formData.name || "-"} />
                <SummaryItem label="Company" value={formData.company || "-"} />
                <SummaryItem label="Email" value={formData.email || "-"} />
                <SummaryItem label="Trade" value={formData.trade || "-"} />
                <SummaryItem label="Mobile" value={formData.mobile || "-"} />
                {formData.wantsPortNumber && (
                  <>
                    <SummaryItem
                      label="Porting Number"
                      value={formData.portDetails.numberToPort || "-"}
                    />
                    <SummaryItem
                      label="Supporting Doc"
                      value={portDocumentFile ? portDocumentFile.name : "-"}
                    />
                  </>
                )}
                <SummaryItem
                  label="Hours"
                  value={
                    formData.setBusinessHours
                      ? `${formData.openingTime} - ${formData.closingTime}`
                      : "24/7 (No out of hours)"
                  }
                />
              </div>
            </div>
            <div
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={`bg-[#090e14] border p-4 rounded-2xl flex items-start gap-4 transition-all group cursor-pointer ${
                agreedToTerms
                  ? "border-orange-500/50 bg-orange-500/5"
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
                  Including payment terms for a recurring monthly subscription
                  (your payment method will be charged automatically each month)
                  and the Mia.Ai Service Agreement.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-10">
            <div className="space-y-2 text-center">
              <h2 className="text-4xl font-black tracking-tighter">
                Verify Your Email
              </h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                We've sent a 6-digit code to{" "}
                <span className="text-white">{formData.email}</span>
              </p>
            </div>
            <div className="flex flex-col items-center space-y-6">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full max-w-xs bg-[#12181e] border border-white/5 rounded-2xl px-6 py-5 text-center text-4xl font-black tracking-[0.5em] text-orange-500 placeholder-zinc-800 focus:outline-none focus:border-orange-500 transition-all"
              />
              {error && (
                <p className="text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                  {error}
                </p>
              )}
              <button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || isSubmitting}
                className="w-full max-w-xs flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-10 py-4 rounded-xl text-lg font-black transition-all shadow-xl shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-10 animate-in fade-in zoom-in-95 duration-1000">
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
                You'll receive a confirmation email at{" "}
                <span className="text-white font-bold tracking-tight">
                  {formData.email}
                </span>
              </p>
            </div>
            <div className="w-full max-w-sm bg-[#090e14]/50 border border-white/5 p-8 rounded-3xl text-left space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
                Summary
              </span>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">Business:</span>
                  <span className="text-white font-black">{formData.company}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">Trade:</span>
                  <span className="text-white font-black">{formData.trade}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">Mobile:</span>
                  <span className="text-white font-black">{formData.mobile}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">Hours:</span>
                  <span className="text-white font-black">
                    {formData.setBusinessHours
                      ? `${formData.openingTime} - ${formData.closingTime}`
                      : "24/7"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <button
                onClick={onGoToLogin || onBack}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-xl text-lg font-black transition-all"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {/* GLOBAL ACTIONS */}
        {step < 6 && (
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={hasRegisteredSuccess}
              className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest group transition-colors ${
                hasRegisteredSuccess
                  ? "text-zinc-500 cursor-not-allowed"
                  : "text-zinc-600 hover:text-white"
              }`}
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back
            </button>

            {error && (
              <p className="text-red-500 text-xs font-bold">{error}</p>
            )}

            <button
              onClick={step === 5 ? handleSignup : nextStep}
              disabled={
                (step === 5 && (!agreedToTerms || isSubmitting)) || isSubmitting
              }
              className={`flex items-center gap-2 px-10 py-3 rounded-2xl text-lg font-black transition-all duration-300 shadow-xl hover:scale-[1.03] active:scale-95 group ${
                step === 5
                  ? agreedToTerms
                    ? "bg-orange-500 text-black shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
                    : "bg-[#12181e] text-zinc-700 border border-white/5 cursor-not-allowed opacity-50"
                  : "bg-orange-500 text-black shadow-orange-500/20 hover:bg-orange-400"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  {step === 5 ? <Check size={20} className="stroke-[3]" /> : null}
                  {step === 5 ? "Complete Sign Up" : "Next"}
                  {step !== 5 && (
                    <ArrowLeft className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1" />
                  )}
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Port-an-existing-number sub-form (Step 3)                               */
/* ---------------------------------------------------------------------- */
// Format a local Australian phone number for display while typing.
// - Mobile (starts with 04): 0412 345 678 (4-3-3)
// - Landline (starts with 0 but not 04): 07 3123 4567 (2-4-4)
function formatPortNumber(input: string) {
  if (!input) return "";
  const digits = input.replace(/\D+/g, "");
  if (digits.startsWith("04")) {
    // mobile: 4-3-3
    const part1 = digits.slice(0, 4);
    const part2 = digits.slice(4, 7);
    const part3 = digits.slice(7, 10);
    return [part1, part2, part3].filter(Boolean).join(" ");
  }
  if (digits.startsWith("0")) {
    // landline: 2-4-4
    const part1 = digits.slice(0, 2);
    const part2 = digits.slice(2, 6);
    const part3 = digits.slice(6, 10);
    return [part1, part2, part3].filter(Boolean).join(" ");
  }
  // fallback: just chunk into groups of up to 4
  return digits.replace(/(\d{1,4})(?=\d)/g, "$1 ");
}

function PortNumberForm({
  portDetails,
  errors,
  portDocumentFile,
  onFieldChange,
  onAuthContactChange,
  onFileSelected,
  onRemoveFile,
}: {
  portDetails: PortDetails;
  errors: Record<string, string>;
  portDocumentFile: File | null;
  onFieldChange: (field: keyof PortDetails, value: string) => void;
  onAuthContactChange: (field: keyof PortAuthorisedContact, value: string) => void;
  onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}) {
  return (
    <div className="mt-4 bg-[#090e14] border border-white/5 rounded-2xl p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">

      {/* Number to port */}
      <div className="space-y-6">
        <SectionHeading title="Number to Port" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Display Name *"
            value={portDetails.displayName}
            icon={<User size={14} />}
            placeholder="e.g. Jon's Plumbing Main Line"
            error={errors.port_displayName}
            onChange={(v: string) => onFieldChange("displayName", v)}
          />
          <InputField
            label="Number to Port *"
            value={portDetails.numberToPort}
            icon={<Phone size={14} />}
            placeholder="e.g. 0412 345 678"
            error={errors.port_numberToPort}
            onChange={(v: string) => onFieldChange("numberToPort", formatPortNumber(v))}
          />
        </div>
      </div>

      {/* Current provider */}
      <div className="space-y-6">
        <SectionHeading
          title="Current Provider"
          sub="Details of the provider you're porting this number away from."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Provider Name *"
            value={portDetails.providerName}
            icon={<Building2 size={14} />}
            placeholder="e.g. Telstra"
            error={errors.port_providerName}
            onChange={(v: string) => onFieldChange("providerName", v)}
          />
          <InputField
            label="Account Number *"
            value={portDetails.accountNumber}
            icon={<Hash size={14} />}
            placeholder="Provider account number"
            error={errors.port_accountNumber}
            onChange={(v: string) => onFieldChange("accountNumber", v)}
          />
        </div>
      </div>

      {/* Authorised contact */}
      <div className="space-y-6">
        <SectionHeading
          title="Authorised Contact"
          sub="The person authorised to submit this port-in request."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Given Name *"
            value={portDetails.authorisedContact.givenName}
            icon={<User size={14} />}
            placeholder="First name"
            error={errors.port_authGivenName}
            onChange={(v: string) => onAuthContactChange("givenName", v)}
          />
          <InputField
            label="Family Name *"
            value={portDetails.authorisedContact.familyName}
            icon={<User size={14} />}
            placeholder="Last name"
            error={errors.port_authFamilyName}
            onChange={(v: string) => onAuthContactChange("familyName", v)}
          />
        </div>
        <InputField
          label="Contact Number *"
          value={portDetails.authorisedContact.contactNumber}
          icon={<Phone size={14} />}
          placeholder="e.g. 0412 345 678"
          error={errors.port_authContactNumber}
          onChange={(v: string) => onAuthContactChange("contactNumber", v)}
        />
      </div>

      {/* Entity details */}
      <div className="space-y-6">
        <SectionHeading
          title="Entity Details"
          sub="The legal entity and address of the account holder. This should match the name on your current provider's invoice."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-500">
              <Briefcase size={14} />
              <label className="text-[10px] font-black uppercase tracking-widest">
                Entity Type *
              </label>
            </div>
            <select
              value={portDetails.entityType}
              onChange={(e) => onFieldChange("entityType", e.target.value)}
              className={`w-full bg-[#12181e] border rounded-xl px-5 py-4 text-white ${
                errors.port_entityType ? "border-red-500" : "border-white/5"
              }`}
            >
              <option value="">Select entity type</option>
              {entityTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.port_entityType && (
              <p className="text-red-500 text-xs font-medium">
                {errors.port_entityType}
              </p>
            )}
          </div>
          <InputField
            label="Identification Number (ABN / ACN) *"
            value={portDetails.identificationNumber}
            icon={<Hash size={14} />}
            placeholder="e.g. 12 345 678 901"
            error={errors.port_identificationNumber}
            onChange={(v: string) => onFieldChange("identificationNumber", v)}
          />
        </div>

        <InputField
          label="Address *"
          value={portDetails.address}
          icon={<MapPin size={14} />}
          placeholder="Street address"
          error={errors.port_address}
          onChange={(v: string) => onFieldChange("address", v)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="City *"
            value={portDetails.city}
            icon={<MapPin size={14} />}
            placeholder="e.g. Melbourne"
            error={errors.port_city}
            onChange={(v: string) => onFieldChange("city", v)}
          />
          <InputField
            label="State *"
            value={portDetails.state}
            icon={<MapPin size={14} />}
            placeholder="e.g. VIC"
            error={errors.port_state}
            onChange={(v: string) => onFieldChange("state", v)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Postcode *"
            value={portDetails.postcode}
            icon={<Hash size={14} />}
            placeholder="e.g. 3000"
            error={errors.port_postcode}
            onChange={(v: string) => onFieldChange("postcode", v)}
          />
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">
              Country *
            </label>
            <select
              value={portDetails.country}
              onChange={(e) => onFieldChange("country", e.target.value)}
              className={`w-full bg-[#12181e] border rounded-xl px-5 py-4 text-white ${
                errors.port_country ? "border-red-500" : "border-white/5"
              }`}
            >
              <option value="AU">Australia</option>
              <option value="NZ">New Zealand</option>
            </select>
            {errors.port_country && (
              <p className="text-red-500 text-xs font-medium">
                {errors.port_country}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Supporting document — file stored locally, sent with register call */}
      <div className="space-y-3">
        <SectionHeading
          title="Supporting Documents *"
          sub="A recent invoice from your current provider is required. The file will be submitted together with your registration."
        />

        {portDocumentFile ? (
          <div className="w-full flex items-center justify-between bg-[#12181e] border border-white/5 rounded-xl px-5 py-4">
            <span className="text-sm text-white font-medium truncate">
              {portDocumentFile.name}
            </span>
            <button
              type="button"
              onClick={onRemoveFile}
              className="text-zinc-500 hover:text-red-500 transition-colors shrink-0 ml-3"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label
            className={`w-full flex items-center justify-center gap-2 border rounded-xl px-5 py-4 cursor-pointer transition-colors ${
              errors.port_supportingDocument
                ? "border-red-500 text-red-400"
                : "border-white/10 text-zinc-400 hover:border-white/20"
            }`}
          >
            <UploadCloud size={16} />
            <span className="font-bold text-sm">Add Attachment</span>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={onFileSelected}
            />
          </label>
        )}

        {errors.port_supportingDocument && (
          <p className="text-red-500 text-xs font-medium">
            {errors.port_supportingDocument}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Shared UI primitives                                                     */
/* ---------------------------------------------------------------------- */
function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-black uppercase tracking-widest text-white">
        {title}
      </h3>
      {sub && (
        <p className="text-zinc-500 text-xs font-medium leading-relaxed">{sub}</p>
      )}
    </div>
  );
}

function InputField({
  label, value, icon, placeholder, highlight = false,
  subLabel, type = "text", error, onChange, disabled = false,
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
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-[#12181e] border rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none transition-all ${
          disabled
            ? "opacity-60 cursor-not-allowed border-white/10"
            : error
            ? "border-red-500"
            : highlight
            ? "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.05)]"
            : "border-white/5"
        }`}
      />
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
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
