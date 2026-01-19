import { useState, useEffect, useCallback } from "react";

interface DeviceSettings {
  defaultPrinter: string;
  receiptPrinter: string;
  receiptPrinterSize: 57 | 88;
  kitchenPrinter: string;
  scanner: string;
  camera: string;
  cashDrawer: string;
  cardReader: string;
}

const DEFAULT_SETTINGS: DeviceSettings = {
  defaultPrinter: "",
  receiptPrinter: "",
  receiptPrinterSize: 57,
  kitchenPrinter: "",
  scanner: "",
  camera: "",
  cashDrawer: "",
  cardReader: "",
};

// Custom event name for cross-component communication within the same tab
const DEVICE_SETTINGS_UPDATED_EVENT = "deviceSettingsUpdated";

export function useDeviceSettings() {
  const [settings, setSettings] = useState<DeviceSettings>(() => {
    // Initialize from localStorage immediately to avoid flash of default values
    try {
      const savedSettings = localStorage.getItem("deviceSettings");
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error("Error loading initial device settings:", error);
    }
    return DEFAULT_SETTINGS;
  });

  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem("deviceSettings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        console.log("📦 [useDeviceSettings] Loading settings:", parsed);
        setSettings(parsed);
      }
    } catch (error) {
      console.error("Error loading device settings:", error);
    }
  }, []);

  useEffect(() => {
    // Load settings on mount
    loadSettings();

    // Listen for storage events (changes from other tabs/windows)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "deviceSettings" && event.newValue) {
        console.log(
          "🔄 [useDeviceSettings] Storage event detected, reloading settings..."
        );
        try {
          setSettings(JSON.parse(event.newValue));
        } catch (error) {
          console.error("Error parsing storage event data:", error);
        }
      }
    };

    // Listen for custom event (changes from same tab)
    const handleCustomEvent = () => {
      console.log(
        "🔄 [useDeviceSettings] Custom event detected, reloading settings..."
      );
      loadSettings();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(DEVICE_SETTINGS_UPDATED_EVENT, handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        DEVICE_SETTINGS_UPDATED_EVENT,
        handleCustomEvent
      );
    };
  }, [loadSettings]);

  const saveSettings = (newSettings: DeviceSettings) => {
    try {
      localStorage.setItem("deviceSettings", JSON.stringify(newSettings));
      setSettings(newSettings);
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new CustomEvent(DEVICE_SETTINGS_UPDATED_EVENT));
      console.log("💾 [useDeviceSettings] Settings saved and event dispatched");
    } catch (error) {
      console.error("Error saving device settings:", error);
    }
  };

  const getSetting = (key: keyof DeviceSettings): string | number => {
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
