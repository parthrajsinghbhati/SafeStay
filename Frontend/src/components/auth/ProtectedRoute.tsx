/**
 * ProtectedRoute — Role-Based Access Control
 * Redirects STUDENT away from owner pages; redirects OWNER to analytics by default.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';

interface Props {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'OWNER' ? '/owner/dashboard' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
