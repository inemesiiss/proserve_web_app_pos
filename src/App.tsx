import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  // useNavigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import IndustrySelection from "./pages/Services";
// Enter the entertainment imports
import { OrderProvider } from "./context/entertainment/OrderProvider";
import { FoodOrderProvider } from "./context/food/FoodOrderProvider";
import EntertainmentKioskPage from "./pages/entertainment/kiosk/HomePage";
import SelectSeatPageWrapper from "./components/entertainment/dynamic_routing/CinemaRouting";
import SnacksPage from "./pages/entertainment/kiosk/SnacksPage";
import TicketsPage from "./pages/entertainment/kiosk/TicketsPage";
import SurveyPage from "./pages/entertainment/kiosk/SurveyPage";
import Layout from "./components/entertainment/layout";
// Enter the food imports
import FoodLayout from "./components/food/layout";
import HomeCashierPage from "./pages/food/cashier/HomeCashierPage";
import FoodTransactionPage from "./pages/food/cashier/TransactionCashierPage";
// indoor imports
import IndoorLayout from "./components/indoor/layout";
import IndoorAmusementTransactionPage from "./pages/indoor/cashier/TransactionCashierPage";
import HomeIndoorPage from "./pages/indoor/cashier/HomeCashierPage";

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
          {/* Entertainment Routes */}
          <Route
            path="/services"
            element={
              <Layout setLoggedIn={setLoggedIn}>
                <IndustrySelection />
              </Layout>
            }
          />
          <Route
            path="/cinema"
            element={
              <Layout
                setLoggedIn={setLoggedIn}
                showOrderSummary={true}
                showUpperNavBar={true}
              >
                <EntertainmentKioskPage />
              </Layout>
            }
          />
          <Route
            path="/cinema/tickets"
            element={
              <Layout
                setLoggedIn={setLoggedIn}
                showOrderSummary={false}
                showUpperNavBar={true}
              >
                <TicketsPage />
              </Layout>
            }
          />
          <Route
            path="/cinema/:cinemaSlug/:movieSlug/:timeSlug"
            element={
              <Layout
                setLoggedIn={setLoggedIn}
                showOrderSummary={true}
                showUpperNavBar={true}
              >
                <SelectSeatPageWrapper />
              </Layout>
            }
          />
          <Route
            path="/cinema/snacks"
            element={
              <Layout
                setLoggedIn={setLoggedIn}
                showOrderSummary={true}
                showUpperNavBar={true}
              >
                <SnacksPage />
              </Layout>
            }
          />
          <Route
            path="/cinema/survey"
            element={
              <Layout
                setLoggedIn={setLoggedIn}
                showOrderSummary={false}
                showUpperNavBar={true}
              >
                <SurveyPage />
              </Layout>
            }
          />
          {/* Food and Bev Routes */}
          <Route
            path="/food"
            element={
              <Layout
                setLoggedIn={setLoggedIn}
                showOrderSummary={true}
                showUpperNavBar={true}
              >
                <HomeCashierPage />
              </Layout>
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
          {/* Infoor Amusement Routes */}
          <Route
            path="/indoor"
            element={
              <Layout
                setLoggedIn={setLoggedIn}
                showOrderSummary={true}
                showUpperNavBar={true}
              >
                <HomeIndoorPage />
              </Layout>
            }
          />
          <Route
            path="/indoor/transaction"
            element={
              <IndoorLayout
                setLoggedIn={setLoggedIn}
                showOrderSummary={true}
                showUpperNavBar={true}
              >
                <IndoorAmusementTransactionPage />
              </IndoorLayout>
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
        <OrderProvider>
          <AppRoutes loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </OrderProvider>
      </FoodOrderProvider>
    </BrowserRouter>
  );
}
