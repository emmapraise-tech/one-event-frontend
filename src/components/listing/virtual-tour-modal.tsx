import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VirtualTourModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
}

export function VirtualTourModal({
	isOpen,
	onClose,
	title,
}: VirtualTourModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogPortal>
				<DialogOverlay className="bg-black/95 z-100" />
				<DialogContent className="max-w-7xl w-[95vw] h-[85vh] bg-black border-neutral-800 p-0 overflow-hidden flex flex-col z-100 [&>button]:hidden shadow-2xl rounded-3xl">
					<DialogTitle className="sr-only">
						360 Virtual Tour for {title}
					</DialogTitle>

					<div className="flex items-center justify-between px-6 py-4 bg-linear-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10 pointer-events-none">
						<h3 className="text-white font-bold text-lg pointer-events-auto shadow-sm">
							{title} - 360° Tour
						</h3>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="text-white hover:bg-white/20 rounded-full pointer-events-auto h-10 w-10 bg-black/40 backdrop-blur-md"
						>
							<X className="h-5 w-5" />
						</Button>
					</div>

					<div className="w-full h-full relative">
						<iframe
							src="https://www.youtube.com/embed/BEu9U8V8ZzE?autoplay=1&mute=1&rel=0"
							title={`360 Virtual Tour of ${title}`}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking; vr"
							allowFullScreen
							className="w-full h-full border-0"
						></iframe>
					</div>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
