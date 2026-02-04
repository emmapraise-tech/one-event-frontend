import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { ListingFormData } from '@/types/listing';

interface StepProps {
	formData: ListingFormData;
	updateFormData: (data: Partial<ListingFormData>) => void;
	onNext: () => void;
	onBack: () => void;
	isFirstStep: boolean;
	isLastStep: boolean;
}

// Ensure global type definition or ignore for window.google
declare global {
	interface Window {
		google: any;
		initMap?: () => void;
	}
}

export function LocationStep({
	formData,
	updateFormData,
	onNext,
	onBack,
}: StepProps) {
	const addressInputRef = useRef<HTMLInputElement>(null);
	const [isScriptLoaded, setIsScriptLoaded] = useState(false);
	const [isLoadingScript, setIsLoadingScript] = useState(false);

	// Load Google Maps Script
	useEffect(() => {
		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

		if (!apiKey) {
			console.warn(
				'PricingStep: Google Maps API Key is missing. Autocomplete will not work.',
			);
			return;
		}

		if (window.google?.maps?.places) {
			setIsScriptLoaded(true);
			return;
		}

		if (isLoadingScript) return; // Prevent double load

		setIsLoadingScript(true);
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
		script.async = true;
		script.defer = true;

		// Define callback
		window.initMap = () => {
			setIsScriptLoaded(true);
			setIsLoadingScript(false);
		};

		document.head.appendChild(script);

		return () => {
			// Cleanup if needed, though usually we keep map script
		};
	}, []);

	// Initialize Autocomplete
	useEffect(() => {
		if (isScriptLoaded && addressInputRef.current) {
			const autocomplete = new window.google.maps.places.Autocomplete(
				addressInputRef.current,
				{
					types: ['address'],
					componentRestrictions: { country: 'ng' }, // Prioritize/Limit to Nigeria as per context? Or leave open. 'ng' based on Lagos default.
					fields: ['address_components', 'geometry', 'formatted_address'],
				},
			);

			autocomplete.addListener('place_changed', () => {
				const place = autocomplete.getPlace();
				if (!place.geometry) return;

				const addressComponents = place.address_components;
				let streetAddress = '';
				let city = '';
				let state = '';
				let zip = '';
				let country = '';

				if (place.formatted_address) {
					streetAddress = place.formatted_address.split(',')[0]; // Simpleheuristic, or parse route + street_number
				}

				addressComponents.forEach((component: any) => {
					const types = component.types;
					if (types.includes('locality')) {
						city = component.long_name;
					}
					if (types.includes('administrative_area_level_1')) {
						state = component.long_name;
					}
					if (types.includes('postal_code')) {
						zip = component.long_name;
					}
					if (types.includes('country')) {
						country = component.long_name;
					}
				});

				updateFormData({
					addressLine: streetAddress || place.formatted_address,
					city,
					state,
					country,
					// You might want to store lat/lng too if you added them to formData
				});
			});
		}
	}, [isScriptLoaded, updateFormData]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onNext();
	};

	// Construct map query based on form data or default to Lagos
	const addressQuery = [
		formData.addressLine,
		formData.city,
		formData.state,
		formData.country || 'Nigeria',
	]
		.filter(Boolean)
		.join(', ');

	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

	// Use OFFICIAL Embed API if key is present (Fixes "Can't load correctly" error)
	// Fallback to legacy "search" iframe if no key (May be rate limited)
	const mapSrc = apiKey
		? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(addressQuery || 'Lagos, Nigeria')}`
		: addressQuery
			? `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
			: 'https://maps.google.com/maps?q=Lagos,%20Nigeria&t=&z=13&ie=UTF8&iwloc=&output=embed';

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="flex items-center gap-2 mb-6">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
					<MapPin className="h-5 w-5" />
				</div>
				<h2 className="text-lg font-semibold">Location</h2>
			</div>

			<div className="space-y-6">
				<div className="grid gap-3">
					<Label
						htmlFor="address"
						className="text-base font-medium text-gray-700"
					>
						Street Address
					</Label>
					<div className="relative">
						<MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
						<Input
							id="address"
							ref={addressInputRef}
							placeholder={
								isScriptLoaded
									? 'Search address on Google...'
									: 'Enter street address'
							}
							className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base shadow-sm"
							value={formData.addressLine}
							onChange={(e) => updateFormData({ addressLine: e.target.value })}
						/>
						{isLoadingScript && (
							<div className="absolute right-4 top-3.5">
								<Loader2 className="h-5 w-5 animate-spin text-gray-400" />
							</div>
						)}
					</div>
					{!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
						<p className="text-xs text-amber-600">
							* Google Maps API Key missing in environment settings.
							Autocomplete disabled.
						</p>
					)}
				</div>

				{/* Map Placeholder */}
				<div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50 group">
					<div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
						<iframe
							src={mapSrc}
							width="100%"
							height="100%"
							style={{ border: 0, opacity: 0.9 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							className="transition-all duration-500"
						></iframe>
					</div>
					{/* Interactive overlay only if address is missing, otherwise let user interact with map (albeit limited in embed) */}
					{!formData.addressLine && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 text-sm font-medium text-gray-600">
								Enter an address to update map
							</div>
						</div>
					)}
				</div>

				<div className="grid gap-6 sm:grid-cols-3">
					<div className="grid gap-3">
						<Label
							htmlFor="city"
							className="text-base font-medium text-gray-700"
						>
							City
						</Label>
						<Input
							id="city"
							placeholder="City"
							value={formData.city}
							onChange={(e) => updateFormData({ city: e.target.value })}
							className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
						/>
					</div>
					<div className="grid gap-3">
						<Label
							htmlFor="state"
							className="text-base font-medium text-gray-700"
						>
							State/Province
						</Label>
						<Input
							id="state"
							placeholder="State"
							value={formData.state}
							onChange={(e) => updateFormData({ state: e.target.value })}
							className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
						/>
					</div>
					<div className="grid gap-3">
						<Label
							htmlFor="zip"
							className="text-base font-medium text-gray-700"
						>
							Zip Code
						</Label>
						<Input
							id="zip"
							placeholder="Zip Code"
							value={formData.zipCode || ''}
							onChange={(e) => updateFormData({ zipCode: e.target.value })}
							className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
						/>
					</div>
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<Button type="button" variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button
					type="submit"
					className="bg-brand-gold hover:bg-brand-gold-hover text-white w-full sm:w-auto font-bold shadow-sm"
				>
					Continue
				</Button>
			</div>
		</form>
	);
}
