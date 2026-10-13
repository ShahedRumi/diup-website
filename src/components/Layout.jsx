import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const titles = {
  '/': 'DIU Press — Publishing Knowledge. Shaping Perspectives.',
  '/books': 'Books — DIU Press',
  '/news': 'News & Announcements — DIU Press',
  '/submission': 'Submit Your Manuscript — DIU Press',
  '/team': 'Our Team — DIU Press',
  '/contact': 'Contact — DIU Press',
  '/login': 'Administrator Sign In — DIU Press',
  '/admin': 'Admin Dashboard — DIU Press',
  '/admin/account-settings': 'Account Settings — DIU Press',
  '/dashboard': 'Admin Dashboard — DIU Press',
  '/dashboard/account-settings': 'Account Settings — DIU Press'
}

function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
    document.title = titles[pathname] || (pathname.startsWith('/books/') ? 'Publication — DIU Press' : pathname.startsWith('/news/') ? 'News — DIU Press' : 'DIU Press')
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', pathname.startsWith('/books') ? 'Explore academic and professional publications from DIU Press.' : pathname.startsWith('/submission') ? 'Submit a manuscript or book proposal to DIU Press.' : 'DIU Press — academic publishing at Daffodil International University.')
  }, [pathname])
  return null
}

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/dashboard')
  const isLogin = pathname === '/login'

  if (isDashboard || isLogin) {
    return (
      <>
        <RouteEffects />
        <main>{children}</main>
      </>
    )
  }

  return <><RouteEffects/><Navbar/><main>{children}</main><Footer/></>
}
