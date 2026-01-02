import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
	Search,
	MapPin,
	Heart,
	ArrowRight,
	Star,
	ChevronLeft,
	ChevronRight,
	CheckCircle2,
	MessageSquare,
	Calendar,
} from 'lucide-react';
import { Footer } from '@/components/footer';

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Header/Nav would typically be in layout, but ensuring we have the main content structure */}

			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative flex min-h-[600px] flex-col items-center justify-center bg-[#1e2330] px-4 py-20 text-center text-white">
					{/* Background Gradient/Image Placeholder */}
					<div className="absolute inset-0 bg-linear-to-b from-[#1e2330]/80 to-[#1e2330] z-0 pointer-events-none" />
					<div className="absolute top-10 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

					<div className="relative z-10 max-w-4xl space-y-6">
						<h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
							Discover & Book the
							<br />
							Perfect Space for Your
							<br />
							Next Event
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-gray-300">
							Find the ideal venue for weddings, corporate meetings, and parties
							across Nigeria with ease.
						</p>

						{/* Search Bar */}
						<div className="mx-auto mt-8 max-w-3xl rounded-lg bg-white p-2 text-black shadow-lg">
							<div className="flex flex-col gap-2 sm:flex-row">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										type="text"
										placeholder="Where are you planning your event? (e.g. Lagos, Abuja, Event Centre)"
										className="border-0 pl-10 focus-visible:ring-0"
									/>
								</div>
								<Button className="bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto w-full">
									Search
								</Button>
							</div>
						</div>

						{/* Filters */}
						<div className="mt-6 flex flex-wrap justify-center gap-4">
							<Select>
								<SelectTrigger className="w-[140px] border-white/20 bg-white/10 text-white backdrop-blur-sm">
									<SelectValue placeholder="Capacity" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="small">0-50 Guests</SelectItem>
									<SelectItem value="medium">50-200 Guests</SelectItem>
									<SelectItem value="large">200+ Guests</SelectItem>
								</SelectContent>
							</Select>
							<Select>
								<SelectTrigger className="w-[140px] border-white/20 bg-white/10 text-white backdrop-blur-sm">
									<SelectValue placeholder="Price Range" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">$ - Affordable</SelectItem>
									<SelectItem value="medium">$$ - Moderate</SelectItem>
									<SelectItem value="high">$$$ - Luxury</SelectItem>
								</SelectContent>
							</Select>
							<Select>
								<SelectTrigger className="w-[140px] border-white/20 bg-white/10 text-white backdrop-blur-sm">
									<SelectValue placeholder="Venue Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									<SelectItem value="hall">Hall</SelectItem>
									<SelectItem value="outdoor">Outdoor</SelectItem>
								</SelectContent>
							</Select>
							<Select>
								<SelectTrigger className="w-[140px] border-white/20 bg-white/10 text-white backdrop-blur-sm">
									<SelectValue placeholder="Date" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="today">Today</SelectItem>
									<SelectItem value="tomorrow">Tomorrow</SelectItem>
									<SelectItem value="weekend">This Weekend</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</section>

				{/* Explore by Category */}
				<section className="container mx-auto px-4 py-16">
					<div className="mb-10">
						<h2 className="font-display text-2xl font-bold text-gray-900">
							Explore by Category
						</h2>
						<p className="text-gray-500">Browse venues by event type</p>
					</div>

					<div className="grid grid-cols-2 gap-4 md:grid-cols-6">
						<CategoryCard icon="❤️" label="Weddings" />
						<CategoryCard icon="💼" label="Corporate" />
						<CategoryCard icon="🎉" label="Parties" />
						<CategoryCard icon="👥" label="Conferences" />
						<CategoryCard icon="📷" label="Studios" />
						<CategoryCard icon="🍽️" label="Dining" />
					</div>
				</section>

				{/* Featured Event Centers */}
				<section className="bg-gray-50/50 px-4 py-16">
					<div className="container mx-auto">
						<div className="mb-10 flex items-end justify-between">
							<div>
								<h2 className="font-display text-2xl font-bold text-gray-900">
									Featured Event Centers
								</h2>
								<p className="text-gray-500">
									Top-rated venues chosen by our community in Nigeria
								</p>
							</div>
							<Link
								href="/listings"
								className="hidden text-sm font-medium text-blue-600 hover:underline sm:block"
							>
								View all venues →
							</Link>
						</div>

						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							<VenueCard
								image="/images/venue-1.jpg"
								title="The Grand Horizon Hall"
								location="Victoria Island, Lagos"
								price="₦350,000"
								rating={4.8}
							/>
							<VenueCard
								image="/images/venue-2.jpg"
								title="City View Loft"
								location="Maitama, Abuja"
								price="₦200,000"
								rating={4.5}
							/>
							<VenueCard
								image="/images/venue-3.jpg"
								title="Garden Terrace"
								location="Ikeja GRA, Lagos"
								price="₦250,000"
								rating={4.9}
							/>
							<VenueCard
								image="/images/venue-4.jpg"
								title="Lakeside Pavilion"
								location="Jabi Lake, Abuja"
								price="₦400,000"
								rating={4.7}
							/>
						</div>
						<div className="mt-8 text-center sm:hidden">
							<Link
								href="/listings"
								className="text-sm font-medium text-blue-600 hover:underline"
							>
								View all venues →
							</Link>
						</div>
					</div>
				</section>

				{/* How OneEvent Works */}
				<section className="container mx-auto px-4 py-20">
					<div className="mb-16 text-center">
						<h2 className="font-display text-2xl font-bold text-gray-900">
							How OneEvent Works
						</h2>
						<p className="mx-auto mt-2 max-w-2xl text-gray-500">
							Booking a venue has never been easier. Follow these three simple
							steps to secure your perfect space.
						</p>
					</div>

					<div className="grid gap-12 md:grid-cols-3">
						<div className="flex flex-col items-center text-center">
							<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
								<Search className="h-8 w-8" />
							</div>
							<h3 className="mb-3 font-semibold text-gray-900">1. Discover</h3>
							<p className="text-sm text-gray-500">
								Browse our curated list of high-quality venues in your city.
								Filter by location, capacity, and price to find your match.
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
								<MessageSquare className="h-8 w-8" />
							</div>
							<h3 className="mb-3 font-semibold text-gray-900">2. Connect</h3>
							<p className="text-sm text-gray-500">
								Message hosts directly to ask questions, schedule tours, and
								discuss specific requirements for your event.
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
								<CheckCircle2 className="h-8 w-8" />
							</div>
							<h3 className="mb-3 font-semibold text-gray-900">
								3. Book Securely
							</h3>
							<p className="text-sm text-gray-500">
								Confirm your reservation with our secure payment system (Naira
								cards accepted) and receive instant confirmation.
							</p>
						</div>
					</div>
				</section>

				{/* What our users say */}
				<section className="bg-gray-50 px-4 py-20">
					<div className="container mx-auto">
						<div className="mb-10 flex items-center justify-between">
							<div>
								<h2 className="font-display text-2xl font-bold text-gray-900">
									What our users say
								</h2>
								<p className="text-gray-500">
									Join thousands of satisfied customers who found their perfect
									venue on OneEvent.
								</p>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" size="icon" className="rounded-full">
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button
									size="icon"
									className="rounded-full bg-primary hover:bg-primary/90"
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-3">
							<TestimonialCard
								quote="The platform is incredibly intuitive. I found a stunning hall for our traditional wedding in Lagos in less than an hour. The host was responsive and the booking process was seamless."
								author="Chioma Okafor"
								role="Event Planner"
								initials="CO"
							/>
							<TestimonialCard
								quote="As a venue owner in Ibadan, OneEvent has transformed my business. The dashboard is easy to use, and I've seen a 40% increase in bookings since listing my property here."
								author="Babatunde Alabi"
								role="Venue Owner"
								initials="BA"
								variant="green"
							/>
							<TestimonialCard
								quote="I was struggling to find a wedding venue that fit our budget for our Nikah. OneEvent's filters helped us narrow down the options quickly. We found our dream garden venue!"
								author="Zainab Ahmed"
								role="Bride-to-be"
								initials="ZA"
								variant="purple"
							/>
						</div>
					</div>
				</section>

				{/* List Your Space */}
				<section className="container mx-auto px-4 py-20">
					<div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5">
						<div className="grid md:grid-cols-2">
							<div className="p-10 md:p-16 flex flex-col justify-center">
								<h2 className="font-display text-3xl font-bold text-gray-900">
									List your space on OneEvent
								</h2>
								<p className="mt-4 text-lg text-gray-500">
									Turn your extra space into extra income. Join thousands of
									venue owners across Nigeria who trust OneEvent to manage
									bookings and payments effortlessly.
								</p>
								<div className="mt-8 flex gap-4">
									<Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold h-12 px-8">
										Become a Host
									</Button>
									<Button
										variant="secondary"
										className="bg-gray-100 hover:bg-gray-200 text-gray-900 h-12 px-8"
									>
										Learn More
									</Button>
								</div>
							</div>
							<div className="relative h-64 bg-gray-100 md:h-auto">
								{/* Placeholder for Host Image */}
								<div className="absolute inset-0 flex items-center justify-center bg-gray-200">
									<img
										src="/images/host-banner.jpg"
										alt="Host"
										className="h-full w-full object-cover"
									/>
									<div className="absolute inset-0 bg-black/10"></div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

function CategoryCard({ icon, label }: { icon: string; label: string }) {
	return (
		<Card className="cursor-pointer border-0 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
			<CardContent className="flex flex-col items-center justify-center p-6 text-center">
				<span className="mb-3 text-2xl">{icon}</span>
				<span className="text-sm font-medium text-gray-700">{label}</span>
			</CardContent>
		</Card>
	);
}

function VenueCard({
	image,
	title,
	location,
	price,
	rating,
}: {
	image: string;
	title: string;
	location: string;
	price: string;
	rating: number;
}) {
	return (
		<Card className="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md group">
			<div className="relative aspect-4/3 bg-gray-200">
				{/* Image Placeholder */}
				<div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
					<MapPin className="h-8 w-8 opacity-20" />
				</div>
				{/* Rating Badge */}
				<div className="absolute right-3 top-3 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm flex items-center gap-1">
					<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
					{rating}
				</div>
			</div>
			<CardContent className="p-4">
				<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-1">
					{title}
				</h3>
				<div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
					<MapPin className="h-3 w-3" />
					{location}
				</div>
				<div className="mt-3 flex items-center justify-between">
					<span className="font-bold text-blue-600">
						{price}{' '}
						<span className="text-xs font-normal text-gray-500">/ hour</span>
					</span>
				</div>
			</CardContent>
		</Card>
	);
}

function TestimonialCard({
	quote,
	author,
	role,
	initials,
	variant = 'blue',
}: {
	quote: string;
	author: string;
	role: string;
	initials: string;
	variant?: 'blue' | 'green' | 'purple';
}) {
	const bgColors = {
		blue: 'bg-blue-100 text-blue-600',
		green: 'bg-green-100 text-green-600',
		purple: 'bg-purple-100 text-purple-600',
	};

	return (
		<Card className="border-0 shadow-sm">
			<CardContent className="p-8">
				<div className="flex gap-1 mb-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
					))}
				</div>
				<p className="mb-6 text-sm leading-relaxed text-gray-600">"{quote}"</p>
				<div className="flex items-center gap-3">
					<div
						className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${bgColors[variant]}`}
					>
						{initials}
					</div>
					<div>
						<div className="text-sm font-semibold text-gray-900">{author}</div>
						<div className="text-xs text-gray-500">{role}</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
