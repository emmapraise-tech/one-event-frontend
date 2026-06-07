import { z } from 'zod';
import { UserType } from '@/types/auth';

export const loginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
});

export const registerSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: 'First name must be at least 2 characters' }),
	lastName: z
		.string()
		.min(2, { message: 'Last name must be at least 2 characters' }),
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters' })
		.regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
		.regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
		.regex(/[0-9]/, { message: 'Password must contain at least one number' })
		.regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
	phone: z
		.string()
		.min(10, { message: 'Phone number must be at least 10 digits' }),
	type: z.nativeEnum(UserType),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
