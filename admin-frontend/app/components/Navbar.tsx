"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transition background on scroll to maintain readability over cake imagery
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-700 ${
        scrolled || isOpen
          ? "bg-[#FCFAFB]/95 backdrop-blur-md py-4 border-b border-stone-100 shadow-sm" 
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-10">
          
          {/* 1. Desktop Left Navigation - Boutique Focus */}
          <div className="hidden md:flex gap-10 items-center flex-1">
            <Link href="/menu" className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-900 hover:text-amber-800 transition-colors">
              The Menu
            </Link>
            <Link href="/weddings" className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-900 hover:text-amber-800 transition-colors">
              Weddings
            </Link>
          </div>

          {/* 2. Central Logo - Updated Branding */}
          <div className="flex-shrink-0 z-50">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="text-2xl md:text-3xl font-serif tracking-tight text-stone-900 transition-opacity hover:opacity-80 flex flex-col items-center leading-none"
            >
              <span className="text-[10px] tracking-[0.5em] uppercase font-sans mb-1 text-stone-400">Cakes By</span>
              <span className="italic">Kalsoom</span>
            </Link>
          </div>

          {/* 3. Desktop Right Navigation - Action Focused */}
          <div className="hidden md:flex gap-10 items-center justify-end flex-1">
            <Link href="/about" className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-900 hover:text-amber-800 transition-colors">
              Our Story
            </Link>
            <Link 
              href="https://wa.me/923335539381"
              target="_blank"
              className="px-6 py-2.5 bg-stone-900 text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-amber-800 transition-all duration-500 shadow-lg"
            >
              Order Now
            </Link>
          </div>

          {/* 4. Mobile Toggle Button - Stone/Amber Palette */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-900 focus:outline-none p-2 relative z-[110]"
              aria-label="Toggle Menu"
            >
              <div className="w-6 flex flex-col items-end gap-1.5">
                <span className={`h-[1.5px] bg-stone-900 transition-all duration-300 ${isOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`}></span>
                <span className={`h-[1.5px] bg-stone-900 transition-all duration-300 ${isOpen ? "opacity-0" : "w-4"}`}></span>
                <span className={`h-[1.5px] bg-stone-900 transition-all duration-300 ${isOpen ? "w-6 -rotate-45 -translate-y-2" : "w-5"}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Fullscreen Mobile Menu Overlay - Warm Bakery Theme */}
    {/* 5. Compact Mobile Menu Drop-down */}
<div 
  className={`fixed left-0 right-0 top-0 w-full bg-[#FCFAFB] z-[90] shadow-xl transition-all duration-500 ease-in-out md:hidden border-b border-stone-100 ${
    isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
  }`}
  style={{ height: 'auto' }} 
>
  {/* Padding-top is large (8rem) to stay below your logo/header toggle */}
  <nav className="flex flex-col items-center gap-4 py-8 pt-24 pb-10">
    
    <Link href="/" onClick={closeMenu} className="text-[9px] tracking-[0.4em] uppercase font-bold text-stone-400">
      Home
    </Link>

    <Link href="/menu" onClick={closeMenu} className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-900">
      The Menu
    </Link>

    <Link href="/weddings" onClick={closeMenu} className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-900">
      Weddings
    </Link>

    <Link href="/about" onClick={closeMenu} className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-900">
      Our Story
    </Link>

    <Link 
      href="https://wa.me/923335539381"
      target="_blank"
      onClick={closeMenu}
      className="mt-2 px-6 py-2 bg-stone-900 text-white text-[9px] tracking-[0.3em] uppercase font-bold"
    >
      Order Now
    </Link>

    {/* Small Location Tag to keep it boutique */}
    <span className="mt-4 text-[8px] tracking-[0.2em] text-stone-300 uppercase">
      Rawalpindi
    </span>
  </nav>
</div>
    </nav>
  );
}