import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Context Providers
import { FoodOrderProvider } from "./context/food/FoodOrderProvider";
import { ThemeProvider } from "./context/ThemeProvider";

// Route Modules
// import { getKioskRoutes } from "./routes/KioskRoutes";
import { getFoodRoutes } from "./routes/FoodRoutes";
import { getAdminRoutes } from "./routes/AdminRoutes";
import { getDirectorRoutes } from "./routes/DirectorRoutes";
import { getBMRoutes } from "./routes/BMRoutes";
// import LoginPage from "./pages/authentication/Login";
import WebLoginPage from "./pages/authentication/WebLogin";
import { store } from "./store";
import { Provider } from "react-redux";
import { useAuth } from "@/context/AuthProvider";
import LoadingOverlay from "./components/reusables/transition-loader";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  // const [loggedIn, setLoggedIn] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <FoodOrderProvider>
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/login" element={<WebLoginPage />} />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                  {/* {getKioskRoutes()} */}
                </>
              ) : (
                <>
                  {getFoodRoutes({})}
                  {getAdminRoutes({})}
                  {getDirectorRoutes({})}
                  {getBMRoutes({})}

                  <Route
                    path="*"
                    element={<Navigate to="/bm/dashboard" replace />}
                  />
                </>
              )}
            </Routes>
            <Toaster richColors />
          </FoodOrderProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}
