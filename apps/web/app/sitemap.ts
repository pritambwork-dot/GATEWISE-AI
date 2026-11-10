import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewiseai.internal';
  const routes = [
    '',
    '/product',
    '/features',
    '/how-it-works',
    '/security',
    '/download',
    '/installation',
    '/faq',
    '/support',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : route === '/download' ? 0.9 : 0.8,
  }));
}
