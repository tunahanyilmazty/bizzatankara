import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
)

export default async function sitemap() {
  const baseUrl = 'https://bizzatankara.com'

  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('slug')
    .not('slug', 'is', null)

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .not('slug', 'is', null)
    .eq('is_active', true)

  const restaurantUrls = (restaurants || []).map(r => ({
    url: `${baseUrl}/mekan/${r.slug}`,
    lastModified: new Date(),
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