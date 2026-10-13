import { Link } from 'react-router-dom'
import { ArrowUpRight, Facebook, Linkedin, Mail, MapPin } from 'lucide-react'
import Brand from './Brand'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-diu-navy text-white">
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full border border-white/5" />
      <div className="container-shell py-16 lg:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.4fr_.8fr_.8fr_1fr]">
          <div className="max-w-sm">
            <Brand light />
            <p className="mt-6 text-sm leading-7 text-white/[.58]">DIU Press advances scholarship, teaching and public knowledge through thoughtful academic publishing connected to Daffodil International University.</p>
            <div className="mt-6 flex gap-3">
              {[[Facebook,'https://www.facebook.com/daffodilvarsity.edu.bd','Facebook'],[Linkedin,'https://www.linkedin.com/school/daffodil-international-university/','LinkedIn']].map(([Icon,href,label]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95"><Icon size={16}/></a>)}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[.15em] text-white/[.45]">Explore</div>
            <div className="mt-5 grid gap-3 text-sm text-white/[.68]">
              <Link to="/books">Books</Link><Link to="/news">News & Announcements</Link><Link to="/team">Our Team</Link><Link to="/about">About Us</Link><Link to="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[.15em] text-white/[.45]">For Authors</div>
            <div className="mt-5 grid gap-3 text-sm text-white/[.68]">
              <Link to="/writers">Writers Hub</Link><Link to="/submission">Submit a Manuscript</Link><Link to="/writers">Author Guidelines</Link><Link to="/contact">Permissions</Link>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[.15em] text-white/[.45]">Contact</div>
            <div className="mt-5 grid gap-4 text-sm text-white/[.68]">
              <div className="flex gap-3"><MapPin size={17} className="mt-1 shrink-0"/><span>Daffodil Smart City, Birulia, Savar, Dhaka, Bangladesh</span></div>
              <a href="mailto:info@daffodilvarsity.edu.bd" className="flex gap-3"><Mail size={17}/><span>info@daffodilvarsity.edu.bd</span></a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 pt-8 text-xs text-white/[.42] md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} DIU Press. All rights reserved.</div>
          <div className="flex flex-wrap gap-5"><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms</Link><a href="https://daffodilvarsity.edu.bd" target="_blank" rel="noreferrer" className="flex items-center gap-1">Daffodil International University <ArrowUpRight size={13}/></a></div>
        </div>
      </div>
    </footer>
  )
}
