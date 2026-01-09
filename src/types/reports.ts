/**
 * Transaction Types for Reports API
 */

export interface PurchaseTransaction {
  id: number;
  status: number;
  order_at: number;
  order_type: number;
  invoice_num: string;
  grand_total: string;
  created_at: string;
  completed_at: string;
  refunded_at: string | null;
  voided_at: string | null;
  sales_date: string | null;
  total_price: string;
  manual_percentage_discount: string;
  manual_fix_discount: string;
  total_items_discount: string;
  total_discount: string;
  total_tax: string;
  grand_total_taxed: string;
  cash_received: string;
  digital_cash_received: string;
  is_collected: boolean;
  client: number;
  terminal: number | null;
  cashier: string | null;
  voided_by: string | null;
  refunded_by: string | null;
  branch: number;
  manual_discounted_by: string | null;
}

export interface TransactionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PurchaseTransaction[];
}

export interface GetTransactionsParams {
  bid: number;
  search?: string;
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Purchase Items Detail Types
 */

export interface Product {
  id: number;
  prod_name: string;
  image: string | null;
}

export interface BranchProduct {
  id: number;
  product: Product;
}

export interface PurchaseItemVariant {
  id: number;
  product: Product;
  calculated_price: string;
  purchase_item: number;
}

export interface PurchaseItem {
  id: number;
  branch_prod: BranchProduct;
  qty: string;
  curr_price: string;
  total_price: string;
  is_voided: boolean;
  voided_at: string | null;
  order_name_txt: string | null;
  variants: PurchaseItemVariant[];
}

export interface PurchaseItemsResponse {
  success: boolean;
  data: PurchaseItem[];
}

export interface GetPurchaseItemsParams {
  purchase: number;
}

/**
 * Attendance Types
 */

export interface AttendanceRecord {
  id: number;
  types: number; // 1 = Time In, 3 = Break
  b_hours: number;
  time_in: string;
  time_out: string | null;
  in_img: string | null;
  out_img: string | null;
  branch: number | null;
  user: number;
  terminal: number | null;
}

export interface BranchUserAttendance {
  id: number;
  fullname: string;
  attendance: AttendanceRecord[];
}

export interface AttendanceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BranchUserAttendance[];
}

export interface GetAttendanceParams {
  bid: number;
  search?: string;
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Sales Report Types
 */

export interface SalesReportItem {
  id: number;
  tracking_num: string;
  client: number;
  cashier_name: string;
  branch: number;
  witness_name: string | null;
  total_sales: string;
  total_cash: string;
  total_cashless: string;
  total_discount: string;
  total_expense: string;
  short_over: string;
  net_sales: string;
  is_collected: boolean;
  created_at: string;
  generate_at: string;
  deposited_at: string;
}

export interface SalesReportResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SalesReportItem[];
}

export interface GetSalesReportParams {
  bid: number;
  search?: string;
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Sales Report Details / Purchases Types
 */

export interface SalesReportPurchase {
  id: number;
  status: number;
  order_at: number;
  order_type: number;
  invoice_num: string;
  grand_total: string;
  created_at: string;
  completed_at: string;
  refunded_at: string | null;
  voided_at: string | null;
  sales_date: string | null;
  total_price: string;
  manual_percentage_discount: string;
  manual_fix_discount: string;
  total_items_discount: string;
  total_discount: string;
  total_tax: string;
  grand_total_taxed: string;
  cash_received: string;
  digital_cash_received: string;
  is_collected: boolean;
  sales_report: number;
  client: number;
  terminal: number | null;
  cashier: string | null;
  voided_by: string | null;
  refunded_by: string | null;
  branch: number;
  manual_discounted_by: string | null;
}

export interface SalesReportDetailsResponse {
  success: boolean;
  data: SalesReportPurchase[];
}

export interface GetSalesReportDetailsParams {
  salesReportId: number;
}
