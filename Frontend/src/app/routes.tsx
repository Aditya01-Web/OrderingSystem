import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderTrackingPage } from "./pages/OrderTrackingPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminMenu } from "./pages/admin/AdminMenu";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

export const router = createBrowserRouter([
  // ── Existing routes ──────────────────────
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/cart",
    Component: CartPage,
  },
  {
    path: "/checkout",
    Component: CheckoutPage,
  },
  {
    path: "/order-confirmation/:orderId",
    Component: OrderConfirmationPage,
  },
  {
    path: "/order-tracking",
    Component: OrderTrackingPage,
  },
  {
    path: "/order-history",
    Component: OrderHistoryPage,
  },

  // ── Admin routes ─────────────────────────
  {
    path: "/admin/login",
    Component: AdminLoginPage,
  },
  {
    path: "/admin/dashboard",
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: "/admin/menu",
    element: <ProtectedRoute><AdminMenu /></ProtectedRoute>,
  },
]);
