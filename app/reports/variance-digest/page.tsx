'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  FileText,
  Download,
  Calendar,
  ArrowLeft,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  User,
  Bot,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
  Zap,
} from 'lucide-react'
import { AnimNum, FadeUp } from '@/components/animated-primitives'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Priority = 'P1' | 'P2' | 'P3'
type VarianceType = 'Material' | 'Favorable' | 'Strategic'

interface VarianceCard {
  id: string
  priority: Priority
  type: VarianceType
  title: string
  subtitle: string
  variance: string
  detection: string
  detectionAgent: string
  narrative: string
  attributedTo: string
  actions: { label: string; primary?: boolean }[]
}

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const varianceCards: VarianceCard[] = [
  {
    id: 'V-001',
    priority: 'P1',
    type: 'Material',
    title: 'WEN-Hub2-1 — Awaiting Leadership Decision',
    subtitle: 'Configuration decision pending',
    variance: '-$4.2M cashflow shift to Q3',
    detection: '"Decision Request" workflow past SLA (12d past)',
    detectionAgent: 'SLA Sentinel',
    narrative: 'Configuration alternatives still under review; spec impact propagates to GC bid validity. Recommend escalation by May 25 to avoid quarter-end shift.',
    attributedTo: 'Marcus',
    actions: [{ label: 'Escalate to Brian', primary: true }, { label: 'Schedule decision meeting' }],
  },
  {
    id: 'V-002',
    priority: 'P1',
    type: 'Material',
    title: 'Legal Review — Construction Contracts averaging 74 days',
    subtitle: '6 contracts past SLA, 4 severe',
    variance: '6 contracts past SLA, 4 severe',
    detection: 'Process-type aggregate',
    detectionAgent: 'SLA Sentinel',
    narrative: 'Hyperterm submission queue building; Internal Legal Review at capacity. Two senior counsel on PTO this week. Recommend interim engagement of external counsel for queue clearance.',
    attributedTo: 'Legal Lead',
    actions: [{ label: 'Engage external counsel', primary: true }, { label: 'Reassign Hyperterm queue' }],
  },
  {
    id: 'V-003',
    priority: 'P2',
    type: 'Material',
    title: 'STB-Hub1-1 — Permitting Delay Update',
    subtitle: 'Fire safety review extension',
    variance: '+1.4 months on Design-to-CA forecast',
    detection: 'Schedule variance detected',
    detectionAgent: 'Schedule Performance Agent',
    narrative: 'Jurisdiction request for additional fire safety review extends permit by 6–8 weeks. Engaged local lead; weekly status established.',
    attributedTo: 'Paul Cahill',
    actions: [{ label: 'Update FDOB forecast', primary: true }, { label: 'Notify Procurement' }],
  },
  {
    id: 'V-004',
    priority: 'P3',
    type: 'Favorable',
    title: 'GBL-Hub2-1 — Bid Evaluation Complete, -$1.8M under estimate',
    subtitle: 'Mass timber substitution savings',
    variance: '-$1.8M favorable',
    detection: 'Bid variance analysis',
    detectionAgent: 'Bid Variance Agent',
    narrative: 'Final cost assessment came in below estimate due to mass timber substitution savings. Award letter target May 28.',
    attributedTo: 'Sean Keegan',
    actions: [{ label: 'Confirm award path', primary: true }, { label: 'Update Annual Plan forecast' }],
  },
  {
    id: 'V-005',
    priority: 'P2',
    type: 'Material',
    title: 'EBP-Hub1-1 — YF Initiation Delay',
    subtitle: 'Finance approval backlog',
    variance: '+6 days past SLA (Finance approval)',
    detection: 'Finance step SLA breach',
    detectionAgent: 'SLA Sentinel',
    narrative: 'AR Initiator workload spike from concurrent quarter-end approvals. Reassignment proposed to Cap Planning #2 backup.',
    attributedTo: 'Cap Planning',
    actions: [{ label: 'Approve reassignment', primary: true }],
  },
  {
    id: 'V-006',
    priority: 'P2',
    type: 'Material',
    title: 'ADC-Hub1-3 — Multi-Step PO Delay (86 days end-to-end)',
    subtitle: 'Concurrent Finance and Legal delays',
    variance: 'Outlier, 2.3× avg',
    detection: 'End-to-end cycle anomaly',
    detectionAgent: 'PO Cycle Anomaly Agent',
    narrative: 'Concurrent Finance and Legal delays; reflects systemic legal queue issue (see Card 2). Funded but workflow process audit triggered.',
    attributedTo: 'Lauren Culp',
    actions: [{ label: 'Drill into process audit', primary: true }],
  },
  {
    id: 'V-007',
    priority: 'P2',
    type: 'Strategic',
    title: 'Lisa McIntyre — Two-Week Absence Continuity Flag',
    subtitle: '14 open items, no cross-trained backup',
    variance: '14 open items, no cross-trained backup',
    detection: 'Weekly key-person scan',
    detectionAgent: 'Key-Person Risk Agent',
    narrative: 'Lisa carries 8 NA-W projects; absence would impact ARA, KNC, KAS, NBF, UNO, RED narrative cadence. Loren Smith partially trained but at capacity.',
    attributedTo: 'System',
    actions: [{ label: 'Open cross-training plan', primary: true }, { label: 'Review backup designation' }],
  },
  {
    id: 'V-008',
    priority: 'P3',
    type: 'Favorable',
    title: 'PO Workflow Initiation — Avg dropped to 11 days from 14',
    subtitle: 'eBuilder optimization deployed',
    variance: '-3 days avg cycle',
    detection: 'Trend improvement detected',
    detectionAgent: 'PO Cycle Trend Agent',
    narrative: 'eBuilder workflow optimization deployed Apr 25 cleared queue. SLA Sentinel auto-routing eliminated redundant approver pings.',
    attributedTo: 'LineSight',
    actions: [{ label: 'Document as improvement', primary: true }, { label: 'Apply pattern to Construction PO' }],
  },
  {
    id: 'V-009',
    priority: 'P2',
    type: 'Material',
    title: 'NCH-Hub1-1 — FP&A Review Extended',
    subtitle: 'Additional documentation requested',
    variance: '+8 days on funding cycle',
    detection: 'Step duration anomaly',
    detectionAgent: 'SLA Sentinel',
    narrative: 'FP&A requested additional justification documents for phased funding approach. Documentation submitted May 14.',
    attributedTo: 'Sophia Lamb',
    actions: [{ label: 'Follow up with FP&A' }],
  },
  {
    id: 'V-010',
    priority: 'P3',
    type: 'Material',
    title: 'HRF-Hub1-1 — BDP Mismatch Resolved',
    subtitle: 'MW value aligned with BDP',
    variance: 'BDP reconciled',
    detection: 'BDP conflict resolution',
    detectionAgent: 'BDP Reconciler',
    narrative: 'MW mismatch flagged May 10 resolved via directive attachment. No cashflow impact.',
    attributedTo: 'Hasit Chetal',
    actions: [{ label: 'Verify BDP sync' }],
  },
  {
    id: 'V-011',
    priority: 'P3',
    type: 'Favorable',
    title: 'CLB-Hub2-1 — Early CA Achievement',
    subtitle: 'Permitting completed ahead of schedule',
    variance: '-2 weeks on CA milestone',
    detection: 'Schedule variance (favorable)',
    detectionAgent: 'Schedule Performance Agent',
    narrative: 'Jurisdiction expedited review due to pre-submission engagement. CA achieved May 12 vs May 26 target.',
    attributedTo: 'Regional PgM',
    actions: [{ label: 'Update FDOB forecast' }],
  },
  {
    id: 'V-012',
    priority: 'P3',
    type: 'Material',
    title: 'SGR-Hub1-2 — GC Bid Variance +$2.1M',
    subtitle: 'Material cost escalation',
    variance: '+$2.1M over estimate',
    detection: 'Bid variance threshold breach',
    detectionAgent: 'Bid Variance Agent',
    narrative: 'Steel cost escalation and regional labor shortage drove bid 12% over estimate. Value engineering options under review.',
    attributedTo: 'Sean Keegan',
    actions: [{ label: 'Review VE options', primary: true }, { label: 'Escalate if needed' }],
  },
]

const priorityConfig: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  P1: { label: 'P1 Critical', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-l-red-500' },
  P2: { label: 'P2 High', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-l-amber-500' },
  P3: { label: 'P3 Medium', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/30', border: 'border-l-slate-400' },
}

const typeConfig: Record<VarianceType, { icon: React.ElementType; color: string }> = {
  Material: { icon: AlertTriangle, color: 'text-amber-500' },
  Favorable: { icon: TrendingDown, color: 'text-emerald-500' },
  Strategic: { icon: Users, color: 'text-teal-500' },
}

// ─────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────

export default function VarianceDigestPage() {
  const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set(['V-001', 'V-002']))

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleExport = () => {
    const content = `Variance Explainer Digest - Week Ending May 17, 2026\n\n${varianceCards.map(c => 
      `${c.priority} | ${c.title}\nVariance: ${c.variance}\nNarrative: ${c.narrative}\nAttribued to: ${c.attributedTo}\n`
    ).join('\n')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'variance-digest-may-17-2026.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell title="Variance Digest">
      <motion.div 
        className="space-y-6 w-full"
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

        {/* ─── Header Band ─── */}
        <FadeUp delay={0}>
          <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Link 
                  href="/reports" 
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Back to Reports"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
                <h1 className="text-sm md:text-base font-bold tracking-tight text-foreground">
                  Variance Explainer Digest
                </h1>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl ml-10">
                Top portfolio movements this week, paired with narratives. <span className="text-gold font-medium">12 material variances</span> covered.
              </p>
              <div className="ml-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gold text-navy rounded-full text-[10px] font-semibold tracking-wide">
                  <FileText className="w-3 h-3" />
                  VARIANCE EXPLAINER DIGEST · WEEK ENDING MAY 17, 2026
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={handleExport}
                className="h-9 px-4 inline-flex items-center gap-2 text-xs font-medium bg-gold text-navy hover:bg-gold-soft rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button className="h-9 px-4 inline-flex items-center gap-2 text-xs font-medium bg-navy/10 dark:bg-white/10 text-navy dark:text-foreground border border-navy/30 dark:border-white/30 hover:bg-navy/20 dark:hover:bg-white/20 rounded-lg transition-colors">
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Schedule</span>
              </button>
            </div>
          </div>
          </div>
        </FadeUp>

        {/* ─── Executive Summary ─── */}
        <div className="bg-card border border-line rounded-xl p-5 md:p-6 border-l-4 border-l-gold">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-gold" />
            Executive Summary
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The portfolio moved <span className="font-semibold text-red-600 dark:text-red-400">-$11.2M net</span> this week, 
            driven by three field-condition events in NA-W partially offset by approved bid variance gains in EMEA. 
            Most material item: <span className="font-medium text-foreground">WEN-Hub2-1</span> configuration decision still pending; 
            cashflow impact carries forward. PgM bench: <span className="font-medium text-foreground">Lisa McIntyre</span> flagged 
            at-risk for two-week absence test continuity; cross-training initiative recommended.
          </p>
        </div>

        {/* ─── Variance Cards ─── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Material Variances</h2>
            <span className="text-xs text-muted-foreground font-mono">Sorted by absolute impact</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {varianceCards.map((card, index) => {
              const pCfg = priorityConfig[card.priority]
              const tCfg = typeConfig[card.type]
              const TypeIcon = tCfg.icon
              const isExpanded = expandedCards.has(card.id)

              return (
                <div
                  key={card.id}
                  className={cn(
                    'bg-card border border-line rounded-xl overflow-hidden transition-all',
                    'border-l-4',
                    pCfg.border
                  )}
                >
                  {/* Card Header - Always Visible */}
                  <button
                    onClick={() => toggleCard(card.id)}
                    className="w-full p-4 md:p-5 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-mono text-muted-foreground">#{index + 1}</span>
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', pCfg.bg, pCfg.color)}>
                            {pCfg.label}
                          </span>
                          <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium', tCfg.color)}>
                            <TypeIcon className="w-3 h-3" />
                            {card.type}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
                          {card.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{card.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className={cn(
                            'text-sm font-semibold',
                            card.type === 'Favorable' ? 'text-emerald-600 dark:text-emerald-400' : 
                            card.priority === 'P1' ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                          )}>
                            {card.variance}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    {/* Mobile variance display */}
                    <div className={cn(
                      'sm:hidden mt-2 text-sm font-semibold',
                      card.type === 'Favorable' ? 'text-emerald-600 dark:text-emerald-400' : 
                      card.priority === 'P1' ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                    )}>
                      {card.variance}
                    </div>
                  </button>

                  {/* Card Body - Expandable */}
                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0 border-t border-line/50 space-y-4">
                      {/* Detection */}
                      <div className="flex items-start gap-3 pt-4">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide mb-1">
                            Detection — {card.detectionAgent}
                          </div>
                          <p className="text-xs text-muted-foreground">{card.detection}</p>
                        </div>
                      </div>

                      {/* Narrative */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                            Narrative — Attributed to {card.attributedTo}
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{card.narrative}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {card.actions.map((action, i) => (
                          <button
                            key={i}
                            className={cn(
                              'h-8 px-3 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5',
                              action.primary
                                ? 'bg-gold text-navy hover:bg-gold/90'
                                : 'bg-secondary text-foreground hover:bg-secondary/80 border border-line'
                            )}
                          >
                            {action.label}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ─── Agent Activity Summary ─── */}
        <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/50 rounded-xl p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-teal-800 dark:text-teal-200 mb-1">
                Agent Activity Summary
              </h3>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                This digest was assembled by the <span className="font-semibold">Variance Explainer Agent (Tier 2)</span> from 
                <span className="font-semibold"> 247 monitored signals</span>. 12 surfaced as material. 
                38 minor variances auto-filed without surfacing.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <footer className="bg-card border border-line rounded-xl p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[10px] text-muted-foreground font-mono">
            <div className="flex flex-wrap items-center gap-4">
              <span>Generated: May 17, 2026 04:00 PDT</span>
              <span className="hidden md:inline">·</span>
              <span>Version: 1.0.3</span>
              <span className="hidden md:inline">·</span>
              <span>Distribution: PgMs, Brian Smith, Hasit Chetal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>Next scheduled: May 24, 2026 04:00 PDT</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-3 leading-relaxed">
            Source: All KPI streams from odc_semantic + orchestration engine events + Party Intelligence reliability metrics. 
            Narratives sourced from PgM weekly updates and Project Narrative field with attribution preserved.
          </p>
        </footer>

      </motion.div>
    </AppShell>
  )
}
