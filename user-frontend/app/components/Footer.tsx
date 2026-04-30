import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#FDF8F8] border-t border-[#F9EAEA] py-12 mt-auto">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
          
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 bg-[#E29595] rounded-full opacity-80" />
              <span className="text-xl font-serif italic text-[#4A3F3F]">
                Vend<span className="text-[#E29595]">Care</span>
              </span>
            </div>
            <p className="text-[13px] text-[#8C7A7A] leading-relaxed text-center md:text-left max-w-[240px]">
              Premium self-care essentials, dispensed with elegance and care. 
              Always available when you need a touch of luxury.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E29595]">
              Explore
            </h4>
            <nav className="flex flex-col items-center md:items-start gap-3 text-sm text-[#4A3F3F]/80">
              <a href="#" className="hover:text-[#E29595] transition-colors">How it works</a>
              <a href="#" className="hover:text-[#E29595] transition-colors">Find a machine</a>
              <a href="#" className="hover:text-[#E29595] transition-colors">Support</a>
            </nav>
          </div>

          {/* Contact/Social Column */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E29595]">
              Contact
            </h4>
            <div className="text-sm text-[#4A3F3F]/80 space-y-1 text-center md:text-left">
              <p>Islamabad, Pakistan</p>
              <p className="hover:text-[#E29595] cursor-pointer">hello@vendcare.com</p>
            </div>
            
            {/* Soft System Status */}
            <div className="mt-4 flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-[#F9EAEA]">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#8C7A7A]">
                IoT Network Active
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#F9EAEA] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-[#F3C5C5] uppercase tracking-widest font-medium">
            © {currentYear} VendCare Personal Hygiene System
          </p>
          <div className="flex gap-6 text-[10px] text-[#F3C5C5] uppercase tracking-widest font-medium">
            <a href="#" className="hover:text-[#E29595]">Privacy</a>
            <a href="#" className="hover:text-[#E29595]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;