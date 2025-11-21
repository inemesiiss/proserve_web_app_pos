import { useState } from "react";
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
  onSuccess?: () => void;
}

export default function ReceiptPrinter({
  mode = "cash",
  cashReceived = 0,
  paymentValue = 0,
  cashlessType,
  p_name,
  onSuccess,
}: ReceiptPrinterProps) {
  const { meals, products, subTotal, totalDiscount, grandTotal, clearOrder } =
    useFoodOrder();
  const vatTotal = subTotal * 0.12;

  const effectivePayment = mode === "cashless" ? paymentValue : cashReceived;
  const change = mode === "cash" ? effectivePayment - grandTotal : 0;

  const LINE_WIDTH = 32;

  function centerText(text: string, width: number = LINE_WIDTH) {
    const spaces = Math.floor((width - text.length) / 2);
    return " ".repeat(Math.max(0, spaces)) + text;
  }

  const allItems = [
    ...meals.map((i) => ({ ...i, type: "Meal" })),
    ...products.map((i) => ({ ...i, type: "Ala Carte" })),
  ];

  const [isPrinting, setIsPrinting] = useState(false);

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

      // Construct receipt text
      const receipt = `
${centerText("PROSERV FOOD RETAIL")}
${centerText("Unit 11-A GF Century Plaza")}
${centerText("Perea Makati City, Philippines")}
${centerText("VAT Reg TIN: 000-000-000-000")}
${centerText("Machine Serial: 1212345")}
${centerText("MIN: 12345678890")}
${"-".repeat(LINE_WIDTH)}
Item           QTY   Amount
${allItems
  .map(
    (item) =>
      `${item.name.padEnd(14).slice(0, 14)} ${item.qty
        .toString()
        .padStart(3)} ${(item.price * item.qty).toFixed(2).padStart(7)}`
  )
  .join("\n")}
${"-".repeat(LINE_WIDTH)}
Subtotal:       ${subTotal.toFixed(2).padStart(7)}
Discount:       ${totalDiscount.toFixed(2).padStart(7)}
12% VAT:        ${vatTotal.toFixed(2).padStart(7)}
Grand Total:    ${grandTotal.toFixed(2).padStart(7)}
${
  mode === "cash"
    ? `Cash:           ${cashReceived.toFixed(2).padStart(7)}
Change:         ${change.toFixed(2).padStart(7)}`
    : `Payment (${cashlessType?.toUpperCase()}): ${paymentValue
        .toFixed(2)
        .padStart(7)}`
}
${"-".repeat(LINE_WIDTH)}
${centerText("THIS SERVES AS YOUR INVOICE")}
${centerText(`Date Issued: ${dayjs().format("MMM DD, YYYY")}`)}
${centerText("PTU No: ARFR09763864")}
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

  return (
    <div className="mt-4">
      <button
        className="w-full bg-green-400 hover:bg-green-500 text-white rounded-full px-10 py-2 text-base font-bold disabled:bg-green-200 disabled:cursor-not-allowed transition-colors"
        onClick={handlePrint}
        disabled={isPrinting || !p_name}
      >
        {isPrinting ? "Printing..." : "Print Receipt"}
      </button>
    </div>
  );
}
