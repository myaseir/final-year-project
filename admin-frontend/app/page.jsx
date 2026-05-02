'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, CartesianGrid, Legend
} from 'recharts';
import { 
  CheckCircle2, Clock, Users, CreditCard, Loader2, 
  AlertCircle, RefreshCw, TrendingUp, ShoppingBag, 
  Lightbulb, ArrowUpRight, Droplet 
} from 'lucide-react';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  // --- 1. FETCH DATA (Ledger & Analytics) ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallel fetch for ledger and volume-based analytics
      const [ledgerRes, analyticsRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/admin/pending-topups'),
        fetch('http://127.0.0.1:8000/api/admin/analytics')
      ]);

      const ledgerData = await ledgerRes.json();
      const analyticsData = await analyticsRes.json();

      setRequests(ledgerData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError("Failed to connect to the Admin API. Ensure backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (cnic, reference_id) => {
    setProcessingId(reference_id);
    try {
      const response = await fetch('https://final-year-project-f8ym.vercel.app/api/admin/approve-topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnic, reference_id }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setRequests(prev => prev.filter(req => req.reference_id !== reference_id));
        fetchData(); // Refresh volume stats after approval
      } else {
        alert(result.detail || "Approval failed.");
      }
    } catch (err) {
      alert("Network error. Could not approve transaction.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 size={40} className="animate-spin text-[#E29595] mb-4" />
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A7A]">Architecting Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#4A3F3F] font-sans pb-20">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-serif italic mb-1">Command Center</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E29595]">
              VENDCARE SYSTEM INTELLIGENCE
            </p>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#F9EAEA] text-[10px] font-bold uppercase tracking-widest hover:bg-[#FDF8F8] transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Synchronize
          </button>
        </header>

        {/* --- TOP LEVEL STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] shadow-sm">
            <TrendingUp className="text-[#E29595] mb-4" size={20} />
            <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Total Revenue</p>
            <h2 className="text-3xl font-bold">PKR {analytics?.total_revenue?.toLocaleString() || 0}</h2>
          </div>
          <div className="p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] shadow-sm">
            <ShoppingBag className="text-[#4A3F3F] mb-4" size={20} />
            <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Estimated Profit</p>
            <h2 className="text-3xl font-bold text-green-600">PKR {analytics?.estimated_profit?.toLocaleString() || 0}</h2>
          </div>
          <div className="p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] shadow-sm">
            <Droplet className="text-[#a7c7d8] mb-4" size={20} />
            <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Total Fluid Dispensed</p>
            <h2 className="text-3xl font-bold">{analytics?.total_volume_dispensed || 0} ml</h2>
          </div>
          <div className="p-8 bg-[#4A3F3F] text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <Lightbulb className="text-[#E29595] mb-4" size={20} />
             <p className="text-[9px] uppercase tracking-widest font-bold opacity-50 mb-1">Strategy</p>
             <h2 className="text-sm font-serif italic">Dosage Optimization</h2>
          </div>
        </div>

        {/* --- ANALYTICS GRAPHS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Chart 1: Product Volume Preferences */}
          <div className="bg-white p-10 border border-[#F9EAEA] rounded-[3rem] shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-serif italic">Avg. Dosage per Essence</h3>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">Milliliters (ml)</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.volume_analysis}>
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} 
                    cursor={{fill: '#FDF8F8'}} 
                  />
                  <Bar dataKey="avg_ml" fill="#a7c7d8" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Top Customers by Expenditure */}
          <div className="bg-white p-10 border border-[#F9EAEA] rounded-[3rem] shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-serif italic">Client Expenditure</h3>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">Top Spenders (PKR)</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.top_customers} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                  <Bar dataKey="value" fill="#4A3F3F" radius={[0, 10, 10, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- INTELLIGENCE PANEL --- */}
        <div className="mb-16 p-10 bg-[#FFF5F5] border border-[#F9EAEA] rounded-[3rem] flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/3">
            <div className="flex items-center gap-3 mb-4">
               <div className="h-8 w-8 rounded-full bg-[#E29595] flex items-center justify-center text-white">
                  <Lightbulb size={16} />
               </div>
               <h3 className="text-xl font-serif italic">System Insights</h3>
            </div>
            <p className="text-xs text-[#8C7A7A] leading-relaxed">
              Automated suggestions based on dispensing frequency, dose volume, and wallet activity.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics?.suggestions?.map((tip, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#F9EAEA] flex items-start gap-4 group hover:border-[#E29595] transition-colors">
                <ArrowUpRight className="text-[#E29595] mt-1 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wide leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- PENDING REQUESTS TABLE (LEDGER) --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xl font-serif italic text-[#4A3F3F]">Pending Wallet Deposits</h3>
            <div className="h-px flex-grow bg-[#F9EAEA]"></div>
          </div>

          {requests.length > 0 ? (
            <div className="bg-white border border-[#F9EAEA] rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#F9EAEA] text-[#E29595] text-[10px] uppercase tracking-[0.2em] font-bold">
                      <th className="p-8">Customer Detail</th>
                      <th className="p-8">Amount</th>
                      <th className="p-8">Reference</th>
                      <th className="p-8 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FDF8F8]">
                    {requests.map((req) => (
                      <tr key={req.reference_id} className="hover:bg-[#FDF8F8] transition-all group">
                        <td className="p-8">
                          <span className="font-bold text-sm block tracking-tight">{req.full_name}</span>
                          <span className="text-[10px] text-[#8C7A7A] uppercase tracking-wider">CNIC: {req.cnic}</span>
                        </td>
                        <td className="p-8 font-bold text-[#4A3F3F]">
                          PKR {req.amount.toLocaleString()}
                        </td>
                        <td className="p-8 font-mono text-[11px] opacity-40">
                          {req.reference_id}
                        </td>
                        <td className="p-8 text-right">
                          <button 
                            onClick={() => handleApprove(req.cnic, req.reference_id)}
                            disabled={processingId === req.reference_id}
                            className="bg-[#4A3F3F] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#E29595] transition-all disabled:opacity-50"
                          >
                            {processingId === req.reference_id ? 'WAIT...' : 'APPROVE'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-[#FDF8F8] rounded-[3rem] border border-dashed border-[#F9EAEA]">
              <p className="font-serif italic text-[#8C7A7A]">All wallet requests have been processed.</p>
            </div>
          )}
        </section>

        {error && (
          <div className="mt-10 p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <p className="text-[10px] font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}
      </div>

      <footer className="py-12 border-t border-[#F9EAEA] text-center">
         <p className="text-[8px] uppercase tracking-[0.5em] text-[#F3C5C5] font-bold">
            Glacia Labs • Professional IoT Management Suite
         </p>
      </footer>
    </div>
  );
}