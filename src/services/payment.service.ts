import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Payment, CreatePaymentData } from '@/types/payment';

export const paymentService = {
  async create(data: CreatePaymentData): Promise<Payment> {
    const response = await api.post<ApiResponse<Payment>>('/payment', data);
    return response.data.data;
  },
};

