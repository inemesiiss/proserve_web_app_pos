import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  // useNavigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
// Enter the food imports
import { FoodOrderProvider } from "./context/food/FoodOrderProvider";
import FoodLayout from "./components/food/layout";
import HomeCashierPage from "./pages/food/cashier/HomeCashierPage";
import FoodTransactionPage from "./pages/food/cashier/TransactionCashierPage";
import DirectorySelection from "./pages/BranchDirectory";
// import Admin from "./pages/Admin";
import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAccounts from "./pages/admin/Accounts";
import AdminBranch from "./pages/admin/Branch";
import AdminProduct from "./pages/admin/Product";
import AdminReports from "./pages/admin/Reports";
import AdminTerminal from "./pages/admin/Terminal";
import AdminUser from "./pages/admin/User";
// Reports Pages
import ReportTransaction from "./pages/reports/Transaction";
import InventoryReport from "./pages/reports/Inventory";

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
          <Route path="/admin/reports" element={<AdminReports />} />
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
        </>
      )}
    </Routes>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <FoodOrderProvider>
        <AppRoutes loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </FoodOrderProvider>
    </BrowserRouter>
  );
}
