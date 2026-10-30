"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

// Official Google G SVG logo
function GoogleGLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="w-5 h-5 flex-shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
  label = "Continue with Google",
}) {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // useGoogleLogin returns an access token by default.
      // We need the ID token — use the implicit flow with response_type: "token id_token"
      // but the simpler approach is to use the credential response.
      // Actually with useGoogleLogin we get access_token, not id_token.
      // We'll use the access token to fetch user info from Google's userinfo endpoint,
      // then send it to our backend. BUT that's not as secure as ID token verification.
      //
      // Better: use GoogleLogin component for credential flow (gives id_token directly).
      // We handle that in the parent — this component wraps the access-token flow as fallback.
      // See: the parent uses GoogleLogin component from @react-oauth/google instead.
      setLoading(false);
      if (onSuccess) onSuccess(tokenResponse);
    },
    onError: (error) => {
      setLoading(false);
      if (onError) onError(error);
    },
    flow: "implicit",
  });

  const handleClick = () => {
    if (disabled || loading) return;
    setLoading(true);
    login();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:border-stone-400 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      aria-label="Continue with Google"
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-stone-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
          <span>Signing in with Google...</span>
        </>
      ) : (
        <>
          <GoogleGLogo />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

