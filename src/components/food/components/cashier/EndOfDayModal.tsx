import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import {
  useLazyGetEodDetailsQuery,
  useConfirmEodMutation,
  type EodDetailsResponse,
  type ConfirmEodResponse,
  type EodPurchase,
} from "@/store/api/Transaction";
import { getCashierSession } from "@/utils/cashierSession";
import { useDeviceSettings } from "@/hooks/useDeviceSettings";
import dayjs from "dayjs";

interface EndOfDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EndOfDayModal({
  isOpen,
  onClose,
  onConfirm,
}: EndOfDayModalProps) {
  const [step, setStep] = useState<
    | "confirm"
    | "loading"
    | "summary"
    | "confirming"
    | "printing"
    | "success"
    | "error"
  >("confirm");
  const [printError, setPrintError] = useState<string | null>(null);

  // EOD data from APIs
  const [eodDetails, setEodDetails] = useState<
    EodDetailsResponse["data"] | null
  >(null);
  const [eodConfirmData, setEodConfirmData] = useState<
    ConfirmEodResponse["data"] | null
  >(null);

  const branchId = parseInt(localStorage.getItem("branch") || "0", 10);
  const cashierSession = getCashierSession();
  const { settings: deviceSettings } = useDeviceSettings();

  // API hooks
  const [triggerGetEodDetails] = useLazyGetEodDetailsQuery();
  const [confirmEod] = useConfirmEodMutation();

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep("confirm");
      setPrintError(null);
      setEodDetails(null);
      setEodConfirmData(null);
    }
  }, [isOpen]);

  // Step 1 -> Step 2: User clicks "Yes, End Shift" -> call GET get_eod_details
  const handleConfirmEndShift = async () => {
    if (!branchId || !cashierSession?.cashierId) {
      setPrintError("Missing branch or cashier information.");
      setStep("error");
      return;
    }

    setStep("loading");
    try {
      const result = await triggerGetEodDetails({
        branchId,
        cashierId: cashierSession.cashierId,
      }).unwrap();

      if (result.success && result.data) {
        setEodDetails(result.data);
        setStep("summary");
      } else {
        setPrintError(result.message || "Failed to load EOD details.");
        setStep("error");
      }
    } catch (err: any) {
      console.error("EOD details error:", err);
      setPrintError(
        err?.data?.message || err?.message || "Failed to load EOD details.",
      );
      setStep("error");
    }
  };

  // Step 2 -> Step 3: User clicks "Confirm & Print" -> call POST confirm_eod
  const handleConfirmAndPrint = async () => {
    if (!branchId || !cashierSession?.cashierId) {
      setPrintError("Missing branch or cashier information.");
      setStep("error");
      return;
    }

    setStep("confirming");
    try {
      const result = await confirmEod({
        branchId,
        cashierId: cashierSession.cashierId,
      }).unwrap();

      if (result.success && result.data) {
        setEodConfirmData(result.data);
        // Now print the receipt with purchases
        await printReceipt(result.data);
      } else {
        setPrintError(result.message || "No transactions found for EOD.");
        setStep("error");
      }
    } catch (err: any) {
      console.error("EOD confirm error:", err);
      setPrintError(
        err?.data?.message || err?.message || "Failed to confirm EOD.",
      );
      setStep("error");
    }
  };

  const LINE_WIDTH = 48; // 80mm thermal printer

  function centerText(text: string, width: number = LINE_WIDTH) {
    const spaces = Math.floor((width - text.length) / 2);
    return " ".repeat(Math.max(0, spaces)) + text;
  }

  // Safe number formatter - handles undefined, null, NaN
  function safeNum(val: unknown): number {
    if (val === undefined || val === null) return 0;
    const n = typeof val === "string" ? parseFloat(val) : Number(val);
    return isNaN(n) ? 0 : n;
  }

  function formatPeso(val: number): string {
    return val.toFixed(2);
  }

  const generateEndOfDayReceipt = (
    data: NonNullable<ConfirmEodResponse["data"]>,
  ): string => {
    const branchName = localStorage.getItem("branchName") || "All Branches";
    const cashierName = cashierSession?.cashierFullname || "All Cashier";
    const terminalId = localStorage.getItem("terminalId") || "#123456789";
    const dateNow = dayjs().format("MMMM DD, YYYY");
    const dateTimeNow = dayjs().format("MM/DD/YYYY hh:mm:ss A");

    // Title
    let receipt = "\n";
    receipt += centerText("Printed Report Template ( 80MM Size )") + "\n\n";

    // Separator
    receipt += "-".repeat(LINE_WIDTH) + "\n\n";

    // Header Info
    receipt += ` Name of Branch : ${branchName}\n`;
    receipt += ` Reported Date  : ${dateNow}\n`;
    receipt += ` Terminal ID    : ${terminalId}\n`;
    receipt += ` Cashier Name   : ${cashierName}\n\n`;

    // Table Header
    // Columns: Date and Time(18) | OR #(14) | Disc(8) | VAT-Ex(8) | Grand(10)
    const sep = "-".repeat(LINE_WIDTH);
    receipt += sep + "\n";
    receipt +=
      " Date and Time    " +
      "OR #          " +
      "Disc    " +
      "VAT-Ex  " +
      "Grand Tot " +
      "\n";
    receipt += sep + "\n";

    let totalDiscount = 0;
    let totalVATExempt = 0;
    let totalGrand = 0;
    const purchases = data.purchases || [];

    purchases.forEach((t: EodPurchase) => {
      const dateStr = dayjs(t.completed_at).format("MM/DD/YY, hh:mm A");
      const orNum = (t.invoice_num || "N/A").slice(0, 13);
      const disc = safeNum(t.total_items_discount);
      const vatEx = safeNum(t.vat_exempt_sales);
      const grand = safeNum(t.grand_total);

      totalDiscount += disc;
      totalVATExempt += vatEx;
      totalGrand += grand;

      // Row: date(18) or#(14) disc(8) vat(8) grand(10)
      receipt +=
        " " +
        dateStr.padEnd(17) +
        orNum.padEnd(14) +
        formatPeso(disc).padStart(7) +
        " " +
        formatPeso(vatEx).padStart(7) +
        " " +
        formatPeso(grand).padStart(9) +
        "\n";
    });

    receipt += sep + "\n";

    // Totals Row
    receipt +=
      " " +
      "Total".padEnd(31) +
      formatPeso(totalDiscount).padStart(7) +
      " " +
      formatPeso(totalVATExempt).padStart(7) +
      " " +
      formatPeso(totalGrand).padStart(9) +
      "\n\n";

    receipt += "=".repeat(LINE_WIDTH) + "\n\n";

    // Sales Summary
    receipt += ` Total Transactions: ${purchases.length}\n`;
    receipt += ` Total Sales:        ${formatPeso(safeNum(data.total_sales))}\n`;
    receipt += ` Total Cash:         ${formatPeso(safeNum(data.total_cash))}\n`;
    receipt += ` Total Cashless:     ${formatPeso(safeNum(data.total_cashless))}\n`;
    receipt += ` Total Discount:     ${formatPeso(safeNum(data.total_discount))}\n`;
    receipt += ` Net Sales:          ${formatPeso(safeNum(data.net_sales))}\n`;
    receipt += ` Init Cash Fund:     ${formatPeso(safeNum(data.init_cash_fund))}\n\n`;

    receipt += "=".repeat(LINE_WIDTH) + "\n\n";

    // Footer
    receipt += centerText(`Printed: ${dateTimeNow}`) + "\n\n";

    receipt += " Cashier: ______________________\n";
    receipt += " Manager: ______________________\n\n";

    receipt += centerText("--- End of Report ---") + "\n\n";

    return receipt;
  };

  const printReceipt = async (
    data: NonNullable<ConfirmEodResponse["data"]>,
  ) => {
    setStep("printing");
    try {
      const receipt = generateEndOfDayReceipt(data);
      const printerName = deviceSettings.receiptPrinter || "";

      if (!printerName) {
        // Fallback: browser print
        const printWindow = window.open("", "_blank", "width=400,height=600");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>End of Day Report</title>
                <style>
                  @page { size: 80mm auto; margin: 5mm; }
                  body { font-family: 'Courier New', monospace; font-size: 11px; margin: 0; padding: 10px; white-space: pre; }
                </style>
              </head>
              <body>${receipt}</body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        }
        setStep("success");
        setTimeout(() => onConfirm(), 2000);
        return;
      }

      // Tauri native printing
      const printers: string[] = await invoke("list_printers");

      if (!printers || printers.length === 0) {
        setPrintError(
          "No printer detected. Please connect a printer and try again.",
        );
        setStep("error");
        return;
      }

      if (!printers.includes(printerName)) {
        setPrintError(
          `Printer "${printerName}" not found. Available: ${printers.join(", ")}`,
        );
        setStep("error");
        return;
      }

      await invoke("print_receipt", { printerName, content: receipt });

      setStep("success");
      setTimeout(() => onConfirm(), 2000);
    } catch (err) {
      console.error("End of Day print error:", err);
      setPrintError(`Printing failed: ${String(err)}`);
      setStep("error");
    }
  };

  // Retry printing with already confirmed data
  const handleRetryPrint = async () => {
    if (eodConfirmData) {
      await printReceipt(eodConfirmData);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && step === "confirm" && onClose()
          }
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`bg-white rounded-2xl shadow-2xl relative overflow-hidden ${
              step === "summary" ? "w-[900px] max-h-[85vh]" : "w-[480px]"
            }`}
          >
            {/* Step 1: Confirmation */}
            {step === "confirm" && (
              <div className="p-8 text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={22} />
                </button>

                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl">🌙</span>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  End of Day
                </h2>
                <p className="text-gray-500 mb-8">
                  Are you sure you want to end your shift? This will show your
                  shift summary.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmEndShift}
                    className="flex-1 py-3 rounded-xl font-semibold bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Yes, End Shift
                  </Button>
                </div>
              </div>
            )}

            {/* Loading: Fetching EOD details */}
            {step === "loading" && (
              <div className="p-12 text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-5" />
                <p className="text-lg font-bold text-gray-800">
                  Loading Shift Summary...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please wait while we fetch your EOD details.
                </p>
              </div>
            )}

            {/* Step 2: Summary from get_eod_details */}
            {step === "summary" && eodDetails && (
              <div className="flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="px-8 pt-6 pb-4 border-b border-gray-100">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={22} />
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">
                    End of Day - Shift Summary
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {dayjs().format("MMMM DD, YYYY")} &middot;{" "}
                    {cashierSession?.cashierFullname || "Cashier"}
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3 px-8 py-5">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                      Total Sales
                    </div>
                    <div className="text-xl font-bold text-blue-800">
                      ₱
                      {eodDetails.total_sales.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">
                      Cash Received
                    </div>
                    <div className="text-xl font-bold text-green-800">
                      ₱
                      {eodDetails.total_cash_received.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 text-center">
                    <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                      Cashless Received
                    </div>
                    <div className="text-xl font-bold text-indigo-800">
                      ₱
                      {eodDetails.total_cashless_received.toLocaleString(
                        "en-PH",
                        { minimumFractionDigits: 2 },
                      )}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <div className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-1">
                      Total Discount
                    </div>
                    <div className="text-xl font-bold text-orange-800">
                      ₱
                      {eodDetails.total_discount.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-1">
                      Expected Cash
                    </div>
                    <div className="text-xl font-bold text-purple-800">
                      ₱
                      {eodDetails.expected_cash.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">
                      Transactions
                    </div>
                    <div className="text-xl font-bold text-gray-800">
                      {eodDetails.num_transactions}
                    </div>
                  </div>
                </div>

                {/* Init Cash Fund */}
                <div className="px-8 pb-3">
                  <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600">
                    Initial Cash Fund:{" "}
                    <span className="font-semibold text-gray-800">
                      ₱
                      {eodDetails.init_cash_fund.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Product Breakdown Table */}
                {eodDetails.product_breakdown.length > 0 && (
                  <div className="px-8 pb-4 flex-1 overflow-y-auto">
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">
                      Product Breakdown
                    </h3>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                              Product
                            </th>
                            <th className="text-right px-4 py-3 text-gray-600 font-semibold">
                              Qty
                            </th>
                            <th className="text-right px-4 py-3 text-gray-600 font-semibold">
                              Total Sales
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {eodDetails.product_breakdown.map((p, idx) => (
                            <tr
                              key={p.branch_prod__id}
                              className={`border-t border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                            >
                              <td className="px-4 py-3 text-gray-700">
                                {p.branch_prod__prod_name}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-700">
                                {p.total_qty}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-gray-800">
                                ₱
                                {p.total_sales.toLocaleString("en-PH", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="px-8 py-4 border-t border-gray-100 flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmAndPrint}
                    className="px-6 py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Printer size={18} />
                    Confirm & Print
                  </Button>
                </div>
              </div>
            )}

            {/* Confirming: calling confirm_eod POST */}
            {step === "confirming" && (
              <div className="p-12 text-center">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-5" />
                <p className="text-lg font-bold text-gray-800">
                  Confirming End of Day...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Creating sales report and preparing receipt.
                </p>
              </div>
            )}

            {/* Printing */}
            {step === "printing" && (
              <div className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
                >
                  <Printer className="w-10 h-10 text-blue-600" />
                </motion.div>
                <p className="text-lg font-bold text-gray-800">
                  Printing End of Day Report...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please wait while the receipt is being printed.
                </p>
              </div>
            )}

            {/* Success */}
            {step === "success" && (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </motion.div>
                <p className="text-lg font-bold text-green-700">
                  Report Printed Successfully!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Your shift has ended. Closing...
                </p>
              </div>
            )}

            {/* Error */}
            {step === "error" && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <p className="text-lg font-bold text-red-700">
                  Operation Failed
                </p>
                <p className="text-sm text-gray-500 mt-2 mb-6">{printError}</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setStep(eodDetails ? "summary" : "confirm")}
                    className="px-6 py-3 rounded-xl font-semibold"
                  >
                    Back
                  </Button>
                  {eodConfirmData && (
                    <Button
                      onClick={handleRetryPrint}
                      className="px-6 py-3 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white"
                    >
                      Retry Print
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
