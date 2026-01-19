import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import type {
  TransactionResponse,
  GetTransactionsParams,
  PurchaseItemsResponse,
  GetPurchaseItemsParams,
  AttendanceResponse,
  GetAttendanceParams,
  SalesReportResponse,
  GetSalesReportParams,
  SalesReportDetailsResponse,
  GetSalesReportDetailsParams,
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
    getUsersAttendanceList: builder.query<
      AttendanceResponse,
      GetAttendanceParams
    >({
      query: ({
        bid,
        search,
        page = 1,
        page_size = 10,
        start_date,
        end_date,
      }) => {
        let url = `/transactions/reports/get_attendance_branch?bid=${bid}&page_size=${page_size}&page=${page}`;
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
     * GET /api/transactions/reports/get_sales_report
     * Get sales reports for a specific branch with pagination
     *
     * Query params:
     *  - bid: branch id (required)
     *  - search: tracking number search (optional)
     *  - start_date: filter from date (optional, format: YYYY-MM-DD)
     *  - end_date: filter to date (optional, format: YYYY-MM-DD)
     *  - page: page number (optional, default 1)
     *  - page_size: items per page (optional, default 10)
     */
    getSalesReport: builder.query<SalesReportResponse, GetSalesReportParams>({
      query: ({
        bid,
        search,
        page = 1,
        page_size = 10,
        start_date,
        end_date,
      }) => {
        let url = `/transactions/reports/get_sales_report?bid=${bid}&page_size=${page_size}&page=${page}`;
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
     * GET /api/transactions/reports/get_sales_report_details
     * Get purchase details for a specific sales report
     *
     * Query params:
     *  - salesReportId: sales report id (required)
     */
    getSalesReportDetails: builder.query<
      SalesReportDetailsResponse,
      GetSalesReportDetailsParams
    >({
      query: ({ salesReportId }) => ({
        url: `/transactions/reports/get_sales_report_details?salesReportId=${salesReportId}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    /**
     * POST /api/sales/refund_purchase/
     * Refund a purchase or specific purchase items
     *
     * Body params:
     *  - purchase: purchase id (optional, if provided refunds entire purchase)
     *  - purchase_items: array of purchase item ids (optional, if provided refunds specific items)
     */
    refundPurchase: builder.mutation<
      { success: boolean },
      { purchase?: string | number; purchase_items?: number[] }
    >({
      query: (data) => ({
        url: `/transactions/reports/refund_purchase/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reports"],
    }),
  }),
});

export const {
  useGetTransactionsPerBranchQuery,
  useGetPurchaseItemsDetailQuery,
  useGetUsersAttendanceListQuery,
  useGetSalesReportQuery,
  useGetSalesReportDetailsQuery,
  useRefundPurchaseMutation,
} = reportsApi;
