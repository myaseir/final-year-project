"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2, UserCircle2, KeyRound } from 'lucide-react';

function MobilePaymentContent() {
  const searchParams = useSearchParams();
  const tid = searchParams.get('tid');
  
  const [status, setStatus] = useState('checking'); 
  const [formData, setFormData] = useState({ identifier: '', pin: '' });
  const [errorDetail, setErrorDetail] = useState('');
  const [mounted, setMounted] = useState(false);

  // Set mounted to true once component hits the browser
  useEffect(() => {
    setMounted(true);
  }, []);

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
        setErrorDetail(data.detail || 'Invalid credentials or balance');
      }
    } catch (err) {
      setStatus('error');
      setErrorDetail('Server unreachable. Ensure backend is live.');
    }
  };

  useEffect(() => {
    // Only run this if the component is mounted and tid exists
    if (!mounted || !tid) return;

    const checkSession = () => {
      const savedEmail = localStorage.getItem('userEmail');
      const savedCnic = localStorage.getItem('userCnic');
      const savedId = savedEmail || savedCnic;
      
      if (savedId) {
        processPayment(savedId, "SESSION_AUTH"); 
      } else {
        // Force the UI to show the form if no identity exists
        setStatus('guest-form');
      }
    };

    // Small delay ensures localStorage is accessible after hydration
    const timer = setTimeout(checkSession, 500);
    return () => clearTimeout(timer);
  }, [mounted, tid]);

  // Safety UI for missing TID
  if (mounted && !tid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#fff5f8]">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h1 className="text-xl font-bold text-[#4A3F3F]">Invalid URL</h1>
        <p className="text-sm text-[#8C7A7A]">Transaction ID is missing from QR code.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#fff5f8]">
      
      {(status === 'checking' || status === 'processing') && (
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#d8a7b9] mx-auto" />
          <h1 className="text-xl font-bold text-[#4A3F3F]">
            {status === 'checking' ? 'Authorizing Session...' : 'Verifying Transaction...'}
          </h1>
          <p className="text-xs text-[#8C7A7A] uppercase tracking-[0.2em] font-medium">
            Glacia Labs Secure IoT
          </p>
        </div>
      )}

      {status === 'guest-form' && (
        <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-2xl border border-white animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif italic text-[#4A3F3F]">Secure Payment</h2>
            <p className="text-xs text-[#8C7A7A] mt-2 uppercase tracking-widest font-bold">
              Verification Required
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <UserCircle2 className="absolute left-4 top-3.5 w-5 h-5 text-[#d8a7b9]" />
              <input 
                type="text" 
                placeholder="Email or CNIC"
                className="w-full p-4 pl-12 bg-[#FFF5F5] rounded-full text-sm outline-none border border-transparent focus:border-[#d8a7b9] transition-all text-[#4A3F3F]"
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-[#d8a7b9]" />
              <input 
                type="password" 
                placeholder="4-Digit PIN"
                maxLength={4}
                className="w-full p-4 pl-12 bg-[#FFF5F5] rounded-full text-sm outline-none border border-transparent focus:border-[#d8a7b9] tracking-[0.5em] text-[#4A3F3F]"
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

      {status === 'success' && (
        <div className="text-center space-y-4 animate-in zoom-in duration-300">
          <div className="bg-green-100 p-6 rounded-full inline-block">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-serif italic text-[#5a434f]">Payment Successful</h1>
          <p className="text-sm text-[#8C7A7A]">Please collect your product from the machine.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center space-y-6 w-full max-w-xs">
          <div className="bg-red-50 p-6 rounded-full inline-block">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#4A3F3F]">Verification Failed</h1>
            <p className="text-sm text-red-500 mt-2 font-medium">{errorDetail}</p>
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
    <Suspense fallback={null}>
      <MobilePaymentContent />
    </Suspense>
  );
}