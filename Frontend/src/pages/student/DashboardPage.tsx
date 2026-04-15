import { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowUpDown, Shield, Zap, MapPin, Map, Star, Search } from 'lucide-react';
import { RoomCard } from '../../components/rooms/RoomCard';
import { BookingModal } from '../../components/rooms/BookingModal';
import { apiGet } from '../../lib/api';
import { useBookingStore } from '../../store/bookingStore';
import type { Room } from '../../types';

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selected, setSelected] = useState<Room | null>(null);
  const [filterActive, setFilterActive] = useState(false);
  const [sortActive, setSortActive] = useState(false);
  const bookings = useBookingStore(s => s.bookings);

  useEffect(() => {
    // Fetch 100 dynamically generated mock properties from backend api
    apiGet<{ properties: Room[] }>('/properties')
      .then(res => setRooms(res.properties))
      .catch(console.error);
  }, []);

  let displayedRooms = rooms.map(room => {
    // If we've booked it locally, mock the PENDING_LOCK status
    if (bookings.find(b => b.roomId === room.id)) {
      return { ...room, status: 'PENDING_LOCK' as const };
    }
    return room;
  });
  if (filterActive) {
    displayedRooms = displayedRooms.filter(r => r.status === 'AVAILABLE');
  }
  if (sortActive) {
    displayedRooms.sort((a, b) => a.basePrice - b.basePrice);
  }

  return (
    <div className="flex flex-col gap-7 max-w-[1400px] mx-auto animate-fade-in">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div>
          <p className="flex items-center gap-1.5 text-[var(--primary)] text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 fill-[var(--primary)]" /> Discover Your New Home
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-[-0.025em] leading-tight display-font uppercase">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#60A5FA]">Perfect Stay</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm md:text-[0.95rem] mt-2 max-w-lg leading-relaxed">
            Premium, verified student housing with real-time availability across 12+ university clusters.
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <button 
            onClick={() => setFilterActive(!filterActive)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-[12px] h-10 shadow-sm transition-all border ${
              filterActive 
                ? 'bg-[var(--primary-container)] text-[var(--primary)] border-[var(--primary-container)]' 
                : 'bg-white text-[var(--text)] border-[var(--border)] hover:bg-[#F8FAFC]'
            }`}>
            <SlidersHorizontal className="w-4 h-4" /> {filterActive ? 'Available Only' : 'Filters'}
          </button>
          <button 
            onClick={() => setSortActive(!sortActive)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-[12px] h-10 shadow-sm transition-all border ${
              sortActive 
                ? 'bg-[var(--primary-container)] text-[var(--primary)] border-[var(--primary-container)]' 
                : 'bg-white text-[var(--text)] border-[var(--border)] hover:bg-[#F8FAFC]'
            }`}>
            <ArrowUpDown className="w-4 h-4" /> {sortActive ? 'Price: Low-High' : 'Sort'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Shield, label: 'Verified Listings', value: '100%', color: 'var(--primary)' },
          { icon: Zap,    label: 'Live Availability', value: 'Real-time', color: '#10b981' },
          { icon: Star,   label: 'Avg. Rating',       value: '4.8★',     color: '#f59e0b' },
          { icon: MapPin, label: 'Locations',          value: '12+',      color: '#8b5cf6' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white/80 border border-[#E2E8F0] rounded-[20px] p-5 flex items-center gap-4 hover:border-[var(--primary)] hover:shadow-md transition-all duration-300 glass group cursor-default">
            <div className={`w-12 h-12 bg-white rounded-[14px] flex items-center justify-center shrink-0 border border-[#E2E8F0] shadow-sm group-hover:scale-105 transition-all duration-300`} style={{ color }}>
              <Icon className="w-5 h-5 drop-shadow-sm" />
            </div>
            <div>
              <p className="text-[var(--text)] font-bold text-[1.05rem] leading-tight display-font">{value}</p>
              <p className="text-[var(--text-muted)] text-[11px] font-medium mt-0.5 tracking-wide uppercase">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search (mobile) */}
      <div className="lg:hidden">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
          <input placeholder="Search for properties…" className="input-field pl-11 py-3.5 shadow-[var(--shadow-ambient)] text-[0.95rem]" />
        </div>
      </div>

      {/* Featured banner */}
      <div className="bg-gradient-to-r from-[var(--primary-hover)] to-[var(--primary-container)] border border-[var(--primary)] rounded-[20px] p-7 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center overflow-hidden relative shadow-[var(--shadow-glow)]">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 50%)' }} />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-semibold uppercase tracking-widest mb-4">
            <Star className="w-3.5 h-3.5 fill-[#FCD34D] text-[#FCD34D]" /> Featured Listing
          </div>
          <h2 className="text-white text-3xl sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-none mb-3 display-font uppercase">
            Lumina Heights Elite
          </h2>
          <p className="text-white/80 text-[0.95rem] max-w-md leading-relaxed">Rooftop study lounges, 24/7 gym, and gigabit fiber included.</p>
          <div className="flex flex-wrap gap-5 mt-5">
            <div className="flex items-center gap-1.5 text-white text-sm font-medium">
              <Star className="w-4 h-4 fill-[#FCD34D] text-[#FCD34D]" /> 4.9 <span className="text-white/60 font-normal">(128 reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-white text-sm font-medium">
              <MapPin className="w-4 h-4 text-white/90" /> 2.1 mi from Campus
            </div>
          </div>
        </div>
        <div className="relative z-10 shrink-0 w-full sm:w-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] p-6 text-center sm:text-right shadow-lg">
            <p className="text-white/80 text-xs font-semibold mb-1 uppercase tracking-wider">Starting from</p>
            <p className="text-white text-4xl font-bold tracking-[-0.03em] display-font">$850<span className="text-white/60 text-lg font-normal tracking-normal">/mo</span></p>
            <button 
              onClick={() => rooms.length > 0 && setSelected(rooms[0])}
              className="mt-5 w-full sm:w-auto bg-white text-[var(--primary)] font-bold px-7 py-3 rounded-[12px] text-sm h-auto shadow-md hover:bg-gray-50 transition-colors uppercase tracking-wider">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-[var(--text)] font-bold text-2xl tracking-[-0.02em] display-font">
          Available Properties <span className="text-[#8d90a0] font-medium text-[1.1rem] ml-1.5">({displayedRooms.length})</span>
        </h2>
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger">
        {displayedRooms.map((room) => (
          <RoomCard key={room.id} room={room} onBook={setSelected} />
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 pb-8">
        <button onClick={() => alert('Loading more properties...')} className="btn-secondary px-8 py-3 text-sm">View More Properties</button>
        <button onClick={() => alert('Map view coming soon!')} className="btn-secondary px-6 py-3 text-sm">
          <Map className="w-4 h-4 text-[#2563EB]" /> Map View
        </button>
      </div>

      {selected && <BookingModal room={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
