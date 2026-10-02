import { apiRequest } from "./client";

export async function getAdminMessages(params = {}) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "" && v !== "all") {
      query.set(k, String(v));
    }
  }
  const qs = query.toString();
  const endpoint = `/admin/messages${qs ? `?${qs}` : ""}`;
  const res = await apiRequest(endpoint);
  const data = res?.data;
  if (!data) return [];
  const messagesList = Array.isArray(data) ? data : (data.messages || []);
  messagesList.total = data.total ?? messagesList.length;
  messagesList.page = data.page ?? 1;
  messagesList.limit = data.limit ?? messagesList.length;
  messagesList.totalPages = data.totalPages ?? 1;
  messagesList.messages = messagesList;
  return messagesList;
}

export async function getAdminMessageById(id) {
  const res = await apiRequest(`/admin/messages/${id}`);
  return res?.data;
}

export async function updateAdminMessageStatus(id, status) {
  const res = await apiRequest(`/admin/messages/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return res?.data;
}

export async function getAdminUnreadMessageCount() {
  const res = await apiRequest("/admin/messages/unread-count");
  return res?.data?.count || 0;
}
