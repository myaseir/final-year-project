"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function MobilePaymentContent() {
  const searchParams = useSearchParams();
  const tid = searchParams.get('tid');
  const [status, setStatus] = useState('processing');

  const handleConfirmPayment = async () => {
    // 1. Get the actual user identity saved during login
    const userIdentifier = localStorage.getItem('userEmail') || localStorage.getItem('userCnic');

    if (!userIdentifier || !tid) {
      setStatus('error');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/machine/confirm-payment/${tid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. Updated key to 'identifier' to match your new Backend schema
        body: JSON.stringify({ identifier: userIdentifier }) 
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  // 3. Trigger the payment automatically when the page loads
  useEffect(() => {
    if (tid) {
      handleConfirmPayment();
    }
  }, [tid]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#fff5f8]">
      {status === 'processing' && (
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#d8a7b9] mx-auto" />
          <h1 className="text-xl font-bold text-[#4A3F3F]">Verifying Transaction...</h1>
          <p className="text-sm text-[#8C7A7A]">Communicating with the VendCare machine</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center space-y-4 animate-in zoom-in">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          <h1 className="text-3xl font-serif italic text-[#5a434f]">Paid Successfully!</h1>
          <p className="text-sm opacity-60">Collect your product from the machine now.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center space-y-6">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold">Verification Failed</h1>
          <button 
            onClick={handleConfirmPayment}
            className="px-8 py-3 bg-[#4A3F3F] text-white rounded-full font-bold shadow-lg text-xs tracking-widest"
          >
            TRY AGAIN
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