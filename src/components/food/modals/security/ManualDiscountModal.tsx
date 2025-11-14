import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Percent, DollarSign } from "lucide-react";
import SecurityPasscodeModal from "./SecurityPasscodeModal";

interface ManualDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (discountData: {
    type: "percentage" | "fixed";
    value: number;
    note: string;
  }) => void;
  itemName: string;
  itemPrice: number;
  itemQty: number;
}

export default function ManualDiscountModal({
  isOpen,
  onClose,
  onApplyDiscount,
  itemName,
  itemPrice,
  itemQty,
}: ManualDiscountModalProps) {
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  const totalItemPrice = itemPrice * itemQty;

  const calculateDiscountPreview = () => {
    const value = parseFloat(discountValue);
    if (isNaN(value) || value <= 0) return 0;

    if (discountType === "percentage") {
      if (value > 100) return 0;
      return (totalItemPrice * value) / 100;
    } else {
      if (value > totalItemPrice) return 0;
      return value;
    }
  };

  const discountPreview = calculateDiscountPreview();
  const newTotal = totalItemPrice - discountPreview;

  const handleValidateAndOpenPasscode = () => {
    const value = parseFloat(discountValue);

    // Validation
    if (!discountValue || isNaN(value) || value <= 0) {
      setError("Please enter a valid discount value");
      return;
    }

    if (discountType === "percentage" && value > 100) {
      setError("Percentage cannot exceed 100%");
      return;
    }

    if (discountType === "fixed" && value > totalItemPrice) {
      setError(`Fixed amount cannot exceed ₱${totalItemPrice.toFixed(2)}`);
      return;
    }

    if (!note.trim()) {
      setError("Please provide a reason for the discount");
      return;
    }

    setError("");
    setShowPasscodeModal(true);
  };

  const handlePasscodeSuccess = () => {
    const value = parseFloat(discountValue);
    onApplyDiscount({
      type: discountType,
      value,
      note: note.trim(),
    });
    handleClose();
  };

  const handleClose = () => {
    setDiscountType("percentage");
    setDiscountValue("");
    setNote("");
    setError("");
    setShowPasscodeModal(false);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 w-[480px] max-h-[85vh] flex flex-col relative"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
              >
                <X size={24} />
              </button>

              {/* Scrollable Content */}
              <div
                className="overflow-y-auto pr-2 -mr-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style>{`
                  .overflow-y-auto::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {/* Header */}
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Apply Manual Discount
                  </h2>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 font-medium">
                      {itemName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Qty: {itemQty} × ₱{itemPrice.toFixed(2)} = ₱
                      {totalItemPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Discount Type Selection */}
                <div className="mb-5">
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Discount Type
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={
                        discountType === "percentage" ? "default" : "outline"
                      }
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        discountType === "percentage"
                          ? "bg-blue-600 text-white"
                          : ""
                      }`}
                      onClick={() => {
                        setDiscountType("percentage");
                        setDiscountValue("");
                        setError("");
                      }}
                    >
                      <Percent size={24} />
                      <span className="text-sm font-semibold">Percentage</span>
                    </Button>
                    <Button
                      type="button"
                      variant={discountType === "fixed" ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        discountType === "fixed" ? "bg-blue-600 text-white" : ""
                      }`}
                      onClick={() => {
                        setDiscountType("fixed");
                        setDiscountValue("");
                        setError("");
                      }}
                    >
                      <DollarSign size={24} />
                      <span className="text-sm font-semibold">
                        Fixed Amount
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Discount Value Input */}
                <div className="mb-5">
                  <Label
                    htmlFor="discountValue"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    {discountType === "percentage"
                      ? "Percentage (%)"
                      : "Fixed Amount (₱)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    placeholder={
                      discountType === "percentage"
                        ? "Enter percentage (0-100)"
                        : `Enter amount (0-${totalItemPrice.toFixed(2)})`
                    }
                    value={discountValue}
                    onChange={(e) => {
                      setDiscountValue(e.target.value);
                      setError("");
                    }}
                    min="0"
                    max={discountType === "percentage" ? "100" : totalItemPrice}
                    step={discountType === "percentage" ? "1" : "0.01"}
                    className="h-12 text-lg"
                  />
                  {discountType === "percentage" && (
                    <p className="text-xs text-gray-500 mt-1">Maximum: 100%</p>
                  )}
                  {discountType === "fixed" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: ₱{totalItemPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Note Input */}
                <div className="mb-5">
                  <Label
                    htmlFor="note"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    Reason / Note <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="note"
                    placeholder="Enter reason for discount (required)"
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                      setError("");
                    }}
                    className="w-full h-20 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {note.length}/200 characters
                  </p>
                </div>

                {/* Preview */}
                {discountValue && parseFloat(discountValue) > 0 && (
                  <div className="mb-5 bg-green-50 border border-green-200 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Preview
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Original Total:</span>
                        <span className="font-semibold">
                          ₱{totalItemPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-700">
                        <span>Discount:</span>
                        <span className="font-semibold">
                          -₱{discountPreview.toFixed(2)}
                          {discountType === "percentage" &&
                            ` (${discountValue}%)`}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-green-300 pt-1 mt-1">
                        <span className="font-semibold text-gray-700">
                          New Total:
                        </span>
                        <span className="font-bold text-lg text-green-700">
                          ₱{newTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Actions - Fixed at bottom */}
              <div className="flex gap-3 pt-4 border-t mt-auto">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleValidateAndOpenPasscode}
                  disabled={!discountValue || !note.trim()}
                  className="flex-1 h-12 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Apply Discount
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Passcode Modal */}
      <SecurityPasscodeModal
        isOpen={showPasscodeModal}
        onClose={() => setShowPasscodeModal(false)}
        onSuccess={handlePasscodeSuccess}
        correctCode="123456"
        textMessage="Enter manager code to authorize discount"
        digitCount={6}
      />
    </>
  );
}
