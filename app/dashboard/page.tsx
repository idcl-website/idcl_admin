"use client"

import React, { useEffect, useState } from 'react';
import { getActiveUsers, getRevenueBreakdown, getFlaggedContent } from '@/services/adminReports';
import api from '@/services/api';

export default function DashboardOverview() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [flaggedContent, setFlaggedContent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      // Get total users (all time)
      getActiveUsers({ from: '1970-01-01', to: new Date().toISOString() }),
      // Get active campaigns (custom endpoint)
      api.get('/admin/reports/campaign-performance/success-rate').then(res => res.data),
      getRevenueBreakdown(),
      getFlaggedContent(),
    ])
      .then(([users, campaigns, rev, flagged]) => {
        setTotalUsers(users.activeUsers);
        setActiveCampaigns(campaigns.ongoing ?? null);
        setRevenue(rev.revenue);
        setFlaggedContent(flagged.flagged?.length ?? 0);
      })
      .catch((err) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold">{totalUsers ?? '--'}</div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Active Campaigns</div>
            <div className="text-3xl font-bold">{activeCampaigns ?? '--'}</div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Revenue</div>
            <div className="text-3xl font-bold">₦{revenue?.toLocaleString() ?? '--'}</div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Flagged Content</div>
            <div className="text-3xl font-bold">{flaggedContent ?? '--'}</div>
          </div>
        </div>
      )}
      <div className="text-gray-400">(Add charts and more summary info here...)</div>
    </div>
  );
} 