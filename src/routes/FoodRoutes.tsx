import { Route } from "react-router-dom";
import FoodLayout from "@/components/food/layout";

// Food & Beverage Pages
import HomeCashierPage from "@/pages/food/cashier/HomeCashierPage";
import FoodTransactionPage from "@/pages/food/cashier/TransactionCashierPage";
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
      path="/food/main"
      element={
        <FoodLayout setLoggedIn={setLoggedIn}>
          <DirectorySelection />
        </FoodLayout>
      }
    />
  </>
);
