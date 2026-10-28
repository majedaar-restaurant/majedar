import { apiRequest } from "./client";

/**
 * Customer rating & review API call (1-5 stars with optional comment and optional orderId)
 */
export async function submitReview({ orderId, menuItemId, rating, comment, allowUpdate = false }) {
  const body = {
    menuItemId,
    rating: Number(rating),
  };
  if (orderId) body.orderId = orderId;
  if (comment !== undefined && comment !== null) body.comment = comment.trim();
  if (allowUpdate) body.allowUpdate = true;

  const response = await apiRequest("/reviews", {
    method: "POST",
    body,
  });
  return response?.data?.review || response?.data;
}

export const submitRating = submitReview;

export async function getOrderReviews(orderId) {
  const response = await apiRequest(`/reviews/order/${orderId}`, {
    method: "GET",
  });
  return response?.data?.reviews || [];
}

export async function getMenuItemReviews(menuItemId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/reviews/menu/${menuItemId}?${query}` : `/reviews/menu/${menuItemId}`;
  const response = await apiRequest(endpoint, {
    method: "GET",
  });
  return response?.data || { reviews: [], total: 0 };
}
