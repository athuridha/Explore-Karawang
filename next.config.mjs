/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// Allow external images used in cards and previews
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'blue.kumparan.com',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
