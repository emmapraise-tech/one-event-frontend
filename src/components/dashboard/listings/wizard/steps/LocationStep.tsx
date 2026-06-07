import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { ListingFormData, ListingType } from '@/types/listing';

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
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const markerRef = useRef<any>(null);
	const [isScriptLoaded, setIsScriptLoaded] = useState(false);
	const [isLoadingScript, setIsLoadingScript] = useState(false);
	const [isGeocoding, setIsGeocoding] = useState(false);

	const defaultCenter = { lat: 6.5244, lng: 3.3792 }; // Lagos, Nigeria

	// Load Google Maps Script
	useEffect(() => {
		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

		if (!apiKey) {
			console.warn(
				'LocationStep: Google Maps API Key is missing. Autocomplete and Maps will not load.',
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
		script.onerror = () => {
			console.error('Google Maps script failed to load');
			setIsLoadingScript(false);
		};

		// Define callback
		window.initMap = () => {
			setIsScriptLoaded(true);
			setIsLoadingScript(false);
		};

		document.head.appendChild(script);

		return () => {
			// Cleanup if needed
		};
	}, []);

	// Helper for reverse geocoding
	const handleLocationSelect = (lat: number, lng: number, shouldGeocode: boolean) => {
		updateFormData({ latitude: lat, longitude: lng });

		if (!shouldGeocode) return;

		setIsGeocoding(true);
		const geocoder = new window.google.maps.Geocoder();
		geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
			setIsGeocoding(false);
			if (status === 'OK' && results && results[0]) {
				const result = results[0];
				const addressComponents = result.address_components;
				let streetAddress = '';
				let city = '';
				let state = '';
				let zip = '';
				let country = '';

				streetAddress = result.formatted_address.split(',')[0]; // fallback

				let streetNum = '';
				let routeName = '';

				addressComponents.forEach((component: any) => {
					const types = component.types;
					if (types.includes('street_number')) {
						streetNum = component.long_name;
					}
					if (types.includes('route')) {
						routeName = component.long_name;
					}
					if (
						types.includes('locality') ||
						types.includes('sublocality_level_1') ||
						types.includes('administrative_area_level_2')
					) {
						city = city || component.long_name;
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

				if (streetNum && routeName) {
					streetAddress = `${streetNum} ${routeName}`;
				} else if (routeName) {
					streetAddress = routeName;
				}

				updateFormData({
					addressLine: result.formatted_address,
					city: city || '',
					state: state || '',
					country: country || 'Nigeria',
					zipCode: zip || '',
					latitude: lat,
					longitude: lng,
				});
			} else {
				console.error('Geocoder failed due to: ' + status);
			}
		});
	};

	// Initialize Map and Draggable Marker
	useEffect(() => {
		if (!isScriptLoaded || !mapContainerRef.current) return;

		const center = {
			lat: formData.latitude ? Number(formData.latitude) : defaultCenter.lat,
			lng: formData.longitude ? Number(formData.longitude) : defaultCenter.lng,
		};

		// Initialize Map
		const map = new window.google.maps.Map(mapContainerRef.current, {
			center: center,
			zoom: formData.latitude && formData.longitude ? 16 : 12,
			mapTypeControl: false,
			streetViewControl: false,
			fullscreenControl: false,
		});
		mapRef.current = map;

		// Initialize Marker
		const marker = new window.google.maps.Marker({
			position: center,
			map: map,
			draggable: true,
			title: 'Venue Location',
			animation: window.google.maps.Animation.DROP,
		});
		markerRef.current = marker;

		// Listener for marker dragend
		marker.addListener('dragend', () => {
			const pos = marker.getPosition();
			if (pos) {
				handleLocationSelect(pos.lat(), pos.lng(), true);
			}
		});

		// Listener for map click
		map.addListener('click', (e: any) => {
			if (e.latLng) {
				const lat = e.latLng.lat();
				const lng = e.latLng.lng();
				marker.setPosition({ lat, lng });
				handleLocationSelect(lat, lng, true);
			}
		});

		return () => {
			if (window.google?.maps?.event) {
				if (marker) window.google.maps.event.clearInstanceListeners(marker);
				if (map) window.google.maps.event.clearInstanceListeners(map);
			}
		};
	}, [isScriptLoaded]);

	// Keep map and marker synced with formData coordinates (e.g. from Autocomplete or manual inputs)
	useEffect(() => {
		if (isScriptLoaded && mapRef.current && markerRef.current && formData.latitude && formData.longitude) {
			const currentMarkerPos = markerRef.current.getPosition();
			const formLat = Number(formData.latitude);
			const formLng = Number(formData.longitude);

			if (
				!currentMarkerPos ||
				Math.abs(currentMarkerPos.lat() - formLat) > 0.00001 ||
				Math.abs(currentMarkerPos.lng() - formLng) > 0.00001
			) {
				const newPos = { lat: formLat, lng: formLng };
				markerRef.current.setPosition(newPos);
				mapRef.current.panTo(newPos);
				mapRef.current.setZoom(16);
			}
		}
	}, [formData.latitude, formData.longitude, isScriptLoaded]);

	// Initialize Autocomplete
	useEffect(() => {
		if (isScriptLoaded && addressInputRef.current) {
			const autocomplete = new window.google.maps.places.Autocomplete(
				addressInputRef.current,
				{
					componentRestrictions: { country: 'ng' },
					fields: ['name', 'address_components', 'geometry', 'formatted_address'],
				},
			);

			autocomplete.addListener('place_changed', () => {
				const place = autocomplete.getPlace();
				if (!place.geometry || !place.geometry.location) return;

				const lat = place.geometry.location.lat();
				const lng = place.geometry.location.lng();

				const addressComponents = place.address_components;
				let streetAddress = '';
				let city = '';
				let state = '';
				let zip = '';
				let country = '';

				let streetNum = '';
				let routeName = '';

				addressComponents.forEach((component: any) => {
					const types = component.types;
					if (types.includes('street_number')) {
						streetNum = component.long_name;
					}
					if (types.includes('route')) {
						routeName = component.long_name;
					}
					if (
						types.includes('locality') ||
						types.includes('sublocality_level_1') ||
						types.includes('administrative_area_level_2')
					) {
						city = city || component.long_name;
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

				const name = place.name;
				const formattedAddress = place.formatted_address || '';
				let addressLineVal = '';

				if (name && formattedAddress) {
					if (formattedAddress.toLowerCase().includes(name.toLowerCase())) {
						addressLineVal = formattedAddress;
					} else {
						addressLineVal = `${name}, ${formattedAddress}`;
					}
				} else {
					addressLineVal = formattedAddress || name || '';
				}

				updateFormData({
					addressLine: addressLineVal,
					city: city || '',
					state: state || '',
					country: country || 'Nigeria',
					zipCode: zip || '',
					latitude: lat,
					longitude: lng,
				});
			});
		}
	}, [isScriptLoaded, updateFormData]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onNext();
	};

	const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="flex items-center gap-2 mb-6">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
					<MapPin className="h-5 w-5" />
				</div>
				<h2 className="text-lg font-semibold">
					{formData.type === ListingType.VENUE
						? 'Location'
						: 'Base Location & Coverage'}
				</h2>
			</div>

			<div className="space-y-6">
				{formData.type === ListingType.VENUE && (
					<div className="grid gap-3">
						<Label
							htmlFor="address"
							className="text-base font-medium text-gray-700"
						>
							Street Address
						</Label>
						<div className="relative">
							<MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 font-semibold" />
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
								onChange={(e) =>
									updateFormData({ addressLine: e.target.value })
								}
							/>
							{(isLoadingScript || isGeocoding) && (
								<div className="absolute right-4 top-3.5">
									<Loader2 className="h-5 w-5 animate-spin text-blue-500" />
								</div>
							)}
						</div>
						{!hasApiKey && (
							<p className="text-xs text-amber-600">
								* Google Maps API Key missing in environment settings.
								Autocomplete and maps disabled.
							</p>
						)}
					</div>
				)}

				{/* Interactive Google Map */}
				{formData.type === ListingType.VENUE && (
					<div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50 group">
						{isScriptLoaded ? (
							<div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '320px' }} />
						) : (
							<div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/50">
								<Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
								<p className="text-sm text-gray-500 font-medium">Loading Google Map...</p>
							</div>
						)}

						{/* Geocoding Loading overlay */}
						{isGeocoding && (
							<div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center transition-all duration-300 z-10">
								<Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
								<span className="text-sm font-semibold text-gray-700">Pinpointing location details...</span>
							</div>
						)}

						{/* Quick Tips Badge */}
						{isScriptLoaded && (
							<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-gray-200 text-xs font-semibold text-gray-600 pointer-events-none z-10 flex items-center gap-1.5">
								<MapPin className="h-3.5 w-3.5 text-blue-600" />
								Drag the pin or click the map to select
							</div>
						)}
					</div>
				)}

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
					{formData.type === ListingType.VENUE && (
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
					)}
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<Button type="button" variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button
					type="submit"
				>
					Continue
				</Button>
			</div>
		</form>
	);
}
