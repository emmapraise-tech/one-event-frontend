'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { useVendors } from '@/hooks/useVendors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useFieldArray } from 'react-hook-form';
import { AMENITY_MAP } from '@/constants/amenities';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Plus,
	Trash2,
	X,
	Upload,
	Image as ImageIcon,
	Loader2,
} from 'lucide-react';
import { ListingCategory, ListingType, ListingFormData } from '@/types/listing';
import { useState } from 'react';

const listingSchema = z.object({
	type: z.nativeEnum(ListingType),
	categories: z
		.array(z.nativeEnum(ListingCategory))
		.min(1, 'Select at least one category'),
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().optional(),
	basePrice: z.number().optional(),
	currency: z.string().optional(),
	addressLine: z.string().min(1, 'Address is required'),
	city: z.string().min(1, 'City is required'),
	state: z.string().min(1, 'State is required'),
	zipCode: z.string().min(1, 'Zip code is required'),
	country: z.string().default('Nigeria'),

	// Specs
	priceStrategy: z.enum(['daily', 'weekday_weekend']),
	weekdayPrice: z.number().optional(),
	weekendPrice: z.number().optional(),
	seatedCapacity: z.number().min(1, 'Capacity must be at least 1'),
	totalArea: z.number().min(1, 'Area must be at least 1').optional(),
	parkingCap: z
		.number()
		.min(1, 'Parking capacity must be at least 1')
		.optional(),
	hasIndoor: z.boolean().default(true),
	hasOutdoor: z.boolean().default(false),
	amenities: z.array(z.string()).default([]),

	// Add-ons
	addOns: z
		.array(
			z.object({
				name: z.string().min(1, 'Name is required'),
				price: z.number().min(0, 'Price must be 0 or more'),
			}),
		)
		.default([]),

	// Media
	imageUrls: z.array(z.string()).default([]),
	imageFiles: z.array(z.any()).default([]),
});

// Using imported ListingFormData from '@/types/listing'

interface CreateListingFormProps {
	onSuccess: () => void;
}

export function CreateListingForm({ onSuccess }: CreateListingFormProps) {
	const router = useRouter();
	const { user } = useAuth();
	const { createListing, isCreating } = useListings();
	const { vendor } = useVendors();

	const form = useForm({
		resolver: zodResolver(listingSchema),
		defaultValues: {
			type: ListingType.VENUE,
			categories: [ListingCategory.WEDDING],
			title: '',
			slug: '',
			description: '',
			priceStrategy: 'daily',
			basePrice: undefined,
			weekdayPrice: undefined,
			weekendPrice: undefined,
			currency: 'NGN',
			addressLine: '',
			city: '',
			state: '',
			zipCode: '',
			country: 'Nigeria',
			seatedCapacity: undefined,
			totalArea: undefined,
			parkingCap: undefined,
			hasIndoor: true,
			hasOutdoor: false,
			amenities: [],
			addOns: [],
			imageUrls: [],
			imageFiles: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		name: 'addOns',
		control: form.control,
	});

	const [imagePreviews, setImagePreviews] = useState<string[]>([]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length > 0) {
			const currentFiles = form.getValues('imageFiles') || [];
			form.setValue('imageFiles', [...currentFiles, ...files]);

			const newPreviews = files.map((file) => URL.createObjectURL(file));
			setImagePreviews((prev) => [...prev, ...newPreviews]);
		}
	};

	const removeImage = (index: number) => {
		const currentFiles = form.getValues('imageFiles') || [];
		const newFiles = [...currentFiles];
		newFiles.splice(index, 1);
		form.setValue('imageFiles', newFiles);

		const newPreviews = [...imagePreviews];
		newPreviews.splice(index, 1);
		setImagePreviews(newPreviews);
	};

	const onSubmit = (data: z.infer<typeof listingSchema>) => {
		if (!vendor) {
			alert('Please create a vendor profile first');
			router.push('/dashboard/vendors');
			return;
		}

		createListing(
			{
				data: data as any,
				vendorId: vendor.id,
			},
			{
				onSuccess: () => {
					onSuccess();
				},
			},
		);
	};

	// Generate slug from title
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;
		const slug = title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
		form.setValue('slug', slug);
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<div className="grid gap-2">
				<Label htmlFor="type">Listing Type</Label>
				<Select
					value={form.watch('type')}
					onValueChange={(value) => form.setValue('type', value as ListingType)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select type" />
					</SelectTrigger>
					<SelectContent>
						{Object.values(ListingType).map((type) => (
							<SelectItem key={type} value={type}>
								{type}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					placeholder="Adekite Event Center"
					{...form.register('title')}
					onChange={(e) => {
						form.register('title').onChange(e);
						handleTitleChange(e);
					}}
				/>
				{form.formState.errors.title && (
					<p className="text-sm text-destructive">
						{form.formState.errors.title.message}
					</p>
				)}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="slug">Slug (URL-friendly identifier)</Label>
				<Input
					id="slug"
					placeholder="adekite-event-center"
					{...form.register('slug')}
				/>
				{form.formState.errors.slug && (
					<p className="text-sm text-destructive">
						{form.formState.errors.slug.message}
					</p>
				)}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="addressLine">Address Line</Label>
				<Textarea
					id="addressLine"
					placeholder="No. 12 Salvation street, Ikeja"
					{...form.register('addressLine')}
				/>
				{form.formState.errors.addressLine && (
					<p className="text-sm text-destructive">
						{form.formState.errors.addressLine.message}
					</p>
				)}
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				<div className="grid gap-2">
					<Label htmlFor="city">City</Label>
					<Input id="city" placeholder="Ikeja" {...form.register('city')} />
					{form.formState.errors.city && (
						<p className="text-sm text-destructive">
							{form.formState.errors.city.message}
						</p>
					)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="state">State</Label>
					<Input id="state" placeholder="Lagos" {...form.register('state')} />
					{form.formState.errors.state && (
						<p className="text-sm text-destructive">
							{form.formState.errors.state.message}
						</p>
					)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="zipCode">Zip Code</Label>
					<Input
						id="zipCode"
						placeholder="100001"
						{...form.register('zipCode')}
					/>
					{form.formState.errors.zipCode && (
						<p className="text-sm text-destructive">
							{form.formState.errors.zipCode.message}
						</p>
					)}
				</div>
			</div>

			<div className="grid gap-2">
				<Label>Event Categories (Multi-select)</Label>
				<div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-neutral-50/50">
					{Object.values(ListingCategory).map((cat) => (
						<div
							key={cat}
							className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border shadow-sm"
						>
							<Checkbox
								id={`cat-${cat}`}
								checked={form.watch('categories')?.includes(cat)}
								onCheckedChange={(checked) => {
									const current = form.getValues('categories') || [];
									if (checked) {
										form.setValue('categories', [...current, cat]);
									} else {
										form.setValue(
											'categories',
											current.filter((c) => c !== cat),
										);
									}
								}}
							/>
							<Label
								htmlFor={`cat-${cat}`}
								className="text-xs font-medium cursor-pointer"
							>
								{cat}
							</Label>
						</div>
					))}
				</div>
				{form.formState.errors.categories && (
					<p className="text-sm text-destructive">
						{form.formState.errors.categories.message}
					</p>
				)}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					placeholder="Adekite Event Center is a venue for events"
					{...form.register('description')}
					rows={4}
				/>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-2">
					<Label htmlFor="basePrice">Base Price</Label>
					<Input
						id="basePrice"
						type="number"
						placeholder="100000"
						step="0.01"
						{...form.register('basePrice', { valueAsNumber: true })}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="currency">Currency</Label>
					<Input id="currency" readOnly {...form.register('currency')} />
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				<div className="grid gap-2">
					<Label htmlFor="seatedCapacity">Seated Capacity *</Label>
					<Input
						id="seatedCapacity"
						type="number"
						placeholder="500"
						{...form.register('seatedCapacity', { valueAsNumber: true })}
					/>
					{form.formState.errors.seatedCapacity && (
						<p className="text-sm text-destructive">
							{form.formState.errors.seatedCapacity.message}
						</p>
					)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="totalArea">Total Area (sq ft)</Label>
					<Input
						id="totalArea"
						type="number"
						placeholder="2500"
						{...form.register('totalArea', { valueAsNumber: true })}
					/>
					{form.formState.errors.totalArea && (
						<p className="text-sm text-destructive">
							{form.formState.errors.totalArea.message}
						</p>
					)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="parkingCap">Parking Capacity</Label>
					<Input
						id="parkingCap"
						type="number"
						placeholder="50"
						{...form.register('parkingCap', { valueAsNumber: true })}
					/>
					{form.formState.errors.parkingCap && (
						<p className="text-sm text-destructive">
							{form.formState.errors.parkingCap.message}
						</p>
					)}
				</div>
			</div>
			<div className="space-y-3">
				<Label>Venue Setting</Label>
				<div className="flex gap-6 p-4 border rounded-lg bg-neutral-50/50">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="hasIndoor"
							checked={form.watch('hasIndoor')}
							onCheckedChange={(checked) =>
								form.setValue('hasIndoor', !!checked)
							}
						/>
						<Label
							htmlFor="hasIndoor"
							className="text-sm font-normal cursor-pointer"
						>
							Indoor Space
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="hasOutdoor"
							checked={form.watch('hasOutdoor')}
							onCheckedChange={(checked) =>
								form.setValue('hasOutdoor', !!checked)
							}
						/>
						<Label
							htmlFor="hasOutdoor"
							className="text-sm font-normal cursor-pointer"
						>
							Outdoor Space
						</Label>
					</div>
				</div>
			</div>
			<div className="space-y-3">
				<Label>Amenities</Label>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-neutral-50/50">
					{Object.entries(AMENITY_MAP).map(([slug, config]) => (
						<div key={slug} className="flex items-center space-x-2">
							<Checkbox
								id={`amenity-${slug}`}
								checked={form.watch('amenities')?.includes(slug)}
								onCheckedChange={(checked) => {
									const current = form.getValues('amenities') || [];
									if (checked) {
										form.setValue('amenities', [...current, slug]);
									} else {
										form.setValue(
											'amenities',
											current.filter((s) => s !== slug),
										);
									}
								}}
							/>
							<Label
								htmlFor={`amenity-${slug}`}
								className="text-sm font-normal cursor-pointer flex items-center gap-2"
							>
								{config.icon}
								{config.label}
							</Label>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Add-ons</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => append({ name: '', price: 0 })}
						className="gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Service
					</Button>
				</div>
				<div className="space-y-2">
					{fields.map((field, index) => (
						<div
							key={field.id}
							className="flex gap-4 items-start bg-neutral-50 p-3 rounded-lg border border-neutral-100"
						>
							<div className="grid gap-1 flex-1">
								<Input
									placeholder="e.g., Security Team"
									{...form.register(`addOns.${index}.name` as const)}
									className="bg-white"
								/>
							</div>
							<div className="grid gap-1 w-32">
								<Input
									type="number"
									placeholder="Price"
									{...form.register(`addOns.${index}.price` as const, {
										valueAsNumber: true,
									})}
									className="bg-white"
								/>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => remove(index)}
								className="text-destructive hover:text-destructive hover:bg-destructive/10"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
					{fields.length === 0 && (
						<p className="text-sm text-neutral-500 italic text-center py-4 bg-neutral-50 rounded-lg border border-dashed">
							No add-ons added yet.
						</p>
					)}
				</div>
			</div>

			<div className="space-y-4">
				<Label>Images</Label>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					{imagePreviews.map((preview, index) => (
						<div
							key={index}
							className="relative aspect-square rounded-lg overflow-hidden border bg-neutral-100 group"
						>
							<img
								src={preview}
								alt="Preview"
								className="w-full h-full object-cover"
							/>
							<button
								type="button"
								onClick={() => removeImage(index)}
								className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<X className="h-3 w-3" />
							</button>
						</div>
					))}
					<label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-neutral-200 hover:border-brand-blue cursor-pointer transition-colors bg-white hover:bg-neutral-50">
						<Upload className="h-6 w-6 text-neutral-400 mb-2" />
						<span className="text-xs text-neutral-500 font-medium">
							Upload Image
						</span>
						<input
							type="file"
							multiple
							accept="image/*"
							className="hidden"
							onChange={handleImageChange}
						/>
					</label>
				</div>
			</div>

			<div className="flex justify-end gap-2 pt-6">
				<Button type="submit" disabled={isCreating}>
					{isCreating ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Creating...
						</>
					) : (
						'Create Listing'
					)}
				</Button>
			</div>
		</form>
	);
}
