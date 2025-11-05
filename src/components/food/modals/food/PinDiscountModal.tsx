import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface PinModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PinModal({ onConfirm, onCancel }: PinModalProps) {
  const [pinDigits, setPinDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only digits

    const newPin = [...pinDigits];
    newPin[index] = value;
    setPinDigits(newPin);

    // Auto-focus next input
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const pin = pinDigits.join("");
    if (pin === "123456") {
      onConfirm();
    } else {
      alert("Incorrect PIN!");
      setPinDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[350px] text-center">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Enter 6-Digit PIN
        </h3>

        {/* PIN Boxes */}
        <div className="flex justify-center gap-3 mb-6">
          {pinDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-semibold focus:border-blue-500 focus:outline-none transition-all"
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white text-base px-5 py-2 rounded-lg"
          >
            Confirm
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="text-base px-5 py-2 rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
