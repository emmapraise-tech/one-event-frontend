import { Button } from '@/components/ui/button';
import { Grid, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageGridProps {
	images: { url: string; alt?: string }[];
	title: string;
}

export function ImageGrid({ images, title }: ImageGridProps) {
	// Use placeholder if no images
	const displayImages =
		images.length > 0
			? images
			: Array(5).fill({ url: '/images/venue-1.jpg', alt: 'Venue Image' });

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
			<div className="hidden grid-cols-2 gap-2 md:grid">
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
				{/* If fewer than 5 images, fill with placeholders or hide logic could be added here, 
             but for now assuming we get at least 1 and duplicating for design fidelity if needed is a safe fallback above */}
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
