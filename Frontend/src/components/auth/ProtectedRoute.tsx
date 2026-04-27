/**
 * ProtectedRoute — Role-Based Access Control
 * Redirects STUDENT away from owner pages; redirects OWNER to analytics by default.
 * Waits for Zustand persist hydration before making auth decisions.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

interface Props {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const user = useAuthStore(s => s.user);
  const accessToken = useAuthStore(s => s.accessToken);
  const hasHydrated = useAuthStore(s => s._hasHydrated);

  // Wait for localStorage rehydration — avoids false redirect to /login
  if (!hasHydrated) {
    return null; // or a spinner
  }

  const isAuthenticated = !!accessToken;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'OWNER' ? '/owner/dashboard' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
