"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/orderanddine";
  const fromGoogleLogin = searchParams.get("from") === "google_login";
  const emailParam = searchParams.get("email") || "";

  const { signup, googleSignup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: emailParam,
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingGoogle, setPendingGoogle] = useState(null);

  // Check if user was redirected here from an unregistered Google login attempt
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("majedaar_google_pending_signup");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPendingGoogle(parsed);
        if (parsed.email || parsed.name) {
          setFormData((prev) => ({
            ...prev,
            email: prev.email || parsed.email || "",
            name: prev.name || parsed.name || "",
          }));
        }
      }
    } catch {
      // ignore storage access error
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setErrorMsg("Please enter a valid phone number (at least 7 digits).");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      // Clear pending Google state on manual signup
      try {
        sessionStorage.removeItem("majedaar_google_pending_signup");
      } catch {
        // ignore
      }

      toast.success(
        "Account created! Please enter the 6-digit code sent to your email.",
        { autoClose: 4000 }
      );

      router.push(
        `/verify-email?email=${encodeURIComponent(
          formData.email.trim()
        )}&redirect=${encodeURIComponent(redirectPath)}`
      );
    } catch (err) {
      setErrorMsg(
        err?.message || "Failed to create account. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-Up handler (SIGNUP intent only)
  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential || pendingGoogle?.idToken;
    const signupToken = pendingGoogle?.signupToken;

    if (!idToken && !signupToken) {
      setErrorMsg("Google sign-up failed. No credential received.");
      return;
    }

    setGoogleLoading(true);
    setErrorMsg("");
    try {
      await googleSignup({
        idToken,
        signupToken,
      });

      // Clear stored pending Google state
      try {
        sessionStorage.removeItem("majedaar_google_pending_signup");
      } catch {
        // ignore
      }

      toast.success("Account created successfully! Welcome to Majedaar.", { autoClose: 3000 });
      // Mandatory phone collection modal will automatically show in RootLayout
      router.replace(redirectPath);
    } catch (err) {
      const message = err?.message || "Google sign-up failed. Please try again.";
      setErrorMsg(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Google sign-up was cancelled or failed. Please try again.");
    setGoogleLoading(false);
  };

  const isAlreadyRegisteredError =
    errorMsg.toLowerCase().includes("already registered") ||
    errorMsg.toLowerCase().includes("please sign in");

  const inputClass =
    "w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#1B3B2B] focus:ring-1 focus:ring-[#1B3B2B] transition-all";

  return (
    <div className="min-h-[85vh] bg-[#FAF8F5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-hero text-2xl sm:text-3xl font-bold text-[#1B3B2B]">
            Create an Account
          </h1>
          <p className="text-xs text-stone-500 mt-1.5">
            Join Majedaar for fast ordering, live order tracking, and exclusive dishes
          </p>
        </div>

        {/* Informative banner when redirected from Google Login with unregistered email */}
        {(fromGoogleLogin || pendingGoogle) && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
            <p className="font-bold text-[#1B3B2B] mb-1">Account Registration Needed</p>
            <p>
              Your Google account {pendingGoogle?.email ? <strong>({pendingGoogle.email})</strong> : ""}{" "}
              is not registered yet. Please create an account to continue.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed">
            <p className="font-semibold">{errorMsg}</p>
            {isAlreadyRegisteredError && (
              <div className="mt-2.5 pt-2 border-t border-rose-200/60 flex items-center justify-between">
                <span className="text-[11px] text-rose-800">
                  Ready to sign in?
                </span>
                <Link
                  href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                  className="font-bold text-[#1B3B2B] underline hover:text-[#C85A17]"
                >
                  Sign In Now &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Google Sign-Up Button */}
        <div className="mb-5">
          {googleLoading ? (
            <div className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-500 shadow-sm">
              <svg
                className="animate-spin h-5 w-5 text-stone-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Creating your account...</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                width="400"
                text="signup_with"
                shape="rectangular"
                logo_alignment="left"
              />
            </div>
          )}
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            or sign up with email
          </span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Existing Email/Password Form — COMPLETELY UNCHANGED */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Aarav Sharma"
              required
              className={inputClass}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="aarav@example.com"
              required
              className={inputClass}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
              className={inputClass}
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className={inputClass}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className={inputClass}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-full bg-[#1B3B2B] hover:bg-[#11261B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center text-xs text-stone-600">
          Already have an account?{" "}
          <Link
            href={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
            className="font-bold text-[#1B3B2B] hover:text-[#C85A17] underline transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] bg-[#FAF8F5] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#1B3B2B] border-t-transparent rounded-full" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
