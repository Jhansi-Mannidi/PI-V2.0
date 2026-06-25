'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingDown,
  FileText,
  ChevronRight,
  ExternalLink,
  Calendar,
  Users,
  AlertOctagon,
  Zap,
  Building2,
  Target,
  BarChart3,
  Info,
  History,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useActionModal } from '@/hooks/use-action-modal'

/* ── Project Data ── */
const projectData = {
  id: 'PRJ-002',
  name: 'Henderson Substation',
  program: 'Central',
  location: 'Henderson, NV',
  phase: 'Construction',
  completion: 39,
  agentsActive: 3,
}

/* ── KPI Data ── */
const kpis = [
  { label: 'CPI', value: '0.83', status: 'danger' as const, target: '1.00', delta: '-17%' },
  { label: 'SPI', value: '0.76', status: 'danger' as const, target: '1.00', delta: '-24%' },
  { label: 'EAC', value: '$96M', status: 'danger' as const, target: '$89M', delta: '+$7M' },
  { label: 'Contingency', value: '12%', status: 'warning' as const, target: '20%', delta: '8% used' },
]

const statusConfig = {
  danger: { color: 'text-red', bg: 'bg-red-bg', border: 'border-red/30' },
  warning: { color: 'text-amber', bg: 'bg-amber-bg', border: 'border-amber/30' },
  success: { color: 'text-green', bg: 'bg-green-bg', border: 'border-green/30' },
}

/* ── Orchestration Data ── */
const orchestrations = [
  {
    id: 'ORCH-4421',
    process: 'Invoice Reconciliation',
    stage: 'Three-Way Match',
    filler: 'Cost Engineer',
    status: 'SEVERE' as const,
    elapsed: '2d 4h',
    agent: 'A-104',
  },
  {
    id: 'ORCH-4433',
    process: 'Milestone Gate',
    stage: 'Director Approval',
    filler: 'Brian',
    status: 'BREACH' as const,
    elapsed: '1d 2h',
    agent: 'A-201',
  },
  {
    id: 'ORCH-4440',
    process: 'Change Order CO-0087',
    stage: 'Cost Review',
    filler: 'Cost Engineer',
    status: 'PRE-BREACH' as const,
    elapsed: '3h 40m',
    agent: 'A-104',
  },
  {
    id: 'ORCH-4445',
    process: 'Contractor Onboarding',
    stage: 'Badge/Site Access',
    filler: 'HR Compliance',
    status: 'ON TRACK' as const,
    elapsed: '1h 20m',
    agent: null,
  },
]

const orchStatusConfig = {
  'BREACH': { color: 'text-red', bg: 'bg-red-bg', border: 'border-red/30', dot: 'bg-red animate-pulse-dot' },
  'SEVERE': { color: 'text-red', bg: 'bg-red-bg', border: 'border-red/30', dot: 'bg-red' },
  'PRE-BREACH': { color: 'text-amber', bg: 'bg-amber-bg', border: 'border-amber/30', dot: 'bg-amber' },
  'ON TRACK': { color: 'text-green', bg: 'bg-green-bg', border: 'border-green/30', dot: 'bg-green' },
}

/* ── Party Intelligence Data ── */
const partyIntel = [
  {
    name: 'Acme Electrical',
    type: 'Primary Contractor',
    breachRate: 18,
    breachTrend: 'up' as const,
    reliability: 0.88,
    openItems: 4,
    status: 'at-risk' as const,
  },
  {
    name: 'Pacific Electrical',
    type: 'Subcontractor',
    breachRate: 4,
    breachTrend: 'down' as const,
    reliability: 0.96,
    openItems: 1,
    status: 'healthy' as const,
  },
]

/* ── Risks Data ── */
const risks = [
  { id: 'RSK-101', title: 'Cost escalation -- material price volatility', severity: 'P1', status: 'open', owner: 'Cost Lead', mitigations: 2 },
  { id: 'RSK-102', title: 'Schedule slip -- contractor performance', severity: 'P1', status: 'open', owner: 'PM', mitigations: 1 },
  { id: 'RSK-103', title: 'Key-person risk -- no backup for Legal Review', severity: 'P1', status: 'open', owner: 'HR Lead', mitigations: 0 },
  { id: 'RSK-104', title: 'Permit delay -- county review backlog', severity: 'P2', status: 'monitoring', owner: 'PM', mitigations: 1 },
  { id: 'RSK-105', title: 'Weather impact -- monsoon season', severity: 'P2', status: 'monitoring', owner: 'Site Lead', mitigations: 2 },
]

/* ── Milestones Data (for Timeline tab placeholder) ── */
const milestones = [
  { id: 'M-001', name: 'Site Mobilization', baseline: '2026-02-01', forecast: '2026-02-01', status: 'complete' as const, slip: 0 },
  { id: 'M-002', name: 'Foundation Complete', baseline: '2026-03-15', forecast: '2026-03-22', status: 'complete' as const, slip: 7 },
  { id: 'M-003', name: 'Structural Steel Complete', baseline: '2026-04-20', forecast: '2026-05-08', status: 'overdue' as const, slip: 18 },
  { id: 'M-004', name: 'Electrical Rough-in', baseline: '2026-05-15', forecast: '2026-06-02', status: 'at-risk' as const, slip: 18 },
  { id: 'M-005', name: 'Mechanical Systems', baseline: '2026-06-10', forecast: '2026-06-28', status: 'pending' as const, slip: 18 },
  { id: 'M-006', name: 'Commissioning', baseline: '2026-07-15', forecast: '2026-08-02', status: 'pending' as const, slip: 18 },
]

const milestoneStatusConfig = {
  complete: { color: 'text-green', bg: 'bg-green', label: 'Complete' },
  overdue: { color: 'text-red', bg: 'bg-red', label: 'Overdue' },
  'at-risk': { color: 'text-amber', bg: 'bg-amber', label: 'At Risk' },
  pending: { color: 'text-slate', bg: 'bg-slate', label: 'Pending' },
}

/* ── Cost Benchmark Data ── */
interface HistoricalProject {
  name: string
  year: number
  actualCost: string
  variance: string
  status: 'under' | 'over' | 'on-target'
}

interface CostBenchmark {
  costCode: string
  description: string
  originalEstimate: string
  industryBenchmark: string
  googleMedian: string
  variance: string
  variancePct: number
  notes: string
  historicalProjects: HistoricalProject[]
}

const costBenchmarks: CostBenchmark[] = [
  {
    costCode: '26100',
    description: 'MV switchgear',
    originalEstimate: '$4.2M',
    industryBenchmark: '$3.8M',
    googleMedian: '$3.6M',
    variance: '+17% over G-median',
    variancePct: 17,
    notes: 'Acme Electrical line item; rework risk known.',
    historicalProjects: [
      { name: 'Council Bluffs DC', year: 2019, actualCost: '$3.4M', variance: '-6%', status: 'under' },
      { name: 'Mayes County', year: 2020, actualCost: '$3.5M', variance: '-3%', status: 'under' },
      { name: 'Papillion Phase 1', year: 2021, actualCost: '$3.8M', variance: '+6%', status: 'over' },
      { name: 'New Albany', year: 2022, actualCost: '$3.6M', variance: '0%', status: 'on-target' },
      { name: 'Mesa DC', year: 2023, actualCost: '$3.7M', variance: '+3%', status: 'on-target' },
    ],
  },
  {
    costCode: '26200',
    description: 'LV distribution',
    originalEstimate: '$1.8M',
    industryBenchmark: '$1.7M',
    googleMedian: '$1.65M',
    variance: '+9% over G-median',
    variancePct: 9,
    notes: 'Standard scope.',
    historicalProjects: [
      { name: 'Council Bluffs DC', year: 2019, actualCost: '$1.55M', variance: '-6%', status: 'under' },
      { name: 'Mayes County', year: 2020, actualCost: '$1.60M', variance: '-3%', status: 'under' },
      { name: 'Papillion Phase 1', year: 2021, actualCost: '$1.72M', variance: '+4%', status: 'over' },
      { name: 'New Albany', year: 2022, actualCost: '$1.68M', variance: '+2%', status: 'on-target' },
      { name: 'Mesa DC', year: 2023, actualCost: '$1.70M', variance: '+3%', status: 'on-target' },
    ],
  },
  {
    costCode: '26300',
    description: 'Cable & tray',
    originalEstimate: '$0.9M',
    industryBenchmark: '$0.85M',
    googleMedian: '$0.82M',
    variance: '+10% over G-median',
    variancePct: 10,
    notes: 'Tightened on last project; expected to track.',
    historicalProjects: [
      { name: 'Council Bluffs DC', year: 2019, actualCost: '$0.78M', variance: '-5%', status: 'under' },
      { name: 'Mayes County', year: 2020, actualCost: '$0.80M', variance: '-2%', status: 'under' },
      { name: 'Papillion Phase 1', year: 2021, actualCost: '$0.84M', variance: '+2%', status: 'on-target' },
      { name: 'New Albany', year: 2022, actualCost: '$0.83M', variance: '+1%', status: 'on-target' },
      { name: 'Mesa DC', year: 2023, actualCost: '$0.85M', variance: '+4%', status: 'on-target' },
    ],
  },
  {
    costCode: '26400',
    description: 'Grounding',
    originalEstimate: '$0.4M',
    industryBenchmark: '$0.42M',
    googleMedian: '$0.39M',
    variance: '+3% over G-median',
    variancePct: 3,
    notes: 'On benchmark.',
    historicalProjects: [
      { name: 'Council Bluffs DC', year: 2019, actualCost: '$0.36M', variance: '-8%', status: 'under' },
      { name: 'Mayes County', year: 2020, actualCost: '$0.38M', variance: '-3%', status: 'under' },
      { name: 'Papillion Phase 1', year: 2021, actualCost: '$0.40M', variance: '+3%', status: 'on-target' },
      { name: 'New Albany', year: 2022, actualCost: '$0.39M', variance: '0%', status: 'on-target' },
      { name: 'Mesa DC', year: 2023, actualCost: '$0.41M', variance: '+5%', status: 'on-target' },
    ],
  },
]

type Tab = 'orchestrations' | 'timeline' | 'cost-benchmarks' | 'risks' | 'rfis' | 'change-orders'

export default function HendersonProjectPage() {
  const action = useActionModal()
  const handleExport = () => {
    const blob = new Blob([
      `Henderson Hub - Project Report\nGenerated: ${new Date().toLocaleString()}\n\n[Project health, milestones, risks, change orders included]\n`,
    ], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'henderson-report.txt'
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Report exported', { description: 'Henderson Hub · 12 pages' })
  }
  const [activeTab, setActiveTab] = React.useState<Tab>('timeline')
  const [selectedBenchmark, setSelectedBenchmark] = React.useState<CostBenchmark | null>(null)

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'timeline', label: 'Timeline' },
    { key: 'cost-benchmarks', label: 'Cost Benchmarks' },
    { key: 'orchestrations', label: 'In-flight Orchestrations', count: 8 },
    { key: 'risks', label: 'Risks', count: 5 },
    { key: 'rfis', label: 'RFIs' },
    { key: 'change-orders', label: 'Change Orders' },
  ]

  return (
    <AppShell
      title="Henderson Substation"
      subtitle="Project Health Deep View"
      activeHref="/projects"
    >
      <div className="space-y-4 sm:space-y-6 w-full">

        {/* ── Header with Status ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-xs border-red/30 text-red font-mono">
              CPI 0.83 &middot; SPI 0.76
            </Badge>
            <Badge variant="outline" className="text-xs border-teal/30 text-teal">
              <Bot className="w-3 h-3 mr-1" />
              {projectData.agentsActive} agents active
            </Badge>
            <Badge variant="outline" className="text-xs border-line text-muted-foreground">
              {projectData.program} &middot; {projectData.phase}
            </Badge>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleExport}>
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 border border-gold/40 hover:border-gold"
              style={{ backgroundColor: '#FAF6EB', color: '#0B1F3A' }}
              onClick={() =>
                action.open({
                  tone: 'primary',
                  icon: Zap,
                  title: 'Quick Actions',
                  description: 'Run a high-impact action against the Henderson Hub project.',
                  fields: [
                    {
                      type: 'select',
                      name: 'action',
                      label: 'Action',
                      required: true,
                      options: [
                        { value: 'standup', label: 'Schedule emergency stand-up (all leads)' },
                        { value: 'reforecast', label: 'Trigger schedule reforecast' },
                        { value: 'cofreeze', label: 'Freeze new change orders for 7 days' },
                        { value: 'audit', label: 'Run portfolio audit pass' },
                      ],
                    },
                    { type: 'textarea', name: 'note', label: 'Note', rows: 3 },
                  ],
                  confirmLabel: 'Run',
                  successToast: 'Action queued',
                  successDescription: 'Henderson Hub · all leads notified',
                })
              }
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick Actions</span>
            </Button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {kpis.map((kpi) => {
            const cfg = statusConfig[kpi.status]
            return (
              <div key={kpi.label} className={cn('bg-card rounded-xl border p-4 sm:p-5', cfg.border)}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                  <span className={cn('text-xs font-mono', cfg.color)}>{kpi.delta}</span>
                </div>
                <p className={cn('text-2xl sm:text-3xl font-sans font-bold', cfg.color)}>{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Target: {kpi.target}</p>
              </div>
            )
          })}
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-gold text-navy border-gold'
                  : 'bg-card text-muted-foreground border-line hover:border-gold/30'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 opacity-70">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === 'orchestrations' && (
          <div className="space-y-4">
            {/* Orchestrations Table */}
            <div className="bg-card rounded-xl border border-line overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-line bg-secondary/20">
                <p className="text-sm font-semibold text-foreground">In-flight Orchestrations</p>
              </div>
              <div className="divide-y divide-line">
                {orchestrations.map((orch) => {
                  const cfg = orchStatusConfig[orch.status]
                  return (
                    <a
                      key={orch.id}
                      href="/orchestration"
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', cfg.dot)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{orch.process}</p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {orch.stage} &middot; {orch.filler}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 ml-5 sm:ml-0">
                        <Badge variant="outline" className={cn('text-[10px]', cfg.color, cfg.border)}>
                          {orch.status}
                        </Badge>
                        <span className="text-sm font-mono font-semibold text-foreground tabular-nums">
                          {orch.elapsed}
                        </span>
                        {orch.agent && (
                          <Badge variant="outline" className="text-[10px] font-mono border-teal/20 text-teal">
                            <Bot className="w-3 h-3 mr-1" />
                            {orch.agent}
                          </Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Party Intelligence */}
            <div className="bg-card rounded-xl border border-line overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-line bg-secondary/20 flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                <p className="text-sm font-semibold text-foreground">Party Intelligence</p>
                <span className="text-[10px] text-muted-foreground ml-auto">Henderson contractors</span>
              </div>
              <div className="divide-y divide-line">
                {partyIntel.map((party) => (
                  <div key={party.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{party.name}</p>
                      <p className="text-[11px] text-muted-foreground">{party.type}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">SLA Miss Rate</p>
                        <div className="flex items-center gap-1 justify-center">
                          <span className={cn('text-sm font-mono font-bold', party.breachRate > 10 ? 'text-red' : 'text-green')}>
                            {party.breachRate}%
                          </span>
                          {party.breachTrend === 'up' ? (
                            <TrendingDown className="w-3 h-3 text-red rotate-180" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-green" />
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">Reliability</p>
                        <span className={cn('text-sm font-mono font-bold', party.reliability >= 0.95 ? 'text-green' : party.reliability >= 0.90 ? 'text-amber' : 'text-red')}>
                          {party.reliability.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">Open Items</p>
                        <span className="text-sm font-mono text-foreground">{party.openItems}</span>
                      </div>

                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px]',
                          party.status === 'at-risk' ? 'text-amber border-amber/30' : 'text-green border-green/30'
                        )}
                      >
                        {party.status === 'at-risk' ? 'At Risk' : 'Healthy'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-card rounded-xl border border-line p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-gold" />
              <p className="text-sm font-semibold text-foreground">Milestone Timeline</p>
              <Badge variant="outline" className="text-[10px] text-red border-red/30 ml-auto">
                18 days slip
              </Badge>
            </div>

            {/* Gantt-style placeholder */}
            <div className="space-y-3">
              {milestones.map((m) => {
                const cfg = milestoneStatusConfig[m.status]
                const progress = m.status === 'complete' ? 100 : m.status === 'overdue' ? 80 : m.status === 'at-risk' ? 50 : 0
                return (
                  <div key={m.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="w-full sm:w-48 shrink-0">
                      <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Baseline: {m.baseline}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-6 bg-secondary rounded-lg overflow-hidden relative">
                        {/* Baseline bar */}
                        <div className="absolute inset-y-0 left-0 bg-slate/30 border-r-2 border-slate border-dashed" style={{ width: '60%' }} />
                        {/* Actual/forecast bar */}
                        <div className={cn('absolute inset-y-0 left-0 rounded-lg', cfg.bg)} style={{ width: `${progress}%` }} />
                        {m.slip > 0 && (
                          <div className="absolute right-2 inset-y-0 flex items-center">
                            <span className="text-[10px] font-mono text-red">+{m.slip}d</span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className={cn('text-[10px] shrink-0', cfg.color)}>
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-line flex items-center gap-4 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 bg-slate/30 border-r border-slate border-dashed" />
                <span>Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 bg-green rounded" />
                <span>Complete</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 bg-red rounded" />
                <span>Overdue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 bg-amber rounded" />
                <span>At Risk</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cost-benchmarks' && (
          <div className="space-y-4">
            {/* Cost Benchmarks Table */}
            <div className="bg-card rounded-xl border border-line overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-line bg-secondary/20 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gold" />
                <p className="text-sm font-semibold text-foreground">Estimate vs Industry Benchmark</p>
                <span className="text-[10px] text-muted-foreground ml-auto">Henderson Substation</span>
              </div>

              {/* Table Header */}
              <div className="hidden lg:grid lg:grid-cols-[80px_1fr_100px_100px_100px_140px_40px] gap-0 bg-muted/30 dark:bg-muted/10 border-b border-line text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                <div className="px-4 py-3">Cost Code</div>
                <div className="px-4 py-3">Description</div>
                <div className="px-4 py-3 text-right">Original Est.</div>
                <div className="px-4 py-3 text-right">Industry</div>
                <div className="px-4 py-3 text-right">G 7-Yr Med</div>
                <div className="px-4 py-3">Variance</div>
                <div className="px-4 py-3"></div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-line">
                {costBenchmarks.map((item) => (
                  <div key={item.costCode} className="group">
                    <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_100px_100px_100px_140px_40px] gap-0 items-center hover:bg-muted/20 transition-colors">
                      <div className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-foreground">{item.costCode}</span>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{item.description}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{item.notes}</p>
                      </div>
                      <div className="px-4 py-3 text-right">
                        <span className="font-mono text-sm text-foreground">{item.originalEstimate}</span>
                      </div>
                      <div className="px-4 py-3 text-right">
                        <span className="font-mono text-sm text-muted-foreground">{item.industryBenchmark}</span>
                      </div>
                      <div className="px-4 py-3 text-right">
                        <span className="font-mono text-sm text-muted-foreground">{item.googleMedian}</span>
                      </div>
                      <div className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] font-mono',
                            item.variancePct > 10 ? 'text-red border-red/30 bg-red/5' :
                            item.variancePct > 5 ? 'text-amber border-amber/30 bg-amber/5' :
                            'text-green border-green/30 bg-green/5'
                          )}
                        >
                          {item.variance}
                        </Badge>
                      </div>
                      <div className="px-4 py-3">
                        <button
                          onClick={() => setSelectedBenchmark(item)}
                          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="View decision trace"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Callout Block */}
            <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-500/10 shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                    Estimate confidence is highest where the project&apos;s original number sits within +/- 5% of the Google 7-year median. Items above that threshold are surfaced to the variance review queue.
                  </p>
                  <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mt-2">
                    Industry benchmarks are sourced from RSMeans and the AACE class-3 estimate reference dataset.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Decision Trace Drawer */}
        <AnimatePresence>
          {selectedBenchmark && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBenchmark(null)}
                className="fixed inset-0 bg-black/40 z-40"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-line shadow-2xl z-50 overflow-y-auto"
              >
                {/* Drawer Header */}
                <div className="sticky top-0 bg-card border-b border-line px-5 py-4 flex items-center gap-3 z-10">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Decision Trace</p>
                    <h3 className="text-lg font-semibold text-foreground">
                      {selectedBenchmark.costCode} — {selectedBenchmark.description}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedBenchmark(null)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="p-5 space-y-5">
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Original Est.</p>
                      <p className="text-lg font-mono font-bold text-foreground">{selectedBenchmark.originalEstimate}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">G 7-Yr Median</p>
                      <p className="text-lg font-mono font-bold text-primary">{selectedBenchmark.googleMedian}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Variance</p>
                      <p className={cn(
                        'text-lg font-mono font-bold',
                        selectedBenchmark.variancePct > 10 ? 'text-red' :
                        selectedBenchmark.variancePct > 5 ? 'text-amber' : 'text-green'
                      )}>
                        +{selectedBenchmark.variancePct}%
                      </p>
                    </div>
                  </div>

                  {/* Historical Projects */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      7-Year Historical Projects Used for Median
                    </h4>
                    <div className="space-y-2">
                      {selectedBenchmark.historicalProjects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-line"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{proj.name}</p>
                            <p className="text-[11px] text-muted-foreground">{proj.year}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-mono font-semibold text-foreground">{proj.actualCost}</p>
                            <p className={cn(
                              'text-[11px] font-mono',
                              proj.status === 'under' ? 'text-green' :
                              proj.status === 'over' ? 'text-red' : 'text-muted-foreground'
                            )}>
                              {proj.variance}
                            </p>
                          </div>
                          <div className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            proj.status === 'under' ? 'bg-green' :
                            proj.status === 'over' ? 'bg-red' : 'bg-amber'
                          )} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Median Calculation */}
                  <div className="p-4 bg-secondary/30 rounded-lg border border-line">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Median Calculation
                    </h4>
                    <p className="text-sm text-foreground">
                      The Google 7-year median of <span className="font-mono font-semibold text-primary">{selectedBenchmark.googleMedian}</span> is calculated from {selectedBenchmark.historicalProjects.length} comparable projects between {selectedBenchmark.historicalProjects[0]?.year} and {selectedBenchmark.historicalProjects[selectedBenchmark.historicalProjects.length - 1]?.year}.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: {selectedBenchmark.notes}
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {activeTab === 'risks' && (
          <div className="bg-card rounded-xl border border-line overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b border-line bg-secondary/20 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red" />
              <p className="text-sm font-semibold text-foreground">Active Risks</p>
              <span className="text-[10px] text-muted-foreground ml-auto">{risks.length} total</span>
            </div>
            <div className="divide-y divide-line">
              {risks.map((risk) => (
                <div key={risk.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-mono shrink-0',
                        risk.severity === 'P1' ? 'text-red border-red/30' : 'text-amber border-amber/30'
                      )}
                    >
                      {risk.severity}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{risk.title}</p>
                      <p className="text-[11px] text-muted-foreground">Owner: {risk.owner}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6 sm:ml-0">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px]',
                        risk.status === 'open' ? 'text-red border-red/30' : 'text-amber border-amber/30'
                      )}
                    >
                      {risk.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {risk.mitigations} mitigation{risk.mitigations !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rfis' && (
          <div className="bg-card rounded-xl border border-line p-6 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">RFIs tab coming soon</p>
            <p className="text-xs text-muted-foreground/60 mt-1">4 open RFIs, oldest 8 days</p>
          </div>
        )}

        {activeTab === 'change-orders' && (
          <div className="bg-card rounded-xl border border-line p-6 text-center">
            <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Change Orders tab coming soon</p>
            <p className="text-xs text-muted-foreground/60 mt-1">CO-0087 pending: $2.4M</p>
          </div>
        )}
      </div>
      {action.element}
    </AppShell>
  )
}
