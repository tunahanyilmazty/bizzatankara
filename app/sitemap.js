import { supabase } from '../lib/supabase'

export default async function sitemap() {
  const baseUrl = 'https://bizzatankara.com'

  // Mekanlar
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('slug, updated_at')
    .not('slug', 'is', null)

  // Blog yazıları
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .not('slug', 'is', null)
    .eq('is_active', true)

  const restaurantUrls = (restaurants || []).map(r => ({
    url: `${baseUrl}/mekan/${r.slug}`,
    lastModified: r.updated_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogUrls = (posts || []).map(p => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.created_at || new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...restaurantUrls,
    ...blogUrls,
  ]
}