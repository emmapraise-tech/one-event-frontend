import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Careers | OneEvent',
	description:
		'Join the OneEvent team and help us redefine the event planning industry in Nigeria.',
};

export default function CareersPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-[#0B1120] text-white py-24 md:py-32 overflow-hidden relative">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/20 to-transparent" />
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white">
							Build the Future of{' '}
							<span className="text-brand-gold">Events</span>
						</h1>
						<p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-8">
							We're looking for passionate, driven individuals to join our
							growing team in Lagos and across Nigeria.
						</p>
						<Button className="bg-brand-gold hover:bg-brand-gold-hover text-white px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-amber-500/20 transition-all">
							View Open Positions <ArrowRight className="ml-2 w-5 h-5" />
						</Button>
					</div>
				</div>
			</section>

			{/* Open Roles (Placeholder) */}
			<section className="py-20 bg-neutral-50 flex-1">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-2xl mx-auto mb-16">
						<h2 className="text-3xl font-bold text-neutral-900 mb-4">
							Open Roles
						</h2>
						<p className="text-lg text-neutral-500">
							Currently, we don't have any open positions matching your search.
							Check back later!
						</p>
					</div>

					<div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-neutral-100 max-w-xl mx-auto text-center">
						<div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-6">
							<Briefcase className="w-8 h-8" />
						</div>
						<h3 className="text-xl font-bold text-neutral-900 mb-2">
							No roles available right now
						</h3>
						<p className="text-neutral-500 mb-6">
							We're always on the lookout for great talent. Send your resume to{' '}
							<a
								href="mailto:careers@oneevent.com"
								className="text-primary-blue hover:underline"
							>
								careers@oneevent.com
							</a>{' '}
							and we'll keep it on file.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
