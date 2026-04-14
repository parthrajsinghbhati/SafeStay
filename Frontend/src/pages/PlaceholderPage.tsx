import { Construction } from 'lucide-react';

interface Props { title: string; }

export default function PlaceholderPage({ title }: Props) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="text-center bg-white border border-[#E2E8F0] rounded-[20px] p-12 sm:p-16 max-w-sm w-full shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
        <div className="w-14 h-14 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[16px] flex items-center justify-center mx-auto mb-5">
          <Construction className="w-7 h-7 text-[#2563EB]" />
        </div>
        <h2 className="text-[#0F172A] text-xl font-bold tracking-[-0.02em] mb-2">{title}</h2>
        <p className="text-[#64748B] text-sm leading-relaxed">This section is coming soon. We're working hard to bring it to you.</p>
        <button className="btn-primary mt-6 px-6 py-2.5 text-sm">Go Back</button>
      </div>
    </div>
  );
}
