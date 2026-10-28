"use client";

import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../contexts/ShopContext";

export default function ShopStatusBanner() {
  const { restaurantSettings, isShopOpen, isOverOrderActive } = useContext(ShopContext);

  const [remainingMinutes, setRemainingMinutes] = useState(
    restaurantSettings?.overOrder?.remainingMinutes || 0
  );

  useEffect(() => {
    if (!isOverOrderActive || !restaurantSettings?.overOrder?.expiresAt) return;

    const calculateRemaining = () => {
      const now = Date.now();
      const exp = new Date(restaurantSettings.overOrder.expiresAt).getTime();
      const diff = Math.max(0, Math.ceil((exp - now) / 60000));
      setRemainingMinutes(diff);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 10000);
    return () => clearInterval(interval);
  }, [isOverOrderActive, restaurantSettings?.overOrder?.expiresAt]);

  // Shop Open Timings Banner (Properly displayed on top of website)
  if (isShopOpen && !isOverOrderActive) {
    const displayTimings =
      restaurantSettings?.displayTimings ||
      `${restaurantSettings?.formattedOpeningTime || "10:00 AM"} – ${restaurantSettings?.formattedClosingTime || "10:30 PM"
      }`;

    return (
      <div className="w-full bg-[#153424] text-white border-b border-emerald-900/50 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold uppercase tracking-wider text-emerald-300 text-[11px] shrink-0">
              Open Today
            </span>
            <span className="text-white/40 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5 font-semibold text-stone-100 min-w-0 flex-wrap">
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="break-words">
                Timings: <strong className="text-white font-bold">{displayTimings} (IST)</strong>
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-stone-300 text-[11px]">
            <span className="text-white/40">·</span>
            <span className="text-amber-300 font-semibold">Min. Order ₹100</span>
          </div>
        </div>
      </div>
    );
  }

  // Over Order Priority Banner
  if (isOverOrderActive) {
    return (
      <div className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2.5 text-center text-xs sm:text-sm font-semibold">
          <span className="flex-none p-1 bg-white/20 rounded-full animate-pulse">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p className="tracking-wide">
            We&apos;re receiving a high number of orders right now. Please try again after{" "}
            <span className="underline decoration-white/70 font-extrabold px-1 bg-white/10 rounded">
              {remainingMinutes > 0 ? `${remainingMinutes} minutes` : "a few moments"}
            </span>
            .
          </p>
        </div>
      </div>
    );
  }

  // Shop Closed Announcement Banner
  const announcement =
    restaurantSettings?.announcementMessage ||
    `Sorry! Our shop is currently closed. We closed at ${restaurantSettings?.closedTimeDisplay || "10:30 PM"
    } and will reopen ${restaurantSettings?.reopenTimeDisplay || "tomorrow at 10:00 AM"}.`;

  return (
    <div className="w-full bg-[#8B261E] text-white shadow-sm transition-all duration-300 border-b border-red-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2.5 text-center text-xs sm:text-sm font-semibold">
        <span className="flex-none p-1 bg-white/15 rounded-full">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </span>
        <p className="tracking-wide leading-snug">
          {announcement}
        </p>
      </div>
    </div>
  );
}
