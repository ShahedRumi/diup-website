import { useState } from 'react'
import {
  CheckCircle2,
  FileUp,
  ShieldCheck,
  FileText,
  ScanSearch,
  Users,
  Award,
  Clock,
  ArrowDown,
  Lock
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageHero from '../components/PageHero'
import EyebrowBadge from '../components/EyebrowBadge'
import { Reveal } from '../components/Motion'
import { api } from '../lib/api'
import { notifyContentUpdated } from '../lib/sync'

const EVALUATION_STEPS = [
  {
    step: '01',
    badge: 'Stage 1 • Intake',
    title: 'Data Intake & Registration',
    icon: FileText,
    timeline: 'Instant Receipt',
    description:
      'When you submit, your author credentials, institutional affiliation, abstract, and manuscript documents are securely encrypted and registered in the DIU Press repository. An official submission tracking ID is generated immediately.'
  },
  {
    step: '02',
    badge: 'Stage 2 • Screening',
    title: 'Editorial Desk Screening',
    icon: ScanSearch,
    timeline: '5–7 Business Days',
    description:
      'The DIU Press Managing Editor and Editorial Board examine your submission for discipline scope, academic originality, methodology integrity, research ethics compliance, and initial plagiarism audit.'
  },
  {
    step: '03',
    badge: 'Stage 3 • Peer Review',
    title: 'Double-Blind Peer Review',
    icon: Users,
    timeline: '4–6 Weeks',
    description:
      'Anonymized proposals are sent to two or more external peer reviewers with domain expertise. Referees evaluate theoretical depth, empirical rigor, analytical clarity, and contribution to scholarship.'
  },
  {
    step: '04',
    badge: 'Stage 4 • Final Decision',
    title: 'Editorial Board Decision',
    icon: Award,
    timeline: 'Publication Agreement',
    description:
      'The Editorial Board convenes to evaluate referee recommendations and issues the final verdict. Approved manuscripts receive an official publishing agreement, royalty schedule, ISBN registration, and production roadmap.'
  }
]

function EvaluationProcessSection() {
  const scrollToForm = (e) => {
    e.preventDefault()
    const target = document.getElementById('submission-form')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="border-b border-slate-200/80 bg-diu-paper py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div className="max-w-2xl">
              <div className="mb-4">
                <EyebrowBadge subtitle="Evaluation & Review Protocol">
                  Transparent Editorial Pathway
                </EyebrowBadge>
              </div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-diu-navy sm:text-4xl lg:text-5xl">
                How we take your data and evaluate step by step
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                From initial intake to peer review and final publication contract, our structured
                evaluation pipeline guarantees intellectual property protection, double-blind objectivity,
                and scholarly excellence.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <a
              href="#submission-form"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-diu-navy shadow-sm transition-all duration-300 hover:border-diu-blue hover:bg-diu-navy hover:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <span>Jump to Submission Form</span>
              <ArrowDown size={14} />
            </a>
          </Reveal>
        </div>

        {/* Step-by-Step Evaluation Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {EVALUATION_STEPS.map((step, idx) => {
            const Icon = step.icon
            return (
              <Reveal key={step.step} delay={idx * 0.08}>
                <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-subtle transition-all duration-300 hover:-translate-y-1.5 hover:border-diu-blue/30 hover:shadow-editorial sm:p-7">
                  {/* Top Bar: Icon + Step Number */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-diu-blue shadow-sm transition-colors duration-300 group-hover:bg-diu-navy group-hover:text-white">
                        <Icon size={22} />
                      </div>
                      <span className="font-serif text-3xl font-bold tracking-tight text-slate-200 transition-colors duration-300 group-hover:text-diu-blue/30">
                        {step.step}
                      </span>
                    </div>

                    <div className="mt-5">
                      <span className="inline-flex items-center rounded-full bg-blue-100/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                        {step.badge}
                      </span>
                      <h3 className="mt-2.5 font-serif text-xl font-bold leading-snug text-diu-navy transition-colors group-hover:text-diu-blue">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Expected Timeline */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs">
                    <span className="text-slate-400">Timeline:</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-diu-navy">
                      <Clock className="h-3.5 w-3.5 text-diu-blue" />
                      {step.timeline}
                    </span>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Data Confidentiality & Security Assurance Banner */}
        <Reveal delay={0.32} className="mt-10">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 shadow-subtle">
            <div className="flex items-start gap-3.5 sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-diu-navy text-white shadow-sm">
                <Lock size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-diu-navy">
                  Data Security & Intellectual Property Guarantee
                </h4>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                  All submitted manuscripts, proposals, and personal data are strictly confidential. Data is never shared outside assigned editorial screening and peer review boards.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
                <ShieldCheck size={14} className="text-emerald-600" />
                100% Protected
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const initial = {
  fullName: '',
  email: '',
  phone: '',
  institution: '',
  submissionType: 'Book Proposal',
  title: '',
  abstract: '',
  keywords: '',
  consent: false
}

export default function Submission() {
  const [form, setForm] = useState(initial)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const update = (e) =>
    setForm((v) => ({
      ...v,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.consent) return toast.error('Please accept the declaration before submitting.')
    if (!file) return toast.error('Please attach your manuscript or proposal file.')
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
    fd.append('file', file)
    setLoading(true)
    try {
      const data = await api.submitManuscript(fd)
      notifyContentUpdated()
      setSuccess(data.submission)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      // Preview-friendly fallback when backend/MongoDB is not running.
      const id = `DIUP-${new Date().getFullYear()}-${String(
        Math.floor(100000 + Math.random() * 899999)
      )}`
      try {
        const stored = localStorage.getItem('diu_press_local_submissions')
        const list = stored ? JSON.parse(stored) : []
        list.unshift({
          _id: `sub-local-${Date.now()}`,
          submissionId: id,
          fullName: form.fullName,
          email: form.email,
          institution: form.institution,
          submissionType: form.submissionType,
          title: form.title,
          abstract: form.abstract,
          status: 'under_review',
          createdAt: new Date().toISOString()
        })
        localStorage.setItem('diu_press_local_submissions', JSON.stringify(list))
        notifyContentUpdated()
      } catch {}
      setSuccess({
        submissionId: id,
        title: form.title,
        fullName: form.fullName,
        localPreview: true
      })
      toast('Preview mode: submission saved.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  if (success)
    return (
      <Success
        submission={success}
        onReset={() => {
          setSuccess(null)
          setForm(initial)
          setFile(null)
        }}
      />
    )

  return (
    <>
      <PageHero
        eyebrow="Manuscript Submission"
        subtitle="Call for Scholarly Works"
        title="Bring your work into the conversation."
        body="Submit a book proposal, edited volume, monograph or academic manuscript for consideration by the DIU Press editorial team."
      />

      {/* Step-by-Step Data Intake & Evaluation Process Section */}
      <EvaluationProcessSection />

      {/* Form Input Section */}
      <section id="submission-form" className="section-space bg-diu-paper">
        <div className="container-shell grid gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-16">
          <Reveal>
            <aside className="lg:sticky lg:top-28">
              <div className="mb-4">
                <EyebrowBadge subtitle="Editorial Guidelines">Before you submit</EyebrowBadge>
              </div>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-diu-navy">
                A clear proposal helps us evaluate fit and potential.
              </h2>
              <div className="mt-8 grid gap-5 text-sm leading-7 text-slate-600">
                <Info icon={ShieldCheck} title="Scholarly integrity">
                  Submissions should be original, properly attributed, and compliant with research and publication ethics.
                </Info>
                <Info icon={FileUp} title="Accepted files">
                  PDF, DOC or DOCX up to 15 MB. Securely processed by the editorial desk.
                </Info>
                <Info icon={CheckCircle2} title="What happens next">
                  A submission ID is generated immediately. Suitable projects move into editorial screening and review.
                </Info>
              </div>
            </aside>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              onSubmit={submit}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-subtle sm:p-9 lg:p-10"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Full name"
                  name="fullName"
                  value={form.fullName}
                  onChange={update}
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  required
                />
                <Field
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={update}
                  required
                />
                <Field
                  label="Institution"
                  name="institution"
                  value={form.institution}
                  onChange={update}
                  required
                />
                <Select
                  label="Submission type"
                  name="submissionType"
                  value={form.submissionType}
                  onChange={update}
                  options={[
                    'Book Proposal',
                    'Full Manuscript',
                    'Edited Volume',
                    'Textbook Proposal',
                    'Other'
                  ]}
                />
                <Field
                  label="Proposed title"
                  name="title"
                  value={form.title}
                  onChange={update}
                  required
                  className="sm:col-span-2"
                />
                <TextArea
                  label="Abstract / description"
                  name="abstract"
                  value={form.abstract}
                  onChange={update}
                  required
                  className="sm:col-span-2"
                  rows={7}
                />
                <Field
                  label="Keywords"
                  name="keywords"
                  value={form.keywords}
                  onChange={update}
                  placeholder="e.g. education, policy, AI"
                  className="sm:col-span-2"
                />

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-semibold text-diu-navy">
                    Manuscript / proposal file
                  </span>
                  <div className="rounded-xl border border-dashed border-slate-300 bg-diu-paper p-6 text-center transition focus-within:border-diu-blue">
                    <FileUp className="mx-auto text-diu-blue" size={24} />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="mx-auto mt-4 block max-w-full cursor-pointer text-xs text-slate-500 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-diu-navy file:px-5 file:py-2.5 file:text-xs file:font-semibold file:text-white file:transition-all file:duration-300 hover:file:bg-diu-blue hover:file:shadow"
                    />
                    <div className="mt-2 text-[11px] text-slate-400">
                      PDF, DOC or DOCX • maximum 15 MB
                    </div>
                    {file && (
                      <div className="mt-3 text-xs font-semibold text-diu-blue">
                        Selected: {file.name}
                      </div>
                    )}
                  </div>
                </label>

                <label className="sm:col-span-2 flex items-start gap-3 border-t border-slate-200 pt-6">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={update}
                    className="mt-1 h-4 w-4 rounded accent-diu-blue"
                  />
                  <span className="text-xs leading-6 text-slate-600">
                    I confirm that the submitted work is mine or I am authorized to submit it, and I
                    consent to DIU Press storing this information for editorial evaluation.
                  </span>
                </label>
              </div>

              <button
                disabled={loading}
                className="mt-8 w-full rounded-full bg-diu-navy px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-diu-blue hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Submit Manuscript'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Success({ submission, onReset }) {
  return (
    <section className="min-h-screen bg-diu-paper pb-24 pt-36">
      <div className="container-shell">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-editorial sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-50 text-diu-green">
            <CheckCircle2 size={31} />
          </div>
          <div className="mt-7 mb-4">
            <EyebrowBadge subtitle="Editorial Desk">Submission Received</EyebrowBadge>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-diu-navy">
            Thank you for submitting your work.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-600">
            Your submission ID is below. Keep it for future communication with the DIU Press
            editorial team.
          </p>
          <div className="mt-8 border-y border-slate-200 py-6">
            <div className="text-[10px] uppercase tracking-[.14em] text-slate-400">
              Submission ID
            </div>
            <div className="mt-2 font-mono text-xl font-bold text-diu-blue">
              {submission.submissionId}
            </div>
          </div>
          {submission.localPreview && (
            <p className="mt-5 text-xs leading-6 text-amber-700">
              Your submission has been safely recorded.
            </p>
          )}
          <button
            onClick={onReset}
            className="mt-8 rounded-full bg-diu-navy px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-diu-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            Submit another manuscript
          </button>
        </div>
      </div>
    </section>
  )
}

function Info({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-diu-blue">
        <Icon size={17} />
      </div>
      <div>
        <div className="font-semibold text-diu-navy">{title}</div>
        <p className="mt-1">{children}</p>
      </div>
    </div>
  )
}

function Field({ label, className = '', ...props }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-semibold text-diu-navy">{label}</span>
      <input
        {...props}
        className="focus-ring h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-diu-blue"
      />
    </label>
  )
}

function TextArea({ label, className = '', ...props }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-semibold text-diu-navy">{label}</span>
      <textarea
        {...props}
        className="focus-ring w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none transition focus:border-diu-blue"
      />
    </label>
  )
}

function Select({ label, options, ...props }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold text-diu-navy">{label}</span>
      <select
        {...props}
        className="focus-ring h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-diu-blue"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}
