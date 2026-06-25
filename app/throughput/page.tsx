'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  Activity,
  Bot,
  TrendingDown,
  TrendingUp,
  Minus,
  BarChart3,
  Clock,
  Layers,
  Building2,
  ChevronDown,
  Info,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AnimNum, FadeUp, GrowSegment, DrawPath, PopDot } from '@/components/animated-primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/* ── Mock Data ── */
const processTypes = ['All', 'Contractor Onboarding', 'RFI Response', 'Change Order', 'Invoice Reconciliation', 'Permit Application'] as const
const timeRanges = ['4w', '13w', '52w'] as const
const groupings = ['Program', 'Region'] as const

// Full 52-week data
const cycleTimeWeekly52w = [
  { week: 'W01', onboarding: 10.2, rfi: 3.5, changeOrder: 6.1, invoice: 4.0, permit: 14.2 },
  { week: 'W02', onboarding: 10.5, rfi: 3.6, changeOrder: 5.9, invoice: 3.8, permit: 14.0 },
  { week: 'W03', onboarding: 10.1, rfi: 3.4, changeOrder: 6.0, invoice: 3.9, permit: 13.8 },
  { week: 'W04', onboarding: 9.8, rfi: 3.3, changeOrder: 5.8, invoice: 3.7, permit: 13.5 },
  { week: 'W05', onboarding: 9.5, rfi: 3.2, changeOrder: 5.6, invoice: 3.5, permit: 13.2 },
  { week: 'W06', onboarding: 8.2, rfi: 2.8, changeOrder: 5.1, invoice: 3.2, permit: 12.1 },
  { week: 'W07', onboarding: 8.5, rfi: 2.9, changeOrder: 4.8, invoice: 3.0, permit: 12.4 },
  { week: 'W08', onboarding: 7.9, rfi: 3.1, changeOrder: 5.3, invoice: 3.4, permit: 11.8 },
  { week: 'W09', onboarding: 8.8, rfi: 2.7, changeOrder: 5.0, invoice: 3.1, permit: 13.2 },
  { week: 'W10', onboarding: 9.2, rfi: 3.4, changeOrder: 4.5, invoice: 2.9, permit: 12.9 },
  { week: 'W11', onboarding: 8.1, rfi: 3.2, changeOrder: 5.2, invoice: 3.3, permit: 11.5 },
  { week: 'W12', onboarding: 7.4, rfi: 2.6, changeOrder: 4.9, invoice: 3.0, permit: 12.2 },
  { week: 'W13', onboarding: 6.8, rfi: 2.5, changeOrder: 4.7, invoice: 2.8, permit: 11.8 },
  { week: 'W14', onboarding: 6.5, rfi: 2.9, changeOrder: 5.4, invoice: 3.2, permit: 13.1 },
  { week: 'W15', onboarding: 6.2, rfi: 3.0, changeOrder: 5.1, invoice: 3.1, permit: 12.4 },
  { week: 'W16', onboarding: 5.8, rfi: 2.8, changeOrder: 5.0, invoice: 2.9, permit: 12.0 },
  { week: 'W17', onboarding: 5.5, rfi: 3.1, changeOrder: 5.2, invoice: 3.0, permit: 11.6 },
  { week: 'W18', onboarding: 5.2, rfi: 2.9, changeOrder: 4.8, invoice: 2.7, permit: 11.2 },
]

// 13-week data (W06-W18)
const cycleTimeWeekly13w = cycleTimeWeekly52w.slice(5)

// 4-week data (W15-W18)
const cycleTimeWeekly4w = cycleTimeWeekly52w.slice(-4)

// Stage bottlenecks by process type
type StageBottleneck = { stage: string; pct: number; days: number; gradient: string; glow: string }
const stageBottlenecksByProcess: Record<string, StageBottleneck[]> = {
'All': [
  { stage: 'Legal Review', pct: 42, days: 4.4, gradient: 'from-red to-red-dark', glow: 'shadow-[0_0_16px_rgba(220,38,38,0.35)]' },
  { stage: 'Background Check', pct: 24, days: 2.5, gradient: 'from-gold to-gold-soft', glow: 'shadow-[0_0_14px_rgba(212,160,76,0.35)]' },
  { stage: 'Badge/Site Access', pct: 14, days: 1.5, gradient: 'from-teal to-teal/80', glow: 'shadow-[0_0_12px_rgba(43,138,138,0.3)]' },
  { stage: 'Insurance', pct: 10, days: 1.0, gradient: 'from-green to-green/80', glow: 'shadow-[0_0_10px_rgba(22,163,74,0.3)]' },
  { stage: 'Other', pct: 10, days: 1.0, gradient: 'from-navy-soft to-navy-mid', glow: 'shadow-[0_0_8px_rgba(28,53,83,0.25)]' },
  ],
  'Contractor Onboarding': [
  { stage: 'Legal Review', pct: 42, days: 4.4, gradient: 'from-red to-red-dark', glow: 'shadow-[0_0_16px_rgba(220,38,38,0.35)]' },
  { stage: 'Background Check', pct: 24, days: 2.5, gradient: 'from-gold to-gold-soft', glow: 'shadow-[0_0_14px_rgba(212,160,76,0.35)]' },
  { stage: 'Badge/Site Access', pct: 14, days: 1.5, gradient: 'from-teal to-teal/80', glow: 'shadow-[0_0_12px_rgba(43,138,138,0.3)]' },
  { stage: 'Insurance', pct: 10, days: 1.0, gradient: 'from-green to-green/80', glow: 'shadow-[0_0_10px_rgba(22,163,74,0.3)]' },
  { stage: 'Other', pct: 10, days: 1.0, gradient: 'from-navy-soft to-navy-mid', glow: 'shadow-[0_0_8px_rgba(28,53,83,0.25)]' },
  ],
  'RFI Response': [
  { stage: 'Technical Review', pct: 45, days: 1.2, gradient: 'from-red to-red-dark', glow: 'shadow-[0_0_16px_rgba(220,38,38,0.35)]' },
  { stage: 'Document Assembly', pct: 30, days: 0.8, gradient: 'from-gold to-gold-soft', glow: 'shadow-[0_0_14px_rgba(212,160,76,0.35)]' },
  { stage: 'Approval', pct: 25, days: 0.7, gradient: 'from-teal to-teal/80', glow: 'shadow-[0_0_12px_rgba(43,138,138,0.3)]' },
  ],
  'Change Order': [
  { stage: 'Cost Analysis', pct: 38, days: 1.9, gradient: 'from-red to-red-dark', glow: 'shadow-[0_0_16px_rgba(220,38,38,0.35)]' },
  { stage: 'Schedule Impact', pct: 28, days: 1.4, gradient: 'from-gold to-gold-soft', glow: 'shadow-[0_0_14px_rgba(212,160,76,0.35)]' },
  { stage: 'Approval Chain', pct: 22, days: 1.1, gradient: 'from-teal to-teal/80', glow: 'shadow-[0_0_12px_rgba(43,138,138,0.3)]' },
  { stage: 'Documentation', pct: 12, days: 0.6, gradient: 'from-navy-soft to-navy-mid', glow: 'shadow-[0_0_8px_rgba(28,53,83,0.25)]' },
  ],
  'Invoice Reconciliation': [
  { stage: 'Verification', pct: 40, days: 1.2, gradient: 'from-red to-red-dark', glow: 'shadow-[0_0_16px_rgba(220,38,38,0.35)]' },
  { stage: 'Discrepancy Resolution', pct: 35, days: 1.0, gradient: 'from-gold to-gold-soft', glow: 'shadow-[0_0_14px_rgba(212,160,76,0.35)]' },
  { stage: 'Approval', pct: 25, days: 0.8, gradient: 'from-teal to-teal/80', glow: 'shadow-[0_0_12px_rgba(43,138,138,0.3)]' },
  ],
  'Permit Application': [
  { stage: 'Documentation Prep', pct: 30, days: 3.6, gradient: 'from-red to-red-dark', glow: 'shadow-[0_0_16px_rgba(220,38,38,0.35)]' },
  { stage: 'Agency Review', pct: 45, days: 5.4, gradient: 'from-gold to-gold-soft', glow: 'shadow-[0_0_14px_rgba(212,160,76,0.35)]' },
  { stage: 'Revisions', pct: 15, days: 1.8, gradient: 'from-teal to-teal/80', glow: 'shadow-[0_0_12px_rgba(43,138,138,0.3)]' },
  { stage: 'Final Approval', pct: 10, days: 1.2, gradient: 'from-navy-soft to-navy-mid', glow: 'shadow-[0_0_8px_rgba(28,53,83,0.25)]' },
  ],
  }

// Region-based comparison data
const regionComparison = [
  {
    program: 'Texas', median: 5.8, vsAvg: -0.7, trend: 'improving' as const,
    topContractor: 'Lone Star Electric', contractorCycle: '4.9d', reliability: '92%',
    bottomContractor: null, bottomCycle: null, bottomReliability: null,
  },
  {
    program: 'California', median: 7.2, vsAvg: 0.7, trend: 'worsening' as const,
    topContractor: 'Pacific Systems', contractorCycle: '5.8d', reliability: '86%',
    bottomContractor: 'Bay Area Contractors', bottomCycle: '9.1d', bottomReliability: '74%',
  },
  {
    program: 'Florida', median: 6.4, vsAvg: -0.1, trend: 'flat' as const,
    topContractor: 'Sunshine Electric', contractorCycle: '5.6d', reliability: '88%',
    bottomContractor: 'Gulf Coast Services', bottomCycle: '7.8d', bottomReliability: '78%',
  },
  {
    program: 'New York', median: 6.8, vsAvg: 0.3, trend: 'improving' as const,
    topContractor: 'Empire State Power', contractorCycle: '5.4d', reliability: '90%',
    bottomContractor: null, bottomCycle: null, bottomReliability: null,
  },
]

// KPI data by time range and process
const kpiDataByRange: Record<string, Record<string, { avgCycle: number; improvement: number; topBottleneck: string; bottleneckPct: number; throughput: number }>> = {
  '4w': {
    'All': { avgCycle: 5.4, improvement: -18, topBottleneck: 'Legal Review', bottleneckPct: 38, throughput: 76 },
    'Contractor Onboarding': { avgCycle: 5.2, improvement: -22, topBottleneck: 'Legal Review', bottleneckPct: 42, throughput: 18 },
    'RFI Response': { avgCycle: 2.9, improvement: -8, topBottleneck: 'Technical Review', bottleneckPct: 45, throughput: 24 },
    'Change Order': { avgCycle: 5.0, improvement: -5, topBottleneck: 'Cost Analysis', bottleneckPct: 38, throughput: 12 },
    'Invoice Reconciliation': { avgCycle: 2.9, improvement: -12, topBottleneck: 'Verification', bottleneckPct: 40, throughput: 14 },
    'Permit Application': { avgCycle: 11.5, improvement: -6, topBottleneck: 'Agency Review', bottleneckPct: 45, throughput: 8 },
  },
  '13w': {
    'All': { avgCycle: 6.2, improvement: -36, topBottleneck: 'Legal Review', bottleneckPct: 42, throughput: 247 },
    'Contractor Onboarding': { avgCycle: 7.1, improvement: -36, topBottleneck: 'Legal Review', bottleneckPct: 42, throughput: 58 },
    'RFI Response': { avgCycle: 2.9, improvement: -14, topBottleneck: 'Technical Review', bottleneckPct: 45, throughput: 82 },
    'Change Order': { avgCycle: 5.0, improvement: -8, topBottleneck: 'Cost Analysis', bottleneckPct: 38, throughput: 36 },
    'Invoice Reconciliation': { avgCycle: 3.0, improvement: -18, topBottleneck: 'Verification', bottleneckPct: 40, throughput: 45 },
    'Permit Application': { avgCycle: 12.2, improvement: -10, topBottleneck: 'Agency Review', bottleneckPct: 45, throughput: 26 },
  },
  '52w': {
    'All': { avgCycle: 7.8, improvement: -42, topBottleneck: 'Legal Review', bottleneckPct: 44, throughput: 892 },
    'Contractor Onboarding': { avgCycle: 8.4, improvement: -48, topBottleneck: 'Legal Review', bottleneckPct: 44, throughput: 198 },
    'RFI Response': { avgCycle: 3.2, improvement: -22, topBottleneck: 'Technical Review', bottleneckPct: 46, throughput: 312 },
    'Change Order': { avgCycle: 5.4, improvement: -15, topBottleneck: 'Cost Analysis', bottleneckPct: 40, throughput: 124 },
    'Invoice Reconciliation': { avgCycle: 3.4, improvement: -28, topBottleneck: 'Verification', bottleneckPct: 42, throughput: 156 },
    'Permit Application': { avgCycle: 13.1, improvement: -18, topBottleneck: 'Agency Review', bottleneckPct: 48, throughput: 102 },
  },
}

const programComparison = [
  {
    program: 'Southeast', median: 5.2, vsAvg: -1.3, trend: 'improving' as const,
    topContractor: 'Metro Electrical', contractorCycle: '4.8d', reliability: '94%',
    bottomContractor: null, bottomCycle: null, bottomReliability: null,
  },
  {
    program: 'Central', median: 7.8, vsAvg: 1.3, trend: 'worsening' as const,
    topContractor: 'Apex Construction', contractorCycle: '6.2d', reliability: '88%',
    bottomContractor: 'Midwest Mechanical', bottomCycle: '9.4d', bottomReliability: '72%',
  },
  {
    program: 'West', median: 6.1, vsAvg: -0.4, trend: 'flat' as const,
    topContractor: 'Pacific Rim Electric', contractorCycle: '5.8d', reliability: '82%',
    bottomContractor: 'Acme Electrical', bottomCycle: '8.1d', bottomReliability: '76%',
  },
  {
    program: 'Northeast', median: 5.8, vsAvg: -0.7, trend: 'improving' as const,
    topContractor: 'East Coast Systems', contractorCycle: '5.2d', reliability: '91%',
    bottomContractor: null, bottomCycle: null, bottomReliability: null,
  },
]

const processLines = [
  { key: 'onboarding', label: 'Contractor Onboarding', color: '#D4A04C', sla: 10 },
  { key: 'rfi', label: 'RFI Response', color: '#2B8A8A', sla: 3 },
  { key: 'changeOrder', label: 'Change Order', color: '#DC2626', sla: 5 },
  { key: 'invoice', label: 'Invoice Reconciliation', color: '#16A34A', sla: 5 },
  { key: 'permit', label: 'Permit Application', color: '#94A3B8', sla: 15 },
] as const

const trendIcons = { improving: TrendingDown, worsening: TrendingUp, flat: Minus }
const trendColors = { improving: 'text-green', worsening: 'text-red', flat: 'text-muted-foreground' }
const trendLabels = { improving: 'Improving', worsening: 'Worsening', flat: 'Flat' }

/* ── SVG Line Chart ── */
function CycleTimeChart({ data, lines, agentEventWeek }: {
  data: typeof cycleTimeWeekly52w
  lines: ReadonlyArray<typeof processLines[number]>
  agentEventWeek: string
}) {
  const W = 800
  const H = 200
  const padL = 40
  const padR = 16
  const padT = 12
  const padB = 28
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  const allVals = data.flatMap((d) => lines.map((l) => (d as Record<string, number | string>)[l.key] as number))
  const maxVal = Math.max(...allVals) * 1.1
  const minVal = 0

  const xScale = (i: number) => padL + (i / (data.length - 1)) * chartW
  const yScale = (v: number) => padT + (1 - (v - minVal) / (maxVal - minVal)) * chartH

  const agentIdx = data.findIndex((d) => d.week === agentEventWeek)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'clamp(180px, 30vw, 240px)' }} preserveAspectRatio="xMidYMid meet">
      {/* Y-axis grid */}
      {[0, 3, 6, 9, 12, 15].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yScale(v)} x2={W - padR} y2={yScale(v)} stroke="var(--line)" strokeWidth={0.5} strokeDasharray="4 4" />
          <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" className="fill-muted-foreground text-[9px] font-mono">{v}d</text>
        </g>
      ))}

      {/* Lines */}
      {lines.map((line, lineIdx) => {
        const points = data.map((d, i) => ({
          x: xScale(i),
          y: yScale((d as Record<string, number | string>)[line.key] as number),
        }))
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
        return (
          <g key={line.key}>
            <DrawPath d={path} stroke={line.color} strokeWidth={2} delay={0.2 + lineIdx * 0.15} duration={1.2} opacity={0.9} />
            <PopDot cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={3} fill={line.color} delay={1.2 + lineIdx * 0.15} />
          </g>
        )
      })}

      {/* Agent event annotation */}
      {agentIdx >= 0 && (
        <g>
          <line x1={xScale(agentIdx)} y1={padT} x2={xScale(agentIdx)} y2={padT + chartH} stroke="var(--teal)" strokeWidth={1} strokeDasharray="4 3" />
          <rect x={xScale(agentIdx) - 60} y={padT - 2} width={120} height={16} rx={4} fill="var(--teal)" opacity={0.15} />
          <text x={xScale(agentIdx)} y={padT + 9} textAnchor="middle" className="fill-teal text-[8px] font-mono font-semibold">A-104 deployed</text>
        </g>
      )}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text key={d.week} x={xScale(i)} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">
          {d.week}
        </text>
      ))}
    </svg>
  )
}

export default function ThroughputPage() {
  const [processFilter, setProcessFilter] = React.useState<string>('All')
  const [timeRange, setTimeRange] = React.useState<string>('4w')
  const [grouping, setGrouping] = React.useState<string>('Program')
  const [expandedProgram, setExpandedProgram] = React.useState<string | null>(null)

  // Get chart data based on time range
  const chartData = React.useMemo(() => {
    switch (timeRange) {
      case '4w': return cycleTimeWeekly4w
      case '52w': return cycleTimeWeekly52w
      default: return cycleTimeWeekly13w
    }
  }, [timeRange])

  // Get visible process lines based on filter
  const visibleLines = React.useMemo(() => {
    if (processFilter === 'All') return processLines
    const lineKey = {
      'Contractor Onboarding': 'onboarding',
      'RFI Response': 'rfi',
      'Change Order': 'changeOrder',
      'Invoice Reconciliation': 'invoice',
      'Permit Application': 'permit',
    }[processFilter]
    return processLines.filter(l => l.key === lineKey)
  }, [processFilter])

  // Get KPI data based on filters
  const currentKPIs = React.useMemo(() => {
    return kpiDataByRange[timeRange]?.[processFilter] || kpiDataByRange['13w']['All']
  }, [timeRange, processFilter])

  // Get stage bottlenecks based on process filter
  const currentBottlenecks: StageBottleneck[] = React.useMemo(() => {
    return stageBottlenecksByProcess[processFilter] ?? stageBottlenecksByProcess['All'] ?? []
  }, [processFilter])

  // Get comparison data based on grouping
  const comparisonData = React.useMemo(() => {
    return grouping === 'Program' ? programComparison : regionComparison
  }, [grouping])

  const portfolioAvg = comparisonData.reduce((s, p) => s + p.median, 0) / comparisonData.length

  return (
    <AppShell title="Throughput & Cycle Time" subtitle="Process improvement metrics" activeHref="/throughput">
      <div className="space-y-6 w-full">

        {/* ── Filter Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-card rounded-xl border border-line">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Process</span>
            <div className="relative">
              <select
                value={processFilter}
                onChange={(e) => setProcessFilter(e.target.value)}
                className="h-8 pl-3 pr-8 text-xs border border-line rounded-lg bg-secondary/50 text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold"
              >
                {processTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="h-6 w-px bg-line hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Range</span>
            <div className="flex gap-1">
              {timeRanges.map((r) => (
                <button key={r} onClick={() => setTimeRange(r)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    timeRange === r ? 'bg-gold text-navy' : 'bg-secondary text-muted-foreground hover:bg-secondary/80')}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-line hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Group by</span>
            <div className="flex gap-1">
              {groupings.map((g) => (
                <button key={g} onClick={() => setGrouping(g)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    grouping === g ? 'bg-gold text-navy' : 'bg-secondary text-muted-foreground hover:bg-secondary/80')}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-mono text-muted-foreground">Process Model v3.1 -- active since W12</span>
          </div>
        </div>

        {/* ── Summary KPIs - Professional Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FadeUp delay={0} key={`kpi-avg-${timeRange}-${processFilter}`}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Activity className="w-4.5 h-4.5 text-gold" />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {processFilter === 'All' ? 'Portfolio Avg Cycle' : 'Avg Cycle Time'}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight"><AnimNum value={`${currentKPIs.avgCycle.toFixed(1)}d`} delay={200} /></p>
              <p className="text-xs text-muted-foreground mt-1">
                {processFilter === 'All' ? 'Across all process types' : processFilter}
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.06} key={`kpi-imp-${timeRange}-${processFilter}`}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-green/10 flex items-center justify-center">
                    <TrendingDown className="w-4.5 h-4.5 text-green" />
                  </div>
                  <span className="text-[11px] font-semibold text-green uppercase tracking-wider">
                    {processFilter === 'All' ? 'Onboarding Improved' : 'Cycle Improved'}
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold text-green font-mono tracking-tight"><AnimNum value={`${currentKPIs.improvement}%`} delay={280} /></p>
              <p className="text-xs text-muted-foreground mt-1">Since A-104 deployment (W10)</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.12} key={`kpi-bottleneck-${timeRange}-${processFilter}`}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-red/10 flex items-center justify-center">
                  <Clock className="w-4.5 h-4.5 text-red" />
                </div>
                <span className="text-[11px] font-semibold text-red uppercase tracking-wider">Top Bottleneck</span>
              </div>
              <p className="text-xl font-bold text-red">{currentKPIs.topBottleneck}</p>
              <p className="text-xs text-muted-foreground mt-1">{currentKPIs.bottleneckPct}% of {processFilter === 'All' ? 'onboarding' : 'process'} cycle time</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.18} key={`kpi-throughput-${timeRange}-${processFilter}`}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Throughput</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight"><AnimNum value={currentKPIs.throughput.toString()} delay={440} /></p>
              <p className="text-xs text-muted-foreground mt-1">Processes completed ({timeRange})</p>
            </div>
          </FadeUp>
        </div>

        {/* ── Cycle Time Trend Chart - Professional styling ── */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-sm)] overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Cycle Time Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Median days per process type - {timeRange === '4w' ? '4-week' : timeRange === '52w' ? '52-week' : '13-week'} view
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {visibleLines.map((line) => (
                <div key={line.key} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
                  <span className="text-xs text-muted-foreground font-medium">{line.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto -mx-2 px-2">
            <div className="min-w-[600px]">
              <CycleTimeChart data={chartData} lines={visibleLines} agentEventWeek="W10" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-teal/5 border border-teal/15">
            <div className="w-8 h-8 rounded-lg bg-teal/15 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-teal" />
            </div>
            <p className="text-xs text-foreground/80">
              <span className="font-semibold text-teal">A-104 Impact:</span> Agent deployed W10. Contractor Onboarding median cycle dropped from 9.2d to 5.2d (-43%). Auto-doc-chase and pre-validation reduced Legal Review wait from 6.1d to 3.2d.
            </p>
          </div>
        </div>

        {/* ── Stage Bottleneck Analysis - Professional Pipeline Style ── */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Stage Bottleneck Analysis</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {processFilter === 'All' ? 'Contractor Onboarding' : processFilter} - % of total cycle time per stage
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg">
              <Layers className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                Total median: {currentBottlenecks.reduce((s, b) => s + b.days, 0).toFixed(1)} days
              </span>
            </div>
          </div>

          {/* Pipeline Progress Bars */}
          <div className="space-y-3 mb-5">
            {currentBottlenecks.map((stage, idx) => (
              <div key={stage.stage} className="grid grid-cols-[140px_1fr] items-center gap-4">
                <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                <div className="h-7 bg-muted/10 rounded-full overflow-hidden relative">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <GrowSegment
                          widthPct={stage.pct}
                          delay={0.3 + idx * 0.1}
                          className={cn(
                            'h-full rounded-full flex items-center justify-end pr-3 cursor-pointer',
                            'bg-gradient-to-r transition-all duration-300 hover:brightness-125',
                            stage.gradient,
                            stage.glow
                          )}
                        >
                          <span className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                            {stage.pct}%
                          </span>
                        </GrowSegment>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs font-semibold">{stage.stage}</p>
                        <p className="text-xs opacity-70">{stage.pct}% of cycle time - {stage.days}d median</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-5 pt-4 border-t border-border">
            {currentBottlenecks.map((stage) => (
              <div key={stage.stage} className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full bg-gradient-to-r', stage.gradient)} />
                <span className="text-xs text-muted-foreground font-medium">{stage.stage}: {stage.days}d</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Program/Region Comparison Table ── */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          <div className="px-6 py-5 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-sans text-base font-semibold text-foreground">{grouping} Comparison</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Median cycle time by {grouping.toLowerCase()} with contractor intelligence</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-teal/30 text-teal w-fit">
              <Building2 className="w-3 h-3 mr-1" />Party Intelligence enriched
            </Badge>
          </div>

          {/* Table header - Equal columns spanning full width */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-0 bg-muted/30 dark:bg-navy-mid/30 border-b border-line text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            <div className="px-6 py-3">{grouping}</div>
            <div className="px-4 py-3">Median Cycle</div>
            <div className="px-4 py-3">vs Portfolio</div>
            <div className="px-4 py-3">Trend</div>
            <div className="px-4 py-3">Contractor Drivers</div>
          </div>

          <div className="divide-y divide-line">
            {comparisonData.map((prog) => {
              const TIcon = trendIcons[prog.trend]
              const isExpanded = expandedProgram === prog.program
              return (
                <div key={prog.program}>
                  <button
                    onClick={() => setExpandedProgram(isExpanded ? null : prog.program)}
                    className="w-full grid grid-cols-1 lg:grid-cols-5 gap-0 items-center text-left hover:bg-secondary/30 transition-colors group"
                  >
                    {/* Program Name */}
                    <div className="px-6 py-4">
                      <span className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors">{prog.program}</span>
                    </div>

                    {/* Median Cycle */}
                    <div className="px-4 py-4">
                      <span className="text-[10px] text-muted-foreground lg:hidden">Median: </span>
                      <span className="text-sm font-mono font-bold text-foreground">{prog.median}d</span>
                    </div>

                    {/* vs Portfolio */}
                    <div className="px-4 py-4">
                      <span className="text-[10px] text-muted-foreground lg:hidden">vs Avg: </span>
                      <span className={cn(
                        'text-sm font-mono font-semibold',
                        prog.vsAvg < 0 ? 'text-green' : prog.vsAvg > 0 ? 'text-red' : 'text-muted-foreground'
                      )}>
                        {prog.vsAvg > 0 ? '+' : ''}{prog.vsAvg}d
                      </span>
                    </div>

                    {/* Trend */}
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <TIcon className={cn('w-4 h-4', trendColors[prog.trend])} />
                        <span className={cn('text-sm capitalize', trendColors[prog.trend])}>{trendLabels[prog.trend]}</span>
                      </div>
                    </div>

                    {/* Contractor Drivers */}
                    <div className="px-4 py-4 hidden lg:block">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Best: <span className="font-semibold text-foreground">{prog.topContractor}</span> ({prog.contractorCycle})</span>
                        {prog.bottomContractor && (
                          <span className="text-red">Lagging: <span className="font-semibold">{prog.bottomContractor}</span> ({prog.bottomCycle})</span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded contractor detail */}
                  {isExpanded && (
                    <div className="px-5 pb-4 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-0 lg:ml-4">
                        {/* Best performer */}
                        <div className="p-3 rounded-lg bg-green/5 border border-green/10">
                          <p className="text-[10px] uppercase tracking-wider text-green font-semibold mb-1.5">Top Performer</p>
                          <p className="text-sm font-semibold text-foreground">{prog.topContractor}</p>
                          <div className="flex gap-4 mt-2">
                            <div>
                              <span className="text-[10px] text-muted-foreground">Avg Cycle</span>
                              <p className="text-sm font-mono font-semibold text-green">{prog.contractorCycle}</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground">Reliability</span>
                              <p className="text-sm font-mono font-semibold text-green">{prog.reliability}</p>
                            </div>
                          </div>
                        </div>

                        {/* Worst performer */}
                        {prog.bottomContractor ? (
                          <div className="p-3 rounded-lg bg-red/5 border border-red/10">
                            <p className="text-[10px] uppercase tracking-wider text-red font-semibold mb-1.5">Driving Delays</p>
                            <p className="text-sm font-semibold text-foreground">{prog.bottomContractor}</p>
                            <div className="flex gap-4 mt-2">
                              <div>
                                <span className="text-[10px] text-muted-foreground">Avg Cycle</span>
                                <p className="text-sm font-mono font-semibold text-red">{prog.bottomCycle}</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground">Reliability</span>
                                <p className="text-sm font-mono font-semibold text-red">{prog.bottomReliability}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-lg bg-secondary/30 border border-line flex items-center justify-center">
                            <p className="text-xs text-muted-foreground">No underperformers detected</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
