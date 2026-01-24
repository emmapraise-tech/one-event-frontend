'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Edit2, ShieldCheck } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export function ProfileSettings() {
	// Mock state for form fields
	const [formData, setFormData] = useState({
		fullName: 'Emeka Okafor',
		businessName: 'Lekki Grand Gardens',
		email: 'emeka@oneevent.ng',
		phone: '801 234 5678',
		state: 'Lagos State',
		lga: 'Eti-Osa',
		bankName: 'Guaranty Trust Bank (GTB)',
		accountNumber: '0023918273',
	});

	return (
		<div className="space-y-6 max-w-4xl">
			{/* Account Header Card */}
			<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="flex flex-col md:flex-row items-center gap-6">
					<div className="relative">
						<div className="h-24 w-24 rounded-full overflow-hidden border-2 border-white shadow-md">
							<img
								src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200"
								alt="Profile"
								className="h-full w-full object-cover"
							/>
						</div>
						<button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white shadow-sm border-2 border-white hover:bg-blue-700 transition-colors">
							<Edit2 className="h-3.5 w-3.5" />
						</button>
					</div>
					<div className="flex-1 text-center md:text-left">
						<h2 className="text-xl font-bold text-gray-900">Emeka Okafor</h2>
						<div className="flex items-center justify-center md:justify-start gap-2 mt-1">
							<span className="text-sm text-gray-500">Venue Owner</span>
							<span className="text-gray-300">|</span>
							<span className="text-sm text-gray-500">ID: OE-8821</span>
						</div>
						<div className="mt-2">
							<Badge
								variant="secondary"
								className="bg-green-50 text-green-700 hover:bg-green-50 gap-1 rounded-full px-3 py-0.5 font-medium border-green-100"
							>
								<ShieldCheck className="h-3 w-3" />
								BVN Verified
							</Badge>
						</div>
					</div>
					<div className="flex gap-3">
						<Button variant="outline" className="bg-white hover:bg-gray-50">
							Remove
						</Button>
						<Button className="bg-blue-600 hover:bg-blue-700">
							Upload New
						</Button>
					</div>
				</div>
			</div>

			{/* Personal Information */}
			<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
				<h3 className="text-lg font-bold text-gray-900 mb-1">
					Personal Information
				</h3>
				<p className="text-sm text-muted-foreground mb-6">
					Update your personal and contact details here.
				</p>

				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="fullName">Full Name</Label>
						<Input
							id="fullName"
							value={formData.fullName}
							onChange={(e) =>
								setFormData({ ...formData, fullName: e.target.value })
							}
							className="bg-gray-50/50 border-gray-200"
						/>
					</div>
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
			</div>

			{/* Payout Details */}
			<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-bold text-gray-900 mb-1">
							Payout Details
						</h3>
						<p className="text-sm text-muted-foreground">
							Your Nigerian bank account for settlement.
						</p>
					</div>
					<Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md px-2 py-1 text-xs font-semibold border-none">
						NGN ACCOUNT
					</Badge>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="bankName">Bank Name</Label>
						<Select
							value={formData.bankName}
							onValueChange={(val) =>
								setFormData({ ...formData, bankName: val })
							}
						>
							<SelectTrigger className="bg-gray-50/50 border-gray-200">
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
						<Label htmlFor="accountNumber">Account Number (NUBAN)</Label>
						<Input
							id="accountNumber"
							value={formData.accountNumber}
							onChange={(e) =>
								setFormData({ ...formData, accountNumber: e.target.value })
							}
							className="bg-gray-50/50 border-gray-200 font-mono"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
