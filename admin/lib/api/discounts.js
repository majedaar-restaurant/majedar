import { apiRequest } from "./client";

export async function getAdminDiscounts(params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.method && params.method !== "all") query.set("method", params.method);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);

  const qs = query.toString();
  const res = await apiRequest(`/admin/discounts${qs ? `?${qs}` : ""}`);
  return res?.data || { discounts: [], total: 0, page: 1, totalPages: 1 };
}

export async function getDiscountOverview() {
  const res = await apiRequest("/admin/discounts/overview");
  return res?.data || null;
}

export async function getAdminDiscountById(id) {
  const res = await apiRequest(`/admin/discounts/${id}`);
  return res?.data?.discount || null;
}

export async function createDiscount(data) {
  const res = await apiRequest("/admin/discounts", {
    method: "POST",
    body: data,
  });
  return res?.data?.discount;
}

export async function updateDiscount(id, data) {
  const res = await apiRequest(`/admin/discounts/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res?.data?.discount;
}

export async function toggleDiscountStatus(id) {
  const res = await apiRequest(`/admin/discounts/${id}/toggle`, {
    method: "PATCH",
  });
  return res?.data?.discount;
}

export async function deleteDiscount(id) {
  const res = await apiRequest(`/admin/discounts/${id}`, {
    method: "DELETE",
  });
  return res?.data;
}

