import {
	Zap,
	Utensils,
	ShieldCheck,
	Wifi,
	Car,
	Wind,
	Volume2,
	Tv,
	Users,
	Wine,
	Sun,
	Accessibility,
	Home,
	CigaretteOff,
	Camera,
	Music,
} from 'lucide-react';
import { ReactNode } from 'react';

export interface AmenityConfig {
	label: string;
	icon: ReactNode;
}

export const AMENITY_MAP: Record<string, AmenityConfig> = {
	POWER_247: {
		label: '24/7 Power Supply',
		icon: <Zap className="h-5 w-5" />,
	},
	KITCHEN: {
		label: 'Commercial Kitchen',
		icon: <Utensils className="h-5 w-5" />,
	},
	SECURITY: {
		label: 'Security Team',
		icon: <ShieldCheck className="h-5 w-5" />,
	},
	WIFI: {
		label: 'High-Speed Wifi',
		icon: <Wifi className="h-5 w-5" />,
	},
	PARKING: {
		label: 'Secure Parking',
		icon: <Car className="h-5 w-5" />,
	},
	AC: {
		label: 'Air Conditioning',
		icon: <Wind className="h-5 w-5" />,
	},
	SOUND_SYSTEM: {
		label: 'In-built Sound System',
		icon: <Volume2 className="h-5 w-5" />,
	},
	AV_EQUIPMENT: {
		label: 'AV / Projector',
		icon: <Tv className="h-5 w-5" />,
	},
	CHANGING_ROOM: {
		label: 'Changing Room / Bridal Suite',
		icon: <Home className="h-5 w-5" />,
	},
	RESTROOMS: {
		label: 'Clean Restrooms',
		icon: <Users className="h-5 w-5" />,
	},
	BAR_AREA: {
		label: 'Bar / Lounge Area',
		icon: <Wine className="h-5 w-5" />,
	},
	OUTDOOR_SPACE: {
		label: 'Outdoor / Garden Space',
		icon: <Sun className="h-5 w-5" />,
	},
	ACCESSIBILITY: {
		label: 'Wheelchair Accessible',
		icon: <Accessibility className="h-5 w-5" />,
	},
	SMOKE_FREE: {
		label: 'Smoke-Free Environment',
		icon: <CigaretteOff className="h-5 w-5" />,
	},
	PHOTOGRAPHY_READY: {
		label: 'Photography Friendly Lighting',
		icon: <Camera className="h-5 w-5" />,
	},
	LIVE_BAND_READY: {
		label: 'Live Band Setup',
		icon: <Music className="h-5 w-5" />,
	},
};
