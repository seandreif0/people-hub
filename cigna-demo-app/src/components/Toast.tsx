import { useCallback, useState, type ReactNode } from 'react'
import { ToastContext } from './toast-context'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setMessage(msg)
    window.setTimeout(() => setMessage(null), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ message, showToast }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        {message && (
          <div className="pointer-events-auto rounded-full bg-navy px-6 py-3 text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
            {message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
