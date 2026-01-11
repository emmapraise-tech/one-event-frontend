'use client';

import { useState } from 'react';
import { useListings } from '@/hooks/useListings';
import { VenueListingCard } from '@/components/listings/venue-listing-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Search,
	MapPin,
	Calendar as CalendarIcon,
	Building2,
	Map as MapIcon,
	SlidersHorizontal,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { ListingStatus } from '@/types/listing';

export default function ListingsLandingPage() {
	const { listings, isLoading, error } = useListings();
	const [searchQuery, setSearchQuery] = useState('');
	const [date, setDate] = useState<Date>();

	// Mock filtering state
	const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);

	// Filter to show only ACTIVE listings
	let activeListings =
		listings?.filter((listing) => listing.status === ListingStatus.ACTIVE) ||
		[];

	// Apply search filter (Basic implementation)
	if (searchQuery) {
		activeListings = activeListings.filter(
			(listing) =>
				listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				listing.city?.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}

	return (
		<div className="bg-neutral-bg min-h-screen pb-20">
			{/* Hero Search Section */}
			<div className="bg-white border-b border-neutral-200">
				<div className="container mx-auto px-4 py-12 lg:py-16">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
						<div className="max-w-xl shrink-0">
							<h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
								Find the{' '}
								<span className="text-primary-blue">perfect venue</span>
							</h1>
							<p className="text-neutral-500 text-lg">
								Discover and book premium event centers in Lagos, Abuja, and
								across Nigeria. From intimate weddings to corporate conferences.
							</p>
						</div>

						{/* Search Bar Strip */}
						<div className="w-full max-w-3xl bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-100 p-2">
							<div className="flex flex-col md:flex-row gap-2">
								{/* Location Input */}
								<div className="flex-1 relative border-b md:border-b-0 md:border-r border-neutral-100 px-2 py-2 md:py-0">
									<label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5 block px-2">
										Location
									</label>
									<div className="flex items-center px-2">
										<MapPin className="h-4 w-4 text-neutral-400 mr-2 shrink-0" />
										<input
											type="text"
											placeholder="Lagos, Abuja, PH..."
											className="w-full outline-none text-neutral-900 font-medium placeholder:text-neutral-300 text-sm"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
										/>
									</div>
								</div>

								{/* Date Input */}
								<div className="flex-1 relative border-b md:border-b-0 md:border-r border-neutral-100 px-2 py-2 md:py-0">
									<label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5 block px-2">
										Date
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<div className="flex items-center px-2 cursor-pointer hover:bg-neutral-50 rounded-md py-1 transition-colors group">
												<CalendarIcon className="h-4 w-4 text-neutral-400 mr-2 shrink-0 group-hover:text-primary-blue transition-colors" />
												<span
													className={cn(
														'text-sm font-medium w-full text-left truncate',
														!date && 'text-neutral-300'
													)}
												>
													{date ? format(date, 'PPP') : <span>Add dates</span>}
												</span>
											</div>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={date}
												onSelect={setDate}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>

								{/* Type Input */}
								<div className="flex-1 relative px-2 py-2 md:py-0">
									<label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5 block px-2">
										Event Type
									</label>
									<div className="flex items-center px-2">
										<Building2 className="h-4 w-4 text-neutral-400 mr-2 shrink-0" />
										<select className="w-full outline-none text-neutral-900 font-medium bg-transparent text-sm appearance-none cursor-pointer">
											<option>Any Type</option>
											<option>Wedding</option>
											<option>Corporate</option>
											<option>Party</option>
										</select>
									</div>
								</div>

								<div className="p-1">
									<Button className="w-full md:w-auto h-full min-h-[48px] px-8 bg-brand-blue hover:bg-brand-blue-hover text-white font-bold rounded-lg shadow-sm">
										<Search className="h-4 w-4 mr-2" />
										Search
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				{/* Top Controls */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
					<div>
						<h2 className="text-xl font-bold text-neutral-900">
							240 Venues found
						</h2>
					</div>

					<div className="flex items-center gap-4 w-full sm:w-auto">
						<div className="flex items-center gap-2 text-sm text-neutral-500 mr-auto sm:mr-0">
							<span className="hidden sm:inline">Sort by:</span>
							<Select defaultValue="recommended">
								<SelectTrigger className="w-[160px] h-9 border-neutral-200 bg-white">
									<SelectValue placeholder="Sort order" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="recommended">Recommended</SelectItem>
									<SelectItem value="price-low">Price: Low to High</SelectItem>
									<SelectItem value="price-high">Price: High to Low</SelectItem>
									<SelectItem value="rating">Top Rated</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button
							variant="outline"
							className="h-9 gap-2 border-neutral-200 bg-white text-neutral-700 hover:text-primary-blue"
						>
							<MapIcon className="h-4 w-4" />
							Map View
						</Button>
					</div>
				</div>

				<div className="grid lg:grid-cols-4 gap-8">
					{/* Filters Sidebar - Desktop */}
					<div className="hidden lg:block lg:col-span-1 space-y-8">
						<div className="flex items-center justify-between pointer-events-none opacity-50">
							{/* Placeholder for "Reset all" functionality */}
							<h3 className="font-bold text-neutral-900">Filters</h3>
							<button className="text-xs font-semibold text-primary-blue hover:underline pointer-events-auto">
								Reset all
							</button>
						</div>

						{/* Location Filter */}
						<div className="space-y-3">
							<label className="text-sm font-semibold text-neutral-900">
								Location
							</label>
							<div className="relative">
								<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
								<Input
									placeholder="e.g. Ikeja, Lekki, Yaba"
									className="pl-9 bg-white border-neutral-200 text-sm"
								/>
							</div>
						</div>

						{/* Date Filter */}
						<div className="space-y-3">
							<label className="text-sm font-semibold text-neutral-900">
								Date
							</label>
							<div className="relative">
								<CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
								<Input
									placeholder="mm/dd/yyyy"
									className="bg-white border-neutral-200 text-sm"
									readOnly
								/>
							</div>
						</div>

						{/* Capacity Filter */}
						<div className="space-y-3">
							<label className="text-sm font-semibold text-neutral-900">
								Capacity
							</label>
							<div className="flex items-center gap-2">
								<Input
									placeholder="Min"
									className="bg-white border-neutral-200 text-sm"
									type="number"
								/>
								<span className="text-neutral-400">-</span>
								<Input
									placeholder="Max"
									className="bg-white border-neutral-200 text-sm"
									type="number"
								/>
							</div>
						</div>

						{/* Price Range */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<label className="text-sm font-semibold text-neutral-900">
									Price Range (₦)
								</label>
								<div className="text-[10px] font-medium bg-neutral-100 px-2 py-0.5 rounded text-neutral-500">
									₦0 - ₦5m+
								</div>
							</div>
							<input
								type="range"
								className="w-full accent-primary-blue h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
							/>
							<div className="flex justify-between text-xs text-neutral-400">
								<span>Min</span>
								<span>Max</span>
							</div>
						</div>

						{/* Venue Type */}
						<div className="space-y-3">
							<label className="text-sm font-semibold text-neutral-900">
								Venue Type
							</label>
							<div className="space-y-2.5">
								{[
									'Banquet Hall',
									'Marquee / Tent',
									'Wedding Venue',
									'Conference Center',
									'Outdoor Space',
								].map((type) => (
									<div key={type} className="flex items-center space-x-2">
										<Checkbox
											id={type}
											className="border-neutral-300 data-[state=checked]:bg-primary-blue"
										/>
										<label
											htmlFor={type}
											className="text-sm text-neutral-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											{type}
										</label>
									</div>
								))}
							</div>
						</div>

						{/* Amenities */}
						<div className="space-y-3">
							<label className="text-sm font-semibold text-neutral-900">
								Amenities
							</label>
							<div className="flex flex-wrap gap-2">
								{[
									'Generator',
									'Parking',
									'Catering',
									'Sound System',
									'Security',
								].map((tag) => (
									<span
										key={tag}
										className="px-3 py-1 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-600 cursor-pointer hover:border-primary-blue hover:text-primary-blue transition-colors"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Venues Grid */}
					<div className="lg:col-span-3">
						{isLoading ? (
							<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<div
										key={i}
										className="h-[380px] bg-white rounded-2xl animate-pulse border border-neutral-100"
									/>
								))}
							</div>
						) : activeListings.length === 0 ? (
							<EmptyState
								icon={<Building2 className="h-16 w-16 text-neutral-300" />}
								title="No venues found"
								description="Try adjusting your filters or search terms."
							/>
						) : (
							<>
								<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
									{activeListings.map((listing) => (
										<VenueListingCard key={listing.id} listing={listing} />
									))}
								</div>

								{/* Pagination (Mockup) */}
								<div className="flex justify-center">
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="icon"
											className="h-10 w-10 text-neutral-400 hover:text-primary-blue border-neutral-200"
										>
											<span className="sr-only">Previous</span>
											&lt;
										</Button>
										<Button className="h-10 w-10 bg-primary-blue hover:bg-primary-blue-hover text-white font-bold">
											1
										</Button>
										<Button
											variant="ghost"
											className="h-10 w-10 text-neutral-600 hover:bg-neutral-100"
										>
											2
										</Button>
										<Button
											variant="ghost"
											className="h-10 w-10 text-neutral-600 hover:bg-neutral-100"
										>
											3
										</Button>
										<span className="text-neutral-400">...</span>
										<Button
											variant="ghost"
											className="h-10 w-10 text-neutral-600 hover:bg-neutral-100"
										>
											10
										</Button>
										<Button
											variant="outline"
											size="icon"
											className="h-10 w-10 text-neutral-400 hover:text-primary-blue border-neutral-200"
										>
											<span className="sr-only">Next</span>
											&gt;
										</Button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
