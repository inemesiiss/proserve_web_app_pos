import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface Discount {
  id: number;
  code: string;
  name: string;
  is_percentage: boolean;
  is_vat_exempt: boolean;
  discount_percentage: string;
}

export interface BranchDiscount {
  id: number;
  discount: Discount;
  is_active: boolean;
}

export interface CashierDiscountsResponse {
  success: boolean;
  per_item_disc: {
    pwd_sc: BranchDiscount[];
  };
}

export const discountsApi = createApi({
  reducerPath: "discountsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["discounts"],
  endpoints: (builder) => ({
    /**
     * GET /api/transactions/cashier/get_cashier_discounts
     * Get available discounts for a branch
     *
     * Query params:
     *  - bid: branch id (required)
     */
    getCashierDiscounts: builder.query<
      CashierDiscountsResponse,
      { bid: number }
    >({
      query: ({ bid }) => ({
        url: `/transactions/cashier/get_cashier_discounts?bid=${bid}`,
        method: "GET",
      }),
      providesTags: ["discounts"],
    }),
  }),
});

export const { useGetCashierDiscountsQuery } = discountsApi;
