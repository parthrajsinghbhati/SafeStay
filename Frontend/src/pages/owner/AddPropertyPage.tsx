import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Home, Plus, Trash2, Pencil, ArrowLeft, ArrowRight, MapPin, Check, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../lib/api';

const schema = z.object({
  name:        z.string().min(3, 'At least 3 characters'),
  description: z.string().min(10, 'Please add a description'),
  city:        z.string().min(1, 'Select a city'),
  postcode:    z.string().min(3, 'Valid postcode required'),
  amenities:   z.array(z.string()).optional(),
});
type Form = z.infer<typeof schema>;

const AMENITIES = ['High-speed WiFi', 'Gym Access', 'All Utilities', 'CCTV & Security', 'Study Lounge', 'Laundry'];

export default function AddPropertyPage() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema), defaultValues: { amenities: [] },
  });
  const amenities = watch('amenities') ?? [];
  const toggle = (a: string) =>
    setValue('amenities', amenities.includes(a) ? amenities.filter((x) => x !== a) : [...amenities, a]);
  const navigate = useNavigate();

  const onSubmit = async (d: Form) => {
    try {
      await apiPost('/properties', {
        name: d.name,
        description: d.description,
        location: `${d.city}, ${d.postcode}`,
        amenities: amenities,
        basePrice: 850 // Mock default price
      });
      alert('Property published successfully!');
      navigate('/owner/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to publish property.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">

      {/* Breadcrumb + header */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs font-medium mb-3">
          <span>Owner</span>
          <ChevronRight className="w-3 h-3" />
          <span>Properties</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0F172A] font-semibold">New Listing</span>
        </div>
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-[-0.025em]">
          List Your <span className="text-[#2563EB]">Property</span>
        </h1>
        <p className="text-[#64748B] text-sm mt-1.5">Reach thousands of students looking for their next home.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

        {/* General Info */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-7 hover:border-[#CBD5E1] transition-all duration-200">
          <div className="flex items-center gap-3.5 mb-7">
            <div className="w-10 h-10 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[12px] flex items-center justify-center">
              <Home className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-[#0F172A] font-bold text-base tracking-[-0.01em]">General Information</h2>
              <p className="text-[#94A3B8] text-xs mt-0.5">Basic property details</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[#0F172A] text-xs font-semibold mb-1.5">Property Name</label>
              <input {...register('name')} placeholder="e.g. Skyline Student Living" className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-[#0F172A] text-xs font-semibold mb-1.5">Description</label>
              <textarea {...register('description')} rows={4} placeholder="Describe the property and proximity to campus…" className="input-field resize-none" />
              {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description.message}</p>}
            </div>

            {/* Map placeholder */}
            <div>
              <label className="block text-[#0F172A] text-xs font-semibold mb-1.5">Location</label>
              <div className="h-48 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: 'linear-gradient(#0F172A 1px,transparent 1px),linear-gradient(90deg,#0F172A 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
                <button type="button" className="btn-secondary text-sm px-5 py-2.5 relative z-10">
                  <MapPin className="w-4 h-4 text-[#2563EB]" /> Pin Location on Map
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#0F172A] text-xs font-semibold mb-1.5">City</label>
                <select {...register('city')} className="input-field appearance-none cursor-pointer">
                  <option value="">Select city</option>
                  {['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-[#0F172A] text-xs font-semibold mb-1.5">Postcode</label>
                <input {...register('postcode')} placeholder="e.g. E1 8AN" className="input-field" />
                {errors.postcode && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.postcode.message}</p>}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-[#0F172A] text-xs font-semibold mb-2.5">Amenities & Features</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AMENITIES.map((a) => {
                  const isSelected = amenities.includes(a);
                  return (
                    <label key={a} className={`flex items-center gap-2.5 p-3.5 rounded-[12px] border cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-[#BFDBFE] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
                    }`}>
                      <div className={`w-4.5 h-4.5 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#CBD5E1]'
                      }`}>
                        {isSelected && <Check className="text-white w-3 h-3" strokeWidth={3} />}
                      </div>
                      <input type="checkbox" checked={isSelected} onChange={() => toggle(a)} className="sr-only" />
                      <span className={`text-xs font-medium ${isSelected ? 'text-[#1D4ED8]' : 'text-[#475569]'}`}>{a}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Room Inventory */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-7 hover:border-[#CBD5E1] transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-[#FFFBEB] border border-[#FDE68A] rounded-[12px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#D97706]" />
              </div>
              <div>
                <h2 className="text-[#0F172A] font-bold text-base tracking-[-0.01em]">Room Inventory</h2>
                <p className="text-[#94A3B8] text-xs mt-0.5">Configure unit types</p>
              </div>
            </div>
            <button type="button" className="btn-primary px-4 py-2.5 text-sm">
              <Plus className="w-4 h-4" /> Add Room Type
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] hover:border-[#CBD5E1] transition-all group">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                {[
                  { label: 'Room Type', value: 'Premium Studio' },
                  { label: 'Capacity',  value: '1 Resident' },
                  { label: 'Base Price', value: '£320/week' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-[#0F172A] text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 mt-4 sm:mt-0 sm:ml-4">
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-[9px] text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-[9px] text-[#94A3B8] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button type="button" className="w-full flex flex-col items-center justify-center py-10 border-2 border-dashed border-[#E2E8F0] rounded-[14px] hover:border-[#BFDBFE] hover:bg-[#F8FAFC] transition-all group text-[#94A3B8] hover:text-[#2563EB]">
              <div className="w-10 h-10 bg-white border border-[#E2E8F0] rounded-[11px] flex items-center justify-center mb-2.5 group-hover:border-[#BFDBFE] transition-all shadow-sm">
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold">Add another configuration</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-8">
          <button type="button" className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Save as Draft
          </button>
          <div className="flex gap-3 w-full sm:w-auto">
            <button type="button" className="btn-secondary flex-1 sm:flex-none px-6 py-3 text-sm">Cancel</button>
            <button type="submit" className="btn-primary flex-1 sm:flex-none px-8 py-3 text-sm group/next">
              Next: Media
              <ArrowRight className="w-4 h-4 group-hover/next:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
