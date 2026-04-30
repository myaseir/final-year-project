'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('userCnic');
    setIsLoggedIn(!!user);
    setIsOpen(false); 
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('userCnic');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-[#F9EAEA] bg-white">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex h-16 md:h-20 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-tr from-[#E29595] to-[#F3C5C5] rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-serif italic text-sm md:text-xl font-bold">V</span>
            </div>
            <span className="text-lg md:text-xl font-semibold tracking-tight text-[#4A3F3F]">
              Vend<span className="text-[#E29595]">Care</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C7A7A]">
            {isLoggedIn ? (
              <button 
                onClick={handleSignOut}
                className="bg-[#4A3F3F] text-white px-7 py-2.5 rounded-full hover:bg-[#E29595] transition-all"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/about" className="hover:text-[#E29595]">How it works</Link>
                <Link 
                  href="/login" 
                  className="bg-[#E29595] text-white px-8 py-2.5 rounded-full hover:shadow-lg transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-1 text-[#4A3F3F] z-[110]"
          >
            {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer - Solid White Background */}
      <div className={`fixed inset-0 z-[105] bg-white md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 px-10 gap-8">
          
          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E29595] border-b border-[#F9EAEA] pb-2">
              Menu
            </p>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-sm font-bold uppercase tracking-[0.15em] text-[#4A3F3F]">My Dashboard</Link>
                <Link href="/topup" className="text-sm font-bold uppercase tracking-[0.15em] text-[#4A3F3F]">Wallet Topup</Link>
                <button 
                  onClick={handleSignOut} 
                  className="w-fit mt-4 bg-[#4A3F3F] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/about" className="text-sm font-bold uppercase tracking-[0.15em] text-[#4A3F3F]">How it works</Link>
                <Link href="/login" className="text-sm font-bold uppercase tracking-[0.15em] text-[#4A3F3F]">Sign In</Link>
                <Link 
                  href="/register" 
                  className="w-fit mt-4 bg-[#E29595] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#E29595]/20"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Bottom Branding */}
          <div className="mt-auto mb-10">
            <div className="h-[1px] w-12 bg-[#F9EAEA] mb-4"></div>
            <p className="text-[9px] text-[#8C7A7A] uppercase tracking-[0.5em] italic">Glacia Labs Architecture</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;