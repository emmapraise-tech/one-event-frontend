'use client';

import { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function ListingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					Loading listings...
				</div>
			}
		>
			<ListingsContent>{children}</ListingsContent>
		</Suspense>
	);
}

function ListingsContent({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<main className="flex-1">{children}</main>
		</div>
	);
}
