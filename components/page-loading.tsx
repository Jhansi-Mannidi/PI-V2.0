'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Animated pulse effect for skeleton items
const pulseAnimation = 'animate-pulse'

export function PageLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center min-h-[400px]', className)}>
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated circles */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-gold/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-gold/50"
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-2 h-2 rounded-full bg-gold" />
          </motion.div>
        </div>
        
        {/* Loading text */}
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  )
}

// ── Task Inbox Skeleton ──
// Layout: 3 stat cards + tabbed card with task rows
export function InboxSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6 max-w-[1400px]', className)}>
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn('p-5 rounded-xl border border-line/30 bg-card/50', pulseAnimation)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-20 bg-muted/40 rounded" />
              <div className="w-8 h-8 bg-muted/30 rounded-lg" />
            </div>
            <div className="h-8 w-12 bg-muted/50 rounded mb-1" />
            <div className="h-3 w-16 bg-muted/30 rounded" />
          </motion.div>
        ))}
      </div>

      {/* Task List Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card/50 border border-line/30 rounded-xl overflow-hidden"
      >
        {/* Tabs */}
        <div className="p-4 border-b border-line/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={cn('h-9 rounded-lg bg-muted/30', pulseAnimation, i === 0 ? 'w-20' : 'w-24')} />
            ))}
          </div>
          <div className={cn('h-9 w-48 bg-muted/20 rounded-lg', pulseAnimation)} />
        </div>

        {/* Column Header */}
        <div className="hidden sm:flex items-center px-6 py-2.5 border-b border-line/20 bg-muted/10">
          <div className="w-12 shrink-0" />
          <div className="flex-1"><div className={cn('h-2.5 w-10 bg-muted/30 rounded', pulseAnimation)} /></div>
          <div className="w-24 shrink-0"><div className={cn('h-2.5 w-10 bg-muted/30 rounded', pulseAnimation)} /></div>
          <div className="w-24 shrink-0"><div className={cn('h-2.5 w-12 bg-muted/30 rounded', pulseAnimation)} /></div>
          <div className="w-20 shrink-0 text-right pr-6"><div className={cn('h-2.5 w-8 bg-muted/30 rounded ml-auto', pulseAnimation)} /></div>
        </div>

        {/* Section Header */}
        <div className="px-6 py-2.5 bg-rose-50/30 dark:bg-rose-500/5 border-b border-rose-100/50 dark:border-rose-500/10">
          <div className="flex items-center gap-2">
            <div className={cn('w-1.5 h-1.5 rounded-full bg-rose-300/50', pulseAnimation)} />
            <div className={cn('h-2.5 w-14 bg-rose-200/40 dark:bg-rose-500/10 rounded', pulseAnimation)} />
          </div>
        </div>

        {/* Task Rows */}
        <div className="divide-y divide-line/30">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={cn('flex items-center px-6 py-3.5', pulseAnimation)}
            >
              <div className="w-12 shrink-0"><div className="w-9 h-9 bg-muted/30 rounded-lg" /></div>
              <div className="flex-1 min-w-0 pr-4 space-y-1.5">
                <div className="h-3.5 w-48 bg-muted/40 rounded" />
                <div className="h-2.5 w-32 bg-muted/25 rounded" />
              </div>
              <div className="w-24 shrink-0"><div className="h-5 w-16 bg-muted/25 rounded-full" /></div>
              <div className="w-24 shrink-0"><div className="h-5 w-16 bg-muted/30 rounded-full" /></div>
              <div className="w-20 shrink-0 text-right pr-2 space-y-1">
                <div className="h-2 w-6 bg-muted/20 rounded ml-auto" />
                <div className="h-3 w-10 bg-muted/30 rounded ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* On Track Section */}
        <div className="px-6 py-2.5 bg-emerald-50/30 dark:bg-emerald-500/5 border-y border-emerald-100/50 dark:border-emerald-500/10">
          <div className="flex items-center gap-2">
            <div className={cn('w-1.5 h-1.5 rounded-full bg-emerald-300/50', pulseAnimation)} />
            <div className={cn('h-2.5 w-16 bg-emerald-200/40 dark:bg-emerald-500/10 rounded', pulseAnimation)} />
          </div>
        </div>

        {/* On Track Rows */}
        <div className="divide-y divide-line/30">
          {[...Array(1)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className={cn('flex items-center px-6 py-3.5', pulseAnimation)}
            >
              <div className="w-12 shrink-0"><div className="w-9 h-9 bg-muted/30 rounded-lg" /></div>
              <div className="flex-1 min-w-0 pr-4 space-y-1.5">
                <div className="h-3.5 w-40 bg-muted/40 rounded" />
                <div className="h-2.5 w-28 bg-muted/25 rounded" />
              </div>
              <div className="w-24 shrink-0"><div className="h-5 w-12 bg-muted/25 rounded-full" /></div>
              <div className="w-24 shrink-0"><div className="h-5 w-16 bg-emerald-100/50 dark:bg-emerald-500/10 rounded-full" /></div>
              <div className="w-20 shrink-0 text-right pr-2 space-y-1">
                <div className="h-2 w-6 bg-muted/20 rounded ml-auto" />
                <div className="h-3 w-10 bg-muted/30 rounded ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ── Projects/Health Dashboard Skeleton ──
// Layout: 4 filter cards + table with rows
export function ProjectsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6 max-w-[1400px]', className)}>
      {/* Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'p-5 rounded-xl border border-line/30',
              i === 0 ? 'bg-card/60 border-gold/20' : 'bg-muted/20',
              pulseAnimation
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-muted/40 rounded-lg" />
              {i === 0 && <div className="w-2 h-2 rounded-full bg-gold/40" />}
            </div>
            <div className="h-8 w-8 bg-muted/50 rounded mb-1" />
            <div className="h-3 w-20 bg-muted/30 rounded" />
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/50 border border-line/30 rounded-xl overflow-hidden"
      >
        {/* Table Header */}
        <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-0 bg-muted/20 border-b border-line/30 px-6 py-4">
          {['w-16', 'w-16', 'w-14', 'w-8', 'w-12', 'w-12'].map((width, i) => (
            <div key={i} className={cn('h-2.5 bg-muted/40 rounded', width, pulseAnimation)} />
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-line/30">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              className={cn('grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-0 items-center', pulseAnimation)}
            >
              {/* Project */}
              <div className="px-6 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-muted/40" />
                <div className="w-4 h-4 bg-muted/30 rounded" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-32 bg-muted/40 rounded" />
                  <div className="h-2.5 w-24 bg-muted/25 rounded" />
                </div>
              </div>
              {/* Progress */}
              <div className="px-4 py-3 hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                    <div className="h-full bg-muted/40 rounded-full" style={{ width: `${30 + i * 10}%` }} />
                  </div>
                  <div className="h-3 w-8 bg-muted/30 rounded" />
                </div>
              </div>
              {/* CPI/SPI */}
              <div className="px-4 py-3 hidden lg:flex gap-3">
                <div className="space-y-1">
                  <div className="h-2 w-6 bg-muted/25 rounded" />
                  <div className="h-3 w-8 bg-muted/35 rounded" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-6 bg-muted/25 rounded" />
                  <div className="h-3 w-8 bg-muted/35 rounded" />
                </div>
              </div>
              {/* SLA */}
              <div className="px-4 py-3 hidden lg:flex items-center gap-2">
                <div className="w-7 h-7 bg-muted/25 rounded-md" />
                <div className="h-3 w-8 bg-muted/35 rounded" />
              </div>
              {/* Issues */}
              <div className="px-4 py-3 hidden lg:block">
                <div className="h-5 w-6 bg-muted/30 rounded-full" />
              </div>
              {/* Status */}
              <div className="px-4 py-3 flex justify-end">
                <div className="h-5 w-16 bg-muted/30 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ── Program Scorecard Skeleton ──
// Layout: 5 KPI cards + project cards section + focus section
export function ProgramSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6 max-w-[1400px]', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className={cn('w-1 h-8 rounded-full bg-gold/20', pulseAnimation)} />
        <div className="space-y-2">
          <div className={cn('h-4 w-40 bg-muted/40 rounded', pulseAnimation)} />
          <div className={cn('h-2.5 w-56 bg-muted/25 rounded', pulseAnimation)} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={cn('p-4 bg-card/50 border border-line/30 rounded-xl', pulseAnimation)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-2.5 w-20 bg-muted/40 rounded" />
              <div className="w-6 h-6 bg-muted/30 rounded-lg" />
            </div>
            <div className="h-7 w-16 bg-muted/50 rounded mb-2" />
            <div className="h-4 w-20 bg-muted/25 rounded-full mb-3" />
            <div className="h-8 w-full bg-muted/20 rounded" />
          </motion.div>
        ))}
      </div>

      {/* Projects by Attention Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className={cn('h-4 w-48 bg-muted/40 rounded', pulseAnimation)} />
          <div className={cn('h-3 w-32 bg-muted/25 rounded', pulseAnimation)} />
        </div>

        {/* Project Cards */}
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className={cn('p-5 bg-card/50 border border-line/30 rounded-xl', pulseAnimation)}
            >
              {/* Top bar */}
              <div className={cn('h-1 w-full rounded-t-xl mb-4', i === 0 ? 'bg-rose-200/40' : 'bg-amber-200/40')} />
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-muted/40 rounded" />
                  <div className="h-3 w-20 bg-muted/25 rounded" />
                </div>
                <div className="h-8 w-14 bg-muted/30 rounded-lg" />
              </div>
              {/* Health dots */}
              <div className="flex gap-4 mb-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-muted/40" />
                    <div className="h-2.5 w-12 bg-muted/30 rounded" />
                  </div>
                ))}
              </div>
              {/* Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-2 w-8 bg-muted/25 rounded" />
                    <div className="h-4 w-12 bg-muted/40 rounded" />
                  </div>
                ))}
              </div>
              {/* Issue callout */}
              <div className="p-3 bg-muted/20 rounded-lg flex items-center gap-2">
                <div className="w-4 h-4 bg-muted/30 rounded" />
                <div className="h-3 w-48 bg-muted/30 rounded" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* This Week's Focus */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className={cn('h-4 w-32 bg-muted/40 rounded', pulseAnimation)} />
          <div className={cn('h-6 w-12 bg-muted/25 rounded-full', pulseAnimation)} />
        </div>
        <div className={cn('bg-card/50 border border-line/30 rounded-xl p-4 space-y-3', pulseAnimation)}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg">
              <div className="w-6 h-6 bg-muted/30 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-muted/40" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-48 bg-muted/35 rounded" />
                <div className="h-2.5 w-32 bg-muted/25 rounded" />
              </div>
              <div className="h-5 w-20 bg-muted/25 rounded-full" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ── Generic Dashboard Skeleton ──
// Layout: KPI strip + heatmap + 2 panels (default from app/loading.tsx)
export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6 max-w-[1400px]', className)}>
      {/* KPI Strip */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className={cn('w-1 h-8 rounded-full bg-gold/20', pulseAnimation)} />
          <div className="space-y-2">
            <div className={cn('h-4 w-32 rounded bg-muted/50', pulseAnimation)} />
            <div className={cn('h-2.5 w-48 rounded bg-muted/30', pulseAnimation)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className={cn('bg-card/60 border border-line/30 rounded-xl p-4 space-y-3', pulseAnimation)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.03 }}
            >
              <div className="flex items-center justify-between">
                <div className="h-2.5 w-20 rounded bg-muted/40" />
                <div className="w-6 h-6 rounded-lg bg-muted/30" />
              </div>
              <div className="h-7 w-16 rounded bg-muted/40" />
              <div className="h-4 w-24 rounded-full bg-muted/30" />
              <div className="h-8 w-full rounded bg-muted/20" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <motion.div
        className={cn('bg-card/60 border border-line/30 rounded-xl overflow-hidden', pulseAnimation)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.1 }}
      >
        <div className="p-5 border-b border-line/30">
          <div className="h-4 w-40 rounded bg-muted/40" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-40 h-8 rounded bg-muted/30" />
              <div className="flex-1 grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-10 rounded-lg bg-muted/20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn('bg-card/60 border border-line/30 rounded-xl p-4 space-y-4', pulseAnimation)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.15 + i * 0.03 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted/30" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-36 rounded bg-muted/40" />
                <div className="h-2.5 w-48 rounded bg-muted/30" />
              </div>
            </div>
            <div className="h-20 w-full rounded-lg bg-muted/20" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Simple Table Skeleton ──
// For pages with just a table layout
export function TableSkeleton({ className, rows = 8 }: { className?: string; rows?: number }) {
  return (
    <div className={cn('space-y-6 max-w-[1400px]', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className={cn('h-5 w-48 bg-muted/50 rounded', pulseAnimation)} />
          <div className={cn('h-3 w-32 bg-muted/30 rounded', pulseAnimation)} />
        </div>
        <div className="flex items-center gap-3">
          <div className={cn('h-9 w-24 bg-muted/30 rounded-lg', pulseAnimation)} />
          <div className={cn('h-9 w-9 bg-muted/25 rounded-lg', pulseAnimation)} />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn('bg-card/50 border border-line/30 rounded-xl overflow-hidden', pulseAnimation)}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 bg-muted/20 border-b border-line/30">
          {[48, 120, 80, 80, 60, 80].map((w, i) => (
            <div key={i} className={cn('h-2.5 bg-muted/40 rounded')} style={{ width: w }} />
          ))}
        </div>
        {/* Rows */}
        <div className="divide-y divide-line/30">
          {[...Array(rows)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.03 }}
              className="flex items-center gap-4 px-6 py-4"
            >
              <div className="w-8 h-8 bg-muted/30 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-40 bg-muted/40 rounded" />
                <div className="h-2.5 w-28 bg-muted/25 rounded" />
              </div>
              <div className="h-3 w-16 bg-muted/30 rounded" />
              <div className="h-3 w-12 bg-muted/25 rounded" />
              <div className="h-5 w-16 bg-muted/30 rounded-full" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ── Lead Operational View Skeleton ──
// Layout: Filter bar with tabs + 4 SLA cards + orchestration table
export function LeadSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-5 max-w-[1600px]', className)}>
      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        {/* Status Tabs */}
        <div className="flex items-center gap-1">
          {[
            { w: 52, active: true },
            { w: 80 },
            { w: 68 },
            { w: 84 },
            { w: 76 },
            { w: 110 },
          ].map((tab, i) => (
            <div
              key={i}
              className={cn(
                'h-8 rounded-full px-3 flex items-center gap-2',
                tab.active ? 'bg-gold/10 border border-gold/30' : 'bg-muted/20 border border-transparent',
                pulseAnimation
              )}
              style={{ width: tab.w }}
            >
              <div className={cn('w-1.5 h-1.5 rounded-full', tab.active ? 'bg-gold/50' : 'bg-muted/40')} />
              <div className={cn('h-2.5 flex-1 rounded', tab.active ? 'bg-gold/30' : 'bg-muted/30')} />
            </div>
          ))}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2">
          {[150, 140, 130].map((w, i) => (
            <div
              key={i}
              className={cn('h-8 rounded-md border border-line/30 bg-muted/20 flex items-center gap-2 px-3', pulseAnimation)}
              style={{ width: w }}
            >
              {i === 0 && <div className="w-3 h-3 bg-muted/40 rounded" />}
              <div className="h-2.5 flex-1 bg-muted/30 rounded" />
              <div className="w-3 h-3 bg-muted/30" />
            </div>
          ))}
          <div className={cn('h-8 w-24 rounded-md border border-line/30 bg-muted/20 flex items-center justify-center gap-1.5 px-3', pulseAnimation)}>
            <div className="w-3 h-3 bg-muted/30 rounded" />
            <div className="h-2.5 w-12 bg-muted/30 rounded" />
          </div>
          <div className={cn('h-8 w-20 rounded-md border border-line/30 bg-muted/20 flex items-center justify-center gap-1.5 px-3', pulseAnimation)}>
            <div className="w-3 h-3 bg-muted/30 rounded" />
            <div className="h-2.5 w-8 bg-muted/30 rounded" />
          </div>
        </div>
      </motion.div>

      {/* SLA State Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { color: 'bg-red-500/20', borderColor: 'border-red-500/20' },
          { color: 'bg-red-900/20', borderColor: 'border-red-900/20' },
          { color: 'bg-amber-500/20', borderColor: 'border-amber-500/20' },
          { color: 'bg-emerald-500/20', borderColor: 'border-emerald-500/20' },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.03 }}
            className={cn(
              'relative p-4 rounded-lg border overflow-hidden',
              card.borderColor,
              pulseAnimation
            )}
          >
            <div className={cn('absolute inset-0 opacity-30', card.color)} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-1.5 h-1.5 rounded-full', card.color.replace('/20', '/60'))} />
                <div className="h-2.5 w-16 bg-muted/40 rounded" />
              </div>
              <div className="h-8 w-8 bg-muted/50 rounded mb-1" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Orchestration Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={cn('bg-card/50 border border-line/30 rounded-xl overflow-hidden', pulseAnimation)}
      >
        {/* Table Header */}
        <div className="flex items-center gap-4 px-5 py-3 bg-muted/10 border-b border-line/30">
          <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded" />
          {['w-28', 'w-36', 'w-28', 'w-28', 'w-24', 'w-20', 'w-16', 'w-16', 'w-20'].map((w, i) => (
            <div key={i} className={cn('h-2.5 bg-muted/40 rounded', w)} />
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-line/30">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.02 }}
              className="flex items-center gap-4 px-5 py-3"
            >
              <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded" />
              <div className="w-28"><div className="h-3.5 w-24 bg-muted/40 rounded" /></div>
              <div className="w-36"><div className="h-3 w-32 bg-muted/30 rounded" /></div>
              <div className="w-28"><div className="h-3 w-24 bg-muted/30 rounded" /></div>
              <div className="w-28"><div className="h-3 w-20 bg-muted/30 rounded" /></div>
              <div className="w-24"><div className="h-3 w-16 bg-muted/25 rounded" /></div>
              <div className="w-20">
                <div className={cn(
                  'h-5 w-16 rounded-full',
                  i < 3 ? 'bg-red-500/20' : i < 5 ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                )} />
              </div>
              <div className="w-16"><div className="h-3 w-12 bg-muted/30 rounded" /></div>
              <div className="w-16"><div className="h-5 w-14 bg-muted/25 rounded" /></div>
              <div className="w-20 flex items-center gap-2">
                <div className="w-5 h-5 bg-muted/25 rounded" />
                <div className="w-5 h-5 bg-muted/25 rounded" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Backwards compatible generic skeleton
export function PageLoadingSkeleton({ className }: { className?: string }) {
  return <DashboardSkeleton className={className} />
}
