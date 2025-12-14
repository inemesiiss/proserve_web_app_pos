/**
 * Transaction API Type Definitions
 * Handles product types, compositions, variants, and cart management
 */

/**
 * Simple product representation in API responses
 */
export interface SimpleProduct {
  id: number;
  prod_name: string;
  image: string | null;
}

/**
 * Variant of a product composition
 * Used when a product has variance options
 */
export interface Variant {
  id: number;
  product: SimpleProduct;
  name: string | null;
  calculated_price: string;
}

/**
 * Composition with variants
 * Represents customization options for a product
 */
export interface Composition {
  id: number;
  name: string | null;
  default_prod: SimpleProduct;
  variants: Variant[];
}

/**
 * Core product definition
 * Represents a product in the system with all its properties
 */
export interface Product {
  id: number;
  prod_name: string;
  prod_code: string;
  prod_categ: number; // API returns as number
  p_type: 1 | 2; // 1 = Individual, 2 = Bundle
  has_variance: boolean; // true = has customization options
  base_price: number | null; // API can return null
  image: string | null; // API can return null
  is_active: boolean;
  compositions: Composition[];
}

/**
 * Wrapper for product with active status
 */
export interface ProductWrapper {
  id: number;
  is_active: boolean;
  product: Product;
}

/**
 * API response format for products
 */
export interface TransactionApiResponse {
  success: boolean;
  data: ProductWrapper[];
}

/**
 * Product category from API
 * Represents a category that products belong to
 */
export interface ProductCategory {
  id: number;
  name: string;
  status: number; // 1 = active, 0 = inactive
  client: number; // Client/Branch ID
}

/**
 * API response format for categories
 */
export interface CategoryApiResponse {
  success: boolean;
  data: ProductCategory[];
}

/**
 * Categorized product with computed properties
 * Result of the categorizeProduct utility function
 * FLATTENED - No redundant wrapper or duplicate fields
 */
export interface CategorizedProduct
  extends Omit<Product, "has_variance" | "base_price" | "is_active"> {
  type: "individual" | "individual-variance" | "bundle" | "bundle-variance";
  branch_prod_id: number; // ID from BranchProd ID
  basePrice: number; // Always guaranteed to be a number (null converted to 0)
  has_variance: boolean; // Derived from compositions length
  isActive: boolean; // Combined flag from ProductWrapper.is_active && Product.is_active
}

/**
 * Composition selection made by user
 * Tracks which variant was selected for each composition
 */
export interface CompositionSelection {
  compositionId: number;
  compositionName: string;
  selectedVariantId: number;
  selectedVariantName: string;
  priceModifier: number;
}

/**
 * Product customization details
 * Full customization state for a product with variance
 */
export interface ProductCustomization {
  productId: number;
  productName: string;
  basePrice: number;
  compositions: CompositionSelection[];
  totalCustomizationPrice: number;
  finalPrice: number;
}

/**
 * Cart item
 * Represents a product added to the transaction cart
 */
export interface CartItem {
  id: string; // Unique cart item ID (can be different from product ID if same product with different customizations)
  productId: number;
  productName: string;
  quantity: number;
  basePrice: number;
  customization?: ProductCustomization;
  subtotal: number;
  image: string;
  productType: 1 | 2;

  // --- Void tracking ---
  is_voided?: boolean;
  voided_at?: string; // ISO timestamp when item was voided
  voided_reason?: string;

  // --- Discount tracking ---
  discount?: number; // Discount amount applied to this item
  discounted_at?: string; // ISO timestamp when discount was applied
  discount_type?: "pwd" | "sc" | "manual" | "percentage"; // Type of discount
  discount_note?: string; // Reason or note for discount
}

/**
 * Transaction details
 * Complete cart and transaction information
 */
export interface Transaction {
  id?: string;
  branchId: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountPercentage?: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Add item to transaction request
 */
export interface AddItemRequest {
  productId: number;
  quantity: number;
  customization?: ProductCustomization;
  is_voided?: boolean;
  voided_at?: string;
  voided_reason?: string;
  discount?: number;
  discounted_at?: string;
  discount_type?: "pwd" | "sc" | "manual" | "percentage";
  discount_note?: string;
}

/**
 * Remove item from transaction request
 */
export interface RemoveItemRequest {
  cartItemId: string;
}

/**
 * Update item quantity request
 */
export interface UpdateItemQuantityRequest {
  cartItemId: string;
  quantity: number;
}

/**
 * Apply discount request
 */
export interface ApplyDiscountRequest {
  discountAmount?: number;
  discountPercentage?: number;
}

/**
 * Submit transaction request
 */
export interface SubmitTransactionRequest {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
}

/**
 * Submit transaction response
 */
export interface SubmitTransactionResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

/**
 * Transaction response (cart details)
 */
export interface TransactionResponse {
  success: boolean;
  data: Transaction;
}
