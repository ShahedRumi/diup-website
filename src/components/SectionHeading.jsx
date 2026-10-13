import EyebrowBadge from './EyebrowBadge'

export default function SectionHeading({ eyebrow, title, body, light = false, align = 'left', subtitle }) {
  const center = align === 'center'
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
      {eyebrow && (
        <div className={`mb-5 ${center ? 'flex justify-center' : ''}`}>
          <EyebrowBadge light={light} subtitle={subtitle}>
            {eyebrow}
          </EyebrowBadge>
        </div>
      )}
      <h2 className={`font-serif text-4xl font-semibold leading-[.98] sm:text-5xl lg:text-6xl ${light ? 'text-white' : 'text-diu-navy'}`}>{title}</h2>
      {body && <p className={`mt-5 max-w-2xl text-base leading-8 ${center ? 'mx-auto' : ''} ${light ? 'text-white/[.65]' : 'text-slate-600'}`}>{body}</p>}
    </div>
  )
}
