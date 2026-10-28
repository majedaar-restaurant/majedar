"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { getMenuItemReviews, submitReview } from "../lib/api/reviews";
import { toast } from "react-toastify";

/**
 * Interactive Star Rating component supporting hover, active selection, and touch devices.
 */
function StarRatingInput({ rating, onRatingChange, size = "w-7 h-7" }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 text-amber-400 hover:scale-110 active:scale-95 transition-transform focus:outline-hidden cursor-pointer"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <svg
              className={`${size} ${isFilled ? "fill-amber-400 text-amber-500" : "fill-stone-100 text-stone-300"}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Static star display.
 */
function StaticStars({ rating, size = "w-4 h-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${size} ${star <= Math.round(rating) ? "fill-amber-400 text-amber-500" : "fill-stone-100 text-stone-300"}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function CustomerReviews({
  menuItemId,
  productName = "this dish",
  initialRatingSummary = { averageRating: 0, reviewCount: 0 },
  onRatingUpdated,
}) {
  const { isAuthenticated, customer } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(initialRatingSummary);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadReviews = useCallback(async () => {
    if (!menuItemId) return;
    try {
      const data = await getMenuItemReviews(menuItemId);
      setReviews(data.reviews || []);
      if (data.ratingSummary) {
        setRatingSummary(data.ratingSummary);
        if (onRatingUpdated) onRatingUpdated(data.ratingSummary);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [menuItemId, onRatingUpdated]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      setErrorMsg("Please select a star rating between 1 and 5.");
      return;
    }

    setSubmitting(true);
    try {
      await submitReview({
        menuItemId,
        rating: selectedRating,
        comment,
      });

      toast.success("Thank you! Your rating and review have been submitted.");
      setComment("");
      await loadReviews();
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit review. Please try again.");
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = ratingSummary?.averageRating || 0;
  const count = ratingSummary?.reviewCount || 0;

  return (
    <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-stone-200/80">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-hero text-2xl sm:text-3xl font-bold text-[#1B3B2B]">
            Customer Reviews &amp; Ratings
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real feedback from diners who experienced {productName}
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 shadow-2xs w-fit">
          <div className="flex items-center gap-1.5 text-lg font-extrabold text-[#11261B]">
            <span className="text-amber-500 text-xl">★</span>
            <span>{count > 0 ? avgRating : "New"}</span>
          </div>
          <div className="border-l border-stone-200 pl-3">
            <StaticStars rating={avgRating} />
            <p className="text-[11px] text-stone-400 mt-0.5">
              {count > 0 ? `${count} verified review${count === 1 ? "" : "s"}` : "No reviews yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Review Submission Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-2xs sticky top-24">
            <h3 className="font-bold text-base sm:text-lg text-[#11261B] mb-2">
              Rate this Food Item
            </h3>

            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-3">
                    <StarRatingInput
                      rating={selectedRating}
                      onRatingChange={(r) => setSelectedRating(r)}
                    />
                    <span className="text-xs font-bold text-stone-700">
                      {selectedRating === 5 && "Excellent (5/5)"}
                      {selectedRating === 4 && "Very Good (4/5)"}
                      {selectedRating === 3 && "Average (3/5)"}
                      {selectedRating === 2 && "Below Average (2/5)"}
                      {selectedRating === 1 && "Poor (1/5)"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Written Review (Optional):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="How was the flavor, portion, and presentation? Any recommendations?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1B3B2B]/20 focus:border-[#1B3B2B] transition-all resize-y"
                  />
                  <small className="text-[10px] text-stone-400 block text-right mt-1">
                    {comment.length}/1000 characters
                  </small>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-full bg-[#1B3B2B] hover:bg-[#11261B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider active:scale-95 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting Review..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 px-4 bg-[#FAF8F5] rounded-xl border border-stone-200">
                <svg
                  className="w-10 h-10 text-stone-400 mx-auto mb-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-xs font-semibold text-stone-700 mb-1">
                  Have you tried this dish?
                </p>
                <p className="text-[11px] text-stone-500 mb-4">
                  Please sign in to your Majedaar account to share your rating and review.
                </p>
                <Link
                  href={`/login?redirect=/product/${menuItemId}`}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#1B3B2B] hover:bg-[#11261B] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Reviews List */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center text-xs text-stone-400">
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-stone-200 text-center">
                <span className="text-4xl block mb-2">🍽️</span>
                <h4 className="font-bold text-stone-800 text-sm mb-1">
                  No customer reviews yet
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Be the first to taste and review {productName}! Your feedback guides fellow foodies.
                </p>
              </div>
            ) : (
              reviews.map((rev) => {
                const customerName =
                  rev.customer?.name ||
                  `${rev.customer?.firstName || ""} ${rev.customer?.lastName || ""}`.trim() ||
                  "Verified Customer";

                const dateStr = rev.createdAt
                  ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  : "";

                const initial = customerName.charAt(0).toUpperCase() || "C";

                return (
                  <article
                    key={rev._id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs hover:border-stone-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1B3B2B] text-white font-bold text-sm flex items-center justify-center flex-none">
                          {initial}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-[#11261B]">
                            {customerName}
                          </h4>
                          <span className="text-[10px] text-stone-400">{dateStr}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                        <span className="text-amber-500 text-xs">★</span>
                        <span className="text-xs font-bold text-amber-900">{rev.rating}</span>
                      </div>
                    </div>

                    {rev.comment ? (
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mt-2 pl-12">
                        {rev.comment}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400 italic mt-1 pl-12">
                        Rated {rev.rating} out of 5 stars
                      </p>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
