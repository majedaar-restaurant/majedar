"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader, useToast } from "@/components/ui";
import { getDiscountOverview, getAdminDiscounts, toggleDiscountStatus } from "@/lib/api/discounts";
import { getAdminBanners, toggleBannerStatus } from "@/lib/api/banners";
import styles from "./offers.module.css";

export default function OffersOverviewPage() {
  const [stats, setStats] = useState(null);
  const [recentDiscounts, setRecentDiscounts] = useState([]);
  const [activeBanners, setActiveBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewData, discountsData, bannersData] = await Promise.all([
        getDiscountOverview(),
        getAdminDiscounts({ limit: 5 }),
        getAdminBanners(),
      ]);
      setStats(overviewData);
      setRecentDiscounts(discountsData?.discounts || []);
      setActiveBanners(bannersData || []);
    } catch (err) {
      toast(err.message || "Failed to load offers overview", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleDiscount = async (id) => {
    try {
      await toggleDiscountStatus(id);
      toast("Discount status updated", "success");
      loadData();
    } catch (err) {
      toast(err.message || "Failed to toggle discount", "danger");
    }
  };

  const handleToggleBanner = async (id) => {
    try {
      await toggleBannerStatus(id);
      toast("Banner status updated", "success");
      loadData();
    } catch (err) {
      toast(err.message || "Failed to toggle banner", "danger");
    }
  };

  return (
    <div className={`${styles.page} space-y-6`}>
      <PageHeader
        title="Offers & Discounts"
        description="Manage promotional banners, automatic discounts, and custom coupon codes."
        action={
          <div className="flex items-center gap-3">
            <Link href="/dashboard/offers/banners" className="btn btn-secondary">
              Manage Banners
            </Link>
            <Link href="/dashboard/offers/discounts/create" className="btn btn-primary">
              + Create Discount
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white border border-stone-200/90 rounded-2xl shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Active Discounts
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-[#11261B]">
              {loading ? "..." : stats?.activeDiscounts ?? 0}
            </h3>
            <span className="text-xs text-stone-500">
              of {stats?.totalDiscounts ?? 0} total
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Automatic: <strong>{stats?.activeAutomatic ?? 0}</strong></span>
            <span>Coupons: <strong>{stats?.activeCoupons ?? 0}</strong></span>
          </div>
        </div>

        <div className="card p-5 bg-white border border-stone-200/90 rounded-2xl shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Active Banners
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-[#11261B]">
              {loading ? "..." : activeBanners.filter((b) => b.isActive).length}
            </h3>
            <span className="text-xs text-stone-500">
              {activeBanners.length} total banners
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
            <Link href="/dashboard/offers/banners" className="text-[#C85A17] font-bold hover:underline">
              View banner slider →
            </Link>
          </div>
        </div>

        <div className="card p-5 bg-white border border-stone-200/90 rounded-2xl shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Total Redemptions
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-[#11261B]">
              {loading ? "..." : stats?.totalRedemptions ?? 0}
            </h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              Orders
            </span>
          </div>
        </div>

        <div className="card p-5 bg-white border border-stone-200/90 rounded-2xl shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Customer Savings Given
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-[#1B3B2B]">
              ₹{loading ? "..." : Number(stats?.totalDiscountGiven || 0).toLocaleString("en-IN")}
            </h3>
            <span className="text-xs text-[#C85A17] bg-[#FFF5EE] px-2 py-0.5 rounded-full font-bold">
              Total
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Discounts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <h2 className="font-bold text-base text-[#11261B]">Active & Recent Discounts</h2>
              <Link href="/dashboard/offers/discounts" className="text-xs font-bold text-[#C85A17] hover:underline">
                View All ({stats?.totalDiscounts || 0}) →
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center text-stone-400">Loading discounts...</div>
            ) : recentDiscounts.length === 0 ? (
              <div className="py-10 text-center text-stone-500">
                <p>No discounts created yet.</p>
                <Link
                  href="/dashboard/offers/discounts/create"
                  className="btn btn-primary inline-flex mt-3 text-xs"
                >
                  Create Your First Discount
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {recentDiscounts.map((discount) => {
                  const isExpired = discount.expiryDate && new Date(discount.expiryDate) < new Date();
                  return (
                    <div key={discount._id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#11261B] truncate">{discount.name}</h4>
                          {discount.method === "coupon" ? (
                            <span className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {discount.couponCode}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Automatic
                            </span>
                          )}
                          <span className="text-[10px] font-extrabold text-[#C85A17] bg-[#FFF5EE] px-2 py-0.5 rounded">
                            {discount.discountType === "percentage"
                              ? `${discount.discountValue}% OFF`
                              : `₹${discount.discountValue} OFF`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                          <span>
                            Applicability:{" "}
                            <strong className="text-stone-700 capitalize">
                              {discount.applicability.replace("_", " ")}
                            </strong>
                          </span>
                          <span>·</span>
                          <span>Used: <strong>{discount.usageCount || 0}</strong> times</span>
                          {discount.expiryDate && (
                            <>
                              <span>·</span>
                              <span className={isExpired ? "text-rose-600 font-bold" : ""}>
                                {isExpired ? "Expired" : `Expires ${new Date(discount.expiryDate).toLocaleDateString()}`}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleDiscount(discount._id)}
                          className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${
                            discount.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200"
                          }`}
                        >
                          {discount.isActive ? "Active" : "Inactive"}
                        </button>
                        <Link
                          href={`/dashboard/offers/discounts/${discount._id}/edit`}
                          className="px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Promotional Banners Preview */}
        <div className="space-y-4">
          <div className="card bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <h2 className="font-bold text-base text-[#11261B]">Promotional Banners</h2>
              <Link href="/dashboard/offers/banners" className="text-xs font-bold text-[#C85A17] hover:underline">
                Manage ({activeBanners.length}) →
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-stone-400">Loading banners...</div>
            ) : activeBanners.length === 0 ? (
              <div className="py-8 text-center text-stone-500">
                <p className="text-xs mb-3">No promotional banners uploaded yet.</p>
                <Link href="/dashboard/offers/banners" className="btn btn-secondary text-xs">
                  Upload Promotional Banner
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {activeBanners.slice(0, 3).map((banner) => (
                  <div
                    key={banner._id}
                    className="border border-stone-200/80 rounded-xl overflow-hidden bg-[#FAF8F5] p-2"
                  >
                    {/* Consistent rectangular aspect-ratio preview container with object-fit: contain */}
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-stone-900/5 flex items-center justify-center relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={banner.image?.url}
                        alt={banner.title || "Promotional banner"}
                        className="w-full h-full object-contain"
                      />
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full border shadow-2xs ${
                          banner.isActive
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-stone-600 text-white border-stone-700"
                        }`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mt-2 px-1 flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-800 truncate">
                        {banner.title || "Untitled Banner"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleBanner(banner._id)}
                        className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 underline"
                      >
                        {banner.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
