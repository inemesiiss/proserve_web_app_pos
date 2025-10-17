import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Meh, Frown } from "lucide-react";
import Header from "@/components/entertainment/components/Header";

export default function SurveyPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index: number) => setSelected(index);
  const handleSubmit = () => {
    if (selected !== null) setSubmitted(true);
  };

  const icons = [
    { icon: <Frown className="text-red-500" size={40} />, label: "Poor" },
    { icon: <Meh className="text-yellow-500" size={40} />, label: "Okay" },
    { icon: <Smile className="text-green-500" size={40} />, label: "Great" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 relative">
      {/* ✅ Back Button */}

      <Header headerText="🍿 Rate Our Service" to="/cinema" />

      {/* Header */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Rate Our Service
      </h2>

      {/* Question */}
      <p className="text-gray-600 text-lg mb-10 text-center">
        How was your experience today?
      </p>

      {/* Smiley Ratings */}
      <div className="flex gap-10 mb-10">
        {icons.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(i)}
            className={`cursor-pointer flex flex-col items-center justify-center 
              p-6 rounded-2xl shadow-md transition-all ${
                selected === i
                  ? "bg-blue-100 scale-110 border border-blue-400"
                  : "bg-white hover:bg-gray-50"
              }`}
          >
            {item.icon}
            <p
              className={`mt-2 text-base font-medium ${
                selected === i ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ⭐ Star Rating */}
      <div className="flex gap-2 mb-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(i + 3)} // different index from emoji rating
            className={`cursor-pointer text-yellow-400 ${
              selected === i + 3 ? "scale-110" : "opacity-70"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={selected === i + 3 ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.91c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.978-2.89a1 1 0 00-1.175 0l-3.978 2.89c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.977-2.89c-.783-.57-.38-1.81.588-1.81h4.91a1 1 0 00.95-.69l1.519-4.674z"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Submit */}
      {!submitted ? (
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-10 py-5 rounded-xl shadow-md transition-transform hover:scale-105"
        >
          Submit Feedback
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-green-600 text-xl font-semibold">
            🎉 Thank you for your feedback!
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Your opinion helps us improve.
          </p>
        </motion.div>
      )}
    </div>
  );
}
