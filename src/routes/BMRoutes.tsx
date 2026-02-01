import { Route } from "react-router-dom";
import AdminLayout from "@/components/admin/layout";
import { ReportsLayout } from "@/pages/branch_manager/reports/ReportsLayout";

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
import BMSalesReport from "@/pages/branch_manager/reports/SalesReport";
import BMCategory from "@/pages/branch_manager/Category";
import BMComposition from "@/pages/branch_manager/Composition";
import BMUserAccess from "@/pages/branch_manager/UserAccess";
import DashboardSales from "@/pages/branch_manager/DashboardSales";

interface BMRoutesProps {
  setLoggedIn?: (v: boolean) => void;
}

export const getBMRoutes = ({ setLoggedIn }: BMRoutesProps) => {
  const role = Number(localStorage.getItem("role"));
  return (
    <>
      <Route
        path="/bm/dashboard"
        element={
          <AdminLayout setLoggedIn={setLoggedIn}>
            <BMDashboard />
          </AdminLayout>
        }
      />
      {role === 4 && (
        <Route
          path="/bm/accounts"
          element={
            <AdminLayout setLoggedIn={setLoggedIn}>
              <BMAccounts />
            </AdminLayout>
          }
        />
      )}
      <Route
        path="/bm/branch"
        element={
          <AdminLayout setLoggedIn={setLoggedIn}>
            <BMBranch />
          </AdminLayout>
        }
      />
      <Route
        path="/bm/product/product"
        element={
          <AdminLayout setLoggedIn={setLoggedIn}>
            <BMProduct />
          </AdminLayout>
        }
      />
      <Route
        path="/bm/product/composition"
        element={
          <AdminLayout setLoggedIn={setLoggedIn}>
            <BMComposition />
          </AdminLayout>
        }
      />
      <Route
        path="/bm/product/category"
        element={
          <AdminLayout setLoggedIn={setLoggedIn}>
            <BMCategory />
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
        path="/bm/users/manager"
        element={
          <AdminLayout setLoggedIn={setLoggedIn}>
            <BMUser />
          </AdminLayout>
        }
      />
      <Route
        path="/bm/users/user"
        element={
          <AdminLayout setLoggedIn={setLoggedIn}>
            <BMUserAccess />
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
        path="/bm/reports/sales"
        element={
          <ReportsLayout>
            <BMSalesReport />
          </ReportsLayout>
        }
      />
      <Route
        path="/bm/reports/transaction"
        element={
          <ReportsLayout>
            <BMReportTransaction />
          </ReportsLayout>
        }
      />
      <Route
        path="/bm/reports/inventory"
        element={
          <ReportsLayout>
            <BMInventoryReport />
          </ReportsLayout>
        }
      />
      <Route
        path="/bm/reports/product"
        element={
          <ReportsLayout>
            <BMProductMixReport />
          </ReportsLayout>
        }
      />
      <Route
        path="/bm/reports/attendance"
        element={
          <ReportsLayout>
            <BMAttendanceReport />
          </ReportsLayout>
        }
      />
      <Route
        path="/bm/reports/discount-promotion"
        element={
          <ReportsLayout>
            <BMDiscountPromotion />
          </ReportsLayout>
        }
      />
      <Route
        path="/bm/dashboard-sales"
        element={
          <ReportsLayout>
            <DashboardSales />
          </ReportsLayout>
        }
      />
    </>
  );
};
