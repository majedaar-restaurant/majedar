"use client";

import { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, useToast } from "@/components/ui";
import { getAdminDiscountById, updateDiscount } from "@/lib/api/discounts";
import { getAdminCategories } from "@/lib/api/categories";
import { getAdminMenu } from "@/lib/api/menu";

export default function EditDiscountPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const router = useRouter();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [method, setMethod] = useState("automatic");
  const [couponCode, setCouponCode] = useState("");
  const [applicability, setApplicability] = useState("entire_menu");

  const [selectedCategoryIds, setSelectedCategoryIds] = useState(new Set());
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());

  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscountLimit, setMaxDiscountLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [totalUsageLimit, setTotalUsageLimit] = useState("");
  const [perCustomerUsageLimit, setPerCustomerUsageLimit] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      try {
        const [cats, menuRes, disc] = await Promise.all([
          getAdminCategories(),
          getAdminMenu({ limit: 300 }),
          getAdminDiscountById(id),
        ]);
        setCategories(cats || []);
        setProducts(menuRes?.items || menuRes?.menuItems || []);

        if (disc) {
          setName(disc.name || "");
          setDescription(disc.description || "");
          setDiscountType(disc.discountType || "percentage");
          setDiscountValue(String(disc.discountValue || ""));
          setMethod(disc.method || "automatic");
          setCouponCode(disc.couponCode || "");
          setApplicability(disc.applicability || "entire_menu");

          if (Array.isArray(disc.categoryIds)) {
            setSelectedCategoryIds(
              new Set(disc.categoryIds.map((c) => (typeof c === "object" ? c._id : c)))
            );
          }
          if (Array.isArray(disc.productIds)) {
            setSelectedProductIds(
              new Set(disc.productIds.map((p) => (typeof p === "object" ? p._id : p)))
            );
          }

          setMinOrderAmount(disc.minOrderAmount != null ? String(disc.minOrderAmount) : "");
          setMaxDiscountLimit(disc.maxDiscountLimit != null ? String(disc.maxDiscountLimit) : "");

          if (disc.startDate) {
            const d = new Date(disc.startDate);
            setStartDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
          }
          if (disc.expiryDate) {
            const d = new Date(disc.expiryDate);
            setExpiryDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
          }

          setTotalUsageLimit(disc.totalUsageLimit != null ? String(disc.totalUsageLimit) : "");
          setPerCustomerUsageLimit(disc.perCustomerUsageLimit != null ? String(disc.perCustomerUsageLimit) : "");
          setIsActive(disc.isActive !== false);
        }
      } catch (err) {
        toast(err.message || "Failed to load discount details", "danger");
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [id, toast]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase().trim();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== "all") {
        const catId = typeof p.category === "object" ? p.category?._id : p.category;
        if (catId !== productCategoryFilter) return false;
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase().trim();
        return p.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, productCategoryFilter, productSearch]);

  const handleToggleCategory = (catId) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleToggleProduct = (pId) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(pId)) next.delete(pId);
      else next.add(pId);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast("Please enter a discount name", "danger");
      return;
    }

    const valNum = parseFloat(discountValue);
    if (isNaN(valNum) || valNum <= 0) {
      toast("Please enter a valid positive discount value", "danger");
      return;
    }

    if (discountType === "percentage" && valNum > 100) {
      toast("Percentage discount cannot exceed 100%", "danger");
      return;
    }

    if (method === "coupon" && !couponCode.trim()) {
      toast("Please specify a coupon code for coupon-based discounts", "danger");
      return;
    }

    if (applicability === "categories" && selectedCategoryIds.size === 0) {
      toast("Please select at least one category", "danger");
      return;
    }

    if (applicability === "products" && selectedProductIds.size === 0) {
      toast("Please select at least one product", "danger");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        discountType,
        discountValue: valNum,
        method,
        couponCode: method === "coupon" ? couponCode.trim().toUpperCase() : undefined,
        applicability,
        categoryIds: applicability === "categories" ? Array.from(selectedCategoryIds) : [],
        productIds: applicability === "products" ? Array.from(selectedProductIds) : [],
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
        maxDiscountLimit: maxDiscountLimit ? parseFloat(maxDiscountLimit) : null,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        totalUsageLimit: totalUsageLimit ? parseInt(totalUsageLimit, 10) : null,
        perCustomerUsageLimit: perCustomerUsageLimit ? parseInt(perCustomerUsageLimit, 10) : null,
        isActive,
      };

      await updateDiscount(id, payload);
      toast("Discount updated successfully!", "success");
      router.push("/dashboard/offers/discounts");
    } catch (err) {
      toast(err.message || "Failed to update discount", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <PageHeader
        title={`Edit: ${name || "Discount"}`}
        description="Update discount rules, coupon code, applicability, and validation limits."
        action={
          <Link href="/dashboard/offers/discounts" className="btn btn-secondary">
            ← Back to Discounts
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-base text-[#11261B] border-b border-stone-100 pb-2">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Discount Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Internal Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Discount Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountType("percentage")}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    discountType === "percentage"
                      ? "bg-[#1B3B2B] text-white border-[#1B3B2B] shadow-2xs"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType("flat")}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    discountType === "flat"
                      ? "bg-[#1B3B2B] text-white border-[#1B3B2B] shadow-2xs"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  Flat Amount (₹)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Discount Value * {discountType === "percentage" ? "(%)" : "(₹)"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B3B2B]"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-stone-400 pointer-events-none">
                  {discountType === "percentage" ? "%" : "₹"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Method */}
        <div className="card bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-base text-[#11261B] border-b border-stone-100 pb-2">
            2. Application Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setMethod("automatic")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                method === "automatic"
                  ? "border-[#1B3B2B] bg-[#E3EFE8]/30"
                  : "border-stone-200 hover:border-stone-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <input
                  type="radio"
                  name="method"
                  checked={method === "automatic"}
                  onChange={() => setMethod("automatic")}
                  className="accent-[#1B3B2B]"
                />
                <span className="font-bold text-sm text-[#11261B]">Automatic Discount</span>
              </div>
              <p className="text-xs text-stone-500 pl-5">
                Automatically calculates and applies to cart.
              </p>
            </div>

            <div
              onClick={() => setMethod("coupon")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                method === "coupon"
                  ? "border-[#1B3B2B] bg-[#E3EFE8]/30"
                  : "border-stone-200 hover:border-stone-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <input
                  type="radio"
                  name="method"
                  checked={method === "coupon"}
                  onChange={() => setMethod("coupon")}
                  className="accent-[#1B3B2B]"
                />
                <span className="font-bold text-sm text-[#11261B]">Coupon Code</span>
              </div>
              <p className="text-xs text-stone-500 pl-5">
                Customer manually inputs code in cart and clicks Apply.
              </p>
            </div>
          </div>

          {method === "coupon" && (
            <div className="pt-3 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Coupon Code * (Uppercase)
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                required
                className="font-mono uppercase font-bold tracking-wider w-full sm:w-72 px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Applicability */}
        <div className="card bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h2 className="font-bold text-base text-[#11261B]">3. Applicability</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setApplicability("entire_menu")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                applicability === "entire_menu"
                  ? "border-[#1B3B2B] bg-[#E3EFE8]/40 ring-1 ring-[#1B3B2B]"
                  : "border-stone-200 bg-stone-50/50"
              }`}
            >
              <div className="font-bold text-sm text-[#11261B] mb-0.5">1. Entire Menu</div>
            </button>

            <button
              type="button"
              onClick={() => setApplicability("categories")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                applicability === "categories"
                  ? "border-[#1B3B2B] bg-[#E3EFE8]/40 ring-1 ring-[#1B3B2B]"
                  : "border-stone-200 bg-stone-50/50"
              }`}
            >
              <div className="font-bold text-sm text-[#11261B] mb-0.5">
                2. Categories ({selectedCategoryIds.size})
              </div>
              <p className="text-[11px] text-stone-500">Specific categories selected.</p>
            </button>

            <button
              type="button"
              onClick={() => setApplicability("products")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                applicability === "products"
                  ? "border-[#1B3B2B] bg-[#E3EFE8]/40 ring-1 ring-[#1B3B2B]"
                  : "border-stone-200 bg-stone-50/50"
              }`}
            >
              <div className="font-bold text-sm text-[#11261B] mb-0.5">
                3. Products ({selectedProductIds.size})
              </div>
              <p className="text-[11px] text-stone-500">Specific individual dishes.</p>
            </button>
          </div>

          {applicability === "categories" && (
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="search"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg w-60"
                />
                <span className="text-xs font-bold text-[#1B3B2B]">
                  {selectedCategoryIds.size} of {categories.length} selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-2 bg-stone-50/60 rounded-xl border border-stone-200">
                {filteredCategories.map((cat) => (
                  <label
                    key={cat._id}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-xs ${
                      selectedCategoryIds.has(cat._id)
                        ? "bg-white border-[#1B3B2B] font-bold text-[#11261B]"
                        : "bg-white/60 border-stone-200 text-stone-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.has(cat._id)}
                      onChange={() => handleToggleCategory(cat._id)}
                      className="accent-[#1B3B2B]"
                    />
                    <span className="truncate">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {applicability === "products" && (
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="search"
                  placeholder="Search dishes..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg w-60"
                />
                <span className="text-xs font-bold text-[#1B3B2B]">
                  {selectedProductIds.size} of {products.length} selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto p-2 bg-stone-50/60 rounded-xl border border-stone-200">
                {filteredProducts.map((p) => (
                  <label
                    key={p._id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs ${
                      selectedProductIds.has(p._id)
                        ? "bg-white border-[#1B3B2B] shadow-2xs"
                        : "bg-white/80 border-stone-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProductIds.has(p._id)}
                      onChange={() => handleToggleProduct(p._id)}
                      className="accent-[#1B3B2B]"
                    />
                    <div className="truncate flex-1">
                      <div className="font-bold text-[#11261B]">{p.name}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Conditions */}
        <div className="card bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-base text-[#11261B] border-b border-stone-100 pb-2">
            4. Conditions & Limits
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Minimum Food Subtotal (₹)
              </label>
              <input
                type="number"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Maximum Discount Cap (₹)
              </label>
              <input
                type="number"
                value={maxDiscountLimit}
                onChange={(e) => setMaxDiscountLimit(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Total Redemptions Limit
              </label>
              <input
                type="number"
                value={totalUsageLimit}
                onChange={(e) => setTotalUsageLimit(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Per-Customer Limit
              </label>
              <input
                type="number"
                value={perCustomerUsageLimit}
                onChange={(e) => setPerCustomerUsageLimit(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-stone-800">Status</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-600"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Link href="/dashboard/offers/discounts" className="btn btn-secondary px-6">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary px-8 py-3 text-sm font-bold shadow-md"
          >
            {submitting ? "Updating..." : "Save Discount Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

