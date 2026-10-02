"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Logo from "./logo";
import {
  isPushNotificationSupported,
  getPushPermissionState,
  getAdminPushSubscription,
  subscribeAdminPush,
  sendTestPushAlert,
  playNotificationChime,
} from "@/lib/push-notifications";
import { connectAdminSocket, disconnectAdminSocket } from "@/lib/socket";
import { alertManager } from "@/lib/alert-manager";
import { NewOrderAlertModal } from "@/components/ui/new-order-alert-modal";

export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: "orders",
  },
  {
    label: "Riders",
    href: "/dashboard/riders",
    icon: "riders",
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: "payments",
  },
  {
    label: "Menu",
    href: "/dashboard/menu",
    icon: "menu",
    children: [
      { label: "All Items", href: "/dashboard/menu" },
      { label: "Add Item", href: "/dashboard/menu/add" },
      { label: "Categories", href: "/dashboard/categories" },
    ],
  },
  {
    label: "Delivery Zones",
    href: "/dashboard/delivery-zones",
    icon: "delivery",
  },
  {
    label: "Reviews",
    href: "/dashboard/reviews",
    icon: "reviews",
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: "customers",
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: "mail",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
];

// ── SVG Icons ────────────────────────────────────────────────────────────────
function Icon({ name, size = 16 }) {
  const paths = {
    dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    orders: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    riders: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16h2m-6 0h2m-2-5h5l2 4H7l2-4zm3-4a2 2 0 11-4 0 2 2 0 014 0z",
    payments: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    menu: "M4 6h16M4 10h16M4 14h16M4 18h16",
    delivery: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
    reviews: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    customers: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    chevron: "M9 5l7 7-7 7",
    close: "M6 18L18 6M6 6l12 12",
    menu_open: "M4 6h16M4 12h16M4 18h16",
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

// ── Breadcrumb label from pathname ────────────────────────────────────────────
function breadcrumbLabel(pathname) {
  if (pathname === "/dashboard") return "Dashboard";
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  if (!last || last === "dashboard") return "Dashboard";
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────
function SidebarNav({ pathname, onClose, unreadCount, pendingOrdersCount = 0 }) {
  return (
    <nav className="side-nav" aria-label="Main navigation">
      <p className="nav-label">Workspace</p>
      {navItems.map((item) => {
        const isParentActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const showChildren = item.children && isParentActive;
        const badge =
          item.label === "Messages" && unreadCount > 0
            ? unreadCount
            : item.label === "Orders" && pendingOrdersCount > 0
              ? `🔴 ${pendingOrdersCount}`
              : item.badge;

        return (
          <div key={item.label}>
            <Link
              href={item.href}
              className={`nav-link ${isParentActive ? "active" : ""}`}
              onClick={onClose}
            >
              <span className="nav-icon">
                <Icon name={item.icon} size={15} />
              </span>
              <span>{item.label}</span>
              {badge ? (
                <span className="nav-badge">{badge}</span>
              ) : null}
            </Link>
            {showChildren && (
              <div className="sub-nav">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={pathname === child.href ? "sub-active" : ""}
                    onClick={onClose}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ── Main shell ────────────────────────────────────────────────────────────────
export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { admin, logout } = useAuth();

  // Push notifications state
  const [pushStatus, setPushStatus] = useState("checking");
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [subscribingPush, setSubscribingPush] = useState(false);

  // Audio alert state managed by alertManager
  const [alertState, setAlertState] = useState(() => alertManager.getState());

  useEffect(() => {
    return alertManager.subscribe(setAlertState);
  }, []);

  const closeDrawer = () => setDrawerOpen(false);

  // Check and setup Web Push subscription state + SW message listener
  useEffect(() => {
    if (!isPushNotificationSupported()) {
      setPushStatus("unsupported");
      return;
    }

    const perm = getPushPermissionState();
    setPushStatus(perm);

    getAdminPushSubscription()
      .then((sub) => {
        setPushSubscribed(!!sub);
      })
      .catch(() => { });

    const handleSwMessage = (event) => {
      if (event.data?.type === "PUSH_NOTIFICATION") {
        playNotificationChime();
      }
    };

    if (typeof navigator !== "undefined" && navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", handleSwMessage);
    }

    return () => {
      if (typeof navigator !== "undefined" && navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener("message", handleSwMessage);
      }
    };
  }, []);

  // Persistent Admin Socket.IO connection for real-time notifications & continuous audio alerts
  useEffect(() => {
    if (!admin) return;

    const socket = connectAdminSocket();
    if (!socket) return;

    socket.emit("join:admin");

    const handleNewOrder = (payload) => {
      alertManager.addPendingOrder(payload);
    };

    const handleConfirmed = (payload) => {
      alertManager.removePendingOrder(payload?.orderId);
    };

    const handleExpired = (payload) => {
      alertManager.removePendingOrder(payload?.orderId);
    };

    const handleStatusChanged = (payload) => {
      if (payload?.orderStatus !== "placed") {
        alertManager.removePendingOrder(payload?.orderId);
      }
    };

    const handleCancelled = (payload) => {
      alertManager.removePendingOrder(payload?.orderId);
    };

    const handlePaymentSuccess = () => {
      playNotificationChime();
    };

    socket.on("order:new", handleNewOrder);
    socket.on("new_order", handleNewOrder);
    socket.on("order:confirmed", handleConfirmed);
    socket.on("order:expired", handleExpired);
    socket.on("order:cancelled", handleCancelled);
    socket.on("order:status_changed", handleStatusChanged);
    socket.on("payment:success", handlePaymentSuccess);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("new_order", handleNewOrder);
      socket.off("order:confirmed", handleConfirmed);
      socket.off("order:expired", handleExpired);
      socket.off("order:cancelled", handleCancelled);
      socket.off("order:status_changed", handleStatusChanged);
      socket.off("payment:success", handlePaymentSuccess);
    };
  }, [admin]);

  // Sync existing placed orders on login to resume alerts if any unconfirmed orders remain
  useEffect(() => {
    if (!admin) return;
    const syncExistingPlacedOrders = async () => {
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
        const endpoint = apiBase.endsWith("/api")
          ? `${apiBase}/admin/orders?orderStatus=placed`
          : `${apiBase}/api/admin/orders?orderStatus=placed`;
        const res = await fetch(endpoint, {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            alertManager.syncPendingOrders(json.data);
          }
        }
      } catch (_) { }
    };
    syncExistingPlacedOrders();
  }, [admin]);

  const handleTogglePush = async () => {
    if (pushStatus === "denied") {
      alert(
        "Browser notifications are blocked in your site settings. Please allow notifications in your browser address bar/settings to receive order & payment alerts."
      );
      return;
    }

    setSubscribingPush(true);
    try {
      await subscribeAdminPush();
      setPushStatus("granted");
      setPushSubscribed(true);
      playNotificationChime();
    } catch (err) {
      alert(err.message || "Failed to enable push notifications");
      setPushStatus(getPushPermissionState());
    } finally {
      setSubscribingPush(false);
    }
  };

  // Poll for unread customer messages count
  useEffect(() => {
    let isMounted = true;
    async function loadUnreadCount() {
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
        const endpoint = apiBase.endsWith("/api")
          ? `${apiBase}/admin/messages/unread-count`
          : `${apiBase}/api/admin/messages/unread-count`;
        const res = await fetch(endpoint, {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && typeof json.data?.count === "number") {
            setUnreadCount(json.data.count);
          }
        }
      } catch {
        // silent fallback
      }
    }

    loadUnreadCount();
    const timer = setInterval(loadUnreadCount, 20000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [pathname]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initials = admin?.name
    ? admin.name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "AD";

  const adminName = admin?.name || "Administrator";
  const adminRole = admin?.role === "admin" ? "Super Admin" : "Administrator";

  return (
    <div className="admin-frame">
      {/* Sidebar */}
      <aside className={`sidebar ${drawerOpen ? "sidebar-open" : ""}`}>
        {/* Brand */}
        <div className="brand-block">
          <Link href="/dashboard" className="brand-mark" onClick={closeDrawer} style={{ alignItems: "center" }}>
            <Logo variant="mark" alt="Majedaar Emblem" style={{ height: 28, width: "auto" }} />
            <span>
              <strong>Majedaar</strong>
              <small>Restaurant Office</small>
            </span>
          </Link>
          <button
            className="drawer-close"
            aria-label="Close menu"
            onClick={closeDrawer}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Nav */}
        <SidebarNav pathname={pathname} onClose={closeDrawer} unreadCount={unreadCount} pendingOrdersCount={alertState.pendingCount} />

        {/* Footer */}
        <div className="sidebar-footer">
          <Link href="/dashboard/profile" className="profile-mini" onClick={closeDrawer}>
            <span className="avatar avatar-small">{initials}</span>
            <span>
              <strong>{adminName}</strong>
              <small>{adminRole}</small>
            </span>
            <span className="chevron">
              <Icon name="chevron" size={13} />
            </span>
          </Link>
          <button className="logout-link" type="button" onClick={logout}>
            <Icon name="logout" size={15} />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {drawerOpen && (
        <button
          className="drawer-backdrop"
          aria-label="Close navigation"
          onClick={closeDrawer}
        />
      )}

      {/* Main column */}
      <div className="main-column">
        {/* Top header */}
        <header className="top-header">
          <button
            className="menu-trigger"
            aria-label="Open navigation"
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="menu_open" size={22} />
          </button>

          <div className="breadcrumb">
            <span>Majedaar</span>
            <b>/</b>
            <strong>{breadcrumbLabel(pathname)}</strong>
          </div>

          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Order Sound Alert Control / Autoplay Unlock */}
            {!alertState.isEnabled ? (
              <button
                type="button"
                onClick={async () => {
                  alertManager.setEnabled(true);
                  await alertManager.unlockAudio();
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  height: "28px",
                  padding: "4px 9px",
                  fontSize: "11px",
                  fontWeight: 700,
                  background: "#fff1f2",
                  color: "var(--crimson, #b91c1c)",
                  border: "1px solid #fecdd3",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                title="Click to enable continuous order ringtone alerts on this device"
              >
                <span>Enable Sound Alerts</span>
              </button>
            ) : alertState.isAudioPlaying ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    height: "28px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    background: "#fee2e2",
                    color: "#991b1b",
                    border: "1px solid #fca5a5",
                    borderRadius: "4px",
                  }}
                  title="Looping order alert playing"
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#ef4444",
                    }}
                  />
                  <span>🔊 Alerting ({alertState.pendingCount})</span>
                </span>
                <button
                  type="button"
                  onClick={() => alertManager.setEnabled(false)}
                  style={{
                    height: "28px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    fontWeight: 600,
                    background: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  title="Mute audio alert"
                >
                  Mute
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  if (!alertState.isUnlocked) {
                    await alertManager.unlockAudio();
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  height: "28px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                title="Order Sound Alerts Active across sessions"
              >
                <span>Alerts Active</span>
              </button>
            )}

            {/* Push notification alerts action */}
            {pushStatus === "granted" && pushSubscribed ? (
              <button
                type="button"
                className="button-icon"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#16a34a",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  gap: "5px",
                  cursor: "pointer",
                  height: "28px",
                }}
                title="Order & Payment Alerts Active (Click to send test alert)"
                onClick={async () => {
                  if (confirm("Push alerts are active on this device! Send a quick test notification?")) {
                    try {
                      await sendTestPushAlert();
                      playNotificationChime();
                    } catch (e) {
                      alert(e.message || "Failed to send test alert");
                    }
                  }
                }}
              >
                <Icon name="bell" size={13} />
                <span style={{ fontSize: "11px" }}>Alerts Active</span>
              </button>
            ) : pushStatus !== "unsupported" ? (
              <button
                type="button"
                onClick={handleTogglePush}
                disabled={subscribingPush}
                className="button button-secondary"
                style={{
                  padding: "4px 9px",
                  fontSize: "11px",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  height: "28px",
                }}
                title={
                  pushStatus === "denied"
                    ? "Notifications blocked in browser"
                    : "Enable instant New Order & Payment alerts"
                }
              >
                <Icon name="bell" size={13} />
                <span>{subscribingPush ? "Enabling..." : "Enable Alerts"}</span>
              </button>
            ) : null}

            <Link
              href="/dashboard/messages"
              className="icon-button"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Customer Messages"
              aria-label="Customer Messages"
            >
              <Icon name="mail" size={17} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "#DC2626",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 700,
                    minWidth: "16px",
                    height: "16px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3px",
                    lineHeight: 1,
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
            <span className="header-date">{today}</span>
          </div>
        </header>

        {/* Page */}
        <main className="page-content">{children}</main>
      </div>

      {/* Prominent Real-time New Order Alert Modal / Toast */}
      <NewOrderAlertModal pendingOrders={alertState.pendingOrders} />
    </div>
  );
}