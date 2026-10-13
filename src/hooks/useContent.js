import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { books as fallbackBooks, news as fallbackNews, team as fallbackTeam, writers as fallbackWriters } from '../data'
import { subscribeContentUpdated } from '../lib/sync'

const normalizeNews = (item) => ({ ...item, id: item.id || item._id, date: item.date || item.publishedAt })
const normalizeBook = (item) => {
  const fallback = fallbackBooks.find(b => b.slug === item.slug)
  return {
    ...item,
    id: item.id || item._id,
    price: item.price ?? fallback?.price ?? 550,
    type: item.type || fallback?.type || 'Monograph',
    format: item.format || fallback?.format || 'Paperback'
  }
}

export function useBooks() {
  const [items, setItems] = useState(fallbackBooks)
  useEffect(() => {
    let active = true
    const load = () => {
      api.getBooks('limit=60').then((data) => {
        if (active && Array.isArray(data?.items)) setItems(data.items.map(normalizeBook))
      }).catch(() => {})
    }
    load()
    const unsubscribe = subscribeContentUpdated(load)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])
  return items
}

export function useBook(slug) {
  const fallback = fallbackBooks.find((book) => book.slug === slug)
  const [item, setItem] = useState(fallback || null)
  const [loading, setLoading] = useState(!fallback)
  useEffect(() => {
    let active = true
    if (!fallback) setLoading(true)
    const load = () => {
      api.getBook(slug).then((data) => {
        if (active && data?.book) setItem(normalizeBook(data.book))
      }).catch(() => {
        if (active && !fallback) setItem(null)
      }).finally(() => { if (active) setLoading(false) })
    }
    load()
    const unsubscribe = subscribeContentUpdated(load)
    return () => {
      active = false
      unsubscribe()
    }
  }, [slug])
  return { item, loading }
}

export function useNews() {
  const [items, setItems] = useState(fallbackNews)
  useEffect(() => {
    let active = true
    const load = () => {
      api.getNews().then((data) => {
        if (active && Array.isArray(data?.items)) setItems(data.items.map(normalizeNews))
      }).catch(() => {})
    }
    load()
    const unsubscribe = subscribeContentUpdated(load)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])
  return items
}

export function useNewsItem(slug) {
  const fallback = fallbackNews.find((entry) => entry.slug === slug)
  const [item, setItem] = useState(fallback || null)
  const [loading, setLoading] = useState(!fallback)
  useEffect(() => {
    let active = true
    if (!fallback) setLoading(true)
    const load = () => {
      api.getNewsItem(slug).then((data) => {
        if (active && data?.item) setItem(normalizeNews(data.item))
      }).catch(() => {
        if (active && !fallback) setItem(null)
      }).finally(() => { if (active) setLoading(false) })
    }
    load()
    const unsubscribe = subscribeContentUpdated(load)
    return () => {
      active = false
      unsubscribe()
    }
  }, [slug])
  return { item, loading }
}

export function useTeam() {
  const [items, setItems] = useState(fallbackTeam)
  useEffect(() => {
    let active = true
    const load = () => {
      api.getTeam().then((data) => {
        const list = data?.items || data?.members
        if (active && Array.isArray(list)) setItems(list)
      }).catch(() => {})
    }
    load()
    const unsubscribe = subscribeContentUpdated(load)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])
  return items
}

export function useWriters() {
  const [items, setItems] = useState(fallbackWriters)
  useEffect(() => {
    let active = true
    const load = () => {
      api.getWriters().then((data) => {
        const list = data?.items || data?.writers
        if (active && Array.isArray(list)) setItems(list)
      }).catch(() => {})
    }
    load()
    const unsubscribe = subscribeContentUpdated(load)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])
  return items
}

