/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'media.discordapp.net',
            pathname: '/attachments/**',
          },
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
            pathname: '/**',
          }
        ]
      },

}

module.exports = nextConfig
