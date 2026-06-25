'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { useActionModal } from '@/hooks/use-action-modal'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Building2,
  DollarSign,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Search,
  ChevronRight,
  AlertTriangle,
  Target,
  Users,
  Calendar,
  Sliders,
  Zap,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/* ── Mock Project Data ── */
interface Project {
  id: string
  name: string
  site: string
  estimatedCost: number
  strategicScore: number
  riskScore: number
  readiness: 'Ready' | 'Missing Data' | 'Re-estimate'
  owner: string
  status: 'Approved' | 'Pending' | 'Deferred' | 'Rejected'
}

const sites = ['Council Bluffs', 'Papillion', 'Henderson', 'Pryor Creek', 'Mesa', 'New Albany', 'Mayes County', 'The Dalles']
const owners = ['Marcus T.', 'Jennifer M.', 'Robert K.', 'Sarah L.', 'David W.', 'Amanda P.']
const statuses: Project['status'][] = ['Approved', 'Pending', 'Deferred', 'Rejected']
const readinessOptions: Project['readiness'][] = ['Ready', 'Missing Data', 'Re-estimate']

// Generate 1287 mock projects
const generateProjects = (): Project[] => {
  const projects: Project[] = []
  for (let i = 1; i <= 1287; i++) {
    const status = i <= 412 ? 'Approved' : i <= 730 ? 'Pending' : i <= 900 ? 'Deferred' : 'Rejected'
    const readiness = i <= 412 ? 'Ready' : i <= 501 ? 'Missing Data' : i <= 657 ? 'Re-estimate' : readinessOptions[Math.floor(Math.random() * 3)]
    projects.push({
      id: `PRJ-${String(i).padStart(4, '0')}`,
      name: `Retrofit ${sites[i % sites.length]} ${['UPS', 'HVAC', 'Electrical', 'Cooling', 'Structural', 'Fire Suppression', 'Generator', 'PDU'][i % 8]} #${Math.floor(i / 8) + 1}`,
      site: sites[i % sites.length],
      estimatedCost: Math.round((Math.random() * 4 + 0.2) * 10) / 10, // $0.2M - $4.2M
      strategicScore: Math.floor(Math.random() * 40 + 60), // 60-100
      riskScore: Math.floor(Math.random() * 50 + 10), // 10-60
      readiness,
      owner: owners[i % owners.length],
      status,
    })
  }
  return projects
}

const allProjects = generateProjects()

/* ── Budget Presets for What-If ── */
const budgetPresets = [
  { label: '$1.0B', value: 1.0, cutLine: 380 },
  { label: '$1.2B (Current)', value: 1.2, cutLine: 412 },
  { label: '$1.4B', value: 1.4, cutLine: 520 },
]

export default function AnnualPlanningPage() {
  const [siteFilter, setSiteFilter] = React.useState<string>('all')
  const [ownerFilter, setOwnerFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [costBandFilter, setCostBandFilter] = React.useState<string>('all')
  const [readinessFilter, setReadinessFilter] = React.useState<string>('all')
  const [budgetPreset, setBudgetPreset] = React.useState(1) // Index into budgetPresets
  const action = useActionModal()
  const [riskTolerance, setRiskTolerance] = React.useState(50)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Filter projects
  const filteredProjects = React.useMemo(() => {
    return allProjects.filter(p => {
      if (siteFilter !== 'all' && p.site !== siteFilter) return false
      if (ownerFilter !== 'all' && p.owner !== ownerFilter) return false
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (readinessFilter !== 'all' && p.readiness !== readinessFilter) return false
      if (costBandFilter !== 'all') {
        if (costBandFilter === 'under1m' && p.estimatedCost >= 1) return false
        if (costBandFilter === '1m-2m' && (p.estimatedCost < 1 || p.estimatedCost >= 2)) return false
        if (costBandFilter === '2m-3m' && (p.estimatedCost < 2 || p.estimatedCost >= 3)) return false
        if (costBandFilter === 'over3m' && p.estimatedCost < 3) return false
      }
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.id.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [siteFilter, ownerFilter, statusFilter, costBandFilter, readinessFilter, searchQuery])

  // Counts
  const readyCounts = allProjects.filter(p => p.readiness === 'Ready').length
  const missingDataCounts = allProjects.filter(p => p.readiness === 'Missing Data').length
  const reEstimateCounts = allProjects.filter(p => p.readiness === 'Re-estimate').length

  // Current week (simulate mid-June in the Aug consolidation window)
  const consolidationWeeks = 12 // 3 months
  const currentWeek = 6 // Mid-way

  const currentCutLine = budgetPresets[budgetPreset].cutLine

  const statusConfig: Record<Project['status'], { bg: string; text: string }> = {
    'Approved': { bg: 'bg-green/10', text: 'text-green' },
    'Pending': { bg: 'bg-amber/10', text: 'text-amber' },
    'Deferred': { bg: 'bg-slate/10', text: 'text-slate' },
    'Rejected': { bg: 'bg-red/10', text: 'text-red' },
  }

  const readinessConfig: Record<Project['readiness'], { bg: string; text: string }> = {
    'Ready': { bg: 'bg-green/10', text: 'text-green' },
    'Missing Data': { bg: 'bg-amber/10', text: 'text-amber' },
    'Re-estimate': { bg: 'bg-red/10', text: 'text-red' },
  }

  return (
    <AppShell title="Annual Planning" subtitle="Retrofits Portfolio — Marcus T. (Preview)" activeHref="/planning">
      <div className="space-y-5 max-w-[1600px]">
        {/* ── REGION 1: Top KPI Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-xl border border-line p-5"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg border border-line">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Projects in Funnel</span>
              </div>
              <p className="text-2xl font-mono font-bold text-foreground">1,287</p>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg border border-line">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-gold" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Annual Budget</span>
              </div>
              <p className="text-2xl font-mono font-bold text-foreground">$1.2B</p>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg border border-line">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Currently Approved</span>
              </div>
              <p className="text-2xl font-mono font-bold text-green">412</p>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg border border-line">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Awaiting Decision</span>
              </div>
              <p className="text-2xl font-mono font-bold text-amber">318</p>
            </div>
          </div>
        </motion.div>

        {/* ── REGION 3: August Consolidation Progress Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-xl border border-line p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">August Consolidation Window</h3>
          </div>

          {/* Timeline */}
          <div className="relative h-8 bg-muted rounded-lg overflow-hidden mb-4">
            {/* Progress fill */}
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold/60"
              style={{ width: `${(currentWeek / consolidationWeeks) * 100}%` }}
            />
            {/* Current week marker */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-gold shadow-[0_0_8px_rgba(212,160,76,0.6)]"
              style={{ left: `${(currentWeek / consolidationWeeks) * 100}%` }}
            />
            {/* Week labels */}
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span className="text-[10px] font-semibold text-foreground/80">June 1</span>
              <span className="text-[10px] font-bold text-gold bg-card/90 dark:bg-navy/80 px-2 py-0.5 rounded border border-gold/30">Week {currentWeek}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">August 31</span>
            </div>
          </div>

          {/* Clickable stats */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => setReadinessFilter(readinessFilter === 'Ready' ? 'all' : 'Ready')}
              className={cn(
                'p-3 rounded-lg border transition-all text-left',
                readinessFilter === 'Ready' 
                  ? 'bg-green/10 border-green/30' 
                  : 'bg-secondary/30 border-line hover:border-green/30'
              )}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Ready for Review</p>
              <p className="text-xl font-mono font-bold text-green">{readyCounts}</p>
            </button>

            <button 
              onClick={() => setReadinessFilter(readinessFilter === 'Missing Data' ? 'all' : 'Missing Data')}
              className={cn(
                'p-3 rounded-lg border transition-all text-left',
                readinessFilter === 'Missing Data' 
                  ? 'bg-amber/10 border-amber/30' 
                  : 'bg-secondary/30 border-line hover:border-amber/30'
              )}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Missing Data</p>
              <p className="text-xl font-mono font-bold text-amber">{missingDataCounts}</p>
            </button>

            <button 
              onClick={() => setReadinessFilter(readinessFilter === 'Re-estimate' ? 'all' : 'Re-estimate')}
              className={cn(
                'p-3 rounded-lg border transition-all text-left',
                readinessFilter === 'Re-estimate' 
                  ? 'bg-red/10 border-red/30' 
                  : 'bg-secondary/30 border-line hover:border-red/30'
              )}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Requiring Re-estimate</p>
              <p className="text-xl font-mono font-bold text-red">{reEstimateCounts}</p>
            </button>
          </div>
        </motion.div>

        {/* ── REGION 4: What-If Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-card dark:bg-gradient-to-br dark:from-navy dark:via-navy-mid dark:to-navy rounded-xl border border-line dark:border-gold/20 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-primary dark:text-gold" />
            <h3 className="text-sm font-semibold text-foreground">What-If Simulator</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Budget Slider */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 block">
                Total Budget
              </label>
              <div className="flex gap-2">
                {budgetPresets.map((preset, idx) => (
                  <button
                    key={preset.label}
                    onClick={() => setBudgetPreset(idx)}
                    className={cn(
                      'flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all',
                      budgetPreset === idx
                        ? 'bg-primary dark:bg-gold text-primary-foreground dark:text-navy'
                        : 'bg-muted dark:bg-white/10 text-muted-foreground dark:text-white/70 hover:bg-muted/80 dark:hover:bg-white/20'
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Cut-line at project #{budgetPresets[budgetPreset].cutLine}
              </p>
            </div>

            {/* Risk Tolerance Slider */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 block">
                Risk Tolerance: {riskTolerance}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(Number(e.target.value))}
                className="w-full h-2 bg-muted dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-gold"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
          </div>

          {/* Impact Preview */}
          <div className="mt-4 p-3 bg-secondary/50 dark:bg-white/5 rounded-lg border border-line dark:border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {budgetPreset > 1 ? (
                    <TrendingUp className="w-4 h-4 text-green" />
                  ) : budgetPreset < 1 ? (
                    <TrendingDown className="w-4 h-4 text-red" />
                  ) : (
                    <Target className="w-4 h-4 text-primary dark:text-gold" />
                  )}
                  <span className="text-sm text-foreground">
                    {budgetPreset === 0 ? '32 projects drop below cut-line' :
                     budgetPreset === 2 ? '108 additional projects funded' :
                     'Current baseline'}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                className="h-7 text-xs bg-primary dark:bg-gold hover:bg-primary/90 dark:hover:bg-gold/90 text-primary-foreground dark:text-navy"
                onClick={() =>
                  action.open({
                    tone: 'primary',
                    icon: Zap,
                    title: 'Apply Budget Scenario',
                    description: 'Locks the selected scenario as the working baseline. All downstream forecasts and program scorecards will recompute.',
                    context: [
                      { label: 'Scenario', value: budgetPresets[budgetPreset].label },
                      { label: 'Cut Line', value: `Project #${budgetPresets[budgetPreset].cutLine}` },
                      { label: 'Budget', value: `$${(budgetPresets[budgetPreset].value / 1_000_000).toFixed(1)}M` },
                    ],
                    fields: [
                      {
                        type: 'select',
                        name: 'effectiveDate',
                        label: 'Effective Date',
                        required: true,
                        options: [
                          { value: 'now', label: 'Immediately' },
                          { value: 'fy', label: 'Start of next fiscal year' },
                          { value: 'q', label: 'Start of next quarter' },
                        ],
                      },
                      { type: 'textarea', name: 'rationale', label: 'Approval Rationale', required: true, rows: 3 },
                    ],
                    confirmLabel: 'Apply Scenario',
                    successToast: 'Scenario applied',
                    successDescription: 'Portfolio recalculating · all stakeholders notified',
                  })
                }
              >
                Apply Scenario
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ── REGION 2: Prioritization Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card rounded-xl border border-line overflow-hidden"
        >
          {/* Filter Bar */}
          <div className="p-4 border-b border-line bg-secondary/20">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 pr-3 text-xs rounded-lg border border-line bg-background focus:outline-none focus:ring-1 focus:ring-gold w-[180px]"
                />
              </div>

              <Select value={siteFilter} onValueChange={setSiteFilter}>
                <SelectTrigger className="h-8 w-[140px] text-xs border-line">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {sites.map(site => (
                    <SelectItem key={site} value={site}>{site}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger className="h-8 w-[140px] text-xs border-line">
                  <SelectValue placeholder="Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {owners.map(owner => (
                    <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-[130px] text-xs border-line">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={costBandFilter} onValueChange={setCostBandFilter}>
                <SelectTrigger className="h-8 w-[130px] text-xs border-line">
                  <SelectValue placeholder="Cost Band" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Costs</SelectItem>
                  <SelectItem value="under1m">Under $1M</SelectItem>
                  <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                  <SelectItem value="2m-3m">$2M - $3M</SelectItem>
                  <SelectItem value="over3m">Over $3M</SelectItem>
                </SelectContent>
              </Select>

              <span className="text-xs text-muted-foreground ml-auto">
                Showing {filteredProjects.length} of 1,287 projects
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-card border-b border-line shadow-[0_1px_0_0_var(--border)]">
                  <th className="text-left px-4 py-3 w-[200px] bg-card">Project</th>
                  <th className="text-left px-3 py-3 bg-card">Site</th>
                  <th className="text-right px-3 py-3 bg-card">Est. Cost</th>
                  <th className="text-center px-3 py-3 bg-card">Strategic</th>
                  <th className="text-center px-3 py-3 bg-card">Risk</th>
                  <th className="text-center px-3 py-3 bg-card">Readiness</th>
                  <th className="text-left px-3 py-3 bg-card">Owner</th>
                  <th className="text-center px-3 py-3 bg-card">Status</th>
                  <th className="text-center px-3 py-3 w-[180px] bg-card">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredProjects.slice(0, 50).map((project, idx) => {
                  const isAboveCutLine = idx < currentCutLine
                  return (
                    <tr 
                      key={project.id} 
                      className={cn(
                        'hover:bg-secondary/30 transition-colors',
                        !isAboveCutLine && 'opacity-50'
                      )}
                    >
                      <td className="px-4 py-2.5">
                        <div>
                          <p className="font-medium text-foreground text-xs truncate max-w-[180px]">{project.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{project.id}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{project.site}</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className="font-mono text-xs font-semibold text-foreground">${project.estimatedCost.toFixed(1)}M</span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={cn(
                          'font-mono text-xs font-semibold',
                          project.strategicScore >= 80 ? 'text-green' :
                          project.strategicScore >= 70 ? 'text-amber' : 'text-muted-foreground'
                        )}>
                          {project.strategicScore}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={cn(
                          'font-mono text-xs font-semibold',
                          project.riskScore <= 25 ? 'text-green' :
                          project.riskScore <= 40 ? 'text-amber' : 'text-red'
                        )}>
                          {project.riskScore}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <Badge 
                          variant="outline" 
                          className={cn('text-[9px]', readinessConfig[project.readiness].bg, readinessConfig[project.readiness].text)}
                        >
                          {project.readiness}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{project.owner}</td>
                      <td className="px-3 py-2.5 text-center">
                        <Badge 
                          variant="outline" 
                          className={cn('text-[9px]', statusConfig[project.status].bg, statusConfig[project.status].text)}
                        >
                          {project.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 rounded bg-green/10 text-green hover:bg-green/20 transition-all" title="Promote">
                            <Play className="w-3 h-3" />
                          </button>
                          <button className="p-1.5 rounded bg-amber/10 text-amber hover:bg-amber/20 transition-all" title="Hold">
                            <Pause className="w-3 h-3" />
                          </button>
                          <button className="p-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-all" title="Cue">
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Cut-line indicator */}
          {filteredProjects.length > currentCutLine && (
            <div className="px-4 py-2 bg-gold/10 border-t border-gold/20 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-gold" />
              <span className="text-[11px] text-gold font-medium">
                Cut-line at #{currentCutLine} — Projects below are outside current budget allocation
              </span>
            </div>
          )}
        </motion.div>
      </div>
      {action.element}
    </AppShell>
  )
}
