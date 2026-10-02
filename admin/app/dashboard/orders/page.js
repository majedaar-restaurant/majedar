"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PageHeader, StatusBadge, Table, useToast } from "@/components/ui";
import { getAdminOrders, updateAdminOrderStatus } from "@/lib/api/orders";
import { getWhatsAppShareUrl } from "@/lib/whatsapp";
import { connectAdminSocket } from "@/lib/socket";
import { playNotificationChime } from "@/lib/push-notifications";
import { alertManager } from "@/lib/alert-manager";
import {
  DateFilterControl,
  FilterSelectControl,
  ActiveFilterChips,
  AdminPagination,
} from "@/components/ui/admin-filters";

function WhatsAppIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function AcceptanceCountdown({ deadline, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!deadline) return 0;
    return Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  if (secondsLeft <= 0) {
    return (
      <span style={{ color: "var(--danger, #dc2626)", fontWeight: 700, fontSize: "11px" }}>
        Expired
      </span>
    );
  }

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--crimson, #b91c1c)", fontSize: "11px" }}>
      ⏱ {mins}:{secs}
    </span>
  );
}

const STATUS_LABELS = {
  placed: "Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready_for_pickup: "Ready for Pickup",
  out_for_delivery: "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
};

const PAYMENT_LABELS = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [datePreset, setDatePreset] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 50;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toast = useToast();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      if (search.trim()) params.search = search.trim();
      if (datePreset) params.datePreset = datePreset;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (statusFilter !== "all") params.orderStatus = statusFilter;
      if (paymentFilter !== "all") params.paymentStatus = paymentFilter;

      const data = await getAdminOrders(params);
      setOrders(data);
      setTotalOrders(data.total ?? data.length);
      setTotalPages(data.totalPages ?? Math.max(1, Math.ceil((data.total ?? data.length) / pageSize)));
      alertManager.syncPendingOrders(data);
    } catch (err) {
      toast(err.message || "Failed to load orders", "danger");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, datePreset, dateFrom, dateTo, statusFilter, paymentFilter, toast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Real-time Socket.IO synchronization for incoming and updated orders
  useEffect(() => {
    const socket = connectAdminSocket();
    if (!socket) return;

    socket.emit("join:admin");

    const handledEvents = new Set();

    const handleNewOrder = (payload) => {
      if (!payload?.orderId) return;
      const key = `new-${payload.orderId}`;
      if (!handledEvents.has(key)) {
        handledEvents.add(key);
        playNotificationChime();
        toast(`New Order #${payload.orderNumber || ""} (₹${payload.total}) received!`, "success");
      }
      loadOrders();
    };

    const handleConfirmed = (payload) => {
      if (!payload?.orderId) return;
      alertManager.removePendingOrder(payload.orderId);
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === payload.orderId
            ? { ...ord, orderStatus: "confirmed", confirmedAt: payload.confirmedAt }
            : ord
        )
      );
    };

    const handleStatusChanged = (payload) => {
      if (!payload?.orderId) return;
      if (payload.orderStatus !== "placed") {
        alertManager.removePendingOrder(payload.orderId);
      }
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === payload.orderId
            ? { ...ord, orderStatus: payload.orderStatus }
            : ord
        )
      );
    };

    const handleExpired = (payload) => {
      if (!payload?.orderId) return;
      alertManager.removePendingOrder(payload.orderId);
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === payload.orderId
            ? { ...ord, orderStatus: "expired", expiredAt: payload.expiredAt }
            : ord
        )
      );
    };

    const handleCancelled = (payload) => {
      if (!payload?.orderId) return;
      alertManager.removePendingOrder(payload.orderId);
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === payload.orderId
            ? { ...ord, orderStatus: "cancelled", cancelledAt: payload.cancelledAt }
            : ord
        )
      );
    };

    const handleReconnect = () => {
      socket.emit("join:admin");
      loadOrders();
    };

    socket.on("order:new", handleNewOrder);
    socket.on("new_order", handleNewOrder);
    socket.on("order:confirmed", handleConfirmed);
    socket.on("order:status_changed", handleStatusChanged);
    socket.on("order:expired", handleExpired);
    socket.on("order:cancelled", handleCancelled);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("new_order", handleNewOrder);
      socket.off("order:confirmed", handleConfirmed);
      socket.off("order:status_changed", handleStatusChanged);
      socket.off("order:expired", handleExpired);
      socket.off("order:cancelled", handleCancelled);
      socket.off("connect", handleReconnect);
    };
  }, [loadOrders, toast]);

  const handleQuickConfirm = async (orderId) => {
    setConfirmingId(orderId);
    alertManager.removePendingOrder(orderId);
    try {
      await updateAdminOrderStatus(orderId, { orderStatus: "confirmed" });
      toast("Order confirmed successfully!", "success");
      await loadOrders();
    } catch (err) {
      toast(err.message || "Failed to confirm order", "danger");
      await loadOrders();
    } finally {
      setConfirmingId(null);
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
  if (statusFilter !== "all") {
    activeChips.push({
      id: "status",
      label: "Order Status",
      value: STATUS_LABELS[statusFilter] || statusFilter,
      onRemove: () => {
        setStatusFilter("all");
        setCurrentPage(1);
      },
    });
  }
  if (paymentFilter !== "all") {
    activeChips.push({
      id: "payment",
      label: "Payment",
      value: PAYMENT_LABELS[paymentFilter] || paymentFilter,
      onRemove: () => {
        setPaymentFilter("all");
        setCurrentPage(1);
      },
    });
  }

  const handleClearAllFilters = () => {
    setSearch("");
    setDatePreset("");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setCurrentPage(1);
  };

  const urgentNewOrders = orders.filter(
    (o) =>
      o.orderStatus === "placed" &&
      o.acceptanceDeadline &&
      new Date(o.acceptanceDeadline).getTime() > now
  );

  return (
    <>
      <PageHeader
        title="Orders"
        description=""
      />

      {urgentNewOrders.length > 0 && (
        <div
          style={{
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: "8px",
            padding: "14px 18px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  background: "var(--crimson, #b91c1c)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                }}
              >
                NEW ORDER ALERT
              </span>
              <strong style={{ fontSize: "14px", color: "#881337" }}>
                {urgentNewOrders.length} order(s) awaiting acceptance!
              </strong>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {urgentNewOrders.map((ord) => {
              const isPastDeadline = ord.acceptanceDeadline && new Date(ord.acceptanceDeadline).getTime() <= now;
              return (
                <div
                  key={ord._id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #fda4af",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontSize: "13px",
                  }}
                >
                  <div>
                    <strong>Order #{ord.orderNumber}</strong> • ₹{ord.total}
                    <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                      Waiting for confirmation
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <AcceptanceCountdown
                      deadline={ord.acceptanceDeadline}
                      onExpire={loadOrders}
                    />
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>remaining</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickConfirm(ord._id)}
                    disabled={confirmingId === ord._id || isPastDeadline}
                    style={{
                      background: isPastDeadline ? "#9ca3af" : "var(--forest-deep, #14532d)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: isPastDeadline ? "not-allowed" : "pointer",
                    }}
                  >
                    {confirmingId === ord._id ? "Confirming..." : "Confirm Order"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prominent Filter Toolbar */}
      <div className="admin-filter-bar">
        <div className="filter-item-wrapper" style={{ flex: "1 1 240px", minWidth: "200px" }}>
          <span className="filter-item-label">Search Orders</span>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="search"
              placeholder="Search by order #, name or phone..."
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
          label="Order Status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "placed", label: "Placed" },
            { value: "confirmed", label: "Confirmed" },
            { value: "preparing", label: "Preparing" },
            { value: "ready_for_pickup", label: "Ready for Pickup" },
            { value: "out_for_delivery", label: "Out for Delivery" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
            { value: "expired", label: "Expired" },
          ]}
        />

        <FilterSelectControl
          label="Payment"
          value={paymentFilter}
          onChange={(e) => {
            setPaymentFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "all", label: "All Payments" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
            { value: "refunded", label: "Refunded" },
          ]}
        />
      </div>

      <ActiveFilterChips chips={activeChips} onClearAll={handleClearAllFilters} />

      <section className="surface data-surface">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            Loading orders...
          </div>
        ) : (
          <Table
            columns={[
              "Customer",
              "Phone",
              "Items",
              "Total",
              "Payment",
              "Order Status",
              "Action",
            ]}
            rows={orders}
            empty={
              activeChips.length > 0
                ? "No orders found for this date/status combination."
                : "No orders found."
            }
            renderRow={(order) => {
              const customerName =
                order.customer?.name ||
                `${order.deliveryAddress?.firstName || ""} ${order.deliveryAddress?.lastName || ""}`.trim() ||
                "Customer";

              const phone = order.customer?.phone || order.deliveryAddress?.phone || "—";

              const itemsSummary = Array.isArray(order.items)
                ? order.items.map((it) => `${it.name} ×${it.quantity}`).join(", ")
                : "—";

              const createdDate = order.createdAt
                ? new Date(order.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "—";

              return (
                <tr key={order._id}>
                  <td>
                    <strong>{customerName}</strong>
                  </td>
                  <td className="muted">{phone}</td>
                  <td
                    className="muted"
                    style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={itemsSummary}
                  >
                    {itemsSummary}
                  </td>
                  <td>
                    <strong>₹{order.total}</strong>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-start" }}>
                      <StatusBadge>{PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}</StatusBadge>
                      <small className="muted" style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: 600 }}>
                        {order.paymentMethod === "razorpay" ? "Online" : "COD"}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "flex-start" }}>
                      <StatusBadge>{STATUS_LABELS[order.orderStatus] || order.orderStatus}</StatusBadge>
                      {order.orderStatus === "placed" && (
                        <span style={{ fontSize: "10px", color: "var(--muted)" }}>
                          Waiting for confirmation
                        </span>
                      )}
                      {order.orderStatus === "placed" && order.acceptanceDeadline && (
                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                          <AcceptanceCountdown
                            deadline={order.acceptanceDeadline}
                            onExpire={loadOrders}
                          />
                          <span style={{ fontSize: "10px", color: "var(--muted)" }}>remaining</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {order.orderStatus === "placed" && (
                        <button
                          type="button"
                          className="row-action"
                          onClick={() => handleQuickConfirm(order._id)}
                          disabled={confirmingId === order._id || (order.acceptanceDeadline && new Date(order.acceptanceDeadline).getTime() <= now)}
                          style={{
                            color: (order.acceptanceDeadline && new Date(order.acceptanceDeadline).getTime() <= now) ? "#9ca3af" : "var(--forest-deep, #14532d)",
                            fontWeight: 700,
                            padding: "2px 6px",
                            background: (order.acceptanceDeadline && new Date(order.acceptanceDeadline).getTime() <= now) ? "#f3f4f6" : "var(--forest-soft, #f0fdf4)",
                            borderRadius: "4px",
                            border: "1px solid #bbf7d0",
                            cursor: (order.acceptanceDeadline && new Date(order.acceptanceDeadline).getTime() <= now) ? "not-allowed" : "pointer",
                          }}
                        >
                          {confirmingId === order._id ? "..." : "Confirm"}
                        </button>
                      )}
                      <Link className="row-action" href={`/dashboard/orders/${order._id}`}>
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          const url = getWhatsAppShareUrl(order);
                          const opened = window.open(url, "_blank", "noopener,noreferrer");
                          if (!opened) window.location.assign(url);
                        }}
                        title="Share on WhatsApp"
                        aria-label="Share on WhatsApp"
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "3px",
                          color: "#16a34a",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "4px 6px",
                          lineHeight: 1,
                        }}
                      >
                        <WhatsAppIcon size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }}
          />
        )}

        <AdminPagination
          page={currentPage}
          total={totalOrders}
          limit={pageSize}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </>
  );
}