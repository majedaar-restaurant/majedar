export * from "./client";
export * from "./auth";
export * from "./categories";
export * from "./menu";
export * from "./delivery-zones";
export * from "./orders";
export * from "./reviews";
export * from "./payments";
export * from "./riders";
export * from "./settings";
export * from "./discounts";
export * from "./banners";

import * as auth from "./auth";
import * as categories from "./categories";
import * as menu from "./menu";
import * as deliveryZones from "./delivery-zones";
import * as orders from "./orders";
import * as reviews from "./reviews";
import * as payments from "./payments";
import * as riders from "./riders";
import * as settings from "./settings";
import * as discounts from "./discounts";
import * as banners from "./banners";

export const adminApi = {
  auth,
  categories,
  menu,
  deliveryZones,
  orders,
  reviews,
  payments,
  riders,
  settings,
  discounts,
  banners,
};

export default adminApi;


