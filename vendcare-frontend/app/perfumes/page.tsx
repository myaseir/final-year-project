"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';

export default function PerfumeSelectionPage() {
const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  // Tell TS this will be a string (the product ID) or null
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null); 
  
  // Tell TS exactly what properties the transaction object will have
  const [activeTransaction, setActiveTransaction] = useState<{
    transactionId: string;
    checkoutUrl: string;
  } | null>(null); 
  
  // Tell TS exactly what properties the product object will have
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    price: number;
  } | null>(null);
  // 1. Fetch Stripe Checkout URL from FastAPI backend
  const handleSelect = async (productId: string, productName: string, price: number) => {
    setLoadingProduct(productId);
    setSelectedProduct({ name: productName, price: price });
    
    try {
      // Connects to your FastAPI server
      const response = await fetch('http://localhost:8000/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, price: price }),
      });

      if (!response.ok) throw new Error("Failed to create payment");

      const data = await response.json();
      
      // Backend returns a checkout URL and a unique Transaction ID
      setActiveTransaction({
        transactionId: data.transaction_id,
        checkoutUrl: data.checkout_url
      });

    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingProduct(null);
    }
  };

  // 2. Listen for WebSocket payment confirmation
  useEffect(() => {
    if (!activeTransaction?.transactionId) return;

    // Connect to FastAPI WebSocket endpoint
    const ws = new WebSocket(`ws://localhost:8000/ws/payment-status/${activeTransaction.transactionId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // If Stripe Webhook told FastAPI the payment is successful:
      if (data.status === 'PAID') {
        setShowSuccess(true);
        setActiveTransaction(null); // Clear the QR code
        
        // Hide modal and reset UI after 4 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedProduct(null);
        }, 4000);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup websocket on unmount or transaction change
    return () => {
      ws.close();
    };
  }, [activeTransaction?.transactionId]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fff5f8] text-gray-800 font-sans relative">
      
      {/* Header */}
      <header className="relative flex justify-between items-center px-6 py-4">
        <div className="flex-1"></div>
        
        {/* Logo - Clickable to return home */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-3 hover:opacity-80 transition cursor-pointer z-10">
          <svg width="32" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#d8a7b9] mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5-3-4-5-7-5 0-3.5 2.5-6 6-7 .5-1.5 1-3 1-3s.5 1.5 1 3c3.5 1 6 3.5 6 7-3 0-5.5 2-7 5z" />
          </svg>
          <span className="text-xl tracking-[0.15em] font-light text-[#7a5c68]">VEND CARE</span>
        </Link>

        {/* Right Actions */}
        <div className="flex-1 flex justify-end gap-6 relative z-10">
          <button className="flex flex-col items-center text-[#7a5c68] hover:text-[#b58396] transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span className="text-sm">Admin</span>
          </button>
          <button className="flex flex-col items-center text-[#7a5c68] hover:text-[#b58396] transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-sm">Login</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-10 px-6 pb-24 max-w-5xl mx-auto w-full">
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl mb-10 text-[#5a434f] font-medium">
          Select Your Perfume Brand
        </h1>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          
          {/* Left Column: Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Product 1: Floral Breeze */}
            <div className="w-[240px] bg-white border border-[#f3d8e5] rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition duration-300">
              <div className="h-40 flex justify-center items-center mb-4 relative">
                <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="18" r="6" fill="#fde8f0" stroke="#d8a7b9" strokeWidth="1.5"/>
                  <rect x="27" y="24" width="6" height="6" fill="#d8a7b9" />
                  <path d="M30 30 C 5 40, 5 85, 30 90 C 55 85, 55 40, 30 30 Z" fill="#fcf0f5" stroke="#d8a7b9" strokeWidth="1.5"/>
                  <rect x="18" y="55" width="24" height="14" fill="#ffffff" rx="2" stroke="#f3d8e5" strokeWidth="1"/>
                  <text x="30" y="64" fontSize="5.5" fill="#a87c90" textAnchor="middle" fontWeight="bold" letterSpacing="1">FLORAL</text>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#5a434f] leading-tight">Floral Breeze</h3>
              <p className="text-[#8c6b7b] text-sm mb-3">Eau de Parfum</p>
              <p className="text-xl font-bold text-[#5a434f] mb-4">₹120</p>
              <button 
                onClick={() => handleSelect('prod_floral_01', 'Floral Breeze', 120)}
                disabled={loadingProduct === 'prod_floral_01'}
                className="mt-auto w-full bg-[#d8a7b9] text-white py-2.5 rounded-xl font-medium tracking-wide hover:bg-[#c48ba0] transition disabled:opacity-70"
              >
                {loadingProduct === 'prod_floral_01' ? 'LOADING...' : 'SELECT'}
              </button>
            </div>

            {/* Product 2: Rose Musk */}
            <div className="w-[240px] bg-white border border-[#f3d8e5] rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition duration-300">
              <div className="h-40 flex justify-center items-center mb-4">
                <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="15" width="16" height="15" fill="#a87c90" rx="1"/>
                  <rect x="23" y="16" width="4" height="13" fill="#c48ba0" rx="0.5"/>
                  <rect x="26" y="30" width="8" height="5" fill="#fde8f0" />
                  <rect x="15" y="35" width="30" height="55" fill="#fcf0f5" stroke="#a87c90" strokeWidth="1.5" rx="3"/>
                  <rect x="18" y="45" width="24" height="42" fill="#fde8f0" rx="1"/>
                  <rect x="20" y="55" width="20" height="15" fill="#ffffff" stroke="#f3d8e5" strokeWidth="1"/>
                  <text x="30" y="64" fontSize="6" fill="#7a5c68" textAnchor="middle" letterSpacing="1.5">MUSK</text>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#5a434f] leading-tight">Rose Musk</h3>
              <p className="text-[#8c6b7b] text-sm mb-3">Cologne</p>
              <p className="text-xl font-bold text-[#5a434f] mb-4">₹150</p>
              <button 
                onClick={() => handleSelect('prod_musk_02', 'Rose Musk', 150)}
                disabled={loadingProduct === 'prod_musk_02'}
                className="mt-auto w-full bg-[#d8a7b9] text-white py-2.5 rounded-xl font-medium tracking-wide hover:bg-[#c48ba0] transition disabled:opacity-70"
              >
                {loadingProduct === 'prod_musk_02' ? 'LOADING...' : 'SELECT'}
              </button>
            </div>

            {/* Product 3: Berry Splash */}
            <div className="w-[240px] bg-white border border-[#f3d8e5] rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition duration-300">
              <div className="h-40 flex justify-center items-center mb-4">
                 <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="30,12 36,25 24,25" fill="#c48ba0" />
                  <rect x="27" y="25" width="6" height="5" fill="#fde8f0" />
                  <polygon points="30,30 55,60 30,90 5,60" fill="#fcf0f5" stroke="#c48ba0" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polygon points="30,30 45,60 30,90 15,60" fill="#f3d8e5" opacity="0.6"/>
                  <line x1="15" y1="60" x2="45" y2="60" stroke="#c48ba0" strokeWidth="0.5" opacity="0.5"/>
                  <circle cx="30" cy="60" r="10" fill="#ffffff" />
                  <text x="30" y="61.5" fontSize="4.5" fill="#7a5c68" textAnchor="middle" fontWeight="bold">BERRY</text>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#5a434f] leading-tight">Berry Splash</h3>
              <p className="text-[#8c6b7b] text-sm mb-3">Body Mist</p>
              <p className="text-xl font-bold text-[#5a434f] mb-4">₹80</p>
              <button 
                onClick={() => handleSelect('prod_berry_03', 'Berry Splash', 80)}
                disabled={loadingProduct === 'prod_berry_03'}
                className="mt-auto w-full bg-[#d8a7b9] text-white py-2.5 rounded-xl font-medium tracking-wide hover:bg-[#c48ba0] transition disabled:opacity-70"
              >
                {loadingProduct === 'prod_berry_03' ? 'LOADING...' : 'SELECT'}
              </button>
            </div>

          </div>

          {/* Right Column: Payment & QR Code */}
          <div className="w-[300px] h-fit bg-[#fce3ec] rounded-2xl flex flex-col items-center pt-7 pb-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#7a5c68] tracking-wide mb-5">PAYMENT</h2>
            
            <div className="w-full bg-[#faebf0] py-3 text-center border-y border-[#f3d8e5] mb-6 min-h-[48px]">
              {selectedProduct ? (
                 <span className="font-semibold text-[#5a434f] tracking-wide">TOTAL AMOUNT: ₹{selectedProduct.price}</span>
              ) : (
                 <span className="text-[#a87c90] text-sm">Select a product</span>
              )}
            </div>

            {/* Dynamic QR Code Container */}
            <div className="relative mb-5 bg-white p-2 rounded-xl shadow-sm w-[156px] h-[156px] flex items-center justify-center">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-[#a87c90] rounded-tl-md"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-[#a87c90] rounded-tr-md"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-[#a87c90] rounded-bl-md"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-[#a87c90] rounded-br-md"></div>
              
              {activeTransaction ? (
                <div className="p-2 animate-in fade-in duration-500">
                  <QRCode 
                    value={activeTransaction.checkoutUrl} 
                    size={120} 
                    fgColor="#7a5c68"
                    bgColor="transparent"
                    level="Q"
                  />
                </div>
              ) : (
                <div className="p-3 text-center text-[#d8a7b9] text-xs font-medium">
                  Waiting for<br/>selection...
                </div>
              )}
            </div>

            <p className="text-center text-[#7a5c68] font-medium px-4 mt-2 h-10">
              {activeTransaction ? "Scan QR Code with UPI App to Pay" : ""}
            </p>
          </div>

        </div>
      </main>

      {/* Success Modal Overlay - FIXED positioning so it ignores scrolling */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(168,124,144,0.2)] flex flex-col items-center justify-center pt-8 pb-6 px-8 text-center border border-[#f3d8e5] animate-in fade-in zoom-in duration-300">
            
            <div className="w-16 h-16 bg-[#d8a7b9] rounded-full flex items-center justify-center mb-5 shadow-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-[#5a434f] mb-3 tracking-wide">
              THANK YOU!
            </h2>
            
            <p className="text-[#8c6b7b] text-[15px] leading-snug font-medium">
              Transaction Successful. Your<br />product will be dispensed shortly.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}