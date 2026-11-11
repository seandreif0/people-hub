import { useEffect, useRef, useState, type RefObject } from 'react'

function revealImmediately(): boolean {
  if (typeof IntersectionObserver === 'undefined') return true
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Becomes true once the element is at least `threshold` visible, then stays true. */
export function useInView<T extends Element>(threshold = 0.3): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(revealImmediately)

  useEffect(() => {
    const el = ref.current
    if (inView || !el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio >= threshold)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView, threshold])

  return [ref, inView]
}
