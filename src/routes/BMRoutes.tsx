import { Route } from "react-router-dom";
import AdminLayout from "@/components/admin/layout";

// Branch Manager Pages
import BMDashboard from "@/pages/branch_manager/Dashboard";
import BMAccounts from "@/pages/branch_manager/Accounts";
import BMBranch from "@/pages/branch_manager/Branch";
import BMProduct from "@/pages/branch_manager/Product";
import BMTerminal from "@/pages/branch_manager/Terminal";
import BMUser from "@/pages/branch_manager/User";
import BMSettings from "@/pages/branch_manager/Settings";

// Branch Manager Reports
import BMReportTransaction from "@/pages/branch_manager/reports/Transaction";
import BMInventoryReport from "@/pages/branch_manager/reports/Inventory";
import BMProductMixReport from "@/pages/branch_manager/reports/ProductReport";
import BMAttendanceReport from "@/pages/branch_manager/reports/AttendanceReport";
import BMDiscountPromotion from "@/pages/branch_manager/reports/DiscountPromotion";

interface BMRoutesProps {
  setLoggedIn: (v: boolean) => void;
}

export const getBMRoutes = ({ setLoggedIn }: BMRoutesProps) => (
  <>
    <Route
      path="/bm/dashboard"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMDashboard />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/accounts"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMAccounts />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/branch"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMBranch />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/product"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMProduct />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/terminal"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMTerminal />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/users"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMUser />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/settings"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMSettings />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/reports/transaction"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMReportTransaction />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/reports/inventory"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMInventoryReport />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/reports/product"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMProductMixReport />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/reports/attendance"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMAttendanceReport />
        </AdminLayout>
      }
    />
    <Route
      path="/bm/reports/discount-promotion"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <BMDiscountPromotion />
        </AdminLayout>
      }
    />
  </>
);
