import type { NextConfig } from 'next';

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
	? process.env.ALLOWED_DEV_ORIGINS.split(',').map((origin) => origin.trim())
	: ['*.servbay.host', 'oneevent.servbay.host', 'localhost:3000'];

const backendUrl = process.env.INTERNAL_API_URL || process.env.BACKEND_URL || 'http://localhost:4000';

const nextConfig: NextConfig = {
	allowedDevOrigins,
	async rewrites() {
		return [
			{
				source: '/v1/:path*',
				destination: `${backendUrl}/v1/:path*`,
			},
			{
				source: '/uploads/:path*',
				destination: `${backendUrl}/uploads/:path*`,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '4000',
			},
		],
	},
};

export default nextConfig;
