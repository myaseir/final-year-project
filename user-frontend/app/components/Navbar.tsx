'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react'; // Import Lucide icons

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
    <nav className="sticky top-0 z-[100] w-full border-b border-[#F9EAEA] bg-white/70 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 bg-gradient-to-tr from-[#E29595] to-[#F3C5C5] rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-serif italic text-xl font-bold">V</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#4A3F3F]">
              Vend<span className="text-[#E29595]">Care</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 text-[12px] font-bold uppercase tracking-[0.15em] text-[#8C7A7A]">
            {isLoggedIn ? (
              <button 
                onClick={handleSignOut}
                className="bg-[#4A3F3F] text-white px-7 py-2.5 rounded-full hover:bg-[#E29595] transition-all shadow-lg"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/about" className="hover:text-[#E29595]">How it works</Link>
                <Link 
                  href="/login" 
                  className="bg-[#E29595] text-white px-8 py-2.5 rounded-full hover:shadow-xl hover:shadow-[#E29595]/20 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button (Lucide Toggle) */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 text-[#4A3F3F] transition-all duration-300"
          >
            {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[105] bg-[#FDF8F8]/98 backdrop-blur-2xl md:hidden transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        
        {/* Close Button inside Drawer */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 text-[#E29595]"
        >
          <X size={32} strokeWidth={1} />
        </button>

        <div className="flex flex-col items-center justify-center h-full gap-8">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-2xl font-light text-[#4A3F3F]">My Dashboard</Link>
              <button 
                onClick={handleSignOut} 
                className="mt-8 bg-[#E29595] text-white px-12 py-4 rounded-full font-bold shadow-xl active:scale-95 transition-transform"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-4xl font-serif italic text-[#E29595]">Sign In</Link>
              <Link href="/register" className="text-xl font-light tracking-widest text-[#4A3F3F] uppercase">Create Account</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;