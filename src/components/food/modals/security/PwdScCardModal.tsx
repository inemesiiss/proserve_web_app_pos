import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, User, Calendar, X } from "lucide-react";

interface PwdScCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: {
    cardNumber: string;
    name: string;
    expiryDate: string;
  }) => void;
}

export default function PwdScCardModal({
  isOpen,
  onClose,
  onSuccess,
}: PwdScCardModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Basic validation
    if (!cardNumber.trim()) {
      setError("Card number is required");
      return;
    }
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!expiryDate.trim()) {
      setError("Expiry date is required");
      return;
    }

    // Card number should be at least 8 characters
    if (cardNumber.trim().length < 8) {
      setError("Card number must be at least 8 characters");
      return;
    }

    // Success - pass data to parent
    onSuccess({
      cardNumber: cardNumber.trim(),
      name: name.trim(),
      expiryDate: expiryDate.trim(),
    });

    // Reset form
    handleClose();
  };

  const handleClose = () => {
    setCardNumber("");
    setName("");
    setExpiryDate("");
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

              {/* Card Number */}
              <div className="mb-5">
                <Label
                  htmlFor="cardNumber"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <CreditCard size={16} />
                  Card Number <span className="text-red-500">*</span>
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
                  Minimum 8 characters
                </p>
              </div>

              {/* Name */}
              <div className="mb-5">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <User size={16} />
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter cardholder name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="h-12 text-base"
                />
              </div>

              {/* Expiry Date */}
              <div className="mb-5">
                <Label
                  htmlFor="expiryDate"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <Calendar size={16} />
                  Expiry Date <span className="text-red-500">*</span>
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
                  Format: MM/YYYY (e.g., 12/2025)
                </p>
              </div>

              {/* Info Box */}
              <div className="mb-5 bg-green-50 border border-green-200 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Discount Information
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount Type:</span>
                    <span className="font-semibold text-green-700">
                      PWD / Senior Citizen
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount Rate:</span>
                    <span className="font-semibold text-green-700">20%</span>
                  </div>
                </div>
              </div>

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
                disabled={
                  !cardNumber.trim() || !name.trim() || !expiryDate.trim()
                }
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
