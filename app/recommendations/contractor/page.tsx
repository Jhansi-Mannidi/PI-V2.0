'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Sparkles,
  AlertTriangle,
  Users,
  Building2,
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  Activity,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Download,
  ExternalLink,
  Zap,
  CheckCircle2,
  XCircle,
  FileText,
  HardHat,
  BarChart3,
  Calendar,
  Eye,
  Copy,
  Check,
} from 'lucide-react'

// ─── Scorecard metric data ───
const scorecardMetrics = [
  {
    label: 'Volume (90d)',
    value: '47',
    unit: 'tasks',
    trend: 'neutral' as const,
    trendLabel: '',
    sparkline: [18, 20, 22, 19, 23, 21, 24, 20, 18, 22, 25, 23, 21],
    scope: 'O',
    drift: false,
  },
  {
    label: 'Outcome',
    value: '82%',
    unit: 'on-time',
    trend: 'down' as const,
    trendLabel: '-6%',
    sparkline: [92, 90, 89, 88, 87, 86, 85, 84, 83, 83, 82, 82, 82],
    scope: 'O',
    drift: true,
  },
  {
    label: 'Reliability',
    value: '0.88',
    unit: 'ratio',
    trend: 'down' as const,
    trendLabel: '-0.06',
    sparkline: [0.94, 0.94, 0.93, 0.93, 0.92, 0.91, 0.90, 0.90, 0.89, 0.89, 0.88, 0.88, 0.88],
    scope: 'O',
    drift: true,
  },
  {
    label: 'Workload',
    value: '4',
    unit: 'concurrent crews',
    trend: 'neutral' as const,
    trendLabel: '',
    sparkline: [3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    scope: 'O',
    drift: false,
  },
  {
    label: 'Response Time',
    value: '3.4d',
    unit: 'avg',
    trend: 'up' as const,
    trendLabel: '+1.3d',
    sparkline: [2.1, 2.0, 2.2, 2.3, 2.5, 2.6, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4],
    scope: 'O',
    drift: true,
  },
  {
    label: 'Financial',
    value: '2.1%',
    unit: 'dispute rate',
    trend: 'neutral' as const,
    trendLabel: '',
    sparkline: [1.8, 1.9, 1.9, 2.0, 2.0, 2.0, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1],
    scope: 'O',
    drift: false,
  },
]

// ─── Drift timeline events ───
const driftEvents = [
  {
    date: 'Mar 15',
    dayOffset: 51,
    title: 'sla_miss_rate_slope turned positive',
    detail: 'Was negative for 6 months. Slope crossed zero threshold at 0.003/week.',
    severity: 'amber' as const,
  },
  {
    date: 'Apr 1',
    dayOffset: 34,
    title: 'CUSUM SLA alert fired',
    detail: 'Cumulative sum of SLA miss rate residuals crossed threshold h=4.2. Current S+ = 5.1.',
    severity: 'red' as const,
  },
  {
    date: 'Apr 15',
    dayOffset: 20,
    title: 'behavior_distance anomaly flagged',
    detail: 'Isolation Forest: response pattern changed vs electrical trade peers. Anomaly score 0.73 (threshold 0.65).',
    severity: 'red' as const,
  },
  {
    date: 'Apr 18',
    dayOffset: 17,
    title: 'reliability.ratio_p50 dropped below 0.90',
    detail: 'First time below 0.90 in 8-month observation window. Now at 25th percentile of portfolio electrical contractors.',
    severity: 'amber' as const,
  },
]

// ─── Project performance ───
const projectPerformance = [
  { project: 'Henderson Substation', tasks: 22, breachRate: '24%', reliability: '0.84', status: 'Underperforming', statusColor: 'amber' },
  { project: 'Pryor Creek New Build', tasks: 12, breachRate: '14%', reliability: '0.91', status: 'Watch', statusColor: 'amber' },
  { project: 'Council Bluffs Phase 4', tasks: 0, breachRate: '--', reliability: '--', status: 'Scheduled W22', statusColor: 'slate' },
]

// ─── Peer comparison ───
const peerComparison = [
  { name: 'Pacific Electrical', breachRate: '4%', reliability: '0.96', disputeRate: '1.2%', status: 'Strong', statusColor: 'green' },
  { name: 'Acme Electrical', breachRate: '18%', reliability: '0.88', disputeRate: '2.1%', status: 'Drift', statusColor: 'amber', isSubject: true },
  { name: 'Metro Electric (Council Bluffs)', breachRate: '8%', reliability: '0.93', disputeRate: '0.8%', status: 'Good', statusColor: 'green' },
]

// ─── Contractor recommendations ───
const contractorRecs = [
  { id: 'HEN-004', headline: 'Performance review before Council Bluffs mobilization', urgency: 'This Week' as const, confidence: 85, category: 'Contractor Management' },
  { id: 'REC-001', headline: 'Move indoor electrical forward on Pryor Creek -- rain event', urgency: 'Immediate' as const, confidence: 87, category: 'Schedule Optimization' },
  { id: 'HEN-006', headline: 'Add second crew to Henderson electrical -- recover 5 days float', urgency: 'This Month' as const, confidence: 71, category: 'Schedule Optimization' },
]

const narrativeText = `Acme Electrical has been a reliable contractor across the portfolio historically, but performance metrics have deteriorated meaningfully over the past 30 days. The SLA miss rate has risen from 12% to 18%, driven primarily by delays on Henderson Substation electrical rework and slow legal document compliance on the Pryor Creek onboarding. Completion reliability has dropped from 0.94 to 0.88, placing Acme below the portfolio 25th percentile for the first time.

The primary risk factor is workload concentration: Acme is simultaneously active on Henderson (rework), Pryor Creek (onboarding), and is scheduled for Council Bluffs Phase 4 mobilization in 3 weeks. Historical data shows that contractors with similar drift patterns who added a third concurrent project experienced 2.3x higher SLA miss rates.

MSA clause 8.3 requires quarterly performance review; the Q1 review was due April 30 and has not been conducted. Contractual remediation options include additional crew requirements (clause 8.5) and performance bond adjustment (clause 12.2).`

// ─── Sparkline component ───
function Sparkline({ data, color = 'teal', drift = false }: { data: number[]; color?: string; drift?: boolean }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 80
  const height = 24
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const lineColor = drift ? 'var(--red)' : color === 'teal' ? 'var(--teal)' : 'var(--gold)'

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Section animation ───
const sectionVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export default function ContractorIntelPage() {
  const { aiEnabled } = useAI()
  const [narrativeExpanded, setNarrativeExpanded] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [expandedDrift, setExpandedDrift] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => setIsRegenerating(false), 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(narrativeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportPDF = () => {
    const blob = new Blob([`CONTRACTOR INTELLIGENCE REPORT\nAcme Electrical\n\n${narrativeText}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'acme-electrical-intelligence-report.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!aiEnabled) {
    return (
      <AppShell title="Contractor Intelligence" subtitle="AI-powered contractor analysis" activeHref="/recommendations/contractor">
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">AI Features Disabled</h3>
            <p className="text-sm text-muted-foreground max-w-md">Enable AI in the header to access Contractor Intelligence powered by the A-305 Portfolio Recommendation Agent.</p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Acme Electrical -- Contractor Intelligence"
      subtitle="Active across 3 projects &middot; 47 tasks (90d) &middot; Drift detected"
      activeHref="/recommendations/contractor"
    >
      <div className="space-y-6 w-full">

        {/* Status Chip */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Performance Review Recommended
          </span>
        </motion.div>

        {/* ═══ REGION 1: Contractor Scorecard ═══ */}
        <motion.section custom={0} variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal to-teal/30" />
            <h2 className="text-sm font-semibold text-foreground">Party Feature Scorecard</h2>
            <span className="text-[9px] text-muted-foreground/50 font-mono ml-auto">O = Operational scope</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {scorecardMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
                className={cn(
                  'bg-card/80 dark:bg-card/60 backdrop-blur-sm rounded-xl p-4 relative overflow-hidden group',
                  'transition-all duration-300 hover:shadow-md',
                  m.drift
                    ? 'border-2 border-dashed border-red/40 hover:border-red/60'
                    : 'border border-line/50 hover:border-line'
                )}
              >
                {/* Drift flag */}
                {m.drift && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-red bg-red/10 px-1.5 py-0.5 rounded">DRIFT</span>
                  </div>
                )}

                {/* Scope badge */}
                <div className="absolute bottom-2 right-2">
                  <span className="text-[8px] font-mono text-muted-foreground/40 bg-muted/30 px-1 py-0.5 rounded">{m.scope}</span>
                </div>

                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">{m.label}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={cn('text-xl font-bold font-mono', m.drift ? 'text-red' : 'text-foreground')}>{m.value}</span>
                  <span className="text-[10px] text-muted-foreground/50">{m.unit}</span>
                </div>

                {/* Trend */}
                {m.trendLabel && (
                  <div className={cn('flex items-center gap-1 mb-2', m.trend === 'down' ? 'text-red' : m.trend === 'up' ? 'text-red' : 'text-muted-foreground')}>
                    {m.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    <span className="text-[10px] font-semibold">{m.trendLabel}</span>
                  </div>
                )}

                {/* Sparkline */}
                <Sparkline data={m.sparkline} drift={m.drift} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ REGION 2: AI-Generated Narrative ═══ */}
        <motion.section custom={1} variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal to-teal/30" />
            <h2 className="text-sm font-semibold text-foreground">AI-Generated Narrative</h2>
            <Sparkles className="w-3.5 h-3.5 text-teal ml-1" />
          </div>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
            <div className="border-l-4 border-teal p-5 bg-gradient-to-r from-teal/4 via-transparent to-transparent">
              <button
                onClick={() => setNarrativeExpanded(!narrativeExpanded)}
                className="w-full flex items-center justify-between text-left mb-2"
              >
                <span className="text-xs font-semibold text-teal uppercase tracking-wider">Contractor Analysis</span>
                <motion.div animate={{ rotate: narrativeExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {narrativeExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{narrativeText}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-line/30">
                      <p className="text-[9px] text-muted-foreground/50 font-mono flex-1 min-w-[200px]">
                        Generated by Narrative Pipeline &middot; SLM v1.4 &middot; Based on 47 events over 90 days &middot; Last updated 2h ago
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] gap-1.5"
                          onClick={handleRegenerate}
                          disabled={isRegenerating}
                        >
                          <motion.div animate={{ rotate: isRegenerating ? 360 : 0 }} transition={{ duration: 1, repeat: isRegenerating ? Infinity : 0, ease: 'linear' }}>
                            <RefreshCw className="w-3 h-3" />
                          </motion.div>
                          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5" onClick={handleCopy}>
                          {copied ? <Check className="w-3 h-3 text-green" /> : <Copy className="w-3 h-3" />}
                          {copied ? 'Copied' : 'Copy'}
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5" onClick={handleExportPDF}>
                          <Download className="w-3 h-3" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* ═══ REGION 3: Active Recommendations ═══ */}
        <motion.section custom={2} variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-gold to-gold/30" />
            <h2 className="text-sm font-semibold text-foreground">Active Recommendations</h2>
            <span className="text-[10px] text-muted-foreground/50 ml-1">for Acme Electrical</span>
          </div>
          <div className="space-y-3">
            {contractorRecs.map((rec, i) => {
              const urgencyStyle = rec.urgency === 'Immediate'
                ? { bg: 'bg-red/10', text: 'text-red', border: 'border-red/30', label: 'ACT TODAY' }
                : rec.urgency === 'This Week'
                  ? { bg: 'bg-amber/10', text: 'text-amber', border: 'border-amber/30', label: 'THIS WEEK' }
                  : { bg: 'bg-teal/10', text: 'text-teal', border: 'border-teal/30', label: 'THIS MONTH' }

              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 + i * 0.08 }}
                >
                  <Link href={`/recommendations/${rec.id}`} className="block">
                    <div className={cn(
                      'bg-card/80 dark:bg-card/60 backdrop-blur-sm border rounded-xl p-4 transition-all duration-200',
                      'hover:shadow-md hover:border-gold/30 group cursor-pointer',
                      urgencyStyle.border
                    )}>
                      <div className="flex items-start gap-3">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', urgencyStyle.bg)}>
                          {rec.category === 'Contractor Management' ? <HardHat className={cn('w-4 h-4', urgencyStyle.text)} /> :
                            <Calendar className={cn('w-4 h-4', urgencyStyle.text)} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn('text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded', urgencyStyle.bg, urgencyStyle.text)}>
                              {urgencyStyle.label}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/50">{rec.confidence}% confidence</span>
                          </div>
                          <p className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">{rec.headline}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-gold/60 transition-colors shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* ═══ REGION 4: Drift & Anomaly Timeline ═══ */}
        <motion.section custom={3} variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red to-red/30" />
            <h2 className="text-sm font-semibold text-foreground">Drift & Anomaly Timeline</h2>
            <span className="text-[10px] text-muted-foreground/50 ml-1">past 90 days</span>
          </div>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-4 sm:p-5">
            {/* Timeline bar */}
            <div className="relative mb-6">
              <div className="h-1 bg-line/30 rounded-full w-full relative">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green/40 via-amber/40 to-red/40 rounded-full" style={{ width: '100%' }} />
              </div>
              {/* Timeline labels */}
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] font-mono text-muted-foreground/50">Feb 5</span>
                <span className="text-[9px] font-mono text-muted-foreground/50">Mar 5</span>
                <span className="text-[9px] font-mono text-muted-foreground/50">Apr 5</span>
                <span className="text-[9px] font-mono text-muted-foreground/50">May 5</span>
              </div>
              {/* Event markers on timeline */}
              {driftEvents.map((event, i) => {
                const leftPct = Math.max(5, Math.min(95, ((90 - event.dayOffset) / 90) * 100))
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
                    className="absolute top-0 -translate-y-1/2"
                    style={{ left: `${leftPct}%` }}
                  >
                    <div className={cn(
                      'w-3 h-3 rounded-full border-2 border-card cursor-pointer',
                      event.severity === 'red' ? 'bg-red' : 'bg-amber',
                    )} />
                  </motion.div>
                )
              })}
            </div>

            {/* Event cards */}
            <div className="space-y-2">
              {driftEvents.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                >
                  <button
                    onClick={() => setExpandedDrift(expandedDrift === i ? null : i)}
                    className={cn(
                      'w-full text-left rounded-lg p-3 transition-all duration-200 border',
                      expandedDrift === i
                        ? 'bg-card border-line shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-muted/30 hover:border-line/30'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2.5 h-2.5 rounded-full shrink-0',
                        event.severity === 'red' ? 'bg-red' : 'bg-amber'
                      )} />
                      <span className="text-[10px] font-mono text-muted-foreground/60 w-14 shrink-0">{event.date}</span>
                      <span className="text-xs font-medium text-foreground flex-1">{event.title}</span>
                      <motion.div animate={{ rotate: expandedDrift === i ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {expandedDrift === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 ml-[calc(0.625rem+0.75rem)] pl-3 border-l-2 border-line/30">
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{event.detail}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══ REGION 5: Project-by-Project Performance ═══ */}
        <motion.section custom={4} variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-gold to-gold/30" />
            <h2 className="text-sm font-semibold text-foreground">Project-by-Project Performance</h2>
          </div>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px]">
                <thead>
                  <tr className="bg-muted/30 dark:bg-navy-mid/30">
                    <th className="text-left px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Project</th>
                    <th className="text-center px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Tasks (90d)</th>
                    <th className="text-center px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">SLA Miss Rate</th>
                    <th className="text-center px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Reliability</th>
                    <th className="text-center px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/20">
                  {projectPerformance.map((row, i) => (
                    <motion.tr
                      key={row.project}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                      className="hover:bg-gold/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground/40" />
                          <span className="text-xs font-medium text-foreground">{row.project}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-mono text-foreground">{row.tasks || '--'}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('text-xs font-mono font-semibold', row.breachRate !== '--' && parseInt(row.breachRate) > 15 ? 'text-red' : parseInt(row.breachRate) > 10 ? 'text-amber' : 'text-foreground')}>
                          {row.breachRate}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('text-xs font-mono font-semibold', row.reliability !== '--' && parseFloat(row.reliability) < 0.90 ? 'text-red' : 'text-foreground')}>
                          {row.reliability}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1',
                          row.statusColor === 'amber' ? 'bg-amber/10 text-amber' :
                          row.statusColor === 'green' ? 'bg-green/10 text-green' :
                          'bg-muted/50 text-muted-foreground'
                        )}>
                          {row.statusColor === 'amber' && <AlertTriangle className="w-2.5 h-2.5" />}
                          {row.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* ═══ REGION 6: Peer Comparison ═══ */}
        <motion.section custom={5} variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal to-teal/30" />
            <h2 className="text-sm font-semibold text-foreground">Peer Comparison</h2>
            <span className="text-[10px] text-muted-foreground/50 ml-1">How does Acme compare to other electrical contractors?</span>
          </div>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px]">
                <thead>
                  <tr className="bg-muted/30 dark:bg-navy-mid/30">
                    <th className="text-left px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Contractor</th>
                    <th className="text-center px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">SLA Miss Rate</th>
                    <th className="text-center px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Reliability</th>
                    <th className="text-center px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Dispute Rate</th>
                    <th className="text-center px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/20">
                  {peerComparison.map((row, i) => (
                    <motion.tr
                      key={row.name}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
                      className={cn(
                        'transition-colors',
                        row.isSubject ? 'bg-amber/5 dark:bg-amber/5' : 'hover:bg-gold/5'
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <HardHat className={cn('w-3.5 h-3.5', row.isSubject ? 'text-amber' : 'text-muted-foreground/40')} />
                          <span className={cn('text-xs font-medium', row.isSubject ? 'text-amber font-semibold' : 'text-foreground')}>
                            {row.name}
                          </span>
                          {row.isSubject && <span className="text-[8px] bg-amber/15 text-amber px-1 py-0.5 rounded font-mono">SUBJECT</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('text-xs font-mono font-semibold', parseInt(row.breachRate) > 15 ? 'text-red' : parseInt(row.breachRate) > 8 ? 'text-amber' : 'text-green')}>
                          {row.breachRate}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('text-xs font-mono font-semibold', parseFloat(row.reliability) < 0.90 ? 'text-red' : 'text-green')}>
                          {row.reliability}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-mono text-foreground">{row.disputeRate}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1',
                          row.statusColor === 'amber' ? 'bg-amber/10 text-amber' : 'bg-green/10 text-green'
                        )}>
                          {row.statusColor === 'amber' ? <AlertTriangle className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                          {row.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Anomaly footer */}
            <div className="px-4 py-3 border-t border-line/30 bg-muted/10 dark:bg-navy-mid/20">
              <p className="text-[9px] text-muted-foreground/50 font-mono">
                Source: Isolation Forest peer comparison &middot; Acme anomaly score: 0.73 (above 0.65 threshold) &middot; Based on 90-day rolling window
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </AppShell>
  )
}
