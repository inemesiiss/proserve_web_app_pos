import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SideBar } from "@/components/admin/SideBar";
import TabsHeader from "@/components/admin/table/Tabs";
import FiltersBar from "@/components/admin/table/Filters";
import ActionButtons from "@/components/admin/table/Buttons";
import DataTable from "@/components/admin/table/Tables";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import { reportNavs } from "@/navigattion/ReportNaviation";
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
  { key: "created_at", label: "Date of Purchase" },
  { key: "invoice_num", label: "OR Number" },
  { key: "branch", label: "Branch Name" },
  { key: "grand_total", label: "Amount" },
  { key: "total_tax", label: "Tax" },
  { key: "total_discount", label: "Discount" },
  { key: "cashier", label: "Cashier" },
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
    discount: number;
    cashier: string;
  } | null>(null);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(
    null
  );
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Dynamic branchId from localStorage
  const [branchId, setBranchId] = useState<number | null>(null);
  const [isCheckingBranch, setIsCheckingBranch] = useState(true);

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
    },
    { skip: !branchId }
  );

  // Lazy load purchase items when a transaction is clicked
  const { data: purchaseItemsData, isLoading: isLoadingItems } =
    useGetPurchaseItemsDetailQuery(
      { purchase: selectedPurchaseId! },
      { skip: !selectedPurchaseId }
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
          0
        ),
      category: "Product",
      variants: item.variants.map((v) => ({
        name: v.product.prod_name,
        price: parseFloat(v.calculated_price),
      })),
    })
  );

  // Transform API data for table display
  const tableData = (transactionsData?.results || []).map(
    (transaction: PurchaseTransaction) => ({
      ...transaction,
      created_at: new Date(transaction.created_at).toLocaleString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      grand_total: `₱${parseFloat(transaction.grand_total).toFixed(2)}`,
      total_tax:
        transaction.total_tax !== "0.00"
          ? `₱${parseFloat(transaction.total_tax).toFixed(2)}`
          : "-",
      total_discount:
        transaction.total_discount !== "0.00"
          ? `₱${parseFloat(transaction.total_discount).toFixed(2)}`
          : "-",
      cashier: transaction.cashier || "-",
      branch: transaction.branch ? `Branch ${transaction.branch}` : "-",
    })
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

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleRowClick = (row: any) => {
    // Map the raw transaction data to match modal expectations
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
      amount: parseFloat(row.grand_total),
      tax: parseFloat(row.total_tax),
      discount: parseFloat(row.total_discount),
      cashier: row.cashier || "N/A",
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar navs={reportNavs} onCollapsedChange={() => {}} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: "200px" }}
      >
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
            <FiltersBar showClientFilter={false} />
            <ActionButtons />
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
        </div>
      </div>

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
