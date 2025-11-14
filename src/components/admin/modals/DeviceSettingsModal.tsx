import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Printer,
  Camera,
  Scan,
  Usb,
  Check,
  RefreshCw,
  Save,
} from "lucide-react";

interface DeviceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DeviceSettings {
  defaultPrinter: string;
  receiptPrinter: string;
  kitchenPrinter: string;
  scanner: string;
  camera: string;
  cashDrawer: string;
  cardReader: string;
}

export default function DeviceSettingsModal({
  isOpen,
  onClose,
}: DeviceSettingsModalProps) {
  const [settings, setSettings] = useState<DeviceSettings>({
    defaultPrinter: "",
    receiptPrinter: "",
    kitchenPrinter: "",
    scanner: "",
    camera: "",
    cashDrawer: "",
    cardReader: "",
  });

  const [availableDevices, setAvailableDevices] = useState({
    printers: [] as string[],
    scanners: [] as string[],
    cameras: [] as string[],
    usbDevices: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("deviceSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    loadAvailableDevices();
  }, []);

  const loadAvailableDevices = async () => {
    setIsLoading(true);
    try {
      // Simulate device detection - In real implementation, you'd use native APIs or Tauri commands
      setTimeout(() => {
        setAvailableDevices({
          printers: [
            "Default Printer",
            "HP LaserJet Pro M404dn",
            "Epson TM-T88VI Receipt Printer",
            "Star TSP143III",
            "Brother QL-820NWB",
          ],
          scanners: [
            "Default Scanner",
            "Epson Perfection V600",
            "Canon CanoScan LiDE 400",
            "Honeywell Barcode Scanner",
          ],
          cameras: [
            "Default Camera",
            "Integrated Webcam",
            "Logitech C920",
            "USB Camera",
          ],
          usbDevices: [
            "Cash Drawer Port 1",
            "Cash Drawer Port 2",
            "Card Reader USB 1",
            "Card Reader USB 2",
          ],
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading devices:", error);
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem("deviceSettings", JSON.stringify(settings));

    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      // Hide success message after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    }, 500);
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleTestPrint = (printerName: string) => {
    if (!printerName) {
      alert("Please select a printer first");
      return;
    }
    // In real implementation, trigger test print
    alert(`Test print sent to: ${printerName}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-[800px] max-h-[85vh] flex flex-col relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Device Settings
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configure hardware devices for your POS system
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isSaving}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Refresh Button */}
              <div className="flex justify-end">
                <Button
                  onClick={loadAvailableDevices}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw
                    size={16}
                    className={isLoading ? "animate-spin" : ""}
                  />
                  {isLoading ? "Detecting..." : "Refresh Devices"}
                </Button>
              </div>

              {/* Printer Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <Printer size={20} className="text-blue-600" />
                  <span>Printers</span>
                </div>

                <div className="grid grid-cols-1 gap-4 pl-7">
                  {/* Default Printer */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Default Printer
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={settings.defaultPrinter}
                        onValueChange={(value) =>
                          setSettings({ ...settings, defaultPrinter: value })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select default printer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {availableDevices.printers.map((printer) => (
                              <SelectItem key={printer} value={printer}>
                                {printer}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestPrint(settings.defaultPrinter)}
                      >
                        Test
                      </Button>
                    </div>
                  </div>

                  {/* Receipt Printer */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Receipt Printer
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={settings.receiptPrinter}
                        onValueChange={(value) =>
                          setSettings({ ...settings, receiptPrinter: value })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select receipt printer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {availableDevices.printers.map((printer) => (
                              <SelectItem key={printer} value={printer}>
                                {printer}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestPrint(settings.receiptPrinter)}
                      >
                        Test
                      </Button>
                    </div>
                  </div>

                  {/* Kitchen Printer */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Kitchen Printer
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={settings.kitchenPrinter}
                        onValueChange={(value) =>
                          setSettings({ ...settings, kitchenPrinter: value })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select kitchen printer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {availableDevices.printers.map((printer) => (
                              <SelectItem key={printer} value={printer}>
                                {printer}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestPrint(settings.kitchenPrinter)}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scanner Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <Scan size={20} className="text-green-600" />
                  <span>Scanner / Barcode Reader</span>
                </div>

                <div className="space-y-2 pl-7">
                  <Label className="text-sm font-medium text-gray-700">
                    Default Scanner
                  </Label>
                  <Select
                    value={settings.scanner}
                    onValueChange={(value) =>
                      setSettings({ ...settings, scanner: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scanner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {availableDevices.scanners.map((scanner) => (
                          <SelectItem key={scanner} value={scanner}>
                            {scanner}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Camera Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <Camera size={20} className="text-purple-600" />
                  <span>Camera</span>
                </div>

                <div className="space-y-2 pl-7">
                  <Label className="text-sm font-medium text-gray-700">
                    Default Camera
                  </Label>
                  <Select
                    value={settings.camera}
                    onValueChange={(value) =>
                      setSettings({ ...settings, camera: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {availableDevices.cameras.map((camera) => (
                          <SelectItem key={camera} value={camera}>
                            {camera}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* USB Devices */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <Usb size={20} className="text-orange-600" />
                  <span>USB Devices</span>
                </div>

                <div className="grid grid-cols-1 gap-4 pl-7">
                  {/* Cash Drawer */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Cash Drawer
                    </Label>
                    <Select
                      value={settings.cashDrawer}
                      onValueChange={(value) =>
                        setSettings({ ...settings, cashDrawer: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cash drawer port" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availableDevices.usbDevices
                            .filter((d) => d.includes("Cash"))
                            .map((device) => (
                              <SelectItem key={device} value={device}>
                                {device}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Card Reader */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Card Reader
                    </Label>
                    <Select
                      value={settings.cardReader}
                      onValueChange={(value) =>
                        setSettings({ ...settings, cardReader: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select card reader" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availableDevices.usbDevices
                            .filter((d) => d.includes("Card"))
                            .map((device) => (
                              <SelectItem key={device} value={device}>
                                {device}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <Check size={18} />
                    <span className="text-sm font-medium">
                      Settings saved successfully!
                    </span>
                  </motion.div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
