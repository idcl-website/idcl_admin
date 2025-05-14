import api from './api';

// 1. User Activity Reports
export const getActiveUsers = (params?: { from?: string; to?: string }) =>
  api.get('/admin/reports/user-activity/active-users', { params }).then(res => res.data);

export const getNewRegistrations = (params?: { period?: string }) =>
  api.get('/admin/reports/user-activity/new-registrations', { params }).then(res => res.data);

export const getUserEngagement = () =>
  api.get('/admin/reports/user-activity/engagement').then(res => res.data);

// 2. Campaign Performance Reports
export const getCampaignSuccessRate = () =>
  api.get('/admin/reports/campaign-performance/success-rate').then(res => res.data);

export const getReachEngagement = () =>
  api.get('/admin/reports/campaign-performance/reach-engagement').then(res => res.data);

export const getTopCampaigns = () =>
  api.get('/admin/reports/campaign-performance/top-campaigns').then(res => res.data);

export const getTotalImpressions = () =>
  api.get('/admin/reports/campaign-performance/total-impressions').then(res => res.data);

// 3. Financial Reports
export const getRevenueBreakdown = () =>
  api.get('/admin/reports/financials/revenue-breakdown').then(res => res.data);

export const getPaymentStatus = () =>
  api.get('/admin/reports/financials/payment-status').then(res => res.data);

export const getEarningsByPromoters = () =>
  api.get('/admin/reports/financials/earnings-by-promoters').then(res => res.data);

export const getFlaggedContent = () =>
  api.get('/admin/reports/platform-health/flagged-content').then(res => res.data);

// Add more as needed for other sections... 