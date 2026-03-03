import { useState, useEffect } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Package } from "lucide-react";
import Logo from "@/assets/PROSERVELOGO.png";
import dayjs from "dayjs";

/**
 * CustomerTransactionView - Customer-facing double screen display
 *
 * Shows the current order summary on the left side
 * and promotional ads/content on the right side
 *
 * Usage: Open this page on a second monitor facing the customer
 * Route: /food/customer-view
 */
export default function CustomerTransactionView() {
  const {
    meals,
    products,
    subTotal,
    totalDiscount,
    grandTotal,
    orderTotalDiscount,
  } = useFoodOrder();

  const allItems = [
    ...meals.map((i) => ({ ...i, itemType: "meal" as const })),
    ...products.map((i) => ({ ...i, itemType: "product" as const })),
  ];

  // Only show non-voided items
  const activeItems = allItems.filter((item) => !item.isVoid);
  const totalQty = activeItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* ========== LEFT SIDE: Order Summary ========== */}
      <div className="w-[45%] flex flex-col bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-8 brightness-0 invert" />
          </div>
          <div className="text-white text-sm opacity-80">
            {dayjs().format("MMMM DD, YYYY")}
          </div>
        </div>

        {/* Order Title */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Your Order</h2>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
            {totalQty} {totalQty === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {activeItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Package size={64} strokeWidth={1} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No items yet</p>
              <p className="text-sm mt-1">
                Items will appear here as they are added
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {activeItems.map((item, idx) => {
                const itemTotal = item.price * item.qty;
                const discount = item.itemTotalDiscount || 0;
                const finalPrice = itemTotal - discount;

                return (
                  <motion.div
                    key={item.instanceKey || `${item.id}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-b-0"
                  >
                    {/* Item Number */}
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate text-base">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-gray-500">
                          ₱{item.price.toFixed(2)} × {item.qty}
                        </span>
                        {item.customization &&
                          item.customization.length > 0 && (
                            <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                              Customized
                            </span>
                          )}
                        {discount > 0 && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            {item.discount_type === "pwd"
                              ? "PWD"
                              : item.discount_type === "sc"
                                ? "SC"
                                : "Disc"}{" "}
                            -₱{discount.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {/* Show customization details */}
                      {item.customization && item.customization.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.customization
                            .filter((c) => c.selected)
                            .map((c, cIdx) => (
                              <span
                                key={cIdx}
                                className="text-xs text-gray-400"
                              >
                                {c.label}: {c.selected?.name}
                                {(c.selected?.calculated_price ?? 0) > 0 &&
                                  ` (+₱${c.selected!.calculated_price.toFixed(2)})`}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-800 text-base">
                        ₱{finalPrice.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Totals Section */}
        <div className="border-t-2 border-gray-100 px-6 py-4 bg-gray-50/50">
          {/* Subtotal */}
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Subtotal</span>
            <span>₱{subTotal.toFixed(2)}</span>
          </div>

          {/* Item Discounts */}
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600 mb-1">
              <span>Item Discount</span>
              <span>-₱{totalDiscount.toFixed(2)}</span>
            </div>
          )}

          {/* Order Discount */}
          {orderTotalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600 mb-1">
              <span>Order Discount</span>
              <span>-₱{orderTotalDiscount.toFixed(2)}</span>
            </div>
          )}

          {/* Grand Total */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <motion.span
              key={grandTotal}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-blue-600"
            >
              ₱{grandTotal.toFixed(2)}
            </motion.span>
          </div>
        </div>
      </div>

      {/* ========== RIGHT SIDE: Ads / Content Management ========== */}
      <div className="w-[55%] flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        {/* Content Management Area - Placeholder for future CMS */}
        <AdsCarousel />
      </div>
    </div>
  );
}

/**
 * AdsCarousel - Rotating promotional content
 * This is a placeholder. In the future, connect to a CMS API
 * to fetch promo images, announcements, and videos.
 */
function AdsCarousel() {
  // Placeholder slides — replace with CMS-driven content
  const slides = [
    {
      id: 1,
      title: "Welcome!",
      subtitle: "Thank you for choosing Proserv",
      description: "Quality food and excellent service, every day.",
      bgColor: "from-blue-600 to-indigo-700",
      icon: "🍽️",
    },
    {
      id: 2,
      title: "Today's Special",
      subtitle: "Check out our featured meals",
      description: "Ask the cashier about our daily specials and combo deals!",
      bgColor: "from-orange-500 to-red-600",
      icon: "⭐",
    },
    {
      id: 3,
      title: "Loyalty Rewards",
      subtitle: "Earn points with every purchase",
      description:
        "Sign up for our loyalty program and get exclusive discounts.",
      bgColor: "from-green-500 to-emerald-600",
      icon: "🎁",
    },
    {
      id: 4,
      title: "PWD & Senior Citizen",
      subtitle: "Discount Available",
      description:
        "Present your valid ID to avail of your discount. We value our elders and persons with disability.",
      bgColor: "from-purple-500 to-violet-600",
      icon: "❤️",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, white 2px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Current Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center px-12 max-w-2xl"
        >
          {/* Icon */}
          <div className="text-7xl mb-8">{slides[currentSlide].icon}</div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-3">
            {slides[currentSlide].title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-blue-300 font-medium mb-6">
            {slides[currentSlide].subtitle}
          </p>

          {/* Description */}
          <p className="text-lg text-gray-300 leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-8 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === currentSlide
                ? "bg-white w-8"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Branding footer */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2 opacity-40">
        <img src={Logo} alt="Logo" className="h-6 brightness-0 invert" />
      </div>
    </div>
  );
}
