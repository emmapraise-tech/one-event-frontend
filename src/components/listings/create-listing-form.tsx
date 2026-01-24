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
import { ListingType } from '@/types/listing';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const listingSchema = z.object({
	type: z.nativeEnum(ListingType),
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().optional(),
	basePrice: z.number().optional(),
	currency: z.string().optional(),
	addressLine: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface CreateListingFormProps {
	onSuccess: () => void;
}

export function CreateListingForm({ onSuccess }: CreateListingFormProps) {
	const router = useRouter();
	const { user } = useAuth();
	const { createListing, isCreating } = useListings();
	const { vendor } = useVendors();

	const form = useForm<ListingFormData>({
		resolver: zodResolver(listingSchema),
		defaultValues: {
			type: ListingType.VENUE,
			title: '',
			slug: '',
			description: '',
			basePrice: undefined,
			currency: 'NGN',
			addressLine: '',
			city: '',
			state: '',
			country: 'Nigeria',
		},
	});

	const onSubmit = (data: ListingFormData) => {
		if (!vendor) {
			alert('Please create a vendor profile first');
			router.push('/dashboard/vendors');
			return;
		}

		createListing(
			{
				...data,
				vendorId: vendor.id,
			},
			{
				onSuccess: () => {
					onSuccess();
				},
			}
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
					id="title" placeholder='Adekite Event Center'
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
				<Input id="slug" placeholder='adekite-event-center' {...form.register('slug')} />
				{form.formState.errors.slug && (
					<p className="text-sm text-destructive">
						{form.formState.errors.slug.message}
					</p>
				)}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="description">Description</Label>
				<Textarea id="description" placeholder='Adekite Event Center is a venue for events' {...form.register('description')} rows={4} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-2">
					<Label htmlFor="basePrice">Base Price</Label>
					<Input
						id="basePrice"
						type="number"
						placeholder='100000'
						step="0.01"
						{...form.register('basePrice', { valueAsNumber: true })}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="currency">Currency</Label>
					<Input id="currency" readOnly {...form.register('currency')} />
				</div>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="addressLine">Address Line</Label>
				<Textarea id="addressLine" placeholder='No. 12 Salvation street, Ikeja' {...form.register('addressLine')} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-2">
					<Label htmlFor="city">City</Label>
					<Input id="city" placeholder='Ikeja' {...form.register('city')} />
				</div>
				<div className="grid gap-2">
					<Label htmlFor="state">State</Label>
					<Input id="state" placeholder='Lagos' {...form.register('state')} />
				</div>
			</div>

			<div className="flex justify-end gap-2">
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
