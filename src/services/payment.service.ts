import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Payment, CreatePaymentData } from '@/types/payment';

export const paymentService = {
	async create(data: CreatePaymentData): Promise<Payment> {
		const response = await api.post<ApiResponse<Payment>>('/payment', data);
		return response.data.data;
	},

	async verify(reference: string): Promise<any> {
		const response = await api.get<ApiResponse<any>>(
			`/payment/verify/${reference}`,
		);
		return response.data.data;
	},
};
