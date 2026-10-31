import { apiRequest } from "./client";

export async function getAdminBanners() {
  const res = await apiRequest("/admin/banners");
  return res?.data?.banners || [];
}

export async function getAdminBannerById(id) {
  const res = await apiRequest(`/admin/banners/${id}`);
  return res?.data?.banner || null;
}

export async function createBanner(formData) {
  const res = await apiRequest("/admin/banners", {
    method: "POST",
    body: formData,
  });
  return res?.data?.banner;
}

export async function updateBanner(id, formData) {
  const res = await apiRequest(`/admin/banners/${id}`, {
    method: "PATCH",
    body: formData,
  });
  return res?.data?.banner;
}

export async function toggleBannerStatus(id) {
  const res = await apiRequest(`/admin/banners/${id}/toggle`, {
    method: "PATCH",
  });
  return res?.data?.banner;
}

export async function deleteBanner(id) {
  const res = await apiRequest(`/admin/banners/${id}`, {
    method: "DELETE",
  });
  return res?.data;
}

