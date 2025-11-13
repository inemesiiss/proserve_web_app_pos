import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Wallet, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import type { OrderItem } from "@/context/food/FoodOrderProvider";

interface KioskPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  total: number;
  orderType: "dine-in" | "takeout";
  onPaymentComplete: () => void;
}

type PaymentMethod = "cash" | "maya" | "gcash" | "card";
type PaymentStep = "select-method" | "processing" | "complete";

export default function KioskPaymentModal({
  isOpen,
  onClose,
  items,
  total,
  orderType,
  onPaymentComplete,
}: KioskPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("select-method");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [isPrinting, setIsPrinting] = useState(false);

  // Generate 6-digit order number
  useEffect(() => {
    if (isOpen && !orderNumber) {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(randomNum.toString());
    }
  }, [isOpen, orderNumber]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPaymentMethod(null);
        setPaymentStep("select-method");
        setOrderNumber("");
        setIsPrinting(false);
      }, 300);
    }
  }, [isOpen]);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPaymentStep("processing");
  };

  const handlePaymentConfirm = async () => {
    setIsPrinting(true);

    // Simulate printing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsPrinting(false);
    setPaymentStep("complete");

    // Auto close after showing success
    setTimeout(() => {
      onPaymentComplete();
      onClose();
    }, 3000);
  };

  const handleBack = () => {
    setPaymentMethod(null);
    setPaymentStep("select-method");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">Payment</h2>
                    <p className="text-blue-100 text-sm">
                      Order #{orderNumber} •{" "}
                      {orderType === "dine-in" ? "Dine In" : "Takeout"}
                    </p>
                  </div>
                </div>
                {paymentStep === "select-method" && (
                  <button
                    onClick={onClose}
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {/* Step 1: Select Payment Method */}
                {paymentStep === "select-method" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Total Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 text-center mb-8">
                      <p className="text-gray-600 text-lg mb-2">Total Amount</p>
                      <p className="text-6xl font-black text-gray-800">
                        ₱{total.toFixed(2)}
                      </p>
                    </div>

                    {/* Payment Method Selection */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Choose Payment Method
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Cash Payment */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePaymentMethodSelect("cash")}
                        className="group relative bg-white border-2 border-gray-200 hover:border-green-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wallet className="w-12 h-12 text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-black mb-1 text-gray-800">
                              CASH
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Pay at the counter
                            </p>
                          </div>
                        </div>
                      </motion.button>

                      {/* Maya */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePaymentMethodSelect("maya")}
                        className="group relative bg-white border-2 border-gray-200 hover:border-emerald-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-full h-20 flex items-center justify-center">
                            <img
                              src="/payments/maya.webp"
                              alt="Maya"
                              className="h-16 object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">
                              Scan QR to pay
                            </p>
                          </div>
                        </div>
                      </motion.button>

                      {/* QRPh (GCash) */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePaymentMethodSelect("gcash")}
                        className="group relative bg-white border-2 border-gray-200 hover:border-blue-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-full h-20 flex items-center justify-center">
                            <img
                              src="/payments/qrph.jfif"
                              alt="QRPh"
                              className="h-16 object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">
                              Scan QR to pay
                            </p>
                          </div>
                        </div>
                      </motion.button>

                      {/* Card */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePaymentMethodSelect("card")}
                        className="group relative bg-white border-2 border-gray-200 hover:border-purple-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-full h-20 flex items-center justify-center">
                            <img
                              src="/payments/cards.png"
                              alt="Credit/Debit Cards"
                              className="h-16 object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">
                              Credit/Debit Card
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Processing Payment */}
                {paymentStep === "processing" && paymentMethod && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Order Number Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 text-center mb-6">
                      <p className="text-gray-600 text-lg mb-2">
                        Your Order Number
                      </p>
                      <p className="text-7xl font-black text-blue-600 mb-4">
                        {orderNumber}
                      </p>
                      <div className="flex justify-center mb-4">
                        <QRCodeCanvas
                          value={`ORDER-${orderNumber}`}
                          size={200}
                          level="H"
                          className="border-4 border-white shadow-lg rounded-xl"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        Present this number when collecting your order
                      </p>
                    </div>

                    {/* Cash Payment */}
                    {paymentMethod === "cash" && (
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Wallet className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800">
                          Please proceed to the counter
                        </h3>
                        <p className="text-xl text-gray-600">
                          Show your order number and pay ₱{total.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {/* Cashless Payment (Maya, GCash, Card) */}
                    {["maya", "gcash", "card"].includes(paymentMethod) && (
                      <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <Smartphone className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800">
                          Scan QR Code to Pay
                        </h3>
                        <p className="text-xl text-gray-600">
                          Pay ₱{total.toFixed(2)} using{" "}
                          {paymentMethod.toUpperCase()}
                        </p>

                        {/* Payment QR Code */}
                        <div className="flex justify-center">
                          <div className="bg-white p-6 rounded-2xl shadow-xl">
                            <QRCodeCanvas
                              value={`${paymentMethod}:payment:${orderNumber}:${total}`}
                              size={250}
                              level="H"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                      <Button
                        onClick={handleBack}
                        disabled={isPrinting}
                        className="flex-1 h-16 text-xl font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
                      >
                        ← Back
                      </Button>
                      <Button
                        onClick={handlePaymentConfirm}
                        disabled={isPrinting}
                        className="flex-1 h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl shadow-lg"
                      >
                        {isPrinting ? (
                          <>
                            <Receipt className="w-6 h-6 mr-2 animate-pulse" />
                            Printing Receipt...
                          </>
                        ) : (
                          <>
                            <Receipt className="w-6 h-6 mr-2" />
                            {paymentMethod === "cash"
                              ? "Print Order Number"
                              : "Confirm Payment"}
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment Complete */}
                {paymentStep === "complete" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        ✓
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h2 className="text-4xl font-black text-green-600 mb-4">
                        Order Confirmed!
                      </h2>
                      <div className="bg-green-50 rounded-2xl p-6 inline-block mb-4">
                        <p className="text-gray-600 text-lg mb-2">
                          Your Order Number
                        </p>
                        <p className="text-6xl font-black text-green-600">
                          {orderNumber}
                        </p>
                      </div>
                      <p className="text-xl text-gray-600 mb-2">
                        {paymentMethod === "cash"
                          ? "Please proceed to the counter to pay"
                          : "Payment successful! Receipt is printing..."}
                      </p>
                      <p className="text-lg text-gray-500">
                        {orderType === "dine-in"
                          ? "Your order will be served to your table"
                          : "You'll be called when your order is ready"}
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Footer - Order Summary */}
              {paymentStep !== "complete" && (
                <div className="border-t-2 border-gray-200 bg-gray-50 px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Items</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {items.reduce((sum, item) => sum + item.qty, 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Total Amount</p>
                      <p className="text-3xl font-black text-blue-600">
                        ₱{total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
