"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  PageHeader,
  StatusBadge,
  Table,
  EmptyState,
  Button,
  Modal,
  useToast,
} from "@/components/ui";
import { getAdminPayments, initiateRefund } from "@/lib/api/payments";
import { connectAdminSocket } from "@/lib/socket";
import {
  DateFilterControl,
  FilterSelectControl,
  ActiveFilterChips,
  AdminPagination,
} from "@/components/ui/admin-filters";

export default function PaymentsPage() {
  const [result, setResult] = useState({
    records: [],
    attempts: [],
    summary: { totalPaid: 0, cashTotal: 0, onlineTotal: 0, count: 0 },
    total: 0,
    page: 1,
    limit: 50,
  });
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Selected payment for Details Modal
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Refund dialog state
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundAmountRupees, setRefundAmountRupees] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refunding, setRefunding] = useState(false);

  const toast = useToast();

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
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
      if (methodFilter !== "all") {
        params.paymentMethod = methodFilter;
        params.method = methodFilter;
      }

      const data = await getAdminPayments(params);
      setResult(
        data || {
          records: [],
          attempts: [],
          summary: { totalPaid: 0, cashTotal: 0, onlineTotal: 0, count: 0 },
          total: 0,
          page: 1,
          limit: pageSize,
        }
      );
    } catch (err) {
      toast(err?.message || "Failed to load payment records", "danger");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, datePreset, dateFrom, dateTo, methodFilter, toast]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Real-time synchronization for new/updated payments
  useEffect(() => {
    const socket = connectAdminSocket();
    if (!socket) return;

    socket.emit("join:admin");

    const handleRealtimePayment = () => {
      loadPayments();
    };

    socket.on("payment:success", handleRealtimePayment);
    socket.on("order:status_changed", handleRealtimePayment);
    socket.on("order:confirmed", handleRealtimePayment);
    socket.on("connect", () => {
      socket.emit("join:admin");
      loadPayments();
    });

    return () => {
      socket.off("payment:success", handleRealtimePayment);
      socket.off("order:status_changed", handleRealtimePayment);
      socket.off("order:confirmed", handleRealtimePayment);
    };
  }, [loadPayments]);

  const payments = useMemo(() => {
    return result.records || result.attempts || [];
  }, [result]);

  const summary = useMemo(() => {
    return (
      result.summary || {
        totalPaid: 0,
        cashTotal: 0,
        onlineTotal: 0,
        count: 0,
      }
    );
  }, [result.summary]);

  const totalPages = Math.ceil((result.total || 0) / pageSize) || 1;

  // Open Details Modal
  const handleOpenDetails = (payment) => {
    setSelectedPayment(payment);
    setShowRefundForm(false);
    setRefundAmountRupees(payment.amount ? String(payment.amount) : "");
    setRefundReason("");
  };

  // Submit refund
  const handleInitiateRefund = async (e) => {
    e.preventDefault();
    if (!selectedPayment?._id) return;

    const amountInRupees = parseFloat(refundAmountRupees);
    if (isNaN(amountInRupees) || amountInRupees <= 0) {
      toast("Please enter a valid refund amount", "danger");
      return;
    }

    const maxRupees = selectedPayment.amount;
    if (amountInRupees > maxRupees) {
      toast(`Refund amount cannot exceed original payment (₹${maxRupees.toFixed(2)})`, "danger");
      return;
    }

    const amountInPaise = Math.round(amountInRupees * 100);

    setRefunding(true);
    try {
      const updated = await initiateRefund(selectedPayment._id, amountInPaise);
      toast("Refund initiated successfully via Razorpay", "success");
      setSelectedPayment(updated || { ...selectedPayment, status: "refunded", refundAmount: amountInPaise });
      setShowRefundForm(false);
      loadPayments();
    } catch (err) {
      toast(err?.message || "Failed to process refund", "danger");
    } finally {
      setRefunding(false);
    }
  };

  const activeChips = [];
  if (searchQuery.trim()) {
    activeChips.push({
      id: "search",
      label: "Search",
      value: `"${searchQuery.trim()}"`,
      onRemove: () => {
        setSearchQuery("");
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
  if (methodFilter !== "all") {
    activeChips.push({
      id: "method",
      label: "Method",
      value: methodFilter === "cod" ? "Cash / COD" : "Online",
      onRemove: () => {
        setMethodFilter("all");
        setCurrentPage(1);
      },
    });
  }

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setDatePreset("");
    setDateFrom("");
    setDateTo("");
    setMethodFilter("all");
    setCurrentPage(1);
  };

  const getEmptyMessage = () => {
    if (datePreset === "today" && methodFilter === "cod") {
      return "No paid cash payments found for today.";
    }
    if (datePreset === "today" && methodFilter === "razorpay") {
      return "No paid online payments found for today.";
    }
    if (datePreset === "today") {
      return "No paid payments recorded for today.";
    }
    if (activeChips.length > 0) {
      return "No paid payments found for this filter combination.";
    }
    return "No paid payments found.";
  };

  return (
    <>
      <PageHeader
        title="Payments"
        description="Authoritative ledger of actual successful payments. Shows verified Cash/COD collections and Online payments."
      />

      {/* Authoritative Financial Summary Cards (MongoDB Aggregation) */}
      <section className="summary-grid" style={{ marginBottom: "20px" }}>
        <article className="summary-card">
          <p>Total Paid</p>
          <div className="summary-number" style={{ color: "var(--forest-dark, #11261B)" }}>
            {loading ? "..." : `₹${Math.round(summary.totalPaid).toLocaleString("en-IN")}`}
          </div>
          <div className="summary-note">
            {summary.count} paid transaction{summary.count === 1 ? "" : "s"} across selected filter
          </div>
        </article>

        <article className="summary-card">
          <p>Cash / COD</p>
          <div className="summary-number" style={{ color: "#b45309" }}>
            {loading ? "..." : `₹${Math.round(summary.cashTotal).toLocaleString("en-IN")}`}
          </div>
          <div className="summary-note">Collected and confirmed cash on delivery</div>
        </article>

        <article className="summary-card">
          <p>Online</p>
          <div className="summary-number" style={{ color: "#1d4ed8" }}>
            {loading ? "..." : `₹${Math.round(summary.onlineTotal).toLocaleString("en-IN")}`}
          </div>
          <div className="summary-note">Backend verified Razorpay transactions</div>
        </article>
      </section>

      {/* Prominent Filter Toolbar */}
      <div className="admin-filter-bar">
        <div className="filter-item-wrapper" style={{ flex: "1 1 240px", minWidth: "220px" }}>
          <span className="filter-item-label">Search Payments</span>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="search"
              placeholder="Search Order #, Customer, Rzp ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
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
          label="Payment Method"
          value={methodFilter}
          onChange={(e) => {
            setMethodFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "all", label: "All Payment Methods" },
            { value: "cod", label: "Cash / COD" },
            { value: "razorpay", label: "Online" },
          ]}
        />

        {/* Status Indicator (Authoritatively Paid Only) */}
        <div className="filter-item-wrapper" style={{ minWidth: "130px" }}>
          <span className="filter-item-label">Payment Scope</span>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "32px",
              padding: "0 10px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "5px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#166534",
            }}
          >
            <span>✓</span> Paid Only
          </div>
        </div>
      </div>

      <ActiveFilterChips chips={activeChips} onClearAll={handleClearAllFilters} />

      {/* Main Table Surface */}
      <section className="surface data-surface">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            Loading paid payments from backend...
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            title={getEmptyMessage()}
            description={
              activeChips.length > 0
                ? "Try adjusting your date range, payment method, or search query."
                : "Paid payments will appear here as cash orders are collected or online payments are completed."
            }
          />
        ) : (
          <Table
            columns={[
              "Payment / Transaction ID",
              "Order #",
              "Customer",
              "Payment Method",
              "Amount",
              "Paid At",
              "Status",
              "Actions",
            ]}
            rows={payments}
            renderRow={(payment) => {
              const customerName = payment.customer?.name || "Customer";
              const orderNumber = payment.orderNumber || payment.order?.orderNumber || "—";
              const orderId = payment.orderId || payment.order?._id || payment.order;
              const isOnline = payment.paymentMethod === "razorpay";
              const amountRupees = Number(payment.amount || 0).toFixed(2);

              const formattedDate = payment.paidAt || payment.createdAt
                ? new Date(payment.paidAt || payment.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "—";

              return (
                <tr key={payment._id}>
                  <td>
                    <code style={{ fontSize: "11.5px", fontWeight: 600 }}>
                      {payment.transactionId || payment.razorpayPaymentId || "—"}
                    </code>
                    {payment.razorpayOrderId && (
                      <small className="muted" style={{ display: "block", fontSize: "10.5px" }}>
                        Rzp Order: {payment.razorpayOrderId}
                      </small>
                    )}
                  </td>
                  <td>
                    <strong>{orderNumber}</strong>
                    {payment.refundId && (
                      <small className="muted" style={{ display: "block", fontSize: "10px", color: "var(--purple, #7c3aed)" }}>
                        Refund: {payment.refundId}
                      </small>
                    )}
                  </td>
                  <td>
                    <strong>{customerName}</strong>
                    {payment.customer?.phone && (
                      <small className="muted" style={{ display: "block", fontSize: "11px" }}>
                        {payment.customer.phone}
                      </small>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: 700,
                        fontSize: "11px",
                        letterSpacing: "0.4px",
                        background: isOnline ? "#eff6ff" : "#fef3c7",
                        color: isOnline ? "#1e40af" : "#92400e",
                        border: isOnline ? "1px solid #bfdbfe" : "1px solid #fde68a",
                      }}
                    >
                      {isOnline ? "Online" : "Cash / COD"}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: "13.5px", color: "var(--forest-dark, #11261B)" }}>
                      ₹{amountRupees}
                    </strong>
                    {payment.refundAmount && (
                      <small className="muted" style={{ display: "block", fontSize: "10px", color: "var(--purple, #7c3aed)" }}>
                        Refunded: ₹{(payment.refundAmount / 100).toFixed(2)}
                      </small>
                    )}
                  </td>
                  <td className="muted" style={{ fontSize: "11.5px" }}>
                    {formattedDate}
                  </td>
                  <td>
                    <StatusBadge tone="paid">
                      Paid
                    </StatusBadge>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <button
                        type="button"
                        className="row-action"
                        onClick={() => handleOpenDetails(payment)}
                        style={{ cursor: "pointer" }}
                      >
                        Details
                      </button>
                      {orderId && (
                        <Link className="row-action" href={`/dashboard/orders/${orderId}`}>
                          Order
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            }}
          />
        )}

        <AdminPagination
          page={currentPage}
          total={result.total}
          limit={pageSize}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </section>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <Modal
          title="Paid Transaction Details"
          onClose={() => {
            setSelectedPayment(null);
            setShowRefundForm(false);
          }}
        >
          <div className="form-stack" style={{ gap: "14px" }}>
            {/* Header info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                padding: "12px",
                background: "var(--bg-subtle, #faf8f5)",
                borderRadius: "8px",
                border: "1px solid var(--line-soft)",
              }}
            >
              <div>
                <span className="detail-label" style={{ fontSize: "11px", color: "var(--muted)" }}>
                  Restaurant Order
                </span>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "13px" }}>
                  {selectedPayment.orderNumber || selectedPayment.order?.orderNumber || "—"}
                </p>
                {(selectedPayment.orderId || selectedPayment.order?._id) && (
                  <Link
                    href={`/dashboard/orders/${selectedPayment.orderId || selectedPayment.order?._id}`}
                    style={{ fontSize: "11px", color: "var(--forest-mid)", textDecoration: "underline" }}
                  >
                    Open Order Details →
                  </Link>
                )}
              </div>
              <div>
                <span className="detail-label" style={{ fontSize: "11px", color: "var(--muted)" }}>
                  Status
                </span>
                <div>
                  <StatusBadge tone="paid">
                    Paid
                  </StatusBadge>
                </div>
              </div>
            </div>

            {/* Technical Identifiers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
              <div className="delivery-field">
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>Transaction Reference</span>
                <code style={{ fontSize: "12px" }}>
                  {selectedPayment.transactionId || selectedPayment.razorpayPaymentId || `COD-${selectedPayment.orderNumber}`}
                </code>
              </div>
              {selectedPayment.razorpayOrderId && (
                <div className="delivery-field">
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Razorpay Order ID</span>
                  <code style={{ fontSize: "12px" }}>{selectedPayment.razorpayOrderId}</code>
                </div>
              )}
            </div>

            {/* Customer & Amount */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                borderTop: "1px solid var(--line-soft)",
                paddingTop: "12px",
              }}
            >
              <div>
                <span className="detail-label" style={{ fontSize: "11px", color: "var(--muted)" }}>
                  Customer
                </span>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "12.5px" }}>
                  {selectedPayment.customer?.name || "Customer"}
                </p>
                <small className="muted" style={{ display: "block", fontSize: "11px" }}>
                  {selectedPayment.customer?.email || ""}
                </small>
                <small className="muted" style={{ display: "block", fontSize: "11px" }}>
                  {selectedPayment.customer?.phone || ""}
                </small>
              </div>

              <div>
                <span className="detail-label" style={{ fontSize: "11px", color: "var(--muted)" }}>
                  Paid Amount
                </span>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "16px", color: "var(--forest-dark)" }}>
                  ₹{Number(selectedPayment.amount || 0).toFixed(2)}
                </p>
                <small className="muted" style={{ display: "block", fontSize: "11px", textTransform: "uppercase" }}>
                  Method: {selectedPayment.methodDisplay || (selectedPayment.paymentMethod === "razorpay" ? "Online" : "Cash / COD")}
                </small>
              </div>
            </div>

            {/* Timestamps */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
                fontSize: "11.5px",
                color: "var(--muted)",
                borderTop: "1px solid var(--line-soft)",
                paddingTop: "10px",
              }}
            >
              <div>
                <span>Order Placed: </span>
                <strong>
                  {selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleString("en-IN") : "—"}
                </strong>
              </div>
              <div>
                <span>Paid At: </span>
                <strong>
                  {selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleString("en-IN") : "—"}
                </strong>
              </div>
            </div>

            {/* Refund Information if Razorpay online */}
            {selectedPayment.refundId ? (
              <div
                style={{
                  padding: "12px",
                  background: "#f5f3ff",
                  border: "1px solid #ddd6fe",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              >
                <strong style={{ color: "#6d28d9", display: "block", marginBottom: "4px" }}>
                  Refund Information
                </strong>
                <div>Refund ID: <code>{selectedPayment.refundId}</code></div>
                <div>
                  Refunded Amount: <strong>₹{selectedPayment.refundAmount ? (selectedPayment.refundAmount / 100).toFixed(2) : "0.00"}</strong>
                </div>
                <div>Status: <span style={{ textTransform: "capitalize" }}>{selectedPayment.refundStatus || "processed"}</span></div>
              </div>
            ) : selectedPayment.paymentMethod === "razorpay" && selectedPayment.razorpayPaymentId ? (
              <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: "12px" }}>
                {!showRefundForm ? (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setShowRefundForm(true)}
                    style={{ width: "100%", justifyContent: "center", color: "var(--danger, #dc2626)" }}
                  >
                    Initiate Refund via Razorpay
                  </Button>
                ) : (
                  <form onSubmit={handleInitiateRefund} className="form-stack" style={{ gap: "10px" }}>
                    <h4 style={{ margin: 0, fontSize: "12.5px", color: "var(--danger, #dc2626)" }}>
                      Confirm Razorpay Refund
                    </h4>
                    <label className="form-field">
                      <span>Refund Amount (₹)</span>
                      <input
                        type="number"
                        step="0.01"
                        max={selectedPayment.amount}
                        min="1"
                        value={refundAmountRupees}
                        onChange={(e) => setRefundAmountRupees(e.target.value)}
                        required
                        disabled={refunding}
                      />
                    </label>
                    <label className="form-field">
                      <span>Reason (Optional)</span>
                      <input
                        type="text"
                        placeholder="e.g. Customer requested cancellation"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        disabled={refunding}
                      />
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => setShowRefundForm(false)}
                        disabled={refunding}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={refunding}>
                        {refunding ? "Processing Refund..." : "Confirm Refund"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            ) : null}

            {/* Modal Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <Button variant="secondary" onClick={() => setSelectedPayment(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}