import { Route } from "react-router-dom";
import AdminLayout from "@/components/admin/layout";

// Director Pages
import DirectorDashboard from "@/pages/director/Dashboard";
import DirectorAccounts from "@/pages/director/Accounts";
import DirectorBranch from "@/pages/director/Branch";
import DirectorProduct from "@/pages/director/Product";
import DirectorTerminal from "@/pages/director/Terminal";
import DirectorUser from "@/pages/director/User";
import DirectorSettings from "@/pages/director/Settings";

// Director Reports
import DirectorReportTransaction from "@/pages/director/reports/Transaction";
import DirectorInventoryReport from "@/pages/director/reports/Inventory";
import DirectorProductMixReport from "@/pages/director/reports/ProductReport";
import DirectorAttendanceReport from "@/pages/director/reports/AttendanceReport";

interface DirectorRoutesProps {
  setLoggedIn?: (v: boolean) => void;
}

export const getDirectorRoutes = ({ setLoggedIn }: DirectorRoutesProps) => (
  <>
    <Route
      path="/director/dashboard"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorDashboard />
        </AdminLayout>
      }
    />
    <Route
      path="/director/accounts"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorAccounts />
        </AdminLayout>
      }
    />
    <Route
      path="/director/branch"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorBranch />
        </AdminLayout>
      }
    />
    <Route
      path="/director/product"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorProduct />
        </AdminLayout>
      }
    />
    <Route
      path="/director/terminal"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorTerminal />
        </AdminLayout>
      }
    />
    <Route
      path="/director/users"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorUser />
        </AdminLayout>
      }
    />
    <Route
      path="/director/settings"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorSettings />
        </AdminLayout>
      }
    />
    <Route
      path="/director/reports/transaction"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorReportTransaction />
        </AdminLayout>
      }
    />
    <Route
      path="/director/reports/inventory"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorInventoryReport />
        </AdminLayout>
      }
    />
    <Route
      path="/director/reports/product"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorProductMixReport />
        </AdminLayout>
      }
    />
    <Route
      path="/director/reports/attendance"
      element={
        <AdminLayout setLoggedIn={setLoggedIn}>
          <DirectorAttendanceReport />
        </AdminLayout>
      }
    />
  </>
);
