import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

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

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <FoodOrderProvider>
          <Routes>
            {!loggedIn ? (
              <>
                <Route
                  path="/*"
                  element={<WebLoginPage onLogin={() => setLoggedIn(true)} />}
                />
                {/* {getKioskRoutes()} */}
              </>
            ) : (
              <>
                {getFoodRoutes({ setLoggedIn })}
                {getAdminRoutes({ setLoggedIn })}
                {getDirectorRoutes({ setLoggedIn })}
                {getBMRoutes({ setLoggedIn })}
              </>
            )}
          </Routes>
        </FoodOrderProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
