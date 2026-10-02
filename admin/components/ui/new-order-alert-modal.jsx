"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { updateAdminOrderStatus } from "@/lib/api/orders";
import { alertManager } from "@/lib/alert-manager";
import { useToast } from "@/components/ui";

export function AcceptanceTimer({ deadline }) {
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
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (secondsLeft <= 0) {
    return <span style={{ color: "#dc2626", fontWeight: 700 }}>Expired</span>;
  }

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#b91c1c", fontSize: "13px" }}>
      ⏱ {mins}:{secs} remaining
    </span>
  );
}

export function NewOrderAlertModal({ pendingOrders = [] }) {
  const [confirmingId, setConfirmingId] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const toast = useToast();

  if (!pendingOrders || pendingOrders.length === 0) {
    return null;
  }

  const handleConfirmOrder = async (orderId) => {
    setConfirmingId(orderId);
    alertManager.removePendingOrder(orderId);
    try {
      await updateAdminOrderStatus(orderId, { orderStatus: "confirmed" });
      toast("Order confirmed successfully!", "success");
    } catch (err) {
      toast(err.message || "Failed to confirm order", "danger");
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <aside
      aria-label="New Order Alert"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        width: "380px",
        maxWidth: "calc(100vw - 40px)",
        background: "#ffffff",
        border: "2px solid #b91c1c",
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(185, 28, 28, 0.25), 0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        animation: "slideInAlert 0.3s ease-out",
      }}
    >
      {/* Alert Header */}
      <div
        style={{
          background: "#b91c1c",
          color: "#ffffff",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>🔔</span>
          <strong style={{ fontSize: "13px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {pendingOrders.length === 1 ? "NEW ORDER RECEIVED" : `🔔 ${pendingOrders.length} NEW ORDERS`}
          </strong>
        </div>
        <button
          type="button"
          onClick={() => setMinimized((prev) => !prev)}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#ffffff",
            borderRadius: "4px",
            padding: "2px 8px",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {minimized ? "Expand ▲" : "Minimize ▼"}
        </button>
      </div>

      {!minimized && (
        <div
          style={{
            maxHeight: "360px",
            overflowY: "auto",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "#fff9f9",
          }}
        >
          {pendingOrders.map((ord) => {
            const id = ord.orderId || ord._id;
            const isConfirming = confirmingId === id;
            return (
              <div
                key={id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #fecdd3",
                  borderRadius: "8px",
                  padding: "12px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#1c1e1b" }}>
                      Order #{ord.orderNumber}
                    </strong>
                    {ord.customer?.name && (
                      <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "2px" }}>
                        Customer: <strong>{ord.customer.name}</strong>
                      </div>
                    )}
                  </div>
                  <strong style={{ fontSize: "15px", color: "#14532d" }}>
                    ₹{ord.total}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 8px",
                    background: "#fff1f2",
                    borderRadius: "4px",
                  }}
                >
                  <span style={{ fontSize: "11.5px", color: "#991b1b", fontWeight: 600 }}>
                    Waiting for confirmation
                  </span>
                  <AcceptanceTimer deadline={ord.acceptanceDeadline} />
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <Link
                    href={`/dashboard/orders/${id}`}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      background: "#f3f4f6",
                      color: "#1f2937",
                      border: "1px solid #d1d5db",
                      borderRadius: "5px",
                      padding: "7px 10px",
                      fontSize: "12px",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    VIEW ORDER
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleConfirmOrder(id)}
                    disabled={isConfirming}
                    style={{
                      flex: 1.2,
                      background: "#14532d",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "5px",
                      padding: "7px 10px",
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
      )}
    </aside>
  );
}
