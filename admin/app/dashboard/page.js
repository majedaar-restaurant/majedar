"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { PageHeader, StatusBadge, Table, EmptyState, useToast } from "@/components/ui";
import { getAdminOrders, updateAdminOrderStatus } from "@/lib/api/orders";
import {
  getDashboardStats,
  getAdminSettings,
  toggleShopStatus,
  toggleOverOrder,
} from "@/lib/api/settings";
import { connectAdminSocket } from "@/lib/socket";
import { AcceptanceTimer } from "@/components/ui/new-order-alert-modal";
import { alertManager } from "@/lib/alert-manager";

const STATUS_LABELS = {
  placed: "Placed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
};

const FILTER_PRESETS = [
  { id: "today", label: "Today" },
  { id: "this-week", label: "This Week" },
  { id: "last-week", label: "Last Week" },
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
  { id: "this-year", label: "This Year" },
  { id: "custom", label: "Custom Range" },
];

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [shopSettings, setShopSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

  // Date Filtering State (Today by default)
  const [datePreset, setDatePreset] = useState("today");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [customPopoverOpen, setCustomPopoverOpen] = useState(false);
  const [localCustomFrom, setLocalCustomFrom] = useState("");
  const [localCustomTo, setLocalCustomTo] = useState("");
  const customPopoverRef = useRef(null);

  const filterRef = useRef({ preset: "today", from: "", to: "" });
  filterRef.current = { preset: datePreset, from: dateFrom, to: dateTo };

  // Over Order Modal State
  const [showOverOrderModal, setShowOverOrderModal] = useState(false);
  const [overOrderType, setOverOrderType] = useState("30"); // "30" or "custom"
  const [customMinutes, setCustomMinutes] = useState(45);

  const toast = useToast();

  const loadDashboardData = useCallback(async (forcedPreset, forcedFrom, forcedTo) => {
    const preset = forcedPreset !== undefined ? forcedPreset : filterRef.current.preset;
    const from = forcedFrom !== undefined ? forcedFrom : filterRef.current.from;
    const to = forcedTo !== undefined ? forcedTo : filterRef.current.to;

    const filterParams = { datePreset: preset, limit: 100 };
    if (preset === "custom" && from && to) {
      filterParams.dateFrom = from;
      filterParams.dateTo = to;
    }

    try {
      const [ordersData, statsData, settingsData, liveOrdersData] = await Promise.allSettled([
        getAdminOrders(filterParams),
        getDashboardStats(filterParams),
        getAdminSettings(),
        getAdminOrders({ limit: 100 }), // live queue & awaiting confirmation
      ]);

      if (ordersData.status === "fulfilled") {
        setOrders(ordersData.value || []);
      }
      if (liveOrdersData.status === "fulfilled") {
        setLiveOrders(liveOrdersData.value || []);
      }
      if (statsData.status === "fulfilled") {
        setStats(statsData.value);
        if (statsData.value?.shopStatus) {
          setShopSettings(statsData.value.shopStatus);
        }
      }
      if (settingsData.status === "fulfilled") {
        setShopSettings(settingsData.value);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    // Poll every 15 seconds to ensure operational sync even if tab loses websocket focus
    const interval = setInterval(() => {
      loadDashboardData();
    }, 15000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Close custom popover on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (customPopoverRef.current && !customPopoverRef.current.contains(e.target)) {
        setCustomPopoverOpen(false);
      }
    }
    if (customPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [customPopoverOpen]);

  // Socket.IO Real-time Synchronization
  useEffect(() => {
    const socket = connectAdminSocket();
    if (!socket) return;

    socket.emit("join:admin");

    const handleRealtimeUpdate = () => {
      loadDashboardData();
    };

    socket.on("order:new", handleRealtimeUpdate);
    socket.on("new_order", handleRealtimeUpdate);
    socket.on("order:confirmed", handleRealtimeUpdate);
    socket.on("order:status_changed", handleRealtimeUpdate);
    socket.on("order:expired", handleRealtimeUpdate);
    socket.on("order:cancelled", handleRealtimeUpdate);
    socket.on("shop:status_changed", (updatedStatus) => {
      setShopSettings(updatedStatus);
      loadDashboardData();
    });
    socket.on("connect", () => {
      socket.emit("join:admin");
      loadDashboardData();
    });

    return () => {
      socket.off("order:new", handleRealtimeUpdate);
      socket.off("new_order", handleRealtimeUpdate);
      socket.off("order:confirmed", handleRealtimeUpdate);
      socket.off("order:status_changed", handleRealtimeUpdate);
      socket.off("order:expired", handleRealtimeUpdate);
      socket.off("order:cancelled", handleRealtimeUpdate);
      socket.off("shop:status_changed");
    };
  }, [loadDashboardData]);

  // Filter change handlers
  const handlePresetSelect = (presetId) => {
    if (presetId === "custom") {
      setCustomPopoverOpen((prev) => !prev);
      return;
    }
    setCustomPopoverOpen(false);
    setDatePreset(presetId);
    setDateFrom("");
    setDateTo("");
    setLoading(true);
    loadDashboardData(presetId, "", "");
  };

  const handleApplyCustomDate = (e) => {
    e?.preventDefault();
    if (!localCustomFrom || !localCustomTo) return;
    setDatePreset("custom");
    setDateFrom(localCustomFrom);
    setDateTo(localCustomTo);
    setCustomPopoverOpen(false);
    setLoading(true);
    loadDashboardData("custom", localCustomFrom, localCustomTo);
  };

  const handleResetToToday = () => {
    setLocalCustomFrom("");
    setLocalCustomTo("");
    setDatePreset("today");
    setDateFrom("");
    setDateTo("");
    setCustomPopoverOpen(false);
    setLoading(true);
    loadDashboardData("today", "", "");
  };

  // Handlers for Shop Availability Toggles
  const handleToggleShop = async () => {
    if (!shopSettings) return;
    const nextState = !shopSettings.isOpen;
    setActionLoading(true);
    try {
      const updated = await toggleShopStatus(nextState);
      setShopSettings(updated);
      toast(
        nextState
          ? "Shop is now OPEN and accepting orders."
          : "Shop is now CLOSED. Customers cannot place new orders.",
        nextState ? "success" : "warn"
      );
      loadDashboardData();
    } catch (err) {
      toast(err.message || "Failed to update shop status", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleOverOrder = async () => {
    if (!shopSettings) return;
    const isCurrentlyActive = shopSettings.overOrder?.isActive;

    if (isCurrentlyActive) {
      // Deactivate immediately
      setActionLoading(true);
      try {
        const updated = await toggleOverOrder(false);
        setShopSettings(updated);
        toast("Over Order mode deactivated. Normal ordering restored.", "success");
        loadDashboardData();
      } catch (err) {
        toast(err.message || "Failed to deactivate over order mode", "danger");
      } finally {
        setActionLoading(false);
      }
    } else {
      // Open duration selection modal
      setShowOverOrderModal(true);
    }
  };

  const handleApplyOverOrder = async () => {
    const mins = overOrderType === "30" ? 30 : Math.max(1, Number(customMinutes) || 30);
    setActionLoading(true);
    try {
      const updated = await toggleOverOrder(true, mins);
      setShopSettings(updated);
      setShowOverOrderModal(false);
      toast(`Over Order mode activated for ${mins} minutes.`, "warn");
      loadDashboardData();
    } catch (err) {
      toast(err.message || "Failed to activate over order mode", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    setConfirmingId(orderId);
    alertManager.removePendingOrder(orderId);
    try {
      await updateAdminOrderStatus(orderId, { orderStatus: "confirmed" });
      toast("Order confirmed successfully!", "success");
      loadDashboardData();
    } catch (err) {
      toast(err.message || "Failed to confirm order", "danger");
    } finally {
      setConfirmingId(null);
    }
  };

  // Live queues derived from liveOrders
  const activeOrders = liveOrders.filter(
    (o) => o.orderStatus === "placed" || o.orderStatus === "preparing" || o.orderStatus === "out_for_delivery"
  );

  const awaitingOrders = liveOrders.filter(
    (o) => o.orderStatus === "placed" && o.acceptanceDeadline && new Date(o.acceptanceDeadline) > new Date()
  );

  // Friendly filter label
  const PRESET_DISPLAY_NAMES = {
    today: "Today",
    "this-week": "This Week",
    "last-week": "Last Week",
    "this-month": "This Month",
    "last-month": "Last Month",
    "this-year": "This Year",
    custom: dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : "Custom Range",
  };
  const activeFilterLabel = PRESET_DISPLAY_NAMES[datePreset] || "Today";

  // Filtered stats
  const filteredOrdersCount = stats?.ordersCount ?? orders.length;
  const filteredRevenue = stats?.revenue ?? 0;
  const statusBreakdown = stats?.statusBreakdown || {
    placed: 0,
    preparing: 0,
    completed: 0,
    cancelled: 0,
  };

  const isShopOpen = shopSettings ? shopSettings.isOpen : true;
  const isOverOrderActive = shopSettings?.overOrder?.isActive;
  const todayISTStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Real-time restaurant operational control, today's performance, and kitchen fulfillment queue."
      />

      {/* ── Operational Control Header (Shop Availability & Over Order) ── */}
      <section
        style={{
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: isShopOpen ? "#16a34a" : "#dc2626",
                  boxShadow: isShopOpen
                    ? "0 0 0 3px rgba(22, 163, 74, 0.2)"
                    : "0 0 0 3px rgba(220, 38, 38, 0.2)",
                }}
              />
              <strong style={{ fontSize: "14px", color: "var(--ink)" }}>
                Shop Status:{" "}
                <span style={{ color: isShopOpen ? "#16a34a" : "#dc2626" }}>
                  {isShopOpen ? "OPEN (Accepting Orders)" : "CLOSED (Orders Blocked)"}
                </span>
              </strong>
            </div>
            <p style={{ margin: "4px 0 0 18px", fontSize: "12px", color: "var(--muted)" }}>
              {shopSettings?.displayTimings
                ? `Standard Timings: ${shopSettings.displayTimings}`
                : "Operational hours controlled in Settings"}
              {shopSettings?.isManuallyClosed && " · Manually closed by admin"}
            </p>
          </div>

          {/* Over order badge if active */}
          {isOverOrderActive && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#fef3c7",
                border: "1px solid #f59e0b",
                color: "#b45309",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              <span>⏳</span>
              <span>Over Order Active ({shopSettings.overOrder.remainingMinutes}m remaining)</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Open / Close Shop Button */}
          <button
            type="button"
            onClick={handleToggleShop}
            disabled={actionLoading || !shopSettings}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: "none",
              cursor: actionLoading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              backgroundColor: isShopOpen ? "#dc2626" : "#16a34a",
              color: "#ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            }}
          >
            {actionLoading ? "Updating..." : isShopOpen ? "Close Shop" : "Open Shop"}
          </button>

          {/* Over Order Button */}
          <button
            type="button"
            onClick={handleToggleOverOrder}
            disabled={actionLoading || !shopSettings}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: isOverOrderActive ? "1px solid #dc2626" : "1px solid #d97706",
              backgroundColor: isOverOrderActive ? "#fee2e2" : "#fef3c7",
              color: isOverOrderActive ? "#991b1b" : "#92400e",
              cursor: actionLoading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {isOverOrderActive ? "Deactivate Over Order" : "Over Order"}
          </button>
        </div>
      </section>

      {/* ── Operational / Analytics Filter Bar (Today by default, Week, Month, Year, Custom) ── */}
      <section
        style={{
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "14px 18px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <strong style={{ fontSize: "13px", color: "var(--ink)" }}>Filter Analytics & Orders:</strong>
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
              borderRadius: "20px",
              padding: "2px 10px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            Viewing: {activeFilterLabel}
          </span>
          {datePreset !== "today" && (
            <button
              type="button"
              onClick={handleResetToToday}
              style={{
                background: "none",
                border: "none",
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
                padding: "2px 4px",
              }}
            >
              Reset to Today
            </button>
          )}
        </div>

        {/* Filter buttons group & Custom popover */}
        <div
          ref={customPopoverRef}
          style={{
            position: "relative",
            display: "inline-flex",
            flexWrap: "wrap",
            gap: "4px",
            background: "#f3f4f6",
            padding: "3px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          {FILTER_PRESETS.map((preset) => {
            const isActive = datePreset === preset.id;
            const isCustom = preset.id === "custom";
            const customActive = isCustom && (datePreset === "custom" || (dateFrom && dateTo));

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: isActive || customActive ? 700 : 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  backgroundColor: isActive || customActive ? "var(--forest, #14532d)" : "transparent",
                  color: isActive || customActive ? "#ffffff" : "var(--ink-mid, #4b5563)",
                  boxShadow: isActive || customActive ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{preset.label}</span>
                {isCustom && (
                  <svg width={10} height={6} viewBox="0 0 10 6" fill="currentColor">
                    <path d="M0 0l5 5 5-5z" />
                  </svg>
                )}
              </button>
            );
          })}

          {/* Custom Date Range Popover */}
          {customPopoverOpen && (
            <div
              className="date-custom-popover"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                left: "auto",
                zIndex: 200,
                background: "#ffffff",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "10px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                padding: "16px",
                minWidth: "280px",
              }}
            >
              <div className="date-custom-head" style={{ marginBottom: "12px" }}>
                <strong style={{ fontSize: "13px", color: "var(--ink)" }}>Select Custom Dates</strong>
                <button
                  type="button"
                  className="popover-close-btn"
                  onClick={() => setCustomPopoverOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleApplyCustomDate} className="date-custom-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label className="date-input-field">
                  <span>Start Date (From)</span>
                  <input
                    type="date"
                    value={localCustomFrom}
                    max={localCustomTo || todayISTStr}
                    onChange={(e) => setLocalCustomFrom(e.target.value)}
                    required
                  />
                </label>

                <label className="date-input-field">
                  <span>End Date (To)</span>
                  <input
                    type="date"
                    value={localCustomTo}
                    min={localCustomFrom || undefined}
                    max={todayISTStr}
                    onChange={(e) => setLocalCustomTo(e.target.value)}
                    required
                  />
                </label>

                <div className="date-custom-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                  <button
                    type="button"
                    className="button button-secondary"
                    style={{ height: 32, fontSize: 12, padding: "0 10px" }}
                    onClick={handleResetToToday}
                  >
                    Reset to Today
                  </button>
                  <button
                    type="submit"
                    className="button button-primary"
                    style={{ height: 32, fontSize: 12, padding: "0 14px", backgroundColor: "var(--forest, #14532d)" }}
                  >
                    Apply Filter
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ── Summary Cards Grid (Filtered Orders, Revenue, Pending, Active) ── */}
      <section className="summary-grid" style={{ marginBottom: "24px" }}>
        {/* Card 1: Orders (Filtered) */}
        <article className="summary-card">
          <p>{activeFilterLabel}&apos;s Orders</p>
          <div className="summary-number">
            {loading ? "..." : filteredOrdersCount}
          </div>
          <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-mid)" }}>
              Placed: <strong style={{ color: "var(--ink)" }}>{statusBreakdown.placed || 0}</strong>
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>·</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-mid)" }}>
              Prep: <strong style={{ color: "var(--ink)" }}>{statusBreakdown.preparing || 0}</strong>
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>·</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-mid)" }}>
              Done: <strong style={{ color: "#16a34a" }}>{statusBreakdown.completed || 0}</strong>
            </span>
            {(statusBreakdown.cancelled || 0) > 0 && (
              <>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>·</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#dc2626" }}>
                  Cancelled: {statusBreakdown.cancelled}
                </span>
              </>
            )}
          </div>
        </article>

        {/* Card 2: Revenue (Filtered) */}
        <article className="summary-card">
          <p>{activeFilterLabel}&apos;s Revenue</p>
          <div className="summary-number" style={{ color: "#16a34a" }}>
            {loading ? "..." : `₹${Math.round(filteredRevenue).toLocaleString("en-IN")}`}
          </div>
          <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--muted)" }}>
            From paid & completed orders
          </div>
        </article>

        {/* Card 3: Pending Orders */}
        <article className="summary-card">
          <p>Pending Orders</p>
          <div
            className="summary-number"
            style={{
              color: (stats?.pendingOrdersCount || 0) > 0 ? "#b45309" : "var(--ink)",
            }}
          >
            {loading ? "..." : stats?.pendingOrdersCount ?? 0}
          </div>
          <div
            className={`summary-note ${(stats?.pendingOrdersCount || 0) > 0 ? "warn" : "neutral"}`}
          >
            {(stats?.pendingOrdersCount || 0) > 0
              ? `${stats.pendingOrdersCount} orders awaiting action`
              : "No orders awaiting action"}
          </div>
        </article>

        {/* Card 4: Active Orders */}
        <article className="summary-card">
          <p>Active Orders</p>
          <div className="summary-number">
            {loading ? "..." : activeOrders.length}
          </div>
          <div className={`summary-note ${activeOrders.length > 0 ? "warn" : "neutral"}`}>
            {activeOrders.length > 0
              ? `${activeOrders.length} in kitchen & fulfillment queue`
              : "Kitchen queue clear"}
          </div>
        </article>
      </section>

      {/* ── Awaiting Confirmation / Urgent Alert Section ── */}
      {awaitingOrders.length > 0 && (
        <section
          style={{
            marginBottom: "24px",
            background: "#fff9f9",
            border: "2px solid #b91c1c",
            borderRadius: "10px",
            padding: "16px 20px",
            boxShadow: "0 4px 14px rgba(185, 28, 28, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              borderBottom: "1px solid #fee2e2",
              paddingBottom: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🔔</span>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#991b1b", margin: 0 }}>
                  New Orders Awaiting Confirmation ({awaitingOrders.length})
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#7f1d1d" }}>
                  Confirm incoming orders before the deadline expires.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/orders?status=placed"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#991b1b",
                textDecoration: "underline",
              }}
            >
              View in Orders →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "12px",
            }}
          >
            {awaitingOrders.map((ord) => {
              const custName =
                ord.customer?.name ||
                `${ord.deliveryAddress?.firstName || ""} ${ord.deliveryAddress?.lastName || ""}`.trim() ||
                "Customer";
              const isConfirming = confirmingId === ord._id;

              return (
                <div
                  key={ord._id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #fecdd3",
                    borderRadius: "8px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#111827" }}>
                        Order #{ord.orderNumber}
                      </strong>
                      <div style={{ fontSize: "12px", color: "#4b5563" }}>
                        Customer: <strong>{custName}</strong>
                      </div>
                    </div>
                    <strong style={{ fontSize: "15px", color: "#14532d" }}>
                      ₹{ord.total}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#fff1f2",
                      padding: "6px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#991b1b", fontWeight: 600 }}>
                      Waiting for confirmation
                    </span>
                    <AcceptanceTimer deadline={ord.acceptanceDeadline} />
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    <Link
                      href={`/dashboard/orders/${ord._id}`}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        background: "#f3f4f6",
                        color: "#1f2937",
                        border: "1px solid #d1d5db",
                        borderRadius: "5px",
                        padding: "6px 10px",
                        fontSize: "12px",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      VIEW ORDER
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleConfirmOrder(ord._id)}
                      disabled={isConfirming}
                      style={{
                        flex: 1.2,
                        background: "#14532d",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "6px 10px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: isConfirming ? "not-allowed" : "pointer",
                        opacity: isConfirming ? 0.7 : 1,
                      }}
                    >
                      {isConfirming ? "Confirming..." : "CONFIRM ORDER"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Content Grid: Orders & Active Kitchen Queue ── */}
      <div className="content-grid">
        {/* Filtered Orders List */}
        <section className="surface">
          <div className="surface-heading">
            <div>
              <h2>{activeFilterLabel}&apos;s Orders</h2>
              <p>Customer orders placed during {activeFilterLabel.toLowerCase()} ({orders.length} total).</p>
            </div>
            <Link href="/dashboard/orders">View all in Orders →</Link>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              title={`No orders for ${activeFilterLabel.toLowerCase()}`}
              description={`No orders were placed during this period (${activeFilterLabel}).`}
              compact
            />
          ) : (
            <Table
              columns={["Order #", "Customer", "Amount", "Status", "Date / Time", ""]}
              rows={orders}
              renderRow={(order) => {
                const customerName =
                  order.customer?.name ||
                  `${order.deliveryAddress?.firstName || ""} ${order.deliveryAddress?.lastName || ""}`.trim() ||
                  "Customer";

                const itemsCount = Array.isArray(order.items)
                  ? `${order.items.length} item${order.items.length === 1 ? "" : "s"}`
                  : "";

                const timeStr = order.createdAt
                  ? datePreset === "today"
                    ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—";

                return (
                  <tr key={order._id}>
                    <td>
                      <strong>{order.orderNumber}</strong>
                    </td>
                    <td>
                      <strong>{customerName}</strong>
                      <small className="muted">{itemsCount}</small>
                    </td>
                    <td>
                      <strong>₹{order.total}</strong>
                    </td>
                    <td>
                      <StatusBadge>{STATUS_LABELS[order.orderStatus] || order.orderStatus}</StatusBadge>
                    </td>
                    <td className="muted">{timeStr}</td>
                    <td>
                      <Link className="row-action" href={`/dashboard/orders/${order._id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                );
              }}
            />
          )}
        </section>

        {/* Active Kitchen Queue */}
        <section className="surface">
          <div className="surface-heading">
            <div>
              <h2>Live / Active Kitchen Queue</h2>
              <p>Orders currently in preparation or out for delivery.</p>
            </div>
            <Link href="/dashboard/orders">Manage</Link>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              Loading queue...
            </div>
          ) : activeOrders.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center" }}>
              <p style={{ color: "var(--muted)", fontSize: "12.5px" }}>
                No active orders in kitchen queue right now.
              </p>
            </div>
          ) : (
            <div className="booking-list">
              {activeOrders.slice(0, 6).map((order) => {
                const custName =
                  order.customer?.name ||
                  `${order.deliveryAddress?.firstName || ""} ${order.deliveryAddress?.lastName || ""}`.trim() ||
                  "Customer";

                const itemsList = Array.isArray(order.items)
                  ? order.items.map((it) => `${it.name} ×${it.quantity}`).join(", ")
                  : "Items";

                const badgeBg =
                  order.orderStatus === "placed"
                    ? "#FEF3C7"
                    : order.orderStatus === "preparing"
                      ? "#E0E7FF"
                      : "var(--forest-soft)";

                const badgeText =
                  order.orderStatus === "placed"
                    ? "#B45309"
                    : order.orderStatus === "preparing"
                      ? "#3730A3"
                      : "var(--forest-deep)";

                return (
                  <div className="booking-item" key={order._id}>
                    <span
                      className="booking-avatar"
                      style={{
                        background: badgeBg,
                        color: badgeText,
                        fontSize: "10px",
                        fontWeight: 800,
                      }}
                    >
                      {order.orderStatus === "placed"
                        ? "NEW"
                        : order.orderStatus === "preparing"
                          ? "PREP"
                          : "DELIV"}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>
                        {custName} — #{order.orderNumber}
                      </strong>
                      <small
                        style={{
                          maxWidth: 240,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                        }}
                      >
                        {itemsList}
                      </small>
                    </div>
                    <StatusBadge>{STATUS_LABELS[order.orderStatus] || order.orderStatus}</StatusBadge>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── Over Order Modal ── */}
      {showOverOrderModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              padding: "24px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "17px", fontWeight: 700, color: "var(--ink)" }}>
              Activate Over Order Mode
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
              Temporarily stops new orders from being placed when the kitchen is at peak volume.
              Normal ordering resumes automatically when the timer expires.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: "var(--ink)" }}>
                Select Pause Duration:
              </label>

              <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
                <button
                  type="button"
                  onClick={() => setOverOrderType("30")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: overOrderType === "30" ? "2px solid #b45309" : "1px solid var(--border)",
                    backgroundColor: overOrderType === "30" ? "#fef3c7" : "#f9fafb",
                    color: overOrderType === "30" ? "#92400e" : "var(--ink)",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  30 Minutes
                </button>

                <button
                  type="button"
                  onClick={() => setOverOrderType("custom")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: overOrderType === "custom" ? "2px solid #b45309" : "1px solid var(--border)",
                    backgroundColor: overOrderType === "custom" ? "#fef3c7" : "#f9fafb",
                    color: overOrderType === "custom" ? "#92400e" : "var(--ink)",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Custom Time
                </button>
              </div>

              {overOrderType === "custom" && (
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px", color: "var(--muted)" }}>
                    Minutes to Pause:
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="360"
                    step="5"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value, 10) || 15))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  />
                  <small style={{ color: "var(--muted)", fontSize: "11px", display: "block", marginTop: "4px" }}>
                    Suggested: 15, 45, 60, or 90 minutes
                  </small>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setShowOverOrderModal(false)}
                disabled={actionLoading}
                className="button button-quiet"
                style={{ padding: "8px 16px", fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyOverOrder}
                disabled={actionLoading}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#d97706",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: actionLoading ? "not-allowed" : "pointer",
                }}
              >
                {actionLoading ? "Activating..." : "Confirm & Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}