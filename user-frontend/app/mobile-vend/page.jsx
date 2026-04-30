"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2, UserCircle2, KeyRound } from 'lucide-react';

function MobilePaymentContent() {
  const searchParams = useSearchParams();
  const tid = searchParams.get('tid');
  
  // States: 'checking', 'guest-form', 'processing', 'success', 'error'
  const [status, setStatus] = useState('checking');
  const [formData, setFormData] = useState({ identifier: '', pin: '' });
  const [errorDetail, setErrorDetail] = useState('');

  const processPayment = async (identifier, pin) => {
    setStatus('processing');
    setErrorDetail('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/machine/confirm-payment/${tid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, pin }) 
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorDetail(data.detail || 'Transaction failed');
      }
    } catch (err) {
      setStatus('error');
      setErrorDetail('Server unreachable');
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem('userEmail') || localStorage.getItem('userCnic');
    
    // 1. Initial Logic: Check for saved session
    if (savedId && tid) {
      // If logged in, we attempt auto-deduct. 
      // Note: Backend must handle "SESSION_AUTH" or similar if PIN is not stored locally for security.
      processPayment(savedId, "SESSION_AUTH"); 
    } else if (tid) {
      // 2. No session found: Transition to guest form
      setStatus('guest-form');
    }
  }, [tid]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#fff5f8]">
      
      {/* LOADING / CHECKING STATE */}
      {(status === 'checking' || status === 'processing') && (
        <div className="text-center space-y-4 animate-pulse">
          <Loader2 className="w-12 h-12 animate-spin text-[#d8a7b9] mx-auto" />
          <h1 className="text-xl font-bold text-[#4A3F3F]">
            {status === 'checking' ? 'Authorizing Session...' : 'Verifying Transaction...'}
          </h1>
          <p className="text-xs text-[#8C7A7A] uppercase tracking-widest">Glacia Labs Secure IoT</p>
        </div>
      )}

      {/* GUEST CHECKOUT FORM */}
      {status === 'guest-form' && (
        <div className="w-full max-w-sm bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif italic text-[#4A3F3F]">Guest Checkout</h2>
            <p className="text-xs text-[#8C7A7A] mt-2 uppercase tracking-tighter">Enter credentials to dispense</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <UserCircle2 className="absolute left-4 top-3.5 w-5 h-5 text-[#d8a7b9]" />
              <input 
                type="text" 
                placeholder="Email or CNIC"
                className="w-full p-4 pl-12 bg-[#FFF5F5] rounded-full text-sm outline-none border border-transparent focus:border-[#d8a7b9] transition-all"
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-[#d8a7b9]" />
              <input 
                type="password" 
                placeholder="4-Digit PIN"
                maxLength={4}
                className="w-full p-4 pl-12 bg-[#FFF5F5] rounded-full text-sm outline-none border border-transparent focus:border-[#d8a7b9] tracking-[0.5em] transition-all"
                onChange={(e) => setFormData({...formData, pin: e.target.value})}
              />
            </div>

            <button 
              onClick={() => processPayment(formData.identifier, formData.pin)}
              disabled={!formData.identifier || formData.pin.length < 4}
              className="w-full bg-[#4A3F3F] text-white py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#d8a7b9] transition-all shadow-lg disabled:opacity-30"
            >
              PAY & DISPENSE
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS UI */}
      {status === 'success' && (
        <div className="text-center space-y-4 animate-in zoom-in duration-300">
          <div className="bg-green-100 p-6 rounded-full inline-block">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-serif italic text-[#5a434f]">Payment Successful</h1>
          <p className="text-sm text-[#8C7A7A]">The machine is now dispensing your product.</p>
        </div>
      )}

      {/* ERROR UI */}
      {status === 'error' && (
        <div className="text-center space-y-6 w-full max-w-xs">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto" />
          <div>
            <h1 className="text-xl font-bold text-[#4A3F3F]">Action Required</h1>
            <p className="text-sm text-red-500 mt-1">{errorDetail}</p>
          </div>
          <button 
            onClick={() => setStatus('guest-form')}
            className="w-full bg-[#4A3F3F] text-white py-4 rounded-full font-bold text-xs tracking-widest shadow-md"
          >
            RE-ENTER DETAILS
          </button>
        </div>
      )}
    </div>
  );
}

export default function MobileVendPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin opacity-20" />
      </div>
    }>
      <MobilePaymentContent />
    </Suspense>
  );
}