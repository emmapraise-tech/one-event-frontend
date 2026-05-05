export enum PaymentProvider {
	PAYSTACK = 'PAYSTACK',
	STRIPE = 'STRIPE',
	FLUTTERWAVE = 'FLUTTERWAVE',
	CASH = 'CASH',
}

export enum PaymentStatus {
	PENDING = 'PENDING',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	REFUNDED = 'REFUNDED',
}

export enum PaymentType {
	FULL_PAYMENT = 'FULL_PAYMENT',
	DEPOSIT = 'DEPOSIT',
	PARTIAL = 'PARTIAL',
	BALANCE_PAYMENT = 'BALANCE_PAYMENT',
}

export interface Payment {
	id: string;
	bookingId: string;
	provider: PaymentProvider;
	amount: number;
	currency: string;
	paymentType: PaymentType;
	status: PaymentStatus;
	reference?: string;
	metadata?: Record<string, any>;
	paidAt?: string;
	refundedAt?: string;
	deletedAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreatePaymentData {
	bookingId: string;
	provider?: PaymentProvider;
	amount?: number;
	paymentType?: PaymentType;
	metadata?: Record<string, any>;
	callbackUrl?: string;
	reference?: string;
}
