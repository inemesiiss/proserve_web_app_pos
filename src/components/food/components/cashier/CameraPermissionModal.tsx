import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
  badge: {
    emoji: string;
    text: string;
    color: "blue" | "green" | "red" | "purple";
  };
}

export default function CameraPermissionModal({
  isOpen,
  onAllow,
  onDeny,
  badge,
}: CameraPermissionModalProps) {
  const badgeColors = {
    blue: "from-blue-600 to-blue-700",
    green: "from-green-600 to-green-700",
    red: "from-red-600 to-red-700",
    purple: "from-purple-600 to-purple-700",
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
            className="fixed inset-0 bg-black/50 z-[300] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div
                className={`relative bg-gradient-to-r ${
                  badgeColors[badge.color]
                } px-6 py-8`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white text-center">
                  Camera Permission
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">
                      Camera Access Required
                    </p>
                    <p className="text-blue-800 text-xs mt-1">
                      {badge.text} needs access to your camera to take photos.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        If you allow:
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        You'll be able to capture photos for{" "}
                        {badge.text.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        If you deny:
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        You won't be able to use the camera feature. You can
                        change this in your browser settings later.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 text-center">
                    This app uses your camera only for capturing photos in this
                    session. We don't save or transmit camera access to any
                    external server.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-6 bg-gray-50 flex items-center justify-center gap-3">
                <Button
                  onClick={onDeny}
                  variant="outline"
                  className="flex-1 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                >
                  Deny
                </Button>
                <Button
                  onClick={onAllow}
                  className={`flex-1 px-4 py-2 text-white ${
                    badge.color === "blue"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : badge.color === "green"
                      ? "bg-green-600 hover:bg-green-700"
                      : badge.color === "red"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  Allow Camera
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
