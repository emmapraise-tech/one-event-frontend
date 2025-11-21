import { User } from './auth';

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite: string;
  businessLogo: string;
  businessDescription: string;
  taxNumber: string;
  cacNumber: string;
  rcNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  user?: User;
}

export interface CreateVendorData {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite?: string;
  businessLogo?: string;
  businessDescription?: string;
  taxNumber?: string;
  cacNumber?: string;
  rcNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}
