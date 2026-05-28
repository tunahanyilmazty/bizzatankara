/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/runners',
        permanent: false,
      },
    ]
  },
}

export default nextConfig