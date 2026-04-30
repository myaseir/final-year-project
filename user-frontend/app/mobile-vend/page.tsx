"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// 1. Create a sub-component for the actual payment logic
function MobilePaymentContent() {
  const searchParams = useSearchParams();
  const tid = searchParams.get('tid');
  const pid = searchParams.get('pid');
  
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'

  const handleConfirmPayment = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/machine/confirm-payment/${tid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnic: "USER_CNIC_HERE" }) // In a real app, get this from user session
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#fff5f8]">
      {status === 'processing' && (
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#d8a7b9] mx-auto" />
          <h1 className="text-xl font-bold">Verifying Transaction...</h1>
          <button 
            onClick={handleConfirmPayment}
            className="px-8 py-3 bg-[#d8a7b9] text-white rounded-full font-bold shadow-lg"
          >
            CONFIRM PAYMENT
          </button>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center space-y-4 animate-in zoom-in">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          <h1 className="text-3xl font-serif italic text-[#5a434f]">Paid Successfully!</h1>
          <p className="text-sm opacity-60">You can now collect your product from the machine.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center space-y-4">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold">Payment Failed</h1>
          <p className="text-sm opacity-60">Please check your balance and try again.</p>
        </div>
      )}
    </div>
  );
}

// 2. Main Page Export wrapped in Suspense
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