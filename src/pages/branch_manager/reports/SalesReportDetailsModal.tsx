import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  SalesReportItem,
  SalesReportPurchase,
  SalesReportDetailsResponse,
} from "@/types/reports";

interface SalesReportDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSalesReport: SalesReportItem | null;
  detailsData: SalesReportDetailsResponse | undefined;
  detailsLoading: boolean;
}

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

export function SalesReportDetailsModal({
  isOpen,
  onOpenChange,
  selectedSalesReport,
  detailsData,
  detailsLoading,
}: SalesReportDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[80vw] !max-w-none !h-[80vh] flex flex-col p-0">
        {/* Fixed Header */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Purchase Details -{" "}
              {selectedSalesReport?.tracking_num || "Loading..."}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {detailsLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Loading purchase details...
              </span>
            </div>
          ) : detailsData?.data && detailsData.data.length > 0 ? (
            <div className="space-y-4">
              {/* Sale Header Info */}
              {selectedSalesReport && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tracking Number
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedSalesReport.tracking_num}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Cashier
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedSalesReport.cashier_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Date
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDateTime(selectedSalesReport.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Sales
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedSalesReport.total_sales)}
                    </p>
                  </div>
                </div>
              )}

              {/* Purchase Details Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                        Invoice #
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                        Total Price
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                        Discount
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                        Tax
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                        Grand Total
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                        Cash Received
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                        Digital Received
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailsData.data.map(
                      (purchase: SalesReportPurchase, idx: number) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                        >
                          <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                            {purchase.invoice_num || "-"}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(purchase.total_price || 0)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(purchase.total_discount || 0)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(purchase.total_tax || 0)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(purchase.grand_total || 0)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(purchase.cash_received || 0)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(
                              purchase.digital_cash_received || 0
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                              {purchase.status === 0
                                ? "Pending"
                                : purchase.status === 1
                                ? "Completed"
                                : purchase.status === 2
                                ? "Voided"
                                : purchase.status === 3
                                ? "Refunded"
                                : "Unknown"}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Payment Summary */}
              {selectedSalesReport && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Cash Received
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedSalesReport.total_cash || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Digital Cash Received
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedSalesReport.total_cashless || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Discount
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedSalesReport.total_discount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Net Sales
                    </p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(selectedSalesReport.net_sales || 0)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No purchase details available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
