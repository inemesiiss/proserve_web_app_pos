import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, X } from "lucide-react";

interface SecurityPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctCode?: string;
  textMessage?: string;
  digitCount?: number;
}

export default function SecurityPasscodeModal({
  isOpen,
  onClose,
  onSuccess,
  correctCode = "123456",
  textMessage = "Please enter your passcode to continue.",
  digitCount = 6,
}: SecurityPasscodeModalProps) {
  const [passcode, setPasscode] = useState<string[]>([]);
  const [showDigits, setShowDigits] = useState(false);
  const [error, setError] = useState(false);

  const handleKeyPress = (key: string) => {
    if (passcode.length >= digitCount) return;
    setPasscode([...passcode, key]);
  };

  const handleDelete = () => setPasscode(passcode.slice(0, -1));
  const handleReset = () => {
    setPasscode([]);
    setError(false);
  };

  const handleConfirm = () => {
    if (passcode.join("") === correctCode) {
      setError(false);
      onSuccess();
      onClose();
      setPasscode([]);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
      setPasscode([]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-10 w-[380px] flex flex-col items-center space-y-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-center text-gray-700 leading-snug">
              {textMessage}
            </h2>

            <motion.div
              animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center mt-4"
            >
              <div className="flex justify-center space-x-2">
                {[...Array(digitCount)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center text-lg font-semibold ${
                      error
                        ? "border-red-500 text-red-500"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {showDigits
                      ? passcode[idx] || ""
                      : passcode[idx]
                      ? "•"
                      : ""}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowDigits(!showDigits)}
                className="mt-3 text-gray-500 hover:text-gray-700"
              >
                {showDigits ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 mt-6 w-full">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "←"].map(
                (key) => (
                  <Button
                    key={key}
                    onClick={() =>
                      key === "←" ? handleDelete() : handleKeyPress(key)
                    }
                    className="h-12 text-lg font-semibold rounded-xl shadow-sm hover:bg-gray-200"
                    variant="outline"
                  >
                    {key}
                  </Button>
                )
              )}
            </div>

            <div className="flex justify-between w-full mt-6">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
