import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/product',
          '/features',
          '/how-it-works',
          '/security',
          '/download',
          '/installation',
          '/faq',
          '/support',
        ],
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://gatewiseai.internal/sitemap.xml',
  };
}
