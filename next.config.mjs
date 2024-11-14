/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "open.api.nexon.com",
			},
		],
	},
};

export default nextConfig;
