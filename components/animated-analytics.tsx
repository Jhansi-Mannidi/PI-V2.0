'use client'

import * as React from 'react'
import { motion, useSpring, useTransform, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED ANALYTICS COMPONENTS
   Reusable animation primitives for dashboards and reports
   ═══════════════════════════════════════════════════════════════════════════ */

// Animation variants for consistent timing
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

// Easing curves
export const smoothEase = [0.25, 0.46, 0.45, 0.94]
export const bounceEase = [0.68, -0.55, 0.265, 1.55]

/* ─── Animated Number Counter ─── */
interface AnimatedNumberProps {
  value: number
  duration?: number
  delay?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedNumber({
  value,
  duration = 1.5,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className
}: AnimatedNumberProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const spring = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0
  })
  const display = useTransform(spring, (current) => {
    const num = decimals > 0 ? current.toFixed(decimals) : Math.round(current)
    return `${prefix}${num.toLocaleString()}${suffix}`
  })
  const [displayValue, setDisplayValue] = React.useState(`${prefix}0${suffix}`)

  React.useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        spring.set(value)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, spring, value, delay])

  React.useEffect(() => {
    return display.on('change', (latest) => {
      setDisplayValue(latest)
    })
  }, [display])

  return <span ref={ref} className={className}>{displayValue}</span>
}

/* ─── Animated KPI Card ─── */
interface AnimatedKPICardProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  borderColor?: string
  delay?: number
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' }
  className?: string
  children?: React.ReactNode
}

export function AnimatedKPICard({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  borderColor = 'border-l-primary',
  delay = 0,
  trend,
  className,
  children
}: AnimatedKPICardProps) {
  return (
    <motion.div
      className={cn(
        'bg-card border border-line rounded-xl p-4 border-l-4',
        borderColor,
        className
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: smoothEase
      }}
      whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
    >
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold text-foreground">
          <AnimatedNumber 
            value={value} 
            prefix={prefix} 
            suffix={suffix} 
            decimals={decimals}
            delay={delay + 0.2}
          />
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-semibold',
            trend.direction === 'up' && 'text-emerald-600',
            trend.direction === 'down' && 'text-red-500',
            trend.direction === 'neutral' && 'text-muted-foreground'
          )}>
            {trend.value}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  )
}

/* ─── Animated Horizontal Bar ─── */
interface AnimatedBarProps {
  value: number
  maxValue: number
  color?: string
  height?: string
  delay?: number
  showValue?: boolean
  label?: string | number
  className?: string
}

export function AnimatedBar({
  value,
  maxValue,
  color = 'bg-primary',
  height = 'h-8',
  delay = 0,
  showValue = true,
  label,
  className
}: AnimatedBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  
  return (
    <div className={cn('bg-secondary/30 rounded-lg overflow-hidden', height, className)}>
      <motion.div
        className={cn('h-full flex items-center justify-center text-[10px] font-semibold', color)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, delay, ease: smoothEase }}
      >
        {showValue && percentage >= 10 && (
          <span className="text-white">{label ?? value}</span>
        )}
      </motion.div>
    </div>
  )
}

/* ─── Animated Vertical Bar (for trend charts) ─── */
interface AnimatedVerticalBarProps {
  value: number
  maxValue: number
  color?: string
  width?: string
  delay?: number
  className?: string
}

export function AnimatedVerticalBar({
  value,
  maxValue,
  color = 'bg-primary',
  width = 'w-full max-w-[12px]',
  delay = 0,
  className
}: AnimatedVerticalBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const heightPx = Math.max((value / maxValue) * 80, 4)
  
  return (
    <motion.div
      className={cn('rounded-t-sm', width, color, className)}
      initial={{ height: 0 }}
      animate={{ height: heightPx }}
      transition={{ duration: 0.6, delay, ease: smoothEase }}
    />
  )
}

/* ─── Animated Stacked Bar ─── */
interface StackedBarSegment {
  value: number
  color: string
  label?: string | number
  textColor?: string
}

interface AnimatedStackedBarProps {
  segments: StackedBarSegment[]
  maxValue: number
  height?: string
  delay?: number
  className?: string
}

export function AnimatedStackedBar({
  segments,
  maxValue,
  height = 'h-8',
  delay = 0,
  className
}: AnimatedStackedBarProps) {
  return (
    <div className={cn('bg-secondary/30 rounded-lg overflow-hidden flex', height, className)}>
      {segments.map((segment, index) => {
        const percentage = (segment.value / maxValue) * 100
        return (
          <motion.div
            key={index}
            className={cn(
              'h-full flex items-center justify-center text-[10px] font-semibold',
              segment.color,
              segment.textColor || 'text-white'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: 0.8, 
              delay: delay + index * 0.1, 
              ease: smoothEase 
            }}
          >
            {segment.value > 0 && percentage >= 8 && segment.label}
          </motion.div>
        )
      })}
    </div>
  )
}

/* ─── Animated Progress Ring ─── */
interface AnimatedProgressRingProps {
  value: number
  maxValue?: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  delay?: number
  showValue?: boolean
  className?: string
}

export function AnimatedProgressRing({
  value,
  maxValue = 100,
  size = 80,
  strokeWidth = 8,
  color = 'stroke-primary',
  bgColor = 'stroke-secondary',
  delay = 0,
  showValue = true,
  className
}: AnimatedProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min((value / maxValue) * 100, 100)
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className={bgColor}
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
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay, ease: smoothEase }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedNumber 
            value={percentage} 
            suffix="%" 
            decimals={0}
            delay={delay}
            className="text-sm font-bold text-foreground"
          />
        </div>
      )}
    </div>
  )
}

/* ─── Animated List Item ─── */
interface AnimatedListItemProps {
  index: number
  children: React.ReactNode
  className?: string
  baseDelay?: number
}

export function AnimatedListItem({
  index,
  children,
  className,
  baseDelay = 0
}: AnimatedListItemProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: baseDelay + index * 0.05 }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Animated Card Container ─── */
interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right' | 'down'
}

export function AnimatedCard({
  children,
  delay = 0,
  className,
  direction = 'up'
}: AnimatedCardProps) {
  const directionMap = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { y: 0, x: -20 },
    right: { y: 0, x: 20 }
  }
  
  const { x, y } = directionMap[direction]
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: smoothEase }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Animated Table Row ─── */
interface AnimatedTableRowProps {
  index: number
  children: React.ReactNode
  className?: string
  baseDelay?: number
}

export function AnimatedTableRow({
  index,
  children,
  className,
  baseDelay = 0.3
}: AnimatedTableRowProps) {
  return (
    <motion.tr
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: baseDelay + index * 0.03 }}
    >
      {children}
    </motion.tr>
  )
}

/* ─── Animated Donut/Pie Segment ─── */
interface DonutSegment {
  value: number
  color: string
  label?: string
}

interface AnimatedDonutProps {
  segments: DonutSegment[]
  size?: number
  strokeWidth?: number
  delay?: number
  className?: string
}

export function AnimatedDonut({
  segments,
  size = 120,
  strokeWidth = 24,
  delay = 0,
  className
}: AnimatedDonutProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  
  let accumulatedOffset = 0
  
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((segment, index) => {
          const percentage = (segment.value / total) * 100
          const segmentLength = (percentage / 100) * circumference
          const currentOffset = accumulatedOffset
          accumulatedOffset += segmentLength
          
          return (
            <motion.circle
              key={index}
              className={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              initial={{ strokeDashoffset: circumference }}
              animate={{ 
                strokeDashoffset: circumference - segmentLength,
                strokeDasharray: `${segmentLength} ${circumference - segmentLength}`
              }}
              transition={{ 
                duration: 0.8, 
                delay: delay + index * 0.15, 
                ease: smoothEase 
              }}
              style={{ 
                strokeDasharray: `${segmentLength} ${circumference - segmentLength}`,
                transform: `rotate(${(currentOffset / circumference) * 360}deg)`,
                transformOrigin: 'center'
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}

/* ─── Animated Grid Container ─── */
interface AnimatedGridProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function AnimatedGrid({
  children,
  className,
  staggerDelay = 0.1
}: AnimatedGridProps) {
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
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.95 },
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { duration: 0.4, ease: smoothEase }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ─── Page Transition Wrapper ─── */
interface AnimatedPageProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
