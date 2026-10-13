import { useEffect, useState, useRef } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import {
  Link,
  NavLink,
  useLocation,
} from 'react-router-dom'
import {
  ArrowUpRight,
  LogIn,
  LayoutDashboard,
  Menu,
  X,
  Search,
} from 'lucide-react'
import Brand from './Brand'
import SearchModal from './SearchModal'
import { useAuth } from '../context/AuthContext'

const links = [
  ['Home', '/'],
  ['Books', '/books'],
  ['News & Announcements', '/news'],
  ['Writers', '/writers'],
  ['Submission', '/submission'],
  ['Our Team', '/team'],
  ['About Us', '/about'],
  ['Contact', '/contact'],
]

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const lastScrollY = useRef(0)

  const isHome = location.pathname === '/'
  // Always use the standard white navbar background across all pages including home page on top
  const heroMode = false

  // Global Ctrl+K / Cmd+K shortcut for Instant Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Smart directional scroll detection (reveal on scroll up, hide on scroll down)
  useEffect(() => {
    const threshold = 10
    const topZone = 40

    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY)
      setScrolled(currentScrollY > 36)

      // Always stay visible at the top of the page
      if (currentScrollY <= topZone) {
        setIsVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      // If mobile menu or search modal is open, or mouse is hovering on navbar, keep visible
      if (open || searchOpen || isHovered) {
        lastScrollY.current = currentScrollY
        return
      }

      const diff = currentScrollY - lastScrollY.current

      // Scrolling down past threshold -> hide
      if (diff > threshold) {
        setIsVisible(false)
      }
      // Scrolling up past threshold -> reveal
      else if (diff < -threshold) {
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [open, searchOpen, isHovered])

  // Top-edge proximity hover detection (moving cursor to top 35px wakes the navbar)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY <= 35) {
        setIsVisible(true)
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Keyboard navigation focus detection: reveal navbar if an element inside it gains focus
  useEffect(() => {
    const handleFocusIn = (e) => {
      const header = document.querySelector('header')
      if (header && header.contains(e.target)) {
        setIsVisible(true)
      }
    }
    window.addEventListener('focusin', handleFocusIn)
    return () => window.removeEventListener('focusin', handleFocusIn)
  }, [])

  // Reset states on route change
  useEffect(() => {
    setOpen(false)
    setIsVisible(true)
    lastScrollY.current = 0
  }, [location.pathname])

  // Keep visible whenever mobile menu or search modal is active
  useEffect(() => {
    if (open || searchOpen) {
      setIsVisible(true)
    }
  }, [open, searchOpen])

  return (
    <>
      <motion.header
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: -18,
              }
        }
        animate={
          reduceMotion
            ? {
                opacity: isVisible ? 1 : 0,
              }
            : {
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : '-120%',
              }
        }
        transition={{
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          pointer-events-none
          fixed
          inset-x-0
          top-0
          z-50
          px-3
          pt-3
          sm:px-5
          sm:pt-4
          lg:px-8
        `}
      >
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative
            mx-auto
            max-w-[1460px]
            transition-all
            duration-500
            ease-out
            ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}

            ${
              heroMode
                ? `
                  border
                  border-white/15
                  bg-[#071A3D]/20
                  shadow-[0_18px_60px_rgba(0,0,0,0.10)]
                  backdrop-blur-xl
                `
                : `
                  border
                  border-slate-200/80
                  bg-white/[0.94]
                  shadow-[0_16px_50px_rgba(7,26,61,0.10)]
                  backdrop-blur-2xl
                `
            }

            rounded-[18px]
          `}
        >
        <div
          className="
            flex
            h-[68px]
            items-center
            justify-between
            gap-4
            px-4
            sm:h-[72px]
            sm:px-5
            lg:px-6
          "
        >
          {/* Brand */}
          <Link
            to="/"
            aria-label="DIU Press home"
            className="
              focus-ring
              relative
              z-10
              flex
              shrink-0
              items-center
              rounded-md
            "
          >
            <Brand
              light={heroMode}
              compact
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              xl:flex
            "
          >
            <div
              className="
                relative
                flex
                items-center
                gap-0.5
                2xl:gap-1
                rounded-[13px]
                p-1
                bg-diu-navy
                border
                border-white/10
                shadow-[0_4px_22px_rgba(7,26,61,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]
              "
            >
              {links.map(([label, to]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `
                    group
                    relative
                    flex
                    h-9
                    2xl:h-9.5
                    items-center
                    justify-center
                    whitespace-nowrap
                    rounded-[9px]
                    px-2.5
                    2xl:px-3.5
                    text-center
                    text-[12px]
                    2xl:text-[12.5px]
                    font-medium
                    tracking-[-0.01em]
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? 'text-diu-navy font-bold'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Sliding White Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="desktop-nav-active-pill"
                          className="
                            absolute
                            inset-0
                            rounded-[9px]
                            bg-white
                            shadow-[0_3px_12px_rgba(7,26,61,0.20)]
                          "
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}

                      <span className="relative z-10 text-center">
                        {label}
                      </span>

                      {/* Active Signature DIU Green Indicator Bar */}
                      {isActive && (
                        <motion.span
                          layoutId="desktop-nav-active"
                          className="
                            pointer-events-none
                            absolute
                            bottom-[3px]
                            inset-x-0
                            mx-auto
                            h-[2.5px]
                            w-4
                            rounded-full
                            bg-diu-green
                          "
                          style={{
                            left: 0,
                            right: 0,
                            marginInline: 'auto',
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 450,
                            damping: 36,
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Login / Admin Dashboard */}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className={`
                  focus-ring
                  hidden
                  h-10
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  text-[12.5px]
                  font-semibold
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  active:translate-y-0
                  active:scale-[0.98]
                  sm:flex
                  ${
                    heroMode
                      ? `
                        border
                        border-emerald-400/40
                        bg-emerald-500/20
                        text-white
                        hover:bg-emerald-500/30
                        hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)]
                      `
                      : `
                        border
                        border-emerald-600/30
                        bg-emerald-700
                        text-white
                        shadow-[0_6px_18px_rgba(4,120,87,0.2)]
                        hover:bg-emerald-800
                        hover:shadow-[0_9px_24px_rgba(4,120,87,0.3)]
                      `
                  }
                `}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <LayoutDashboard size={15} strokeWidth={1.8} />
                <span>Dashboard</span>
                <ArrowUpRight size={13} strokeWidth={1.8} className="opacity-60" />
              </Link>
            ) : (
              <Link
                to="/login"
                className={`
                  focus-ring
                  hidden
                  h-10
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  text-[12.5px]
                  font-semibold
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  active:translate-y-0
                  active:scale-[0.98]
                  sm:flex

                  ${
                    heroMode
                      ? `
                        border
                        border-white/20
                        bg-white/10
                        text-white
                        hover:border-white/40
                        hover:bg-white
                        hover:text-diu-navy
                        hover:shadow-[0_8px_20px_rgba(255,255,255,0.18)]
                      `
                      : `
                        border
                        border-slate-200
                        bg-diu-navy
                        text-white
                        shadow-[0_6px_18px_rgba(7,26,61,0.14)]
                        hover:bg-diu-blue
                        hover:shadow-[0_9px_24px_rgba(23,78,166,0.25)]
                      `
                  }
                `}
              >
                <LogIn
                  size={15}
                  strokeWidth={1.8}
                />

                <span>Log in</span>

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.8}
                  className="
                    opacity-60
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />
              </Link>
            )}

            {/* Search Icon in a Circular Frame (Placed After Login Button) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search publications and announcements"
              title="Search catalog (Ctrl + K)"
              className={`
                focus-ring
                grid
                h-10
                w-10
                place-items-center
                rounded-full
                transition-all
                duration-300
                hover:-translate-y-0.5
                active:translate-y-0
                active:scale-[0.98]
                ${
                  heroMode
                    ? `
                      border
                      border-white/20
                      bg-white/10
                      text-white
                      hover:border-white/40
                      hover:bg-white/20
                    `
                    : `
                      border
                      border-slate-200/90
                      bg-white
                      text-diu-navy
                      hover:border-diu-blue/30
                      hover:bg-slate-50
                      hover:text-diu-blue
                      shadow-xs
                    `
                }
              `}
            >
              <Search size={16} strokeWidth={2} />
            </button>

            {/* Mobile Menu Toggle (Only on small screens when desktop nav is hidden) */}
            <button
              type="button"
              aria-label={
                open
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((previous) => !previous)}
              className={`
                focus-ring
                grid
                h-10
                w-10
                place-items-center
                rounded-full
                transition-all
                duration-300
                hover:-translate-y-0.5
                active:translate-y-0
                xl:hidden

                ${
                  heroMode
                    ? `
                      border
                      border-white/15
                      bg-white/10
                      text-white
                      hover:bg-white/15
                    `
                    : `
                      border
                      border-slate-200
                      bg-slate-50
                      text-diu-navy
                      hover:bg-slate-100
                    `
                }
              `}
            >
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                {open ? (
                  <motion.span
                    key="close"
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            rotate: -45,
                            scale: 0.8,
                          }
                    }
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: 45,
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                  >
                    <X
                      size={20}
                      strokeWidth={1.8}
                    />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            rotate: 45,
                            scale: 0.8,
                          }
                    }
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: -45,
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                  >
                    <Menu
                      size={21}
                      strokeWidth={1.8}
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-navigation"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      height: 0,
                    }
              }
              animate={{
                opacity: 1,
                height: 'auto',
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                overflow-hidden
                xl:hidden
              "
            >
              <div className="px-3 pb-3">
                <div
                  className="
                    border-t
                    border-slate-200/80
                    pt-3
                  "
                >
                  <nav
                    aria-label="Mobile navigation"
                    className="
                      grid
                      gap-1
                    "
                  >
                    {links.map(([label, to], index) => (
                      <motion.div
                        key={to}
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                x: -8,
                              }
                        }
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: 0.28,
                          delay: index * 0.025,
                        }}
                      >
                        <NavLink
                          to={to}
                          end={to === '/'}
                          className={({ isActive }) => `
                            group
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            px-4
                            py-3.5
                            transition-all
                            duration-300

                            ${
                              isActive
                                ? `
                                  bg-diu-navy
                                  text-white
                                  shadow-[0_4px_16px_rgba(7,26,61,0.25)]
                                `
                                : `
                                  text-diu-navy
                                  hover:bg-slate-50
                                `
                            }
                          `}
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                className="
                                  font-serif
                                  text-[20px]
                                  font-medium
                                  leading-none
                                "
                              >
                                {label}
                              </span>

                              <ArrowUpRight
                                size={16}
                                strokeWidth={1.6}
                                className={`
                                  transition-all
                                  duration-300

                                  ${
                                    isActive
                                      ? 'opacity-80'
                                      : `
                                        opacity-30
                                        group-hover:opacity-70
                                      `
                                  }
                                `}
                              />
                            </>
                          )}
                        </NavLink>
                      </motion.div>
                    ))}
                  </nav>

                  {/* Mobile Login */}
                  <motion.div
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 8,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.12,
                      duration: 0.3,
                    }}
                    className="
                      mt-3
                      border-t
                      border-slate-100
                      pt-3
                      sm:hidden
                    "
                  >
                    {isAuthenticated ? (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-full
                          bg-emerald-700
                          px-5
                          py-3.5
                          text-sm
                          font-semibold
                          text-white
                          shadow-[0_8px_25px_rgba(4,120,87,0.25)]
                          transition-all
                          duration-300
                          hover:bg-emerald-800
                          hover:-translate-y-0.5
                          active:translate-y-0
                        "
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="
                              grid
                              h-8
                              w-8
                              place-items-center
                              rounded-full
                              bg-white/15
                            "
                          >
                            <LayoutDashboard
                              size={16}
                              strokeWidth={1.8}
                            />
                          </span>

                          <span className="flex items-center gap-2">
                            <span>Admin Dashboard</span>
                            <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-200">
                              Active
                            </span>
                          </span>
                        </span>

                        <ArrowUpRight
                          size={16}
                          strokeWidth={1.7}
                        />
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-full
                          bg-diu-blue
                          px-5
                          py-3.5
                          text-sm
                          font-semibold
                          text-white
                          shadow-[0_8px_25px_rgba(23,78,166,0.18)]
                          transition-all
                          duration-300
                          hover:bg-diu-navy
                          hover:-translate-y-0.5
                          active:translate-y-0
                        "
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="
                              grid
                              h-8
                              w-8
                              place-items-center
                              rounded-full
                              bg-white/10
                            "
                          >
                            <LogIn
                              size={16}
                              strokeWidth={1.8}
                            />
                          </span>

                          Log in
                        </span>

                        <ArrowUpRight
                          size={16}
                          strokeWidth={1.7}
                        />
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
    <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  </>
  )
}