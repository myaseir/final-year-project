'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../lib/api'; // Import your API service

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    cnic: '',
    pin: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  
  // 1. Frontend Validation (Quick checks)
  
  setLoading(true);
  try {
    const res = await api.register(formData);
    if (res.success) {
      router.push('/login?status=registered');
    } else {
      // This is where your backend will send "CNIC already exists" 
      // or "Email already in use". Display it here:
      setError(res.message); 
    }
  } catch (err) {
    setError('Registration failed. Server error.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 py-16 relative overflow-hidden">
      {/* Soft Gradient Decorative Elements */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#FFF5F5] rounded-full blur-[100px] opacity-70 -z-10"></div>
      <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-[#F9EAEA] rounded-full blur-[100px] opacity-70 -z-10"></div>

      {/* Register Card with Frosted Glass Look */}
      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-2xl shadow-[#E29595]/5">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif italic text-[#4A3F3F]">Join the boutique</h1>
          <p className="text-sm text-[#8C7A7A] mt-2 font-medium tracking-wide">
            Create your VendCare beauty profile
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-10 space-y-5">
          
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <input 
              type="text" 
              required
              placeholder="Your Full Name"
              className="w-full p-4.5 bg-white/80 border border-[#F9EAEA] rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-[#E29595]/10 transition-all placeholder:text-[#F3C5C5] text-[#4A3F3F]"
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <input 
              type="email" 
              required
              placeholder="Email Address"
              className="w-full p-4.5 bg-white/80 border border-[#F9EAEA] rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-[#E29595]/10 transition-all placeholder:text-[#F3C5C5] text-[#4A3F3F]"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* CNIC Input */}
          <div className="space-y-1.5">
            <input 
              type="text" 
              required
              placeholder="CNIC (e.g., 4210112345671)"
              className="w-full p-4.5 bg-white/80 border border-[#F9EAEA] rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-[#E29595]/10 transition-all placeholder:text-[#F3C5C5] text-[#4A3F3F]"
              onChange={(e) => setFormData({...formData, cnic: e.target.value})}
            />
          </div>

          {/* PIN Input */}
          <div className="space-y-1.5">
            <input 
              type="password" 
              required
              maxLength={4}
              placeholder="Set 4-Digit Security PIN"
              className="w-full p-4.5 bg-white/80 border border-[#F9EAEA] rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-[#E29595]/10 transition-all placeholder:text-[#F3C5C5] text-[#4A3F3F]"
              onChange={(e) => setFormData({...formData, pin: e.target.value})}
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-[11px] py-2 px-4 rounded-full text-center font-medium mt-2">
              {error}
            </div>
          )}

          {/* Register Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E29595] text-white py-4.5 rounded-full font-bold text-xs tracking-[0.2em] hover:bg-[#D48484] transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#E29595]/20 disabled:opacity-50 mt-6"
          >
            {loading ? 'CREATING PROFILE...' : 'JOIN NOW'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-xs text-[#8C7A7A] font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-[#4A3F3F] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}