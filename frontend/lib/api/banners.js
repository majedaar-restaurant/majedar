import { apiRequest } from "./client";

/**
 * Public promotional banners API functions
 */

export async function getActiveBanners() {
  const response = await apiRequest("/banners", {
    method: "GET",
  });
  return response?.data?.banners || [];
}

