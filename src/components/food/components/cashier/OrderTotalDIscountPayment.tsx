import { useState } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { useDeviceSettings } from "@/hooks/useDeviceSettings";
import { useCreateCashierTransactionMutation } from "@/store/api/Transaction";
import ReceiptPrinter from "@/components/food/components/Print/PrintReceipt";
import PaymentModal from "../../modals/food/PaymentCashLessModal";
import OrderTotalDiscountModal from "../../modals/security/OrderTotalDiscountModal";
import { X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getCashierSession } from "@/utils/cashierSession";

export default function FoodTotalDiscountPaymentSection() {
  const {
    meals,
    products,
    subTotal,
    orderTotalDiscount,
    applyOrderTotalDiscount,
    removeOrderTotalDiscount,
    orderTotalDiscountInfo,
    clearOrder,
  } = useFoodOrder();

  const { settings: deviceSettings } = useDeviceSettings();
  const [createTransaction, { isLoading: isCreatingTransaction }] =
    useCreateCashierTransactionMutation();

  const [paymentMode, setPaymentMode] = useState<
    "cash" | "cashless" | "paymaya" | "card"
  >("cash");
  const [cashReceived, setCashReceived] = useState(0);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [invoiceNum, setInvoiceNum] = useState<string | null>(null);
  const [orderNum, setOrderNum] = useState<string>("");
  const [cashlessModalisOpen, setCashlessModalOpen] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const cashierSession = getCashierSession();
  // Derived values - Separate vatable and VAT-exempt (SC/PWD) items
  // NOTE: Prices in OrderItem are already INCLUSIVE of VAT (12%)
  const allItems = [...meals, ...products];

  let grandTotal = 0;
  let vat_amount = 0;

  allItems.forEach((item) => {
    if (item.isVoid) return; // Skip voided items

    const itemTotalPrice = item.price * item.qty;
    const itemDiscountAmount = item.itemTotalDiscount || 0;

    if (item.discount_type === "pwd" || item.discount_type === "sc") {
      // SC/PWD items: The final price is the pre-tax amount after discount (VAT-exempt)
      // The vatExemptSalesAmount already includes the correct calculation
      const finalPrice =
        item.vatExemptSalesAmount || itemTotalPrice - itemDiscountAmount;
      grandTotal += finalPrice;
      // No VAT for SC/PWD items
    } else {
      // Regular items: Already inclusive of VAT, just add the final price
      const finalPrice = itemTotalPrice - itemDiscountAmount;
      grandTotal += finalPrice;

      // Extract VAT from the original price (before discount)
      const itemVat = itemTotalPrice * (12 / 112);
      vat_amount += itemVat;
    }
  });

  // Apply order-level discount if any
  grandTotal -= orderTotalDiscount;

  const change = cashReceived - grandTotal;

  // 🔄 Handle transaction creation (before printing)
  const handleCreateTransaction = async () => {
    try {
      // Check if cashierId exists
      if (!cashierSession?.cashierId) {
        toast.error("Cashier ID Required", {
          description:
            "Please log in as a cashier to proceed with the transaction",
          duration: 3000,
          style: {
            background: "#EF4444",
            color: "white",
            border: "none",
          },
        });
        return;
      }

      const transactionPayload = {
        purchase: {
          cashierId: cashierSession?.cashierId,
          terminalId: 1,
          grandTotal: grandTotal,
          subTotal: grandTotal + vat_amount,
          cashReceived,
          totalDiscount:
            allItems.reduce(
              (sum, item) => sum + (item.itemTotalDiscount || 0),
              0,
            ) + orderTotalDiscount,
          status: "completed",
        },
        items: [
          ...meals.map((meal) => ({
            productId: meal.id,
            branchProdId: meal.branchProdId || 0,
            quantity: meal.qty,
            unitPrice: meal.price,
            totalPrice: meal.price * meal.qty,
            productName: meal.name,
            customization: meal.customization,
            // Void tracking
            is_voided: meal.isVoid || false,
            voided_at: meal.isVoid ? new Date().toISOString() : undefined,
            voided_reason: meal.isVoid
              ? "Item voided at transaction"
              : undefined,
            // Discount tracking
            discount: meal.itemTotalDiscount || 0,
            discounted_at:
              meal.itemTotalDiscount && meal.itemTotalDiscount > 0
                ? new Date().toISOString()
                : undefined,
            discount_type: meal.discount_type,
            discount_note: meal.discount_note,
            discount_id: meal.discountId,
          })),
          ...products.map((product) => ({
            productId: product.id,
            branchProdId: product.branchProdId || 0,
            quantity: product.qty,
            unitPrice: product.price,
            totalPrice: product.price * product.qty,
            productName: product.name,
            customization: product.customization,
            // Void tracking
            is_voided: product.isVoid || false,
            voided_at: product.isVoid ? new Date().toISOString() : undefined,
            voided_reason: product.isVoid
              ? "Item voided at transaction"
              : undefined,
            // Discount tracking
            discount: product.itemTotalDiscount || 0,
            discounted_at:
              product.itemTotalDiscount && product.itemTotalDiscount > 0
                ? new Date().toISOString()
                : undefined,
            discount_type: product.discount_type,
            discount_note: product.discount_note,
            discount_id: product.discountId,
            discount_card_num: product.discountCardCode,
            discount_card_name: product.discountCardName,
            discount_card_exp: product.discountCardExp,
          })),
        ],
      };

      console.log(
        "📦 [handleCreateTransaction] Full Payload:",
        transactionPayload,
      );
      console.log(
        "📊 [handleCreateTransaction] Items count:",
        transactionPayload.items.length,
      );
      if (transactionPayload.items.length === 0) {
        alert("No items in cart. Please add items first.");
        return;
      }

      const response = await createTransaction(transactionPayload).unwrap();

      if (response.success && response.invoiceNum) {
        setInvoiceNum(response.invoiceNum);
        setOrderNum(response.orderNum || "");
        setShouldPrint(true);

        // 🎉 Show success toast
        toast.success("Transaction Successful!", {
          description: `Invoice #${response.invoiceNum} has been created`,
          duration: 2000,
          icon: <CheckCircle className="text-green-500" size={20} />,
          style: {
            background: "#10B981",
            color: "white",
            border: "none",
          },
        });
      }
    } catch (error) {
      alert("Failed to create transaction. Please try again.");
    }
  };

  const handlePayment = () => {
    setCashReceived(0);
    setInvoiceNum(null);
    setOrderNum("");
    setShouldPrint(false);
    clearOrder();
  };

  const handleAddCash = (value: number) =>
    setCashReceived((prev) => prev + value);
  const handleResetCash = () => {
    setCashReceived(0);
    setShouldPrint(false);
    setInvoiceNum(null);
  };

  // Note: shouldPrint is only set to true in handleCreateTransaction
  // after we successfully get an invoiceNum from the backend

  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-full max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide">
      <h2 className="text-lg font-semibold mb-4">Discount & Payment</h2>

      {/* 🖨️ Show configured printer */}
      {deviceSettings.receiptPrinter && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-700">
              Receipt Printer:
            </span>
            <span className="text-xs text-blue-600">
              {deviceSettings.receiptPrinter}
            </span>
          </div>
        </div>
      )}

      {!deviceSettings.receiptPrinter && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            ⚠️ No receipt printer configured. Please configure in Device
            Settings.
          </p>
        </div>
      )}

      {/* 🔹 TOTALS */}
      <div className="space-y-1 text-sm mb-4 border p-3 rounded-lg bg-gray-50">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            ₱
            {(grandTotal + vat_amount).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Item Discounts</span>
          <span>
            -₱
            {allItems
              .reduce((sum, item) => sum + (item.itemTotalDiscount || 0), 0)
              .toLocaleString("en-PH", {
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
          <span>VAT (included in prices)</span>
          <span>
            ₱{vat_amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
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
              {/* {orderTotalDiscountInfo.note && (
                <div className="text-xs text-gray-500 mt-1">
                  {orderTotalDiscountInfo.note}
                </div>
              )} */}
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
                onClick={() => setCashReceived(grandTotal)}
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
            <button
              onClick={handleCreateTransaction}
              disabled={
                cashReceived < grandTotal ||
                isCreatingTransaction ||
                !deviceSettings.receiptPrinter
              }
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-10 py-2 text-base font-bold disabled:bg-green-200 disabled:cursor-not-allowed transition-colors"
            >
              {isCreatingTransaction ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </>
      )}

      {paymentMode === "cashless" && (
        <div className="flex gap-6 justify-center mt-6">
          <button
            className="bg-green-400 hover:bg-green-500 text-white rounded-full px-10 py-2 text-base font-bold disabled:bg-green-200 disabled:cursor-not-allowed"
            disabled={!deviceSettings.receiptPrinter}
            onClick={() => {
              if (deviceSettings.receiptPrinter) {
                setCashlessModalOpen(true);
              }
            }}
          >
            Proceed to Payment
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
        selectedPrinter={deviceSettings.receiptPrinter}
      />

      {/* 🔹 AUTO PRINT RECEIPT WHEN CASH ≥ TOTAL */}
      {shouldPrint &&
        paymentMode === "cash" &&
        deviceSettings.receiptPrinter &&
        invoiceNum && (
          <>
            <ReceiptPrinter
              mode="cash"
              cashReceived={cashReceived}
              p_name={deviceSettings.receiptPrinter}
              invoiceNum={invoiceNum}
              orderNum={orderNum}
              cashierName="Cashier" // TODO: Get from auth context
              onSuccess={handlePayment}
            />
          </>
        )}

      {/* 🔹 ORDER TOTAL DISCOUNT MODAL */}
      <OrderTotalDiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onApplyDiscount={(discountData) => {
          applyOrderTotalDiscount(discountData);
          setShowDiscountModal(false);
        }}
        currentTotal={grandTotal + vat_amount}
      />
    </div>
  );
}
