import { Route } from "react-router-dom";
import FoodLayout from "@/components/food/layout";

// Food & Beverage Pages
import HomeCashierPage from "@/pages/food/cashier/HomeCashierPage";
import FoodTransactionPage from "@/pages/food/cashier/TransactionCashierPage";
import CustomerTransactionView from "@/pages/food/cashier/CustomerTransactionView";
import PreparationPage from "@/pages/food/preparation/Preparation";
import DirectorySelection from "@/pages/BranchDirectory";

interface FoodRoutesProps {
  setLoggedIn?: (v: boolean) => void;
}

export const getFoodRoutes = ({ setLoggedIn }: FoodRoutesProps) => (
  <>
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
      path="/food/customer-view"
      element={
        <FoodLayout
          setLoggedIn={setLoggedIn}
          showOrderSummary={false}
          showUpperNavBar={false}
        >
          <CustomerTransactionView />
        </FoodLayout>
      }
    />
    <Route
      path="/food/kitchen"
      element={
        <FoodLayout setLoggedIn={setLoggedIn} showOrderSummary={false}>
          <PreparationPage />
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
  </>
);
