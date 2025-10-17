import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpperNavBarProps {
  setLoggedIn?: (v: boolean) => void;
  isBlank?: boolean; // 👈 determines if the bar should be black and empty
}

export default function UpperNavBar({
  setLoggedIn,
  isBlank = false,
}: UpperNavBarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    if (setLoggedIn) setLoggedIn(false);
    navigate("/");
  };

  // 🎨 Blank variant — solid black bar
  if (isBlank) {
    return <header className="shrink-0 bg-white h-[64px] shadow-md border-b" />;
  }

  // 🎬 Default variant — full navigation
  return (
    <header className="shrink-0 bg-white shadow-md py-3 px-6 flex items-center justify-between border-b">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 ml-40">
        🎬 Proserve Kiosk
      </h1>

      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer">
          <User className="text-gray-700 w-5 h-5" />
          <span className="text-gray-700 text-sm font-medium">User</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </motion.div>
    </header>
  );
}
