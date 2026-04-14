import { MapPin, Calendar, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';

export default function BookingsPage() {
  const bookings = useBookingStore(s => s.bookings);

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight display-font mb-2">My Bookings</h1>
        <p className="text-[var(--text-muted)] text-[0.95rem]">Manage your active and past reservations.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="border border-[#E2E8F0] border-dashed rounded-[20px] p-12 flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-md">
          <Calendar className="w-12 h-12 text-[#CBD5E1] mb-4" />
          <h2 className="text-lg font-bold text-[var(--text)] mb-2">No Bookings Yet</h2>
          <p className="text-[var(--text-muted)] text-sm max-w-sm mb-6">You haven't reserved any properties. Explore the dashboard to find your perfect stay.</p>
          <a href="/dashboard" className="btn-primary px-6 py-2.5 text-sm rounded-[12px] shadow-md hover:shadow-lg transition-all">Explore Properties</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-[#E2E8F0] rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-[#BFDBFE] transition-all flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-[140px] h-[140px] shrink-0 rounded-[16px] overflow-hidden relative">
                <img src={booking.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'} alt={booking.roomName} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-[8px] flex items-center gap-1.5 shadow-sm border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span className="text-[#059669] text-[10px] font-bold uppercase tracking-wider">Active</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col pt-1">
                <h3 className="text-[var(--text)] font-bold text-lg leading-tight mb-1">{booking.roomName}</h3>
                <p className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" /> {booking.location}
                </p>
                
                <div className="mt-auto flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm border-t border-[#F1F5F9] pt-3">
                    <span className="text-[var(--text-muted)] font-medium">Monthly Rent</span>
                    <span className="text-[var(--text)] font-bold">${booking.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-muted)] font-medium">Booked On</span>
                    <span className="text-[var(--text)] font-semibold">{new Date(booking.bookedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
