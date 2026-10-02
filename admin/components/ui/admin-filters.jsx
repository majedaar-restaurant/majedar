"use client";

import { useState, useRef, useEffect } from "react";

/**
 * Common Date and Operational Filters Component for Majedaar Admin Panel.
 *
 * Implements:
 * - Clearly visible, properly bordered inputs & dropdowns matching the existing theme
 * - Date presets: Today (IST), This Week (Mon-Sun IST), and Custom Range (From / To)
 * - Custom Date Range popover with From, To, [ Apply ], [ Clear ]
 * - Active filter indicators with individual [ × ] removal and [ Clear All ]
 * - Mobile/tablet responsive toggle
 */

export function DateFilterControl({
  datePreset,
  dateFrom,
  dateTo,
  onChangePreset,
  onApplyCustom,
  onClearDate,
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [localFrom, setLocalFrom] = useState(dateFrom || "");
  const [localTo, setLocalTo] = useState(dateTo || "");
  const popoverRef = useRef(null);

  useEffect(() => {
    setLocalFrom(dateFrom || "");
    setLocalTo(dateTo || "");
  }, [dateFrom, dateTo]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setPopoverOpen(false);
      }
    }
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen]);

  const handleApply = (e) => {
    e?.preventDefault();
    if (onApplyCustom) {
      onApplyCustom(localFrom, localTo);
    }
    setPopoverOpen(false);
  };

  const handleClear = () => {
    setLocalFrom("");
    setLocalTo("");
    if (onClearDate) {
      onClearDate();
    }
    setPopoverOpen(false);
  };

  const isCustomActive = datePreset === "custom" || (dateFrom && dateTo);

  return (
    <div className="filter-item-wrapper" ref={popoverRef} style={{ position: "relative" }}>
      <span className="filter-item-label">Date Filter</span>
      <div className="date-filter-group" role="group" aria-label="Date Range Filter">
        <button
          type="button"
          className={`date-preset-btn ${datePreset === "today" ? "active" : ""}`}
          onClick={() => {
            setPopoverOpen(false);
            if (datePreset === "today") {
              onClearDate();
            } else {
              onChangePreset("today");
            }
          }}
        >
          Today
        </button>

        <button
          type="button"
          className={`date-preset-btn ${datePreset === "this-week" ? "active" : ""}`}
          onClick={() => {
            setPopoverOpen(false);
            if (datePreset === "this-week") {
              onClearDate();
            } else {
              onChangePreset("this-week");
            }
          }}
        >
          This Week
        </button>

        <button
          type="button"
          className={`date-preset-btn ${isCustomActive ? "active" : ""}`}
          onClick={() => setPopoverOpen((prev) => !prev)}
          aria-expanded={popoverOpen}
        >
          <span>{isCustomActive && dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : "Custom Range"}</span>
          <svg width={10} height={6} viewBox="0 0 10 6" fill="currentColor" style={{ marginLeft: 4 }}>
            <path d="M0 0l5 5 5-5z" />
          </svg>
        </button>
      </div>

      {/* Custom Range Popover */}
      {popoverOpen && (
        <div className="date-custom-popover">
          <div className="date-custom-head">
            <strong>Select Custom Range</strong>
            <button
              type="button"
              className="popover-close-btn"
              onClick={() => setPopoverOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleApply} className="date-custom-body">
            <label className="date-input-field">
              <span>From Date</span>
              <input
                type="date"
                value={localFrom}
                onChange={(e) => setLocalFrom(e.target.value)}
                required
              />
            </label>

            <label className="date-input-field">
              <span>To Date</span>
              <input
                type="date"
                value={localTo}
                min={localFrom || undefined}
                onChange={(e) => setLocalTo(e.target.value)}
                required
              />
            </label>

            <div className="date-custom-actions">
              <button
                type="button"
                className="button button-secondary"
                style={{ height: 32, fontSize: 12, padding: "0 10px" }}
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="submit"
                className="button button-primary"
                style={{ height: 32, fontSize: 12, padding: "0 12px" }}
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function FilterSelectControl({ label, value, onChange, options = [] }) {
  return (
    <label className="visible-filter-select">
      <span className="filter-item-label">{label}</span>
      <div className="select-container">
        <select value={value} onChange={onChange}>
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const text = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>
        <svg
          className="select-chevron"
          width={10}
          height={6}
          viewBox="0 0 10 6"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M0 0l5 5 5-5z" />
        </svg>
      </div>
    </label>
  );
}

export function ActiveFilterChips({ chips = [], onClearAll }) {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="active-filters-container">
      <span className="active-filters-label">Active Filters:</span>
      <div className="active-chips-list">
        {chips.map((chip) => (
          <span key={chip.id} className="active-filter-chip">
            <span className="chip-key">{chip.label}:</span>
            <strong className="chip-val">{chip.value}</strong>
            <button
              type="button"
              className="chip-remove-btn"
              onClick={chip.onRemove}
              title={`Remove ${chip.label} filter`}
              aria-label={`Remove ${chip.label} filter`}
            >
              ×
            </button>
          </span>
        ))}

        <button
          type="button"
          className="clear-all-filters-btn"
          onClick={onClearAll}
          title="Clear all active filters"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

export function AdminPagination({ page = 1, total = 0, limit = 50, totalPages = 1, onPageChange }) {
  if (total <= 0) return null;

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);
  const pagesCount = Math.max(1, totalPages || Math.ceil(total / limit));

  return (
    <div className="admin-pagination-bar">
      <div className="pagination-info">
        Showing <strong>{startIdx}–{endIdx}</strong> of <strong>{total}</strong> records
      </div>

      <div className="pagination-buttons">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>

        <span className="pagination-page-indicator">
          Page <strong>{page}</strong> of <strong>{pagesCount}</strong>
        </span>

        <button
          type="button"
          className="pagination-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pagesCount}
        >
          Next
        </button>
      </div>
    </div>
  );
}
