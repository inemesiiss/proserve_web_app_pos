import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Badge from "@/components/ui/badge";
import ConfirmationYesNo from "@/components/reusables/ConfirmationYesNo";

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
    discount: number;
    cashier: string;
  } | null;
  items?: TransactionItem[];
  isLoadingItems?: boolean;
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
  items = [],
  isLoadingItems = false,
}: TransactionDetailsModalProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

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

  const handleConfirmRefund = () => {
    console.log("Refunding items:", selectedItems);
    // Add refund logic here
    setShowRefundConfirm(false);
    setSelectedItems([]);
    onClose();
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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-bold">
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Transaction Information - Compact Grid */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">OR #</p>
                <p className="font-semibold truncate">{transaction.or}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium text-xs">{transaction.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Branch
                </p>
                <p className="font-medium truncate">{transaction.branch}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cashier
                </p>
                <p className="font-medium truncate">
                  {transaction.cashier || "N/A"}
                </p>
              </div>
            </div>

            {/* Items List - Compact Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">
                  Items ({transactionItems.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs h-7 px-2"
                  disabled={transactionItems.length === 0}
                >
                  {selectedItems.length === transactionItems.length &&
                  transactionItems.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
                <div className="col-span-1"></div>
                <div className="col-span-4">Item</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Discount</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="max-h-[280px] overflow-y-auto">
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
                  const totalDiscount = parseFloat(item.total_discount || "0");

                  // Grand total = (price * qty) - discount
                  const grandTotal = itemTotal - totalDiscount;

                  const isVoided = item.is_voided;

                  // Check if variants is the new API format
                  const hasNewVariants =
                    item.variants &&
                    item.variants.length > 0 &&
                    "product" in (item.variants[0] as Variant);

                  return (
                    <div
                      key={item.id}
                      className={`grid grid-cols-12 gap-1 px-2 py-2 border-b border-gray-100 dark:border-gray-700 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        selectedItems.includes(item.id)
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      } ${isVoided ? "opacity-50 line-through" : ""}`}
                      onClick={() => handleSelectItem(item.id)}
                    >
                      {/* Checkbox */}
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-4 h-4 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Item Name & Variants */}
                      <div className="col-span-4">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-xs truncate">
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
                      <div className="col-span-1 text-center text-xs flex items-center justify-center">
                        {item.qty}
                      </div>

                      {/* Price (curr_price * qty) */}
                      <div className="col-span-2 text-right text-xs flex items-center justify-end">
                        ₱{itemTotal.toFixed(2)}
                      </div>

                      {/* Discount */}
                      <div className="col-span-2 text-right text-xs flex items-center justify-end">
                        {totalDiscount > 0 ? (
                          <span className="text-green-600">
                            -₱{totalDiscount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>

                      {/* Grand Total */}
                      <div className="col-span-2 text-right font-semibold text-xs flex items-center justify-end">
                        ₱{grandTotal.toFixed(2)}
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
                <span className="font-medium">₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span className="font-medium text-green-600">
                  -₱{transaction.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium">
                  ₱{transaction.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₱{transaction.amount.toFixed(2)}</span>
              </div>
            </div>

            {selectedItems.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex justify-between items-center">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  Refund Amount ({selectedItems.length} items)
                </span>
                <span className="font-bold text-red-600">
                  ₱{selectedTotal.toFixed(2)}
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
                disabled={selectedItems.length === 0}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
              >
                Refund ({selectedItems.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Confirmation Modal */}
      <ConfirmationYesNo
        isOpen={showRefundConfirm}
        onClose={() => setShowRefundConfirm(false)}
        onConfirm={handleConfirmRefund}
        title="Confirm Refund"
        message={`Are you sure you want to refund ${
          selectedItems.length
        } item(s) with a total amount of ₱${selectedTotal.toFixed(
          2
        )}? This action cannot be undone.`}
        confirmText="Confirm Refund"
        cancelText="Cancel"
      />
    </>
  );
}
