// import './env.mjs'
// import withMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com']
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client']
  }
  // reactStrictMode: true,
  // pageExtensions: ['ts', 'tsx', 'mdx']
}

module.exports = nextConfig

// export default withMDX()(nextConfig)
