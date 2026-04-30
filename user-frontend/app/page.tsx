import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center overflow-hidden">
      {/* Soft Gradient Blob for Background */}
      <div className="absolute top-20 -left-20 h-64 w-64 bg-[#F9EAEA] rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-10 -right-20 h-80 w-80 bg-[#FFF5F5] rounded-full blur-3xl opacity-50 -z-10"></div>

      {/* Aesthetic Badge */}
      <div className="mb-8 inline-flex items-center rounded-full bg-white border border-[#F9EAEA] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E29595]">
        Self-care. Anytime. Anywhere.
      </div>

      {/* Hero Text */}
      <h1 className="max-w-4xl text-5xl font-light italic tracking-tight text-[#4A3F3F] md:text-7xl leading-tight">
        Your Beauty <span className="font-bold not-italic">Refill</span> <br />
        in a <span className="text-[#E29595]">Touch.</span>
      </h1>
      
      <p className="mt-8 max-w-lg text-lg text-[#8C7A7A] leading-relaxed">
        Premium fragrances and skincare dispensed instantly. <br />
        Sign in to manage your digital VendCare wallet.
      </p>

      {/* Main Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
        <Link 
          href="/login" 
          className="rounded-full bg-[#4A3F3F] px-10 py-4 text-sm font-semibold text-white shadow-xl hover:bg-[#5C4D4D] transition-all transform hover:-translate-y-1"
        >
          Sign In
        </Link>
        <Link 
          href="/register" 
          className="rounded-full bg-white border border-[#F9EAEA] px-10 py-4 text-sm font-semibold text-[#8C7A7A] hover:bg-[#FFF5F5] transition-all"
        >
          Join VendCare
        </Link>
      </div>

      {/* Product Categories Preview */}
      <div className="mt-20 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-[#E29595]">
        <span>Perfumes</span> • <span>Sunscreens</span> • <span>Moisturizers</span>
      </div>
    </div>
  );
}