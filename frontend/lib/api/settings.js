import { apiRequest } from "./client";

/**
 * Public: Get live restaurant settings, shop status, timings, over order, chef and owner.
 */
export async function getPublicRestaurantSettings() {
  try {
    const response = await apiRequest("/settings", {
      method: "GET",
    });
    return response?.data || null;
  } catch (err) {
    console.error("Failed to load restaurant settings:", err);
    return null;
  }
}
