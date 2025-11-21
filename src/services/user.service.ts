import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/auth';

export const userService = {
  async findAll(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  async findOne(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },
};

