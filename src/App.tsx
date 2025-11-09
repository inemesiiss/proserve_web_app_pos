import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  // useNavigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/authentication/Login";
// Enter the food imports
import { FoodOrderProvider } from "./context/food/FoodOrderProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import FoodLayout from "./components/food/layout";

// admin pages
import AdminDashboard from "./pages/branch_manager/Dashboard";
import HomeCashierPage from "./pages/food/cashier/HomeCashierPage";
import FoodTransactionPage from "./pages/food/cashier/TransactionCashierPage";
import DirectorySelection from "./pages/BranchDirectory";
import AdminLayout from "./components/admin/layout";
import AdminBranch from "./pages/branch_manager/Branch";
import AdminAccounts from "./pages/branch_manager/Accounts";
import AdminProduct from "./pages/branch_manager/Product";
import AdminTerminal from "./pages/branch_manager/Terminal";
import AdminUser from "./pages/branch_manager/User";
// Reports Pages
import ReportTransaction from "./pages/branch_manager/reports/Transaction";
import InventoryReport from "./pages/branch_manager/reports/Inventory";
import ProductMixReport from "./pages/branch_manager/reports/ProductReport";
import AttendanceReport from "./pages/branch_manager/reports/AttendanceReport";
// Kiosk Pages
import KioskMenuPage from "./pages/food/kiosk/MenuKiosk";
import KioskHome from "./pages/food/kiosk/KioskHome";
import OrderTypeSelection from "./pages/food/kiosk/OrderTypeSelection";

function AppRoutes({
  loggedIn,
  setLoggedIn,
}: {
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
}) {
  // const navigate = useNavigate();

  return (
    <Routes>
      {!loggedIn ? (
        <>
          <Route
            path="/"
            element={<Login onLogin={() => setLoggedIn(true)} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {/* Food and Bev Routes */}
          <Route
            path="/food"
            element={
              <FoodLayout
                setLoggedIn={setLoggedIn}
                showOrderSummary={true}
                showUpperNavBar={true}
              >
                <HomeCashierPage />
              </FoodLayout>
            }
          />
          <Route
            path="/food/transaction"
            element={
              <FoodLayout
                setLoggedIn={setLoggedIn}
                showOrderSummary={true}
                showUpperNavBar={true}
              >
                <FoodTransactionPage />
              </FoodLayout>
            }
          />
          <Route
            path="/food/main"
            element={
              <FoodLayout setLoggedIn={setLoggedIn}>
                <DirectorySelection />
              </FoodLayout>
            }
          />

          {/* For Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout setLoggedIn={setLoggedIn}>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route path="/admin/account" element={<AdminAccounts />} />
          <Route path="/admin/branch" element={<AdminBranch />} />
          <Route path="/admin/product" element={<AdminProduct />} />
          <Route path="/admin/terminal" element={<AdminTerminal />} />
          <Route path="/admin/users" element={<AdminUser />} />
          <Route
            path="/admin/reports/transaction"
            element={
              <AdminLayout setLoggedIn={setLoggedIn}>
                <ReportTransaction />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/reports/inventory"
            element={
              <AdminLayout setLoggedIn={setLoggedIn}>
                <InventoryReport />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/reports/product"
            element={
              <AdminLayout setLoggedIn={setLoggedIn}>
                <ProductMixReport />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/reports/attendance"
            element={
              <AdminLayout setLoggedIn={setLoggedIn}>
                <AttendanceReport />
              </AdminLayout>
            }
          />
        </>
      )}
      {/* For Kiosk */}
      <Route path="/kiosk/home" element={<KioskHome />} />
      <Route path="/kiosk/order-type" element={<OrderTypeSelection />} />
      <Route path="/kiosk/menu" element={<KioskMenuPage />} />
    </Routes>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <FoodOrderProvider>
          <AppRoutes loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </FoodOrderProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
