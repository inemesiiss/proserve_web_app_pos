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

export interface SalesDashboardParams {
  bid: number;
  start_date: string;
  end_date: string;
}

export interface TopProduct {
  branch_prod__id: number;
  branch_prod__prod_name: string | null;
  total_qty: number;
  total_sales: number;
}

export interface TopCashier {
  cashier__id: number | null;
  total_sales: number;
  num_transactions: number;
  fullname: string;
}

export interface HourlySales {
  hour: number;
  label: string;
  total_sales: number;
  num_transactions: number;
  avg_sales: number;
}

export interface SalesDashboardResponse {
  success: boolean;
  data?: {
    num_of_sales: number;
    cash_sales: number;
    total_discount: number;
    average_transaction_value: number;
    top_products_by_sales: TopProduct[];
    top_products_by_qty: TopProduct[];
    top_cashiers: TopCashier[];
    hourly_sales: HourlySales[];
    this_month_sales: number;
    last_month_sales: number;
    month_pct_change: number;
    this_week_sales: number;
    last_week_sales: number;
    week_pct_change: number;
    today_sales: number;
    yesterday_sales: number;
    today_pct_change: number;
  };
  message?: string;
}

export interface MonthlySalesItem {
  month: number;
  label: string;
  total_sales: number;
  num_transactions: number;
}

export interface MonthlySalesResponse {
  success: boolean;
  data?: MonthlySalesItem[];
  message?: string;
}

export interface MonthlySalesParams {
  bid: number;
  year: number;
}

export interface WeeklySalesItem {
  day: number;
  label: string;
  total_sales: number;
  num_transactions: number;
}

export interface WeeklySalesResponse {
  success: boolean;
  data?: WeeklySalesItem[];
  message?: string;
}

export interface WeeklySalesParams {
  bid: number;
  start_date: string;
  end_date: string;
}

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

    /**
     * GET /api/transactions/get_sales_dashboard
     * Get sales dashboard metrics for a specific branch and date range
     *
     * Query params:
     *  - bid: branch id (required)
     *  - start_date: filter from date (required, format: YYYY-MM-DD)
     *  - end_date: filter to date (required, format: YYYY-MM-DD)
     */
    getSalesDashboard: builder.query<
      SalesDashboardResponse,
      SalesDashboardParams
    >({
      query: ({ bid, start_date, end_date }) => ({
        url: `/transactions/reports/get_sales_dashboard/?bid=${bid}&start_date=${start_date}&end_date=${end_date}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    /**
     * GET /api/transactions/reports/get_monthly_sales
     * Get sales per month for a given year
     *
     * Query params:
     *  - bid: branch id (required)
     *  - year: year to filter (required)
     */
    getMonthlySales: builder.query<MonthlySalesResponse, MonthlySalesParams>({
      query: ({ bid, year }) => ({
        url: `/transactions/reports/get_monthly_sales/?bid=${bid}&year=${year}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    /**
     * GET /api/transactions/reports/get_weekly_sales
     * Get sales per day of the week for a given date range
     *
     * Query params:
     *  - bid: branch id (required)
     *  - start_date: start of week (required, format: YYYY-MM-DD)
     *  - end_date: end of week (required, format: YYYY-MM-DD)
     */
    getWeeklySales: builder.query<WeeklySalesResponse, WeeklySalesParams>({
      query: ({ bid, start_date, end_date }) => ({
        url: `/transactions/reports/get_weekly_sales/?bid=${bid}&start_date=${start_date}&end_date=${end_date}`,
        method: "GET",
      }),
      providesTags: ["reports"],
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
  useGetSalesDashboardQuery,
  useGetMonthlySalesQuery,
  useGetWeeklySalesQuery,
} = reportsApi;
