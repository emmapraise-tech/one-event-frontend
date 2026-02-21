'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	vendorOnboardingSchema,
	VendorOnboardingValues,
} from '@/lib/validations/vendor';
import { useVendors } from '@/hooks/useVendors';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import {
	Building2,
	MapPin,
	Phone,
	Mail,
	Wallet,
	CheckCircle2,
	ArrowRight,
	Loader2,
	FileText,
	Shield,
	ImagePlus,
	Upload,
} from 'lucide-react';
import Image from 'next/legacy/image';
import { useState } from 'react';
import { toast } from 'sonner';

export default function OnboardVendorPage() {
	const { user } = useAuth();
	const { createVendor, isCreating } = useVendors();
	const router = useRouter();
	const [step, setStep] = useState(1);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isValid },
		trigger,
	} = useForm<VendorOnboardingValues>({
		resolver: zodResolver(vendorOnboardingSchema),
		mode: 'onChange',
		defaultValues: {
			businessLogo: '',
		},
	});

	const businessLogo = watch('businessLogo');

	const nextStep = async () => {
		let fields: (keyof VendorOnboardingValues)[] = [];
		if (step === 1) {
			fields = ['businessName', 'businessDescription'];
		} else if (step === 2) {
			fields = ['cacNumber', 'rcNumber', 'taxNumber'];
		} else if (step === 3) {
			fields = [
				'businessAddress',
				'businessPhone',
				'businessEmail',
				'bankName',
				'bankAccountNumber',
				'bankAccountName',
			];
		}

		const isStepValid = await trigger(fields);
		if (isStepValid) {
			setStep(step + 1);
		}
	};

	const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// In a real app, you'd upload this to a server/S3
			// For now, we'll create a local preview URL
			const reader = new FileReader();
			reader.onloadend = () => {
				setValue('businessLogo', reader.result as string, {
					shouldValidate: true,
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = (data: VendorOnboardingValues) => {
		if (!user) {
			toast.error('You must be logged in to onboard as a vendor');
			return;
		}

		// Filter out empty businessLogo since it's commented out in UI
		const payload = {
			...data,
			userId: user.id,
		};

		if (!payload.businessLogo) {
			delete payload.businessLogo;
		}

		createVendor(payload, {
			onSuccess: () => {
				toast.success('Vendor profile created successfully!');
				router.push('/dashboard');
			},
			onError: (error: any) => {
				toast.error(
					error.response?.data?.message || 'Failed to create vendor profile',
				);
			},
		});
	};

	return (
		<div className="min-h-screen bg-neutral-50 py-12 px-4">
			<div className="container mx-auto max-w-2xl">
				<div className="text-center mb-10">
					<h1 className="text-4xl font-bold text-neutral-900 mb-3 tracking-tight">
						List your venue on OneEvent
					</h1>
					<p className="text-neutral-500 text-lg">
						Join our community of premium venue owners and start getting
						bookings.
					</p>
				</div>

				{/* Progress Stepper */}
				<div className="mb-12">
					<div className="flex justify-between items-center max-w-md mx-auto relative">
						<div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-200 z-0"></div>
						<div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-200 z-0"></div>
						<div
							className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-blue transition-all duration-500 z-0"
							style={{ width: `${((step - 1) / 3) * 100}%` }}
						></div>

						{[1, 2, 3, 4].map((s) => (
							<div
								key={s}
								className={`relative z-10 flex flex-col items-center gap-2`}
							>
								<div
									className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
										s < step
											? 'bg-brand-blue text-white'
											: s === step
												? 'bg-white border-2 border-brand-blue text-brand-blue shadow-lg shadow-blue-500/20'
												: 'bg-white border-2 border-neutral-200 text-neutral-400'
									}`}
								>
									{s < step ? <CheckCircle2 className="h-6 w-6" /> : s}
								</div>
								<span
									className={`text-[10px] font-bold uppercase tracking-wider ${
										s === step ? 'text-brand-blue' : 'text-neutral-400'
									}`}
								>
									{s === 1
										? 'Profile'
										: s === 2
											? 'Legal'
											: s === 3
												? 'Payments'
												: 'Confirm'}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100 p-8 md:p-10">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						{step === 1 && (
							<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="flex items-center gap-3 mb-2">
									<div className="h-10 w-10 rounded-xl bg-brand-blue-soft flex items-center justify-center text-brand-blue">
										<Building2 className="h-5 w-5" />
									</div>
									<div>
										<h2 className="text-xl font-bold text-neutral-900">
											Business Identity
										</h2>
										<p className="text-sm text-neutral-500">
											How guests will see your brand
										</p>
									</div>
								</div>

								<div className="space-y-6">
									{/* Logo Upload - Commented for now */}
									{/* <div className="space-y-2">
										<Label>Business Logo</Label>
										<div className="flex items-center gap-6">
											<div className="relative h-24 w-24 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200 flex items-center justify-center overflow-hidden transition-all hover:border-brand-blue/50">
												{businessLogo ? (
													<Image
														src={businessLogo}
														alt="Logo Preview"
														layout="fill"
														className="object-cover"
													/>
												) : (
													<ImagePlus className="h-8 w-8 text-neutral-300" />
												)}
												<input
													type="file"
													className="absolute inset-0 opacity-0 cursor-pointer"
													accept="image/*"
													onChange={handleLogoUpload}
												/>
											</div>
											<div className="space-y-1">
												<p className="text-sm font-semibold text-neutral-900">
													Upload logo
												</p>
												<p className="text-xs text-neutral-500">
													PNG, JPG or SVG. Max 2MB.
												</p>
												{errors.businessLogo && (
													<p className="text-xs text-red-500 mt-1">
														{errors.businessLogo.message}
													</p>
												)}
											</div>
										</div>
									</div> */}

									<div className="space-y-2">
										<Label htmlFor="businessName">Business Name</Label>
										<Input
											id="businessName"
											placeholder="e.g. Royal Events Center"
											className="h-12 rounded-xl"
											{...register('businessName')}
										/>
										{errors.businessName && (
											<p className="text-xs text-red-500">
												{errors.businessName.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="businessDescription">Description</Label>
										<Textarea
											id="businessDescription"
											placeholder="Tell guests about your venues and services..."
											className="min-h-[120px] rounded-xl resize-none"
											{...register('businessDescription')}
										/>
										{errors.businessDescription && (
											<p className="text-xs text-red-500">
												{errors.businessDescription.message}
											</p>
										)}
									</div>
								</div>

								<Button
									type="button"
									onClick={nextStep}
									className="w-full h-12 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
								>
									Continue to Legal
									<ArrowRight className="h-4 w-4 ml-2" />
								</Button>
							</div>
						)}

						{step === 2 && (
							<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="flex items-center gap-3 mb-2">
									<div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
										<Shield className="h-5 w-5" />
									</div>
									<div>
										<h2 className="text-xl font-bold text-neutral-900">
											Legal & Verification
										</h2>
										<p className="text-sm text-neutral-500">
											Official registration details
										</p>
									</div>
								</div>

								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="cacNumber">CAC Number</Label>
											<div className="relative">
												<FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
												<Input
													id="cacNumber"
													placeholder="RC-1234567"
													className="h-12 pl-11 rounded-xl"
													{...register('cacNumber')}
												/>
											</div>
											{errors.cacNumber && (
												<p className="text-xs text-red-500">
													{errors.cacNumber.message}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<Label htmlFor="rcNumber">RC Number</Label>
											<div className="relative">
												<FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
												<Input
													id="rcNumber"
													placeholder="1234567"
													className="h-12 pl-11 rounded-xl"
													{...register('rcNumber')}
												/>
											</div>
											{errors.rcNumber && (
												<p className="text-xs text-red-500">
													{errors.rcNumber.message}
												</p>
											)}
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="taxNumber">
											Tax Identification Number (TIN)
										</Label>
										<div className="relative">
											<Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
											<Input
												id="taxNumber"
												placeholder="12345678-0001"
												className="h-12 pl-11 rounded-xl"
												{...register('taxNumber')}
											/>
										</div>
										{errors.taxNumber && (
											<p className="text-xs text-red-500">
												{errors.taxNumber.message}
											</p>
										)}
									</div>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<Button
										type="button"
										variant="ghost"
										onClick={() => setStep(step - 1)}
										className="flex-1 h-12 font-bold text-neutral-500 rounded-xl"
									>
										Back
									</Button>
									<Button
										type="button"
										onClick={nextStep}
										className="flex-2 h-12 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
									>
										Continue to Contact
										<ArrowRight className="h-4 w-4 ml-2" />
									</Button>
								</div>
							</div>
						)}

						{step === 3 && (
							<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="flex items-center gap-3 mb-2">
									<div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
										<Mail className="h-5 w-5" />
									</div>
									<div>
										<h2 className="text-xl font-bold text-neutral-900">
											Contact & Payments
										</h2>
										<p className="text-sm text-neutral-500">
											How to reach you and pay you
										</p>
									</div>
								</div>

								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="businessAddress">Business Address</Label>
										<div className="relative">
											<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
											<Input
												id="businessAddress"
												placeholder="123 Event Lane, Lagos"
												className="h-12 pl-11 rounded-xl"
												{...register('businessAddress')}
											/>
										</div>
										{errors.businessAddress && (
											<p className="text-xs text-red-500">
												{errors.businessAddress.message}
											</p>
										)}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="businessPhone">Phone Number</Label>
											<div className="relative">
												<Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
												<Input
													id="businessPhone"
													placeholder="+234..."
													className="h-12 pl-11 rounded-xl"
													{...register('businessPhone')}
												/>
											</div>
											{errors.businessPhone && (
												<p className="text-xs text-red-500">
													{errors.businessPhone.message}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<Label htmlFor="businessEmail">Business Email</Label>
											<div className="relative">
												<Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
												<Input
													id="businessEmail"
													type="email"
													placeholder="business@example.com"
													className="h-12 pl-11 rounded-xl"
													{...register('businessEmail')}
												/>
											</div>
											{errors.businessEmail && (
												<p className="text-xs text-red-500">
													{errors.businessEmail.message}
												</p>
											)}
										</div>
									</div>

									<div className="pt-4 border-t border-neutral-100">
										<div className="flex items-center gap-2 mb-4">
											<Wallet className="h-4 w-4 text-neutral-400" />
											<span className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
												Bank Settlement Info
											</span>
										</div>
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="bankName">Bank Name</Label>
												<Input
													id="bankName"
													placeholder="e.g. GTBank"
													className="h-12 rounded-xl"
													{...register('bankName')}
												/>
												{errors.bankName && (
													<p className="text-xs text-red-500">
														{errors.bankName.message}
													</p>
												)}
											</div>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="bankAccountNumber">
														Account Number
													</Label>
													<Input
														id="bankAccountNumber"
														placeholder="10 digits"
														className="h-12 rounded-xl"
														{...register('bankAccountNumber')}
													/>
													{errors.bankAccountNumber && (
														<p className="text-xs text-red-500">
															{errors.bankAccountNumber.message}
														</p>
													)}
												</div>
												<div className="space-y-2">
													<Label htmlFor="bankAccountName">Account Name</Label>
													<Input
														id="bankAccountName"
														placeholder="Name on account"
														className="h-12 rounded-xl"
														{...register('bankAccountName')}
													/>
													{errors.bankAccountName && (
														<p className="text-xs text-red-500">
															{errors.bankAccountName.message}
														</p>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<Button
										type="button"
										variant="ghost"
										onClick={() => setStep(step - 1)}
										className="flex-1 h-12 font-bold text-neutral-500 rounded-xl"
									>
										Back
									</Button>
									<Button
										type="button"
										onClick={nextStep}
										className="flex-2 h-12 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
									>
										Review Details
										<ArrowRight className="h-4 w-4 ml-2" />
									</Button>
								</div>
							</div>
						)}

						{step === 4 && (
							<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
								<div className="h-20 w-20 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue mx-auto mb-4">
									<CheckCircle2 className="h-10 w-10" />
								</div>

								<div className="space-y-2">
									<h2 className="text-2xl font-bold text-neutral-900">
										Ready to go!
									</h2>
									<p className="text-neutral-500">
										By submitting, you agree to become a vendor on OneEvent and
										list your spaces for booking.
									</p>
								</div>

								<div className="bg-neutral-50 rounded-2xl p-6 text-left space-y-4">
									<div className="flex justify-between items-center text-sm">
										<span className="text-neutral-500">Business Profile</span>
										<span className="font-bold text-neutral-900 uppercase tracking-tight">
											Confirmed
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-neutral-500">Legal Verification</span>
										<span className="font-bold text-neutral-900 uppercase tracking-tight">
											Confirmed
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-neutral-500">
											Payments Settlement
										</span>
										<span className="font-bold text-neutral-900 uppercase tracking-tight">
											Confirmed
										</span>
									</div>
									<div className="flex justify-between items-center text-sm pt-4 border-t border-neutral-200">
										<span className="text-neutral-500 font-medium">
											Terms & Conditions
										</span>
										<span className="text-brand-blue font-bold">
											Read & Agreed
										</span>
									</div>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<Button
										type="button"
										variant="ghost"
										onClick={() => setStep(step - 1)}
										className="flex-1 h-12 font-bold text-neutral-500 rounded-xl"
									>
										Back
									</Button>
									<Button
										type="submit"
										disabled={isCreating}
										className="flex-2 h-12 bg-brand-gold hover:bg-brand-gold-hover text-white rounded-xl font-bold shadow-lg shadow-amber-500/20"
									>
										{isCreating ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Creating Profile...
											</>
										) : (
											'Complete Onboarding'
										)}
									</Button>
								</div>
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
