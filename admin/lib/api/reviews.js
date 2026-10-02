import { apiRequest } from "./client";

export async function getAdminReviews(params = {}) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "" && v !== "all") {
      query.set(k, String(v));
    }
  }
  const queryString = query.toString();
  const endpoint = `/admin/reviews${queryString ? `?${queryString}` : ""}`;
  const res = await apiRequest(endpoint);
  const data = res?.data;
  if (!data) return [];
  const reviewsList = Array.isArray(data) ? data : (data.reviews || []);
  reviewsList.total = data.total ?? data.pagination?.totalReviews ?? reviewsList.length;
  reviewsList.page = data.page ?? data.pagination?.page ?? 1;
  reviewsList.limit = data.limit ?? data.pagination?.limit ?? reviewsList.length;
  reviewsList.totalPages = data.pagination?.totalPages ?? 1;
  reviewsList.reviews = reviewsList;
  return reviewsList;
}

export async function deleteAdminReview(id) {
  const res = await apiRequest(`/admin/reviews/${id}`, {
    method: "DELETE",
  });
  return res?.data;
}
