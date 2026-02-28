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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
	const post = BLOG_POSTS.find((p) => p.slug === params.slug);

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

					{/* Main Content */}
					<div
						className="flex-1 prose prose-lg md:prose-xl prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary-blue prose-img:rounded-2xl"
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
				</div>

				{/* Mobile Share */}
				<div className="lg:hidden flex items-center gap-4 mt-12 py-6 border-t border-y-neutral-100">
					<span className="font-bold text-neutral-900">Share:</span>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-neutral-500"
					>
						<Facebook className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-neutral-500"
					>
						<Twitter className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-neutral-500"
					>
						<Linkedin className="w-5 h-5" />
					</Button>
				</div>
			</article>
		</div>
	);
}
