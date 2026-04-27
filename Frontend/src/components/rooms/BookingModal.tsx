import { useEffect, useState } from 'react';
import { X, MapPin, ArrowRight, Check, Shield, Zap, CreditCard, Star, Smartphone, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateTotal } from '../../lib/pricingEngine';
import { MOCK_ADDONS } from '../../lib/mockData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost, apiPatch } from '../../lib/api';
import type { Room, Addon } from '../../types';
import { useRoomSync } from '../../hooks/useRoomSync';
import { useAuth } from '../../hooks/useAuth';

interface Props { room: Room; onClose: () => void; }

export function BookingModal({ room, onClose }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isLocked, lockRoom, unlockRoom } = useRoomSync(room.id, user?.id);
  const [selected, setSelected] = useState<Addon[]>([]);

  const [step, setStep] = useState<'configure' | 'payment'>('configure');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);

  const toggle = (a: Addon) =>
    setSelected((p) => p.find((x) => x.id === a.id) ? p.filter((x) => x.id !== a.id) : [...p, a]);
  
  const pricing = calculateTotal(room.basePrice, selected);

  const initiateMutation = useMutation({
    mutationFn: () => apiPost<{ booking: any }>('/bookings/initiate', { 
      roomId: room.id, 
      expectedVersion: typeof room.version === 'number' ? room.version : 0, 
      extras: selected.map(s => s.name) 
    }),
    onSuccess: (data) => {
      setCurrentBookingId(data.booking.id);
      setStep('payment');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to initiate booking.');
    }
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => apiPatch(`/bookings/${id}/confirm`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setPaymentStatus('success');
      setTimeout(() => {
        onClose();
        navigate('/bookings');
      }, 1500);
    },
    onError: (error: any) => {
      setPaymentStatus('idle');
      alert(error.response?.data?.message || 'Failed to confirm payment.');
    }
  });

  const handleConfirm = () => {
    if (!currentBookingId) return;
    setPaymentStatus('processing');
    confirmMutation.mutate(currentBookingId);
  };

  const handleProceedToPayment = () => {
    initiateMutation.mutate();
  };

  useEffect(() => {
    lockRoom();
    return () => unlockRoom();
  }, [lockRoom, unlockRoom]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#0F172A]/50 backdrop-blur-sm animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            unlockRoom();
            onClose();
          }
        }}
    >
      <div className="w-full sm:max-w-4xl bg-white rounded-t-[24px] sm:rounded-[24px] overflow-hidden flex flex-col lg:flex-row max-h-[95vh] sm:max-h-[88vh] shadow-[0_32px_64px_rgba(0,0,0,0.2)] animate-scale-in border border-[#E2E8F0]">

        {/* Left: Property Preview */}
        <div className="relative lg:w-[40%] hidden lg:flex shrink-0 overflow-hidden flex-col">
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

        {/* Right: Steps */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Header */}
          <div className="flex justify-between items-center px-7 py-5 border-b border-[#F1F5F9]">
            <div>
              <h3 className="text-[#0F172A] font-bold text-lg tracking-[-0.02em]">
                {step === 'configure' ? 'Configure Your Stay' : 'Complete Payment'}
              </h3>
              <p className="text-[#94A3B8] text-xs font-medium mt-0.5">
                {step === 'configure' ? 'Select add-ons to enhance your experience' : 'Secure payment processing'}
              </p>
            </div>
            <button
              onClick={onClose}
              onMouseDown={() => unlockRoom()}
              className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-all border border-[#E2E8F0]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {step === 'configure' ? (
              <div className="px-7 py-6 space-y-6">
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
            ) : (
              <div className="px-7 py-6">
                
                {paymentStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center animate-fade-in py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Payment Successful!</h3>
                    <p className="text-[#64748B] text-sm text-center max-w-[280px]">Your payment of ${pricing.total} has been confirmed. Redirecting...</p>
                  </div>
                ) : (
                  <>
                    <h4 className="text-sm font-semibold text-[#0F172A] mb-4">Select Payment Method</h4>
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          paymentMethod === 'upi' ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#E2E8F0] hover:border-[#CBD5E1] text-[#64748B]'
                        }`}
                      >
                        <Smartphone className="w-5 h-5" />
                        <span className="font-medium text-xs">UPI / QR Code</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          paymentMethod === 'card' ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#E2E8F0] hover:border-[#CBD5E1] text-[#64748B]'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium text-xs">Credit/Debit Card</span>
                      </button>
                    </div>

                    {paymentMethod === 'upi' ? (
                      <div className="flex flex-col items-center justify-center py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-4">
                          <div className="w-32 h-32 bg-white border border-black p-1.5 flex flex-wrap relative">
                            {[...Array(64)].map((_, i) => (
                              <div key={i} className={`w-[12.5%] h-[12.5%] ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}></div>
                            ))}
                            {/* Inner corner points for QR illusion */}
                            <div className="absolute top-1 left-1 w-7 h-7 border-4 border-black bg-white flex items-center justify-center"><div className="w-2.5 h-2.5 bg-black"></div></div>
                            <div className="absolute top-1 right-1 w-7 h-7 border-4 border-black bg-white flex items-center justify-center"><div className="w-2.5 h-2.5 bg-black"></div></div>
                            <div className="absolute bottom-1 left-1 w-7 h-7 border-4 border-black bg-white flex items-center justify-center"><div className="w-2.5 h-2.5 bg-black"></div></div>
                          </div>
                        </div>
                        <p className="font-semibold text-sm text-[#0F172A] mb-2">Scan with any UPI app</p>
                        <div className="flex gap-2">
                          <span className="text-[#64748B] text-[10px] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-full shadow-sm">GPay</span>
                          <span className="text-[#64748B] text-[10px] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-full shadow-sm">PhonePe</span>
                          <span className="text-[#64748B] text-[10px] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-full shadow-sm">Paytm</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Card Number</label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">CVC</label>
                            <input type="text" placeholder="123" className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-2 p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[10px]">
                      <AlertCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <p className="text-[10px] text-[#1E3A8A]">Payments are securely processed. Your payment details are encrypted using bank-grade security protocols.</p>
                    </div>
                  </>
                )}
              </div>
            )}
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

            {step === 'configure' ? (
              <button 
                onClick={handleProceedToPayment}
                disabled={isLocked || initiateMutation.isPending}
                className={`btn-primary w-full py-3.5 text-sm group/btn flex items-center justify-center ${(isLocked || initiateMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {initiateMutation.isPending ? 'Initiating...' : isLocked ? 'Room Locked by Another User' : 'Proceed to Payment'}
                {!isLocked && !initiateMutation.isPending && <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />}
              </button>
            ) : (
              <button 
                onClick={handleConfirm}
                disabled={paymentStatus !== 'idle'}
                className="btn-primary w-full py-3.5 text-sm group/btn flex items-center justify-center relative overflow-hidden"
              >
                {paymentStatus === 'processing' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : paymentStatus === 'success' ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <>
                    Confirm Payment of ${pricing.total}
                    <LockIcon className="w-3.5 h-3.5 ml-1.5 opacity-80" />
                  </>
                )}
              </button>
            )}

            {step === 'configure' && (
              <p className="text-center text-[#94A3B8] text-[11px] mt-3">
                By proceeding, you agree to our{' '}
                <span className="text-[#2563EB] cursor-pointer hover:underline">Rental Terms</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}
