'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  AlertTriangle,
  FileText,
  Shield,
  Zap,
  CalendarDays,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AnimNum, FadeUp, GrowBar } from '@/components/animated-primitives'

// ── Types ──

interface VarianceDriver {
  id: string
  project: string
  program: string
  contribution: number
  cpiPrev: number
  cpiCurr: number
  impact: string
  details: string[]
  factors: string[]
  partyIntel?: {
    contractor: string
    metric: string
    trend: 'up' | 'down'
  }
  source: {
    metric: string
    asOf: string
  }
}

interface ReasoningStep {
  step: number
  action: string
  detail: string
  sources: string[]
}

// ── Mock Data by Metric Type ──

const metricLabels: Record<string, string> = {
  cpi: 'CPI (Cost)',
  spi: 'SPI (Schedule)',
  eac: 'EAC vs BAC',
  sla: 'SLA Compliance',
}

const periodLabels: Record<string, string> = {
  '1w': 'this week',
  '2w': 'last 2 weeks',
  '4w': 'last 4 weeks',
  '13w': 'last 13 weeks',
}

const narrativeByMetric: Record<string, { value: string; change: string; prev: string; curr: string; direction: 'down' | 'up'; wow: string; context: string }> = {
  cpi: { value: '0.02', change: '-0.02', prev: '0.96', curr: '0.94', direction: 'down', wow: '-2.1%', context: 'Second consecutive decline, lowest in trailing 13 weeks.' },
  spi: { value: '0.03', change: '-0.03', prev: '0.91', curr: '0.88', direction: 'down', wow: '-3.3%', context: 'Schedule pressure increasing across 3 critical path projects.' },
  eac: { value: '$2.4M', change: '+$2.4M', prev: '$48.2M', curr: '$50.6M', direction: 'up', wow: '+5.0%', context: 'EAC growth driven by scope changes and rework costs.' },
  sla: { value: '4%', change: '-4%', prev: '89%', curr: '85%', direction: 'down', wow: '-4.5%', context: 'Compliance dropped below 90% threshold for first time in Q2.' },
}

const varianceDrivers: VarianceDriver[] = [
  {
    id: 'henderson',
    project: 'Henderson Substation',
    program: 'Central',
    contribution: 60,
    cpiPrev: 0.86,
    cpiCurr: 0.83,
    impact: '$1.2M unplanned electrical rework (cost codes 26100–26400). $0.8M CO-0087 pending.',
    details: [
      'Electrical rework triggered by design change RFI-1122',
      'Three invoices from Acme Electrical pending three-way match',
      'CO-0087 approval delayed 9 days, blocking commitment release',
    ],
    factors: ['Rework', 'CO pipeline', 'Design change'],
    partyIntel: {
      contractor: 'Acme Electrical',
      metric: 'SLA miss rate +6% vs baseline',
      trend: 'up',
    },
    source: {
      metric: 'CPI - Henderson Substation',
      asOf: '2026-04-18T14:30:00Z',
    },
  },
  {
    id: 'pryor',
    project: 'Pryor Creek New Build',
    program: 'Central',
    contribution: 28,
    cpiPrev: 0.89,
    cpiCurr: 0.87,
    impact: '$0.6M standby costs from contractor mobilization delays. 3 invoices pending three-way match.',
    details: [
      'Primary contractor Pacific Electrical mobilization took 3.2 days vs 1.5 day target',
      'Standby equipment costs accruing at $45K/day',
      'Invoice reconciliation backlog (oldest: INV-4421, 8 days)',
    ],
    factors: ['Contractor mobilization', 'Standby costs', 'Invoice backlog'],
    partyIntel: {
      contractor: 'Pacific Electrical',
      metric: 'mobilization time trending up',
      trend: 'up',
    },
    source: {
      metric: 'CPI - Pryor Creek New Build',
      asOf: '2026-04-18T14:30:00Z',
    },
  },
  {
    id: 'mesa',
    project: 'Mesa Power Upgrade',
    program: 'West',
    contribution: 12,
    cpiPrev: 0.97,
    cpiCurr: 0.95,
    impact: 'RFI-1188 scope clarification adding $0.3M.',
    details: [
      'Scope clarification on switchgear configuration',
      'Additional labor hours authorized via CO-0091',
      'Timeline impact contained to current milestone',
    ],
    factors: ['RFI scope change'],
    source: {
      metric: 'CPI - Mesa Power Upgrade',
      asOf: '2026-04-18T14:30:00Z',
    },
  },
]

const agentReasoningTrace: ReasoningStep[] = [
  {
    step: 1,
    action: 'Query semantic layer',
    detail: 'Retrieved portfolio_cpi metric for trailing 13 weeks with project-level decomposition',
    sources: ['semantic_layer.portfolio_cpi', 'semantic_layer.project_cpi_breakdown'],
  },
  {
    step: 2,
    action: 'Detect anomaly',
    detail: 'Identified 0.02 decline (0.96 → 0.94), flagged as significant (2nd consecutive decline, lowest in 13w)',
    sources: ['anomaly_detector.portfolio_metrics'],
  },
  {
    step: 3,
    action: 'Decompose variance',
    detail: 'Ran Shapley value attribution across 8 active projects. Top 3 contributors account for 100% of variance.',
    sources: ['variance_analyzer.shapley_attribution'],
  },
  {
    step: 4,
    action: 'Enrich with Party Intelligence',
    detail: 'Cross-referenced contractor performance for top variance drivers. Acme Electrical SLA miss rate elevated.',
    sources: ['party_intelligence.contractor_metrics', 'party_intelligence.sla_miss_rate_90d'],
  },
  {
    step: 5,
    action: 'Generate narrative',
    detail: 'Assembled executive summary with source citations and confidence intervals',
    sources: ['narrative_generator.variance_explainer'],
  },
]

// ── Page Component ──

export default function VarianceExplainer() {
  const [selectedMetric, setSelectedMetric] = React.useState('eac')
  const [selectedPeriod, setSelectedPeriod] = React.useState('2w')
  const [expandedDriver, setExpandedDriver] = React.useState<string | null>('henderson')
  const [showReasoning, setShowReasoning] = React.useState(false)

  return (
    <AppShell
      title="Variance Explainer"
      subtitle="Agent-generated variance analysis — A-302 Tier 3"
      activeHref="/variance"
    >
      <TooltipProvider>
        <motion.div 
          className="max-w-[1100px] space-y-4 sm:space-y-6"
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
          {/* ── HEADER: Selectors + Agent Badge ── */}
          <motion.header 
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="h-9 w-[140px] text-xs border-line">
                  <SelectValue placeholder="Metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpi">CPI (Cost)</SelectItem>
                  <SelectItem value="spi">SPI (Schedule)</SelectItem>
                  <SelectItem value="eac">EAC vs BAC</SelectItem>
                  <SelectItem value="sla">SLA Compliance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="h-9 w-[160px] text-xs border-line">
                  <CalendarDays className="w-3 h-3 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1w">This week</SelectItem>
                  <SelectItem value="2w">Last 2 weeks</SelectItem>
                  <SelectItem value="4w">Last 4 weeks</SelectItem>
                  <SelectItem value="13w">Last 13 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Agent Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal/10 border border-teal/20">
              <Bot className="w-4 h-4 text-teal" />
              <div>
                <p className="text-xs font-semibold text-foreground">A-302 Variance Analyst</p>
                <p className="text-[10px] text-muted-foreground">Tier 3 -- Last run: 14 min ago</p>
              </div>
            </div>
          </motion.header>

          {/* ── VARIANCE NARRATIVE ── */}
          <motion.section 
            className="rounded-xl border border-line bg-card overflow-hidden"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-line bg-gradient-to-r from-amber/5 to-transparent">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-sans text-base sm:text-lg font-bold text-foreground leading-tight">
                    What moved
                  </h2>
                  <p className="text-sm text-foreground/90 mt-1">
                    Portfolio {metricLabels[selectedMetric]} {narrativeByMetric[selectedMetric].direction === 'down' ? 'declined' : 'increased'}{' '}
                    <span className={cn('font-mono font-bold', narrativeByMetric[selectedMetric].direction === 'down' ? 'text-red' : 'text-green')}>
                      {narrativeByMetric[selectedMetric].value}
                    </span>{' '}
                    {periodLabels[selectedPeriod]},{' '}
                    <span className="font-mono">{narrativeByMetric[selectedMetric].prev} → {narrativeByMetric[selectedMetric].curr}</span>.{' '}
                    {narrativeByMetric[selectedMetric].context}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {narrativeByMetric[selectedMetric].direction === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red" />
                    )}
                    <span className="text-xs text-red font-semibold">{narrativeByMetric[selectedMetric].wow} week-over-week</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px]">
                        <p className="text-xs">
                          {selectedMetric === 'cpi' && 'CPI = Earned Value / Actual Cost. Values below 1.0 indicate cost overrun. Portfolio target: CPI ≥ 0.98.'}
                          {selectedMetric === 'spi' && 'SPI = Earned Value / Planned Value. Values below 1.0 indicate schedule delay. Portfolio target: SPI ≥ 0.95.'}
                          {selectedMetric === 'eac' && 'EAC = Estimate at Completion. Growth indicates potential budget overrun vs BAC (Budget at Completion).'}
                          {selectedMetric === 'sla' && 'SLA Compliance = On-time completions / Total completions. Target: ≥ 90%.'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Drivers */}
            <div className="p-4 sm:p-6">
              <h3 className="text-[10px] font-bold tracking-[2px] text-gold uppercase mb-4">
                Primary Drivers
              </h3>
              <div className="space-y-3">
                {varianceDrivers.map((driver) => {
                  const isExpanded = expandedDriver === driver.id
                  return (
                    <div
                      key={driver.id}
                      className={cn(
                        'rounded-lg border overflow-hidden transition-all',
                        driver.contribution >= 50 ? 'border-red/30 bg-red/5' :
                        driver.contribution >= 25 ? 'border-amber/30 bg-amber/5' :
                        'border-line bg-secondary/30'
                      )}
                    >
                      {/* Driver Row */}
                      <button
                        onClick={() => setExpandedDriver(isExpanded ? null : driver.id)}
                        className="w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 text-left hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                          {/* Contribution badge */}
                          <div className={cn(
                            'w-12 h-8 rounded flex items-center justify-center text-xs font-bold font-mono',
                            driver.contribution >= 50 ? 'bg-red/20 text-red' :
                            driver.contribution >= 25 ? 'bg-amber/20 text-amber' :
                            'bg-muted text-muted-foreground'
                          )}>
                            {driver.contribution}%
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{driver.project}</p>
                            <p className="text-[11px] text-muted-foreground">{driver.program}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 ml-6 sm:ml-0 sm:flex-1">
                          {/* CPI change */}
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            <span className="text-muted-foreground">{driver.cpiPrev.toFixed(2)}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className={cn('font-bold', driver.cpiCurr < driver.cpiPrev ? 'text-red' : 'text-green')}>
                              {driver.cpiCurr.toFixed(2)}
                            </span>
                          </div>
                          {/* Factor chips */}
                          {driver.factors.slice(0, 2).map((factor) => (
                            <Badge
                              key={factor}
                              variant="outline"
                              className="text-[10px] border-line text-muted-foreground hidden sm:inline-flex"
                            >
                              {factor}
                            </Badge>
                          ))}
                          {driver.factors.length > 2 && (
                            <span className="text-[10px] text-muted-foreground hidden sm:inline">
                              +{driver.factors.length - 2}
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div className="px-4 sm:px-6 pb-4 border-t border-line/50 pt-3 space-y-4 bg-background/50">
                          {/* Impact summary */}
                          <div>
                            <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-1">
                              Impact
                            </p>
                            <p className="text-sm text-foreground">{driver.impact}</p>
                          </div>

                          {/* Details list */}
                          <div>
                            <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-2">
                              Details
                            </p>
                            <ul className="space-y-1.5">
                              {driver.details.map((detail, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Factor chips (full list) */}
                          <div className="flex flex-wrap gap-2">
                            {driver.factors.map((factor) => (
                              <Badge
                                key={factor}
                                variant="outline"
                                className="text-[10px] border-gold/30 text-gold bg-gold/5"
                              >
                                {factor}
                              </Badge>
                            ))}
                          </div>

                          {/* Party Intelligence */}
                          {driver.partyIntel && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber/10 border border-amber/20">
                              <Shield className="w-4 h-4 text-amber shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground">
                                  Party Intelligence: {driver.partyIntel.contractor}
                                </p>
                                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  {driver.partyIntel.metric}
                                  {driver.partyIntel.trend === 'up' && (
                                    <TrendingUp className="w-3 h-3 text-red" />
                                  )}
                                </p>
                              </div>
                              <button className="text-[10px] text-amber hover:underline flex items-center gap-1">
                                View <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* Source */}
                          <SourceCitation source={driver.source} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.section>

          {/* ── AGENT REASONING TRACE ── */}
          <motion.section 
            className="rounded-xl border border-line bg-card overflow-hidden"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
          >
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/15 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-teal" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Agent Reasoning Trace</h3>
                  <p className="text-[11px] text-muted-foreground">
                    A-302 -- {agentReasoningTrace.length} steps -- Click to {showReasoning ? 'collapse' : 'expand'}
                  </p>
                </div>
              </div>
              {showReasoning ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {showReasoning && (
              <div className="border-t border-line px-4 sm:px-6 py-4">
                <div className="space-y-4">
                  {agentReasoningTrace.map((step, index) => (
                    <div key={step.step} className="flex gap-3">
                      {/* Step number */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center text-xs font-bold text-teal">
                          {step.step}
                        </div>
                        {index < agentReasoningTrace.length - 1 && (
                          <div className="w-px flex-1 bg-teal/20 mt-2" />
                        )}
                      </div>
                      {/* Step content */}
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold text-foreground">{step.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.detail}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {step.sources.map((source) => (
                            <button
                              key={source}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-secondary border border-line text-muted-foreground hover:text-foreground hover:border-teal/30 transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              {source}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>

          {/* ── QUERY HISTORICAL ── */}
          <motion.div 
            className="flex items-center justify-center py-4"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
          >
            <p className="text-xs text-muted-foreground text-center">
              Query variance for any historical period using the selectors above.
              <br />
              <span className="text-[10px]">
                Process model versions flagged if they changed during analysis period.
              </span>
            </p>
          </motion.div>
        </motion.div>
      </TooltipProvider>
    </AppShell>
  )
}

// ── Source Citation Component ──

function SourceCitation({ source }: { source: { metric: string; asOf: string } }) {
  // Use UTC formatting to avoid hydration mismatch between server and client
  const date = new Date(source.asOf)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getUTCMonth()]
  const day = date.getUTCDate()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  const formattedDate = `${month} ${day}, ${hour12}:${minutes} ${ampm} UTC`

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono bg-secondary border border-line text-teal hover:text-foreground hover:border-teal/40 transition-colors">
            <FileText className="w-3 h-3" />
            [source]
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[300px]">
          <div className="space-y-1">
            <p className="text-xs font-semibold">{source.metric}</p>
            <p className="text-[10px] opacity-70">
              Semantic Layer -- Certified metric
              <br />
              As of: {formattedDate}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
      <span className="text-[10px] text-muted-foreground">
        As of {formattedDate}
      </span>
    </div>
  )
}
