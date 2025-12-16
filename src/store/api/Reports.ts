import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import type {
  TransactionResponse,
  GetTransactionsParams,
  PurchaseItemsResponse,
  GetPurchaseItemsParams,
} from "@/types/reports";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["reports"],
  endpoints: (builder) => ({
    /**
     * GET /api/transactions/reports/get_transactions_per_branch
     * Get all transactions for a specific branch with pagination
     *
     * Query params:
     *  - bid: branch id (required)
     *  - search: invoice number search (optional)
     *  - start_date: filter from date (optional, format: YYYY-MM-DD)
     *  - end_date: filter to date (optional, format: YYYY-MM-DD)
     *  - page: page number (optional, default 1)
     *  - page_size: items per page (optional, default 10)
     */
    getTransactionsPerBranch: builder.query<
      TransactionResponse,
      GetTransactionsParams
    >({
      query: ({
        bid,
        search,
        page = 1,
        page_size = 10,
        start_date,
        end_date,
      }) => {
        let url = `/transactions/reports/get_transactions_per_branch?bid=${bid}&page_size=${page_size}&page=${page}`;
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        if (start_date) {
          url += `&start_date=${start_date}`;
        }
        if (end_date) {
          url += `&end_date=${end_date}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["reports"],
    }),

    /**
     * GET /api/transactions/reports/get_puchase_items_detail
     * Get detailed items for a specific purchase (lazy loaded on row click)
     *
     * Query params:
     *  - purchase: purchase id (required)
     */
    getPurchaseItemsDetail: builder.query<
      PurchaseItemsResponse,
      GetPurchaseItemsParams
    >({
      query: ({ purchase }) => {
        return {
          url: `/transactions/reports/get_puchase_items_detail?purchase=${purchase}`,
          method: "GET",
        };
      },
      providesTags: ["reports"],
    }),
  }),
});

export const {
  useGetTransactionsPerBranchQuery,
  useGetPurchaseItemsDetailQuery,
} = reportsApi;
