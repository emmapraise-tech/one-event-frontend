import { Metadata } from 'next';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const metadata: Metadata = {
	title: 'Blog | OneEvent',
	description:
		'Read the latest news, tips, and insights on event planning and venue management in Nigeria.',
};

export default function BlogPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-[#0B1120] text-white py-24 md:py-32 overflow-hidden relative">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/20 to-transparent" />
				<div className="container mx-auto px-4 relative z-10 text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white">
						OneEvent <span className="text-brand-gold">Blog</span>
					</h1>
					<p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto">
						Insights, trends, and inspiration for your next big event.
					</p>
				</div>
			</section>

			{/* Featured Articles Placeholder */}
			<section className="py-20 bg-neutral-50 flex-1">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								title: 'Top 10 Wedding Venues in Lagos for 2026',
								desc: 'Discover the most sought-after locations for your special day.',
								date: 'Feb 28, 2026',
								author: 'Editorial Team',
								category: 'Weddings',
								slug: 'top-10-wedding-venues-lagos-2026',
								image: '/images/blog/blog_post_1.png',
							},
							{
								title: "How to Maximize Your Venue's Booking Rate",
								desc: 'A guide for partners on optimizing listings and attracting more clients.',
								date: 'Feb 20, 2026',
								author: 'Partner Success',
								category: 'Business',
								slug: 'maximize-venue-booking-rate',
								image: '/images/venue-2.jpg',
							},
							{
								title: "Planning a Corporate Retreat? Here's What You Need",
								desc: 'The ultimate checklist for organizing a productive and memorable tech getaway.',
								date: 'Jan 15, 2026',
								author: 'Event Planning',
								category: 'Corporate',
								slug: 'corporate-retreat-planning',
								image: '/images/venue-3.jpg',
							},
						].map((post, i) => (
							<Link href={`/blog/${post.slug}`} key={i} className="group flex">
								<article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 group-hover:shadow-xl transition-shadow flex flex-col h-full w-full">
									<div className="h-48 bg-neutral-200 w-full relative overflow-hidden">
										<Image
											src={post.image}
											alt={post.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-500"
										/>
										<div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20 group-hover:bg-black/10 transition-colors" />
										<span className="absolute top-4 left-4 bg-primary-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
											{post.category}
										</span>
									</div>
									<div className="p-6 flex-1 flex flex-col">
										<h2 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-blue transition-colors leading-tight">
											{post.title}
										</h2>
										<p className="text-neutral-600 mb-6 flex-1">{post.desc}</p>
										<div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100 text-sm text-neutral-500">
											<div className="flex items-center gap-2">
												<Calendar className="w-4 h-4" />
												{post.date}
											</div>
											<div className="flex items-center gap-2">
												<User className="w-4 h-4" />
												{post.author}
											</div>
										</div>
									</div>
								</article>
							</Link>
						))}
					</div>

					<div className="mt-16 text-center">
						<Button
							variant="outline"
							className="border-neutral-200 text-neutral-900 hover:bg-neutral-100 px-8 py-6 rounded-xl text-base font-bold transition-all"
						>
							Load More Articles
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
