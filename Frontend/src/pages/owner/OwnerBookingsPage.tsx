import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../lib/api';
import { 
  Calendar, MapPin, Mail, 
  ChevronRight, Search, Filter, Download
} from 'lucide-react';

export default function OwnerBookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['owner-bookings'],
    queryFn: () => apiGet<{ bookings: any[] }>('/bookings'),
  });

  const bookings = data?.bookings || [];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
      case 'PENDING':   return 'bg-[#FEF9C3] text-[#A16207] border-[#FEF08A]';
      case 'CANCELLED': return 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
      default:          return 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]';
    }
  };

  return (
    <div className="flex flex-col gap-7 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div>
          <p className="flex items-center gap-1.5 text-[#94A3B8] text-[11px] font-medium mb-2 uppercase tracking-wider">
            Owner Portal <ChevronRight className="w-3 h-3" /> Reservation Management
          </p>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-[-0.025em]">
            Booking <span className="text-[#2563EB]">Portfolio</span>
          </h1>
          <p className="text-[#64748B] text-sm mt-1.5">Monitor and manage all incoming reservations across your properties.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary px-4 py-2.5 text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-4 flex flex-col md:flex-row gap-4 items-center shadow-[var(--shadow-ambient)]">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
          <input 
            placeholder="Search by student name, email, or room..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] pl-11 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-[#2563EB] transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none btn-secondary px-4 py-3 text-sm flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-[var(--shadow-ambient)]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-[0.1em] border-b border-[#F1F5F9] bg-[#F8FAFC]/50">
                <th className="text-left py-5 px-8">Guest Details</th>
                <th className="text-left py-5 px-4">Property / Room</th>
                <th className="text-left py-5 px-4">Booking Status</th>
                <th className="text-left py-5 px-4">Total Amount</th>
                <th className="text-left py-5 px-4">Booked On</th>
                <th className="text-right py-5 px-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-[#94A3B8] font-medium">
                    Loading your reservations...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar className="w-12 h-12 text-[#E2E8F0]" />
                      <p className="text-[#94A3B8] font-medium">No bookings found in your portfolio.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold shadow-[0_4px_12px_rgba(37,99,235,0.2)]">
                          {(b.user?.profile?.firstName?.[0] || b.user?.email?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[#0F172A] text-sm font-bold leading-tight">
                            {b.user?.profile ? `${b.user.profile.firstName} ${b.user.profile.lastName}` : 'System User'}
                          </p>
                          <p className="text-[#94A3B8] text-[11px] font-medium mt-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {b.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-[#0F172A] text-sm font-semibold">{b.room?.name || 'Standard Unit'}</p>
                        <p className="text-[#94A3B8] text-[11px] font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#2563EB]" /> {b.room?.location || 'SafeStay Campus'}
                        </p>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${getStatusStyle(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col">
                        <p className="text-[#0F172A] text-sm font-bold">${b.totalPrice.toLocaleString()}</p>
                        <p className="text-[#94A3B8] text-[10px] font-medium mt-0.5">Paid via Stripe</p>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-[#475569] text-xs font-semibold">{new Date(b.createdAt).toLocaleDateString()}</p>
                      <p className="text-[#94A3B8] text-[10px] font-medium mt-0.5">{new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#94A3B8] hover:text-[#2563EB] hover:border-[#2563EB] hover:shadow-lg transition-all ml-auto">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
