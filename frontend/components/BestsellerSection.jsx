"use client";
import { useContext, useState, useRef, useEffect, useCallback } from "react";
import { ShopContext } from "../contexts/ShopContext";
import { assets } from "../lib/data/assets";

const FALLBACK_IMG =
  assets.placeholder_food ||
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

const BestsellerSection = () => {
  const { products, currency, addToCart } = useContext(ShopContext);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});

  const setItemVariant = (itemId, variant) => {
    setSelectedVariants((prev) => ({ ...prev, [itemId]: variant }));
  };

  const bestsellers = Array.isArray(products)
    ? products.filter((p) => p.isBestseller || p.bestseller || p.isFeatured)
    : [];

  const count = bestsellers.length;
  // Triplicate list for smooth infinite looping without visual jumps
  const displayItems = count > 0 ? [...bestsellers, ...bestsellers, ...bestsellers] : [];

  const [currentIndex, setCurrentIndex] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const isInteractingRef = useRef(false);
  const idleTimerRef = useRef(null);
  const stepTimerRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchDeltaXRef = useRef(0);
  const isSwipingRef = useRef(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  const getImg = (item) => item.image?.url || item.images?.[0] || FALLBACK_IMG;

  // Position the track so the card at `index` is visually centered
  const updateTrackPosition = useCallback((targetIndex, animate = true) => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || !track.children[targetIndex]) return;

    const containerWidth = container.clientWidth;
    const card = track.children[targetIndex];
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const targetTranslateX = containerWidth / 2 - cardCenter;

    if (animate && !reducedMotion) {
      track.style.transition = "transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)";
    } else {
      track.style.transition = "none";
    }

    track.style.transform = `translate3d(${targetTranslateX}px, 0, 0)`;
  }, [reducedMotion]);

  // Handle window resize to keep centered card accurately positioned
  useEffect(() => {
    const handleResize = () => {
      updateTrackPosition(currentIndex, false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, updateTrackPosition]);

  // Position on initial load or count change
  useEffect(() => {
    if (count > 0) {
      setCurrentIndex(count);
      // Let DOM render then position without animation
      const raf = requestAnimationFrame(() => {
        updateTrackPosition(count, false);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [count, updateTrackPosition]);

  // Seamless boundary wrap when animation finishes
  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false);
    if (count === 0) return;

    if (currentIndex >= count * 2) {
      const resetIndex = currentIndex - count;
      setCurrentIndex(resetIndex);
      updateTrackPosition(resetIndex, false);
    } else if (currentIndex < count) {
      const resetIndex = currentIndex + count;
      setCurrentIndex(resetIndex);
      updateTrackPosition(resetIndex, false);
    }
  }, [count, currentIndex, updateTrackPosition]);

  // Stepping functions
  const stepTo = useCallback((targetIndex) => {
    if (count === 0) return;
    setIsAnimating(true);
    setCurrentIndex(targetIndex);
    updateTrackPosition(targetIndex, true);
  }, [count, updateTrackPosition]);

  const stepNext = useCallback(() => {
    stepTo(currentIndex + 1);
  }, [currentIndex, stepTo]);

  const stepPrev = useCallback(() => {
    stepTo(currentIndex - 1);
  }, [currentIndex, stepTo]);

  // User interaction pause/resume
  const pauseAutoStep = useCallback(() => {
    isInteractingRef.current = true;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
  }, []);

  const resumeAutoStep = useCallback((delay = 3000) => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, delay);
  }, []);

  // STEP -> STOP -> HOLD (~2s) -> STEP sequence
  useEffect(() => {
    if (reducedMotion || count === 0) return;

    const scheduleNextStep = () => {
      stepTimerRef.current = setTimeout(() => {
        if (!isInteractingRef.current) {
          stepNext();
        } else {
          scheduleNextStep();
        }
      }, 2600); // 2000ms hold + 550ms transition + 50ms buffer
    };

    scheduleNextStep();

    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [count, currentIndex, isAnimating, reducedMotion, stepNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    pauseAutoStep();
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchDeltaXRef.current = 0;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartXRef.current;
    const diffY = touch.clientY - touchStartYRef.current;

    // Detect horizontal swipe intent
    if (!isSwipingRef.current && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      isSwipingRef.current = true;
    }

    if (isSwipingRef.current) {
      touchDeltaXRef.current = diffX;
    }
  };

  const handleTouchEnd = () => {
    if (isSwipingRef.current) {
      const delta = touchDeltaXRef.current;
      if (delta < -35) {
        stepNext();
      } else if (delta > 35) {
        stepPrev();
      }
    }
    isSwipingRef.current = false;
    resumeAutoStep(3200);
  };

  const handleManualNav = (dir) => {
    pauseAutoStep();
    if (dir > 0) {
      stepNext();
    } else {
      stepPrev();
    }
    resumeAutoStep(3500);
  };

  if (count === 0) return null;

  return (
    <section className="w-full bg-[#FAF8F5] py-10 sm:py-14 border-b border-stone-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1B3B2B] tracking-tight">
              What people love
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 font-normal">Our most-loved dishes.</p>
          </div>

          {/* Desktop arrows for accessible navigation */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleManualNav(-1)}
              aria-label="Previous dishes"
              className="w-8 h-8 rounded-full border border-stone-200 bg-white text-stone-600 hover:text-[#1B3B2B] hover:border-stone-400 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleManualNav(1)}
              aria-label="Next dishes"
              className="w-8 h-8 rounded-full border border-stone-200 bg-white text-stone-600 hover:text-[#1B3B2B] hover:border-stone-400 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          onMouseEnter={pauseAutoStep}
          onMouseLeave={() => resumeAutoStep(2000)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full overflow-hidden py-4 -my-4"
          style={{ touchAction: "pan-y" }}
        >
          {/* Inner Sliding Track */}
          <div
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            className="flex gap-4 sm:gap-6 will-change-transform"
            style={{ width: "max-content" }}
          >
            {displayItems.map((item, idx) => {
              const isActive = idx === currentIndex;
              const isAvailable = item.isAvailable !== false;
              const isHalfFull = item.pricingType === "half-full";
              const currentVariant = isHalfFull
                ? selectedVariants[item._id] || "full"
                : "single";

              const displayPrice = isHalfFull
                ? currentVariant === "half"
                  ? item.halfPrice
                  : item.fullPrice
                : item.price || 0;

              return (
                <div
                  key={`${item._id}-${idx}`}
                  onClick={() => {
                    if (!isActive) {
                      pauseAutoStep();
                      stepTo(idx);
                      resumeAutoStep(3200);
                    }
                  }}
                  className={`flex-none w-[270px] sm:w-[290px] md:w-[310px] bg-white rounded-2xl p-3.5 sm:p-4 border transition-all duration-500 flex flex-col justify-between group cursor-pointer ${isActive
                    ? "border-[#1B3B2B]/40 shadow-lg scale-[1.03] z-10 opacity-100"
                    : "border-stone-200/80 shadow-2xs scale-100 opacity-85 hover:opacity-100 hover:border-stone-300"
                    }`}
                  style={{
                    transformOrigin: "center center",
                  }}
                >
                  {/* Rectangular Food image with overlays */}
                  <div className="relative w-full aspect-[18/11] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-100 shadow-2xs group-hover:scale-[1.01] transition-transform duration-300 flex-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImg(item)}
                      alt={`${item.name} at Majedaar Restaurant`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />

                    {/* Overlays on Image: Veg indicator + Bestseller badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                      {item.isVeg !== undefined && (
                        <div className="bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs border border-stone-200/80 flex items-center justify-center">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? "bg-emerald-600" : "bg-rose-600"
                              }`}
                          />
                        </div>
                      )}
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#C85A17]/95 bg-white backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                        ★ Bestseller
                      </span>
                    </div>

                    {/* Overlays on Image: Rating badge (only when genuine rating exists) */}
                    {item.ratingSummary?.averageRating > 0 && (
                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs border border-stone-200/80 flex items-center gap-1 text-[11px] font-bold text-[#11261B] z-10 pointer-events-none">
                        <span className="text-amber-500 text-xs leading-none">★</span>
                        <span>{item.ratingSummary.averageRating}</span>
                        {item.ratingSummary.reviewCount > 0 && (
                          <span className="text-stone-400 font-normal text-[10px]">
                            ({item.ratingSummary.reviewCount})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="w-full text-left">
                    <h3
                      className={`font-bold text-base sm:text-lg line-clamp-1 mb-1 transition-colors ${isActive ? "text-[#11261B]" : "text-stone-800 group-hover:text-[#11261B]"
                        }`}
                    >
                      {item.name}
                    </h3>

                    <p className="text-stone-500 text-xs sm:text-[13px] line-clamp-2 leading-relaxed mb-2.5 min-h-[2.5rem]">
                      {item.description}
                    </p>
                  </div>

                  {/* Half / Full Variant Selector */}
                  {isHalfFull && (
                    <div className="flex items-center gap-2 mb-3 w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemVariant(item._id, "half");
                        }}
                        className={`px-2.5 py-1 text-md font-semibold rounded-lg border transition-all cursor-pointer ${currentVariant === "half"
                          ? "bg-[#1B3B2B] text-white border-[#1B3B2B]"
                          : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                          }`}
                      >
                        Half
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemVariant(item._id, "full");
                        }}
                        className={`px-2.5 py-1 text-md font-semibold rounded-lg border transition-all cursor-pointer ${currentVariant === "full"
                          ? "bg-[#1B3B2B] text-white border-[#1B3B2B]"
                          : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                          }`}
                      >
                        Full
                      </button>
                    </div>
                  )}

                  {/* Price & Add to Cart Footer */}
                  <div className="w-full flex items-center justify-between pt-2.5 border-t border-stone-100 mt-auto">
                    <span className="text-base sm:text-lg font-extrabold text-[#1B3B2B]">
                      {currency}{displayPrice}
                    </span>
                    {isAvailable ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item._id, currentVariant);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1B3B2B] hover:bg-[#11261B] text-white text-xs sm:text-[13px] font-bold uppercase tracking-wider active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>ADD</span>
                        <span className="text-sm leading-none">+</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestsellerSection;
