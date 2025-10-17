import { useState } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { invoke } from "@tauri-apps/api/core";
import { message } from "@tauri-apps/plugin-dialog";
import dayjs from "dayjs";
import ConfirmModal from "./ComfimModal";
import { Button } from "@/components/ui/button";

interface ReceiptPrinterProps {
  cashReceived: number;
}

export default function ReceiptPrinter({ cashReceived }: ReceiptPrinterProps) {
  const { meals, products, subTotal, totalDiscount, grandTotal, clearOrder } =
    useFoodOrder();
  const vatTotal = subTotal * 0.12;
  const change = cashReceived - grandTotal;

  const [isPrinting, setIsPrinting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // combine all items
  const allItems = [
    ...meals.map((i) => ({ ...i, type: "Meal" })),
    ...products.map((i) => ({ ...i, type: "Ala Carte" })),
  ];

  // 🧾 Print logic
  const handlePrint = async () => {
    try {
      setIsPrinting(true);

      const printers: string[] = await invoke("get_printers");
      if (!printers || printers.length === 0) {
        await message("No printer detected. Please connect a printer.", {
          title: "Printer Error",
        });
        setIsPrinting(false);
        return;
      }

      const html = `
        <div style="font-family: sans-serif; font-size: 12px; width: 280px;">
          <h3 style="text-align:center; margin-bottom:4px;">Proserv Food Retail</h3>
          <p style="text-align:center; font-size:10px; margin:0;">
            Unit 11-A GF Century Plaza<br/>
            Perea Makati City, Philippines<br/>
            VAT Reg TIN: 000-000-000-000<br/>
            Machine Serial: 1212345<br/>
            MIN: 12345678890
          </p>
          <hr style="border-top: 1px dashed #aaa; margin: 6px 0;" />
          <table style="width:100%; font-size:11px;">
            <thead>
              <tr>
                <th align="left">Item</th>
                <th align="center">QTY</th>
                <th align="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${allItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td align="center">${item.qty}</td>
                  <td align="right">₱${(item.price * item.qty).toFixed(2)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <hr style="border-top: 1px dashed #aaa; margin: 6px 0;" />
          <div>
            <div style="display:flex; justify-content:space-between;"><span>Subtotal:</span><span>₱${subTotal.toFixed(
              2
            )}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Discount:</span><span>-₱${totalDiscount.toFixed(
              2
            )}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>12% VAT:</span><span>₱${vatTotal.toFixed(
              2
            )}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; margin-top:4px;"><span>Grand Total:</span><span>₱${grandTotal.toFixed(
              2
            )}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Cash:</span><span>₱${cashReceived.toFixed(
              2
            )}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Change:</span><span>₱${change.toFixed(
              2
            )}</span></div>
          </div>
          <hr style="border-top: 1px dashed #aaa; margin: 6px 0;" />
          <p style="text-align:center; font-size:10px;">THIS SERVES AS YOUR INVOICE</p>
          <p style="text-align:center; font-size:10px;">
            Date Issued: ${dayjs().format("MMM DD, YYYY")}<br/>
            PTU No: ARFR09763864
          </p>
        </div>
      `;

      await invoke("print_receipt", { content: html });

      clearOrder();

      await message("Receipt printed successfully!", {
        title: "Success",
      });
    } catch (err) {
      console.error("Print error:", err);
      setError("Printing failed. Please try again.");
    } finally {
      setIsPrinting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mt-4">
        <Button
          disabled={isPrinting || grandTotal <= 0}
          onClick={() => {
            if (cashReceived < grandTotal) {
              message("Insufficient cash amount.", { title: "Warning" });
              return;
            }
            setShowConfirmModal(true);
          }}
        >
          {isPrinting ? "Printing..." : "Proceed"}
        </Button>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          text="Cash is enough to cover the bill. Would you like to confirm and print the receipt?"
          handleSubmit={handlePrint}
          isReadyToSubmit={showConfirmModal}
          error={error}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
}
