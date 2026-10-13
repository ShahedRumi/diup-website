import { useState, useEffect, useRef } from 'react'
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
  FileText
} from 'lucide-react'
import BookCover from './BookCover'

const trendingCategories = [
  'Research & Methodology',
  'Sustainability',
  'Education',
  'Computing & AI',
  'Health Sciences'
]

const tickerItems = [
  'New Release: "Research Methods for Emerging Economies" by Dr. Farhana Rahman',
  'Call for Monograph Submissions 2026–2027: Sustainability & Technology Series',
  'Over 180+ Authors and Editors from Leading Global Institutions',
  'Open Access Digital Library Access Now Available for University Affiliates',
  'All DIU Press Publications are Peer-Reviewed & Catalogued with CrossRef DOIs'
]

export default function AwesomeHero({ books = [] }) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [tickerIndex, setTickerIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 })
  const containerRef = useRef(null)

  // Use up to 4 books for the interactive showcase
  const featured = books && books.length > 0 ? books.slice(0, 4) : []
  const activeBook = featured[activeIndex] || featured[0]

  // Auto-rotate books unless user is hovering
  useEffect(() => {
    if (isHovered || reduce || featured.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featured.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [isHovered, reduce, featured.length])

  // Cycle ticker every 4.5 seconds
  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length)
    }, 4500)
    return () => clearInterval(tickerTimer)
  }, [])

  // Pointer move handler for ambient lighting & subtle 3D card tilt
  const handlePointerMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })

    if (!reduce) {
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const tiltX = ((e.clientY - rect.top - centerY) / centerY) * -6
      const tiltY = ((e.clientX - rect.left - centerX) / centerX) * 8
      setCardTilt({ rotateX: Math.max(-10, Math.min(10, tiltX)), rotateY: Math.max(-12, Math.min(12, tiltY)) })
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`)
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

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="grain relative min-h-[920px] overflow-hidden bg-[#051329] text-white lg:min-h-screen"
    >
      {/* Dynamic Ambient Spotlight following cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(900px circle at ${mousePos.x}% ${mousePos.y}%, rgba(23, 78, 166, 0.22), rgba(67, 182, 73, 0.08) 40%, transparent 70%)`
        }}
        aria-hidden="true"
      />

      {/* Decorative Grids and Light Rings */}
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-48 top-12 h-[680px] w-[680px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(23,78,166,0.4) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-36 top-1/4 h-[750px] w-[750px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(67,182,73,0.3) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Subtle Orbital Geometry */}
      <div
        className="pointer-events-none absolute -left-20 top-24 h-[550px] w-[550px] rounded-full border border-white/[0.04]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-15%] top-[-10%] h-[900px] w-[900px] rounded-full border border-white/[0.05]"
        aria-hidden="true"
      />

      {/* Main Grid Container */}
      <div className="container-shell relative z-10 grid min-h-[880px] items-center gap-12 pb-28 pt-32 lg:min-h-screen lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-24 lg:pt-28">
        
        {/* ================= LEFT COLUMN: HERO EDITORIAL & ACTIONS ================= */}
        <div className="max-w-2xl">
          {/* Status Badge */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-white/90 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-diu-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-diu-green" />
            </span>
            <span className="tracking-wide">Spring 2026 Academic Catalog</span>
            <span className="text-white/30">•</span>
            <span className="text-blue-200">Daffodil International University</span>
          </motion.div>

          {/* Monumental Headline */}
          <div className="space-y-1">
            <div className="overflow-hidden">
              <motion.h1
                initial={reduce ? false : { y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="text-balance font-serif text-[clamp(52px,6.8vw,104px)] font-bold leading-[0.88] tracking-[-0.035em] text-white"
              >
                Publishing{' '}
                <span className="bg-gradient-to-r from-blue-200 via-emerald-200 to-white bg-clip-text text-transparent">
                  Knowledge.
                </span>
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                initial={reduce ? false : { y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="text-balance font-serif text-[clamp(52px,6.8vw,104px)] font-semibold italic leading-[0.92] tracking-[-0.035em] text-white/90"
              >
                Shaping Perspectives.
              </motion.h2>
            </div>
          </div>

          {/* Accent Line */}
          <motion.div
            initial={reduce ? false : { width: 0 }}
            animate={{ width: 84 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="my-6 h-[3px] rounded-full bg-gradient-to-r from-diu-green via-blue-400 to-transparent"
          />

          {/* Lead Paragraph */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
            className="text-base font-normal leading-relaxed text-white/70 sm:text-lg sm:leading-8"
          >
            The official scholarly imprint of Daffodil International University—championing rigorous peer-reviewed
            monographs, transformative research, and ideas that travel far beyond the lecture hall.
          </motion.p>

          {/* Interactive Quick Search Bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.65 }}
            className="mt-8"
          >
            <div className="relative flex max-w-xl items-center rounded-full border border-white/20 bg-white/[0.08] p-1.5 shadow-2xl backdrop-blur-md transition-all focus-within:border-blue-400 focus-within:bg-white/[0.12] focus-within:ring-2 focus-within:ring-blue-400/20">
              <Search className="ml-3.5 h-5 w-5 text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 120+ books, authors, ISBN, or subject..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-white/45 outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-diu-blue px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none"
              >
                Search <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Trending Discipline Tags */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-white/40">Trending Subjects:</span>
              {trendingCategories.map((cat) => (
                <Link
                  key={cat}
                  to={`/books?category=${encodeURIComponent(cat)}`}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </motion.form>

          {/* Primary Action Buttons */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.65 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/books"
              className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-slate-200/90 bg-white px-8 py-4 text-sm font-semibold text-diu-navy shadow-xl transition-all duration-300 hover:bg-blue-50 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <BookOpen className="h-4 w-4 text-diu-blue" />
              <span>Explore Publications</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/submission"
              className="group flex items-center gap-3 rounded-full border border-white/25 bg-white/[0.08] px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <FileText className="h-4 w-4 text-diu-green" />
              <span>Submit Manuscript</span>
              <ArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-100" />
            </Link>
          </motion.div>

          {/* Trust & Academic Validation Signals */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.68, duration: 0.8 }}
            className="mt-10 flex items-center gap-6 border-t border-white/10 pt-6 text-xs text-white/60"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-diu-green" />
              <span>Blind Peer-Reviewed</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-blue-300" />
              <span>Global Indexing (CrossRef / DOI)</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Award className="h-4 w-4 text-amber-300" />
              <span>180+ Contributing Scholars</span>
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE 3D BOOK SHOWCASE ================= */}
        <div
          className="relative lg:block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ambient Spotlight Behind Book Stage */}
          <div
            className="absolute left-1/2 top-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
            style={{
              background: `radial-gradient(circle, ${activeBook?.cover?.accent || '#174EA6'} 0%, rgba(7, 26, 61, 0.4) 60%, transparent 80%)`
            }}
          />

          {/* Floating Academic Badges */}
          <motion.div
            animate={reduce ? {} : { y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
            className="absolute -top-6 right-4 z-20 hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-xl backdrop-blur-md sm:flex"
          >
            <Award className="h-3.5 w-3.5 text-amber-300" />
            <span>Award-Winning Academic Press</span>
          </motion.div>

          <motion.div
            animate={reduce ? {} : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 5.4, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-4 left-0 z-20 hidden items-center gap-2 rounded-full border border-white/20 bg-diu-navy/90 px-3.5 py-1.5 text-[11px] font-medium text-white/90 shadow-xl backdrop-blur-md sm:flex"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-diu-green" />
            <span>Hardcover & Digital Open Access</span>
          </motion.div>

          {/* 3D Perspective Stage */}
          <div
            className="relative mx-auto flex h-[480px] w-full max-w-[460px] items-center justify-center sm:h-[540px]"
            style={{ perspective: 1200 }}
          >
            {/* Flanking preview cards in 3D stack */}
            {featured.map((book, idx) => {
              if (idx === activeIndex) return null
              const isPrev = (idx === (activeIndex - 1 + featured.length) % featured.length)
              const isNext = (idx === (activeIndex + 1) % featured.length)
              if (!isPrev && !isNext) return null

              return (
                <motion.div
                  key={book.id || book.slug}
                  onClick={() => setActiveIndex(idx)}
                  className="absolute cursor-pointer opacity-35 transition-opacity duration-300 hover:opacity-75"
                  style={{
                    transform: isPrev
                      ? 'translateX(-95px) translateZ(-90px) rotateY(18deg) scale(0.85)'
                      : 'translateX(95px) translateZ(-90px) rotateY(-18deg) scale(0.85)',
                    zIndex: 5
                  }}
                  whileHover={{ scale: 0.88 }}
                  title={`Switch to: ${book.title}`}
                >
                  <div className="w-[190px] xl:w-[220px]">
                    <BookCover book={book} interactive={false} />
                  </div>
                </motion.div>
              )
            })}

            {/* Active Book with 3D Tilt and Lighting Sheen */}
            {activeBook && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBook.slug}
                  initial={reduce ? false : { opacity: 0, scale: 0.92, rotateY: 15 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateX: cardTilt.rotateX,
                    rotateY: cardTilt.rotateY
                  }}
                  exit={reduce ? false : { opacity: 0, scale: 0.9, rotateY: -15 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  className="relative z-10 w-[240px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.65)] sm:w-[270px] xl:w-[295px]"
                >
                  <Link to={`/books/${activeBook.slug}`} className="group block focus:outline-none">
                    <BookCover book={activeBook} interactive={false} />

                    {/* Foil Accent Reflection Bar */}
                    <div className="pointer-events-none absolute inset-0 rounded-[3px] bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>

                  {/* 3D Realistic Ground Reflection & Shadow */}
                  <div
                    className="pointer-events-none absolute -bottom-7 left-4 right-4 h-6 rounded-full bg-black/60 blur-lg"
                    aria-hidden="true"
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Active Book Dossier Floating Card */}
          {activeBook && (
            <motion.div
              key={`dossier-${activeBook.slug}`}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-4 rounded-xl border border-white/15 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-lg sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-full bg-diu-blue/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200">
                    {activeBook.category} • {activeBook.year}
                  </span>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-white sm:text-xl line-clamp-1">
                    {activeBook.title}
                  </h3>
                  <p className="text-xs text-white/70">
                    {Array.isArray(activeBook.authors) ? activeBook.authors.join(', ') : (activeBook.authors || 'DIU Press Author')}
                  </p>
                </div>

                <Link
                  to={`/books/${activeBook.slug}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-white hover:text-diu-navy hover:-translate-y-0.5 active:translate-y-0"
                >
                  Details <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Book Description Snippet */}
              <p className="mt-2.5 text-xs leading-relaxed text-white/60 line-clamp-2">
                {activeBook.description || activeBook.abstract}
              </p>

              {/* Carousel Navigation Dots & Indicators */}
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-1.5">
                  {featured.map((b, i) => (
                    <button
                      key={b.slug}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === activeIndex
                          ? 'w-7 bg-diu-green'
                          : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                  <span className="ml-2 text-[11px] font-mono text-white/40">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevBook}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 active:translate-y-0"
                    aria-label="Previous featured book"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextBook}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 active:translate-y-0"
                    aria-label="Next featured book"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ================= BOTTOM RIBBON: LIVE TICKER & DISCOVERY PROMPT ================= */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#040e1f]/80 backdrop-blur-md">
        <div className="container-shell flex flex-col items-center justify-between gap-3 py-3.5 text-xs text-white/65 sm:flex-row sm:gap-6">
          {/* Scholarly Live Ticker */}
          <div className="flex max-w-2xl items-center gap-3 overflow-hidden">
            <span className="flex shrink-0 items-center gap-1.5 rounded bg-diu-blue/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200">
              <Bookmark className="h-3 w-3 text-diu-green" /> Press Dispatch
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="truncate font-serif text-[13px] italic tracking-wide text-white/90"
              >
                {tickerItems[tickerIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden shrink-0 items-center gap-6 text-[11px] font-semibold uppercase tracking-wider text-white/40 md:flex">
            <span>
              <strong className="text-white">120+</strong> Publications
            </span>
            <span>•</span>
            <span>
              <strong className="text-white">180+</strong> Authors
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
