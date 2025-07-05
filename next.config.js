/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
