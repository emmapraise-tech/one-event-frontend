import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
	Calendar,
	User,
	ArrowLeft,
	Clock,
	Share2,
	Facebook,
	Twitter,
	Linkedin,
	Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const metadata: Metadata = {
	title: 'Blog Post | OneEvent',
	description: 'Read the latest insights from OneEvent.',
};

const BLOG_POSTS = [
	{
		title: 'Top 10 Wedding Venues in Lagos for 2026',
		desc: 'Discover the most sought-after locations for your special day.',
		date: 'Feb 28, 2026',
		author: 'Editorial Team',
		authorRole: 'Content Creators',
		authorBio:
			'The OneEvent Editorial Team brings you the latest insights, trends, and inspiration from the event industry in Nigeria.',
		authorImage: '/images/auth-sidebar.png',
		category: 'Weddings',
		slug: 'top-10-wedding-venues-lagos-2026',
		image: '/images/blog/blog_post_1.png',
		readTime: '5 min read',
		content: `
            <p>Planning a wedding in Lagos is thrilling. The city vibrates with energy, and its venues are nothing short of spectacular. This year, we are seeing a magnificent blend of traditional elegance and modern luxury.</p>
            <h3>1. The Grand Orchid</h3>
            <p>Located in the heart of Victoria Island, this venue offers an unparalleled indoor experience with crystal chandeliers and a dedicated hospitality team.</p>
            <h3>2. Lekki Waterside Pavilion</h3>
            <p>For those who love the breeze and a beautiful sunset view, this outdoor venue is perfect for evening receptions.</p>
            <p><strong>Conclusion:</strong> Choosing the right venue sets the tone for your entire celebration. Whether you prefer an intimate garden or a grand hall, Lagos has something perfect for your 2026 wedding.</p>
        `,
	},
	{
		title: "How to Maximize Your Venue's Booking Rate",
		desc: 'A guide for partners on optimizing listings and attracting more clients.',
		date: 'Feb 20, 2026',
		author: 'Partner Success',
		authorRole: 'Venue Optimization Team',
		authorBio:
			'Our partner success team works closely with venue owners to maximize their digital presence and booking volumes.',
		authorImage: '/images/venue-2.jpg',
		category: 'Business',
		slug: 'maximize-venue-booking-rate',
		image: '/images/venue-2.jpg',
		readTime: '8 min read',
		content: `
            <p>As a venue partner, your goal is to keep your calendar fully booked. But how do you stand out in a competitive market?</p>
            <h3>High-Quality Photos are Key</h3>
            <p>First impressions matter. Invest in professional photography that captures your venue in the best lighting. Show different layouts (banquet, conference, empty) to help clients visualize their events.</p>
            <h3>Transparent Pricing</h3>
            <p>Clients appreciate clarity. Venues with clear, upfront pricing and listed amenities receive 40% more booking inquiries.</p>
            <p>Apply these tips today and watch your inquiries convert into confirmed bookings!</p>
        `,
	},
	{
		title: "Planning a Corporate Retreat? Here's What You Need",
		desc: 'The ultimate checklist for organizing a productive and memorable tech getaway.',
		date: 'Jan 15, 2026',
		author: 'Event Planning',
		authorRole: 'Corporate Strategist',
		authorBio:
			'Specialists in curating impactful corporate retreat experiences that foster team cohesion and creativity.',
		authorImage: '/images/venue-3.jpg',
		category: 'Corporate',
		slug: 'corporate-retreat-planning',
		image: '/images/venue-3.jpg',
		readTime: '6 min read',
		content: `
            <p>Corporate retreats are essential for team bonding and strategic planning. A successful retreat requires meticulous planning and the right location.</p>
            <h3>1. Define the Objective</h3>
            <p>Is this retreat for team-building, product planning, or simply a reward for a great quarter? Knowing the goal will dictate the location and activities.</p>
            <h3>2. Choose a Location that Inspires</h3>
            <p>Stepping out of the concrete jungle can spark creativity. Look for venues outside the main city center that offer nature views and quiet surroundings.</p>
            <p>With careful planning, your next corporate retreat will be the talk of the office for months to come.</p>
        `,
	},
];

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const resolvedParams = await params;
	const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

	if (!post) {
		notFound();
	}

	return (
		<div className="flex flex-col min-h-screen bg-white">
			{/* Breadcrumb & Navigation */}
			<div className="container mx-auto px-4 py-8">
				<Link
					href="/blog"
					className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-primary-blue transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Blog
				</Link>
			</div>

			{/* Article Header */}
			<article className="container mx-auto px-4 max-w-4xl pb-24">
				<div className="mb-8">
					<span className="inline-block bg-blue-50 text-primary-blue text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
						{post.category}
					</span>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mb-6 leading-tight tracking-tight">
						{post.title}
					</h1>

					<div className="flex flex-wrap items-center gap-6 text-neutral-500 border-b border-neutral-100 pb-8">
						<div className="flex items-center gap-2">
							<User className="w-5 h-5 text-neutral-400" />
							<span className="font-medium text-neutral-900">
								{post.author}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Calendar className="w-5 h-5 text-neutral-400" />
							<span>{post.date}</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-5 h-5 text-neutral-400" />
							<span>{post.readTime}</span>
						</div>
					</div>
				</div>

				{/* Cover Image */}
				<div className="relative w-full aspect-2/1 md:aspect-21/9 rounded-3xl overflow-hidden mb-12 shadow-md">
					<Image
						src={post.image}
						alt={post.title}
						fill
						className="object-cover"
						priority
					/>
				</div>

				{/* Content Layout */}
				<div className="flex flex-col lg:flex-row gap-12">
					{/* Share Sidebar (Sticky Desktop) */}
					<div className="hidden lg:block w-16 shrink-0">
						<div className="sticky top-28 flex flex-col gap-4 items-center">
							<span
								className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 rotate-180"
								style={{ writingMode: 'vertical-rl' }}
							>
								Share
							</span>
							<div className="w-px h-12 bg-neutral-200 mb-2"></div>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full text-neutral-500 hover:text-[#1877F2] hover:bg-blue-50"
							>
								<Facebook className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full text-neutral-500 hover:text-[#1DA1F2] hover:bg-blue-50"
							>
								<Twitter className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full text-neutral-500 hover:text-[#0A66C2] hover:bg-blue-50"
							>
								<Linkedin className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
							>
								<Share2 className="w-5 h-5" />
							</Button>
						</div>
					</div>

					{/* Main Content & Author Bio */}
					<div className="flex-1">
						<div
							className="prose prose-lg md:prose-xl prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary-blue prose-img:rounded-2xl mb-12"
							dangerouslySetInnerHTML={{ __html: post.content }}
						/>

						{/* Author Bio Box */}
						<div className="bg-neutral-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start border border-neutral-100">
							<Avatar className="w-16 h-16 shrink-0 border-2 border-white shadow-sm">
								<AvatarImage
									src={post.authorImage}
									alt={post.author}
									className="object-cover"
								/>
								<AvatarFallback className="bg-primary-blue text-white font-bold">
									{post.author.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div>
								<h3 className="text-lg font-bold text-neutral-900 mb-1">
									Written by {post.author}
								</h3>
								<p className="text-sm text-primary-blue font-medium mb-3">
									{post.authorRole}
								</p>
								<p className="text-neutral-600 leading-relaxed text-sm md:text-base">
									{post.authorBio}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Share */}
				<div className="lg:hidden flex items-center gap-4 mt-12 py-6 border-t border-b border-neutral-100">
					<span className="font-bold text-neutral-900">Share:</span>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-neutral-500 hover:text-[#1877F2]"
					>
						<Facebook className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-neutral-500 hover:text-[#1DA1F2]"
					>
						<Twitter className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-neutral-500 hover:text-[#0A66C2]"
					>
						<Linkedin className="w-5 h-5" />
					</Button>
				</div>
			</article>

			{/* Newsletter Subscription */}
			<section className="bg-[#0B1120] py-20 relative overflow-hidden">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/10 to-transparent" />
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold text-white mb-4">
							Subscribe to our Newsletter
						</h2>
						<p className="text-neutral-400 mb-8 leading-relaxed">
							Get the best event planning tips, venue recommendations, and
							exclusive offers delivered straight to your inbox.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
							<div className="relative flex-1">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
								<Input
									type="email"
									placeholder="Enter your email"
									className="bg-white/5 border-white/10 text-white pl-10 h-12 focus-visible:ring-brand-gold focus-visible:border-brand-gold rounded-xl placeholder:text-neutral-500"
								/>
							</div>
							<Button className="h-12 px-8 bg-brand-gold hover:bg-brand-gold-hover text-white rounded-xl font-bold shadow-lg shadow-amber-500/20">
								Subscribe
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Related Articles */}
			<section className="py-24 bg-neutral-50">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-end mb-12">
						<h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
							More from our blog
						</h2>
						<Link
							href="/blog"
							className="text-primary-blue font-semibold hover:underline hidden sm:block"
						>
							View all posts &rarr;
						</Link>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{BLOG_POSTS.filter((p) => p.slug !== post.slug)
							.slice(0, 3)
							.map((relatedPost, i) => (
								<Link
									href={`/blog/${relatedPost.slug}`}
									key={i}
									className="group flex"
								>
									<article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 group-hover:shadow-xl transition-shadow flex flex-col h-full w-full">
										<div className="h-48 bg-neutral-200 w-full relative overflow-hidden">
											<Image
												src={relatedPost.image}
												alt={relatedPost.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-500"
											/>
											<div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20 group-hover:bg-black/10 transition-colors" />
											<span className="absolute top-4 left-4 bg-primary-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
												{relatedPost.category}
											</span>
										</div>
										<div className="p-6 flex-1 flex flex-col">
											<h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-primary-blue transition-colors leading-tight">
												{relatedPost.title}
											</h3>
											<p className="text-neutral-600 text-sm mb-6 flex-1 line-clamp-2">
												{relatedPost.desc}
											</p>
											<div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100 text-xs text-neutral-500">
												<div className="flex items-center gap-2">
													<Calendar className="w-3 h-3" />
													{relatedPost.date}
												</div>
												<div className="flex items-center gap-2">
													<Clock className="w-3 h-3" />
													{relatedPost.readTime}
												</div>
											</div>
										</div>
									</article>
								</Link>
							))}
					</div>

					<div className="mt-8 text-center sm:hidden">
						<Link href="/blog">
							<Button
								variant="outline"
								className="w-full border-neutral-200 text-neutral-900 hover:bg-neutral-100"
							>
								View all posts
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
