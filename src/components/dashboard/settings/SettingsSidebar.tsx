'use client';

import {
	User,
	Shield,
	Bell,
	CreditCard,
	Settings as SettingsIcon,
	HelpCircle,
	Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface SettingsSidebarProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

export function SettingsSidebar({
	activeTab,
	onTabChange,
}: SettingsSidebarProps) {
	const { user } = useAuth();

	const menuItems = [
		{
			category: 'ACCOUNT',
			items: [
				{ id: 'general', label: 'General', icon: SettingsIcon },
				{ id: 'profile', label: 'Profile', icon: User },
				{ id: 'security', label: 'Security', icon: Shield },
			],
		},
		{
			category: user?.type === 'CUSTOMER' ? 'PREFERENCES' : 'BUSINESS',
			items: [
				{ id: 'notifications', label: 'Notifications', icon: Bell },
				...(user?.type !== 'CUSTOMER'
					? [{ id: 'billing', label: 'Payments & Billing', icon: CreditCard }]
					: []),
			],
		},
	];

	return (
		<div className="w-full lg:w-64 space-y-8">
			{menuItems.map((section) => (
				<div key={section.category}>
					<h3 className="mb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
						{section.category}
					</h3>
					<div className="space-y-1">
						{section.items.map((item) => {
							const Icon = item.icon;
							const isActive = activeTab === item.id;
							return (
								<Button
									key={item.id}
									variant="ghost"
									onClick={() => onTabChange(item.id)}
									className={cn(
										'w-full justify-start gap-3 px-4 h-11 font-medium',
										isActive
											? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
											: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
									)}
								>
									<Icon
										className={cn(
											'h-4 w-4',
											isActive ? 'text-blue-600' : 'text-gray-500',
										)}
									/>
									{item.label}
								</Button>
							);
						})}
					</div>
				</div>
			))}

			<div className="pt-4 border-t border-gray-100">
				<Button
					variant="ghost"
					className="w-full justify-start gap-3 px-4 h-11 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
				>
					<HelpCircle className="h-4 w-4 text-gray-500" />
					Need help?
				</Button>
			</div>
		</div>
	);
}
