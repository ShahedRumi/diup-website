import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Globe2,
  Bookmark,
  CheckCircle2,
  FileText,
  Star,
  Quote
} from 'lucide-react'
import BookCover from './BookCover'
import { books as fallbackBooks } from '../data'

const trendingCategories = [
  'Research & Methodology',
  'Sustainability',
  'Higher Education',
  'Computing & AI',
  'Public Health'
]

const tickerDispatches = [
  'New Monograph: "Research Methods for Emerging Economies" by Dr. Farhana Rahman',
  'Call for Academic Submissions: Sustainability & Policy Series 2026–2027',
  'Open Access Digital Repository Access Now Available for University Affiliates',
  'All DIU Press Works are Blind Peer-Reviewed & Catalogued with CrossRef DOIs'
]

export default function AwesomeHero({ books = [] }) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [tickerIndex, setTickerIndex] = useState(0)

  // Curate top featured books (up to 4)
  const featured = useMemo(() => {
    const list = Array.isArray(books) && books.length > 0 ? books : fallbackBooks
    const valid = list.filter(
      (b) => b && b.status !== 'draft' && b.status !== 'inactive' && b.status !== 'archived' && !b.needsCmsSetup
    )
    const prioritized = valid.filter((b) => b.featured)
    const candidates = prioritized.length >= 3 ? prioritized : valid
    return candidates.slice(0, 4)
  }, [books])

  const activeBook = featured[activeIndex] || featured[0] || fallbackBooks[0]

  // Smooth auto-rotation between featured books (pauses on hover or reduced-motion)
  useEffect(() => {
    if (isHovered || reduce || featured.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featured.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [isHovered, reduce, featured.length])

  // Cycle dispatch ticker every 5 seconds
  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerDispatches.length)
    }, 5000)
    return () => clearInterval(tickerTimer)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/books?q=${encodeURIComponent(trimmed)}`)
    } else {
      navigate('/books')
    }
  }

  const nextBook = () => {
    if (!featured.length) return
    setActiveIndex((prev) => (prev + 1) % featured.length)
  }

  const prevBook = () => {
    if (!featured.length) return
    setActiveIndex((prev) => (prev - 1 + featured.length) % featured.length)
  }

  // Accent color from active book for subtle ambient spotlight
  const accentColor = activeBook?.cover?.bg || '#174EA6'

  return (
    <section className="grain relative overflow-hidden bg-[#071A3D] text-white">
      {/* Lightweight Static Ambient Glow (Hardware Accelerated, No JS Mousemove Listeners) */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-3xl transition-colors duration-1000 ease-out sm:h-[750px] sm:w-[1100px]"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, rgba(7, 26, 61, 0) 70%)`
        }}
        aria-hidden="true"
      />

      {/* Decorative Grid Lines */}
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden="true" />

      {/* Subtle Geometric Framing */}
      <div
        className="pointer-events-none absolute -left-28 top-20 h-96 w-96 rounded-full border border-white/[0.05]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-28 bottom-20 h-[500px] w-[500px] rounded-full border border-white/[0.04]"
        aria-hidden="true"
      />

      {/* Main Content Grid */}
      <div className="container-shell relative z-10 grid items-center gap-12 pb-24 pt-32 sm:pb-28 sm:pt-36 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:pb-24 lg:pt-36">
        
        {/* ================= LEFT COLUMN: EDITORIAL, HEADLINE & SEARCH ================= */}
        <div className="max-w-2xl">
          {/* Institutional Eyebrow Pill */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-white/90 shadow-sm backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-diu-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-diu-green" />
            </span>
            <span className="tracking-wide">Daffodil International University Press</span>
            <span className="text-white/30">•</span>
            <span className="text-blue-200 font-semibold">Academic Catalog 2026</span>
          </motion.div>

          {/* Monumental Scholarly Headline */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="space-y-1"
          >
            <h1 className="font-serif text-[clamp(42px,5.8vw,78px)] font-bold leading-[1.04] tracking-[-0.025em] text-white">
              Scholarship that{' '}
              <span className="bg-gradient-to-r from-blue-200 via-emerald-200 to-white bg-clip-text text-transparent">
                shapes tomorrow.
              </span>
            </h1>
            <h2 className="font-serif text-[clamp(34px,4.8vw,64px)] font-semibold italic leading-[1.08] tracking-[-0.02em] text-white/80">
              Ideas with lasting form.
            </h2>
          </motion.div>

          {/* Refined Academic Accent Line */}
          <motion.div
            initial={reduce ? false : { width: 0 }}
            animate={{ width: 72 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            className="my-5 h-[3px] rounded-full bg-gradient-to-r from-diu-green via-blue-400 to-transparent"
          />

          {/* Editorial Lead Paragraph */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="text-base font-normal leading-relaxed text-slate-300 sm:text-lg sm:leading-8"
          >
            The official academic publishing imprint of Daffodil International University. We produce
            peer-reviewed monographs, groundbreaking research, and scholarly literature connecting South Asian
            inquiry with global academic discourse.
          </motion.p>

          {/* Quick Catalog Search Bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.6 }}
            className="mt-7"
          >
            <div className="relative flex max-w-xl items-center rounded-full border border-white/20 bg-white/[0.08] p-1.5 shadow-xl transition-all duration-300 focus-within:border-blue-400 focus-within:bg-white/[0.12] focus-within:ring-2 focus-within:ring-blue-400/25">
              <Search className="ml-3.5 h-4 w-4 text-white/50 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search publications, authors, subjects, or ISBN..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-white/45 outline-none"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-diu-blue px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg active:scale-[0.98]"
              >
                <span>Search</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Trending Disciplines */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-white/45 font-medium">Top Disciplines:</span>
              {trendingCategories.map((cat) => (
                <Link
                  key={cat}
                  to={`/books?category=${encodeURIComponent(cat)}`}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70 transition-colors duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </motion.form>

          {/* Primary Action Buttons */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/books"
              className="group flex items-center gap-2.5 rounded-full border border-white bg-white px-7 py-3.5 text-sm font-semibold text-diu-navy shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <BookOpen className="h-4 w-4 text-diu-blue" />
              <span>Browse Full Catalogue</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/submission"
              className="group flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.07] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <FileText className="h-4 w-4 text-diu-green" />
              <span>Submit Manuscript</span>
              <ArrowUpRight className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </Link>
          </motion.div>

          {/* Institutional Scholarly Seals */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.54, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-6 border-t border-white/10 pt-5 text-xs text-white/60"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-diu-green" />
              <span>Peer-Reviewed Press</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-blue-300" />
              <span>CrossRef & DOI Indexed</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-300" />
              <span>Hardcover & Open Access</span>
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT COLUMN: FEATURED BOOK SPOTLIGHT ================= */}
        <div
          className="relative mx-auto w-full max-w-[480px] lg:max-w-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Ambient Glow Behind Book */}
          <div
            className="pointer-events-none absolute -inset-4 rounded-3xl opacity-30 blur-2xl transition-colors duration-700 ease-out"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, rgba(7, 26, 61, 0) 70%)`
            }}
            aria-hidden="true"
          />

          {/* Outer Glass Card Frame */}
          <div className="relative rounded-2xl border border-white/15 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-md sm:p-7">
            
            {/* Header: Section Eyebrow & Book Selector Indicators */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 items-center gap-1 rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  <Star className="h-3 w-3 fill-amber-300" />
                  Featured Release
                </span>
                <span className="text-[11px] text-white/50">
                  {activeBook.type || 'Monograph'}
                </span>
              </div>

              {/* Numbered Counter & Arrow Controls */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-white/60">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevBook}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors duration-200 hover:bg-white/20 hover:text-white"
                    aria-label="Previous book"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={nextBook}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors duration-200 hover:bg-white/20 hover:text-white"
                    aria-label="Next book"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Book Presentation Stage */}
            <div className="mt-6 grid items-center gap-6 sm:grid-cols-[180px_1fr] sm:gap-7">
              {/* Tangible Hardcover Presentation */}
              <div className="group mx-auto relative w-[170px] sm:w-[180px] shrink-0">
                <Link
                  to={`/books/${activeBook.slug}`}
                  className="block focus:outline-none"
                  aria-label={`View book details for ${activeBook.title}`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeBook.slug}
                      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduce ? false : { opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative transition-transform duration-300 ease-out group-hover:-translate-y-1.5"
                    >
                      <BookCover book={activeBook} interactive={false} />

                      {/* Hardcover Outer Depth & Spine Shadow */}
                      <div className="pointer-events-none absolute inset-0 rounded-[3px] ring-1 ring-inset ring-white/15" />
                    </motion.div>
                  </AnimatePresence>
                </Link>

                {/* Ground Reflection Shadow */}
                <div
                  className="pointer-events-none absolute -bottom-3 left-3 right-3 h-4 rounded-full bg-black/60 blur-md"
                  aria-hidden="true"
                />
              </div>

              {/* Book Details Dossier */}
              <div className="flex flex-col justify-between space-y-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`meta-${activeBook.slug}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? false : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-diu-blue/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200">
                        {activeBook.category}
                      </span>
                      <span className="text-[11px] font-mono text-white/50">
                        {activeBook.year}
                      </span>
                      {activeBook.pages && (
                        <span className="text-[11px] text-white/40">
                          • {activeBook.pages} pp.
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/books/${activeBook.slug}`}
                      className="group/title block focus:outline-none"
                    >
                      <h3 className="font-serif text-xl font-bold leading-snug text-white transition-colors duration-200 group-hover/title:text-blue-300 sm:text-2xl line-clamp-2">
                        {activeBook.title}
                      </h3>
                    </Link>

                    <p className="text-xs font-medium text-slate-300 line-clamp-1">
                      By {Array.isArray(activeBook.authors) ? activeBook.authors.join(', ') : (activeBook.authors || 'DIU Press Author')}
                    </p>

                    {/* Excerpt / Pull Quote */}
                    <div className="border-l-2 border-diu-green/60 pl-3 pt-0.5">
                      <p className="font-serif text-xs italic leading-relaxed text-slate-300 line-clamp-2">
                        {activeBook.sampleExcerpt?.quote || activeBook.description || activeBook.abstract}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex items-center gap-3">
                      <Link
                        to={`/books/${activeBook.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-diu-navy shadow-sm transition-all duration-200 hover:bg-blue-50 active:scale-[0.98]"
                      >
                        <span>Examine Title</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      <span className="text-[11px] text-white/50">
                        {activeBook.format || 'Hardcover & Digital'}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Carousel Selector Strip */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="grid grid-cols-4 gap-2">
                {featured.map((book, idx) => {
                  const isCur = idx === activeIndex
                  return (
                    <button
                      key={book.slug || idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`group relative flex flex-col items-start rounded-lg p-2 text-left transition-all duration-200 ${
                        isCur
                          ? 'bg-white/15 border border-white/30 shadow-sm'
                          : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/15'
                      }`}
                    >
                      <span className={`text-[10px] font-mono font-bold ${isCur ? 'text-diu-green' : 'text-white/40'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="mt-1 line-clamp-1 text-[11px] font-medium leading-tight text-white/90">
                        {book.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM EDITORIAL DISPATCH TICKER ================= */}
      <div className="border-t border-white/10 bg-[#040e1f]/90 py-3">
        <div className="container-shell flex flex-col items-center justify-between gap-3 text-xs text-white/65 sm:flex-row sm:gap-6">
          {/* Live Dispatch */}
          <div className="flex max-w-2xl items-center gap-2.5 overflow-hidden">
            <span className="flex shrink-0 items-center gap-1 rounded bg-diu-blue/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200">
              <Bookmark className="h-3 w-3 text-diu-green" /> Press Dispatch
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="truncate font-serif text-[13px] italic tracking-wide text-white/90"
              >
                {tickerDispatches[tickerIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Catalog Metrics */}
          <div className="hidden shrink-0 items-center gap-5 text-[11px] font-semibold uppercase tracking-wider text-white/45 md:flex">
            <span>
              <strong className="text-white">120+</strong> Academic Works
            </span>
            <span>•</span>
            <span>
              <strong className="text-white">180+</strong> Authors & Editors
            </span>
            <span>•</span>
            <span>
              <strong className="text-white">24</strong> Disciplines
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
