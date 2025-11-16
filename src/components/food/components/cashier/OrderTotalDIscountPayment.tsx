import { useState, useEffect } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { invoke } from "@tauri-apps/api/core";
import ReceiptPrinter from "@/components/food/components/Print/PrintReceipt";
import PaymentModal from "../../modals/food/PaymentCashLessModal";
import OrderTotalDiscountModal from "../../modals/security/OrderTotalDiscountModal";
import { X } from "lucide-react";

export default function FoodTotalDiscountPaymentSection() {
  const {
    subTotal,
    totalDiscount,
    orderTotalDiscount,
    grandTotal,
    applyOrderTotalDiscount,
    removeOrderTotalDiscount,
    orderTotalDiscountInfo,
  } = useFoodOrder();

  const [paymentMode, setPaymentMode] = useState<
    "cash" | "cashless" | "paymaya" | "card"
  >("cash");
  const [cashReceived, setCashReceived] = useState(0);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [cashlessModalisOpen, setCashlessModalOpen] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

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
    <div className="p-5 bg-white rounded-xl shadow-md w-full max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide">
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
          <span>Item Discounts</span>
          <span>
            -₱
            {totalDiscount.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        {orderTotalDiscount > 0 && (
          <div className="flex justify-between text-purple-600">
            <span>Order Discount</span>
            <span>
              -₱
              {orderTotalDiscount.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

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

      {/* 🔹 ORDER DISCOUNT INFO */}
      {orderTotalDiscountInfo && (
        <div className="mb-4 bg-purple-50 border-2 border-purple-300 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-purple-700">
                  {orderTotalDiscountInfo.discountCategory === "voucher" &&
                    "VOUCHER"}
                  {orderTotalDiscountInfo.discountCategory === "sc-pwd" &&
                    "SC/PWD (TOTAL)"}
                  {orderTotalDiscountInfo.discountCategory === "manual" &&
                    "MANUAL DISCOUNT"}
                </span>
                {orderTotalDiscountInfo.code && (
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-mono">
                    {orderTotalDiscountInfo.code}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-600">
                {orderTotalDiscountInfo.type === "percentage"
                  ? `${orderTotalDiscountInfo.value}% discount`
                  : `₱${orderTotalDiscountInfo.value.toFixed(2)} discount`}
              </div>
              {orderTotalDiscountInfo.note && (
                <div className="text-xs text-gray-500 mt-1">
                  {orderTotalDiscountInfo.note}
                </div>
              )}
            </div>
            <button
              onClick={removeOrderTotalDiscount}
              className="text-purple-600 hover:text-purple-800 p-1"
              title="Remove discount"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 🔹 PAYMENT MODE */}
      <div className="mb-4">
        <h3 className="font-semibold text-xs mb-1">Mode of Payment</h3>
        <div className="border-2 border-blue-400 rounded-lg p-2">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-1 cursor-pointer text-xs">
              <input
                type="radio"
                checked={paymentMode === "cash"}
                onChange={() => setPaymentMode("cash")}
                className="w-3 h-3"
              />
              <span className="font-medium">Cash</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-xs">
              <input
                type="radio"
                checked={paymentMode === "cashless"}
                onChange={() => setPaymentMode("cashless")}
                className="w-3 h-3"
              />
              <span className="font-medium">Gcash</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-xs">
              <input
                type="radio"
                checked={paymentMode === "paymaya"}
                onChange={() => setPaymentMode("paymaya")}
                className="w-3 h-3"
              />
              <span className="font-medium">PayMaya</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-xs">
              <input
                type="radio"
                checked={paymentMode === "card"}
                onChange={() => setPaymentMode("card")}
                className="w-3 h-3"
              />
              <span className="font-medium">Visa / Mastercard / JCB</span>
            </label>
          </div>
        </div>
      </div>

      {/* 🔹 PRINTER SELECTION dont remove*/}
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
            <h3 className="font-bold text-xs mb-2 tracking-wide">
              CASH RECEIVED
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={() => handleAddCash(20)}
                className="rounded-lg py-2 text-lg font-bold bg-orange-400 hover:bg-orange-500 text-white"
              >
                20
              </button>
              <button
                onClick={() => handleAddCash(50)}
                className="rounded-lg py-2 text-lg font-bold bg-red-500 hover:bg-red-600 text-white"
              >
                50
              </button>
              <button
                onClick={() => handleAddCash(100)}
                className="rounded-lg py-2 text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white"
              >
                100
              </button>
              <button
                onClick={() => handleAddCash(200)}
                className="rounded-lg py-2 text-lg font-bold bg-green-500 hover:bg-green-600 text-white"
              >
                200
              </button>
              <button
                onClick={() => handleAddCash(500)}
                className="rounded-lg py-2 text-lg font-bold bg-yellow-400 hover:bg-yellow-500 text-white"
              >
                500
              </button>
              <button
                onClick={() => handleAddCash(1000)}
                className="rounded-lg py-2 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
              >
                1000
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={handleExactAmount}
                className="rounded-lg py-2 text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white"
              >
                Exact Amount
              </button>
              <button
                onClick={handleResetCash}
                className="rounded-lg py-2 text-sm font-bold bg-gray-400 hover:bg-gray-500 text-white"
              >
                Clear
              </button>
              <button
                onClick={() => setShowDiscountModal(true)}
                disabled={subTotal <= 0}
                className="rounded-lg py-2 text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                DISCOUNT
              </button>
            </div>
          </div>
          {/* 🔹 CHANGE */}
          <div className="text-xs border border-gray-300 rounded-xl bg-white flex flex-col mt-2">
            <div className="flex justify-between px-4 py-2 border-b border-gray-200">
              <span className="text-gray-500">Cash Received</span>
              <span className="font-medium text-base">
                ₱
                {cashReceived.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between px-4 py-2">
              <span className="text-gray-500">Change</span>
              <span className="font-medium text-base">
                ₱{change.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          {/* Footer Buttons */}
          <div className="flex gap-6 justify-center mt-6">
            {/* <button
              onClick={handleResetCash}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full px-10 py-2 text-base font-bold"
            >
              Cancel
            </button> */}
            <button
              className="bg-green-400 hover:bg-green-500 text-white rounded-full px-10 py-2 text-base font-bold disabled:bg-green-200 disabled:cursor-not-allowed"
              disabled={cashReceived < grandTotal}
            >
              Proceed
            </button>
          </div>
        </>
      )}

      {paymentMode === "cashless" && (
        <div className="flex gap-6 justify-center mt-6">
          <button
            className="bg-green-400 hover:bg-green-500 text-white rounded-full px-10 py-2 text-base font-bold disabled:bg-green-200 disabled:cursor-not-allowed"
            onClick={() => setCashlessModalOpen(true)}
          >
            Proceed
          </button>
        </div>
      )}

      {(paymentMode === "paymaya" || paymentMode === "card") && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-600 text-sm font-medium">
            {paymentMode === "paymaya" ? "PayMaya" : "Card"} payment coming
            soon!
          </p>
          <p className="text-gray-500 text-xs mt-2">
            This payment method is currently unavailable.
          </p>
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

      {/* 🔹 ORDER TOTAL DISCOUNT MODAL */}
      <OrderTotalDiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onApplyDiscount={(discountData) => {
          applyOrderTotalDiscount(discountData);
          setShowDiscountModal(false);
        }}
        currentTotal={subTotal - totalDiscount}
      />
    </div>
  );
}
