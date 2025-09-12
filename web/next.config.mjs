/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === 'true'
const repo = process.env.GITHUB_REPOSITORY?.split('/').pop()
const isUserPages = repo ? repo.toLowerCase().endsWith('.github.io') : false

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGhPages && repo && !isUserPages
    ? {
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`
      }
    : {})
}

export default nextConfig
