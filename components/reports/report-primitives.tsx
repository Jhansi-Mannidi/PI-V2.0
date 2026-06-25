'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportSectionProps {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  mobileCollapsible?: boolean // If true, always collapses on mobile regardless of defaultOpen
  children: React.ReactNode
  className?: string
  headerRight?: React.ReactNode
}

export function ReportSection({
  title,
  subtitle,
  defaultOpen = true,
  mobileCollapsible = true,
  children,
  className,
  headerRight,
}: ReportSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isMobile, setIsMobile] = React.useState(false)

  // Detect mobile
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto-collapse on mobile if mobileCollapsible is true
      if (mobile && mobileCollapsible) {
        setIsOpen(false)
      } else if (!mobile) {
        setIsOpen(defaultOpen)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [defaultOpen, mobileCollapsible])

  const shouldShowToggle = isMobile || !defaultOpen

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('bg-card border border-line rounded-xl overflow-hidden', className)}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!shouldShowToggle}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left',
          shouldShowToggle && 'hover:bg-secondary/30 cursor-pointer',
          !shouldShowToggle && 'cursor-default'
        )}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {headerRight}
          {shouldShowToggle && (
            <ChevronDown 
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform duration-200',
                isOpen && 'rotate-180'
              )} 
            />
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-line">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// KPI Card component for report strips
interface KPICardProps {
  label: string
  value: string | number
  subtext?: string
  trend?: { value: number | string; direction: 'up' | 'down' | 'neutral' }
  status?: 'green' | 'amber' | 'red' | 'neutral'
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function KPICard({
  label,
  value,
  subtext,
  trend,
  status = 'neutral',
  icon,
  onClick,
  className,
}: KPICardProps) {
  const statusColors = {
    green: 'border-l-green',
    amber: 'border-l-gold',
    red: 'border-l-red',
    neutral: 'border-l-line',
  }

  const trendColors = {
    up: 'text-green',
    down: 'text-red',
    neutral: 'text-muted-foreground',
  }

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : undefined}
      onClick={onClick}
      className={cn(
        'bg-card border border-line rounded-lg p-3 sm:p-4 border-l-4',
        statusColors[status],
        onClick && 'cursor-pointer hover:bg-secondary/30 transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            {label}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            {value}
          </div>
          {(subtext || trend) && (
            <div className="flex items-center gap-2 mt-1">
              {trend && (
                <span className={cn('text-[10px] font-medium', trendColors[trend.direction])}>
                  {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '–'} {trend.value}
                </span>
              )}
              {subtext && (
                <span className="text-[10px] text-muted-foreground">{subtext}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="shrink-0 opacity-60">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Status badge component
interface StatusBadgeProps {
  status: 'green' | 'amber' | 'red' | 'neutral' | 'teal'
  label: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const colors = {
    green: 'bg-green/10 text-green border-green/20',
    amber: 'bg-gold/10 text-gold border-gold/20',
    red: 'bg-red/10 text-red border-red/20',
    neutral: 'bg-secondary text-muted-foreground border-line',
    teal: 'bg-teal/10 text-teal border-teal/20',
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border',
      colors[status],
      className
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'green' && 'bg-green',
        status === 'amber' && 'bg-gold',
        status === 'red' && 'bg-red',
        status === 'neutral' && 'bg-muted-foreground',
        status === 'teal' && 'bg-teal'
      )} />
      {label}
    </span>
  )
}

// Accessible chart wrapper with data table fallback
interface AccessibleChartProps {
  title: string
  children: React.ReactNode
  dataTable: { headers: string[]; rows: (string | number)[][] }
  className?: string
}

export function AccessibleChart({ title, children, dataTable, className }: AccessibleChartProps) {
  const [showTable, setShowTable] = React.useState(false)

  return (
    <div className={cn('relative', className)}>
      {/* Chart */}
      <div aria-hidden={showTable}>
        {children}
      </div>

      {/* Toggle for screen readers */}
      <button
        onClick={() => setShowTable(!showTable)}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-10 focus:px-3 focus:py-1 focus:bg-gold focus:text-navy focus:rounded focus:text-xs"
      >
        {showTable ? 'Show chart' : 'Show data table'}
      </button>

      {/* Data table (screen reader fallback) */}
      <div className={cn('sr-only', showTable && 'not-sr-only mt-4')}>
        <table className="w-full text-xs border border-line rounded-lg overflow-hidden">
          <caption className="sr-only">{title} data</caption>
          <thead>
            <tr className="bg-secondary/50">
              {dataTable.headers.map((h, i) => (
                <th key={i} className="px-2 py-1.5 text-left font-medium text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable.rows.map((row, i) => (
              <tr key={i} className="border-t border-line">
                {row.map((cell, j) => (
                  <td key={j} className="px-2 py-1.5 text-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
