'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bot,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Calendar,
  Minus,
  MapPin,
  Activity,
  Shield,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAI } from '@/components/ai-provider'
import { motion, AnimatePresence } from 'framer-motion'

const projectsData = [
  {
    id: 'PRJ-001', name: 'Mesa', program: 'Southeast', location: 'Mesa, AZ', phase: 'Construction',
    completion: 56, health: 'at-risk' as const,
    cpi: 0.94, spi: 0.89, eac: '$143M', bac: '$131M',
    milestones: { total: 12, complete: 5, overdue: 2 },
    risks: { p1: 1, p2: 1, total: 3 },
    activeBreaches: 2, slaCompliance: 72,
    team: { total: 148, contractors: 4 },
    agent: 'A-301',
    keyIssues: ['HVAC CO pending ($2.1M)', 'Monthly report data-stitching delay', 'CPI declining 3 consecutive weeks'],
    nextMilestone: { name: 'Mechanical Rough-in Complete', date: '2026-05-18', status: 'at-risk' as const },
  },
  {
    id: 'PRJ-002', name: 'Henderson', program: 'West', location: 'Henderson, NV', phase: 'Construction',
    completion: 39, health: 'critical' as const,
    cpi: 0.91, spi: 0.85, eac: '$105M', bac: '$98M',
    milestones: { total: 14, complete: 4, overdue: 3 },
    risks: { p1: 2, p2: 1, total: 4 },
    activeBreaches: 3, slaCompliance: 65,
    team: { total: 112, contractors: 3 },
    agent: 'A-301',
    keyIssues: ['Contractor performance (Acme Electrical 18% SLA miss rate)', 'Schedule slip: 18 days', 'Key-person risk: no backup for Legal Review'],
    nextMilestone: { name: 'Structural Steel Complete', date: '2026-05-10', status: 'overdue' as const },
  },
  {
    id: 'PRJ-003', name: 'Pryor Creek', program: 'Central', location: 'Pryor Creek, OK', phase: 'Construction',
    completion: 48, health: 'at-risk' as const,
    cpi: 0.96, spi: 0.92, eac: '$118M', bac: '$112M',
    milestones: { total: 11, complete: 4, overdue: 1 },
    risks: { p1: 1, p2: 0, total: 2 },
    activeBreaches: 2, slaCompliance: 78,
    team: { total: 134, contractors: 5 },
    agent: 'A-301',
    keyIssues: ['RFI backlog: 4 concurrent (Structural Lead)', 'Critical path RFI-1188 overdue'],
    nextMilestone: { name: 'Underground Utilities Complete', date: '2026-05-22', status: 'on-track' as const },
  },
  {
    id: 'PRJ-004', name: 'Papillion', program: 'Central', location: 'Papillion, NE', phase: 'Construction',
    completion: 38, health: 'on-track' as const,
    cpi: 0.97, spi: 0.94, eac: '$92M', bac: '$89M',
    milestones: { total: 10, complete: 3, overdue: 0 },
    risks: { p1: 1, p2: 0, total: 1 },
    activeBreaches: 0, slaCompliance: 92,
    team: { total: 98, contractors: 3 },
    agent: null,
    keyIssues: ['Labor shortage risk (monitoring)', 'CO-0090 approved -- cable tray rerouting'],
    nextMilestone: { name: 'Foundation Pour Complete', date: '2026-05-15', status: 'on-track' as const },
  },
  {
    id: 'PRJ-005', name: 'New Albany', program: 'Southeast', location: 'New Albany, OH', phase: 'Early Construction',
    completion: 28, health: 'on-track' as const,
    cpi: 0.98, spi: 0.96, eac: '$78M', bac: '$76M',
    milestones: { total: 12, complete: 2, overdue: 0 },
    risks: { p1: 0, p2: 1, total: 1 },
    activeBreaches: 0, slaCompliance: 95,
    team: { total: 72, contractors: 2 },
    agent: 'A-301',
    keyIssues: ['Permit delay risk (Franklin County)', 'On track overall'],
    nextMilestone: { name: 'Site Grading Complete', date: '2026-05-20', status: 'on-track' as const },
  },
  {
    id: 'PRJ-006', name: 'Storey County', program: 'West', location: 'Storey County, NV', phase: 'Pre-Construction',
    completion: 19, health: 'on-track' as const,
    cpi: 0.99, spi: 0.97, eac: '$96M', bac: '$95M',
    milestones: { total: 15, complete: 2, overdue: 0 },
    risks: { p1: 0, p2: 1, total: 1 },
    activeBreaches: 0, slaCompliance: 98,
    team: { total: 45, contractors: 1 },
    agent: null,
    keyIssues: ['Seismic study in progress'],
    nextMilestone: { name: 'Design Review Complete', date: '2026-05-25', status: 'on-track' as const },
  },
  {
    id: 'PRJ-007', name: 'De Soto', program: 'Central', location: 'De Soto, KS', phase: 'Construction',
    completion: 41, health: 'at-risk' as const,
    cpi: 0.94, spi: 0.88, eac: '$72M', bac: '$68M',
    milestones: { total: 11, complete: 3, overdue: 1 },
    risks: { p1: 1, p2: 0, total: 2 },
    activeBreaches: 1, slaCompliance: 80,
    team: { total: 88, contractors: 3 },
    agent: 'A-301',
    keyIssues: ['Easement dispute -- legal action pending', 'Budget overrun from legal costs'],
    nextMilestone: { name: 'Easement Resolution', date: '2026-05-12', status: 'at-risk' as const },
  },
  {
    id: 'PRJ-008', name: 'Midlothian', program: 'Northeast', location: 'Midlothian, TX', phase: 'Pre-Construction',
    completion: 22, health: 'on-track' as const,
    cpi: 0.99, spi: 0.98, eac: '$55M', bac: '$54M',
    milestones: { total: 13, complete: 2, overdue: 0 },
    risks: { p1: 0, p2: 0, total: 0 },
    activeBreaches: 0, slaCompliance: 100,
    team: { total: 38, contractors: 1 },
    agent: null,
    keyIssues: ['On track -- no significant issues'],
    nextMilestone: { name: 'Permitting Submission', date: '2026-05-28', status: 'on-track' as const },
  },
]

const healthConfig = {
  'on-track': { 
    label: 'On Track', 
    color: 'text-emerald-700 dark:text-emerald-300', 
    bg: 'bg-emerald-50 dark:bg-emerald-500/10', 
    border: 'border-emerald-200 dark:border-emerald-500/20', 
    dot: 'bg-emerald-400',
    barBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    barFill: 'bg-emerald-400 dark:bg-emerald-500'
  },
  'at-risk': { 
    label: 'At Risk', 
    color: 'text-amber-700 dark:text-amber-300', 
    bg: 'bg-amber-50 dark:bg-amber-500/10', 
    border: 'border-amber-200 dark:border-amber-500/20', 
    dot: 'bg-amber-400',
    barBg: 'bg-amber-100 dark:bg-amber-500/20',
    barFill: 'bg-amber-400 dark:bg-amber-500'
  },
  critical: { 
    label: 'Critical', 
    color: 'text-rose-700 dark:text-rose-300', 
    bg: 'bg-rose-50 dark:bg-rose-500/10', 
    border: 'border-rose-200 dark:border-rose-500/20', 
    dot: 'bg-rose-400',
    barBg: 'bg-rose-100 dark:bg-rose-500/20',
    barFill: 'bg-rose-400 dark:bg-rose-500'
  },
  overdue: { 
    label: 'Overdue', 
    color: 'text-rose-700 dark:text-rose-300', 
    bg: 'bg-rose-50 dark:bg-rose-500/10', 
    border: 'border-rose-200 dark:border-rose-500/20', 
    dot: 'bg-rose-400',
    barBg: 'bg-rose-100 dark:bg-rose-500/20',
    barFill: 'bg-rose-400 dark:bg-rose-500'
  },
}

type HealthFilter = 'all' | 'on-track' | 'at-risk' | 'critical'

export default function ProjectHealthPage() {
  const { aiEnabled } = useAI()
  const [filter, setFilter] = React.useState<HealthFilter>('all')
  const [programFilter, setProgramFilter] = React.useState<string>('all')
  const [expandedProject, setExpandedProject] = React.useState<string | null>(null)

  const programFiltered = programFilter === 'all'
    ? projectsData
    : projectsData.filter((p) => p.program === programFilter)

  const filtered = filter === 'all' ? programFiltered : programFiltered.filter((p) => p.health === filter)

  const filters: { key: HealthFilter; label: string; count: number; icon: React.ReactNode; shadedBg: string; iconBg: string }[] = [
    { key: 'all', label: 'All Projects', count: programFiltered.length, icon: <Building2 className="w-4 h-4" />, shadedBg: 'bg-slate-50 dark:bg-slate-500/5', iconBg: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400' },
    { key: 'critical', label: 'Critical', count: programFiltered.filter((p) => p.health === 'critical').length, icon: <AlertTriangle className="w-4 h-4" />, shadedBg: 'bg-rose-50 dark:bg-rose-500/5', iconBg: 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' },
    { key: 'at-risk', label: 'At Risk', count: programFiltered.filter((p) => p.health === 'at-risk').length, icon: <Clock className="w-4 h-4" />, shadedBg: 'bg-amber-50 dark:bg-amber-500/5', iconBg: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { key: 'on-track', label: 'On Track', count: programFiltered.filter((p) => p.health === 'on-track').length, icon: <CheckCircle2 className="w-4 h-4" />, shadedBg: 'bg-emerald-50 dark:bg-emerald-500/5', iconBg: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  ]

  return (
    <AppShell title="Project Health Dashboard" subtitle="Comprehensive project status overview" activeHref="/projects">
      <div className="space-y-6 w-full">

        {/* ── Region Filter ── */}
        <div className="flex items-center gap-3">
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
        </div>

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filters.map((f) => {
            const isActive = filter === f.key
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'relative px-4 py-3 rounded-xl border transition-all text-left group',
                  isActive 
                    ? 'bg-card border-gold shadow-sm ring-1 ring-gold/20' 
                    : cn('border-transparent hover:border-line/50 hover:shadow-sm', f.shadedBg)
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    isActive ? 'bg-gold/10 text-gold' : f.iconBg
                  )}>
                    {f.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-mono font-bold text-foreground leading-none">{f.count}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{f.label}</p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Project Table ── */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-0 bg-muted/30 dark:bg-muted/10 border-b border-line">
            <div className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project</div>
            <div className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</div>
            <div className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">CPI / SPI</div>
            <div className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">SLA</div>
            <div className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Issues</div>
            <div className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Status</div>
          </div>

          {/* Project Rows */}
          <div className="divide-y divide-line">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, idx) => {
                const hCfg = healthConfig[project.health]
                const isExpanded = expandedProject === project.id
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                    className="group"
                  >
                    <button
                      onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                      className={cn(
                        'w-full grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-0 items-center text-left transition-colors',
                        'hover:bg-muted/30 dark:hover:bg-muted/10',
                        isExpanded && 'bg-muted/20 dark:bg-muted/5'
                      )}
                    >
                      {/* Project Info */}
                      <div className="px-6 py-3 flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0"
                        >
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-gold transition-colors">
                              {project.name}
                            </h3>
                            <Badge variant="outline" className="text-[10px] border-line text-muted-foreground shrink-0 hidden sm:inline-flex">
                              {project.phase}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{project.location}</span>
                            <span className="text-muted-foreground/50 mx-1">|</span>
                            <span>{project.program}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="px-4 py-3 hidden lg:block">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all', hCfg.barFill)}
                              style={{ width: `${project.completion}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono font-semibold text-foreground w-10 text-right">
                            {project.completion}%
                          </span>
                        </div>
                      </div>

                      {/* CPI / SPI */}
                      <div className="px-4 py-3 hidden lg:block">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase block">CPI</span>
                            <span className="text-xs font-mono font-semibold text-foreground">
                              {project.cpi.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase block">SPI</span>
                            <span className="text-xs font-mono font-semibold text-foreground">
                              {project.spi.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SLA */}
                      <div className="px-4 py-3 hidden lg:block">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-7 h-7 rounded-md flex items-center justify-center',
                            project.slaCompliance >= 90 ? 'bg-emerald-50 dark:bg-emerald-500/10' :
                            project.slaCompliance >= 75 ? 'bg-amber-50 dark:bg-amber-500/10' :
                            'bg-rose-50 dark:bg-rose-500/10'
                          )}>
                            <Shield className={cn(
                              'w-3.5 h-3.5',
                              project.slaCompliance >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                              project.slaCompliance >= 75 ? 'text-amber-600 dark:text-amber-400' :
                              'text-rose-600 dark:text-rose-400'
                            )} />
                          </div>
                          <span className={cn(
                            'text-xs font-mono font-semibold',
                            project.slaCompliance >= 90 ? 'text-emerald-700 dark:text-emerald-300' :
                            project.slaCompliance >= 75 ? 'text-amber-700 dark:text-amber-300' :
                            'text-rose-700 dark:text-rose-300'
                          )}>
                            {project.slaCompliance}%
                          </span>
                        </div>
                      </div>

                      {/* Issues */}
                      <div className="px-4 py-3 hidden lg:block">
                        <div className="flex items-center gap-2">
                          {project.activeBreaches > 0 ? (
                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[11px] font-semibold">
                              {project.activeBreaches}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                          {aiEnabled && project.agent && (
                            <Badge variant="outline" className="text-[10px] font-mono border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/10">
                              <Bot className="w-3 h-3 mr-1" />{project.agent}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="px-4 py-3 flex justify-end">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-[11px] font-medium px-2.5 py-0.5',
                            hCfg.color, 
                            hCfg.border, 
                            hCfg.bg
                          )}
                        >
                          {hCfg.label}
                        </Badge>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 bg-muted/20 dark:bg-muted/5 border-t border-line">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {/* Budget Card */}
                              <div className="p-3 rounded-lg bg-card border border-line">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="p-1.5 rounded-md bg-emerald-500/10">
                                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                  </div>
                                  <span className="text-xs font-semibold text-foreground">Budget</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-[10px] text-muted-foreground uppercase">BAC</p>
                                    <p className="text-lg font-mono font-bold text-foreground">{project.bac}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground uppercase">EAC</p>
                                    <p className="text-lg font-mono font-bold text-foreground">{project.eac}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Milestones Card */}
                              <div className="p-3 rounded-lg bg-card border border-line">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="p-1.5 rounded-md bg-violet-500/10">
                                    <Target className="w-3.5 h-3.5 text-violet-500" />
                                  </div>
                                  <span className="text-xs font-semibold text-foreground">Milestones</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                  <div>
                                    <p className="text-[10px] text-muted-foreground uppercase">Complete</p>
                                    <p className="text-lg font-mono font-bold text-emerald-500">
                                      {project.milestones.complete}/{project.milestones.total}
                                    </p>
                                  </div>
                                  {project.milestones.overdue > 0 && (
                                    <div>
                                      <p className="text-[10px] text-muted-foreground uppercase">Overdue</p>
                                      <p className="text-lg font-mono font-bold text-rose-500">{project.milestones.overdue}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="p-2 rounded-md bg-muted/30 border border-line">
                                  <p className="text-[10px] text-muted-foreground">Next Milestone</p>
                                  <p className="text-xs font-semibold text-foreground truncate">{project.nextMilestone.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground">{project.nextMilestone.date}</span>
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        'text-[9px] ml-auto py-0 h-4',
                                        healthConfig[project.nextMilestone.status].color,
                                        healthConfig[project.nextMilestone.status].border,
                                        healthConfig[project.nextMilestone.status].bg
                                      )}
                                    >
                                      {healthConfig[project.nextMilestone.status].label}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Team & Risks Card */}
                              <div className="p-3 rounded-lg bg-card border border-line">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="p-1.5 rounded-md bg-slate-500/10">
                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                  </div>
                                  <span className="text-xs font-semibold text-foreground">Team & Risks</span>
                                </div>
                                <div className="mb-2">
                                  <p className="text-[10px] text-muted-foreground uppercase">Team Size</p>
                                  <p className="text-sm font-medium text-foreground">
                                    {project.team.total} people <span className="text-muted-foreground text-xs">({project.team.contractors} contractors)</span>
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {project.risks.p1 > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20">
                                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                                      <span className="text-[10px] font-semibold text-rose-400">{project.risks.p1} P1</span>
                                    </div>
                                  )}
                                  {project.risks.p2 > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                                      <span className="text-[10px] font-semibold text-amber-400">{project.risks.p2} P2</span>
                                    </div>
                                  )}
                                  {project.risks.total === 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                      <span className="text-[10px] font-semibold text-emerald-400">No risks</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Key Issues */}
                            <div className="mt-3 p-3 rounded-lg bg-card border border-line">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-3.5 h-3.5 text-gold" />
                                <span className="text-xs font-semibold text-foreground">Key Issues</span>
                              </div>
                              <ul className="space-y-1">
                                {project.keyIssues.map((issue, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <span className="text-gold mt-0.5">-</span>
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
