import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Eye, EyeOff, Shield, ArrowRight, CheckCircle2,
  Building2, GraduationCap, AlertCircle, Loader2, Sparkles
} from 'lucide-react';
import type { UserRole } from '../types';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
type Form = z.infer<typeof schema>;

const FEATURES = [
  { label: 'Verified Listings', desc: 'Every property is manually inspected and certified' },
  { label: 'Secure Payments',   desc: 'Bank-grade encryption protects every transaction' },
  { label: '24/7 Support',      desc: 'Dedicated team available around the clock' },
];

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [show, setShow] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [err, setErr] = useState('');
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setErr('');
    try {
      if (isRegistering) {
        if (!data.firstName || !data.lastName) {
          setErr('First and Last name are required for registration.');
          return;
        }
        await registerUser(data.email, data.password, role, data.firstName, data.lastName);
      } else {
        await login(data.email, data.password, role);
      }
      navigate(role === 'OWNER' ? '/owner/dashboard' : '/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error || `Failed to ${isRegistering ? 'register' : 'login'}.`;
      setErr(message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex font-['Manrope'] animate-fade-in relative overflow-hidden text-[var(--text)]">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-[20%] w-[800px] h-[800px] bg-[var(--primary)] opacity-[0.05] rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--primary-container)] opacity-[0.06] rounded-full blur-[100px] pointer-events-none" />

      {/* ── Left: Branding Panel ── */}
      <div className="hidden lg:flex w-[500px] xl:w-[600px] shrink-0 flex-col bg-[var(--surface-low)] px-14 py-16 xl:px-20 xl:py-20 relative z-10 border-r border-[var(--border)] glass">
        
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(var(--text-muted) 1px,transparent 1px),linear-gradient(90deg,var(--text-muted) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10 pl-2">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-container)] flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[var(--text)] font-bold text-2xl tracking-[-0.02em] display-font">SafeStay</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center mt-16 max-w-sm xl:max-w-md mx-auto xl:mx-0 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-high)] border border-[var(--border)] text-[var(--primary)] text-[11px] font-semibold uppercase tracking-wider mb-8 w-fit shadow-[var(--shadow-ambient)]">
            <Sparkles className="w-3.5 h-3.5" />
            Premium Student Housing
          </div>

          <h1 className="text-[3.2rem] xl:text-[4rem] font-bold text-[var(--text)] leading-[1.05] tracking-[-0.03em] mb-6 display-font">
            Find Your <br />
            Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)]">Stay</span>.
          </h1>
          <p className="text-[var(--text-muted)] text-[1.05rem] leading-relaxed">
            Discover verified properties, secure your next home, and elevate your student living experience.
          </p>

          {/* Feature list */}
          <div className="mt-14 space-y-7">
            {FEATURES.map((f) => (
               <div key={f.label} className="flex items-start gap-4">
                 <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-high)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-[var(--shadow-ambient)]">
                   <CheckCircle2 className="w-4.5 h-4.5 text-[var(--primary)]" />
                 </div>
                 <div>
                   <p className="text-[var(--text)] text-[0.95rem] font-semibold display-font">{f.label}</p>
                   <p className="text-[var(--text-muted)] text-[0.8rem] mt-1 leading-relaxed">{f.desc}</p>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 relative z-10">
        <div className="w-full max-w-[480px] animate-slide-up card glass !p-8 sm:!p-12">
          
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-container)] flex items-center justify-center shadow-[var(--shadow-glow)]">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[var(--text)] font-bold text-xl tracking-[-0.02em] display-font">SafeStay</span>
          </div>

          {/* Heading */}
          <div className="mb-10 text-left">
            <h2 className="text-[2.2rem] font-bold text-[var(--text)] tracking-[-0.025em] mb-2 display-font">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-[var(--text-muted)] text-[0.9rem]">
              {isRegistering ? 'Join SafeStay to find your perfect student home' : 'Sign in to access your dashboard'}
            </p>
          </div>

          {/* Role toggle */}
          <div className="flex p-1.5 bg-[var(--surface-high)] border border-[var(--border)] rounded-[14px] mb-8 shadow-inner">
            {([['STUDENT', 'Student', GraduationCap], ['OWNER', 'Asset Owner', Building2]] as const).map(([r, label, Icon]) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r as UserRole)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[11px] text-sm font-semibold transition-all duration-300 ${
                  role === r
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] text-white shadow-[var(--shadow-glow)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-highest)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {isRegistering && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text)] text-xs font-semibold mb-2 uppercase tracking-wider">First Name</label>
                  <input {...register('firstName')} placeholder="John" className="input-field" />
                </div>
                <div>
                  <label className="block text-[var(--text)] text-xs font-semibold mb-2 uppercase tracking-wider">Last Name</label>
                  <input {...register('lastName')} placeholder="Doe" className="input-field" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[var(--text)] text-xs font-semibold mb-2 uppercase tracking-wider">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                className="input-field"
              />
              {errors.email && (
                <p className="flex items-center gap-1.5 text-[var(--error)] text-xs mt-2 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />{errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[var(--text)] text-xs font-semibold uppercase tracking-wider">Passcode</label>
                <button type="button" className="text-[var(--primary)] text-xs font-semibold hover:text-[var(--primary-hover)] transition-colors">
                  Recover Access?
                </button>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {show ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1.5 text-[var(--error)] text-xs mt-2 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />{errors.password.message}
                </p>
              )}
            </div>

            {err && (
              <div className="flex items-center gap-3 bg-[var(--error-container)] border border-[var(--error)] rounded-[12px] p-4 text-[var(--on-error-container)] text-sm font-medium shadow-[var(--shadow-ambient)]">
                <AlertCircle className="w-4 h-4 shrink-0 text-[var(--error)]" />
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              onMouseEnter={() => setIsLoginHovered(true)}
              onMouseLeave={() => setIsLoginHovered(false)}
              className="btn-primary w-full py-3.5 text-base mt-4 group"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {isRegistering ? 'Creating Account…' : 'Signing In…'}</>
              ) : (
                <>{isRegistering ? 'Sign Up' : 'Sign In'} <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isLoginHovered ? 'translate-x-1' : ''}`} /></>
              )}
            </button>
            
            <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button" 
                onClick={() => { setIsRegistering(!isRegistering); setErr(''); }}
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                {isRegistering ? 'Log in here' : 'Sign up now'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
