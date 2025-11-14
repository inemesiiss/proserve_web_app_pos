import { useState, useEffect } from "react";

interface DeviceSettings {
  defaultPrinter: string;
  receiptPrinter: string;
  kitchenPrinter: string;
  scanner: string;
  camera: string;
  cashDrawer: string;
  cardReader: string;
}

const DEFAULT_SETTINGS: DeviceSettings = {
  defaultPrinter: "",
  receiptPrinter: "",
  kitchenPrinter: "",
  scanner: "",
  camera: "",
  cashDrawer: "",
  cardReader: "",
};

export function useDeviceSettings() {
  const [settings, setSettings] = useState<DeviceSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem("deviceSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading device settings:", error);
    }
  };

  const saveSettings = (newSettings: DeviceSettings) => {
    try {
      localStorage.setItem("deviceSettings", JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving device settings:", error);
    }
  };

  const getSetting = (key: keyof DeviceSettings): string => {
    return settings[key] || "";
  };

  const clearSettings = () => {
    localStorage.removeItem("deviceSettings");
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    saveSettings,
    getSetting,
    clearSettings,
    loadSettings,
  };
}
