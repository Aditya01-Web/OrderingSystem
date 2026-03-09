import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderTrackingPage } from "./pages/OrderTrackingPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";

export const router = createBrowserRouter([
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
]);
