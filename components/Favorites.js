'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function useFavorites() {
  const [favorites, setFavorites] = useState(new Set())
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadFavorites(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadFavorites(session.user.id)
      else setFavorites(new Set())
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadFavorites(userId) {
    const { data } = await supabase
      .from('favorites')
      .select('restaurant_id')
      .eq('user_id', userId)
    if (data) setFavorites(new Set(data.map(f => f.restaurant_id)))
  }

  async function toggleFavorite(restaurantId) {
    if (!user) return false

    if (favorites.has(restaurantId)) {
      await supabase.from('favorites').delete()
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId)
      setFavorites(prev => {
        const next = new Set(prev)
        next.delete(restaurantId)
        return next
      })
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        restaurant_id: restaurantId,
      })
      setFavorites(prev => new Set([...prev, restaurantId]))
    }
    return true
  }

  return { favorites, toggleFavorite, user }
}