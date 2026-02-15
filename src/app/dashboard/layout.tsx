'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider } from '@/providers/sidebar-provider';
import { DashboardFooter } from '@/components/dashboard/footer';
import { Suspense } from 'react';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center bg-neutral-50">
					<Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
				</div>
			}
		>
			<DashboardContent>{children}</DashboardContent>
		</Suspense>
	);
}

function DashboardContent({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !user) {
			router.push('/login');
		}
	}, [user, isLoading, router]);

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-neutral-50">
				<Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<SidebarProvider>
			<div className="flex min-h-screen bg-neutral-50">
				<Sidebar />
				<div className="flex-1 flex flex-col h-screen overflow-hidden">
					<DashboardHeader />
					<main className="flex-1 overflow-y-auto bg-gray-50/50">
						<div className="mx-auto p-6 md:p-8 w-full max-w-[1600px]">
							{children}
						</div>
						<DashboardFooter />
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
