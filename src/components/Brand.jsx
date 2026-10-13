export default function Brand({ light = false, compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <img src="/brand/diu-press-logo.png" alt="DIU Press" className={`${compact ? 'h-9 w-9' : 'h-11 w-11'} object-contain`} />
      <div>
        <div className={`font-serif text-xl font-semibold leading-none tracking-tight ${light ? 'text-white' : 'text-diu-navy'}`}>DIU Press</div>
        <div className={`mt-1 text-[8px] font-semibold uppercase tracking-[.17em] ${light ? 'text-white/[.55]' : 'text-slate-500'}`}>Daffodil International University</div>
      </div>
    </div>
  )
}
