import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, CreditCard, Wrench, FileText,
  Settings, HelpCircle, LogOut, RefreshCw, X, Shield,
  ChevronRight, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';

const STUDENT_NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Overview' },
  { to: '/bookings',     icon: CalendarDays,    label: 'My Bookings' },
  { to: '/payments',     icon: CreditCard,      label: 'Payments' },
  { to: '/maintenance',  icon: Wrench,          label: 'Maintenance' },
  { to: '/contracts',    icon: FileText,        label: 'Contracts' },
  { to: '/settings',     icon: Settings,        label: 'Settings' },
];
const OWNER_NAV = [
  { to: '/owner/dashboard',   icon: LayoutDashboard, label: 'Overview' },
  { to: '/owner/bookings',    icon: CalendarDays,    label: 'Bookings' },
  { to: '/owner/payments',    icon: CreditCard,      label: 'Payments' },
  { to: '/owner/maintenance', icon: Wrench,          label: 'Maintenance' },
  { to: '/owner/contracts',   icon: FileText,        label: 'Contracts' },
  { to: '/owner/settings',    icon: Settings,        label: 'Settings' },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const token = useAuthStore(s => s.accessToken);
  const nav = user?.role === 'OWNER' ? OWNER_NAV : STUDENT_NAV;
  const switchTo = user?.role === 'OWNER' ? '/dashboard' : '/owner/dashboard';
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U';

  const handleRoleSwap = () => {
    if (user && token) {
      setAuth({ ...user, role: user.role === 'OWNER' ? 'STUDENT' : 'OWNER' }, token);
    }
    navigate(switchTo);
    onClose?.();
  };

  return (
    <aside className="w-[260px] h-full flex flex-col bg-[var(--surface-low)] border-r border-[var(--border)] relative z-30 select-none glass">

      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-container)] flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[var(--text)] font-bold text-[17px] tracking-[-0.02em] display-font">SafeStay</span>
        </div>
        {onClose && (
          <button onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface-high)] text-[var(--text-muted)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User Card */}
      <div className="mx-3 mb-5">
        <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[var(--surface-high)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface-highest)] transition-all cursor-pointer group shadow-[var(--shadow-ambient)]">
          <div className="w-9 h-9 rounded-[10px] bg-[var(--primary-container)] flex items-center justify-center text-[var(--primary)] text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[var(--text)] text-sm font-semibold truncate leading-tight display-font">{user?.name ?? 'User'}</p>
            <p className="text-[10px] font-semibold text-[var(--text-muted)] truncate uppercase tracking-wider mt-0.5">{user?.role}</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors shrink-0" />
        </div>
      </div>

      {/* Nav */}
      <div className="px-3 flex-1 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d90a0] px-3 mb-2">Navigation</p>
        <nav className="space-y-0.5">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[var(--primary)] font-semibold shadow-inner'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-high)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-8 h-8 flex items-center justify-center rounded-[9px] transition-all ${
                    isActive ? 'bg-[var(--primary)] shadow-[var(--shadow-glow)]' : 'bg-transparent group-hover:bg-[var(--surface-highest)]'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'}`} strokeWidth={isActive ? 2.5 : 2} />
                  </span>
                  <span className="flex-1">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>


      {/* Bottom Actions */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-[var(--border)] pt-3">
        <button onClick={handleRoleSwap}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-sm font-medium w-full text-left text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-high)] transition-all group">
          <span className="w-8 h-8 flex items-center justify-center rounded-[9px] group-hover:bg-[var(--surface-highest)] transition-colors">
            <RefreshCw className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:rotate-180 transition-all duration-500" />
          </span>
          Switch to {user?.role === 'OWNER' ? 'Student' : 'Owner'}
        </button>
        <button 
          onClick={() => {
            navigate(user?.role === 'OWNER' ? '/owner/help' : '/help');
            onClose?.();
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-sm font-medium w-full text-left text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-high)] transition-all group">
          <span className="w-8 h-8 flex items-center justify-center rounded-[9px] group-hover:bg-[var(--surface-highest)] transition-colors">
            <HelpCircle className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
          </span>
          Help & Support
        </button>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-sm font-medium w-full text-left text-[var(--text-muted)] hover:text-[#ffb4ab] hover:bg-[#93000a]/20 transition-all group">
          <span className="w-8 h-8 flex items-center justify-center rounded-[9px] group-hover:bg-[#ffb4ab]/10 transition-colors">
            <LogOut className="w-4 h-4 text-[#ffb4ab] group-hover:-translate-x-0.5 transition-all" />
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
