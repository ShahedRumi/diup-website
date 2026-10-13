import { useState, useEffect, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Hash,
  Tag,
  ShoppingBag,
  ChevronDown,
  ArrowUpRight,
  X,
  ExternalLink
} from 'lucide-react'
import BookCover from '../components/BookCover'
import EyebrowBadge from '../components/EyebrowBadge'
import { Reveal } from '../components/Motion'
import { books as fallbackBooks } from '../data'
import { useBook } from '../hooks/useContent'

function ReadSlightlyModal({ isOpen, onClose, book, onOpenPurchase }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !book) return null

  const excerpt = book.sampleExcerpt || {
    chapter: 'Introductory Context & Research Scope',
    pages: 'Sample Preview',
    quote: book.description || book.abstract,
    paragraphs: [
      book.abstract || book.description || 'This publication brings together high-caliber academic scholarship under DIU Press.',
      'The opening chapters examine theoretical frameworks, empirical methodologies, and systemic transformations relevant to contemporary South Asian and global discourses.',
      'Through detailed case studies, primary data analyses, and rigorous editorial standards, this volume establishes a lasting foundation for researchers, faculty, and industry practitioners.'
    ]
  }

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Read book preview"
        className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#071A3D]/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-2xl"
        >
          {/* Top Brand Accent Line */}
          <div className="h-[3px] w-full bg-gradient-to-r from-diu-blue via-diu-green to-diu-navy" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-diu-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-diu-green" />
              </span>
              <span className="font-serif text-sm font-bold tracking-tight text-diu-navy">
                Sample Excerpt & Reader Preview
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-diu-blue">
                {book.category}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
              aria-label="Close reader"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Reader Content Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>{excerpt.pages || 'Preview Excerpt'}</span>
                <span>DIU Press • {book.year || '2026'}</span>
              </div>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold leading-tight text-diu-navy">
                {book.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                By {Array.isArray(book.authors) ? book.authors.join(', ') : (book.authors || 'DIU Press Author')}
              </p>
            </div>

            {/* Official PDF Sample Preview Link if configured */}
            {book.previewPdf && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-diu-blue/30 bg-blue-50/70 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-diu-blue text-white shadow-xs">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-diu-navy text-xs sm:text-sm">Digital PDF Reader Sample Available</div>
                    <div className="text-[11px] text-slate-500">Read official excerpt, preface & sample chapters in PDF</div>
                  </div>
                </div>
                <a
                  href={book.previewPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-diu-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-600 transition hover:-translate-y-0.5 shrink-0"
                >
                  <span>Open PDF Reader</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            {/* Chapter Heading */}
            <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                Selected Reading
              </span>
              <h3 className="mt-1 font-serif text-lg font-bold text-diu-navy">
                {excerpt.chapter}
              </h3>
            </div>

            {/* Quote Callout */}
            {excerpt.quote && (
              <blockquote className="border-l-4 border-diu-blue pl-4 py-2 italic font-serif text-base sm:text-lg text-slate-700 leading-relaxed bg-slate-50/60 rounded-r-lg">
                {excerpt.quote}
              </blockquote>
            )}

            {/* Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700">
              {(excerpt.paragraphs || []).map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Publication metadata snippet */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-diu-navy">Publication Details:</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div><span className="text-slate-400">Pages:</span> {book.pages || 'N/A'}</div>
                <div><span className="text-slate-400">Binding:</span> {book.format || 'Hardcover'}</div>
                <div><span className="text-slate-400">Language:</span> {book.language || 'English'}</div>
                <div><span className="text-slate-400">ISBN:</span> {book.isbn || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Modal Footer Call to Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <div className="text-xs text-slate-500">
              Want to read the complete publication? Available across authorized bookstores.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenPurchase()
                }}
                className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-diu-blue transition hover:-translate-y-0.5"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Purchase Full Book</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default function BookDetail() {
  const { slug } = useParams()
  const { item: book, loading } = useBook(slug)
  const [showPurchaseOptions, setShowPurchaseOptions] = useState(false)
  const [showSampleModal, setShowSampleModal] = useState(false)

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-diu-navy text-white">
        Loading publication…
      </div>
    )
  }

  if (!book || book.status === 'draft' || book.status === 'inactive' || book.status === 'archived' || book.needsCmsSetup) {
    return <Navigate to="/books" replace />
  }

  const authorsList = Array.isArray(book.authors)
    ? book.authors
    : typeof book.authors === 'string'
      ? book.authors.split(',').map((a) => a.trim()).filter(Boolean)
      : []
  const authorsText = authorsList.length > 0 ? authorsList.join(' & ') : 'DIU Press Author'

  const keywordsList = Array.isArray(book.keywords)
    ? book.keywords
    : typeof book.keywords === 'string'
      ? book.keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : []

  const related = fallbackBooks
    .filter((b) => b.slug !== slug && b.category === book.category)
    .slice(0, 2)

  // Calculate discount if applied
  const hasDiscount = Boolean(book.originalPrice && book.originalPrice > book.price)
  const discountPercent = hasDiscount
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : book.discountPercent || null

  // 4 E-Commerce Channels where this book is sold
  const ecommerceChannels = [
    {
      id: 'rokomari',
      name: 'Rokomari',
      subtext: "Bangladesh's largest online bookshop",
      badge: 'Home Delivery',
      badgeBg: 'bg-orange-500/20 text-orange-200 border-orange-400/30',
      url:
        book.ecommerceLinks?.rokomari ||
        `https://www.rokomari.com/search?term=${encodeURIComponent(book.title)}`,
    },
    {
      id: 'wafilife',
      name: 'Wafilife',
      subtext: 'Academic & research book market',
      badge: 'Verified Stock',
      badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
      url:
        book.ecommerceLinks?.wafilife ||
        `https://www.wafilife.com/?s=${encodeURIComponent(book.title)}&post_type=product`,
    },
    {
      id: 'boibazar',
      name: 'Boibazar',
      subtext: 'Nationwide parcel & cash on delivery',
      badge: 'Cash on Delivery',
      badgeBg: 'bg-red-500/20 text-red-200 border-red-400/30',
      url:
        book.ecommerceLinks?.boibazar ||
        `https://www.boibazar.com/search?q=${encodeURIComponent(book.title)}`,
    },
    {
      id: 'amazon',
      name: 'Amazon Global',
      subtext: 'International delivery & overseas orders',
      badge: 'Worldwide',
      badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
      url:
        book.ecommerceLinks?.amazon ||
        `https://www.amazon.com/s?k=${encodeURIComponent(`${book.title} ${book.isbn || 'DIU Press'}`)}`,
    },
  ]

  return (
    <>
      <section className="bg-diu-navy pb-20 pt-36 text-white lg:pb-28 lg:pt-44">
        <div className="container-shell">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.14em] text-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            <ArrowLeft size={15} /> Back to catalogue
          </Link>
          <div className="mt-10 grid gap-12 lg:grid-cols-[360px_1fr] lg:items-start xl:gap-20">
            <Reveal>
              <div className="mx-auto max-w-[330px]">
                <BookCover book={book} interactive={false} />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mb-5">
                <EyebrowBadge light={true} subtitle={`${book.year || '2026'} • ${book.type || 'Monograph'}`}>
                  {book.category}
                </EyebrowBadge>
              </div>
              <h1 className="font-serif text-5xl font-semibold leading-[.92] sm:text-6xl lg:text-7xl">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="mt-5 max-w-2xl font-serif text-2xl italic text-white/[.58]">
                  {book.subtitle}
                </p>
              )}
              <div className="mt-6 text-sm text-white/[.68]">
                By <span className="font-semibold text-white">{authorsText}</span>
              </div>

              {/* Price Banner with Discount Tag */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                {book.price ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        ৳{book.price}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg sm:text-xl font-normal text-white/50 line-through">
                          ৳{book.originalPrice}
                        </span>
                      )}
                    </div>

                    {hasDiscount && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30 shadow-xs">
                        <Tag className="h-3 w-3" />
                        <span>{discountPercent}% OFF</span>
                      </span>
                    )}

                    <span className="text-xs text-white/60">
                      • {book.format || 'Hardcover'} Edition
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Open Access Publication</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Read Slightly & Purchase */}
              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowSampleModal(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                  <BookOpen className="h-4 w-4 text-emerald-300" />
                  <span>Read Slightly</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPurchaseOptions((prev) => !prev)}
                  className="inline-flex items-center gap-2.5 rounded-full bg-diu-blue px-7 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-diu-blue/30 transition-all duration-300 hover:bg-blue-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Purchase</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      showPurchaseOptions ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* 4 E-Commerce Channels Container (Revealed upon clicking Purchase) */}
              <AnimatePresence>
                {showPurchaseOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-4 sm:p-5 backdrop-blur-md shadow-2xl">
                      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-diu-green opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-diu-green" />
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                            Available On Authorized E-Commerce Platforms
                          </span>
                        </div>
                        <span className="text-[11px] text-white/50">
                          Click to open book on store
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {ecommerceChannels.map((channel) => (
                          <a
                            key={channel.id}
                            href={channel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] p-3.5 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.12] hover:-translate-y-0.5"
                          >
                            <div className="min-w-0 pr-3">
                              <div className="flex items-center gap-2">
                                <span className="font-serif text-base font-bold text-white group-hover:text-blue-200 transition-colors">
                                  {channel.name}
                                </span>
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${channel.badgeBg}`}
                                >
                                  {channel.badge}
                                </span>
                              </div>
                              <p className="mt-1 truncate text-xs text-white/60">
                                {channel.subtext}
                              </p>
                            </div>

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all group-hover:bg-diu-blue group-hover:text-white group-hover:scale-105">
                              <ArrowUpRight className="h-4 w-4" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Publication Specs Meta Bar */}
              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-4">
                <Meta icon={Hash} label="ISBN" value={book.isbn || 'N/A'} />
                <Meta icon={CalendarDays} label="Published" value={book.year || '2026'} />
                <Meta icon={BookOpen} label="Pages" value={book.pages || 'N/A'} />
                <Meta icon={Tag} label="Price" value={book.price ? `৳${book.price}` : 'Open Access'} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <section className="section-space bg-white">
        <div className="container-shell grid gap-14 lg:grid-cols-[1fr_320px] lg:gap-20">
          <Reveal>
            <div className="mb-4">
              <EyebrowBadge subtitle="DIU Press Monograph">About this book</EyebrowBadge>
            </div>
            <h2 className="font-serif text-4xl font-semibold text-diu-navy">A closer look</h2>
            <p className="mt-7 text-lg leading-9 text-slate-700">{book.description || book.abstract}</p>
            {book.abstract && book.description && (
              <p className="mt-6 text-base leading-8 text-slate-600">{book.abstract}</p>
            )}
            {keywordsList.length > 0 && (
              <div className="mt-9 flex flex-wrap gap-2">
                {keywordsList.map((k) => (
                  <span
                    key={k}
                    className="rounded-lg border border-slate-200 bg-diu-paper px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
          </Reveal>
          <Reveal delay={0.08}>
            <aside className="overflow-hidden rounded-2xl border border-slate-200/90 border-t-4 border-t-diu-blue bg-diu-paper p-7 shadow-sm">
              <div className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">
                Publication details
              </div>
              <dl className="mt-5 divide-y divide-slate-200 text-sm">
                <Detail label="Publisher" value="DIU Press" />
                <Detail label="Type" value={book.type || 'Monograph'} />
                <Detail label="Format" value={book.format || 'Paperback'} />
                <Detail label="Price" value={book.price ? `৳${book.price}` : 'Open Access'} />
                <Detail label="Edition" value={book.edition || '1st Edition'} />
                <Detail label="Year" value={book.year || '2026'} />
                <Detail label="Language" value={book.language || 'English'} />
                <Detail label="ISBN" value={book.isbn || 'N/A'} />
              </dl>
              <Link
                to="/contact"
                className="mt-7 flex items-center justify-between rounded-full bg-diu-navy px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-900 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                Enquire about this title <ArrowRight size={16} />
              </Link>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Related Publications */}
      {related.length > 0 && (
        <section className="bg-diu-paper py-20">
          <div className="container-shell">
            <div className="mb-4">
              <EyebrowBadge subtitle="Similar Works">Related Publications</EyebrowBadge>
            </div>
            <h2 className="font-serif text-4xl font-semibold text-diu-navy">More works in this category</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {related.map((b) => (
                <Link
                  key={b.slug}
                  to={`/books/${b.slug}`}
                  className="group grid grid-cols-[130px_1fr] gap-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-editorial hover:border-diu-blue/30"
                >
                  <BookCover book={b} />
                  <div className="self-center">
                    <div className="text-[9px] font-semibold uppercase tracking-[.14em] text-diu-blue">
                      {b.category}
                    </div>
                    <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-diu-navy group-hover:text-diu-blue">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {Array.isArray(b.authors) ? b.authors.join(', ') : (b.authors || 'DIU Press')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Read Slightly Sample Modal */}
      <ReadSlightlyModal
        isOpen={showSampleModal}
        onClose={() => setShowSampleModal(false)}
        book={book}
        onOpenPurchase={() => {
          setShowPurchaseOptions(true)
          window.scrollTo({ top: 300, behavior: 'smooth' })
        }}
      />
    </>
  )
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="bg-white/[.035] p-4">
      <Icon size={16} className="text-diu-green" />
      <div className="mt-3 text-[9px] uppercase tracking-[.13em] text-white/[.38]">{label}</div>
      <div className="mt-1 text-xs font-medium text-white/75">{value}</div>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-3.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-diu-navy">{value}</dd>
    </div>
  )
}
