'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Shield, Key, Smartphone, LogOut, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function SecuritySettings() {
	const [showPasswordForm, setShowPasswordForm] = useState(false);

	return (
		<div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
			<Card className="border-neutral-100 shadow-sm overflow-hidden rounded-2xl">
				<CardHeader className="bg-neutral-50/50 border-b border-neutral-100 pb-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-purple-50 rounded-lg text-purple-600">
							<Key className="h-5 w-5" />
						</div>
						<div>
							<CardTitle className="text-lg font-bold">Password</CardTitle>
							<CardDescription>Update your login credentials</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					{!showPasswordForm ? (
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 bg-neutral-100 rounded-full flex items-center justify-center">
									<Shield className="h-5 w-5 text-neutral-400" />
								</div>
								<div>
									<p className="font-bold text-neutral-900">
										Your password is set
									</p>
									<p className="text-xs text-neutral-500">
										Last updated 3 months ago
									</p>
								</div>
							</div>
							<Button
								onClick={() => setShowPasswordForm(true)}
								variant="outline"
								className="rounded-xl border-neutral-200 font-bold px-6 h-10 hover:bg-neutral-50"
							>
								Change Password
							</Button>
						</div>
					) : (
						<div className="space-y-4 max-w-md animate-in slide-in-from-top-2 duration-300">
							<div className="space-y-2">
								<Label htmlFor="current">Current Password</Label>
								<Input
									id="current"
									type="password"
									placeholder="••••••••"
									className="rounded-xl h-11 border-neutral-200"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="new">New Password</Label>
								<Input
									id="new"
									type="password"
									placeholder="••••••••"
									className="rounded-xl h-11 border-neutral-200"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirm">Confirm New Password</Label>
								<Input
									id="confirm"
									type="password"
									placeholder="••••••••"
									className="rounded-xl h-11 border-neutral-200"
								/>
							</div>
							<div className="flex gap-3 pt-2">
								<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold px-6 h-11">
									Update Password
								</Button>
								<Button
									variant="ghost"
									onClick={() => setShowPasswordForm(false)}
									className="rounded-xl font-bold px-6 h-11"
								>
									Cancel
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card className="border-neutral-100 shadow-sm overflow-hidden rounded-2xl">
				<CardHeader className="bg-neutral-50/50 border-b border-neutral-100 pb-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
							<Smartphone className="h-5 w-5" />
						</div>
						<div>
							<CardTitle className="text-lg font-bold">
								Two-Factor Authentication
							</CardTitle>
							<CardDescription>Add an extra layer of security</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<h4 className="font-bold text-neutral-900">
									SMS Authentication
								</h4>
								<Badge className="bg-emerald-50 text-emerald-700 border-none rounded-full px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider">
									Recommended
								</Badge>
							</div>
							<p className="text-sm text-neutral-500">
								Secure your account by requiring a code sent to your mobile
								phone each time you sign in.
							</p>
						</div>
						<Button className="bg-neutral-900 hover:bg-black text-white rounded-xl font-bold px-8 h-11 transition-all whitespace-nowrap">
							Enable 2FA
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="border-neutral-100 shadow-sm overflow-hidden rounded-2xl">
				<CardHeader className="bg-neutral-50/50 border-b border-neutral-100 pb-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-50 rounded-lg text-blue-600">
							<LogOut className="h-5 w-5" />
						</div>
						<div>
							<CardTitle className="text-lg font-bold">
								Active Sessions
							</CardTitle>
							<CardDescription>
								Devices currently signed into your account
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<div className="divide-y divide-neutral-100">
						{[
							{
								device: 'MacBook Pro',
								browser: 'Chrome',
								location: 'Lagos, Nigeria',
								isCurrent: true,
							},
							{
								device: 'iPhone 15 Pro',
								browser: 'Safari',
								location: 'Abuja, Nigeria',
								isCurrent: false,
							},
						].map((session, i) => (
							<div
								key={i}
								className="p-6 flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="h-10 w-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-500">
										<Smartphone className="h-5 w-5" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<p className="font-bold text-neutral-900">
												{session.device} • {session.browser}
											</p>
											{session.isCurrent && (
												<Badge className="bg-blue-50 text-blue-600 border-none rounded-full px-2 h-5 text-[10px] font-bold">
													Current
												</Badge>
											)}
										</div>
										<p className="text-xs text-neutral-500">
											{session.location} • Active 2 hours ago
										</p>
									</div>
								</div>
								{!session.isCurrent && (
									<Button
										variant="ghost"
										className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-bold text-xs h-9"
									>
										Revoke
									</Button>
								)}
							</div>
						))}
					</div>
					<div className="p-6 bg-neutral-50/30 border-t border-neutral-100">
						<Button
							variant="ghost"
							className="text-neutral-500 hover:text-neutral-900 font-bold text-sm w-full"
						>
							Sign out from all other devices
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
