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
 * Returns a FLATTENED structure without redundant wrapper or duplicate fields
 */
export const categorizeProduct = (
  wrapper: ProductWrapper
): CategorizedProduct => {
  const product = wrapper.product;
  const branch_prod_id = wrapper.id;
  const hasCompositions = product.has_variance;

  let type: "individual" | "individual-variance" | "bundle" | "bundle-variance";

  if (product.p_type === 1) {
    // Individual product
    type = hasCompositions ? "individual-variance" : "individual";
  } else {
    // Bundle product (p_type === 2)
    type = hasCompositions ? "bundle-variance" : "bundle";
  }

  return {
    id: product.id,
    branch_prod_id: branch_prod_id,
    prod_name: product.prod_name,
    prod_code: product.prod_code,
    prod_categ: product.prod_categ,
    p_type: product.p_type,
    image: product.image,
    compositions: product.compositions,
    type,
    basePrice: product.base_price ?? 0,
    has_variance: product.has_variance,
    isActive: product.is_active,
  };
};

/**
 * Filters active products from API response
 */
const filterActiveProducts = (response: TransactionApiResponse) => {
  return response.data.filter((pw) => pw.is_active && pw.product.is_active);
};

/**
 * Query params for get_branch_products
 */
interface GetBranchProductsParams {
  branchId: number;
  category?: number | null; // category ID, null or undefined for "All"
  search?: string; // search keyword
}

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
     * GET /api/transactions/cashier/get_branch_products?bid=1&category=2&search=burger
     * Returns all products categorized by p_type and compositions
     */
    getBranchProducts: builder.query<
      CategorizedProduct[],
      GetBranchProductsParams
    >({
      query: ({ branchId, category, search }) => {
        // Build query string
        const params = new URLSearchParams();
        params.append("bid", branchId.toString());
        if (category) {
          params.append("category", category.toString());
        }
        if (search && search.trim()) {
          params.append("search", search.trim());
        }
        return {
          url: `/transactions/cashier/get_branch_products?${params.toString()}`,
          method: "GET",
        };
      },
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

    /**
     * Mutation: Create cashier transaction
     * POST /api/transactions/cashier/create_cashier_transaction
     * Creates a new transaction with items and returns invoice number
     */
    createCashierTransaction: builder.mutation<
      {
        success: boolean;
        invoiceNum: string;
        orderNum?: string;
        transactionId?: number;
        message?: string;
      },
      {
        purchase: {
          clientId: number;
          branchId: number;
          outletId: number;
          grandTotal: number;
          subTotal: number;
          cashReceived: number;
          totalDiscount: number;
          status: string;
        };
        items: Array<{
          productId: number;
          branchProdId: number;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
          productName: string;
          customization?: any;
          // Void tracking
          is_voided?: boolean;
          voided_at?: string;
          voided_reason?: string;
          // Discount tracking
          discount?: number;
          discounted_at?: string;
          discount_type?: "pwd" | "sc" | "manual" | "percentage";
          discount_note?: string;
        }>;
      }
    >({
      query: (payload) => ({
        url: `/transactions/cashier/create_cashier_transaction/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

/**
 * Auto-generated hooks
 */
export const {
  useGetBranchProductsQuery,
  useGetCategoriesQuery,
  useCreateCashierTransactionMutation,
} = transactionApi;
