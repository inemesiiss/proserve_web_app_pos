import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import UpperNavBar from "./components/UpperNavBar";
import FoodOrderSummary from "./components/OrderSummary";
import FoodTotalDiscountPaymentSection from "./components/OrderTotalDIscountPayment";

interface LayoutProps {
  children: ReactNode;
  setLoggedIn?: (v: boolean) => void;
  showOrderSummary?: boolean;
  showUpperNavBar?: boolean;
}

export default function IndoorLayout({
  children,
  setLoggedIn,
  showOrderSummary = true,
  showUpperNavBar = false,
}: LayoutProps) {
  const location = useLocation();
  const isTransactionPage = location.pathname.startsWith("/indoor/transaction");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 🔹 UPPER NAVBAR */}
      <UpperNavBar setLoggedIn={setLoggedIn} isBlank={showUpperNavBar} />

      {/* 🔹 MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT */}
        <main
          className={`flex-1 overflow-y-auto no-scrollbar p-6 ${
            showOrderSummary ? "pr-4" : ""
          }`}
        >
          {children}
        </main>

        {/* 🔹 RIGHT SIDE PANEL */}
        {showOrderSummary && isTransactionPage && (
          <aside className="w-[700px] shrink-0 bg-white border-l border-gray-200 shadow-md overflow-hidden p-4 flex flex-row gap-4">
            {/* Each section independent in width & scroll */}
            <div className="flex-1 overflow-y-auto border-r border-gray-100 pr-4">
              <FoodOrderSummary />
            </div>

            <div className="flex-1 overflow-y-auto pl-4">
              <FoodTotalDiscountPaymentSection />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
