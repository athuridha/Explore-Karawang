/** @type {import('next).NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			// Allow local uploads
			{
				protocol: 'http',
				hostname: 'localhost',
				pathname: '/uploads/**',
			},
			{
				protocol: 'http',
				hostname: '127.0.0.1',
				pathname: '/uploads/**',
			},
			// Allow any HTTPS external images
			{
				protocol: 'https',
				hostname: '**',
			},
			// Allow any HTTP external images
			{
				protocol: 'http',
				hostname: '**',
			},
		],
	},
};

export default nextConfig;
