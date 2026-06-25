'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

// Count-up component that animates numeric values
function AnimatedValue({ 
  value, 
  delay = 0 
}: { 
  value: string
  delay?: number 
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  // Default to the real value so the card never shows '0' / '+$0M'
  // even if the IntersectionObserver never fires.
  const [displayValue, setDisplayValue] = React.useState(value)
  const hasAnimated = React.useRef(false)

  React.useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true
    
    // Extract the numeric part
    const match = value.match(/([-+$]*)(\d+\.?\d*)(.*)/  )
    if (!match) {
      setDisplayValue(value)
      return
    }
    
    const prefix = match[1]
    const target = parseFloat(match[2])
    const suffix = match[3]
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0
    const duration = 1200
    let startTime: number | null = null
    let raf: number

    // Reset to 0 only after IO has fired, so SSR/non-IO environments stay correct.
    setDisplayValue(`${prefix}${(0).toFixed(decimals)}${suffix}`)

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = eased * target
        setDisplayValue(`${prefix}${current.toFixed(decimals)}${suffix}`)
        
        if (progress < 1) {
          raf = requestAnimationFrame(animate)
        } else {
          setDisplayValue(value)
        }
      }
      raf = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isInView, value, delay])

  return <span ref={ref}>{displayValue}</span>
}

interface KPICardProps {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  sparklineData?: number[]
  accentColor: 'amber' | 'red' | 'green' | 'teal'
  source?: string
  onClick?: () => void
  className?: string
  index?: number
}

export function KPICard({
  label,
  value,
  delta,
  trend,
  sparklineData,
  accentColor,
  source,
  onClick,
  className,
  index = 0,
}: KPICardProps) {
  const accentMap = {
    amber: {
      gradient: 'from-transparent to-transparent',
      border: 'border-border hover:border-gold/40',
      glow: 'group-hover:shadow-[var(--shadow-md)]',
      iconBg: 'bg-gold/10',
      iconText: 'text-gold',
      deltaBg: 'bg-gold/10',
      deltaText: 'text-gold',
      sparkStroke: 'var(--gold)',
      sparkFill: 'var(--gold)',
      ring: 'ring-gold/20',
    },
    red: {
      gradient: 'from-transparent to-transparent',
      border: 'border-border hover:border-red/40',
      glow: 'group-hover:shadow-[var(--shadow-md)]',
      iconBg: 'bg-red/10',
      iconText: 'text-red',
      deltaBg: 'bg-red/10',
      deltaText: 'text-red',
      sparkStroke: 'var(--red)',
      sparkFill: 'var(--red)',
      ring: 'ring-red/20',
    },
    green: {
      gradient: 'from-transparent to-transparent',
      border: 'border-border hover:border-green/40',
      glow: 'group-hover:shadow-[var(--shadow-md)]',
      iconBg: 'bg-green/10',
      iconText: 'text-green',
      deltaBg: 'bg-green/10',
      deltaText: 'text-green',
      sparkStroke: 'var(--green)',
      sparkFill: 'var(--green)',
      ring: 'ring-green/20',
    },
    teal: {
      gradient: 'from-transparent to-transparent',
      border: 'border-border hover:border-teal/40',
      glow: 'group-hover:shadow-[var(--shadow-md)]',
      iconBg: 'bg-teal/10',
      iconText: 'text-teal',
      deltaBg: 'bg-teal/10',
      deltaText: 'text-teal',
      sparkStroke: 'var(--teal)',
      sparkFill: 'var(--teal)',
      ring: 'ring-teal/20',
    },
  }

  const accent = accentMap[accentColor] ?? accentMap.amber

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative bg-card rounded-xl overflow-hidden text-left w-full shadow-[var(--shadow-sm)]',
        'border transition-all duration-300 ease-out',
        accent.border,
        accent.glow,
        'group focus:outline-none focus:ring-2',
        accent.ring,
        className
      )}
    >
      {/* Gradient overlay */}
      <motion.div 
        className={cn('absolute inset-0 bg-gradient-to-br opacity-60', accent.gradient)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
      />
      
      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full" style={{ transition: 'transform 0.8s ease-out, opacity 0.3s ease-out' }} />

      <div className="relative p-5 pb-2">
        {/* Header row with icon box and label */}
        <div className="flex items-center gap-3 mb-3">
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', accent.iconBg)}>
            {trend === 'down' ? (
              <TrendingDown className={cn('w-4.5 h-4.5', accent.iconText)} />
            ) : trend === 'up' ? (
              <TrendingUp className={cn('w-4.5 h-4.5', accent.iconText)} />
            ) : (
              <Minus className={cn('w-4.5 h-4.5', accent.iconText)} />
            )}
          </div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {label}
          </p>
        </div>

        {/* Value with count-up animation */}
        <motion.p 
          className="font-mono text-2xl leading-none font-bold text-foreground tracking-tight mb-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.15 }}
        >
          <AnimatedValue value={value} delay={index * 100 + 300} />
        </motion.p>
        
        {/* Delta text */}
        <motion.p 
          className={cn('text-xs font-medium', accent.deltaText)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.25 }}
        >
          {delta}
        </motion.p>
      </div>

      {/* Sparkline with enhanced styling */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="relative px-5 pb-2">
          <Sparkline data={sparklineData} stroke={accent.sparkStroke} fill={accent.sparkFill} />
        </div>
      )}

      {/* Footer with source and drill indicator */}
      <div className="relative px-5 pb-4 flex items-center justify-between">
        {source && (
          <p className="text-[10px] text-muted-foreground/60 truncate">
            {source}
          </p>
        )}
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-foreground/60 group-hover:translate-x-0.5 transition-all" />
      </div>
    </motion.button>
  )
}

function Sparkline({
  data,
  stroke,
  fill,
  width = 200,
  height = 32,
}: {
  data: number[]
  stroke: string
  fill: string
  width?: number
  height?: number
}) {
  const ref = React.useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 4

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = padding + (1 - (val - min) / range) * (height - padding * 2)
    return { x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  const gradientId = React.useId()

  // Calculate approximate path length for stroke-dasharray animation
  let pathLength = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    pathLength += Math.sqrt(dx * dx + dy * dy)
  }

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height: `${height}px` }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`spark-fill-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={0.35} />
          <stop offset="50%" stopColor={fill} stopOpacity={0.15} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.02} />
        </linearGradient>
        <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Area fill - fades in */}
      <motion.path
        d={areaPath}
        fill={`url(#spark-fill-${gradientId})`}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
      />
      {/* Line stroke - draws in */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${gradientId})`}
        initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
        animate={isInView ? { strokeDashoffset: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
      />
      {/* Last point dot - pops in after line finishes */}
      <motion.circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={4}
        fill={stroke}
        fillOpacity={0.2}
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.5, type: 'spring', stiffness: 200 }}
      />
      <motion.circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={2.5}
        fill={stroke}
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.5, type: 'spring', stiffness: 200 }}
      />
    </svg>
  )
}
