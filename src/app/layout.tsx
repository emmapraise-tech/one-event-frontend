import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Providers from '@/components/providers';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: {
		default: 'OneEvent | Book Verified Event Venues, Halls & Vendors',
		template: '%s | OneEvent',
	},
	description:
		'Find, compare, and book verified event centers, wedding halls, and trusted event vendors across Nigeria. Seamless event planning and instant bookings with OneEvent.',
	keywords: [
		'event venues',
		'event centers',
		'book event venue',
		'wedding halls',
		'party halls in Lagos',
		'event centers Abuja',
		'event vendors Nigeria',
		'event management platform',
		'venue booking platform',
		'OneEvent',
	],
	openGraph: {
		title: 'OneEvent | Book Verified Event Venues, Halls & Vendors',
		description:
			'Find, compare, and book verified event centers, wedding halls, and trusted event vendors across Nigeria.',
		type: 'website',
		locale: 'en_NG',
		siteName: 'OneEvent',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'OneEvent | Book Verified Event Venues, Halls & Vendors',
		description:
			'Find, compare, and book verified event centers, wedding halls, and trusted event vendors across Nigeria.',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-D0RTF5GGE9"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-D0RTF5GGE9');
					`}
				</Script>
			</head>
			<body
				className={`${inter.variable} font-sans antialiased text-neutral-text-primary bg-neutral-bg flex flex-col min-h-screen`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

