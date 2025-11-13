import { motion } from "framer-motion";
import BackButton from "./BackButton";

interface HeaderProps {
  headerText: string;
  to?: string; // optional, can skip if no back nav needed
}

export default function Header({ headerText, to }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 
                 flex items-center justify-between px-6 py-4"
    >
      <div className="flex items-center gap-4">
        {to && <BackButton to={to} label="Back" />}
        <h2 className="text-2xl font-bold text-blue-700">{headerText}</h2>
      </div>

      <div className="flex items-center">{/* Future right-side content */}</div>
    </motion.header>
  );
}
