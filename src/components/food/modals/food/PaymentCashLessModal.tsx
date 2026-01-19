import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import ReceiptPrinter from "@/components/food/components/Print/PrintReceipt"; // <-- correct import path
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { useDeviceSettings } from "@/hooks/useDeviceSettings";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  selectedPrinter: string; // pass printer name
}

type PaymentMethod = "none" | "card" | "qrph" | "maya";

export default function PaymentModal({
  isOpen,
  onClose,
  total,
  selectedPrinter,
}: PaymentModalProps) {
  const { clearOrder } = useFoodOrder();
  const {} = useDeviceSettings();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("none");
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod("none");
      setIsPaid(false);
    }
  }, [isOpen]);

  const handlePayment = () => {
    if (paymentMethod === "none") return;

    setIsPaid(true);

    // Only for cashless: trigger receipt printer
    if (
      paymentMethod === "maya" ||
      paymentMethod === "qrph" ||
      paymentMethod === "card"
    ) {
      onClose();
    }

    clearOrder();
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

                {paymentMethod === "none" && (
                  <div className="flex flex-col items-center gap-4 mt-4">
                    <motion.img
                      src="/payments/maya.webp"
                      alt="Maya"
                      className="w-64 h-20 cursor-pointer hover:scale-105 transition rounded-xl shadow-md"
                      onClick={() => setPaymentMethod("maya")}
                    />
                    <motion.img
                      src="/payments/qrph.jfif"
                      alt="QRPh"
                      className="w-64 h-16 cursor-pointer hover:scale-105 transition"
                      onClick={() => setPaymentMethod("qrph")}
                    />
                    <motion.img
                      src="/payments/cards.png"
                      alt="Card Payment"
                      className="w-64 h-16 cursor-pointer hover:scale-105 transition"
                      onClick={() => setPaymentMethod("card")}
                    />

                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="mt-2 border-gray-300 hover:bg-gray-100 w-64"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {/* QRPh / Maya / Card Payment Screens */}
                {["qrph", "maya", "card"].includes(paymentMethod) && (
                  <div className="text-center mt-4 space-y-3">
                    <p className="font-semibold text-gray-700">
                      {`Scan ${paymentMethod.toUpperCase()} QR to Pay ₱${total.toFixed(
                        2
                      )}`}
                    </p>
                    <div className="flex justify-center">
                      <QRCodeCanvas
                        value={`${paymentMethod}:cinema-payment:${Date.now()}`}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                      />
                    </div>
                    {/* <Button
                      onClick={handlePayment}
                      className={`${
                        paymentMethod === "maya"
                          ? "bg-emerald-600"
                          : paymentMethod === "qrph"
                          ? "bg-green-600"
                          : "bg-blue-600"
                      } hover:opacity-90 text-white mt-3`}
                    >
                      Confirm Payment
                    </Button> */}
                    <div className="flex justify-center">
                      {selectedPrinter && (
                        <ReceiptPrinter
                          mode="cashless"
                          paymentValue={total}
                          cashlessType={
                            paymentMethod as "maya" | "qrph" | "card"
                          }
                          p_name={selectedPrinter}
                          onSuccess={handlePayment}
                        />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPaymentMethod("none")}
                      className="mt-2 border-gray-300 hover:bg-gray-100 w-full"
                    >
                      ← Back
                    </Button>
                  </div>
                )}
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
                  Thank you for your purchase!
                </p>
              </motion.div>
            )}

            {/* 🔹 Cashless Receipt Printer */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
