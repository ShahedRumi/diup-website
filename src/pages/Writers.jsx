import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  PenTool,
  Percent,
  Search,
  ShieldCheck,
  Users,
  X
} from 'lucide-react'
import PageHero from '../components/PageHero'
import EyebrowBadge from '../components/EyebrowBadge'
import { Reveal, Stagger, StaggerItem } from '../components/Motion'
import { api, getMediaUrl } from '../lib/api'
import { writers as seedWriters } from '../data'

const authorPerks = [
  {
    icon: PenTool,
    title: 'Editorial Mentorship',
    description:
      'Authors receive attentive developmental editing, structural advice, and chapter-by-chapter polish from seasoned academic editors.'
  },
  {
    icon: ShieldCheck,
    title: 'Double-Blind Peer Review',
    description:
      'Impartial, constructive evaluation by leading subject specialists to guarantee academic rigor and citation authority.'
  },
  {
    icon: Percent,
    title: 'Competitive Royalties',
    description:
      'Clear, transparent author contracts with timely quarterly royalty disbursements and real-time distribution reporting.'
  },
  {
    icon: BookOpen,
    title: 'Global Cataloguing & DOI',
    description:
      'Every publication receives official ISBN registration, permanent digital DOI indexing, and placement across university library consortia.'
  }
]

const publishingSteps = [
  {
    step: '01',
    title: 'Proposal Submission',
    desc: 'Submit your book proposal, sample chapters, and curriculum vitae through our secure online portal.'
  },
  {
    step: '02',
    title: 'Editorial Screening',
    desc: 'Our editorial desk evaluates thematic alignment, scholarly significance, and audience demand within 2-3 weeks.'
  },
  {
    step: '03',
    title: 'Double-Blind Peer Review',
    desc: 'Two independent academic referees appraise the methodology, contribution, and completeness of the manuscript.'
  },
  {
    step: '04',
    title: 'Contract & Development',
    desc: 'Upon approval, formal publishing agreements are signed and our copyeditors work with you to refine the text.'
  },
  {
    step: '05',
    title: 'Design, Print & Distribution',
    desc: 'Bespoke cover art, typesetting, hardcopy publication, and international academic catalog distribution.'
  }
]

const faqs = [
  {
    q: 'Can I publish my revised doctoral dissertation with DIU Press?',
    a: 'Yes. We welcome proposals based on doctoral dissertations, provided the manuscript has been thoroughly revised into a coherent monograph accessible to a broader scholarly and professional readership.'
  },
  {
    q: 'How long does the peer review process take?',
    a: 'Initial desk evaluation takes approximately 2 to 3 weeks. Full double-blind peer review by external subject referees typically requires 6 to 10 weeks, after which detailed constructive feedback is shared.'
  },
  {
    q: 'Who retains the intellectual property rights to the work?',
    a: 'Authors retain the moral and intellectual copyright to their scholarship. DIU Press enters into exclusive publishing agreements to produce, distribute, and license print and digital editions.'
  },
  {
    q: 'Does DIU Press support Open Access publishing?',
    a: 'Yes! We offer flexible Open Access (OA) publishing models for monographs and edited volumes, supported by institutional grants or research fund allocations, ensuring open global availability.'
  },
  {
    q: 'What citation styles are accepted for submission?',
    a: 'We accept APA (7th ed.), IEEE, Chicago Notes & Bibliography (17th ed.), and Harvard styles, provided citation practice is consistent throughout the entire manuscript.'
  }
]

export default function Writers() {
  const [writersList, setWritersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function fetchWriters() {
      try {
        const res = await api.getWriters()
        if (isMounted) {
          if (res?.items && Array.isArray(res.items)) {
            setWritersList(res.items)
          } else {
            setWritersList(seedWriters || [])
          }
        }
      } catch {
        if (isMounted) setWritersList(seedWriters || [])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchWriters()
    return () => {
      isMounted = false
    }
  }, [])

  // Filter writers based on search query
  const filteredWriters = useMemo(() => {
    if (!searchQuery.trim()) return writersList
    const q = searchQuery.toLowerCase().trim()
    return writersList.filter(
      (w) =>
        w.name?.toLowerCase().includes(q) ||
        w.designation?.toLowerCase().includes(q) ||
        w.bio?.toLowerCase().includes(q)
    )
  }, [writersList, searchQuery])

  return (
    <>
      <PageHero
        eyebrow="Writers & Authors"
        subtitle="Distinguished Academic Minds"
        title="Scholars, thinkers, and authors publishing with DIU Press."
        body="Discover the distinguished researchers, professors, and authors contributing to peer-reviewed monographs, textbooks, and policy volumes across diverse disciplines."
      />

      {/* ================= 1. WRITERS DIRECTORY SECTION ================= */}
      <section className="section-space bg-[#f8fafc]">
        <div className="container-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <EyebrowBadge subtitle="Authors Catalogue">Writers at DIU Press</EyebrowBadge>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-diu-navy sm:text-4xl lg:text-5xl">
                Our Published Authors & Scholars
              </h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base max-w-xl">
                Explore the authors whose scholarship and literature shape higher education, sustainable development, and national progress.
              </p>
            </Reveal>

            {/* Live Search Bar */}
            <Reveal delay={0.08}>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search authors by name..."
                  className="h-11 w-full rounded-full border border-slate-300 bg-white pl-10 pr-10 text-xs text-slate-800 shadow-sm outline-none transition focus:border-diu-blue focus:ring-2 focus:ring-blue-100"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </Reveal>
          </div>

          {/* Writers Grid */}
          {loading ? (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : filteredWriters.length > 0 ? (
            <Stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredWriters.map((writer) => {
                const count = Number(writer.bookCount) || 1
                return (
                  <StaggerItem key={writer.id || writer._id || writer.slug}>
                    <Link
                      to={`/writers/${writer.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-diu-blue/40 hover:shadow-editorial focus:outline-none"
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

                        {/* Books Count Pill anchored at bottom */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-diu-blue shadow-sm backdrop-blur-sm">
                            <BookOpen className="h-3.5 w-3.5 text-diu-green" />
                            <span>
                              {count} {count === 1 ? 'Book Published' : 'Books Published'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <h3 className="font-serif text-xl font-bold leading-snug text-diu-navy transition-colors group-hover:text-diu-blue">
                            {writer.name}
                          </h3>
                          <p className="mt-1.5 text-xs font-medium text-slate-500 line-clamp-2">
                            {writer.designation || 'Academic Author & Researcher'}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                          <span className="inline-flex items-center gap-1 font-semibold text-diu-blue group-hover:translate-x-0.5 transition-transform">
                            <span>View Profile & Books</span>
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
          ) : (
            <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Users className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 font-serif text-xl font-bold text-diu-navy">No Authors Found</h3>
              <p className="mt-1 text-xs text-slate-500">
                No published writers matched "{searchQuery}". Try a different name or clear the search filter.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-diu-navy px-5 py-2 text-xs font-semibold text-white transition hover:bg-diu-blue"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= 2. WHY PUBLISH WITH US ================= */}
      <section className="section-space bg-white">
        <div className="container-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <EyebrowBadge subtitle="The Author Advantage">Why Publish With DIU Press</EyebrowBadge>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-diu-navy sm:text-5xl">
                Dedicated to your intellectual journey
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-md text-sm text-slate-600">
                We believe author collaboration is an enduring partnership. From initial prospectus to final printed volume, we invest in your success.
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {authorPerks.map((perk) => {
              const Icon = perk.icon
              return (
                <StaggerItem key={perk.title}>
                  <div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-[#fbfcfd] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-diu-blue/40 hover:bg-white hover:shadow-editorial">
                    <div>
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-diu-blue transition-colors duration-300 group-hover:bg-diu-navy group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-6 font-serif text-xl font-bold text-diu-navy transition-colors group-hover:text-diu-blue">
                        {perk.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {perk.description}
                      </p>
                    </div>
                    <div className="mt-6 border-t border-slate-200/60 pt-4 text-xs font-semibold text-diu-blue flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-diu-green" />
                      <span>Guaranteed Standard</span>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </section>

      {/* ================= 3. PUBLISHING ROADMAP ================= */}
      <section className="section-space border-y border-slate-200/80 bg-diu-paper">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <EyebrowBadge subtitle="From Proposal to Press">The Author's Journey</EyebrowBadge>
              <h2 className="mt-4 font-serif text-4xl font-bold text-diu-navy sm:text-5xl">
                A transparent, supportive publication process
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Our 5-stage publishing roadmap ensures your manuscript receives rigorous evaluation while keeping you informed at every milestone.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {publishingSteps.map((step, idx) => (
              <Reveal key={step.step} delay={idx * 0.07}>
                <div className="relative flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-black text-diu-blue/60">{step.step}</span>
                      <span className="h-2 w-2 rounded-full bg-diu-green" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-bold text-diu-navy">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Stage {idx + 1} of 5
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-14 rounded-3xl bg-diu-navy p-8 text-center text-white shadow-xl sm:p-10">
            <h3 className="font-serif text-2xl font-bold sm:text-3xl">
              Ready to submit your manuscript or book proposal?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-300">
              Submit your curriculum vitae, prospectus, and sample chapters directly through our secure manuscript portal.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/submission"
                className="inline-flex items-center gap-2 rounded-full bg-diu-blue px-6 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-blue-600"
              >
                <span>Submit Manuscript Proposal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <span>Contact Editorial Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. FAQS ================= */}
      <section className="section-space bg-white">
        <div className="container-shell max-w-4xl">
          <div className="text-center">
            <EyebrowBadge subtitle="Help & Information">Author FAQs</EyebrowBadge>
            <h2 className="mt-3 font-serif text-3xl font-bold text-diu-navy sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-slate-200 transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="flex w-full items-center justify-between bg-slate-50/60 p-5 text-left text-sm font-bold text-diu-navy hover:bg-slate-100/70"
                >
                  <span>{faq.q}</span>
                  <span className="text-diu-blue">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="border-t border-slate-200 bg-white p-5 text-xs leading-relaxed text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
