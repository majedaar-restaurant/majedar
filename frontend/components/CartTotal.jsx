"use client";

import { useContext } from "react";
import { ShopContext } from "../contexts/ShopContext";
import Title from "./Title";

const CartTotal = ({ customDeliveryFee = null }) => {
  const {
    currency,
    deliveryFee,
    selectedDeliveryTier,
    getCartAmount,
    pricingSummary,
    isPricingLoading,
  } = useContext(ShopContext);

  // If backend authoritative pricing summary is present, use it!
  const hasBackendPricing = pricingSummary && pricingSummary.foodSubtotal > 0;

  const subtotal = hasBackendPricing
    ? pricingSummary.foodSubtotal
    : getCartAmount();

  const discountAmount = hasBackendPricing ? pricingSummary.discountAmount : 0;
  const eligibleSubtotal = hasBackendPricing ? pricingSummary.eligibleSubtotal : 0;
  const discountDetails = hasBackendPricing ? pricingSummary.discount : null;

  const effectiveDeliveryFee =
    typeof customDeliveryFee === "number"
      ? customDeliveryFee
      : hasBackendPricing
        ? pricingSummary.deliveryFee
        : subtotal > 0
          ? deliveryFee
          : 0;

  const gst = hasBackendPricing
    ? pricingSummary.gst
    : subtotal > 0
      ? Math.round(Math.max(0, subtotal - discountAmount) * 0.05 * 100) / 100
      : 0;

  const grandTotal = hasBackendPricing
    ? Math.round((pricingSummary.finalFoodAmount + gst + effectiveDeliveryFee) * 100) / 100
    : subtotal > 0
      ? Math.round((Math.max(0, subtotal - discountAmount) + gst + effectiveDeliveryFee) * 100) / 100
      : 0;

  const totalSavings = hasBackendPricing ? pricingSummary.totalSavings : discountAmount;

  const tierLabel = selectedDeliveryTier?.label
    ? ` (${selectedDeliveryTier.label})`
    : "";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="text-xl sm:text-2xl font-bold">
          <Title text1={"BILLING"} text2={"SUMMARY"} />
        </div>
        {isPricingLoading && (
          <span className="text-[10px] text-stone-400 animate-pulse font-semibold">
            Updating...
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5 mt-3 text-xs sm:text-sm">
        {/* Items Subtotal */}
        <div className="flex justify-between text-stone-600">
          <p>Items Subtotal</p>
          <p className="font-semibold text-stone-800">
            {currency}{subtotal.toFixed(2)}
          </p>
        </div>

        {/* Partial Eligible Subtotal Notice (if applicable) */}
        {eligibleSubtotal > 0 && eligibleSubtotal < subtotal && discountAmount > 0 && (
          <div className="flex justify-between text-[11px] text-stone-500 pl-2 border-l-2 border-amber-300">
            <p>Discount-eligible items subtotal</p>
            <p className="font-medium text-stone-700">
              {currency}{eligibleSubtotal.toFixed(2)}
            </p>
          </div>
        )}

        {/* Applied Discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-[#C85A17] font-semibold bg-[#FFF5EE] -mx-2 px-2 py-1 rounded-lg border border-[#FED7AA]/60">
            <div className="flex items-center gap-1.5 truncate pr-2">
              <span className="truncate">
                {discountDetails?.code
                  ? `Coupon (${discountDetails.code})`
                  : discountDetails?.name || "Offer Discount"}
              </span>
            </div>
            <p className="font-extrabold flex-none">
              -{currency}{discountAmount.toFixed(2)}
            </p>
          </div>
        )}

        {/* GST */}
        <div className="flex justify-between text-stone-600">
          <p>GST (5% on food items)</p>
          <p className="font-semibold text-stone-800">
            {currency}{gst.toFixed(2)}
          </p>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between text-stone-600">
          <p>Delivery Fee{tierLabel}</p>
          <p className="font-semibold text-stone-800">
            {currency}{effectiveDeliveryFee.toFixed(2)}
          </p>
        </div>

        <hr className="border-stone-100 my-1" />

        {/* Final Estimated Total */}
        <div className="flex justify-between font-bold text-sm sm:text-base text-[#11261B]">
          <p>Estimated Total</p>
          <p className="text-[#1B3B2B] font-extrabold text-base sm:text-lg">
            {currency}{grandTotal.toFixed(2)}
          </p>
        </div>

        {/* Total Savings Highlight Banner */}
        {totalSavings > 0 && (
          <div className="mt-1 bg-emerald-50 border border-emerald-200/80 rounded-xl px-3 py-1.5 text-center text-xs text-emerald-800 font-bold flex items-center justify-center gap-1.5">
            <span>You save {currency}{totalSavings.toFixed(2)} on this order!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTotal;
