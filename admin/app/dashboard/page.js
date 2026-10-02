"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader, StatusBadge, Table, EmptyState, useToast } from "@/components/ui";
import { getAdminOrders, updateAdminOrderStatus } from "@/lib/api/orders";
import { connectAdminSocket } from "@/lib/socket";
import { AcceptanceTimer } from "@/components/ui/new-order-alert-modal";
import { alertManager } from "@/lib/alert-manager";

const STATUS_LABELS = {
  placed: "Placed",
  preparing: "Preparing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const toast = useToast();

  const handleConfirmOrder = async (orderId) => {
    setConfirmingId(orderId);
    alertManager.removePendingOrder(orderId);
    try {
      await updateAdminOrderStatus(orderId, { orderStatus: "confirmed" });
      toast("Order confirmed successfully!", "success");
      loadDashboardOrders();
    } catch (err) {
      toast(err.message || "Failed to confirm order", "danger");
    } finally {
      setConfirmingId(null);
    }
  };

  const loadDashboardOrders = async () => {
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardOrders();
  }, []);

  useEffect(() => {
    const socket = connectAdminSocket();
    if (!socket) return;

    socket.emit("join:admin");

    const handleRealtimeUpdate = () => {
      loadDashboardOrders();
    };

    socket.on("order:new", handleRealtimeUpdate);
    socket.on("new_order", handleRealtimeUpdate);
    socket.on("order:confirmed", handleRealtimeUpdate);
    socket.on("order:status_changed", handleRealtimeUpdate);
    socket.on("order:expired", handleRealtimeUpdate);
    socket.on("order:cancelled", handleRealtimeUpdate);
    socket.on("connect", () => {
      socket.emit("join:admin");
      loadDashboardOrders();
    });

    return () => {
      socket.off("order:new", handleRealtimeUpdate);
      socket.off("new_order", handleRealtimeUpdate);
      socket.off("order:confirmed", handleRealtimeUpdate);
      socket.off("order:status_changed", handleRealtimeUpdate);
      socket.off("order:expired", handleRealtimeUpdate);
      socket.off("order:cancelled", handleRealtimeUpdate);
    };
  }, []);

  const totalOrders = orders.length;

  // Authoritative rule: Revenue must be calculated ONLY from orders whose paymentStatus is actually "paid"
  const paidRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const activeOrders = orders.filter(
    (o) => o.orderStatus === "placed" || o.orderStatus === "preparing"
  );

  const completedOrders = orders.filter((o) => o.orderStatus === "completed");

  const awaitingOrders = orders.filter(
    (o) => o.orderStatus === "placed" && o.acceptanceDeadline && new Date(o.acceptanceDeadline) > new Date()
  );

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Real-time operational summary computed authoritatively from restaurant orders."
      />

      {/* Summary Grid */}
      <section className="summary-grid">
        <article className="summary-card">
          <p>Total Orders</p>
          <div className="summary-number">
            {loading ? "..." : totalOrders}
          </div>
          <div className="summary-note">All recorded customer orders</div>
        </article>

        <article className="summary-card">
          <p>Verified Paid Revenue</p>
          <div className="summary-number">
            {loading ? "..." : `₹${Math.round(paidRevenue).toLocaleString("en-IN")}`}
          </div>
          <div className="summary-note">Orders with paymentStatus &quot;paid&quot;</div>
        </article>

        <article className="summary-card">
          <p>Active Orders</p>
          <div className="summary-number">
            {loading ? "..." : activeOrders.length}
          </div>
          <div className={`summary-note ${activeOrders.length > 0 ? "warn" : "neutral"}`}>
            {activeOrders.length > 0 ? `${activeOrders.length} in kitchen queue` : "Kitchen queue clear"}
          </div>
        </article>

        <article className="summary-card">
          <p>Completed Orders</p>
          <div className="summary-number">
            {loading ? "..." : completedOrders.length}
          </div>
          <div className="summary-note neutral">Fulfilled orders</div>
        </article>
      </section>

      {/* Awaiting Confirmation / New Orders Section */}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #fee2e2", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🔔</span>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#991b1b", margin: 0 }}>
                  New Orders Awaiting Confirmation ({awaitingOrders.length})
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#7f1d1d" }}>
                  Confirm incoming orders before the 3-minute deadline expires.
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
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

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Orders */}
        <section className="surface">
          <div className="surface-heading">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest customer activity from online orders.</p>
            </div>
            <Link href="/dashboard/orders">See all</Link>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              Loading recent orders...
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="Incoming orders will appear here in real time."
              compact
            />
          ) : (
            <Table
              columns={["Order #", "Customer", "Amount", "Status", "Time", ""]}
              rows={orders.slice(0, 5)}
              renderRow={(order) => {
                const customerName =
                  order.customer?.name ||
                  `${order.deliveryAddress?.firstName || ""} ${order.deliveryAddress?.lastName || ""}`.trim() ||
                  "Customer";

                const itemsCount = Array.isArray(order.items)
                  ? `${order.items.length} item${order.items.length === 1 ? "" : "s"}`
                  : "";

                const timeStr = order.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
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
              <h2>Active Orders Queue</h2>
              <p>Dishes currently placed or preparing.</p>
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
                No active orders in preparation right now.
              </p>
            </div>
          ) : (
            <div className="booking-list">
              {activeOrders.slice(0, 5).map((order) => {
                const custName =
                  order.customer?.name ||
                  `${order.deliveryAddress?.firstName || ""} ${order.deliveryAddress?.lastName || ""}`.trim() ||
                  "Customer";

                const itemsList = Array.isArray(order.items)
                  ? order.items.map((it) => `${it.name} ×${it.quantity}`).join(", ")
                  : "Items";

                return (
                  <div className="booking-item" key={order._id}>
                    <span
                      className="booking-avatar"
                      style={{
                        background: order.orderStatus === "placed" ? "#FEF3C7" : "var(--forest-soft)",
                        color: order.orderStatus === "placed" ? "#B45309" : "var(--forest-deep)",
                      }}
                    >
                      {order.orderStatus === "placed" ? "NEW" : "PREP"}
                    </span>
                    <div>
                      <strong>{custName} — {order.orderNumber}</strong>
                      <small style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
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
    </>
  );
}