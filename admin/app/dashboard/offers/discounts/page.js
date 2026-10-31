"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PageHeader, useToast } from "@/components/ui";
import {
  getAdminDiscounts,
  toggleDiscountStatus,
  deleteDiscount,
} from "@/lib/api/discounts";
import styles from "../offers.module.css";

const STATUS_FILTERS = [
  { id: "all", label: "All Discounts" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
  { id: "expired", label: "Expired" },
];

const METHOD_FILTERS = [
  { id: "all", label: "All Methods" },
  { id: "automatic", label: "Automatic" },
  { id: "coupon", label: "Coupon-based" },
];

export default function AdminDiscountsListPage() {
  const [discounts, setDiscounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [search, setSearch] = useState("");

  const toast = useToast();

  const fetchDiscounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminDiscounts({
        status: statusFilter,
        method: methodFilter,
        search,
        page,
        limit: 15,
      });
      setDiscounts(data?.discounts || []);
      setTotal(data?.total || 0);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      toast(err.message || "Failed to load discounts", "danger");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, methodFilter, search, page, toast]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleToggle = async (id) => {
    try {
      await toggleDiscountStatus(id);
      toast("Discount status updated", "success");
      fetchDiscounts();
    } catch (err) {
      toast(err.message || "Failed to update status", "danger");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete discount "${name}"? Previously placed orders will preserve their historical records.`)) {
      return;
    }
    try {
      await deleteDiscount(id);
      toast("Discount deleted successfully", "success");
      fetchDiscounts();
    } catch (err) {
      toast(err.message || "Failed to delete discount", "danger");
    }
  };

  return (
    <div className={`${styles.page} space-y-6`}>
      <PageHeader
        title="Discounts & Coupons"
        description="Configure automatic and coupon-based price reductions for entire menu, categories, or specific products."
        action={
          <div className="flex items-center gap-3">
            <Link href="/dashboard/offers" className="btn btn-secondary">
              ← Offers Overview
            </Link>
            <Link href="/dashboard/offers/discounts/create" className="btn btn-primary">
              + Create Discount
            </Link>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setStatusFilter(f.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  statusFilter === f.id
                    ? "bg-[#1B3B2B] text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-64">
            <input
              type="search"
              placeholder="Search discount or code..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>
        </div>

        {/* Method selector */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-500 font-semibold">Filter Method:</span>
          {METHOD_FILTERS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMethodFilter(m.id);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                methodFilter === m.id
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {m.label}
            </button>
          ))}
          <span className="ml-auto text-stone-400 text-xs">
            Showing {discounts.length} of {total} records
          </span>
        </div>
      </div>

      {/* Discounts Table */}
      <div className="card bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Discount Name</th>
                <th className="py-3 px-3">Type & Value</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Applicability</th>
                <th className="py-3 px-3">Validity</th>
                <th className="py-3 px-3">Usage</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    Loading discount records...
                  </td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    No discounts found matching the selected filters.
                  </td>
                </tr>
              ) : (
                discounts.map((discount) => {
                  const now = new Date();
                  const isExpired = discount.expiryDate && new Date(discount.expiryDate) < now;
                  const isUpcoming = discount.startDate && new Date(discount.startDate) > now;
                  const isLimitReached =
                    typeof discount.totalUsageLimit === "number" &&
                    discount.totalUsageLimit > 0 &&
                    (discount.usageCount || 0) >= discount.totalUsageLimit;

                  let applicabilityLabel = "Entire Menu";
                  if (discount.applicability === "categories") {
                    const count = discount.categoryIds?.length || 0;
                    applicabilityLabel = `${count} Categor${count === 1 ? "y" : "ies"}`;
                  } else if (discount.applicability === "products") {
                    const count = discount.productIds?.length || 0;
                    applicabilityLabel = `${count} Product${count === 1 ? "" : "s"}`;
                  }

                  return (
                    <tr key={discount._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-sm text-[#11261B]">{discount.name}</div>
                        {discount.description && (
                          <div className="text-[11px] text-stone-400 line-clamp-1">
                            {discount.description}
                          </div>
                        )}
                        {discount.minOrderAmount > 0 && (
                          <span className="text-[10px] text-stone-500">
                            Min Order: ₹{discount.minOrderAmount}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-extrabold text-[#C85A17] bg-[#FFF5EE] px-2 py-0.5 rounded border border-[#FED7AA] inline-block">
                          {discount.discountType === "percentage"
                            ? `${discount.discountValue}% OFF`
                            : `₹${discount.discountValue} OFF`}
                        </span>
                        {discount.maxDiscountLimit > 0 && (
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            Up to ₹{discount.maxDiscountLimit}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {discount.method === "coupon" ? (
                          <div>
                            <span className="font-mono text-[11px] font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                              {discount.couponCode}
                            </span>
                            <div className="text-[10px] text-stone-400 mt-0.5">Manual Coupon</div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Automatic
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-stone-800 capitalize">
                          {applicabilityLabel}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {discount.expiryDate ? (
                          <div>
                            <span className={isExpired ? "text-rose-600 font-bold" : "text-stone-700"}>
                              {new Date(discount.expiryDate).toLocaleDateString()}
                            </span>
                            {isExpired && (
                              <span className="block text-[10px] font-bold text-rose-600">
                                Expired
                              </span>
                            )}
                            {isUpcoming && (
                              <span className="block text-[10px] font-bold text-amber-600">
                                Starts {new Date(discount.startDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400">No Expiry</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div>
                          <strong className="text-stone-800">{discount.usageCount || 0}</strong>
                          {discount.totalUsageLimit && (
                            <span className="text-stone-400"> / {discount.totalUsageLimit}</span>
                          )}
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            Saved ₹{Number(discount.totalDiscountGiven || 0).toLocaleString()}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {isExpired ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Expired
                          </span>
                        ) : isLimitReached ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                            Limit Reached
                          </span>
                        ) : discount.isActive ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggle(discount._id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                              discount.isActive
                                ? "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            }`}
                          >
                            {discount.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <Link
                            href={`/dashboard/offers/discounts/${discount._id}/edit`}
                            className="px-2.5 py-1 text-[11px] font-bold text-stone-600 hover:text-stone-900 border border-stone-200 rounded hover:bg-stone-50"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(discount._id, discount.name)}
                            className="text-rose-600 hover:text-rose-800 font-bold p-1"
                            title="Delete discount"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-stone-200 rounded disabled:opacity-40 hover:bg-stone-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border border-stone-200 rounded disabled:opacity-40 hover:bg-stone-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
