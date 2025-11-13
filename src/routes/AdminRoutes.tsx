import { Route } from "react-router-dom";
import AdminLayout from "@/components/admin/layout";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminAccounts from "@/pages/admin/Accounts";
import AdminBranch from "@/pages/admin/Branch";
import AdminProduct from "@/pages/admin/Product";
import AdminTerminal from "@/pages/admin/Terminal";
import AdminUser from "@/pages/admin/User";
import AdminSettings from "@/pages/admin/Settings";

// Admin Reports
import AdminReportTransaction from "@/pages/admin/reports/Transaction";
import AdminInventoryReport from "@/pages/admin/reports/Inventory";
import AdminProductMixReport from "@/pages/admin/reports/ProductReport";
import AdminAttendanceReport from "@/pages/admin/reports/AttendanceReport";

interface AdminRoutesProps {
  setLoggedIn: (v: boolean) => void;
}

export const getAdminRoutes = ({ setLoggedIn }: AdminRoutesProps) => (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminDashboard />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/accounts"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminAccounts />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/branch"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminBranch />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/product"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminProduct />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/terminal"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminTerminal />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/users"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminUser />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/settings"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminSettings />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/reports/transaction"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminReportTransaction />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/reports/inventory"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminInventoryReport />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/reports/product"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminProductMixReport />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/reports/attendance"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <AdminAttendanceReport />
        </AdminLayout>
      }
    />
  </>
);
