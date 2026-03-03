import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TabsHeader from "@/components/admin/table/Tabs";
import FiltersBar from "@/components/admin/table/Filters";
import DataTable from "@/components/admin/table/Tables";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import TransactionDetailsModal from "@/components/admin/modals/TransactionDetailsModal";
import {
  useGetTransactionsPerBranchQuery,
  useGetPurchaseItemsDetailQuery,
} from "@/store/api/Reports";
import type { PurchaseTransaction, PurchaseItem } from "@/types/reports";
import { Loader2 } from "lucide-react";

// Helper function to get branchId from localStorage
const getBranchIdFromStorage = (): number | null => {
  try {
    const branchValue = localStorage.getItem("branch");
    if (branchValue) {
      const branchId = parseInt(branchValue, 10);
      return isNaN(branchId) ? null : branchId;
    }
    return null;
  } catch (error) {
    console.error("Error reading branch from localStorage:", error);
    return null;
  }
};

const columns = [
  { key: "created_at", label: "Date" },
  { key: "invoice_num", label: "OR Number" },
  { key: "total_price", label: "Original Price" },
  { key: "total_items_discount", label: "Item Discount" },
  { key: "vatable_sales", label: "Vatable Sales" },
  { key: "vat_amount", label: "VAT" },
  { key: "vat_exempt_sales", label: "VAT-Exempt Sales" },
  { key: "grand_total", label: "Grand Total" },
  { key: "cash_received", label: "Cash Received" },
];

function BMReportTransaction() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("completed");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<{
    date: string;
    or: string;
    branch: string;
    amount: number;
    tax: number;
    total_discount: number;
    cashier: string;
    total_price: number;
    total_items_discount: number;
    grand_total: number;
    vatable_sales: number;
    vat_exempt_sales: number;
    vat_amount: number;
    cash_received: number;
    digital_cash_received: number;
    id: number;
  } | null>(null);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(
    null,
  );
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Dynamic branchId from localStorage
  const [branchId, setBranchId] = useState<number | null>(null);
  const [isCheckingBranch, setIsCheckingBranch] = useState(true);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Check for branchId on mount
  useEffect(() => {
    const storedBranchId = getBranchIdFromStorage();
    if (!storedBranchId) {
      navigate("/food/main", { replace: true });
      return;
    }
    setBranchId(storedBranchId);
    setIsCheckingBranch(false);
  }, [navigate]);

  // Fetch transactions from API
  const {
    data: transactionsData,
    isLoading,
    isError,
    error,
  } = useGetTransactionsPerBranchQuery(
    {
      bid: branchId || 0,
      search: searchQuery,
      page: currentPage,
      page_size: pageSize,
      ...(filters.cashier && { cashier: filters.cashier }),
      ...(filters.start_date && { start_date: filters.start_date }),
      ...(filters.end_date && { end_date: filters.end_date }),
    },
    { skip: !branchId },
  );

  // Lazy load purchase items when a transaction is clicked
  const { data: purchaseItemsData, isLoading: isLoadingItems } =
    useGetPurchaseItemsDetailQuery(
      { purchase: selectedPurchaseId! },
      { skip: !selectedPurchaseId },
    );
  if (purchaseItemsData) {
    console.log("Purchase Items Data:", purchaseItemsData);
  }

  // Transform purchase items for modal display
  const transformedItems = (purchaseItemsData?.data || []).map(
    (item: PurchaseItem) => ({
      id: item.id,
      name: item.branch_prod.product.prod_name,
      qty: parseFloat(item.qty),
      price: parseFloat(item.curr_price),
      total:
        parseFloat(item.curr_price) * parseFloat(item.qty) +
        item.variants.reduce(
          (sum, v) => sum + parseFloat(v.calculated_price),
          0,
        ),
      category: "Product",
      curr_price: item.curr_price,
      total_price: item.total_price,
      total_discount: item.total_discount,
      grand_total: item.grand_total,
      is_voided: item.is_voided,
      is_refunded: item.is_refunded || false,
      refunded_at: item.refunded_at || undefined,
      refund_reason: item.refund_reason || undefined,
      variants: item.variants.map((v) => ({
        name: v.product.prod_name,
        price: parseFloat(v.calculated_price),
      })),
    }),
  );

  // Transform API data for table display
  const tableData = (transactionsData?.results || []).map(
    (transaction: PurchaseTransaction) => ({
      ...transaction,
      _original: transaction, // Add original data for modal
      created_at: new Date(transaction.created_at).toLocaleString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      total_price: `₱${parseFloat(transaction.total_price).toFixed(2)}`,
      total_items_discount:
        transaction.total_items_discount !== "0.00"
          ? `₱${parseFloat(transaction.total_items_discount).toFixed(2)}`
          : "-",
      vatable_sales:
        transaction.vatable_sales && transaction.vatable_sales !== "0.00"
          ? `₱${parseFloat(transaction.vatable_sales).toFixed(2)}`
          : "-",
      vat_amount:
        transaction.vat_amount && transaction.vat_amount !== "0.00"
          ? `₱${parseFloat(transaction.vat_amount).toFixed(2)}`
          : "-",
      vat_exempt_sales:
        transaction.vat_exempt_sales && transaction.vat_exempt_sales !== "0.00"
          ? `₱${parseFloat(transaction.vat_exempt_sales).toFixed(2)}`
          : "-",
      grand_total: `₱${parseFloat(transaction.grand_total).toFixed(2)}`,
      cash_received: `₱${parseFloat(transaction.cash_received).toFixed(2)}`,
    }),
  );

  const totalItems = transactionsData?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleFiltersChange = (appliedFilters: Record<string, any>) => {
    setFilters(appliedFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleRowClick = (row: any) => {
    // Use the original, unformatted values for modal data
    const modalData = {
      date: new Date(row.created_at).toLocaleString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      or: row.invoice_num,
      branch: `Branch ${row.branch}`,
      amount:
        typeof row._original?.grand_total !== "undefined"
          ? Number(row._original.grand_total)
          : Number(row.grand_total),
      tax:
        typeof row._original?.vat_amount !== "undefined"
          ? Number(row._original.vat_amount)
          : Number(row.vat_amount),
      total_discount:
        typeof row._original?.total_items_discount !== "undefined"
          ? Number(row._original.total_items_discount)
          : Number(row.total_items_discount),
      cashier: row.cashier || "N/A",
      total_price:
        typeof row._original?.total_price !== "undefined"
          ? Number(row._original.total_price)
          : Number(row.total_price),
      total_items_discount:
        typeof row._original?.total_items_discount !== "undefined"
          ? Number(row._original.total_items_discount)
          : Number(row.total_items_discount),
      grand_total:
        typeof row._original?.grand_total !== "undefined"
          ? Number(row._original.grand_total)
          : Number(row.grand_total),
      vatable_sales:
        typeof row._original?.vatable_sales !== "undefined"
          ? Number(row._original.vatable_sales)
          : Number(row.vatable_sales),
      vat_exempt_sales:
        typeof row._original?.vat_exempt_sales !== "undefined"
          ? Number(row._original.vat_exempt_sales)
          : Number(row.vat_exempt_sales),
      vat_amount:
        typeof row._original?.vat_amount !== "undefined"
          ? Number(row._original.vat_amount)
          : Number(row.vat_amount),
      cash_received:
        typeof row._original?.cash_received !== "undefined"
          ? Number(row._original.cash_received)
          : Number(row.cash_received),
      digital_cash_received:
        typeof row._original?.digital_cash_received !== "undefined"
          ? Number(row._original.digital_cash_received)
          : Number(row.digital_cash_received),
      id: row.id, // Add purchase ID for refund functionality
    };
    setSelectedTransaction(modalData);
    setSelectedPurchaseId(row.id); // Trigger lazy loading of purchase items
    setShowTransactionModal(true);
  };

  // ✅ Checking branch ID state
  if (isCheckingBranch) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-600 dark:text-gray-400">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Transaction Sale
      </h1>

      <div className="flex items-center justify-between mb-4">
        <TabsHeader
          tabs={[
            { value: "completed", label: "Completed (12)" },
            { value: "refund", label: "Refund" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
        <Search
          placeholder="Search by Invoice Number"
          value={searchQuery}
          onChange={handleSearch}
          onClear={handleClearSearch}
          containerClassName="w-72"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <FiltersBar
          showClientFilter={false}
          showBranchUserFilter={true}
          branchId={branchId || undefined}
          onFilterChange={handleFiltersChange}
        />
      </div>

      {isError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error loading transactions:{" "}
          {(error as any)?.message || "Unknown error"}
        </div>
      )}

      {isLoading && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-md">
          Loading transactions...
        </div>
      )}

      <DataTable
        columns={columns}
        data={tableData}
        onRowClick={handleRowClick}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 20, 50, 100]}
        totalItems={totalItems}
        showMore={false}
        onShowMore={() => {}}
        className="mt-6"
      />

      <TransactionDetailsModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setSelectedPurchaseId(null);
        }}
        transaction={selectedTransaction}
        items={transformedItems}
        isLoadingItems={isLoadingItems}
      />
    </div>
  );
}

export default BMReportTransaction;
