'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { SettingsSidebar } from '@/components/dashboard/settings/SettingsSidebar';
import { ProfileSettings } from '@/components/dashboard/settings/ProfileSettings';
import { EmptyState } from '@/components/ui/empty-state'; // Optional reuse

export default function SettingsPage() {
	const { user, isLoading } = useAuth();
	const [activeTab, setActiveTab] = useState('profile');

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Settings
				</h1>
				<p className="text-muted-foreground mt-1">
					Manage your profile, security, payments, and notifications.
				</p>
			</div>

			<div className="flex flex-col lg:flex-row gap-8 items-start">
				{/* Sidebar Navigation */}
				<SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

				{/* Content Area */}
				<div className="flex-1 w-full">
					{activeTab === 'profile' ? (
						<ProfileSettings />
					) : (
						<div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-muted-foreground">
							<h3 className="text-lg font-semibold text-gray-900">
								Coming Soon
							</h3>
							<p>The {activeTab} settings panel is under construction.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
