'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import TopStats from './components/TopStats';
import AnalyticsGraphs from './components/AnalyticsGraphs';
import SystemInsights from './components/SystemInsights';
import PendingRequestsTable from './components/PendingRequestsTable';
import IntelligencePanel from './components/IntelligencePanel';
import LiveInventory from './components/LiveInventory';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://final-year-project-f8ym.vercel.app";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ledgerRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/pending-topups`),
        fetch(`${API_BASE_URL}/api/admin/analytics`)
      ]);

      if (!ledgerRes.ok || !analyticsRes.ok) throw new Error("Server responded with an error");

      const ledgerData = await ledgerRes.json();
      const analyticsData = await analyticsRes.json();
setRefreshKey(prev => prev + 1);
      setRequests(ledgerData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(`Failed to connect to the Admin API at ${API_BASE_URL}. Ensure the backend service is active.`);
    } finally {
      setLoading(false);
    }
  };
const [refreshKey, setRefreshKey] = useState(0);


  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (cnic, reference_id) => {
    setProcessingId(reference_id);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/approve-topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnic, reference_id }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setRequests(prev => prev.filter(req => req.reference_id !== reference_id));
        fetchData(); 
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

       <TopStats analytics={analytics} />
        <IntelligencePanel suggestions={analytics?.suggestions} />
 {/* Modular Components Rendered Here */}
        
        
        <AnalyticsGraphs analytics={analytics} />
        
        <SystemInsights suggestions={analytics?.suggestions} />
<LiveInventory key={refreshKey} />
        <PendingRequestsTable 
          requests={requests} 
          onApprove={handleApprove} 
          processingId={processingId} 
        />

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