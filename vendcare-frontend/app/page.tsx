import React from 'react';
import Link from 'next/link';

export default function VendCarePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#e7f7f8] text-gray-900 font-sans">
      
      {/* Header */}
      <header className="relative flex justify-between items-center px-6 py-4">
        {/* Left Spacer */}
        <div className="flex-1"></div>
        
        {/* Logo (Centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-3">
          <svg width="32" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-500 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5-3-4-5-7-5 0-3.5 2.5-6 6-7 .5-1.5 1-3 1-3s.5 1.5 1 3c3.5 1 6 3.5 6 7-3 0-5.5 2-7 5z" />
          </svg>
          <span className="text-xl tracking-[0.15em] font-light">VEND CARE</span>
        </div>

        {/* Right Actions */}
        <div className="flex-1 flex justify-end gap-6">
          <button className="flex flex-col items-center text-gray-800 hover:text-black transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span className="text-sm">Admin</span>
          </button>
          <button className="flex flex-col items-center text-gray-800 hover:text-black transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-sm">Login</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-16 px-4">
        
        {/* Titles */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl mb-3 text-gray-900">
            Welcome to <span className="font-bold">VendCare.</span>
          </h1>
          <h2 className="text-xl sm:text-2xl text-gray-800">
            Choose Your Product!
          </h2>
        </div>

        {/* Product Cards */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-12">
          
          {/* Card 1: Moisturizers (Now a Link) */}
          <Link href="/moisturizers" className="w-[260px] h-[300px] bg-[#9ecbce] rounded-3xl shadow-sm flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-md transition">
            <div className="w-28 h-28 rounded-full bg-white/30 flex items-center justify-center mb-6">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 14l6-6 4 4-6 6-3 1 1-3z" />
                <path d="M14 6l2-2a2.828 2.828 0 1 1 4 4l-2 2" />
                <path d="M6 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                <path d="M12 18h8v4h-8v-4z" />
                <path d="M13 18v-2h6v2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1 text-black">Moisturizers</h3>
            <p className="text-black/80 text-sm">Hydrate Your Skin</p>
          </Link>

          {/* Card 2: Sunscreens (Now a Link) */}
          <Link href="/sunscreens" className="w-[260px] h-[300px] bg-[#fac299] rounded-3xl shadow-sm flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-md transition">
            <div className="w-28 h-28 rounded-full bg-white/30 flex items-center justify-center mb-6">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="4" />
                <path d="M10 2v2" /><path d="M10 16v2" />
                <path d="M2 10h2" /><path d="M16 10h2" />
                <path d="M4.34 4.34l1.42 1.42" /><path d="M14.24 14.24l1.42 1.42" />
                <path d="M4.34 15.66l1.42-1.42" /><path d="M14.24 5.76l1.42-1.42" />
                <path d="M12 11c0 0 4-1 6-1v6c0 4-6 7-6 7s-6-3-6-7v-6c2 0 6 1 6 1z" />
                <path d="M12 14l1.5 1.5 3-3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1 text-black">Sunscreens</h3>
            <p className="text-black/80 text-sm">Sun Protection</p>
          </Link>

          {/* Card 3: Perfumes */}
          {/* Card 3: Perfumes (Now a Link) */}
          <Link href="/perfumes" className="w-[260px] h-[300px] bg-[#fce0cb] rounded-3xl shadow-sm flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-md transition">
            <div className="w-28 h-28 rounded-full bg-white/30 flex items-center justify-center mb-6">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="8" y="10" width="8" height="10" rx="3" />
                <path d="M10 10V8h4v2" />
                <rect x="11" y="5" width="2" height="3" />
                <circle cx="16" cy="6" r="2" />
                <path d="M14 6h2" />
                <path d="M6 4h1" />
                <path d="M4 6h1" />
                <path d="M5 8h1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1 text-black">Perfumes</h3>
            <p className="text-black/80 text-sm">Fresh Fragrances</p>
          </Link>

        </div>

        {/* Info Box */}
        <div className="w-full max-w-4xl border border-[#bceae9] bg-[#f5fbfb] rounded-2xl py-8 px-4 text-center shadow-sm">
          <p className="text-lg text-gray-800">
            Select a category to view brands and prices.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 flex justify-center gap-6 text-sm text-gray-800 font-medium">
        <a href="#" className="underline hover:text-black transition">Terms of Use</a>
        <a href="#" className="underline hover:text-black transition">Help</a>
      </footer>
    </div>
  );
}