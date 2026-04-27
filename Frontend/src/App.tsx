import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/student/DashboardPage';
import BookingsPage from './pages/student/BookingsPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage';
import MaintenancePage from './pages/MaintenancePage';
import AddPropertyPage from './pages/owner/AddPropertyPage';
// import PlaceholderPage from './pages/PlaceholderPage';
// import PaymentPage from './pages/student/PaymentPage';
import HelpSupportPage from './pages/HelpSupportPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/help" element={<HelpSupportPage />} />
            </Route>
          </Route>

          {/* Owner routes */}
          <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
            <Route element={<AppLayout ownerMode />}>
              <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
              <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
              <Route path="/owner/maintenance" element={<MaintenancePage />} />
              <Route path="/owner/add-property" element={<AddPropertyPage />} />
              <Route path="/owner/help" element={<HelpSupportPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
