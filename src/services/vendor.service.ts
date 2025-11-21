import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { CreateVendorData, Vendor } from '@/types/vendor';

export const vendorService = {
  async create(data: CreateVendorData): Promise<Vendor> {
    const response = await api.post<ApiResponse<Vendor>>('/vendors', data);
    return response.data.data;
  },

  async findAll(): Promise<Vendor[]> {
    const response = await api.get<ApiResponse<Vendor[]>>('/vendors');
    return response.data.data;
  },

  async findOne(id: string): Promise<Vendor> {
    const response = await api.get<ApiResponse<Vendor>>(`/vendors/${id}`);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateVendorData>): Promise<Vendor> {
    const response = await api.put<ApiResponse<Vendor>>(`/vendors/${id}`, data);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/vendors/${id}`);
  },
};
