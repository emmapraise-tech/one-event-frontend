'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, Banknote } from 'lucide-react'; // Fallback icons

interface PaymentMethodSelectorProps {
	value: string;
	onChange: (value: string) => void;
}

export function PaymentMethodSelector({
	value,
	onChange,
}: PaymentMethodSelectorProps) {
	return (
		<RadioGroup
			value={value}
			onValueChange={onChange}
			className="grid grid-cols-1 md:grid-cols-3 gap-4"
		>
			<div
				className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 cursor-pointer transition-all ${
					value === 'paystack'
						? 'border-brand-blue bg-brand-blue-soft'
						: 'border-neutral-200 hover:border-brand-blue/50 hover:bg-neutral-50'
				}`}
				onClick={() => onChange('paystack')}
			>
				<RadioGroupItem
					value="paystack"
					id="paystack"
					className="absolute top-4 right-4 text-brand-blue border-brand-blue"
				/>
				{/* Placeholder for Paystack Logo - using text for now */}
				<div className="text-xl font-bold text-brand-blue lowercase">
					paystack
				</div>
				<span className="text-xs text-neutral-500 text-center">
					Pay with Card, Bank Transfer, or USSD
				</span>
			</div>

			<div
				className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 cursor-pointer transition-all ${
					value === 'flutterwave'
						? 'border-brand-blue bg-brand-blue-soft'
						: 'border-neutral-200 hover:border-brand-blue/50 hover:bg-neutral-50'
				}`}
				onClick={() => onChange('flutterwave')}
			>
				<RadioGroupItem
					value="flutterwave"
					id="flutterwave"
					className="absolute top-4 right-4 text-brand-blue border-brand-blue"
				/>
				{/* Placeholder for Flutterwave Logo */}
				<div className="text-xl font-bold text-orange-400 italic">
					flutterwave
				</div>
				<span className="text-xs text-neutral-500 text-center">
					Secure Payment via Flutterwave Gateway
				</span>
			</div>

			<div
				className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 cursor-pointer transition-all ${
					value === 'monnify'
						? 'border-brand-blue bg-brand-blue-soft'
						: 'border-neutral-200 hover:border-brand-blue/50 hover:bg-neutral-50'
				}`}
				onClick={() => onChange('monnify')}
			>
				<RadioGroupItem
					value="monnify"
					id="monnify"
					className="absolute top-4 right-4 text-brand-blue border-brand-blue"
				/>
				{/* Placeholder for Monnify Logo */}
				<div className="text-xl font-bold text-blue-600">monnify</div>
				<span className="text-xs text-neutral-500 text-center">
					Instant Bank Transfer & Card Payment
				</span>
			</div>
		</RadioGroup>
	);
}
