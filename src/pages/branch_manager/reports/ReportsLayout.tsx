import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SideBar } from "@/components/admin/SideBar";
import UpperNavBar from "@/components/admin/UpperNavBar";
import { reportNavs } from "@/navigattion/ReportNaviation";
import { Loader2 } from "lucide-react";

interface ReportsLayoutProps {
  children: ReactNode;
}

export function ReportsLayout({ children }: ReportsLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  // Show loader during page transition
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <UpperNavBar />

      <div className="flex flex-1 overflow-hidden">
        <SideBar navs={reportNavs} onCollapsedChange={setSidebarCollapsed} />

        <div
          className="flex-1 transition-all duration-300 flex flex-col"
          style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
        >
          <AnimatePresence mode="wait">
            {isTransitioning ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center flex-1"
              >
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading page...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
