import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Utensils, Coffee, Timer, Waves, Target, Users } from "lucide-react";

interface BreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBreak: (breakType: BreakType) => void;
}

export type BreakType = {
  id: string;
  name: string;
  duration: string;
  durationMinutes: number; // actual minutes for API
  description: string;
  icon: React.ReactNode;
};

const breakTypes: BreakType[] = [
  {
    id: "1_hour",
    name: "1 Hour Break",
    duration: "60 min",
    durationMinutes: 60,
    description:
      "A standard 60-minute lunch break to grab a meal and recharge.",
    icon: <Utensils className="w-8 h-8" />,
  },
  {
    id: "30_minutes",
    name: "30 Minutes Break",
    duration: "30 min",
    durationMinutes: 30,
    description:
      "A quick 30-minute break for a coffee, stretch, or a mental reset.",
    icon: <Coffee className="w-8 h-8" />,
  },
  {
    id: "15_minutes",
    name: "15 Minutes Break",
    duration: "15 min",
    durationMinutes: 15,
    description:
      "A brief 15-minute personal break as needed during your shift.",
    icon: <Timer className="w-8 h-8" />,
  },
  {
    id: "restroom",
    name: "Restroom Break",
    duration: "45 min",
    durationMinutes: 45,
    description:
      "An extended 45-minute break, for more complex tasks or personal appointments.",
    icon: <Waves className="w-8 h-8" />,
  },
  {
    id: "coaching",
    name: "Coaching",
    duration: "20 min",
    durationMinutes: 20,
    description:
      "A 20-minute break specifically for administrative tasks or urgent calls.",
    icon: <Target className="w-8 h-8" />,
  },
  {
    id: "meeting",
    name: "Meeting Break",
    duration: "10 min",
    durationMinutes: 10,
    description:
      "A brief 10-minute break to prepare for an upcoming team meeting or briefing.",
    icon: <Users className="w-8 h-8" />,
  },
];

export default function BreakModal({
  isOpen,
  onClose,
  onConfirmBreak,
}: BreakModalProps) {
  const [selectedBreak, setSelectedBreak] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedBreak) return;

    const breakType = breakTypes.find((b) => b.id === selectedBreak);
    if (!breakType) return;

    // Just pass the selected break type to the parent (Header)
    // API call will be made in Header after camera capture
    onConfirmBreak(breakType);
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
            onClick={onClose}
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold text-white">
                  Select Your Break
                </h2>
                <p className="text-blue-100 mt-1">
                  Please choose a break type.
                </p>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {breakTypes.map((breakType) => (
                    <motion.div
                      key={breakType.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBreak(breakType.id)}
                      className={`
                        relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200
                        ${
                          selectedBreak === breakType.id
                            ? "border-blue-600 bg-blue-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                        }
                      `}
                    >
                      {/* Checkbox */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={`
                          w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                          ${
                            selectedBreak === breakType.id
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 bg-white"
                          }
                        `}
                        >
                          {selectedBreak === breakType.id && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Icon */}
                      <div
                        className={`
                        mb-4 text-blue-600
                        ${selectedBreak === breakType.id ? "text-blue-700" : ""}
                      `}
                      >
                        {breakType.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {breakType.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {breakType.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 flex items-center justify-end gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="px-6 py-2 bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedBreak}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                >
                  Confirm Break
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
