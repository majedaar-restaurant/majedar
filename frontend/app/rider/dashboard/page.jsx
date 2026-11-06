"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import RiderTrackingMap from "../../../components/RiderTrackingMap";
import { disconnectSocket, getSocket } from "../../../lib/socket";
import {
  changeRiderPassword,
  getRiderDashboard,
  getRiderMe,
  getRiderPushSubscription,
  isRiderPushSupported,
  requestRiderEmailChange,
  respondToRiderAssignment,
  riderLogout,
  sendRiderLocation,
  subscribeRiderPush,
  unsubscribeRiderPush,
  setRiderAvailability,
  updateRiderDeliveryStatus,
  updateRiderProfile,
  verifyRiderEmailChange,
} from "../../../lib/api/rider";

const FAIL_REASONS = [
  "Customer unreachable",
  "Customer unavailable",
  "Wrong address",
  "Customer refused",
  "Other",
];

const statusLabel = (status) => ({
  pending: "New assignment",
  accepted: "Accepted",
  picked_up: "Picked up",
  out_for_delivery: "On the way",
  delivered: "Delivered",
  failed: "Failed",
  rejected: "Rejected",
}[status] || status?.replaceAll("_", " ") || "Assigned");

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const localDateInput = (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
const customerName = (order) => [
  order.deliveryAddress?.firstName,
  order.deliveryAddress?.lastName,
].filter(Boolean).join(" ") || "Customer";
const collectedForOrder = (order) => (order.codCollections || []).reduce((sum, item) => sum + item.amount, 0);
const outstandingForOrder = (order) => order.paymentStatus === "paid"
  ? 0
  : Math.max(0, order.total - collectedForOrder(order));

function getPerformancePeriod(range, customStart, customEnd) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  if (range === "all") return { start: null, end: null, label: "Full time" };
  if (range === "today") return { start, end, label: "Today" };
  if (range === "last7") {
    start.setDate(start.getDate() - 6);
    return { start, end, label: "Last 7 days" };
  }
  if (range === "week") {
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return { start, end, label: "This week" };
  }

  if (!customStart || !customEnd) {
    return { start: null, end: null, label: "Custom range", error: "Select both a start and end date." };
  }
  const customStartDate = new Date(`${customStart}T00:00:00`);
  const customEndDate = new Date(`${customEnd}T00:00:00`);
  if (Number.isNaN(customStartDate.getTime()) || Number.isNaN(customEndDate.getTime())) {
    return { start: null, end: null, label: "Custom range", error: "Enter valid start and end dates." };
  }
  if (customStartDate > customEndDate) {
    return { start: null, end: null, label: "Custom range", error: "The start date must be on or before the end date." };
  }
  customEndDate.setDate(customEndDate.getDate() + 1);
  return {
    start: customStartDate,
    end: customEndDate,
    label: `${customStart} – ${customEnd}`,
  };
}

function playRiderAssignmentChime() {
  if (typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    const context = new AudioContextClass();
    const play = () => {
      const start = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(740, start);
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.35);
      window.setTimeout(() => {
        context.close().catch((cause) => console.warn("[Rider] Unable to close notification audio:", cause));
      }, 500);
    };
    if (context.state === "suspended") {
      context.resume().then(play).catch((cause) => {
        console.warn("[Rider] Assignment sound was blocked by browser policy:", cause);
        context.close().catch(() => {});
      });
    } else {
      play();
    }
  } catch (cause) {
    console.warn("[Rider] Assignment sound is unavailable:", cause);
  }
}

function etaRange(seconds) {
  if (!Number.isFinite(seconds)) return null;
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return `${minutes}–${minutes + 3} mins`;
}

function Metric({ label, value, detail, tone = "forest" }) {
  const tones = {
    forest: "border-[#1B3B2B]/10 bg-[#F2F7F4] text-[#1B3B2B]",
    orange: "border-[#C85A17]/15 bg-orange-50 text-[#9A3D0C]",
    blue: "border-blue-100 bg-blue-50 text-blue-900",
    rose: "border-rose-100 bg-rose-50 text-rose-900",
  };
  return (
    <article className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
      {detail && <p className="mt-1 text-xs opacity-70">{detail}</p>}
    </article>
  );
}

export default function RiderDashboardPage() {
  const router = useRouter();
  const [rider, setRider] = useState(null);
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [performanceRange, setPerformanceRange] = useState("today");
  const [customStart, setCustomStart] = useState(() => localDateInput(new Date()));
  const [customEnd, setCustomEnd] = useState(() => localDateInput(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("deliveries");
  const [busyAction, setBusyAction] = useState("");
  const [failureOrder, setFailureOrder] = useState(null);
  const [failureReason, setFailureReason] = useState(FAIL_REASONS[0]);
  const [failureRemarks, setFailureRemarks] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [pushEnabled, setPushEnabled] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [codCollectionOrder, setCodCollectionOrder] = useState(null);
  const [codMethod, setCodMethod] = useState("cash");
  const lastLocationSent = useRef({});
  const alertedAssignments = useRef(new Set());
  const processedAssignmentEvents = useRef(new Set());
  const processedTerminalUpdates = useRef(new Set());
  const pendingAssignments = useMemo(() => orders
    .filter((order) => order.riderStatus === "pending")
    .map((order) => {
      const assignment = [...(order.riderAssignmentHistory || [])].reverse()
        .find((entry) => !entry.acceptedAt && !entry.rejectedAt && !entry.unassignedAt);
      return assignment?.responseDeadline && new Date(assignment.responseDeadline).getTime() > Date.now()
        ? { order, assignment }
        : null;
    })
    .filter(Boolean), [orders]);
  const pendingAssignmentAlarmKey = pendingAssignments
    .map(({ order }) => order._id).sort().join(",");
  const pendingAssignmentAlarmDeadline = pendingAssignments.length
    ? Math.min(...pendingAssignments.map(({ assignment }) => new Date(assignment.responseDeadline).getTime()))
    : null;

  const refresh = useCallback(async () => {
    const [me, dashboard] = await Promise.all([
      getRiderMe(),
      getRiderDashboard(),
    ]);
    setRider(me);
    setProfileName(me.name || "");
    setProfilePhone(me.phone || "");
    setEmail(me.email || "");
    setSummary(dashboard.summary);
    setOrders(dashboard.orders || []);
    setHistoryOrders(dashboard.historyOrders || []);
    setError("");
  }, []);

  useEffect(() => {
    let active = true;
    refresh()
      .catch((cause) => {
        if (!active) return;
        if (cause?.status === 401) {
          router.replace("/rider/login");
        } else {
          setError(cause?.message || "Unable to load your delivery dashboard.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [refresh, router]);

  useEffect(() => {
    if (!isRiderPushSupported()) return;
    getRiderPushSubscription()
      .then((subscription) => setPushEnabled(Boolean(subscription)))
      .catch((cause) => setError(cause?.message || "Unable to check browser push settings."));
  }, []);

  useEffect(() => {
    const socket = getSocket("rider");
    if (!socket) return undefined;
    const refreshOnChange = () => refresh().catch((cause) => setError(cause?.message || "Unable to refresh rider data."));
    const handleAssignment = (payload) => {
      if (payload?.assignmentId) {
        if (processedAssignmentEvents.current.has(payload.assignmentId)) return;
        processedAssignmentEvents.current.add(payload.assignmentId);
      }
      if (process.env.NODE_ENV !== "production") console.info("[Socket] assignment received");
      refreshOnChange();
    };
    const handleDeliveryUpdate = (payload) => {
      if (!payload?.orderId) return;
      if (process.env.NODE_ENV !== "production") console.info("[Socket] order update received");
      const isTerminal = ["delivered", "failed", "rejected"].includes(payload.riderStatus)
        || ["cancelled", "completed"].includes(payload.orderStatus)
        || payload.riderId === null;
      if (isTerminal) {
        setOrders((previous) => previous.filter((order) => String(order._id) !== String(payload.orderId)));
        const updateKey = `${payload.orderId}:${payload.riderStatus}:${payload.orderStatus}:${payload.updatedAt || payload.cancelledAt || ""}`;
        if (!processedTerminalUpdates.current.has(updateKey)) {
          processedTerminalUpdates.current.add(updateKey);
          refreshOnChange();
        }
        return;
      }
      setOrders((previous) => previous.map((order) => {
        if (String(order._id) !== String(payload.orderId)) return order;
        return {
          ...order,
          ...(payload.orderStatus !== undefined ? { orderStatus: payload.orderStatus } : {}),
          ...(payload.riderStatus !== undefined ? { riderStatus: payload.riderStatus } : {}),
          ...(payload.riderLocation !== undefined ? { riderLocation: payload.riderLocation } : {}),
          ...(payload.routeEta !== undefined ? { routeEta: payload.routeEta } : {}),
          ...(payload.deliveryStartedAt !== undefined ? { deliveryStartedAt: payload.deliveryStartedAt } : {}),
          ...(payload.riderHandoffRequired !== undefined ? { riderHandoffRequired: payload.riderHandoffRequired } : {}),
          ...(payload.paymentStatus !== undefined ? { paymentStatus: payload.paymentStatus } : {}),
        };
      }));
    };
    const handleAvailabilityChange = (payload) => {
      if (!payload?.riderId || !payload?.availability) return;
      setRider((current) => current && String(current._id) === String(payload.riderId)
        ? { ...current, availability: payload.availability }
        : current);
    };
    const handleNotification = (payload) => {
      if (!payload?.message) return;
      toast.info(payload.message, { toastId: payload._id || `${payload.event}:${payload.orderId}` });
    };
    let hasConnected = socket.connected;
    const handleConnect = () => {
      if (process.env.NODE_ENV !== "production") console.info("[Socket] connected");
      if (hasConnected) refreshOnChange();
      hasConnected = true;
    };
    const handleDisconnect = () => {
      if (process.env.NODE_ENV !== "production") console.info("[Socket] disconnected");
    };
    socket.off("rider:assignment", handleAssignment);
    socket.off("rider:assignment_updated", handleDeliveryUpdate);
    socket.off("rider:delivery_updated", handleDeliveryUpdate);
    socket.off("rider:location_updated", handleDeliveryUpdate);
    socket.off("rider:cod_updated", handleDeliveryUpdate);
    socket.off("rider:availability_changed", handleAvailabilityChange);
    socket.off("rider:notification", handleNotification);
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.on("rider:assignment", handleAssignment);
    socket.on("rider:assignment_updated", handleDeliveryUpdate);
    socket.on("rider:delivery_updated", handleDeliveryUpdate);
    socket.on("rider:location_updated", handleDeliveryUpdate);
    socket.on("rider:cod_updated", handleDeliveryUpdate);
    socket.on("rider:availability_changed", handleAvailabilityChange);
    socket.on("rider:notification", handleNotification);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    if (!socket.connected) socket.connect();
    return () => {
      socket.off("rider:assignment", handleAssignment);
      socket.off("rider:assignment_updated", handleDeliveryUpdate);
      socket.off("rider:delivery_updated", handleDeliveryUpdate);
      socket.off("rider:location_updated", handleDeliveryUpdate);
      socket.off("rider:cod_updated", handleDeliveryUpdate);
      socket.off("rider:availability_changed", handleAvailabilityChange);
      socket.off("rider:notification", handleNotification);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      disconnectSocket();
    };
  }, [refresh]);

  useEffect(() => {
    if (!pendingAssignmentAlarmKey) return undefined;
    const timeout = setTimeout(
      () => refresh().catch((cause) => setError(cause?.message || "Unable to refresh assignment status.")),
      Math.max(0, pendingAssignmentAlarmDeadline - Date.now() + 100)
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [pendingAssignmentAlarmKey, pendingAssignmentAlarmDeadline, refresh]);

  useEffect(() => {
    let hasNewAssignment = false;
    for (const { order, assignment } of pendingAssignments) {
      const assignmentKey = `${order._id}:${new Date(assignment.assignedAt).getTime()}`;
      if (alertedAssignments.current.has(assignmentKey)) continue;
      alertedAssignments.current.add(assignmentKey);
      hasNewAssignment = true;
    }
    if (hasNewAssignment) playRiderAssignmentChime();
  }, [pendingAssignments]);

  useEffect(() => {
    if (!orders.some((order) => ["picked_up", "out_for_delivery"].includes(order.riderStatus))) return undefined;
    if (!navigator.geolocation) {
      setLocationMessage("This browser does not support geolocation. Live location cannot be shared.");
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocationMessage("");
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        for (const order of orders) {
          if (!["picked_up", "out_for_delivery"].includes(order.riderStatus)) continue;
          const now = Date.now();
          if (now - (lastLocationSent.current[order._id] || 0) < 15000) continue;
          lastLocationSent.current[order._id] = now;
          sendRiderLocation(order._id, latitude, longitude)
            .then((result) => {
              setOrders((previous) => previous.map((item) => item._id === order._id
                ? { ...item, riderLocation: result.riderLocation, routeEta: result.routeEta }
                : item));
            })
            .catch((cause) => {
              setLocationMessage(cause?.message || "Live location update failed. Check your connection.");
            });
        }
      },
      (cause) => {
        const messages = {
          1: "Location permission is denied. Allow location access in your browser settings to share live delivery progress.",
          2: "Your location is temporarily unavailable. Location sharing will retry when GPS is available.",
          3: "Location request timed out. Keep the app open and check your GPS connection.",
        };
        setLocationMessage(messages[cause.code] || "Unable to access your location.");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [orders]);

  const runAction = async (key, action) => {
    setBusyAction(key);
    setError("");
    try {
      const shouldRefresh = await action();
      if (shouldRefresh !== false) await refresh();
      return true;
    } catch (cause) {
      setError(cause?.message || "That action could not be completed.");
      return false;
    } finally {
      setBusyAction("");
    }
  };

  const handleAvailability = (availability) => runAction("availability", async () => {
    const result = await setRiderAvailability(availability);
    setRider((current) => ({ ...current, ...result.rider }));
    if (availability === "unavailable" && result.activeAssignments > 0) {
      setError(`Admin has been notified. You still have ${result.activeAssignments} assigned order(s); ask Admin to reassign them if needed.`);
    }
  });

  const handleReject = (order) => {
    const reason = window.prompt("Why are you rejecting this assignment?");
    if (!reason?.trim()) return;
    runAction(`assignment-${order._id}`, () => respondToRiderAssignment(order._id, "reject", reason.trim()));
  };

  const handleFailureSubmit = (event) => {
    event.preventDefault();
    const order = failureOrder;
    setFailureOrder(null);
    runAction(`status-${order._id}`, () => updateRiderDeliveryStatus(
      order._id,
      "failed",
      failureReason,
      failureReason === "Other" ? failureRemarks : undefined
    ));
    setFailureRemarks("");
  };

  const handleDelivered = (order) => {
    const outstanding = outstandingForOrder(order);
    if (order.paymentMethod === "cod" && outstanding > 0) {
      setCodMethod("cash");
      setCodCollectionOrder(order);
      return;
    }
    runAction(`status-${order._id}`, () => updateRiderDeliveryStatus(order._id, "delivered"));
  };

  const confirmCodCollection = () => {
    if (!codCollectionOrder) return;
    const order = codCollectionOrder;
    const amount = outstandingForOrder(order);
    runAction(`status-${order._id}`, () => updateRiderDeliveryStatus(
      order._id,
      "delivered",
      undefined,
      undefined,
      { amount, method: codMethod }
    )).then((success) => {
      if (success) setCodCollectionOrder(null);
    });
  };

  const logout = () => runAction("logout", async () => {
    await riderLogout();
    router.replace("/rider/login");
    return false;
  });

  const saveProfile = (event) => {
    event.preventDefault();
    runAction("profile", async () => {
      const updated = await updateRiderProfile({ name: profileName, phone: profilePhone });
      setRider(updated);
    });
  };

  const submitEmailChange = (event) => {
    event.preventDefault();
    runAction("email", async () => {
      await requestRiderEmailChange(email);
      setEmailSent(true);
    });
  };

  const submitEmailCode = (event) => {
    event.preventDefault();
    runAction("email-verify", async () => {
      await verifyRiderEmailChange(emailCode);
      await riderLogout();
      router.replace("/rider/login");
      return false;
    });
  };

  const submitPasswordChange = (event) => {
    event.preventDefault();
    runAction("password", async () => {
      await changeRiderPassword(currentPassword, newPassword);
      router.replace("/rider/login");
      return false;
    });
  };

  const enableBrowserNotifications = async () => {
    try {
      await subscribeRiderPush();
      setPushEnabled(true);
      setError("");
    } catch (cause) {
      setError(cause?.message || "Unable to enable browser push notifications.");
    }
  };

  const disableBrowserNotifications = async () => {
    try {
      await unsubscribeRiderPush();
      setPushEnabled(false);
    } catch (cause) {
      setError(cause?.message || "Unable to disable browser push notifications.");
    }
  };

  const period = useMemo(
    () => getPerformancePeriod(performanceRange, customStart, customEnd),
    [performanceRange, customStart, customEnd]
  );
  const performance = useMemo(() => {
    if (period.error || !rider?._id) return null;
    const riderId = String(rider._id);
    const isInPeriod = (value) => {
      const timestamp = new Date(value).getTime();
      return Number.isFinite(timestamp)
        && (period.start === null || timestamp >= period.start.getTime())
        && (period.end === null || timestamp < period.end.getTime());
    };
    const result = { completed: 0, failed: 0, rejected: 0, codCollected: 0 };

    for (const order of historyOrders) {
      const statusEvents = (order.statusHistory || []).filter((event) =>
        event.domain === "rider"
        && String(event.actor?._id || event.actor || "") === riderId
        && ["delivered", "failed", "rejected"].includes(event.status)
      );
      const deliveryEvents = statusEvents.length
        ? statusEvents
        : (order.riderDeliveryHistory || []).filter((event) =>
          String(event.rider?._id || event.rider || "") === riderId
          && ["delivered", "failed", "rejected"].includes(event.status)
        );

      for (const event of deliveryEvents) {
        if (!isInPeriod(event.timestamp)) continue;
        if (event.status === "delivered") result.completed += 1;
        if (event.status === "failed") result.failed += 1;
        if (event.status === "rejected") result.rejected += 1;
      }

      for (const collection of order.codCollections || []) {
        if (
          String(collection.rider?._id || collection.rider || "") === riderId
          && isInPeriod(collection.collectedAt)
        ) {
          result.codCollected += Number(collection.amount || 0);
        }
      }
    }

    return result;
  }, [historyOrders, period, rider?._id]);
  const displayedOrders = tab === "deliveries" ? orders : [];

  if (loading) {
    return <main className="min-h-screen bg-[#FAF8F5] p-8 text-center flex items-center justify-center font-bold text-3xl text-stone-600">Loading rider dashboard…</main>;
  }

  if (!rider) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] px-4 py-16 text-center">
        <p className="text-sm text-stone-600">{error || "Checking rider session…"}</p>
        <a className="mt-4 inline-block font-bold text-[#1B3B2B] underline" href="/rider/login">Go to rider sign in</a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-3 py-5 text-stone-800 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-3 rounded-3xl bg-[#1B3B2B] p-4 text-white shadow-lg shadow-[#1B3B2B]/10 sm:p-6">
          <div className="flex items-center gap-3">
            <Image src="/brand/logo-mark.svg" alt="" width={40} height={40} className="h-10 w-10 rounded-xl bg-white p-1" />
            <div>
              <p className="font-hero text-xs font-bold tracking-widest">MAJEDAAR</p>
              <h1 className="mt-0.5 text-lg font-extrabold sm:text-2xl">Rider Panel</h1>
              <p className="text-xs text-white/70">Welcome, {rider.name}</p>
            </div>
          </div>
          <button onClick={logout} disabled={busyAction === "logout"} className="rounded-xl border border-white/25 px-3 py-2 text-xs font-bold hover:bg-white/10">
            Sign out
          </button>
        </header>

        <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Availability</p>
            <p className="mt-1 text-sm text-stone-700">
              {rider.availability === "available" ? "You can receive new assignments." : rider.availability === "busy" ? "You have active assigned work." : "You are not accepting new orders."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["available", "busy", "unavailable"].map((availability) => (
              <button
                key={availability}
                onClick={() => handleAvailability(availability)}
                disabled={busyAction === "availability" || rider.availability === availability}
                className={`rounded-xl px-3 py-2 text-xs font-bold capitalize transition ${
                  rider.availability === availability
                    ? "bg-[#1B3B2B] text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:border-[#1B3B2B]"
                }`}
              >
                {availability}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div role="alert" className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Dismiss message" className="font-bold">×</button>
          </div>
        )}

        <nav className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {[
            ["deliveries", "Deliveries"],
            ["settings", "Profile & Settings"],
          ].map(([value, label]) => (
            <button key={value} onClick={() => setTab(value)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${tab === value ? "bg-[#1B3B2B] text-white" : "border border-stone-200 bg-white text-stone-600"}`}>
              {label}
            </button>
          ))}
        </nav>

        {tab === "deliveries" && (
          <>
            <section className="mb-5 rounded-2xl border border-stone-200 bg-white p-4">
              <div className="mt-3 flex flex-wrap gap-2" role="group">
                {[
                  ["today", "Today"],
                  ["last7", "Last 7 days"],
                  ["week", "This week"],
                  ["all", "Full time"],
                  ["custom", "Custom range"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={performanceRange === value}
                    onClick={() => setPerformanceRange(value)}
                    className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                      performanceRange === value
                        ? "bg-[#1B3B2B] text-white"
                        : "border border-stone-200 text-stone-600 hover:border-[#1B3B2B]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {performanceRange === "custom" && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-stone-600">
                    From
                    <input
                      type="date"
                      value={customStart}
                      max={customEnd}
                      onChange={(event) => setCustomStart(event.target.value)}
                      className="input mt-1"
                    />
                  </label>
                  <label className="text-xs font-semibold text-stone-600">
                    To
                    <input
                      type="date"
                      value={customEnd}
                      min={customStart}
                      onChange={(event) => setCustomEnd(event.target.value)}
                      className="input mt-1"
                    />
                  </label>
                </div>
              )}
              {period.error && (
                <p role="alert" className="mt-3 text-xs font-medium text-rose-700">{period.error}</p>
              )}
            </section>
            <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Assigned now" value={summary?.assigned ?? 0} detail="Current assignments" />
              <Metric label="Pending now" value={summary?.pending ?? 0} tone="orange" detail="Awaiting your response" />
              <Metric label="Active now" value={summary?.active ?? 0} tone="blue" detail="In progress" />
              <Metric label="Completed" value={performance?.completed ?? "—"} detail={period.label} />
              <Metric label="Failed" value={performance?.failed ?? "—"} tone="rose" detail={period.label} />
              <Metric label="Rejected" value={performance?.rejected ?? "—"} tone="orange" detail={period.label} />
              <Metric label="COD collected" value={performance ? money(performance.codCollected) : "—"} detail={period.label} />
              <Metric label="COD to collect" value={money(summary?.codToCollect)} tone="orange" detail="Current assignments" />
            </section>
            {locationMessage && (
              <p role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">{locationMessage}</p>
            )}
            {displayedOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
                <h2 className="mt-3 font-hero text-xl font-bold text-[#1B3B2B]">No assigned deliveries</h2>
                <p className="mt-1 text-sm text-stone-500">New assignments will appear here when Admin assigns them to you.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedOrders.map((order) => {
                  const address = order.deliveryAddress || {};
                  const outstanding = outstandingForOrder(order);
                  const routeEta = etaRange(order.routeEta?.durationSeconds);
                  const locationActive = ["picked_up", "out_for_delivery"].includes(order.riderStatus);
                  return (
                    <article key={order._id} className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 p-4 sm:p-5">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C85A17]">Order {order.orderNumber}</p>
                          <h2 className="mt-1 text-lg font-extrabold text-[#1B3B2B]">{customerName(order)}</h2>
                          <a href={`tel:${address.phone || ""}`} className="text-sm font-semibold text-stone-600 underline">
                            {address.phone || "No phone number"}
                          </a>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          ["delivered"].includes(order.riderStatus) ? "bg-emerald-100 text-emerald-900"
                            : order.riderStatus === "failed" ? "bg-rose-100 text-rose-900"
                              : "bg-[#F2F7F4] text-[#1B3B2B]"
                        }`}>{statusLabel(order.riderStatus)}</span>
                      </div>
                      <div className="grid gap-5 p-4 sm:grid-cols-[1fr_0.9fr] sm:p-5">
                        <div className="space-y-4">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Delivery address</p>
                            <p className="mt-1 text-sm leading-6">{[address.address, address.area, address.landmark].filter(Boolean).join(", ")}</p>
                            {address.location?.latitude != null && address.location?.longitude != null && (
                              <a
                                className="mt-1 inline-block text-xs font-bold text-[#1B3B2B] underline"
                                target="_blank"
                                rel="noreferrer"
                                href={`https://www.google.com/maps/dir/?api=1&destination=${address.location.latitude},${address.location.longitude}&travelmode=driving`}
                              >
                                Open destination in Google Maps
                              </a>
                            )}
                          </div>
                          {(address.deliveryInstructions || address.deliveryInstructionOther) && (
                            <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
                              <span className="font-bold">Instructions: </span>
                              {address.deliveryInstructions === "Other" ? address.deliveryInstructionOther : address.deliveryInstructions}
                            </div>
                          )}
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Items</p>
                            <ul className="mt-1 space-y-1 text-sm">
                              {(order.items || []).map((item, index) => (
                                <li key={`${item.name}-${index}`} className="flex justify-between gap-3">
                                  <span>{item.quantity} × {item.name}{item.variant && item.variant !== "single" ? ` (${item.variant})` : ""}</span>
                                  <span className="shrink-0 text-stone-500">{money(item.subtotal)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-3 text-sm">
                            <p>Total <strong className="ml-1">{money(order.total)}</strong></p>
                            <p>Payment <strong className="ml-1">{order.paymentMethod === "cod" ? "COD" : "Prepaid"}</strong></p>
                            <p>Status <strong className="ml-1 capitalize">{order.paymentStatus}</strong></p>
                            {order.paymentMethod === "cod" && <p>COD remaining <strong className="ml-1">{money(outstanding)}</strong></p>}
                          </div>
                          {order.paymentMethod === "cod" && order.codCollections?.length > 0 && (
                            <div className="text-xs text-stone-600">
                              {order.codCollections.map((collection, index) => (
                                <p key={`${collection.collectedAt}-${index}`}>
                                  Collected {money(collection.amount)} by {collection.method?.toUpperCase()} · {new Date(collection.collectedAt).toLocaleString("en-IN")}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          {locationActive && (
                            <>
                              <RiderTrackingMap location={order.riderLocation} destination={address.location} />
                              {order.riderStatus === "out_for_delivery" && (
                                <p className="rounded-xl bg-[#F2F7F4] p-3 text-sm font-bold text-[#1B3B2B]">
                                  On the way{routeEta ? ` · Reaching in ${routeEta}` : " · Route ETA unavailable"}
                                </p>
                              )}
                              {order.riderLocation?.updatedAt && (
                                <p className="text-[11px] text-stone-500">
                                  Location updated {new Date(order.riderLocation.updatedAt).toLocaleTimeString("en-IN")}
                                </p>
                              )}
                            </>
                          )}
                          {order.riderStatus === "pending" && (
                            <div className="grid grid-cols-2 gap-2">
                              <button disabled={busyAction === `assignment-${order._id}`} onClick={() => runAction(`assignment-${order._id}`, () => respondToRiderAssignment(order._id, "accept"))} className="rounded-xl bg-[#1B3B2B] px-3 py-3 text-sm font-bold text-white disabled:opacity-50">Accept</button>
                              <button disabled={busyAction === `assignment-${order._id}`} onClick={() => handleReject(order)} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm font-bold text-rose-800 disabled:opacity-50">Reject</button>
                            </div>
                          )}
                          {order.riderStatus === "accepted" && (
                            <button
                              disabled={busyAction === `status-${order._id}` || (order.orderStatus !== "ready_for_pickup" && !order.riderHandoffRequired)}
                              onClick={() => runAction(`status-${order._id}`, () => updateRiderDeliveryStatus(order._id, "picked_up"))}
                              className="w-full rounded-xl bg-[#1B3B2B] px-3 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {order.riderHandoffRequired
                                ? "Confirm Handover / Picked Up"
                                : order.orderStatus === "ready_for_pickup"
                                  ? "Mark as Picked Up"
                                  : "Waiting for restaurant to mark Ready"}
                            </button>
                          )}
                          {order.riderStatus === "picked_up" && (
                            <button disabled={busyAction === `status-${order._id}`} onClick={() => runAction(`status-${order._id}`, () => updateRiderDeliveryStatus(order._id, "out_for_delivery"))} className="w-full rounded-xl bg-[#1B3B2B] px-3 py-3 text-sm font-bold text-white disabled:opacity-50">Start delivery</button>
                          )}
                          {order.riderStatus === "out_for_delivery" && (
                            <div className="space-y-2">
                              <button disabled={busyAction === `status-${order._id}`} onClick={() => handleDelivered(order)} className="w-full rounded-xl bg-[#1B3B2B] px-3 py-3 text-sm font-bold text-white disabled:opacity-50">Mark as Delivered</button>
                              <button disabled={busyAction === `status-${order._id}`} onClick={() => { setFailureOrder(order); setFailureReason(FAIL_REASONS[0]); }} className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm font-bold text-rose-800 disabled:opacity-50">Failed delivery</button>
                            </div>
                          )}
                          <p className="text-[11px] text-stone-500">Order items, price, admin status, and payment status are read-only.</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === "settings" && (
          <section className="grid gap-4 lg:grid-cols-2">
            <form onSubmit={saveProfile} className="space-y-4 rounded-3xl border border-stone-200 bg-white p-5">
              <h2 className="font-hero text-xl font-bold text-[#1B3B2B]">Profile details</h2>
              <label className="block text-sm font-semibold">Name<input required minLength="2" value={profileName} onChange={(event) => setProfileName(event.target.value)} className="input mt-2" /></label>
              <label className="block text-sm font-semibold">Phone<input required type="tel" value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} className="input mt-2" /></label>
              <button disabled={busyAction === "profile"} className="rounded-xl bg-[#1B3B2B] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Save profile</button>
            </form>

            <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-5">
              <h2 className="font-hero text-xl font-bold text-[#1B3B2B]">Verified email</h2>
              <p className="text-xs text-stone-500">Current email: {rider.email || "Not set"}</p>
              <form onSubmit={submitEmailChange} className="space-y-3">
                <label className="block text-sm font-semibold">New email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2" /></label>
                <button disabled={busyAction === "email"} className="rounded-xl border border-[#1B3B2B] px-4 py-3 text-sm font-bold text-[#1B3B2B] disabled:opacity-50">Send verification code</button>
              </form>
              {emailSent && (
                <form onSubmit={submitEmailCode} className="space-y-3 border-t border-stone-100 pt-4">
                  <label className="block text-sm font-semibold">6-digit verification code<input inputMode="numeric" pattern="[0-9]{6}" required value={emailCode} onChange={(event) => setEmailCode(event.target.value)} className="input mt-2" /></label>
                  <button disabled={busyAction === "email-verify"} className="rounded-xl bg-[#1B3B2B] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Verify email and sign in again</button>
                </form>
              )}
              {isRiderPushSupported() && (
                <button type="button" onClick={pushEnabled ? disableBrowserNotifications : enableBrowserNotifications} className="rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold text-[#1B3B2B]">
                  {pushEnabled ? "Disable browser alerts" : "Enable browser alerts"}
                </button>
              )}
            </div>

            <form onSubmit={submitPasswordChange} className="space-y-4 rounded-3xl border border-stone-200 bg-white p-5 lg:col-span-2">
              <h2 className="font-hero text-xl font-bold text-[#1B3B2B]">Change password</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold">Current password<input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="input mt-2" /></label>
                <label className="block text-sm font-semibold">New password<input type="password" autoComplete="new-password" minLength="8" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="input mt-2" /></label>
              </div>
              <button disabled={busyAction === "password"} className="rounded-xl bg-[#1B3B2B] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Change password and sign out</button>
            </form>
          </section>
        )}
      </div>

      {failureOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="failure-dialog-title">
          <form onSubmit={handleFailureSubmit} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
            <h2 id="failure-dialog-title" className="font-hero text-xl font-bold text-[#1B3B2B]">Report failed delivery</h2>
            <p className="text-xs text-stone-500">Order {failureOrder.orderNumber}. Select a reason; this will be included in the delivery history.</p>
            <label className="block text-sm font-semibold">Reason
              <select value={failureReason} onChange={(event) => setFailureReason(event.target.value)} className="input mt-2">
                {FAIL_REASONS.map((reason) => <option key={reason}>{reason}</option>)}
              </select>
            </label>
            {failureReason === "Other" && <label className="block text-sm font-semibold">Remarks<textarea required minLength="3" maxLength="1000" value={failureRemarks} onChange={(event) => setFailureRemarks(event.target.value)} className="input mt-2 min-h-24" /></label>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setFailureOrder(null)} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-bold">Cancel</button>
              <button disabled={busyAction === `status-${failureOrder._id}`} className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Submit report</button>
            </div>
          </form>
        </div>
      )}
      {codCollectionOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="cod-dialog-title">
          <section className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
            <h2 id="cod-dialog-title" className="font-hero text-xl font-bold text-[#1B3B2B]">Collect COD Payment</h2>
            <p className="text-sm text-stone-600">Order {codCollectionOrder.orderNumber}</p>
            <p className="rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-950">
              Amount to collect: {money(outstandingForOrder(codCollectionOrder))}
            </p>
            <label className="block text-sm font-semibold">Payment method
              <select value={codMethod} onChange={(event) => setCodMethod(event.target.value)} className="input mt-2">
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setCodCollectionOrder(null)} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-bold">Cancel</button>
              <button
                type="button"
                disabled={busyAction === `status-${codCollectionOrder._id}`}
                onClick={confirmCodCollection}
                className="rounded-xl bg-[#1B3B2B] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {busyAction === `status-${codCollectionOrder._id}` ? "Confirming…" : "Confirm Collection"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
