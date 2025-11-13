import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, ShoppingBag } from "lucide-react";

export default function OrderTypeSelection() {
  const navigate = useNavigate();

  const handleOrderType = (type: "dine-in" | "takeout") => {
    // You can store the order type in context or localStorage if needed
    localStorage.setItem("orderType", type);
    navigate("/kiosk/menu");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-8"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl lg:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Order Type
            </span>
          </h1>
          <p className="text-2xl text-gray-600 font-medium">
            How would you like to enjoy your meal?
          </p>
        </motion.div>

        {/* Order Type Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Dine In Button */}
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOrderType("dine-in")}
            className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl overflow-hidden p-12 lg:p-16 hover:shadow-blue-500/50 transition-all duration-300"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-white">
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-40 h-40 lg:w-48 lg:h-48 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300"
              >
                <UtensilsCrossed
                  className="w-24 h-24 lg:w-28 lg:h-28"
                  strokeWidth={2.5}
                />
              </motion.div>

              {/* Text */}
              <h2 className="text-5xl lg:text-6xl font-black mb-4 group-hover:scale-110 transition-transform duration-300">
                DINE IN
              </h2>
              <p className="text-xl lg:text-2xl text-blue-100 font-medium text-center max-w-md">
                Enjoy your meal at our comfortable dining area
              </p>

              {/* Decorative Elements */}
              <div className="mt-8 flex gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-75" />
                <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-150" />
              </div>
            </div>

            {/* Shine Effect */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              whileHover={{ x: "100%", opacity: 0.3 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </motion.button>

          {/* Takeout Button */}
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOrderType("takeout")}
            className="group relative bg-gradient-to-br from-green-500 to-green-700 rounded-3xl shadow-2xl overflow-hidden p-12 lg:p-16 hover:shadow-green-500/50 transition-all duration-300"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-white">
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-40 h-40 lg:w-48 lg:h-48 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300"
              >
                <ShoppingBag
                  className="w-24 h-24 lg:w-28 lg:h-28"
                  strokeWidth={2.5}
                />
              </motion.div>

              {/* Text */}
              <h2 className="text-5xl lg:text-6xl font-black mb-4 group-hover:scale-110 transition-transform duration-300">
                TAKEOUT
              </h2>
              <p className="text-xl lg:text-2xl text-green-100 font-medium text-center max-w-md">
                Take your order to go and enjoy anywhere
              </p>

              {/* Decorative Elements */}
              <div className="mt-8 flex gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-75" />
                <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-150" />
              </div>
            </div>

            {/* Shine Effect */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              whileHover={{ x: "100%", opacity: 0.3 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </motion.button>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-lg">
            Select your preferred dining option to continue
          </p>
        </motion.div>
      </div>

      {/* Logo Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8"
      >
        <img
          src="/PROSERVERLOGO.png"
          alt="Proserv Logo"
          className="h-16 object-contain opacity-40"
        />
      </motion.div>
    </motion.div>
  );
}
