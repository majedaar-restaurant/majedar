import { apiRequest } from "./client";

export async function riderLogin(credentials) {
  const response = await apiRequest("/rider-auth/login", {
    method: "POST",
    body: credentials,
  });
  return response?.data?.rider;
}

export async function riderGoogleLogin(idToken) {
  const response = await apiRequest("/rider-auth/google/login", {
    method: "POST",
    body: { idToken },
  });
  return response?.data?.rider;
}

export async function riderLogout() {
  return apiRequest("/rider-auth/logout", { method: "POST" });
}

export async function getRiderMe() {
  const response = await apiRequest("/rider-auth/me");
  return response?.data?.rider;
}

export async function getRiderDashboard() {
  const response = await apiRequest("/rider/dashboard", { cache: "no-store" });
  return response?.data;
}

export async function getRiderHistory() {
  const response = await apiRequest("/rider/history");
  return response?.data?.orders || [];
}

export async function getRiderNotifications() {
  const response = await apiRequest("/rider/notifications");
  return response?.data || { notifications: [], unreadCount: 0 };
}

export async function markRiderNotificationRead(id) {
  return apiRequest(`/rider/notifications/${id}/read`, { method: "PATCH" });
}

function vapidKeyToBytes(value) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export function isRiderPushSupported() {
  return typeof window !== "undefined"
    && "serviceWorker" in navigator
    && "PushManager" in window
    && "Notification" in window;
}

export async function subscribeRiderPush() {
  if (!isRiderPushSupported()) {
    throw new Error("Browser push notifications are not supported on this device.");
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(permission === "denied"
      ? "Notification permission is blocked in browser settings."
      : "Notification permission was not granted.");
  }
  const keyResponse = await apiRequest("/rider/push/vapid-public-key");
  const publicKey = keyResponse?.data?.publicKey;
  if (!publicKey) throw new Error("Browser push is not configured on the server.");

  await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKeyToBytes(publicKey),
    });
  }
  await apiRequest("/rider/push/subscribe", {
    method: "POST",
    body: subscription.toJSON(),
  });
  return subscription;
}

export async function getRiderPushSubscription() {
  if (!isRiderPushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration("/");
  return registration ? registration.pushManager.getSubscription() : null;
}

export async function unsubscribeRiderPush() {
  const subscription = await getRiderPushSubscription();
  if (!subscription) return;
  await apiRequest("/rider/push/unsubscribe", {
    method: "POST",
    body: { endpoint: subscription.endpoint },
  });
  await subscription.unsubscribe();
}

export async function setRiderAvailability(availability) {
  const response = await apiRequest("/rider/availability", {
    method: "PATCH",
    body: { availability },
  });
  return response?.data;
}

export async function respondToRiderAssignment(orderId, decision, reason) {
  const response = await apiRequest(`/rider/orders/${orderId}/assignment`, {
    method: "PATCH",
    body: { decision, ...(reason ? { reason } : {}) },
  });
  return response?.data?.order;
}

export async function updateRiderDeliveryStatus(orderId, status, reason, remarks, collection) {
  const response = await apiRequest(`/rider/orders/${orderId}/status`, {
    method: "PATCH",
    body: {
      status,
      ...(reason ? { reason } : {}),
      ...(remarks ? { remarks } : {}),
      ...(collection ? { collection } : {}),
    },
  });
  return response?.data?.order;
}

export async function sendRiderLocation(orderId, latitude, longitude) {
  const response = await apiRequest(`/rider/orders/${orderId}/location`, {
    method: "PUT",
    body: { latitude, longitude },
  });
  return response?.data;
}

export async function updateRiderProfile(profile) {
  const response = await apiRequest("/rider-auth/profile", {
    method: "PATCH",
    body: profile,
  });
  return response?.data?.rider;
}

export async function requestRiderEmailChange(email) {
  return apiRequest("/rider-auth/email/change", {
    method: "POST",
    body: { email },
  });
}

export async function verifyRiderEmailChange(code) {
  return apiRequest("/rider-auth/email/verify", {
    method: "POST",
    body: { code },
  });
}

export async function changeRiderPassword(currentPassword, newPassword) {
  return apiRequest("/rider-auth/password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
}
