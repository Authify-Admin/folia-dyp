import { MetadataRoute } from 'next';
import { GUIDES } from '@/lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://myfolia.in';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/products`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/learn`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/story`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/track-order`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/shipping`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/returns`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${baseUrl}/learn/${g.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...guideRoutes].map((r) => ({
    ...r,
    lastModified: now,
  }));
}
