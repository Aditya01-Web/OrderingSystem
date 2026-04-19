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
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminTablesPage } from './pages/admin/AdminTablesPage';

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
  {
    path: '/admin/orders',
    element: <ProtectedRoute><AdminOrdersPage /></ProtectedRoute>,
  },
  {
    path: '/admin/tables',
    element: <ProtectedRoute><AdminTablesPage /></ProtectedRoute>,
  },

  {
    path: "/1",
    Component: HomePage,
  },
  {
    path: "/2",
    Component: HomePage,
  },
  {
    path: "/3",
    Component: HomePage,
  },
  {
    path: "/4",
    Component: HomePage,
  },
  {
    path: "/5",
    Component: HomePage,
  },
  {
    path: "/6",
    Component: HomePage,
  },
  {
    path: "/7",
    Component: HomePage,
  },
  {
    path: "/8",
    Component: HomePage,
  },
  {
    path: "/9",
    Component: HomePage,
  },
  {
    path: "/10",
    Component: HomePage,
  },
  {
    path: "/11",
    Component: HomePage,
  },
  {
    path: "/12",
    Component: HomePage,
  },
]);
