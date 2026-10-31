"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import BannerLightboxModal from "./BannerLightboxModal";

export default function BannerCarousel({ banners = [], autoPlayInterval = 5000, className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBannerForModal, setSelectedBannerForModal] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const activeBanners = Array.isArray(banners) ? banners.filter((b) => b && b.isActive !== false) : [];
  const count = activeBanners.length;

  const nextSlide = useCallback(() => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Autoplay timer
  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [count, isPaused, autoPlayInterval, nextSlide]);

  if (count === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  return (
    <>
      <div
        className={`w-full relative group ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Consistent Rectangular Container with neutral background & object-fit contain */}
        <div
          onClick={() => setSelectedBannerForModal(currentBanner)}
          className="w-full h-44 sm:h-64 md:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF5EE] border border-stone-200/90 shadow-2xs relative cursor-pointer flex items-center justify-center transition-all select-none"
          title="Click to view full promotion"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentBanner.image?.url}
            alt={currentBanner.title || "Promotional Banner"}
            className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-[1.01] transition-transform duration-300"
          />

          {/* Floating Subtle Label (if title or discount exists) */}
          {currentBanner.title && (
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-xs max-w-[80%] pointer-events-none">
              <p className="font-bold text-xs sm:text-sm text-[#11261B] truncate">
                {currentBanner.title}
              </p>
              {currentBanner.description && (
                <p className="text-[10px] sm:text-xs text-stone-500 truncate">
                  {currentBanner.description}
                </p>
              )}
            </div>
          )}

          {/* Zoom Pill Indicator */}
          <div className="absolute top-3 right-3 bg-white/90 text-stone-700 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-stone-200 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity">
            Enlarge
          </div>
        </div>

        {/* Carousel Controls (if multiple banners) */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 border border-stone-200 shadow-sm flex items-center justify-center font-bold text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous banner"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 border border-stone-200 shadow-sm flex items-center justify-center font-bold text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next banner"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/80"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedBannerForModal && (
        <BannerLightboxModal
          banner={selectedBannerForModal}
          onClose={() => setSelectedBannerForModal(null)}
        />
      )}
    </>
  );
}

