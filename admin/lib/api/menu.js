import { apiRequest } from "./client";

export async function getAdminMenu(params = {}) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "" && v !== "all") {
      query.set(k, String(v));
    }
  }
  const queryString = query.toString();
  const endpoint = `/admin/menu${queryString ? `?${queryString}` : ""}`;
  const res = await apiRequest(endpoint);
  if (!Array.isArray(res?.data?.menu)) {
    throw new Error("The menu API returned an invalid products list.");
  }
  return res.data.menu;
}

export function normalizeAdminMenuItems(menuItems) {
  if (!Array.isArray(menuItems)) {
    throw new Error("The menu API returned an invalid products list.");
  }

  return menuItems.map((item) => {
    const id = item?._id ?? item?.id;
    if (!id || typeof item?.name !== "string") {
      throw new Error("A menu item is missing its ID or name.");
    }

    const categoryValue = item.category;
    const categoryId =
      typeof categoryValue === "object" && categoryValue !== null
        ? categoryValue._id ?? categoryValue.id
        : categoryValue;

    return {
      ...item,
      _id: String(id),
      category:
        categoryId == null
          ? null
          : {
              ...(typeof categoryValue === "object" && categoryValue !== null
                ? categoryValue
                : {}),
              _id: String(categoryId),
            },
    };
  });
}

export async function getAdminMenuItem(id) {
  const res = await apiRequest(`/admin/menu/${id}`);
  return res?.data?.item;
}

export async function createMenuItem(data) {
  const res = await apiRequest("/admin/menu", {
    method: "POST",
    body: data,
  });
  return res?.data?.item;
}

export async function updateMenuItem(id, data) {
  const res = await apiRequest(`/admin/menu/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res?.data?.item;
}

export async function deleteMenuItem(id) {
  const res = await apiRequest(`/admin/menu/${id}`, {
    method: "DELETE",
  });
  return res?.data;
}
