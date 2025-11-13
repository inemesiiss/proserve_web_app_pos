import { Route } from "react-router-dom";

// Kiosk Pages
import KioskHome from "@/pages/food/kiosk/KioskHome";
import OrderTypeSelection from "@/pages/food/kiosk/OrderTypeSelection";
import KioskMenuPage from "@/pages/food/kiosk/MenuKiosk";

export const getKioskRoutes = () => (
  <>
    <Route path="/kiosk/home" element={<KioskHome />} />
    <Route path="/kiosk/order-type" element={<OrderTypeSelection />} />
    <Route path="/kiosk/menu" element={<KioskMenuPage />} />
  </>
);
