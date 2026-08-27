/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["@napi-rs/canvas"],
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
