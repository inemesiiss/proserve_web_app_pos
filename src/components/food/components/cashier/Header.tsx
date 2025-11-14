import { motion } from "framer-motion";
import { useState } from "react";
import BackButton from "./BackButton";
import DeviceSettingsModal from "@/components/admin/modals/DeviceSettingsModal";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface HeaderProps {
  headerText: string;
  to?: string; // optional, can skip if no back nav needed
  showSettings?: boolean; // controls visibility of settings button
}

export default function Header({
  headerText,
  to,
  showSettings = false,
}: HeaderProps) {
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);

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
    </>
  );
}
