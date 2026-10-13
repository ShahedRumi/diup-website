import { motion, useReducedMotion } from 'framer-motion'
import EyebrowBadge from './EyebrowBadge'

export default function PageHero({ eyebrow, title, body, children, subtitle }) {
  const reduce = useReducedMotion()
  return (
    <section className="relative overflow-hidden bg-diu-navy pb-20 pt-36 text-white lg:pb-28 lg:pt-44">
      <div className="absolute inset-0 paper-grid opacity-[.12]" />
      <motion.div initial={reduce ? false : { scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2 }} className="absolute -right-32 -top-20 h-[460px] w-[460px] rounded-full border border-white/10" />
      <div className="container-shell relative">
        <div className="max-w-4xl">
          {eyebrow && (
            <div className="mb-5">
              <EyebrowBadge light={true} subtitle={subtitle}>{eyebrow}</EyebrowBadge>
            </div>
          )}
          <motion.h1 initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="max-w-4xl font-serif text-5xl font-semibold leading-[.92] sm:text-6xl lg:text-7xl">{title}</motion.h1>
          {body && <p className="mt-6 max-w-2xl text-base leading-8 text-white/[.65] lg:text-lg">{body}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
