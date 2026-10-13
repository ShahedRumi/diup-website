import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Award,
  Mail,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  UserCheck
} from 'lucide-react'
import BookCover from '../components/BookCover'
import EyebrowBadge from '../components/EyebrowBadge'
import { Reveal, Stagger, StaggerItem } from '../components/Motion'
import { api, getMediaUrl } from '../lib/api'
import { writers as seedWriters, books as seedBooks } from '../data'

export default function WriterDetail() {
  const { slug } = useParams()
  const [writer, setWriter] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    window.scrollTo({ top: 0, behavior: 'smooth' })

    async function loadWriter() {
      setLoading(true)
      setError(null)

      try {
        const res = await api.getWriter(slug)
        if (isMounted) {
          if (res?.writer) {
            setWriter(res.writer)
            setBooks(res.books || [])
          } else {
            throw new Error('Writer not found')
          }
        }
      } catch (err) {
        // Fallback to local seed data
        const localWriter = seedWriters?.find(
          (w) => w.slug === slug || String(w.id || w._id) === slug
        )
        if (localWriter) {
          if (isMounted) {
            setWriter(localWriter)
            const cleanCore = localWriter.name
              .toLowerCase()
              .replace(/^(prof\.|dr\.|mr\.|ms\.|mrs\.)\s+/i, '')
              .trim()
            const matchingBooks = (seedBooks || []).filter((b) =>
              b.authors?.some((a) => {
                const al = a.toLowerCase()
                return al.includes(cleanCore) || al.includes(localWriter.name.toLowerCase())
              })
            )
            setBooks(matchingBooks)
          }
        } else {
          if (isMounted) {
            setError(err.message || 'Unable to find writer details.')
          }
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadWriter()
    return () => {
      isMounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-diu-paper">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-diu-blue border-t-transparent" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Loading Writer Profile...
          </p>
        </div>
      </div>
    )
  }

  if (error || !writer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-diu-paper px-4 py-20">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-diu-navy">Writer Not Found</h2>
          <p className="mt-2 text-sm text-slate-600">
            The author or researcher you are looking for is not listed or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/writers"
              className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-diu-blue"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Writers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const publishedCount = Math.max(writer.bookCount || 0, books.length)

  return (
    <div className="min-h-screen bg-diu-paper pb-20">
      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-shell py-4">
          <Link
            to="/writers"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-diu-blue"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Writers</span>
          </Link>
        </div>
      </div>

      {/* Hero Showcase Section */}
      <section className="border-b border-slate-200/80 bg-white py-12 lg:py-16">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-14">
            {/* Writer Photo Column */}
            <Reveal>
              <div className="relative mx-auto max-w-[320px] lg:mx-0">
                <div className="relative aspect-[3/3.8] w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-900 shadow-xl ring-8 ring-slate-100">
                  <img
                    src={getMediaUrl(writer.image) || '/team/team-1.svg'}
                    alt={writer.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/team/team-1.svg'
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />

                  {/* Bottom Counter Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-white/95 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-diu-blue shadow-md backdrop-blur-md">
                      <BookOpen className="h-3.5 w-3.5 text-diu-green" />
                      <span>{publishedCount} {publishedCount === 1 ? 'Publication' : 'Publications'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Writer Bio & Information Column */}
            <div className="flex flex-col justify-center">
              <Reveal delay={0.06}>
                <div className="mb-3">
                  <EyebrowBadge subtitle="Scholarly Profile">DIU Press Author</EyebrowBadge>
                </div>
                <h1 className="font-serif text-3xl font-bold leading-tight text-diu-navy sm:text-4xl lg:text-5xl">
                  {writer.name}
                </h1>
                <p className="mt-2 text-base font-medium text-diu-blue sm:text-lg">
                  {writer.designation || 'Academic Author & Scholar'}
                </p>
              </Reveal>

              {/* Bio Statement */}
              <Reveal delay={0.12}>
                <div className="mt-6 rounded-2xl border border-slate-200/90 bg-[#fbfcfd] p-6 text-sm leading-relaxed text-slate-700 shadow-sm sm:p-7">
                  <p className="text-base leading-relaxed text-slate-700">
                    {writer.bio ||
                      'An esteemed scholar and academic contributor dedicated to rigorous inquiry, transformative research, and educational excellence through DIU Press.'}
                  </p>
                </div>
              </Reveal>

              {/* Metric Highlights & Meta */}
              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3 shadow-2xs">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-diu-blue">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-diu-navy">{publishedCount}</div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {publishedCount === 1 ? 'Book Published' : 'Books Published'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3 shadow-2xs">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-diu-green">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-diu-navy">Peer-Reviewed</div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Editorial Standard
                      </div>
                    </div>
                  </div>

                  {writer.email && (
                    <a
                      href={`mailto:${writer.email}`}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-diu-blue hover:text-diu-blue"
                    >
                      <Mail className="h-4 w-4 text-diu-blue" />
                      <span>{writer.email}</span>
                    </a>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Published Works Section */}
      <section className="section-space">
        <div className="container-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <EyebrowBadge subtitle="Catalogue">Authored Publications</EyebrowBadge>
              <h2 className="mt-3 font-serif text-2xl font-bold text-diu-navy sm:text-3xl">
                Books by {writer.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Explore authoritative academic works and monographs published through DIU Press.
              </p>
            </div>

            <Link
              to="/books"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-diu-blue transition hover:underline"
            >
              <span>Explore all DIU Press books</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Books List Grid */}
          {books.length > 0 ? (
            <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <StaggerItem key={book.slug || book.id || book._id}>
                  <Link
                    to={`/books/${book.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-diu-blue/35 hover:shadow-editorial"
                  >
                    {/* Book Cover Container */}
                    <div className="mx-auto w-full max-w-[200px] py-2">
                      <BookCover book={book} />
                    </div>

                    {/* Book Metadata */}
                    <div className="mt-5 flex flex-1 flex-col justify-between border-t border-slate-100 pt-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider">
                          <span className="truncate text-diu-blue">{book.category}</span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                            {book.year}
                          </span>
                        </div>

                        <h3 className="mt-2.5 font-serif text-lg font-bold leading-snug text-diu-navy transition group-hover:text-diu-blue">
                          {book.title}
                        </h3>

                        {book.subtitle && (
                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                            {book.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 text-xs">
                        <span className="font-semibold text-diu-navy">
                          ৳{book.price || 550}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-diu-blue group-hover:translate-x-0.5 transition-transform">
                          <span>View Book</span>
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-diu-blue">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-diu-navy">
                Publications Underway
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
                Manuscripts and editions by {writer.name} are currently in editorial production, peer review, or scheduled for forthcoming release.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-diu-blue"
                >
                  <BookOpen className="h-3.5 w-3.5" /> Browse Full Catalog
                </Link>
                <Link
                  to="/submission"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-diu-blue hover:text-diu-blue"
                >
                  Submit a Manuscript
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
