import { Button } from '@/components/ui/button';
import { Grid, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageGridProps {
	images: { url: string; alt?: string }[];
	title: string;
}

export function ImageGrid({ images, title }: ImageGridProps) {
	// Use placeholders if fewer than 5 images to keep design consistent
	const placeholderImages = [
		'/images/venue-1.jpg',
		'/images/venue-2.jpg',
		'/images/venue-3.jpg',
		'/images/venue-4.jpg',
		'/images/venue-5.jpg',
	];

	const displayImages = [...images];
	while (displayImages.length < 5) {
		displayImages.push({
			url: placeholderImages[displayImages.length] || placeholderImages[0],
			alt: 'Venue Placeholder',
		});
	}

	return (
		<div className="relative grid gap-2 overflow-hidden rounded-xl md:grid-cols-2 md:h-[400px]">
			{/* Main Large Image */}
			<div className="relative h-[300px] md:h-full w-full">
				<Image
					src={displayImages[0].url}
					alt={displayImages[0].alt || title}
					fill
					className="object-cover"
					priority
				/>
			</div>

			{/* Grid of 4 smaller images (hidden on mobile) */}
			<div className="hidden md:grid grid-cols-2 gap-2">
				{displayImages.slice(1, 5).map((img, i) => (
					<div key={i} className="relative h-full w-full">
						<Image
							src={img.url}
							alt={img.alt || `${title} - ${i + 2}`}
							fill
							className="object-cover"
						/>
					</div>
				))}
			</div>

			<Button
				variant="secondary"
				size="sm"
				className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-black hover:bg-white/90"
			>
				<Grid className="h-4 w-4" />
				Show all photos
			</Button>
		</div>
	);
}
