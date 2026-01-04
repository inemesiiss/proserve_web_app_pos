import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Coffee, Clock, ArrowLeft, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateTimeRecordMutation } from "@/store/api/Transaction";
import { toast } from "sonner";
import {
  getBreakUntil,
  getBreakRemainingTime,
  clearBreakUntil,
  getCashierSession,
} from "@/utils/cashierSession";

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

  // Break timer state
  const [remainingTime, setRemainingTime] = useState(0);
  const [breakEndTime, setBreakEndTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);

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

  // Initialize break times
  useEffect(() => {
    if (isOpen) {
      const breakUntil = getBreakUntil();
      if (breakUntil) {
        const endTime = new Date(breakUntil);
        setBreakEndTime(endTime);

        // Estimate start time based on remaining time (we'll need to store this properly)
        // For now, calculate based on what we have
        const remaining = getBreakRemainingTime();
        setRemainingTime(remaining);

        // Store break start time for elapsed calculation
        const startTime = new Date();
        setBreakStartTime(startTime);
      }
    }
  }, [isOpen]);

  // Update timer every second
  useEffect(() => {
    if (!isOpen || !breakEndTime) return;

    const interval = setInterval(() => {
      const remaining = getBreakRemainingTime();
      setRemainingTime(remaining);

      // Calculate elapsed time
      if (breakStartTime) {
        const elapsed = Date.now() - breakStartTime.getTime();
        setElapsedTime(elapsed);
      }

      // Auto time-in when break is over
      if (remaining <= 0) {
        clearInterval(interval);
        toast.info("Break time is over!", {
          description: "Your break has ended. Returning to work.",
          duration: 3000,
        });
        handleTimeIn();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, breakEndTime, breakStartTime]);

  // Format time to HH:MM:SS
  const formatTime = useCallback((ms: number): string => {
    if (ms <= 0) return "00:00:00";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Handle going back to directory
  const handleBack = () => {
    navigate("/food/main");
  };

  // Handle time in (end break)
  const handleTimeIn = async () => {
    const cashierSession = getCashierSession();
    if (!cashierSession) {
      toast.error("No active cashier session found");
      return;
    }

    const branchId = getBranchId();

    try {
      // Call API to create time-in record (type 4 = TIME_IN from break)
      await createTimeRecord({
        branchId,
        userId: cashierSession.cashierId,
        types: 4, // 4 = TIME_IN (back from break)
        bHours: 0,
      }).unwrap();

      // Clear break from localStorage
      clearBreakUntil();

      toast.success("Welcome back!", {
        description: "You have successfully timed in from your break.",
        duration: 2000,
      });

      onTimeIn();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to time in");
    }
  };

  // Calculate progress percentage (for visual indicator)
  const getProgressPercentage = (): number => {
    if (!breakEndTime || remainingTime <= 0) return 100;
    // This would need the original break duration to calculate properly
    // For now, just show based on remaining time
    return Math.min(100, (elapsedTime / (elapsedTime + remainingTime)) * 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full screen backdrop - no close on click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 z-[100]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-[101] p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 rounded-full p-4">
                    <Coffee className="w-12 h-12" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-1">You're On Break</h2>
                <p className="text-white/80 text-sm">
                  Take your time and relax, {cashierName}
                </p>
              </div>

              {/* Timer Section */}
              <div className="p-8">
                {/* Remaining Time */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Time Remaining</span>
                  </div>
                  <div className="text-5xl font-bold text-gray-800 font-mono tracking-wider">
                    {formatTime(remainingTime)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage()}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Break Started</span>
                    <span>Break Ends</span>
                  </div>
                </div>

                {/* Break End Time */}
                {breakEndTime && (
                  <div className="text-center mb-8 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Break ends at</p>
                    <p className="text-xl font-semibold text-gray-700">
                      {breakEndTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                )}

                {/* Elapsed Time */}
                <div className="text-center mb-8">
                  <p className="text-sm text-gray-500">
                    Elapsed:{" "}
                    <span className="font-medium">
                      {formatTime(elapsedTime)}
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 py-6 text-lg font-semibold border-2 hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Directory
                  </Button>

                  <Button
                    onClick={handleTimeIn}
                    disabled={isTimingIn}
                    className="flex-1 py-6 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    {isTimingIn ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
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

                {/* Info Text */}
                <p className="text-center text-xs text-gray-400 mt-6">
                  You can only access the system after your break ends or you
                  time in early.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
