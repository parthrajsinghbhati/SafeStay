import { Mail, Phone, MessageSquare, ChevronDown, HelpCircle, FileText, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FAQS = [
  {
    question: "How do I book a room on SafeStay?",
    answer: "Browse available properties using our search filters, select your preferred room, customize any add-ons, and proceed to the secure payment modal to confirm your booking instantly."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major Credit/Debit cards, and UPI (GPay, PhonePe, Paytm). Payments are securely held in escrow until you move in to guarantee your safety."
  },
  {
    question: "How do I request maintenance?",
    answer: "Navigate to the 'Maintenance' tab in your dashboard, click 'New Request', describe your issue, and our verified team will attend to it within 24-48 hours."
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking within 48 hours for a full refund minus a small processing fee. Refer to our cancellation policy in your signed contract for more details."
  },
  {
    question: "Is my personal data secure?",
    answer: "Absolutely. We employ bank-grade encryption to secure all personal data and payment details. We will never share your private information with unverified third parties."
  }
];

const CATEGORIES = [
  { title: "Booking & Payments", icon: CreditCardIcon, desc: "Issues with transactions and room reservations", path: "/bookings" },
  { title: "Account Settings", icon: SettingsIcon, desc: "Profile updates, password resets, and notifications", path: "/settings" },
  { title: "Maintenance", icon: WrenchIcon, desc: "Tracking and requesting verified maintenance", path: "/maintenance" },
  { title: "Legal & Contracts", icon: FileTextIcon, desc: "Understanding escrow clauses and agreements", isLegal: true }
];

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showLegal, setShowLegal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCategoryClick = (cat: any) => {
    if (cat.isLegal) {
      setShowLegal(true);
    } else {
      const prefix = user?.role === 'OWNER' ? '/owner' : '';
      navigate(`${prefix}${cat.path}`);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in relative">
      
      {/* Header / About Us */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-3xl p-8 sm:p-12 mb-10 text-center relative overflow-hidden shadow-[var(--shadow-glow)] border border-[#1E3A8A]/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 display-font tracking-tight">About SafeStay</h1>
          <p className="text-white/95 text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
            SafeStay is dedicated to revolutionizing student housing by providing secure, verified, and hassle-free accommodations. We bridge the gap between students and property owners via transparent escrow payments and automated contract management.
          </p>
          <p className="text-white/80 text-[15px] max-w-xl mx-auto">
            Our mission is to create a safe ecosystem where students can focus solely on their education while we seamlessly handle the complexities of off-campus living.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-[var(--text)] mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => handleCategoryClick(cat)}
              className="bg-white border border-[#E2E8F0] p-5 rounded-[18px] hover:border-[#2563EB] hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <cat.icon className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h3 className="font-bold text-[var(--text)] mb-1.5">{cat.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* left col: Contact Block */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <h3 className="font-bold text-lg text-[var(--text)] mb-5">Still need help?</h3>
            
            <div className="space-y-4">
              <button className="w-full border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-4 hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all group text-left">
                <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                  <MessageSquare className="w-5 h-5 text-[#64748B] group-hover:text-[#2563EB]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[var(--text)]">Live Chat</p>
                  <p className="text-xs text-[var(--text-muted)]">Available 24/7</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#2563EB]" />
              </button>

              <button className="w-full border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-4 hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all group text-left">
                <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                  <Mail className="w-5 h-5 text-[#64748B] group-hover:text-[#2563EB]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[var(--text)]">Email Support</p>
                  <p className="text-xs text-[var(--text-muted)]">support@safestay.com</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#2563EB]" />
              </button>

              <button className="w-full border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-4 hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all group text-left">
                <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                  <Phone className="w-5 h-5 text-[#64748B] group-hover:text-[#2563EB]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[var(--text)]">Call Us</p>
                  <p className="text-xs text-[var(--text-muted)]">+1 (800) 123-4567</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#2563EB]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right col: FAQs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-bold text-lg text-[var(--text)] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2563EB]" />
                Recently Asked Questions
              </h3>
            </div>
            
            <div className="divide-y divide-[#E2E8F0]">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="group">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-5 flex items-start justify-between min-h-[64px] hover:bg-[#F8FAFC] transition-colors focus:outline-none"
                  >
                    <span className={`font-semibold pr-6 ${openFaq === idx ? 'text-[#2563EB]' : 'text-[var(--text)] group-hover:text-[#2563EB]'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown className={`shrink-0 w-5 h-5 text-[#94A3B8] transition-transform duration-300 mt-0.5 ${openFaq === idx ? 'rotate-180 text-[#2563EB]' : ''}`} />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-5 pt-0 pb-6 text-[#64748B] text-[14px] leading-relaxed border-l-2 border-[#2563EB] ml-5 bg-[#F8FAFC]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Contracts Modal Container */}
      {showLegal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowLegal(false)}>
          <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-[0_32px_64px_rgba(0,0,0,0.2)] animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-[#0F172A] tracking-[-0.02em]">
                  <FileText className="w-5 h-5 text-[#2563EB]" /> 
                  Legal & Contracts
                </h2>
                <p className="text-[#64748B] text-sm mt-1">Review the standard policies of the SafeStay platform.</p>
              </div>
              <button 
                onClick={() => setShowLegal(false)} 
                className="w-10 h-10 flex items-center justify-center bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-[10px] transition-all text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-7 text-[#475569] text-[15px] leading-relaxed bg-[#F8FAFC]">
              
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[#0F172A] font-bold text-lg mb-2.5">1. Terms of Service</h3>
                <p>By using SafeStay, you agree to abide by our platform guidelines ensuring transparent and fair use. Accounts found violating community standards, participating in fraudulent listings, or attempting off-platform illicit transactions will be subject to permanent suspension.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[#0F172A] font-bold text-lg mb-2.5">2. Escrow Payment Agreement</h3>
                <p>All rental payments are intelligently held securely in a verified escrow structure until the student confirms move-in or a minimum of 48 hours elapses post-occupancy date. This strictly prevents arbitrary seizures and protects the student's primary investment.</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[#0F172A] font-bold text-lg mb-2.5">3. Cancellation Policy</h3>
                <p>Bookings canceled within 48 hours of reservation are fully refundable minus a nominal 2% payment processing fee from our gateway partner. Extended cancellations are subject to the specific property owner's terms explicitly mapped out in the active digital contract upon request.</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[#0F172A] font-bold text-lg mb-2.5">4. Privacy & Data</h3>
                <p>We implement strict encryption protocols. Your data is not sold to external vendors or ad-farms. Verified legal authorities may only request access to transactional metadata strictly under validated, formal court subpoenas.</p>
              </div>

            </div>
            <div className="p-6 bg-white border-t border-[#E2E8F0] flex justify-end">
              <button onClick={() => setShowLegal(false)} className="btn-primary px-8 py-2.5">Acknowledge</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}

function WrenchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  );
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}
