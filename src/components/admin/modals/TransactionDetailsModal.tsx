import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Badge from "@/components/ui/badge";
import ConfirmationYesNo from "@/components/reusables/ConfirmationYesNo";
import { toast } from "sonner";
import { useRefundPurchaseMutation } from "@/store/api/Reports";
import { formatMoney } from "@/lib/utils";

interface Variant {
  id: number;
  product: {
    id: number;
    prod_name: string;
    image: string | null;
  };
  calculated_price: string;
}

interface TransactionItem {
  id: number;
  name: string;
  qty: number;
  price: number;
  total: number;
  category: string;
  // New fields from API
  curr_price?: string;
  total_price?: string;
  total_discount?: string;
  grand_total?: string;
  is_voided?: boolean;
  is_refunded?: boolean;
  refunded_at?: string;
  refund_reason?: string;
  variants?: Variant[] | { name: string; price: number }[];
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
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
    id: number | string; // Purchase ID
  } | null;
  items?: TransactionItem[];
  isLoadingItems?: boolean;
  onRefundSuccess?: () => void; // Callback after successful refund
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
  items = [],
  isLoadingItems = false,
  onRefundSuccess,
}: TransactionDetailsModalProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [refundPurchase, { isLoading: isRefunding }] =
    useRefundPurchaseMutation();

  // Use provided items or fallback to empty array
  const transactionItems = items;

  if (!transaction) return null;

  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === transactionItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(transactionItems.map((item) => item.id));
    }
  };

  const handleRefund = () => {
    setShowRefundConfirm(true);
  };

  const handleConfirmRefund = async () => {
    if (!transaction) return;

    try {
      // Determine if refunding all items or specific items
      const isRefundingAll =
        selectedItems.length === transactionItems.length &&
        transactionItems.length > 0;

      const refundPayload: Record<string, any> = {};

      if (isRefundingAll) {
        // Refund entire purchase
        refundPayload.purchase = transaction.id || transaction.or;
      } else {
        // Refund specific items
        refundPayload.purchase_items = selectedItems;
      }

      await refundPurchase(refundPayload).unwrap();

      const message = isRefundingAll
        ? "Purchase refunded successfully"
        : `${selectedItems.length} item(s) refunded successfully`;

      toast.success(message);

      // Call the success callback if provided
      if (onRefundSuccess) {
        onRefundSuccess();
      }

      setShowRefundConfirm(false);
      setSelectedItems([]);
      onClose();
    } catch (error) {
      console.error("Refund error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while processing the refund";
      toast.error(errorMessage);
    }
  };

  // Calculate subtotal from items (curr_price * qty for each item)
  const subtotal = transactionItems.reduce((sum, item) => {
    const unitPrice = parseFloat(item.curr_price || "0") || item.price;
    const qty = parseFloat(String(item.qty)) || 1;
    return sum + unitPrice * qty;
  }, 0);

  // Calculate selected items total for refund
  const selectedTotal = transactionItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => {
      const unitPrice = parseFloat(item.curr_price || "0") || item.price;
      const qty = parseFloat(String(item.qty)) || 1;
      const discount = parseFloat(item.total_discount || "0");
      return sum + unitPrice * qty - discount;
    }, 0);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          onClick={onClose}
        >
          <div
            className="bg-white dark:bg-gray-950 rounded-lg shadow-2xl w-[95%] max-h-[90vh] flex flex-col"
            style={{ maxWidth: "1400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Custom Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-950 z-10">
              <h2 className="text-2xl font-bold">
                Transaction Details - {transaction?.or}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-4">
                {/* Transaction Information - Enhanced Grid */}
                <div className="grid grid-cols-6 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      OR #
                    </p>
                    <p className="font-semibold text-base">{transaction.or}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Date
                    </p>
                    <p className="font-medium text-xs">{transaction.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Branch
                    </p>
                    <p className="font-medium truncate">{transaction.branch}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Cashier
                    </p>
                    <p className="font-medium truncate">
                      {transaction.cashier || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Grand Total
                    </p>
                    <p className="font-bold text-green-600">
                      {formatMoney(transaction.grand_total || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Cash Received
                    </p>
                    <p className="font-semibold">
                      {formatMoney(transaction.cash_received || 0)}
                    </p>
                  </div>
                </div>

                {/* VAT Summary - New Section */}
                <div className="grid grid-cols-5 gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                      Original Price
                    </p>
                    <p className="font-bold text-lg">
                      {formatMoney(transaction.total_price || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                      Item Discount
                    </p>
                    <p className="font-bold text-lg text-red-600">
                      -{formatMoney(transaction.total_items_discount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                      Vatable Sales
                    </p>
                    <p className="font-bold text-lg">
                      {formatMoney(transaction.vatable_sales || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                      VAT-Exempt Sales
                    </p>
                    <p className="font-bold text-lg">
                      {formatMoney(transaction.vat_exempt_sales || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                      VAT Amount
                    </p>
                    <p className="font-bold text-lg">
                      {formatMoney(transaction.vat_amount || 0)}
                    </p>
                  </div>
                </div>

                {/* Items List - Compact Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold">
                      Items ({transactionItems.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="text-xs h-8 px-3"
                      disabled={transactionItems.length === 0}
                    >
                      {selectedItems.length === transactionItems.length &&
                      transactionItems.length > 0
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>

                  {/* Table Header */}
                  <div className="grid grid-cols-14 gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-t text-xs font-semibold text-gray-700 dark:text-gray-200">
                    <div className="col-span-1 text-center">✓</div>
                    <div className="col-span-3">Item</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-right">Unit Price</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                    <div className="col-span-2 text-right">Discount</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  <div className="max-h-[350px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-b">
                    {isLoadingItems && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Loading items...
                      </div>
                    )}
                    {!isLoadingItems && transactionItems.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No items found
                      </div>
                    )}
                    {transactionItems.map((item) => {
                      // Calculate price: curr_price * qty
                      const unitPrice =
                        parseFloat(item.curr_price || "0") || item.price;
                      const qty = parseFloat(String(item.qty)) || 1;
                      const itemTotal = unitPrice * qty;

                      // Get discount per item
                      const totalDiscount = parseFloat(
                        item.total_discount || "0"
                      );

                      // Grand total = (price * qty) - discount
                      const grandTotal = itemTotal - totalDiscount;

                      const isVoided = item.is_voided;
                      const isRefunded = item.is_refunded;

                      // Check if variants is the new API format
                      const hasNewVariants =
                        item.variants &&
                        item.variants.length > 0 &&
                        "product" in (item.variants[0] as Variant);

                      return (
                        <div
                          key={item.id}
                          className={`grid grid-cols-14 gap-1 px-3 py-2 border-b border-gray-100 dark:border-gray-700 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            selectedItems.includes(item.id)
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          } ${
                            isVoided || isRefunded
                              ? "opacity-50 line-through"
                              : ""
                          }`}
                          onClick={() =>
                            !isVoided &&
                            !isRefunded &&
                            handleSelectItem(item.id)
                          }
                        >
                          {/* Checkbox */}
                          <div className="col-span-1 flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() =>
                                !isVoided &&
                                !isRefunded &&
                                handleSelectItem(item.id)
                              }
                              className="w-4 h-4 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                              disabled={isVoided || isRefunded}
                            />
                          </div>

                          {/* Item Name & Variants */}
                          <div className="col-span-3">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold truncate">
                                {item.name}
                              </span>
                              {isVoided && (
                                <Badge
                                  variant="error"
                                  className="text-[10px] px-1 py-0"
                                >
                                  VOID
                                </Badge>
                              )}
                              {item.is_refunded && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1 py-0 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                >
                                  REFUNDED
                                </Badge>
                              )}
                            </div>
                            {/* Variants - Compact inline display */}
                            {item.variants && item.variants.length > 0 && (
                              <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                {hasNewVariants
                                  ? (item.variants as Variant[])
                                      .map((v) => v.product.prod_name)
                                      .join(", ")
                                  : (
                                      item.variants as {
                                        name: string;
                                        price: number;
                                      }[]
                                    )
                                      .map((v) => v.name)
                                      .join(", ")}
                              </div>
                            )}
                          </div>

                          {/* Quantity */}
                          <div className="col-span-1 text-center flex items-center justify-center">
                            {qty}
                          </div>

                          {/* Unit Price */}
                          <div className="col-span-2 text-right flex items-center justify-end">
                            {formatMoney(unitPrice)}
                          </div>

                          {/* Subtotal */}
                          <div className="col-span-2 text-right flex items-center justify-end">
                            {formatMoney(itemTotal)}
                          </div>

                          {/* Discount */}
                          <div className="col-span-2 text-right flex items-center justify-end">
                            {totalDiscount > 0 ? (
                              <span className="text-red-600 font-semibold">
                                -{formatMoney(totalDiscount)}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>

                          {/* Grand Total */}
                          <div className="col-span-2 text-right font-bold text-green-600 flex items-center justify-end">
                            {formatMoney(grandTotal)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Transaction Summary - Compact */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Item Discount</span>
                    <span className="font-medium text-green-600">
                      -{formatMoney(transaction.total_items_discount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span className="font-medium">
                      {formatMoney(transaction.vat_amount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base">
                    <span>Grand Total</span>
                    <span>{formatMoney(transaction.grand_total || 0)}</span>
                  </div>
                </div>

                {selectedItems.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">
                      Refund Amount ({selectedItems.length} items)
                    </span>
                    <span className="font-bold text-red-600">
                      {formatMoney(selectedTotal)}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" size="sm" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRefund}
                    disabled={selectedItems.length === 0 || isRefunding}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                  >
                    {isRefunding
                      ? "Processing..."
                      : `Refund (${selectedItems.length})`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      <ConfirmationYesNo
        isOpen={showRefundConfirm}
        onClose={() => setShowRefundConfirm(false)}
        onConfirm={handleConfirmRefund}
        title="Confirm Refund"
        message={`Are you sure you want to refund ${
          selectedItems.length === transactionItems.length &&
          transactionItems.length > 0
            ? "the entire purchase"
            : `${selectedItems.length} item(s)`
        } with a total amount of ₱${selectedTotal.toFixed(
          2
        )}? This action cannot be undone.`}
        confirmText={isRefunding ? "Processing..." : "Confirm Refund"}
        cancelText="Cancel"
        isLoading={isRefunding}
      />
    </>
  );
}
