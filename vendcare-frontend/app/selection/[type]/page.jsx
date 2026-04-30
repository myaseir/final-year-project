"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, CheckCircle2, Wind, Flame, Flower2, 
  Waves, CloudRain, Bath, SunMedium, Umbrella, 
  ShieldAlert, Smartphone, Keyboard, AlertCircle
} from 'lucide-react';

const CONTENT_MAP = {
  perfumes: {
    name: "Luxury Fragrances", bg: "bg-[#fff5f8]", accent: "#d8a7b9", secondary: "#fce3ec", text: "#5a434f", border: "border-[#f3d8e5]",
    products: [
      { id: "p1", name: "Floral Breeze", desc: "Fresh Petal Extract", price: 120, icon: <Flower2 size={32} /> },
      { id: "p2", name: "Midnight Musk", desc: "Deep Wood Notes", price: 150, icon: <Flame size={32} /> },
      { id: "p3", name: "Oceanic Mist", desc: "Cool Aqua Cologne", price: 80, icon: <Wind size={32} /> }
    ]
  },
  moisturizers: {
    name: "Hydration Gallery", bg: "bg-[#f5fbff]", accent: "#a7c7d8", secondary: "#e3f4fc", text: "#43525a", border: "border-[#d8e8f3]",
    products: [
      { id: "m1", name: "Aqua Surge", desc: "Hyaluronic Gel", price: 450, icon: <Waves size={32} /> },
      { id: "m2", name: "Velvet Glow", desc: "Shea & Aloe Vera", price: 550, icon: <Bath size={32} /> },
      { id: "m3", name: "Rain Drop", desc: "Lightweight Serum", price: 300, icon: <CloudRain size={32} /> }
    ]
  },
  sunscreens: {
    name: "Solar Protection", bg: "bg-[#fffcf5]", accent: "#d8bca7", secondary: "#fcf6e3", text: "#5a4f43", border: "border-[#f3e9d8]",
    products: [
      { id: "s1", name: "Ultra Shield", desc: "SPF 50+ Protection", price: 600, icon: <ShieldAlert size={32} /> },
      { id: "s2", name: "Beach Guard", desc: "Water Resistant", price: 750, icon: <Umbrella size={32} /> },
      { id: "s3", name: "Daily Beam", desc: "Non-Greasy Finish", price: 500, icon: <SunMedium size={32} /> }
    ]
  }
};

export default function SelectionPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type || 'perfumes';
  const theme = CONTENT_MAP[type];

  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(null); 
  const [activeTransaction, setActiveTransaction] = useState(null); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authMode, setAuthMode] = useState('qr'); 
  const [cnic, setCnic] = useState('');
  const [pin, setPin] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    setErrorStatus(null);
  }, [authMode, selectedProduct]);

  // --- 1. QR TRANSACTION CREATION ---
  const handleSelect = async (productId, productName, price) => {
    setLoadingProduct(productId);
    setSelectedProduct({ id: productId, name: productName, price: price });
    setActiveTransaction(null); 
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://final-year-project-f8ym.vercel.app";
      const response = await fetch(`${baseUrl}/api/machine/create-qr-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, price: Number(price) }),
      });
      
      const data = await response.json();
      setActiveTransaction({ transactionId: data.transaction_id, checkoutUrl: data.checkout_url });
    } catch (error) {
      // Quietly fail or handle error state
    } finally {
      setLoadingProduct(null);
    }
  };

  // --- 2. MANUAL AUTHENTICATION ---
  const handleManualAuth = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsAuthorizing(true);
    setErrorStatus(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://final-year-project-f8ym.vercel.app";
      const response = await fetch(`${baseUrl}/api/machine/verify-and-dispense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: String(cnic), 
          pin: String(pin),
          selected_amount: Number(selectedProduct.price),
          product_name: String(selectedProduct.name),
          machine_id: "VEND-UNIT-01"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/'); 
        }, 7000); 
      } else {
        setErrorStatus(data.detail || "Invalid Credentials");
      }
    } catch (error) {
      setErrorStatus("Connection Error");
    } finally {
      setIsAuthorizing(false);
    }
  };

  // --- 3. STATUS POLLING ---
  useEffect(() => {
    if (!activeTransaction?.transactionId) return;

    const tid = activeTransaction.transactionId;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://final-year-project-f8ym.vercel.app";

    const statusInterval = setInterval(async () => {
      try {
        const response = await fetch(`${apiUrl}/api/machine/payment-status-check/${tid}`);
        const data = await response.json();
        
        if (data.status === 'PAID') {
          setShowSuccess(true);
          setActiveTransaction(null);
          clearInterval(statusInterval);
          setTimeout(() => { router.push('/'); }, 7000);
        }
      } catch (err) {
        // Polling continues until success or manual navigation
      }
    }, 2000);

    return () => clearInterval(statusInterval);
  }, [activeTransaction?.transactionId, router]);

  return (
    <div className={`h-screen w-full flex flex-col ${theme.bg} overflow-hidden font-sans select-none`}>
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 group text-[#4A3F3F]">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Home</span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-8 py-4 overflow-hidden">
        <div className="flex flex-row gap-10 items-stretch justify-center w-full max-w-7xl h-full max-h-[82vh]">
          
          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-1 ml-2">
              <h1 className="text-2xl font-serif italic" style={{ color: theme.text }}>{theme.name}</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">Choose your essence</p>
            </div>
            
            <div className="flex flex-row gap-4">
              {theme.products.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => handleSelect(product.id, product.name, product.price)}
                  className={`w-[200px] bg-white border ${theme.border} rounded-[2.5rem] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group`}
                  style={selectedProduct?.id === product.id ? { boxShadow: `0 0 0 3px ${theme.accent}`, transform: 'translateY(-4px)' } : {}}
                >
                  <div className="h-24 w-full rounded-[1.8rem] flex justify-center items-center mb-4 transition-colors" style={{ backgroundColor: theme.secondary }}>
                    <div className="group-hover:scale-110 transition-transform duration-500" style={{ color: theme.accent }}>{product.icon}</div>
                  </div>
                  <h3 className="text-base font-bold mb-1 leading-tight" style={{ color: theme.text }}>{product.name}</h3>
                  <p className="opacity-40 text-[8px] uppercase font-bold tracking-widest mb-4">{product.desc}</p>
                  <p className="text-xl font-serif italic font-bold" style={{ color: theme.text }}>PKR {product.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`w-[480px] rounded-[3.5rem] flex flex-col items-center p-10 shadow-2xl border ${theme.border} bg-white/80 backdrop-blur-xl relative overflow-hidden transition-all duration-500`}>
            <div className="flex bg-gray-200/50 p-1.5 rounded-full w-full mb-8">
              <button onClick={() => setAuthMode('qr')} className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${authMode === 'qr' ? 'bg-white shadow-md text-black' : 'opacity-40'}`}>
                <Smartphone size={16} /> QR SCAN
              </button>
              <button onClick={() => setAuthMode('manual')} className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${authMode === 'manual' ? 'bg-white shadow-md text-black' : 'opacity-40'}`}>
                <Keyboard size={16} /> MANUAL
              </button>
            </div>

            <div className="w-full text-center mb-8">
              {selectedProduct ? (
                <div className="animate-in fade-in zoom-in duration-300">
                  <p className="text-[9px] font-bold uppercase opacity-30 mb-1 tracking-widest">Amount Payable</p>
                  <span className="text-3xl font-serif italic font-bold" style={{ color: theme.text }}>PKR {selectedProduct.price}</span>
                </div>
              ) : (
                <p className="text-[10px] font-bold uppercase opacity-20 py-4 tracking-[0.3em]">Awaiting Selection</p>
              )}
            </div>

            {errorStatus && (
              <div className="absolute top-44 left-0 right-0 flex justify-center px-10">
                <div className="bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm w-full justify-center">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{errorStatus}</span>
                </div>
              </div>
            )}

            <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[200px]">
              {authMode === 'qr' ? (
                <div className="bg-white p-8 rounded-[3.5rem] w-[300px] h-[300px] flex items-center justify-center border border-black/[0.03]">
                  {activeTransaction ? (
                    <QRCode value={activeTransaction.checkoutUrl} size={250} fgColor={theme.text} bgColor="transparent" level="H" />
                  ) : (
                    <div className="text-center opacity-10 flex flex-col items-center gap-5">
                      <Smartphone size={80} strokeWidth={1} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Ready</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleManualAuth} className="w-full px-4">
                  <div className="space-y-6">
                    <input 
                      type="text" placeholder="CNIC/EMAIL" 
                      className="w-full p-5 rounded-[1.8rem] border border-gray-100 bg-gray-50/30 font-medium focus:outline-none" 
                      value={cnic} onChange={(e) => setCnic(e.target.value)} required 
                    />
                    <div className="flex justify-between gap-3 relative">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center ${pin.length === i ? 'border-[#d8a7b9]' : 'border-gray-100'}`}>
                          {pin[i] ? <div className="w-3 h-3 rounded-full bg-[#5a434f]" /> : <div className="w-1 h-1 rounded-full bg-gray-200" />}
                        </div>
                      ))}
                      <input 
                        type="text" maxLength={4} value={pin} 
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        className="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                      />
                    </div>
                    <button type="submit" disabled={isAuthorizing || !selectedProduct} className="w-full py-5 rounded-[1.8rem] text-white font-bold text-[11px] tracking-[0.2em]" style={{ backgroundColor: theme.accent }}>
                      {isAuthorizing ? 'VERIFYING...' : 'CONFIRM & DISPENSE'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-2xl">
          <div className="bg-white/90 rounded-[4rem] p-16 text-center max-w-lg w-full">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-10 mx-auto bg-green-500 shadow-lg">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            <h2 className="text-5xl font-serif italic mb-2" style={{ color: theme.text }}>Payment Successful</h2>
            <div className="py-8 px-6 rounded-[2.5rem] bg-white border border-black/5 mt-6">
              <p className="text-sm font-medium">Please collect your item from the dispenser.</p>
            </div>
            <p className="text-[9px] font-bold uppercase mt-8 opacity-30">Resetting for next user...</p>
          </div>
        </div>
      )}
    </div>
  );
}