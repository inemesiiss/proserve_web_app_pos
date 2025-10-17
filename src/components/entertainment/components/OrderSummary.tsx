import { motion, AnimatePresence } from "framer-motion";
import PaymentModal from "../modals/PaymentModal";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/entertainment/OrderProvider";
import { Trash2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

export default function OrderSummary() {
  const { order, clearOrder, removeItem } = useOrder();
  const [isModalOpen, setModalOpen] = useState(false);
  const [printers, setPrinters] = useState<string[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");

  useEffect(() => {
    invoke<string[]>("list_printers")
      .then((result) => setPrinters(result))
      .catch((err) => console.error("Failed to load printers:", err));
  }, []);

  const subtotal = [...order.tickets, ...order.snacks].reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const vat = subtotal * 0.12;
  const grandTotal = subtotal + vat;

  return (
    <>
      <motion.div
        className="w-full h-full flex flex-col"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between mb-2">
          🧾 Order Summary
        </h3>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 space-y-4">
          {/* 🎟️ Tickets */}
          {order.tickets.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-blue-600">
                🎟️ Tickets
              </h4>
              <div className="space-y-2">
                <AnimatePresence>
                  {order.tickets.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded-lg hover:shadow-sm transition"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.qty} × ₱{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          ₱{(item.price * item.qty).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id, "ticket")}
                          className="p-1 rounded-md hover:bg-red-100 transition"
                          title="Remove item"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* 🍿 Snacks */}
          {order.snacks.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-yellow-600">
                🍿 Snacks
              </h4>
              <div className="space-y-2">
                <AnimatePresence>
                  {order.snacks.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-between items-center text-sm bg-yellow-50 p-2 rounded-lg hover:shadow-sm transition"
                    >
                      <div>
                        <p className="font-medium">
                          {item.name}
                          {item.size ? ` (${item.size})` : ""}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.qty} × ₱{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          ₱{(item.price * item.qty).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id, "snack")}
                          className="p-1 rounded-md hover:bg-red-100 transition"
                          title="Remove item"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Empty state */}
          {order.tickets.length === 0 && order.snacks.length === 0 && (
            <div className="text-gray-400 italic text-center py-6">
              No items yet.
            </div>
          )}
        </div>

        {/* ✅ Fixed Bottom Section */}
        <div className="sticky bottom-0 left-0 bg-white border-t border-gray-200 pt-3 mt-3">
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2">Select Printer</h3>
            <select
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
              className="border rounded-lg p-2 text-sm w-full"
            >
              <option value="">-- Choose Printer --</option>
              {printers.map((printer) => (
                <option key={printer} value={printer}>
                  {printer}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-700 space-y-1 px-1">
            <div className="flex justify-between">
              <span>Subtotal:</span> <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>12% VAT:</span> <span>₱{vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-blue-700">
              <span>Grand Total:</span> <span>₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2 px-1 pb-1 bg-white">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-100"
              onClick={clearOrder}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setModalOpen(true)}
              disabled={order.tickets.length === 0 && order.snacks.length === 0}
            >
              Proceed
            </Button>
          </div>
        </div>
      </motion.div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        total={grandTotal}
        selectedPrinter={selectedPrinter}
      />
    </>
  );
}
