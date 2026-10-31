import { apiRequest } from "./client";

/**
 * Customer / Public discount API functions
 */

export async function calculateCartPricing({ items, couponCode = null, deliveryFee = 0 }) {
  const response = await apiRequest("/discounts/calculate", {
    method: "POST",
    body: { items, couponCode, deliveryFee },
  });
  return response?.data || null;
}

export async function validateCoupon({ couponCode, items, deliveryFee = 0 }) {
  const response = await apiRequest("/discounts/validate-coupon", {
    method: "POST",
    body: { couponCode, items, deliveryFee },
  });
  return response?.data || null;
}

export async function getActiveOffers() {
  const response = await apiRequest("/discounts/active", {
    method: "GET",
  });
  return response?.data?.offers || [];
}

