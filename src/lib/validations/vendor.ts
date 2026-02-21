import { z } from 'zod';

export const vendorOnboardingSchema = z.object({
	businessLogo: z.string().optional(),
	businessName: z
		.string()
		.min(3, 'Business name must be at least 3 characters'),
	businessAddress: z
		.string()
		.min(5, 'Business address must be at least 5 characters'),
	businessPhone: z.string().min(10, 'Business phone is required'),
	businessEmail: z.string().email('Invalid email address'),
	businessDescription: z
		.string()
		.min(10, 'Description must be at least 10 characters'),
	cacNumber: z.string().min(1, 'CAC Number is required'),
	taxNumber: z.string().min(1, 'Tax Number is required'),
	rcNumber: z.string().min(1, 'RC Number is required'),
	bankName: z.string().min(1, 'Bank name is required'),
	bankAccountNumber: z.string().min(10, 'Account number must be 10 digits'),
	bankAccountName: z.string().min(3, 'Account name is required'),
});

export type VendorOnboardingValues = z.infer<typeof vendorOnboardingSchema>;
