'use client';
import React, { useState } from 'react';
import { api } from '../lib/api';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCnic: string;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, userCnic }) => {
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Use custom amount if the toggle is active, otherwise use preset
    const finalAmount = isCustom ? parseInt(customAmount) : amount;

    if (isNaN(finalAmount) || finalAmount <= 0) {
      setStatus('error');
      setLoading(false);
      return;
    }

    try {
      const res = await api.requestTopup({
        cnic: userCnic,
        amount: finalAmount,
        reference_id: transactionId // Mapping transactionId to the API's reference_id
      });

      if (res && res.success) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus(null);
          setTransactionId('');
          setCustomAmount('');
          setIsCustom(false);
        }, 2500);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#4A3F3F]/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl border border-[#F9EAEA] animate-in fade-in zoom-in duration-300">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-serif italic text-[#4A3F3F]">Refill Wallet</h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#E29595] mt-1">Submit Top-up Request</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-[#FFF5F5] text-[#F3C5C5] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8 space-y-4 animate-in slide-in-from-bottom-4">
            <div className="h-20 w-20 bg-[#FFF5F5] text-[#E29595] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-serif italic text-[#4A3F3F]">Request Submitted</p>
            <p className="text-xs text-[#8C7A7A]">Verification in progress...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Amount Selection Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-bold text-[#E29595] uppercase tracking-[0.2em]">
                  Top-up Amount
                </label>
                <button 
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-[10px] font-bold text-[#4A3F3F] underline decoration-[#E29595] underline-offset-4"
                >
                  {isCustom ? "Select Preset" : "Custom Amount"}
                </button>
              </div>

              {isCustom ? (
                <div className="animate-in fade-in slide-in-from-top-1">
                  <input 
                    type="number"
                    placeholder="Enter amount (PKR)"
                    className="w-full p-4 bg-[#FFF5F5] border border-[#F9EAEA] rounded-2xl text-sm text-[#4A3F3F] focus:outline-none focus:ring-4 focus:ring-[#E29595]/10"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[200, 500, 1000, 2000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                        amount === val 
                          ? 'bg-[#4A3F3F] text-white border-[#4A3F3F] shadow-md shadow-[#4A3F3F]/20' 
                          : 'bg-white text-[#8C7A7A] border-[#F9EAEA] hover:border-[#E29595]'
                      }`}
                    >
                      {val} PKR
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Transaction ID Section */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#E29595] uppercase tracking-[0.2em] ml-4">
                Transaction ID
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. T20260430XXXX"
                className="w-full p-4 bg-[#FFF5F5] border border-[#F9EAEA] rounded-full text-sm text-[#4A3F3F] focus:outline-none focus:ring-4 focus:ring-[#E29595]/10 placeholder:text-[#F3C5C5]"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>

            {status === 'error' && (
              <p className="text-[10px] text-center text-red-400 font-bold uppercase animate-bounce">
                Invalid entry, please try again
              </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#E29595] text-white py-4.5 rounded-full font-bold text-xs tracking-[0.2em] shadow-xl shadow-[#E29595]/20 hover:bg-[#D48484] transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? 'PROCESSING...' : 'CONFIRM REQUEST'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TopUpModal;