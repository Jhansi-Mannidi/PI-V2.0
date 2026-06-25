'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Bot,
  BarChart3,
  Minus,
  PieChart,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AnimNum, FadeUp, GrowBar, FillBar } from '@/components/animated-primitives'
import { useAI } from '@/components/ai-provider'

// Animation ease curve
const ease = [0.25, 0.46, 0.45, 0.94] as const

const projects = [
  {
    id: 'PRJ-001', name: 'Mesa', program: 'Southeast', bac: 131, eac: 143, ac: 78, ev: 73.3,
    cpi: 0.94, spi: 0.89, contingency: 8.5, contingencyUsed: 62, trend: 'worsening' as const,
    monthlyBurn: [8.2, 9.1, 9.5, 10.2, 10.8, 11.1], forecast: [11.4, 11.8, 12.1, 12.5],
    agent: 'A-301', agentNote: 'EAC trending $12M over BAC. CO-0087 ($2.1M) pending adds further pressure. Recommend VE on HVAC.',
    topVariances: [
      { category: 'Mechanical', amount: 4.8, pct: '+8.2%' },
      { category: 'Electrical', amount: 3.1, pct: '+5.3%' },
      { category: 'Civil', amount: 2.2, pct: '+3.8%' },
    ],
  },
  {
    id: 'PRJ-002', name: 'Henderson', program: 'West', bac: 98, eac: 105, ac: 42, ev: 38.2,
    cpi: 0.91, spi: 0.85, contingency: 6.2, contingencyUsed: 45, trend: 'worsening' as const,
    monthlyBurn: [5.8, 6.2, 6.9, 7.4, 7.8, 8.1], forecast: [8.5, 8.9, 9.2, 9.5],
    agent: 'A-301', agentNote: 'Contractor performance driving cost variance. Acme Electrical SLA miss rate: 18%. Rework costs: $1.4M.',
    topVariances: [
      { category: 'Electrical', amount: 3.8, pct: '+9.1%' },
      { category: 'General Conditions', amount: 2.1, pct: '+5.0%' },
    ],
  },
  {
    id: 'PRJ-003', name: 'Pryor Creek', program: 'Central', bac: 112, eac: 118, ac: 56, ev: 53.8,
    cpi: 0.96, spi: 0.92, contingency: 7.0, contingencyUsed: 38, trend: 'stable' as const,
    monthlyBurn: [7.2, 7.5, 7.8, 8.1, 8.4, 8.6], forecast: [8.8, 9.0, 9.1, 9.2],
    agent: 'A-301', agentNote: 'RFI backlog adding soft cost pressure. Structural review delays costing $120K/week in idle time.',
    topVariances: [
      { category: 'Structural', amount: 2.4, pct: '+4.2%' },
      { category: 'Professional Services', amount: 1.8, pct: '+3.1%' },
    ],
  },
  {
    id: 'PRJ-004', name: 'Papillion', program: 'Central', bac: 89, eac: 92, ac: 35, ev: 34.1,
    cpi: 0.97, spi: 0.94, contingency: 5.5, contingencyUsed: 22, trend: 'stable' as const,
    monthlyBurn: [4.5, 4.8, 5.1, 5.4, 5.7, 5.9], forecast: [6.1, 6.3, 6.4, 6.5],
    agent: null, agentNote: null,
    topVariances: [{ category: 'Mechanical', amount: 1.5, pct: '+3.4%' }],
  },
  {
    id: 'PRJ-005', name: 'New Albany', program: 'Southeast', bac: 76, eac: 78, ac: 22, ev: 21.5,
    cpi: 0.98, spi: 0.96, contingency: 4.8, contingencyUsed: 15, trend: 'improving' as const,
    monthlyBurn: [3.2, 3.4, 3.6, 3.7, 3.8, 3.9], forecast: [4.0, 4.1, 4.1, 4.2],
    agent: null, agentNote: null,
    topVariances: [{ category: 'Site Work', amount: 0.8, pct: '+2.1%' }],
  },
  {
    id: 'PRJ-006', name: 'Storey County', program: 'West', bac: 95, eac: 96, ac: 18, ev: 17.8,
    cpi: 0.99, spi: 0.97, contingency: 6.0, contingencyUsed: 8, trend: 'improving' as const,
    monthlyBurn: [2.5, 2.8, 3.0, 3.1, 3.2, 3.3], forecast: [3.4, 3.5, 3.6, 3.7],
    agent: null, agentNote: null,
    topVariances: [],
  },
  {
    id: 'PRJ-007', name: 'De Soto', program: 'Central', bac: 68, eac: 72, ac: 28, ev: 26.2,
    cpi: 0.94, spi: 0.88, contingency: 4.2, contingencyUsed: 55, trend: 'worsening' as const,
    monthlyBurn: [3.8, 4.1, 4.4, 4.6, 4.8, 5.0], forecast: [5.2, 5.4, 5.5, 5.6],
    agent: 'A-301', agentNote: 'Easement dispute adding $4M risk exposure. Legal fees trending above budget.',
    topVariances: [{ category: 'Legal/Permits', amount: 2.8, pct: '+8.2%' }, { category: 'Site Work', amount: 1.2, pct: '+3.5%' }],
  },
  {
    id: 'PRJ-008', name: 'Midlothian', program: 'Northeast', bac: 54, eac: 55, ac: 12, ev: 11.9,
    cpi: 0.99, spi: 0.98, contingency: 3.4, contingencyUsed: 5, trend: 'improving' as const,
    monthlyBurn: [1.8, 2.0, 2.1, 2.2, 2.3, 2.4], forecast: [2.5, 2.5, 2.6, 2.6],
    agent: null, agentNote: null,
    topVariances: [],
  },
]

const trendIcons = { worsening: TrendingDown, stable: Minus, improving: TrendingUp }
const trendColors = { worsening: 'text-muted-foreground', stable: 'text-muted-foreground', improving: 'text-muted-foreground' }

// Skeleton loading component
function BudgetSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-pulse">
      {/* Summary cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <div className="h-2.5 w-16 rounded bg-muted" />
            </div>
            <div className="h-7 w-20 rounded bg-muted mb-1.5" />
            <div className="h-2.5 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Bar chart skeleton */}
      <div className="bg-card rounded-xl border border-line p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="flex gap-3">
            <div className="h-3 w-12 rounded bg-muted" />
            <div className="h-3 w-14 rounded bg-muted" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3.5 w-20 rounded bg-muted" />
              <div className="flex-1 h-5 rounded bg-muted" style={{ width: `${90 - i * 8}%` }} />
              <div className="h-3.5 w-10 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-card rounded-xl border border-line overflow-hidden">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <div className="h-5 w-36 rounded bg-muted" />
          <div className="flex gap-1">
            <div className="h-7 w-20 rounded-lg bg-muted" />
            <div className="h-7 w-16 rounded-lg bg-muted" />
            <div className="h-7 w-16 rounded-lg bg-muted" />
          </div>
        </div>
        {/* Header row */}
        <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 border-b border-line">
          {[140, 60, 60, 70, 50, 50, 100, 70, 50].map((w, i) => (
            <div key={i} className="h-2.5 rounded bg-muted" style={{ width: `${w}px` }} />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-0">
            <div className="w-3.5 h-3.5 rounded bg-muted shrink-0" />
            <div className="min-w-[120px]">
              <div className="h-4 w-24 rounded bg-muted mb-1" />
              <div className="h-2.5 w-14 rounded bg-muted" />
            </div>
            <div className="flex-1 flex items-center gap-6">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 w-12 rounded bg-muted" />
              ))}
              <div className="h-1.5 w-20 rounded-full bg-muted" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BudgetDeepDivePage() {
  const { aiEnabled } = useAI()
  const [expandedProject, setExpandedProject] = React.useState<string | null>(null)
  const [sortBy, setSortBy] = React.useState<'variance' | 'eac' | 'cpi'>('variance')
  const [programFilter, setProgramFilter] = React.useState<string>('all')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const programFiltered = programFilter === 'all'
    ? projects
    : projects.filter((p) => p.program === programFilter)

  const totalBAC = programFiltered.reduce((s, p) => s + p.bac, 0)
  const totalEAC = programFiltered.reduce((s, p) => s + p.eac, 0)
  const totalAC = programFiltered.reduce((s, p) => s + p.ac, 0)
  const totalEV = programFiltered.reduce((s, p) => s + p.ev, 0)
  const portfolioCPI = totalEV / totalAC

  const sorted = [...programFiltered].sort((a, b) => {
    if (sortBy === 'variance') return (b.eac - b.bac) - (a.eac - a.bac)
    if (sortBy === 'eac') return b.eac - a.eac
    return a.cpi - b.cpi
  })

  if (loading) {
    return (
      <AppShell title="Budget & EAC Deep-Dive" subtitle="Where is the money going?" activeHref="/budget">
        <BudgetSkeleton />
      </AppShell>
    )
  }

  return (
    <AppShell title="Budget & EAC Deep-Dive" subtitle="Where is the money going?" activeHref="/budget">
      <motion.div 
        className="space-y-4 sm:space-y-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >

        {/* Portfolio Budget Summary - Professional KPI Cards */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <FadeUp delay={0}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total BAC</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight"><AnimNum value={`$${totalBAC}M`} delay={200} /></p>
              <p className="text-xs text-muted-foreground mt-1">Budget at completion</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.06}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-teal" />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total EAC</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight"><AnimNum value={`$${totalEAC}M`} delay={280} /></p>
              <p className="text-xs text-red font-medium mt-1">+${totalEAC - totalBAC}M over budget</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.12}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-gold" />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actual Cost</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight"><AnimNum value={`$${totalAC}M`} delay={360} /></p>
              <p className="text-xs text-muted-foreground mt-1"><AnimNum value={`${Math.round((totalAC / totalEAC) * 100)}%`} delay={400} /> spent</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.18}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Portfolio CPI</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight"><AnimNum value={portfolioCPI.toFixed(2)} delay={440} /></p>
              <p className="text-xs text-muted-foreground mt-1">Below 1.0 target</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red" />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Over Budget</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight"><AnimNum value={`${programFiltered.filter((p) => p.eac > p.bac).length}`} delay={520} />/{programFiltered.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Projects</p>
            </div>
          </FadeUp>
        </motion.div>

        {/* Budget Variance Bars - Professional styling */}
        <motion.div 
          className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-sm)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">EAC vs BAC by Project</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Budget variance analysis</p>
            </div>
            <div className="flex gap-5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-teal/40" />
                <span className="text-muted-foreground font-medium">BAC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-gold via-amber-400 to-amber-500" />
                <span className="text-gold font-medium">Overrun</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[...programFiltered].sort((a, b) => (b.eac - b.bac) - (a.eac - a.bac)).map((p, idx) => {
              const variance = p.eac - p.bac
              const maxEAC = Math.max(...programFiltered.map((x) => x.eac))
              const varianceIntensity = Math.min(1, variance / 15) // 0-1 based on variance magnitude
              return (
                <FadeUp key={p.id} delay={0.4 + idx * 0.06}>
                  <div className="flex items-center gap-4 group">
                    <span className="text-sm font-medium text-foreground min-w-[100px] truncate">{p.name}</span>
                    <div className="flex-1 flex items-center h-6 bg-muted/10 rounded overflow-hidden">
                      {/* BAC bar - teal/cyan tone */}
                      <GrowBar 
                        widthPct={(p.bac / maxEAC) * 100} 
                        delay={0.5 + idx * 0.08} 
                        className="h-full rounded-l transition-all"
                        style={{
                          background: 'linear-gradient(90deg, rgba(45, 212, 191, 0.25), rgba(45, 212, 191, 0.35))',
                        }}
                      />
                      {/* Overrun bar - gold/amber gradient */}
                      {variance > 0 && (
                        <GrowBar 
                          widthPct={(variance / maxEAC) * 100} 
                          delay={0.7 + idx * 0.08} 
                          className="h-full rounded-r transition-all group-hover:brightness-110"
                          style={{ 
                            background: `linear-gradient(90deg, 
                              hsl(45, 93%, ${50 + varianceIntensity * 10}%) ${varianceIntensity * 20}%, 
                              hsl(40, 95%, ${55 + varianceIntensity * 5}%) 60%, 
                              hsl(35, 92%, ${58 + varianceIntensity * 7}%) 100%)`,
                            boxShadow: variance > 5 ? '0 0 12px rgba(234, 179, 8, 0.3)' : 'none',
                          }}
                        />
                      )}
                    </div>
                    <span className={cn(
                      'text-sm font-mono font-semibold min-w-[60px] text-right tabular-nums transition-colors',
                      variance > 8 ? 'text-gold' : variance > 3 ? 'text-amber-400' : 'text-muted-foreground'
                    )}>
                      <AnimNum value={`+$${variance}M`} delay={600 + idx * 80} />
                    </span>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </motion.div>

        {/* Project Budget Detail Table */}
        <motion.div 
          className="bg-card rounded-xl border border-line overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3, ease }}
        >
          <div className="px-5 py-4 border-b border-line flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-sans text-base font-semibold text-foreground">Project Budget Detail</h3>
            <div className="flex items-center gap-3">
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="h-8 w-[140px] text-xs border-line">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Southeast">Southeast</SelectItem>
                  <SelectItem value="Central">Central</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                  <SelectItem value="Northeast">Northeast</SelectItem>
                </SelectContent>
              </Select>
            <div className="flex gap-1">
              {([['variance', 'By Variance'], ['eac', 'By EAC'], ['cpi', 'By CPI']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setSortBy(key)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    sortBy === key ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary')}>
                  {label}
                </button>
              ))}
            </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pl-5 pr-2 py-2.5 w-[180px]">Project</th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-2.5 w-[80px]">BAC</th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-2.5 w-[80px]">EAC</th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-2.5 w-[80px]">Variance</th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-2.5 w-[65px]">CPI</th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-2.5 w-[65px]">SPI</th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-2.5 w-[130px]">Contingency</th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-2.5 w-[100px]">Trend</th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 pr-5 py-2.5 w-[70px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sorted.map((p) => {
                  const TIcon = trendIcons[p.trend]
                  const variance = p.eac - p.bac
                  const isExpanded = expandedProject === p.id
                  return (
                    <React.Fragment key={p.id}>
                      <tr
                        onClick={() => setExpandedProject(isExpanded ? null : p.id)}
                        className={cn(
                          'cursor-pointer transition-colors hover:bg-secondary/20',
                          isExpanded && 'bg-secondary/10'
                        )}
                      >
                        {/* Project */}
                        <td className="pl-5 pr-2 py-3.5">
                          <div className="flex items-center gap-2">
                            {isExpanded
                              ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            }
                            <div>
                              <p className="text-sm font-semibold text-foreground leading-tight">{p.name}</p>
                              <p className="text-[10px] text-muted-foreground leading-tight">{p.program}</p>
                            </div>
                          </div>
                        </td>
                        {/* BAC */}
                        <td className="text-right px-3 py-3.5">
                          <span className="text-sm font-mono text-muted-foreground">${p.bac}M</span>
                        </td>
                        {/* EAC */}
                        <td className="text-right px-3 py-3.5">
                          <span className="text-sm font-mono font-semibold text-foreground">${p.eac}M</span>
                        </td>
                        {/* Variance */}
                        <td className="text-right px-3 py-3.5">
                          <span className={cn('text-sm font-mono font-semibold', variance > 3 ? 'text-red' : 'text-foreground')}>
                            +{variance}M
                          </span>
                        </td>
                        {/* CPI */}
                        <td className="text-right px-3 py-3.5">
                          <span className={cn('text-sm font-mono', p.cpi < 0.95 ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                            {p.cpi.toFixed(2)}
                          </span>
                        </td>
                        {/* SPI */}
                        <td className="text-right px-3 py-3.5">
                          <span className={cn('text-sm font-mono', p.spi < 0.90 ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                            {p.spi.toFixed(2)}
                          </span>
                        </td>
                        {/* Contingency */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden shrink-0">
                              <FillBar
                                widthPct={p.contingencyUsed}
                                delay={0.3}
                                className={cn(
                                  'h-full rounded-full',
                                  p.contingencyUsed >= 60 ? 'bg-red/60' : p.contingencyUsed >= 40 ? 'bg-amber/60' : 'bg-foreground/20'
                                )}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-muted-foreground tabular-nums"><AnimNum value={`${p.contingencyUsed}%`} delay={400} /></span>
                          </div>
                        </td>
                        {/* Trend */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <TIcon className={cn('w-3.5 h-3.5', trendColors[p.trend])} />
                            <span className="text-[11px] text-muted-foreground capitalize">{p.trend}</span>
                          </div>
                        </td>
                        {/* Agent */}
                        <td className="px-3 pr-5 py-3.5">
                          {aiEnabled && p.agent && (
                            <Badge variant="outline" className="text-[10px] font-mono border-line text-muted-foreground">
                              <Bot className="w-3 h-3 mr-1" />{p.agent}
                            </Badge>
                          )}
                        </td>
                      </tr>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="px-5 pb-4 pt-1">
                            <div className="ml-5 space-y-3">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {/* Monthly Burn */}
                                <div className="p-4 rounded-lg bg-secondary/20 border border-line">
                                  <p className="text-[10px] font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Monthly Burn Rate</p>
                                  <div className="flex items-end gap-1 h-16">
                                    {p.monthlyBurn.map((val, i) => (
                                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                                        <div className="w-full bg-foreground/15 rounded-t" style={{ height: `${(val / 15) * 100}%` }} />
                                        <span className="text-[8px] font-mono text-muted-foreground">M{i + 1}</span>
                                      </div>
                                    ))}
                                    {p.forecast.map((val, i) => (
                                      <div key={`f${i}`} className="flex-1 flex flex-col items-center gap-0.5">
                                        <div className="w-full bg-red/20 rounded-t border border-dashed border-red/30" style={{ height: `${(val / 15) * 100}%` }} />
                                        <span className="text-[8px] font-mono text-muted-foreground/50">F{i + 1}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Top Variances */}
                                <div className="p-4 rounded-lg bg-secondary/20 border border-line">
                                  <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Top Cost Variances</p>
                                  {p.topVariances.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No significant variances</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {p.topVariances.map((v) => (
                                        <div key={v.category} className="flex items-center gap-2">
                                          <span className="text-xs text-foreground min-w-[120px]">{v.category}</span>
                                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-foreground/20 rounded-full" style={{ width: `${Math.min(v.amount * 10, 100)}%` }} />
                                          </div>
                                          <span className="text-xs font-mono text-foreground min-w-[50px] text-right">+${v.amount}M</span>
                                          <span className="text-[10px] font-mono text-muted-foreground">{v.pct}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {aiEnabled && p.agentNote && (
                                <div className="p-3 rounded-lg bg-secondary/10 border border-line">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-xs font-semibold text-muted-foreground">Agent Analysis</span>
                                  </div>
                                  <p className="text-sm text-foreground/80 font-mono">{p.agentNote}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="sm:hidden divide-y divide-line">
            {sorted.map((p) => {
              const TIcon = trendIcons[p.trend]
              const variance = p.eac - p.bac
              const isExpanded = expandedProject === p.id
              return (
                <div key={p.id}>
                  <button
                    onClick={() => setExpandedProject(isExpanded ? null : p.id)}
                    className={cn('w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/20 transition-colors', isExpanded && 'bg-secondary/10')}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.program}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">EAC</p>
                        <p className="text-sm font-mono font-semibold text-foreground">${p.eac}M</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">Var</p>
                        <p className={cn('text-sm font-mono font-semibold', variance > 3 ? 'text-red' : 'text-foreground')}>
                          +{variance}M
                        </p>
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3 ml-6 space-y-2">
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono">
                        <span className="text-muted-foreground">BAC <span className="text-foreground font-semibold">${p.bac}M</span></span>
                        <span className="text-muted-foreground">CPI <span className="text-foreground font-semibold">{p.cpi.toFixed(2)}</span></span>
                        <span className="text-muted-foreground">SPI <span className="text-foreground font-semibold">{p.spi.toFixed(2)}</span></span>
                        <span className="text-muted-foreground">Cont. <span className="text-foreground font-semibold">{p.contingencyUsed}%</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground capitalize">{p.trend}</span>
                        {aiEnabled && p.agent && (
                          <Badge variant="outline" className="text-[10px] font-mono border-line text-muted-foreground ml-2">
                            <Bot className="w-3 h-3 mr-1" />{p.agent}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}
