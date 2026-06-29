import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, Check, AlertTriangle, Zap, Shield } from "lucide-react";

interface StripePaymentProps {
  onBack: () => void;
}

export default function StripePayment({ onBack }: StripePaymentProps) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "enterprise">("pro");
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const plans = {
    basic: {
      name: "Starter",
      monthlyPrice: 29,
      annualPrice: 290,
      description: "Perfect for getting started",
      features: [
        "Up to 5 tradies",
        "Basic call routing",
        "Email support",
        "10 hours/month AI assistant",
        "Basic analytics",
      ],
      icon: Zap,
    },
    pro: {
      name: "Professional",
      monthlyPrice: 99,
      annualPrice: 990,
      description: "Most popular for growing teams",
      features: [
        "Up to 25 tradies",
        "Advanced call routing",
        "Priority support",
        "Unlimited AI assistant",
        "Advanced analytics",
        "Custom workflows",
        "API access",
      ],
      icon: Shield,
      popular: true,
    },
    enterprise: {
      name: "Enterprise",
      monthlyPrice: 299,
      annualPrice: 2990,
      description: "For large scale operations",
      features: [
        "Unlimited tradies",
        "Custom call routing",
        "Dedicated support",
        "Unlimited AI assistant",
        "Custom analytics",
        "Advanced workflows",
        "API access",
        "Custom integration",
        "SLA guarantee",
      ],
      icon: Lock,
    },
  };

  const currentPlan = plans[selectedPlan];
  const price = billingPeriod === "monthly" ? currentPlan.monthlyPrice : currentPlan.annualPrice;
  const savings = billingPeriod === "annual" ? Math.round((currentPlan.monthlyPrice * 12 - currentPlan.annualPrice) / 12) : 0;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate Stripe integration
      // In real app, this would call your backend to create a checkout session
      console.log("Processing payment for:", {
        plan: selectedPlan,
        period: billingPeriod,
        amount: price,
      });

      // Show success message
      setTimeout(() => {
        alert(`Payment initiated for ${currentPlan.name} plan - $${price}/${billingPeriod === "monthly" ? "month" : "year"}`);
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03070b] via-[#0a0f17] to-[#03070b] text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="z-10 border-b border-white/5 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-[0.15em]">
            <CreditCard size={14} />
            Secure Payment
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Section Title */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Perfect Plan</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Flexible pricing that scales with your business. Always transparent, no hidden fees.
          </p>
        </div>

        {/* Billing Period Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
                billingPeriod === "monthly"
                  ? "bg-orange-500 text-black shadow-lg shadow-orange-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all relative ${
                billingPeriod === "annual"
                  ? "bg-orange-500 text-black shadow-lg shadow-orange-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual
              {billingPeriod === "annual" && (
                <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-green-500/20 border border-green-500/50 text-green-300 text-xs font-bold rounded-full">
                  Save 17%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(plans).map(([key, plan]) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === key;
            return (
              <div
                key={key}
                onClick={() => setSelectedPlan(key as "basic" | "pro" | "enterprise")}
                className={`relative group cursor-pointer transition-all duration-300 rounded-3xl p-8 border ${
                  isSelected
                    ? "border-orange-500 bg-gradient-to-br from-orange-500/10 to-orange-500/5 shadow-2xl shadow-orange-500/20 scale-105"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-black text-xs font-black uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                {/* Checkmark for selected */}
                {isSelected && (
                  <div className="absolute top-6 right-6 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                  isSelected 
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                    : "bg-white/5 text-zinc-400 border border-white/10"
                }`}>
                  <Icon size={24} />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <p className="text-sm text-zinc-400 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="space-y-2 mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">${price}</span>
                    <span className="text-zinc-500 text-sm">/{billingPeriod === "monthly" ? "month" : "year"}</span>
                  </div>
                  {savings > 0 && (
                    <p className="text-xs text-green-400 font-bold">
                      💰 Save ${savings}/month with annual billing
                    </p>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 pb-8 border-b border-white/10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={16} className="text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  className={`w-full py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all ${
                    isSelected
                      ? "bg-orange-500 text-black shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {isSelected ? "Selected" : "Select Plan"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-orange-400" />
                Order Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">{currentPlan.name} Plan</span>
                  <span className="font-bold text-white">${price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Billing Period</span>
                  <span className="font-bold text-white capitalize">{billingPeriod}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="font-black text-white">Total Amount</span>
                  <span className="text-2xl font-black text-orange-400">${price}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Lock size={20} className="text-orange-400" />
                Payment Method
              </h3>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2">Secure Stripe Checkout</p>
                  <p className="text-white font-bold flex items-center gap-2">
                    <CreditCard size={18} />
                    Credit / Debit Card
                  </p>
                </div>
                <p className="text-xs text-zinc-400 flex items-start gap-2">
                  <Shield size={14} className="flex-shrink-0 mt-0.5 text-green-400" />
                  Your payment is encrypted and processed securely through Stripe.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-orange-500/20">
            <button
              onClick={onBack}
              className="flex-1 py-3 px-6 rounded-2xl border border-white/20 hover:border-white/40 text-white font-bold uppercase tracking-wider transition-all hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-black font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-2px] active:scale-[0.98]"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⌛</span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <CreditCard size={16} />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Shield size={24} className="text-green-400" />
            <span className="text-sm font-bold text-zinc-300">SSL Secured</span>
            <span className="text-xs text-zinc-500">Bank-level encryption</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Lock size={24} className="text-blue-400" />
            <span className="text-sm font-bold text-zinc-300">Stripe Verified</span>
            <span className="text-xs text-zinc-500">PCI DSS compliant</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Check size={24} className="text-orange-400" />
            <span className="text-sm font-bold text-zinc-300">30-Day Guarantee</span>
            <span className="text-xs text-zinc-500">Money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
