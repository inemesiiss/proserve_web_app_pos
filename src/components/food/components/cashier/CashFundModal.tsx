import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CameraModal from "./CameraModal";

interface CashFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmFund: (fundData: CashFundData) => void;
}

export interface CashFundData {
  denominations: DenominationCount;
  totalAmount: number;
  photoData: string;
  timestamp: string;
}

interface DenominationCount {
  coins_1: number;
  coins_5: number;
  coins_10: number;
  coins_25: number;
  bill_20: number;
  bill_50: number;
  bill_100: number;
  bill_500: number;
  bill_1000: number;
}

const denominationValues: Record<keyof DenominationCount, number> = {
  coins_1: 1,
  coins_5: 5,
  coins_10: 10,
  coins_25: 25,
  bill_20: 20,
  bill_50: 50,
  bill_100: 100,
  bill_500: 500,
  bill_1000: 1000,
};

const denominationLabels: Record<keyof DenominationCount, string> = {
  coins_1: "₱1 Coins",
  coins_5: "₱5 Coins",
  coins_10: "₱10 Coins",
  coins_25: "₱25 Coins",
  bill_20: "₱20 Bills",
  bill_50: "₱50 Bills",
  bill_100: "₱100 Bills",
  bill_500: "₱500 Bills",
  bill_1000: "₱1000 Bills",
};

export default function CashFundModal({
  isOpen,
  onClose,
  onConfirmFund,
}: CashFundModalProps) {
  const [step, setStep] = useState<"denomination" | "photo">("denomination");
  const [denominations, setDenominations] = useState<DenominationCount>({
    coins_1: 0,
    coins_5: 0,
    coins_10: 0,
    coins_25: 0,
    bill_20: 0,
    bill_50: 0,
    bill_100: 0,
    bill_500: 0,
    bill_1000: 0,
  });

  const [photoData, setPhotoData] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Keyboard state
  const [activeInputKey, setActiveInputKey] = useState<
    keyof DenominationCount | null
  >(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Calculate total amount
  const totalAmount = Object.entries(denominations).reduce(
    (sum, [key, count]) => {
      return sum + denominationValues[key as keyof DenominationCount] * count;
    },
    0
  );

  // Open keyboard for a denomination
  const openKeyboard = (key: keyof DenominationCount) => {
    setActiveInputKey(key);
    setInputValue(denominations[key].toString());
  };

  // Close keyboard
  const closeKeyboard = () => {
    setActiveInputKey(null);
    setInputValue("");
  };

  // Handle keyboard number input
  const handleKeyInput = (num: number) => {
    const newValue = inputValue + num.toString();
    setInputValue(newValue);
  };

  // Handle backspace
  const handleBackspace = () => {
    setInputValue(inputValue.slice(0, -1));
  };

  // Handle clear
  const handleClear = () => {
    setInputValue("0");
  };

  // Confirm input
  const confirmInput = () => {
    if (activeInputKey) {
      const numValue = Math.max(0, parseInt(inputValue) || 0);
      setDenominations((prev) => ({
        ...prev,
        [activeInputKey]: numValue,
      }));
      closeKeyboard();
    }
  };

  // Update denomination count with buttons
  const updateDenomination = (key: keyof DenominationCount, change: number) => {
    setDenominations((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + change),
    }));
  };

  // Start camera
  const handleOpenCamera = () => {
    setShowCameraModal(true);
  };

  // Handle photo capture from CameraModal
  const handlePhotoCaptured = (imageData: string) => {
    setPhotoData(imageData);
  };

  // Retake photo
  const retakePhoto = () => {
    setPhotoData(null);
    setShowCameraModal(true);
  };

  // Confirm fund
  const handleConfirm = () => {
    if (!photoData) {
      alert("Please take a photo to confirm the cash fund.");
      return;
    }

    const fundData: CashFundData = {
      denominations,
      totalAmount,
      photoData,
      timestamp: new Date().toISOString(),
    };

    onConfirmFund(fundData);
    resetModal();
    onClose();
  };

  // Reset modal
  const resetModal = () => {
    setStep("denomination");
    setDenominations({
      coins_1: 0,
      coins_5: 0,
      coins_10: 0,
      coins_25: 0,
      bill_20: 0,
      bill_50: 0,
      bill_100: 0,
      bill_500: 0,
      bill_1000: 0,
    });
    setPhotoData(null);
    setShowCameraModal(false);
    closeKeyboard();
  };

  // Handle close
  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold text-white">
                  Cash Fund Setup
                </h2>
                <p className="text-green-100 mt-1">
                  {step === "denomination"
                    ? "Enter beginning cash drawer denomination"
                    : "Confirm cash fund with photo"}
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                {step === "denomination" ? (
                  <div className="space-y-6">
                    {/* Coins Section */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Coins
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(
                          [
                            "coins_1",
                            "coins_5",
                            "coins_10",
                            "coins_25",
                          ] as const
                        ).map((key) => (
                          <DenominationCard
                            key={key}
                            label={denominationLabels[key]}
                            count={denominations[key]}
                            value={denominationValues[key]}
                            onIncrease={() => updateDenomination(key, 1)}
                            onDecrease={() => updateDenomination(key, -1)}
                            onTapInput={() => openKeyboard(key)}
                            isActive={activeInputKey === key}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bills Section */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Bills
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {(
                          [
                            "bill_20",
                            "bill_50",
                            "bill_100",
                            "bill_500",
                            "bill_1000",
                          ] as const
                        ).map((key) => (
                          <DenominationCard
                            key={key}
                            label={denominationLabels[key]}
                            count={denominations[key]}
                            value={denominationValues[key]}
                            onIncrease={() => updateDenomination(key, 1)}
                            onDecrease={() => updateDenomination(key, -1)}
                            onTapInput={() => openKeyboard(key)}
                            isActive={activeInputKey === key}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Total Cash Fund</p>
                      <p className="text-3xl font-bold text-green-600">
                        ₱
                        {totalAmount.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Photo Section */}
                    {!photoData && (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <span className="text-3xl">📸</span>
                        </div>
                        <p className="text-gray-600 text-center mb-4 font-medium">
                          Please take a photo to confirm you agree with this
                          cash fund amount
                        </p>
                        <Button
                          onClick={handleOpenCamera}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                        >
                          <span className="mr-2">📷</span>
                          Start Camera
                        </Button>
                      </div>
                    )}

                    {photoData && (
                      <div className="space-y-4">
                        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                          <img
                            src={photoData}
                            alt="Cash fund confirmation"
                            className="w-full h-full object-cover"
                            style={{ transform: "scaleX(-1)" }}
                          />
                          <div className="absolute top-4 left-4 bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                            ✓ Photo Captured
                          </div>
                        </div>
                        <Button
                          onClick={retakePhoto}
                          variant="outline"
                          className="w-full"
                        >
                          <span className="mr-2">🔄</span>
                          Retake Photo
                        </Button>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-sm text-gray-600">Cash Fund Amount</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₱
                        {totalAmount.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-4">
                        By confirming, you agree that this is the correct cash
                        amount in your drawer.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shared On-Screen Keyboard */}
              <AnimatePresence>
                {activeInputKey && (
                  <motion.div
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 300, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="border-t border-gray-300 bg-gradient-to-t from-gray-100 to-gray-50 p-4"
                  >
                    {/* Display Input */}
                    <div className="mb-4 text-center">
                      <input
                        type="text"
                        value={inputValue}
                        readOnly
                        className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-green-400 rounded-lg bg-green-50 mb-2"
                      />
                      <p className="text-xs text-gray-600">
                        {activeInputKey && denominationLabels[activeInputKey]}
                      </p>
                    </div>

                    {/* Keyboard Grid */}
                    <div className="space-y-2">
                      {/* Row 1-3: Numbers */}
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleKeyInput(num)}
                            className="bg-white hover:bg-blue-100 border-2 border-gray-300 rounded-lg py-3 font-bold text-xl transition-colors active:scale-95"
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      {/* Row 4: 0, Backspace, Clear */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleKeyInput(0)}
                          className="bg-white hover:bg-blue-100 border-2 border-gray-300 rounded-lg py-3 font-bold text-xl transition-colors active:scale-95"
                        >
                          0
                        </button>
                        <button
                          onClick={handleBackspace}
                          className="bg-red-100 hover:bg-red-200 border-2 border-red-400 rounded-lg py-3 font-bold text-xl transition-colors active:scale-95"
                        >
                          ⌫
                        </button>
                        <button
                          onClick={handleClear}
                          className="bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-400 rounded-lg py-3 font-bold text-xl transition-colors active:scale-95"
                        >
                          C
                        </button>
                      </div>

                      {/* Row 5: Cancel and Confirm */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={closeKeyboard}
                          className="bg-gray-300 hover:bg-gray-400 border-2 border-gray-500 rounded-lg py-3 font-bold text-lg transition-colors active:scale-95"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmInput}
                          className="bg-green-500 hover:bg-green-600 border-2 border-green-700 rounded-lg py-3 font-bold text-lg text-white transition-colors active:scale-95"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 flex items-center justify-between gap-3">
                {step === "denomination" ? (
                  <>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="px-6 py-2 bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setStep("photo")}
                      disabled={totalAmount === 0}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Photo Verification
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setStep("denomination")}
                      variant="outline"
                      className="px-6 py-2 bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      disabled={!photoData}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Cash Fund
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Camera Modal */}
      <CameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handlePhotoCaptured}
        title="Cash Fund Verification"
        description="Take a photo to confirm the cash fund amount"
        badge={{
          emoji: "💰",
          text: "Cash Fund Verification",
          color: "green",
        }}
        confirmButtonText="Confirm & Continue"
      />
    </AnimatePresence>
  );
}

/* Denomination Card Component */
interface DenominationCardProps {
  label: string;
  count: number;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onTapInput: () => void;
  isActive: boolean;
}

function DenominationCard({
  label,
  count,
  value,
  onIncrease,
  onDecrease,
  onTapInput,
  isActive,
}: DenominationCardProps) {
  return (
    <div
      className={`border-2 rounded-lg p-4 text-center transition-all cursor-pointer ${
        isActive
          ? "border-green-500 bg-green-50 shadow-lg"
          : "border-gray-200 bg-white hover:border-green-300"
      }`}
    >
      <p className="text-xs font-semibold text-gray-600 mb-2">{label}</p>
      <div className="flex items-center justify-center gap-2 mb-2">
        <button
          onClick={onDecrease}
          className="w-6 h-6 rounded bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
          title="Decrease"
        >
          <Minus size={14} className="text-red-600" />
        </button>
        <input
          type="text"
          value={count}
          onClick={onTapInput}
          readOnly
          className="w-12 text-center font-bold text-lg border-2 border-blue-300 rounded bg-blue-50 cursor-pointer hover:bg-blue-100"
        />
        <button
          onClick={onIncrease}
          className="w-6 h-6 rounded bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
          title="Increase"
        >
          <Plus size={14} className="text-green-600" />
        </button>
      </div>

      <p className="text-xs text-gray-500">
        ₱{(value * count).toLocaleString("en-PH")}
      </p>
    </div>
  );
}
