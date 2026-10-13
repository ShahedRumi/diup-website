import { useState, useEffect } from 'react'
import { Mail, MapPin, Phone, ArrowUpRight, Send, CheckCircle2, X, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import EyebrowBadge from '../components/EyebrowBadge'
import { Reveal } from '../components/Motion'
import { api } from '../lib/api'
import { notifyContentUpdated } from '../lib/sync'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [successModal, setSuccessModal] = useState(null)

  useEffect(() => {
    if (!successModal) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSuccessModal(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = orig
    }
  }, [successModal])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const submittedData = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim()
    }

    try {
      await api.sendContact(form)
      notifyContentUpdated()
      setSuccessModal(submittedData)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      try {
        const stored = localStorage.getItem('diu_press_local_contacts')
        const list = stored ? JSON.parse(stored) : []
        list.unshift({
          _id: `c-local-${Date.now()}`,
          ...form,
          read: false,
          createdAt: new Date().toISOString()
        })
        localStorage.setItem('diu_press_local_contacts', JSON.stringify(list))
        notifyContentUpdated()
      } catch {}
      setSuccessModal(submittedData)
      setForm({ name: '', email: '', subject: '', message: '' })
    } finally {
      setLoading(false)
    }
  }
  return <>
    <PageHero
      eyebrow="Contact Us"
      subtitle="Editorial Office & Inquiries"
      title="Start a conversation with DIU Press."
      body="Get in touch about publications, manuscript submissions, institutional orders, rights, events or editorial collaboration."
    />
    <section className="section-space bg-white"><div className="container-shell grid gap-14 lg:grid-cols-[.82fr_1.18fr] lg:gap-20"><Reveal><div><div className="mb-4"><EyebrowBadge subtitle="Editorial Office">Contact Information</EyebrowBadge></div><h2 className="mt-4 font-serif text-4xl font-semibold text-diu-navy">We are here to help you find the right next step.</h2><div className="mt-9 grid gap-5"><ContactRow icon={MapPin} label="Address" value="Daffodil Smart City, Birulia, Savar, Dhaka, Bangladesh"/><ContactRow icon={Mail} label="Email" value="info@daffodilvarsity.edu.bd"/><ContactRow icon={Phone} label="Phone" value="+880 9617 901233"/></div><div className="mt-9 border-t border-slate-200 pt-7"><div className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">Social</div><div className="mt-4 flex gap-4 text-sm font-semibold text-diu-blue"><a href="https://www.facebook.com/daffodilvarsity.edu.bd" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">Facebook <ArrowUpRight size={14}/></a><a href="https://www.linkedin.com/school/daffodil-international-university/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">LinkedIn <ArrowUpRight size={14}/></a></div></div></div></Reveal><Reveal delay={.08}><form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-diu-paper p-6 shadow-subtle sm:p-9"><div className="grid gap-5 sm:grid-cols-2"><Field label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><Field label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/><Field label="Subject" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="sm:col-span-2" required/><label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-diu-navy">Message</span><textarea rows="7" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required className="focus-ring w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-diu-blue"/></label></div><button disabled={loading} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-diu-navy px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-diu-blue hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60">{loading?'Sending…':'Send Message'} <Send size={16}/></button></form></Reveal></div></section>
    <section className="bg-diu-paper pb-24"><div className="container-shell"><Reveal><div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white paper-grid"><div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/70"/><div className="absolute left-[20%] top-[25%] h-24 w-24 rounded-full border-2 border-diu-blue/25"/><div className="absolute left-[32%] top-[40%] h-px w-[35%] rotate-12 bg-diu-blue/15"/><div className="absolute bottom-[18%] right-[18%] h-36 w-36 rounded-full border border-diu-green/25"/><div className="absolute inset-0 grid place-items-center p-6 text-center"><div><MapPin className="mx-auto text-diu-blue" size={30}/><div className="mt-4 font-serif text-3xl font-semibold text-diu-navy">DIU Press at Daffodil International University</div><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">Map placeholder prepared for the official DIU Press location. Replace with the exact map embed when the final office address is confirmed.</p></div></div></div></Reveal></div></section>

    {/* Premium Confirmation Popup Modal */}
    {successModal && (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-diu-navy/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setSuccessModal(null)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-2xl sm:p-9 animate-in zoom-in-95 duration-200"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-diu-blue via-emerald-500 to-diu-navy" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setSuccessModal(null)}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Animated Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/70">
            <CheckCircle2 size={34} className="stroke-[2.2]" />
          </div>

          {/* Heading and details */}
          <div className="mt-5 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Delivered to Editorial Desk
            </div>
            <h3 className="mt-3.5 font-serif text-2xl font-bold text-diu-navy sm:text-3xl">
              Message Sent Successfully
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Thank you, <strong className="font-semibold text-slate-800">{successModal.name}</strong>. Your inquiry has been securely delivered to the DIU Press editorial desk. Our communications team will review it and reply to{' '}
              <strong className="font-semibold text-diu-blue">{successModal.email}</strong> shortly.
            </p>
          </div>

          {/* Confirmation summary card */}
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-left">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Inquiry Summary
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 shrink-0">Subject:</span>
                <span className="font-semibold text-slate-800 truncate text-right">
                  {successModal.subject || 'General Inquiry'}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 shrink-0">Sender:</span>
                <span className="font-medium text-slate-700 truncate text-right">
                  {successModal.name} ({successModal.email})
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 shrink-0">Status:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <Check size={12} className="stroke-[3]" /> Received & Logged
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-7">
            <button
              type="button"
              onClick={() => setSuccessModal(null)}
              className="w-full rounded-full bg-diu-navy px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-diu-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )}
  </>
}
function ContactRow({icon:Icon,label,value}) { return <div className="flex gap-4 border-b border-slate-200 pb-5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-diu-blue"><Icon size={18}/></div><div><div className="text-[9px] font-semibold uppercase tracking-[.14em] text-slate-400">{label}</div><div className="mt-1 text-sm leading-6 text-diu-navy">{value}</div></div></div> }
function Field({label,className='',...props}) { return <label className={className}><span className="mb-2 block text-xs font-semibold text-diu-navy">{label}</span><input {...props} className="focus-ring h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-diu-blue"/></label> }
