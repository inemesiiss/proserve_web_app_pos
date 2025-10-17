import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const industries = [
  {
    id: "food",
    name: "Retail",
    image: "/services/food.png",
    bg: "from-green-700 to-green-500", // darker shade
  },
  {
    id: "cinema",
    name: "Entertainment",
    image: "/services/cinema.png",
    bg: "from-blue-700 to-blue-500",
  },
  {
    id: "indoor",
    name: "Indoor Amusement",
    image: "/services/indoor.png",
    bg: "from-yellow-700 to-yellow-500",
  },
];

export default function IndustrySelection() {
  const navigate = useNavigate();

  const handleClick = (industryId: string) => {
    navigate(`/${industryId}`);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <motion.div
        className="w-full max-w-5xl text-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-bold text-blue-800 mb-10 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Choose Type of Industry
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClick(industry.id)}
              className="cursor-pointer"
            >
              <Card
                className={`w-72 h-48 bg-gradient-to-br ${industry.bg} shadow-md hover:shadow-xl transition-all rounded-2xl border border-gray-300`}
              >
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <motion.img
                    src={industry.image}
                    alt={industry.name}
                    className="w-30 h-30 mb-4 object-contain drop-shadow-md"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      repeatDelay: 3,
                    }}
                  />
                  <p className="font-semibold text-white text-xl tracking-wide">
                    {industry.name}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
