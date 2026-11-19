import { createContext, useContext } from 'react'

export interface ToastState {
  message: string | null
  showToast: (msg: string) => void
}

export const ToastContext = createContext<ToastState | null>(null)

export function useToast(): ToastState {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
