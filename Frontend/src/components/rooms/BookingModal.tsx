import { useState } from 'react';
import { X, MapPin, ArrowRight, Check, Shield, Zap, CreditCard, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateTotal } from '../../lib/pricingEngine';
import { MOCK_ADDONS } from '../../lib/mockData';
import { useBookingStore } from '../../store/bookingStore';
import type { Room, Addon } from '../../types';

interface Props { room: Room; onClose: () => void; }

export function BookingModal({ room, onClose }: Props) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Addon[]>([]);
  const toggle = (a: Addon) =>
    setSelected((p) => p.find((x) => x.id === a.id) ? p.filter((x) => x.id !== a.id) : [...p, a]);
  const pricing = calculateTotal(room.basePrice, selected);
  const addBooking = useBookingStore(s => s.addBooking);

  const handleConfirm = () => {
    addBooking(room, pricing.total);
    onClose();
    navigate('/bookings');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#0F172A]/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full sm:max-w-3xl bg-white rounded-t-[24px] sm:rounded-[24px] overflow-hidden flex flex-col lg:flex-row max-h-[95vh] sm:max-h-[88vh] shadow-[0_32px_64px_rgba(0,0,0,0.2)] animate-scale-in border border-[#E2E8F0]">

        {/* Left: Property Preview */}
        <div className="relative lg:w-[42%] hidden lg:flex shrink-0 overflow-hidden flex-col">
          <img src={room.images[0]} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent" />

          <div className="relative z-10 mt-auto p-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/30 text-[#93C5FD] text-[10px] font-semibold uppercase tracking-wider mb-5">
              <Zap className="w-3 h-3 fill-[#60A5FA]" /> Instant Booking
            </div>
            <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.02em] mb-2">{room.name}</h2>
            <div className="flex items-center gap-2 text-[#94A3B8] text-sm mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#60A5FA]" /> {room.location}
            </div>
            {room.rating && (
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-sm">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="text-white font-semibold">{room.rating}</span>
                <span>rating</span>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              {[
                { icon: Shield, color: 'text-[#34D399]', label: 'Verified by SafeStay' },
                { icon: CreditCard, color: 'text-[#60A5FA]', label: 'Secure Escrow Payment' },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[9px] bg-white/10 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className="text-white text-xs font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Configuration */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Header */}
          <div className="flex justify-between items-center px-7 py-5 border-b border-[#F1F5F9]">
            <div>
              <h3 className="text-[#0F172A] font-bold text-lg tracking-[-0.02em]">Configure Your Stay</h3>
              <p className="text-[#94A3B8] text-xs font-medium mt-0.5">Select add-ons to enhance your experience</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-all border border-[#E2E8F0]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-7 py-6 custom-scrollbar space-y-6">
            {/* Base rent */}
            <div className="flex justify-between items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-5">
              <div>
                <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-wider mb-1">Base Monthly Rent</p>
                <p className="text-[#0F172A] font-semibold text-sm">Standard Room Rate</p>
              </div>
              <div className="text-right">
                <p className="text-[#0F172A] font-bold text-2xl tracking-[-0.02em]">${room.basePrice}</p>
                <p className="text-[#94A3B8] text-[10px] font-medium mt-0.5">per month</p>
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-3">Optional Add-ons</p>
              <div className="space-y-2.5">
                {MOCK_ADDONS.map((addon) => {
                  const isSelected = !!selected.find((a) => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-center gap-4 p-4 rounded-[14px] border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-[#BFDBFE] bg-[#EFF6FF]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#CBD5E1]'
                      }`}>
                        {isSelected && <Check className="text-white w-3 h-3" strokeWidth={3} />}
                      </div>
                      <input type="checkbox" checked={isSelected} onChange={() => toggle(addon)} className="sr-only" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0F172A] text-sm font-semibold">{addon.name}</p>
                        <p className="text-[#64748B] text-xs mt-0.5">{addon.description}</p>
                      </div>
                      <span className={`text-sm font-bold shrink-0 ${isSelected ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>
                        +${addon.price}<span className="text-[10px] font-medium">/mo</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-7 py-5 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <div className="flex justify-between items-end mb-5">
              <div>
                <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-wider mb-1">Total Monthly</p>
                <p className="text-[#0F172A] font-bold text-3xl tracking-[-0.03em]">
                  ${pricing.total}<span className="text-[#94A3B8] text-base font-medium">/mo</span>
                </p>
              </div>
              <div className="text-right text-[10px] font-medium text-[#94A3B8] space-y-0.5">
                <p>Incl. security deposit</p>
                <p>All taxes applied</p>
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              className="btn-primary w-full py-3.5 text-sm group/btn"
            >
              Confirm & Reserve
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <p className="text-center text-[#94A3B8] text-[11px] mt-3">
              By confirming, you agree to our{' '}
              <span className="text-[#2563EB] cursor-pointer hover:underline">Rental Terms</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
