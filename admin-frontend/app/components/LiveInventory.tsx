'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Plus, Loader2, RefreshCw } from 'lucide-react';

/**
 * LiveInventory Component
 * Provides a categorized, glassmorphic visualization of 9 physical tanks.
 * Updated to bypass Vercel Edge caching and utilize environment variables.[cite: 7, 10]
 */
export default function LiveInventory() {
  const [tanks, setTanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refillingId, setRefillingId] = useState<number | 'all' | null>(null);

  // Strictly utilizes the environment variable for backend connectivity[cite: 2, 9]
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://final-year-project-f8ym.vercel.app";

  const fetchInventory = useCallback(async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    try {
      // Cache-busting: Append a unique timestamp to force fresh data from MongoDB[cite: 1, 10]
      const cacheBuster = new Date().getTime();
      const response = await fetch(`${API_BASE_URL}/api/admin/inventory?cb=${cacheBuster}`, {
        method: 'GET',
        headers: { 
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store' // Directs the browser to ignore its cache[cite: 1, 10]
      });

      if (response.ok) {
        const data = await response.json();
        setTanks(data);
      }
    } catch (error) {
      console.error("Hardware Telemetry Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [API_BASE_URL]);

  // Polling: Sync with hardware state every 10 seconds[cite: 7, 10]
  useEffect(() => {
    fetchInventory();
    const interval = setInterval(() => fetchInventory(), 10000);
    return () => clearInterval(interval);
  }, [fetchInventory]);

  const handleRefill = async (tankId: number | 'all') => {
    setRefillingId(tankId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/inventory/refill`, {
        method: 'POST', // Corrected method for the refill route[cite: 1, 10]
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: tankId }),
      });
      
      if (response.ok) {
        // Trigger immediate fetch to show updated levels[cite: 7, 10]
        await fetchInventory(); 
      }
    } catch (error) {
      console.error("Refill Command Failed:", error);
    } finally {
      setRefillingId(null);
    }
  };

 const renderCategoryGroup = (categoryName: string, accentColor: string) => {
    const filteredTanks = tanks.filter((t: any) => t.category === categoryName);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8C7A7A]">
            {categoryName}
          </h4>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {filteredTanks.map((tank: any) => {
            const percentage = (tank.current / tank.max) * 100;
            const isCritical = percentage < 30;

            return (
              <motion.div 
                key={tank.id} 
                layout
                className={`relative flex flex-col items-center bg-white/90 p-4 rounded-[2.5rem] border transition-all duration-500 shadow-sm ${
                  isCritical ? 'border-red-200 bg-red-50/30' : 'border-[#F9EAEA]'
                }`}
              >
                <div className="absolute top-3 w-full px-4 flex justify-between z-20">
                  <button 
                    onClick={() => handleRefill(tank.id)} 
                    disabled={refillingId !== null}
                    className="bg-white shadow-md p-1.5 rounded-full text-[#8C7A7A] hover:text-[#4A3F3F] active:scale-90 transition-transform disabled:opacity-50"
                  >
                    {refillingId === tank.id ? (
                      <Loader2 size={12} className="animate-spin text-[#E29595]" />
                    ) : (
                      <Plus size={12} />
                    )}
                  </button>
                  {isCritical && (
                    <div className="text-red-500">
                      <AlertCircle size={14} className="animate-pulse" />
                    </div>
                  )}
                </div>

                <p className="text-[9px] font-black text-center text-[#4A3F3F] uppercase tracking-tighter h-8 mb-2 mt-6 leading-tight px-1">
                  {tank.name}
                </p>

                {/* Glassmorphic Bottle Visualization */}
                <div className="w-10 h-28 bg-[#FDF8F8] rounded-b-2xl rounded-t-lg relative overflow-hidden shadow-inner border border-white/80">
                  <div className="absolute top-0 left-1 w-2 h-full bg-white/40 blur-[1px] z-10 rounded-full" />
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full"
                    style={{ backgroundColor: tank.color }}
                    initial={false}
                    animate={{ height: `${percentage}%` }}
                    transition={{ type: "spring", stiffness: 45, damping: 15 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-white/30" />
                  </motion.div>
                </div>

                <p className={`mt-3 text-lg font-bold tracking-tighter font-serif italic ${
                  isCritical ? 'text-red-500' : 'text-[#4A3F3F]'
                }`}>
                  {percentage.toFixed(1)}%
                </p>

                {/* --- NEW: Hardware Calibration Display --- */}
                <div className="mt-3 w-full bg-[#FDF8F8] border border-[#F9EAEA] rounded-xl p-2 text-center">
                  <p className="text-[7px] uppercase tracking-widest font-bold text-[#8C7A7A] mb-0.5">
                    Flow Calibration
                  </p>
                  <p className="text-[10px] font-mono text-[#4A3F3F] font-semibold">
                    {tank.ms_per_ml || 1500} <span className="opacity-50">ms/ml</span>
                  </p>
                </div>
                {/* -------------------------------------- */}

              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading && tanks.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#E29595]" size={32} />
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A7A]">Accessing Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF5F5]/30 backdrop-blur-md border border-[#F9EAEA] p-10 rounded-[3.5rem] shadow-sm relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E29595]/5 rounded-full blur-3xl" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div>
          <h3 className="text-3xl font-serif italic text-[#4A3F3F]">Machine Telemetry</h3>
          <p className="text-[#8C7A7A] text-[10px] font-bold uppercase tracking-[0.4em] mt-1">
            Real-Time Fluid Inventory
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fetchInventory(true)} 
            className="p-3 rounded-full border border-[#F9EAEA] text-[#8C7A7A] hover:bg-white transition-all shadow-sm"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => handleRefill('all')} 
            disabled={refillingId !== null}
            className="bg-[#4A3F3F] text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#332c2c] transition-all shadow-xl disabled:opacity-50"
          >
            {refillingId === 'all' ? "Processing..." : "Refill Full Machine"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        {renderCategoryGroup("Perfumes", "#E29595")}
        {renderCategoryGroup("Moisturizers", "#a7c7d8")}
        {renderCategoryGroup("Sunscreens", "#d8b4e2")}
      </div>

      <div className="mt-12 pt-6 border-t border-[#F9EAEA] flex justify-end">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-[#8C7A7A]">
            Backend Synchronized: Glacia Labs IOT-CORE 2.0
          </span>
        </div>
      </div>
    </div>
  );
}