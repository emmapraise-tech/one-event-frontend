import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Suspense } from 'react';

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<Suspense fallback={<div className="h-16 w-full bg-white shadow-sm" />}>
				<Header />
			</Suspense>
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
