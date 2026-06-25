'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import {
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertCircle,
  Circle,
  ChevronRight,
  FileDown,
  Info,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AnimNum, FadeUp, DrawPath } from '@/components/animated-primitives'

type BuildMode = 'Concurrent' | 'In transition' | 'Phased'
type RegionFilter = 'All' | 'APAC' | 'EMEA' | 'NA-East' | 'NA-West'
type StatusFilter = 'All' | 'Concurrent' | 'In transition' | 'Still phased'

interface Project {
  id: string
  region: 'APAC' | 'EMEA' | 'NA-E' | 'NA-W'
  buildMode: BuildMode
  approvedPlan: number
  concurrentPlan: number | null
  lifecycleSaving: number | null
  cashflowFrontLoad: number | null
  mobilisationCount: string
  status: string
}

const projects: Project[] = [
  { id: 'KAY-Hub1-1&2&3', region: 'APAC', buildMode: 'Concurrent', approvedPlan: 45, concurrentPlan: 58, lifecycleSaving: 8.2, cashflowFrontLoad: 13, mobilisationCount: '1 (was 3)', status: 'Approved Q1 2026' },
  { id: 'GBL-Hub2-1&2&3', region: 'EMEA', buildMode: 'Concurrent', approvedPlan: 52, concurrentPlan: 67, lifecycleSaving: 9.5, cashflowFrontLoad: 15, mobilisationCount: '1 (was 3)', status: 'Approved Q1 2026' },
  { id: 'CRN-Hub1-1&2&3', region: 'APAC', buildMode: 'Concurrent', approvedPlan: 48, concurrentPlan: 62, lifecycleSaving: 8.8, cashflowFrontLoad: 14, mobilisationCount: '1 (was 3)', status: 'Approved Q1 2026' },
  { id: 'PYB-Hub1-1&2&3', region: 'NA-E', buildMode: 'Concurrent', approvedPlan: 38, concurrentPlan: 49, lifecycleSaving: 7.0, cashflowFrontLoad: 11, mobilisationCount: '1 (was 3)', status: 'Approved Q1 2026' },
  { id: 'UWD-Hub1-1&2&3', region: 'NA-W', buildMode: 'In transition', approvedPlan: 42, concurrentPlan: 54, lifecycleSaving: 7.7, cashflowFrontLoad: 12, mobilisationCount: '1 (target)', status: 'Pending leadership approval' },
  { id: 'NCH-Hub1-1', region: 'NA-W', buildMode: 'Phased', approvedPlan: 51, concurrentPlan: null, lifecycleSaving: null, cashflowFrontLoad: null, mobilisationCount: '3 (current)', status: 'Not eligible (variant POR)' },
  { id: 'HJS-Hub1-1', region: 'NA-W', buildMode: 'Phased', approvedPlan: 33, concurrentPlan: null, lifecycleSaving: null, cashflowFrontLoad: null, mobilisationCount: '3 (current)', status: 'Variant POR development' },
  { id: 'SGR-Hub1-2&3', region: 'NA-E', buildMode: 'Phased', approvedPlan: 14, concurrentPlan: null, lifecycleSaving: null, cashflowFrontLoad: null, mobilisationCount: '2 (current)', status: 'Permitting constraints' },
  { id: 'LKC-Hub1-1&2&3', region: 'NA-E', buildMode: 'Concurrent', approvedPlan: 104, concurrentPlan: 135, lifecycleSaving: 19.0, cashflowFrontLoad: 31, mobilisationCount: '1 (was 3)', status: 'Approved Q1 2026' },
  { id: 'TXA-Hub1-1&2&3', region: 'NA-E', buildMode: 'Concurrent', approvedPlan: 104, concurrentPlan: 135, lifecycleSaving: 19.0, cashflowFrontLoad: 31, mobilisationCount: '1 (was 3)', status: 'Approved Q1 2026' },
  { id: 'PZY-Hub1-1&2&3', region: 'NA-W', buildMode: 'In transition', approvedPlan: 36, concurrentPlan: 46, lifecycleSaving: 6.6, cashflowFrontLoad: 10, mobilisationCount: '1 (target)', status: 'Pending leadership approval' },
  { id: 'OGO-Hub1-1&2&3', region: 'NA-W', buildMode: 'In transition', approvedPlan: 44, concurrentPlan: 57, lifecycleSaving: 8.1, cashflowFrontLoad: 13, mobilisationCount: '1 (target)', status: 'Pending leadership approval' },
]

// Cashflow chart data — 36 months cumulative ($M)
const cashflowMonths = Array.from({ length: 37 }, (_, i) => i)
const phasedCurve = [0, 0, 0, 10, 20, 40, 40, 50, 70, 90, 90, 110, 130, 150, 170, 190, 210, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 435, 445, 455, 462, 468, 472, 476, 478, 480]
const concurrentCurve = [0, 25, 60, 95, 120, 150, 180, 205, 230, 255, 280, 300, 320, 340, 360, 375, 390, 400, 410, 420, 430, 438, 445, 450, 455, 460, 464, 467, 470, 472, 474, 476, 477, 478, 479, 479.5, 480]

const regionMap: Record<Project['region'], RegionFilter> = {
  'APAC': 'APAC',
  'EMEA': 'EMEA',
  'NA-E': 'NA-East',
  'NA-W': 'NA-West',
}

const buildModePill = (mode: BuildMode) => {
  switch (mode) {
    case 'Concurrent':
      return 'bg-green/15 text-green border-green/30'
    case 'In transition':
      return 'bg-amber/15 text-amber border-amber/30'
    case 'Phased':
      return 'bg-muted text-muted-foreground border-line'
  }
}

const buildModeIcon = (mode: BuildMode) => {
  switch (mode) {
    case 'Concurrent':
      return <CheckCircle2 className="w-3 h-3" />
    case 'In transition':
      return <AlertCircle className="w-3 h-3" />
    case 'Phased':
      return <Circle className="w-3 h-3" />
  }
}

export default function ConcurrentHubBuildPage() {
  const router = useRouter()
  const [region, setRegion] = React.useState<RegionFilter>('All')
  const [status, setStatus] = React.useState<StatusFilter>('All')
  const [hoverMonth, setHoverMonth] = React.useState<number | null>(null)

  const filtered = projects
    .filter((p) => region === 'All' || regionMap[p.region] === region)
    .filter((p) => {
      if (status === 'All') return true
      if (status === 'Still phased') return p.buildMode === 'Phased'
      return p.buildMode === status
    })

  // Aggregate KPIs (use full set, not filtered, so KPIs reflect strategic position)
  const concurrentCount = projects.filter((p) => p.buildMode === 'Concurrent').length
  const phasedCount = projects.filter((p) => p.buildMode === 'Phased').length
  const totalLifecycleSaving = projects.reduce((s, p) => s + (p.lifecycleSaving ?? 0), 0)
  const realisedYTD = 14.2
  const forecastTotal = 40
  const realisedPct = Math.round((realisedYTD / forecastTotal) * 100)

  // Cashflow chart geometry
  const chartW = 880
  const chartH = 240
  const padL = 48
  const padR = 24
  const padT = 20
  const padB = 36
  const innerW = chartW - padL - padR
  const innerH = chartH - padT - padB
  const maxY = 500
  const xFor = (m: number) => padL + (m / 36) * innerW
  const yFor = (v: number) => padT + (1 - v / maxY) * innerH

  const phasedPath = phasedCurve.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`).join(' ')
  const concurrentPath = concurrentCurve.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`).join(' ')
  // Shaded area between curves (concurrent above phased)
  const areaPath = [
    ...concurrentCurve.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`),
    ...phasedCurve.map((v, i) => `L ${xFor(36 - i)} ${yFor(phasedCurve[36 - i])}`),
    'Z',
  ].join(' ')

  const handleExport = () => {
    // Stub: in production this would generate a PDF
    alert('Generating one-page board summary: KPIs + Cashflow Timing + Strategic Context...')
  }

  return (
    <AppShell title="Concurrent Hub Build" subtitle="Strategic shift tracker · Approved Q1 2026" activeHref="/concurrent-hub">
      <motion.div 
        className="p-6 space-y-5 max-w-[1440px] mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
          }
        }}
      >
        {/* Header filters */}
        <FadeUp delay={0}>
          <div className="bg-card rounded-xl border border-line p-4 flex flex-wrap items-center gap-3">
            {/* Region filter */}
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            {(['All', 'APAC', 'EMEA', 'NA-East', 'NA-West'] as RegionFilter[]).map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 h-7 text-xs rounded-md font-medium transition-colors ${
                  region === r ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-line" />

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            {(['All', 'Concurrent', 'In transition', 'Still phased'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 h-7 text-xs rounded-md font-medium transition-colors ${
                  status === s ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Live · daily
            </div>
            <button
              onClick={handleExport}
              className="h-8 px-3 text-xs font-medium border border-line rounded-lg hover:bg-secondary/50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button className="h-8 px-3 text-xs font-medium border border-line rounded-lg hover:bg-secondary/50 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
          </div>
        </FadeUp>

        {/* REGION 1 — KPI strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 — Concurrent projects */}
          <div className="bg-card rounded-xl border border-line p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green" />
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Concurrent projects</p>
              <Building2 className="w-4 h-4 text-green" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-foreground">{concurrentCount}</span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-green">
                <TrendingUp className="w-3 h-3" /> 5
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">vs prior cycle</p>
          </div>

          {/* Card 2 — Still phased */}
          <div className="bg-card rounded-xl border border-line p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber" />
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Still phased</p>
              <Layers className="w-4 h-4 text-amber" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-foreground">{phasedCount}</span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-green">
                <TrendingDown className="w-3 h-3" /> 5
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">remaining migration candidates</p>
          </div>

          {/* Card 3 — Estimated annual saving */}
          <div className="bg-card rounded-xl border border-line p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" />
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Estimated annual saving</p>
              <DollarSign className="w-4 h-4 text-gold" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-foreground">$40M</span>
              <span className="text-xs font-medium text-muted-foreground">—</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">on known pipeline · Mar 19 working session</p>
          </div>

          {/* Card 4 — Realised saving YTD */}
          <div className="bg-card rounded-xl border border-line p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green" />
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Realised saving YTD</p>
              <DollarSign className="w-4 h-4 text-green" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-foreground">${realisedYTD}M</span>
              <span className="text-xs font-medium text-green">{realisedPct}%</span>
            </div>
            <div className="mt-2 h-1 bg-secondary/50 rounded-full overflow-hidden">
              <div className="h-full bg-green rounded-full" style={{ width: `${realisedPct}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">of forecast · tracking on plan</p>
          </div>
        </div>

        {/* REGION 2 — Project table */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Active Projects · Build Mode</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{filtered.length} of {projects.length} projects</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 border-b border-line">
                  <th className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Project</th>
                  <th className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Region</th>
                  <th className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Build Mode</th>
                  <th className="text-right px-3 py-2.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Approved Plan</th>
                  <th className="text-right px-3 py-2.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Concurrent Plan</th>
                  <th className="text-right px-3 py-2.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Lifecycle Saving</th>
                  <th className="text-right px-3 py-2.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Cashflow Front-load</th>
                  <th className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Mobilisation</th>
                  <th className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Status</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/projects?focus=${encodeURIComponent(p.id)}&buildMode=${p.buildMode}`)}
                    className="border-b border-line/60 hover:bg-secondary/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{p.id}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded border border-line bg-secondary/50 text-muted-foreground">
                        {p.region}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded border ${buildModePill(p.buildMode)}`}>
                        {buildModeIcon(p.buildMode)}
                        {p.buildMode}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-foreground">${p.approvedPlan}M</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-foreground">
                      {p.concurrentPlan !== null ? `$${p.concurrentPlan}M` : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-xs">
                      {p.lifecycleSaving !== null ? <span className="text-green font-medium">${p.lifecycleSaving}M</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-xs">
                      {p.cashflowFrontLoad !== null ? <span className="text-foreground">+${p.cashflowFrontLoad}M</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{p.mobilisationCount}</td>
                    <td className="px-3 py-3 text-xs text-foreground">{p.status}</td>
                    <td className="px-2 py-3">
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* REGION 3 — Cashflow timing chart */}
        <div className="bg-card rounded-xl border border-line p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Cashflow Timing · Phased vs Concurrent</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Cumulative draw-down across 36 months</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-muted-foreground" style={{ borderTop: '1px dashed currentColor', background: 'transparent' }} />
                <span className="text-muted-foreground">Phased plan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-gold" />
                <span className="text-muted-foreground">Concurrent plan</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxWidth: chartW }}>
              {/* Y-axis grid */}
              {[0, 100, 200, 300, 400, 500].map((v) => (
                <g key={v}>
                  <line x1={padL} y1={yFor(v)} x2={chartW - padR} y2={yFor(v)} stroke="currentColor" className="text-line" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
                  <text x={padL - 8} y={yFor(v) + 3} textAnchor="end" className="text-[9px] fill-muted-foreground font-mono">${v}M</text>
                </g>
              ))}
              {/* X-axis labels */}
              {[0, 6, 12, 18, 24, 30, 36].map((m) => (
                <text key={m} x={xFor(m)} y={chartH - padB + 16} textAnchor="middle" className="text-[9px] fill-muted-foreground font-mono">M{m}</text>
              ))}

              {/* Shaded working-capital area */}
              <path d={areaPath} fill="currentColor" className="text-gold" opacity="0.08" />

              {/* Phased line (slate dashed) */}
              <path d={phasedPath} fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth="2" strokeDasharray="5 4" />

              {/* Concurrent line (gold solid) */}
              <path d={concurrentPath} fill="none" stroke="currentColor" className="text-gold" strokeWidth="2.5" />

              {/* Hover hit zones */}
              {cashflowMonths.map((m) => (
                <rect
                  key={m}
                  x={xFor(m) - innerW / 72}
                  y={padT}
                  width={innerW / 36}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setHoverMonth(m)}
                  onMouseLeave={() => setHoverMonth(null)}
                />
              ))}

              {/* Hover indicators */}
              {hoverMonth !== null && (
                <g>
                  <line x1={xFor(hoverMonth)} y1={padT} x2={xFor(hoverMonth)} y2={chartH - padB} stroke="currentColor" className="text-foreground" strokeWidth="1" opacity="0.3" />
                  <circle cx={xFor(hoverMonth)} cy={yFor(phasedCurve[hoverMonth])} r="4" fill="currentColor" className="text-muted-foreground" />
                  <circle cx={xFor(hoverMonth)} cy={yFor(concurrentCurve[hoverMonth])} r="4" fill="currentColor" className="text-gold" />
                </g>
              )}
            </svg>
          </div>

          {/* Tooltip readout */}
          {hoverMonth !== null && (
            <div className="mt-3 bg-secondary/40 border border-line rounded-lg px-3 py-2 inline-flex items-center gap-4 text-xs font-mono">
              <span className="text-muted-foreground">Month {hoverMonth}</span>
              <span className="text-muted-foreground">Phased: <span className="text-foreground">${phasedCurve[hoverMonth].toFixed(0)}M</span></span>
              <span className="text-muted-foreground">Concurrent: <span className="text-gold">${concurrentCurve[hoverMonth].toFixed(0)}M</span></span>
              <span className="text-muted-foreground">Δ: <span className="text-foreground">{(concurrentCurve[hoverMonth] - phasedCurve[hoverMonth]) >= 0 ? '+' : ''}${(concurrentCurve[hoverMonth] - phasedCurve[hoverMonth]).toFixed(0)}M</span></span>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed border-l-2 border-gold/40 pl-3">
            Concurrent strategy front-loads <span className="text-foreground font-medium">$80M</span> of cashflow in months 1-12, for a total lifecycle saving of <span className="text-green font-medium">$40M</span> over 36 months.
            Total lifecycle saving across active concurrent projects: <span className="text-green font-medium">${totalLifecycleSaving.toFixed(1)}M</span>.
          </p>
        </div>

        {/* REGION 4 — Strategic context panel */}
        <div className="bg-card rounded-xl border border-line p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Why Concurrent? · Strategic context for board materials</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Approved by Senior Leadership Q1 2026 · Mar 19 working session</p>
            </div>
            <button
              onClick={handleExport}
              className="h-8 px-3 text-xs font-medium bg-gold text-navy hover:bg-gold/90 rounded-lg flex items-center gap-1.5 shrink-0"
            >
              <FileDown className="w-3.5 h-3.5" />
              Export to board pack
            </button>
          </div>

          <ul className="space-y-2.5">
            {[
              { label: 'Eliminates GC re-mobilisation cost', value: 'saves ~$2.5M per phase per project' },
              { label: 'Eliminates re-bidding cycle', value: 'saves ~30 days per project' },
              { label: 'Eliminates phase-funding re-review cycle', value: 'saves ~6 weeks per phase' },
              { label: 'Reflects committed AI workload growth', value: 'capacity certainty justifies up-front build' },
              { label: 'Approved by Senior Leadership Q1 2026', value: 'presented at the Mar 19 working session' },
            ].map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-green shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{b.label}</span>
                <span className="text-muted-foreground">— {b.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </AppShell>
  )
}
