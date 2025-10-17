import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
  to?: string | number;
  label?: string;
  className?: string;
}

export default function BackButton({
  to,
  label = "Back",
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof to === "number") navigate(to);
    else if (typeof to === "string") navigate(to);
    else navigate(-1);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.97, y: 2 }} // gives a pressed 3D feel
      className={`flex items-center gap-2 px-5 py-2 rounded-full 
                  bg-white text-gray-700 font-medium 
                  shadow-[0_4px_0_0_rgba(0,0,0,0.15)] 
                  hover:shadow-[0_2px_0_0_rgba(0,0,0,0.25)] 
                  active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                  border border-gray-200 transition-all duration-150 ${className}`}
    >
      <ArrowLeft size={20} className="text-gray-700" />
      {label}
    </motion.button>
  );
}
