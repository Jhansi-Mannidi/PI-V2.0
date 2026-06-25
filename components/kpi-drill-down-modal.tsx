'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TrendingUp, TrendingDown, Minus, Download, X, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// KPI configuration for different metrics
const kpiConfigs: Record<string, {
  name: string
  fullName: string
  unit: string
  definition: string
  version: string
  asOf: string
  weeklyData: { week: string; value: number; annotation?: string }[]
  contributors: { project: string; current: number; delta: number; impact: number }[]
}> = {
  'Portfolio CPI': {
    name: 'Portfolio CPI',
    fullName: 'Cost Performance Index',
    unit: '',
    definition: 'Ratio of earned value to actual cost, aggregated across all active projects. Values below 1.0 indicate cost overrun.',
    version: '2.1',
    asOf: '2026-04-27 06:00 UTC',
    weeklyData: [
      { week: 'W6', value: 0.99 },
      { week: 'W7', value: 0.98 },
      { week: 'W8', value: 0.98 },
      { week: 'W9', value: 0.97 },
      { week: 'W10', value: 0.97 },
      { week: 'W11', value: 0.96 },
      { week: 'W12', value: 0.96 },
      { week: 'W13', value: 0.96 },
      { week: 'W14', value: 0.95 },
      { week: 'W15', value: 0.95 },
      { week: 'W16', value: 0.95, annotation: 'Henderson CO surge' },
      { week: 'W17', value: 0.94 },
      { week: 'W18', value: 0.94 },
    ],
    contributors: [
      { project: 'Henderson Substation', current: 0.83, delta: -0.03, impact: 35 },
      { project: 'Pryor Creek New Build', current: 0.87, delta: -0.02, impact: 28 },
      { project: 'Mesa Power Upgrade', current: 0.91, delta: -0.01, impact: 12 },
      { project: 'Dallas Cooling Tower P6', current: 0.94, delta: -0.01, impact: 10 },
      { project: 'Phoenix Solar Integration', current: 0.98, delta: 0.00, impact: 8 },
      { project: 'Council Bluffs Phase 4', current: 1.01, delta: +0.01, impact: 7 },
    ],
  },
  'Portfolio SPI': {
    name: 'Portfolio SPI',
    fullName: 'Schedule Performance Index',
    unit: '',
    definition: 'Ratio of earned value to planned value, aggregated across all active projects. Values below 1.0 indicate schedule delay.',
    version: '2.1',
    asOf: '2026-04-27 06:00 UTC',
    weeklyData: [
      { week: 'W6', value: 0.95 },
      { week: 'W7', value: 0.94 },
      { week: 'W8', value: 0.94 },
      { week: 'W9', value: 0.93 },
      { week: 'W10', value: 0.93 },
      { week: 'W11', value: 0.92 },
      { week: 'W12', value: 0.91 },
      { week: 'W13', value: 0.91 },
      { week: 'W14', value: 0.90 },
      { week: 'W15', value: 0.90 },
      { week: 'W16', value: 0.89 },
      { week: 'W17', value: 0.89, annotation: 'Critical path slip' },
      { week: 'W18', value: 0.89 },
    ],
    contributors: [
      { project: 'Henderson Substation', current: 0.76, delta: -0.04, impact: 40 },
      { project: 'Pryor Creek New Build', current: 0.79, delta: -0.03, impact: 30 },
      { project: 'Mesa Power Upgrade', current: 0.88, delta: -0.01, impact: 12 },
      { project: 'Dallas Cooling Tower P6', current: 0.91, delta: -0.01, impact: 10 },
      { project: 'Council Bluffs Phase 4', current: 0.97, delta: 0.00, impact: 8 },
    ],
  },
  'EAC vs BAC': {
    name: 'EAC vs BAC',
    fullName: 'Estimate at Completion vs Budget at Completion',
    unit: '$M',
    definition: 'Variance between current estimate at completion and original budget. Positive values indicate over-budget projection.',
    version: '2.0',
    asOf: '2026-04-27 06:00 UTC',
    weeklyData: [
      { week: 'W6', value: 28 },
      { week: 'W7', value: 30 },
      { week: 'W8', value: 31 },
      { week: 'W9', value: 33 },
      { week: 'W10', value: 34 },
      { week: 'W11', value: 35 },
      { week: 'W12', value: 37 },
      { week: 'W13', value: 38, annotation: 'CO-0087 added' },
      { week: 'W14', value: 39 },
      { week: 'W15', value: 40 },
      { week: 'W16', value: 41 },
      { week: 'W17', value: 42 },
      { week: 'W18', value: 43 },
    ],
    contributors: [
      { project: 'Henderson Substation', current: 18, delta: 3, impact: 42 },
      { project: 'Pryor Creek New Build', current: 12, delta: 2, impact: 28 },
      { project: 'Mesa Power Upgrade', current: 7, delta: 1, impact: 16 },
      { project: 'Dallas Cooling Tower P6', current: 4, delta: 0.5, impact: 9 },
      { project: 'Phoenix Solar Integration', current: 2, delta: 0.3, impact: 5 },
    ],
  },
  'P1 Risks Open': {
    name: 'P1 Risks Open',
    fullName: 'Priority 1 Open Risks',
    unit: '',
    definition: 'Count of active P1 (critical) risks across the portfolio. These are risks with high probability and high impact requiring immediate attention.',
    version: '1.3',
    asOf: '2026-04-27 06:00 UTC',
    weeklyData: [
      { week: 'W6', value: 5 },
      { week: 'W7', value: 5 },
      { week: 'W8', value: 6 },
      { week: 'W9', value: 6 },
      { week: 'W10', value: 7 },
      { week: 'W11', value: 7 },
      { week: 'W12', value: 7 },
      { week: 'W13', value: 8 },
      { week: 'W14', value: 8 },
      { week: 'W15', value: 8 },
      { week: 'W16', value: 9, annotation: 'Contractor risks' },
      { week: 'W17', value: 9 },
      { week: 'W18', value: 9 },
    ],
    contributors: [
      { project: 'Henderson Substation', current: 5, delta: 1, impact: 56 },
      { project: 'Pryor Creek New Build', current: 3, delta: 1, impact: 33 },
      { project: 'Mesa Power Upgrade', current: 1, delta: 0, impact: 11 },
    ],
  },
  'Predicted SLA Risks (72h)': {
    name: 'Predicted SLA Risks (72h)',
    fullName: 'ML-Predicted SLA Risks',
    unit: '',
    definition: 'Machine learning predicted count of SLA risks expected in the next 72 hours. Based on historical patterns and current orchestration state.',
    version: '3.2',
    asOf: '2026-04-27 06:00 UTC',
    weeklyData: [
      { week: 'W6', value: 3 },
      { week: 'W7', value: 4 },
      { week: 'W8', value: 3 },
      { week: 'W9', value: 4 },
      { week: 'W10', value: 5 },
      { week: 'W11', value: 4 },
      { week: 'W12', value: 5 },
      { week: 'W13', value: 6 },
      { week: 'W14', value: 5 },
      { week: 'W15', value: 5 },
      { week: 'W16', value: 6 },
      { week: 'W17', value: 5 },
      { week: 'W18', value: 5 },
    ],
    contributors: [
      { project: 'Henderson Substation', current: 2, delta: 0, impact: 40 },
      { project: 'Pryor Creek New Build', current: 2, delta: 1, impact: 40 },
      { project: 'Mesa Power Upgrade', current: 1, delta: 0, impact: 20 },
    ],
  },
}

interface KPIDrillDownModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kpiLabel: string
}

export function KPIDrillDownModal({ open, onOpenChange, kpiLabel }: KPIDrillDownModalProps) {
  const config = kpiConfigs[kpiLabel] || kpiConfigs['Portfolio CPI']
  
  const handleExportCSV = () => {
    const headers = ['Project', 'Current Value', 'Delta', 'Impact Weight']
    const rows = config.contributors.map(c => [
      c.project,
      c.current.toString(),
      c.delta > 0 ? `+${c.delta}` : c.delta.toString(),
      `${c.impact}%`
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${kpiLabel.toLowerCase().replace(/\s+/g, '_')}_drill_down.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden bg-background border-line shadow-2xl" showCloseButton={false}>
        {/* Navy header */}
        <div className="bg-navy dark:bg-navy-light px-6 py-4 flex items-center justify-between">
          <DialogHeader className="gap-0">
            <DialogTitle className="font-sans text-lg font-bold text-white">
              {config.name} — 13-Week Trend
            </DialogTitle>
            <p className="text-[11px] text-slate-300 mt-0.5">{config.fullName}</p>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* 13-week trend chart */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Weekly Trend</h4>
            <TrendChart data={config.weeklyData} unit={config.unit} />
          </div>

          {/* Contributing projects table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contributing Projects</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportCSV}
                className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
              >
                <Download className="w-3 h-3 mr-1" />
                Export CSV
              </Button>
            </div>
            <div className="rounded-lg border border-line overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Project</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-right">Current</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-right">Delta</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-right">Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config.contributors.map((c, i) => (
                    <TableRow key={c.project} className={i === 0 ? 'bg-red/5 dark:bg-red/10' : ''}>
                      <TableCell className="font-medium text-sm">{c.project}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {config.unit === '$M' ? `$${c.current}M` : c.current.toFixed(2)}
                      </TableCell>
                      <TableCell className={cn(
                        'text-right font-mono text-sm font-semibold',
                        c.delta < 0 ? 'text-red' : c.delta > 0 ? (kpiLabel.includes('EAC') || kpiLabel.includes('Risk') ? 'text-red' : 'text-green') : 'text-muted-foreground'
                      )}>
                        <span className="inline-flex items-center gap-1">
                          {c.delta < 0 ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : c.delta > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          {c.delta > 0 ? '+' : ''}{config.unit === '$M' ? `$${c.delta}M` : c.delta.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full', c.impact > 30 ? 'bg-red' : c.impact > 15 ? 'bg-amber' : 'bg-green')}
                              style={{ width: `${c.impact}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono min-w-[32px] text-right">{c.impact}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Semantic metric definition */}
          <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 border border-line">
            <div className="flex items-start gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-teal shrink-0 mt-0.5 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[240px]">
                    <p className="text-xs">Semantic metric from certified data layer. Click for full lineage.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex-1">
                <p className="text-xs font-mono text-teal mb-1">kpi_earned_value.{config.name.toLowerCase().replace(/\s+/g, '_')}</p>
                <p className="text-sm text-foreground leading-relaxed">{config.definition}</p>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span>Certified by Portfolio Controls</span>
                  <span>Version: {config.version}</span>
                  <span>As-of: {config.asOf}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Trend chart component
function TrendChart({ data, unit }: { data: { week: string; value: number; annotation?: string }[]; unit: string }) {
  const values = data.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const padding = 24
  const width = 500
  const height = 120
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * chartWidth,
    y: padding + (1 - (d.value - min) / range) * chartHeight,
    ...d,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="bg-secondary/20 dark:bg-secondary/10 rounded-lg p-4 border border-line">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: '120px' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={padding}
            y1={padding + pct * chartHeight}
            x2={width - padding}
            y2={padding + pct * chartHeight}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeDasharray="4 4"
          />
        ))}

        {/* Trend line */}
        <path d={linePath} fill="none" stroke="var(--gold)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points and annotations */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 5 : 3}
              fill={i === points.length - 1 ? 'var(--gold)' : 'var(--background)'}
              stroke="var(--gold)"
              strokeWidth={2}
            />
            {/* Week labels for first, middle, last */}
            {(i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1) && (
              <text x={p.x} y={height - 4} textAnchor="middle" className="fill-muted-foreground text-[9px]">
                {p.week}
              </text>
            )}
            {/* Value label for current (last) point */}
            {i === points.length - 1 && (
              <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-gold text-[11px] font-mono font-bold">
                {unit === '$M' ? `+$${p.value}M` : p.value.toFixed(2)}
              </text>
            )}
            {/* Annotation */}
            {p.annotation && (
              <g>
                <line x1={p.x} y1={p.y + 6} x2={p.x} y2={p.y + 18} stroke="var(--amber)" strokeWidth={1} strokeDasharray="2 2" />
                <text x={p.x} y={p.y + 28} textAnchor="middle" className="fill-amber text-[8px]">
                  {p.annotation}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Y-axis labels */}
        <text x={padding - 4} y={padding + 4} textAnchor="end" className="fill-muted-foreground text-[9px] font-mono">
          {unit === '$M' ? `$${max}M` : max.toFixed(2)}
        </text>
        <text x={padding - 4} y={height - padding + 4} textAnchor="end" className="fill-muted-foreground text-[9px] font-mono">
          {unit === '$M' ? `$${min}M` : min.toFixed(2)}
        </text>
      </svg>
    </div>
  )
}
