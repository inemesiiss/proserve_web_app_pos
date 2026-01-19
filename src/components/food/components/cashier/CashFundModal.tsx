import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CameraModal from "./CameraModal";

interface CashFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmFund: (fundData: CashFundData) => void;
  allowClose?: boolean;
}

// Cash fund data structure matching API requirements
export interface CashFundData {
  denominations: DenominationCount;
  totalAmount: number;
  photoData: string;
  timestamp: string;
}

// Denomination counts matching API field names
interface DenominationCount {
  thousand: number;
  fiveHundred: number;
  twoHundred: number;
  oneHundred: number;
  fifty: number;
  twenty: number;
  twentyCoins: number;
  tenCoins: number;
  fiveCoins: number;
  oneCoins: number;
  centavos: number;
}

const denominationValues: Record<keyof DenominationCount, number> = {
  thousand: 1000,
  fiveHundred: 500,
  twoHundred: 200,
  oneHundred: 100,
  fifty: 50,
  twenty: 20,
  twentyCoins: 20,
  tenCoins: 10,
  fiveCoins: 5,
  oneCoins: 1,
  centavos: 0.01,
};

const denominationLabels: Record<keyof DenominationCount, string> = {
  thousand: "P1000 Bills",
  fiveHundred: "P500 Bills",
  twoHundred: "P200 Bills",
  oneHundred: "P100 Bills",
  fifty: "P50 Bills",
  twenty: "P20 Bills",
  twentyCoins: "P20 Coins",
  tenCoins: "P10 Coins",
  fiveCoins: "P5 Coins",
  oneCoins: "P1 Coins",
  centavos: "Centavos",
};

export default function CashFundModal({
  isOpen,
  onClose,
  onConfirmFund,
  allowClose = true,
}: CashFundModalProps) {
  const [step, setStep] = useState<"denomination" | "photo">("denomination");
  const [denominations, setDenominations] = useState<DenominationCount>({
    thousand: 0,
    fiveHundred: 0,
    twoHundred: 0,
    oneHundred: 0,
    fifty: 0,
    twenty: 0,
    twentyCoins: 0,
    tenCoins: 0,
    fiveCoins: 0,
    oneCoins: 0,
    centavos: 0,
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
      thousand: 0,
      fiveHundred: 0,
      twoHundred: 0,
      oneHundred: 0,
      fifty: 0,
      twenty: 0,
      twentyCoins: 0,
      tenCoins: 0,
      fiveCoins: 0,
      oneCoins: 0,
      centavos: 0,
    });
    setPhotoData(null);
    setShowCameraModal(false);
    closeKeyboard();
  };

  // Handle close
  const handleClose = () => {
    if (!allowClose) return; // Prevent closing if not allowed
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
            onClick={allowClose ? handleClose : undefined}
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                {allowClose && (
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      Cash Fund Setup
                    </h2>
                    <p className="text-blue-100 mt-1">
                      {step === "denomination"
                        ? "Enter beginning cash drawer denomination"
                        : "Confirm cash fund with photo"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-white">
                      ₱
                      {totalAmount.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-blue-100 text-sm mt-1">
                      Total Cash Fund
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - Two Column Layout */}
              <div className="flex-1 overflow-y-auto flex">
                {/* Left Column - Input Section */}
                <div className="flex-1 p-8 border-r border-gray-200 overflow-y-auto">
                  {step === "denomination" ? (
                    <div className="space-y-6">
                      {/* Bills Section */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Bills
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {(
                            [
                              "thousand",
                              "fiveHundred",
                              "twoHundred",
                              "oneHundred",
                              "fifty",
                              "twenty",
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

                      {/* Coins Section */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Coins
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {(
                            [
                              "twentyCoins",
                              "tenCoins",
                              "fiveCoins",
                              "oneCoins",
                              "centavos",
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
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Cash Fund Amount
                        </p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                          ₱
                          {totalAmount.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                          By confirming, you agree that this is the correct cash
                          amount in your drawer.
                        </p>
                      </div>

                      {!photoData && (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <span className="text-2xl">📸</span>
                          </div>
                          <p className="text-gray-600 text-center text-sm font-medium">
                            Photo will appear on the right
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column - Preview Section */}
                <div className="w-80 bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center justify-center border-l border-gray-200">
                  {photoData ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={photoData}
                          alt="Cash fund confirmation"
                          className="w-full h-64 object-cover"
                          style={{ transform: "scaleX(-1)" }}
                        />
                        <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <span>✓</span> Photo Captured
                        </div>
                      </div>
                      {step === "photo" && (
                        <Button
                          onClick={retakePhoto}
                          variant="outline"
                          className="w-full text-sm"
                        >
                          <span className="mr-2">🔄</span>
                          Retake Photo
                        </Button>
                      )}
                    </div>
                  ) : step === "photo" ? (
                    <div className="flex flex-col items-center justify-center gap-4 h-full">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-3xl">📸</span>
                      </div>
                      <p className="text-gray-600 text-center text-sm font-medium">
                        Take a photo to verify the cash amount
                      </p>
                      <Button
                        onClick={handleOpenCamera}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        <span className="mr-2">📷</span>
                        Start Camera
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xl">👀</span>
                      </div>
                      <p className="text-gray-500 text-xs">
                        Preview will appear here after photo is captured
                      </p>
                    </div>
                  )}
                </div>
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
                        className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-blue-400 rounded-lg bg-blue-50 mb-2"
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
                          className="bg-blue-500 hover:bg-blue-600 border-2 border-blue-700 rounded-lg py-3 font-bold text-lg text-white transition-colors active:scale-95"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="border-t border-gray-200 px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-end gap-4">
                {step === "denomination" ? (
                  <>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setStep("photo")}
                      disabled={totalAmount === 0}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium"
                    >
                      Proceed to Photo
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setStep("denomination")}
                      variant="outline"
                      className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      disabled={!photoData}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium"
                    >
                      Confirm & Save
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
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 bg-white hover:border-blue-300"
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
          className="w-6 h-6 rounded bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
          title="Increase"
        >
          <Plus size={14} className="text-blue-600" />
        </button>
      </div>

      <p className="text-xs text-gray-500">
        ₱{(value * count).toLocaleString("en-PH")}
      </p>
    </div>
  );
}
