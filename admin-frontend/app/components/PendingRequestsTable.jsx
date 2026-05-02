'use client';

import React from 'react';

export default function PendingRequestsTable({ requests, onApprove, processingId }) {
  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-xl font-serif italic text-[#4A3F3F]">Pending Wallet Deposits</h3>
        <div className="h-px flex-grow bg-[#F9EAEA]"></div>
      </div>

      {requests && requests.length > 0 ? (
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
                        onClick={() => onApprove(req.cnic, req.reference_id)}
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
  );
}