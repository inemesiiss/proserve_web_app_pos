import { useState, useEffect, useRef } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { invoke } from "@tauri-apps/api/core";
import { message } from "@tauri-apps/plugin-dialog";
import dayjs from "dayjs";

type PaymentMode = "cash" | "cashless";
type CashlessType = "maya" | "qrph" | "card";

interface ReceiptPrinterProps {
  mode?: PaymentMode; // defaults to 'cash'
  cashReceived?: number; // only for cash
  paymentValue?: number; // only for cashless
  cashlessType?: CashlessType; // only for cashless
  p_name: string;
  invoiceNum?: string; // invoice number from transaction (optional - if not provided, shows print button)
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

  // Track if we've already printed to prevent double printing
  const hasPrintedRef = useRef(false);

  // // 📋 Console all data needed for printing
  // console.log("========== 🖨️ RECEIPT PRINTER DATA ==========");
  // console.log("📊 Payment Mode:", mode);
  // console.log("💰 Cash Received:", cashReceived);
  // console.log("💳 Payment Value (Cashless):", paymentValue);
  // console.log("🏦 Cashless Type:", cashlessType);
  // console.log("🖨️ Printer Name:", p_name);
  // console.log("---");
  // console.log("🍽️ MEALS:", meals);
  // console.log("📦 PRODUCTS:", products);
  // console.log("---");
  // console.log("💵 Subtotal:", subTotal);
  // console.log("🎁 Total Discount:", totalDiscount);
  // console.log("📈 VAT (12%):", vatAmount);
  // console.log("📊 Grand Total:", grandTotal);
  // console.log("---");
  // console.log("💸 Change:", mode === "cash" ? cashReceived - grandTotal : 0);
  // console.log("==========================================");

  const effectivePayment = mode === "cashless" ? paymentValue : cashReceived;
  const change = mode === "cash" ? effectivePayment - grandTotal : 0;

  const LINE_WIDTH = 42; // Wider for better formatting

  function centerText(text: string, width: number = LINE_WIDTH) {
    const spaces = Math.floor((width - text.length) / 2);
    return " ".repeat(Math.max(0, spaces)) + text;
  }

  function rightAlign(
    label: string,
    value: string,
    width: number = LINE_WIDTH
  ) {
    const spaces = width - label.length - value.length;
    return label + " ".repeat(Math.max(1, spaces)) + value;
  }

  const allItems = [
    ...meals.map((i) => ({ ...i, type: "Meal" })),
    ...products.map((i) => ({ ...i, type: "Ala Carte" })),
  ];

  const [isPrinting, setIsPrinting] = useState(false);

  // 🖨️ Auto-print when invoiceNum is provided
  useEffect(() => {
    // Only print if we have invoice number, printer name, and haven't printed yet
    if (invoiceNum && p_name && !hasPrintedRef.current && !isPrinting) {
      console.log(
        "🖨️ [AutoPrint] Triggering auto-print for invoice:",
        invoiceNum
      );
      hasPrintedRef.current = true; // Prevent double printing
      handlePrint();
    }
  }, [invoiceNum, p_name]);

  const handlePrint = async () => {
    // console.log("🖨️ [PrintReceipt] Print handler triggered");
    // console.log("📋 [PrintReceipt] Mode:", mode);
    // console.log("🖨️ [PrintReceipt] Printer Name:", p_name);
    // console.log(
    //   "💵 [PrintReceipt] Amount:",
    //   mode === "cash" ? cashReceived : paymentValue
    // );

    try {
      setIsPrinting(true);

      console.log("🔍 [PrintReceipt] Fetching available printers...");
      const printers: string[] = await invoke("list_printers");
      console.log("✅ [PrintReceipt] Available printers:", printers);

      if (!printers || printers.length === 0) {
        console.error("❌ [PrintReceipt] No printers detected");
        await message("No printer detected. Please connect a printer.", {
          title: "Printer Error",
        });
        setIsPrinting(false);
        return;
      }

      if (!printers.includes(p_name)) {
        console.error(
          `❌ [PrintReceipt] Printer "${p_name}" not found in list:`,
          printers
        );
        await message(`Printer "${p_name}" not found.`, {
          title: "Printer Error",
        });
        setIsPrinting(false);
        return;
      }

      console.log(
        "✅ [PrintReceipt] Printer verified, constructing receipt..."
      );

      const DASHED_LINE = "- ".repeat(Math.floor(LINE_WIDTH / 2));
      const STAR_LINE = "*".repeat(LINE_WIDTH);
      const dateTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
      const dateIssued = dayjs().format("MMM DD, YYYY");

      // Construct receipt text matching the design
      const receipt = `
${centerText("Proserv Food Retail")}

${centerText("Unit 11-A GF Century Plaza")}
${centerText("Perea Makati City, Philippines")}
${centerText("Machine Serial 1212345")}
${centerText("VAT Reg TIN: 000-000-000-000")}
${centerText("MIN: 12345678890")}

${DASHED_LINE}
${"QTY".padEnd(6)}${"Item".padEnd(24)}${"Amount".padStart(12)}
${allItems
  .map(
    (item) =>
      `${item.qty.toString().padEnd(6)}${item.name.padEnd(24).slice(0, 24)}${(
        item.price * item.qty
      )
        .toFixed(2)
        .padStart(12)}`
  )
  .join("\n")}
${rightAlign("Subtotal", subTotal.toFixed(2))}
${DASHED_LINE}

${rightAlign("Discount", totalDiscount.toFixed(2))}
${rightAlign("VAT Sales", vatableSales.toFixed(2))}
${rightAlign("VAT", vatAmount.toFixed(2))}
${rightAlign("VAT Exempt Sales", vatExemptSales.toFixed(2))}
${rightAlign("Total", grandTotal.toFixed(2))}
${
  mode === "cash"
    ? `${rightAlign("Cash", cashReceived.toFixed(2))}
${rightAlign("Change", change.toFixed(2))}`
    : `${rightAlign(
        `Payment (${cashlessType?.toUpperCase() || "CASHLESS"})`,
        paymentValue.toFixed(2)
      )}`
}

${"TOTAL ITEM(S):".padEnd(20)}${totalItems}
${"INV #:".padEnd(20)}${invoiceNum}
${"CASHIER:".padEnd(20)}${cashierName}
${"Order #:".padEnd(20)}${orderNum}
${"Date and Time:".padEnd(20)}${dateTime}
${
  mode === "cash"
    ? `${"Cash:".padEnd(20)}${cashReceived.toFixed(2)}
${"Change:".padEnd(20)}${change.toFixed(2)}`
    : `${"Payment:".padEnd(20)}${paymentValue.toFixed(2)} (${
        cashlessType?.toUpperCase() || "CASHLESS"
      })`
}


${"Name:".padEnd(15)}${"_".repeat(25)}
${"Address:".padEnd(15)}${"_".repeat(25)}
${"TIN No:".padEnd(15)}${"_".repeat(25)}
${"Bus Style:".padEnd(15)}${"_".repeat(25)}

${centerText("This serves as your invoice.")}

${STAR_LINE}

${centerText("Scan for your feedback")}
${centerText("[QR CODE PLACEHOLDER]")}

${STAR_LINE}

${centerText("POS SUPPLIER")}
${centerText("ProServ Communication")}

${centerText("Unit 11-A GF Century Plaza")}
${centerText("Perea Makati City, Philippines")}
${centerText("Machine Serial 1212345")}
${centerText("VAT Reg TIN: 000-000-000-000")}
${centerText("MIN: 12345678890")}
${centerText("Accred No: 0000-989765421")}
${centerText(`Date Issued: ${dateIssued}`)}
${centerText("PTU No: AFRF09763864")}
`;

      console.log(
        "📝 [PrintReceipt] Receipt content generated, sending to printer:",
        p_name
      );
      await invoke("print_receipt", { content: receipt });

      console.log("✅ [PrintReceipt] Print command sent successfully");
      clearOrder();
      await message("Receipt printed successfully!", { title: "Success" });
      console.log("✨ [PrintReceipt] Order cleared, calling onSuccess");
      onSuccess && onSuccess();
    } catch (err) {
      console.error("❌ [PrintReceipt] Print error:", err);
      await message("Printing failed. Please try again. " + String(err), {
        title: "Print Error",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  // If invoiceNum is provided, auto-print will trigger via useEffect
  // If not, show a manual print button
  const showManualPrintButton = !invoiceNum && p_name;

  return (
    <div className="mt-4">
      {isPrinting && (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
          <span className="animate-spin">🖨️</span>
          <span>Printing receipt...</span>
        </div>
      )}
      {showManualPrintButton && !isPrinting && (
        <button
          onClick={handlePrint}
          disabled={isPrinting || !p_name}
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 text-sm font-bold disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
        >
          Print Receipt
        </button>
      )}
    </div>
  );
}
