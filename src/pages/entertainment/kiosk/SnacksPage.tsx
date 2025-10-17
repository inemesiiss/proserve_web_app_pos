"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useOrder } from "@/context/entertainment/OrderProvider";
import Header from "@/components/entertainment/components/Header";
// import OrderSummary from "@/components/entertainment/components/OrderSummary";

// interface SnacksPageProps {
//   onBack: () => void;
// }

export default function SnacksPage() {
  const snacks = [
    { id: 1, name: "Popcorn Meal", price: 120, image: "/food/popcorn.png" },
    { id: 2, name: "Hotdog Meal", price: 150, image: "/food/hotdog.png" },
    { id: 3, name: "Burger Meal", price: 180, image: "/food/burger.png" },
  ];

  const { addItem } = useOrder();
  const [selectedSize, setSelectedSize] = useState<Record<number, string>>({});

  const handleAdd = (snack: any) => {
    addItem({
      id: `snack-${snack.id}`,
      name: snack.name,
      qty: 1,
      price: snack.price,
      size: selectedSize[snack.id] || "Regular",
      type: "snack",
      image: snack.image,
    });
  };

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🔙 Back Button */}
      <Header headerText="🍿 Choose a Snack" to="/cinema" />
      {/* 🧃 Title */}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 🍔 Left: Snack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {snacks.map((snack, index) => (
            <motion.div
              key={snack.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition-all p-4 flex flex-col items-center justify-between text-center h-[320px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* 🖼 Snack Image */}
              <img
                src={snack.image}
                alt={snack.name}
                className="w-24 h-24 object-cover rounded-full mb-3 border border-gray-300"
              />

              {/* 🧾 Snack Info */}
              <div>
                <div className="text-lg font-bold text-gray-800 mb-1">
                  {snack.name}
                </div>
                <div className="text-gray-600 mb-3">₱{snack.price}.00</div>

                <select
                  className="border rounded-lg w-full p-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500"
                  value={selectedSize[snack.id] || "Regular"}
                  onChange={(e) =>
                    setSelectedSize({
                      ...selectedSize,
                      [snack.id]: e.target.value,
                    })
                  }
                >
                  <option>Regular</option>
                  <option>Large</option>
                </select>
              </div>

              <Button
                onClick={() => handleAdd(snack)}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Add to Cart
              </Button>
            </motion.div>
          ))}
        </div>

        {/* 🧾 Right: Shared Order Summary */}

        {/* <OrderSummary /> */}
      </div>
    </motion.div>
  );
}
