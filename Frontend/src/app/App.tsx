import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { TableProvider } from './context/TableContext';
import { Toaster } from './components/ui/sonner';


export default function App() {
  return (
    <CartProvider>
      <TableProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </TableProvider>
    </CartProvider>
  );
}
