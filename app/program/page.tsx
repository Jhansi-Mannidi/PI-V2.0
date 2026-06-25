'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { KPICard } from '@/components/kpi-card'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  DollarSign,
  Clock,
  Users,
  Zap,
  Bot,
  Info,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAI } from '@/components/ai-provider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Animation variants - typed inline to satisfy framer-motion v12
const ease = [0.25, 0.46, 0.45, 0.94] as const

// Program KPI sparkline data (Central program - declining trend)
const cpiSparkline = [0.98, 0.97, 0.97, 0.96, 0.96, 0.95, 0.95, 0.94, 0.94, 0.94, 0.93, 0.93, 0.93]
const spiSparkline = [0.93, 0.92, 0.92, 0.91, 0.90, 0.90, 0.89, 0.89, 0.88, 0.88, 0.87, 0.87, 0.87]
const eacSparkline = [15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21]

// Central program projects - ranked by attention score
const projects = [
  {
    id: 'PRJ-001',
    name: 'Henderson Substation',
    attentionScore: 89,
    attentionReason: 'Highest budget variance, multiple P1 risks, CO pipeline blocked',
    cpi: 0.83,
    spi: 0.76,
    riskCount: 5,
    topIssue: 'Cost escalation — CO pipeline $7M pending',
    health: { cost: 'red', schedule: 'red', risk: 'red', people: 'amber' },
    budget: { bac: 145, eac: 162, spent: 98 },
    agent: 'A-103',
  },
  {
    id: 'PRJ-002',
    name: 'Pryor Creek New Build',
    attentionScore: 72,
    attentionReason: 'Schedule compression, 3 milestone gates at risk',
    cpi: 0.87,
    spi: 0.79,
    riskCount: 4,
    topIssue: 'Schedule pressure — 3 milestones at risk',
    health: { cost: 'amber', schedule: 'red', risk: 'amber', people: 'green' },
    budget: { bac: 89, eac: 97, spent: 52 },
    agent: 'A-202',
  },
  {
    id: 'PRJ-003',
    name: 'Council Bluffs Phase 4',
    attentionScore: 34,
    attentionReason: 'Minor RFI backlog, otherwise on track',
    cpi: 1.01,
    spi: 0.97,
    riskCount: 1,
    topIssue: 'RFI backlog — 4 open, oldest 8 days',
    health: { cost: 'green', schedule: 'green', risk: 'green', people: 'green' },
    budget: { bac: 67, eac: 66, spent: 41 },
    agent: null,
  },
]

// This Week's Focus items from Bottleneck Detector Agent (A-202)
const focusItems = [
  {
    id: 1,
    priority: 'critical',
    title: 'Resolve Henderson CO-0087',
    description: '$2.4M blocking substation work',
    detail: '1d 2h past SLA',
    link: '/change-orders',
    agent: 'A-202',
  },
  {
    id: 2,
    priority: 'high',
    title: 'Assign backup Cost Engineer for Central',
    description: 'Single-threaded dependency on Mike R.',
    detail: 'Key-person risk',
    link: '/analyst',
    agent: 'A-202',
  },
  {
    id: 3,
    priority: 'high',
    title: 'Clear Pryor Creek legal review backlog',
    description: '3 contractor onboardings blocked',
    detail: '2 past SLA',
    link: '/orchestration',
    agent: 'A-202',
  },
  {
    id: 4,
    priority: 'medium',
    title: 'Review Dallas Cooling P6 delta',
    description: 'Critical path shifted, SPI slip accelerating',
    detail: 'Schedule risk',
    link: '/projects',
    agent: 'A-104',
  },
  {
    id: 5,
    priority: 'medium',
    title: 'Approve Pryor Creek budget revision',
    description: 'Pending 9 days, blocking commitments',
    detail: 'Brian approval',
    link: '/change-orders',
    agent: 'A-202',
  },
]

const healthDotColor = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
}

const healthLabels = {
  cost: 'Cost',
  schedule: 'Schedule',
  risk: 'Risk',
  people: 'People',
}

const priorityConfig = {
  critical: { bg: 'bg-red-500/5', border: 'border-red-500/20', dot: 'bg-red-500 animate-pulse-dot', text: 'text-foreground' },
  high: { bg: 'bg-amber-500/5', border: 'border-amber-500/15', dot: 'bg-amber-500', text: 'text-muted-foreground' },
  medium: { bg: 'bg-muted/20', border: 'border-line', dot: 'bg-muted-foreground/40', text: 'text-muted-foreground' },
}

export default function ProgramScorecard() {
  const { aiEnabled } = useAI()
  const [expandedAttention, setExpandedAttention] = React.useState<string | null>(null)

  return (
    <AppShell
      title="Program Scorecard — Central"
      subtitle="Program Manager's morning view"
      activeHref="/program"
    >
      <TooltipProvider>
        <motion.div 
          className="space-y-4 sm:space-y-6 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* ─── Program KPI Strip ─── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="font-sans text-base sm:text-lg font-semibold text-foreground">
                  Central Program Health
                </h3>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                  3 active projects &middot; $301M total BAC
                </p>
              </motion.div>
              <Badge variant="outline" className="text-[10px] font-mono border-line text-muted-foreground w-fit">
                <Bot className="w-3 h-3 mr-1" />
                Monitored by A-202
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <KPICard
                label="Program CPI"
                value="0.93"
                delta="0.02 vs last week"
                trend="down"
                sparklineData={cpiSparkline}
                accentColor="amber"
                source="Earned Value"
              />
              <KPICard
                label="Program SPI"
                value="0.87"
                delta="0.03 vs last week"
                trend="down"
                sparklineData={spiSparkline}
                accentColor="red"
                source="Earned Value"
              />
              <KPICard
                label="EAC vs BAC"
                value="+$21M"
                delta="7% over budget"
                trend="up"
                sparklineData={eacSparkline}
                accentColor="red"
                source="Cost Control"
              />
              <KPICard
                label="Open P1 Risks"
                value="5"
                delta="1 vs last week"
                trend="up"
                accentColor="amber"
                source="Risk Register"
              />
              <KPICard
                label="Predicted SLA Risks"
                value="2"
                delta="next 72h"
                trend="flat"
                accentColor="amber"
                source="Orchestration ML"
                className="col-span-2 sm:col-span-1"
              />
            </div>
          </motion.section>

          {/* ─── Project Cards Grid ─── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="font-sans text-base sm:text-lg font-semibold text-foreground">
                  Projects by Attention Score
                </h3>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                  Ranked by urgency — click to view Project Health
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, index) => {
                const isExpanded = expandedAttention === project.id
                return (
                  <motion.a
                    key={project.id}
                    href="/projects"
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease }}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                    className={cn(
                      'block bg-card border border-line rounded-xl overflow-hidden',
                      'transition-all duration-200 hover:shadow-lg hover:border-gold/30 dark:hover:border-gold/20',
                      'group focus:outline-none focus:ring-2 focus:ring-gold/40',
                      index === 0 && 'md:col-span-2' // First (worst) project spans full width
                    )}
                  >
                    {/* Attention Score Bar */}
                    <div className="h-1 bg-secondary">
                      <div
                        className={cn(
                          'h-full transition-all',
                          project.attentionScore >= 70 ? 'bg-gradient-to-r from-red-500 to-red-400' : 
                          project.attentionScore >= 40 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 
                          'bg-gradient-to-r from-teal-500 to-emerald-400'
                        )}
                        style={{ width: `${project.attentionScore}%` }}
                      />
                    </div>

                    <div className="p-4 sm:p-5">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-sans text-base sm:text-lg font-bold text-foreground truncate">
                              {project.name}
                            </h4>
                            {aiEnabled && project.agent && (
                              <Badge variant="outline" className="text-[9px] font-mono border-line text-muted-foreground shrink-0">
                                <Bot className="w-2.5 h-2.5 mr-0.5" />{project.agent}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">{project.id}</p>
                        </div>

                        {/* Attention Score with explainer */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                setExpandedAttention(isExpanded ? null : project.id)
                              }}
                              className={cn(
                                'flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors',
                                project.attentionScore >= 70 
                                  ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15' 
                                  : project.attentionScore >= 40 
                                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15' 
                                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15'
                              )}
                            >
                              <span className="text-lg font-mono font-bold">{project.attentionScore}</span>
                              <Info className="w-3 h-3 opacity-50" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-[200px]">
                            <p className="text-xs">{project.attentionReason}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Health dots row */}
                      <div className="flex items-center gap-3 mb-4">
                        {(Object.keys(project.health) as Array<keyof typeof project.health>).map((key) => (
                          <Tooltip key={key}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5">
                                <div className={cn('w-2.5 h-2.5 rounded-full', healthDotColor[project.health[key] as keyof typeof healthDotColor])} />
                                <span className="text-[10px] text-muted-foreground capitalize">{healthLabels[key]}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{healthLabels[key]}: {project.health[key].toUpperCase()}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>

                      {/* Metrics row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">CPI</p>
                          <p className={cn(
                            'text-lg font-mono font-bold',
                            project.cpi >= 1.0 ? 'text-emerald-400' : project.cpi >= 0.9 ? 'text-amber-400' : 'text-red-400'
                          )}>
                            {project.cpi.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">SPI</p>
                          <p className={cn(
                            'text-lg font-mono font-bold',
                            project.spi >= 1.0 ? 'text-emerald-400' : project.spi >= 0.9 ? 'text-amber-400' : 'text-red-400'
                          )}>
                            {project.spi.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">P1 Risks</p>
                          <p className={cn(
                            'text-lg font-mono font-bold',
                            project.riskCount >= 4 ? 'text-red-400' : project.riskCount >= 2 ? 'text-amber-400' : 'text-emerald-400'
                          )}>
                            {project.riskCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Budget</p>
                          <p className="text-sm font-mono text-foreground">
                            <span className={cn(
                              project.budget.spent / project.budget.bac > 0.9 ? 'text-amber-400' : 'text-foreground'
                            )}>
                              ${project.budget.spent}M
                            </span>
                            <span className="text-muted-foreground"> / </span>
                            <span className="text-muted-foreground">${project.budget.bac}M</span>
                          </p>
                        </div>
                      </div>

                      {/* Top issue callout */}
                      <div className={cn(
                        'flex items-start gap-2 p-3 rounded-lg border',
                        project.attentionScore >= 70 
                          ? 'border-red-500/20 bg-red-500/5' 
                          : project.attentionScore >= 40 
                          ? 'border-amber-500/20 bg-amber-500/5' 
                          : 'border-line bg-muted/30'
                      )}>
                        <AlertTriangle className={cn(
                          'w-4 h-4 shrink-0 mt-0.5',
                          project.attentionScore >= 70 ? 'text-red-400' : project.attentionScore >= 40 ? 'text-amber-400' : 'text-muted-foreground'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground">Top Issue</p>
                          <p className="text-[11px] text-muted-foreground">{project.topIssue}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </motion.section>

          {/* ─── This Week's Focus ─── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-sans text-base sm:text-lg font-semibold text-foreground">
                  This Week&apos;s Focus
                </h3>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                  Prioritized by Bottleneck Detector Agent (A-202)
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-line text-muted-foreground">
                <Bot className="w-3 h-3 mr-1" />A-202
              </Badge>
            </div>

            <div className="bg-card border border-line rounded-xl overflow-hidden">
              <div className="divide-y divide-line">
                {focusItems.map((item, index) => {
                  const cfg = priorityConfig[item.priority as keyof typeof priorityConfig]
                  return (
                    <motion.a
                      key={item.id}
                      href={item.link}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05, ease }}
                      className={cn(
                        'flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 transition-colors group'
                      )}
                    >
                      {/* Priority number */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold bg-muted text-foreground">
                        {index + 1}
                      </div>

                      {/* Priority dot */}
                      <div className={cn('w-2 h-2 rounded-full shrink-0', cfg.dot)} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
                      </div>

                      {/* Detail chip */}
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'text-[10px] shrink-0 hidden sm:flex',
                          item.priority === 'critical' 
                            ? 'border-red-500/30 text-red-400 bg-red-500/10' 
                            : item.priority === 'high' 
                            ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' 
                            : 'border-line text-muted-foreground'
                        )}
                      >
                        {item.detail}
                      </Badge>

                      {/* Agent badge */}
                      {aiEnabled && (
                        <Badge variant="outline" className="text-[10px] font-mono border-line text-muted-foreground shrink-0 hidden md:flex">
                          <Bot className="w-3 h-3 mr-1" />{item.agent}
                        </Badge>
                      )}

                      {/* Link indicator */}
                      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  )
                })}
              </div>

              {/* Agent insight footer */}
              <motion.div 
                className="px-4 sm:px-5 py-3 bg-teal/5 border-t border-line flex items-start gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Bot className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-teal">A-202 Analysis:</span> Henderson CO-0087 is the highest leverage item. 
                  Resolving it unblocks $2.4M in committed spend and clears 3 downstream dependencies. 
                  Estimated portfolio impact: +0.02 CPI if resolved by EOD Thursday.
                </p>
              </motion.div>
            </div>
          </motion.section>
        </motion.div>
      </TooltipProvider>
    </AppShell>
  )
}
