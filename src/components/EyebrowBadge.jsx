/**
 * Premium Eyebrow Badge component
 * Features a glowing/pulsing live indicator dot, primary title, bullet separator, and secondary institutional text.
 */
export default function EyebrowBadge({
  children,
  subtitle = 'Daffodil International University',
  light = false,
  className = ''
}) {
  return (
    <div
      className={`inline-flex max-w-full items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-medium transition-all ${
        light
          ? 'border border-white/15 bg-white/[0.08] text-white/95 shadow-sm backdrop-blur-md'
          : 'border border-slate-200/90 bg-white text-diu-navy shadow-sm hover:border-diu-blue/30'
      } ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-diu-green opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-diu-green" />
      </span>
      <span className="shrink-0 font-semibold tracking-wide">{children}</span>
      {subtitle && (
        <>
          <span className={`shrink-0 ${light ? 'text-white/30' : 'text-slate-300'}`}>•</span>
          <span className={`truncate ${light ? 'text-blue-200 font-medium' : 'text-diu-blue font-medium'}`}>
            {subtitle}
          </span>
        </>
      )}
    </div>
  )
}
