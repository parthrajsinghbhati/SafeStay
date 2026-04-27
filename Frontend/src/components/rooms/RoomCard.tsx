import { useState, useCallback } from 'react';
import { MapPin, Heart, Lock, Star, Shield, ArrowRight, Wifi, Dumbbell, Zap } from 'lucide-react';
import { useSocket, type RoomEvent } from '../../hooks/useSocket';
import type { Room, RoomStatus } from '../../types';

interface Props { room: Room; onBook: (room: Room) => void; }

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Free Fiber': <Wifi className="w-3 h-3" />,
  'Gym': <Dumbbell className="w-3 h-3" />,
  'Gym Access': <Dumbbell className="w-3 h-3" />,
};

export function RoomCard({ room, onBook }: Props) {
  const [status, setStatus] = useState<RoomStatus>(room.status);
  const [liked, setLiked] = useState(false);

  const handleEvent = useCallback((e: RoomEvent) => {
    if (e.roomId !== room.id) return;
    setStatus(e.type === 'room:locked' ? 'PENDING_LOCK' : 'AVAILABLE');
  }, [room.id]);
  useSocket(handleEvent);

  const isLocked = status === 'PENDING_LOCK';
  const isBooked = status === 'BOOKED';

  return (
    <div className="group bg-white border border-[#E2E8F0] hover:border-[#BFDBFE] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] hover:-translate-y-1 flex flex-col relative p-0 cursor-pointer" onClick={() => onBook(room)}>

      {/* Image */}
      <div className="relative h-60 overflow-hidden shrink-0 m-2.5 rounded-[18px]">
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/80 via-transparent to-transparent opacity-60" />

        {/* Status badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {status === 'AVAILABLE' && (
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-[#22c55e]/30 text-[#15803d] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#4ade80]" />
              Available
            </span>
          )}
          {isLocked && (
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-[#f59e0b]/30 text-[#b45309] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              <Zap className="w-3 h-3" />
              Pending
            </span>
          )}
        </div>

        {/* Verified badge */}
        <div className="absolute top-3 right-12 flex items-center gap-1.5 bg-[var(--surface-high)]/80 backdrop-blur-md border border-[var(--border)] rounded-full px-2.5 py-1 shadow-[var(--shadow-ambient)]">
          <Shield className="w-3 h-3 text-[var(--primary)]" />
          <span className="text-[var(--text)] text-[10px] font-semibold tracking-wider">Verified</span>
        </div>

        {/* Like */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
        >
          <Heart className={`w-4 h-4 transition-all duration-300 ${liked ? 'fill-[#ef4444] text-[#ef4444] scale-110 drop-shadow-md' : 'text-[#94A3B8]'}`} />
        </button>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-md border border-[var(--border)] rounded-[12px] px-3.5 py-2 shadow-sm">
            <p className="text-[var(--text)] text-xl font-bold leading-none tracking-tight display-font">
              ${room.basePrice}<span className="text-[#8d90a0] text-xs font-medium ml-0.5 tracking-normal">/mo</span>
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-4 z-10">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[var(--text)] font-semibold text-lg leading-snug tracking-wide group-hover:text-[var(--primary)] transition-colors display-font uppercase">
              {room.name}
            </h3>
            {room.rating && (
              <div className="flex items-center gap-1.5 bg-[#FFFBEB] border border-[#FEF3C7] rounded-[8px] px-2 py-1 shrink-0 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="text-[#B45309] text-xs font-bold">{room.rating}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-[0.8rem] font-medium tracking-wide">
            <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
            <span className="truncate">{room.location}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 flex-1 mt-1">
          {room.amenities.slice(0, 3).map((a) => (
            <span key={a} className="flex items-center gap-1.5 text-[10px] text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded-[8px] font-semibold tracking-wider uppercase shadow-sm">
              {AMENITY_ICONS[a]}
              {a}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-[10px] text-[#94A3B8] font-bold px-1 py-1.5">+ {room.amenities.length - 3}</span>
          )}
        </div>

        {/* CTA */}
        {isLocked || isBooked ? (
          <div className="flex items-center justify-center gap-2 py-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#94A3B8] text-sm font-bold uppercase tracking-wider mt-2">
            <Lock className="w-4 h-4" />
            {isBooked ? 'Booked' : 'Temporarily Locked'}
          </div>
        ) : (
          <button
            onClick={() => onBook(room)}
            className="w-full py-3.5 text-sm group/btn bg-[var(--primary)] hover:bg-[#1E40AF] text-white font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] transition-all mt-2"
          >
            Book Now
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
