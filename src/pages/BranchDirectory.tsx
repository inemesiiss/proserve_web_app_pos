import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import SecurityPasscodeModal from "@/components/food/modals/security/SecurityPasscodeModal";

export default function DirectorySelection() {
  const navigate = useNavigate();
  const [animations, setAnimations] = useState<Record<string, any>>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

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
      path: "/admin/dashboard",
      passcode: "123456",
      textMessage: "Enter 4-digit access code for Analytics",
      digitCount: 6,
    },
    {
      id: "reports",
      name: "Reports",
      animation: animations.reports,
      path: "/admin/reports/transaction",
      passcode: "123456",
      textMessage: "Enter manager code to access Reports",
      digitCount: 6,
    },
    {
      id: "user",
      name: "User Access",
      animation: animations.user,
      path: "/food/transaction",
      passcode: "123456",
      textMessage: "Enter admin passcode to manage users",
      digitCount: 6,
    },
  ];

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSuccess = () => {
    if (selectedItem) {
      navigate(selectedItem.path, { state: { id: selectedItem.id } });
      setShowModal(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 relative gap-20">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-semibold text-gray-800 mb-10 text-center"
      >
        Welcome Ayala, Makati Branch
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-5xl justify-items-center">
        {directory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <Button
              onClick={() => handleItemClick(item)}
              disabled={!item.animation}
              className={`w-60 h-64 bg-white text-purple-600 rounded-3xl shadow-xl 
                hover:bg-purple-600 hover:text-white 
                transition-all transform hover:scale-105 active:scale-95`}
            >
              <motion.div
                className="flex flex-col items-center justify-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="w-36 h-36 mb-4"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.animation ? (
                    <Lottie animationData={item.animation} loop autoplay />
                  ) : (
                    <p className="text-gray-400 text-sm">Loading...</p>
                  )}
                </motion.div>
                <p className="text-xl font-semibold tracking-wide">
                  {item.name}
                </p>
              </motion.div>
            </Button>
          </motion.div>
        ))}
      </div>

      {selectedItem && (
        <SecurityPasscodeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
          textMessage={selectedItem.textMessage}
          digitCount={selectedItem.digitCount}
          correctCode={selectedItem.passcode}
        />
      )}
    </div>
  );
}
