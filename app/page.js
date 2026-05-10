import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('id')

  if (error) {
    return <div>Hata: {error.message}</div>
  }

  return (
    <main style={{padding: '40px', fontFamily: 'sans-serif'}}>
      <h1 style={{fontSize: '2rem', marginBottom: '24px'}}>
        bizzat<span style={{color: '#F55D00'}}>ankara</span>
      </h1>
      <p style={{color: '#666', marginBottom: '24px'}}>
        {restaurants?.length} mekan yüklendi ✓
      </p>
      <ul style={{listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px'}}>
        {restaurants?.map(r => (
          <li key={r.id} style={{
            padding: '16px', background: '#FAF7F2',
            borderRadius: '10px', border: '1px solid #E8DDD0'
          }}>
            <strong>{r.emoji} {r.name}</strong>
            <span style={{color: '#999', marginLeft: '12px'}}>{r.area}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}