import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  Globe2,
  HeartHandshake,
  Landmark,
  Library,
  Lightbulb,
  ShieldCheck,
  Eye,
  Users
} from 'lucide-react'
import PageHero from '../components/PageHero'
import EyebrowBadge from '../components/EyebrowBadge'
import { Reveal, Stagger, StaggerItem } from '../components/Motion'

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Editorial Rigor & Integrity',
    description:
      'Every manuscript undergoes comprehensive screening, double-blind peer review, and academic evaluation to ensure intellectual depth and scholarly excellence.'
  },
  {
    icon: Globe2,
    title: 'Regional Grounding, Global Reach',
    description:
      'We champion research emerging from Bangladesh and South Asia while situating local insights in meaningful dialogue with international academia.'
  },
  {
    icon: Lightbulb,
    title: 'Interdisciplinary Innovation',
    description:
      'From artificial intelligence and climate resilience to entrepreneurship and indigenous literature, we publish across evolving academic disciplines.'
  },
  {
    icon: HeartHandshake,
    title: 'Author-Centric Collaboration',
    description:
      'Authors receive attentive developmental editing, bespoke cover craftsmanship, clear contract terms, and dedicated promotional support throughout.'
  }
]

const milestones = [
  {
    year: '2016',
    title: 'Foundation of DIU Press',
    description:
      'Established under the patronage of Daffodil International University to serve as a scholarly publishing imprint for faculty and higher education.'
  },
  {
    year: '2019',
    title: 'Catalogue Expansion & Peer Review Council',
    description:
      'Formalized an external editorial advisory board and launched initial monograph series in Education, Technology, and Business.'
  },
  {
    year: '2022',
    title: 'Digital Distribution & Repository Integration',
    description:
      'Introduced open-access monographs, digital DOI indexing, and expanded library consortium partnerships across the country.'
  },
  {
    year: '2026',
    title: 'Smart Publishing & Global Outreach',
    description:
      'Over 120 published titles, 180+ authors and contributors, and modern academic dissemination connecting institutional scholarship worldwide.'
  }
]

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About DIU Press"
        subtitle="Academic Imprint & Institutional Legacy"
        title="Scholarship deserves a lasting, credible form."
        body="Connecting rigorous academic inquiry with societal impact and global conversation. Discover our heritage, mission, and the editorial philosophy behind Daffodil International University Press."
      />

      {/* 1. Mission & Vision Statement */}
      <section className="section-space bg-white">
        <div className="container-shell grid gap-14 lg:grid-cols-[.95fr_1.05fr] lg:gap-20 items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-diu-paper via-white to-blue-50/30 p-8 sm:p-12 shadow-sm">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-diu-blue/10" />
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-diu-navy text-white shadow-md">
                  <Landmark className="h-6 w-6 text-diu-green" />
                </span>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-diu-blue">
                    Institutional Charter
                  </div>
                  <div className="font-serif text-xl font-bold text-diu-navy">
                    Daffodil International University
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200/80 pt-6 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  DIU Press operates as the primary academic publishing imprint of Daffodil International University, one of Bangladesh’s top-ranked private universities celebrated for its modern green smart campus, digital innovation, and research impact.
                </p>
                <p>
                  As an academic press, our objective extends beyond simple book production. We act as custodians of intellectual discovery, transforming original research and pedagogical experience into accessible, peer-reviewed texts that shape minds and policy.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-200/80 pt-6 text-center">
                <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs">
                  <div className="font-serif text-3xl font-bold text-diu-navy">120+</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Scholarly Volumes
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs">
                  <div className="font-serif text-3xl font-bold text-diu-blue">180+</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Authors & Editors
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <div className="mb-4">
                <EyebrowBadge subtitle="Our Guiding North Star">Mission & Philosophy</EyebrowBadge>
              </div>
              <h2 className="font-serif text-4xl font-bold leading-tight text-diu-navy sm:text-5xl">
                Advancing scholarship with purpose and clarity.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
                We believe that publishing is the pivotal moment when research transitions from isolated laboratories and lecture halls into active public and scientific dialogue.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-[#fbfcfd] p-5 shadow-2xs">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-diu-blue">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-diu-navy">Our Mission</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      To publish academic books, textbooks, monographs, and journals that demonstrate rigorous methodology, contribute meaningfully to global scholarship, and solve real-world development questions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-[#fbfcfd] p-5 shadow-2xs">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Eye className="h-5 w-5 text-diu-green" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-diu-navy">Our Vision</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      To stand as a beacon of academic excellence in South Asia, cultivating an inclusive, ethical publishing ecosystem for both established academics and pioneering emerging writers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Four Publishing Pillars */}
      <section className="section-space border-y border-slate-200/80 bg-diu-paper">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <EyebrowBadge subtitle="Publishing Standards">Core Pillars</EyebrowBadge>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-diu-navy sm:text-5xl">
                What sets DIU Press apart
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Four guiding benchmarks govern every manuscript, proposal, and volume bearing the DIU Press imprint.
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <StaggerItem key={pillar.title}>
                  <div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-diu-blue/40 hover:shadow-editorial">
                    <div>
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-diu-blue transition-colors duration-300 group-hover:bg-diu-navy group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-6 font-serif text-xl font-bold text-diu-navy transition-colors group-hover:text-diu-blue">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {pillar.description}
                      </p>
                    </div>
                    <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-diu-blue flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-diu-green" />
                      <span>Certified Standard</span>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </section>

      {/* 3. Historical Timeline / Milestones */}
      <section className="section-space bg-white">
        <div className="container-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <EyebrowBadge subtitle="Our Journey">Milestones & History</EyebrowBadge>
              <h2 className="mt-4 font-serif text-4xl font-bold text-diu-navy sm:text-5xl">
                A decade of scholarly dedication
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-md text-sm text-slate-600">
                From a modest departmental publishing initiative to an internationally recognized university press catalogue.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 items-stretch">
            {milestones.map((item, idx) => (
              <Reveal key={item.year} delay={idx * 0.08} className="h-full">
                <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-[#fbfcfd] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-diu-blue hover:shadow-editorial">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-3xl font-extrabold text-diu-blue">
                        {item.year}
                      </span>
                      <span className="rounded-full bg-blue-50/80 border border-blue-100/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                        Milestone 0{idx + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 font-serif text-xl font-bold leading-snug text-diu-navy min-h-[3.5rem] flex items-start">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span className="text-slate-500">DIU Press Heritage</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-diu-blue" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Editorial Leadership & Team Banner */}
      <section className="bg-diu-navy py-20 text-white lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 paper-grid opacity-[.09]" />
        <div className="container-shell relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="mb-4">
                <EyebrowBadge light={true} subtitle="Scholarly Governance">Editorial Leadership</EyebrowBadge>
              </div>
              <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                Guided by respected scholars and experienced editors.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/70">
                Our Editorial Board comprises senior academics, department heads, and distinguished visiting fellows across disciplines. They ensure impartial peer review, scholarly rigor, and intellectual relevance.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/team"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-diu-navy shadow-lg transition hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Meet Our Editorial Board</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/writers"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/10"
                >
                  <span>Writers & Authors Hub</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <div className="grid grid-cols-2 gap-6">
                  <div className="border-b border-white/10 pb-5">
                    <div className="font-serif text-3xl font-bold text-diu-green">100%</div>
                    <div className="mt-1 text-xs text-white/60">Peer-Reviewed Titles</div>
                  </div>
                  <div className="border-b border-white/10 pb-5">
                    <div className="font-serif text-3xl font-bold text-blue-200">24</div>
                    <div className="mt-1 text-xs text-white/60">Academic Disciplines</div>
                  </div>
                  <div>
                    <div className="font-serif text-3xl font-bold text-amber-200">10+</div>
                    <div className="mt-1 text-xs text-white/60">Years of Publication</div>
                  </div>
                  <div>
                    <div className="font-serif text-3xl font-bold text-emerald-300">Global</div>
                    <div className="mt-1 text-xs text-white/60">Library Indexing</div>
                  </div>
                </div>
                <div className="mt-6 border-t border-white/10 pt-5 text-xs text-white/60 leading-relaxed">
                  DIU Press adheres to the ethical publishing guidelines outlined by the Committee on Publication Ethics (COPE).
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="border-t border-slate-200 bg-diu-paper py-16 lg:py-20">
        <div className="container-shell flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-diu-blue">Connect with DIU Press</div>
            <h3 className="mt-2 font-serif text-3xl font-bold text-diu-navy">Interested in publishing or collaborating?</h3>
            <p className="mt-1 text-sm text-slate-600">Our editorial desk is always open to proposals, institutional partnerships, and academic queries.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/submission"
              className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-diu-blue transition"
            >
              Submit Manuscript
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-diu-navy shadow-sm hover:border-diu-blue transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
