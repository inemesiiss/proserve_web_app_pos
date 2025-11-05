import type { ReactNode } from "react";
import UpperNavBar from "./UpperNavBar";

interface LayoutProps {
  children: ReactNode;
  setLoggedIn?: (v: boolean) => void;
  showUpperNavBar?: boolean;
}

export default function AdminLayout({
  children,
  setLoggedIn,
  showUpperNavBar = false,
}: LayoutProps) {
  // const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 🔹 UPPER NAVBAR */}
      <UpperNavBar setLoggedIn={setLoggedIn} isBlank={showUpperNavBar} />

      {/* 🔹 MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT */}
        <main className={`flex-1 overflow-y-auto no-scrollbar p-6 `}>
          {children}
        </main>
      </div>
    </div>
  );
}
