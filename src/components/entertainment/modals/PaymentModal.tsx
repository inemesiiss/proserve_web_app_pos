import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/context/entertainment/OrderProvider";
import ReceiptPrinter from "../components/print/PrintReceipt";

type PaymentMethod = "none" | "card" | "qrph" | "cash" | "maya";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  selectedPrinter: string; // optional printer name
}

export default function PaymentModal({
  isOpen,
  onClose,
  total,
  selectedPrinter,
}: PaymentModalProps) {
  const navigate = useNavigate();
  const { clearOrder } = useOrder();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("none");
  const [isPaid, setIsPaid] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const printerName = selectedPrinter;

  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod("none");
      setIsPaid(false);
      setShowReceipt(false);
    }
  }, [isOpen]);

  // ⚡ Automatically triggers payment and printing flow
  const autoCompletePayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setIsPaid(true);
    setTimeout(() => {
      setShowReceipt(true);
    }, 500); // delay for animation
  };

  const handlePrintSuccess = () => {
    setPaymentMethod("none");
    clearOrder();
    setShowReceipt(false);
    setIsPaid(false);

    // ✅ Redirect back to cinema screen
    setTimeout(() => {
      navigate("/cinema");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {!isPaid ? (
              <>
                <h2 className="text-xl font-bold mb-3 text-center">
                  Choose Your Payment Method
                </h2>

                <div className="flex flex-col items-center gap-4 mt-4">
                  <motion.img
                    src="/payments/maya.webp"
                    alt="Maya"
                    className="w-64 h-20 cursor-pointer hover:scale-105 transition rounded-xl shadow-md"
                    onClick={() => autoCompletePayment("maya")}
                  />
                  <motion.img
                    src="/payments/qrph.jfif"
                    alt="QRPh"
                    className="w-64 h-16 cursor-pointer hover:scale-105 transition"
                    onClick={() => autoCompletePayment("qrph")}
                  />
                  <motion.img
                    src="/payments/cards.png"
                    alt="Card Payment"
                    className="w-64 h-16 cursor-pointer hover:scale-105 transition"
                    onClick={() => autoCompletePayment("card")}
                  />

                  <Button
                    onClick={() => autoCompletePayment("cash")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white w-64 h-16 text-lg rounded-xl shadow-md"
                  >
                    💵 Cash Payment
                  </Button>

                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="mt-2 border-gray-300 hover:bg-gray-100 w-64"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6"
              >
                <h2 className="text-xl font-bold text-green-600 mb-2">
                  🎉 Payment Successful!
                </h2>
                <p className="text-gray-600 mb-4">
                  Printing your receipt, please wait...
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* ✅ Trigger receipt printing automatically */}
          {showReceipt && (
            <ReceiptPrinter
              mode={paymentMethod === "cash" ? "cash" : "cashless"}
              cashlessType={
                paymentMethod === "maya"
                  ? "maya"
                  : paymentMethod === "qrph"
                  ? "qrph"
                  : paymentMethod === "card"
                  ? "card"
                  : undefined
              }
              cashReceived={paymentMethod === "cash" ? total : 0}
              paymentValue={paymentMethod !== "cash" ? total : 0}
              p_name={printerName}
              onSuccess={handlePrintSuccess}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
