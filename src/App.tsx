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
import LoginPage from "./pages/authentication/Login";

function AppRoutes({
  loggedIn,
  setLoggedIn,
}: {
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
}) {
  return (
    <Routes>
      {!loggedIn ? (
        <>
          <Route
            path="/*"
            element={<LoginPage onLogin={() => setLoggedIn(true)} />}
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
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <FoodOrderProvider>
          <AppRoutes loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </FoodOrderProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
