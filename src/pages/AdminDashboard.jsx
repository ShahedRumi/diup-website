import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  FileText,
  Users,
  Inbox,
  UserCheck,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ExternalLink,
  Search,
  CheckCircle,
  X,
  AlertCircle,
  Clock,
  Check,
  Shield,
  Tag,
  Calendar,
  Star,
  GraduationCap,
  Save,
  RotateCcw,
  Mail,
  ChevronRight,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Globe,
  Boxes,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart3,
  ShieldCheck,
  History,
  TrendingUp,
  Receipt,
  Warehouse,
  KeyRound,
  Bell,
  CheckCheck,
  User,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Briefcase,
  Camera,
  PenTool,
  ShoppingBag,
  Loader2,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  BookMarked,
  Info
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { api, getMediaUrl } from '../lib/api'
import { notifyContentUpdated, subscribeContentUpdated } from '../lib/sync'
import { books as initialBooks, news as initialNews, team as initialTeam, writers as initialWriters } from '../data'
import {
  ErpOverviewView,
  ErpBooksManagementView,
  ErpInventoryView,
  ErpSalesView,
  ErpPaymentsView,
  AdminAuditView,
  AdminSettingsView,
  AdminAccessControlView,
  recordAuditLog,
  getMasterBooksConfig
} from '../components/AdminERPViews'

const TAB_CONFIG = {
  // Section 1: Website
  overview: { title: 'Dashboard Overview', section: 'CMS', badgeClass: 'bg-blue-50 text-diu-blue border-blue-200' },
  books: { title: 'Publications (Books)', section: 'CMS', badgeClass: 'bg-blue-50 text-diu-blue border-blue-200' },
  news: { title: 'News & Announcements', section: 'CMS', badgeClass: 'bg-blue-50 text-diu-blue border-blue-200' },
  writers: { title: 'Writers & Authors', section: 'CMS', badgeClass: 'bg-blue-50 text-diu-blue border-blue-200' },
  submissions: { title: 'Manuscript Submissions', section: 'CMS', badgeClass: 'bg-blue-50 text-diu-blue border-blue-200' },
  team: { title: 'Editorial Team', section: 'CMS', badgeClass: 'bg-blue-50 text-diu-blue border-blue-200' },
  contacts: { title: 'Contact Arrival', section: 'CMS', badgeClass: 'bg-blue-50 text-diu-blue border-blue-200' },

  // Section 2: ERP
  'erp-overview': { title: 'ERP Overview', section: 'ERP', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'erp-books-management': { title: 'Books Management', section: 'ERP', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'erp-inventory': { title: 'Inventory & Stock', section: 'ERP', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'erp-sales': { title: 'Sales & Orders', section: 'ERP', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'erp-payments': { title: 'Payments & Invoicing', section: 'ERP', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },

  // Section 3: Administration
  accounts: { title: 'Accounts & Staff', section: 'Admin', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
  'admin-access': { title: 'Access Control', section: 'Admin', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
  'admin-audit': { title: 'Audit Trail', section: 'Admin', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
  'admin-settings': { title: 'System & Security', section: 'Admin', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
  'account-settings': { title: 'Account Settings', section: 'Admin', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' }
}

function SafeAuthorAvatar({ src, name, fallback = '/team/team-1.svg', className = '' }) {
  const [errorCount, setErrorCount] = useState(0)
  const resolvedSrc = getMediaUrl(src)

  const cleanName = (name || '').replace(/^(?:(?:prof|dr|mr|ms|mrs|engr)\.?\s*)+/i, '').trim()
  const initials = cleanName
    ? cleanName.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'DP'

  if (errorCount >= 2 || (!resolvedSrc && !fallback)) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-[#071A3D] via-[#102B66] to-[#174EA6] text-white font-serif font-bold text-xl select-none shadow-inner ${className}`}>
        <span>{initials}</span>
      </div>
    )
  }

  const currentSrc = errorCount === 1 ? fallback : (resolvedSrc || fallback)

  return (
    <img
      src={currentSrc}
      alt={name || 'Author'}
      onError={(e) => {
        e.currentTarget.onerror = null
        setErrorCount((prev) => prev + 1)
      }}
      className={className}
    />
  )
}

function SafeBookThumb({ book }) {
  const [hasError, setHasError] = useState(false)
  const resolved = getMediaUrl(book?.coverImage)

  if (!resolved || hasError) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center text-[9px] font-bold text-white"
        style={{ background: book?.cover?.bg || '#0B2D63' }}
      >
        <span style={{ color: book?.cover?.accent || '#43B649' }}>
          {book?.cover?.code || 'DP'}
        </span>
      </div>
    )
  }

  return (
    <img
      src={resolved}
      alt={book?.title || 'Book'}
      onError={(e) => {
        e.currentTarget.onerror = null
        setHasError(true)
      }}
      className="h-full w-full object-cover"
    />
  )
}

function SafeNewsThumb({ item }) {
  const [hasError, setHasError] = useState(false)
  const resolved = getMediaUrl(item?.image)

  if (!resolved || hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[10px] font-bold text-slate-400">
        News
      </div>
    )
  }

  return (
    <img
      src={resolved}
      alt={item?.title || 'News'}
      onError={(e) => {
        e.currentTarget.onerror = null
        setHasError(true)
      }}
      className="h-full w-full object-cover"
    />
  )
}

function SafeUserAvatar({ avatar, name, className = "h-full w-full object-cover", fallbackClassName = "" }) {
  const [hasError, setHasError] = useState(false)
  const resolved = getMediaUrl(avatar)
  const initial = name ? name.charAt(0).toUpperCase() : 'A'

  if (!resolved || hasError) {
    return <span className={fallbackClassName}>{initial}</span>
  }

  return (
    <img
      src={resolved}
      alt={name || 'User'}
      onError={(e) => {
        e.currentTarget.onerror = null
        setHasError(true)
      }}
      className={className}
    />
  )
}

function CollapsedNavItem({ icon: Icon, label, active, onClick, color = 'blue', badge = 0 }) {
  const activeClass =
    color === 'emerald'
      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-400/50'
      : color === 'purple'
      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40 ring-2 ring-purple-400/50'
      : 'bg-diu-blue text-white shadow-lg shadow-blue-950/40 ring-2 ring-blue-400/50'

  const iconColor =
    !active
      ? color === 'emerald'
        ? 'text-emerald-300'
        : color === 'purple'
        ? 'text-purple-300'
        : 'text-blue-200'
      : 'text-white'

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
        active
          ? `${activeClass} scale-105`
          : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95'
      }`}
    >
      <Icon className={`h-4.5 w-4.5 ${iconColor}`} />

      {badge > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow ring-2 ring-diu-navy">
          {badge > 9 ? '9+' : badge}
        </span>
      )}

      {/* Flyout Tooltip Pill */}
      <div className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 z-50 hidden group-hover:flex items-center">
        <div className="rounded-lg bg-slate-900/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl backdrop-blur-sm whitespace-nowrap border border-white/15 flex items-center gap-1.5">
          <span>{label}</span>
          {badge > 0 && (
            <span className="rounded-full bg-red-500 px-1.5 py-0.2 text-[9px] font-bold text-white">
              {badge}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export default function AdminDashboard() {
  const { user, logout, updateProfile, isAuthenticated, loading: authLoading } = useAuth()
  const currentActor = user?.email || user?.name || 'admin@diupress.local'
  const navigate = useNavigate()
  const location = useLocation()
  const isAccountSettingsRoute = location.pathname.endsWith('/account-settings')

  // Sidebar Collapse state (persisted in localStorage)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('diu_admin_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('diu_admin_sidebar_collapsed', String(next))
      } catch {}
      return next
    })
  }

  // Active Tab
  const [activeTab, setActiveTab] = useState(isAccountSettingsRoute ? 'account-settings' : 'overview')

  // Determine section key based on tab
  const getSectionForTab = (tab) => {
    if (['overview', 'books', 'news', 'writers', 'submissions', 'team', 'contacts'].includes(tab)) return 'website'
    if (['erp-overview', 'erp-inventory', 'erp-sales', 'erp-payments'].includes(tab)) return 'erp'
    if (['accounts', 'admin-access', 'admin-audit', 'admin-settings'].includes(tab)) return 'administration'
    return 'website'
  }

  // Accordion state: only one section can be open at a time.
  // Initially opens the section corresponding to active tab (e.g. 'website' for overview)
  const [openSection, setOpenSection] = useState(() => (isAccountSettingsRoute ? null : getSectionForTab(activeTab)))

  useEffect(() => {
    if (location.pathname.endsWith('/account-settings')) {
      setActiveTab('account-settings')
      setOpenSection(null)
    } else if (activeTab === 'account-settings') {
      setActiveTab('overview')
      setOpenSection('website')
    }
  }, [location.pathname])

  const toggleSection = (sectionKey) => {
    // If the clicked section is already open, collapse it (set to null); otherwise open only this section
    setOpenSection((prev) => (prev === sectionKey ? null : sectionKey))
  }

  const handleSelectTab = (tab) => {
    if (tab === 'account-settings') {
      navigate('/admin/account-settings')
      setOpenSection(null)
      setActiveTab('account-settings')
      return
    }

    if (location.pathname.endsWith('/account-settings')) {
      navigate('/admin')
    }

    // Exclusively open the section that contains this tab
    if (['overview', 'books', 'news', 'writers', 'submissions', 'team', 'contacts'].includes(tab)) {
      setOpenSection('website')
    } else if (['erp-overview', 'erp-inventory', 'erp-sales', 'erp-payments'].includes(tab)) {
      setOpenSection('erp')
    } else if (['accounts', 'admin-access', 'admin-audit', 'admin-settings'].includes(tab)) {
      setOpenSection('administration')
    }
    setActiveTab(tab)
  }

  // ================= DATA STATES =================
  const [booksList, setBooksList] = useState([])
  const [newsList, setNewsList] = useState([])
  const [writersList, setWritersList] = useState([])
  const [submissionsList, setSubmissionsList] = useState([])
  const [teamList, setTeamList] = useState([])
  const [contactsList, setContactsList] = useState([])
  const [accountsList, setAccountsList] = useState([])

  const [loadingData, setLoadingData] = useState(true)
  const [toastMessage, setToastMessage] = useState('')

  // ================= LIVE NOTIFICATIONS STATE & LOGIC =================
  const [notificationOpen, setNotificationOpen] = useState(false)
  const notificationRef = useRef(null)
  const [dismissedNotifIds, setDismissedNotifIds] = useState(() => {
    try {
      const stored = localStorage.getItem('diu_press_dismissed_notifs')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const stored = localStorage.getItem('diu_press_read_notifs')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Format relative timestamp helper
  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Just now'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Recently'
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
    if (diffSec < 45) return 'Just now'
    if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))}m ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Dynamic live notifications derived directly from real contact messages, submissions, and alerts
  const notifications = useMemo(() => {
    const list = []

    // 1. Live Contact Messages
    for (const c of contactsList) {
      const id = `contact-${c._id || c.id}`
      if (dismissedNotifIds.includes(id)) continue
      const isUnread = !c.read && c.status !== 'read' && c.status !== 'closed' && !readNotifIds.includes(id)
      list.push({
        id,
        rawId: c._id || c.id,
        type: 'contact',
        title: `Inquiry from ${c.name || 'Visitor'}`,
        desc: c.subject ? `${c.subject} — ${c.message || ''}` : (c.message || 'New contact inquiry received.'),
        time: formatRelativeTime(c.createdAt),
        timestamp: c.createdAt ? new Date(c.createdAt).getTime() : Date.now(),
        targetTab: 'contacts',
        unread: isUnread,
        badge: 'Contact',
        badgeClass: 'bg-blue-100 text-blue-700'
      })
    }

    // 2. Live Manuscript Submissions
    for (const s of submissionsList) {
      const id = `sub-${s._id || s.id || s.submissionId}`
      if (dismissedNotifIds.includes(id)) continue
      const isUnread = (s.status === 'under_review' || s.status === 'submitted') && !readNotifIds.includes(id)
      list.push({
        id,
        rawId: s._id || s.id,
        type: 'submission',
        title: `Manuscript: ${s.title || 'New Submission'}`,
        desc: `By ${s.fullName || 'Author'} • ${s.submissionType || 'Manuscript'} (${s.status?.replace('_', ' ') || 'Submitted'})`,
        time: formatRelativeTime(s.createdAt),
        timestamp: s.createdAt ? new Date(s.createdAt).getTime() : Date.now(),
        targetTab: 'submissions',
        unread: isUnread,
        badge: 'Manuscript',
        badgeClass: 'bg-purple-100 text-purple-700'
      })
    }

    // 3. Low-stock alert if any book is running low
    const lowStockBooks = booksList.filter((b) => typeof b.stock === 'number' && b.stock <= 15)
    if (lowStockBooks.length > 0 && !dismissedNotifIds.includes('erp-stock-alert')) {
      const sample = lowStockBooks[0]
      const isUnread = !readNotifIds.includes('erp-stock-alert')
      list.push({
        id: 'erp-stock-alert',
        rawId: 'erp-stock-alert',
        type: 'erp',
        title: 'Low Stock Alert (ERP)',
        desc: `"${sample.title || sample.bookId}" is down to ${sample.stock} copies.`,
        time: 'Active',
        timestamp: Date.now() - 1000 * 60 * 30,
        targetTab: 'erp-inventory',
        unread: isUnread,
        badge: 'ERP Stock',
        badgeClass: 'bg-amber-100 text-amber-800'
      })
    }

    // Sort newest first
    list.sort((a, b) => b.timestamp - a.timestamp)
    return list
  }, [contactsList, submissionsList, booksList, dismissedNotifIds, readNotifIds])

  // Click outside to close notifications dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false)
      }
    }
    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationOpen])

  const unreadNotifCount = notifications.filter((n) => n.unread).length

  const handleNotificationClick = async (notif) => {
    setReadNotifIds((prev) => {
      if (prev.includes(notif.id)) return prev
      const next = [...prev, notif.id]
      try {
        localStorage.setItem('diu_press_read_notifs', JSON.stringify(next.slice(-300)))
      } catch {}
      return next
    })

    if (notif.type === 'contact' && notif.unread) {
      const id = notif.rawId
      try {
        await api.updateContact(id, { read: true, status: 'read' })
        setContactsList((prev) =>
          prev.map((c) => ((c._id || c.id) === id ? { ...c, read: true, status: 'read' } : c))
        )
        const stored = localStorage.getItem('diu_press_local_contacts')
        if (stored) {
          const local = JSON.parse(stored).map((c) =>
            ((c._id || c.id) === id ? { ...c, read: true, status: 'read' } : c)
          )
          localStorage.setItem('diu_press_local_contacts', JSON.stringify(local))
        }
      } catch (err) {
        console.error('Failed to mark message as read:', err)
      }
    }
    handleSelectTab(notif.targetTab)
    setNotificationOpen(false)
  }

  const markAllNotificationsAsRead = async () => {
    // 1. Collect all current notification IDs and mark read in persistent state
    const allIds = notifications.map((n) => n.id)
    setReadNotifIds((prev) => {
      const next = Array.from(new Set([...prev, ...allIds]))
      try {
        localStorage.setItem('diu_press_read_notifs', JSON.stringify(next.slice(-300)))
      } catch {}
      return next
    })

    // 2. Mark all contacts as read on server
    try {
      await api.markAllContactsRead()
    } catch {
      const unreadContacts = contactsList.filter((c) => !c.read && c.status !== 'read')
      await Promise.allSettled(
        unreadContacts.map((c) => api.updateContact(c._id || c.id, { read: true, status: 'read' }))
      )
    }

    // 3. Update local state and localStorage
    setContactsList((prev) => prev.map((c) => ({ ...c, read: true, status: 'read' })))
    try {
      const stored = localStorage.getItem('diu_press_local_contacts')
      if (stored) {
        const updated = JSON.parse(stored).map((c) => ({ ...c, read: true, status: 'read' }))
        localStorage.setItem('diu_press_local_contacts', JSON.stringify(updated))
      }
    } catch {}

    showToast('All notifications marked as read.')
  }

  const dismissNotification = (e, notifId) => {
    e.stopPropagation()
    setDismissedNotifIds((prev) => {
      const next = [...prev, notifId]
      try {
        localStorage.setItem('diu_press_dismissed_notifs', JSON.stringify(next.slice(-100)))
      } catch {}
      return next
    })
  }

  // ================= ACCOUNT DROPDOWN STATE =================
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const accountDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutsideAccount(event) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false)
      }
    }
    if (accountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutsideAccount)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideAccount)
    }
  }, [accountDropdownOpen])

  // Search & Filter in Tabs
  const [searchQuery, setSearchQuery] = useState('')

  // Publication Books Search, Sort & Filter
  const [bookSearch, setBookSearch] = useState('')
  const [bookSortBy, setBookSortBy] = useState('latest')
  const [bookCategoryFilter, setBookCategoryFilter] = useState('All')
  const [bookStatusFilter, setBookStatusFilter] = useState('All')

  // Publications awaiting CMS editorial completion (added from ERP Inventory)
  const pendingCmsBooks = useMemo(() => {
    return booksList.filter((b) =>
      Boolean(b.needsCmsSetup) ||
      (b.origin === 'erp_inventory' && (b.status === 'draft' || b.status === 'inactive'))
    )
  }, [booksList])

  // Publications published and live on the website
  const liveActiveBooks = useMemo(() => {
    return booksList.filter((b) =>
      b.status !== 'draft' && b.status !== 'inactive' && b.status !== 'archived' && !b.needsCmsSetup
    )
  }, [booksList])

  // Total physical inventory stock count across all publications
  const totalPhysicalCopies = useMemo(() => {
    try {
      const rawStock = localStorage.getItem('diu_press_erp_inventory_stock')
      const stockMap = rawStock ? JSON.parse(rawStock) : {}
      return booksList.reduce((acc, b, idx) => {
        const slug = b.slug || `book-${idx}`
        const copies = stockMap[slug] !== undefined ? Number(stockMap[slug]) : (Number(b.stock) || 100)
        return acc + copies
      }, 0)
    } catch {
      return booksList.reduce((acc, b) => acc + (Number(b.stock) || 100), 0)
    }
  }, [booksList])

  // Dynamic unique categories extracted from publications
  const bookCategories = useMemo(() => {
    const cats = new Set()
    booksList.forEach((b) => {
      if (b.category && typeof b.category === 'string') cats.add(b.category.trim())
    })
    return ['All', ...Array.from(cats).sort()]
  }, [booksList])

  // Computed filtered and sorted publications list
  const filteredAndSortedBooks = useMemo(() => {
    const result = booksList.filter((book) => {
      // 1. Search query match
      if (bookSearch.trim()) {
        const q = bookSearch.toLowerCase().trim()
        const titleMatch = (book.title || '').toLowerCase().includes(q)
        const authorsMatch = (Array.isArray(book.authors) ? book.authors.join(' ') : (book.authors || '')).toLowerCase().includes(q)
        const isbnMatch = (book.isbn || '').toLowerCase().includes(q)
        const catMatch = (book.category || '').toLowerCase().includes(q)
        const subtitleMatch = (book.subtitle || '').toLowerCase().includes(q)
        if (!titleMatch && !authorsMatch && !isbnMatch && !catMatch && !subtitleMatch) {
          return false
        }
      }

      // 2. Category filter
      if (bookCategoryFilter !== 'All' && book.category !== bookCategoryFilter) {
        return false
      }

      // 3. Status filter
      if (bookStatusFilter !== 'All') {
        const isPending = Boolean(book.needsCmsSetup) || (book.origin === 'erp_inventory' && (book.status === 'draft' || book.status === 'inactive'))
        const isInactive = book.status === 'draft' || book.status === 'inactive' || book.status === 'archived'
        if (bookStatusFilter === 'active' && (isInactive || isPending)) return false
        if (bookStatusFilter === 'inactive' && (!isInactive || isPending)) return false
        if (bookStatusFilter === 'pending' && !isPending) return false
      }

      return true
    })

    // Sorting
    return [...result].sort((a, b) => {
      if (bookSortBy === 'latest') {
        const yearDiff = (Number(b.year) || 0) - (Number(a.year) || 0)
        if (yearDiff !== 0) return yearDiff
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }
      if (bookSortBy === 'oldest') {
        const yearDiff = (Number(a.year) || 0) - (Number(b.year) || 0)
        if (yearDiff !== 0) return yearDiff
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      }
      if (bookSortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '')
      }
      if (bookSortBy === 'title-desc') {
        return (b.title || '').localeCompare(a.title || '')
      }
      if (bookSortBy === 'price-low') {
        return (Number(a.price) || 0) - (Number(b.price) || 0)
      }
      if (bookSortBy === 'price-high') {
        return (Number(b.price) || 0) - (Number(a.price) || 0)
      }
      if (bookSortBy === 'featured') {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return (a.title || '').localeCompare(b.title || '')
      }
      return 0
    })
  }, [booksList, bookSearch, bookSortBy, bookCategoryFilter, bookStatusFilter])

  // Modals state
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)

  const [newsModalOpen, setNewsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)

  const [writerModalOpen, setWriterModalOpen] = useState(false)
  const [editingWriter, setEditingWriter] = useState(null)

  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)

  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)

  const [submissionModalOpen, setSubmissionModalOpen] = useState(false)
  const [editingSubmission, setEditingSubmission] = useState(null)

  // View Details Modal States (lightweight popup on row click)
  const [viewingBook, setViewingBook] = useState(null)
  const [viewingNews, setViewingNews] = useState(null)
  const [viewingAccount, setViewingAccount] = useState(null)

  // Custom modal-based confirmation popup replacing native window.confirm()
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    variant: 'danger',
    onConfirm: () => {}
  })

  const openConfirm = ({ title, message, confirmLabel = 'Delete', variant = 'danger', onConfirm }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmLabel,
      variant,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        await onConfirm()
      }
    })
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  // Load all dashboard data on mount
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login', { replace: true })
      return
    }

    let active = true

    async function loadAllData() {
      setLoadingData(true)

      // Fetch all collections concurrently with resilient error handling
      const [booksRes, newsRes, subRes, teamRes, writersRes, contactsRes, accountsRes] = await Promise.allSettled([
        api.getBooks('limit=1000&includeAll=true'),
        api.getNews(),
        api.getSubmissions(),
        api.getTeam(),
        api.getWriters('all=true'),
        api.getContacts(),
        api.getAccounts()
      ])

      if (!active) return

      // 1. Books
      if (booksRes.status === 'fulfilled' && Array.isArray(booksRes.value?.items)) {
        setBooksList(booksRes.value.items)
      } else {
        setBooksList(initialBooks)
      }

      // 2. News
      if (newsRes.status === 'fulfilled' && Array.isArray(newsRes.value?.items)) {
        setNewsList(newsRes.value.items)
      } else {
        setNewsList(initialNews)
      }

      // 3. Submissions
      if (subRes.status === 'fulfilled' && Array.isArray(subRes.value?.items)) {
        setSubmissionsList(subRes.value.items)
      } else {
        try {
          const stored = localStorage.getItem('diu_press_local_submissions')
          setSubmissionsList(stored ? JSON.parse(stored) : [
            {
              _id: 'sub-1',
              submissionId: 'DP-2026-001',
              fullName: 'Dr. Shahriar Hossain',
              email: 'shahriar@du.ac.bd',
              institution: 'University of Dhaka',
              submissionType: 'Monograph',
              title: 'Decentralized Microgrids for Coastal Communities',
              abstract: 'An interdisciplinary study exploring policy, community economics, and renewable smart grids in southern Bangladesh.',
              status: 'under_review',
              createdAt: '2026-09-15T10:00:00Z'
            }
          ])
        } catch {
          setSubmissionsList([])
        }
      }

      // 4. Team
      const teamItems = teamRes.status === 'fulfilled' ? (teamRes.value?.items || teamRes.value?.members) : null
      if (Array.isArray(teamItems)) {
        setTeamList(teamItems)
      } else {
        setTeamList(initialTeam)
      }

      // 4b. Writers
      const writerItems = writersRes.status === 'fulfilled' ? (writersRes.value?.items || writersRes.value?.writers) : null
      if (Array.isArray(writerItems)) {
        setWritersList(writerItems)
      } else {
        setWritersList(initialWriters)
      }

      // 5. Contacts
      if (contactsRes.status === 'fulfilled' && contactsRes.value?.items) {
        setContactsList(contactsRes.value.items)
      } else {
        try {
          const stored = localStorage.getItem('diu_press_local_contacts')
          setContactsList(stored ? JSON.parse(stored) : [
            {
              _id: 'c-1',
              name: 'Dr. Katherine Miller',
              email: 'k.miller@cambridge-ox.org',
              subject: 'Institutional Journal Exchange & Open Access',
              message: 'Greetings from the UK. We are interested in reviewing collaborative distribution of your emerging market monographs.',
              read: false,
              createdAt: '2026-09-22T14:30:00Z'
            },
            {
              _id: 'c-2',
              name: 'Prof. Anisul Karim',
              email: 'akarim@buet.ac.bd',
              subject: 'Manuscript submission query: Computing Monograph',
              message: 'Inquiring regarding word count guidelines for peer-reviewed research collections in artificial intelligence.',
              read: true,
              createdAt: '2026-09-18T09:15:00Z'
            }
          ])
        } catch {
          setContactsList([])
        }
      }

      // 6. Accounts
      if (accountsRes.status === 'fulfilled' && accountsRes.value?.accounts?.length) {
        setAccountsList(accountsRes.value.accounts)
      } else {
        try {
          const stored = localStorage.getItem('diu_press_local_accounts')
          setAccountsList(stored ? JSON.parse(stored) : [
            {
              _id: 'acc-1',
              name: user?.name || 'DIU Press Administrator',
              email: user?.email || 'admin@diupress.local',
              role: 'admin',
              active: true,
              createdAt: '2026-01-01T00:00:00Z'
            },
            {
              _id: 'acc-2',
              name: 'Senior Managing Editor',
              email: 'editor@diupress.local',
              role: 'editor',
              active: true,
              createdAt: '2026-03-10T00:00:00Z'
            }
          ])
        } catch {
          setAccountsList([])
        }
      }

      if (active) setLoadingData(false)
    }

    loadAllData()

    // Real-time synchronization subscription for contact messages & submissions
    const unsubscribeSync = subscribeContentUpdated(async () => {
      if (!active) return
      try {
        const [cRes, sRes] = await Promise.allSettled([
          api.getContacts(),
          api.getSubmissions()
        ])
        if (active && cRes.status === 'fulfilled' && Array.isArray(cRes.value?.items)) {
          setContactsList(cRes.value.items)
        }
        if (active && sRes.status === 'fulfilled' && Array.isArray(sRes.value?.items)) {
          setSubmissionsList(sRes.value.items)
        }
      } catch (err) {
        console.warn('Real-time sync check warning:', err.message)
      }
    })

    // Background polling every 30s for newly arrived visitor inquiries
    const pollTimer = setInterval(async () => {
      if (!active) return
      try {
        const [cRes, sRes] = await Promise.allSettled([
          api.getContacts(),
          api.getSubmissions()
        ])
        if (active && cRes.status === 'fulfilled' && Array.isArray(cRes.value?.items)) {
          setContactsList(cRes.value.items)
        }
        if (active && sRes.status === 'fulfilled' && Array.isArray(sRes.value?.items)) {
          setSubmissionsList(sRes.value.items)
        }
      } catch {}
    }, 30000)

    return () => {
      active = false
      if (typeof unsubscribeSync === 'function') unsubscribeSync()
      clearInterval(pollTimer)
    }
  }, [isAuthenticated, authLoading, navigate, user?.id || user?._id || user?.email])

  // ================= BOOKS HANDLERS =================
  const handleSaveBook = async (bookData) => {
    try {
      const payloadToSave = { ...bookData }
      if (payloadToSave.status === 'published' || payloadToSave.status === 'active') {
        payloadToSave.needsCmsSetup = false
      }

      if (editingBook) {
        const id = editingBook._id || editingBook.slug || editingBook.id
        const res = await api.updateBook(id, payloadToSave)
        const updated = res?.book || { ...editingBook, ...payloadToSave }
        setBooksList((prev) =>
          prev.map((b) => ((b._id || b.slug || b.id) === id ? updated : b))
        )

        // Audit Log Entry
        const oldPrice = Number(editingBook.price) || 0
        const newPrice = Number(payloadToSave.price) || 0
        const oldStock = Number(editingBook.stock) || 0
        const newStock = Number(payloadToSave.stock) || 0
        const bookTitle = payloadToSave.title || editingBook.title || 'Publication'

        const changesList = []
        if (oldPrice !== newPrice) {
          changesList.push({ field: 'Base Price', from: `৳${oldPrice}`, to: `৳${newPrice}` })
        }
        if (oldStock !== newStock) {
          changesList.push({ field: 'Inventory Stock', from: `${oldStock} copies`, to: `${newStock} copies` })
        }
        if (changesList.length === 0) {
          changesList.push({ field: 'Publication Details', from: 'Previous Settings', to: 'Updated Settings' })
        }

        let actionDesc = ''
        let shortAct = 'Publication Updated'
        if (oldPrice !== newPrice && oldStock !== newStock) {
          actionDesc = `${bookTitle} Price: ${oldPrice} -> ${newPrice}, Stock: ${oldStock} -> ${newStock}`
          shortAct = 'Price & Stock Updated'
        } else if (oldPrice !== newPrice) {
          actionDesc = `${bookTitle} Price: ${oldPrice} -> ${newPrice}`
          shortAct = 'Price Modified'
        } else if (oldStock !== newStock) {
          actionDesc = `${bookTitle} Stock: ${oldStock} -> ${newStock}`
          shortAct = 'Stock Adjusted'
        } else {
          actionDesc = `${bookTitle} Details modified`
          shortAct = 'Details Modified'
        }

        recordAuditLog({
          category: 'Update',
          location: 'CMS > Publications (Books)',
          action: actionDesc,
          actor: currentActor,
          target: bookTitle,
          shortAction: shortAct,
          changes: changesList
        })

        showToast('Publication updated successfully.')
      } else {
        const res = await api.createBook(payloadToSave)
        const newBook = res?.book || { ...payloadToSave, _id: `book-${Date.now()}` }
        setBooksList((prev) => [newBook, ...prev])

        recordAuditLog({
          category: 'Create',
          location: 'CMS > Publications (Books)',
          action: `New Publication: ${newBook.title}`,
          actor: currentActor,
          target: newBook.title,
          shortAction: 'Publication Created',
          changes: [
            { field: 'Publication Title', to: newBook.title },
            { field: 'Status', to: 'Active / Published' }
          ]
        })

        showToast('Publication created successfully.')
      }
      setBookModalOpen(false)
      setEditingBook(null)
      notifyContentUpdated()
      return true
    } catch (err) {
      toast.error(err.message || 'Unable to save publication. Please try again.')
      throw err
    }
  }

  const handleToggleBookStatus = async (book) => {
    const id = book._id || book.slug || book.id
    const currentStatus = book.status || 'published'
    const newStatus = (currentStatus === 'draft' || currentStatus === 'inactive' || currentStatus === 'archived') ? 'published' : 'draft'
    const statusLabel = newStatus === 'published' ? 'Active' : 'Inactive'

    // Optimistic UI update
    setBooksList((prev) =>
      prev.map((b) => ((b._id || b.slug || b.id) === id ? { ...b, status: newStatus, needsCmsSetup: newStatus === 'published' ? false : b.needsCmsSetup } : b))
    )
    showToast(`Publication set to ${statusLabel}.`)

    recordAuditLog({
      category: 'Update',
      location: 'CMS > Publications (Books)',
      action: `${book.title} Status: ${currentStatus} -> ${newStatus}`,
      actor: currentActor
    })

    try {
      const patch = {
        status: newStatus,
        slug: book.slug,
        title: book.title
      }
      if (newStatus === 'published') {
        patch.needsCmsSetup = false
      }
      const res = await api.updateBook(id, patch)
      if (res?.book) {
        setBooksList((prev) =>
          prev.map((b) => ((b._id || b.slug || b.id) === id ? { ...b, ...res.book } : b))
        )
      }
      notifyContentUpdated()
    } catch (err) {
      // Revert if error
      setBooksList((prev) =>
        prev.map((b) => ((b._id || b.slug || b.id) === id ? { ...b, status: currentStatus } : b))
      )
      toast.error(err.message || 'Failed to update publication status.')
    }
  }

  const handleCreateBookWithStock = async (bookData, stockData) => {
    let newBook = null
    try {
      const payloadWithStock = {
        ...bookData,
        stock: Number(stockData?.stock) || 0,
        location: stockData?.location || 'Daffodil Smart City Warehouse',
        reorderPoint: Number(stockData?.reorderPoint) || 40,
        lastBatchNote: stockData?.batchNote || 'Initial Inward Stock Batch',
        shelfNumber: stockData?.shelfNumber || bookData?.shelfNumber || ''
      }
      const res = await api.createBook(payloadWithStock)
      newBook = res?.book || { ...payloadWithStock, _id: `book-${Date.now()}` }
    } catch (err) {
      console.warn('[Create Book Local Fallback]', err.message)
      newBook = {
        ...bookData,
        stock: Number(stockData?.stock) || 0,
        location: stockData?.location || 'Daffodil Smart City Warehouse',
        reorderPoint: Number(stockData?.reorderPoint) || 40,
        lastBatchNote: stockData?.batchNote || 'Initial Inward Stock Batch',
        shelfNumber: stockData?.shelfNumber || bookData?.shelfNumber || '',
        _id: `book-${Date.now()}`
      }
    }

    setBooksList((prev) => [newBook, ...prev])

    // If stock data is provided, save it to inventory storage
    if (stockData && newBook.slug) {
      try {
        const savedStock = JSON.parse(localStorage.getItem('diu_press_erp_inventory_stock') || '{}')
        savedStock[newBook.slug] = Number(stockData.stock) || 0
        localStorage.setItem('diu_press_erp_inventory_stock', JSON.stringify(savedStock))

        const savedMeta = JSON.parse(localStorage.getItem('diu_press_erp_inventory_meta') || '{}')
        savedMeta[newBook.slug] = {
          location: stockData.location || 'Daffodil Smart City Warehouse',
          reorderPoint: Number(stockData.reorderPoint) || 40,
          price: Number(bookData.price) || 600,
          lastBatchNote: stockData.batchNote || 'Initial Inward Stock Batch',
          shelfNumber: stockData.shelfNumber || bookData.shelfNumber || ''
        }
        localStorage.setItem('diu_press_erp_inventory_meta', JSON.stringify(savedMeta))
      } catch (e) {
        console.warn('Failed to sync stock to localStorage', e)
      }
    }

    recordAuditLog({
      category: 'Create',
      location: 'ERP > Inventory & Stock',
      action: `New Publication: ${newBook.title} (${stockData?.stock || 0} copies)`,
      actor: currentActor
    })

    notifyContentUpdated()
    showToast(`Publication "${newBook.title}" created & added to inventory (${stockData?.stock || 0} copies).`)
    return newBook
  }

  const handleUpdateBookData = async (bookIdOrSlug, updatedData) => {
    try {
      const res = await api.updateBook(bookIdOrSlug, updatedData)
      const updated = res?.book || updatedData
      setBooksList((prev) =>
        prev.map((b) => ((b._id || b.slug || b.id) === bookIdOrSlug ? { ...b, ...updated } : b))
      )
      notifyContentUpdated()
      return updated
    } catch (err) {
      console.warn('Backend update book error:', err.message)
      setBooksList((prev) =>
        prev.map((b) => ((b._id || b.slug || b.id) === bookIdOrSlug ? { ...b, ...updatedData } : b))
      )
      return updatedData
    }
  }

  const handleDeleteBook = (book) => {
    const id = book._id || book.slug || book.id
    openConfirm({
      title: 'Delete Publication',
      message: `Are you sure you want to permanently delete "${book.title}"?`,
      confirmLabel: 'Delete Publication',
      onConfirm: async () => {
        try {
          await api.deleteBook(id)
          setBooksList((prev) => prev.filter((b) => (b._id || b.slug || b.id) !== id))

          // Look up current stock from ERP inventory or book object
          const slug = book.slug || book._id || book.id
          let bookStock = book.stock
          try {
            const rawStock = localStorage.getItem('diu_press_erp_inventory_stock')
            if (rawStock) {
              const stockMap = JSON.parse(rawStock)
              if (stockMap[slug] !== undefined) {
                bookStock = stockMap[slug]
              }
            }
          } catch {}
          const finalStock = (bookStock !== undefined && bookStock !== null && !isNaN(Number(bookStock)))
            ? Number(bookStock)
            : (Number(book.stock) || 0)

          const changes = [
            { field: 'Publication Title', from: book.title },
            { field: 'Warehouse Stock', from: `${finalStock} copies` }
          ]
          if (book.price) {
            changes.push({ field: 'Base Price', from: `৳ ${book.price}` })
          }
          if (book.category) {
            changes.push({ field: 'Category', from: book.category })
          }
          if (book.isbn) {
            changes.push({ field: 'ISBN', from: book.isbn })
          }

          recordAuditLog({
            category: 'Delete',
            location: 'CMS > Publications (Books)',
            action: `Deleted Publication: ${book.title} (${finalStock} copies in stock)`,
            target: book.title,
            shortAction: 'Publication Deleted',
            changes,
            actor: currentActor
          })
          showToast('Publication deleted successfully.')
          notifyContentUpdated()
        } catch (err) {
          toast.error(err.message || 'Unable to delete publication. Please try again.')
        }
      }
    })
  }

  // ================= NEWS HANDLERS =================
  const handleSaveNews = async (newsData) => {
    try {
      if (editingNews) {
        const id = editingNews._id || editingNews.slug || editingNews.id
        const res = await api.updateNews(id, newsData)
        const updated = res?.item || { ...editingNews, ...newsData }
        setNewsList((prev) =>
          prev.map((n) => ((n._id || n.slug || n.id) === id ? updated : n))
        )
        recordAuditLog({
          category: 'Update',
          location: 'CMS > News & Announcements',
          action: `${updated.title || newsData.title} Details modified`,
          actor: currentActor
        })
        showToast('Announcement updated successfully.')
      } else {
        const res = await api.createNews(newsData)
        const newItem = res?.item || { ...newsData, _id: `news-${Date.now()}` }
        setNewsList((prev) => [newItem, ...prev])
        recordAuditLog({
          category: 'Create',
          location: 'CMS > News & Announcements',
          action: `New Announcement: ${newItem.title}`,
          actor: currentActor
        })
        showToast('Announcement published successfully.')
      }
      setNewsModalOpen(false)
      setEditingNews(null)
      notifyContentUpdated()
      return true
    } catch (err) {
      toast.error(err.message || 'Unable to save announcement. Please try again.')
      throw err
    }
  }

  const handleDeleteNews = (item) => {
    const id = item._id || item.slug || item.id
    openConfirm({
      title: 'Delete Announcement',
      message: `Are you sure you want to permanently delete announcement "${item.title}"?`,
      confirmLabel: 'Delete Announcement',
      onConfirm: async () => {
        try {
          await api.deleteNews(id)
          setNewsList((prev) => prev.filter((n) => (n._id || n.slug || n.id) !== id))
          const changes = [
            { field: 'Announcement Title', from: item.title }
          ]
          if (item.category) changes.push({ field: 'Category', from: item.category })
          recordAuditLog({
            category: 'Delete',
            location: 'CMS > News & Announcements',
            action: `Deleted Announcement: ${item.title}`,
            target: item.title,
            shortAction: 'Announcement Deleted',
            changes,
            actor: currentActor
          })
          showToast('Announcement deleted successfully.')
          notifyContentUpdated()
        } catch (err) {
          toast.error(err.message || 'Unable to delete announcement. Please try again.')
        }
      }
    })
  }

  // ================= TEAM HANDLERS =================
  const handleSaveTeam = async (memberData) => {
    try {
      if (editingTeam) {
        const id = editingTeam._id || editingTeam.name || editingTeam.id
        const res = await api.updateTeamMember(id, memberData)
        const updated = res?.member || { ...editingTeam, ...memberData }
        setTeamList((prev) =>
          prev.map((t) => ((t._id || t.name || t.id) === id ? updated : t))
        )
        recordAuditLog({
          category: 'Update',
          location: 'CMS > Editorial Team',
          action: `${updated.name || memberData.name} Details modified`,
          actor: currentActor
        })
        showToast('Team member updated successfully.')
      } else {
        const res = await api.createTeamMember(memberData)
        const newMember = res?.member || { ...memberData, _id: `team-${Date.now()}` }
        setTeamList((prev) => [...prev, newMember])
        recordAuditLog({
          category: 'Create',
          location: 'CMS > Editorial Team',
          action: `New Team Member: ${newMember.name}`,
          actor: currentActor
        })
        showToast('Team member added successfully.')
      }
      setTeamModalOpen(false)
      setEditingTeam(null)
      notifyContentUpdated()
      return true
    } catch (err) {
      toast.error(err.message || 'Unable to save team member. Please try again.')
      throw err
    }
  }

  const handleDeleteTeam = (member) => {
    const id = member._id || member.name || member.id
    openConfirm({
      title: 'Remove Team Member',
      message: `Are you sure you want to remove "${member.name}" from the DIU Press editorial team?`,
      confirmLabel: 'Remove Member',
      onConfirm: async () => {
        try {
          await api.deleteTeamMember(id)
          setTeamList((prev) => prev.filter((t) => (t._id || t.name || t.id) !== id))
          const changes = [
            { field: 'Member Name', from: member.name }
          ]
          if (member.role) changes.push({ field: 'Role / Designation', from: member.role })
          recordAuditLog({
            category: 'Delete',
            location: 'CMS > Editorial Team',
            action: `Deleted Team Member: ${member.name}`,
            target: member.name,
            shortAction: 'Team Member Removed',
            changes,
            actor: currentActor
          })
          showToast('Team member removed successfully.')
          notifyContentUpdated()
        } catch (err) {
          toast.error(err.message || 'Unable to remove team member. Please try again.')
        }
      }
    })
  }

  // ================= WRITERS HANDLERS =================
  const handleSaveWriter = async (writerData) => {
    try {
      if (editingWriter) {
        const id = editingWriter._id || editingWriter.slug || editingWriter.id
        const res = await api.updateWriter(id, writerData)
        const updated = res?.writer || { ...editingWriter, ...writerData }
        setWritersList((prev) =>
          prev.map((w) => ((w._id || w.slug || w.id) === id ? updated : w))
        )
        recordAuditLog({
          category: 'Update',
          location: 'CMS > Writers & Authors',
          action: `${updated.name || writerData.name} Details modified`,
          actor: currentActor
        })
        showToast('Writer profile updated successfully.')
      } else {
        const res = await api.createWriter(writerData)
        const newWriter = res?.writer || { ...writerData, _id: `writer-${Date.now()}` }
        setWritersList((prev) => [...prev, newWriter])
        recordAuditLog({
          category: 'Create',
          location: 'CMS > Writers & Authors',
          action: `New Writer: ${newWriter.name}`,
          actor: currentActor
        })
        showToast('Writer profile added successfully.')
      }
      setWriterModalOpen(false)
      setEditingWriter(null)
      notifyContentUpdated()
      return true
    } catch (err) {
      toast.error(err.message || 'Unable to save writer profile. Please try again.')
      throw err
    }
  }

  const handleDeleteWriter = (writer) => {
    const id = writer._id || writer.slug || writer.id
    openConfirm({
      title: 'Remove Writer Profile',
      message: `Are you sure you want to remove "${writer.name}" from the DIU Press writers directory? Associated Cloudinary photo will also be removed.`,
      confirmLabel: 'Remove Writer',
      onConfirm: async () => {
        try {
          await api.deleteWriter(id)
          setWritersList((prev) => prev.filter((w) => (w._id || w.slug || w.id) !== id))
          const changes = [
            { field: 'Writer Name', from: writer.name }
          ]
          if (writer.designation) changes.push({ field: 'Designation', from: writer.designation })
          recordAuditLog({
            category: 'Delete',
            location: 'CMS > Writers & Authors',
            action: `Deleted Writer: ${writer.name}`,
            target: writer.name,
            shortAction: 'Writer Removed',
            changes,
            actor: currentActor
          })
          showToast('Writer profile removed successfully.')
          notifyContentUpdated()
        } catch (err) {
          toast.error(err.message || 'Unable to remove writer profile. Please try again.')
        }
      }
    })
  }

  // ================= SUBMISSIONS HANDLERS =================
  const handleUpdateSubmissionStatus = async (id, status, notes = '', submission = null) => {
    try {
      const payload = { status, editorialNotes: notes }
      if (submission?.submissionId) payload.submissionId = submission.submissionId
      await api.updateSubmission(id, payload)
      setSubmissionsList((prev) =>
        prev.map((s) => ((s._id || s.submissionId || s.id) === id ? { ...s, status, editorialNotes: notes } : s))
      )
      const oldStatus = (submission?.status || 'submitted').replace('_', ' ')
      const newStatus = status.replace('_', ' ')
      const subTitle = submission?.title || `Submission #${id}`
      recordAuditLog({
        category: 'Update',
        location: 'CMS > Manuscript Submissions',
        action: `${subTitle} Status: ${oldStatus} -> ${newStatus}`,
        actor: currentActor
      })
      showToast('Submission status updated successfully.')
      setSubmissionModalOpen(false)
      setEditingSubmission(null)
      notifyContentUpdated()
      return true
    } catch (err) {
      toast.error(err.message || 'Unable to update submission. Please try again.')
      throw err
    }
  }

  const handleDeleteSubmission = (sub) => {
    const id = sub._id || sub.submissionId || sub.id
    openConfirm({
      title: 'Delete Submission',
      message: `Are you sure you want to permanently delete submission "${sub.title}"?`,
      confirmLabel: 'Delete Submission',
      onConfirm: async () => {
        try {
          await api.deleteSubmission(id)
          setSubmissionsList((prev) => prev.filter((s) => (s._id || s.submissionId || s.id) !== id))
          const changes = [
            { field: 'Manuscript Title', from: sub.title }
          ]
          if (sub.author) changes.push({ field: 'Author Name', from: sub.author })
          if (sub.status) changes.push({ field: 'Submission Status', from: sub.status })
          recordAuditLog({
            category: 'Delete',
            location: 'CMS > Manuscript Submissions',
            action: `Deleted Manuscript: ${sub.title}`,
            target: sub.title,
            shortAction: 'Manuscript Deleted',
            changes,
            actor: currentActor
          })
          showToast('Submission deleted successfully.')
          notifyContentUpdated()
        } catch (err) {
          toast.error(err.message || 'Unable to delete submission. Please try again.')
        }
      }
    })
  }

  // ================= CONTACT MESSAGES HANDLERS =================
  const handleToggleContactRead = async (contact) => {
    const id = contact._id || contact.id
    const updatedStatus = !contact.read
    try {
      await api.updateContact(id, { read: updatedStatus, status: updatedStatus ? 'read' : 'new' })
      setContactsList((prev) =>
        prev.map((c) => ((c._id || c.id) === id ? { ...c, read: updatedStatus, status: updatedStatus ? 'read' : 'new' } : c))
      )
      setReadNotifIds((prev) => {
        const notifId = `contact-${id}`
        const next = updatedStatus
          ? (prev.includes(notifId) ? prev : [...prev, notifId])
          : prev.filter((item) => item !== notifId)
        try {
          localStorage.setItem('diu_press_read_notifs', JSON.stringify(next.slice(-300)))
        } catch {}
        return next
      })
      showToast(updatedStatus ? 'Message marked as read.' : 'Message marked as unread.')
    } catch (err) {
      toast.error(err.message || 'Unable to update message. Please try again.')
    }
  }

  const handleDeleteContact = (contact) => {
    const id = contact._id || contact.id
    openConfirm({
      title: 'Delete Message',
      message: `Are you sure you want to delete message from "${contact.name}"?`,
      confirmLabel: 'Delete Message',
      onConfirm: async () => {
        try {
          await api.deleteContact(id)
          setContactsList((prev) => prev.filter((c) => (c._id || c.id) !== id))
          showToast('Message deleted successfully.')
        } catch (err) {
          toast.error(err.message || 'Unable to delete message. Please try again.')
        }
      }
    })
  }

  // ================= ACCOUNTS MANAGEMENT HANDLERS =================
  const handleSaveAccount = async (accountData) => {
    try {
      if (editingAccount) {
        const id = editingAccount._id || editingAccount.email || editingAccount.id
        const res = await api.updateAccount(id, accountData)
        const updated = res?.account || { ...editingAccount, ...accountData }
        setAccountsList((prev) => {
          const next = prev.map((a) => ((a._id || a.email || a.id) === id ? updated : a))
          localStorage.setItem('diu_press_local_accounts', JSON.stringify(next))
          return next
        })
        // If the modified account belongs to the logged-in administrator, update session
        if (user && (user.email === editingAccount.email || user.email === accountData.email || user.id === id || user._id === id)) {
          updateProfile({
            name: updated.name,
            designation: updated.designation,
            role: updated.role
          }).catch(() => {})
        }
        const oldRole = editingAccount.role || 'Staff'
        const newRole = accountData.role || oldRole
        let accAction = ''
        if (oldRole !== newRole) {
          accAction = `${accountData.email || editingAccount.email} Role: ${oldRole} -> ${newRole}`
        } else {
          accAction = `${accountData.email || editingAccount.email} Profile details updated`
        }
        recordAuditLog({
          category: 'Update',
          location: 'Admin > Accounts & Staff',
          action: accAction,
          actor: currentActor
        })
        showToast('Account details and permissions updated successfully.')
      } else {
        const res = await api.createAccount(accountData)
        const newAcc = res?.account || { ...accountData, _id: `acc-${Date.now()}`, createdAt: new Date().toISOString() }
        setAccountsList((prev) => {
          const next = [newAcc, ...prev]
          localStorage.setItem('diu_press_local_accounts', JSON.stringify(next))
          return next
        })
        recordAuditLog({
          category: 'Create',
          location: 'Admin > Accounts & Staff',
          action: `New Account: ${accountData.email}`,
          actor: currentActor
        })
        showToast('Staff account created successfully.')
      }
      setAccountModalOpen(false)
      setEditingAccount(null)
      return true
    } catch (err) {
      toast.error(err.message || 'Unable to save account. Please try again.')
      throw err
    }
  }

  const handleDeleteAccount = (account) => {
    const id = account._id || account.email || account.id
    if (user?.email === account.email) {
      toast.error('You cannot delete your own logged-in account!')
      return
    }
    openConfirm({
      title: 'Delete Staff Account',
      message: `Are you sure you want to delete administrator account "${account.email}"?`,
      confirmLabel: 'Delete Account',
      onConfirm: async () => {
        try {
          await api.deleteAccount(id)
          setAccountsList((prev) => prev.filter((a) => (a._id || a.email || a.id) !== id))
          const changes = [
            { field: 'Account Email', from: account.email }
          ]
          if (account.role) changes.push({ field: 'Role', from: account.role })
          recordAuditLog({
            category: 'Delete',
            location: 'Admin > Accounts & Staff',
            action: `Deleted Account: ${account.email}`,
            target: account.email,
            shortAction: 'Account Deleted',
            changes,
            actor: currentActor
          })
          showToast('Account deleted successfully.')
        } catch (err) {
          toast.error(err.message || 'Unable to delete account. Please try again.')
        }
      }
    })
  }

  // ================= PERSONAL ACCOUNT SETTINGS HANDLER =================
  const handleSaveAccountSettings = async (formData) => {
    try {
      await updateProfile(formData)
      recordAuditLog({
        category: 'Update',
        location: 'Admin > Accounts & Staff',
        action: `${user?.email || 'admin'} Profile details updated`,
        actor: currentActor
      })
      showToast('Account profile and settings updated successfully!')
      setAccountSettingsModalOpen(false)
      // Synchronize in accounts list if present
      if (user?.email) {
        setAccountsList((prev) => {
          const updated = prev.map((a) =>
            a.email === user.email
              ? {
                  ...a,
                  name: formData.name || a.name,
                  designation: formData.designation || a.designation
                }
              : a
          )
          localStorage.setItem('diu_press_local_accounts', JSON.stringify(updated))
          return updated
        })
      }
    } catch (err) {
      throw err
    }
  }

  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-diu-navy text-white">
        <div className="text-center">
          <img src="/brand/diu-press-logo.png" alt="DIU Press" className="mx-auto h-12 w-12 animate-pulse" />
          <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/50">
            Verifying Admin Authorization...
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* Toast Notification Banner - Relocated to top-right */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[120] flex items-center gap-2.5 rounded-xl bg-diu-navy px-5 py-3 text-xs font-semibold text-white shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle className="h-4 w-4 text-diu-green shrink-0" />
          <span className="tracking-wide">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage('')}
            className="ml-2 text-white/50 hover:text-white transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ================= DASHBOARD SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-slate-200 bg-diu-navy text-white transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand Header */}
        {isSidebarCollapsed ? (
          <div className="flex h-20 flex-col items-center justify-center gap-1.5 border-b border-white/10 px-2 py-2">
            <img src="/brand/diu-press-logo.png" alt="DIU Press" className="h-7 w-7 object-contain" />
            <button
              type="button"
              onClick={toggleSidebar}
              title="Open full sidebar"
              aria-label="Open full sidebar"
              className="group flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/[0.08] text-blue-200 shadow-sm transition-all duration-200 hover:bg-diu-blue hover:text-white hover:border-diu-blue hover:scale-110 active:scale-95"
            >
              <PanelLeftOpen className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        ) : (
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
            <div className="flex items-center gap-3 min-w-0">
              <img src="/brand/diu-press-logo.png" alt="DIU Press" className="h-9 w-9 shrink-0 object-contain" />
              <div className="min-w-0">
                <div className="font-serif text-lg font-bold tracking-tight text-white truncate">DIU Press</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300 truncate">
                  Admin Dashboard
                </div>
              </div>
            </div>
            {/* Closer on top of sidebar */}
            <button
              type="button"
              onClick={toggleSidebar}
              title="Collapse sidebar (Show icons only)"
              aria-label="Collapse sidebar"
              className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-blue-200 shadow-sm transition-all duration-200 hover:bg-diu-blue hover:text-white hover:border-diu-blue hover:shadow-md hover:scale-105 active:scale-95"
            >
              <PanelLeftClose className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </button>
          </div>
        )}

        {/* User Profile Section */}
        {isSidebarCollapsed ? (
          <div className="p-2.5 border-b border-white/10 flex justify-center">
            <button
              type="button"
              onClick={() => handleSelectTab('account-settings')}
              title={`${user?.name || 'Administrator'} (${user?.role || 'admin'}) • Account Settings`}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-diu-blue text-xs font-bold text-white shadow-md ring-2 ring-white/15 transition-all duration-200 hover:ring-blue-400 hover:scale-105 active:scale-95"
            >
              <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-xl">
                <SafeUserAvatar
                  avatar={user?.avatar}
                  name={user?.name}
                  className="h-full w-full object-cover"
                  fallbackClassName="text-xs font-bold text-white"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 z-10 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-diu-navy shadow-md" />

              {/* Popover tooltip */}
              <div className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 z-50 hidden group-hover:flex items-center">
                <div className="rounded-xl bg-slate-900/95 px-3 py-1.5 text-[11px] text-white shadow-xl backdrop-blur-sm whitespace-nowrap border border-white/15">
                  <div className="font-bold">{user?.name || 'Administrator'}</div>
                  <div className="text-[10px] text-blue-300">{user?.role || 'admin'} • Account Settings</div>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="p-2.5 border-b border-white/10">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 shadow-sm transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-diu-blue text-xs font-bold text-white shadow-inner ring-2 ring-white/10">
                  <SafeUserAvatar
                    avatar={user?.avatar}
                    name={user?.name}
                    className="h-full w-full object-cover"
                    fallbackClassName="text-xs font-bold text-white"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-white tracking-wide">{user?.name || 'Administrator'}</div>
                  <div className="truncate text-[11px] font-medium text-blue-200/90 mt-0.5">{user?.designation || 'Administrator'}</div>
                  <div className="truncate text-[10px] text-white/50 mt-0.5">{user?.email || 'admin@diupress.local'}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span className="inline-flex items-center gap-1 rounded-md bg-diu-green/20 px-2 py-0.5 font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/20">
                  <Shield className="h-3 w-3" /> {user?.role || 'admin'}
                </span>
                <span className="text-white/45 font-medium">Secure Session</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu - Collapsed vs Full Accordion */}
        {isSidebarCollapsed ? (
          /* Short Sidebar: Icons Only */
          <nav className="flex-1 space-y-3.5 overflow-y-auto px-2 py-3 text-xs font-medium scrollbar-thin-dark flex flex-col items-center">
            {/* Website Section Icons */}
            <div className="w-full space-y-1.5 flex flex-col items-center">
              <div className="text-[9px] font-bold uppercase tracking-wider text-blue-300/60 select-none">
                CMS
              </div>

              <CollapsedNavItem
                icon={LayoutDashboard}
                label="Dashboard Overview"
                active={activeTab === 'overview'}
                onClick={() => handleSelectTab('overview')}
                color="blue"
              />

              <CollapsedNavItem
                icon={BookOpen}
                label="Publications (Books)"
                active={activeTab === 'books'}
                onClick={() => handleSelectTab('books')}
                color="blue"
              />

              <CollapsedNavItem
                icon={Newspaper}
                label="News & Announcements"
                active={activeTab === 'news'}
                onClick={() => handleSelectTab('news')}
                color="blue"
              />

              <CollapsedNavItem
                icon={PenTool}
                label="Writers & Authors"
                active={activeTab === 'writers'}
                onClick={() => handleSelectTab('writers')}
                color="blue"
              />

              <CollapsedNavItem
                icon={FileText}
                label="Manuscript Submissions"
                active={activeTab === 'submissions'}
                onClick={() => handleSelectTab('submissions')}
                color="blue"
                badge={submissionsList.filter((s) => s.status === 'received').length}
              />

              <CollapsedNavItem
                icon={Users}
                label="Editorial Team"
                active={activeTab === 'team'}
                onClick={() => handleSelectTab('team')}
                color="blue"
              />

              <CollapsedNavItem
                icon={Inbox}
                label="Contact Arrival"
                active={activeTab === 'contacts'}
                onClick={() => handleSelectTab('contacts')}
                color="blue"
                badge={contactsList.filter((c) => !c.read && c.status !== 'read').length}
              />
            </div>

            {/* Subtle Divider */}
            <div className="w-8 h-px bg-white/10 my-0.5" />

            {/* ERP Section Icons */}
            <div className="w-full space-y-1.5 flex flex-col items-center">
              <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-300/70 select-none">
                ERP
              </div>

              <CollapsedNavItem
                icon={BarChart3}
                label="ERP Overview"
                active={activeTab === 'erp-overview'}
                onClick={() => handleSelectTab('erp-overview')}
                color="emerald"
              />

              <CollapsedNavItem
                icon={BookMarked}
                label="Books Management"
                active={activeTab === 'erp-books-management'}
                onClick={() => handleSelectTab('erp-books-management')}
                color="emerald"
              />

              <CollapsedNavItem
                icon={Package}
                label="Inventory & Stock"
                active={activeTab === 'erp-inventory'}
                onClick={() => handleSelectTab('erp-inventory')}
                color="emerald"
              />

              <CollapsedNavItem
                icon={ShoppingCart}
                label="Sales & Orders"
                active={activeTab === 'erp-sales'}
                onClick={() => handleSelectTab('erp-sales')}
                color="emerald"
              />

              <CollapsedNavItem
                icon={CreditCard}
                label="Payments & Invoicing"
                active={activeTab === 'erp-payments'}
                onClick={() => handleSelectTab('erp-payments')}
                color="emerald"
              />
            </div>

            {/* Subtle Divider */}
            <div className="w-8 h-px bg-white/10 my-0.5" />

            {/* Administration Section Icons */}
            <div className="w-full space-y-1.5 flex flex-col items-center">
              <div className="text-[9px] font-bold uppercase tracking-wider text-purple-300/70 select-none">
                ADM
              </div>

              <CollapsedNavItem
                icon={UserCheck}
                label="Accounts & Staff"
                active={activeTab === 'accounts'}
                onClick={() => handleSelectTab('accounts')}
                color="purple"
              />

              <CollapsedNavItem
                icon={KeyRound}
                label="Access Control"
                active={activeTab === 'admin-access'}
                onClick={() => handleSelectTab('admin-access')}
                color="purple"
              />

              <CollapsedNavItem
                icon={History}
                label="Audit Trail"
                active={activeTab === 'admin-audit'}
                onClick={() => handleSelectTab('admin-audit')}
                color="purple"
              />

              <CollapsedNavItem
                icon={Shield}
                label="System & Security"
                active={activeTab === 'admin-settings'}
                onClick={() => handleSelectTab('admin-settings')}
                color="purple"
              />
            </div>
          </nav>
        ) : (
          /* Full Expanded Sidebar Navigation Menu */
          <nav className="flex-1 space-y-3 overflow-y-auto px-3.5 py-4 text-xs font-medium scrollbar-thin-dark">
          
          {/* ================= 1. DIU PRESS WEBSITE SECTION ================= */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('website')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 group ${
                openSection === 'website'
                  ? 'bg-blue-500/20 text-white border border-blue-400/40 shadow-sm'
                  : 'bg-white/[0.04] text-blue-200/90 border border-white/10 hover:bg-white/[0.08] hover:border-blue-400/30 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/30 text-blue-300 group-hover:bg-blue-500/40">
                  <Globe className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold tracking-wider">DIU Press Website</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-blue-400/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-200 tracking-normal">
                  CMS
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-white/60 transition-transform duration-200 ${
                    openSection !== 'website' ? '-rotate-90 text-white/40' : 'text-white'
                  }`}
                />
              </div>
            </button>

            {openSection === 'website' && (
              <div className="space-y-1 pl-1 pt-0.5">
                <button
                  onClick={() => handleSelectTab('overview')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 transition-all duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-diu-blue font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard Overview</span>
                </button>

                <button
                  onClick={() => handleSelectTab('books')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'books'
                      ? 'bg-diu-blue font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Publications (Books)</span>
                </button>

                <button
                  onClick={() => handleSelectTab('news')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'news'
                      ? 'bg-diu-blue font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Newspaper className="h-4 w-4" />
                  <span>News & Announcements</span>
                </button>

                <button
                  onClick={() => handleSelectTab('writers')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'writers'
                      ? 'bg-diu-blue font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <PenTool className="h-4 w-4" />
                  <span>Writers & Authors</span>
                </button>

                <button
                  onClick={() => handleSelectTab('submissions')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'submissions'
                      ? 'bg-diu-blue font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Manuscript Submissions</span>
                </button>

                <button
                  onClick={() => handleSelectTab('team')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'team'
                      ? 'bg-diu-blue font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Editorial Team</span>
                </button>

                <button
                  onClick={() => handleSelectTab('contacts')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'contacts'
                      ? 'bg-diu-blue font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Inbox className="h-4 w-4" />
                  <span>Contact Arrival</span>
                </button>
              </div>
            )}
          </div>

          {/* ================= 2. DIU PRESS ERP SECTION ================= */}
          <div className="space-y-1 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => toggleSection('erp')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 group ${
                openSection === 'erp'
                  ? 'bg-emerald-500/20 text-white border border-emerald-400/40 shadow-sm'
                  : 'bg-white/[0.04] text-emerald-200/90 border border-white/10 hover:bg-white/[0.08] hover:border-emerald-400/30 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/30 text-emerald-300 group-hover:bg-emerald-500/40">
                  <Boxes className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold tracking-wider">DIU Press ERP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-200 tracking-normal">
                  ERP
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-white/60 transition-transform duration-200 ${
                    openSection !== 'erp' ? '-rotate-90 text-white/40' : 'text-white'
                  }`}
                />
              </div>
            </button>

            {openSection === 'erp' && (
              <div className="space-y-1 pl-1 pt-0.5">
                <button
                  onClick={() => handleSelectTab('erp-overview')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 transition-all duration-200 ${
                    activeTab === 'erp-overview'
                      ? 'bg-emerald-600 font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 text-emerald-300" />
                  <span>ERP Overview</span>
                </button>

                <button
                  onClick={() => handleSelectTab('erp-books-management')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'erp-books-management'
                      ? 'bg-emerald-600 font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <BookMarked className="h-4 w-4" />
                  <span>Books Management</span>
                </button>

                <button
                  onClick={() => handleSelectTab('erp-inventory')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'erp-inventory'
                      ? 'bg-emerald-600 font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Inventory & Stock</span>
                </button>

                <button
                  onClick={() => handleSelectTab('erp-sales')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'erp-sales'
                      ? 'bg-emerald-600 font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Sales & Orders</span>
                </button>

                <button
                  onClick={() => handleSelectTab('erp-payments')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'erp-payments'
                      ? 'bg-emerald-600 font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Payments & Invoicing</span>
                </button>
              </div>
            )}
          </div>

          {/* ================= 3. ADMINISTRATION CONTROL SECTION ================= */}
          <div className="space-y-1 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => toggleSection('administration')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 group ${
                openSection === 'administration'
                  ? 'bg-purple-500/20 text-white border border-purple-400/40 shadow-sm'
                  : 'bg-white/[0.04] text-purple-200/90 border border-white/10 hover:bg-white/[0.08] hover:border-purple-400/30 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/30 text-purple-300 group-hover:bg-purple-500/40">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold tracking-wider">Administration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-purple-400/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-200 tracking-normal">
                  ADMIN
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-white/60 transition-transform duration-200 ${
                    openSection !== 'administration' ? '-rotate-90 text-white/40' : 'text-white'
                  }`}
                />
              </div>
            </button>

            {openSection === 'administration' && (
              <div className="space-y-1 pl-1 pt-0.5">
                <button
                  onClick={() => handleSelectTab('accounts')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'accounts'
                      ? 'bg-purple-600 font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold text-white">Accounts & Staff</span>
                </button>

                <button
                  onClick={() => handleSelectTab('admin-access')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'admin-access'
                      ? 'bg-purple-600 font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <KeyRound className="h-4 w-4 text-purple-300" />
                  <span>Access Control</span>
                </button>

                <button
                  onClick={() => handleSelectTab('admin-audit')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                    activeTab === 'admin-audit'
                      ? 'bg-purple-600 font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span>Audit Trail</span>
                </button>

                <button
                  onClick={() => handleSelectTab('admin-settings')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 transition-all duration-200 ${
                    activeTab === 'admin-settings'
                      ? 'bg-purple-600 font-semibold text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>System & Security</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Footer Actions */}
      {isSidebarCollapsed ? (
        <div className="border-t border-white/10 p-2.5 flex justify-center">
          <Link
            to="/"
            target="_blank"
            title="View Live Website"
            aria-label="View Live Website"
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95"
          >
            <ExternalLink className="h-4 w-4" />
            <div className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 z-50 hidden group-hover:flex items-center">
              <div className="rounded-lg bg-slate-900/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl backdrop-blur-sm whitespace-nowrap border border-white/15">
                View Live Website
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="border-t border-white/10 p-3">
          <Link
            to="/"
            target="_blank"
            className="flex w-full items-center justify-between rounded-full px-4 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" /> View Live Website
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          </Link>
        </div>
      )}
    </aside>

      {/* ================= DASHBOARD MAIN CONTENT ================= */}
      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-20' : 'ml-72'
      }`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              TAB_CONFIG[activeTab]?.badgeClass || 'bg-blue-50 text-diu-blue border-blue-200'
            }`}>
              {TAB_CONFIG[activeTab]?.section || 'Console'}
            </span>
            <h1 className="font-serif text-xl font-bold text-diu-navy">
              {TAB_CONFIG[activeTab]?.title || activeTab}
            </h1>
            <span className="hidden md:inline text-xs text-slate-300">•</span>
            <span className="hidden md:inline text-xs text-slate-500">DIU Press Management Console</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Notification Bell with Dropdown */}
            <div className="relative" ref={notificationRef}>
              <div className="relative inline-flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setNotificationOpen((prev) => !prev)}
                  className="flex items-center justify-center p-2 text-slate-600 transition-colors hover:text-diu-blue focus:outline-none !overflow-visible"
                  title="Live Notifications"
                  aria-label="Live Notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>
                {unreadNotifCount > 0 && (
                  <span
                    onClick={() => setNotificationOpen((prev) => !prev)}
                    className="pointer-events-none absolute top-0.5 right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-600 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-white"
                  >
                    {unreadNotifCount}
                  </span>
                )}
              </div>

              {/* Notification Popover Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Popover Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Live Notifications
                      </h4>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live
                      </span>
                    </div>
                    {unreadNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-diu-blue hover:text-blue-700 hover:underline"
                      >
                        <CheckCheck className="h-3 w-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  {/* Popover List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        <CheckCircle className="mx-auto h-8 w-8 text-emerald-400 mb-1 opacity-70" />
                        No notifications. You are all caught up!
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`group relative flex cursor-pointer items-start gap-3 p-3.5 transition-colors duration-150 hover:bg-slate-50 ${
                            notif.unread ? 'bg-blue-50/40' : 'bg-white'
                          }`}
                        >
                          {/* Unread indicator dot */}
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              notif.unread ? 'bg-diu-blue' : 'bg-transparent'
                            }`}
                          ></span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                  notif.badgeClass || 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {notif.badge}
                              </span>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {notif.time}
                              </span>
                            </div>
                            <p
                              className={`text-xs leading-snug line-clamp-1 ${
                                notif.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                              }`}
                            >
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                              {notif.desc}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => dismissNotification(e, notif.id)}
                            className="shrink-0 p-1 text-slate-300 hover:text-slate-500 rounded transition opacity-0 group-hover:opacity-100"
                            title="Dismiss notification"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Popover Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-diu-green" /> System Healthy
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectTab('admin-audit')
                        setNotificationOpen(false)
                      }}
                      className="font-medium text-diu-blue hover:underline"
                    >
                      Audit Trail &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-diu-blue shadow-sm transition-all duration-200 hover:bg-slate-100 hover:shadow hover:-translate-y-0.5"
            >
              <span>Back to Storefront</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            {/* Account Profile Icon with Dropdown */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                type="button"
                onClick={() => setAccountDropdownOpen((prev) => !prev)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 shadow-sm overflow-hidden ${
                  accountDropdownOpen
                    ? 'border-diu-blue bg-blue-50 text-diu-blue ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-diu-blue/40 hover:bg-slate-100 hover:text-diu-blue'
                }`}
                title="Account Menu"
                aria-label="Account Menu"
              >
                {user?.avatar ? (
                  <SafeUserAvatar
                    avatar={user.avatar}
                    name={user?.name || 'Account'}
                    className="h-full w-full object-cover"
                    fallbackClassName="text-xs font-bold text-slate-700"
                  />
                ) : (
                  <User className="h-4.5 w-4.5" />
                )}
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Account Header */}
                  <div className="border-b border-slate-100 px-3.5 py-2.5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-diu-navy to-diu-blue text-sm font-bold text-white shadow-sm ring-2 ring-slate-100">
                      <SafeUserAvatar
                        avatar={user?.avatar}
                        name={user?.name || 'Administrator'}
                        className="h-full w-full object-cover"
                        fallbackClassName="text-sm font-bold text-white"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {user?.name || 'Administrator'}
                      </p>
                      <p className="text-[11px] font-medium text-diu-blue truncate">
                        {user?.designation || (user?.role === 'admin' ? 'Administrator' : 'Editor')}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {user?.email || 'admin@diupress.local'}
                      </p>
                    </div>
                  </div>

                  <div className="p-1 space-y-1">
                    {/* Option 1: Account Settings (Navigates to dedicated page) */}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountDropdownOpen(false)
                        navigate('/admin/account-settings')
                        setActiveTab('account-settings')
                        setOpenSection(null)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-diu-blue transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>Account Settings</span>
                    </button>

                    {/* Option 2: Logout */}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountDropdownOpen(false)
                        logout()
                        navigate('/')
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8">
          {/* ================= 1. OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-diu-navy via-blue-900 to-diu-blue p-8 text-white shadow-lg">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-200 backdrop-blur-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-diu-green" /> DIU Press Control Center
                  </div>
                  <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                    Welcome back, {user?.name || 'Administrator'}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    Manage publications, review author manuscripts, broadcast announcements, coordinate press
                    staff, and administer system accounts.
                  </p>
                </div>
              </div>

              {/* Metrics Cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <div
                  onClick={() => handleSelectTab('books')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Publications</span>
                    <BookOpen className="h-5 w-5 text-diu-blue" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{(booksList || []).length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Live titles in catalogue</div>
                </div>

                <div
                  onClick={() => handleSelectTab('news')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Dispatches</span>
                    <Newspaper className="h-5 w-5 text-diu-green" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{(newsList || []).length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">News & announcements</div>
                </div>

                <div
                  onClick={() => handleSelectTab('writers')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Writers</span>
                    <PenTool className="h-5 w-5 text-diu-blue" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{(writersList || []).length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Scholars & authors</div>
                </div>

                <div
                  onClick={() => handleSelectTab('submissions')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Manuscripts</span>
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{(submissionsList || []).length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Author submissions</div>
                </div>

                <div
                  onClick={() => handleSelectTab('team')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Staff</span>
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{(teamList || []).length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Editorial & operations</div>
                </div>

                <div
                  onClick={() => handleSelectTab('contacts')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Arrivals</span>
                    <Inbox className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{(contactsList || []).length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {(contactsList || []).filter((c) => !c.read).length} unread inquiries
                  </div>
                </div>

                <div
                  onClick={() => handleSelectTab('accounts')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Accounts</span>
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{(accountsList || []).length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Admin accounts</div>
                </div>
              </div>

              {/* Quick Action Hub */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-diu-navy">Quick Management Actions</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleSelectTab('erp-inventory')}
                    className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-diu-blue hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    <Boxes className="h-4 w-4" /> Manage Inventory & Stock
                  </button>

                  <button
                    onClick={() => {
                      setEditingNews(null)
                      setNewsModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-diu-navy shadow-sm transition-all duration-300 hover:bg-white hover:border-diu-green/50 hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4 text-diu-green" /> Post Announcement
                  </button>

                  <button
                    onClick={() => {
                      setEditingAccount(null)
                      setAccountModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-diu-navy shadow-sm transition-all duration-300 hover:bg-white hover:border-emerald-500/50 hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4 text-emerald-600" /> Create Administrator Account
                  </button>

                  <button
                    onClick={() => {
                      setEditingTeam(null)
                      setTeamModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-diu-navy shadow-sm transition-all duration-300 hover:bg-white hover:border-purple-500/50 hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4 text-purple-600" /> Add Team Member
                  </button>
                </div>
              </div>

              {/* ERP & Administration Highlights Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* ERP Panel */}
                <div className="rounded-xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/60 to-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                        <Boxes className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-diu-navy">DIU Press ERP Operations</h4>
                        <p className="text-[11px] text-slate-500">Warehouse stock, fulfillment & sales</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                      ERP Active
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-emerald-100 bg-white p-3 text-center">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock on Hand</div>
                      <div className="font-serif text-lg font-bold text-diu-navy">4,850</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Net Sales (MTD)</div>
                      <div className="font-serif text-lg font-bold text-emerald-700">৳ 3.48L</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fulfilled Orders</div>
                      <div className="font-serif text-lg font-bold text-diu-navy">182</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSelectTab('erp-inventory')}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-50 transition"
                    >
                      <Package className="h-3.5 w-3.5" /> Inventory Management
                    </button>
                    <button
                      onClick={() => handleSelectTab('erp-sales')}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-50 transition"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Sales & Orders
                    </button>
                    <button
                      onClick={() => handleSelectTab('erp-payments')}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-50 transition"
                    >
                      <CreditCard className="h-3.5 w-3.5" /> Invoicing & Royalties
                    </button>
                  </div>
                </div>

                {/* Administration Panel */}
                <div className="rounded-xl border border-purple-200/90 bg-gradient-to-br from-purple-50/60 to-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-diu-navy">Administration Control</h4>
                        <p className="text-[11px] text-slate-500">Security, user accounts & audit logs</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-purple-800">
                      Governance
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-purple-100 bg-white p-3 text-center">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Staff</div>
                      <div className="font-serif text-lg font-bold text-diu-navy">{(accountsList || []).length}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audit Status</div>
                      <div className="font-serif text-lg font-bold text-purple-700">Verified</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Session Mode</div>
                      <div className="font-serif text-lg font-bold text-diu-navy">Strict</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSelectTab('accounts')}
                      className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-purple-800 shadow-2xs hover:bg-purple-50 transition"
                    >
                      <UserCheck className="h-3.5 w-3.5" /> Staff Accounts
                    </button>
                    <button
                      onClick={() => handleSelectTab('admin-access')}
                      className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-purple-800 shadow-2xs hover:bg-purple-50 transition"
                    >
                      <KeyRound className="h-3.5 w-3.5" /> Access Control
                    </button>
                    <button
                      onClick={() => handleSelectTab('admin-audit')}
                      className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-purple-800 shadow-2xs hover:bg-purple-50 transition"
                    >
                      <History className="h-3.5 w-3.5" /> Audit Trail Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. BOOKS TAB ================= */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-diu-navy">Manage Books & Publications</h2>
                  <p className="text-xs text-slate-500">Edit publication visibility, read sample PDF links, e-commerce store purchase links, and cover artwork.</p>
                </div>
              </div>

              {/* Publication Metrics Overview */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Publications</span>
                    <BookOpen className="h-5 w-5 text-diu-blue" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{booksList.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Total catalog titles</div>
                </div>

                <div className="rounded-xl border border-amber-200/90 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Needs Attention</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-amber-600">{pendingCmsBooks.length}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      pendingCmsBooks.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {pendingCmsBooks.length > 0 ? 'Pending Setup' : 'All Clear'}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {pendingCmsBooks.length === 1 ? '1 title awaiting CMS setup' : `${pendingCmsBooks.length} titles awaiting CMS setup`}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-300 hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Quantity (Volume)</span>
                    <Boxes className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {totalPhysicalCopies.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">units</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Physical warehouse stock count</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live on Website</span>
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-emerald-700">{liveActiveBooks.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Published and available to purchase</div>
                </div>
              </div>

              {/* Pending Publication Setup Section (Referencing ERP Inward Stock Workflow) */}
              <div className="overflow-hidden rounded-xl border border-amber-200/90 bg-white shadow-sm">
                {/* Card Header */}
                <div className="flex flex-col gap-2 border-b border-amber-100 bg-amber-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-slate-900">
                          Pending Publication Setup
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                          {pendingCmsBooks.length} pending
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        New inventory additions awaiting editorial cover art, preview excerpts, and storefront links before going live.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Publication Details</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Target Warehouse</th>
                        <th className="px-5 py-3 text-center">Stock Copies</th>
                        <th className="px-5 py-3">Date Added</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingCmsBooks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
                              <Check className="h-5 w-5" />
                            </div>
                            <div className="font-medium text-slate-700">All publications are completely set up</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              New titles created in ERP Inventory will appear here for editorial setup and website activation.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        pendingCmsBooks.map((book) => {
                          const bookStock = book.stock !== undefined ? book.stock : 150
                          const createdDate = book.createdAt ? new Date(book.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
                          return (
                            <tr
                              key={book.slug || book._id}
                              onClick={() => setViewingBook(book)}
                              className="cursor-pointer hover:bg-amber-50/40 transition-colors"
                            >
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded bg-slate-900 border border-slate-200">
                                    <SafeBookThumb book={book} />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-serif text-sm font-bold text-diu-navy line-clamp-1">
                                      {book.title}
                                    </div>
                                    <div className="text-[11px] text-slate-500 line-clamp-1">
                                      {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="rounded bg-blue-50 px-2 py-0.5 font-medium text-diu-blue text-[11px]">
                                  {book.category || 'Monograph'}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-slate-600">
                                <span className="inline-flex items-center gap-1.5 text-[11px]">
                                  <Warehouse className="h-3 w-3 text-slate-400" />
                                  {book.location || 'Daffodil Smart City Warehouse'}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-bold text-slate-800 text-[11px]">
                                  {bookStock} copies
                                </span>
                              </td>
                              <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                                {createdDate}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                                  <Clock className="h-3 w-3 text-amber-600" /> Pending Setup
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingBook(book)
                                      setBookModalOpen(true)
                                    }}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
                                    title="Edit publication setup"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteBook(book)
                                    }}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                    title="Delete publication"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Filter and Search Bar (matching ERP Inventory) */}
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search publications by title, author, ISBN, or discipline..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-xs outline-none focus:border-diu-blue focus:bg-white transition"
                  />
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  {bookSearch && (
                    <button
                      type="button"
                      onClick={() => setBookSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      title="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Sort By Dropdown */}
                  <select
                    value={bookSortBy}
                    onChange={(e) => setBookSortBy(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-diu-blue cursor-pointer"
                    title="Sort publications"
                  >
                    <option value="latest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                    <option value="title-asc">Sort: Title (A → Z)</option>
                    <option value="title-desc">Sort: Title (Z → A)</option>
                    <option value="price-low">Sort: Price (Low → High)</option>
                    <option value="price-high">Sort: Price (High → Low)</option>
                    <option value="featured">Sort: Featured First</option>
                  </select>

                  {/* Discipline / Category Filter */}
                  <select
                    value={bookCategoryFilter}
                    onChange={(e) => setBookCategoryFilter(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-diu-blue cursor-pointer max-w-[180px] truncate"
                    title="Filter by Discipline"
                  >
                    {bookCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'All' ? 'All Disciplines' : cat}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={bookStatusFilter}
                    onChange={(e) => setBookStatusFilter(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-diu-blue cursor-pointer"
                    title="Filter by Status"
                  >
                    <option value="All">All Statuses</option>
                    <option value="active">Active (Published)</option>
                    <option value="inactive">Inactive / Draft</option>
                    <option value="pending">Pending Setup ({pendingCmsBooks.length})</option>
                  </select>

                  {/* Clear / Reset Filters */}
                  {(bookSearch || bookCategoryFilter !== 'All' || bookStatusFilter !== 'All' || bookSortBy !== 'latest') && (
                    <button
                      type="button"
                      onClick={() => {
                        setBookSearch('')
                        setBookCategoryFilter('All')
                        setBookStatusFilter('All')
                        setBookSortBy('latest')
                      }}
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-diu-blue transition"
                      title="Reset all filters"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Results count & status summary */}
              <div className="flex items-center justify-between px-1 text-xs text-slate-500">
                <span>
                  Showing <strong className="font-semibold text-slate-800">{filteredAndSortedBooks.length}</strong> of{' '}
                  <strong className="font-semibold text-slate-800">{booksList.length}</strong> publications
                </span>
                {(bookSearch || bookCategoryFilter !== 'All' || bookStatusFilter !== 'All') && (
                  <span className="text-[11px] text-slate-400">
                    Filtered by: {bookSearch ? `"${bookSearch}" ` : ''}
                    {bookCategoryFilter !== 'All' ? `[${bookCategoryFilter}] ` : ''}
                    {bookStatusFilter !== 'All' ? `[${bookStatusFilter}]` : ''}
                  </span>
                )}
              </div>

              {/* Books Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3.5">Title & Authors</th>
                        <th className="px-5 py-3.5">Category</th>
                        <th className="px-5 py-3.5">Type & Format</th>
                        <th className="px-5 py-3.5">Year</th>
                        <th className="px-5 py-3.5">Price</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAndSortedBooks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                              <Search className="h-6 w-6" />
                            </div>
                            <p className="mt-3 font-medium text-slate-700">No publications found</p>
                            <p className="mt-1 text-xs text-slate-400">
                              Try adjusting your search query, discipline, or status filter.
                            </p>
                            {(bookSearch || bookCategoryFilter !== 'All' || bookStatusFilter !== 'All' || bookSortBy !== 'latest') && (
                              <button
                                type="button"
                                onClick={() => {
                                  setBookSearch('')
                                  setBookCategoryFilter('All')
                                  setBookStatusFilter('All')
                                  setBookSortBy('latest')
                                }}
                                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-diu-blue shadow-sm hover:bg-slate-50 transition"
                              >
                                <RotateCcw className="h-3.5 w-3.5" /> Clear Filters
                              </button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredAndSortedBooks.map((book) => (
                        <tr
                          key={book.slug || book._id}
                          onClick={() => setViewingBook(book)}
                          className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded bg-slate-900 shadow-sm border border-slate-200">
                                <SafeBookThumb book={book} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-serif text-base font-bold text-diu-navy line-clamp-1">{book.title}</div>
                                <div className="text-[11px] text-slate-500 line-clamp-1">{book.authors?.join(', ')}</div>
                                <div className="mt-1 text-[10px] font-mono text-slate-400">ISBN: {book.isbn || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded bg-blue-50 px-2 py-0.5 font-medium text-diu-blue">
                              {book.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-700">{book.type || 'Monograph'}</div>
                            <div className="text-[10px] text-slate-400">{book.format || 'Paperback'}</div>
                          </td>
                          <td className="px-5 py-4 font-mono font-medium">{book.year}</td>
                          <td className="px-5 py-4 font-bold text-diu-navy">
                            {book.price ? `৳${book.price}` : 'Open Access'}
                          </td>
                          <td className="px-5 py-4">
                            {book.needsCmsSetup ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingBook(book)
                                  setBookModalOpen(true)
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition hover:-translate-y-0.5 active:translate-y-0"
                                title="Click to complete editorial setup and publish"
                              >
                                <Clock className="h-3 w-3 text-amber-600" />
                                <span>Pending Setup</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleBookStatus(book)
                                }}
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition hover:-translate-y-0.5 active:translate-y-0 ${
                                  book.status === 'draft' || book.status === 'inactive' || book.status === 'archived'
                                    ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                }`}
                                title="Click to toggle Active / Inactive"
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    book.status === 'draft' || book.status === 'inactive' || book.status === 'archived'
                                      ? 'bg-slate-400'
                                      : 'bg-emerald-500'
                                  }`}
                                />
                                {book.status === 'draft' || book.status === 'inactive' || book.status === 'archived'
                                  ? 'Inactive'
                                  : 'Active'}
                              </button>
                            )}
                            <div className="mt-1 flex items-center gap-2 text-[10px]">
                              {book.previewPdf ? (
                                <span className="inline-flex items-center gap-0.5 text-diu-blue font-medium" title="Sample PDF reader link active">
                                  <FileText className="h-2.5 w-2.5" /> PDF Sample
                                </span>
                              ) : null}
                              {(book.ecommerceLinks?.rokomari || book.ecommerceLinks?.wafilife || book.ecommerceLinks?.boibazar || book.ecommerceLinks?.amazon) ? (
                                <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium" title="Store purchase links configured">
                                  <ShoppingBag className="h-2.5 w-2.5" /> Buy Links
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingBook(book)
                                  setBookModalOpen(true)
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-diu-blue transition"
                                title="Edit publication"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteBook(book)
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                title="Delete publication"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. NEWS & ANNOUNCEMENTS TAB ================= */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-diu-navy">News & Announcements</h2>
                  <p className="text-xs text-slate-500">Create, publish, and manage editorial announcements and releases.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingNews(null)
                    setNewsModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-diu-blue px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" /> Post New Announcement
                </button>
              </div>

              {/* News & Announcements Metrics Overview */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Dispatches</span>
                    <Newspaper className="h-5 w-5 text-diu-blue" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{newsList.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Official releases published</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Featured Stories</span>
                    <Star className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {newsList.filter((n) => n.featured).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Lead featured on portal</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Press & Notices</span>
                    <Bell className="h-5 w-5 text-diu-green" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {newsList.filter((n) => {
                      const cat = (n.category || '').toLowerCase()
                      return cat.includes('press') || cat.includes('notice') || cat.includes('news')
                    }).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Media statements & alerts</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Events & Calls</span>
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {newsList.filter((n) => {
                      const cat = (n.category || '').toLowerCase()
                      return cat.includes('event') || cat.includes('call') || cat.includes('launch') || cat.includes('conference')
                    }).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Symposiums & calls for papers</div>
                </div>
              </div>

              {/* News Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3.5">Title & Excerpt</th>
                        <th className="px-5 py-3.5">Category</th>
                        <th className="px-5 py-3.5">Date</th>
                        <th className="px-5 py-3.5">Featured</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {newsList.map((item) => (
                        <tr
                          key={item.slug || item._id}
                          onClick={() => setViewingNews(item)}
                          className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="max-w-md px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                                <SafeNewsThumb item={item} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-serif text-base font-bold text-diu-navy line-clamp-1">{item.title}</div>
                                <div className="mt-0.5 text-slate-500 line-clamp-1 text-xs">{item.excerpt}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-slate-500">
                            {new Date(item.date || item.publishedAt).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-5 py-4">
                            {item.featured ? (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                <Star className="h-3.5 w-3.5 text-diu-green" /> Featured
                              </span>
                            ) : (
                              <span className="text-slate-400">Regular</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingNews(item)
                                  setNewsModalOpen(true)
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-diu-blue transition"
                                title="Edit announcement"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteNews(item)
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                title="Delete announcement"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. SUBMISSIONS TAB ================= */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-diu-navy">Manuscript Submissions</h2>
                <p className="text-xs text-slate-500">Review received scholarly manuscripts, assign editorial statuses, and manage notes.</p>
              </div>

              {/* Submissions Metrics Overview */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Submissions</span>
                    <FileText className="h-5 w-5 text-diu-blue" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{submissionsList.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Manuscripts received to date</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Under Review</span>
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {submissionsList.filter((s) => s.status === 'under_review' || s.status === 'submitted' || !s.status).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Pending editorial appraisal</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Accepted Works</span>
                    <CheckCircle className="h-5 w-5 text-diu-green" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {submissionsList.filter((s) => s.status === 'accepted' || s.status === 'published').length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Approved for publication</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Revisions / Concluded</span>
                    <AlertCircle className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {submissionsList.filter((s) => s.status === 'revision_requested' || s.status === 'rejected').length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Feedback sent or concluded</div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3.5">Submission ID & Title</th>
                        <th className="px-5 py-3.5">Author & Institution</th>
                        <th className="px-5 py-3.5">Type</th>
                        <th className="px-5 py-3.5">Date</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissionsList.map((sub) => (
                        <tr
                          key={sub.submissionId || sub._id}
                          onClick={() => {
                            setEditingSubmission(sub)
                            setSubmissionModalOpen(true)
                          }}
                          className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="max-w-xs px-5 py-4">
                            <span className="font-mono text-[11px] font-bold text-diu-blue">
                              {sub.submissionId || 'DP-SUB'}
                            </span>
                            <div className="mt-1 font-serif text-base font-bold text-diu-navy">{sub.title}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-800">{sub.fullName}</div>
                            <div className="text-slate-500">{sub.email}</div>
                            <div className="text-[11px] text-slate-400">{sub.institution || 'Independent Scholar'}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                              {sub.submissionType}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-slate-500">
                            {new Date(sub.createdAt).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                sub.status === 'accepted'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : sub.status === 'rejected'
                                  ? 'bg-red-50 text-red-700'
                                  : sub.status === 'under_review'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {sub.status?.replace('_', ' ') || 'received'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingSubmission(sub)
                                  setSubmissionModalOpen(true)
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-diu-blue transition"
                                title="Review and edit submission"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteSubmission(sub)
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                title="Delete submission"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4b. WRITERS & AUTHORS TAB ================= */}
          {activeTab === 'writers' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-diu-navy">Writers & Authors Directory</h2>
                  <p className="text-xs text-slate-500">
                    Manage registered authors, academic scholars, biographies, and publications portfolio.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingWriter(null)
                    setWriterModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-diu-blue px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" /> Add Writer
                </button>
              </div>

              {/* Writers Metrics Overview */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Writers</span>
                    <PenTool className="h-5 w-5 text-diu-blue" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{writersList.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Registered DIU Press authors</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Books Authored</span>
                    <BookOpen className="h-5 w-5 text-diu-green" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {writersList.reduce((acc, w) => acc + (Number(w.bookCount) || 0), 0)}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Published works in catalog</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Public Profiles</span>
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {writersList.filter((w) => w.active !== false).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Visible on website directory</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Featured Scholars</span>
                    <GraduationCap className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {writersList.filter((w) => (Number(w.bookCount) || 0) > 1 || (w.order > 0 && w.order <= 3)).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Prominent academic voices</div>
                </div>
              </div>

              {/* Writers Cards Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {writersList.map((writer) => {
                  const bookCount = Number(writer.bookCount) || 0
                  const writerSlug = writer.slug || (writer.name ? writer.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '')
                  return (
                    <div
                      key={writer._id || writer.id || writer.slug}
                      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
                    >
                      <div>
                        {/* Image & Badges Container */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
                          <SafeAuthorAvatar
                            src={writer.image}
                            name={writer.name}
                            fallback="/team/team-1.svg"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Book Count Badge */}
                          <div className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold text-white shadow backdrop-blur-sm">
                            <BookOpen className="h-3 w-3 text-diu-green" />
                            <span>{bookCount} {bookCount === 1 ? 'Book' : 'Books'}</span>
                          </div>

                          {/* Hidden Tag */}
                          {writer.active === false && (
                            <span className="absolute top-2 right-2 rounded-full bg-rose-600/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow">
                              Hidden
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="mt-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-diu-blue line-clamp-1">
                            {writer.designation || 'Author & Scholar'}
                          </span>
                          <h3 className="mt-1 font-serif text-lg font-bold text-diu-navy">{writer.name}</h3>
                          <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                            {writer.bio || 'Author contributing scholarly research and academic publications to Daffodil International University Press.'}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                        <Link
                          to={`/writers/${writerSlug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-diu-blue hover:text-blue-700 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> View Page
                        </Link>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingWriter(writer)
                              setWriterModalOpen(true)
                            }}
                            className="rounded-full p-2 text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-diu-blue active:translate-y-0"
                            title="Edit writer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWriter(writer)}
                            className="rounded-full p-2 text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600 active:translate-y-0"
                            title="Delete writer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ================= 5. TEAM MEMBERS TAB ================= */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-diu-navy">Editorial Staff & Team Members</h2>
                  <p className="text-xs text-slate-500">Manage editorial board members, editors, and publication staff.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingTeam(null)
                    setTeamModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-diu-blue px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" /> Add Team Member
                </button>
              </div>

              {/* Team Members Metrics Overview */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Staff</span>
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{teamList.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Board members & personnel</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Editorial Leadership</span>
                    <Shield className="h-5 w-5 text-diu-blue" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {teamList.filter((t) => {
                      const role = (t.role || '').toLowerCase()
                      return role.includes('editor') || role.includes('advisor') || role.includes('chief') || role.includes('chair')
                    }).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Editors & advisory council</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Operations & Production</span>
                    <Briefcase className="h-5 w-5 text-diu-green" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {teamList.filter((t) => {
                      const role = (t.role || '').toLowerCase()
                      return role.includes('manager') || role.includes('production') || role.includes('officer') || role.includes('assistant') || role.includes('coordinat')
                    }).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Operational & design officers</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Public Profiles</span>
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {teamList.filter((t) => t.active !== false).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Visible on Our Team page</div>
                </div>
              </div>

              {/* Team Cards Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {teamList.map((member) => (
                  <div
                    key={member._id || member.id || member.name}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div>
                      <SafeAuthorAvatar
                        src={member.image}
                        name={member.name}
                        fallback="/team/team-1.svg"
                        className="aspect-[4/3] w-full rounded-lg bg-slate-100 object-cover"
                      />
                      <div className="mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                          {member.role}
                        </span>
                        <h3 className="mt-1 font-serif text-lg font-bold text-diu-navy">{member.name}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                          {member.bio}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => {
                          setEditingTeam(member)
                          setTeamModalOpen(true)
                        }}
                        className="rounded-full p-2 text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-diu-blue active:translate-y-0"
                        title="Edit member"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(member)}
                        className="rounded-full p-2 text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600 active:translate-y-0"
                        title="Delete member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. CONTACT ARRIVAL TAB ================= */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-diu-navy">Contact Arrival & Inquiries</h2>
                <p className="text-xs text-slate-500">Review incoming inquiries, proposals, and correspondence from readers and institutions.</p>
              </div>

              {/* Contact Inquiries Metrics Overview */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Inquiries</span>
                    <Inbox className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{contactsList.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Scholarly & public inquiries</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unread Messages</span>
                    <Mail className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {contactsList.filter((c) => !c.read && c.status !== 'read' && c.status !== 'closed').length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Awaiting administrative reply</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Processed Inquiries</span>
                    <CheckCheck className="h-5 w-5 text-diu-green" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {contactsList.filter((c) => c.read || c.status === 'read' || c.status === 'closed').length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Reviewed & resolved inquiries</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unique Senders</span>
                    <Users className="h-5 w-5 text-diu-blue" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {new Set(contactsList.map((c) => (c.email || '').toLowerCase()).filter(Boolean)).size}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Distinct institutions & scholars</div>
                </div>
              </div>

              <div className="space-y-4">
                {contactsList.map((contact) => (
                  <div
                    key={contact._id || contact.id}
                    className={`rounded-xl border p-5 shadow-sm transition ${
                      contact.read
                        ? 'border-slate-200 bg-white'
                        : 'border-blue-200 bg-blue-50/40'
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg font-bold text-diu-navy">{contact.subject}</span>
                          {!contact.read && (
                            <span className="rounded bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                              New
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          From: <strong className="text-slate-900">{contact.name}</strong> ({contact.email})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">
                          {new Date(contact.createdAt).toLocaleString('en-GB')}
                        </span>
                        <button
                          onClick={() => handleToggleContactRead(contact)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow hover:-translate-y-0.5 active:translate-y-0"
                        >
                          {contact.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact)}
                          className="rounded-full p-1.5 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600 active:translate-y-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
                      {contact.message}
                    </div>

                    <div className="mt-3 flex items-center justify-end">
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-diu-blue hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" /> Reply to {contact.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 7. ACCOUNTS MANAGEMENT TAB ================= */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-diu-navy">Administrative Accounts</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Create and manage authorized administrative accounts. Only administrators can provision accounts here.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingAccount(null)
                    setAccountModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" /> Create New Account
                </button>
              </div>

              {/* Administrative Accounts Metrics Overview */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Accounts</span>
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">{accountsList.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Registered dashboard profiles</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Super Administrators</span>
                    <ShieldCheck className="h-5 w-5 text-diu-blue" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {accountsList.filter((a) => a.role === 'admin').length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Full system & security access</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Editorial Staff</span>
                    <Briefcase className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {accountsList.filter((a) => a.role !== 'admin').length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Publishing & review permissions</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-diu-blue hover:shadow-md">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Status</span>
                    <CheckCircle className="h-5 w-5 text-diu-green" />
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-diu-navy">
                    {accountsList.filter((a) => a.active !== false).length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Enabled authorized logins</div>
                </div>
              </div>

              {/* Accounts Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3.5">Staff Member & Designation</th>
                        <th className="px-5 py-3.5">Official Email</th>
                        <th className="px-5 py-3.5">Admission Permission Level</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Created Date</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {accountsList.map((account) => {
                        const isSelf = user?.email === account.email
                        return (
                          <tr
                            key={account._id || account.id}
                            onClick={() => setViewingAccount(account)}
                            className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <div className="font-semibold text-diu-navy flex items-center gap-1.5">
                                {account.name}
                                {isSelf && (
                                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-diu-blue">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                {account.designation || (account.role === 'admin' ? 'Lead Administrator' : 'Editorial Staff')}
                              </div>
                            </td>
                            <td className="px-5 py-4 font-mono text-slate-600">{account.email}</td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] border ${
                                  account.role === 'admin'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                              >
                                <ShieldCheck className="h-3 w-3" />
                                {account.role === 'admin' ? 'Administrator (Full Access)' : 'Editor (Content Only)'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {account.active !== false ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                  <Check className="h-3.5 w-3.5" /> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-500 font-semibold">
                                  <X className="h-3.5 w-3.5" /> Disabled
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 font-mono text-slate-400">
                              {account.createdAt ? new Date(account.createdAt).toLocaleDateString('en-GB') : 'Seeded'}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingAccount(account)
                                    setAccountModalOpen(true)
                                  }}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-diu-blue transition"
                                  title="Modify account"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>

                                {!isSelf && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteAccount(account)
                                    }}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                    title="Delete account"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= ERP & ADMINISTRATION VIEWS ================= */}
          {activeTab === 'erp-overview' && (
            <ErpOverviewView
              booksList={booksList}
              onNavigateTab={handleSelectTab}
            />
          )}

          {activeTab === 'erp-books-management' && (
            <ErpBooksManagementView
              booksList={booksList}
              showToast={showToast}
            />
          )}

          {activeTab === 'erp-inventory' && (
            <ErpInventoryView
              booksList={booksList}
              showToast={showToast}
              onCreateBookWithStock={handleCreateBookWithStock}
              onUpdateBook={handleUpdateBookData}
              onAddNewBook={() => {
                setEditingBook(null)
                setBookModalOpen(true)
              }}
            />
          )}

          {activeTab === 'erp-sales' && (
            <ErpSalesView
              booksList={booksList}
              showToast={showToast}
            />
          )}

          {activeTab === 'erp-payments' && (
            <ErpPaymentsView
              showToast={showToast}
            />
          )}

          {activeTab === 'admin-access' && (
            <AdminAccessControlView
              showToast={showToast}
            />
          )}

          {activeTab === 'admin-audit' && (
            <AdminAuditView
              showToast={showToast}
            />
          )}

          {activeTab === 'admin-settings' && (
            <AdminSettingsView
              showToast={showToast}
            />
          )}

          {activeTab === 'account-settings' && (
            <AccountSettingsPageView
              user={user}
              onSave={handleSaveAccountSettings}
              onBack={() => {
                navigate('/admin')
                handleSelectTab('overview')
              }}
              onGoToAccounts={() => {
                handleSelectTab('accounts')
              }}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* ================= MODAL: ADD / EDIT BOOK ================= */}
      {bookModalOpen && (
        <BookEditModal
          book={editingBook}
          onClose={() => setBookModalOpen(false)}
          onSave={handleSaveBook}
        />
      )}

      {/* ================= MODAL: ADD / EDIT NEWS ================= */}
      {newsModalOpen && (
        <NewsEditModal
          item={editingNews}
          onClose={() => setNewsModalOpen(false)}
          onSave={handleSaveNews}
        />
      )}

      {/* ================= MODAL: ADD / EDIT WRITER ================= */}
      {writerModalOpen && (
        <WriterEditModal
          writer={editingWriter}
          onClose={() => setWriterModalOpen(false)}
          onSave={handleSaveWriter}
        />
      )}

      {/* ================= MODAL: ADD / EDIT TEAM ================= */}
      {teamModalOpen && (
        <TeamEditModal
          member={editingTeam}
          onClose={() => setTeamModalOpen(false)}
          onSave={handleSaveTeam}
        />
      )}

      {/* ================= MODAL: CREATE / MODIFY ACCOUNT ================= */}
      {accountModalOpen && (
        <AccountEditModal
          account={editingAccount}
          onClose={() => setAccountModalOpen(false)}
          onSave={handleSaveAccount}
        />
      )}

      {/* ================= MODAL: SUBMISSION DETAILS & STATUS ================= */}
      {submissionModalOpen && editingSubmission && (
        <SubmissionModal
          submission={editingSubmission}
          onClose={() => setSubmissionModalOpen(false)}
          onUpdateStatus={handleUpdateSubmissionStatus}
          onDelete={handleDeleteSubmission}
        />
      )}

      {/* ================= MODAL: VIEW BOOK DETAILS POPUP ================= */}
      {viewingBook && (
        <ViewBookModal
          book={viewingBook}
          onClose={() => setViewingBook(null)}
          onEdit={(b) => {
            setViewingBook(null)
            setEditingBook(b)
            setBookModalOpen(true)
          }}
        />
      )}

      {/* ================= MODAL: VIEW NEWS DETAILS POPUP ================= */}
      {viewingNews && (
        <ViewNewsModal
          item={viewingNews}
          onClose={() => setViewingNews(null)}
          onEdit={(n) => {
            setViewingNews(null)
            setEditingNews(n)
            setNewsModalOpen(true)
          }}
        />
      )}

      {/* ================= MODAL: VIEW ACCOUNT DETAILS POPUP ================= */}
      {viewingAccount && (
        <ViewAccountModal
          account={viewingAccount}
          onClose={() => setViewingAccount(null)}
          onEdit={(a) => {
            setViewingAccount(null)
            setEditingAccount(a)
            setAccountModalOpen(true)
          }}
        />
      )}

      {/* ================= MODAL: ELEGANT CONFIRMATION POPUP ================= */}
      <ConfirmModal
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}

// -------------------------------------------------------------
// SUB-MODALS
// -------------------------------------------------------------

function BookEditModal({ book, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    subtitle: book?.subtitle || '',
    slug: book?.slug || '',
    authors: book?.authors?.join(', ') || '',
    category: book?.category || 'Research & Methodology',
    year: book?.year || 2026,
    isbn: book?.isbn || '978-984-000-000-0',
    pages: book?.pages || 300,
    price: book?.price || 650,
    type: book?.type || 'Monograph',
    format: book?.format || 'Hardcover',
    language: book?.language || 'English',
    edition: book?.edition || '1st Edition',
    description: book?.description || '',
    abstract: book?.abstract || '',
    keywords: book?.keywords?.join(', ') || '',
    featured: book?.featured ?? false,
    status: book?.needsCmsSetup ? 'active' : ((book?.status === 'draft' || book?.status === 'inactive' || book?.status === 'archived') ? 'inactive' : 'active'),
    previewPdf: book?.previewPdf || '',
    rokomariLink: book?.ecommerceLinks?.rokomari || '',
    wafilifeLink: book?.ecommerceLinks?.wafilife || '',
    boibazarLink: book?.ecommerceLinks?.boibazar || '',
    amazonLink: book?.ecommerceLinks?.amazon || '',
    coverBg: book?.cover?.bg || '#0B2D63',
    coverAccent: book?.cover?.accent || '#43B649',
    coverCode: book?.cover?.code || 'DP',
    coverImage: book?.coverImage || book?.cover?.image || ''
  })

  const [imageInputMode, setImageInputMode] = useState('upload') // 'upload' | 'url'
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WebP).')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setImageError('Image file size must be less than 8MB.')
      return
    }

    setUploadingImage(true)

    // Immediately read as Base64 for instant preview and offline persistence
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Url = event.target?.result
      if (base64Url) {
        setFormData((prev) => ({ ...prev, coverImage: base64Url }))
      }
    }
    reader.readAsDataURL(file)

    // Attempt server upload to Cloudinary in background
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('type', 'books')
      const res = await api.uploadImage(fd)
      if (res?.image?.url) {
        setFormData((prev) => ({ ...prev, coverImage: res.image.url }))
      }
    } catch {
      // Offline fallback: Base64 data URL remains active
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    const payload = {
      title: formData.title || book?.title || '',
      subtitle: formData.subtitle || book?.subtitle || '',
      slug: formData.slug || book?.slug || (formData.title || book?.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      authors: typeof formData.authors === 'string' && formData.authors
        ? formData.authors.split(',').map((a) => a.trim()).filter(Boolean)
        : (Array.isArray(book?.authors) ? book.authors : []),
      category: formData.category || book?.category || 'Research & Methodology',
      year: Number(formData.year || book?.year || 2026),
      isbn: formData.isbn || book?.isbn || '',
      pages: Number(formData.pages || book?.pages || 0),
      price: Number(formData.price || book?.price || 0),
      type: formData.type || book?.type || 'Monograph',
      format: formData.format || book?.format || 'Hardcover',
      language: formData.language || book?.language || 'English',
      edition: formData.edition || book?.edition || '1st Edition',
      description: formData.description || '',
      abstract: formData.abstract || '',
      keywords: typeof formData.keywords === 'string' && formData.keywords
        ? formData.keywords.split(',').map((k) => k.trim()).filter(Boolean)
        : (Array.isArray(book?.keywords) ? book.keywords : []),
      featured: Boolean(formData.featured),
      status: formData.status === 'inactive' ? 'draft' : 'published',
      needsCmsSetup: formData.status === 'active' ? false : Boolean(book?.needsCmsSetup),
      refNo: book?.refNo,
      origin: book?.origin,
      location: book?.location,
      stock: book?.stock,
      reorderPoint: book?.reorderPoint,
      lastBatchNote: book?.lastBatchNote,
      previewPdf: formData.previewPdf?.trim() || '',
      ecommerceLinks: {
        rokomari: formData.rokomariLink?.trim() || '',
        wafilife: formData.wafilifeLink?.trim() || '',
        boibazar: formData.boibazarLink?.trim() || '',
        amazon: formData.amazonLink?.trim() || ''
      },
      cover: {
        bg: formData.coverBg || book?.cover?.bg || '#0B2D63',
        accent: formData.coverAccent || book?.cover?.accent || '#43B649',
        text: '#FFFFFF',
        code: formData.coverCode || book?.cover?.code || 'DP',
        image: formData.coverImage || book?.cover?.image || ''
      },
      coverImage: formData.coverImage || book?.coverImage || ''
    }
    try {
      await onSave(payload)
    } catch {
      // Retain state so user can retry instantly
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-diu-blue">
              <Pencil className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-diu-navy">
                Edit Publication
              </h3>
              <p className="text-[11px] text-slate-500">
                Modify catalog status, sample PDF link, buy URLs, cover art, and descriptions.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 active:scale-95" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        {book?.needsCmsSetup && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-950 shadow-2xs">
            <Clock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900">Pending Publication Setup</div>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                This title was initialized from ERP Inventory. Complete the book cover artwork, description, sample PDF preview, and store links below. Setting status to <strong>Active</strong> will publish it live to the website.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Read-Only Core Publication Information Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                    {formData.category || book?.category || 'Academic Publication'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formData.isbn ? `ISBN: ${formData.isbn}` : ''}
                  </span>
                </div>
                <h4 className="mt-1.5 font-serif text-lg font-bold text-diu-navy line-clamp-1">
                  {formData.title || book?.title || 'Publication Title'}
                </h4>
                {formData.subtitle && (
                  <p className="text-[11px] italic text-slate-500 line-clamp-1">
                    {formData.subtitle}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-600 line-clamp-1">
                  <span className="font-semibold text-slate-700">Author(s):</span>{' '}
                  {formData.authors || (Array.isArray(book?.authors) ? book.authors.join(', ') : 'DIU Press Author')}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="rounded bg-white px-2 py-0.5 border border-slate-200">
                    <strong className="text-slate-700">Format:</strong> {formData.format} ({formData.type})
                  </span>
                  <span className="rounded bg-white px-2 py-0.5 border border-slate-200">
                    <strong className="text-slate-700">Year:</strong> {formData.year}
                  </span>
                  <span className="rounded bg-white px-2 py-0.5 border border-slate-200">
                    <strong className="text-slate-700">Pages:</strong> {formData.pages}
                  </span>
                  <span className="rounded bg-white px-2 py-0.5 border border-slate-200 font-semibold text-diu-navy font-mono">
                    ৳{formData.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BOOK COVER IMAGE SECTION ================= */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ImageIcon className="h-4 w-4 text-diu-blue" />
                  Book Cover Image
                </label>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Upload an image from your device (PNG, JPG, WebP) or paste an external image URL.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="inline-flex self-start rounded-full border border-slate-200 bg-white p-1 text-[11px] shadow-sm">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition hover:-translate-y-0.5 active:translate-y-0 ${
                    imageInputMode === 'upload'
                      ? 'bg-diu-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="h-3 w-3" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition hover:-translate-y-0.5 active:translate-y-0 ${
                    imageInputMode === 'url'
                      ? 'bg-diu-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="h-3 w-3" /> Image URL
                </button>
              </div>
            </div>

            {/* Error Message */}
            {imageError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            {/* Input & Preview */}
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_110px] sm:items-center">
              <div className="space-y-2">
                {imageInputMode === 'upload' ? (
                  <div>
                    <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-diu-blue hover:bg-blue-50/20">
                      <Upload className="h-6 w-6 text-slate-400" />
                      <span className="mt-1.5 text-xs font-semibold text-slate-700">
                        {uploadingImage ? 'Uploading image...' : 'Choose book cover image or drag here'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PNG, JPG, or WebP up to 8MB
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleImageFileChange}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/cover.jpg or /uploads/..."
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-diu-blue"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">
                      Enter a direct link to the book cover image.
                    </p>
                  </div>
                )}

                {/* Cover status & remove button */}
                {formData.coverImage && (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Custom Cover Image Attached
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.coverImage) {
                          api.deleteImage(formData.coverImage).catch(() => {})
                        }
                        setFormData({ ...formData, coverImage: '' })
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 shadow-sm transition hover:bg-red-50 hover:shadow hover:-translate-y-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Preview Thumbnail */}
              <div className="flex flex-col items-center">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Preview
                </div>
                <div className="relative aspect-[2/3] w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-md">
                  {formData.coverImage ? (
                    <img
                      src={getMediaUrl(formData.coverImage)}
                      alt="Book Cover Preview"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.style.display = 'none'
                      }}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center text-white"
                      style={{ background: formData.coverBg }}
                    >
                      <div className="text-[6px] uppercase tracking-widest opacity-70">DIU Press</div>
                      <div className="font-serif text-xs font-bold" style={{ color: formData.coverAccent }}>
                        {formData.coverCode || 'DP'}
                      </div>
                      <div className="text-[6px] opacity-70">{formData.year}</div>
                    </div>
                  )}
                  {/* Spine Highlight */}
                  <div className="pointer-events-none absolute left-0 top-0 h-full w-[4px] bg-white/20" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= PUBLICATION STATUS (ACTIVE / INACTIVE) ================= */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Publication Visibility Status
                </label>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Active books appear in the public catalog; Inactive books are hidden from readers.
                </p>
              </div>

              <div className="inline-flex self-start rounded-full border border-slate-200 bg-white p-1 text-[11px] shadow-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'active' })}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 font-semibold transition ${
                    formData.status === 'active'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" /> Active
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'inactive' })}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 font-semibold transition ${
                    formData.status === 'inactive'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <EyeOff className="h-3.5 w-3.5" /> Inactive
                </button>
              </div>
            </div>
          </div>

          {/* ================= READ SLIGHTLY PDF SAMPLE LINK ================= */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <BookOpen className="h-4 w-4 text-diu-blue" />
              "Read Slightly" PDF Reader Sample Link
            </label>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Direct URL to sample excerpt / preface PDF (Google Drive, Cloudinary, Dropbox, or CDN URL).
            </p>
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/books/sample-preview.pdf"
                value={formData.previewPdf}
                onChange={(e) => setFormData({ ...formData, previewPdf: e.target.value })}
                className="h-9 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-diu-blue"
              />
              {formData.previewPdf && (
                <a
                  href={formData.previewPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-diu-blue hover:bg-slate-50"
                  title="Test PDF link in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Test Link
                </a>
              )}
            </div>
          </div>

          {/* ================= AUTHORIZED E-COMMERCE / PURCHASE LINKS ================= */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <ShoppingBag className="h-4 w-4 text-diu-blue" />
                Authorized E-Commerce Store Purchase Links
              </label>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Specific book URLs where buyers can purchase physical copies. If left blank, automatic title search links are used.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Rokomari Book URL</label>
                <input
                  type="url"
                  placeholder="https://www.rokomari.com/book/..."
                  value={formData.rokomariLink}
                  onChange={(e) => setFormData({ ...formData, rokomariLink: e.target.value })}
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-diu-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Wafilife Book URL</label>
                <input
                  type="url"
                  placeholder="https://www.wafilife.com/shop/books/..."
                  value={formData.wafilifeLink}
                  onChange={(e) => setFormData({ ...formData, wafilifeLink: e.target.value })}
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-diu-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Boibazar Book URL</label>
                <input
                  type="url"
                  placeholder="https://www.boibazar.com/book/..."
                  value={formData.boibazarLink}
                  onChange={(e) => setFormData({ ...formData, boibazarLink: e.target.value })}
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-diu-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Amazon Global URL</label>
                <input
                  type="url"
                  placeholder="https://www.amazon.com/dp/..."
                  value={formData.amazonLink}
                  onChange={(e) => setFormData({ ...formData, amazonLink: e.target.value })}
                  className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-diu-blue"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Short Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-diu-blue"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">Full Abstract</label>
            <textarea
              rows={3}
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-diu-blue"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 accent-diu-blue"
            />
            <label htmlFor="featured" className="font-semibold text-slate-700">
              Highlight as Featured Publication in Hero Showcase
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploadingImage}
              className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-diu-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Publication...</span>
                </>
              ) : (
                'Save Publication'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function NewsEditModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    category: item?.category || 'Announcement',
    date: item?.date || item?.publishedAt || new Date().toISOString().split('T')[0],
    excerpt: item?.excerpt || '',
    body: item?.body?.join('\n\n') || '',
    featured: item?.featured ?? false,
    image: item?.image || '/news/news-1.svg'
  })

  const [imageInputMode, setImageInputMode] = useState('upload') // 'upload' | 'url'
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WebP).')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setImageError('Image file size must be less than 8MB.')
      return
    }

    setUploadingImage(true)

    // Immediately read as Base64 for instant preview and offline persistence
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Url = event.target?.result
      if (base64Url) {
        setFormData((prev) => ({ ...prev, image: base64Url }))
      }
    }
    reader.readAsDataURL(file)

    // Attempt server upload to Cloudinary in background
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('type', 'news')
      const res = await api.uploadImage(fd)
      if (res?.image?.url) {
        setFormData((prev) => ({ ...prev, image: res.image.url }))
      }
    } catch {
      // Offline fallback: Base64 data URL remains active
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave({
        title: formData.title,
        category: formData.category,
        date: formData.date,
        publishedAt: formData.date,
        excerpt: formData.excerpt,
        body: formData.body.split('\n\n').filter(Boolean),
        featured: Boolean(formData.featured),
        image: formData.image,
        slug: item?.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      })
    } catch {
      // Preserve state on error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-serif text-xl font-bold text-diu-navy">
            {item ? 'Modify Announcement' : 'Post Announcement'}
          </h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 active:scale-95" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700">Article Title *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-700">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              >
                <option>Announcement</option>
                <option>Event</option>
                <option>Publications</option>
                <option>Editorial</option>
                <option>Symposium</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700">Publish Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>
          </div>

          {/* ================= ARTICLE IMAGE SECTION ================= */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ImageIcon className="h-4 w-4 text-diu-blue" />
                  Article Featured Image
                </label>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Upload an article thumbnail or photo (PNG, JPG, WebP) or paste an image URL.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="inline-flex self-start rounded-full border border-slate-200 bg-white p-1 text-[11px] shadow-sm">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition hover:-translate-y-0.5 active:translate-y-0 ${
                    imageInputMode === 'upload'
                      ? 'bg-diu-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="h-3 w-3" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition hover:-translate-y-0.5 active:translate-y-0 ${
                    imageInputMode === 'url'
                      ? 'bg-diu-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="h-3 w-3" /> Image URL
                </button>
              </div>
            </div>

            {/* Error Message */}
            {imageError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            {/* Input & Preview */}
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_130px] sm:items-center">
              <div className="space-y-2">
                {imageInputMode === 'upload' ? (
                  <div>
                    <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-diu-blue hover:bg-blue-50/20">
                      <Upload className="h-6 w-6 text-slate-400" />
                      <span className="mt-1.5 text-xs font-semibold text-slate-700">
                        {uploadingImage ? 'Uploading image...' : 'Choose article image or drag here'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PNG, JPG, or WebP up to 8MB
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleImageFileChange}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/news-photo.jpg or /uploads/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-diu-blue"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">
                      Enter a direct link to the article image.
                    </p>
                  </div>
                )}

                {/* Status & clear button */}
                {formData.image && (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Custom image active
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.image && formData.image !== '/news/news-1.svg') {
                          api.deleteImage(formData.image).catch(() => {})
                        }
                        setFormData({ ...formData, image: '/news/news-1.svg' })
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 shadow-sm transition hover:bg-red-50 hover:shadow hover:-translate-y-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Reset
                    </button>
                  </div>
                )}
              </div>

              {/* Preview Thumbnail */}
              <div className="flex flex-col items-center">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Preview
                </div>
                <div className="relative aspect-[16/10] w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                  <img
                    src={getMediaUrl(formData.image) || '/news/news-1.svg'}
                    alt="Article Preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/news/news-1.svg'
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Short Excerpt *</label>
            <textarea
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-diu-blue"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">Full Content Paragraphs (separate by double enter)</label>
            <textarea
              rows={4}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-diu-blue"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featuredNews"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 accent-diu-blue"
            />
            <label htmlFor="featuredNews" className="font-semibold text-slate-700">
              Pin as Featured Lead Story on News Page
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploadingImage}
              className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-diu-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Announcement...</span>
                </>
              ) : (
                'Save Announcement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TeamEditModal({ member, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    image: member?.image || '/team/team-1.svg',
    order: member?.order || 1
  })

  const [imageInputMode, setImageInputMode] = useState('upload') // 'upload' | 'url'
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WebP).')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setImageError('Image file size must be less than 8MB.')
      return
    }

    setUploadingImage(true)

    // Immediately read as Base64 for instant preview and offline persistence
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Url = event.target?.result
      if (base64Url) {
        setFormData((prev) => ({ ...prev, image: base64Url }))
      }
    }
    reader.readAsDataURL(file)

    // Attempt server upload to Cloudinary in background
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('type', 'team')
      const res = await api.uploadImage(fd)
      if (res?.image?.url) {
        setFormData((prev) => ({ ...prev, image: res.image.url }))
      }
    } catch {
      // Offline fallback: Base64 data URL remains active
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave(formData)
    } catch {
      // Preserve state on error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-serif text-xl font-bold text-diu-navy">
            {member ? 'Edit Team Member' : 'Add Team Member'}
          </h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 active:scale-95" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-700">Full Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Role / Title *</label>
              <input
                required
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Executive Editor"
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>
          </div>

          {/* ================= PROFILE PHOTO SECTION ================= */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ImageIcon className="h-4 w-4 text-diu-blue" />
                  Profile Photo
                </label>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Upload a headshot (PNG, JPG, WebP) or paste an image URL.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="inline-flex self-start rounded-full border border-slate-200 bg-white p-1 text-[11px] shadow-sm">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition hover:-translate-y-0.5 active:translate-y-0 ${
                    imageInputMode === 'upload'
                      ? 'bg-diu-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="h-3 w-3" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition hover:-translate-y-0.5 active:translate-y-0 ${
                    imageInputMode === 'url'
                      ? 'bg-diu-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="h-3 w-3" /> Image URL
                </button>
              </div>
            </div>

            {/* Error Message */}
            {imageError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            {/* Input & Preview */}
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_100px] sm:items-center">
              <div className="space-y-2">
                {imageInputMode === 'upload' ? (
                  <div>
                    <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-3.5 text-center transition hover:border-diu-blue hover:bg-blue-50/20">
                      <Upload className="h-5 w-5 text-slate-400" />
                      <span className="mt-1 text-xs font-semibold text-slate-700">
                        {uploadingImage ? 'Uploading photo...' : 'Choose photo or drag here'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PNG, JPG, or WebP up to 8MB
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleImageFileChange}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/headshot.jpg or /uploads/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-diu-blue"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">
                      Enter a direct link to the member's photo.
                    </p>
                  </div>
                )}

                {/* Status & clear button */}
                {formData.image && (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Photo attached
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.image && formData.image !== '/team/team-1.svg') {
                          api.deleteImage(formData.image).catch(() => {})
                        }
                        setFormData({ ...formData, image: '/team/team-1.svg' })
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 shadow-sm transition hover:bg-red-50 hover:shadow hover:-translate-y-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Reset
                    </button>
                  </div>
                )}
              </div>

              {/* Preview Thumbnail */}
              <div className="flex flex-col items-center">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Preview
                </div>
                <div className="relative aspect-[4/5] w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-md">
                  <img
                    src={getMediaUrl(formData.image) || '/team/team-1.svg'}
                    alt="Member Preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/team/team-1.svg'
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Bio Summary</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-diu-blue"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploadingImage}
              className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-diu-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Member...</span>
                </>
              ) : (
                'Save Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function WriterEditModal({ writer, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: writer?.name || '',
    slug: writer?.slug || '',
    designation: writer?.designation || '',
    bio: writer?.bio || '',
    image: writer?.image || '/team/team-1.svg',
    order: writer?.order ?? 0,
    email: writer?.email || '',
    bookCount: writer?.bookCount ?? 0,
    active: writer?.active ?? true
  })

  const [imageInputMode, setImageInputMode] = useState('upload') // 'upload' | 'url'
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WebP).')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setImageError('Image file size must be less than 8MB.')
      return
    }

    setUploadingImage(true)

    // Immediately read as Base64 for instant preview
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Url = event.target?.result
      if (base64Url) {
        setFormData((prev) => ({ ...prev, image: base64Url }))
      }
    }
    reader.readAsDataURL(file)

    // Attempt server upload to Cloudinary in background
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('type', 'writers')
      const res = await api.uploadImage(fd)
      if (res?.image?.url) {
        setFormData((prev) => ({ ...prev, image: res.image.url }))
      }
    } catch {
      // Offline fallback: Base64 data URL remains active
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      designation: formData.designation.trim() || 'Author & Scholar',
      bio: formData.bio.trim(),
      image: formData.image || '/team/team-1.svg',
      order: Number(formData.order) || 0,
      email: formData.email.trim(),
      bookCount: Number(formData.bookCount) || 0,
      active: Boolean(formData.active)
    }
    try {
      await onSave(payload)
    } catch {
      // Preserve state on error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-serif text-xl font-bold text-diu-navy">
            {writer ? 'Edit Writer & Author' : 'Add New Writer & Author'}
          </h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 active:scale-95" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-700">Full Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    name: val,
                    slug: !writer && (!prev.slug || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                      ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      : prev.slug
                  }))
                }}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Designation / Academic Title *</label>
              <input
                required
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Professor & Senior Research Fellow"
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="font-semibold text-slate-700">URL Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated-from-name"
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 font-mono text-[11px] outline-none focus:border-diu-blue"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Books Published Count</label>
              <input
                type="number"
                min="0"
                value={formData.bookCount}
                onChange={(e) => setFormData({ ...formData, bookCount: Number(e.target.value) })}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Display Order</label>
              <input
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Official Email (Optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="author@daffodilvarsity.edu.bd"
              className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
            />
          </div>

          {/* ================= PROFILE PHOTO SECTION ================= */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ImageIcon className="h-4 w-4 text-diu-blue" />
                  Profile Photo
                </label>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Upload author portrait (saved to Cloudinary) or paste image URL.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="inline-flex self-start rounded-full border border-slate-200 bg-white p-1 text-[11px] shadow-sm">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition hover:-translate-y-0.5 active:translate-y-0 ${
                    imageInputMode === 'upload'
                      ? 'bg-diu-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="h-3 w-3" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition hover:-translate-y-0.5 active:translate-y-0 ${
                    imageInputMode === 'url'
                      ? 'bg-diu-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="h-3 w-3" /> Image URL
                </button>
              </div>
            </div>

            {/* Error Message */}
            {imageError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            {/* Input & Preview */}
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_100px] sm:items-center">
              <div className="space-y-2">
                {imageInputMode === 'upload' ? (
                  <div>
                    <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-3.5 text-center transition hover:border-diu-blue hover:bg-blue-50/20">
                      <Upload className="h-5 w-5 text-slate-400" />
                      <span className="mt-1 text-xs font-semibold text-slate-700">
                        {uploadingImage ? 'Uploading photo...' : 'Choose photo or drag here'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PNG, JPG, or WebP up to 8MB
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleImageFileChange}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/author.jpg or /team/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-diu-blue"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">
                      Enter a direct link to the writer's portrait photo.
                    </p>
                  </div>
                )}

                {/* Status & reset button */}
                {formData.image && (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Photo attached
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.image && formData.image !== '/team/team-1.svg') {
                          api.deleteImage(formData.image).catch(() => {})
                        }
                        setFormData({ ...formData, image: '/team/team-1.svg' })
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 shadow-sm transition hover:bg-red-50 hover:shadow hover:-translate-y-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Reset
                    </button>
                  </div>
                )}
              </div>

              {/* Preview Thumbnail */}
              <div className="flex flex-col items-center">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Preview
                </div>
                <div className="relative aspect-[4/5] w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-md">
                  <img
                    src={getMediaUrl(formData.image) || '/team/team-1.svg'}
                    alt="Writer Preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/team/team-1.svg'
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Biography & Academic Background</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief biography highlighting academic achievements and scholarly domains..."
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-diu-blue"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="writer-active-toggle"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-diu-blue focus:ring-diu-blue"
            />
            <label htmlFor="writer-active-toggle" className="text-xs font-medium text-slate-700 cursor-pointer">
              Visible on DIU Press Website & Directory
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploadingImage}
              className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-diu-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Writer...</span>
                </>
              ) : (
                'Save Writer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AccountEditModal({ account, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: account?.name || '',
    designation: account?.designation || (account?.role === 'admin' ? 'Lead Administrator' : 'Editorial Staff'),
    email: account?.email || '',
    password: '',
    role: account?.role || 'admin',
    active: account?.active ?? true
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!account && !formData.password) {
      toast.error('Password is required for new accounts.')
      return
    }
    const payload = {
      name: formData.name.trim(),
      designation: formData.designation.trim() || 'Administrator',
      email: formData.email.trim(),
      role: formData.role,
      active: formData.active
    }
    if (formData.password) {
      payload.password = formData.password
    }
    setIsSaving(true)
    try {
      await onSave(payload)
    } catch {
      // Retain state on error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h3 className="font-serif text-xl font-bold text-diu-navy">
              {account ? 'Modify Staff Account & Permissions' : 'Create New Account'}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 active:scale-95" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-700">Full Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Sabrina Alam"
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Designation / Job Title *</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Senior Academic Editor, Press Director"
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-700">Official Email *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. sabrina@diupress.edu.bd"
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">
                {account ? 'Reset Password (leave blank to keep current)' : 'Password *'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-diu-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700">Admission Permission Level</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-2 outline-none focus:border-diu-blue"
              >
                <option value="admin">Administrator (Full Access)</option>
                <option value="editor">Editor (Content Only)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700">Account Status</label>
              <select
                value={formData.active ? 'active' : 'disabled'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-2 outline-none focus:border-diu-blue"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : (account ? 'Update Account' : 'Create Account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SubmissionModal({ submission, onClose, onUpdateStatus, onDelete }) {
  const [status, setStatus] = useState(submission.status || 'received')
  const [notes, setNotes] = useState(submission.editorialNotes || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveDecision = async () => {
    const targetId = submission._id || submission.submissionId || submission.id
    setIsSaving(true)
    try {
      await onUpdateStatus(targetId, status, notes, submission)
    } catch {
      // Keep modal open if an error occurred
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="font-mono text-xs font-bold text-diu-blue">{submission.submissionId}</span>
            <h3 className="font-serif text-xl font-bold text-diu-navy">{submission.title}</h3>
          </div>
          <button onClick={onClose} disabled={isSaving} className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 active:scale-95 disabled:opacity-50" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3">
            <div>
              <span className="text-slate-400">Author:</span>
              <div className="font-semibold text-slate-800">{submission.fullName}</div>
              <div className="text-slate-500">{submission.email}</div>
            </div>
            <div>
              <span className="text-slate-400">Institution:</span>
              <div className="font-semibold text-slate-800">{submission.institution || 'Independent'}</div>
              <div className="text-slate-500">Type: {submission.submissionType}</div>
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-700">Abstract:</span>
            <p className="mt-1 rounded-xl border border-slate-100 bg-slate-50/50 p-3 leading-relaxed text-slate-600">
              {submission.abstract}
            </p>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Editorial Decision / Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSaving}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 font-semibold text-diu-navy outline-none focus:border-diu-blue disabled:bg-slate-100"
            >
              <option value="received">Received / Pending Review</option>
              <option value="under_review">Under Editorial Peer Review</option>
              <option value="revision_requested">Revision Requested</option>
              <option value="accepted">Accepted for Publication</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Editorial Notes & Feedback</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSaving}
              placeholder="Internal notes or communication notes with the author..."
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-diu-blue disabled:bg-slate-100"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => onDelete(submission)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition-all duration-200 hover:bg-red-50 hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" /> Delete Submission
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveDecision}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-diu-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? 'Updating...' : 'Update Decision'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountSettingsPageView({ user, onSave, onBack, onGoToAccounts, showToast }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image file size must be less than 8MB.')
      return
    }

    setUploadingAvatar(true)
    setError('')
    setSuccessMsg('')

    try {
      let avatarUrl = ''

      // Attempt server upload to Cloudinary
      try {
        const fd = new FormData()
        fd.append('image', file)
        fd.append('type', 'avatars')
        const res = await api.uploadImage(fd)
        if (res?.image?.url) {
          avatarUrl = res.image.url
        }
      } catch {
        // Fallback to local Base64 data URL
        avatarUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      if (!avatarUrl) {
        throw new Error('Failed to process image file.')
      }

      await onSave({ avatar: avatarUrl })
      setSuccessMsg('Profile photo updated successfully.')
      if (showToast) showToast('Profile image updated successfully!')
    } catch (err) {
      setError(err?.message || 'Failed to update profile photo.')
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true)
    setError('')
    setSuccessMsg('')
    try {
      if (user?.avatar) {
        api.deleteImage(user.avatar).catch(() => {})
      }
      await onSave({ avatar: '' })
      setSuccessMsg('Profile photo removed.')
      if (showToast) showToast('Profile photo removed.')
    } catch (err) {
      setError(err?.message || 'Failed to remove profile photo.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!formData.currentPassword && !formData.newPassword && !formData.confirmPassword) {
      setError('Enter your current and new password below to update your login credentials.')
      return
    }

    if (!formData.currentPassword) {
      setError('Please enter your current password to authorize password changes.')
      return
    }
    if (!formData.newPassword) {
      setError('Please enter your new password.')
      return
    }
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    setSubmitting(true)
    try {
      await onSave({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
      setSuccessMsg('Your security password has been updated successfully.')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      setError(err?.message || 'Failed to update account password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Breadcrumb & Back Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-semibold text-diu-blue hover:underline"
          >
            ← Back to Overview
          </button>
          <span>/</span>
          <span className="font-medium text-slate-700">Account Settings</span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-[11px] font-semibold text-diu-blue">
          <Shield className="h-3.5 w-3.5" />
          <span>Staff Account Profile</span>
        </div>
      </div>

      {/* Header Profile Hero Card with Photo Upload/Change */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/70 to-blue-50/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar Container with Upload Icon Overlay */}
            <div className="relative self-start sm:self-auto">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-diu-navy to-diu-blue text-2xl font-bold text-white shadow-md ring-4 ring-blue-100">
                <SafeUserAvatar
                  avatar={user?.avatar}
                  name={user?.name || 'Administrator'}
                  className="h-full w-full object-cover"
                  fallbackClassName="text-2xl font-bold text-white"
                />
                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white backdrop-blur-[2px]">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>

              {/* Quick camera trigger button on the avatar */}
              <label
                htmlFor="profile-avatar-file-input"
                className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white text-slate-700 shadow-md border border-slate-200 transition hover:bg-diu-blue hover:text-white hover:border-diu-blue active:scale-95"
                title="Change profile photo"
              >
                <Camera className="h-3.5 w-3.5" />
                <input
                  id="profile-avatar-file-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-diu-navy">
                  {user?.name || 'Administrator'}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  {user?.role === 'admin' ? 'Administrator (Full Access)' : 'Editor (Content Only)'}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="font-medium text-diu-blue flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> {user?.designation || (user?.role === 'admin' ? 'Lead Administrator' : 'Editorial Staff')}
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-slate-500 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {user?.email || 'admin@diupress.local'}
                </span>
              </div>

              {/* Profile Image Action Buttons */}
              <div className="mt-3 flex items-center gap-3">
                <label
                  htmlFor="profile-avatar-btn"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-diu-blue hover:text-diu-blue active:scale-95"
                >
                  <Camera className="h-3.5 w-3.5 text-diu-blue" />
                  <span>{uploadingAvatar ? 'Uploading...' : user?.avatar ? 'Change Photo' : 'Upload Photo'}</span>
                  <input
                    id="profile-avatar-btn"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </label>

                {user?.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={uploadingAvatar}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end gap-1.5 text-xs">
            <span className="text-slate-400">Security Status</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Session Protected
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 animate-in fade-in duration-150">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 animate-in fade-in duration-150">
          <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Personal Profile & Role (Clean, Locked with lock icon) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-diu-navy text-sm uppercase tracking-wider">
              <User className="h-4 w-4 text-diu-blue" />
              <span>Personal Identity & Access Profile</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Your official staff identity and permission tier at DIU Press.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Full Name
              </label>
              <div className="mt-1.5 flex h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 text-xs font-medium text-slate-800">
                <span>{user?.name || 'Administrator'}</span>
                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            </div>

            {/* 2. Designation / Job Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Designation / Job Title
              </label>
              <div className="mt-1.5 flex h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 text-xs font-medium text-slate-800">
                <span>{user?.designation || (user?.role === 'admin' ? 'Lead Administrator' : 'Editorial Staff')}</span>
                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            </div>

            {/* 3. Official Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Official Institutional Email
              </label>
              <div className="mt-1.5 flex h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 text-xs font-mono text-slate-600 select-all">
                <span className="truncate">{user?.email || 'admin@diupress.local'}</span>
                <Lock className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
              </div>
            </div>

            {/* 4. Admission Permission Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Admission Permission Level
              </label>
              <div className="mt-1.5 flex h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 text-xs font-medium text-slate-800">
                <span>
                  {user?.role === 'admin' ? 'Administrator (Full Access)' : 'Editor (Content Only)'}
                </span>
                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Security & Password (Self-Service) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 font-bold text-diu-navy text-sm uppercase tracking-wider">
                <KeyRound className="h-4 w-4 text-diu-blue" />
                <span>Security & Password Management</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Update your login password. Passwords are securely hashed with bcrypt encryption.
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
              Leave blank to keep unchanged
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Current Password
            </label>
            <div className="relative mt-1.5 max-w-md">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="Enter current password to authorize changes"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pr-10 text-xs text-slate-800 outline-none transition focus:border-diu-blue focus:bg-white focus:ring-2 focus:ring-diu-blue/20"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                New Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pr-10 text-xs text-slate-800 outline-none transition focus:border-diu-blue focus:bg-white focus:ring-2 focus:ring-diu-blue/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Confirm New Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pr-10 text-xs text-slate-800 outline-none transition focus:border-diu-blue focus:bg-white focus:ring-2 focus:ring-diu-blue/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            ← Back to Overview
          </button>

          <div className="flex w-full sm:w-auto items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                })
                setError('')
                setSuccessMsg('')
              }}
              disabled={submitting}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Clear Fields
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-diu-navy px-6 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-diu-blue hover:shadow-lg disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function ConfirmModal({ dialog, onClose }) {
  if (!dialog?.isOpen) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all scale-in">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold text-diu-navy">
              {dialog.title || 'Confirm Action'}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {dialog.message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={dialog.onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-95"
          >
            {dialog.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ViewBookModal({ book, onClose, onEdit }) {
  if (!book) return null

  const authorsText = Array.isArray(book.authors) ? book.authors.join(', ') : (book.authors || 'Unknown')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-slate-900 shadow-sm border border-slate-200">
              <SafeBookThumb book={book} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-diu-navy">{book.title}</h3>
              <p className="text-xs text-slate-500">{authorsText}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {book.subtitle && (
            <div className="text-slate-600 italic">
              {book.subtitle}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Category</span>
              <p className="mt-0.5 font-semibold text-slate-800">{book.category || 'Monograph'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Type & Format</span>
              <p className="mt-0.5 font-semibold text-slate-800">{book.type || 'Monograph'} • {book.format || 'Paperback'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Publication Year</span>
              <p className="mt-0.5 font-mono font-semibold text-slate-800">{book.year || 2026}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Retail Price</span>
              <p className="mt-0.5 font-bold text-emerald-700">{book.price ? `৳ ${book.price}` : 'Open Access'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">ISBN</span>
              <p className="mt-0.5 font-mono font-semibold text-slate-800">{book.isbn || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Stock / Copies</span>
              <p className="mt-0.5 font-semibold text-slate-800">{book.stock ?? 100} copies</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Shelf #</span>
              <p className="mt-0.5 font-semibold text-slate-800">{book.shelfNumber || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Status</span>
              <p className="mt-0.5 font-semibold">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  book.needsCmsSetup
                    ? 'bg-amber-100 text-amber-800'
                    : (book.status === 'draft' || book.status === 'inactive' || book.status === 'archived')
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {book.needsCmsSetup ? 'Pending Setup' : (book.status || 'Active')}
                </span>
              </p>
            </div>
          </div>

          {book.location && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-400">Warehouse Location</span>
              <p className="mt-0.5 font-medium text-slate-800 flex items-center gap-1.5">
                <Warehouse className="h-3.5 w-3.5 text-slate-400" />
                {book.location}
              </p>
            </div>
          )}

          {book.description && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-400">Description & Synopsis</span>
              <p className="mt-1 text-slate-700 leading-relaxed whitespace-pre-line">{book.description}</p>
            </div>
          )}

          {book.abstract && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-400">Scholarly Abstract</span>
              <p className="mt-1 text-slate-700 leading-relaxed whitespace-pre-line">{book.abstract}</p>
            </div>
          )}

          {/* Links & Distribution */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Distribution & Digital Assets</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {book.previewPdf ? (
                <a
                  href={book.previewPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-semibold text-diu-blue hover:bg-blue-100 transition"
                >
                  <FileText className="h-3 w-3" /> Preview PDF Sample
                </a>
              ) : (
                <span className="text-slate-400 text-[11px]">No sample PDF uploaded</span>
              )}

              {book.ecommerceLinks?.rokomari && (
                <a
                  href={book.ecommerceLinks.rokomari}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <ShoppingBag className="h-3 w-3" /> Rokomari Link
                </a>
              )}
              {book.ecommerceLinks?.wafilife && (
                <a
                  href={book.ecommerceLinks.wafilife}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <ShoppingBag className="h-3 w-3" /> Wafilife Link
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(book)}
            className="inline-flex items-center gap-1.5 rounded-full bg-diu-blue px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit Publication
          </button>
        </div>
      </div>
    </div>
  )
}

function ViewNewsModal({ item, onClose, onEdit }) {
  if (!item) return null

  const formattedDate = item.date || item.publishedAt ? new Date(item.date || item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
              <SafeNewsThumb item={item} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  {item.category || 'General'}
                </span>
                {item.featured && (
                  <span className="inline-flex items-center gap-0.5 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> Featured
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-diu-navy mt-1">{item.title}</h3>
              <p className="text-xs text-slate-400 font-mono">{formattedDate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          {item.excerpt && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-400">Summary / Excerpt</span>
              <p className="mt-1 text-slate-800 font-medium leading-relaxed">{item.excerpt}</p>
            </div>
          )}

          {item.content && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-400">Full Content</span>
              <p className="mt-1 text-slate-700 leading-relaxed whitespace-pre-line">{item.content}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(item)}
            className="inline-flex items-center gap-1.5 rounded-full bg-diu-blue px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit Announcement
          </button>
        </div>
      </div>
    </div>
  )
}

function ViewAccountModal({ account, onClose, onEdit }) {
  if (!account) return null

  const createdDate = account.createdAt ? new Date(account.createdAt).toLocaleDateString('en-GB') : 'Seeded'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-bold text-lg">
              {(account.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-diu-navy">{account.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{account.designation || (account.role === 'admin' ? 'Lead Administrator' : 'Editorial Staff')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Official Email</span>
            <p className="mt-0.5 font-mono font-semibold text-slate-800">{account.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-400">Permission Level</span>
              <p className="mt-0.5 font-semibold">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  account.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-diu-blue'
                }`}>
                  <ShieldCheck className="h-3 w-3" />
                  {account.role === 'admin' ? 'Administrator' : 'Editor'}
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-400">Account Status</span>
              <p className="mt-0.5 font-semibold">
                {account.active !== false ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <Check className="h-3.5 w-3.5" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                    <X className="h-3.5 w-3.5" /> Disabled
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Created Date</span>
            <p className="mt-0.5 font-mono text-slate-600">{createdDate}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(account)}
            className="inline-flex items-center gap-1.5 rounded-full bg-diu-blue px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit Account
          </button>
        </div>
      </div>
    </div>
  )
}


