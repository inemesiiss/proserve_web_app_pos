import { useState, useMemo } from "react";
import { SideBar } from "@/components/admin/SideBar";
import ActionButtons from "@/components/admin/table/Buttons";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import { reportNavs } from "@/navigattion/ReportNaviation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetSalesReportQuery,
  useGetSalesReportDetailsQuery,
} from "@/store/api/Reports";
import type { SalesReportItem } from "@/types/reports";
import { SalesReportDetailsModal } from "./SalesReportDetailsModal";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Banknote,
  Loader2,
} from "lucide-react";

// Helper function to get branch ID from storage
const getBranchIdFromStorage = (): number => {
  const branchValue = localStorage.getItem("branch");
  if (branchValue) {
    const branchId = parseInt(branchValue, 10);
    return isNaN(branchId) ? 1 : branchId;
  }
  return 1;
};

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Helper function to format currency
const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(numValue);
};

// Helper function to format datetime
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const columns = [
  { key: "created_at", label: "Date" },
  { key: "tracking_num", label: "Tracking #" },
  { key: "cashier_name", label: "Cashier" },
  { key: "total_sales", label: "Total Sales" },
  { key: "total_cash", label: "Cash" },
  { key: "total_cashless", label: "Cashless" },
  { key: "total_discount", label: "Discount" },
  { key: "net_sales", label: "Net Sales" },
  { key: "is_collected", label: "Collected" },
];

// Summary Card Component
interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

function SummaryCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  className = "",
}: SummaryCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        {trend && (
          <p
            className={`text-xs mt-1 flex items-center gap-1 ${
              trendUp
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <TrendingUp className={`h-3 w-3 ${!trendUp ? "rotate-180" : ""}`} />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function BMSalesReport() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [selectedCashier, setSelectedCashier] = useState("all");
  const [branchId] = useState<number>(getBranchIdFromStorage());
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSalesReport, setSelectedSalesReport] =
    useState<SalesReportItem | null>(null);

  // Fetch sales report data from API
  const {
    data: salesData,
    isLoading,
    isFetching,
  } = useGetSalesReportQuery({
    bid: branchId,
    search: searchQuery || undefined,
    page: currentPage,
    page_size: pageSize,
    start_date: startDate,
    end_date: endDate,
  });

  // Fetch details for selected sales report (lazy loading)
  const { data: detailsData, isLoading: detailsLoading } =
    useGetSalesReportDetailsQuery(
      { salesReportId: selectedSalesReport?.id || 0 },
      { skip: !selectedSalesReport || !isDetailsModalOpen }
    );

  // Get unique cashier names from API data
  const cashierList = useMemo(() => {
    if (!salesData?.results) return [];
    const cashiers = Array.from(
      new Set(salesData.results.map((item) => item.cashier_name))
    );
    return cashiers.sort();
  }, [salesData]);

  // Transform API data for table display with cashier filter
  const filteredByDate = useMemo(() => {
    if (!salesData?.results) return [];

    // Filter by selected cashier if not "all"
    if (selectedCashier !== "all") {
      return salesData.results.filter(
        (item) => item.cashier_name === selectedCashier
      );
    }
    return salesData.results;
  }, [salesData, selectedCashier]);

  // Transform API data for table display
  const tableData = useMemo(() => {
    if (!filteredByDate) return [];
    return filteredByDate.map((item: SalesReportItem) => ({
      ...item,
      created_at: formatDateTime(item.created_at),
      total_sales: formatCurrency(item.total_sales),
      total_cash: formatCurrency(item.total_cash),
      total_cashless: formatCurrency(item.total_cashless),
      total_discount: formatCurrency(item.total_discount),
      net_sales: formatCurrency(item.net_sales),
      is_collected: item.is_collected ? "Yes" : "No",
    }));
  }, [salesData]);

  // Calculate summary statistics from API data
  const summaryStats = useMemo(() => {
    if (!filteredByDate || filteredByDate.length === 0) {
      return {
        totalSales: 0,
        totalTransactions: 0,
        cashSales: 0,
        digitalSales: 0,
        totalDiscount: 0,
        netSales: 0,
      };
    }

    const results = filteredByDate;
    const totalSales = results.reduce(
      (sum, item) => sum + parseFloat(item.total_sales),
      0
    );
    const totalTransactions = results.length;
    const cashSales = results.reduce(
      (sum, item) => sum + parseFloat(item.total_cash),
      0
    );
    const digitalSales = results.reduce(
      (sum, item) => sum + parseFloat(item.total_cashless),
      0
    );
    const totalDiscount = results.reduce(
      (sum, item) => sum + parseFloat(item.total_discount),
      0
    );
    const netSales = results.reduce(
      (sum, item) => sum + parseFloat(item.net_sales),
      0
    );

    return {
      totalSales,
      totalTransactions,
      cashSales,
      digitalSales,
      totalDiscount,
      netSales,
    };
  }, [filteredByDate]);

  const totalItems = filteredByDate.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };

  const handleCashierChange = (value: string) => {
    setSelectedCashier(value);
    setCurrentPage(1);
  };

  const handleShowMore = () => {
    console.log("Loading more data...");
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar navs={reportNavs} onCollapsedChange={setSidebarCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            Sales Report
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <SummaryCard
              title="Total Sales"
              value={formatCurrency(summaryStats.totalSales)}
              icon={<DollarSign className="h-5 w-5" />}
            />
            <SummaryCard
              title="Net Sales"
              value={formatCurrency(summaryStats.netSales)}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <SummaryCard
              title="Cash Sales"
              value={formatCurrency(summaryStats.cashSales)}
              icon={<Banknote className="h-5 w-5" />}
            />
            <SummaryCard
              title="Cashless Sales"
              value={formatCurrency(summaryStats.digitalSales)}
              icon={<CreditCard className="h-5 w-5" />}
            />
            <SummaryCard
              title="Total Discount"
              value={formatCurrency(summaryStats.totalDiscount)}
              icon={<ShoppingCart className="h-5 w-5" />}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="start-date"
                className="text-sm font-medium dark:text-gray-300"
              >
                From Date:
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-[150px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="end-date"
                className="text-sm font-medium dark:text-gray-300"
              >
                To Date:
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-[150px]"
              />
            </div>

            {/* Cashier Filter */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="cashier-filter"
                className="text-sm font-medium dark:text-gray-300"
              >
                Cashier:
              </Label>
              <Select
                value={selectedCashier}
                onValueChange={handleCashierChange}
              >
                <SelectTrigger className="w-[180px]" id="cashier-filter">
                  <SelectValue placeholder="Select Cashier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cashiers</SelectItem>
                  {cashierList.map((cashier) => (
                    <SelectItem key={cashier} value={cashier}>
                      {cashier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto">
              <Search
                placeholder="Search by tracking #..."
                value={searchQuery}
                onChange={handleSearch}
                onClear={handleClearSearch}
                containerClassName="w-72"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end mb-4 gap-3">
            <ActionButtons />
          </div>

          {/* Loading State */}
          {(isLoading || isFetching) && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Loading sales data...
              </span>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && (
            <div
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              style={{ cursor: "pointer" }}
            >
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => {
                        setSelectedSalesReport(filteredByDate[idx]);
                        setIsDetailsModalOpen(true);
                      }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                        >
                          {row[col.key as keyof typeof row]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && tableData.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No sales records found for the selected date range and filters
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 20, 50, 100]}
            totalItems={totalItems}
            showMore={useShowMore}
            onShowMore={handleShowMore}
            className="mt-6"
          />
        </div>
      </div>

      {/* Details Modal */}
      <SalesReportDetailsModal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        selectedSalesReport={selectedSalesReport}
        detailsData={detailsData}
        detailsLoading={detailsLoading}
      />
    </div>
  );
}

export default BMSalesReport;
