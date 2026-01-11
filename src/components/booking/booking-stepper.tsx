import { Check } from 'lucide-react';

interface BookingStepperProps {
	currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
	const steps = [
		{ id: 1, label: 'Select Venue' },
		{ id: 2, label: 'Add Services' },
		{ id: 3, label: 'Review & Payment' },
	];

	return (
		<div className="flex items-center gap-4 text-sm font-medium text-neutral-500 mb-8">
			{steps.map((step, index) => (
				<div key={step.id} className="flex items-center gap-2">
					<div
						className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${
							step.id <= currentStep
								? 'bg-brand-blue text-white'
								: 'bg-neutral-200 text-neutral-500'
						}`}
					>
						{step.id < currentStep ? (
							<Check className="w-3.5 h-3.5" />
						) : (
							step.id
						)}
					</div>
					<span
						className={
							step.id === currentStep ? 'text-brand-blue font-bold' : ''
						}
					>
						{step.label}
					</span>
					{index < steps.length - 1 && (
						<span className="text-neutral-300 mx-2">›</span>
					)}
				</div>
			))}
		</div>
	);
}
