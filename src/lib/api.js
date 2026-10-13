// Safely format API_BASE to handle trailing slashes and ensure /api path when deployed
function resolveApiBase() {
  let base = (import.meta.env.VITE_API_URL || '/api').trim()
  base = base.replace(/\/+$/, '') // strip trailing slashes
  // If the user supplied e.g. "https://api.diupress.org" without "/api", append it
  if (base.startsWith('http') && !base.endsWith('/api')) {
    base = `${base}/api`
  }
  return base
}

export const API_BASE = resolveApiBase()

/**
 * Resolves media and uploaded file URLs whether using Cloudinary,
 * local storage, or relative paths when backend is hosted separately.
 */
export function getMediaUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  // Ensure secure HTTPS for Cloudinary assets
  if (trimmed.startsWith('http://res.cloudinary.com/')) {
    return trimmed.replace('http://', 'https://')
  }

  // Already absolute or base64 data URI
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed
  }

  let formatted = trimmed
  // Normalize missing leading slash for relative assets (e.g. "team/team-1.svg" -> "/team/team-1.svg")
  if (!formatted.startsWith('/')) {
    formatted = `/${formatted}`
  }

  // Local upload served by Express backend
  if (formatted.startsWith('/uploads/')) {
    if (API_BASE.startsWith('http')) {
      try {
        const backendOrigin = new URL(API_BASE).origin
        return encodeURI(`${backendOrigin}${formatted}`)
      } catch {
        return encodeURI(formatted)
      }
    }
  }

  return encodeURI(formatted)
}

export function getToken() {
  return localStorage.getItem('diu_press_token') || ''
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('diu_press_token', token)
  } else {
    localStorage.removeItem('diu_press_token')
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('diu_press_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('diu_press_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('diu_press_user')
  }
}

async function request(path, options = {}, retries = 1) {
  const token = getToken()
  const headers = {
    ...options.headers
  }

  // If payload is json and content-type not set, set it
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Resilient 25-second request timeout to allow cloud Atlas TLS handshake and image processing
  const timeoutMs = options.timeout || 25000
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
      cache: 'no-store'
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      // Auto-retry transient gateway / proxy disconnects (502 Bad Gateway, 503, 504)
      if (retries > 0 && (res.status === 502 || res.status === 503 || res.status === 504)) {
        await new Promise((resolve) => setTimeout(resolve, 600))
        return request(path, options, retries - 1)
      }

      let message = 'Request failed'
      try {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          message = data.message || data.error || data.details || message
        } catch {
          if (text && text.length < 200) {
            message = text
          }
        }
      } catch {}

      const err = new Error(message)
      err.status = res.status
      throw err
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return await res.json()
    }
    return await res.text()
  } catch (err) {
    clearTimeout(timeoutId)
    const isTimeout = err.name === 'AbortError'
    const isNetworkErr = isTimeout || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')

    // Automatically retry once on transient network glitch or connection timeout
    if (retries > 0 && isNetworkErr) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      return request(path, options, retries - 1)
    }

    if (isTimeout) {
      const timeoutErr = new Error('Server request timed out. Please check your connection and try again.')
      timeoutErr.name = 'TimeoutError'
      throw timeoutErr
    }
    throw err
  }
}

export const api = {
  // Public Content
  getBooks: (params = '') => request(`/books${params ? `?${params}` : ''}`),
  getBook: (slug) => request(`/books/${slug}`),
  getNews: () => request('/news'),
  getNewsItem: (slug) => request(`/news/${slug}`),
  submitManuscript: (formData) => request('/submissions', { method: 'POST', body: formData }),
  sendContact: (payload) => request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getTeam: () => request('/team'),
  getWriters: (params = '') => request(`/writers${params ? `?${params}` : ''}`),
  getWriter: (slug) => request(`/writers/${slug}`),

  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  verifyPassword: (password) => request('/auth/verify-password', {
    method: 'POST',
    body: JSON.stringify({ password })
  }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  // Accounts Management
  getAccounts: () => request('/auth/accounts'),
  createAccount: (data) => request('/auth/accounts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateAccount: (id, data) => request(`/auth/accounts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteAccount: (id) => request(`/auth/accounts/${id}`, {
    method: 'DELETE'
  }),

  // Admin Book Management
  createBook: (data) => request('/books', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateBook: (id, data) => request(`/books/id/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteBook: (id) => request(`/books/id/${id}`, {
    method: 'DELETE'
  }),

  // Admin News Management
  createNews: (data) => request('/news', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateNews: (id, data) => request(`/news/id/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteNews: (id) => request(`/news/id/${id}`, {
    method: 'DELETE'
  }),

  // Admin Submissions Management
  getSubmissions: (params = '') => request(`/submissions${params ? `?${params}` : ''}`),
  updateSubmission: (id, data) => request(`/submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteSubmission: (id) => request(`/submissions/${id}`, {
    method: 'DELETE'
  }),

  // Admin Contact Arrival Management
  getContacts: () => request('/contact'),
  updateContact: (id, data) => request(`/contact/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  markAllContactsRead: () => request('/contact/mark-all-read', {
    method: 'PATCH'
  }),
  deleteContact: (id) => request(`/contact/${id}`, {
    method: 'DELETE'
  }),

  // Admin Team Management
  createTeamMember: (data) => request('/team', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateTeamMember: (id, data) => request(`/team/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteTeamMember: (id) => request(`/team/${id}`, {
    method: 'DELETE'
  }),

  // Admin Writers Management
  createWriter: (data) => request('/writers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateWriter: (id, data) => request(`/writers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteWriter: (id) => request(`/writers/${id}`, {
    method: 'DELETE'
  }),

  // Media Management
  uploadImage: (formData) => request('/media/image', {
    method: 'POST',
    body: formData
  }),
  deleteImage: (data) => request('/media/image', {
    method: 'DELETE',
    body: JSON.stringify(typeof data === 'string' ? { url: data } : data)
  }),

  // ERP Master Config & Taxonomies
  getErpConfig: () => request('/erp/config'),
  updateErpConfig: (data) => request('/erp/config', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  resetErpConfig: () => request('/erp/config/reset', {
    method: 'POST'
  }),

  // ERP Sales & Orders
  getErpOrders: () => request('/erp/orders'),
  createErpOrder: (data) => request('/erp/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateErpOrder: (id, data) => request(`/erp/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteErpOrder: (id) => request(`/erp/orders/${id}`, {
    method: 'DELETE'
  }),

  // ERP System Audit Activity
  getAuditLogs: () => request('/erp/audit-logs'),
  createAuditLog: (data) => request('/erp/audit-logs', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  clearAuditLogs: () => request('/erp/audit-logs/clear', {
    method: 'POST'
  })
}
