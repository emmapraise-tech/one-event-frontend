'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
	Check,
	Edit2,
	ShieldCheck,
	CreditCard,
	User as UserIcon,
} from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/types/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { vendorService } from '@/services/vendor.service';
import { userService } from '@/services/user.service';

export function ProfileSettings() {
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const isVendor = user?.type === 'VENDOR' || user?.type === 'ADMIN';

	const { data: vendor, isLoading: isVendorLoading } = useQuery({
		queryKey: ['vendorProfile'],
		queryFn: () => vendorService.getMyProfile(),
		enabled: !!user && isVendor,
	});

	const [formData, setFormData] = useState({
		fullName: '',
		businessName: '',
		email: '',
		phone: '',
		state: '',
		lga: 'Eti-Osa',
		bankName: '',
		accountNumber: '',
	});

	useEffect(() => {
		if (user) {
			setFormData((prev) => ({
				...prev,
				fullName: prev.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
				email: user.email || '',
				phone: prev.phone || user.phone || '',
				state: prev.state || user.state || 'Lagos State',
			}));
		}
	}, [user]);

	useEffect(() => {
		if (vendor) {
			setFormData((prev) => ({
				...prev,
				businessName: prev.businessName || vendor.businessName || '',
				bankName: prev.bankName || vendor.bankName || 'Guaranty Trust Bank (GTB)',
				accountNumber: prev.accountNumber || vendor.bankAccountNumber || '',
			}));
		}
	}, [vendor]);

	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

	const handleSaveProfile = async () => {
		if (!user) return;
		setIsSavingProfile(true);
		setSaveProfileSuccess(false);
		try {
			const [firstName, ...lastArr] = formData.fullName.split(' ');
			const lastName = lastArr.join(' ');
			
			await userService.update(user.id, {
				firstName: firstName || '',
				lastName: lastName || '',
				phone: formData.phone,
				state: formData.state,
			});
			
			queryClient.invalidateQueries({ queryKey: ['user'] });
			setSaveProfileSuccess(true);
			setTimeout(() => setSaveProfileSuccess(false), 3000);
		} catch (error) {
			console.error('Failed to save profile', error);
		} finally {
			setIsSavingProfile(false);
		}
	};

	const [isSavingSettlement, setIsSavingSettlement] = useState(false);
	const [saveSettlementSuccess, setSaveSettlementSuccess] = useState(false);

	const handleSaveSettlement = async () => {
		if (!vendor) return;
		setIsSavingSettlement(true);
		setSaveSettlementSuccess(false);
		try {
			await vendorService.update(vendor.id, {
				businessName: formData.businessName,
				bankName: formData.bankName,
				bankAccountNumber: formData.accountNumber,
			});
			
			queryClient.invalidateQueries({ queryKey: ['vendorProfile'] });
			setSaveSettlementSuccess(true);
			setTimeout(() => setSaveSettlementSuccess(false), 3000);
		} catch (error) {
			console.error('Failed to save settlement account', error);
		} finally {
			setIsSavingSettlement(false);
		}
	};

	return (
		<div className="space-y-6 max-w-4xl">
			{/* Account Header Card */}
			<div className="rounded-[32px] border-none bg-white p-8 shadow-soft relative overflow-hidden group">
				<div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

				<div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
					<div className="relative">
						<div className="h-28 w-28 rounded-[32px] overflow-hidden border-4 border-white shadow-xl rotate-3 transition-transform hover:rotate-0 duration-500">
							<img
								src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200"
								alt="Profile"
								className="h-full w-full object-cover"
							/>
						</div>
						<button className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-brand-blue text-white shadow-lg border-4 border-white hover:bg-brand-blue-hover transition-all hover:scale-110 active:scale-95">
							<Edit2 className="h-4 w-4" />
						</button>
					</div>
					<div className="flex-1 text-center md:text-left space-y-1">
						<h2 className="text-2xl font-black text-neutral-900 tracking-tight">
							{formData.fullName}
						</h2>
						<div className="flex items-center justify-center md:justify-start gap-3">
							<Badge className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 border-none rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
								{user?.type || 'User'}
							</Badge>
							<span className="text-neutral-300">•</span>
							<span className="text-xs font-bold text-neutral-400 tracking-widest">
								OE-{user?.id?.slice(-4).toUpperCase() || '8821'}
							</span>
						</div>
						{isVendor && (
							<div className="pt-2">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
									<ShieldCheck className="h-3.5 w-3.5" />
									<span className="text-[10px] font-black uppercase tracking-widest">
										Verified Merchant
									</span>
								</div>
							</div>
						)}
					</div>
					<div className="flex gap-3">
						<Button
							variant="outline"
							className="rounded-2xl border-neutral-200 font-bold h-12 px-6 hover:bg-neutral-50"
						>
							Remove
						</Button>
						<Button className="bg-neutral-900 hover:bg-black text-white rounded-2xl font-bold h-12 px-6 shadow-xl shadow-neutral-900/10">
							Upload Photo
						</Button>
					</div>
				</div>
			</div>

			{/* Personal Information */}
			<div className="rounded-[32px] border-none bg-white p-8 shadow-soft">
				<div className="flex items-center gap-3 mb-6">
					<div className="h-10 w-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
						<UserIcon className="h-5 w-5 text-brand-blue" />
					</div>
					<div>
						<h3 className="text-xl font-black text-neutral-900 tracking-tight">
							Personal Profile
						</h3>
						<p className="text-xs font-medium text-neutral-500">
							Update your contact and location details
						</p>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<Label
							htmlFor="fullName"
							className="text-[10px] font-black uppercase tracking-widest text-neutral-400"
						>
							Full Name
						</Label>
						<Input
							id="fullName"
							value={formData.fullName}
							onChange={(e) =>
								setFormData({ ...formData, fullName: e.target.value })
							}
							className="bg-neutral-50 border-neutral-100 h-12 rounded-xl focus:ring-brand-blue/20 transition-all font-bold"
						/>
					</div>
					{isVendor && (
						<div className="space-y-2">
							<Label htmlFor="businessName">Business Name</Label>
							<Input
								id="businessName"
								value={formData.businessName}
								onChange={(e) =>
									setFormData({ ...formData, businessName: e.target.value })
								}
								className="bg-gray-50/50 border-gray-200"
							/>
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="email">Email Address</Label>
						<div className="relative">
							<Input
								id="email"
								value={formData.email}
								readOnly // Assuming email change requires specific flow
								className="bg-gray-50/50 border-gray-200 pr-10"
							/>
							<Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" />
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone Number</Label>
						<div className="flex gap-2">
							<div className="flex items-center gap-2 px-3 border border-gray-200 rounded-md bg-gray-50/50 text-gray-500 text-sm">
								<img
									src="https://flagcdn.com/w20/ng.png"
									alt="Nigeria"
									className="w-5 h-auto rounded-sm"
								/>
								+234
							</div>
							<Input
								id="phone"
								value={formData.phone}
								onChange={(e) =>
									setFormData({ ...formData, phone: e.target.value })
								}
								className="bg-gray-50/50 border-gray-200"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="state">State</Label>
						<Select
							value={formData.state}
							onValueChange={(val) => setFormData({ ...formData, state: val })}
						>
							<SelectTrigger className="bg-gray-50/50 border-gray-200">
								<SelectValue placeholder="Select state" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Lagos State">Lagos State</SelectItem>
								<SelectItem value="Abuja">Abuja</SelectItem>
								<SelectItem value="Rivers">Rivers</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="lga">L.G.A.</Label>
						<Select
							value={formData.lga}
							onValueChange={(val) => setFormData({ ...formData, lga: val })}
						>
							<SelectTrigger className="bg-gray-50/50 border-gray-200">
								<SelectValue placeholder="Select LGA" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Eti-Osa">Eti-Osa</SelectItem>
								<SelectItem value="Ikeja">Ikeja</SelectItem>
								<SelectItem value="Lagos Island">Lagos Island</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="pt-6 flex justify-end items-center gap-4 border-t border-neutral-100 mt-6">
					{saveProfileSuccess && (
						<span className="text-sm font-bold text-emerald-600 animate-in fade-in slide-in-from-right-2 duration-300">
							Profile updated successfully!
						</span>
					)}
					<Button
						onClick={handleSaveProfile}
						disabled={isSavingProfile}
						className="bg-brand-blue hover:bg-brand-blue-hover text-white px-8 rounded-xl font-bold h-11 transition-all"
					>
						{isSavingProfile ? 'Saving...' : 'Save Profile'}
					</Button>
				</div>
			</div>

			{/* Settlement Account - Only for Vendors */}
			{isVendor && (
				<div className="rounded-[32px] border-none bg-white p-8 shadow-soft">
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
								<CreditCard className="h-5 w-5 text-emerald-600" />
							</div>
							<div>
								<h3 className="text-xl font-black text-neutral-900 tracking-tight">
									Settlement Account
								</h3>
								<p className="text-xs font-medium text-neutral-500">
									Bank account for automated payouts
								</p>
							</div>
						</div>
						<Badge className="bg-neutral-900 text-white rounded-full px-4 py-1.5 text-[8px] font-black uppercase tracking-widest border-none">
							NGN Payouts
						</Badge>
					</div>

					<div className="grid gap-6 md:grid-cols-2 mb-8 border-b border-gray-100 pb-8">
						<div className="space-y-2">
							<Label htmlFor="bankNameSelect">Bank Name</Label>
							<Select
								value={formData.bankName}
								onValueChange={(val) =>
									setFormData({ ...formData, bankName: val })
								}
							>
								<SelectTrigger
									id="bankNameSelect"
									className="bg-gray-50/50 border-gray-200"
								>
									<SelectValue placeholder="Select bank" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Guaranty Trust Bank (GTB)">
										Guaranty Trust Bank (GTB)
									</SelectItem>
									<SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
									<SelectItem value="Access Bank">Access Bank</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="settlementAccountNumber">
								Account Number (NUBAN)
							</Label>
							<Input
								id="settlementAccountNumber"
								value={formData.accountNumber}
								onChange={(e) =>
									setFormData({ ...formData, accountNumber: e.target.value })
								}
								className="bg-gray-50/50 border-gray-200 font-mono"
							/>
						</div>
					</div>

					<div className="pt-6 flex justify-end items-center gap-4 border-t border-neutral-100 mt-8">
						{saveSettlementSuccess && (
							<span className="text-sm font-bold text-emerald-600 animate-in fade-in slide-in-from-right-2 duration-300">
								Account updated successfully!
							</span>
						)}
						<Button
							onClick={handleSaveSettlement}
							disabled={isSavingSettlement}
							className="bg-brand-blue hover:bg-brand-blue-hover text-white px-8 rounded-xl font-bold h-11 transition-all"
						>
							{isSavingSettlement ? 'Saving...' : 'Save Account'}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
