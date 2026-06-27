/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbopack: {
      // Resolve motion-dom to framer-motion to fix Turbopack chunk loading
      // Framer Motion 12+ splits motion-dom into a separate chunk which Turbopack
      // struggles to lazy-load; this alias ensures it's bundled correctly
      resolveAlias: {
        'motion-dom': 'framer-motion',
      },
    },
  },
}

export default nextConfig
