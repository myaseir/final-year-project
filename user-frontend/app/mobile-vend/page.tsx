"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight,
  Package,
  AlertCircle
} from 'lucide-react';

// Product data should ideally come from an API, 
// but for now, we match the Kiosk's CONTENT_MAP
const PRODUCT_DATA: Record<string, { name: string; price: number; category: string }> = {
  "p1": { name: "Floral Breeze", price: 120, category: "Perfume" },
  "p2": { name: "Midnight Musk", price: 150, category: "Perfume" },
  "p3": { name: "Oceanic Mist", price: 80, category: "Perfume" },
  "m1": { name: "Aqua Surge", price: 450, category: "Moisturizer" },
  // ... add other IDs as needed
};

export default function MobileVendPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tid = searchParams.get('tid');
  const pid = searchParams.get('pid');

  const [status, setStatus] = useState<'review' | 'processing' | 'success' | 'error'>('review');
  const [errorMessage, setErrorMessage] = useState("");
  
  const product = pid ? PRODUCT_DATA[pid] : null;

  const handlePayment = async () => {
    if (!tid) return;
    setStatus('processing');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      
      // Call the backend confirmation route
      const response = await fetch(`${baseUrl}/api/machine/confirm-payment/${tid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Payment failed");
      }

      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  if (!tid || !product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-[#fff5f8] text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h1 className="text-xl font-bold text-[#5a434f]">Invalid Session</h1>
        <p className="text-sm opacity-60">Please rescan the QR code on the machine.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff5f8] font-sans text-[#5a434f] flex flex-col">
      {/* Soft Luxury Header */}
      <header className="p-8 flex justify-between items-center">
        <div className="h-10 w-10 rounded-full bg-[#d8a7b9] flex items-center justify-center shadow-lg">
          <span className="text-white font-serif italic font-bold">V</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
          <ShieldCheck size={14} />
          Secure Checkout
        </div>
      </header>

      <main className="flex-grow px-8 flex flex-col justify-center">
        {status === 'review' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">Confirm Purchase</p>
            <h1 className="text-4xl font-serif italic mb-8">{product.name}</h1>
            
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#f3d8e5] mb-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm opacity-50">Category</span>
                <span className="text-sm font-bold">{product.category}</span>
              </div>
              <div className="flex justify-between items-center py-6 border-t border-dashed border-[#f3d8e5]">
                <span className="text-lg">Total</span>
                <span className="text-3xl font-serif italic font-bold">PKR {product.price}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              className="w-full bg-[#d8a7b9] text-white py-6 rounded-full font-bold text-sm tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              PAY NOW <ArrowRight size={18} />
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 border-4 border-[#d8a7b9] border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="font-bold uppercase tracking-widest text-[10px]">Authorizing Transaction...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-serif italic mb-2">Thank You!</h2>
            <p className="text-sm opacity-60 mb-8">Your product is being dispensed at the machine.</p>
            <button 
              onClick={() => router.push('/')}
              className="px-8 py-4 border border-[#d8a7b9] text-[#d8a7b9] rounded-full text-[10px] font-bold uppercase tracking-widest"
            >
              Back to Home
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Payment Failed</h2>
            <p className="text-sm opacity-60 mb-6">{errorMessage}</p>
            <button 
              onClick={() => setStatus('review')}
              className="text-[#d8a7b9] font-bold text-[10px] uppercase tracking-widest underline"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <footer className="p-8 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-30">
          Powered by Glacia Labs &bull; VendCare 2.0
        </p>
      </footer>
    </div>
  );
}