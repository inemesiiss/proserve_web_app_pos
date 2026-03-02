import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Printer, CheckCircle2, AlertCircle } from "lucide-react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { invoke } from "@tauri-apps/api/core";
import dayjs from "dayjs";
import type { BranchReceiptFormat } from "@/services/authService";

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
  const vatableSales = subTotal / (1 + vatRate);
  const vatAmount = subTotal - vatableSales;
  const vatExemptSales = 0;
  const totalItems = meals.length + products.length;

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
        invoiceNum,
      );
      lastPrintedInvoiceRef.current = invoiceNum;
      handlePrint();
    }
  }, [invoiceNum]); // Only depend on invoiceNum - when it changes, print once

  // Generate plain text receipt for thermal printer (matching the image format)
  const generateTextReceipt = (): string => {
    const dateTime = dayjs().format("MM/DD/YYYY HH:mm:ss");

    // Read receipt format directly from localStorage to avoid stale closure
    let rf: BranchReceiptFormat | null = null;
    try {
      const stored = localStorage.getItem("receipt_format");
      if (stored) rf = JSON.parse(stored) as BranchReceiptFormat;
    } catch (e) {
      console.error("Failed to parse receipt_format:", e);
    }

    // Read printer width directly from localStorage to avoid stale closure
    let lineWidth = 32; // default for 57mm
    try {
      const ds = localStorage.getItem("deviceSettings");
      if (ds) {
        const parsed = JSON.parse(ds);
        // 57mm = ~32 chars, 80/88mm = ~48 chars
        lineWidth = parsed.receiptPrinterSize === 88 ? 48 : 32;
      }
    } catch (e) {
      console.error("Failed to parse deviceSettings:", e);
    }

    const SEP = "=".repeat(lineWidth);

    // ESC/POS alignment commands — printer hardware handles centering
    const ALIGN_CENTER = "\x1B\x61\x01";
    const ALIGN_LEFT = "\x1B\x61\x00";

    function padLR(label: string, value: string) {
      const gap = lineWidth - label.length - value.length;
      return label + " ".repeat(Math.max(1, gap)) + value;
    }

    // Use receipt format values or fallback to defaults
    const branchName = rf?.b_name || "KIOSK OUTPUT RECEIPT";
    const companyName = rf?.c_name || "Proserv  Food Retail";
    const addr = rf?.address || "Unit 11-A GF Century Plaza";
    const vatTin = rf?.vat_reg_tin || "123-456-000-000";
    const vatDate = rf?.vat_reg_date || "05/05/2020";
    const minVal = rf?.min || "123456789000000";

    // ── HEADER (centered by printer) ──
    let receipt = ALIGN_CENTER;
    receipt += branchName + "\n\n";
    receipt += companyName + "\n";

    if (rf?.l_address !== false) {
      receipt += addr + "\n";
    }

    if (rf?.t_vat_sales !== false) {
      receipt += `VAT Reg. TIN: ${vatTin}` + "\n";
    }

    if (rf?.vat_reg_date !== null && rf?.vat_reg_date !== undefined) {
      receipt += `VAT Reg. Date: ${vatDate}` + "\n";
    }

    if (rf?.min && rf.min !== null) {
      receipt += `MIN: ${minVal}` + "\n";
    }

    receipt += "\n" + SEP + "\n\n";

    // ── ITEMS (left-aligned) ──
    receipt += ALIGN_LEFT;
    const qtyColW = 4;
    const amtColW = 10;
    const nameColW = lineWidth - qtyColW - amtColW;

    receipt +=
      "QTY".padEnd(qtyColW) +
      "Item".padEnd(nameColW) +
      "Amount".padStart(amtColW) +
      "\n";

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
      const name = itemName.padEnd(nameColW).slice(0, nameColW);
      const amt = amount.padStart(amtColW);
      receipt += `${qty}  ${name}${amt}\n`;
    });

    receipt += "\n" + padLR("Subtotal:", subTotal.toFixed(2)) + "\n\n";
    receipt += SEP + "\n\n";

    // ── TOTALS ──
    if (rf?.t_discount !== false && totalDiscount > 0) {
      receipt += padLR("Discount:", `-${totalDiscount.toFixed(2)}`) + "\n";
    }

    if (rf?.t_vat_sales !== false) {
      receipt += padLR("VAT Sales:", vatableSales.toFixed(2)) + "\n";
    }

    if (rf?.t_vat_twelve !== false) {
      receipt += padLR("VAT (12%):", vatAmount.toFixed(2)) + "\n";
    }

    if (rf?.t_vat_exempt !== false) {
      receipt += padLR("VAT Exempt Sales:", vatExemptSales.toFixed(2)) + "\n";
    }

    if (rf?.t_total !== false) {
      receipt += padLR("Total:", grandTotal.toFixed(2)) + "\n";
    }

    if (rf?.t_cash !== false && mode === "cash") {
      receipt += padLR("Cash:", cashReceived.toFixed(2)) + "\n";
    } else if (rf?.t_cash !== false) {
      receipt +=
        padLR(
          `Payment (${cashlessType?.toUpperCase() || "CASHLESS"}):`,
          paymentValue.toFixed(2),
        ) + "\n";
    }

    if (rf?.t_change !== false) {
      receipt += padLR("Change:", change.toFixed(2)) + "\n\n";
    }

    receipt += SEP + "\n\n";

    // ── TRANSACTION DETAILS ──
    if (rf?.t_total_items !== false) {
      receipt += padLR("TOTAL ITEM (S):", String(totalItems)) + "\n";
    }

    if (rf?.t_invoice !== false) {
      receipt += padLR("INV #:", invoiceNum) + "\n";
    }

    if (rf?.t_cashier !== false) {
      receipt += padLR("CASHIER:", cashierName) + "\n";
    }

    if (rf?.t_order_no !== false) {
      receipt += padLR("Order #:", orderNum) + "\n";
    }

    if (rf?.t_date_time !== false) {
      receipt += padLR("Date and Time:", dateTime) + "\n";
    }

    if (rf?.t_cash !== false) {
      receipt +=
        padLR("Cash:", mode === "cash" ? cashReceived.toFixed(2) : "0.00") +
        "\n";
    }

    if (rf?.t_change !== false) {
      receipt += padLR("Change:", change.toFixed(2)) + "\n\n";
    }

    // ── SIGNATURE LINES ──
    if (rf?.line !== false) {
      const underline = "_".repeat(Math.max(10, lineWidth - 12));
      if (rf?.l_name !== false) {
        receipt += `Name: ${underline}\n`;
      }
      if (rf?.l_address !== false) {
        receipt += `Address: ${underline}\n`;
      }
      if (rf?.l_tin !== false) {
        receipt += `TIN No.: ${underline}\n`;
      }
      if (rf?.l_bus_style !== false) {
        receipt += `Bus Style: ${underline}\n`;
      }
      receipt += "\n";
    }

    // ── CENTERED SECTIONS ──
    receipt += ALIGN_CENTER;
    receipt += "This serves as your invoice." + "\n\n";
    receipt += SEP + "\n\n";

    // ── QR CODE (centered) ──
    if (rf?.qr !== false) {
      receipt += "Scan for your feedback" + "\n";
      if (rf?.qr_image) {
        receipt += "[QR CODE]" + "\n\n";
      } else {
        receipt += "[QR CODE PLACEHOLDER]" + "\n\n";
      }
    }

    receipt += SEP + "\n\n";

    // ── FOOTER / SUPPLIER INFO (centered, fixed mandatory values) ──
    receipt += "ProServ Communication" + "\n";
    receipt += "Unit 11-A GF Century Plaza" + "\n";
    receipt += "Perea Makati City, Philippines" + "\n";
    receipt += "Marikao Luzada 1014 PHL" + "\n";
    receipt += "VAT Reg. TIN: 123-456-000-000" + "\n";
    receipt += "VAT Reg. Date: 05/05/2020" + "\n";
    receipt += "Accred No: 0000-000000000-000000" + "\n";
    receipt += "PTU No.: ARSP202300168" + "\n\n";

    return receipt;
  };

  const handlePrint = async () => {
    console.log("🖨️ [PrintReceipt] Print handler triggered");
    console.log("📋 [PrintReceipt] Mode:", mode);
    console.log("🖨️ [PrintReceipt] Printer Name:", p_name);
    console.log(
      "💵 [PrintReceipt] Amount:",
      mode === "cash" ? cashReceived : paymentValue,
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
          "No printer detected. Please connect a printer and try again.",
        );
        setIsPrinting(false);
        return;
      }

      if (!printers.includes(p_name)) {
        console.error(
          `❌ [PrintReceipt] Printer "${p_name}" not found in list:`,
          printers,
        );
        setPrintError(
          `Printer "${p_name}" not found. Please select a valid printer.`,
        );
        setIsPrinting(false);
        return;
      }

      console.log(
        "✅ [PrintReceipt] Printer verified, constructing receipt...",
      );

      // TODO: Save transaction to database here before printing
      // Example: await invoke('save_transaction', { invoiceNum, orderNum, grandTotal, items: allItems, ... });
      console.log("💾 [PrintReceipt] Saving transaction (TODO: implement)");

      // Generate plain text receipt
      const receipt = generateTextReceipt();

      console.log(
        "📝 [PrintReceipt] Receipt content generated, sending to printer:",
        p_name,
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
