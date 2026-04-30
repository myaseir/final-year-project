"use client";

export default function Hero() {
  const ORDER_LINK = "https://wa.me/923335539381";
  const HERO_IMAGE = "https://images.unsplash.com/photo-1595272568891-123402d0fb3b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-stone-100 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_IMAGE} 
          alt="Artisanal Cake Design" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-stone-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-transparent to-stone-900/60"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-6">
        <h1 className="text-[12vw] md:text-[8rem] font-serif text-white leading-none tracking-tighter mb-4 animate-fade-in drop-shadow-lg">
          Cakes By <span className="italic block md:inline">Kalsoom</span>
        </h1>
        
        <div className="h-px w-12 md:w-24 bg-white mb-8 opacity-80"></div>

        <div className="flex flex-col items-center gap-3 mb-12">
          <p className="text-xs md:text-lg tracking-[0.4em] uppercase text-white font-light">
            Bespoke Patisserie <span className="mx-2">&</span> Custom Bakes
          </p>
          <span className="text-[10px] tracking-[0.6em] uppercase text-stone-200">Rawalpindi</span>
        </div>

        <a 
          href={ORDER_LINK}
          target="_blank"
          className="group relative px-10 py-4 md:px-16 md:py-6 bg-white text-stone-900 text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold overflow-hidden transition-all duration-700 hover:text-white"
        >
          <span className="relative z-10">Order Your Cake</span>
          <div className="absolute inset-0 bg-amber-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
        </a>
      </div>

      <style jsx>{`
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 25s infinite alternate ease-in-out; }
        .animate-fade-in { animation: fadeIn 2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}