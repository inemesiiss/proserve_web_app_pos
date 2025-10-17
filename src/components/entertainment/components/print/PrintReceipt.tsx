import { useEffect, useState } from "react";
import { useOrder } from "@/context/entertainment/OrderProvider";
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
  onSuccess?: () => void; // callback after printing
}

export default function ReceiptPrinter({
  mode = "cash",
  cashReceived = 0,
  paymentValue = 0,
  cashlessType,
  p_name,
  onSuccess,
}: ReceiptPrinterProps) {
  const { order, clearOrder } = useOrder();
  const [isPrinting, setIsPrinting] = useState(false);
  const [error] = useState<string | null>(null);

  // Compute totals
  const subtotal = [...order.tickets, ...order.snacks].reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const vat = subtotal * 0.12;
  const grandTotal = subtotal + vat;

  const effectivePayment = mode === "cashless" ? paymentValue : cashReceived;
  const change = mode === "cash" ? effectivePayment - grandTotal : 0;

  const LINE_WIDTH = 32;

  function centerText(text: string, width: number = LINE_WIDTH) {
    const spaces = Math.floor((width - text.length) / 2);
    return " ".repeat(Math.max(0, spaces)) + text;
  }

  const allItems = [
    ...order.tickets.map((i) => ({ ...i, type: "🎟️ Ticket" })),
    ...order.snacks.map((i) => ({ ...i, type: "🍿 Snack" })),
  ];

  useEffect(() => {
    const handleAutoPrint = async () => {
      try {
        if (isPrinting || grandTotal <= 0) return;
        setIsPrinting(true);

        const printers: string[] = await invoke("list_printers");
        if (!printers || printers.length === 0) {
          await message("No printer detected. Please connect a printer.", {
            title: "Printer Error",
          });
          return;
        }

        if (!printers.includes(p_name)) {
          await message(`Printer "${p_name}" not found.`, {
            title: "Printer Error",
          });
          return;
        }

        // 🧾 Construct cinema receipt
        const receipt = `
${centerText("🎬 CINEMA TICKET RECEIPT")}
${centerText("Proserv Entertainment")}
${centerText("Perea Makati City, Philippines")}
${centerText("VAT Reg TIN: 000-000-000-000")}
${centerText("Machine Serial: 1212345")}
${centerText("MIN: 12345678890")}
${"-".repeat(LINE_WIDTH)}
Item              QTY   Amount
${allItems
  .map(
    (item) =>
      `${item.name.padEnd(14).slice(0, 14)} ${item.qty
        .toString()
        .padStart(3)} ${(item.price * item.qty).toFixed(2).padStart(7)}`
  )
  .join("\n")}
${"-".repeat(LINE_WIDTH)}
Subtotal:       ${subtotal.toFixed(2).padStart(7)}
12% VAT:        ${vat.toFixed(2).padStart(7)}
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
${centerText("Ticket Details")}
${order.tickets
  .map(
    (t) =>
      ` ${t.name} (ID: ${t.id})
  Price: ${t.price.toFixed(2)}`
  )
  .join("\n")}
${"-".repeat(LINE_WIDTH)}
${centerText("Thank you for choosing Proserv Cinema!")}
${centerText(`Date Issued: ${dayjs().format("MMM DD, YYYY hh:mm A")}`)}
${centerText("PTU No: CIN09763864")}
`;

        await invoke("print_receipt", { content: receipt });
        await message("Receipt printed successfully!", { title: "Success" });
        clearOrder();
      } catch (err) {
        console.error("Print error:", err);
      } finally {
        setIsPrinting(false);
        onSuccess && onSuccess();
      }
    };

    handleAutoPrint();
  }, [grandTotal]); // triggers when a transaction completes

  if (error) {
    return <div className="text-red-600 text-sm text-center mt-3">{error}</div>;
  }

  return null; // auto-print only
}
