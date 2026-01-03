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

interface TransactionItem {
  id: number;
  name: string;
  qty: number;
  price: number;
  total: number;
  category: string;
  variants?: { name: string; price: number }[];
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

  const subtotal = transactionItems.reduce((sum, item) => sum + item.total, 0);
  const selectedTotal = transactionItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Transaction Information */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  OR Number
                </p>
                <p className="font-semibold text-lg">{transaction.or}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Date & Time
                </p>
                <p className="font-semibold">{transaction.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Branch
                </p>
                <p className="font-semibold">{transaction.branch}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cashier
                </p>
                <p className="font-semibold">{transaction.cashier || "N/A"}</p>
              </div>
            </div>

            <Separator />

            {/* Items List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Items Purchased</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                  disabled={transactionItems.length === 0}
                >
                  {selectedItems.length === transactionItems.length &&
                  transactionItems.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>

              <div className="space-y-2">
                {isLoadingItems && (
                  <div className="text-center py-8 text-gray-500">
                    Loading items...
                  </div>
                )}
                {!isLoadingItems && transactionItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No items found
                  </div>
                )}
                {transactionItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-3 border rounded-lg transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedItems.includes(item.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-5 h-5 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.qty} × ₱{item.price.toFixed(2)}
                      </p>
                      {/* Show variants if any */}
                      {item.variants && item.variants.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {item.variants.map((v, idx) => (
                            <span key={idx}>
                              {v.name}
                              {v.price > 0 && ` (+₱${v.price.toFixed(2)})`}
                              {idx < item.variants!.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ₱{item.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Transaction Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Discount
                </span>
                <span className="font-semibold text-green-600">
                  -₱{transaction.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-semibold">
                  ₱{transaction.tax.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>₱{transaction.amount.toFixed(2)}</span>
              </div>

              {selectedItems.length > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-red-600">
                    <span>Refund Amount</span>
                    <span>₱{selectedTotal.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={handleRefund}
                disabled={selectedItems.length === 0}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
              >
                Refund Selected Items ({selectedItems.length})
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
