import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import BackButton from "./BackButton";
import DeviceSettingsModal from "@/components/admin/modals/DeviceSettingsModal";
import BreakModal from "./BreakModal";
import type { BreakType } from "./BreakModal";
import CameraModal from "./CameraModal";
import CashFundModal from "./CashFundModal";
import type { CashFundData } from "./CashFundModal";
import { Button } from "@/components/ui/button";
import { Settings, Coffee, UserCircle, LogOut, Moon } from "lucide-react";
import {
  isOnBreak as checkIsOnBreak,
  updateBreakUntil,
  getCashierSession,
} from "@/utils/cashierSession";
import { useCreateTimeRecordMutation } from "@/store/api/Transaction";
import { toast } from "sonner";
import EndOfDayModal from "./EndOfDayModal";

interface HeaderProps {
  headerText: string;
  to?: string; // optional, can skip if no back nav needed
  showSettings?: boolean; // controls visibility of settings button
  showBreak?: boolean; // controls visibility of break button
  showCashFund?: boolean; // controls visibility of cash fund button
  showEndOfDay?: boolean; // controls visibility of end of day button
  cashierName?: string; // cashier name to display
  onCashierLogout?: () => void; // callback when cashier clicks logout
  onBreakStart?: () => void; // callback when break starts (to show OnBreakModal)
  onEndOfDay?: () => void; // callback when end of day is confirmed
}

export default function Header({
  headerText,
  to,
  showSettings = false,
  showBreak = false,
  showCashFund = false,
  showEndOfDay = false,
  cashierName,
  onCashierLogout,
  onBreakStart,
  onEndOfDay,
}: HeaderProps) {
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showBreakCamera, setShowBreakCamera] = useState(false);
  const [showCashFundModal, setShowCashFundModal] = useState(false);
  const [selectedBreak, setSelectedBreak] = useState<BreakType | null>(null);
  const [breakType, setBreakType] = useState<"break-in" | "break-out">(
    "break-in",
  );
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [createTimeRecord] = useCreateTimeRecordMutation();
  const [showEndOfDayModal, setShowEndOfDayModal] = useState(false);

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

  // Check if cashier is on break when component mounts and listen for changes
  useEffect(() => {
    // Initial check
    setIsOnBreak(checkIsOnBreak());

    // Listen for break status changes from other components
    const handleBreakStatusChange = (
      event: CustomEvent<{ isOnBreak: boolean }>,
    ) => {
      setIsOnBreak(event.detail.isOnBreak);
    };

    window.addEventListener(
      "breakStatusChanged",
      handleBreakStatusChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "breakStatusChanged",
        handleBreakStatusChange as EventListener,
      );
    };
  }, []);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleBreakClick = () => {
    // Only allow starting breaks - ending break is done via Time In in OnBreakModal
    if (!isOnBreak) {
      // Start break - show break selection modal
      setBreakType("break-in");
      setShowBreakModal(true);
    }
  };

  const handleBreakConfirm = (breakData: BreakType) => {
    setSelectedBreak(breakData);
    setShowBreakModal(false);
    setShowBreakCamera(true);
  };

  const handleCameraCapture = async (imageData: string, type: string) => {
    // Close camera modal immediately
    setShowBreakCamera(false);

    console.log("Break photo captured:", {
      type,
      breakName: selectedBreak?.name,
      imageData: imageData ? "captured" : "none",
    });

    if (type === "break-in" && selectedBreak) {
      // Get cashier session from localStorage
      const cashierSession = getCashierSession();
      if (!cashierSession) {
        toast.error("No active cashier session found");
        return;
      }

      const branchId = getBranchId();

      try {
        // Strip data URL prefix if present (e.g., "data:image/png;base64,")
        const base64Image = imageData.includes("base64,")
          ? imageData.split("base64,")[1]
          : imageData;

        // Call API to create break record with image
        const response = await createTimeRecord({
          branchId,
          userId: cashierSession.cashierId,
          types: 3, // 3 = BREAK
          bHours: selectedBreak.durationMinutes,
          img: base64Image, // Include the captured image (base64 only)
        }).unwrap();

        console.log("Break API response:", response);

        // Get break_until and break_id from API response
        const breakUntil = response.data?.break_until || null;
        const breakId = response.data?.break_id || null;

        // Save break info to localStorage (rewrites existing values)
        updateBreakUntil(breakUntil, breakId);

        // Dispatch event to notify all components that break has started
        window.dispatchEvent(
          new CustomEvent("breakStatusChanged", {
            detail: { isOnBreak: true },
          }),
        );

        toast.success(`${selectedBreak.name} started successfully`);
        setIsOnBreak(true);

        // Notify parent component to show OnBreakModal
        if (onBreakStart) {
          onBreakStart();
        }
      } catch (error: any) {
        console.error("Break API error:", error);
        toast.error(error?.data?.message || "Failed to start break");
      }
    }
    // Note: break-out is now handled via OnBreakModal Time In button
  };

  const handleCashFundConfirm = (fundData: CashFundData) => {
    console.log("Cash fund confirmed:", fundData);
    // TODO: Save cash fund data to backend
    // You can send fundData to your API here
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 
                   flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-4">
          {to && <BackButton to={to} label="Back" />}
          <h2 className="text-2xl font-bold text-blue-700">{headerText}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Cashier name display - clickable for logout */}
          {cashierName && (
            <div className="relative">
              <button
                onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
                className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
              >
                <UserCircle size={20} className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  {cashierName}
                </span>
              </button>

              {/* Logout dropdown */}
              {showLogoutConfirm && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-[200px] z-50">
                  <p className="text-sm text-gray-600 mb-3">
                    End your cashier session?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowLogoutConfirm(false);
                        onCashierLogout?.();
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <LogOut size={14} className="mr-1" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          {showBreak && (
            <Button
              onClick={handleBreakClick}
              disabled={isOnBreak}
              className={`
                px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold
                ${
                  isOnBreak
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }
              `}
              title={isOnBreak ? "Currently on break" : "Take a Break"}
            >
              <Coffee size={18} />
              {isOnBreak ? "On Break" : "Take a Break"}
            </Button>
          )}
          {showEndOfDay && (
            <Button
              onClick={() => setShowEndOfDayModal(true)}
              className="px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold bg-orange-600 hover:bg-orange-700 text-white"
              title="End of Day"
            >
              <Moon size={18} />
              End of Day
            </Button>
          )}
          {/* {showCashFund && (
            <Button
              onClick={() => setShowCashFundModal(true)}
              className="px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              title="Cash Fund Setup"
            >
              <Wallet size={18} />
              Cash Fund
            </Button>
          )} */}
          {showSettings && (
            <Button
              onClick={() => setShowDeviceSettings(true)}
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group p-0"
              title="Device Settings"
            >
              <Settings
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            </Button>
          )}
        </div>
      </motion.header>
      {showSettings && (
        <DeviceSettingsModal
          isOpen={showDeviceSettings}
          onClose={() => setShowDeviceSettings(false)}
        />
      )}

      {showBreak && (
        <>
          <BreakModal
            isOpen={showBreakModal}
            onClose={() => setShowBreakModal(false)}
            onConfirmBreak={handleBreakConfirm}
          />

          <CameraModal
            isOpen={showBreakCamera}
            onClose={() => setShowBreakCamera(false)}
            onCapture={(imageData) => handleCameraCapture(imageData, breakType)}
            title={breakType === "break-in" ? "Break In" : "Break Out"}
            description={`${selectedBreak?.name || "Break"} - Take a photo to ${
              breakType === "break-in" ? "start" : "end"
            } your break`}
            badge={{
              emoji: breakType === "break-in" ? "🟢" : "🔴",
              text:
                breakType === "break-in" ? "Starting Break" : "Ending Break",
              color: breakType === "break-in" ? "green" : "red",
            }}
            confirmButtonText={
              breakType === "break-in"
                ? "Confirm & Start Break"
                : "Confirm & End Break"
            }
          />
        </>
      )}

      {showCashFund && (
        <CashFundModal
          isOpen={showCashFundModal}
          onClose={() => setShowCashFundModal(false)}
          onConfirmFund={handleCashFundConfirm}
        />
      )}

      {showEndOfDay && (
        <EndOfDayModal
          isOpen={showEndOfDayModal}
          onClose={() => setShowEndOfDayModal(false)}
          onConfirm={() => {
            setShowEndOfDayModal(false);
            if (onEndOfDay) onEndOfDay();
          }}
        />
      )}
    </>
  );
}
