'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../lib/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({ cnic: '', pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const res = await api.login(formData.cnic, formData.pin);
    
    // STRICT CHECK: Only proceed if backend returns success: true
    if (res && res.success === true) { 
      localStorage.setItem('userCnic', formData.cnic);
      router.push('/dashboard');
    } else {
      // If backend says success: false, show the error message
      setError(res.message || 'Incorrect CNIC or PIN. Please try again.');
    }
  } catch (err) {
    setError('Server is offline. Please check your backend.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 relative overflow-hidden">
      {/* Decorative Soft Glow Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#F9EAEA] rounded-full blur-[100px] opacity-60 -z-10"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#FFF5F5] rounded-full blur-[100px] opacity-60 -z-10"></div>

      {/* The Login Card */}
      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-2xl shadow-[#E29595]/5">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif italic text-[#4A3F3F]">Welcome back</h1>
          <p className="text-sm text-[#8C7A7A] mt-2 font-medium tracking-wide">
            Access your VendCare beauty wallet
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* CNIC Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E29595] ml-5">
              CNIC Identity
            </label>
            <input 
              type="text" 
              required
              placeholder="42101-XXXXXXX-X"
              className="w-full p-4 bg-white/80 border border-[#F9EAEA] rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-[#E29595]/10 transition-all placeholder:text-[#F3C5C5] text-[#4A3F3F]"
              onChange={(e) => setFormData({...formData, cnic: e.target.value})}
            />
          </div>

          {/* PIN Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E29595] ml-5">
              Security PIN
            </label>
            <input 
              type="password" 
              required
              placeholder="••••"
              maxLength={4}
              className="w-full p-4 bg-white/80 border border-[#F9EAEA] rounded-full text-sm tracking-[0.5em] focus:outline-none focus:ring-4 focus:ring-[#E29595]/10 transition-all placeholder:text-[#F3C5C5] text-[#4A3F3F]"
              onChange={(e) => setFormData({...formData, pin: e.target.value})}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-[11px] py-2 px-4 rounded-full text-center font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#4A3F3F] text-white py-4 rounded-full font-bold text-xs tracking-[0.2em] hover:bg-[#E29595] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#4A3F3F]/10 disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-xs text-[#8C7A7A] font-medium">
            New to the boutique?{' '}
            <Link href="/register" className="text-[#E29595] font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Aesthetic Footer Note */}
      <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#F3C5C5] font-bold">
        Secure IoT Authentication
      </p>
    </div>
  );
}