import {
  TrendingUp, Plus, Calendar, AlertTriangle, Wrench,
  DollarSign, Search, ChevronRight, Shield, ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../lib/api';

const STATUS_STYLE: Record<string, string> = {
  HEALTHY: 'bg-[#DCFCE7] text-[#15803D]',
  AVAILABLE: 'bg-[#DCFCE7] text-[#15803D]',
  PENDING: 'bg-[#FEF9C3] text-[#A16207]',
  FULL:    'bg-[#DBEAFE] text-[#1D4ED8]',
  BOOKED:  'bg-[#DBEAFE] text-[#1D4ED8]',
};

const FEED_ICON: Record<string, React.ReactNode> = {
  booking:     <Calendar className="w-4 h-4 text-[#2563EB]" />,
  security:    <AlertTriangle className="w-4 h-4 text-[#DC2626]" />,
  maintenance: <Wrench className="w-4 h-4 text-[#D97706]" />,
  payment:     <DollarSign className="w-4 h-4 text-[#059669]" />,
};

const FEED_BG: Record<string, string> = {
  booking:     'bg-[#EFF6FF] border-[#BFDBFE]',
  security:    'bg-[#FEF2F2] border-[#FECACA]',
  maintenance: 'bg-[#FFFBEB] border-[#FDE68A]',
  payment:     'bg-[#ECFDF5] border-[#A7F3D0]',
};

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const accessToken = useAuthStore(s => s.accessToken);
  
  const { data, isLoading } = useQuery({
    queryKey: ['owner-properties'],
    queryFn: () => apiGet<{ properties: any[] }>('/properties/owner'),
    enabled: !!accessToken,
  });
  const { data: ticketsData } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => apiGet<{ tickets: any[] }>('/maintenance'),
    enabled: !!accessToken,
  });
  const { data: bookingsData } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => apiGet<{ bookings: any[] }>('/bookings'),
    enabled: !!accessToken,
  });

  const properties = data?.properties || [];
  const tickets = ticketsData?.tickets || [];
  const bookings = bookingsData?.bookings || [];
  const totalRevenue = properties.reduce((acc, p) => acc + p.basePrice, 0);
  const availableCount = properties.filter((p: any) => p.status === 'AVAILABLE').length;
  const bookedCount = properties.filter((p: any) => p.status === 'BOOKED').length;
  const maintenanceCount = properties.filter((p: any) => p.status === 'MAINTENANCE').length;
  const occupancyPct = properties.length > 0 ? Math.round((bookedCount / properties.length) * 100) : 0;
  const reportedTickets = tickets.filter((t: any) => t.status === 'REPORTED').length;
  const inProgressTickets = tickets.filter((t: any) => t.status === 'IN_PROGRESS').length;
  const resolvedTickets = tickets.filter((t: any) => t.status === 'RESOLVED').length;
  const activityFeed: Array<{ id: string; type: 'booking' | 'maintenance'; title: string; description: string; time: string; actions?: string[] }> = [
    ...bookings.slice(0, 2).map((b: any) => ({
      id: `booking-${b.id}`,
      type: 'booking' as const,
      title: 'New Booking Confirmed',
      description: `${b.room?.name || 'Room'} booked for $${b.totalPrice}.`,
      time: new Date(b.createdAt).toLocaleString(),
    })),
    ...tickets.slice(0, 2).map((t: any) => ({
      id: `ticket-${t.id}`,
      type: 'maintenance' as const,
      title: `Maintenance: ${t.title}`,
      description: `${t.location} (${t.status})`,
      time: new Date(t.createdAt).toLocaleString(),
    })),
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-7 max-w-[1600px] mx-auto animate-fade-in">

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col gap-7">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
          <div>
            <p className="flex items-center gap-1.5 text-[#2563EB] text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-3 h-3" /> Owner Dashboard
            </p>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-[-0.025em]">
              Welcome back, <span className="text-[#2563EB]">{user?.name?.split(' ')[0] ?? 'Owner'}</span>
            </h1>
            <p className="text-[#64748B] text-sm mt-1.5">
              You have <span className="text-[#0F172A] font-semibold">{properties.length} active properties</span> requiring attention today.
            </p>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] px-6 py-5 shrink-0 hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
            <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-wider">Total Base Revenue</p>
            <p className="text-[#0F172A] text-3xl font-bold mt-1.5 tracking-[-0.025em]">${totalRevenue.toLocaleString()}</p>
            <p className="text-[#059669] text-xs font-semibold mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.5% <span className="text-[#94A3B8] font-normal ml-1">this month</span>
            </p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          {/* Occupancy card */}
          <div className="sm:col-span-2 bg-white border border-[#E2E8F0] rounded-[20px] p-7 overflow-hidden relative group hover:border-[#CBD5E1] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#EFF6FF] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="relative z-10">
              <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-wider mb-4">Portfolio Occupancy</p>
              <div className="flex items-end gap-4 mb-6">
                <p className="text-6xl font-bold text-[#0F172A] leading-none tracking-[-0.03em]">{occupancyPct}%</p>
                <div className="mb-1">
                  <p className="text-[#059669] text-xs font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {bookedCount} booked
                  </p>
                  <p className="text-[#94A3B8] text-[10px] font-medium">vs last month</p>
                </div>
              </div>
              {/* Mini bar chart */}
              <div className="flex items-end gap-1.5 h-16">
                {[55, 70, 60, 80, 75, 90, 85, 70, 95, 80].map((h, i) => (
                  <div key={i} className="flex-1 group/bar relative">
                    <div
                      className={`w-full rounded-t-[4px] transition-all duration-500 ${i === 8 ? 'bg-[#2563EB]' : 'bg-[#E2E8F0] group-hover/bar:bg-[#BFDBFE]'}`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Maintenance status */}
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-7 flex flex-col justify-between hover:border-[#CBD5E1] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-300">
            <div>
              <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-wider mb-5">Maintenance Status</p>
              <div className="space-y-4">
                {[
                  { label: 'Reported',    count: reportedTickets,   color: 'text-[#D97706]', dot: 'bg-[#F59E0B]' },
                  { label: 'In Progress', count: inProgressTickets, color: 'text-[#2563EB]', dot: 'bg-[#3B82F6]' },
                  { label: 'Resolved',    count: resolvedTickets,   color: 'text-[#059669]', dot: 'bg-[#10B981]' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                      <span className="text-[#475569] text-sm font-medium">{item.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-secondary w-full py-2.5 text-sm mt-6">Manage Tickets</button>
          </div>
        </div>

        {/* Expand CTA */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[20px] p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 90% 50%, #3B82F6 0%, transparent 60%)' }} />
          <div className="w-12 h-12 bg-white/10 rounded-[14px] flex items-center justify-center shrink-0 relative z-10">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-white font-semibold text-base">Expand your portfolio</p>
            <p className="text-[#64748B] text-sm mt-0.5">New high-yield clusters available in London North.</p>
          </div>
          <button className="btn-secondary shrink-0 relative z-10 text-sm px-5 py-2.5">Explore Units</button>
        </div>

        {/* Properties table */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden hover:border-[#CBD5E1] transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-7 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-[#0F172A] font-bold text-lg tracking-[-0.01em]">Properties Ledger</h2>
              <p className="text-[#94A3B8] text-xs mt-0.5">
                {availableCount} available, {bookedCount} booked, {maintenanceCount} in maintenance
              </p>
            </div>
            <div className="flex gap-2.5">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                <input placeholder="Search listings…" className="input-field pl-9 pr-4 py-2 text-sm w-44 sm:w-56" />
              </div>
              <button className="btn-secondary px-4 py-2 text-sm">Filter</button>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center text-[#94A3B8]">Loading properties...</div>
            ) : (
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider border-b border-[#F1F5F9]">
                    <th className="text-left py-3.5 px-7">Property</th>
                    <th className="text-left py-3.5 px-4">Type</th>
                    <th className="text-left py-3.5 px-4">Rating</th>
                    <th className="text-left py-3.5 px-4">Base Price</th>
                    <th className="text-left py-3.5 px-4">Status</th>
                    <th className="text-right py-3.5 px-7" />
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors group">
                      <td className="py-4 px-7">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-[11px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] text-sm font-bold shrink-0">
                            {p.name?.[0] || 'R'}
                          </div>
                          <div>
                            <p className="text-[#0F172A] text-sm font-semibold">{p.name || 'Untitled Room'}</p>
                            <p className="text-[#94A3B8] text-xs mt-0.5">{p.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[#475569] text-xs font-medium bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-lg">Studio</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[#0F172A] text-xs font-semibold">{p.rating} ★</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-[#0F172A] text-sm font-semibold">${p.basePrice.toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${STATUS_STYLE[p.status] || STATUS_STYLE.AVAILABLE}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-7 text-right">
                        <button className="w-8 h-8 flex items-center justify-center rounded-[9px] hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0F172A] transition-all ml-auto">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="w-full xl:w-[340px] xl:shrink-0">
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] xl:sticky xl:top-6 hover:border-[#CBD5E1] transition-all duration-200">
          <div className="flex items-center justify-between p-6 border-b border-[#F1F5F9]">
            <div>
              <h3 className="text-[#0F172A] font-bold text-base tracking-[-0.01em]">Activity Feed</h3>
              <p className="text-[#94A3B8] text-xs mt-0.5">Real-time system events</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              <span className="text-[#2563EB] text-[10px] font-semibold">Live</span>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex gap-3.5 group/item">
                <div className={`w-9 h-9 ${FEED_BG[item.type]} border rounded-[11px] flex items-center justify-center shrink-0 mt-0.5`}>
                  {FEED_ICON[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-[#0F172A] text-sm font-semibold leading-snug group-hover/item:text-[#2563EB] transition-colors">{item.title}</p>
                    <span className="text-[#94A3B8] text-[10px] font-medium shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[#64748B] text-xs mt-1 leading-relaxed">{item.description}</p>
                  {item.actions && (
                    <div className="flex gap-2 mt-2.5">
                      {item.actions.map((a) => (
                        <button key={a} className="text-[11px] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] font-semibold px-2.5 py-1 rounded-[7px] border border-[#E2E8F0] transition-all">
                          {a}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5">
            <button className="w-full text-center text-[#2563EB] text-xs font-semibold py-3 border border-[#BFDBFE] bg-[#EFF6FF] rounded-[11px] hover:bg-[#DBEAFE] transition-colors">
              View Full Audit Log
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-7 right-7 w-14 h-14 btn-primary rounded-[16px] flex items-center justify-center shadow-[0_8px_24px_rgba(37,99,235,0.35)] hover:scale-105 active:scale-95 z-40 transition-all duration-200">
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>
    </div>
  );
}
