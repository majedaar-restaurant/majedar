"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShopContext } from "../contexts/ShopContext";
import ImageLightbox from "./ImageLightbox";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

const MenuPreview = ({ selectedCategory = "All" }) => {
  const router = useRouter();
  const { products, currency, addToCart, search } = useContext(ShopContext);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [lightboxItem, setLightboxItem] = useState(null);

  const setItemVariant = (itemId, variant) => {
    setSelectedVariants((prev) => ({ ...prev, [itemId]: variant }));
  };

  const previewProducts = Array.isArray(products)
    ? products
      .filter((item) => {
        if (search && search.trim() !== "") {
          const q = search.toLowerCase().trim();
          const catName = typeof item.category === "object" ? item.category?.name : item.category;
          return (
            item.name?.toLowerCase().includes(q) ||
            catName?.toLowerCase().includes(q)
          );
        }
        if (!selectedCategory || selectedCategory === "All") return true;
        const catName = typeof item.category === "object" ? item.category?.name : item.category;
        return (catName || "").toLowerCase().includes(selectedCategory.toLowerCase());
      })
      .slice(0, 6)
    : [];

  const getImg = (item) => item.image?.url || item.images?.[0] || FALLBACK_IMG;

  return (
    <section
      className="w-full bg-[#FAF8F5] py-10 sm:py-16 border-b border-stone-200/60"
      id="homepage-menu-preview"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200/80">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1B3B2B] tracking-tight">
              Explore Our Menu
            </h2>
          </div>
          <Link
            href="/orderanddine"
            className="text-xs font-bold text-[#1B3B2B] hover:text-[#C85A17] uppercase tracking-wider flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
          >
            <span>View Full Menu</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {previewProducts.map((item) => {
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
                key={item._id}
                onClick={() => router.push(`/product/${item._id}`)}
                className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 hover:border-stone-300 transition-all flex items-center gap-4 sm:gap-5 justify-between min-h-[148px] sm:min-h-[164px] group shadow-2xs cursor-pointer"
              >
                {/* Food Image - opens image lightbox only */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxItem(item);
                  }}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden flex-none bg-stone-100 border border-stone-100 relative shadow-2xs block cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/40"
                  aria-label={`Enlarge photo of ${item.name}`}
                  title="Click to view larger image"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImg(item)}
                    alt={`${item.name} at Majedaar Restaurant`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                  {item.isVeg !== undefined && (
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs border border-stone-200 pointer-events-none">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? "bg-emerald-600" : "bg-rose-600"
                          }`}
                      />
                    </div>
                  )}
                </button>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-[#11261B] line-clamp-1 mb-1 leading-snug">
                      <span className="group-hover:text-[#C85A17] transition-colors">
                        {item.name}
                      </span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-[13px] mb-1.5">
                      {item.ratingSummary?.reviewCount > 0 ? (
                        <>
                          <span className="text-amber-500">★</span>
                          <span className="font-bold text-[#11261B]">
                            {item.ratingSummary.averageRating}
                          </span>
                          <span className="text-stone-400">
                            · {item.ratingSummary.reviewCount}
                          </span>
                        </>
                      ) : (
                        <span className="text-stone-400 flex items-center gap-1 text-[11px]">
                          <span className="text-stone-300">★</span> New
                        </span>
                      )}
                    </div>
                    <p className="overflow-hidden text-stone-500 mb-2 text-xs sm:text-[12px] text-ellipsis whitespace-nowrap">
                      {item.description.split("#")[0]}
                    </p>

                    {/* Half / Full Variant Selector */}
                    <span className="text-base sm:text-lg font-extrabold text-[#1B3B2B]">
                      {currency}
                      {displayPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-1">
                    {isHalfFull && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemVariant(item._id, "half");
                          }}
                          className={`px-2.5 py-1 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${currentVariant === "half"
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
                          className={`px-2.5 py-1 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${currentVariant === "full"
                            ? "bg-[#1B3B2B] text-white border-[#1B3B2B]"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                            }`}
                        >
                          Full
                        </button>
                      </div>
                    )}
                    {isAvailable ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item._id, currentVariant);
                        }}
                        className="ml-auto px-4 sm:px-4.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs sm:text-[13px] font-bold uppercase tracking-wider active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-sm leading-none">+</span>
                      </button>
                    ) : (
                      <span className="ml-auto text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link href="/orderanddine">
            <button className="px-8 py-3.5 rounded-full bg-[#1B3B2B] hover:bg-[#11261B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer">
              <span>View Full Menu &amp; Order</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Clean Image Lightbox Modal */}
      {lightboxItem && (
        <ImageLightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </section>
  );
};

export default MenuPreview;
