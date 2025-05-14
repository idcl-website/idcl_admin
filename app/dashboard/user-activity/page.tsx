/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from 'react';
import { getActiveUsers, getNewRegistrations, getUserEngagement } from '@/services/adminReports';

export default function UserActivityPage() {
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [newRegistrations, setNewRegistrations] = useState<number | null>(null);
  const [userEngagement, setUserEngagement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getActiveUsers(),
      getNewRegistrations({ period: 'daily' }),
      getUserEngagement(),
    ])
      .then(([active, registrations, engagement]) => {
        setActiveUsers(active.activeUsers);
        setNewRegistrations(registrations.newRegistrations);
        setUserEngagement(engagement);
      })
      .catch((err) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Activity</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Active Users</div>
            <div className="text-3xl font-bold">{activeUsers ?? '--'}</div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">New Registrations</div>
            <div className="text-3xl font-bold">{newRegistrations ?? '--'}</div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <div className="text-gray-500 text-sm mb-2">User Engagement</div>
            <div className="text-3xl font-bold">
              {userEngagement ? `Logins (7d): ${userEngagement.loginsLast7Days}` : '--'}
            </div>
          </div>
        </div>
      )}
      <div className="text-gray-400">(Add charts/tables for user activity here...)</div>
    </div>
  );
} 