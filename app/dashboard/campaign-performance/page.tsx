/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from 'react';
import {
  getCampaignSuccessRate,
  getReachEngagement,
  getTopCampaigns,
  getTotalImpressions,
} from '@/services/adminReports';

export default function CampaignPerformancePage() {
  const [successRate, setSuccessRate] = useState<any>(null);
  const [reachEngagement, setReachEngagement] = useState<any>(null);
  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);
  const [totalImpressions, setTotalImpressions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCampaignSuccessRate(),
      getReachEngagement(),
      getTopCampaigns(),
      getTotalImpressions(),
    ])
      .then(([success, reach, top, impressions]) => {
        setSuccessRate(success);
        setReachEngagement(reach);
        setTopCampaigns(top.topCampaigns || []);
        setTotalImpressions(impressions.totalImpressions);
      })
      .catch((err) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Campaign Performance</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Success Rate</div>
            <div className="text-3xl font-bold">
              {successRate ? `${(successRate.successRate * 100).toFixed(1)}%` : '--'}
            </div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Reach & Engagement</div>
            <div className="text-3xl font-bold">
              {reachEngagement ? `Impr: ${reachEngagement.impressions}` : '--'}
            </div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Top Campaigns</div>
            <div className="text-3xl font-bold">
              {topCampaigns.length > 0 ? topCampaigns[0].title : '--'}
            </div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Total Impressions</div>
            <div className="text-3xl font-bold">{totalImpressions ?? '--'}</div>
          </div>
        </div>
      )}
      <div className="text-gray-400">(Add charts/tables for campaign performance here...)</div>
    </div>
  );
} 