'use client'

import * as React from 'react'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import {
  hendersonRecommendations,
  hendersonHistory,
  categoryMeta,
  type Recommendation,
  type RecCategory,
} from '@/lib/recommendation-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Sparkles,
  Calendar,
  DollarSign,
  AlertTriangle,
  Users,
  Zap,
  Shield,
  Cloud,
  HardHat,
  ThumbsUp,
  ThumbsDown,
  Ban,
  ChevronDown,
  ChevronRight,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  XCircle,
  Building2,
  Activity,
  Download,
  Check,
} from 'lucide-react'

const categoryIcons: Record<string, React.ElementType> = {
  Calendar, DollarSign, AlertTriangle, Users, Zap, Shield, Cloud, HardHat,
}

const sectionVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

// ─── Timeline Dot component ───
function TimelineDot({
  rec, index, onClick, isActive,
}: {
  rec: Recommendation; index: number; onClick: () => void; isActive: boolean
}) {
  const meta = categoryMeta[rec.category]
  const sizeClass = rec.urgency === 'Immediate' ? 'w-4 h-4' : rec.urgency === 'This Week' ? 'w-3.5 h-3.5' : 'w-3 h-3'
  const statusY = rec.status === 'Accepted' || rec.status === 'Completed' ? '-translate-y-5' : rec.status === 'Dismissed' ? 'translate-y-5' : ''

  const colorMap: Record<string, string> = {
    teal: 'bg-teal', gold: 'bg-gold', red: 'bg-red', purple: 'bg-purple-500',
    navy: 'bg-navy dark:bg-blue-400', slate: 'bg-slate', sky: 'bg-sky-500', amber: 'bg-amber',
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4 + index * 0.06, type: 'spring', stiffness: 200 }}
      onClick={onClick}
      className={cn(
        'rounded-full transition-all relative group',
        sizeClass, colorMap[meta.color] || 'bg-muted',
        statusY,
        isActive && 'ring-2 ring-offset-2 ring-offset-background ring-gold scale-125'
      )}
      title={rec.headline}
    >
      {/* Status indicator */}
      {(rec.status === 'Accepted' || rec.status === 'Completed') && (
        <CheckCircle2 className="w-2.5 h-2.5 text-green absolute -top-3 left-1/2 -translate-x-1/2" />
      )}
      {rec.status === 'Dismissed' && (
        <XCircle className="w-2.5 h-2.5 text-red absolute -bottom-3 left-1/2 -translate-x-1/2" />
      )}
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 hidden group-hover:block z-20 pointer-events-none">
        <div className="bg-card/95 border border-line/50 rounded-lg px-3 py-2 shadow-2xl backdrop-blur-md whitespace-nowrap max-w-[250px]">
          <p className="text-[10px] font-semibold text-foreground truncate">{rec.headline}</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">{rec.category} &middot; {rec.confidencePct}% confidence</p>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Rec Card component ───
function RecCard({ rec, index, isHighlighted, cardRef }: {
  rec: Recommendation; index: number; isHighlighted: boolean; cardRef?: React.RefObject<HTMLDivElement | null>
}) {
  const [expanded, setExpanded] = useState(false)
  const [feedback, setFeedback] = useState(rec.feedbackGiven)
  const meta = categoryMeta[rec.category]
  const IconComp = categoryIcons[meta.icon] || Sparkles
  const isInfo = rec.category === 'External Factor' && rec.impactValue === 0

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      layout
      className={cn(
        'backdrop-blur-sm border rounded-xl overflow-hidden transition-all',
        isInfo
          ? 'bg-green/5 dark:bg-green/8 border-green/30'
          : 'bg-card/80 dark:bg-card/60',
        !isInfo && meta.borderClass,
        isHighlighted && 'ring-2 ring-gold/50 shadow-lg',
        'hover:shadow-md dark:hover:shadow-lg'
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ring-1',
            isInfo ? 'bg-green/10 ring-green/20' : meta.bgClass,
            !isInfo && meta.borderClass
          )}>
            <IconComp className={cn('w-4.5 h-4.5', isInfo ? 'text-green' : meta.textClass)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
                isInfo ? 'bg-green/10 text-green' : `${meta.bgClass} ${meta.textClass}`
              )}>
                {rec.category}
              </span>
              <span className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full',
                rec.urgency === 'Immediate' ? 'bg-red/10 text-red' : rec.urgency === 'This Week' ? 'bg-amber/10 text-amber' : 'bg-teal/10 text-teal'
              )}>
                {rec.urgency === 'Immediate' ? 'ACT TODAY' : rec.urgency.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/50">{rec.id}</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground leading-snug">{rec.headline}</h3>
          </div>
        </div>

        {/* Impact & Confidence */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <TrendingUp className={cn('w-3.5 h-3.5', isInfo ? 'text-green' : 'text-green')} />
            <span className="text-xs font-medium text-foreground">{rec.impact}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Confidence:</span>
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', rec.confidencePct >= 85 ? 'bg-green' : rec.confidencePct >= 70 ? 'bg-amber' : 'bg-red')}
                initial={{ width: 0 }}
                animate={{ width: `${rec.confidencePct}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{rec.confidencePct}%</span>
          </div>
        </div>
      </div>

      {/* Expandable detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-line/30 pt-3">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Evidence</p>
                <ul className="space-y-1">
                  {rec.evidence.map((e, i) => (
                    <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                      <span className={cn('w-1 h-1 rounded-full mt-1.5 shrink-0', isInfo ? 'bg-green' : 'bg-teal')} />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Suggested Actions</p>
                <div className="space-y-1.5">
                  {rec.suggestedActions.map((a, i) => (
                    <button key={i} className="flex items-center gap-2 text-xs text-teal hover:text-teal/80 transition-colors group w-full text-left">
                      <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Reasoning</p>
                <p className="text-xs text-foreground/70 leading-relaxed">{rec.reasoning}</p>
              </div>
              <p className="text-[9px] font-mono text-muted-foreground/50">Source: {rec.source}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-line/20 flex items-center justify-between bg-muted/20 dark:bg-muted/10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
          {expanded ? 'Less detail' : 'More detail'}
        </button>
        <div className="flex items-center gap-1.5">
          {!isInfo && (
            <>
              <button
                onClick={() => setFeedback('up')}
                className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                  feedback === 'up' ? 'bg-green/15 text-green' : 'text-muted-foreground/40 hover:text-green hover:bg-green/10'
                )}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFeedback('down')}
                className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                  feedback === 'down' ? 'bg-red/15 text-red' : 'text-muted-foreground/40 hover:text-red hover:bg-red/10'
                )}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFeedback('irrelevant')}
                className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                  feedback === 'irrelevant' ? 'bg-slate/15 text-slate' : 'text-muted-foreground/40 hover:text-slate hover:bg-slate/10'
                )}
              >
                <Ban className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Page ───
export default function ProjectRecommendationsPage() {
  const { aiEnabled } = useAI()
  const [highlightedRec, setHighlightedRec] = useState<string | null>(null)
  const [historyExpanded, setHistoryExpanded] = useState(false)
  const [exportDone, setExportDone] = useState(false)
  const cardRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({})

  // Create refs for each rec
  hendersonRecommendations.forEach(rec => {
    if (!cardRefs.current[rec.id]) {
      cardRefs.current[rec.id] = React.createRef<HTMLDivElement>()
    }
  })

  const scrollToRec = (id: string) => {
    setHighlightedRec(id)
    cardRefs.current[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => setHighlightedRec(null), 2000)
  }

  const handleExport = () => {
    const data = {
      project: 'Henderson Substation',
      code: 'ODC-HEN-076',
      exportedAt: new Date().toISOString(),
      activeRecommendations: hendersonRecommendations.length,
      history: hendersonHistory,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `henderson-recommendations-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 2000)
  }

  const acceptedCount = hendersonHistory.filter(h => h.status === 'Accepted').length
  const acceptanceRate = Math.round((acceptedCount / hendersonHistory.length) * 100)

  if (!aiEnabled) {
    return (
      <AppShell title="Project Recommendations" subtitle="Henderson Substation" activeHref="/recommendations">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center mx-auto mb-4 ring-1 ring-teal/20">
              <Sparkles className="w-7 h-7 text-teal" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">AI Recommendations Disabled</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Enable AI mode from the header toggle to view project-scoped recommendations.
            </p>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Project Recommendations" subtitle="Henderson Substation" activeHref="/recommendations">
      <motion.div className="space-y-6 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* ─── HEADER ─── */}
        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href="/recommendations">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground -ml-2 h-7">
                    <ArrowLeft className="w-3 h-3" /> Hub
                  </Button>
                </Link>
                <span className="text-muted-foreground/30">|</span>
                <Link href="/projects">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground h-7">
                    <Building2 className="w-3 h-3" /> Project Health
                  </Button>
                </Link>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground">Henderson Substation — Recommendations</h1>
              <p className="text-xs text-muted-foreground mt-1">
                ODC-HEN-076 &middot; <span className="font-semibold text-foreground">{hendersonRecommendations.length} active recommendations</span> &middot; <span className="text-red font-semibold">$3.1M at stake</span>
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs shrink-0 h-8" onClick={handleExport}>
              {exportDone ? <><Check className="w-3.5 h-3.5 text-green" /> Exported</> : <><Download className="w-3.5 h-3.5" /> Export</>}
            </Button>
          </div>
        </motion.div>

        {/* ─── Project Health Strip ─── */}
        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: 'CPI', value: '0.83', color: 'text-red', sub: 'Declining' },
            { label: 'SPI', value: '0.76', color: 'text-red', sub: 'Behind schedule' },
            { label: 'P1 Risks', value: '5', color: 'text-red', sub: 'Open' },
            { label: 'Past SLA', value: '3', color: 'text-amber', sub: 'Orchestrations' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-3"
            >
              <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{stat.label}</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className={cn('text-xl font-bold font-mono', stat.color)}>{stat.value}</p>
                <span className="text-[9px] text-muted-foreground">{stat.sub}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── REGION 1: Recommendation Timeline ─── */}
        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-4 sm:p-5 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-semibold text-foreground">Recommendation Timeline</h3>
              <span className="text-[10px] text-muted-foreground/50">Past 30 days</span>
            </div>
            <div className="flex items-center gap-3 text-[9px] text-muted-foreground/60">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5 text-green" /> Accepted</span>
              <span className="flex items-center gap-1"><XCircle className="w-2.5 h-2.5 text-red" /> Declined</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber inline-block" /> Pending</span>
            </div>
          </div>

          {/* Timeline visualization */}
          <div className="relative">
            {/* Axis line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-line/40" />
            {/* Date labels */}
            <div className="flex justify-between mb-1">
              <span className="text-[9px] font-mono text-muted-foreground/40">Apr 5</span>
              <span className="text-[9px] font-mono text-muted-foreground/40">Apr 12</span>
              <span className="text-[9px] font-mono text-muted-foreground/40">Apr 19</span>
              <span className="text-[9px] font-mono text-muted-foreground/40">Apr 26</span>
              <span className="text-[9px] font-mono text-muted-foreground/60">May 3</span>
              <span className="text-[9px] font-mono text-gold">Today</span>
            </div>
            {/* Dots container */}
            <div className="relative h-20 flex items-center">
              <div className="flex items-center justify-around w-full px-2">
                {hendersonRecommendations.map((rec, i) => (
                  <TimelineDot
                    key={rec.id}
                    rec={rec}
                    index={i}
                    onClick={() => scrollToRec(rec.id)}
                    isActive={highlightedRec === rec.id}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground/40 mt-2 text-center">
            Click a dot to scroll to that recommendation &middot; Size indicates impact &middot; Position above/below axis shows acceptance status
          </p>
        </motion.div>

        {/* ─── REGION 2: Active Recommendations ─── */}
        <motion.section custom={3} variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-teal via-teal/70 to-teal/30" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Active Recommendations</h3>
              <p className="text-[10px] text-muted-foreground/60">Filtered to Henderson Substation &middot; {hendersonRecommendations.length} recommendations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {hendersonRecommendations.map((rec, i) => (
              <RecCard
                key={rec.id}
                rec={rec}
                index={i}
                isHighlighted={highlightedRec === rec.id}
                cardRef={cardRefs.current[rec.id]}
              />
            ))}
          </div>
        </motion.section>

        {/* ─── REGION 3: Recommendation History (Collapsible) ─── */}
        <motion.section custom={4} variants={sectionVariants} initial="hidden" animate="visible">
          <button
            onClick={() => setHistoryExpanded(!historyExpanded)}
            className="flex items-center gap-3 mb-4 w-full text-left group"
          >
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Recommendation History</h3>
              <p className="text-[10px] text-muted-foreground/60">
                Past 90 days &middot; {acceptanceRate}% acceptance rate &middot; {acceptedCount} of {hendersonHistory.length} accepted
              </p>
            </div>
            <motion.div animate={{ rotate: historyExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
          </button>

          <AnimatePresence>
            {historyExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Acceptance rate bar */}
                <div className="mb-4 p-3 bg-card/80 dark:bg-card/60 border border-line/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground">Acceptance Rate</span>
                    <span className="text-sm font-mono font-bold text-green">{acceptanceRate}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green to-green/70 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${acceptanceRate}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* History table */}
                <div className="bg-card/80 dark:bg-card/60 border border-line/50 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-line/30 bg-muted/20">
                          <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                          <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Recommendation</th>
                          <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
                          <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                          <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Outcome</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hendersonHistory.map((item, i) => {
                          const meta = categoryMeta[item.category]
                          return (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className="border-b border-line/20 hover:bg-muted/10 transition-colors cursor-pointer"
                            >
                              <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">{item.date}</td>
                              <td className="px-4 py-3 text-xs text-foreground/80 max-w-[300px]">{item.recommendation}</td>
                              <td className="px-4 py-3 hidden sm:table-cell">
                                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', meta.bgClass, meta.textClass)}>
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={cn(
                                  'text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1',
                                  item.status === 'Accepted' ? 'bg-green/10 text-green' : item.status === 'Declined' ? 'bg-red/10 text-red' : 'bg-muted text-muted-foreground'
                                )}>
                                  {item.status === 'Accepted' && <CheckCircle2 className="w-2.5 h-2.5" />}
                                  {item.status === 'Declined' && <XCircle className="w-2.5 h-2.5" />}
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-muted-foreground/70 hidden md:table-cell max-w-[200px]">{item.outcome}</td>
                            </motion.tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ─── Footer ─── */}
        <motion.div
          custom={5}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between py-3 px-4 bg-card/50 dark:bg-card/30 rounded-xl border border-line/30"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal" />
            <span className="text-[10px] text-muted-foreground">A-305 v2.1.4 &middot; Project scope: Henderson Substation &middot; Last run: 2 min ago</span>
          </div>
          <Link href="/projects" className="text-[10px] text-teal hover:text-teal/80 transition-colors flex items-center gap-1">
            View project health <ChevronRight className="w-3 h-3" />
          </Link>
        </motion.div>

      </motion.div>
    </AppShell>
  )
}
