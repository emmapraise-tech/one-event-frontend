'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import {
	ListingStatus,
	ListingFilters,
	ListingCategory,
	ListingType,
} from '@/types/listing';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming we'll create this or use simple timeout

export default function ListingsLandingPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Initialize filters from URL parameters if present
	const [filters, setFilters] = useState<ListingFilters>(() => {
		const initialFilters: ListingFilters = {
			page: Number(searchParams.get('page')) || 1,
			limit: Number(searchParams.get('limit')) || 12,
			status: ListingStatus.ACTIVE, // Default to ACTIVE
		};

		const q = searchParams.get('q');
		if (q) initialFilters.q = q;

		const location = searchParams.get('location');
		if (location) initialFilters.location = location;

		const minPrice = searchParams.get('minPrice');
		if (minPrice) initialFilters.minPrice = Number(minPrice);

		const maxPrice = searchParams.get('maxPrice');
		if (maxPrice) initialFilters.maxPrice = Number(maxPrice);

		const minCapacity = searchParams.get('minCapacity');
		if (minCapacity) initialFilters.minCapacity = Number(minCapacity);

		const maxCapacity = searchParams.get('maxCapacity');
		if (maxCapacity) initialFilters.maxCapacity = Number(maxCapacity);

		const categories = searchParams.get('categories');
		if (categories) initialFilters.categories = categories.split(',');

		return initialFilters;
	});

	// UI specific state that doesn't trigger immediate search
	const [searchQuery, setSearchQuery] = useState(filters.q || '');
	const [locationInput, setLocationInput] = useState(filters.location || '');
	const [date, setDate] = useState<Date>();
	const [priceRange, setPriceRange] = useState<number[]>([
		filters.minPrice || 0,
		filters.maxPrice || 10000000,
	]);

	const { listings, meta, isLoading, error } = useListings(filters);

	// Update URL when filters change
	useEffect(() => {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				if (Array.isArray(value)) {
					if (value.length > 0) params.append(key, value.join(','));
				} else {
					params.append(key, String(value));
				}
			}
		});

		// Remove status from URL if it's the default ACTIVE
		if (params.get('status') === ListingStatus.ACTIVE) {
			params.delete('status');
		}

		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}, [filters, pathname, router]);

	const handleSearch = () => {
		setFilters((prev) => ({
			...prev,
			q: searchQuery || undefined,
			location: locationInput || undefined,
			page: 1, // Reset to page 1 on search
		}));
	};

	const handleCategoryToggle = (categoryStr: string) => {
		setFilters((prev) => {
			const currentCategories = prev.categories || [];
			const newCategories = currentCategories.includes(categoryStr)
				? currentCategories.filter((c) => c !== categoryStr)
				: [...currentCategories, categoryStr];

			return {
				...prev,
				categories: newCategories.length ? newCategories : undefined,
				page: 1,
			};
		});
	};

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = Number(e.target.value);
		setPriceRange([0, val]); // Simple implementation, slider typically needs Min/Max thumbs
	};

	const handlePriceMouseUp = () => {
		setFilters((prev) => ({
			...prev,
			maxPrice: priceRange[1] || undefined,
			page: 1,
		}));
	};

	const handleCapacityChange = (type: 'min' | 'max', value: string) => {
		const numValue = value ? Number(value) : undefined;
		setFilters((prev) => ({
			...prev,
			[type === 'min' ? 'minCapacity' : 'maxCapacity']: numValue,
			page: 1,
		}));
	};

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const val = e.target.value;
		setFilters((prev) => ({
			...prev,
			type:
				val && val !== 'Any Type'
					? (val.toUpperCase() as ListingType)
					: undefined,
			page: 1,
		}));
	};

	const handlePageChange = (newPage: number) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleResetFilters = () => {
		setSearchQuery('');
		setLocationInput('');
		setDate(undefined);
		setPriceRange([0, 10000000]);
		setFilters({
			page: 1,
			limit: 12,
			status: ListingStatus.ACTIVE,
		});
	};

	return (
		<div className="bg-neutral-bg min-h-screen pb-20">
			{/* Hero Search Section */}
			<div className="bg-white/50 backdrop-blur-sm border-b border-neutral-200">
				<div className="container mx-auto px-4 py-8 lg:py-12">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
						<div className="max-w-xl shrink-0">
							<h1 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
								Find the{' '}
								<span className="text-primary-blue">perfect venue</span>
							</h1>
							<p className="text-neutral-500 text-base md:text-lg">
								Discover and book premium event centers in Lagos, Abuja, and
								across Nigeria.
							</p>
						</div>

						{/* Search Bar Strip */}
						<div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl shadow-black/5 border border-neutral-100 p-2">
							<div className="flex flex-col md:flex-row items-stretch">
								{/* Location Input */}
								<div className="flex-1 px-4 border-b md:border-b-0 md:border-r border-neutral-100 py-3 md:py-2 flex items-center gap-3">
									<div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-600">
										<MapPin className="h-4 w-4" />
									</div>
									<div className="flex flex-col items-start w-full">
										<label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
											Location
										</label>
										<input
											type="text"
											placeholder="Lagos, Abuja, PH..."
											className="w-full outline-none text-neutral-900 font-medium placeholder:text-neutral-300 text-sm bg-transparent"
											value={locationInput}
											onChange={(e) => setLocationInput(e.target.value)}
											onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
										/>
									</div>
								</div>

								{/* Date Input */}
								<div className="flex-1 px-4 border-b md:border-b-0 md:border-r border-neutral-100 py-3 md:py-2 flex items-center gap-3">
									<div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-600">
										<CalendarIcon className="h-4 w-4" />
									</div>
									<div className="flex flex-col items-start w-full">
										<label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
											Date
										</label>
										<Popover>
											<PopoverTrigger asChild>
												<button
													className={cn(
														'w-full text-left font-medium outline-none text-sm bg-transparent truncate',
														!date ? 'text-neutral-300' : 'text-neutral-900',
													)}
												>
													{date ? format(date, 'PPP') : 'Add dates'}
												</button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={date}
													onSelect={setDate}
													initialFocus
													disabled={(date) =>
														date < new Date(new Date().setHours(0, 0, 0, 0))
													}
												/>
											</PopoverContent>
										</Popover>
									</div>
								</div>

								{/* Type Input */}
								<div className="flex-1 px-4 py-3 md:py-2 flex items-center gap-3">
									<div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-600">
										<Building2 className="h-4 w-4" />
									</div>
									<div className="flex flex-col items-start w-full">
										<label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
											Category
										</label>
										<select
											className="w-full outline-none text-neutral-900 font-medium bg-transparent text-sm appearance-none cursor-pointer capitalize"
											value={filters.categories?.[0] || 'All Categories'}
											onChange={(e) => {
												const val = e.target.value;
												setFilters((prev) => ({
													...prev,
													categories:
														val !== 'All Categories' ? [val] : undefined,
													page: 1,
												}));
											}}
										>
											<option value="All Categories">All Categories</option>
											{Object.values(ListingCategory).map((category) => (
												<option key={category} value={category}>
													{category.toLowerCase().replace('_', ' ')}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="p-2 flex items-stretch">
									<Button
										onClick={handleSearch}
										className="w-full md:w-auto h-full min-h-[48px] px-8 bg-brand-blue hover:bg-brand-blue-hover text-white font-bold rounded-lg shadow-sm"
									>
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
							{meta?.total || 0} Venues found
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
					<div className="hidden lg:block lg:col-span-1 space-y-8 sticky top-28 self-start h-fit overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
						<div className="flex items-center justify-between pointer-events-none opacity-50">
							{/* Placeholder for "Reset all" functionality */}
							<h3 className="font-bold text-neutral-900">Filters</h3>
							<button
								onClick={handleResetFilters}
								className="text-xs font-semibold text-primary-blue hover:underline pointer-events-auto"
							>
								Reset all
							</button>
						</div>

						{/* Main Search Filter */}
						<div className="space-y-3">
							<label className="text-sm font-semibold text-neutral-900">
								Search Term
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
								<Input
									placeholder="e.g. Civic Centre, Beach"
									className="pl-9 bg-white border-neutral-200 text-sm"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
								/>
							</div>
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
									value={locationInput}
									onChange={(e) => setLocationInput(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
									value={filters.minCapacity || ''}
									onChange={(e) => handleCapacityChange('min', e.target.value)}
								/>
								<span className="text-neutral-400">-</span>
								<Input
									placeholder="Max"
									className="bg-white border-neutral-200 text-sm"
									type="number"
									value={filters.maxCapacity || ''}
									onChange={(e) => handleCapacityChange('max', e.target.value)}
								/>
							</div>
						</div>

						{/* Price Range */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<label className="text-sm font-semibold text-neutral-900">
									Max Price (₦)
								</label>
								<div className="text-[10px] font-medium bg-neutral-100 px-2 py-0.5 rounded text-neutral-500">
									₦{priceRange[1].toLocaleString()}
								</div>
							</div>
							<input
								type="range"
								min="0"
								max="10000000"
								step="50000"
								value={priceRange[1]}
								onChange={handlePriceChange}
								onMouseUp={handlePriceMouseUp}
								onTouchEnd={handlePriceMouseUp}
								className="w-full accent-primary-blue h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
							/>
							<div className="flex justify-between text-xs text-neutral-400">
								<span>Min</span>
								<span>Max</span>
							</div>
						</div>

						{/* Categories */}
						<div className="space-y-3">
							<label className="text-sm font-semibold text-neutral-900">
								Categories
							</label>
							<div className="space-y-2.5">
								{Object.values(ListingCategory).map((categoryStr) => (
									<div
										key={categoryStr}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={categoryStr}
											className="border-neutral-300 data-[state=checked]:bg-primary-blue"
											checked={(filters.categories || []).includes(categoryStr)}
											onCheckedChange={() => handleCategoryToggle(categoryStr)}
										/>
										<label
											htmlFor={categoryStr}
											className="text-sm text-neutral-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
										>
											{categoryStr.toLowerCase().replace('_', ' ')}
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
						) : listings.length === 0 ? (
							<EmptyState
								icon={<Building2 className="h-16 w-16 text-neutral-300" />}
								title="No venues found"
								description="Try adjusting your filters or search terms."
							/>
						) : (
							<>
								<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
									{listings.map((listing) => (
										<VenueListingCard key={listing.id} listing={listing} />
									))}
								</div>

								{/* Pagination */}
								{meta && meta.totalPages > 1 && (
									<div className="flex justify-center mt-12 pb-8">
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="icon"
												className="h-10 w-10 text-neutral-400 hover:text-primary-blue border-neutral-200"
												onClick={() => handlePageChange(meta.page - 1)}
												disabled={meta.page <= 1}
											>
												<span className="sr-only">Previous</span>
												&lt;
											</Button>

											{/* Simple pagination generation */}
											{Array.from(
												{ length: Math.min(5, meta.totalPages) },
												(_, i) => {
													let pageNum;
													if (meta.totalPages <= 5) pageNum = i + 1;
													else if (meta.page <= 3) pageNum = i + 1;
													else if (meta.page >= meta.totalPages - 2)
														pageNum = meta.totalPages - 4 + i;
													else pageNum = meta.page - 2 + i;

													return (
														<Button
															key={pageNum}
															variant={
																pageNum === meta.page ? 'default' : 'ghost'
															}
															className={cn(
																'h-10 w-10',
																pageNum === meta.page
																	? 'bg-primary-blue hover:bg-primary-blue-hover text-white font-bold'
																	: 'text-neutral-600 hover:bg-neutral-100',
															)}
															onClick={() => handlePageChange(pageNum)}
														>
															{pageNum}
														</Button>
													);
												},
											)}

											{meta.totalPages > 5 &&
												meta.page < meta.totalPages - 2 && (
													<>
														<span className="text-neutral-400">...</span>
														<Button
															variant="ghost"
															className="h-10 w-10 text-neutral-600 hover:bg-neutral-100"
															onClick={() => handlePageChange(meta.totalPages)}
														>
															{meta.totalPages}
														</Button>
													</>
												)}

											<Button
												variant="outline"
												size="icon"
												className="h-10 w-10 text-neutral-400 hover:text-primary-blue border-neutral-200"
												onClick={() => handlePageChange(meta.page + 1)}
												disabled={meta.page >= meta.totalPages}
											>
												<span className="sr-only">Next</span>
												&gt;
											</Button>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
