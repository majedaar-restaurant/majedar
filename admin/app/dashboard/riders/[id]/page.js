"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, StatusBadge, useToast } from "@/components/ui";
import {
  getAdminRiderById,
  getAdminRiderHistory,
} from "@/lib/api/riders";

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function RiderHistoryPage({ params: paramsPromise }) {
  const { id } = use(paramsPromise);
  const [rider, setRider] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const [riderData, history] = await Promise.all([
        getAdminRiderById(id),
        getAdminRiderHistory(id),
      ]);
      setRider(riderData);
      setOrders(history);
    } catch (error) {
      toast(error.message || "Failed to load rider delivery history", "danger");
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    const records = orders.flatMap((order) => {
      const currentEvents = (order.statusHistory || [])
        .filter((entry) => entry.domain === "rider"
          && entry.actor?.toString() === id
          && ["delivered", "failed", "rejected"].includes(entry.status))
        .map((entry) => ({ ...entry, order }));
      if (currentEvents.length) return currentEvents;
      return (order.riderDeliveryHistory || [])
        .filter((entry) => entry.rider?.toString() === id)
        .map((entry) => ({ ...entry, order }));
    });
    const collections = orders.flatMap((order) => (order.codCollections || [])
      .filter((entry) => entry.rider?.toString() === id)
      .map((entry) => ({ ...entry, order })));
    return {
      completed: records.filter((entry) => entry.status === "delivered").length,
      failed: records.filter((entry) => entry.status === "failed").length,
      rejected: records.filter((entry) => entry.status === "rejected").length,
      collected: collections.reduce((sum, entry) => sum + entry.amount, 0),
      unreconciled: collections.filter((entry) => !entry.verifiedAt).reduce((sum, entry) => sum + entry.amount, 0),
    };
  }, [orders, id]);

  if (loading) return <div style={{ padding: 48, textAlign: "center" }}>Loading rider history…</div>;
  if (!rider) {
    return (
      <section className="surface" style={{ padding: 24 }}>
        <p>Rider not found.</p>
        <Link href="/dashboard/riders">Back to riders</Link>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={rider.email || rider.phone}
        title={`${rider.name} · Overview`}
        description={`Account ${rider.isActive ? "active" : "inactive"} · Availability ${rider.availability || "available"}`}
        action={<Link className="button button-secondary" href="/dashboard/riders">Back to riders</Link>}
      />
      <section className="dashboard-grid" style={{ marginBottom: 20 }}>
        {[
          ["Delivered", stats.completed],
          ["Failed", stats.failed],
          ["Rejected", stats.rejected],
          ["COD recorded", money(stats.collected)],
          ["COD pending reconciliation", money(stats.unreconciled)],
        ].map(([label, value]) => (
          <article className="surface" key={label} style={{ padding: 16 }}>
            <p className="muted" style={{ margin: 0, fontSize: 11, textTransform: "uppercase" }}>{label}</p>
            <strong style={{ display: "block", marginTop: 6, fontSize: 20 }}>{value}</strong>
          </article>
        ))}
      </section>

      <section className="surface" style={{ padding: 18 }}>
        <h2 className="detail-section-title">Delivery orders</h2>
        {orders.length === 0 ? <p className="muted">No delivery history recorded.</p> : (
          <div style={{ display: "grid", gap: 12 }}>
            {orders.map((order) => {
              const collections = (order.codCollections || []).filter((entry) => entry.rider?.toString() === id);
              return (
                <article key={order._id} style={{ border: "1px solid var(--line-soft)", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <Link href={`/dashboard/orders/${order._id}`} style={{ fontWeight: 700, color: "var(--forest-deep)" }}>
                      Order {order.orderNumber}
                    </Link>
                    <StatusBadge tone={order.riderStatus === "delivered" ? "paid" : order.riderStatus === "failed" ? "cancelled" : "neutral"}>
                      {order.riderStatus || "assigned"}
                    </StatusBadge>
                  </div>
                  <p className="muted" style={{ fontSize: 11 }}>
                    Customer: {order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName} · Order total {money(order.total)}
                  </p>
                  {collections.length > 0 && (
                    <p className="muted" style={{ margin: 0, fontSize: 12 }}>
                      COD collected: {collections.map((entry) => `${money(entry.amount)} ${entry.method?.toUpperCase()}`).join(" · ")}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
