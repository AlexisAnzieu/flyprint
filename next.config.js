/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["@napi-rs/canvas"],
    images: {
        // AVIF first: noticeably smaller photos for the landing gallery.
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30,
        remotePatterns:
            [
                {
                    protocol: 'https',
                    hostname: 'res.cloudinary.com',
                    pathname: '/**',
                }
            ],
    }
};

const withVercelToolbar = require('@vercel/toolbar/plugins/next')();
module.exports = withVercelToolbar(nextConfig);
