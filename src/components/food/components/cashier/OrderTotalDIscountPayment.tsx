import { useState, useEffect } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { invoke } from "@tauri-apps/api/core";
import ReceiptPrinter from "@/components/food/components/Print/PrintReceipt";
import PaymentModal from "../../modals/food/PaymentCashLessModal";

export default function FoodTotalDiscountPaymentSection() {
  const { subTotal, totalDiscount, grandTotal } = useFoodOrder();

  const [paymentMode, setPaymentMode] = useState<"cash" | "cashless">("cash");
  const [cashReceived, setCashReceived] = useState(0);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [cashlessModalisOpen, setCashlessModalOpen] = useState(false);

  // 🖨️ printer state
  const [printers, setPrinters] = useState<string[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");

  // Derived values
  const vat = subTotal * 0.12;
  const change = cashReceived - grandTotal;

  const handlePayment = () => {
    setCashReceived(0);
  };

  const handleAddCash = (value: number) =>
    setCashReceived((prev) => prev + value);
  const handleExactAmount = () => setCashReceived(grandTotal);
  const handleResetCash = () => {
    setCashReceived(0);
    setShouldPrint(false);
  };

  // 🧠 Auto-trigger print if cash received >= total
  useEffect(() => {
    if (
      paymentMode === "cash" &&
      cashReceived >= grandTotal &&
      grandTotal > 0
    ) {
      setShouldPrint(true);
    } else {
      setShouldPrint(false);
    }
  }, [cashReceived, paymentMode, grandTotal]);

  // 🖨️ Fetch printer list from Tauri backend
  useEffect(() => {
    invoke<string[]>("list_printers")
      .then((result) => setPrinters(result))
      .catch((err) => console.error("Failed to load printers:", err));
  }, []);

  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-full mt-5">
      <h2 className="text-lg font-semibold mb-4">Discount & Payment</h2>
      {/* <div className="p-2 bg-gray-800 text-white max-h-32 overflow-y-auto text-sm">
        <h2>{"printer selected" + selectedPrinter}</h2>
      </div> */}

      {/* 🔹 TOTALS */}
      <div className="space-y-1 text-sm mb-4 border p-3 rounded-lg bg-gray-50">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            ₱{subTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Total Discount</span>
          <span>
            -₱
            {totalDiscount.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex justify-between">
          <span>12% VAT</span>
          <span>
            ₱{vat.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between font-bold text-green-600 text-base mt-2">
          <span>Grand Total</span>
          <span>
            ₱{grandTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* 🔹 PAYMENT MODE */}
      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-2">Mode of Payment</h3>
        <div className="flex gap-3">
          {["cash", "cashless"].map((mode) => (
            <label
              key={mode}
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <input
                type="radio"
                checked={paymentMode === mode}
                onChange={() => setPaymentMode(mode as "cash" | "cashless")}
              />
              {mode === "cash" ? "Cash" : "Cashless"}
            </label>
          ))}
        </div>
      </div>

      {/* 🔹 PRINTER SELECTION */}
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

      {/* 🔹 CASH HANDLING */}
      {paymentMode === "cash" && (
        <>
          <div className="mb-3">
            <h3 className="font-semibold text-sm mb-2">Cash Received</h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[20, 50, 100, 200, 500, 1000].map((val) => (
                <button
                  key={val}
                  onClick={() => handleAddCash(val)}
                  className="bg-gray-100 hover:bg-gray-200 rounded-lg py-2 text-sm font-medium"
                >
                  ₱{val}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleExactAmount}
                className="bg-green-500 text-white text-xs px-3 py-1 rounded-md"
              >
                Exact Amount
              </button>
              <button
                onClick={handleResetCash}
                className="bg-gray-400 text-white text-xs px-3 py-1 rounded-md"
              >
                Clear
              </button>
            </div>
          </div>

          {/* 🔹 CHANGE */}
          <div className="text-sm border-t pt-2 space-y-1">
            <div className="flex justify-between">
              <span>Cash Received</span>
              <span>
                ₱
                {cashReceived.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Change</span>
              <span
                className={`${
                  change >= 0 ? "text-green-600" : "text-red-600"
                } font-medium`}
              >
                ₱{change.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </>
      )}

      {paymentMode === "cashless" && (
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            onClick={() => setCashlessModalOpen(true)}
          >
            Proceed
          </button>
        </div>
      )}

      <PaymentModal
        isOpen={cashlessModalisOpen}
        onClose={() => setCashlessModalOpen(false)}
        total={grandTotal}
        selectedPrinter={selectedPrinter}
      />

      {/* 🔹 AUTO PRINT RECEIPT WHEN CASH ≥ TOTAL */}
      {shouldPrint && paymentMode === "cash" && selectedPrinter && (
        <ReceiptPrinter
          cashReceived={cashReceived}
          p_name={selectedPrinter}
          onSuccess={handlePayment}
        />
      )}
    </div>
  );
}
