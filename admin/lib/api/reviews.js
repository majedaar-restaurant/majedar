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
  const reviewsList = Array.isArray(data) ? data : data?.reviews;
  if (!Array.isArray(reviewsList)) {
    throw new Error("The reviews API returned an invalid response.");
  }

  const total = data.total ?? data.pagination?.totalReviews ?? reviewsList.length;
  const limit = data.limit ?? data.pagination?.limit ?? reviewsList.length;
  return {
    reviews: reviewsList,
    total,
    page: data.page ?? data.pagination?.page ?? 1,
    limit,
    totalPages:
      data.totalPages ??
      data.pagination?.totalPages ??
      Math.max(1, Math.ceil(total / (limit || 1))),
  };
}

export async function deleteAdminReview(id) {
  const res = await apiRequest(`/admin/reviews/${id}`, {
    method: "DELETE",
  });
  return res?.data;
}
