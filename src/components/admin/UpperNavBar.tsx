import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuickThemeToggle } from "@/components/reusables/QuickThemeToggle";
// import Logo from "@/assets/PROSERVELOGO.png";

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
    if (setLoggedIn) {
      setLoggedIn(false);
    }
    localStorage.clear();
    navigate("/food/main");
  };

  // 🎨 Blank variant — solid black bar
  if (isBlank) {
    return (
      <header className="shrink-0 bg-white dark:bg-gray-800 h-[64px] shadow-md border-b border-gray-200 dark:border-gray-700" />
    );
  }

  return (
    <header className="shrink-0 bg-white dark:bg-gray-800 shadow-md py-3 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex justify-center ">
        {/* <img src={Logo} alt="App Logo" className="w-36 h-auto" /> */}
      </div>

      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <QuickThemeToggle />

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer">
          <User className="text-gray-700 dark:text-gray-200 w-5 h-5" />
          <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
            User
          </span>
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
