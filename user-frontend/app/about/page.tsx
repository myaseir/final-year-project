'use client';
import React from 'react';
import { Sparkles, Smartphone, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-24 text-[#4A3F3F]">
        
        {/* --- HERO SECTION --- */}
        <section className="text-center mb-20 md:mb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-6 inline-flex items-center rounded-full bg-[#FFF5F5] border border-[#F9EAEA] px-4 py-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#E29595]">
            The Future of Self-Care
          </div>
          <h1 className="text-4xl md:text-7xl font-serif italic mb-6 md:mb-8 leading-tight">
            About <span className="font-bold not-italic text-[#E29595]">VendCare</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-lg text-[#8C7A7A] leading-relaxed">
            We are bridging the gap between high-end skincare and instant accessibility. 
            VendCare is an automated, IoT-powered ecosystem designed to provide 
            premium hygiene products whenever and wherever you need them.
          </p>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section className="mb-24 md:mb-32">
          <div className="flex items-center gap-4 mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-serif italic">How to use the system</h2>
            <div className="h-px flex-grow bg-[#F9EAEA]"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="group p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] shadow-sm">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-[#FFF5F5] text-[#E29595] rounded-2xl flex items-center justify-center mb-6">
                <Smartphone size={20} />
              </div>
              <h3 className="font-bold text-[11px] uppercase tracking-widest mb-3">1. Register</h3>
              <p className="text-[11px] text-[#8C7A7A] leading-relaxed">
                Create your account using your CNIC. This acts as your unique identity across our network.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] shadow-sm">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-[#FFF5F5] text-[#E29595] rounded-2xl flex items-center justify-center mb-6">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-[11px] uppercase tracking-widest mb-3">2. Top-up</h3>
              <p className="text-[11px] text-[#8C7A7A] leading-relaxed">
                Add credit to your digital wallet via our portal. Once approved, you are ready to vend.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] shadow-sm">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-[#FFF5F5] text-[#E29595] rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-[11px] uppercase tracking-widest mb-3">3. Authenticate</h3>
              <p className="text-[11px] text-[#8C7A7A] leading-relaxed">
                Scan your ID or enter credentials at any physical VendCare unit to unlock the products.
              </p>
            </div>

            {/* Step 4 */}
            <div className="group p-8 bg-[#4A3F3F] text-white rounded-[2.5rem] shadow-xl">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-white/10 text-[#E29595] rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-[11px] uppercase tracking-widest mb-3">4. Collect</h3>
              <p className="text-[11px] opacity-70 leading-relaxed">
                Choose your quantity, and the machine will dispense your fresh moisturizer or fragrance.
              </p>
            </div>
          </div>
        </section>

        {/* --- MISSION SECTION --- */}
        <section className="bg-[#FFF5F5] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 flex flex-col md:flex-row items-center gap-10 md:gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-serif italic mb-6">Our Mission</h2>
            <p className="text-sm md:text-base text-[#8C7A7A] leading-relaxed mb-8">
              VendCare was born from a simple idea: self-care shouldn't be a luxury found only in high-end malls. 
              By combining IoT hardware with a secure fintech layer, we provide hygiene on-the-go 
              without compromising on quality or safety.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#E29595]">
              <span>Verified Products</span>
              <span>Secure IoT</span>
              <span>24/7 Access</span>
            </div>
          </div>
          <div className="flex-1 w-full h-48 md:h-64 bg-[#F3C5C5] rounded-[2rem] overflow-hidden flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E29595]/20 to-transparent"></div>
            <span className="text-white font-serif italic text-2xl md:text-4xl">Quality First.</span>
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="mt-24 md:mt-32 text-center pb-12">
          <h3 className="text-xl md:text-2xl font-serif italic mb-8">Ready to start your journey?</h3>
          <Link 
            href="/register" 
            className="inline-block bg-[#4A3F3F] text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-[10px] md:text-xs tracking-[0.2em] hover:bg-[#E29595] transition-all shadow-xl shadow-[#4A3F3F]/10 active:scale-95"
          >
            CREATE YOUR ACCOUNT
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;