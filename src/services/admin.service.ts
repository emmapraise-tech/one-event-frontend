import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface AdminDashboardTotals {
  users: number;
  vendors: number;
  listings: number;
  pendingListings: number;
  bookings: number;
  revenue: number;
}

export interface AdminDashboardData {
  totals: AdminDashboardTotals;
  topVendors: Array<{
    id: string;
    name: string;
    listings: number;
    owner: string;
  }>;
  recentBookings: Array<{
    id: string;
    customer: string;
    listing: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

export const adminService = {
  async getDashboardData(): Promise<AdminDashboardData> {
    const response = await api.get<ApiResponse<AdminDashboardData>>('/admin/dashboard');
    return response.data.data;
  },

  async clearCache(): Promise<void> {
    await api.delete('/admin/cache/clear');
  },
};
