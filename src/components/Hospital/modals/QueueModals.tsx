// src/components/Hospital/modals/QueueModal.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { printQueueTicket } from "@/function/prinQue";

interface QueueModalProps {
  serviceName: string;
  doctorName?: string;
  onClose: () => void;
}

export default function QueueModal({
  serviceName,
  doctorName,
  onClose,
}: QueueModalProps) {
  const [queueNumber, setQueueNumber] = useState<string | null>(null);

  useEffect(() => {
    // Generate a random 3-digit queue number
    const randomNum = Math.floor(100 + Math.random() * 900);
    const numStr = randomNum.toString();
    setQueueNumber(numStr);

    // Auto print once generated
    printQueueTicket(numStr);

    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [serviceName, doctorName, onClose]);

  return (
    <AnimatePresence>
      {queueNumber && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center relative"
          >
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              Your Queue Number
            </h2>

            <p className="text-gray-600 mb-2">
              Service: <span className="font-semibold">{serviceName}</span>
            </p>

            {doctorName && (
              <p className="text-gray-600 mb-4">
                Doctor: <span className="font-semibold">{doctorName}</span>
              </p>
            )}

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-3xl text-green-600 mb-2"
            >
              ⬇
            </motion.div>

            <p className="text-6xl font-extrabold text-blue-700 mb-6">
              {queueNumber}
            </p>

            <Button onClick={onClose}>Close</Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
