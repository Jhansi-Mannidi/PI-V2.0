'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform, useInView } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  Shield,
  AlertTriangle,
  Bot,
  ChevronRight,
  UserPlus,
  Settings,
  TrendingDown,
  Calendar,
  Users,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { RoleReassignmentModal } from '@/components/role-reassignment-modal'

/* ── Animated Number Counter ── */
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })
  const spring = useSpring(0, { stiffness: 50, damping: 20 })
  const display = useTransform(spring, (current) => Math.round(current))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  useEffect(() => {
    return display.on('change', (latest) => {
      setDisplayValue(latest)
    })
  }, [display])

  return <span ref={ref} className={className}>{displayValue}</span>
}

/* ── Coverage Score Sparkline (13 weeks) ── */
const coverageHistory = [82, 80, 79, 78, 76, 77, 75, 73, 72, 71, 70, 69, 68]

function CoverageSparkline({ data, className }: { data: number[]; className?: string }) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })
  const w = 180
  const h = 40
  const min = Math.min(...data) - 5
  const max = Math.max(...data) + 5
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * h
    return `${x},${y}`
  })
  const line = pts.join(' ')
  const area = `0,${h} ${line} ${w},${h}`
  const endX = w
  const endY = h - ((data[data.length - 1] - min) / (max - min)) * h

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className={cn('overflow-visible', className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id="coverageGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
        </linearGradient>
        <clipPath id="revealClip">
          <motion.rect
            x="0"
            y="0"
            height={h}
            initial={{ width: 0 }}
            animate={isInView ? { width: w } : { width: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#revealClip)">
        <polygon points={area} fill="url(#coverageGrad)" />
        <polyline points={line} fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* end dot */}
      <motion.circle 
        cx={endX} 
        cy={endY} 
        r="3" 
        fill="var(--amber)"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.3, delay: 1.1 }}
      />
    </svg>
  )
}

/* ── Roles at Risk Data ── */
const rolesAtRisk = [
  {
    role: 'Contractor Compliance Reviewer',
    program: 'Portfolio-wide',
    fillerCount: 1,
    fillerColor: 'text-red' as const,
    primary: 'Sreya Mukherjee',
    backup: null,
    openItems: 14,
    status: 'CRITICAL' as const,
    statusNote: null,
    primaryMetrics: { concurrentTasks: 6, avgResponseTime: '4.2h' },
  },
  {
    role: 'Cost Engineer -- Central',
    program: 'Central',
    fillerCount: 1,
    fillerColor: 'text-red' as const,
    primary: 'Mike R.',
    backup: null,
    openItems: 8,
    status: 'CRITICAL' as const,
    statusNote: null,
    primaryMetrics: { concurrentTasks: 5, avgResponseTime: '3.8h' },
  },
  {
    role: 'Portfolio Controls Lead',
    program: 'Portfolio-wide',
    fillerCount: 1,
    fillerColor: 'text-amber' as const,
    primary: 'Hasit Chetal',
    backup: null,
    openItems: 22,
    status: 'AT RISK' as const,
    statusNote: 'Leave in 14d',
    primaryMetrics: { concurrentTasks: 8, avgResponseTime: '2.1h' },
  },
  {
    role: 'Schedule Variance Reviewer',
    program: 'West',
    fillerCount: 2,
    fillerColor: 'text-foreground' as const,
    primary: 'Alex T.',
    backup: 'Jordan M.',
    openItems: 6,
    status: 'OK' as const,
    statusNote: null,
    primaryMetrics: { concurrentTasks: 3, avgResponseTime: '1.5h' },
  },
]

const statusConfig = {
  CRITICAL: { bg: 'bg-red-bg', text: 'text-red', border: 'border-red/20' },
  'AT RISK': { bg: 'bg-amber-bg', text: 'text-amber', border: 'border-amber/20' },
  OK: { bg: 'bg-green-bg', text: 'text-green', border: 'border-green/20' },
}

/* ── Absence Calendar Data ── */
const weeks = ['W19', 'W20', 'W21', 'W22', 'W23', 'W24']
const absences = [
  { person: 'Hasit Chetal', start: 1, end: 2, backup: null, role: 'Portfolio Controls Lead' },
  { person: 'Brian Steinberg', start: 3, end: 4, backup: 'Jordan M.', role: 'Risk Analyst' },
  { person: 'Mike R.', start: 4, end: 5, backup: null, role: 'Cost Engineer -- Central' },
]

/* ── Concentration Heatmap Data ── */
const heatmapPeople = [
  'Sreya M.', 'Hasit C.', 'Mike R.', 'Brian St.', 'Brian Sm.',
  'Alex T.', 'Jordan M.', 'Mark T.', 'David K.', 'Jennifer M.',
]
const heatmapRoles = [
  'Compliance', 'Cost Eng.', 'Controls', 'Risk', 'Schedule', 'RFI Review', 'Approvals',
]

// Generate realistic concentration data (tasks per person per role)
const concentrationData: number[][] = [
  [6, 0, 0, 0, 0, 2, 1], // Sreya Mukherjee - heavy compliance
  [0, 0, 8, 2, 1, 0, 3], // Hasit Chetal - heavy controls
  [0, 5, 0, 0, 0, 0, 0], // Mike - heavy cost eng
  [0, 0, 0, 4, 0, 2, 0], // Brian Steinberg - risk + RFI
  [0, 0, 1, 0, 0, 0, 5], // Brian Smith - heavy approvals
  [0, 0, 0, 0, 3, 1, 0], // Alex - schedule
  [0, 0, 0, 1, 2, 1, 0], // Jordan - schedule backup
  [0, 0, 0, 0, 0, 4, 0], // Mark - RFI
  [0, 1, 0, 0, 1, 0, 0], // David - light
  [1, 0, 0, 0, 0, 0, 2], // Jennifer - compliance + approvals
]

function getCellIntensity(value: number, max: number) {
  if (value === 0) return 'bg-secondary/30 text-muted-foreground/20'
  const ratio = value / max
  if (ratio > 0.7) return 'bg-red-bg text-red dark:bg-red/20 dark:text-red'
  if (ratio > 0.4) return 'bg-amber-bg text-amber dark:bg-amber/20 dark:text-amber'
  return 'bg-teal-soft text-teal dark:bg-teal/15 dark:text-teal'
}

export default function KeyPersonRiskPage() {
  const maxConcentration = Math.max(...concentrationData.flat())
  const [reassignmentOpen, setReassignmentOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<typeof rolesAtRisk[0] | null>(null)

  const openReassignment = (role: typeof rolesAtRisk[0]) => {
    setSelectedRole(role)
    setReassignmentOpen(true)
  }

  return (
    <AppShell title="Key-Person Risk" subtitle="Single-person dependency visibility — A-203 Key-Person Risk Detector" activeHref="/analyst">
      <TooltipProvider>
        <div className="space-y-4 sm:space-y-6 w-full">

          {/* ── REGION 1: Coverage Score ── */}
          <div className="bg-card border border-line rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-amber" />
              <h3 className="font-sans text-base font-semibold text-foreground">Role Coverage Score</h3>
              <Badge variant="outline" className="text-[10px] font-mono border-teal/20 text-teal ml-auto">
                <Bot className="w-3 h-3 mr-1" />A-203
              </Badge>
              <span className="text-[10px] text-muted-foreground">Recalculated hourly</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8">
              {/* Score */}
              <div>
                <p className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground font-semibold mb-1">
                  Coverage Score
                </p>
                <div className="flex items-baseline gap-1.5">
                  <AnimatedNumber value={68} className="font-sans text-[56px] leading-none font-bold text-amber" />
                  <span className="font-mono text-xl text-muted-foreground">/100</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingDown className="w-3.5 h-3.5 text-red" />
                  <span className="text-xs font-semibold text-red">-14 pts (13 weeks)</span>
                </div>
              </div>

              {/* 13-week sparkline */}
              <div className="flex-1 max-w-[280px]">
                <p className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground font-semibold mb-2">
                  13-Week Trend
                </p>
                <CoverageSparkline data={coverageHistory} className="w-full h-[48px]" />
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] font-mono text-muted-foreground">W07</span>
                  <span className="text-[9px] font-mono text-muted-foreground">W19 (now)</span>
                </div>
              </div>

              {/* Context metrics */}
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[1px] text-muted-foreground font-semibold mb-1">Critical</p>
                  <AnimatedNumber value={2} className="text-2xl font-sans font-bold text-red block" />
                  <p className="text-[10px] text-muted-foreground">Roles</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[1px] text-muted-foreground font-semibold mb-1">At Risk</p>
                  <AnimatedNumber value={1} className="text-2xl font-sans font-bold text-amber block" />
                  <p className="text-[10px] text-muted-foreground">Role</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[1px] text-muted-foreground font-semibold mb-1">Covered</p>
                  <AnimatedNumber value={1} className="text-2xl font-sans font-bold text-green block" />
                  <p className="text-[10px] text-muted-foreground">Role</p>
                </div>
              </div>
            </div>

            {/* Coverage progress bar */}
            <div className="mt-5">
              <div className="h-3 rounded-full bg-muted overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '68%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                  style={{
                    background: 'linear-gradient(90deg, var(--red) 0%, var(--amber) 50%, var(--green) 100%)',
                    opacity: 0.85,
                  }}
                />
                {/* Marker at 68 */}
                <motion.div 
                  className="absolute top-0 h-full flex items-center"
                  initial={{ left: '0%', opacity: 0 }}
                  whileInView={{ left: '68%', opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                >
                  <div className="w-0.5 h-5 bg-foreground -mt-1 rounded-full" />
                </motion.div>
              </div>
              <div className="flex justify-between mt-1.5 text-[9px] font-mono text-muted-foreground">
                <span>0 -- Critical</span>
                <span>50 -- At Risk</span>
                <span>100 -- Fully Covered</span>
              </div>
            </div>
          </div>

          {/* ── REGION 2: Roles at Risk Table ── */}
          <div className="bg-card border border-line rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                <h3 className="font-sans text-base font-semibold text-foreground">Roles at Risk</h3>
                <span className="text-[10px] text-muted-foreground font-mono">4 roles tracked</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px]">
                  <p className="text-xs">Roles with single fillers (key-person risk) or fillers about to go on leave without backup. Enriched with Party Intelligence workload metrics.</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line bg-muted/30">
                    <th className="text-left px-5 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Program</th>
                    <th className="text-center px-3 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fillers</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Primary</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Backup</th>
                    <th className="text-center px-3 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Open Items</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rolesAtRisk.map((role) => {
                    const stCfg = statusConfig[role.status]
                    return (
                      <tr key={role.role} className="hover:bg-secondary/20 transition-colors group">
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-foreground">{role.role}</p>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="text-xs text-muted-foreground">{role.program}</span>
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <span className={cn('text-sm font-bold font-mono', role.fillerColor)}>
                            {role.fillerCount}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <div>
                            <p className="text-sm text-foreground font-medium">{role.primary}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {role.primaryMetrics.concurrentTasks} tasks
                              </span>
                              <span className="text-muted-foreground/30">|</span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {role.primaryMetrics.avgResponseTime} avg
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          {role.backup ? (
                            <span className="text-sm text-foreground">{role.backup}</span>
                          ) : (
                            <span className="text-sm font-semibold text-red">None</span>
                          )}
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <span className="text-sm font-mono font-bold text-foreground">{role.openItems}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold',
                            stCfg.bg, stCfg.text, 'border', stCfg.border
                          )}>
                            {role.status}
                            {role.statusNote && (
                              <span className="ml-1 font-normal opacity-80">-- {role.statusNote}</span>
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {role.status !== 'OK' ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-[10px] gap-1 border-gold/30 text-gold hover:bg-gold/10"
                              onClick={() => openReassignment(role)}
                            >
                              <UserPlus className="w-3 h-3" />
                              Assign backup
                            </Button>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/50">--</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── REGION 3: 6-Week Absence Calendar ── */}
          <div className="bg-card border border-line rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-gold" />
              <h3 className="font-sans text-base font-semibold text-foreground">Absence Calendar</h3>
              <span className="text-[10px] text-muted-foreground font-mono ml-auto">W19 -- W24 (6 weeks)</span>
            </div>

            <div className="relative">
              {/* Week headers */}
              <div className="grid gap-0" style={{ gridTemplateColumns: '120px repeat(6, 1fr)' }}>
                <div />
                {weeks.map((w) => (
                  <div key={w} className="text-center pb-2">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">{w}</span>
                  </div>
                ))}
              </div>

              {/* People rows */}
              {absences.map((absence) => (
                <div key={absence.person} className="grid gap-0 mb-2 items-center" style={{ gridTemplateColumns: '120px repeat(6, 1fr)' }}>
                  <div className="pr-3">
                    <p className="text-sm font-semibold text-foreground truncate">{absence.person}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{absence.role}</p>
                  </div>
                  {weeks.map((_, wi) => {
                    const isInRange = wi >= absence.start && wi <= absence.end
                    if (!isInRange) return <div key={wi} className="h-10 px-0.5"><div className="h-full rounded bg-muted/20" /></div>
                    const hasBackup = absence.backup !== null
                    const isStart = wi === absence.start
                    const isEnd = wi === absence.end
                    return (
                      <div key={wi} className="h-10 px-0.5">
                        <div className={cn(
                          'h-full flex items-center justify-center relative',
                          hasBackup ? 'bg-teal/20 border border-teal/30' : 'bg-red/15 border border-red/30',
                          isStart && 'rounded-l-lg',
                          isEnd && 'rounded-r-lg',
                          !isStart && !isEnd && 'border-l-0 border-r-0',
                          isStart && !isEnd && 'border-r-0',
                          !isStart && isEnd && 'border-l-0',
                        )}>
                          {isStart && (
                            <span className={cn(
                              'text-[10px] font-semibold',
                              hasBackup ? 'text-teal' : 'text-red'
                            )}>
                              {hasBackup ? absence.backup : 'No backup'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-line">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-teal/20 border border-teal/30" />
                  <span className="text-[10px] text-muted-foreground">Backup assigned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-red/15 border border-red/30" />
                  <span className="text-[10px] text-muted-foreground">No backup</span>
                  <AlertTriangle className="w-3 h-3 text-red ml-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* ── REGION 4: Concentration Heatmap ── */}
          <div className="bg-card border border-line rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gold" />
                <h3 className="font-sans text-base font-semibold text-foreground">Workload Concentration</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Info className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[280px]">
                    <p className="text-xs">Shows task load across people and roles. High concentration (red) indicates hidden single-point-of-failure patterns.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-secondary/30" />
                  <span className="text-muted-foreground">0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-teal-soft dark:bg-teal/15" />
                  <span className="text-muted-foreground">Low</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-bg dark:bg-amber/20" />
                  <span className="text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-red-bg dark:bg-red/20" />
                  <span className="text-muted-foreground">High</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Column headers */}
                <div className="grid gap-1" style={{ gridTemplateColumns: '100px repeat(7, 1fr)' }}>
                  <div />
                  {heatmapRoles.map((role) => (
                    <div key={role} className="text-center pb-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{role}</span>
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {heatmapPeople.map((person, pi) => (
                  <div key={person} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '100px repeat(7, 1fr)' }}>
                    <div className="flex items-center pr-2">
                      <span className="text-xs font-medium text-foreground truncate">{person}</span>
                    </div>
                    {concentrationData[pi].map((val, ri) => (
                      <Tooltip key={ri}>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            'h-9 rounded-md flex items-center justify-center cursor-default transition-all hover:ring-1 hover:ring-gold/40',
                            getCellIntensity(val, maxConcentration)
                          )}>
                            <span className="text-xs font-mono font-bold">
                              {val || ''}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs font-semibold">{person}</p>
                          <p className="text-xs opacity-70">{heatmapRoles[ri]}: {val} task{val !== 1 ? 's' : ''}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Concentration insights */}
            <div className="mt-4 pt-4 border-t border-line">
              <div className="flex items-start gap-2">
                <Bot className="w-4 h-4 text-teal mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-teal mb-1">Agent Insight (A-203)</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Sreya Mukherjee</span> holds 100% of Compliance review capacity (6 tasks, no backup). 
                    <span className="font-semibold text-foreground"> Hasit Chetal</span> concentrates Controls (8 tasks) with leave starting W20 -- zero coverage. 
                    <span className="font-semibold text-foreground"> Brian Smith</span> is sole Approvals authority (5 pending) -- any absence blocks the pipeline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>

      {/* Role Reassignment Modal */}
      <RoleReassignmentModal
        open={reassignmentOpen}
        onOpenChange={setReassignmentOpen}
        context={selectedRole ? {
          role: selectedRole.role,
          program: selectedRole.program,
          primary: selectedRole.primary,
          backup: selectedRole.backup,
          openItems: selectedRole.openItems,
        } : null}
      />
    </AppShell>
  )
}
