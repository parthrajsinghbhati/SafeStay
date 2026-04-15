import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface Props { ownerMode?: boolean; }

export function AppLayout({ ownerMode }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-[#0a0d14]/60 backdrop-blur-md lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 lg:static lg:z-auto transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar ownerMode={ownerMode} onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
