'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { kpiMetrics } from '@/lib/signals-data'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function Counter({ value }: { value: number | string }) {
  if (typeof value === 'string') return <span>{value}</span>
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {value}
    </motion.span>
  )
}

export function KPIStrip() {
  const icons = [AlertTriangle, TrendingUp, AlertTriangle, Clock, CheckCircle]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
    >
      {kpiMetrics.map((metric, idx) => {
        const Icon = icons[idx]
        const bgColor = metric.status === 'alert' ? 'bg-red/10' : metric.status === 'warning' ? 'bg-amber/10' : metric.status === 'success' ? 'bg-green/10' : 'bg-blue/10'
        const iconColor = metric.status === 'alert' ? 'text-red' : metric.status === 'warning' ? 'text-amber' : metric.status === 'success' ? 'text-green' : 'text-blue'
        
        return (
          <motion.div
            key={metric.label}
            variants={itemVariants}
            className={cn(
              'relative overflow-hidden rounded-lg border border-border/50 p-3 sm:p-4',
              bgColor
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-transparent" />
            <div className="relative flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {metric.label}
                </span>
                <Icon className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4', iconColor)} />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-lg sm:text-xl font-bold text-foreground font-mono">
                  <Counter value={metric.value} />
                </div>
                <span className={cn(
                  'text-[10px] font-semibold',
                  metric.status === 'alert' ? 'text-red' : metric.status === 'warning' ? 'text-amber' : 'text-green'
                )}>
                  {metric.change}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
