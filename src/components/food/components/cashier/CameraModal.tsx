import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
  title: string;
  description: string;
  badge: {
    emoji: string;
    text: string;
    color: "blue" | "green" | "red" | "purple";
  };
  confirmButtonText?: string;
}

export default function CameraModal({
  isOpen,
  onClose,
  onCapture,
  title,
  description,
  badge,
  confirmButtonText = "Confirm & Continue",
}: CameraModalProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const badgeColors = {
    blue: "bg-blue-600/90",
    green: "bg-green-600/90",
    red: "bg-red-600/90",
    purple: "bg-purple-600/90",
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
      onClose();
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    stopCamera();
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
            className="fixed inset-0 bg-black/70 z-[200] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              {/* Header */}
              <div
                className={`relative bg-gradient-to-r ${
                  badge.color === "blue"
                    ? "from-blue-600 to-blue-700"
                    : badge.color === "green"
                    ? "from-green-600 to-green-700"
                    : badge.color === "red"
                    ? "from-red-600 to-red-700"
                    : "from-purple-600 to-purple-700"
                } px-8 py-6`}
              >
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-white/90 mt-1">{description}</p>
              </div>

              {/* Camera/Photo Display */}
              <div className="p-6">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                  {capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                      style={{ transform: "scaleX(-1)" }}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: "scaleX(-1)" }}
                    />
                  )}

                  {/* Overlay Grid */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-white/20 grid grid-cols-3 grid-rows-3">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white/10" />
                      ))}
                    </div>
                  </div>

                  {/* Badge */}
                  <div
                    className={`absolute top-4 left-4 ${
                      badgeColors[badge.color]
                    }/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold`}
                  >
                    {badge.emoji}{" "}
                    {capturedImage ? "✓ Photo Captured" : badge.text}
                  </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-6 bg-gray-50 flex items-center justify-center gap-3">
                {!capturedImage ? (
                  <Button
                    onClick={capturePhoto}
                    className={`px-8 py-3 text-white rounded-full flex items-center gap-2 text-lg font-semibold ${
                      badge.color === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : badge.color === "green"
                        ? "bg-green-600 hover:bg-green-700"
                        : badge.color === "red"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={retakePhoto}
                      variant="outline"
                      className="px-6 py-2 bg-white hover:bg-gray-100 text-gray-700 border-gray-300 flex items-center gap-2"
                    >
                      <RotateCw className="w-4 h-4" />
                      Retake
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className={`px-8 py-2 text-white ${
                        badge.color === "blue"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : badge.color === "green"
                          ? "bg-green-600 hover:bg-green-700"
                          : badge.color === "red"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      {confirmButtonText}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
