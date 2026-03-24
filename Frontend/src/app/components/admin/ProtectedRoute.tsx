import { Navigate } from 'react-router';
import { isAdminLoggedIn } from '../../services/adminApi';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};