import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronUp, Star, Filter, CheckCircle2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import EyebrowBadge from '../components/EyebrowBadge'
import { Reveal, Stagger, StaggerItem } from '../components/Motion'
import { useNews } from '../hooks/useContent'
import { getMediaUrl } from '../lib/api'

const fmt = (date) => {
  if (!date) return 'Recent'
  const d = new Date(date)
  return isNaN(d.getTime())
    ? String(date)
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

const INITIAL_VISIBLE_COUNT = 12
const PAGE_INCREMENT = 6

export default function News() {
  const news = useNews()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  // Featured story (ONLY if explicitly marked as featured)
  const featured = useMemo(() => {
    return news.find((n) => Boolean(n.featured)) || null
  }, [news])

  // All categories
  const categories = useMemo(() => {
    return ['All', ...new Set(news.map((item) => item.category).filter(Boolean))]
  }, [news])

  // Filter non-featured articles for the general grid
  const otherNews = useMemo(() => {
    if (!featured) return news
    return news.filter((n) => (n.id || n._id || n.slug) !== (featured.id || featured._id || featured.slug))
  }, [news, featured])

  const filteredNews = useMemo(() => {
    if (selectedCategory === 'All') return otherNews
    return news.filter((n) => n.category === selectedCategory)
  }, [news, otherNews, selectedCategory])

  // Visible sliced articles
  const visibleArticles = useMemo(() => {
    return filteredNews.slice(0, visibleCount)
  }, [filteredNews, visibleCount])

  const hasMore = visibleCount < filteredNews.length

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_INCREMENT, filteredNews.length))
  }

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
    // Smooth scroll back to list start
    const listEl = document.getElementById('news-list')
    if (listEl) {
      listEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  return (
    <>
      <PageHero
        eyebrow="News & Announcements"
        subtitle="Press Releases & Dispatches"
        title="Updates from the Press."
        body="Editorial developments, publication releases, call for manuscripts, events, and institutional announcements from DIU Press."
      />

      {/* Featured Lead Story */}
      {featured && (
        <section className="bg-white py-12 lg:py-16">
          <div className="container-shell">
            <Reveal>
              <Link
                to={`/news/${featured.slug}`}
                className="group grid overflow-hidden rounded-2xl border border-slate-200/90 bg-diu-paper shadow-sm transition-all duration-300 hover:border-diu-blue/30 hover:shadow-editorial lg:grid-cols-[1.15fr_0.85fr]"
              >
                <div className="overflow-hidden">
                  <img
                    src={getMediaUrl(featured.image) || '/news/news-1.svg'}
                    alt={featured.title || 'Featured'}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/news/news-1.svg'
                    }}
                    className="h-full min-h-[360px] w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-diu-blue">
                    <Star className="h-3.5 w-3.5 text-diu-green fill-diu-green" />
                    <span>Featured • {featured.category}</span>
                  </div>
                  <div className="mt-2.5 text-xs text-slate-400">{fmt(featured.date)}</div>
                  <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-diu-navy transition group-hover:text-diu-blue lg:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-diu-blue/20 bg-blue-50/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-diu-blue transition-all duration-300 group-hover:border-diu-blue group-hover:bg-diu-blue group-hover:text-white group-hover:-translate-y-0.5">
                    <span>Read full announcement</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* All Updates Grid with Category Filter & Show More Button */}
      <section id="news-list" className={`bg-white ${featured ? 'section-space !pt-4' : 'py-14 lg:py-20'}`}>
        <div className="container-shell">
          {/* Header & Category Tabs */}
          <div className={`flex flex-col gap-6 ${featured ? 'border-t border-slate-200 pt-10' : ''} sm:flex-row sm:items-center sm:justify-between`}>
            <div>
              <div className="mb-2">
                <EyebrowBadge subtitle="Archive & Articles">All Updates</EyebrowBadge>
              </div>
              <h3 className="mt-1 font-serif text-2xl font-bold text-diu-navy">
                Recent Press Dispatches
              </h3>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1 pr-2 text-xs font-semibold text-slate-400">
                <Filter className="h-3.5 w-3.5" /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                    selectedCategory === cat
                      ? 'bg-diu-navy text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {visibleArticles.length > 0 ? (
            <Stagger
              key={`${selectedCategory}-${visibleArticles.length}-${visibleArticles[0]?.slug || ''}`}
              className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {visibleArticles.map((item) => (
                <StaggerItem key={item.slug || item.id || item._id}>
                  <Link
                    to={`/news/${item.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-diu-blue/30 hover:shadow-editorial"
                  >
                    <div className="overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={getMediaUrl(item.image) || '/news/news-1.svg'}
                        alt={item.title || 'News'}
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = '/news/news-1.svg'
                        }}
                        className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                      <span>{item.category}</span>
                      <span className="text-slate-400">{fmt(item.date)}</span>
                    </div>
                    <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-diu-navy transition group-hover:text-diu-blue">
                      {item.title}
                    </h2>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {item.excerpt}
                    </p>
                    <div className="mt-5 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-semibold text-diu-blue">
                      <span>Read article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <div className="my-12 rounded-xl border border-slate-200 bg-slate-50 py-16 text-center text-sm text-slate-500">
              No announcements found under "{selectedCategory}".
            </div>
          )}

          {/* Show More / Show Less Controls */}
          {filteredNews.length > INITIAL_VISIBLE_COUNT && (
            <div className="mt-14 flex flex-col items-center justify-center gap-3 border-t border-slate-200 pt-10 text-center">
              <div className="text-xs text-slate-500">
                Showing <strong className="text-diu-navy">{visibleArticles.length}</strong> of{' '}
                <strong className="text-diu-navy">{filteredNews.length}</strong> updates
              </div>

              {/* Progress bar indicator */}
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-diu-blue transition-all duration-500"
                  style={{
                    width: `${(visibleArticles.length / filteredNews.length) * 100}%`
                  }}
                />
              </div>

              {hasMore ? (
                <button
                  onClick={handleShowMore}
                  className="group mt-2 inline-flex items-center gap-2 rounded-full bg-diu-navy px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-diu-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none"
                >
                  <span>Show More Announcements</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              ) : (
                <div className="mt-2 flex flex-col items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-diu-green" />
                    <span>All {filteredNews.length} announcements are displayed</span>
                  </div>
                  <button
                    onClick={handleShowLess}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    <span>Show Less</span>
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
