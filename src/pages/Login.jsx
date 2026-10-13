import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ArrowLeft
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoNotice, setInfoNotice] = useState('')

  // If already authenticated, redirect straight to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfoNotice('')

    if (!email.trim() || !password) {
      setError('Please provide both administrator email and password.')
      return
    }

    setLoading(true)
    try {
      const res = await login(email, password)
      if (res?.isLocalFallback) {
        setInfoNotice('Signed in using local administrator credentials.')
      }
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(
        err.message ||
        'Authentication failed. Please verify your administrative credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  const fillDemoAdmin = () => {
    setEmail('admin@diupress.local')
    setPassword('ChangeThisBeforeProduction123!')
    setError('')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-diu-navy px-4 py-24 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-[0.09]" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #174EA6 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/15 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to DIU Press Website
        </Link>

        {/* Login Card */}
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner">
              <Lock className="h-7 w-7 text-blue-200" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-diu-green" />
              <span>Administrative Portal</span>
            </div>

            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Administrator Sign In
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Restricted access for authorized editorial staff and administrators of Daffodil International University Press.
            </p>
          </div>

          {/* Strict Policy Notice */}
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200/90">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <div className="leading-relaxed">
              <strong>Admin Only:</strong> Public account creation is disabled. New administrative accounts can only be provisioned internally from within the <strong>Accounts</strong> dashboard.
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Info Notice */}
          {infoNotice && (
            <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/15 p-3 text-xs text-blue-200">
              {infoNotice}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/80">
                Administrator Email
              </label>
              <div className="relative mt-1.5 flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@diupress.local"
                  className="focus-ring h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-blue-400 focus:bg-white/15"
                />
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/80">
                Password
              </label>
              <div className="relative mt-1.5 flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="focus-ring h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-12 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-blue-400 focus:bg-white/15"
                />
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-md text-black/80 transition-colors hover:text-black focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.6} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.6} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-diu-blue px-6 text-sm font-semibold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Helper for Development */}
          <div className="mt-8 border-t border-white/10 pt-5 text-center">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-blue-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <KeyRound className="h-3.5 w-3.5 text-diu-green" />
              <span>Fill Seeded Administrator Credentials</span>
            </button>
          </div>
        </div>

        {/* Footer Security Badge */}
        <p className="mt-6 text-center text-xs text-white/40">
          Protected by DIU Press Cryptographic Session Tokens & Audit Logging.
        </p>
      </div>
    </div>
  )
}
