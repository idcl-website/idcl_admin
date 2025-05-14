/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from 'react';
import {
  getRevenueBreakdown,
  getPaymentStatus,
  getEarningsByPromoters,
} from '@/services/adminReports';

export default function FinancialsPage() {
  const [revenue, setRevenue] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [topEarners, setTopEarners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getRevenueBreakdown(),
      getPaymentStatus(),
      getEarningsByPromoters(),
    ])
      .then(([rev, status, earners]) => {
        setRevenue(rev.revenue);
        setPaymentStatus(status);
        setTopEarners(earners.topEarners || []);
      })
      .catch((err) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Financials</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Revenue Breakdown</div>
            <div className="text-3xl font-bold">₦{revenue?.toLocaleString() ?? '--'}</div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Payment Status</div>
            <div className="text-3xl font-bold">
              In Wallet: ₦{paymentStatus?.inWallet?.toLocaleString() ?? '--'}<br />
              Spent: ₦{paymentStatus?.spent?.toLocaleString() ?? '--'}<br />
              Withdrawn: ₦{paymentStatus?.withdrawn?.toLocaleString() ?? '--'}<br />
              Failed: ₦{paymentStatus?.failed?.toLocaleString() ?? '--'}
            </div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Earnings by Promoters</div>
            <div className="text-3xl font-bold">
              {topEarners.length > 0
                ? `Top: ₦${topEarners[0].total?.toLocaleString() ?? '--'}`
                : '--'}
            </div>
          </div>
        </div>
      )}
      <div className="text-gray-400">(Add charts/tables for financials here...)</div>
    </div>
  );
} 