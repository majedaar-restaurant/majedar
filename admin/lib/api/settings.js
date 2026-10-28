import { apiRequest } from "./client";

/**
 * Fetch current admin restaurant settings and live status.
 */
export async function getAdminSettings() {
  const res = await apiRequest("/admin/settings");
  return res.data;
}

/**
 * Update restaurant configuration (timings, minimum order amount).
 */
export async function updateAdminSettings(settings) {
  const res = await apiRequest("/admin/settings", {
    method: "PUT",
    body: settings,
  });
  return res.data;
}

/**
 * Toggle shop status between Open and Closed manually.
 */
export async function toggleShopStatus(isOpen) {
  const res = await apiRequest("/admin/settings/toggle-shop", {
    method: "POST",
    body: { isOpen: Boolean(isOpen) },
  });
  return res.data;
}

/**
 * Toggle Over Order mode (active: true/false, durationMinutes).
 */
export async function toggleOverOrder(active, durationMinutes = 30) {
  const res = await apiRequest("/admin/settings/over-order", {
    method: "POST",
    body: { active: Boolean(active), durationMinutes: Number(durationMinutes) },
  });
  return res.data;
}

/**
 * Fetch authoritative dashboard operational metrics calculated in local timezone.
 */
export async function getDashboardStats() {
  const res = await apiRequest("/admin/settings/dashboard-stats");
  return res.data;
}
