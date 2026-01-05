import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Coffee, ArrowLeft, LogIn, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateTimeRecordMutation } from "@/store/api/Transaction";
import { toast } from "sonner";
import {
  getBreakUntil,
  clearBreakUntil,
  getCashierSession,
  getBreakId,
} from "@/utils/cashierSession";
import CameraModal from "./CameraModal";

interface OnBreakModalProps {
  isOpen: boolean;
  onTimeIn: () => void;
  cashierName?: string;
}

export default function OnBreakModal({
  isOpen,
  onTimeIn,
  cashierName = "Cashier",
}: OnBreakModalProps) {
  const navigate = useNavigate();
  const [createTimeRecord, { isLoading: isTimingIn }] =
    useCreateTimeRecordMutation();

  // Timer state
  const [remainingTime, setRemainingTime] = useState(0);
  const [breakEndTime, setBreakEndTime] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to get branchId from localStorage
  const getBranchId = (): number => {
    try {
      const branchValue = localStorage.getItem("branch");
      if (branchValue) {
        const branchId = parseInt(branchValue, 10);
        return isNaN(branchId) ? 1 : branchId;
      }
      return 1;
    } catch {
      return 1;
    }
  };

  // Calculate remaining time directly from localStorage
  const calculateRemainingTime = (): number => {
    const breakUntil = getBreakUntil();
    if (!breakUntil) return 0;

    const breakEndMs = new Date(breakUntil).getTime();
    const now = Date.now();
    const remaining = breakEndMs - now;

    return remaining > 0 ? remaining : 0;
  };

  // Initialize and update timer
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isOpen) return;

    // Get break end time from localStorage
    const breakUntil = getBreakUntil();
    setBreakEndTime(breakUntil);

    // Calculate initial remaining time
    setRemainingTime(calculateRemainingTime());

    // Start interval to update every second
    intervalRef.current = setInterval(() => {
      const remaining = calculateRemainingTime();
      setRemainingTime(remaining);

      // Auto time-in when break is over
      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        toast.info("Break time is over!", {
          description: "Your break has ended.",
          duration: 3000,
        });
        handleTimeIn();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen]);

  // Format time to HH:MM:SS
  const formatTime = (ms: number): string => {
    if (ms <= 0) return "00:00:00";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle going back to directory
  const handleBack = () => {
    navigate("/food/main");
  };

  // Handle Time In button click - show camera first
  const handleTimeInClick = () => {
    setShowCamera(true);
  };

  // Handle camera capture - send API with image
  const handleCameraCapture = async (imageData: string) => {
    console.log("Time In photo captured:", {
      imageData: imageData ? "captured" : "none",
    });
    setShowCamera(false);
    await handleTimeIn(imageData);
  };

  // Handle time in (end break) with image
  const handleTimeIn = async (imageData?: string) => {
    const cashierSession = getCashierSession();
    if (!cashierSession) {
      toast.error("No active cashier session found");
      return;
    }

    const branchId = getBranchId();
    const breakId = getBreakId();

    console.log("Sending Time In API request:", {
      branchId,
      userId: cashierSession.cashierId,
      types: 4,
      breakId,
      hasImage: !!imageData,
    });

    try {
      // Strip data URL prefix if present (e.g., "data:image/png;base64,")
      const base64Image =
        imageData && imageData.includes("base64,")
          ? imageData.split("base64,")[1]
          : imageData;

      // Call API to update break record (type 4 = back from break) with image
      const response = await createTimeRecord({
        branchId,
        userId: cashierSession.cashierId,
        types: 4, // 4 = BACK_FROM_BREAK
        bHours: 0,
        breakId: breakId || undefined,
        img: base64Image, // Include the captured image (base64 only)
      }).unwrap();

      console.log("Time In API response:", response);

      // Clear break from localStorage
      clearBreakUntil();

      // Dispatch event to notify all components that break has ended
      window.dispatchEvent(
        new CustomEvent("breakStatusChanged", { detail: { isOnBreak: false } })
      );

      toast.success("Welcome back!", {
        description: "You have successfully timed in from your break.",
        duration: 2000,
      });

      onTimeIn();
    } catch (error: any) {
      console.error("Time In API error:", error);
      toast.error(error?.data?.message || "Failed to time in");
    }
  };

  // Format break end time for display
  const getFormattedEndTime = (): string => {
    if (!breakEndTime) return "--:--";
    const endTime = new Date(breakEndTime);
    return endTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-amber-600 to-orange-700 z-[100] flex items-center justify-center"
          >
            <div className="text-center text-white p-8">
              {/* Icon */}
              <Coffee className="w-20 h-20 mx-auto mb-4 opacity-90" />

              {/* Title */}
              <h1 className="text-3xl font-bold mb-2">On Break</h1>
              <p className="text-amber-100 mb-8">{cashierName}</p>

              {/* Timer */}
              <div className="bg-white/20 backdrop-blur rounded-2xl p-6 mb-8">
                <p className="text-amber-100 text-sm mb-2">Time Remaining</p>
                <div className="text-6xl font-mono font-bold tracking-wider">
                  {formatTime(remainingTime)}
                </div>
                <p className="text-amber-200 text-sm mt-3">
                  Break ends at {getFormattedEndTime()}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 max-w-sm mx-auto">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={handleTimeInClick}
                  disabled={isTimingIn}
                  className="flex-1 py-6 bg-white text-amber-700 hover:bg-amber-50 font-semibold"
                >
                  {isTimingIn ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Timing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Time In
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Modal for Time In */}
      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        title="Time In"
        description="Take a photo to end your break"
        badge={{
          emoji: "🟢",
          text: "Ending Break",
          color: "green",
        }}
        confirmButtonText="Confirm & Time In"
      />
    </>
  );
}
