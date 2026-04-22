import { useBookingStore } from '../../store/bookingStore';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

export default function PaymentPage() {
  const bookings = useBookingStore(s => s.bookings);

  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(b.bookedAt || 0).getTime() - new Date(a.bookedAt || 0).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)] display-font tracking-tight">Payment History</h1>
        <p className="text-[var(--text-muted)] mt-2">View all your secure transactions and active commitments.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
          <div className="p-2 bg-[var(--primary-container)] rounded-lg">
            <CreditCard className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--text)]">Recent Transactions</h2>
        </div>

        {sortedBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-[var(--border)]">
              <Clock className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-[var(--text)] font-medium">No transactions yet.</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Book a room and it will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {sortedBookings.map((booking, index) => (
              <div key={booking.id || index} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:bg-gray-50 transition-colors">
                <div className="shrink-0 pt-0.5">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text)] font-semibold text-lg truncate">
                    {booking.roomName || `Room Booking #${booking.roomId}`}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-sm">
                    <span className="text-[var(--text-muted)]">
                      {new Date(booking.bookedAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-[var(--text-muted)] capitalize px-2.5 py-0.5 rounded-full bg-gray-100 font-medium">
                      {(booking.status || 'completed').replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end pt-4 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                  <p className="text-[var(--text)] font-bold text-xl tracking-tight">
                    ${booking.price}
                  </p>
                  <p className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider mt-1">Completed</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 flex items-start sm:items-center gap-4">
        <div className="shrink-0 p-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm">
          <Clock className="w-5 h-5 text-[#64748B]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">Looking for past payments?</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Older transactions or deposits are automatically listed here. Rent payment is completed within your escrow holding.</p>
        </div>
      </div>
    </div>
  );
}
