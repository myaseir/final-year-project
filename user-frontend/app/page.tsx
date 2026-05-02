'use client';

import Link from 'next/link';

export default function Home() {
  return (
    /* 
       Forcing bg-white and text-[#4A3F3F] with !important-like behavior 
       to prevent mobile browsers from auto-darkening the UI.
    */
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden bg-white">
      
      {/* Fixed Background Blobs - using absolute positioning to stay behind content */}
      <div className="absolute top-20 -left-20 h-64 w-64 bg-[#F9EAEA] rounded-full blur-3xl opacity-60 -z-10"></div>
      <div className="absolute bottom-10 -right-20 h-80 w-80 bg-[#FFF5F5] rounded-full blur-3xl opacity-60 -z-10"></div>

      {/* Aesthetic Badge */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center rounded-full bg-white border border-[#F9EAEA] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#E29595] shadow-sm">
          Self-care. Anytime. Anywhere.
        </div>
      </div>

      {/* Hero Text - Using the Glacia Labs "Soft Luxury" palette */}
      <div className="max-w-4xl space-y-2">
        <h1 className="text-5xl font-serif italic tracking-tight text-[#4A3F3F] md:text-8xl leading-[1.1]">
          Your Beauty <span className="font-bold not-italic">Refill</span>
        </h1>
        <h1 className="text-5xl font-serif italic tracking-tight text-[#4A3F3F] md:text-8xl leading-[1.1]">
          in a <span className="text-[#E29595]">Touch.</span>
        </h1>
      </div>
      
      <p className="mt-8 max-w-lg text-base md:text-lg text-[#8C7A7A] font-medium leading-relaxed opacity-90">
        Premium fragrances and skincare dispensed instantly. <br />
        Sign in to manage your digital <span className="text-[#4A3F3F] font-bold">VendCare</span> wallet.
      </p>

      {/* Main Buttons - Styled for consistency across laptop and mobile */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
        <Link 
          href="/login" 
          className="rounded-full bg-[#4A3F3F] px-12 py-5 text-[11px] font-bold uppercase tracking-widest text-white shadow-2xl hover:bg-[#5C4D4D] transition-all transform hover:-translate-y-1 active:scale-95 text-center"
        >
          Sign In
        </Link>
        <Link 
          href="/register" 
          className="rounded-full bg-white border border-[#F9EAEA] px-12 py-5 text-[11px] font-bold uppercase tracking-widest text-[#8C7A7A] hover:bg-[#FDF8F8] transition-all active:scale-95 text-center"
        >
          Join VendCare
        </Link>
      </div>

      {/* Product Categories Preview */}
      <div className="mt-24 flex items-center gap-6 text-[9px] font-bold uppercase tracking-[0.4em] text-[#E29595] opacity-60">
        <span>Perfumes</span>
        <div className="w-1 h-1 bg-[#F9EAEA] rounded-full"></div>
        <span>Sunscreens</span>
        <div className="w-1 h-1 bg-[#F9EAEA] rounded-full"></div>
        <span>Moisturizers</span>
      </div>

      {/* Subtle Studio Branding */}
      <div className="absolute bottom-8 w-full text-center">
        <p className="text-[8px] uppercase tracking-[0.6em] text-[#F3C5C5] font-bold">
          VendCare Architecture
        </p>
      </div>
    </div>
  );
}