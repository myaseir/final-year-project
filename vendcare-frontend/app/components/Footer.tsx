export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-400 py-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div className="md:col-span-1">
          <h3 className="text-3xl font-serif text-white italic mb-6">Cakes By Kalsoom</h3>
          <p className="text-[11px] leading-relaxed font-light tracking-wide">
            Luxury patisserie located in Rawalpindi. We specialize in bespoke cake artistry for life's most precious moments.
          </p>
        </div>
        
        <div>
          <h4 className="text-white text-[10px] tracking-[0.3em] uppercase mb-8 font-semibold">The Studio</h4>
          <address className="not-italic text-[11px] font-light leading-loose">
            Rafi, Western Drive Block<br />
            Rawalpindi, 46000<br />
            Pakistan
          </address>
        </div>

        <div>
          <h4 className="text-white text-[10px] tracking-[0.3em] uppercase mb-8 font-semibold">Orders</h4>
          <div className="flex flex-col gap-2 text-[11px] font-light">
            <a href="tel:03335539381" className="hover:text-amber-500 text-stone-200 transition-colors">+92 333 5539381</a>
            <p>Mon - Sat: 10AM - 8PM</p>
          </div>
        </div>

        <div>
          <h4 className="text-white text-[10px] tracking-[0.3em] uppercase mb-8 font-semibold">Social</h4>
          <div className="flex gap-6 text-[11px] font-light">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-4 transition-colors">Instagram</a>
            <a href="https://wa.me/923335539381" target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-4 transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase gap-4">
        <div className="text-stone-500">
          © {currentYear} CAKES BY KALSOOM
        </div>
        
        <div className="text-stone-500 flex items-center gap-2">
          <span>Digital Experience by</span>
          <a 
            href="https://glacialabs.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-stone-300 hover:text-amber-500 font-bold transition-colors tracking-[0.3em]"
          >
            GLACIA LABS
          </a>
        </div>

        <div className="text-stone-500">
          Handcrafted in Rawalpindi
        </div>
      </div>
    </footer>
  );
}