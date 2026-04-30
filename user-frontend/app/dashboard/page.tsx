'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import TopUpModal from '../components/TopUpModal';

// Define the shape of our User data for TypeScript
interface UserHistory {
  product_name: string;
  machine_id: string;
  date: string;
  amount: number;
}

interface UserData {
  full_name: string;
  cnic: string;
  email: string;
  balance: number;
  history: UserHistory[];
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCnic = localStorage.getItem('userCnic');
    if (!localStorage.getItem('userCnic')) {
  router.push('/login');
}
    // Safety redirect if not logged in
    if (!storedCnic) {
      router.push('/login');
      return;
    }

    api.getProfile(storedCnic)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[#F3C5C5]"></div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#E29595]">Synchronizing your wallet...</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <p className="text-[#8C7A7A] font-serif italic text-xl">Session expired or user not found.</p>
      <button onClick={() => router.push('/login')} className="text-[#E29595] font-bold underline">Return to Login</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 text-[#4A3F3F]">
      
      {/* --- HEADER SECTION --- */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif italic leading-tight">
            Hello, <span className="font-bold not-italic">{user.full_name.split(' ')[0]}</span>
          </h1>
          <div className="flex flex-wrap gap-4 mt-3 text-[10px] font-bold text-[#8C7A7A] uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              ID: {user.cnic}
            </span>
            <span className="text-[#F3C5C5]">|</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {user.email}
            </span>
          </div>
        </div>
        
        <div className="bg-white border border-[#F9EAEA] px-5 py-3 rounded-2xl shadow-sm hidden md:block">
          <p className="text-[9px] font-bold text-[#E29595] uppercase tracking-widest mb-1">Status</p>
          <p className="text-xs font-bold text-[#4A3F3F]">Verified Member</p>
        </div>
      </header>

      {/* --- CARDS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        
        {/* Modern Balance Card */}
        <div className="bg-gradient-to-br from-[#4A3F3F] to-[#2D2626] text-white p-8 rounded-[2.5rem] shadow-2xl shadow-[#4A3F3F]/30 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 h-32 w-32 bg-white/5 rounded-full blur-2xl group-hover:bg-[#E29595]/20 transition-all duration-700"></div>
          
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-3 font-bold">Available Credit</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-light text-[#E29595]">PKR</span>
            <h2 className="text-5xl font-bold tracking-tighter">{user.balance.toLocaleString()}</h2>
          </div>
          
          <div className="mt-10 flex items-center justify-between">
             <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-[9px] font-bold uppercase tracking-widest">Active Wallet</span>
             </div>
             <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">VendCare System</p>
          </div>
        </div>
        
        {/* Top-up Action Card */}
        <div className="md:col-span-2 bg-white border border-[#F9EAEA] p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="z-10 text-center sm:text-left">
             <h4 className="text-lg font-serif italic text-[#4A3F3F]">Refill your balance</h4>
             <p className="text-xs text-[#8C7A7A] mt-1 max-w-[220px]">Submit a top-up request to the administrator for instant credit.</p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-[#E29595] text-white px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#D48484] transition-all shadow-xl shadow-[#E29595]/30 active:scale-95"
             >
               Request Top-up
             </button>
             <div className="hidden sm:block w-px h-10 bg-[#F9EAEA]"></div>
             <button className="text-[#8C7A7A] text-[10px] font-bold uppercase tracking-widest hover:text-[#E29595] transition-colors">
               Help Center
             </button>
           </div>
           
           <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-[#FFF5F5] rounded-full -z-0 opacity-50"></div>
        </div>
      </div>

      {/* --- RECENT ACTIVITY --- */}
      <section>
        <div className="flex items-center justify-between mb-8 px-4">
          <div>
            <h3 className="text-xl font-serif italic text-[#4A3F3F]">Self-Care History</h3>
            <p className="text-[10px] text-[#8C7A7A] uppercase tracking-widest font-bold mt-1">Automatic Logs from Vending Units</p>
          </div>
          <button className="text-[10px] font-bold text-[#E29595] border-b border-[#E29595] pb-0.5 tracking-widest hover:opacity-70 transition-opacity">
            VIEW ALL
          </button>
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-[#F9EAEA] rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F9EAEA] text-[#E29595] text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="p-8">Product Details</th>
                  <th className="p-8">Location ID</th>
                  <th className="p-8">Timestamp</th>
                  <th className="p-8 text-right">Debit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FDF8F8]">
                {user.history && user.history.length > 0 ? (
                  user.history.map((item, index) => (
                    <tr key={index} className="hover:bg-white/80 transition-all group cursor-default">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-full bg-[#FFF5F5] flex items-center justify-center text-[#E29595] group-hover:bg-[#E29595] group-hover:text-white transition-colors duration-300">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.675.337a2 2 0 01-1.78 0l-.675-.337a6 6 0 00-3.86-.517l-2.388.477a2 2 0 00-1.022.547l-.311.466a2 2 0 00-.272.71l-.145 1.74a2 2 0 00.992 1.893 2 2 0 001.008.27h14.504a2 2 0 001.008-.27 2 2 0 00.992-1.893l-.145-1.74a2 2 0 00-.272-.71l-.311-.466zM12 9V3m0 0l-3 3m3-3l3 3" /></svg>
                           </div>
                           <div>
                             <span className="font-bold text-sm block tracking-tight">{item.product_name}</span>
                             <span className="text-[10px] text-[#F3C5C5] uppercase tracking-widest font-bold">Care Collection</span>
                           </div>
                        </div>
                      </td>
                      <td className="p-8 text-xs text-[#8C7A7A] font-medium tracking-wider">{item.machine_id}</td>
                      <td className="p-8 text-xs text-[#8C7A7A] font-medium tracking-wide">{item.date}</td>
                      <td className="p-8 text-right font-bold text-[#4A3F3F] tabular-nums">- {item.amount} <span className="text-[10px] font-light">PKR</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <svg className="w-10 h-10 text-[#F3C5C5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        <p className="italic font-serif text-[#8C7A7A]">No beauty transactions recorded yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- MODAL COMPONENT --- */}
      <TopUpModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userCnic={user.cnic} 
      />
    </div>
  );
}