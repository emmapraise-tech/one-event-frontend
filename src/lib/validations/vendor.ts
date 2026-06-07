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
	verificationMethod: z.enum(['cac', 'tax']).default('cac'),
	cacNumber: z.string().optional(),
	taxNumber: z.string().optional(),
	acceptedPaymentMethod: z.enum(['online', 'offline', 'both']).default('both'),
	bankCode: z.string().optional(),
	bankName: z.string().optional(),
	bankAccountNumber: z.string().optional(),
	bankAccountName: z.string().optional(),
}).superRefine((data, ctx) => {
	if (data.verificationMethod === 'cac') {
		if (!data.cacNumber || data.cacNumber.trim().length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'CAC Number is required',
				path: ['cacNumber'],
			});
		}
	} else if (data.verificationMethod === 'tax') {
		if (!data.taxNumber || data.taxNumber.trim().length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Tax Identification Number (TIN) is required',
				path: ['taxNumber'],
			});
		}
	}

	if (data.acceptedPaymentMethod === 'online' || data.acceptedPaymentMethod === 'both') {
		if (!data.bankCode || data.bankCode.trim().length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Please select your bank',
				path: ['bankCode'],
			});
		}
		if (!data.bankAccountNumber || data.bankAccountNumber.trim().length !== 10) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Account number must be exactly 10 digits',
				path: ['bankAccountNumber'],
			});
		}
		if (!data.bankAccountName || data.bankAccountName.trim().length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Account name must be verified',
				path: ['bankAccountNumber'],
			});
		}
	}
});

export type VendorOnboardingValues = z.infer<typeof vendorOnboardingSchema>;
