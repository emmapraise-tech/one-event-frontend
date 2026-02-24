import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
} from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MediaGalleryProps {
	isOpen: boolean;
	onClose: () => void;
	images: { url: string; alt?: string }[];
	title: string;
}

export function MediaGallery({
	isOpen,
	onClose,
	images,
	title,
}: MediaGalleryProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	if (!images || images.length === 0) return null;

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogPortal>
				<DialogOverlay className="bg-black/95 z-100" />
				<DialogContent className="max-w-none w-screen h-dvh bg-transparent border-none p-0 flex flex-col justify-center items-center z-100 focus:outline-none shadow-none [&>button]:hidden">
					<DialogTitle className="sr-only">
						Media Gallery for {title}
					</DialogTitle>

					{/* Close button */}
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full h-12 w-12 z-110"
					>
						<X className="h-6 w-6" />
					</Button>

					{/* Navigation buttons */}
					{images.length > 1 && (
						<>
							<Button
								variant="ghost"
								size="icon"
								onClick={handlePrevious}
								className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-14 w-14 z-110 hidden md:flex"
							>
								<ChevronLeft
									className="h-10 w-10 text-white"
									strokeWidth={1.5}
								/>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleNext}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-14 w-14 z-110 hidden md:flex"
							>
								<ChevronRight
									className="h-10 w-10 text-white"
									strokeWidth={1.5}
								/>
							</Button>
						</>
					)}

					{/* Top Header - Image Counter */}
					<div className="absolute top-6 left-6 text-white/70 text-sm font-bold tracking-widest uppercase z-110">
						{currentIndex + 1} / {images.length}
					</div>

					{/* Main Image */}
					<div className="relative w-full max-w-6xl h-[65vh] md:h-[80vh] flex items-center justify-center p-4">
						<div className="relative w-full h-full flex items-center justify-center">
							<Image
								src={images[currentIndex].url}
								alt={
									images[currentIndex].alt ||
									`${title} image ${currentIndex + 1}`
								}
								fill
								className="object-contain"
								priority
							/>
						</div>
					</div>

					{/* Thumbnail strip */}
					{images.length > 1 && (
						<div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide max-w-full z-110">
							{images.map((img, idx) => (
								<button
									key={idx}
									onClick={() => setCurrentIndex(idx)}
									className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden transition-all ${
										idx === currentIndex
											? 'ring-2 ring-white opacity-100 scale-105'
											: 'opacity-40 hover:opacity-100 hover:scale-105'
									}`}
								>
									<Image
										src={img.url}
										alt={`Thumbnail ${idx + 1}`}
										fill
										className="object-cover"
									/>
								</button>
							))}
						</div>
					)}
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
