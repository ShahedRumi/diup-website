import { useState, useMemo } from 'react'
import {
  Mail,
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  BookOpen,
  Filter
} from 'lucide-react'
import PageHero from '../components/PageHero'
import EyebrowBadge from '../components/EyebrowBadge'
import { Reveal, Stagger, StaggerItem } from '../components/Motion'
import { useTeam } from '../hooks/useContent'
import { getMediaUrl } from '../lib/api'

export default function Team() {
  const team = useTeam()
  const [selectedRole, setSelectedRole] = useState('All')

  // Extract unique roles for quick filtering
  const roles = useMemo(() => {
    return ['All', ...new Set(team.map((m) => m.role))]
  }, [team])

  const filteredTeam = useMemo(() => {
    if (selectedRole === 'All') return team
    return team.filter((m) => m.role === selectedRole)
  }, [team, selectedRole])

  return (
    <>
      <PageHero
        eyebrow="Our Team"
        subtitle="Academic & Editorial Leadership"
        title="The scholars & editors shaping our list."
        body="Editorial leadership, peer-review advisors, and publishing professionals committed to rigorous academic evaluation and impactful dissemination."
      />

      {/* Main Team Showcase Section */}
      <section className="min-h-screen bg-[#f8fafc] py-16 lg:py-24">
        <div className="container-shell">
          
          {/* Header Bar with Role Filter Pills */}
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-diu-blue">
                <Users className="h-4 w-4" />
                <span>Editorial Board & Production Staff</span>
              </div>
              <h2 className="mt-1 font-serif text-3xl font-bold text-diu-navy">
                Meet the Editorial Collective
              </h2>
            </div>

            {/* Role Filter Tabs */}
            {roles.length > 2 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 pr-1 text-xs font-semibold text-slate-400">
                  <Filter className="h-3.5 w-3.5" /> Filter:
                </span>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                      selectedRole === r
                        ? 'bg-diu-navy text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Separated Premium Cards Grid */}
          <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTeam.map((member) => (
              <StaggerItem key={member.id || member._id || member.name}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-diu-blue/35 hover:shadow-editorial">
                  
                  {/* Top Photo Frame */}
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

                    {/* Refined gradient overlay for editorial depth */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

                    {/* Floating Prestige Badge */}
                    <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
                      <GraduationCap className="h-3 w-3 text-amber-300" />
                      <span>DIU Press</span>
                    </div>

                    {/* Role badge anchored at bottom of portrait */}
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

                    {/* Card Footer */}
                    <div className="mt-3.5 flex items-center justify-between text-xs">
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition-colors hover:text-diu-blue"
                          title={`Email ${member.name}`}
                        >
                          <Mail className="h-3.5 w-3.5 text-diu-blue" />
                          <span className="truncate max-w-[170px]">{member.email}</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                          <ShieldCheck className="h-3.5 w-3.5 text-diu-green" />
                          <span>Editorial Board</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Accent Highlight Line on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-diu-blue via-diu-green to-diu-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Editorial Standards & Collaboration Charter */}
      <section className="border-t border-slate-200 bg-white py-20 lg:py-24">
        <div className="container-shell">
          <div className="grid gap-12 rounded-3xl border border-slate-200/90 bg-diu-paper p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:p-14 shadow-sm">
            <Reveal>
              <div className="mb-4">
                <EyebrowBadge subtitle="DIU Press Principles">Academic Commitment</EyebrowBadge>
              </div>
              <h2 className="font-serif text-4xl font-bold leading-tight text-diu-navy sm:text-5xl">
                Careful publishing is a collaborative practice.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate-600">
                Our editorial process is designed around intellectual rigor, scholarly contribution, ethical review,
                and respectful author collaboration. We bring subject experts, proofreaders, and indexers together to
                elevate every title.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-diu-blue">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-diu-navy">Peer-Review Integrity</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Double-blind peer review protocols applied to all monographs and research volumes.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-diu-green">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-diu-navy">Author Support</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Dedicated developmental editors assisting manuscripts from draft through indexation.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-diu-navy">Global Standards</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    CrossRef registered DOIs, open-access licensing, and library catalogue syndication.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-diu-navy">Regional Impact</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Championing South Asian scholarship with enduring international relevance.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
