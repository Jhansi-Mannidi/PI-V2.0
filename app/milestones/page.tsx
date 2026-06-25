'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  Bot,
  Calendar,
  ArrowUpRight,
  Search,
  TrendingDown,
  TrendingUp,
  Flag,
  Minus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useActionModal } from '@/hooks/use-action-modal'
import { Badge } from '@/components/ui/badge'
import { useAI } from '@/components/ai-provider'

// Animation ease curve
const ease = [0.25, 0.46, 0.45, 0.94] as const

const milestones = [
  {
    id: 'MS-001', name: 'Structural Steel Complete', project: 'Henderson', program: 'West',
    baselineDate: '2026-04-28', forecastDate: '2026-05-10', actualDate: null,
    status: 'overdue' as const, slipDays: 12, gateCriteria: 4, gateMet: 2,
    owner: 'Sarah Kim', criticalPath: true, dependency: 'MS-004',
    agent: 'A-301', agentNote: 'Contractor delays (Acme Electrical) drove 12-day slip. Rework on welding joints consumed 8 days.',
    gates: [
      { name: 'Steel erection 100%', met: true },
      { name: 'Inspection passed', met: true },
      { name: 'Bolt torque certified', met: false },
      { name: 'Fire-stop installed', met: false },
    ],
  },
  {
    id: 'MS-002', name: 'Mechanical Rough-in Complete', project: 'Mesa', program: 'Southeast',
    baselineDate: '2026-05-18', forecastDate: '2026-05-24', actualDate: null,
    status: 'at-risk' as const, slipDays: 6, gateCriteria: 5, gateMet: 3,
    owner: 'Mark Torres', criticalPath: true, dependency: null,
    agent: 'A-301', agentNote: 'HVAC CO-0087 pending approval may add 5 more days if scope changes are approved.',
    gates: [
      { name: 'Ductwork installed', met: true },
      { name: 'Piping pressure test', met: true },
      { name: 'Insulation complete', met: true },
      { name: 'Controls wiring', met: false },
      { name: 'Commissioning prep', met: false },
    ],
  },
  {
    id: 'MS-003', name: 'Underground Utilities Complete', project: 'Pryor Creek', program: 'Central',
    baselineDate: '2026-05-22', forecastDate: '2026-05-22', actualDate: null,
    status: 'on-track' as const, slipDays: 0, gateCriteria: 3, gateMet: 2,
    owner: 'Hasit Chetal', criticalPath: false, dependency: null,
    agent: null, agentNote: null,
    gates: [
      { name: 'Storm drain complete', met: true },
      { name: 'Electrical duct bank', met: true },
      { name: 'Backfill & compaction', met: false },
    ],
  },
  {
    id: 'MS-004', name: 'Foundation Pour Complete', project: 'Papillion', program: 'Central',
    baselineDate: '2026-05-15', forecastDate: '2026-05-15', actualDate: null,
    status: 'on-track' as const, slipDays: 0, gateCriteria: 4, gateMet: 3,
    owner: 'Hasit Chetal', criticalPath: true, dependency: null,
    agent: null, agentNote: null,
    gates: [
      { name: 'Rebar placement verified', met: true },
      { name: 'Formwork inspection', met: true },
      { name: 'Concrete batch approved', met: true },
      { name: 'Pour complete & curing', met: false },
    ],
  },
  {
    id: 'MS-005', name: 'Easement Resolution', project: 'De Soto', program: 'Central',
    baselineDate: '2026-05-01', forecastDate: '2026-05-12', actualDate: null,
    status: 'at-risk' as const, slipDays: 11, gateCriteria: 2, gateMet: 0,
    owner: 'Brian Smith', criticalPath: true, dependency: null,
    agent: 'A-301', agentNote: 'Legal proceedings ongoing. Alternate routing study 60% complete as backup plan.',
    gates: [
      { name: 'Legal agreement signed', met: false },
      { name: 'Survey completed', met: false },
    ],
  },
  {
    id: 'MS-006', name: 'Site Grading Complete', project: 'New Albany', program: 'Southeast',
    baselineDate: '2026-05-20', forecastDate: '2026-05-20', actualDate: null,
    status: 'on-track' as const, slipDays: 0, gateCriteria: 3, gateMet: 2,
    owner: 'Sarah Kim', criticalPath: false, dependency: null,
    agent: null, agentNote: null,
    gates: [
      { name: 'Cut & fill balanced', met: true },
      { name: 'Drainage installed', met: true },
      { name: 'Soil compaction test', met: false },
    ],
  },
  {
    id: 'MS-007', name: 'Design Review Complete', project: 'Storey County', program: 'West',
    baselineDate: '2026-05-25', forecastDate: '2026-05-25', actualDate: null,
    status: 'on-track' as const, slipDays: 0, gateCriteria: 4, gateMet: 2,
    owner: 'David Kim', criticalPath: true, dependency: null,
    agent: null, agentNote: null,
    gates: [
      { name: 'Architectural sign-off', met: true },
      { name: 'Structural sign-off', met: true },
      { name: 'MEP coordination', met: false },
      { name: 'Code compliance review', met: false },
    ],
  },
  {
    id: 'MS-008', name: 'Permitting Submission', project: 'Midlothian', program: 'Northeast',
    baselineDate: '2026-05-28', forecastDate: '2026-05-28', actualDate: null,
    status: 'on-track' as const, slipDays: 0, gateCriteria: 3, gateMet: 1,
    owner: 'Sarah Lin', criticalPath: true, dependency: null,
    agent: null, agentNote: null,
    gates: [
      { name: 'Drawing package complete', met: true },
      { name: 'Environmental clearance', met: false },
      { name: 'Application filed', met: false },
    ],
  },
  {
    id: 'MS-009', name: 'Electrical Rough-in Complete', project: 'Henderson', program: 'West',
    baselineDate: '2026-06-10', forecastDate: '2026-06-22', actualDate: null,
    status: 'at-risk' as const, slipDays: 12, gateCriteria: 4, gateMet: 0,
    owner: 'Jennifer M.', criticalPath: true, dependency: 'MS-001',
    agent: 'A-301', agentNote: 'Dependent on MS-001 (Structural Steel) which is 12 days overdue. Cascading delay confirmed.',
    gates: [
      { name: 'Conduit installed', met: false },
      { name: 'Wire pull complete', met: false },
      { name: 'Panel termination', met: false },
      { name: 'Grounding system', met: false },
    ],
  },
]

const statusConfig = {
  'on-track': { label: 'On Track', color: 'text-green', bg: 'bg-green-bg', border: 'border-green/30', icon: CheckCircle2, dot: 'bg-green' },
  'at-risk': { label: 'At Risk', color: 'text-amber', bg: 'bg-amber-bg', border: 'border-amber/30', icon: AlertTriangle, dot: 'bg-amber' },
  overdue: { label: 'Overdue', color: 'text-red', bg: 'bg-red-bg', border: 'border-red/30', icon: XCircle, dot: 'bg-red' },
  complete: { label: 'Complete', color: 'text-green', bg: 'bg-green-bg', border: 'border-green/30', icon: CheckCircle2, dot: 'bg-green' },
}

type FilterTab = 'all' | 'overdue' | 'at-risk' | 'on-track'

export default function MilestoneGatePage() {
  const action = useActionModal()
  const { aiEnabled } = useAI()
  const [tab, setTab] = React.useState<FilterTab>('all')
  const [programFilter, setProgramFilter] = React.useState<string>('all')
  const [expandedMS, setExpandedMS] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')

  const programFiltered = programFilter === 'all'
    ? milestones
    : milestones.filter((m) => m.program === programFilter)

  const filtered = (tab === 'all' ? programFiltered : programFiltered.filter((m) => m.status === tab))
    .filter((m) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.project.toLowerCase().includes(q) ||
        m.program.toLowerCase().includes(q) ||
        m.owner.toLowerCase().includes(q)
      )
    })

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All Gates', count: programFiltered.length },
    { key: 'overdue', label: 'Overdue', count: programFiltered.filter((m) => m.status === 'overdue').length },
    { key: 'at-risk', label: 'At Risk', count: programFiltered.filter((m) => m.status === 'at-risk').length },
    { key: 'on-track', label: 'On Track', count: programFiltered.filter((m) => m.status === 'on-track').length },
  ]

  return (
    <AppShell title="Milestone Gate Review" subtitle="Are we hitting our gates?" activeHref="/milestones">
      <div className="space-y-6 w-full">

        {/* ── Summary Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Gates</span>
            </div>
            <p className="text-2xl font-sans font-bold text-foreground">{milestones.length}</p>
            <p className="text-[11px] text-muted-foreground">Upcoming milestones</p>
          </div>
          <div className="bg-card rounded-xl border border-red/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red" />
              <span className="text-[10px] font-bold text-red uppercase tracking-wider">Overdue</span>
            </div>
            <p className="text-2xl font-sans font-bold text-red">{milestones.filter((m) => m.status === 'overdue').length}</p>
            <p className="text-[11px] text-muted-foreground">Critical path impacted</p>
          </div>
          <div className="bg-card rounded-xl border border-amber/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber" />
              <span className="text-[10px] font-bold text-amber uppercase tracking-wider">At Risk</span>
            </div>
            <p className="text-2xl font-sans font-bold text-amber">{milestones.filter((m) => m.status === 'at-risk').length}</p>
            <p className="text-[11px] text-muted-foreground">{milestones.filter((m) => m.status === 'at-risk').reduce((s, m) => s + m.slipDays, 0)}d total slip</p>
          </div>
          <div className="bg-card rounded-xl border border-green/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green" />
              <span className="text-[10px] font-bold text-green uppercase tracking-wider">Gate Readiness</span>
            </div>
            <p className="text-2xl font-sans font-bold text-green">
              {Math.round(milestones.reduce((s, m) => s + (m.gateMet / m.gateCriteria), 0) / milestones.length * 100)}%
            </p>
            <p className="text-[11px] text-muted-foreground">Avg criteria met</p>
          </div>
        </div>

        {/* ── Timeline Visualization ── */}
        <div className="bg-card rounded-xl border border-line p-5">
          <h3 className="font-sans text-base font-semibold text-foreground mb-4">Milestone Timeline</h3>
          <div className="relative">
            {/* Timeline rail */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-line" />

            <div className="space-y-3">
              {milestones
                .sort((a, b) => new Date(a.forecastDate).getTime() - new Date(b.forecastDate).getTime())
                .map((ms) => {
                  const cfg = statusConfig[ms.status]
                  return (
                    <div key={ms.id} className="flex items-center gap-3 ml-1">
                      <div className={cn('w-3 h-3 rounded-full shrink-0 z-10 ring-2 ring-card', cfg.dot, ms.status === 'overdue' && 'animate-pulse-dot')} />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs font-mono text-muted-foreground min-w-[72px]">{ms.forecastDate.slice(5)}</span>
                        <span className="text-xs font-semibold text-foreground truncate">{ms.name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{ms.project}</span>
                        {ms.slipDays > 0 && (
                          <span className={cn('text-[10px] font-mono', ms.status === 'overdue' ? 'text-red' : 'text-amber')}>+{ms.slipDays}d</span>
                        )}
                        {ms.criticalPath && (
                          <Flag className="w-3 h-3 text-red shrink-0" />
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* ── Milestone Details Table ── */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          <div className="px-6 py-5 border-b border-line">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-base font-semibold text-foreground">Gate Details</h3>
              <div className="flex items-center gap-2">
                <Select value={programFilter} onValueChange={setProgramFilter}>
                  <SelectTrigger className="h-9 w-[140px] text-xs border-line">
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Search milestones..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9 w-[220px] pl-9 pr-4 text-sm border border-line rounded-lg bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={cn('px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                    tab === t.key ? 'bg-gold text-navy shadow-sm' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground')}>
                  {t.label}<span className="ml-2 px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px]">{t.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-7 gap-0 bg-muted/30 dark:bg-navy-mid/30 border-b border-line text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            <div className="px-6 py-3">Milestone</div>
            <div className="px-4 py-3">Baseline</div>
            <div className="px-4 py-3">Forecast</div>
            <div className="px-4 py-3">Variance</div>
            <div className="px-4 py-3">Gates</div>
            <div className="px-4 py-3">Path</div>
            <div className="px-4 py-3">Status</div>
          </div>

          <div className="divide-y divide-line">
            {filtered.map((ms, index) => {
              const cfg = statusConfig[ms.status]
              const StatusIcon = cfg.icon
              const isExpanded = expandedMS === ms.id
              return (
                <motion.div
                  key={ms.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04, ease }}
                >
                  <button onClick={() => setExpandedMS(isExpanded ? null : ms.id)}
                    className={cn('w-full grid grid-cols-1 sm:grid-cols-7 gap-0 items-center text-left hover:bg-secondary/30 transition-colors group', isExpanded && 'bg-secondary/20')}>
                    
                    {/* Milestone Name */}
                    <div className="px-6 py-4 flex items-center gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />}
                        <StatusIcon className={cn('w-5 h-5', cfg.color)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-gold transition-colors">{ms.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{ms.project} -- {ms.program}</p>
                      </div>
                    </div>

                    {/* Baseline */}
                    <div className="px-4 py-4 hidden sm:block">
                      <p className="text-sm font-mono text-foreground">{ms.baselineDate.slice(5)}</p>
                    </div>
                    
                    {/* Forecast */}
                    <div className="px-4 py-4 hidden sm:block">
                      <p className={cn('text-sm font-mono font-semibold', ms.slipDays > 0 ? (ms.status === 'overdue' ? 'text-red' : 'text-amber') : 'text-green')}>{ms.forecastDate.slice(5)}</p>
                    </div>
                    
                    {/* Variance */}
                    <div className="px-4 py-4">
                      {ms.slipDays > 0 ? (
                        <span className={cn('text-sm font-mono font-bold', ms.status === 'overdue' ? 'text-red' : 'text-amber')}>+{ms.slipDays}d</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Gate progress */}
                    <div className="px-4 py-4">
                      <p className="text-[10px] text-muted-foreground mb-1">Gates {ms.gateMet}/{ms.gateCriteria}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: ms.gateCriteria }).map((_, i) => (
                          <div key={i} className={cn('h-1.5 flex-1 rounded-full max-w-[16px]', i < ms.gateMet ? 'bg-green' : 'bg-secondary')} />
                        ))}
                      </div>
                    </div>

                    {/* Critical Path */}
                    <div className="px-4 py-4">
                      {ms.criticalPath ? <span title="Critical Path"><Flag className="w-4 h-4 text-red" /></span> : <span className="text-muted-foreground">—</span>}
                    </div>

                    {/* Status */}
                    <div className="px-4 py-4 flex items-center gap-2">
                      <Badge variant="outline" className={cn('text-[10px] font-semibold', cfg.color, cfg.border)}>{cfg.label}</Badge>
                      {aiEnabled && ms.agent && (
                        <Badge variant="outline" className="text-[10px] font-mono border-teal/20 text-teal">
                          <Bot className="w-3 h-3 mr-1" />{ms.agent}
                        </Badge>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-4 ml-9 space-y-3">
                      {/* Gate Criteria Checklist */}
                      <div className="p-4 rounded-lg bg-secondary/20 border border-line">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Gate Criteria</p>
                        <div className="space-y-1.5">
                          {ms.gates.map((gate) => (
                            <div key={gate.name} className="flex items-center gap-2">
                              {gate.met ? (
                                <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-line shrink-0" />
                              )}
                              <span className={cn('text-sm', gate.met ? 'text-foreground' : 'text-muted-foreground')}>{gate.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                        <span>Owner: {ms.owner}</span>
                        {ms.dependency && <span className="text-amber">Depends on: {ms.dependency}</span>}
                      </div>

                      {aiEnabled && ms.agentNote && (
                        <div className="p-3 rounded-lg bg-teal/5 border border-teal/10">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Bot className="w-3.5 h-3.5 text-teal" />
                            <span className="text-xs font-semibold text-teal">Agent Analysis</span>
                          </div>
                          <p className="text-sm text-foreground/80 font-mono">{ms.agentNote}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={() =>
                            action.open({
                              tone: 'destructive',
                              icon: ArrowUpRight,
                              title: `Escalate Milestone — ${ms.id}`,
                              description: 'Escalates this milestone gate to leadership for resolution.',
                              context: [
                                { label: 'Milestone', value: ms.name },
                                { label: 'Project', value: ms.project },
                                { label: 'Status', value: ms.status },
                              ],
                              fields: [
                                {
                                  type: 'select',
                                  name: 'target',
                                  label: 'Escalate To',
                                  required: true,
                                  options: [
                                    { value: 'pm', label: 'Brian Steinberg — Program Manager' },
                                    { value: 'pd', label: 'Brian Smith — Portfolio Director' },
                                  ],
                                },
                                { type: 'textarea', name: 'reason', label: 'Reason', required: true, rows: 3 },
                              ],
                              confirmLabel: 'Escalate',
                              successToast: `${ms.id} escalated`,
                            })
                          }
                        >
                          <ArrowUpRight className="w-3 h-3" />Escalate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={() =>
                            action.open({
                              tone: 'warning',
                              icon: Calendar,
                              title: `Reforecast Milestone — ${ms.id}`,
                              description: 'Updates the projected completion date for this milestone gate. The change will propagate to dependent milestones.',
                              context: [
                                { label: 'Milestone', value: ms.name },
                                { label: 'Current Forecast', value: ms.forecastDate },
                              ],
                              fields: [
                                { type: 'input', name: 'newDate', label: 'New Forecast Date', required: true, placeholder: 'YYYY-MM-DD' },
                                {
                                  type: 'select',
                                  name: 'reason',
                                  label: 'Reason',
                                  required: true,
                                  options: [
                                    { value: 'weather', label: 'Weather delay' },
                                    { value: 'scope', label: 'Scope change' },
                                    { value: 'permits', label: 'Permit delay' },
                                    { value: 'resources', label: 'Resource constraints' },
                                    { value: 'dependency', label: 'Dependency slip' },
                                  ],
                                },
                                { type: 'textarea', name: 'note', label: 'Notes', rows: 3 },
                              ],
                              confirmLabel: 'Reforecast',
                              successToast: 'Forecast updated',
                              successDescription: 'Dependent milestones recalculated',
                            })
                          }
                        >
                          <Calendar className="w-3 h-3" />Reforecast
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
      {action.element}
    </AppShell>
  )
}
