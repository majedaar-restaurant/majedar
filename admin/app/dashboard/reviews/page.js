"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader, Table, EmptyState, useToast } from "@/components/ui";
import { getAdminReviews, deleteAdminReview } from "@/lib/api/reviews";
import {
  DateFilterControl,
  FilterSelectControl,
  ActiveFilterChips,
  AdminPagination,
} from "@/components/ui/admin-filters";

function StarRating({ rating }) {
  const stars = Math.min(5, Math.max(1, Number(rating) || 5));
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        color: "#F59E0B",
        fontSize: "14px",
        letterSpacing: "1px",
      }}
      title={`${stars} out of 5 stars`}
    >
      {"★".repeat(stars)}
      {"☆".repeat(5 - stars)}
      <span style={{ color: "var(--ink-mid)", fontSize: "11.5px", marginLeft: 4, fontWeight: 600 }}>
        ({stars}/5)
      </span>
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [datePreset, setDatePreset] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  const toast = useToast();

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      if (search.trim()) {
        params.search = search.trim();
      }
      if (datePreset) {
        params.datePreset = datePreset;
      }
      if (dateFrom) {
        params.dateFrom = dateFrom;
      }
      if (dateTo) {
        params.dateTo = dateTo;
      }
      if (ratingFilter !== "all") {
        params.rating = ratingFilter;
      }

      const data = await getAdminReviews(params);
      setReviews(data);
      setTotalReviews(data.total ?? data.length);
      setTotalPages(data.totalPages ?? Math.max(1, Math.ceil((data.total ?? data.length) / pageSize)));
    } catch (err) {
      toast(err.message || "Failed to load reviews", "danger");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, datePreset, dateFrom, dateTo, ratingFilter, toast]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleDelete = async (review) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this rating for "${review.menuItem?.name || "Dish"}"?`
    );
    if (!confirmed) return;

    try {
      await deleteAdminReview(review._id);
      toast("Rating removed successfully", "success");
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
      setTotalReviews((t) => Math.max(0, t - 1));
    } catch (err) {
      toast(err.message || "Failed to delete rating", "danger");
    }
  };

  const activeChips = [];
  if (search.trim()) {
    activeChips.push({
      id: "search",
      label: "Search",
      value: `"${search.trim()}"`,
      onRemove: () => {
        setSearch("");
        setCurrentPage(1);
      },
    });
  }
  if (datePreset === "today") {
    activeChips.push({
      id: "date",
      label: "Date",
      value: "Today",
      onRemove: () => {
        setDatePreset("");
        setCurrentPage(1);
      },
    });
  } else if (datePreset === "this-week") {
    activeChips.push({
      id: "date",
      label: "Date",
      value: "This Week",
      onRemove: () => {
        setDatePreset("");
        setCurrentPage(1);
      },
    });
  } else if (dateFrom || dateTo) {
    activeChips.push({
      id: "date",
      label: "Date",
      value: `${dateFrom || "Start"} to ${dateTo || "End"}`,
      onRemove: () => {
        setDatePreset("");
        setDateFrom("");
        setDateTo("");
        setCurrentPage(1);
      },
    });
  }
  if (ratingFilter !== "all") {
    activeChips.push({
      id: "rating",
      label: "Rating",
      value: `${ratingFilter} Star${Number(ratingFilter) > 1 ? "s" : ""}`,
      onRemove: () => {
        setRatingFilter("all");
        setCurrentPage(1);
      },
    });
  }

  const handleClearAllFilters = () => {
    setSearch("");
    setDatePreset("");
    setDateFrom("");
    setDateTo("");
    setRatingFilter("all");
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader
        title="Ratings & Reviews"
        description="Monitor verified customer ratings (1–5 stars) across dishes."
      />

      {/* Prominent Filter Toolbar */}
      <div className="admin-filter-bar">
        <div className="filter-item-wrapper" style={{ flex: "1 1 240px", minWidth: "200px" }}>
          <span className="filter-item-label">Search Reviews</span>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="search"
              placeholder="Search by customer or menu item..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: "100%",
                height: "32px",
                padding: "0 10px 0 28px",
                border: "1px solid #d1d5db",
                borderRadius: "5px",
                fontSize: "12px",
                color: "var(--ink)",
                outline: "none",
                background: "#ffffff",
              }}
            />
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: "absolute", left: "8px", color: "var(--muted)", pointerEvents: "none" }}
              aria-hidden="true"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <DateFilterControl
          datePreset={datePreset}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onChangePreset={(preset) => {
            setDatePreset(preset);
            setDateFrom("");
            setDateTo("");
            setCurrentPage(1);
          }}
          onApplyCustom={(from, to) => {
            setDatePreset("custom");
            setDateFrom(from);
            setDateTo(to);
            setCurrentPage(1);
          }}
          onClearDate={() => {
            setDatePreset("");
            setDateFrom("");
            setDateTo("");
            setCurrentPage(1);
          }}
        />

        <FilterSelectControl
          label="Filter by Rating"
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "all", label: "All Ratings" },
            { value: "5", label: "5 Stars (★★★★★)" },
            { value: "4", label: "4 Stars (★★★★☆)" },
            { value: "3", label: "3 Stars (★★★☆☆)" },
            { value: "2", label: "2 Stars (★★☆☆☆)" },
            { value: "1", label: "1 Star (★☆☆☆☆)" },
          ]}
        />
      </div>

      <ActiveFilterChips chips={activeChips} onClearAll={handleClearAllFilters} />

      <section className="surface data-surface">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            Loading customer ratings...
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            title={activeChips.length > 0 ? "No ratings found for this date/rating combination" : "No ratings found"}
            description={
              activeChips.length > 0
                ? "Try selecting a different date range or star rating filter."
                : "Verified ratings submitted by customers after order completion will appear here."
            }
          />
        ) : (
          <Table
            columns={["Customer", "Menu Item", "Star Rating", "Date", "Action"]}
            rows={reviews}
            renderRow={(r) => {
              const customerName =
                r.customer?.name ||
                `${r.customer?.firstName || ""} ${r.customer?.lastName || ""}`.trim() ||
                "Customer";

              const itemName = r.menuItem?.name || "Menu Item";
              const itemPrice = r.menuItem?.price ? `₹${r.menuItem.price}` : "";

              const dateStr = r.createdAt
                ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : "—";

              return (
                <tr key={r._id}>
                  <td>
                    <strong>{customerName}</strong>
                    {r.customer?.phone && (
                      <small className="muted">{r.customer.phone}</small>
                    )}
                  </td>
                  <td>
                    <strong>{itemName}</strong>
                    {itemPrice && <small className="muted">{itemPrice}</small>}
                  </td>
                  <td>
                    <StarRating rating={r.rating} />
                  </td>
                  <td className="muted">{dateStr}</td>
                  <td>
                    <button
                      type="button"
                      className="row-action danger"
                      onClick={() => handleDelete(r)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            }}
          />
        )}

        <AdminPagination
          page={currentPage}
          total={totalReviews}
          limit={pageSize}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </>
  );
}