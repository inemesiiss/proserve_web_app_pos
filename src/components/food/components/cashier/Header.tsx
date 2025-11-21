import { motion } from "framer-motion";
import { useState } from "react";
import BackButton from "./BackButton";
import DeviceSettingsModal from "@/components/admin/modals/DeviceSettingsModal";
import BreakModal from "./BreakModal";
import type { BreakType } from "./BreakModal";
import CameraModal from "./CameraModal";
import CashFundModal from "./CashFundModal";
import type { CashFundData } from "./CashFundModal";
import { Button } from "@/components/ui/button";
import { Settings, Coffee, Wallet } from "lucide-react";

interface HeaderProps {
  headerText: string;
  to?: string; // optional, can skip if no back nav needed
  showSettings?: boolean; // controls visibility of settings button
  showBreak?: boolean; // controls visibility of break button
  showCashFund?: boolean; // controls visibility of cash fund button
}

export default function Header({
  headerText,
  to,
  showSettings = false,
  showBreak = false,
  showCashFund = false,
}: HeaderProps) {
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showBreakCamera, setShowBreakCamera] = useState(false);
  const [showCashFundModal, setShowCashFundModal] = useState(false);
  const [selectedBreak, setSelectedBreak] = useState<BreakType | null>(null);
  const [breakType, setBreakType] = useState<"break-in" | "break-out">(
    "break-in"
  );
  const [isOnBreak, setIsOnBreak] = useState(false);

  const handleBreakClick = () => {
    if (isOnBreak) {
      // End break - go directly to camera
      setBreakType("break-out");
      setShowBreakCamera(true);
    } else {
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

  const handleCameraCapture = (imageData: string, type: string) => {
    console.log("Break photo captured:", {
      type,
      breakName: selectedBreak?.name,
      imageData,
    });

    if (type === "break-in") {
      setIsOnBreak(true);
      // Here you can save break start data to backend
    } else {
      setIsOnBreak(false);
      setSelectedBreak(null);
      // Here you can save break end data to backend
    }
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
          {showBreak && (
            <Button
              onClick={handleBreakClick}
              className={`
                px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold
                ${
                  isOnBreak
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }
              `}
              title={isOnBreak ? "End Break" : "Take a Break"}
            >
              <Coffee size={18} />
              {isOnBreak ? "End Break" : "Take a Break"}
            </Button>
          )}
          {showCashFund && (
            <Button
              onClick={() => setShowCashFundModal(true)}
              className="px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              title="Cash Fund Setup"
            >
              <Wallet size={18} />
              Cash Fund
            </Button>
          )}
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
    </>
  );
}
