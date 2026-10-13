import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Quote, Globe2, Landmark, Star, GraduationCap, Award, ShieldCheck, Calendar, PenTool, BookOpen, CheckCircle2 } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { BookOpen01Icon } from '@hugeicons/core-free-icons'
import BookCover from '../components/BookCover'
import SectionHeading from '../components/SectionHeading'
import EyebrowBadge from '../components/EyebrowBadge'
import AwesomeHero from '../components/AwesomeHero'
import { Reveal, Stagger, StaggerItem } from '../components/Motion'
import { books as fallbackBooks, news as fallbackNews, team as fallbackTeam, writers as fallbackWriters } from '../data'
import { useBooks, useNews, useTeam, useWriters } from '../hooks/useContent'
import { getMediaUrl } from '../lib/api'

const stats = [
  ['120+', 'Publications'], ['180+', 'Authors & Editors'], ['24', 'Research Areas'], ['10+', 'Years of Publishing']
]

function About() {
  return (
    <section className="section-space bg-white">
      <div className="container-shell grid gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-diu-paper p-8 sm:p-10 shadow-sm">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-diu-blue/10" />
            <img src="/brand/diu-university-logo.png" alt="Daffodil International University" className="h-auto w-full max-w-[360px] object-contain" />
            <div className="mt-10 border-t border-slate-200 pt-6">
              <div className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Institutional Affiliation</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">DIU Press is the academic publishing imprint of Daffodil International University, connecting institutional scholarship with wider audiences.</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={.08}>
          <SectionHeading eyebrow="About DIU Press" title={<>Scholarship deserves <em className="font-medium text-diu-blue">a lasting form.</em></>} body="We publish academic and professional work that is rigorous in method, clear in purpose, and relevant to the questions shaping our region and the world." />
          <div className="mt-10 grid gap-7 border-t border-slate-200 pt-8 sm:grid-cols-2">
            <div><div className="mb-3 flex items-center gap-3 text-sm font-semibold text-diu-navy"><HugeiconsIcon icon={BookOpen01Icon} size={20}/> Editorial rigor</div><p className="text-sm leading-7 text-slate-600">Thoughtful review, careful development, and publication standards built around scholarly integrity.</p></div>
            <div><div className="mb-3 flex items-center gap-3 text-sm font-semibold text-diu-navy"><Globe2 size={18}/> Regional relevance</div><p className="text-sm leading-7 text-slate-600">Ideas grounded in Bangladesh and South Asia, positioned for meaningful international exchange.</p></div>
          </div>
          <Link to="/team" className="group mt-9 inline-flex items-center gap-2 text-sm font-semibold text-diu-blue">Meet the people behind the Press <ArrowRight size={16}/></Link>
        </Reveal>
      </div>
    </section>
  )
}

function FeaturedBooks({ books = [] }) {
  const published = (books || []).filter(
    (b) => b && b.status !== 'draft' && b.status !== 'inactive' && b.status !== 'archived' && !b.needsCmsSetup
  )
  const featured = ((published.filter((b) => b.featured).length ? published.filter((b) => b.featured) : published) || []).slice(0, 3)
  return (
    <section className="section-space bg-diu-paper">
      <div className="container-shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal><SectionHeading eyebrow="Featured Publications" title="Books built to be read, cited, and remembered." body="Selected titles from across research, education, sustainability and contemporary practice." /></Reveal>
          <Reveal delay={.12}><Link to="/books" className="group inline-flex items-center gap-2 text-sm font-semibold text-diu-blue">Browse full catalogue <ArrowRight size={16}/></Link></Reveal>
        </div>
        <Stagger className="mt-14 grid gap-10 md:grid-cols-3">
          {featured.map((book) => (
            <StaggerItem key={book.slug}>
              <Link to={`/books/${book.slug}`} className="group block">
                <div className="mx-auto max-w-[300px]"><BookCover book={book}/></div>
                <div className="mt-7 border-t border-slate-200 pt-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[.15em] text-diu-blue">{book.category} • {book.year}</div>
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-diu-navy transition group-hover:text-diu-blue">{book.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{Array.isArray(book.authors) ? book.authors.join(', ') : (book.authors || 'DIU Press Author')}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="border-y border-slate-200 bg-white py-12 lg:py-16">
      <div className="container-shell grid grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">
        {stats.map(([value,label], i) => (
          <Reveal key={label} delay={i*.07} className="px-5 py-7 sm:py-4 lg:px-10">
            <div className="font-serif text-4xl font-semibold text-diu-navy sm:text-5xl">{value}</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">{label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function EditorialStatement() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061838] via-[#071A3D] to-[#0A2656] text-white pt-16 sm:pt-20 lg:pt-24 pb-0">
      {/* Editorial paper grid texture */}
      <div className="pointer-events-none absolute inset-0 paper-grid opacity-[.08]" />

      {/* Atmospheric illumination glows */}
      <div className="pointer-events-none absolute -left-24 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-0 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="container-shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-20 items-end">
          {/* Left Column: Dr. Md. Sabur Khan Portrait Touching Section Bottom */}
          <Reveal className="order-2 lg:order-1 flex items-end justify-center lg:justify-start relative">
            <div className="relative flex items-end justify-center w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px]">
              {/* Soft pedestal luminescence behind the portrait */}
              <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[75%] w-[85%] rounded-full bg-gradient-to-t from-blue-600/25 via-blue-400/10 to-transparent blur-2xl" />

              {/* Portrait image flush to the bottom */}
              <img
                src="/team/Dr. Md. Sabur Khan.png"
                alt="Dr. Md. Sabur Khan - Founder & Chairman, Daffodil International University"
                loading="lazy"
                className="relative z-10 w-full max-h-[460px] sm:max-h-[520px] lg:max-h-[570px] object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:scale-[1.015]"
              />

              {/* Discreet, elegant glassmorphic name pill anchored on portrait */}
              <div className="absolute bottom-5 left-3 sm:left-6 z-20 flex items-center gap-2.5 rounded-full border border-white/20 bg-[#071A3D]/85 px-4 py-2 shadow-2xl backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-diu-green opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-diu-green"></span>
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold tracking-tight text-white">Dr. Md. Sabur Khan</span>
                  <span className="text-[10px] font-medium text-emerald-300 uppercase tracking-wider">Chairman, DIU</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Statement, Quote & Credentials */}
          <Reveal delay={0.08} className="order-1 lg:order-2 pb-14 sm:pb-16 lg:pb-20">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <EyebrowBadge light={true} subtitle="Guiding Principle & Vision">
                  Editorial Statement
                </EyebrowBadge>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-blue-200 backdrop-blur-sm">
                  <Landmark size={12} className="text-amber-300" />
                  <span>Institutional Leadership</span>
                </span>
              </div>

              {/* Decorative quotation icon */}
              <div className="mb-3 text-blue-300/35">
                <Quote className="h-12 w-12 -scale-x-100" />
              </div>

              <blockquote className="font-serif text-[clamp(28px,3.8vw,52px)] font-medium leading-[1.12] tracking-[-0.02em] text-white">
                “Publishing is not the end of research. It is the moment knowledge <em className="font-serif italic text-blue-200">enters conversation.</em>”
              </blockquote>

              {/* Attribution & Signature block */}
              <div className="mt-10 border-t border-white/15 pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="h-10 w-1 rounded-full bg-diu-green shrink-0" />
                    <div>
                      <div className="font-serif text-lg font-bold text-white tracking-wide">
                        Dr. Md. Sabur Khan
                      </div>
                      <div className="text-xs font-medium text-white/60">
                        Founder & Chairman, Board of Trustees, Daffodil International University
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/books/sustainable-bangladesh-2041"
                    className="group inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-diu-navy hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <BookOpen size={14} className="text-diu-green group-hover:text-diu-blue" />
                    <span>View Flagship Publication</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function LatestNews({ news = [] }) {
  if (!news || !news.length) return null

  // If a post is explicitly featured, place it first; then fill up to 3 cards
  const featuredItem = news.find((n) => Boolean(n.featured))
  let displayNews = []
  if (featuredItem) {
    const others = news.filter((n) => (n.id || n._id || n.slug) !== (featuredItem.id || featuredItem._id || featuredItem.slug))
    displayNews = [featuredItem, ...others].slice(0, 3)
  } else {
    displayNews = news.slice(0, 3)
  }

  const fmtDate = (d, formatOptions) => {
    if (!d) return 'Recent'
    const parsed = new Date(d)
    return isNaN(parsed.getTime()) ? String(d) : parsed.toLocaleDateString('en-GB', formatOptions)
  }

  return (
    <section className="section-space bg-[#fcfdfd]">
      <div className="container-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div>
              <div className="mb-3">
                <EyebrowBadge subtitle="Press Releases & Dispatches">News & Updates</EyebrowBadge>
              </div>
              <h2 className="font-serif text-4xl font-bold leading-tight text-diu-navy sm:text-5xl">
                From the DIU Press
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Editorial developments, new book releases, research grants, author workshops, and institutional announcements.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Link
              to="/news"
              className="group inline-flex items-center gap-2.5 self-start rounded-full border border-slate-300 bg-white px-6 py-3.5 text-xs font-semibold text-diu-navy shadow-sm transition-all duration-300 hover:border-diu-blue hover:bg-diu-navy hover:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] lg:self-auto"
            >
              <span>Explore All Announcements</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <Stagger
          key={displayNews.map((n) => n.slug).join('-')}
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayNews.map((item) => {
            const isFeatured = Boolean(item.featured)
            return (
              <StaggerItem key={item.slug || item.id || item._id}>
                <Link
                  to={`/news/${item.slug}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-editorial focus:outline-none ${
                    isFeatured
                      ? 'border-blue-300/80 bg-gradient-to-b from-blue-50/40 via-white to-white shadow-md hover:border-diu-blue'
                      : 'border-slate-200/90 bg-white shadow-sm hover:border-diu-blue/40'
                  }`}
                >
                  {/* Photo Showcase Frame */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={getMediaUrl(item.image) || '/news/news-1.svg'}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/news/news-1.svg'
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay for Editorial Depth */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                    {/* Top Floating Badges */}
                    <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                        <span>{item.category}</span>
                      </span>
                      {isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                          <Star className="h-3 w-3 text-amber-200 fill-amber-200" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    {/* Date Pill Anchored at Bottom */}
                    <div className="absolute bottom-3 left-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-sm">
                        <Calendar className="h-3 w-3 text-diu-green" />
                        <span>{fmtDate(item.date, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h3 className="font-serif text-xl font-bold leading-snug text-diu-navy transition-colors duration-200 group-hover:text-diu-blue sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>

                    {/* Card Action Row */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-diu-blue">
                      <span className="inline-flex items-center gap-1.5">
                        <span>Read article</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        DIU Press
                      </span>
                    </div>
                  </div>

                  {/* Accent Highlight Line on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-diu-blue via-diu-green to-diu-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}

function WritersSection({ writers = [] }) {
  const displayWriters = (writers && writers.length > 0 ? writers : fallbackWriters).slice(0, 4)

  return (
    <section className="section-space border-t border-slate-200/80 bg-white">
      <div className="container-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div>
              <div className="mb-3">
                <EyebrowBadge subtitle="Authors & Scholars">Writers at DIU Press</EyebrowBadge>
              </div>
              <h2 className="font-serif text-4xl font-bold leading-tight text-diu-navy sm:text-5xl">
                Distinguished Writers & Scholars
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Meet the visionary researchers, professors, and authors whose transformative scholarship and academic publications define the DIU Press catalog.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/writers"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-diu-navy shadow-sm transition hover:border-diu-blue hover:bg-diu-navy hover:text-white"
              >
                <span>View All Writers</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* 4 Writer Cards Grid */}
        <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {displayWriters.map((writer) => {
            const count = Number(writer.bookCount) || 1
            return (
              <StaggerItem key={writer.slug || writer.id || writer._id}>
                <Link
                  to={`/writers/${writer.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-diu-blue/35 hover:shadow-editorial focus:outline-none"
                >
                  {/* Photo Showcase Frame */}
                  <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-slate-900">
                    <img
                      src={getMediaUrl(writer.image) || '/team/team-1.svg'}
                      alt={writer.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/team/team-1.svg'
                      }}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Editorial Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />

                    {/* Books Published Badge anchored at bottom */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/40 bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-diu-blue shadow-sm backdrop-blur-sm">
                        <BookOpen className="h-3.5 w-3.5 text-diu-green" />
                        <span>
                          {count} {count === 1 ? 'Book Published' : 'Books Published'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <h3 className="font-serif text-xl font-bold leading-snug text-diu-navy transition-colors group-hover:text-diu-blue">
                      {writer.name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <span className="inline-flex items-center gap-1 font-semibold text-diu-blue group-hover:translate-x-0.5 transition-transform">
                        <span>View Published Books</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-diu-blue via-diu-green to-diu-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}

function SubmissionCTA() {
  return (
    <section className="bg-diu-paper py-20 lg:py-28">
      <div className="container-shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-diu-blue px-7 py-16 text-white sm:px-12 lg:px-16 lg:py-20 shadow-editorial">
            <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full border border-white/15"/><div className="absolute right-12 top-10 h-40 w-40 rounded-full border border-white/10"/>
            <div className="relative max-w-3xl">
              <div className="mb-5">
                <EyebrowBadge light={true} subtitle="Manuscript Proposals">For Authors & Researchers</EyebrowBadge>
              </div>
              <h2 className="font-serif text-5xl font-semibold leading-[.94] sm:text-6xl lg:text-7xl">Have an idea worth publishing?</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/[.72]">Send us your manuscript or book proposal. Our editorial team will review the submission and guide suitable projects through the next stage.</p>
              <Link to="/submission" className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white px-8 py-4 text-sm font-semibold text-diu-navy shadow-lg transition-all duration-300 hover:bg-slate-100 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                <span>Submit Your Manuscript</span>
                <ArrowRight size={17}/>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function TeamPreview({ team = [] }) {
  return (
    <section className="section-space bg-[#f8fafc]">
      <div className="container-shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Our Team"
              title="Editors, scholars, and publishing professionals."
              body="A team committed to thoughtful editorial development and credible academic publishing."
            />
          </Reveal>
          <Reveal>
            <Link
              to="/team"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-diu-blue"
            >
              Meet the full team <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.slice(0, 4).map((member) => (
            <StaggerItem key={member.id || member._id || member.name}>
              <Link
                to="/team"
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-diu-blue/35 hover:shadow-editorial focus:outline-none"
              >
                {/* Photo Showcase Frame */}
                <div className="relative aspect-[4/4.1] w-full overflow-hidden bg-slate-900">
                  <img
                    src={getMediaUrl(member.image) || '/team/team-1.svg'}
                    alt={member.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/team/team-1.svg'
                    }}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Editorial Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

                  {/* Floating Top Badge */}
                  <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
                    <GraduationCap className="h-3 w-3 text-amber-300" />
                    <span>DIU Press</span>
                  </div>

                  {/* Role Badge anchored at bottom */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/40 bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-diu-blue shadow-sm backdrop-blur-sm">
                      <Award className="h-3.5 w-3.5 text-diu-green" />
                      <span>{member.role}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <h3 className="font-serif text-xl font-bold leading-snug text-diu-navy transition-colors group-hover:text-diu-blue">
                    {member.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                      <ShieldCheck className="h-3.5 w-3.5 text-diu-green" />
                      <span>Editorial Board</span>
                    </span>
                  </div>
                </div>

                {/* Hover Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-diu-blue via-diu-green to-diu-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="border-t border-slate-200 bg-diu-paper py-20">
      <div className="container-shell flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <div className="max-w-2xl">
            <div className="mb-4">
              <EyebrowBadge subtitle="Editorial Office">Connect with DIU Press</EyebrowBadge>
            </div>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-diu-navy sm:text-5xl">Questions about books, submissions, or collaborations?</h2>
          </div>
        </Reveal>
        <Reveal delay={.08}>
          <Link to="/contact" className="group inline-flex items-center gap-3 rounded-full border border-diu-navy bg-diu-navy px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-diu-blue hover:border-diu-blue hover:shadow-xl hover:shadow-diu-navy/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
            <span>Contact the Press</span>
            <ArrowUpRight size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  const remoteBooks = useBooks()
  const remoteNews = useNews()
  const remoteTeam = useTeam()
  const remoteWriters = useWriters()
  const books = remoteBooks?.length ? remoteBooks : fallbackBooks
  const news = remoteNews?.length ? remoteNews : fallbackNews
  const teamList = remoteTeam?.length ? remoteTeam : fallbackTeam
  const writersList = remoteWriters?.length ? remoteWriters : fallbackWriters
  return <><AwesomeHero books={books}/><About/><FeaturedBooks books={books}/><Stats/><EditorialStatement/><LatestNews news={news}/><WritersSection writers={writersList}/><SubmissionCTA/><TeamPreview team={teamList}/><FinalCTA/></>
}
