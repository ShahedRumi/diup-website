import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNewsItem } from '../hooks/useContent'
import EyebrowBadge from '../components/EyebrowBadge'
import { Reveal } from '../components/Motion'
import { getMediaUrl } from '../lib/api'

export default function NewsDetail() {
  const { slug } = useParams()
  const { item, loading } = useNewsItem(slug)

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-diu-navy text-white">
        Loading article…
      </div>
    )
  }

  if (!item) return <Navigate to="/news" replace />

  const dateStr = item.date
    ? (() => {
        const d = new Date(item.date)
        return isNaN(d.getTime())
          ? String(item.date)
          : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
      })()
    : 'Recent Announcement'

  const paragraphs = Array.isArray(item.body)
    ? item.body
    : typeof item.body === 'string'
      ? item.body.split('\n\n').filter(Boolean)
      : [item.excerpt || item.title || '']

  return (
    <article>
      <header className="bg-white pb-14 pt-36 lg:pb-20 lg:pt-44">
        <div className="container-shell">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[.14em] text-slate-600 shadow-sm transition-all duration-300 hover:border-diu-blue/30 hover:bg-slate-50 hover:text-diu-blue hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            <ArrowLeft size={15} /> Back to news
          </Link>
          <div className="mt-10 max-w-4xl">
            <div className="mb-5">
              <EyebrowBadge subtitle={dateStr}>{item.category || 'Press Release'}</EyebrowBadge>
            </div>
            <h1 className="font-serif text-5xl font-semibold leading-[.94] text-diu-navy sm:text-6xl lg:text-7xl">
              {item.title}
            </h1>
            {item.excerpt && (
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">{item.excerpt}</p>
            )}
          </div>
        </div>
      </header>

      <div className="container-shell">
        <img
          src={getMediaUrl(item.image) || '/news/news-1.svg'}
          alt={item.title || 'News'}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/news/news-1.svg'
          }}
          className="aspect-[16/7] w-full rounded-2xl sm:rounded-3xl object-cover shadow-editorial"
        />
      </div>

      <section className="section-space bg-white">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <p
                  className={`leading-9 text-slate-700 ${
                    i === 0 ? 'font-serif text-2xl text-diu-navy' : 'mt-7 text-base'
                  }`}
                >
                  {p}
                </p>
              </Reveal>
            ))}
            <div className="mt-12 border-t border-slate-200 pt-8">
              <Link
                to="/news"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-diu-navy shadow-sm transition-all duration-300 hover:border-diu-blue hover:bg-diu-paper hover:text-diu-blue hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                More news & announcements{' '}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
