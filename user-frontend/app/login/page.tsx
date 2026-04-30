'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../lib/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({ identifier: '', pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(formData.identifier, formData.pin);
      
      if (res && res.success === true) { 
        localStorage.setItem('userCnic', res.user.cnic);
        localStorage.setItem('userEmail', res.user.email);
        router.push('/dashboard');
      } else {
        setError(res.message || 'Invalid Credentials. Please try again.');
      }
    } catch (err) {
      setError('Server connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 relative overflow-hidden bg-white">
      {/* Decorative Soft Glow Blobs - Kept subtle */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#F9EAEA] rounded-full blur-[100px] opacity-40 -z-10"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#FFF5F5] rounded-full blur-[100px] opacity-40 -z-10"></div>

      {/* The Login Card - Switched to solid white for mobile consistency */}
      <div className="w-full max-w-md bg-white border border-[#F9EAEA] p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-[#E29595]/5">
        
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl font-serif italic text-[#4A3F3F]">Welcome back</h1>
          <p className="text-xs md:text-sm text-[#8C7A7A] mt-2 font-medium tracking-wide">
            Access your VendCare beauty wallet
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
          {/* Identity Input (Email or CNIC) */}
          <div className="space-y-1.5">
            <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-[#E29595] ml-5">
              Account Identity
            </label>
            <input 
              type="text" 
              required
              placeholder="Email or CNIC Number"
              className="w-full p-4 bg-[#FFFDFD] border border-[#F9EAEA] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#E29595]/10 transition-all placeholder:text-[#F3C5C5] text-[#4A3F3F]"
              onChange={(e) => setFormData({...formData, identifier: e.target.value})}
            />
          </div>

          {/* PIN Input */}
          <div className="space-y-1.5">
            <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-[#E29595] ml-5">
              Security PIN
            </label>
            <input 
              type="password" 
              required
              placeholder="••••"
              maxLength={4}
              className="w-full p-4 bg-[#FFFDFD] border border-[#F9EAEA] rounded-full text-sm tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#E29595]/10 transition-all placeholder:text-[#F3C5C5] text-[#4A3F3F]"
              onChange={(e) => setFormData({...formData, pin: e.target.value})}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-50 text-red-500 text-[10px] py-2 px-4 rounded-full text-center font-bold animate-in fade-in zoom-in">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#4A3F3F] text-white py-4 rounded-full font-bold text-[11px] tracking-[0.2em] hover:bg-[#E29595] transition-all transform active:scale-95 shadow-lg disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8 md:mt-10 text-center">
          <p className="text-[11px] text-[#8C7A7A] font-medium">
            New to the boutique?{' '}
            <Link href="/register" className="text-[#E29595] font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-[9px] uppercase tracking-[0.3em] text-[#F3C5C5] font-bold">
        Secure IoT Authentication
      </p>
    </div>
  );
}