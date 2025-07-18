import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false, // 개발 시 StrictMode 비활성화 (선택 사항)

  // 이곳에 images 설정을 추가합니다.
  images: {
    domains: [
      'znusrbdqiaopjrrwikqt.supabase.co', // 제공해주신 이미지 URL의 도메인 추가
      'example.com',
      'images.unsplash.com', // Unsplash 이미지 도메인 추가
      // 필요하다면 여기에 다른 이미지 호스팅 도메인들을 추가할 수 있습니다.
      // 예: 'your-cdn-domain.com', 'another-image-service.com'
    ],
  },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    )

    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

export default nextConfig
