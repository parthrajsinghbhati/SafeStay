import { Bell, Search, Plus, Menu, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';

interface Props { ownerMode?: boolean; onMenu?: () => void; }

export function Topbar({ ownerMode, onMenu }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const token = useAuthStore(s => s.accessToken);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U';

  const handleAddListing = () => {
    if (!ownerMode && user && token) {
      setAuth({ ...user, role: 'OWNER' }, token);
    }
    navigate('/owner/add-property');
  };

  return (
    <header className="h-[72px] flex items-center px-6 sm:px-8 gap-5 shrink-0 bg-[var(--bg)]/70 backdrop-blur-2xl border-b border-[var(--border)] relative z-20 sticky top-0">

      {/* Mobile menu */}
      <button onClick={onMenu}
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[12px] bg-[var(--surface-high)] border border-[var(--border)] text-[var(--primary)] hover:text-[var(--text)] transition-colors shadow-[var(--shadow-ambient)]">
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="hidden sm:flex flex-1 max-w-sm">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors pointer-events-none" />
          <input
            placeholder="Search properties, bookings…"
            className="w-full bg-[var(--surface-low)] border border-[var(--border)] rounded-[12px] pl-11 pr-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[#8d90a0] outline-none transition-all focus:bg-[var(--surface-high)] focus:border-[var(--primary)] shadow-[var(--shadow-ambient)]"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-4">

        {/* Add listing */}
        <button
          onClick={handleAddListing}
          className="hidden sm:flex items-center gap-2 btn-primary px-4 py-2 text-sm h-10 shadow-[var(--shadow-glow)]">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden lg:inline display-font text-white">Add Listing</span>
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-[12px] bg-[var(--surface-high)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors shadow-[var(--shadow-ambient)]">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2.5 right-2 w-2 h-2 rounded-full bg-[var(--error)] shadow-[0_0_8px_var(--error)]" />
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-[var(--border)] hidden sm:block" />

        {/* User */}
        <button className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-[12px] hover:bg-[var(--surface-high)] border border-transparent hover:border-[var(--border)] transition-all group">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-container)] flex items-center justify-center text-white text-xs font-bold shadow-[var(--shadow-glow)]">
            {initials}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-[var(--text)] text-sm font-semibold leading-tight display-font">{user?.name ?? 'User'}</p>
            <p className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wide">{user?.role}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)] hidden xl:block group-hover:text-[var(--primary)] transition-colors" />
        </button>
      </div>
    </header>
  );
}
