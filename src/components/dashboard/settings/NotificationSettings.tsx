'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function NotificationSettings() {
	const [prefs, setPrefs] = useState({
		bookingAlerts: true,
		marketing: false,
		securityAlerts: true,
		paymentAlerts: true,
		pushNotifs: true,
		newsletter: false,
	});

	const toggle = (key: keyof typeof prefs) => {
		setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const sections = [
		{
			title: 'Activity Notifications',
			description: 'Stay updated on your booking requests and venue activity',
			items: [
				{
					id: 'bookingAlerts',
					label: 'Booking Requests',
					desc: 'Get notified when someone requests to book your venue.',
					icon: Bell,
				},
				{
					id: 'paymentAlerts',
					label: 'Payment Confirmations',
					desc: 'Receive alerts for successful payments or deposit updates.',
					icon: Smartphone,
				},
				{
					id: 'securityAlerts',
					label: 'Account Security',
					desc: 'Alerts for new logins or profile changes.',
					icon: Mail,
				},
			],
		},
		{
			title: 'Marketing & News',
			description: 'Newsletter and promotional updates',
			items: [
				{
					id: 'newsletter',
					label: 'Monthly Newsletter',
					desc: 'Best venues and upcoming events curate.',
					icon: Mail,
				},
				{
					id: 'marketing',
					label: 'Promotional Offers',
					desc: 'Get discounts and early bird access to new listings.',
					icon: MessageSquare,
				},
			],
		},
	];

	return (
		<div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
			{sections.map((section, idx) => (
				<Card
					key={idx}
					className="border-neutral-100 shadow-sm overflow-hidden rounded-2xl"
				>
					<CardHeader className="bg-neutral-50/50 border-b border-neutral-100 pb-4">
						<CardTitle className="text-lg font-bold">{section.title}</CardTitle>
						<CardDescription>{section.description}</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y divide-neutral-100">
							{section.items.map((item) => {
								const Icon = item.icon;
								return (
									<div
										key={item.id}
										className="p-6 flex items-start justify-between hover:bg-neutral-50/30 transition-colors"
									>
										<div className="flex items-start gap-4">
											<div className="mt-1 h-9 w-9 bg-white border border-neutral-100 rounded-xl flex items-center justify-center text-neutral-400">
												<Icon className="h-4 w-4" />
											</div>
											<div className="space-y-1">
												<Label
													htmlFor={item.id}
													className="text-base font-bold text-neutral-900 cursor-pointer"
												>
													{item.label}
												</Label>
												<p className="text-sm text-neutral-500">{item.desc}</p>
											</div>
										</div>
										<Checkbox
											id={item.id}
											checked={prefs[item.id as keyof typeof prefs]}
											onCheckedChange={() =>
												toggle(item.id as keyof typeof prefs)
											}
											className="h-6 w-6 rounded-lg border-neutral-200 data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue"
										/>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			))}

			<div className="pt-2 flex justify-end">
				<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white px-10 rounded-xl font-bold h-12 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
					Save Notification Settings
				</Button>
			</div>
		</div>
	);
}
