'use client'

import * as React from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ============================================================
// Shared ease curve
// ============================================================

export const ease = [0.25, 0.46, 0.45, 0.94] as const

// ============================================================
// Page Wrapper - animates entire page content
// ============================================================

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// Staggered Container - for card grids
// ============================================================

export function StaggerContainer({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// Staggered Item - child of StaggerContainer
// ============================================================

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// Hero Text Animation - for main headings
// ============================================================

export function HeroText({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.h1
      className={className}
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.h1>
  )
}

// ============================================================
// Animated Card - with hover effects
// ============================================================

export function AnimatedCard({
  children,
  className,
  delay = 0,
  hoverScale = 1.02,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  hoverScale?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: hoverScale, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// Pulse Indicator - for live status
// ============================================================

export function PulseIndicator({
  color = 'bg-green',
  size = 'w-2 h-2',
  className,
}: {
  color?: string
  size?: string
  className?: string
}) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <motion.span
        className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}
        animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className={`relative inline-flex rounded-full ${size} ${color}`} />
    </span>
  )
}

// ============================================================
// Counter with spring animation
// ============================================================

export function SpringCounter({
  value,
  prefix = '',
  suffix = '',
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    if (!isInView) return
    
    let start = 0
    const duration = 1200
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Spring-like easing
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = Math.round(eased * value)
      
      setDisplay(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isInView, value])

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}

// ============================================================
// List Item Animation - for table rows
// ============================================================

export function AnimatedListItem({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode
  index?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.03,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// Progress Ring - circular progress indicator
// ============================================================

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  className,
  color = 'stroke-gold',
}: {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg className={className} width={size} height={size}>
      <circle
        className="stroke-secondary"
        strokeWidth={strokeWidth}
        fill="none"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        className={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          strokeDasharray: circumference,
          transformOrigin: 'center',
          transform: 'rotate(-90deg)',
        }}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  )
}

/**
 * Animated number that counts up from 0 to target.
 * Supports integers, decimals, and values with prefix/suffix (e.g. "$143M", "0.94", "+12M", "-36%", "78%")
 */
export function AnimNum({
  value,
  delay = 0,
  duration = 1000,
  className,
}: {
  value: string | number
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const strVal = String(value)
  const [display, setDisplay] = React.useState(strVal)

  React.useEffect(() => {
    if (!isInView) return

    // Parse: prefix (non-digit except minus/dot at start), number, suffix
    const match = strVal.match(/^([^0-9]*?)([\d]+\.?[\d]*)(.*?)$/)
    if (!match) {
      setDisplay(strVal)
      return
    }

    const prefix = match[1]
    const target = parseFloat(match[2])
    const suffix = match[3]
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0
    let start: number | null = null
    let raf: number

    const timeout = setTimeout(() => {
      const animate = (ts: number) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        // Cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = eased * target
        setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`)
        if (progress < 1) raf = requestAnimationFrame(animate)
        else setDisplay(strVal)
      }
      raf = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isInView, strVal, delay, duration])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

/**
 * Staggered fade-up for card grids. Wrap each card item.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      {children}
    </motion.div>
  )
}

/**
 * A horizontal bar that grows from 0% to its target width on scroll into view.
 */
export function GrowBar({
  widthPct,
  delay = 0,
  className,
  style,
}: {
  widthPct: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, width: 0 }}
      animate={isInView ? { width: `${widthPct}%` } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    />
  )
}

/**
 * Animated stacked bar segment that grows from 0 to target width.
 */
export function GrowSegment({
  widthPct,
  delay = 0,
  className,
  children,
}: {
  widthPct: number
  delay?: number
  className?: string
  children?: React.ReactNode
}) {
  return (
    <motion.div
      className={className}
      style={{ width: 0 }}
      animate={{ width: `${widthPct}%` }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/**
 * SVG path that draws in via stroke-dashoffset animation.
 */
export function DrawPath({
  d,
  stroke,
  strokeWidth = 2,
  delay = 0,
  duration = 1.2,
  ...rest
}: {
  d: string
  stroke: string
  strokeWidth?: number
  delay?: number
  duration?: number
} & Omit<
  React.SVGProps<SVGPathElement>,
  'stroke' | 'strokeWidth' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'
>) {
  // Approximate path length
  const pathRef = React.useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = React.useState(1000)

  React.useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [d])

  // motion.path's props collide with several SVG event-handler types from React.
  // Use the underlying component but bypass strict prop validation for the rest spread.
  const MotionPath = motion.path as unknown as React.ComponentType<Record<string, unknown>>

  return (
    <MotionPath
      ref={pathRef}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...rest}
    />
  )
}

/**
 * SVG circle endpoint that pops in after path draws.
 */
export function PopDot({
  cx,
  cy,
  r = 3,
  fill,
  delay = 0,
}: {
  cx: number
  cy: number
  r?: number
  fill: string
  delay?: number
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, delay, type: 'spring', stiffness: 300 }}
    />
  )
}

/**
 * Vertical stacked bar that grows upward.
 */
export function GrowVertical({
  heightPct,
  delay = 0,
  className,
  style,
}: {
  heightPct: string
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={{ ...style, height: 0 }}
      animate={{ height: heightPct }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    />
  )
}

/**
 * Confidence / progress bar that fills from left.
 */
export function FillBar({
  widthPct,
  delay = 0,
  className,
}: {
  widthPct: number
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ width: 0 }}
      animate={{ width: `${widthPct}%` }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    />
  )
}
