import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import ManagerPasscodeModal from "@/components/food/modals/security/ManagerPasscodeModal";
import type { VerifiedUser } from "@/store/api/User";

// Helper function to get branch ID from localStorage
const getBranchIdFromStorage = (): number => {
  try {
    const branchValue = localStorage.getItem("branch");
    if (branchValue) {
      const branchId = parseInt(branchValue, 10);
      return isNaN(branchId) ? 1 : branchId;
    }
    return 1;
  } catch {
    return 1;
  }
};

export default function DirectorySelection() {
  const navigate = useNavigate();
  const [animations, setAnimations] = useState<Record<string, any>>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [branchId] = useState<number>(getBranchIdFromStorage());

  const roleId = localStorage.getItem("role") ?? "0";

  useEffect(() => {
    async function loadAnimations() {
      const dashboard = await fetch("/food/lotties/dashboard.json").then(
        (res) => res.json()
      );
      const reports = await fetch("/food/lotties/reports.json").then((res) =>
        res.json()
      );
      const user = await fetch("/food/lotties/user.json").then((res) =>
        res.json()
      );
      setAnimations({ dashboard, user, reports });
    }
    loadAnimations();
  }, []);

  const directory = [
    {
      id: "dashboard",
      name: "Analytic Dashboard",
      animation: animations.dashboard,
      path: "/bm/dashboard",
      textMessage: "Select user and enter PIN to access Analytics",
      digitCount: 6,
    },
    ...(parseInt(roleId) !== 4
      ? [
          {
            id: "reports",
            name: "Reports",
            animation: animations.reports,
            path: "/bm/reports/transaction",
            textMessage: "Select user and enter PIN to access Reports",
            digitCount: 6,
          },
          {
            id: "user",
            name: "Cashier Access",
            animation: animations.user,
            path: "/food/transaction",
            textMessage: "Select user and enter PIN to access Cashier",
            digitCount: 6,
          },
        ]
      : []),
  ];

  const handleItemClick = (item: any) => {
    // Cashier Access navigates directly - it has its own security modal on the transaction page
    if (parseInt(roleId) === 4) {
      navigate(item.path);
    } else {
      if (item.id === "user") {
        navigate(item.path);
        return;
      }
      // Reports and Dashboard require passcode verification
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  const handleSuccess = (verifiedUser: VerifiedUser) => {
    if (selectedItem) {
      navigate(selectedItem.path, {
        state: { id: selectedItem.id, user: verifiedUser },
      });
      setShowModal(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 relative gap-16 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400">
          Proserv Cafe
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">
          Makati Branch
        </p>
        <div className="h-1.5 w-32 bg-blue-500 rounded-full mt-2 shadow-sm"></div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-6xl justify-items-center">
        {directory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
            className="w-full max-w-[300px]"
          >
            <Button
              onClick={() => handleItemClick(item)}
              disabled={!item.animation}
              className={`w-full h-80 bg-white dark:bg-gray-800 rounded-3xl shadow-xl 
                border-2 border-gray-200 dark:border-gray-700
                hover:border-blue-400 dark:hover:border-blue-500
                hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30
                transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                group relative overflow-hidden`}
            >
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <motion.div
                className="flex flex-col items-center justify-center relative z-10 h-full p-6"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="w-44 h-44 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 p-6 shadow-lg
                    group-hover:shadow-xl group-hover:shadow-blue-300/50 dark:group-hover:shadow-blue-800/30
                    transition-all duration-300"
                  whileHover={{ rotate: 5, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {item.animation ? (
                    <Lottie animationData={item.animation} loop autoplay />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                  )}
                </motion.div>
                <p
                  className="text-2xl font-bold text-gray-800 dark:text-gray-100 
                  group-hover:text-blue-600
                  dark:group-hover:text-blue-400
                  transition-all duration-300 px-4 text-center"
                >
                  {item.name}
                </p>
                <motion.div
                  className="mt-4 h-1 bg-blue-500 rounded-full w-0 group-hover:w-20 transition-all duration-300"
                  initial={{ width: 0 }}
                />
              </motion.div>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Footer hint */}
      {/* <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-gray-600 dark:text-gray-400 mt-8 font-medium"
      >
        ✨ Select a service to continue
      </motion.p> */}

      {selectedItem && (
        <ManagerPasscodeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
          textMessage={selectedItem.textMessage}
          digitCount={selectedItem.digitCount}
          branchId={branchId}
        />
      )}
    </div>
  );
}
