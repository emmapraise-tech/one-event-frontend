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

		if (window.google?.maps?.importLibrary) {
			setIsScriptLoaded(true);
			return;
		}

		if (isLoadingScript) return; // Prevent double load
		setIsLoadingScript(true);

		// Execute Google Maps Inline Bootstrap Loader
		(function (g: any) {
			var h: any, a: any, k: any, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b: any = window;
			b = b[c] || (b[c] = {});
			var d = b.maps || (b.maps = {}), r = new Set(), e = new URLSearchParams(), u = () => h || (h = new Promise(async (f, n) => {
				await (a = m.createElement("script"));
				e.set("libraries", [...Array.from(r)] + "");
				for (k in g) e.set(k.replace(/[A-Z]/g, (t: string) => "_" + t[0].toLowerCase()), g[k]);
				e.set("callback", c + ".maps." + q);
				a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
				d[q] = f;
				a.onerror = () => h = n(Error(p + " could not load."));
				a.nonce = m.querySelector("script[nonce]")?.getAttribute("nonce") || "";
				m.head.append(a);
			}));
			d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f: any, ...n: any[]) => r.add(f) && u().then(() => d[l](f, ...n));
		})({
			key: apiKey,
			v: "weekly"
		});

		setIsScriptLoaded(true);
		setIsLoadingScript(false);
	}, []);

	// Helper for reverse geocoding
	const handleLocationSelect = async (lat: number, lng: number, shouldGeocode: boolean) => {
		updateFormData({ latitude: lat, longitude: lng });

		if (!shouldGeocode) return;

		setIsGeocoding(true);
		const { Geocoder } = await window.google.maps.importLibrary("geocoding");
		const geocoder = new Geocoder();
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

		let isMounted = true;

		const initMapAndMarker = async () => {
			try {
				const { Map } = await window.google.maps.importLibrary("maps");
				const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

				if (!isMounted) return;

				const center = {
					lat: formData.latitude ? Number(formData.latitude) : defaultCenter.lat,
					lng: formData.longitude ? Number(formData.longitude) : defaultCenter.lng,
				};

				// Initialize Map
				const map = new Map(mapContainerRef.current, {
					center: center,
					zoom: formData.latitude && formData.longitude ? 16 : 12,
					mapTypeControl: false,
					streetViewControl: false,
					fullscreenControl: false,
					mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
				});
				mapRef.current = map;

				// Initialize Marker
				const marker = new AdvancedMarkerElement({
					position: center,
					map: map,
					title: 'Venue Location',
					gmpDraggable: true,
				});
				markerRef.current = marker;

				// Listener for marker dragend
				marker.addListener('dragend', () => {
					const pos = marker.position;
					if (pos) {
						const lat = typeof pos.lat === 'function' ? pos.lat() : pos.lat;
						const lng = typeof pos.lng === 'function' ? pos.lng() : pos.lng;
						handleLocationSelect(lat, lng, true);
					}
				});

				// Listener for map click
				map.addListener('click', (e: any) => {
					if (e.latLng) {
						const lat = e.latLng.lat();
						const lng = e.latLng.lng();
						marker.position = { lat, lng };
						handleLocationSelect(lat, lng, true);
					}
				});
			} catch (err) {
				console.error(err);
			}
		};

		initMapAndMarker();

		return () => {
			isMounted = false;
			if (window.google?.maps?.event) {
				if (markerRef.current) window.google.maps.event.clearInstanceListeners(markerRef.current);
				if (mapRef.current) window.google.maps.event.clearInstanceListeners(mapRef.current);
			}
		};
	}, [isScriptLoaded]);

	// Keep map and marker synced with formData coordinates (e.g. from Autocomplete or manual inputs)
	useEffect(() => {
		if (isScriptLoaded && mapRef.current && markerRef.current && formData.latitude && formData.longitude) {
			const currentMarkerPos = markerRef.current.position;
			const formLat = Number(formData.latitude);
			const formLng = Number(formData.longitude);

			if (currentMarkerPos) {
				const curLat = typeof currentMarkerPos.lat === 'function' ? currentMarkerPos.lat() : currentMarkerPos.lat;
				const curLng = typeof currentMarkerPos.lng === 'function' ? currentMarkerPos.lng() : currentMarkerPos.lng;

				if (Math.abs(curLat - formLat) > 0.00001 || Math.abs(curLng - formLng) > 0.00001) {
					const newPos = { lat: formLat, lng: formLng };
					markerRef.current.position = newPos;
					mapRef.current.panTo(newPos);
					mapRef.current.setZoom(16);
				}
			} else {
				const newPos = { lat: formLat, lng: formLng };
				markerRef.current.position = newPos;
				mapRef.current.panTo(newPos);
				mapRef.current.setZoom(16);
			}
		}
	}, [formData.latitude, formData.longitude, isScriptLoaded]);

	// Keep latest updateFormData in a ref so we don't need to add it to useEffect deps and re-initialize autocomplete
	const updateFormDataRef = useRef(updateFormData);
	useEffect(() => {
		updateFormDataRef.current = updateFormData;
	}, [updateFormData]);

	// Initialize Autocomplete
	useEffect(() => {
		if (isScriptLoaded && addressInputRef.current) {
			const parent = addressInputRef.current.parentElement;
			if (!parent || parent.querySelector('gmp-place-autocomplete')) return;

			let isMounted = true;
			let autocomplete: any;
			
			const initAutocomplete = async () => {
				const { PlaceAutocompleteElement } = await window.google.maps.importLibrary("places");
				if (!isMounted) return;

				// Create the PlaceAutocompleteElement
				autocomplete = new PlaceAutocompleteElement({
					componentRestrictions: { country: 'ng' },
				});
				autocomplete.setAttribute('no-input-icon', '');
				autocomplete.setAttribute('no-clear-button', '');
				
				// Style it to match the input
				autocomplete.style.width = '100%';
				
				// Hide the original input and append this
				if (addressInputRef.current) addressInputRef.current.style.display = 'none';
				parent.appendChild(autocomplete);

				// Initialize with existing value
				if (formData.addressLine) {
					autocomplete.inputValue = formData.addressLine;
				}
				
				const handlePlaceSelect = async (e: any) => {
					let place = e.place;
					
					if (e.placePrediction && typeof e.placePrediction.toPlace === 'function') {
						place = e.placePrediction.toPlace();
					} else if (!place && autocomplete.value) {
						place = autocomplete.value;
					}
					
					if (!place) return;
					
					await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'addressComponents'] });

					const lat = typeof place.location?.lat === 'function' ? place.location.lat() : place.location?.lat;
					const lng = typeof place.location?.lng === 'function' ? place.location.lng() : place.location?.lng;

					if (!lat || !lng) return;

					let name = place.displayName || place.name || '';
					if (typeof name === 'object' && name.text) {
						name = name.text;
					}

					const formattedAddress = place.formattedAddress || place.formatted_address || '';
					let addressLineVal = formattedAddress || name || '';

					if (name && formattedAddress && !formattedAddress.toLowerCase().includes(name.toLowerCase())) {
						addressLineVal = `${name}, ${formattedAddress}`;
					}

					let city = '';
					let state = '';
					let zip = '';
					let country = 'Nigeria';

					const components = place.addressComponents || [];
					components.forEach((component: any) => {
						const types = component.types || [];
						const longName = component.longText || component.long_name || '';
						
						if (types.includes('locality') || types.includes('sublocality_level_1') || types.includes('administrative_area_level_2')) {
							city = city || longName;
						}
						if (types.includes('administrative_area_level_1')) {
							state = longName;
						}
						if (types.includes('postal_code')) {
							zip = longName;
						}
						if (types.includes('country')) {
							country = longName;
						}
					});

					updateFormDataRef.current({
						addressLine: addressLineVal,
						city: city || '',
						state: state || '',
						country: country || 'Nigeria',
						zipCode: zip || '',
						latitude: lat,
						longitude: lng,
					});
				};

				autocomplete.addEventListener('gmp-placeselect', handlePlaceSelect);
				autocomplete.addEventListener('gmp-select', handlePlaceSelect);
			};

			initAutocomplete();

			return () => {
				isMounted = false;
				if (autocomplete && parent && autocomplete.parentNode === parent) {
					parent.removeChild(autocomplete);
				}
				if (addressInputRef.current) {
					addressInputRef.current.style.display = '';
				}
			};
		}
	}, [isScriptLoaded]);

	// Sync addressLine to autocomplete input value when it changes externally (e.g. Map click/drag)
	useEffect(() => {
		if (addressInputRef.current) {
			const parent = addressInputRef.current.parentElement;
			const autocomplete = parent?.querySelector('gmp-place-autocomplete') as any;
			if (autocomplete && autocomplete.inputValue !== formData.addressLine) {
				autocomplete.inputValue = formData.addressLine || '';
			}
		}
	}, [formData.addressLine]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onNext();
	};

	const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<style>{`
				gmp-place-autocomplete {
					width: 100%;
					display: block;
					height: 3rem;
					border: 1px solid #e5e7eb;
					border-radius: 0.375rem;
					background-color: transparent;
					box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
					transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
					padding-left: 3rem;
					font-family: inherit;
					color: #111827;
				}
				gmp-place-autocomplete:focus-within {
					border-color: #3b82f6 !important;
					box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
					outline: none;
				}
			`}</style>
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
