import { useState } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { invoke } from "@tauri-apps/api/core";
import { message } from "@tauri-apps/plugin-dialog";
import dayjs from "dayjs";
import ConfirmModal from "../../modals/ComfimModal";

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
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrint = async () => {
    try {
      setIsPrinting(true);

      const printers: string[] = await invoke("list_printers");
      if (!printers || printers.length === 0) {
        await message("No printer detected. Please connect a printer.", {
          title: "Printer Error",
        });
        setIsPrinting(false);
        return;
      }

      if (!printers.includes(p_name)) {
        await message(`Printer "${p_name}" not found.`, {
          title: "Printer Error",
        });
        setIsPrinting(false);
        return;
      }

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

      await invoke("print_receipt", { content: receipt });

      clearOrder();
      await message("Receipt printed successfully!", { title: "Success" });
    } catch (err) {
      console.error("Print error:", err);
      setError("Printing failed. Please try again." + err);
    } finally {
      setIsPrinting(false);
      setShowModal(false);
      onSuccess && onSuccess();
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="bg-gray-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          onClick={() => clearOrder()}
          disabled={isPrinting}
        >
          Cancel
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          onClick={() => setShowModal(true)}
          disabled={isPrinting || grandTotal <= 0}
        >
          {isPrinting ? "Printing..." : "Proceed"}
        </button>
      </div>

      {showModal && (
        <ConfirmModal
          text={
            mode === "cash"
              ? "Cash is enough to cover the bill. Would you like to confirm and print the receipt?"
              : `Proceed with ${cashlessType?.toUpperCase()} payment and print receipt?`
          }
          handleSubmit={handlePrint}
          isReadyToSubmit={showModal}
          error={error}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
