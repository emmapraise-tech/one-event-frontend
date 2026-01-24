import Link from 'next/link';

interface LogoProps {
	variant?: 'default' | 'transparent' | 'dark';
	className?: string;
}

export function Logo({ variant = 'default', className = '' }: LogoProps) {
	// Default: Used on white backgrounds (e.g., Scrolled Header, Auth pages)
	// Icon: Blue BG, White Text
	// Text: Dark (Neutral-900)
	let iconBg = 'bg-primary-blue';
	let iconColor = 'text-white';
	let textColor = 'text-neutral-900';

	if (variant === 'transparent') {
		// Used on Hero Overlay (e.g., Unscrolled Header)
		// Icon: White BG, Blue Text
		// Text: White
		iconBg = 'bg-white';
		iconColor = 'text-primary-blue';
		textColor = 'text-white';
	} else if (variant === 'dark') {
		// Used on Dark Backgrounds (e.g., Footer)
		// Icon: Blue BG, White Text (Same as default)
		// Text: White
		iconBg = 'bg-primary-blue';
		iconColor = 'text-white';
		textColor = 'text-white';
	}

	return (
		<Link
			href="/"
			className={`flex items-center gap-2 group z-50 ${className}`}
		>
			<div
				className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm ${iconBg}`}
			>
				<span className={`font-bold text-xl ${iconColor}`}>O</span>
			</div>
			<span
				className={`text-xl font-bold tracking-tight transition-colors duration-300 ${textColor}`}
			>
				OneEvent
			</span>
		</Link>
	);
}
