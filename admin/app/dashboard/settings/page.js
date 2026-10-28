"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader, useToast } from "@/components/ui";
import {
  getAdminSettings,
  updateAdminSettings,
  toggleShopStatus,
  toggleOverOrder,
} from "@/lib/api/settings";
import {
  isPushNotificationSupported,
  getPushPermissionState,
  getAdminPushSubscription,
  subscribeAdminPush,
  unsubscribeAdminPush,
  sendTestPushAlert,
  playNotificationChime,
} from "@/lib/push-notifications";

function InfoRow({ label, value, note }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <div>
        <span className="info-val">{value}</span>
        {note && <p style={{ color: "var(--muted)", fontSize: "11px", marginTop: 2 }}>{note}</p>}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Shop Timings Form & Edit State
  const [openingTime, setOpeningTime] = useState("10:00");
  const [closingTime, setClosingTime] = useState("22:30");
  const [savedOpeningTime, setSavedOpeningTime] = useState("10:00");
  const [savedClosingTime, setSavedClosingTime] = useState("22:30");
  const [isEditingTimings, setIsEditingTimings] = useState(false);
  const [timingsLoading, setTimingsLoading] = useState(false);

  // Over Order Modal State
  const [showOverOrderModal, setShowOverOrderModal] = useState(false);
  const [overOrderType, setOverOrderType] = useState("30");
  const [customMinutes, setCustomMinutes] = useState(45);

  // Push notification state
  const [pushStatus, setPushStatus] = useState("checking");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  const toast = useToast();

  const loadSettings = useCallback(async () => {
    try {
      const data = await getAdminSettings();
      setSettings(data);
      if (data.openingTime) {
        setOpeningTime(data.openingTime);
        setSavedOpeningTime(data.openingTime);
      }
      if (data.closingTime) {
        setClosingTime(data.closingTime);
        setSavedClosingTime(data.closingTime);
      }
    } catch (err) {
      toast(err.message || "Failed to load settings", "danger");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSettings();

    if (!isPushNotificationSupported()) {
      setPushStatus("unsupported");
      return;
    }
    const perm = getPushPermissionState();
    setPushStatus(perm);

    getAdminPushSubscription()
      .then((sub) => {
        setIsSubscribed(!!sub);
      })
      .catch(() => { });
  }, [loadSettings]);

  // Shop Open / Close Toggle Handler
  const handleToggleShop = async () => {
    if (!settings) return;
    const nextState = !settings.isOpen;
    setActionLoading(true);
    try {
      const updated = await toggleShopStatus(nextState);
      setSettings((prev) => ({ ...prev, ...updated }));
      toast(
        nextState
          ? "Shop is now OPEN. Customers can place orders."
          : "Shop is now CLOSED. Ordering and checkout are blocked.",
        nextState ? "success" : "warn"
      );
    } catch (err) {
      toast(err.message || "Failed to toggle shop status", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  // Over Order Toggle Handler
  const handleToggleOverOrder = async () => {
    if (!settings) return;
    const isCurrentlyActive = settings.overOrder?.isActive;

    if (isCurrentlyActive) {
      setActionLoading(true);
      try {
        const updated = await toggleOverOrder(false);
        setSettings((prev) => ({ ...prev, ...updated }));
        toast("Over Order mode deactivated. Normal ordering restored.", "success");
      } catch (err) {
        toast(err.message || "Failed to deactivate over order mode", "danger");
      } finally {
        setActionLoading(false);
      }
    } else {
      setShowOverOrderModal(true);
    }
  };

  const handleApplyOverOrder = async () => {
    const mins = overOrderType === "30" ? 30 : Math.max(1, Number(customMinutes) || 30);
    setActionLoading(true);
    try {
      const updated = await toggleOverOrder(true, mins);
      setSettings((prev) => ({ ...prev, ...updated }));
      setShowOverOrderModal(false);
      toast(`Over Order mode activated for ${mins} minutes.`, "warn");
    } catch (err) {
      toast(err.message || "Failed to activate over order mode", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  // Save Shop Timings
  const handleSaveTimings = async (e) => {
    e.preventDefault();
    setTimingsLoading(true);
    try {
      const updated = await updateAdminSettings({
        openingTime,
        closingTime,
      });
      setSettings((prev) => ({ ...prev, ...updated }));
      setSavedOpeningTime(openingTime);
      setSavedClosingTime(closingTime);
      setIsEditingTimings(false);
      toast("Shop opening and closing hours updated successfully!", "success");
    } catch (err) {
      toast(err.message || "Failed to update timings", "danger");
    } finally {
      setTimingsLoading(false);
    }
  };

  const handleCancelTimingsEdit = () => {
    setOpeningTime(savedOpeningTime);
    setClosingTime(savedClosingTime);
    setIsEditingTimings(false);
  };

  const timingsChanged =
    openingTime !== savedOpeningTime || closingTime !== savedClosingTime;

  // Push alert controls
  const handleEnablePush = async () => {
    setPushLoading(true);
    try {
      await subscribeAdminPush();
      setIsSubscribed(true);
      setPushStatus("granted");
      playNotificationChime();
      toast("Push alerts enabled on this device!", "success");
    } catch (err) {
      toast(err.message || "Failed to enable notifications", "danger");
      setPushStatus(getPushPermissionState());
    } finally {
      setPushLoading(false);
    }
  };

  const handleDisablePush = async () => {
    setPushLoading(true);
    try {
      await unsubscribeAdminPush();
      setIsSubscribed(false);
      toast("Push alerts disabled on this device", "neutral");
    } catch (err) {
      toast(err.message || "Failed to disable notifications", "danger");
    } finally {
      setPushLoading(false);
    }
  };

  const handleTestAlert = async () => {
    try {
      playNotificationChime();
      await sendTestPushAlert();
      toast("Test sound played and alert sent!", "success");
    } catch (err) {
      toast(err.message || "Failed to send test alert", "danger");
    }
  };

  const isShopOpen = settings ? settings.isOpen : true;
  const isOverOrderActive = settings?.overOrder?.isActive;

  return (
    <>
      <PageHeader
        title="Settings"
      />

      <div className="form-layout">
        <div className="form-stack">
          {/* ── 1. Shop Availability & Live Controls ── */}
          <section className="surface form-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, border: 0, padding: 0 }}>Shop Status &amp; Availability</h2>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: isShopOpen ? "#16a34a" : "#dc2626",
                  backgroundColor: isShopOpen ? "#f0fdf4" : "#fef2f2",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  border: isShopOpen ? "1px solid #bbf7d0" : "1px solid #fecaca",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: isShopOpen ? "#16a34a" : "#dc2626",
                  }}
                />
                {isShopOpen ? "Shop Open" : "Shop Closed"}
              </span>
            </div>

            <InfoRow
              label="Ordering Status"
              value={
                isShopOpen
                  ? "Accepting new customer orders"
                  : "Closed — Checkout and new order placement blocked"
              }
              note={
                settings?.isManuallyClosed
                  ? "Manually closed by administrator override"
                  : ""
              }
            />

            {isOverOrderActive && (
              <InfoRow
                label="Over Order Mode"
                value={`ACTIVE — Paused for ${settings.overOrder.remainingMinutes} more minutes`}
                note="Customers cannot place new orders until this timer expires or is cancelled."
              />
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
              {/* Open / Close Button */}
              <button
                type="button"
                onClick={handleToggleShop}
                disabled={actionLoading || loading}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  border: "none",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  backgroundColor: isShopOpen ? "#dc2626" : "#16a34a",
                  color: "#ffffff",
                }}
              >
                {actionLoading ? "Updating..." : isShopOpen ? "Close Shop" : "Open Shop"}
              </button>

              {/* Over Order Button */}
              <button
                type="button"
                onClick={handleToggleOverOrder}
                disabled={actionLoading || loading}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  border: isOverOrderActive ? "1px solid #dc2626" : "1px solid #d97706",
                  backgroundColor: isOverOrderActive ? "#fee2e2" : "#fef3c7",
                  color: isOverOrderActive ? "#991b1b" : "#92400e",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                }}
              >
                {isOverOrderActive ? "Deactivate Over Order" : "Over Order"}
              </button>
            </div>
          </section>

          {/* ── 2. Shop Timings Management (Edit -> Save Pattern) ── */}
          <section className="surface form-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ margin: 0, border: 0, padding: 0 }}>Shop Timings (Opening &amp; Closing)</h2>
              {!isEditingTimings && (
                <button
                  type="button"
                  onClick={() => setIsEditingTimings(true)}
                  className="button button-secondary"
                  style={{ fontSize: "12px", padding: "6px 14px", fontWeight: 700 }}
                >
                  Edit Timings
                </button>
              )}
            </div>

            <form onSubmit={handleSaveTimings}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    disabled={!isEditingTimings}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: isEditingTimings ? "2px solid #1B3B2B" : "1px solid var(--border)",
                      backgroundColor: isEditingTimings ? "#ffffff" : "#f9fafb",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: isEditingTimings ? "text" : "not-allowed",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    disabled={!isEditingTimings}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: isEditingTimings ? "2px solid #1B3B2B" : "1px solid var(--border)",
                      backgroundColor: isEditingTimings ? "#ffffff" : "#f9fafb",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: isEditingTimings ? "text" : "not-allowed",
                    }}
                  />
                </div>
              </div>

              {settings?.displayTimings && (
                <div
                  style={{
                    background: "#f0fdf4",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #bbf7d0",
                    marginBottom: "16px",
                    fontSize: "12px",
                    color: "#166534",
                  }}
                >
                  Current Live Schedule: <strong>{settings.displayTimings} (IST)</strong>
                </div>
              )}

              {/* Action Buttons for Timings */}
              {isEditingTimings ? (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    type="submit"
                    disabled={timingsLoading || !timingsChanged}
                    className="button button-primary"
                    style={{
                      fontSize: "12.5px",
                      padding: "8px 18px",
                      opacity: timingsChanged ? 1 : 0.6,
                      cursor: timingsChanged ? "pointer" : "not-allowed",
                    }}
                  >
                    {timingsLoading ? "Saving..." : "Save Shop Timings"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelTimingsEdit}
                    disabled={timingsLoading}
                    className="button button-secondary"
                    style={{ fontSize: "12.5px", padding: "8px 16px" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: "11.5px", color: "var(--muted)", margin: 0 }}>
                  Click <strong>&quot;Edit Timings&quot;</strong> above to change operational hours.
                </p>
              )}
            </form>
          </section>
        </div>

        <div className="form-stack">
          {/* ── 3. Order & Delivery Policies ── */}
          <section className="surface form-panel">
            <h2>Order &amp; Delivery Policies</h2>
            <InfoRow
              label="Minimum Order Policy"
              value="₹100"
            />
            <InfoRow
              label="Delivery Rates"
              value="Tier 1 (0–3 KM): ₹15  ·  Tier 2 (3–7 KM): ₹30"
            />
            <InfoRow
              label="Delivery Radius"
              value="Up to 7.0 KM"
            />
          </section>

          {/* ── 4. Push Notifications Panel ── */}
          <section className="surface form-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ margin: 0, border: 0, padding: 0 }}>Order Sound &amp; Push Alerts</h2>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: isSubscribed ? "#16a34a" : "var(--muted)",
                }}
              >
                {isSubscribed ? "Active on this Device" : "Disabled"}
              </span>
            </div>

            <InfoRow
              label="Incoming Alerts"
              value="New Order &amp; Successful Payment Notifications"
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
              {isSubscribed ? (
                <>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={handleTestAlert}
                    disabled={pushLoading}
                    style={{ fontSize: "11.5px", padding: "6px 14px" }}
                  >
                    Test Sound
                  </button>
                  <button
                    type="button"
                    className="button button-quiet"
                    onClick={handleDisablePush}
                    disabled={pushLoading}
                    style={{ fontSize: "11.5px", padding: "6px 14px", color: "#C0392B" }}
                  >
                    Disable on this device
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleEnablePush}
                  disabled={pushLoading || pushStatus === "unsupported"}
                  style={{ fontSize: "11.5px", padding: "6px 16px" }}
                >
                  {pushLoading ? "Enabling..." : "Enable Order Sound Alerts"}
                </button>
              )}
            </div>

            {pushStatus === "denied" && (
              <p style={{ color: "#C0392B", fontSize: "11.5px", marginTop: "10px" }}>
                Notifications are blocked for this site. Click the lock/settings icon in your browser address bar and set Notifications to &quot;Allow&quot;.
              </p>
            )}
          </section>
        </div>
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
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "17px", fontWeight: 700, color: "var(--ink)" }}>
              Activate Over Order Mode
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
              Temporarily stops new orders from being placed. Normal ordering resumes automatically when the timer expires.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: overOrderType === "30" ? "2px solid #b45309" : "1px solid var(--border)",
                  background: overOrderType === "30" ? "#fffbeb" : "#ffffff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="overOrderDuration"
                  value="30"
                  checked={overOrderType === "30"}
                  onChange={() => setOverOrderType("30")}
                />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>
                  Pause for 30 minutes
                </span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: overOrderType === "custom" ? "2px solid #b45309" : "1px solid var(--border)",
                  background: overOrderType === "custom" ? "#fffbeb" : "#ffffff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="overOrderDuration"
                  value="custom"
                  checked={overOrderType === "custom"}
                  onChange={() => setOverOrderType("custom")}
                />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>
                  Custom duration (minutes)
                </span>
              </label>

              {overOrderType === "custom" && (
                <div style={{ marginTop: "4px", paddingLeft: "26px" }}>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value, 10) || 5))}
                    style={{
                      width: "120px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      fontSize: "13px",
                    }}
                  />
                  <span style={{ marginLeft: "8px", fontSize: "12px", color: "var(--muted)" }}>
                    minutes (5–180)
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShowOverOrderModal(false)}
                disabled={actionLoading}
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
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  backgroundColor: "#d97706",
                  color: "#ffffff",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                }}
              >
                {actionLoading ? "Activating..." : "Activate Over Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}