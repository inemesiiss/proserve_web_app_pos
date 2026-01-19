import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Printer, CheckCircle2, AlertCircle } from "lucide-react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { invoke } from "@tauri-apps/api/core";
import dayjs from "dayjs";

type PaymentMode = "cash" | "cashless";
type CashlessType = "maya" | "qrph" | "card";

interface ReceiptPrinterProps {
  mode?: PaymentMode; // defaults to 'cash'
  cashReceived?: number; // only for cash
  paymentValue?: number; // only for cashless
  cashlessType?: CashlessType; // only for cashless
  p_name: string;
  invoiceNum?: string; // invoice number from transaction
  orderNum?: string; // order number
  cashierName?: string; // cashier name
  onSuccess?: () => void;
}

export default function ReceiptPrinter({
  mode = "cash",
  cashReceived = 0,
  paymentValue = 0,
  cashlessType,
  p_name,
  invoiceNum = "",
  orderNum = "",
  cashierName = "Cashier",
  onSuccess,
}: ReceiptPrinterProps) {
  const { meals, products, subTotal, totalDiscount, grandTotal, clearOrder } =
    useFoodOrder();

  // VAT Calculations (12% VAT)
  const vatRate = 0.12;
  const vatableSales = subTotal / (1 + vatRate); // VAT-exclusive amount
  const vatAmount = subTotal - vatableSales;
  const vatExemptSales = 0; // Adjust if you have VAT-exempt items
  const totalItems = meals.length + products.length;

  const LINE_WIDTH = 32;

  function centerText(text: string, width: number = LINE_WIDTH) {
    const spaces = Math.floor((width - text.length) / 2);
    return " ".repeat(Math.max(0, spaces)) + text;
  }

  const effectivePayment = mode === "cashless" ? paymentValue : cashReceived;
  const change = mode === "cash" ? effectivePayment - grandTotal : 0;

  const allItems = [
    ...meals.map((i) => ({ ...i, type: "Meal" })),
    ...products.map((i) => ({ ...i, type: "Ala Carte" })),
  ];

  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  // Track the last printed invoice to prevent reprinting the same invoice
  const lastPrintedInvoiceRef = useRef<string>("");

  // Auto-print when invoiceNum is provided (transaction already saved by parent)
  useEffect(() => {
    if (
      invoiceNum &&
      p_name &&
      invoiceNum !== lastPrintedInvoiceRef.current &&
      !isPrinting
    ) {
      console.log(
        "🖨️ [AutoPrint] New invoice detected, auto-printing:",
        invoiceNum
      );
      lastPrintedInvoiceRef.current = invoiceNum;
      handlePrint();
    }
  }, [invoiceNum]); // Only depend on invoiceNum - when it changes, print once

  // Generate plain text receipt for thermal printer (matching the image format)
  const generateTextReceipt = (): string => {
    const dateTime = dayjs().format("MM/DD/YYYY HH:mm:ss");

    // Header
    let receipt = centerText("KIOSK OUTPUT RECEIPT") + "\n\n";
    receipt += centerText("Proserv  Food Retail") + "\n";
    receipt += centerText("Unit 11-A GF Century Plaza") + "\n";
    receipt += centerText("Perea Makati City, Philippines") + "\n";
    receipt += centerText("VAT Reg. TIN: 123-456-000-000") + "\n";
    receipt += centerText("VAT Reg. Date: 05/05/2020") + "\n";
    receipt += centerText("MIN: 123456789000000") + "\n\n";
    receipt += "================================\n\n";

    // Items
    receipt += "QTY  Item                 Amount\n";
    allItems.forEach((item) => {
      const discountCode =
        item.discount_type === "pwd"
          ? "(PWD)"
          : item.discount_type === "sc"
          ? "(SC)"
          : "";
      const itemName = (
        item.name + (discountCode ? " " + discountCode : "")
      ).trim();
      const amount = (item.price * item.qty).toFixed(2);
      const qty = String(item.qty).padStart(2);
      const name = itemName.padEnd(18).slice(0, 18);
      const amt = amount.padStart(7);
      receipt += `${qty}   ${name} ${amt}\n`;
    });

    receipt +=
      "\nSubtotal:".padEnd(25) + subTotal.toFixed(2).padStart(7) + "\n\n";
    receipt += "================================\n\n";

    // VAT and totals
    if (totalDiscount > 0) {
      receipt +=
        "Discount:".padEnd(25) +
        `-${totalDiscount.toFixed(2)}`.padStart(7) +
        "\n";
    }
    receipt +=
      "VAT Sales:".padEnd(25) + vatableSales.toFixed(2).padStart(7) + "\n";
    receipt +=
      "VAT (12%):".padEnd(25) + vatAmount.toFixed(2).padStart(7) + "\n";
    receipt +=
      "VAT Exempt Sales:".padEnd(25) +
      vatExemptSales.toFixed(2).padStart(7) +
      "\n";
    receipt += "Total:".padEnd(25) + grandTotal.toFixed(2).padStart(7) + "\n";

    if (mode === "cash") {
      receipt +=
        "Cash:".padEnd(25) + cashReceived.toFixed(2).padStart(7) + "\n";
    } else {
      receipt +=
        `Payment (${cashlessType?.toUpperCase() || "CASHLESS"}):`.padEnd(25) +
        paymentValue.toFixed(2).padStart(7) +
        "\n";
    }
    receipt += "Change:".padEnd(25) + change.toFixed(2).padStart(7) + "\n\n";

    receipt += "================================\n\n";

    // Transaction details
    receipt += `TOTAL ITEM (S):          ${totalItems}\n`;
    receipt += `INV #:                   ${invoiceNum}\n`;
    receipt += `CASHIER:                 ${cashierName}\n`;
    receipt += `Order #:                 ${orderNum}\n`;
    receipt += `Date and Time:           ${dateTime}\n`;
    receipt += `Cash:                    ${
      mode === "cash" ? cashReceived.toFixed(2) : "0.00"
    }\n`;
    receipt += `Change:                  ${change.toFixed(2)}\n\n`;

    // Signature section
    receipt += "Name: _________________________\n";
    receipt += "Address: ______________________\n";
    receipt += "TIN No.: ______________________\n";
    receipt += "Bus Style: ____________________\n\n";

    receipt += centerText("This serves as your invoice.") + "\n\n";
    receipt += "================================\n\n";

    // QR Code section
    receipt += centerText("Scan for your feedback") + "\n";
    receipt += centerText("[QR CODE PLACEHOLDER]") + "\n\n";

    receipt += "================================\n\n";

    // Supplier info
    receipt += centerText("ProServ Communication") + "\n";
    receipt += centerText("Unit 11-A GF Century Plaza") + "\n";
    receipt += centerText("Perea Makati City, Philippines") + "\n";
    receipt += centerText("Marikao Luzada 1014 PHL") + "\n";
    receipt += centerText("VAT Reg. TIN: 123-456-000-000") + "\n";
    receipt += centerText("VAT Reg. Date: 05/05/2020") + "\n";
    receipt += centerText("Accred No: 0000-000000000-000000") + "\n";
    receipt += centerText("PTU No.: ARSP202300168") + "\n\n";

    return receipt;
  };

  const handlePrint = async () => {
    console.log("🖨️ [PrintReceipt] Print handler triggered");
    console.log("📋 [PrintReceipt] Mode:", mode);
    console.log("🖨️ [PrintReceipt] Printer Name:", p_name);
    console.log(
      "💵 [PrintReceipt] Amount:",
      mode === "cash" ? cashReceived : paymentValue
    );

    try {
      setIsPrinting(true);
      setPrintError(null);

      console.log("🔍 [PrintReceipt] Fetching available printers...");
      const printers: string[] = await invoke("list_printers");
      console.log("✅ [PrintReceipt] Available printers:", printers);

      if (!printers || printers.length === 0) {
        console.error("❌ [PrintReceipt] No printers detected");
        setPrintError(
          "No printer detected. Please connect a printer and try again."
        );
        setIsPrinting(false);
        return;
      }

      if (!printers.includes(p_name)) {
        console.error(
          `❌ [PrintReceipt] Printer "${p_name}" not found in list:`,
          printers
        );
        setPrintError(
          `Printer "${p_name}" not found. Please select a valid printer.`
        );
        setIsPrinting(false);
        return;
      }

      console.log(
        "✅ [PrintReceipt] Printer verified, constructing receipt..."
      );

      // TODO: Save transaction to database here before printing
      // Example: await invoke('save_transaction', { invoiceNum, orderNum, grandTotal, items: allItems, ... });
      console.log("💾 [PrintReceipt] Saving transaction (TODO: implement)");

      // Generate plain text receipt
      const receipt = generateTextReceipt();

      console.log(
        "📝 [PrintReceipt] Receipt content generated, sending to printer:",
        p_name
      );
      await invoke("print_receipt", { printerName: p_name, content: receipt });

      console.log("✅ [PrintReceipt] Print command sent successfully");

      clearOrder();
      console.log("✨ [PrintReceipt] Order cleared, calling onSuccess");
      setPrintSuccess(true);
      setIsPrinting(false);

      // Call onSuccess after a short delay to show success state
      setTimeout(() => {
        onSuccess && onSuccess();
      }, 1500);
    } catch (err) {
      console.error("❌ [PrintReceipt] Print error:", err);
      setPrintError(`Printing failed: ${String(err)}`);
      setIsPrinting(false);
      // Reset the ref so user can retry
      lastPrintedInvoiceRef.current = "";
    }
  };

  if (printSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-6"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>
          <p className="text-green-600 font-bold text-lg">
            Receipt Printed Successfully!
          </p>
          <p className="text-gray-600 text-sm">Closing in a moment...</p>
        </div>
      </motion.div>
    );
  }

  if (printError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-6"
      >
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <p className="text-red-600 font-bold text-lg mb-2">
              Printing Failed
            </p>
            <p className="text-gray-700 text-sm">{printError}</p>
          </div>
          <button
            onClick={() => {
              setPrintError(null);
              setIsPrinting(false);
            }}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6"
    >
      {/* Show button only if no invoiceNum (manual print mode) */}
      {!invoiceNum && (
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrint}
          disabled={isPrinting || !p_name}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl px-8 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          {isPrinting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Printer className="w-5 h-5" />
              </motion.div>
              <span>Printing Receipt...</span>
            </>
          ) : (
            <>
              <Printer className="w-5 h-5" />
              <span>Print Receipt & Finish</span>
            </>
          )}
        </motion.button>
      )}

      {/* Show auto-printing message when invoiceNum is provided */}
      {invoiceNum && isPrinting && (
        <div className="flex items-center justify-center gap-3 text-green-600 font-medium bg-green-50 rounded-xl p-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Printer className="w-6 h-6" />
          </motion.div>
          <span className="text-lg">Auto-printing receipt...</span>
        </div>
      )}
    </motion.div>
  );
}
