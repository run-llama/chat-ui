import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  basePath: process.env.LLAMA_DEPLOY_NEXTJS_BASE_PATH,
  env: {
    NEXT_PUBLIC_LLAMA_DEPLOY_NEXTJS_DEPLOYMENT_NAME: 'QuickStart',
    NEXT_PUBLIC_BASE_PATH: process.env.LLAMA_DEPLOY_NEXTJS_BASE_PATH || '',
  },
}

export default nextConfig
