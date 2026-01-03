/**
 * Utility functions for transaction and purchase item formatting
 */

import type { PurchaseItem, PurchaseItemVariant } from "@/types/reports";

/**
 * Format a single purchase item with variants for display
 */
export const formatPurchaseItemForDisplay = (item: PurchaseItem) => {
  return {
    id: item.id,
    productName: item.branch_prod.product.prod_name,
    productImage: item.branch_prod.product.image,
    quantity: parseFloat(item.qty),
    price: parseFloat(item.curr_price),
    totalPrice: parseFloat(item.total_price),
    isVoided: item.is_voided,
    voidedAt: item.voided_at,
    orderNote: item.order_name_txt,
    variants: item.variants.map((variant) => ({
      id: variant.id,
      productName: variant.product.prod_name,
      productImage: variant.product.image,
      price: parseFloat(variant.calculated_price),
    })),
  };
};

/**
 * Calculate total price with variants
 */
export const calculateItemTotalPrice = (item: PurchaseItem): number => {
  const basePrice = parseFloat(item.curr_price);
  const variantsPrice = item.variants.reduce(
    (sum, variant) => sum + parseFloat(variant.calculated_price),
    0
  );
  return (basePrice + variantsPrice) * parseFloat(item.qty);
};

/**
 * Get variant names as a comma-separated string
 */
export const getVariantNames = (variants: PurchaseItemVariant[]): string => {
  return variants
    .map((v) => {
      const price = parseFloat(v.calculated_price);
      return price > 0
        ? `${v.product.prod_name} (+₱${price.toFixed(2)})`
        : v.product.prod_name;
    })
    .join(", ");
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `₱${num.toFixed(2)}`;
};
