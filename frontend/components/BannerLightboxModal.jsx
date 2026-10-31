"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BannerLightboxModal({ banner, onClose }) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!banner) return null;

  const handleAction = () => {
    onClose();
    if (banner.product?._id) {
      router.push(`/product/${banner.product._id}`);
    } else if (banner.category?.name) {
      router.push(`/orderanddine?category=${encodeURIComponent(banner.category.name)}`);
    } else {
      router.push("/orderanddine");
    }
  };

  const getActionLabel = () => {
    if (banner.product?.name) return `Order ${banner.product.name} →`;
    if (banner.category?.name) return `Explore ${banner.category.name} →`;
    if (banner.discount?.name) return "Browse Offer Dishes →";
    return "Explore Menu →";
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full bg-[#1A1A18] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-white">
          <div className="min-w-0 pr-4">
            <h3 className="font-bold text-sm sm:text-base truncate">
              {banner.title || "Special Promotion"}
            </h3>
            {banner.description && (
              <p className="text-xs text-stone-400 truncate mt-0.5">
                {banner.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center font-bold text-sm transition-colors flex-none"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Image Area: Preserves original aspect ratio using object-fit: contain on neutral dark background */}
        <div className="w-full flex-1 min-h-[300px] max-h-[68vh] bg-[#111210] p-3 sm:p-6 flex items-center justify-center relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.image?.url}
            alt={banner.title || "Promotional Banner"}
            className="max-w-full max-h-[64vh] object-contain select-none shadow-md rounded-lg"
          />
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 bg-stone-900 border-t border-stone-800 flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors"
          >
            Close (Esc)
          </button>

          <button
            type="button"
            onClick={handleAction}
            className="px-5 py-2 rounded-full bg-[#C85A17] hover:bg-[#B04B0F] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95"
          >
            {getActionLabel()}
          </button>
        </div>
      </div>
    </div>
  );
}

