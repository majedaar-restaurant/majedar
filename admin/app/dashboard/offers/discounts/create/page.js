"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, useToast } from "@/components/ui";
import { createDiscount } from "@/lib/api/discounts";
import { getAdminCategories } from "@/lib/api/categories";
import { getAdminMenu, normalizeAdminMenuItems } from "@/lib/api/menu";
import styles from "../../offers.module.css";

export default function CreateDiscountPage() {
  const router = useRouter();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // "percentage" | "flat"
  const [discountValue, setDiscountValue] = useState("");
  const [method, setMethod] = useState("automatic"); // "automatic" | "coupon"
  const [couponCode, setCouponCode] = useState("");
  const [applicability, setApplicability] = useState("entire_menu"); // "entire_menu" | "categories" | "products"

  // Selected categories and products
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(new Set());
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());

  // Search & Filter for Categories & Products Selection UI
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  // Additional Conditions
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscountLimit, setMaxDiscountLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [totalUsageLimit, setTotalUsageLimit] = useState("");
  const [perCustomerUsageLimit, setPerCustomerUsageLimit] = useState("");
  const [isActive, setIsActive] = useState(true);

  const loadProducts = async () => {
    setLoadingProducts(true);
    setProductsError("");
    try {
      const menuItems = await getAdminMenu();
      setProducts(normalizeAdminMenuItems(menuItems));
    } catch (err) {
      setProducts([]);
      setProductsError(err.message || "Failed to load menu products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    async function loadCategories() {
      setLoadingData(true);
      try {
        const categoryList = await getAdminCategories();
        setCategories(Array.isArray(categoryList) ? categoryList : []);
      } catch (err) {
        toast(err.message || "Failed to load categories", "danger");
      } finally {
        setLoadingData(false);
      }
    }

    loadCategories();
    loadProducts();
  }, [toast]);

  // Filtered categories in selection interface
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase().trim();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  // Filtered products in selection interface
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== "all") {
        const catId = p.category?._id;
        if (String(catId) !== productCategoryFilter) return false;
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase().trim();
        return p.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, productCategoryFilter, productSearch]);

  // Category toggle handlers
  const handleToggleCategory = (id) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllCategories = () => {
    setSelectedCategoryIds(new Set(categories.map((c) => c._id)));
  };

  const handleClearAllCategories = () => {
    setSelectedCategoryIds(new Set());
  };

  // Product toggle handlers
  const handleToggleProduct = (id) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllProducts = () => {
    setSelectedProductIds(new Set(filteredProducts.map((p) => p._id)));
  };

  const handleClearAllProducts = () => {
    setSelectedProductIds(new Set());
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

      await createDiscount(payload);
      toast("Discount created successfully!", "success");
      router.push("/dashboard/offers/discounts");
    } catch (err) {
      toast(err.message || "Failed to create discount", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${styles.page} space-y-6 max-w-4xl mx-auto pb-16`}>
      <PageHeader
        title="Create New Discount"
        description=""
        action={
          <Link href="/dashboard/offers/discounts" className="btn btn-secondary">
            ← Cancel
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Basic Information */}
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
                placeholder="e.g. Weekend Biryani Feast or WELCOME50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Internal Description (Optional)
              </label>
              <input
                type="text"
                placeholder="Internal notes on campaign goals, validity conditions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            {/* Discount Type */}
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

            {/* Discount Value */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Discount Value * {discountType === "percentage" ? "(%)" : "(₹)"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  placeholder={discountType === "percentage" ? "20 (for 20% OFF)" : "50 (for ₹50 OFF)"}
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

        {/* SECTION 2: Discount Application Method */}
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
                Automatically calculates and applies to the customer.
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
                Coupon Code * (Uppercase, alphanumeric)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="e.g. MAJEDAR50, WEEKEND20, WELCOME100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  required
                  className="font-mono uppercase font-bold tracking-wider w-full sm:w-72 px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B3B2B]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const rnd = "MAJ" + Math.floor(1000 + Math.random() * 9000);
                    setCouponCode(rnd);
                  }}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  Generate Code
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Applicability */}
        <div className="card bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h2 className="font-bold text-base text-[#11261B]">
              3. Discount Applicability
            </h2>
          </div>

          {/* Three Options Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setApplicability("entire_menu")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                applicability === "entire_menu"
                  ? "border-[#1B3B2B] bg-[#E3EFE8]/40 ring-1 ring-[#1B3B2B]"
                  : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
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
                  : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
              }`}
            >
              <div className="font-bold text-sm text-[#11261B] mb-0.5">
                2. Select Categories ({selectedCategoryIds.size})
              </div>
            </button>

            <button
              type="button"
              onClick={() => setApplicability("products")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                applicability === "products"
                  ? "border-[#1B3B2B] bg-[#E3EFE8]/40 ring-1 ring-[#1B3B2B]"
                  : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
              }`}
            >
              <div className="font-bold text-sm text-[#11261B] mb-0.5">
                3. Individual Products ({selectedProductIds.size})
              </div>
            </button>
          </div>

          {/* Sub-UI for Select Categories */}
          {applicability === "categories" && (
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="w-full sm:w-64">
                  <input
                    type="search"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#1B3B2B]">
                    {selectedCategoryIds.size} of {categories.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllCategories}
                    className="font-semibold text-stone-600 hover:text-stone-900 underline ml-2"
                  >
                    Select All
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={handleClearAllCategories}
                    className="font-semibold text-rose-600 hover:text-rose-800 underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {loadingData ? (
                <div className="py-6 text-center text-xs text-stone-400">Loading categories...</div>
              ) : filteredCategories.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-500">No categories found.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-2 bg-stone-50/60 rounded-xl border border-stone-200">
                  {filteredCategories.map((cat) => {
                    const isSelected = selectedCategoryIds.has(cat._id);
                    return (
                      <label
                        key={cat._id}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer select-none text-xs transition-colors ${
                          isSelected
                            ? "bg-white border-[#1B3B2B] shadow-2xs font-bold text-[#11261B]"
                            : "bg-white/60 border-stone-200 text-stone-700 hover:bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleCategory(cat._id)}
                          className="accent-[#1B3B2B] rounded"
                        />
                        <span className="truncate">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Sub-UI for Select Individual Products */}
          {applicability === "products" && (
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="search"
                    placeholder="Search dish by name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full sm:w-60 px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#1B3B2B]"
                  />
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs border border-stone-200 rounded-lg bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#1B3B2B]">
                    {selectedProductIds.size} of {products.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllProducts}
                    className="font-semibold text-stone-600 hover:text-stone-900 underline ml-2"
                  >
                    Select All Visible
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={handleClearAllProducts}
                    className="font-semibold text-rose-600 hover:text-rose-800 underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {loadingProducts ? (
                <div className="py-8 text-center text-xs text-stone-400">Loading menu products...</div>
              ) : productsError ? (
                <div className="py-8 text-center text-xs text-rose-600">
                  <p>{productsError}</p>
                  <button
                    type="button"
                    onClick={loadProducts}
                    className="mt-3 font-semibold text-[#1B3B2B] underline"
                  >
                    Try again
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500">No dishes match filter.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto p-2 bg-stone-50/60 rounded-xl border border-stone-200">
                  {filteredProducts.map((p) => {
                    const isSelected = selectedProductIds.has(p._id);
                    const catName = p.category?.name || "Category";
                    const priceLabel =
                      p.pricingType === "half-full"
                        ? `₹${p.halfPrice} / ₹${p.fullPrice}`
                        : `₹${p.price}`;

                    return (
                      <label
                        key={p._id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                          isSelected
                            ? "bg-white border-[#1B3B2B] shadow-2xs"
                            : "bg-white/80 border-stone-200 hover:bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleProduct(p._id)}
                          className="accent-[#1B3B2B] rounded flex-none"
                        />
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 flex-none border border-stone-200">
                          {p.image?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image.url}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                              Food
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-[#11261B] truncate">{p.name}</div>
                          <div className="text-[10px] text-stone-400 flex items-center gap-2">
                            <span>{catName}</span>
                            <span>·</span>
                            <span className="font-semibold text-stone-700">{priceLabel}</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 4: Additional Discount Conditions */}
        <div className="card bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-base text-[#11261B] border-b border-stone-100 pb-2">
            4. Conditions & Limits (Optional)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Minimum Order Amount */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Minimum Food Subtotal (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            {/* Maximum Discount Limit */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Maximum Discount Cap (₹)
              </label>
              <input
                type="number"
                placeholder="No cap limit"
                value={maxDiscountLimit}
                onChange={(e) => setMaxDiscountLimit(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            {/* Start Date & Time */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            {/* Expiry Date & Time */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Expiry Date & Time
              </label>
              <input
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            {/* Total Usage Limit */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Total Redemptions Limit
              </label>
              <input
                type="number"
                placeholder="Unlimited"
                value={totalUsageLimit}
                onChange={(e) => setTotalUsageLimit(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            {/* Per-Customer Usage Limit */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Per-Customer Usage Limit
              </label>
              <input
                type="number"
                placeholder="Unlimited per customer"
                value={perCustomerUsageLimit}
                onChange={(e) => setPerCustomerUsageLimit(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            {/* Active / Inactive Toggle */}
            <div className="sm:col-span-2 pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-stone-800">Initial Status</span>
                <p className="text-[11px] text-stone-500">
                  {isActive ? "Discount will be live and active upon saving" : "Created in inactive state"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Link href="/dashboard/offers/discounts" className="btn btn-secondary px-6">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary px-8 py-3 text-sm font-bold shadow-md"
          >
            {submitting ? "Saving Discount..." : "Create & Activate Discount"}
          </button>
        </div>
      </form>
    </div>
  );
}
