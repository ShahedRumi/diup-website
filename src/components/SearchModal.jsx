import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  BookOpen,
  Newspaper,
  ArrowRight,
  Tag,
  CornerDownLeft,
} from 'lucide-react'
import { books as fallbackBooks, news as fallbackNews } from '../data'
import { useBooks, useNews } from '../hooks/useContent'
import { getMediaUrl } from '../lib/api'

const QUICK_TOPICS = [
  'Sustainability',
  'Higher Education',
  'Computing & AI',
  'Business & Entrepreneurship',
  'Public Health',
  'Humanities',
  'Research & Methodology',
]

function MiniBookThumbnail({ book }) {
  const c = book?.cover || { bg: '#071A3D', accent: '#43B649', text: '#FFFFFF', code: 'DP' }
  const rawImg = book?.coverImage || book?.cover?.image
  const [imgErr, setImgErr] = useState(false)
  const imageUrl = !imgErr && rawImg ? getMediaUrl(rawImg) : null

  if (imageUrl) {
    return (
      <div className="relative aspect-[2/3] w-10 sm:w-11 shrink-0 overflow-hidden rounded-[3px] bg-slate-900 shadow-sm border border-black/10">
        <img
          src={imageUrl}
          alt={book?.title || 'Book cover'}
          onError={() => setImgErr(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute left-0 top-0 h-full w-[4px] bg-gradient-to-r from-black/40 to-transparent" />
      </div>
    )
  }

  return (
    <div
      className="relative aspect-[2/3] w-10 sm:w-11 shrink-0 overflow-hidden rounded-[3px] shadow-sm border border-black/10 flex flex-col justify-between p-1.5 select-none"
      style={{ background: c.bg || '#071A3D', color: c.text || '#FFFFFF' }}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-black/25" />
      <div className="flex items-center justify-between text-[6px] font-bold uppercase tracking-wider opacity-85 pl-1">
        <span>DIU</span>
        <span>{book?.year || '26'}</span>
      </div>
      <div
        className="font-serif font-bold text-center text-xs sm:text-sm leading-none tracking-tight my-auto"
        style={{ color: c.accent || '#43B649' }}
      >
        {c.code || 'DP'}
      </div>
      <div
        className="h-[2px] w-full rounded-full opacity-90"
        style={{ background: c.accent || '#43B649' }}
      />
    </div>
  )
}

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [activeScope, setActiveScope] = useState('all') // 'all' | 'books' | 'news'
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const resultListRef = useRef(null)
  const navigate = useNavigate()

  const remoteBooks = useBooks()
  const remoteNews = useNews()
  const books = remoteBooks?.length ? remoteBooks : fallbackBooks
  const news = remoteNews?.length ? remoteNews : fallbackNews

  // Featured books for pre-search recommendations
  const featuredPicks = useMemo(() => {
    const list = (books || []).filter((b) => b.featured)
    return (list.length ? list : books || []).slice(0, 2)
  }, [books])

  // Filtered publications & news
  const { matchedBooks, matchedNews } = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return { matchedBooks: [], matchedNews: [] }
    }

    const b = (books || []).filter((book) => {
      const title = (book.title || '').toLowerCase()
      const subtitle = (book.subtitle || '').toLowerCase()
      const author = Array.isArray(book.authors)
        ? book.authors.join(' ').toLowerCase()
        : String(book.authors || '').toLowerCase()
      const category = (book.category || '').toLowerCase()
      const year = String(book.year || '')
      const isbn = (book.isbn || '').toLowerCase()
      const desc = (book.description || book.abstract || '').toLowerCase()
      const keywords = Array.isArray(book.keywords) ? book.keywords.join(' ').toLowerCase() : ''
      return (
        title.includes(q) ||
        subtitle.includes(q) ||
        author.includes(q) ||
        category.includes(q) ||
        year.includes(q) ||
        isbn.includes(q) ||
        desc.includes(q) ||
        keywords.includes(q)
      )
    })

    const n = (news || []).filter((item) => {
      const title = (item.title || '').toLowerCase()
      const cat = (item.category || '').toLowerCase()
      const excerpt = (item.excerpt || '').toLowerCase()
      return title.includes(q) || cat.includes(q) || excerpt.includes(q)
    })

    return { matchedBooks: b.slice(0, 6), matchedNews: n.slice(0, 4) }
  }, [query, books, news])

  // Visible flattened results for keyboard navigation & scope tabs
  const visibleResults = useMemo(() => {
    if (activeScope === 'books') {
      return matchedBooks.map((b) => ({ ...b, itemType: 'book' }))
    }
    if (activeScope === 'news') {
      return matchedNews.map((n) => ({ ...n, itemType: 'news' }))
    }
    return [
      ...matchedBooks.map((b) => ({ ...b, itemType: 'book' })),
      ...matchedNews.map((n) => ({ ...n, itemType: 'news' })),
    ]
  }, [activeScope, matchedBooks, matchedNews])

  // Reset selected index when query or activeScope changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query, activeScope])

  // Auto-focus input on open & lock background scroll
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveScope('all')
      setSelectedIndex(0)
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        inputRef.current?.focus()
      }, 80)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape & handle keyboard navigation (ArrowUp, ArrowDown, Enter)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        if (visibleResults.length > 0) {
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % visibleResults.length)
        }
      } else if (e.key === 'ArrowUp') {
        if (visibleResults.length > 0) {
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + visibleResults.length) % visibleResults.length)
        }
      } else if (e.key === 'Enter') {
        if (visibleResults.length > 0 && visibleResults[selectedIndex]) {
          e.preventDefault()
          const item = visibleResults[selectedIndex]
          if (item.itemType === 'book') {
            handleSelectBook(item.slug)
          } else {
            handleSelectNews(item.slug)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, visibleResults, selectedIndex, onClose])

  const handleSelectBook = (slug) => {
    onClose()
    navigate(`/books/${slug}`)
  }

  const handleSelectNews = (slug) => {
    onClose()
    navigate(`/news/${slug}`)
  }

  const handleTopicClick = (topic) => {
    setQuery(topic)
    setActiveScope('all')
    inputRef.current?.focus()
  }

  const totalResults = matchedBooks.length + matchedNews.length

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search publications and announcements"
          className="fixed inset-0 z-[100] flex items-start justify-center p-3 pt-12 sm:p-6 sm:pt-20"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#071A3D]/65 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Signature Top Academic Gradient Accent Bar */}
            <div className="h-[3px] w-full bg-gradient-to-r from-diu-blue via-diu-green to-diu-navy" />

            {/* Top Brand Micro Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-diu-green opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-diu-green" />
                </span>
                <span className="font-serif text-sm font-bold tracking-tight text-diu-navy">
                  DIU Press Repository
                </span>
                <span className="text-slate-300">•</span>
                <span className="hidden sm:inline text-[11px] font-medium text-slate-500">
                  Daffodil International University
                </span>
              </div>

              <div className="flex items-center gap-2">
                <kbd className="hidden rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 shadow-2xs sm:inline-block">
                  ESC to close
                </kbd>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search Input Bar Area */}
            <div className="p-4 sm:p-5 pb-3.5 sm:pb-4">
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 transition focus-within:border-diu-blue focus-within:bg-white focus-within:ring-2 focus-within:ring-diu-blue/15 shadow-2xs">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-diu-blue">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search books, authors, disciplines, ISBN, keywords..."
                  className="ml-3 flex-1 bg-transparent text-sm sm:text-base font-medium text-diu-navy placeholder-slate-400 outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                    aria-label="Clear search input"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Scope Filtering Tabs */}
              <div className="mt-4 sm:mt-5 flex items-center gap-2 overflow-x-auto pt-1 pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveScope('all')}
                  className={`rounded-full px-3.5 py-1 font-semibold transition ${
                    activeScope === 'all'
                      ? 'bg-diu-navy text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
                  }`}
                >
                  All {query ? `(${totalResults})` : ''}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScope('books')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-semibold transition ${
                    activeScope === 'books'
                      ? 'bg-diu-navy text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
                  }`}
                >
                  <BookOpen className="h-3 w-3 text-diu-blue" />
                  <span>Publications {query ? `(${matchedBooks.length})` : ''}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScope('news')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-semibold transition ${
                    activeScope === 'news'
                      ? 'bg-diu-navy text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
                  }`}
                >
                  <Newspaper className="h-3 w-3 text-diu-green" />
                  <span>Announcements {query ? `(${matchedNews.length})` : ''}</span>
                </button>
              </div>
            </div>

            {/* Results & Quick Topics Content Area */}
            <div
              ref={resultListRef}
              className="flex-1 overflow-y-auto px-4 pb-4 sm:px-5 sm:pb-5"
            >
              {!query.trim() ? (
                /* Initial Discovery State */
                <div className="space-y-6 py-2">
                  {/* Curated Recommendations */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <BookOpen className="h-3.5 w-3.5 text-diu-blue" />
                        <span>Recommended Publications</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose()
                          navigate('/books')
                        }}
                        className="text-xs font-semibold text-diu-blue hover:underline"
                      >
                        Catalogue →
                      </button>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {featuredPicks.map((book) => (
                        <button
                          key={book.slug}
                          type="button"
                          onClick={() => handleSelectBook(book.slug)}
                          className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 text-left transition hover:border-diu-blue/30 hover:bg-white hover:shadow-xs"
                        >
                          <MiniBookThumbnail book={book} />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                              {book.category}
                            </span>
                            <h4 className="truncate font-serif text-sm font-bold text-diu-navy group-hover:text-diu-blue transition-colors">
                              {book.title}
                            </h4>
                            <p className="truncate text-xs text-slate-500">
                              {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Disciplines / Topics */}
                  <div>
                    <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Disciplines & Topics
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TOPICS.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicClick(topic)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-diu-blue/40 hover:bg-blue-50/40 hover:text-diu-blue hover:-translate-y-0.5"
                        >
                          <span>{topic}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom link to full catalog */}
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Explore all 120+ peer-reviewed titles</span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose()
                          navigate('/books')
                        }}
                        className="inline-flex items-center gap-1 font-semibold text-diu-blue hover:underline"
                      >
                        <span>Browse Catalogue</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : visibleResults.length === 0 ? (
                /* No Results State */
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-diu-blue ring-8 ring-blue-50/40">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-diu-navy">
                    No results found for "{query}"
                  </h3>
                  <p className="mx-auto mt-1.5 max-w-sm text-xs text-slate-500 leading-relaxed">
                    We could not find publications or announcements matching your search. Try broader terms, author names, or explore by discipline.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Clear search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        navigate('/books')
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-diu-navy px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-diu-blue transition hover:-translate-y-0.5"
                    >
                      <span>Browse Full Catalogue</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Filtered Results with Sections */
                <div className="space-y-5">
                  {/* Books Section */}
                  {activeScope !== 'news' && matchedBooks.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-diu-blue" />
                          Publications ({matchedBooks.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose()
                            navigate('/books')
                          }}
                          className="text-[11px] font-semibold text-diu-blue hover:underline lowercase"
                        >
                          view in catalogue
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {matchedBooks.map((book, idx) => {
                          const globalIdx = idx
                          const isSelected = selectedIndex === globalIdx
                          return (
                            <button
                              key={book.slug}
                              type="button"
                              onClick={() => handleSelectBook(book.slug)}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`group flex w-full items-center gap-3.5 rounded-2xl border p-2.5 sm:p-3 text-left transition-all ${
                                isSelected
                                  ? 'border-diu-blue/40 bg-blue-50/70 shadow-xs'
                                  : 'border-transparent hover:border-slate-200/80 hover:bg-slate-50/80'
                              }`}
                            >
                              <MiniBookThumbnail book={book} />

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                                  <span>{book.category}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-500 font-medium">{book.year}</span>
                                  {book.format && (
                                    <>
                                      <span className="text-slate-300">•</span>
                                      <span className="text-slate-400 font-normal">{book.format}</span>
                                    </>
                                  )}
                                </div>
                                <h4 className="truncate font-serif text-sm sm:text-base font-bold text-diu-navy group-hover:text-diu-blue transition-colors">
                                  {book.title}
                                </h4>
                                <p className="truncate text-xs text-slate-500">
                                  {Array.isArray(book.authors)
                                    ? book.authors.join(', ')
                                    : book.authors || 'DIU Press'}
                                </p>
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-diu-green border border-emerald-200/60">
                                  {book.price ? `৳${book.price}` : 'Open Access'}
                                </span>

                                {isSelected ? (
                                  <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-diu-navy px-1.5 py-0.5 text-[10px] font-medium text-white shadow-2xs">
                                    <span>Enter</span>
                                    <CornerDownLeft className="h-3 w-3" />
                                  </span>
                                ) : (
                                  <CornerDownLeft className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* News Section */}
                  {activeScope !== 'books' && matchedNews.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <Newspaper className="h-3.5 w-3.5 text-diu-green" />
                        <span>Announcements & News ({matchedNews.length})</span>
                      </div>

                      <div className="space-y-1.5">
                        {matchedNews.map((item, idx) => {
                          const globalIdx = activeScope === 'news' ? idx : matchedBooks.length + idx
                          const isSelected = selectedIndex === globalIdx
                          return (
                            <button
                              key={item.slug}
                              type="button"
                              onClick={() => handleSelectNews(item.slug)}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`group flex w-full items-center gap-3.5 rounded-2xl border p-2.5 sm:p-3 text-left transition-all ${
                                isSelected
                                  ? 'border-diu-blue/40 bg-blue-50/70 shadow-xs'
                                  : 'border-transparent hover:border-slate-200/80 hover:bg-slate-50/80'
                              }`}
                            >
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-diu-green border border-emerald-100">
                                <Newspaper className="h-5 w-5" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  <span>{item.category}</span>
                                  {item.date && (
                                    <>
                                      <span className="text-slate-300">•</span>
                                      <span className="text-slate-500 font-medium">{item.date}</span>
                                    </>
                                  )}
                                </div>
                                <h4 className="truncate font-serif text-sm sm:text-base font-semibold text-diu-navy group-hover:text-diu-blue transition-colors">
                                  {item.title}
                                </h4>
                                {item.excerpt && (
                                  <p className="truncate text-xs text-slate-500">
                                    {item.excerpt}
                                  </p>
                                )}
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                {isSelected ? (
                                  <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-diu-navy px-1.5 py-0.5 text-[10px] font-medium text-white shadow-2xs">
                                    <span>Enter</span>
                                    <CornerDownLeft className="h-3 w-3" />
                                  </span>
                                ) : (
                                  <CornerDownLeft className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer with Keyboard Nav Legend */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-5 py-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1">
                  <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono shadow-2xs">↑</kbd>
                  <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono shadow-2xs">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono shadow-2xs">↵</kbd>
                  <span>select</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono shadow-2xs">ESC</kbd>
                  <span>close</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate('/books')
                }}
                className="inline-flex items-center gap-1 font-semibold text-diu-blue hover:underline"
              >
                <span>Full Catalogue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
