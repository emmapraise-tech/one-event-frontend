'use client';

import { Button } from '@/components/ui/button';
import { Grid, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { MediaGallery } from './media-gallery';
import { VirtualTourModal } from './virtual-tour-modal';

interface ImageGridProps {
	images: { url: string; alt?: string }[];
	title: string;
}

export function ImageGrid({ images, title }: ImageGridProps) {
	const [showGallery, setShowGallery] = useState(false);
	const [showVirtualTour, setShowVirtualTour] = useState(false);

	// Use placeholders if fewer than 5 images to keep design consistent
	const placeholderImages = [
		'/images/venue-1.jpg',
		'/images/venue-2.jpg',
		'/images/venue-3.jpg',
		'/images/venue-4.jpg',
	];

	const validImages = images?.filter((img) => img && img.url) || [];
	const displayImages = [...validImages];
	while (displayImages.length < 5) {
		displayImages.push({
			url: placeholderImages[displayImages.length % placeholderImages.length],
			alt: 'Venue Placeholder',
		});
	}

	return (
		<>
			<div className="relative grid gap-2 overflow-hidden rounded-xl md:grid-cols-2 md:h-[400px]">
				{/* Main Large Image */}
				<div
					className="relative h-[300px] md:h-full w-full group cursor-pointer"
					onClick={() => setShowGallery(true)}
				>
					<Image
						src={displayImages[0].url}
						alt={displayImages[0].alt || title}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						priority
					/>
					<div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

					{/* Virtual Tour Button */}
					<Button
						onClick={(e) => {
							e.stopPropagation();
							setShowVirtualTour(true);
						}}
						className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm border-none shadow-lg gap-2 font-bold z-10 rounded-full"
					>
						<PlayCircle className="h-4 w-4 text-brand-gold" />
						360° Virtual Tour
					</Button>
				</div>

				{/* Grid of 4 smaller images (hidden on mobile) */}
				<div className="hidden md:grid grid-cols-2 gap-2">
					{displayImages.slice(1, 5).map((img, i) => (
						<div
							key={i}
							className="relative h-full w-full group cursor-pointer overflow-hidden"
							onClick={() => setShowGallery(true)}
						>
							<Image
								src={img.url}
								alt={img.alt || `${title} - ${i + 2}`}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
						</div>
					))}
				</div>

				<Button
					variant="secondary"
					size="sm"
					className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-black hover:bg-neutral-100 shadow-lg font-semibold px-4 py-5 rounded-lg z-10"
					onClick={() => setShowGallery(true)}
				>
					<Grid className="h-4 w-4" />
					Show all photos
				</Button>
			</div>

			<MediaGallery
				isOpen={showGallery}
				onClose={() => setShowGallery(false)}
				images={displayImages}
				title={title}
			/>

			<VirtualTourModal
				isOpen={showVirtualTour}
				onClose={() => setShowVirtualTour(false)}
				title={title}
			/>
		</>
	);
}
