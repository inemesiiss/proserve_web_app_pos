import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Calendar, X } from "lucide-react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";

interface PwdScCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: {
    cardNumber: string;
    name?: string;
    expiryDate: string;
    discountId: number;
    discountCode: string;
    discountPercentage: number;
  }) => void;
  selectedDiscountId?: number;
}

export default function PwdScCardModal({
  isOpen,
  onClose,
  onSuccess,
  selectedDiscountId,
}: PwdScCardModalProps) {
  const { availableDiscounts } = useFoodOrder();
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(
    selectedDiscountId || null,
  );
  const [error, setError] = useState("");

  // Get only ACTIVE PWD/SC discounts from the fetched data
  const activeDiscounts = availableDiscounts.filter(
    (d) => d.is_active === true,
  );

  // Get inactive discounts for display purposes
  const inactiveDiscounts = availableDiscounts.filter(
    (d) => d.is_active === false,
  );

  const handleSubmit = () => {
    // Only require discount type
    if (!selectedDiscount) {
      setError("Please select a discount type");
      return;
    }

    // Get the selected discount details
    const discount = availableDiscounts.find((d) => d.id === selectedDiscount);
    if (!discount) {
      setError("Invalid discount selected");
      return;
    }

    // Success - pass data to parent

    onSuccess({
      cardNumber: cardNumber.trim(),
      name: name.trim() || undefined,
      expiryDate: expiryDate.trim(),
      discountId: discount.id,
      discountCode: discount.discount.code,
      discountPercentage: parseFloat(discount.discount.discount_percentage),
    });

    // Reset form
    handleClose();
  };

  const handleClose = () => {
    setCardNumber("");
    setName("");
    setExpiryDate("");
    setSelectedDiscount(selectedDiscountId || null);
    setError("");
    onClose();
  };

  return (
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
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CreditCard className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    PWD / Senior Citizen
                  </h2>
                </div>
                <p className="text-sm text-gray-600">
                  Please enter the card details to verify and apply the discount
                </p>
              </div>

              {/* Discount Type Selector */}
              {availableDiscounts.length > 0 && (
                <div className="mb-5">
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Discount Type <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    {/* Active Discounts */}
                    {activeDiscounts.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2 font-medium">
                          Available Discounts
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {activeDiscounts.map((discount) => (
                            <button
                              key={discount.id}
                              onClick={() => setSelectedDiscount(discount.id)}
                              className={`p-3 rounded-lg border-2 transition font-medium text-sm ${
                                selectedDiscount === discount.id
                                  ? "border-green-600 bg-green-50 text-green-700"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                              }`}
                            >
                              <div className="font-semibold">
                                {discount.discount.code}
                              </div>
                              <div className="text-xs mt-1">
                                {discount.discount.name}
                              </div>
                              <div className="text-xs font-bold text-green-600 mt-1">
                                {discount.discount.discount_percentage}% off
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inactive Discounts - Disabled */}
                    {inactiveDiscounts.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2 font-medium">
                          Inactive Discounts
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {inactiveDiscounts.map((discount) => (
                            <div
                              key={discount.id}
                              className="p-3 rounded-lg border-2 border-gray-100 bg-gray-50 text-gray-400 font-medium text-sm cursor-not-allowed opacity-60"
                            >
                              <div className="font-semibold">
                                {discount.discount.code}
                              </div>
                              <div className="text-xs mt-1">
                                {discount.discount.name}
                              </div>
                              <div className="text-xs mt-1">(Inactive)</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No Discounts Message */}
              {availableDiscounts.length === 0 && (
                <div className="mb-5 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-700">
                    No discounts available for this branch yet. Please contact
                    your administrator.
                  </p>
                </div>
              )}

              {/* Card Number */}
              <div className="mb-5">
                <Label
                  htmlFor="cardNumber"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <CreditCard size={16} />
                  Card Number (optional)
                </Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="Enter card number"
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                    setError("");
                  }}
                  className="h-12 text-base"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the SC/PWD card number if available
                </p>
              </div>

              {/* Expiry Date */}
              <div className="mb-5">
                <Label
                  htmlFor="expiryDate"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <Calendar size={16} />
                  Expiry Date (optional)
                </Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YYYY"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                    setError("");
                  }}
                  className="h-12 text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: MM/YYYY (e.g., 12/2025), leave blank if not available
                </p>
              </div>

              {/* Info Box */}
              {selectedDiscount && (
                <div className="mb-5 bg-green-50 border border-green-200 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Discount Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount Type:</span>
                      <span className="font-semibold text-green-700">
                        {
                          availableDiscounts.find(
                            (d) => d.id === selectedDiscount,
                          )?.discount.name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount Rate:</span>
                      <span className="font-semibold text-green-700">
                        {
                          availableDiscounts.find(
                            (d) => d.id === selectedDiscount,
                          )?.discount.discount_percentage
                        }
                        %
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
                onClick={handleSubmit}
                disabled={!selectedDiscount}
                className="flex-1 h-12 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Verify & Apply
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
