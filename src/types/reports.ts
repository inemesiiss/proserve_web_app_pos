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
