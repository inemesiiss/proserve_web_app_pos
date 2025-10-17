import { useLocation } from "react-router-dom";
import SidebarNav from "./components/SideBarNav";
import type { ReactNode } from "react";
import OrderSummary from "@/components/entertainment/components/OrderSummary";
import UpperNavBar from "./components/UpperNavBar";

interface LayoutProps {
  children: ReactNode;
  setLoggedIn?: (v: boolean) => void;
  showOrderSummary?: boolean;
  showUpperNavBar?: boolean;
}

export default function Layout({
  children,
  setLoggedIn,
  showOrderSummary = true,
  showUpperNavBar = false,
}: LayoutProps) {
  const location = useLocation();

  const showSidebar =
    location.pathname.startsWith("/cinema/tickets") ||
    location.pathname.startsWith("/cinema/snacks") ||
    /^\/cinema\/[^/]+\/[^/]+\/[^/]+$/.test(location.pathname);

  const isCinemaPage = location.pathname.startsWith("/cinema/");
  const isCheckoutPage = location.pathname.startsWith("/cinema/checkout");

  // 👇 Example rule: show blank header if on /cinema/home

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 🔹 UPPER NAVBAR */}
      <UpperNavBar setLoggedIn={setLoggedIn} isBlank={showUpperNavBar} />

      {/* 🔹 MAIN FLEX AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        {showSidebar && (
          <aside className="w-38 bg-white border-r shadow-md flex flex-col overflow-y-auto no-scrollbar">
            <SidebarNav />
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main
          className={`flex-1 overflow-y-auto no-scrollbar p-6 ${
            showOrderSummary ? "pr-4" : ""
          }`}
        >
          {children}
        </main>

        {/* ORDER SUMMARY */}
        {showOrderSummary && isCinemaPage && !isCheckoutPage && (
          <aside className="w-[360px] shrink-0 bg-white border-l border-gray-200 shadow-md overflow-y-auto no-scrollbar p-5">
            <OrderSummary />
          </aside>
        )}
      </div>
    </div>
  );
}
