'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ListingType, ListingFormData } from '@/types/listing';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ListingSidebar } from './ListingSidebar';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { LocationStep } from './steps/LocationStep';
import { SpecificationStep } from './steps/SpecificationStep';
import { MediaStep } from './steps/MediaStep';
import { PricingStep } from './steps/PricingStep';
import { cn } from '@/lib/utils';

const initialData: ListingFormData = {
	type: ListingType.VENUE,
	title: '',
	slug: '',
	description: '',
	currency: 'NGN',
	priceStrategy: 'weekday_weekend',
	addressLine: '',
	city: '',
	state: '',
	country: 'Nigeria',
	amenities: [],
	imageUrls: [],
	imageFiles: [],
};

const STEPS = [
	{ id: 1, label: 'Basic Info', component: BasicInfoStep },
	{ id: 2, label: 'Location', component: LocationStep },
	{ id: 3, label: 'Specification', component: SpecificationStep },
	{ id: 4, label: 'Media', component: MediaStep },
	{ id: 5, label: 'Pricing', component: PricingStep },
];

export function ListingWizard() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<ListingFormData>(initialData);

	const updateFormData = (data: Partial<ListingFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }));
	};

	const handleNext = () => {
		if (currentStep < STEPS.length) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const CurrentStepComponent = STEPS[currentStep - 1].component;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between px-1">
				<div className="space-y-4">
					<Link
						href="/dashboard/listings"
						className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Listings
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">
							Add New Event Center
						</h1>
						<p className="text-muted-foreground mt-2 text-base max-w-2xl">
							Fill in the details below to publish your new venue listing.
						</p>
					</div>
				</div>
				<div className="flex gap-3 pt-2">
					<Button
						variant="outline"
						className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-6 py-6 h-auto shadow-sm"
					>
						Save Draft
					</Button>
					<Button className="bg-brand-gold hover:bg-brand-gold-hover text-white font-bold px-6 py-6 h-auto shadow-sm shadow-orange-200">
						Publish Listing
					</Button>
				</div>
			</div>

			{/* Progress Tabs */}
			<div className="w-full overflow-x-auto pb-2 -mx-1 px-1">
				<div className="flex items-center min-w-max border-b border-gray-100">
					{STEPS.map((step) => {
						const isCompleted = step.id < currentStep;
						const isCurrent = step.id === currentStep;

						return (
							<button
								key={step.id}
								onClick={() => isCompleted && setCurrentStep(step.id)}
								disabled={!isCompleted && !isCurrent}
								className={cn(
									'group flex items-center gap-3 px-6 py-4 border-b-2 transition-all duration-200 outline-none',
									isCurrent
										? 'border-primary bg-primary/5'
										: 'border-transparent hover:bg-gray-50',
									!isCompleted &&
										!isCurrent &&
										'opacity-50 cursor-not-allowed hover:bg-transparent',
								)}
							>
								<div
									className={cn(
										'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors shadow-sm',
										isCompleted
											? 'bg-primary text-primary-foreground'
											: isCurrent
												? 'bg-primary text-primary-foreground ring-4 ring-primary/10'
												: 'bg-gray-100 text-gray-500',
									)}
								>
									{isCompleted ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											className="h-4 w-4"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										step.id
									)}
								</div>
								<span
									className={cn(
										'text-sm font-semibold tracking-wide',
										isCurrent
											? 'text-primary'
											: 'text-gray-500 group-hover:text-gray-900',
									)}
								>
									{step.label}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
				{/* Main Content */}
				<div className="space-y-6">
					<div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
						{/* @ts-ignore - temporary until steps are fully typed */}
						<CurrentStepComponent
							formData={formData}
							updateFormData={updateFormData}
							onNext={handleNext}
							onBack={handleBack}
							isFirstStep={currentStep === 1}
							isLastStep={currentStep === STEPS.length}
						/>
					</div>
				</div>

				{/* Sidebar */}
				<aside className="sticky top-8">
					<ListingSidebar
						currentStep={currentStep}
						totalSteps={STEPS.length}
						formData={formData}
					/>
				</aside>
			</div>
		</div>
	);
}
