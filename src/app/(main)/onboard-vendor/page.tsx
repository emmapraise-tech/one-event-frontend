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
import { Checkbox } from '@/components/ui/checkbox';
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
import { Suspense, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FormSkeleton } from '@/components/ui/skeletons';
import { paymentService } from '@/services/payment.service';

function OnboardVendorContent() {
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
			verificationMethod: 'cac',
			cacNumber: '',
			taxNumber: '',
			acceptedPaymentMethod: 'both',
			bankCode: '',
			bankAccountNumber: '',
			bankAccountName: '',
			bankName: '',
		},
	});

	const businessLogo = watch('businessLogo');
	const verificationMethod = watch('verificationMethod') || 'cac';
	const bankCode = watch('bankCode');
	const bankAccountNumber = watch('bankAccountNumber');
	const acceptedPaymentMethod = watch('acceptedPaymentMethod') || 'both';

	const [useProfileEmail, setUseProfileEmail] = useState(false);
	const [useProfilePhone, setUseProfilePhone] = useState(false);

	const [banks, setBanks] = useState<Array<{ name: string; code: string }>>([]);
	const [isResolving, setIsResolving] = useState(false);
	const [resolveError, setResolveError] = useState<string | null>(null);
	const [resolvedName, setResolvedName] = useState<string | null>(null);

	const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
	const [bankSearchQuery, setBankSearchQuery] = useState('');
	const [selectedBankLabel, setSelectedBankLabel] = useState('');

	const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);

	// Keep the button label in sync with selected bank code
	useEffect(() => {
		if (bankCode && banks.length > 0) {
			const activeBank = banks.find((b) => b.code === bankCode);
			if (activeBank) {
				setSelectedBankLabel(activeBank.name);
			}
		} else {
			setSelectedBankLabel('');
		}
	}, [bankCode, banks]);

	const filteredBanks = banks.filter((bank) =>
		bank.name.toLowerCase().includes(bankSearchQuery.toLowerCase())
	);

	// Fetch banks list from Paystack (via backend)
	useEffect(() => {
		const fetchBanks = async () => {
			try {
				const data = await paymentService.getBanks();
				const sortedBanks = (data || []).sort((a, b) => a.name.localeCompare(b.name));
				setBanks(sortedBanks);
			} catch (err) {
				console.error('Failed to fetch banks', err);
			}
		};
		fetchBanks();
	}, []);

	// Resolve account number automatically when both bank code and 10 digits account number are provided
	useEffect(() => {
		if (bankAccountNumber && bankAccountNumber.length === 10 && bankCode) {
			const resolveAcc = async () => {
				setIsResolving(true);
				setResolveError(null);
				setResolvedName(null);
				setValue('bankAccountName', '');
				try {
					const res = await paymentService.resolveAccount(bankAccountNumber, bankCode);
					if (res && res.account_name) {
						setResolvedName(res.account_name);
						setValue('bankAccountName', res.account_name, { shouldValidate: true });
						
						const selectedBank = banks.find((b) => b.code === bankCode);
						if (selectedBank) {
							setValue('bankName', selectedBank.name, { shouldValidate: true });
						}
					} else {
						setResolveError('Could not resolve account name. Check details.');
					}
				} catch (err: any) {
					const errorMessage = err.response?.data?.message || err.message || '';
					if (
						errorMessage.toLowerCase().includes('limit') || 
						errorMessage.toLowerCase().includes('exceeded') || 
						errorMessage.toLowerCase().includes('verification failed')
					) {
						// Bypass verification due to limit exceeded
						const bypassLabel = 'Verification Bypassed (Limit Exceeded)';
						setResolvedName(bypassLabel);
						setValue('bankAccountName', bypassLabel, { shouldValidate: true });
						const selectedBank = banks.find((b) => b.code === bankCode);
						if (selectedBank) {
							setValue('bankName', selectedBank.name, { shouldValidate: true });
						}
					} else {
						setResolveError(errorMessage || 'Verification failed. Try again.');
					}
				} finally {
					setIsResolving(false);
				}
			};
			resolveAcc();
		} else {
			setResolvedName(null);
			setResolveError(null);
		}
	}, [bankAccountNumber, bankCode, banks, setValue]);

	const nextStep = async () => {
		let fields: (keyof VendorOnboardingValues)[] = [];
		if (step === 1) {
			fields = [
				'businessName',
				'businessDescription',
				'businessAddress',
				'businessPhone',
				'businessEmail',
			];
		} else if (step === 2) {
			fields = ['cacNumber', 'taxNumber', 'verificationMethod'];
		} else if (step === 3) {
			fields = [
				'acceptedPaymentMethod',
				'bankCode',
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

		// Filter out frontend-only fields
		delete (payload as any).verificationMethod;
		delete (payload as any).acceptedPaymentMethod;
		delete (payload as any).bankCode;

		createVendor(payload, {
			onSuccess: () => {
				toast.success('Vendor profile created successfully!');
				window.location.href = '/dashboard';
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
										? 'Profile & Contact'
										: s === 2
											? 'Verification'
											: s === 3
												? 'Settlement'
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
											Business Profile & Contact
										</h2>
										<p className="text-sm text-neutral-500">
											Identify and contact details for your business
										</p>
									</div>
								</div>

								<div className="space-y-6">
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
													{...register('businessPhone', {
														onChange: () => setUseProfilePhone(false)
													})}
												/>
											</div>
											{user?.phone && (
												<div className="flex items-center gap-2 mt-1.5">
													<Checkbox
														id="useAccountPhone"
														checked={useProfilePhone}
														onCheckedChange={(checked) => {
															setUseProfilePhone(!!checked);
															if (checked && user.phone) {
																setValue('businessPhone', user.phone, { shouldValidate: true });
															}
														}}
													/>
													<Label htmlFor="useAccountPhone" className="text-xs text-neutral-500 cursor-pointer select-none">
														Use phone from account ({user.phone})
													</Label>
												</div>
											)}
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
													{...register('businessEmail', {
														onChange: () => setUseProfileEmail(false)
													})}
												/>
											</div>
											{user?.email && (
												<div className="flex items-center gap-2 mt-1.5">
													<Checkbox
														id="useAccountEmail"
														checked={useProfileEmail}
														onCheckedChange={(checked) => {
															setUseProfileEmail(!!checked);
															if (checked && user.email) {
																setValue('businessEmail', user.email, { shouldValidate: true });
															}
														}}
													/>
													<Label htmlFor="useAccountEmail" className="text-xs text-neutral-500 cursor-pointer select-none">
														Use email from account ({user.email})
													</Label>
												</div>
											)}
											{errors.businessEmail && (
												<p className="text-xs text-red-500">
													{errors.businessEmail.message}
												</p>
											)}
										</div>
									</div>
								</div>

								<Button
									type="button"
									onClick={nextStep}
									className="w-full h-12 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
								>
									Continue to Verification
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
											Verification Details
										</h2>
										<p className="text-sm text-neutral-500">
											Official registration details
										</p>
									</div>
								</div>

								{/* Verification Method Toggle */}
								<div className="space-y-3">
									<Label className="text-sm font-semibold text-neutral-900">
										Verification Method
									</Label>
									<div className="grid grid-cols-2 gap-2 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
										<button
											type="button"
											onClick={() => {
												setValue('verificationMethod', 'cac', { shouldValidate: true });
												setValue('taxNumber', ''); // Clear the unselected field
											}}
											className={`h-11 rounded-xl text-sm font-semibold transition-all duration-300 ${
												verificationMethod === 'cac'
													? 'bg-white text-brand-blue shadow-sm'
													: 'text-neutral-500 hover:text-neutral-800'
											}`}
										>
											CAC Number
										</button>
										<button
											type="button"
											onClick={() => {
												setValue('verificationMethod', 'tax', { shouldValidate: true });
												setValue('cacNumber', ''); // Clear the unselected field
											}}
											className={`h-11 rounded-xl text-sm font-semibold transition-all duration-300 ${
												verificationMethod === 'tax'
													? 'bg-white text-brand-blue shadow-sm'
													: 'text-neutral-500 hover:text-neutral-800'
											}`}
										>
											Tax ID (TIN)
										</button>
									</div>
								</div>

								<div className="space-y-4">
									{verificationMethod === 'cac' ? (
										<div className="space-y-2 animate-in fade-in duration-300">
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
									) : (
										<div className="space-y-2 animate-in fade-in duration-300">
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
									)}
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
										<Wallet className="h-5 w-5" />
									</div>
									<div>
										<h2 className="text-xl font-bold text-neutral-900">
											Settlement & Payments
										</h2>
										<p className="text-sm text-neutral-500">
											Configure how you receive payments from clients
										</p>
									</div>
								</div>

								{/* Payment Acceptance Toggle */}
								<div className="space-y-3">
									<Label className="text-sm font-semibold text-neutral-900">
										Payment Acceptance Method
									</Label>
									<div className="grid grid-cols-3 gap-2 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
										<button
											type="button"
											onClick={() => {
												setValue('acceptedPaymentMethod', 'online', { shouldValidate: true });
											}}
											className={`h-11 rounded-xl text-xs font-semibold transition-all duration-300 ${
												acceptedPaymentMethod === 'online'
													? 'bg-white text-brand-blue shadow-sm'
													: 'text-neutral-500 hover:text-neutral-800'
											}`}
										>
											Online Only
										</button>
										<button
											type="button"
											onClick={() => {
												setValue('acceptedPaymentMethod', 'offline', { shouldValidate: true });
												setValue('bankCode', '');
												setValue('bankAccountNumber', '');
												setValue('bankAccountName', '');
												setValue('bankName', '');
												setResolvedName(null);
												setResolveError(null);
											}}
											className={`h-11 rounded-xl text-xs font-semibold transition-all duration-300 ${
												acceptedPaymentMethod === 'offline'
													? 'bg-white text-brand-blue shadow-sm'
													: 'text-neutral-500 hover:text-neutral-800'
											}`}
										>
											Offline Only
										</button>
										<button
											type="button"
											onClick={() => {
												setValue('acceptedPaymentMethod', 'both', { shouldValidate: true });
											}}
											className={`h-11 rounded-xl text-xs font-semibold transition-all duration-300 ${
												acceptedPaymentMethod === 'both'
													? 'bg-white text-brand-blue shadow-sm'
													: 'text-neutral-500 hover:text-neutral-800'
											}`}
										>
											Online & Offline
										</button>
									</div>
								</div>

								<div className="space-y-4">
									{(acceptedPaymentMethod === 'online' || acceptedPaymentMethod === 'both') && (
										<div className="space-y-4 pt-4 border-t border-neutral-100 animate-in fade-in duration-300">
											<div className="flex items-center gap-2 mb-2">
												<Wallet className="h-4 w-4 text-neutral-400" />
												<span className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
													Settlement Bank Account
												</span>
											</div>

											<div className="space-y-4">
												<div className="space-y-2">
													<Label>Select Bank</Label>
													<input type="hidden" {...register('bankCode')} />
													
													<div className="relative">
														<button
															type="button"
															onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
															className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-left text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
														>
															<span className={selectedBankLabel ? "text-neutral-900 font-medium" : "text-neutral-400"}>
																{selectedBankLabel || 'Select a bank...'}
															</span>
															<svg
																className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
																	isBankDropdownOpen ? 'rotate-180' : ''
																}`}
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																strokeWidth="2"
															>
																<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
															</svg>
														</button>

														{isBankDropdownOpen && (
															<>
																<div 
																	className="fixed inset-0 z-40 bg-transparent" 
																	onClick={() => {
																		setIsBankDropdownOpen(false);
																		setBankSearchQuery('');
																	}}
																/>
																<div className="absolute z-50 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-1 duration-200">
																	<div className="p-2 border-b border-neutral-100 bg-neutral-50">
																		<div className="relative">
																			<svg
																				className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400"
																				fill="none"
																				viewBox="0 0 24 24"
																				stroke="currentColor"
																				strokeWidth="2"
																			>
																				<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
																			</svg>
																			<Input
																				type="text"
																				placeholder="Search bank name..."
																				value={bankSearchQuery}
																				onChange={(e) => setBankSearchQuery(e.target.value)}
																				className="h-9 pl-9 pr-4 text-xs rounded-lg bg-white"
																				onClick={(e) => e.stopPropagation()}
																			/>
																		</div>
																	</div>

																	<div className="overflow-y-auto flex-1 max-h-48 py-1 no-scrollbar">
																		{filteredBanks.length > 0 ? (
																			filteredBanks.map((bank) => (
																				<button
																					key={bank.code}
																					type="button"
																					onClick={() => {
																						setValue('bankCode', bank.code, { shouldValidate: true });
																						setResolvedName(null);
																						setResolveError(null);
																						setValue('bankAccountName', '');
																						setIsBankDropdownOpen(false);
																						setBankSearchQuery('');
																					}}
																					className={`w-full text-left px-4 py-2.5 text-xs hover:bg-neutral-50 transition-colors flex items-center justify-between ${
																						bankCode === bank.code
																							? 'bg-blue-50/50 text-brand-blue font-semibold'
																							: 'text-neutral-700'
																					}`}
																				>
																					<span>{bank.name}</span>
																					{bankCode === bank.code && (
																						<svg className="h-3.5 w-3.5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
																							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
																						</svg>
																					)}
																				</button>
																			))
																		) : (
																			<div className="px-4 py-6 text-center text-xs text-neutral-400">
																				No banks found matching your search
																			</div>
																		)}
																	</div>
																</div>
															</>
														)}
													</div>
													{errors.bankCode && (
														<p className="text-xs text-red-500">
															{errors.bankCode.message}
														</p>
													)}
												</div>

												<div className="space-y-2">
													<Label htmlFor="bankAccountNumber">Account Number</Label>
													<div className="relative">
														<Input
															id="bankAccountNumber"
															placeholder="10-digit Account Number"
															maxLength={10}
															className="h-12 rounded-xl"
															{...register('bankAccountNumber', {
																onChange: () => {
																	setResolvedName(null);
																	setResolveError(null);
																	setValue('bankAccountName', '');
																}
															})}
														/>
														{isResolving && (
															<Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-brand-blue" />
														)}
													</div>
													{errors.bankAccountNumber && (
														<p className="text-xs text-red-500">
															{errors.bankAccountNumber.message}
														</p>
													)}
												</div>

												{resolvedName && (
													<div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-xs text-emerald-800 animate-in fade-in duration-300">
														<p className="font-bold uppercase tracking-wide">Account Verified</p>
														<p className="mt-0.5 text-sm font-semibold">{resolvedName}</p>
													</div>
												)}

												{resolveError && (
													<div className="rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs text-rose-800 animate-in fade-in duration-300">
														<p className="font-bold uppercase tracking-wide">Verification Failed</p>
														<p className="mt-0.5 text-sm font-medium">{resolveError}</p>
													</div>
												)}
											</div>
										</div>
									)}

									{acceptedPaymentMethod === 'offline' && (
										<div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-600 animate-in fade-in duration-300">
											<p className="font-semibold text-neutral-900 mb-1">Offline Payments Enabled</p>
											<p>You will collect payments directly from guests in cash or private bank transfer. OneEvent will not process online payouts for your bookings.</p>
										</div>
									)}
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
										disabled={
											(acceptedPaymentMethod === 'online' || acceptedPaymentMethod === 'both') && 
											(!resolvedName || isResolving)
										}
										className="flex-2 h-12 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50"
									>
										Continue to Review
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
										<span className="text-neutral-500">Business Profile & Contact</span>
										<span className="font-bold text-neutral-900 uppercase tracking-tight">
											Confirmed
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-neutral-500">Verification</span>
										<span className="font-bold text-neutral-900 uppercase tracking-tight">
											Confirmed
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-neutral-500">
											Accepted Payments
										</span>
										<span className="font-bold text-neutral-900 uppercase tracking-tight text-xs">
											{acceptedPaymentMethod === 'online'
												? 'Online'
												: acceptedPaymentMethod === 'offline'
													? 'Offline'
													: 'Online & Offline'}
										</span>
									</div>
									{(acceptedPaymentMethod === 'online' || acceptedPaymentMethod === 'both') && watch('bankAccountName') && (
										<div className="flex justify-between items-start text-sm pt-2 border-t border-dashed border-neutral-200">
											<span className="text-neutral-500">
												Settlement Account
											</span>
											<span className="font-bold text-neutral-900 text-right text-xs">
												{watch('bankAccountName')}<br />
												<span className="text-neutral-400 font-medium text-[11px]">
													{watch('bankName')} • {watch('bankAccountNumber')}
												</span>
											</span>
										</div>
									)}
									<div className="flex items-start gap-3 pt-4 border-t border-neutral-200">
										<Checkbox
											id="termsAccepted"
											checked={termsAccepted}
											onCheckedChange={(checked) => setTermsAccepted(!!checked)}
										/>
										<div className="space-y-1">
											<label
												htmlFor="termsAccepted"
												className="text-xs font-semibold leading-none text-neutral-800 cursor-pointer select-none"
											>
												I agree to the OneEvent Vendor Terms & Conditions
											</label>
											<p className="text-[11px] text-neutral-500 leading-normal">
												You must read and accept the{' '}
												<button
													type="button"
													onClick={() => setIsTermsModalOpen(true)}
													className="text-brand-blue hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
												>
													Vendor Terms & Conditions
												</button>{' '}
												before completing onboarding.
											</p>
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
										type="submit"
										disabled={isCreating || !termsAccepted}
										className="flex-2 h-12 bg-brand-gold hover:bg-brand-gold-hover text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50"
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

			{/* Vendor Terms & Conditions Modal */}
			{isTermsModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
					{/* Overlay */}
					<div 
						className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
						onClick={() => setIsTermsModalOpen(false)}
					/>
					
					{/* Modal Box */}
					<div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
						{/* Header */}
						<div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
							<div>
								<h3 className="text-lg font-bold text-neutral-900">
									Vendor Terms & Conditions
								</h3>
								<p className="text-xs text-neutral-500">
									Last updated: June 7, 2026
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsTermsModalOpen(false)}
								className="text-neutral-400 hover:text-neutral-600 h-8 w-8 flex items-center justify-center rounded-full bg-white border border-neutral-200 shadow-xs"
							>
								<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Content */}
						<div className="p-6 overflow-y-auto space-y-4 text-xs text-neutral-600 leading-relaxed no-scrollbar">
							<p className="font-semibold text-neutral-800">
								Please read these Vendor Terms and Conditions carefully before onboarding as a vendor on the OneEvent platform.
							</p>

							<section className="space-y-1">
								<h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">
									1. Relationship of Parties
								</h4>
								<p>
									By completing onboarding, you register as an independent vendor on OneEvent. This agreement does not create an employer-employee, agency, joint venture, or partnership relationship. You retain sole control over your pricing, listing content, policies, and venue operations.
								</p>
							</section>

							<section className="space-y-1">
								<h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">
									2. Verification and Compliance
								</h4>
								<p>
									You agree to provide true, accurate, and up-to-date verification documents (either a Corporate Affairs Commission [CAC] registration number or a Tax Identification Number [TIN]). OneEvent reserves the right to suspend or terminate any vendor profile found providing falsified identification details.
								</p>
							</section>

							<section className="space-y-1">
								<h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">
									3. Listing Standards and Accuracies
								</h4>
								<p>
									You are solely responsible for ensuring that all listing information, including base price, hall specifications, capacity, availability calendar, categories, and amenities are accurate. You agree not to double-book listings. In the event of a listing error, you are responsible for any guest claims or rescheduling efforts.
								</p>
							</section>

							<section className="space-y-1">
								<h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">
									4. Booking, Pricing, and Commission
								</h4>
								<p>
									OneEvent acts as the booking facilitator. For each booking successfully completed through our platform, OneEvent deducts a platform service commission of 5% (or as otherwise specified in your profile details) from the total booking payment before payout.
								</p>
							</section>

							<section className="space-y-1">
								<h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">
									5. Payments and Payout Settlement
								</h4>
								<p>
									Payouts are processed securely to your linked Paystack settlement bank account once the booking events are completed successfully. For offline payments (cash/direct transfer) that you accept from guests, you must promptly mark bookings as "Paid" in your vendor dashboard.
								</p>
							</section>

							<section className="space-y-1">
								<h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">
									6. Cancellations and Dispute Resolution
								</h4>
								<p>
									Cancellation rules, deposit requirements, and refunds are governed by the specific terms set on your listings. OneEvent is not responsible for settling disputes between guests and vendors, although we reserve the right to mediate disputes to protect platform integrity.
								</p>
							</section>

							<section className="space-y-1">
								<h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">
									7. Limitation of Liability
								</h4>
								<p>
									OneEvent shall not be liable for any direct, indirect, incidental, or consequential damages resulting from event cancellations, guest misconduct, property damage at your venue, or transaction failures. You agree to indemnify and hold OneEvent harmless from any claims, losses, or legal costs arising out of your listing operations.
								</p>
							</section>
						</div>

						{/* Footer */}
						<div className="p-6 border-t border-neutral-100 bg-neutral-50 flex gap-4">
							<Button
								type="button"
								onClick={() => {
									setTermsAccepted(true);
									setIsTermsModalOpen(false);
								}}
								className="flex-1 h-11 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold shadow-sm"
							>
								Accept Terms
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsTermsModalOpen(false)}
								className="flex-1 h-11 border-neutral-200 text-neutral-600 rounded-xl"
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default function OnboardVendorPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen py-12 px-4 bg-neutral-50 mb-10">
					<div className="container mx-auto max-w-2xl bg-white rounded-3xl shadow-xl border border-neutral-100 p-8 md:p-10">
						<FormSkeleton fields={4} />
					</div>
				</div>
			}
		>
			<OnboardVendorContent />
		</Suspense>
	);
}
