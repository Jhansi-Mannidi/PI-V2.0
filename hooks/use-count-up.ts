'use client'

import { useEffect, useState, useRef } from 'react'

interface UseCountUpOptions {
  end: number
  duration?: number
  delay?: number
  decimals?: number
  prefix?: string
  suffix?: string
  easing?: (t: number) => number
}

// Ease-out cubic for natural deceleration
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function useCountUp({
  end,
  duration = 1200,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  easing = easeOutCubic,
}: UseCountUpOptions): string {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafRef = useRef<number>(0)
  const hasStarted = useRef(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      hasStarted.current = true
      startTime.current = null

      const animate = (timestamp: number) => {
        if (!startTime.current) startTime.current = timestamp
        const elapsed = timestamp - startTime.current
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)

        setValue(easedProgress * end)

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setValue(end)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [end, duration, delay, easing])

  const formatted = value.toFixed(decimals)
  return `${prefix}${formatted}${suffix}`
}

// Simple hook that returns just a number (for SVG/chart use)
export function useAnimatedValue(end: number, duration = 1000, delay = 0): number {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTime.current = null

      const animate = (timestamp: number) => {
        if (!startTime.current) startTime.current = timestamp
        const elapsed = timestamp - startTime.current
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutCubic(progress)

        setValue(easedProgress * end)

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setValue(end)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [end, duration, delay])

  return value
}
