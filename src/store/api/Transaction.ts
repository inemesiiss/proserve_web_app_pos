import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import type {
  //   Product,
  ProductWrapper,
  TransactionApiResponse,
  CategorizedProduct,
  ProductCategory,
  CategoryApiResponse,
} from "@/types/transaction";

/**
 * Categorizes a product based on p_type and compositions
 * A product is customizable if it has compositions (regardless of has_variance flag)
 */
export const categorizeProduct = (
  wrapper: ProductWrapper
): CategorizedProduct => {
  const product = wrapper.product;
  const hasCompositions =
    product.compositions && product.compositions.length > 0;

  let type: "individual" | "individual-variance" | "bundle" | "bundle-variance";

  if (product.p_type === 1) {
    // Individual product
    type = hasCompositions ? "individual-variance" : "individual";
  } else {
    // Bundle product (p_type === 2)
    type = hasCompositions ? "bundle-variance" : "bundle";
  }

  return {
    wrapper,
    type,
    basePrice: product.base_price ?? 0,
    hasVariance: hasCompositions, // Use actual compositions presence as variance indicator
  };
};

/**
 * Filters active products from API response
 */
const filterActiveProducts = (response: TransactionApiResponse) => {
  return response.data.filter((pw) => pw.is_active && pw.product.is_active);
};

/**
 * Transaction API - Handles all product queries and transaction mutations
 */
export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["products", "categories"],
  endpoints: (builder) => ({
    /**
     * Query: Get all branch products
     * GET /api/transactions/cashier/get_branch_products?bid=1
     * Returns all products categorized by p_type and compositions
     */
    getBranchProducts: builder.query<CategorizedProduct[], number>({
      query: (branchId) => ({
        url: `/transactions/cashier/get_branch_products?bid=${branchId}`,
        method: "GET",
      }),
      transformResponse: (response: TransactionApiResponse) => {
        const activeProducts = filterActiveProducts(response);
        return activeProducts.map(categorizeProduct);
      },
      providesTags: ["products"],
    }),

    /**
     * Query: Get product categories for sidebar
     * GET /api/transactions/cashier/get_category_products?cid=1
     * Returns all active categories for a client/branch
     * Defaults to "All" if no categories found
     */
    getCategories: builder.query<ProductCategory[], number>({
      query: (clientId) => ({
        url: `/transactions/cashier/get_category_products?cid=${clientId}`,
        method: "GET",
      }),
      transformResponse: (response: CategoryApiResponse) => {
        // Return categories from API response
        // If empty, the sidebar will default to showing "All"
        return response.data || [];
      },
      providesTags: ["categories"],
    }),
  }),
});

/**
 * Auto-generated hooks
 */
export const { useGetBranchProductsQuery, useGetCategoriesQuery } =
  transactionApi;
