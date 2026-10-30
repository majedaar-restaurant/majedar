"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function MandatoryPhoneModal() {
  const { customer, isAuthenticated, loading, updatePhone } = useAuth();

  const [phone, setPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [touched, setTouched] = useState({ phone: false, confirmPhone: false });

  // Determine if phone collection is required
  // Required when customer is authenticated, finished loading, and lacks a valid 10-digit phone
  const hasValidPhone = Boolean(
    customer?.phone && customer.phone.replace(/[^\d]/g, "").length >= 10
  );
  const isOpen = Boolean(isAuthenticated && !loading && customer && !hasValidPhone);

  // Prevent background scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Trap Escape key so modal cannot be closed
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Sanitize numeric inputs (allow only digits)
  const cleanPhone = phone.replace(/[^\d]/g, "").slice(0, 10);
  const cleanConfirmPhone = confirmPhone.replace(/[^\d]/g, "").slice(0, 10);

  // Validation logic
  let validationError = "";
  let isValid = false;

  if (touched.phone || touched.confirmPhone) {
    if (!cleanPhone) {
      validationError = "Please enter your phone number.";
    } else if (cleanPhone.length !== 10) {
      validationError = "Please enter a valid 10-digit Indian mobile number.";
    } else if (!cleanConfirmPhone) {
      if (touched.confirmPhone) {
        validationError = "Please confirm your phone number.";
      }
    } else if (cleanPhone !== cleanConfirmPhone) {
      validationError = "Phone numbers do not match.";
    }
  }

  // Valid when both have 10 digits and match
  if (cleanPhone.length === 10 && cleanConfirmPhone.length === 10 && cleanPhone === cleanConfirmPhone) {
    isValid = true;
    validationError = "";
  }

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
    setPhone(val);
    if (apiError) setApiError("");
  };

  const handleConfirmPhoneChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
    setConfirmPhone(val);
    if (apiError) setApiError("");
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setTouched({ phone: true, confirmPhone: true });

    if (!isValid || cleanPhone.length !== 10 || cleanPhone !== cleanConfirmPhone) {
      return;
    }

    setSaving(true);
    setApiError("");

    try {
      const formattedPhone = `+91${cleanPhone}`;
      await updatePhone(formattedPhone);
      toast.success("Phone number saved successfully! Welcome to Majedaar.", { autoClose: 3000 });
      // Modal will automatically unmount as customer.phone is updated in AuthContext
    } catch (err) {
      const msg = err?.message || "Failed to save phone number. Please try again.";
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mandatory-phone-title"
      // Explicitly block outside click dismissal
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-7 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 id="mandatory-phone-title" className="font-hero text-2xl font-bold text-[#1B3B2B]">
              Welcome to Majedaar!
            </h2>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
              Add your phone number so our delivery rider can contact you regarding your order.
            </p>
          </div>

          {/* Validation & API Error Alerts */}
          {(apiError || validationError) && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{apiError || validationError}</span>
            </div>
          )}

          {/* Phone Form */}
          <form onSubmit={handleSave} className="space-y-4">
            {/* Field 1: Phone Number */}
            <div>
              <label
                htmlFor="mandatory-phone-input"
                className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl border border-stone-300 bg-[#FAF8F5] overflow-hidden focus-within:border-[#1B3B2B] focus-within:ring-2 focus-within:ring-[#1B3B2B]/20 transition-all">
                <span className="flex items-center px-3.5 text-xs font-bold text-stone-600 bg-stone-100 border-r border-stone-300 select-none">
                  🇮🇳 +91
                </span>
                <input
                  id="mandatory-phone-input"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                  placeholder="98765 43210"
                  maxLength={10}
                  autoFocus
                  required
                  className="flex-1 bg-transparent px-3 py-3 text-sm font-semibold text-stone-800 placeholder-stone-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Field 2: Confirm Phone Number */}
            <div>
              <label
                htmlFor="mandatory-confirm-phone-input"
                className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Confirm Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl border border-stone-300 bg-[#FAF8F5] overflow-hidden focus-within:border-[#1B3B2B] focus-within:ring-2 focus-within:ring-[#1B3B2B]/20 transition-all">
                <span className="flex items-center px-3.5 text-xs font-bold text-stone-600 bg-stone-100 border-r border-stone-300 select-none">
                  🇮🇳 +91
                </span>
                <input
                  id="mandatory-confirm-phone-input"
                  type="tel"
                  inputMode="numeric"
                  value={confirmPhone}
                  onChange={handleConfirmPhoneChange}
                  onBlur={() => setTouched((p) => ({ ...p, confirmPhone: true }))}
                  placeholder="Re-enter phone number"
                  maxLength={10}
                  required
                  className="flex-1 bg-transparent px-3 py-3 text-sm font-semibold text-stone-800 placeholder-stone-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Save Button — Disabled until all validations pass */}
            <button
              type="submit"
              disabled={!isValid || saving}
              className="w-full mt-4 py-3.5 rounded-full bg-[#1B3B2B] hover:bg-[#11261B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving Phone Number...</span>
                </>
              ) : (
                <span>Save Phone Number</span>
              )}
            </button>
          </form>

          {/* Footer requirement note */}
          <p className="mt-4 text-[11px] text-stone-400 text-center leading-relaxed">
            A valid mobile number is required to receive live order updates and delivery rider calls.
          </p>
        </div>
      </div>
    </div>
  );
}
