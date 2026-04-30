'use client';
import React from 'react';
import { Sparkles, Smartphone, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-[#4A3F3F]">
      
      {/* --- HERO SECTION --- */}
      <section className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 inline-flex items-center rounded-full bg-[#FFF5F5] border border-[#F9EAEA] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E29595]">
          The Future of Self-Care
        </div>
        <h1 className="text-5xl md:text-7xl font-serif italic mb-8">
          About <span className="font-bold not-italic text-[#E29595]">VendCare</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-[#8C7A7A] leading-relaxed">
          We are bridging the gap between high-end skincare and instant accessibility. 
          VendCare is an automated, IoT-powered ecosystem designed to provide 
          premium hygiene products whenever and wherever you need them.
        </p>
      </section>

      {/* --- HOW TO PLAY / HOW IT WORKS --- */}
      <section className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl font-serif italic">How to use the system</h2>
          <div className="h-px flex-grow bg-[#F9EAEA]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="group p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] hover:shadow-xl hover:shadow-[#E29595]/5 transition-all">
            <div className="h-12 w-12 bg-[#FFF5F5] text-[#E29595] rounded-2xl flex items-center justify-center mb-6">
              <Smartphone size={24} />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-3">1. Register</h3>
            <p className="text-xs text-[#8C7A7A] leading-relaxed">
              Create your account using your CNIC. This acts as your unique identity across our network.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] hover:shadow-xl hover:shadow-[#E29595]/5 transition-all">
            <div className="h-12 w-12 bg-[#FFF5F5] text-[#E29595] rounded-2xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-3">2. Top-up</h3>
            <p className="text-xs text-[#8C7A7A] leading-relaxed">
              Add credit to your digital wallet via our portal. Once approved, you are ready to vend.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] hover:shadow-xl hover:shadow-[#E29595]/5 transition-all">
            <div className="h-12 w-12 bg-[#FFF5F5] text-[#E29595] rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-3">3. Authenticate</h3>
            <p className="text-xs text-[#8C7A7A] leading-relaxed">
              Scan your ID or enter credentials at any physical VendCare unit to unlock the products.
            </p>
          </div>

          {/* Step 4 */}
          <div className="group p-8 bg-[#4A3F3F] text-white rounded-[2.5rem] shadow-xl transition-all">
            <div className="h-12 w-12 bg-white/10 text-[#E29595] rounded-2xl flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-3">4. Collect</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Choose your quantity, and the machine will dispense your fresh moisturizer or fragrance.
            </p>
          </div>
        </div>
      </section>

      {/* --- MISSION SECTION --- */}
      <section className="bg-[#FFF5F5] rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-4xl font-serif italic mb-6">Our Mission</h2>
          <p className="text-[#8C7A7A] leading-relaxed mb-8">
            VendCare was born from a simple idea: self-care shouldn't be a luxury found only in high-end malls. 
            By combining IoT hardware with a secure fintech layer, we provide hygiene on-the-go 
            without compromising on quality or safety.
          </p>
          <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-[#E29595]">
            <span>Verified Products</span>
            <span>Secure IoT</span>
            <span>24/7 Access</span>
          </div>
        </div>
        <div className="flex-1 w-full h-64 bg-[#F3C5C5] rounded-[2rem] overflow-hidden flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#E29595]/20 to-transparent"></div>
          <span className="text-white font-serif italic text-4xl">Quality First.</span>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="mt-32 text-center">
        <h3 className="text-2xl font-serif italic mb-6">Ready to start your journey?</h3>
        <Link 
          href="/register" 
          className="inline-block bg-[#4A3F3F] text-white px-12 py-5 rounded-full font-bold text-xs tracking-widest hover:bg-[#E29595] transition-all shadow-xl"
        >
          CREATE YOUR ACCOUNT
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;