// import './env.mjs'
// import withMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'uploadthing.com',
      'lh3.googleusercontent.com',
      'public.blob.vercel-storage.com',
      'illustrations.popsy.co',
      'flag.vercel.app',
      'images.unsplash.com',
      'utfs.io'
    ]
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client', '@react-email/render']
  },
  images: {
    remotePatterns: [
      { hostname: 'avatar.vercel.sh' },
      { hostname: 'localhost' },
      { hostname: 'dsaph.org' },
      { hostname: 'uploadthing.com' }
    ]
  }
  // reactStrictMode: true,
  // pageExtensions: ['ts', 'tsx', 'mdx']
}

module.exports = nextConfig

// export default withMDX()(nextConfig)
