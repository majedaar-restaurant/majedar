import { apiRequest } from "./client";

export async function getAdminRiders(params = {}) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "" && v !== "all") {
      query.set(k, String(v));
    }
  }
  const queryString = query.toString();
  const endpoint = `/admin/riders${queryString ? `?${queryString}` : ""}`;
  const res = await apiRequest(endpoint);
  return res?.data?.riders || [];
}

export async function getAdminRiderById(id) {
  const res = await apiRequest(`/admin/riders/${id}`);
  return res?.data?.rider;
}

export async function createAdminRider(data) {
  const res = await apiRequest("/admin/riders", {
    method: "POST",
    body: data,
  });
  return res?.data?.rider;
}

export async function updateAdminRider(id, updates) {
  const res = await apiRequest(`/admin/riders/${id}`, {
    method: "PATCH",
    body: updates,
  });
  return res?.data?.rider;
}

export async function deleteAdminRider(id) {
  const res = await apiRequest(`/admin/riders/${id}`, {
    method: "DELETE",
  });
  return res?.data;
}

export async function resetAdminRiderPassword(id, password) {
  const res = await apiRequest(`/admin/riders/${id}/reset-password`, {
    method: "POST",
    body: { password },
  });
  return res?.message;
}

export async function getAdminRiderHistory(id) {
  const res = await apiRequest(`/admin/riders/${id}/history`);
  return res?.data?.orders || [];
}

export async function getAdminRiderNotifications(riderId = null) {
  const endpoint = riderId
    ? `/admin/riders/${encodeURIComponent(riderId)}/notifications`
    : "/admin/riders/notifications";
  const res = await apiRequest(endpoint);
  return res?.data || { notifications: [], unreadCount: 0 };
}

export async function markAdminRiderNotificationRead(id) {
  return apiRequest(`/admin/riders/notifications/${id}/read`, { method: "PATCH" });
}
