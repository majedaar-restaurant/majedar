"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { riderGoogleLogin, riderLogin, getRiderMe } from "../../../lib/api/rider";

export default function RiderLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getRiderMe()
      .then(() => router.replace("/rider/dashboard"))
      .catch((error) => {
        if (error?.status !== 401) {
          setMessage(error?.message || "Unable to check your rider session.");
        }
      });
  }, [router]);

  const completeLogin = async (action) => {
    setLoading(true);
    setMessage("");
    try {
      await action();
      router.replace("/rider/dashboard");
    } catch (error) {
      setMessage(error?.message || "Unable to sign in. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    completeLogin(() => riderLogin({ email, password }));
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-10 sm:flex sm:items-center sm:justify-center sm:py-16">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-[#1B3B2B]/5 sm:p-9">
        <Link href="/" className="mb-2 inline-flex w-full justify-center items-center gap-3">
          <Image src="/brand/logo-mark.svg" alt="" width={44} height={44} className="h-11 w-11" />
          <span className="font-hero text-sm font-bold tracking-widest text-[#1B3B2B]">MAJEDAAR</span>
        </Link>
        <h1 className="font-hero text-center text-3xl font-bold text-[#1B3B2B]">Rider sign in</h1>
        <p className="mb-4 bg-yellow-200 text-center text-sm leading-6 text-stone-600 font-bold">
          Sign in with the account created by Majedaar Admin.
        </p>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <>
            <div className="flex w-full justify-center">
              <GoogleLogin
                onSuccess={(credential) => {
                  if (credential?.credential) {
                    completeLogin(() => riderGoogleLogin(credential.credential));
                  } else {
                    setMessage("Google did not provide a valid sign-in credential.");
                  }
                }}
                onError={() => setMessage("Google sign in failed. Please try again.")}
                text="continue_with"
                shape="rectangular"
                theme="outline"
              />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold text-stone-700">
            Email address
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input mt-2"
            />
          </label>
          <label className="block text-sm font-semibold text-stone-700">
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input mt-2"
            />
          </label>
          {message && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1B3B2B] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#11261B] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs leading-5 text-stone-500">
          Rider accounts are created by Admin only. <Link className="font-semibold text-[#1B3B2B] underline" href="/">Return to Majedaar</Link>
        </p>
      </section>
    </main>
  );
}
