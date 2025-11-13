import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Utensils, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function KioskHome() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const images = [
    "/kiosk/cover4.png",
    "/kiosk/cover3.png",
    "/kiosk/cover5.png",
  ];

  // Reset activity timer on any interaction
  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Auto-switch images every 7 seconds if no activity
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity >= 7000) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [lastActivity, images.length]);

  // Track user activity
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  const handleStartOrder = () => {
    navigate("/kiosk/order-type");
  };

  const handleExitApp = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const appWindow = getCurrentWindow();
      await appWindow.close();
    } catch (error) {
      console.error("Failed to close app:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Background Cover Images with Crossfade */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt="Restaurant Background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full object-cover absolute inset-0"
          />
        </AnimatePresence>
        {/* Dark Overlay for better text visibility */}
        {/* <div className="absolute inset-0 bg-black/40"></div> */}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between px-6 py-16">
        {/* Exit Button - Top Right Corner */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleExitApp}
          className="absolute top-8 right-8 w-16 h-16 bg-red-500/80 backdrop-blur-sm hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-300 group"
          title="Exit Application"
        >
          <X className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>

        {/* Top Section - Logo/Brand and Welcome */}
        <div className="flex-1 flex flex-col items-center top-center">
          {/* Logo/Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="mb-6 flex justify-center">
              {/* <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30">
                <Utensils className="w-16 h-16 text-white" />
              </div> */}
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-white mb-4 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Pro
              </span>
              <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                Pos
              </span>
            </h1>
            <p className="text-2xl lg:text-3xl text-white font-semibold drop-shadow-lg">
              Food Kiosk
            </p>
          </motion.div>

          {/* Welcome Message */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-xl">
              Welcome!
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 max-w-2xl drop-shadow-lg">
              Order your favorite meals and snacks with ease
            </p>
          </motion.div> */}
        </div>

        {/* Bottom Section - Start Order Button */}
        <div className="flex flex-col items-center">
          {/* Start Order Button */}
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartOrder}
            className="group relative px-16 py-8 bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="text-3xl lg:text-4xl font-black text-gray-800 mb-1">
                  Start Order
                </div>
                <div className="text-base lg:text-lg text-gray-500 font-medium">
                  Try the POS process
                </div>
              </div>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-10 h-10 text-green-600" />
              </motion.div>
            </div>

            {/* Pulse Animation */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-green-400 rounded-3xl -z-10 blur-xl"
            />
          </motion.button>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-6 text-center"
          >
            <p className="text-lg text-white/70 drop-shadow-lg">
              Touch anywhere to get started
            </p>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-20 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full border-4 border-white/20"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 backdrop-blur-sm rounded-full border-4 border-white/20"
      />
    </motion.div>
  );
}
