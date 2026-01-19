import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  Percent,
  DollarSign,
  Tag,
  CreditCard,
  User,
  Calendar,
} from "lucide-react";
import SecurityPasscodeModal from "./SecurityPasscodeModal";

interface OrderTotalDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (discountData: {
    discountCategory: "voucher" | "sc-pwd" | "manual";
    type: "percentage" | "fixed";
    value: number;
    code?: string;
    customerName?: string;
    discountCardNum?: string;
    discountCardExp?: string;
    discountNote?: string;
  }) => void;
  currentTotal: number;
}

export default function OrderTotalDiscountModal({
  isOpen,
  onClose,
  onApplyDiscount,
  currentTotal,
}: OrderTotalDiscountModalProps) {
  const [discountCategory, setDiscountCategory] = useState<
    "voucher" | "sc-pwd" | "manual"
  >("voucher");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [discountCardNum, setDiscountCardNum] = useState("");
  const [discountCardExp, setDiscountCardExp] = useState("");
  const [discountNote, setDiscountNote] = useState("");
  const [error, setError] = useState("");
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  const calculateDiscountPreview = () => {
    const value = parseFloat(discountValue);
    if (isNaN(value) || value <= 0) return 0;

    if (discountType === "percentage") {
      if (value > 100) return 0;
      return (currentTotal * value) / 100;
    } else {
      if (value > currentTotal) return 0;
      return value;
    }
  };

  const discountPreview = calculateDiscountPreview();
  const newTotal = currentTotal - discountPreview;

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

    if (discountType === "fixed" && value > currentTotal) {
      setError(`Fixed amount cannot exceed ₱${currentTotal.toFixed(2)}`);
      return;
    }

    // Category-specific validations
    if (discountCategory === "voucher" && !discountCode.trim()) {
      setError("Please enter a discount code");
      return;
    }

    if (discountCategory === "sc-pwd") {
      if (!discountCardNum.trim()) {
        setError("Please enter card number");
        return;
      }
      if (discountCardNum.trim().length < 8) {
        setError("Card number must be at least 8 characters");
        return;
      }
      if (!discountCardExp.trim()) {
        setError("Please enter expiry date");
        return;
      }
    }

    setError("");
    setShowPasscodeModal(true);
  };

  const handlePasscodeSuccess = () => {
    const value = parseFloat(discountValue);
    let finalNote = discountNote.trim();

    if (discountCategory === "voucher") {
      finalNote = finalNote || `Voucher: ${discountCode.trim()}`;
    } else if (discountCategory === "sc-pwd") {
      finalNote =
        finalNote ||
        `Card: ${discountCardNum.trim()} | Exp: ${discountCardExp.trim()}${
          customerName.trim() ? ` | Name: ${customerName.trim()}` : ""
        }`;
    }

    onApplyDiscount({
      discountCategory,
      type: discountType,
      value,
      code: discountCategory === "voucher" ? discountCode.trim() : undefined,
      customerName: customerName.trim() || undefined,
      discountCardNum:
        discountCategory === "sc-pwd" ? discountCardNum.trim() : undefined,
      discountCardExp:
        discountCategory === "sc-pwd" ? discountCardExp.trim() : undefined,
      discountNote: finalNote || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setDiscountCategory("voucher");
    setDiscountType("percentage");
    setDiscountValue("");
    setDiscountCode("");
    setCustomerName("");
    setDiscountCardNum("");
    setDiscountCardExp("");
    setDiscountNote("");
    setError("");
    setShowPasscodeModal(false);
    onClose();
  };

  const getCategoryColor = () => {
    switch (discountCategory) {
      case "voucher":
        return "purple";
      case "sc-pwd":
        return "green";
      case "manual":
        return "blue";
      default:
        return "purple";
    }
  };

  const color = getCategoryColor();

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
              className="bg-white rounded-3xl shadow-2xl p-8 w-[520px] max-h-[90vh] flex flex-col relative"
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
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Apply Order Total Discount
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 font-medium">
                      Order Total (After Item Discounts)
                    </p>
                    <p className="text-xl font-bold text-gray-800 mt-1">
                      ₱{currentTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Discount Category Selection */}
                <div className="mb-5">
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Discount Category
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={
                        discountCategory === "voucher" ? "default" : "outline"
                      }
                      className={`h-16 flex flex-col items-center justify-center gap-1 text-xs ${
                        discountCategory === "voucher"
                          ? "bg-purple-600 text-white"
                          : ""
                      }`}
                      onClick={() => {
                        setDiscountCategory("voucher");
                        setError("");
                      }}
                    >
                      <Tag size={18} />
                      <span>Voucher</span>
                    </Button>
                    <Button
                      type="button"
                      variant={
                        discountCategory === "sc-pwd" ? "default" : "outline"
                      }
                      className={`h-16 flex flex-col items-center justify-center gap-1 text-xs ${
                        discountCategory === "sc-pwd"
                          ? "bg-green-600 text-white"
                          : ""
                      }`}
                      onClick={() => {
                        setDiscountCategory("sc-pwd");
                        setError("");
                      }}
                    >
                      <CreditCard size={18} />
                      <span>SC/PWD</span>
                    </Button>
                    <Button
                      type="button"
                      variant={
                        discountCategory === "manual" ? "default" : "outline"
                      }
                      className={`h-16 flex flex-col items-center justify-center gap-1 text-xs ${
                        discountCategory === "manual"
                          ? "bg-blue-600 text-white"
                          : ""
                      }`}
                      onClick={() => {
                        setDiscountCategory("manual");
                        setError("");
                      }}
                    >
                      <Percent size={18} />
                      <span>Manual</span>
                    </Button>
                  </div>
                </div>

                {/* Category-Specific Fields */}
                {discountCategory === "voucher" && (
                  <div className="mb-5">
                    <Label
                      htmlFor="discountCode"
                      className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                    >
                      <Tag size={16} />
                      Voucher Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="discountCode"
                      type="text"
                      placeholder="Enter voucher code"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value.toUpperCase());
                        setError("");
                      }}
                      className="h-11 text-base uppercase"
                    />
                  </div>
                )}

                {discountCategory === "sc-pwd" && (
                  <div className="space-y-4 mb-5">
                    <div>
                      <Label
                        htmlFor="customerName"
                        className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      >
                        <User size={16} />
                        Customer Name
                      </Label>
                      <Input
                        id="customerName"
                        type="text"
                        placeholder="Enter customer name (optional)"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          setError("");
                        }}
                        className="h-11 text-base"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="discountCardNum"
                        className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      >
                        <CreditCard size={16} />
                        Discount Card Number{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="discountCardNum"
                        type="text"
                        placeholder="Enter card number"
                        value={discountCardNum}
                        onChange={(e) => {
                          setDiscountCardNum(e.target.value);
                          setError("");
                        }}
                        className="h-11 text-base"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="discountCardExp"
                        className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      >
                        <Calendar size={16} />
                        Card Expiry <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="discountCardExp"
                        type="text"
                        placeholder="MM/YYYY"
                        value={discountCardExp}
                        onChange={(e) => {
                          setDiscountCardExp(e.target.value);
                          setError("");
                        }}
                        className="h-11 text-base"
                      />
                    </div>
                  </div>
                )}

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
                      className={`h-16 flex flex-col items-center justify-center gap-1 ${
                        discountType === "percentage"
                          ? `bg-${color}-600 text-white`
                          : ""
                      }`}
                      style={
                        discountType === "percentage"
                          ? {
                              backgroundColor:
                                color === "purple"
                                  ? "#9333ea"
                                  : color === "green"
                                  ? "#16a34a"
                                  : "#2563eb",
                            }
                          : {}
                      }
                      onClick={() => {
                        setDiscountType("percentage");
                        setDiscountValue("");
                        setError("");
                      }}
                    >
                      <Percent size={20} />
                      <span className="text-sm font-semibold">Percentage</span>
                    </Button>
                    <Button
                      type="button"
                      variant={discountType === "fixed" ? "default" : "outline"}
                      className={`h-16 flex flex-col items-center justify-center gap-1 ${
                        discountType === "fixed"
                          ? `bg-${color}-600 text-white`
                          : ""
                      }`}
                      style={
                        discountType === "fixed"
                          ? {
                              backgroundColor:
                                color === "purple"
                                  ? "#9333ea"
                                  : color === "green"
                                  ? "#16a34a"
                                  : "#2563eb",
                            }
                          : {}
                      }
                      onClick={() => {
                        setDiscountType("fixed");
                        setDiscountValue("");
                        setError("");
                      }}
                    >
                      <DollarSign size={20} />
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
                        : `Enter amount (0-${currentTotal.toFixed(2)})`
                    }
                    value={discountValue}
                    onChange={(e) => {
                      setDiscountValue(e.target.value);
                      setError("");
                    }}
                    min="0"
                    max={discountType === "percentage" ? "100" : currentTotal}
                    step={discountType === "percentage" ? "1" : "0.01"}
                    className="h-11 text-base"
                  />
                </div>

                {/* Note Input */}
                <div className="mb-5">
                  <Label
                    htmlFor="discountNote"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    Additional Note
                  </Label>
                  <textarea
                    id="discountNote"
                    placeholder="Enter additional note (optional)"
                    value={discountNote}
                    onChange={(e) => {
                      setDiscountNote(e.target.value);
                      setError("");
                    }}
                    className="w-full h-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                    maxLength={150}
                  />
                </div>

                {/* Preview */}
                {discountValue && parseFloat(discountValue) > 0 && (
                  <div
                    className={`mb-5 bg-${color}-50 border border-${color}-200 rounded-lg p-3`}
                    style={{
                      backgroundColor:
                        color === "purple"
                          ? "#faf5ff"
                          : color === "green"
                          ? "#f0fdf4"
                          : "#eff6ff",
                      borderColor:
                        color === "purple"
                          ? "#e9d5ff"
                          : color === "green"
                          ? "#bbf7d0"
                          : "#bfdbfe",
                    }}
                  >
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Preview
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Total:</span>
                        <span className="font-semibold">
                          ₱{currentTotal.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className="flex justify-between"
                        style={{
                          color:
                            color === "purple"
                              ? "#7e22ce"
                              : color === "green"
                              ? "#15803d"
                              : "#1e40af",
                        }}
                      >
                        <span>Total Discount:</span>
                        <span className="font-semibold">
                          -₱{discountPreview.toFixed(2)}
                          {discountType === "percentage" &&
                            ` (${discountValue}%)`}
                        </span>
                      </div>
                      <div
                        className="flex justify-between border-t pt-1 mt-1"
                        style={{
                          borderColor:
                            color === "purple"
                              ? "#e9d5ff"
                              : color === "green"
                              ? "#bbf7d0"
                              : "#bfdbfe",
                        }}
                      >
                        <span className="font-semibold text-gray-700">
                          New Total:
                        </span>
                        <span
                          className="font-bold text-lg"
                          style={{
                            color:
                              color === "purple"
                                ? "#7e22ce"
                                : color === "green"
                                ? "#15803d"
                                : "#1e40af",
                          }}
                        >
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
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleValidateAndOpenPasscode}
                  disabled={!discountValue}
                  className="flex-1 h-11 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: discountValue
                      ? color === "purple"
                        ? "#9333ea"
                        : color === "green"
                        ? "#16a34a"
                        : "#2563eb"
                      : undefined,
                  }}
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
        textMessage="Enter manager code to authorize order discount"
        digitCount={6}
      />
    </>
  );
}
