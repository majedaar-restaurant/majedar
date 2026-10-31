import {
  isDiscountActiveAndValid,
  isItemEligible,
  calculateDiscountAmount,
  computePricingBreakdown,
  decorateMenuItemsWithDiscounts
} from "../src/services/discount/discount.service.js";

async function runTests() {
  console.log("--- Starting Discount System Unit & Integration Tests ---");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Test Validity Checks
  const now = new Date();
  const activeDiscount = {
    _id: "disc_1",
    name: "20% Off Weekend",
    isActive: true,
    startDate: new Date(now.getTime() - 3600000),
    expiryDate: new Date(now.getTime() + 3600000),
    usageCount: 5,
    totalUsageLimit: 10,
    minOrderAmount: 200
  };

  assert(isDiscountActiveAndValid(activeDiscount, 250).valid === true, "Active discount with subtotal >= minOrder is valid");
  assert(isDiscountActiveAndValid(activeDiscount, 150).valid === false, "Active discount with subtotal < minOrder is invalid");

  const expiredDiscount = { ...activeDiscount, expiryDate: new Date(now.getTime() - 1000) };
  assert(isDiscountActiveAndValid(expiredDiscount, 300).valid === false, "Expired discount is invalid");

  const maxUsageDiscount = { ...activeDiscount, usageCount: 10, totalUsageLimit: 10 };
  assert(isDiscountActiveAndValid(maxUsageDiscount, 300).valid === false, "Discount at usage limit is invalid");

  // 2. Test Eligibility
  const entireMenuDiscount = {
    applicability: "entire_menu"
  };
  assert(isItemEligible(entireMenuDiscount, { _id: "prod_1", category: "cat_1" }) === true, "Entire menu discount covers any item");

  const catDiscount = {
    applicability: "categories",
    categoryIds: ["cat_biryani", "cat_kebabs"]
  };
  assert(isItemEligible(catDiscount, { _id: "prod_1", category: "cat_biryani" }) === true, "Category discount matches valid category");
  assert(isItemEligible(catDiscount, { _id: "prod_2", category: "cat_beverages" }) === false, "Category discount rejects unselected category");

  const prodDiscount = {
    applicability: "products",
    productIds: ["prod_10", "prod_20"]
  };
  assert(isItemEligible(prodDiscount, { _id: "prod_10", category: "cat_biryani" }) === true, "Product discount matches selected product");
  assert(isItemEligible(prodDiscount, { _id: "prod_99", category: "cat_biryani" }) === false, "Product discount rejects unselected product");

  // 3. Test Calculation Logic (Percentage vs Flat, Max Cap)
  const percDiscount = {
    discountType: "percentage",
    discountValue: 20,
    maxDiscountLimit: 100
  };
  assert(calculateDiscountAmount(percDiscount, 400) === 80, "20% of 400 is 80");
  assert(calculateDiscountAmount(percDiscount, 600) === 100, "20% of 600 capped at max limit 100 is 100");

  const flatDiscount = {
    discountType: "flat",
    discountValue: 75
  };
  assert(calculateDiscountAmount(flatDiscount, 200) === 75, "Flat 75 discount on 200 is 75");
  assert(calculateDiscountAmount(flatDiscount, 50) === 50, "Flat 75 discount on 50 is capped at 50 (never negative)");

  // 4. Test Cart Pricing Calculation (GST 5% on discounted food amount, delivery fee)
  // Exact Example from user prompt:
  // Food subtotal = 600, 20% discount = 120, Delivery = 40, Taxes (5% on 480) = 24, Final = 544
  const testItems = [
    {
      menuItem: "biryani_1",
      name: "Chicken Dum Biryani",
      variant: "single",
      quantity: 2,
      unitPrice: 300,
      price: 300,
      subtotal: 600,
      category: "cat_biryani"
    }
  ];

  const disc20 = {
    _id: "disc_20",
    name: "Flat 20% Off",
    discountType: "percentage",
    discountValue: 20,
    applicability: "entire_menu",
    method: "automatic"
  };

  const pricingResult = computePricingBreakdown({
    computedItems: testItems,
    appliedDiscount: disc20,
    deliveryFee: 40
  });

  assert(pricingResult.foodSubtotal === 600, "Items subtotal is 600");
  assert(pricingResult.discountAmount === 120, "Discount amount is 120");
  assert(pricingResult.finalFoodAmount === 480, "Discounted food subtotal is 480");
  assert(pricingResult.gst === 24, "GST is 5% of 480 = 24 (exact prompt requirement)");
  assert(pricingResult.deliveryFee === 40, "Delivery fee is 40");
  assert(pricingResult.total === 544, "Total is 480 + 24 + 40 = 544 (exact prompt requirement)");
  assert(pricingResult.totalSavings === 120, "Total savings is 120");

  // 5. Test Partial Applicability (Category discount on cart with mixed items)
  const mixedItems = [
    {
      menuItem: "biryani_1",
      name: "Biryani",
      variant: "single",
      quantity: 1,
      unitPrice: 300,
      price: 300,
      subtotal: 300,
      category: "cat_biryani"
    },
    {
      menuItem: "coke_1",
      name: "Coke",
      variant: "single",
      quantity: 2,
      unitPrice: 50,
      price: 50,
      subtotal: 100,
      category: "cat_beverage"
    }
  ];

  const biryaniOnlyDiscount = {
    _id: "disc_cat",
    name: "10% Biryani Special",
    discountType: "percentage",
    discountValue: 10,
    applicability: "categories",
    categoryIds: ["cat_biryani"]
  };

  const mixedPricing = computePricingBreakdown({
    computedItems: mixedItems,
    appliedDiscount: biryaniOnlyDiscount,
    deliveryFee: 30
  });

  assert(mixedPricing.foodSubtotal === 400, "Mixed cart foodSubtotal is 400");
  assert(mixedPricing.eligibleSubtotal === 300, "Only biryani subtotal 300 is eligible");
  assert(mixedPricing.discountAmount === 30, "10% discount on 300 is 30");
  assert(mixedPricing.finalFoodAmount === 370, "Discounted food subtotal is 400 - 30 = 370");
  assert(mixedPricing.gst === 18.5, "5% GST on 370 is 18.5");
  assert(mixedPricing.total === 418.5, "Total is 370 + 18.5 + 30 = 418.5");

  // 6. Test decorateMenuItemsWithDiscounts
  const rawMenuItems = [
    {
      _id: "m_1",
      name: "Chicken Biryani",
      pricingType: "single",
      price: 250,
      category: { _id: "cat_biryani", name: "Biryani" }
    },
    {
      _id: "m_2",
      name: "Sprite",
      pricingType: "single",
      price: 40,
      category: { _id: "cat_beverage", name: "Beverages" }
    }
  ];

  const biryaniAutoDisc = {
    _id: "disc_biryani_auto",
    name: "Biryani Deal",
    method: "automatic",
    discountType: "percentage",
    discountValue: 20,
    applicability: "categories",
    categoryIds: ["cat_biryani"],
    isActive: true
  };

  const decorated = await decorateMenuItemsWithDiscounts(rawMenuItems, [biryaniAutoDisc]);
  assert(decorated[0].activeDiscount !== null && decorated[0].activeDiscount !== undefined, "Biryani receives activeDiscount metadata");
  assert(decorated[0].activeDiscount.badge === "20% OFF", "Biryani discount badge is 20% OFF");
  assert(decorated[0].activeDiscount.discountedPrice === 200, "Biryani discounted price is 200 (250 - 20%)");
  assert(decorated[0].activeDiscount.savingsAmount === 50, "Biryani savings amount is 50");
  assert(decorated[1].activeDiscount === undefined || decorated[1].activeDiscount === null, "Sprite receives no activeDiscount");

  console.log(`\n========================================`);
  console.log(`Test Summary: ${passed} passed, ${failed} failed`);
  console.log(`========================================`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
