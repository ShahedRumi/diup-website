/**
 * DIU Press Real-Time Content Synchronization
 * Broadcasts mutations (books, news, team, etc.) across browser tabs
 * and within the same window so public pages update instantaneously.
 */
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('diu_press_content_sync') : null

export function notifyContentUpdated() {
  window.dispatchEvent(new Event('diu_content_updated'))
  if (channel) {
    try {
      channel.postMessage({ type: 'DIU_CONTENT_UPDATED', timestamp: Date.now() })
    } catch {}
  }
}

export function subscribeContentUpdated(callback) {
  window.addEventListener('diu_content_updated', callback)
  if (channel) {
    const handleMessage = (e) => {
      if (e?.data?.type === 'DIU_CONTENT_UPDATED') {
        callback()
      }
    }
    channel.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('diu_content_updated', callback)
      channel.removeEventListener('message', handleMessage)
    }
  }
  return () => {
    window.removeEventListener('diu_content_updated', callback)
  }
}
