
"use client";

import { useEffect, useState } from "react";

export default function BrandedLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      setVisible(false);
      return;
    }

    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 1700);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF8F5] transition-opacity duration-300 ${exiting ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      role="status"
      aria-label="Loading Majedaar Restaurant"
    >
      <style>{`
        @keyframes revealLogo {
          from {
            clip-path: inset(0 100% 0 0);
            opacity: 0.3;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        .animate-logo-reveal {
          animation: revealLogo 1s
            cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-logo-reveal {
            animation: none !important;
            clip-path: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div className="w-56 sm:w-72 md:w-80 max-w-[85vw] px-4">
        <img
          src="/brand/logo-full.svg"
          alt="Majedaar Restaurant"
          className="block w-full h-auto animate-logo-reveal"
          draggable={false}
          onError={(e) => {
            console.error(
              "Majedaar logo could not load:",
              e.currentTarget.src
            );
          }}
        />
      </div>
    </div>
  );
}
