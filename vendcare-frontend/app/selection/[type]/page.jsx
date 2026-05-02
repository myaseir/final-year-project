"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, CheckCircle2, Wind, Flame, Flower2, 
  Waves, CloudRain, Bath, SunMedium, Umbrella, 
  ShieldAlert, Smartphone, Keyboard, AlertCircle, Droplets,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const CONTENT_MAP = {
  perfumes: {
    name: "Luxury Fragrances", bg: "bg-[#fff5f8]", accent: "#d8a7b9", secondary: "#fce3ec", text: "#5a434f", border: "border-[#f3d8e5]",
    min: 1, max: 10, step: 1, basePrice: 20,
    products: [
      { id: "p1", name: "Midnight Musk", desc: "Deep Wood Notes", icon: <Flame size={32} /> },
      { id: "p2", name: "Aqua Surge", desc: "Cool Aqua Cologne", icon: <Wind size={32} /> }, // Note: Adjusted to match Tank #2
      { id: "p3", name: "Ultra Shield", desc: "Premium Essence", icon: <Flower2 size={32} /> } // Note: Adjusted to match Tank #3
    ]
  },
  moisturizers: {
    name: "Hydration Gallery", bg: "bg-[#f5fbff]", accent: "#a7c7d8", secondary: "#e3f4fc", text: "#43525a", border: "border-[#d8e8f3]",
    min: 0.5, max: 3, step: 0.5, basePrice: 16.67,
    products: [
      { id: "m1", name: "Velvet Glow", desc: "Hyaluronic Gel", icon: <Waves size={32} /> },
      { id: "m2", name: "Rose Dew", desc: "Shea & Aloe Vera", icon: <Bath size={32} /> },
      { id: "m3", name: "Citrus Burst", desc: "Lightweight Serum", icon: <CloudRain size={32} /> }
    ]
  },
  sunscreens: {
    name: "Solar Protection", bg: "bg-[#fffcf5]", accent: "#d8bca7", secondary: "#fcf6e3", text: "#5a4f43", border: "border-[#f3e9d8]",
    min: 0.5, max: 3, step: 0.5, basePrice: 16.67,
    products: [
      { id: "s1", name: "Vanilla Silk", desc: "SPF 50+ Protection", icon: <ShieldAlert size={32} /> },
      { id: "s2", name: "Herbal Mint", desc: "Water Resistant", icon: <Umbrella size={32} /> },
      { id: "s3", name: "Ocean Breeze", desc: "Non-Greasy Finish", icon: <SunMedium size={32} /> }
    ]
  }
};

export default function SelectionPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type || 'perfumes';
  const theme = CONTENT_MAP[type];

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://final-year-project-f8ym.vercel.app";

  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState(null); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [volume, setVolume] = useState(theme.min); 
  const [authMode, setAuthMode] = useState('qr'); 
  const [cnic, setCnic] = useState('');
  const [pin, setPin] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const currentPrice = selectedProduct ? Math.round(volume * theme.basePrice) : 0;

  useEffect(() => {
    setErrorStatus(null);
  }, [authMode, selectedProduct, volume]);

  useEffect(() => {
    if (selectedProduct) {
      handleSelect(selectedProduct.id, selectedProduct.name);
    }
  }, [volume]);

  // --- POLLING LOGIC FOR QR PAYMENTS ---
  useEffect(() => {
    if (!activeTransaction?.transactionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/machine/payment-status-check/${activeTransaction.transactionId}`);
        const data = await res.json();
        if (data.status === 'PAID') {
          handleSuccessAction();
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTransaction]);

  const handleSuccessAction = () => {
    setShowSuccess(true);
    // Return to home page after 7 seconds
    setTimeout(() => {
      router.push('/');
    }, 7000);
  };

  const handleSelect = async (productId, productName) => {
    setSelectedProduct({ id: productId, name: productName });
    setActiveTransaction(null); 
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/machine/create-qr-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          product_id: productId, 
          price: Number(currentPrice),
          volume: Number(volume)
        }),
      });
      
      const data = await response.json();
      setActiveTransaction({ transactionId: data.transaction_id, checkoutUrl: data.checkout_url });
    } catch (error) {
      setErrorStatus("System Connectivity Error");
    }
  };

  const handleManualAuth = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsAuthorizing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/machine/verify-and-dispense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: String(cnic), 
          pin: String(pin),
          selected_amount: Number(currentPrice),
          product_name: String(selectedProduct.name),
          volume: Number(volume),
          machine_id: "VEND-UNIT-01"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        handleSuccessAction();
      } else {
        setErrorStatus(data.detail || "Authentication Failed");
      }
    } catch (error) {
      setErrorStatus("Backend Offline");
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col ${theme.bg} overflow-hidden font-sans select-none bg-transparent`}>
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 group text-[#4A3F3F]">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Exit to Menu</span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-8 py-4 overflow-hidden">
        <div className="flex flex-row gap-10 items-stretch justify-center w-full max-w-7xl h-full max-h-[82vh]">
          
          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-1 ml-2">
              <h1 className="text-2xl font-serif italic" style={{ color: theme.text }}>{theme.name}</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Architected by Glacia Labs</p>
            </div>
            
            <div className="flex flex-row gap-4">
              {theme.products.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => handleSelect(product.id, product.name)}
                  className={`w-[180px] bg-white border ${theme.border} rounded-[2.5rem] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group`}
                  style={selectedProduct?.id === product.id ? { boxShadow: `0 0 0 3px ${theme.accent}` } : {}}
                >
                  <div className="h-20 w-full rounded-[1.8rem] flex justify-center items-center mb-4 transition-colors" style={{ backgroundColor: theme.secondary }}>
                    <div className="group-hover:scale-110 transition-transform duration-500" style={{ color: theme.accent }}>{product.icon}</div>
                  </div>
                  <h3 className="text-sm font-bold mb-1 leading-tight" style={{ color: theme.text }}>{product.name}</h3>
                </div>
              ))}
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-[2.5rem] p-8 border border-white mt-4">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Droplets size={16} style={{ color: theme.accent }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A3F3F]">Precision Dispense</span>
                  </div>
                  <span className="text-xl font-serif italic font-bold" style={{ color: theme.text }}>{volume}ml</span>
               </div>
               <input 
                  type="range" min={theme.min} max={theme.max} step={theme.step} value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: theme.accent }}
               />
               <div className="flex justify-between mt-3 text-[8px] font-bold opacity-30 tracking-widest uppercase text-[#4A3F3F]">
                  <span>Min: {theme.min}ml</span>
                  <span>Max: {theme.max}ml</span>
               </div>
            </div>
          </div>

          <div className={`w-[450px] rounded-[3.5rem] flex flex-col items-center p-10 shadow-2xl border ${theme.border} bg-white/90 backdrop-blur-xl relative overflow-hidden`}>
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
                  <p className="text-[9px] font-bold uppercase opacity-30 mb-1 tracking-widest text-[#4A3F3F]">Payable Amount</p>
                  <span className="text-3xl font-serif italic font-bold" style={{ color: theme.text }}>PKR {currentPrice}</span>
                  <p className="text-[8px] font-bold opacity-40 mt-1 uppercase tracking-tighter text-[#4A3F3F]">({volume}ml Dosage)</p>
                </div>
              ) : (
                <p className="text-[10px] font-bold uppercase opacity-20 py-4 tracking-[0.3em] text-[#4A3F3F]">Select Essence & Dosage</p>
              )}
            </div>

            <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[200px]">
              {authMode === 'qr' ? (
                <div className="bg-white p-8 rounded-[3.5rem] w-[280px] h-[280px] flex items-center justify-center border border-black/[0.03] shadow-inner">
                  {activeTransaction ? (
                    <QRCode value={activeTransaction.checkoutUrl} size={220} fgColor={theme.text} bgColor="transparent" level="H" />
                  ) : (
                    <div className="text-center opacity-10 flex flex-col items-center gap-5">
                      <Smartphone size={70} strokeWidth={1} style={{ color: theme.text }} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4A3F3F]">Awaiting</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleManualAuth} className="w-full px-4">
                  <div className="space-y-6">
                    <input 
                      type="text" placeholder="CNIC/EMAIL" 
                      className="w-full p-5 rounded-[1.8rem] border border-gray-100 bg-gray-50/30 text-sm focus:outline-none text-[#4A3F3F]" 
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
                    <button type="submit" disabled={isAuthorizing || !selectedProduct} className="w-full py-5 rounded-[1.8rem] text-white font-bold text-[11px] tracking-[0.2em] shadow-lg active:scale-95 transition-all" style={{ backgroundColor: theme.accent }}>
                      {isAuthorizing ? 'AUTHORIZING...' : 'CONFIRM & DISPENSE'}
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {errorStatus && (
              <div className="absolute bottom-10 px-8 w-full">
                <div className="bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-full flex items-center gap-2 justify-center">
                  <AlertCircle size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">{errorStatus}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* SUCCESS OVERLAY WITH THANK YOU MESSAGE */}
      <AnimatePresence>
  {showSuccess && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-2xl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="bg-white/90 rounded-[4rem] p-16 text-center max-w-lg w-full shadow-2xl relative overflow-hidden"
      >
        {/* Animated Check Icon with Scale/Shadow Pulse */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0px 0px 0px rgba(34, 197, 94, 0)", 
              "0px 0px 30px rgba(34, 197, 94, 0.3)", 
              "0px 0px 0px rgba(34, 197, 94, 0)"
            ] 
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto bg-green-500 shadow-xl"
        >
          <CheckCircle2 size={48} className="text-white" />
        </motion.div>

        {/* Staggered Text Entrance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="text-4xl font-serif italic mb-2" 
            style={{ color: theme.text }}
          >
            Thank You!
          </motion.h2>
          
          <motion.p 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.4 } }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
          >
            Payment Confirmed
          </motion.p>
        </motion.div>
        
        {/* Detail Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="py-8 px-6 rounded-[2.5rem] bg-white border border-black/5 mt-6 space-y-4"
        >
          <p className="text-base font-medium text-[#4A3F3F]">
            Please collect your <span className="font-bold">{selectedProduct?.name}</span> ({volume}ml) from the unit.
          </p>
          
          <div className="flex justify-center gap-2 text-[#E29595]">
            {/* Pulsing Heart Micro-interaction */}
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <Heart size={16} fill="currentColor" />
            </motion.div>
            <span className="text-[9px] font-bold uppercase tracking-widest">Self-care made simple</span>
          </div>
        </motion.div>
        
        {/* Linear Progress Bar */}
        <div className="mt-10 flex flex-col items-center gap-3">
           <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 7, ease: "linear" }}
                className="bg-green-500 h-full origin-left"
              />
           </div>
           <p className="text-[9px] font-bold uppercase opacity-30 tracking-[0.2em]">Returning to menu shortly...</p>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}