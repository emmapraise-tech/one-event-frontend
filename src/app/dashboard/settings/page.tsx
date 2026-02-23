'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SettingsSidebar } from '@/components/dashboard/settings/SettingsSidebar';
import { FormSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';
import { ProfileSettings } from '@/components/dashboard/settings/ProfileSettings';
import { GeneralSettings } from '@/components/dashboard/settings/GeneralSettings';
import { SecuritySettings } from '@/components/dashboard/settings/SecuritySettings';
import { NotificationSettings } from '@/components/dashboard/settings/NotificationSettings';
import { BillingSettings } from '@/components/dashboard/settings/BillingSettings';

export default function SettingsPage() {
	const { user, isLoading } = useAuth();
	const [activeTab, setActiveTab] = useState('profile');

	if (isLoading) {
		return (
			<div className="space-y-8">
				<PageHeaderSkeleton />
				<div className="flex flex-col lg:flex-row gap-8 items-start">
					<div className="w-full lg:w-64">
						<FormSkeleton fields={5} />
					</div>
					<div className="flex-1 w-full">
						<FormSkeleton fields={4} />
					</div>
				</div>
			</div>
		);
	}

	const renderContent = () => {
		switch (activeTab) {
			case 'general':
				return <GeneralSettings />;
			case 'profile':
				return <ProfileSettings />;
			case 'security':
				return <SecuritySettings />;
			case 'notifications':
				return <NotificationSettings />;
			case 'billing':
				return <BillingSettings />;
			default:
				return (
					<div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-muted-foreground animate-in fade-in duration-500">
						<h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
						<p>The {activeTab} settings panel is under construction.</p>
					</div>
				);
		}
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="animate-in fade-in slide-in-from-left-4 duration-500">
				<h1 className="text-3xl font-black tracking-tight text-neutral-900">
					Settings
				</h1>
				<p className="text-neutral-500 mt-1 font-medium">
					Personalize your experience and manage account security.
				</p>
			</div>

			<div className="flex flex-col lg:flex-row gap-8 items-start">
				{/* Sidebar Navigation */}
				<SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

				{/* Content Area */}
				<div className="flex-1 w-full min-h-[600px]">{renderContent()}</div>
			</div>
		</div>
	);
}
