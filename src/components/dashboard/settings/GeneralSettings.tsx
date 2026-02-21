'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Globe, Clock, Calendar, ShieldAlert } from 'lucide-react';

export function GeneralSettings() {
	const [settings, setSettings] = useState({
		language: 'english',
		timezone: 'WAT',
		dateFormat: 'DD/MM/YYYY',
	});

	return (
		<div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
			<Card className="border-none shadow-soft overflow-hidden rounded-[32px] bg-white">
				<CardHeader className="bg-linear-to-r from-neutral-50 to-white border-b border-neutral-100 pb-6 p-8">
					<div className="flex items-center gap-4">
						<div className="h-12 w-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center shadow-inner">
							<Globe className="h-6 w-6 text-brand-blue" />
						</div>
						<div>
							<CardTitle className="text-2xl font-black tracking-tight text-neutral-900">
								Preferences
							</CardTitle>
							<CardDescription className="text-sm font-medium text-neutral-500">
								Regional and localization settings
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-6 space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-2">
							<Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
								Language
							</Label>
							<Select
								value={settings.language}
								onValueChange={(v) => setSettings({ ...settings, language: v })}
							>
								<SelectTrigger className="bg-white border-neutral-200 h-11 rounded-xl">
									<SelectValue placeholder="Select Language" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="english">English (Global)</SelectItem>
									<SelectItem value="french">French</SelectItem>
									<SelectItem value="yoruba">Yoruba</SelectItem>
									<SelectItem value="igbo">Igbo</SelectItem>
									<SelectItem value="hausa">Hausa</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
								Timezone
							</Label>
							<Select
								value={settings.timezone}
								onValueChange={(v) => setSettings({ ...settings, timezone: v })}
							>
								<SelectTrigger className="bg-white border-neutral-200 h-11 rounded-xl">
									<SelectValue placeholder="Select Timezone" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="WAT">
										(GMT+01:00) West Africa Time
									</SelectItem>
									<SelectItem value="GMT">
										(GMT+00:00) Greenwich Mean Time
									</SelectItem>
									<SelectItem value="EST">
										(GMT-05:00) Eastern Standard Time
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
								Date Format
							</Label>
							<Select
								value={settings.dateFormat}
								onValueChange={(v) =>
									setSettings({ ...settings, dateFormat: v })
								}
							>
								<SelectTrigger className="bg-white border-neutral-200 h-11 rounded-xl">
									<SelectValue placeholder="Select Format" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
									<SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
									<SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="pt-4 flex justify-end">
						<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white px-8 rounded-xl font-bold h-11 transition-all">
							Save Changes
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="border-none shadow-soft overflow-hidden rounded-[32px] bg-white mt-12">
				<CardHeader className="bg-red-50/30 border-b border-red-50 pb-8 p-8">
					<div className="flex items-center gap-4">
						<div className="h-12 w-12 bg-red-100 rounded-2xl flex items-center justify-center shadow-inner">
							<ShieldAlert className="h-6 w-6 text-red-600" />
						</div>
						<div>
							<CardTitle className="text-2xl font-black text-red-900 tracking-tight">
								Danger Zone
							</CardTitle>
							<CardDescription className="text-sm font-medium text-red-600/60">
								Permanent account actions
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-dashed border-red-100 bg-red-50/10">
						<div>
							<h4 className="font-bold text-neutral-900">Deactivate Account</h4>
							<p className="text-sm text-neutral-500 max-w-md mt-1">
								Temporarily hide your profile and venues. You can reactivate
								anytime.
							</p>
						</div>
						<Button
							variant="outline"
							className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl px-8 font-bold h-11 border-2 transition-all"
						>
							Deactivate
						</Button>
					</div>

					<div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border-2 border-red-50 bg-white">
						<div>
							<h4 className="font-bold text-red-600">Delete Account</h4>
							<p className="text-sm text-neutral-500 max-w-md mt-1 font-medium">
								Permanently delete everything. This process is irreversible.
							</p>
						</div>
						<Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 font-black h-12 shadow-lg shadow-red-500/20 hover:scale-105 transition-all">
							Delete Account
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
