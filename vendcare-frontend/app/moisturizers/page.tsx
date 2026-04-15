"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';

export default function MoisturizerSelectionPage() {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  const [activeTransaction, setActiveTransaction] = useState<{
    transactionId: string;
    checkoutUrl: string;
  } | null>(null);
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
    // Removed overflow-hidden so the page can scroll naturally
    <div className="min-h-screen flex flex-col bg-[#d4eced] text-gray-900 font-sans relative">
      
      {/* Header */}
      <header className="relative flex justify-between items-center px-6 py-4">
        <div className="flex-1"></div>
        
        {/* Logo - Clickable to return home */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-3 hover:opacity-80 transition cursor-pointer z-10">
          <svg width="32" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-500 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5-3-4-5-7-5 0-3.5 2.5-6 6-7 .5-1.5 1-3 1-3s.5 1.5 1 3c3.5 1 6 3.5 6 7-3 0-5.5 2-7 5z" />
          </svg>
          <span className="text-xl tracking-[0.15em] font-light text-teal-900">VEND CARE</span>
        </Link>

        {/* Right Actions */}
        <div className="flex-1 flex justify-end gap-6 relative z-10">
          <button className="flex flex-col items-center text-teal-900 hover:text-black transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span className="text-sm">Admin</span>
          </button>
          <button className="flex flex-col items-center text-teal-900 hover:text-black transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-sm">Login</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-8 px-6 pb-20 max-w-5xl mx-auto w-full">
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl mb-8 text-black font-medium">
          Select Your Moisturizer Brand
        </h1>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center relative">
          
          {/* Left Column: Product Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-300 ${showSuccess ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            
            {/* Product 1: Daily Glow */}
            <div className="w-[240px] bg-[#eef4f4] border border-[#d0e0e0] rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-md transition">
              <div className="h-40 flex justify-center items-center mb-4">
                <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 30 C20 25, 40 25, 40 30 L45 90 C45 95, 15 95, 15 90 Z" fill="#80c4c4"/>
                  <rect x="25" y="15" width="10" height="15" fill="#e0c890"/>
                  <path d="M20 15 H40 V10 C40 5, 20 5, 20 10 Z" fill="#ffffff"/>
                  <path d="M10 15 C10 10, 20 10, 25 15" stroke="#e0c890" strokeWidth="3" fill="none"/>
                  <text x="30" y="55" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">Daily</text>
                  <text x="30" y="65" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">Glow</text>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black leading-tight">Daily Glow</h3>
              <p className="text-black/80 text-sm mb-2">Light Hydration</p>
              <p className="text-xl font-bold mb-3">₹30</p>
              <button 
                onClick={() => handleSelect('prod_moist_01', 'Daily Glow', 30)}
                disabled={loadingProduct === 'prod_moist_01'}
                className="mt-auto w-full bg-[#488e91] text-white py-2 rounded-xl font-medium tracking-wide hover:bg-[#3c787a] transition disabled:opacity-70"
              >
                {loadingProduct === 'prod_moist_01' ? 'LOADING...' : 'SELECT'}
              </button>
            </div>

            {/* Product 2: Aura Pure */}
            <div className="w-[240px] bg-[#eef4f4] border border-[#d0e0e0] rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-md transition">
              <div className="h-40 flex justify-center items-center mb-4">
                <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10 H45 L40 80 H20 Z" fill="#90cece"/>
                  <path d="M15 10 H45 V5 H15 Z" fill="#ffffff"/>
                  <path d="M22 80 H38 L40 95 H20 Z" fill="#ffffff"/>
                  <text x="30" y="35" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">Aura</text>
                  <text x="30" y="45" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">Pure</text>
                  <line x1="20" y1="65" x2="40" y2="65" stroke="#ffffff" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black leading-tight">Aura Pure</h3>
              <p className="text-black/80 text-sm mb-2">Gentle Care</p>
              <p className="text-xl font-bold mb-3">₹50</p>
              <button 
                onClick={() => handleSelect('prod_moist_02', 'Aura Pure', 50)}
                disabled={loadingProduct === 'prod_moist_02'}
                className="mt-auto w-full bg-[#488e91] text-white py-2 rounded-xl font-medium tracking-wide hover:bg-[#3c787a] transition disabled:opacity-70"
              >
                {loadingProduct === 'prod_moist_02' ? 'LOADING...' : 'SELECT'}
              </button>
            </div>

            {/* Product 3: Skin Shield */}
            <div className="w-[240px] bg-[#eef4f4] border border-[#d0e0e0] rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-md transition">
              <div className="h-40 flex justify-center items-center mb-4">
                 <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10 H45 L40 80 H20 Z" fill="#6ba7c6"/>
                  <path d="M15 10 H45 V5 H15 Z" fill="#ffffff"/>
                  <path d="M22 80 H38 L40 95 H20 Z" fill="#e0a840"/>
                  <text x="30" y="35" fontSize="8" fill="#ffffff" textAnchor="middle" fontWeight="bold">Skin</text>
                  <text x="30" y="45" fontSize="8" fill="#ffffff" textAnchor="middle" fontWeight="bold">Shield</text>
                  <line x1="20" y1="65" x2="40" y2="65" stroke="#e0a840" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black leading-tight">Skin Shield</h3>
              <p className="text-black/80 text-sm mb-2">SPF 15+ Moisturizer</p>
              <p className="text-xl font-bold mb-3">₹50</p>
              <button 
                onClick={() => handleSelect('prod_moist_03', 'Skin Shield', 50)}
                disabled={loadingProduct === 'prod_moist_03'}
                className="mt-auto w-full bg-[#488e91] text-white py-2 rounded-xl font-medium tracking-wide hover:bg-[#3c787a] transition disabled:opacity-70"
              >
                {loadingProduct === 'prod_moist_03' ? 'LOADING...' : 'SELECT'}
              </button>
            </div>

          </div>

          {/* Right Column: Payment & QR Code */}
          <div className={`w-[300px] h-fit bg-[#addbdb] rounded-2xl flex flex-col items-center pt-6 pb-8 shadow-sm transition-opacity duration-300 ${showSuccess ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-xl font-semibold tracking-wide mb-4">PAYMENT</h2>
            
            <div className="w-full bg-[#ebdcd0] py-2 text-center border-y border-[#d0c0b0] mb-6 min-h-[40px] flex items-center justify-center">
              {selectedProduct ? (
                 <span className="font-semibold text-gray-900 tracking-wide">TOTAL AMOUNT: ₹{selectedProduct.price}</span>
              ) : (
                 <span className="text-gray-600 text-sm">Select a product</span>
              )}
            </div>

            {/* Dynamic QR Code Container */}
            <div className="relative mb-4 bg-[#addbdb] w-[140px] h-[140px] flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-black rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-black rounded-tr-md"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-black rounded-bl-md"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-black rounded-br-md"></div>
              
              {activeTransaction ? (
                <div className="p-2 animate-in fade-in duration-500 bg-white rounded-md m-2">
                  <QRCode 
                    value={activeTransaction.checkoutUrl} 
                    size={108} 
                    fgColor="#000000"
                    bgColor="#ffffff"
                    level="Q"
                  />
                </div>
              ) : (
                <div className="p-3 text-center text-gray-700 text-xs font-medium">
                  Waiting for<br/>selection...
                </div>
              )}
            </div>

            <p className="text-center text-black/90 font-medium px-4 mt-2 h-10">
              {activeTransaction ? "Scan QR Code with UPI App to Pay" : ""}
            </p>
          </div>

        </div>
      </main>

      {/* Success Modal Overlay - FIXED positioning so it ignores scrolling */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm px-4">
          <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center pt-8 pb-6 px-8 text-center animate-in fade-in zoom-in duration-300 border border-gray-100">
            
            <div className="w-16 h-16 bg-[#63e28c] rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-black mb-2 tracking-wide">
              THANK YOU!
            </h2>
            
            <p className="text-black/90 text-[15px] leading-snug font-medium">
              Transaction Successful. Your<br />product will be dispensed shortly.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}