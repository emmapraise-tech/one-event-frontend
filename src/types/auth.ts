export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email: string;
  phone: string;
  type: 'CUSTOMER' | 'SERVICE_PROVIDER' | 'ADMIN';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  phone: string;
  role?: 'CUSTOMER' | 'SERVICE_PROVIDER';
}
