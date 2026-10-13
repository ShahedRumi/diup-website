import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getMediaUrl } from '../lib/api'

export default function BookCover({ book = {}, className = '', interactive = true }) {
  const reduce = useReducedMotion()
  const [imgError, setImgError] = useState(false)
  
  const b = book || {}
  const c = b.cover || { bg: '#174EA6', accent: '#43B649', text: '#fff', code: 'DP' }
  const rawImg = b.coverImage || b.cover?.image
  const imageUrl = (!imgError && rawImg) ? getMediaUrl(rawImg) : null
  const firstAuthor = Array.isArray(b.authors) ? b.authors[0] : (b.authors || 'DIU Press')

  if (imageUrl) {
    return (
      <motion.div
        className={`book-spine relative aspect-[2/3] overflow-hidden rounded-[3px] bg-slate-900 shadow-md ${className}`}
        whileHover={interactive && !reduce ? { y: -8, rotateY: -4, rotateX: 2 } : undefined}
        transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      >
        <img
          src={imageUrl}
          alt={b.title || 'Book Cover'}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Book spine lighting overlay */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-[9px] bg-gradient-to-r from-black/35 via-black/15 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-[3px] ring-1 ring-inset ring-black/15 shadow-inner" />
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`book-spine relative aspect-[2/3] overflow-hidden rounded-[3px] ${className}`}
      style={{ background: c.bg || '#174EA6', color: c.text || '#fff' }}
      whileHover={interactive && !reduce ? { y: -8, rotateY: -4, rotateX: 2 } : undefined}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
    >
      <div className="absolute left-0 top-0 h-full w-[9px] bg-black/15" />
      <div className="absolute -right-14 top-10 h-40 w-40 rounded-full border border-current opacity-10" />
      <div className="absolute -right-6 top-24 h-40 w-40 rounded-full border border-current opacity-10" />
      <div className="absolute left-6 right-6 top-7 flex items-center justify-between gap-3 text-[8px] font-bold uppercase tracking-[.22em] opacity-85">
        <span>DIU Press</span><span>{b.year || '2026'}</span>
      </div>
      <div className="absolute left-6 top-[28%] h-px w-12" style={{ background: c.accent || '#43B649' }} />
      <div className="absolute inset-x-6 top-[34%]">
        <div className="mb-3 font-serif text-[clamp(19px,2vw,30px)] font-semibold leading-[.98]">{b.title || 'Publication'}</div>
        <div className="text-[9px] leading-relaxed opacity-70">{b.subtitle || ''}</div>
      </div>
      <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between">
        <div className="text-[8px] uppercase tracking-[.15em] opacity-70">{firstAuthor}</div>
        <div className="font-serif text-3xl font-semibold" style={{ color: c.accent || '#43B649' }}>{c.code || 'DP'}</div>
      </div>
    </motion.div>
  )
}
