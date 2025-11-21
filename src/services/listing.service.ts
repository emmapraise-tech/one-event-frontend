import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { CreateListingData, Listing, ListingStatus, ListingType } from '@/types/listing';

export const listingService = {
  async create(data: CreateListingData): Promise<Listing> {
    const response = await api.post<ApiResponse<Listing>>('/listings', data);
    return response.data.data;
  },

  async findAll(): Promise<Listing[]> {
    const response = await api.get<ApiResponse<Listing[]>>('/listings');
    return response.data.data;
  },

  async findOne(id: string): Promise<Listing> {
    const response = await api.get<ApiResponse<Listing>>(`/listings/${id}`);
    return response.data.data;
  },

  async findBySlug(slug: string): Promise<Listing> {
    const response = await api.get<ApiResponse<Listing>>(`/listings/slug/${slug}`);
    return response.data.data;
  },

  async findByVendorId(vendorId: string): Promise<Listing[]> {
    const response = await api.get<ApiResponse<Listing[]>>(`/listings/vendor/${vendorId}`);
    return response.data.data;
  },

  async findByType(type: ListingType): Promise<Listing[]> {
    const response = await api.get<ApiResponse<Listing[]>>(`/listings/type/${type}`);
    return response.data.data;
  },

  async search(query: string): Promise<Listing[]> {
    const response = await api.get<ApiResponse<Listing[]>>(`/listings/search?q=${query}`);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateListingData>): Promise<Listing> {
    const response = await api.put<ApiResponse<Listing>>(`/listings/${id}`, data);
    return response.data.data;
  },

  async updateStatus(id: string, status: ListingStatus): Promise<Listing> {
    const response = await api.put<ApiResponse<Listing>>(`/listings/${id}/status`, { status });
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/listings/${id}`);
  },
};
