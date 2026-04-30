import React from 'react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-20 flex flex-col">
      
      {/* Editorial Header */}
      <section className="bg-zinc-950 text-zinc-200 py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-rose-800 text-[10px] md:text-xs tracking-[0.5em] font-bold uppercase mb-6 block">
            Reservations
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 italic tracking-tighter">
            Book an Appointment
          </h1>
          <p className="max-w-2xl mx-auto font-light leading-relaxed text-zinc-400 text-lg md:text-xl italic">
            "Fulfilling your beauty needs with great panache. Stand out from the crowd with our definitive finishing."
          </p>
        </div>
      </section>

      {/* Contact & Booking Content */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Studio Information */}
          <div className="flex flex-col items-start pt-4">
            <h2 className="text-4xl font-serif text-zinc-900 mb-10 italic">Studio Details</h2>
            
            <div className="mb-12 border-l-2 border-rose-900/30 pl-8 py-2">
              <h4 className="text-rose-900 text-[10px] tracking-[0.3em] font-bold uppercase mb-4">Location</h4>
              <p className="text-zinc-600 font-light text-lg leading-relaxed">
                NUMRA - Makeup Studio & Salon<br />
                Gulberg III, Lahore<br />
                Pakistan
              </p>
            </div>

            <div className="mb-12 border-l-2 border-rose-900/30 pl-8 py-2">
              <h4 className="text-rose-900 text-[10px] tracking-[0.3em] font-bold uppercase mb-4">Direct Enquiries</h4>
              <p className="text-zinc-600 font-light text-lg mb-2">
                <a href="mailto:appointments@numra.pk" className="hover:text-rose-800 transition-colors">appointments@numra.pk</a>
              </p>
              <p className="text-zinc-600 font-light text-lg">
                <a href="tel:+92420000000" className="hover:text-rose-800 transition-colors">+92 42 000 0000</a>
              </p>
            </div>

            <div className="mt-auto">
              <p className="text-[10px] tracking-widest uppercase text-zinc-400">
                Digital Architecture by <span className="text-zinc-900 font-bold">Glacia Labs</span>
              </p>
            </div>
          </div>

          {/* Luxury Appointment Form */}
          <div className="bg-zinc-50 p-8 md:p-12 shadow-2xl border border-zinc-100 relative">
            {/* Subtle decorative accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-900/5 -z-0"></div>
            
            <h3 className="text-2xl font-serif text-zinc-900 mb-8 italic relative z-10">Inquiry Form</h3>
            <form className="flex flex-col gap-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-bold">Full Name</label>
                  <input type="text" id="name" className="border-b border-zinc-300 py-3 focus:outline-none focus:border-rose-800 transition-colors bg-transparent text-zinc-900 text-sm font-light" placeholder="E.g. Maria Khan" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-bold">Phone Number</label>
                  <input type="tel" id="phone" className="border-b border-zinc-300 py-3 focus:outline-none focus:border-rose-800 transition-colors bg-transparent text-zinc-900 text-sm font-light" placeholder="+92 --- -------" required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="service" className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-bold">Desired Service</label>
                <select id="service" className="border-b border-zinc-300 py-3 focus:outline-none focus:border-rose-800 transition-colors bg-transparent text-zinc-900 text-sm font-light appearance-none">
                  <option>Bridal Makeup Signature</option>
                  <option>Party / Special Occasion</option>
                  <option>Editorial / Head-shot</option>
                  <option>Technical Hair Treatment</option>
                  <option>Luxury Skin Service</option>
                  <option>Private Lessons</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-bold">Additional Details</label>
                <textarea id="message" rows={3} className="border-b border-zinc-300 py-3 focus:outline-none focus:border-rose-800 transition-colors bg-transparent text-zinc-900 text-sm font-light resize-none" placeholder="Preferred dates or specific requirements..."></textarea>
              </div>

              <button 
                type="button" 
                className="mt-6 px-12 py-5 bg-zinc-950 hover:bg-rose-900 text-white text-[11px] tracking-[0.4em] uppercase font-bold transition-all duration-500 shadow-xl"
              >
                Request Appointment
              </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}