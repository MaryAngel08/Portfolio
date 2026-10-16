import { useEffect, useState } from 'react'

/**
 * Tracks mobile layout, reduced-motion preference, and tab visibility.
 * Used to scale quality and pause animation when the tab is hidden.
 */
export function useMediaFlags() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false,
  )
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )
  const [isVisible, setIsVisible] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
  )

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const onMobile = (e) => setIsMobile(e.matches)
    const onMotion = (e) => setReduceMotion(e.matches)
    const onVisibility = () => setIsVisible(document.visibilityState === 'visible')

    mobileQuery.addEventListener('change', onMobile)
    motionQuery.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      mobileQuery.removeEventListener('change', onMobile)
      motionQuery.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return { isMobile, reduceMotion, isVisible }
}
