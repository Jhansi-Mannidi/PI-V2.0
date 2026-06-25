'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock,
  Bot,
  ArrowUpRight,
  SlidersHorizontal,
  Search,
  TrendingUp,
  Users,
  FileWarning,
  Timer,
  DollarSign,
  Calendar,
  Zap,
} from 'lucide-react'
import { useActionModal } from '@/hooks/use-action-modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAI } from '@/components/ai-provider'

// Animation ease curve
const ease = [0.25, 0.46, 0.45, 0.94] as const

/* ── Mock Data ── */
const predictions = [
  {
    id: 'PRED-001',
    process: 'Monthly Status Report',
    project: 'Mesa',
    program: 'Southeast',
    stage: 'Data Stitching',
    predictedBreach: '18h 42m',
    confidence: 87,
    factors: ['RFI aging', 'Prior slip', 'Party reliability'],
    agent: 'A-303',
    reasoning:
      'Prior 3 instances by LineSight averaged 5.2d cycle time; current instance at 4.1d with data-stitching bottleneck. Party feature: LineSight reliability.ratio_p50 = 0.91 (declining). Similar cases exceeded SLA 87% of the time.',
    severity: 'high',
    // Quantified outcomes
    expectedImpact: 'Estimated $0.4M standby + 2-day schedule slip if SLA passes.',
    impactCost: 0.4,
    impactDays: 2,
    recommendedAction: 'Reassign to Jordan M.',
    actionRationale: 'Cost Engineer load rebalance',
    expectedOutcome: 'Reduces SLA risk from 87% to 22%. Avoids $0.4M and 2-day slip.',
    reducedCost: 0.05,
    reducedDays: 0,
  },
  {
    id: 'PRED-002',
    process: 'RFI Response',
    project: 'Pryor Creek',
    program: 'Central',
    stage: 'Structural Review',
    predictedBreach: '32h 15m',
    confidence: 72,
    factors: ['Staff gap', 'Concurrent RFIs', 'Critical path'],
    agent: 'A-303',
    reasoning:
      'RFI-1188 is on critical path. Prior stage slipped 1.2d. Structural Lead has 4 concurrent RFIs. Party feature: workload.concurrent_tasks = 4 (above p75 threshold).',
    severity: 'high',
    // Quantified outcomes
    expectedImpact: 'Estimated $0.6M critical-path delay + 3-day schedule slip if SLA passes.',
    impactCost: 0.6,
    impactDays: 3,
    recommendedAction: 'Request structural reviewer dedicated for 48h',
    actionRationale: 'RFI backlog reduction',
    expectedOutcome: 'Reduces SLA risk from 72% to 18%. Avoids $0.6M and 3-day slip.',
    reducedCost: 0.1,
    reducedDays: 0.5,
  },
  {
    id: 'PRED-003',
    process: 'Contractor Onboarding',
    project: 'Henderson',
    program: 'West',
    stage: 'Insurance Verification',
    predictedBreach: '44h 20m',
    confidence: 65,
    factors: ['Doc delay', 'No backup filler'],
    agent: 'A-303',
    reasoning:
      'Insurance cert for Pacific Rim has been pending 3.2d. Historical average for this stage is 2.1d. Single filler (Jennifer M.) with no backup assigned. Party SLA miss rate: 18%.',
    severity: 'medium',
    // Quantified outcomes
    expectedImpact: 'Estimated $0.2M mobilization delay + 1-day schedule slip if SLA passes.',
    impactCost: 0.2,
    impactDays: 1,
    recommendedAction: 'Assign backup filler (Marcus T.)',
    actionRationale: 'Single point of failure mitigation',
    expectedOutcome: 'Reduces SLA risk from 65% to 28%. Avoids $0.2M and 1-day slip.',
    reducedCost: 0.05,
    reducedDays: 0.25,
  },
  {
    id: 'PRED-004',
    process: 'Change Order Approval',
    project: 'Papillion',
    program: 'Central',
    stage: 'Director Sign-off',
    predictedBreach: '56h 00m',
    confidence: 58,
    factors: ['Approval queue depth', 'Budget threshold'],
    agent: 'A-303',
    reasoning:
      'CO-0087 ($2.1M) requires Director-level approval. Brian Smith has 3 pending approvals ahead. Avg approval cycle at this tier: 2.8d. Current wait: 1.9d.',
    severity: 'medium',
    // Quantified outcomes
    expectedImpact: 'Estimated $0.5M contractor standby + 0.5-day schedule slip if SLA passes.',
    impactCost: 0.5,
    impactDays: 0.5,
    recommendedAction: 'Escalate to Compliance Director',
    actionRationale: 'Approval queue bypass',
    expectedOutcome: 'Reduces SLA risk from 58% to 15%. Avoids $0.5M and 0.5-day slip.',
    reducedCost: 0.05,
    reducedDays: 0,
  },
  {
    id: 'PRED-005',
    process: 'Permit Application',
    project: 'New Albany',
    program: 'Southeast',
    stage: 'Jurisdiction Review',
    predictedBreach: '68h 30m',
    confidence: 51,
    factors: ['Jurisdiction backlog', 'Prior slip'],
    agent: 'A-303',
    reasoning:
      'Franklin County has 12-day average review time (vs 8-day SLA). Two prior permits from this jurisdiction slipped by 3+ days. Current submission is day 6.',
    severity: 'low',
    // Quantified outcomes
    expectedImpact: 'Estimated $0.4M permit-hold cost + 0.5-day schedule slip if SLA passes.',
    impactCost: 0.4,
    impactDays: 0.5,
    recommendedAction: 'Request expedited review (fee: $8K)',
    actionRationale: 'Jurisdiction fast-track option',
    expectedOutcome: 'Reduces SLA risk from 51% to 12%. Avoids $0.4M and 0.5-day slip.',
    reducedCost: 0.05,
    reducedDays: 0.25,
  },
]

// Aggregate calculations for banner
const totalImpactCost = predictions.reduce((sum, p) => sum + p.impactCost, 0)
const totalImpactDays = predictions.reduce((sum, p) => sum + p.impactDays, 0)
const totalReducedCost = predictions.reduce((sum, p) => sum + p.reducedCost, 0)
const totalReducedDays = predictions.reduce((sum, p) => sum + p.reducedDays, 0)

const topFactors = [
  { label: 'RFI Aging', pct: 34, icon: FileWarning, color: 'text-red' },
  { label: 'Staff Gap', pct: 28, icon: Users, color: 'text-amber' },
  { label: 'Prior Slip', pct: 22, icon: Timer, color: 'text-amber' },
  { label: 'Party Reliability', pct: 16, icon: TrendingUp, color: 'text-teal' },
]

const horizons = ['24h', '48h', '72h', '7d'] as const

export function RiskHorizonContent() {
  const { aiEnabled } = useAI()
  const [horizon, setHorizon] = React.useState<string>('72h')
  const [confidenceThreshold, setConfidenceThreshold] = React.useState(50)
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)
  const [factorFilter, setFactorFilter] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [queuedActions, setQueuedActions] = React.useState<Set<string>>(new Set())
  const action = useActionModal()

  const handleRecommendedAction = (pred: typeof predictions[0]) => {
    action.open({
      tone: 'primary',
      icon: Zap,
      title: `Queue recommended action — ${pred.id}`,
      description: 'Create a tracked mitigation action from this prediction and assign it to the responsible service role.',
      context: [
        { label: 'Prediction', value: pred.id },
        { label: 'Project', value: pred.project },
        { label: 'SLA risk', value: pred.process },
        { label: 'Expected outcome', value: pred.expectedOutcome },
      ],
      fields: [
        {
          type: 'select',
          name: 'priority',
          label: 'Priority',
          defaultValue: pred.confidence >= 75 ? 'critical' : 'high',
          required: true,
          options: [
            { value: 'critical', label: 'Critical — execute immediately' },
            { value: 'high', label: 'High — queue for current work cycle' },
            { value: 'standard', label: 'Standard — monitor and execute if risk rises' },
          ],
        },
        {
          type: 'textarea',
          name: 'instructions',
          label: 'Action instructions',
          defaultValue: pred.recommendedAction,
          rows: 3,
          required: true,
        },
      ],
      confirmLabel: 'Queue Action',
      successToast: `${pred.id} action queued`,
      successDescription: `${pred.recommendedAction} · ${pred.expectedOutcome}`,
      onConfirm: () => {
        setQueuedActions((prev) => new Set(prev).add(pred.id))
      },
    })
  }

  const filtered = predictions
    .filter((p) => p.confidence >= confidenceThreshold)
    .filter((p) => !factorFilter || p.factors.some((f) => f.toLowerCase().includes(factorFilter.toLowerCase())))
    .filter((p) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        p.process.toLowerCase().includes(q) ||
        p.project.toLowerCase().includes(q) ||
        p.program.toLowerCase().includes(q) ||
        p.stage.toLowerCase().includes(q) ||
        p.factors.some((f) => f.toLowerCase().includes(q))
      )
    })

  return (
    <>
      <div className="space-y-4 sm:space-y-6 w-full">
        {/* ── Aggregate Exposure Banner ── */}
        <div className="relative overflow-hidden rounded-xl border border-line bg-card shadow-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 px-5 py-4">
            <div className="flex items-center gap-3 min-w-[280px]">
              <div className="w-9 h-9 rounded-xl bg-gold/12 ring-1 ring-gold/25 flex items-center justify-center">
                <AlertTriangle className="w-4.5 h-4.5 text-gold" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gold">Risk Horizon</p>
                <h3 className="text-[13px] font-semibold text-foreground tracking-[-0.01em]">Predicted SLA-Risk Exposure</h3>
                <p className="text-[10.5px] text-muted-foreground">Based on {predictions.length} high-confidence predictions</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-3 lg:px-2">
              {/* Current Exposure */}
              <div className="rounded-lg border border-red/10 bg-red-bg/50 px-3 py-2 text-center">
                <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground mb-1">If no action</p>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-xl font-mono font-bold text-red">${totalImpactCost.toFixed(1)}M</span>
                  <span className="text-muted-foreground/50">+</span>
                  <span className="text-xl font-mono font-bold text-red">{totalImpactDays}</span>
                  <span className="text-[11px] text-muted-foreground">days</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="w-8 h-px bg-gradient-to-r from-red/40 to-gold/70" />
                <div className="w-7 h-7 rounded-full border border-gold/25 bg-gold/10 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-gold" />
                </div>
                <div className="w-8 h-px bg-gradient-to-r from-gold/70 to-green/50" />
              </div>

              {/* After Actions */}
              <div className="rounded-lg border border-green/10 bg-green-bg/60 px-3 py-2 text-center">
                <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground mb-1">After {predictions.length} actions</p>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-xl font-mono font-bold text-green">${totalReducedCost.toFixed(1)}M</span>
                  <span className="text-muted-foreground/50">+</span>
                  <span className="text-xl font-mono font-bold text-green">{totalReducedDays}</span>
                  <span className="text-[11px] text-muted-foreground">days</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                onClick={() =>
                  action.open({
                    tone: 'warning',
                    icon: Zap,
                    title: 'Execute All Recommended Actions',
                    description: `${filtered.length} predictive actions ready for execution. Each action will be queued, owners notified, and outcomes monitored against forecast.`,
                    context: [
                      { label: 'Predictions', value: `${filtered.length}` },
                      { label: 'Horizon', value: horizon },
                      { label: 'Avg. Confidence', value: `${Math.round(filtered.reduce((s, p) => s + p.confidence, 0) / Math.max(filtered.length, 1))}%` },
                    ],
                    fields: [
                      {
                        type: 'select',
                        name: 'mode',
                        label: 'Execution Mode',
                        required: true,
                        options: [
                          { value: 'sequential', label: 'Sequential — one at a time, watch for failures' },
                          { value: 'parallel', label: 'Parallel — fire all simultaneously' },
                          { value: 'staged', label: 'Staged — high-confidence first, then mid' },
                        ],
                      },
                    ],
                    confirmLabel: 'Execute All',
                    successToast: `${filtered.length} actions executed`,
                    successDescription: 'Owners notified · monitoring outcomes',
                  })
                }
                className="font-semibold h-9 text-xs gap-1.5 bg-gold text-navy border border-gold shadow-[0_6px_18px_rgba(212,160,76,0.18)]"
              >
                <Zap className="w-3.5 h-3.5" />
                Execute All Recommended
              </Button>
            </div>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-xl border border-line">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Horizon</span>
            <div className="flex gap-1">
              {horizons.map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    horizon === h
                      ? 'bg-gold text-navy'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-line" />

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Confidence</span>
            <input
              type="range"
              min={0}
              max={100}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-24 h-1.5 accent-gold"
            />
            <span className="text-xs font-mono text-gold font-semibold min-w-[32px]">
              {'>='}{confidenceThreshold}%
            </span>
          </div>

          <div className="h-6 w-px bg-line" />

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] font-mono text-muted-foreground">
              Model v2.1 -- Trained 2026-04-12 -- AUC 0.84 -- Calibration: good
            </span>
          </div>
        </div>

        {/* ── Forecast Band Visualization ── */}
        <div className="bg-card rounded-xl border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-base font-semibold text-foreground">
              SLA Risk Forecast Timeline
            </h3>
            {aiEnabled && (
              <Badge variant="outline" className="text-[10px] font-mono border-teal/30 text-teal">
                <Bot className="w-3 h-3 mr-1" />
                A-303 Risk Horizon Forecaster
              </Badge>
            )}
          </div>

          {/* Simplified time-band chart */}
          <div className="relative h-40 bg-secondary/30 rounded-lg overflow-hidden">
            {/* Time axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-2 border-t border-line/50">
              {['0h', '12h', '24h', '36h', '48h', '60h', '72h'].map((t) => (
                <span key={t} className="text-[9px] font-mono text-muted-foreground">{t}</span>
              ))}
            </div>

            {/* Prediction markers positioned along timeline */}
            {predictions.filter((p) => p.confidence >= confidenceThreshold).map((pred, i) => {
              const hours = parseFloat(pred.predictedBreach)
              const maxH = horizon === '24h' ? 24 : horizon === '48h' ? 48 : horizon === '72h' ? 72 : 168
              const pct = Math.min((hours / maxH) * 100, 95)
              const severity = pred.confidence >= 75 ? 'bg-red' : pred.confidence >= 60 ? 'bg-amber' : 'bg-gold'
              const topPos = 12 + i * 22

              return (
                <div key={pred.id} className="absolute flex items-center gap-1.5" style={{ left: `${pct}%`, top: `${topPos}px` }}>
                  <div className={cn('w-3 h-3 rounded-full', severity, pred.confidence >= 75 && 'animate-pulse-dot')} />
                  <span className="text-[10px] font-mono text-foreground/80 whitespace-nowrap bg-card/80 px-1 rounded">
                    {pred.project} ({pred.confidence}%)
                  </span>
                </div>
              )
            })}

            {/* Severity bands */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 bg-red/5 border-r border-red/10" />
              <div className="flex-1 bg-amber/5 border-r border-amber/10" />
              <div className="flex-1 bg-gold/5" />
            </div>
          </div>
        </div>

        {/* ── Factor Analysis ── */}
        <div className="grid grid-cols-2 gap-3">
          {topFactors.map((factor) => (
            <button
              key={factor.label}
              onClick={() => setFactorFilter(factorFilter === factor.label ? null : factor.label)}
              className={cn(
                'flex items-center gap-3 p-4 bg-card rounded-xl border transition-all',
                factorFilter === factor.label
                  ? 'border-gold bg-gold-pale'
                  : 'border-line hover:border-gold/30'
              )}
            >
              <factor.icon className={cn('w-5 h-5', factor.color)} />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">{factor.label}</p>
                <p className="text-xs text-muted-foreground">{factor.pct}% of predictions</p>
              </div>
              <div className="ml-auto">
                <div className="w-10 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={cn('h-full rounded-full', factor.color.replace('text-', 'bg-'))} style={{ width: `${factor.pct}%` }} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Predicted Breach Table ── */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <div>
              <h3 className="font-sans text-base font-semibold text-foreground">
                Ranked Predictions
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {filtered.length} predictions above {confidenceThreshold}% confidence
                {factorFilter && ` -- filtered by "${factorFilter}"`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search predictions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 pr-3 text-xs border border-line rounded-lg bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-line">
            {filtered.map((pred, index) => (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease }}
              >
                  <button
                    onClick={() => setExpandedRow(expandedRow === pred.id ? null : pred.id)}
                    className={cn(
                      'w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 text-left hover:bg-secondary/30 transition-colors',
                      expandedRow === pred.id && 'bg-secondary/20'
                    )}
                  >
                    {/* Top row: chevron, severity, process, time */}
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:flex-1 sm:min-w-0">
                      {expandedRow === pred.id ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', pred.confidence >= 75 ? 'bg-red animate-pulse-dot' : pred.confidence >= 60 ? 'bg-amber' : 'bg-gold')} />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{pred.process}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{pred.project} -- {pred.stage}</p>
                      </div>

                      <div className="text-right shrink-0 sm:hidden">
                        <p className="text-sm font-mono font-semibold text-foreground tabular-nums">{pred.predictedBreach}</p>
                        <span className={cn('text-xs font-mono font-bold', pred.confidence >= 75 ? 'text-red' : pred.confidence >= 60 ? 'text-amber' : 'text-gold')}>{pred.confidence}%</span>
                      </div>
                    </div>

                    {/* Desktop-only columns */}
                    <div className="hidden sm:block min-w-[90px]">
                      <p className="text-sm font-mono font-semibold text-foreground tabular-nums">{pred.predictedBreach}</p>
                      <p className="text-[10px] text-muted-foreground">until SLA risk</p>
                    </div>

                    <div className="hidden sm:flex min-w-[100px] items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div className={cn('h-full rounded-full', pred.confidence >= 75 ? 'bg-red' : pred.confidence >= 60 ? 'bg-amber' : 'bg-gold')} style={{ width: `${pred.confidence}%` }} />
                      </div>
                      <span className={cn('text-xs font-mono font-bold min-w-[36px] text-right', pred.confidence >= 75 ? 'text-red' : pred.confidence >= 60 ? 'text-amber' : 'text-gold')}>{pred.confidence}%</span>
                    </div>

                    {/* Factor chips + Agent - wrap on mobile */}
                    <div className="flex flex-wrap items-center gap-1 ml-6 sm:ml-0 sm:flex-1">
                      {pred.factors.map((f) => (
                        <span key={f} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground border border-line">{f}</span>
                      ))}
                      {aiEnabled && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal/10 text-teal border border-teal/20">
                          <Bot className="w-3 h-3 inline mr-1" />{pred.agent}
                        </span>
                      )}
                    </div>
                  </button>

                {/* Quantified Impact & Recommended Action — show when expanded */}
                {expandedRow === pred.id && (
                <div className="px-5 pb-3 pt-1 ml-11 space-y-2">
                  {/* Expected Impact */}
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-red mt-0.5 shrink-0" />
                    <p className="text-xs text-red/90 leading-relaxed">
                      {pred.expectedImpact}
                    </p>
                  </div>

                  {/* Recommended Action Button + rationale */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRecommendedAction(pred)
                      }}
                      className="h-8 text-xs gap-1.5 font-semibold shrink-0 bg-gold text-navy border border-gold"
                    >
                      <Zap className="w-3 h-3" />
                      {queuedActions.has(pred.id) ? 'Action queued' : pred.recommendedAction}
                    </Button>
                    <span className="text-[10px] text-muted-foreground italic">
                      ({pred.actionRationale})
                    </span>
                  </div>

                  {/* Expected Outcome — monospace per spec */}
                  <p className="text-[11px] font-mono text-green/80 leading-relaxed pl-0.5">
                    {pred.expectedOutcome}
                  </p>
                </div>
                )}

                {/* Expanded reasoning - only show when AI is enabled */}
                {expandedRow === pred.id && aiEnabled && (
                  <div className="px-5 pb-4 pt-1 ml-11 border-l-2 border-teal/30">
                    <div className="bg-teal/5 rounded-lg p-4 border border-teal/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-teal" />
                        <span className="text-xs font-semibold text-teal">Agent Reasoning Trace</span>
                        <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                          Prediction ID: {pred.id}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed font-mono">
                        {pred.reasoning}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-red/30 text-red"
                          onClick={() =>
                            action.open({
                              tone: 'destructive',
                              icon: ArrowUpRight,
                              title: `Escalate Prediction ${pred.id}`,
                              description: 'Escalates this AI prediction to leadership for executive intervention.',
                              context: [
                                { label: 'Prediction', value: pred.id },
                                { label: 'Project', value: pred.project },
                                { label: 'Confidence', value: `${pred.confidence}%` },
                                { label: 'Risk Type', value: pred.process },
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
                                    { value: 'exec', label: 'Executive Steering' },
                                  ],
                                },
                                { type: 'textarea', name: 'note', label: 'Escalation Note', required: true, rows: 3 },
                              ],
                              confirmLabel: 'Escalate',
                              successToast: `${pred.id} escalated`,
                              successDescription: 'Leadership notified · prediction logged',
                            })
                          }
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          Escalate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-amber/30 text-amber"
                          onClick={() =>
                            action.open({
                              tone: 'warning',
                              icon: Users,
                              title: `Assign Owner — ${pred.id}`,
                              description: 'Assigns a responsible owner who will track this risk through resolution.',
                              context: [
                                { label: 'Prediction', value: pred.id },
                                { label: 'Project', value: pred.project },
                              ],
                              fields: [
                                {
                                  type: 'select',
                                  name: 'owner',
                                  label: 'Assign To',
                                  required: true,
                                  options: [
                                    { value: 'sl', label: 'Sophia Lamb — Sr PM' },
                                    { value: 'hc', label: 'Hasit Chetal — Controls Lead' },
                                    { value: 'me', label: 'Michael Ellis — Construction Mgr' },
                                    { value: 'jc', label: 'Jenna Carter — Cost Controls' },
                                  ],
                                },
                                { type: 'textarea', name: 'instructions', label: 'Instructions', rows: 3 },
                              ],
                              confirmLabel: 'Assign',
                              successToast: `${pred.id} assigned`,
                            })
                          }
                        >
                          <Users className="w-3 h-3" />
                          Assign
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-teal/30 text-teal"
                          onClick={() =>
                            action.open({
                              tone: 'info',
                              icon: Clock,
                              title: `Nudge — ${pred.id}`,
                              description: 'Sends a timely reminder to the prediction owner with the AI reasoning trace attached.',
                              context: [
                                { label: 'Prediction', value: pred.id },
                                { label: 'Project', value: pred.project },
                              ],
                              fields: [
                                { type: 'textarea', name: 'note', label: 'Message', required: true, rows: 3, defaultValue: `Heads up — AI confidence is ${pred.confidence}% on this. Could you take a look?` },
                              ],
                              confirmLabel: 'Send Nudge',
                              successToast: 'Nudge sent',
                            })
                          }
                        >
                          <Clock className="w-3 h-3" />
                          Nudge
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {action.element}
    </>
  )
}
