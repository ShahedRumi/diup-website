import { Link } from 'react-router-dom'
import EyebrowBadge from '../components/EyebrowBadge'

export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-diu-navy px-6 text-center text-white">
      <div>
        <div className="mb-5 flex justify-center">
          <EyebrowBadge light={true} subtitle="DIU Press Error">404 / Page Not Found</EyebrowBadge>
        </div>
        <h1 className="font-serif text-5xl font-semibold sm:text-6xl">This page is outside the catalogue.</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/60">The route may have changed or the page may no longer exist.</p>
        <Link to="/" className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-sm font-semibold text-diu-navy shadow-xl transition-all duration-300 hover:bg-slate-100 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">Return Home</Link>
      </div>
    </section>
  )
}
