'use client'

import * as React from 'react'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useSvgPathAnimation } from '@/hooks/use-svg-path-animation'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Calendar,
  FileText,
  Building2,
  Package,
  Users,
  Shield,
  Sparkles,
  Target,
  BarChart3,
  Layers,
  ArrowUpRight,
  Info,
  Play,
  RefreshCw,
  Download,
  Eye,
  Check,
  X,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ExternalLink,
  Upload,
  Send,
  Save,
  Zap,
  Activity,
  PieChart,
  TrendingUp as TrendUp,
} from 'lucide-react'
import Link from 'next/link'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

// Worked example data from spec
const PERIOD = 'Q3 2026'
const ALLOCATED = 82.0
const SPENT_TO_DATE = 53.0
const GAP_TO_CLOSE = 29.0
const CURRENT_UTILIZATION = 64.6
const WEEKS_ELAPSED = 7
const TOTAL_WEEKS = 13
const WEEKS_REMAINING = 6
const PACE_GAP = 9.4

// Animated counter component
function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 1 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => `${prefix}${latest.toFixed(decimals)}${suffix}`)
  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`)

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] })
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v))
    return () => { controls.stop(); unsubscribe() }
  }, [value, count, rounded])

  return <span>{displayValue}</span>
}

// Progress ring component
function ProgressRing({ value, max, size = 56, strokeWidth = 4, color = 'teal' }: { value: number; max: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = (value / max) * 100
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`text-${color}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold font-mono">{progress.toFixed(0)}%</span>
      </div>
    </div>
  )
}

// Lever data from spec
const leversData = [
  {
    id: 1,
    name: 'Pull forward committed-but-unPOed work',
    shortName: 'Committed Work',
    description: 'Budgeted work where the PO has not been raised. Raising it converts Budgeted to Committed. Zero new scope — the cleanest lever.',
    capacity: 11.0,
    defaultBalanced: 11.0,
    defaultConservative: 11.0,
    defaultFull: 11.0,
    confidenceTier: 'Committed',
    auditWeight: 0,
    icon: CheckCircle2,
    gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
    projects: [
      { project: 'KNC-Hub2-1&3', region: 'NA-W', scope: 'MV switchgear package', budgeted: 3.2, poStatus: 'Not raised' },
      { project: 'ARA-Hub1-1&2', region: 'NA-W', scope: 'Electrical rough-in CO', budgeted: 2.6, poStatus: 'Not raised' },
      { project: 'GBL-Hub2-1', region: 'EMEA', scope: 'Mechanical fit-out', budgeted: 2.4, poStatus: 'Drafted' },
      { project: 'STB-Hub1-1', region: 'EMEA', scope: 'Site civils package', budgeted: 1.8, poStatus: 'Not raised' },
      { project: 'CLB-Hub1-3', region: 'NA-E', scope: 'Commissioning scope', budgeted: 1.0, poStatus: 'Not raised' },
    ],
  },
  {
    id: 2,
    name: 'Accelerate long-lead material procurement',
    shortName: 'Materials',
    description: 'Transformers, switchgear, copper, cable for funded pipeline projects. Hedges price escalation and de-risks next-period schedule.',
    capacity: 9.0,
    defaultBalanced: 9.0,
    defaultConservative: 7.0,
    defaultFull: 9.0,
    confidenceTier: 'Committed',
    auditWeight: 1,
    icon: Package,
    gradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
    projects: [
      { item: 'Transformer >5MVA', forProject: 'KNC-Hub2 next phase', leadTime: '52 wk', cost: 3.4, priceTrend: '+6% if deferred to Q4' },
      { item: 'HV switchgear 15kV', forProject: 'STB-Hub1 pipeline', leadTime: '38 wk', cost: 2.6, priceTrend: '+4% if deferred' },
      { item: 'Copper / cable lot', forProject: 'NA-W pipeline', leadTime: '12 wk', cost: 1.8, priceTrend: '+14% YoY (LME)' },
      { item: 'Chiller motor set', forProject: 'GBL-Hub2 pipeline', leadTime: '22 wk', cost: 1.2, priceTrend: 'Rare-earth tightening' },
    ],
  },
  {
    id: 3,
    name: 'Accelerate milestone-based contractor payments',
    shortName: 'Milestones',
    description: 'Where contractors are ahead of the payment schedule and a milestone is genuinely earned this quarter. Requires the work to be done — not a prepayment.',
    capacity: 6.0,
    defaultBalanced: 5.0,
    defaultConservative: 0,
    defaultFull: 6.0,
    confidenceTier: 'Committed',
    auditWeight: 1,
    icon: Users,
    gradient: 'from-violet-500/20 via-violet-500/10 to-transparent',
    projects: [
      { project: 'ADC-Hub1-3', milestone: 'Foundation complete', contractor: 'GCON', earned: 'Yes — verified', amount: 2.4 },
      { project: 'STY-Hub1-2&3', milestone: 'Shell weathertight', contractor: 'Devcon', earned: 'Yes — verified', amount: 1.6 },
      { project: 'EBP-Hub1-1', milestone: 'Site mobilization', contractor: 'Developer GC', earned: 'Yes — verified', amount: 1.0 },
    ],
  },
  {
    id: 4,
    name: 'Fund design / pre-construction for next period',
    shortName: 'Design',
    description: 'Seed-stage design dollars for BDP-pipeline projects. Compresses next-period Design-to-CA timeline — design is genuinely sequential.',
    capacity: 5.0,
    defaultBalanced: 3.0,
    defaultConservative: 0,
    defaultFull: 5.0,
    confidenceTier: 'Budgeted',
    auditWeight: 1,
    icon: FileText,
    gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
    projects: [
      { project: 'HJS-Hub2-1', stage: 'Variant design pilot', region: 'NA-W', bdp: 'On BDP', designAsk: 2.2 },
      { project: 'NCH-Hub1-1', stage: 'POR Variant design', region: 'NA-W', bdp: 'On BDP', designAsk: 1.6 },
      { project: 'PCH-Hub1-1', stage: 'Concept design', region: 'NA-W', bdp: 'On BDP', designAsk: 1.2 },
    ],
  },
  {
    id: 5,
    name: 'Pre-fund FFC / field-condition contingency',
    shortName: 'Contingency',
    description: 'Establish a field-condition contingency commitment now. A reserve, not work — weaker than levers 1-4. Use only with field-condition likelihood.',
    capacity: 4.0,
    defaultBalanced: 0,
    defaultConservative: 0,
    defaultFull: 4.0,
    confidenceTier: 'Budgeted',
    auditWeight: 2,
    icon: Shield,
    gradient: 'from-orange-500/20 via-orange-500/10 to-transparent',
    projects: [
      { project: 'WXT-Hub1-2', fieldRisk: 'Sub-surface conditions', likelihood: 'High', reserveAsk: 1.8 },
      { project: 'HGB-Hub1-1', fieldRisk: 'Permitting field rework', likelihood: 'Medium', reserveAsk: 1.4 },
      { project: 'EMB-Hub1-1', fieldRisk: 'Site access remediation', likelihood: 'Medium', reserveAsk: 0.8 },
    ],
  },
  {
    id: 6,
    name: 'Scope enhancements with ROI payback',
    shortName: 'ROI Scope',
    description: 'Genuine value-adds with a hard payback case. The lowest rung — most likely to read as year-end spending. Each line needs an ROI memo.',
    capacity: 4.0,
    defaultBalanced: 0,
    defaultConservative: 0,
    defaultFull: 4.0,
    confidenceTier: 'Budgeted',
    auditWeight: 3,
    icon: TrendUp,
    gradient: 'from-rose-500/20 via-rose-500/10 to-transparent',
    projects: [
      { project: 'KNC-Hub2-1&3', enhancement: 'Commissioning automation', payback: '2.1 yr', cost: 1.6 },
      { project: 'ARA-Hub1-1&2', enhancement: 'Heat-recovery retrofit', payback: '3.4 yr', cost: 1.4 },
      { project: 'GBL-Hub2-1', enhancement: 'Monitoring instrumentation', payback: '2.8 yr', cost: 1.0 },
    ],
  },
]

// Pace line data (weekly cumulative)
const paceLineData = Array.from({ length: TOTAL_WEEKS }, (_, i) => {
  const week = i + 1
  const paceTarget = (ALLOCATED / TOTAL_WEEKS) * week
  let actual: number | null = null
  if (week <= WEEKS_ELAPSED) {
    if (week === 1) actual = 6.5
    else if (week === 2) actual = 13.2
    else if (week === 3) actual = 20.1
    else if (week === 4) actual = 27.8
    else if (week === 5) actual = 35.2
    else if (week === 6) actual = 43.6
    else if (week === 7) actual = SPENT_TO_DATE
  }
  return { week, paceTarget: Math.round(paceTarget * 10) / 10, actual }
})

// Historical quarters
const historicalQuarters = [
  { quarter: 'Q3 2025', closed: 91, residual: -7 },
  { quarter: 'Q4 2025', closed: 96, residual: -3 },
  { quarter: 'Q1 2026', closed: 99, residual: -1 },
  { quarter: 'Q2 2026', closed: 88, residual: -10 },
]

// Lever justification starter text
const leverJustificationStarters: Record<number, string> = {
  1: 'Raising POs on funded, scope-approved work. No new scope; this is execution of commitments already approved — pulled forward to deploy allocated capital within the period.',
  2: 'Long-lead materials for funded pipeline projects. Procuring now hedges documented price escalation (transformers, copper) and de-risks next-period schedule; lead times require ordering in this window regardless.',
  3: 'Milestone payments for work verified complete and ahead of the payment schedule. Not a prepayment — the work is earned.',
  4: 'Pre-construction design funding for BDP-pipeline projects. Design is sequential; funding it now compresses next-period Design-to-CA timeline.',
  5: '',
  6: '',
}

// Decision Memo Modal Component
interface DecisionMemoModalProps {
  period: string
  selectedPosture: string
  leverValues: Record<number, number>
  leversData: typeof leversData
  allocated: number
  spentToDate: number
  gap: number
  cappedDeployed: number
  endingUtilization: number
  residualUnderspend: number
  auditExposure: string
  onClose: () => void
}

function DecisionMemoModal({
  period,
  selectedPosture,
  leverValues,
  leversData,
  allocated,
  spentToDate,
  gap,
  cappedDeployed,
  endingUtilization,
  residualUnderspend,
  auditExposure,
  onClose,
}: DecisionMemoModalProps) {
  const [situationText, setSituationText] = useState(
    `${period} allocation of $${allocated.toFixed(1)}M; $${spentToDate.toFixed(1)}M deployed at week 7; $${gap.toFixed(1)}M gap. Without action, projected close is $${(spentToDate + 8).toFixed(1)}M (a $${(allocated - spentToDate - 8).toFixed(1)}M / ${(((allocated - spentToDate - 8) / allocated) * 100).toFixed(1)}% underspend). This memo records the planned deployment of $${cappedDeployed.toFixed(1)}M and the rationale for each lever.`
  )
  const [leverJustifications, setLeverJustifications] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {}
    leversData.forEach(lever => {
      if (leverValues[lever.id] > 0) {
        initial[lever.id] = leverJustificationStarters[lever.id] || ''
      }
    })
    return initial
  })
  const [nextPeriodText, setNextPeriodText] = useState(
    `This deployment accelerates work already in the portfolio plan. It does not invent scope and does not compromise next-period readiness. The $${residualUnderspend.toFixed(1)}M residual is retained deliberately. Next-period allocation requirement is unchanged at $85.0M.`
  )
  const [roiFile, setRoiFile] = useState<File | null>(null)
  const [approvalStatus, setApprovalStatus] = useState<Record<string, 'pending' | 'approved'>>({
    preparer: 'pending',
    controlsLead: 'pending',
    director: 'pending',
    finance: 'pending',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null)

  const activeLevers = leversData.filter(lever => leverValues[lever.id] > 0)
  const totalActiveAmount = activeLevers.reduce((sum, lever) => sum + leverValues[lever.id], 0)
  const memoRef = `MEMO-2026-${period.replace('Q', '')}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const lever5Active = leverValues[5] > 0
  const lever6Active = leverValues[6] > 0
  const lever5Valid = !lever5Active || (leverJustifications[5]?.length >= 30)
  const lever6Valid = !lever6Active || ((leverJustifications[6]?.length >= 30) && roiFile !== null)
  const canSubmit = lever5Valid && lever6Valid && activeLevers.every(l => (leverJustifications[l.id]?.length || 0) >= 30)

  // Save Draft handler
  const handleSaveDraft = async () => {
    setIsSaving(true)
    setSavedMessage(null)
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const draftData = {
      memoRef,
      period,
      posture: selectedPosture,
      situationText,
      leverJustifications,
      nextPeriodText,
      levers: activeLevers.map(l => ({ id: l.id, name: l.name, value: leverValues[l.id] })),
      totalAmount: totalActiveAmount,
      savedAt: new Date().toISOString(),
    }
    
    // Save to localStorage
    localStorage.setItem(`memo-draft-${period}`, JSON.stringify(draftData))
    
    setIsSaving(false)
    setSavedMessage('Draft saved successfully')
    setTimeout(() => setSavedMessage(null), 3000)
  }

  // Export PDF handler
  const handleExportPDF = () => {
    // Create memo content for PDF
    const memoContent = `
DEPLOYMENT DECISION MEMO
========================
Reference: ${memoRef}
Period: ${period}
Generated: ${today}
Scenario: ${selectedPosture.charAt(0).toUpperCase() + selectedPosture.slice(1)}
Total Deployment: $${totalActiveAmount.toFixed(1)}M across ${activeLevers.length} levers

SITUATION
---------
${situationText}

DEPLOYMENT PLAN
---------------
${activeLevers.map(lever => `Lever ${lever.id}: ${lever.name}
  Amount: $${leverValues[lever.id].toFixed(1)}M
  Confidence: ${lever.confidenceTier}
  Audit Weight: ${lever.auditWeight}
  Projects Affected: ${lever.projects.length}
`).join('\n')}

PER-LEVER JUSTIFICATION
-----------------------
${activeLevers.map(lever => `Lever ${lever.id}: ${lever.name}
${leverJustifications[lever.id] || 'No justification provided'}
`).join('\n')}

NEXT-PERIOD ASSURANCE
---------------------
${nextPeriodText}

APPROVAL ROUTING
----------------
Prepared by: Current User (Pending)
Portfolio Controls: Hasit Chetal (Pending)
Portfolio Director: Sreya Mukherjee (Pending)
Finance Review: Finance Team (Pending)

---
This memo is logged immutably and linked to every PO and funding action taken under this scenario.
    `.trim()

    // Create and download as text file (simulating PDF export)
    const blob = new Blob([memoContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${memoRef.toLowerCase()}-deployment-memo.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Submit for Approval handler
  const handleSubmitForApproval = async () => {
    if (!canSubmit) return
    
    setIsSubmitting(true)
    setSubmittedMessage(null)
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // Update preparer status to approved (simulating that the preparer has signed off)
    setApprovalStatus(prev => ({ ...prev, preparer: 'approved' }))
    
    setIsSubmitting(false)
    setSubmittedMessage('Memo submitted for approval. Routing to Portfolio Controls.')
    
    // Close modal after a delay
    setTimeout(() => {
      onClose()
    }, 2500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-[780px] max-h-[92vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-border/50 shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/20">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Deployment Decision Memo</h2>
                  <p className="text-xs text-muted-foreground">{period} Capital Deployment Authorization</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-gold/15 text-gold font-semibold capitalize">{selectedPosture}</span>
                <span className="text-muted-foreground">${totalActiveAmount.toFixed(1)}M across {activeLevers.length} levers</span>
                <span className="text-muted-foreground/50">|</span>
                <span className="font-mono text-muted-foreground/70">{memoRef}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1 - Situation */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">1</span>
              <h3 className="text-sm font-bold text-foreground">Situation & Context</h3>
            </div>
            <textarea
              value={situationText}
              onChange={(e) => setSituationText(e.target.value)}
              className="w-full h-28 p-4 text-[12px] leading-relaxed bg-muted/30 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 text-foreground placeholder:text-muted-foreground transition-all"
            />
          </div>

          {/* Section 2 - Deployment Plan Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">2</span>
              <h3 className="text-sm font-bold text-foreground">Deployment Plan Summary</h3>
            </div>
            <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/20">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-semibold text-muted-foreground">Lever</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">Amount</th>
                      <th className="text-center p-3 font-semibold text-muted-foreground">Confidence</th>
                      <th className="text-center p-3 font-semibold text-muted-foreground">Projects</th>
                      <th className="text-center p-3 font-semibold text-muted-foreground">Audit Wt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {activeLevers.map(lever => (
                      <tr key={lever.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <lever.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground font-medium">L{lever.id}: {lever.shortName}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-mono font-bold text-teal">${leverValues[lever.id].toFixed(1)}M</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={cn(
                            'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold',
                            lever.confidenceTier === 'Committed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          )}>
                            {lever.confidenceTier}
                          </span>
                        </td>
                        <td className="p-3 text-center text-muted-foreground">{lever.projects.length}</td>
                        <td className="p-3 text-center">
                          <span className={cn(
                            'inline-flex w-6 h-6 items-center justify-center rounded-lg text-[10px] font-bold',
                            lever.auditWeight === 0 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                            lever.auditWeight === 1 ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' :
                            lever.auditWeight === 2 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          )}>
                            {lever.auditWeight}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gold/10 border-t border-gold/20">
                      <td className="p-3 font-bold text-foreground">Total</td>
                      <td className="p-3 text-right font-mono font-bold text-gold text-sm">${totalActiveAmount.toFixed(1)}M</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Section 3 - Per-Lever Justification */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">3</span>
              <h3 className="text-sm font-bold text-foreground">Per-Lever Justification</h3>
            </div>
            {activeLevers.map(lever => {
              const isLever5or6 = lever.id === 5 || lever.id === 6
              const charCount = leverJustifications[lever.id]?.length || 0
              const isValid = charCount >= 30
              return (
                <div key={lever.id} className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <lever.icon className="w-4 h-4 text-muted-foreground" />
                      <p className="text-[11px] font-bold text-foreground">
                        Lever {lever.id}: {lever.shortName}
                        {isLever5or6 && <span className="text-rose-500 ml-1">*</span>}
                      </p>
                    </div>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', isValid ? 'bg-emerald-500/15 text-emerald-600' : 'bg-muted text-muted-foreground')}>
                      {charCount}/30 min
                    </span>
                  </div>
                  <textarea
                    value={leverJustifications[lever.id] || ''}
                    onChange={(e) => setLeverJustifications(prev => ({ ...prev, [lever.id]: e.target.value }))}
                    placeholder={isLever5or6 ? 'Required: Provide detailed justification for this lever...' : 'Edit justification...'}
                    className={cn(
                      'w-full h-20 p-3 text-[11px] leading-relaxed bg-background/50 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all text-foreground placeholder:text-muted-foreground/50',
                      !isValid && isLever5or6 ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-border/50 focus:ring-gold/30 focus:border-gold/50'
                    )}
                  />
                  {lever.id === 6 && leverValues[6] > 0 && (
                    <div className="flex items-center gap-3 pt-1">
                      <label className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-[11px] font-medium',
                        roiFile ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-muted/30 border-border/50 hover:border-gold/30 text-muted-foreground hover:text-foreground'
                      )}>
                        <Upload className="w-4 h-4" />
                        {roiFile ? roiFile.name : 'Attach ROI Case'}
                        <input
                          type="file"
                          accept=".pdf,.xlsx,.docx"
                          className="hidden"
                          onChange={(e) => setRoiFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      {!roiFile && <span className="text-[10px] text-rose-500 font-medium">Required for Lever 6</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Section 4 - Next-Period Assurance */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">4</span>
              <h3 className="text-sm font-bold text-foreground">Next-Period Assurance</h3>
            </div>
            <textarea
              value={nextPeriodText}
              onChange={(e) => setNextPeriodText(e.target.value)}
              className="w-full h-24 p-4 text-[12px] leading-relaxed bg-muted/30 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 text-foreground placeholder:text-muted-foreground transition-all"
            />
          </div>

          {/* Section 5 - Approvals */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">5</span>
              <h3 className="text-sm font-bold text-foreground">Approval Routing</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'preparer', label: 'Prepared by', name: 'Current User', role: 'Analyst' },
                { key: 'controlsLead', label: 'Portfolio Controls', name: 'Hasit Chetal', role: 'Controls Lead' },
                { key: 'director', label: 'Portfolio Director', name: 'Sreya Mukherjee', role: 'Director' },
                { key: 'finance', label: 'Finance Review', name: 'Finance Team', role: 'Finance' },
              ].map((approver) => (
                <div key={approver.key} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                  <div>
                    <p className="text-[10px] text-muted-foreground">{approver.label}</p>
                    <p className="text-[12px] font-semibold text-foreground">{approver.name}</p>
                  </div>
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold',
                    approvalStatus[approver.key] === 'approved' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-muted text-muted-foreground'
                  )}>
                    {approvalStatus[approver.key] === 'approved' ? (
                      <><Check className="w-3 h-3" /> Approved</>
                    ) : (
                      <><Clock className="w-3 h-3" /> Pending</>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border/50 bg-muted/30 shrink-0">
          {/* Success/Status messages */}
          <AnimatePresence>
            {(savedMessage || submittedMessage) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'mb-3 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2',
                  submittedMessage ? 'bg-emerald-500/15 text-emerald-600' : 'bg-teal/15 text-teal'
                )}
              >
                <CheckCircle2 className="w-4 h-4" />
                {submittedMessage || savedMessage}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex gap-2 flex-1">
              <Button variant="outline" size="sm" onClick={onClose} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex-1 sm:flex-none gap-1.5"
              >
                {isSaving ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-3.5 h-3.5" /> Save Draft</>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportPDF}
                className="flex-1 sm:flex-none gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </Button>
            </div>
            <Button 
              size="sm" 
              disabled={!canSubmit || isSubmitting}
              onClick={handleSubmitForApproval}
              className={cn(
                'flex-1 sm:flex-none gap-1.5 transition-all shadow-lg',
                canSubmit && !isSubmitting ? 'bg-gradient-to-r from-gold to-amber-600 hover:from-gold/90 hover:to-amber-600/90 text-white shadow-gold/25' : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
              )}
            >
              {isSubmitting ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-3.5 h-3.5" /> Submit for Approval</>
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
            This memo is logged immutably and linked to every PO and funding action taken under this scenario.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CapitalDeploymentPage() {
  const { aiEnabled } = useAI()
  const { svgRef } = useSvgPathAnimation({ delay: 0, duration: 2000 })
  const [selectedPosture, setSelectedPosture] = useState<'conservative' | 'balanced' | 'full' | 'custom'>('balanced')
  const [leverValues, setLeverValues] = useState<Record<number, number>>({
    1: 11.0, 2: 9.0, 3: 5.0, 4: 3.0, 5: 0, 6: 0
  })
  const [expandedLever, setExpandedLever] = useState<number | null>(1)
  const [showMemoModal, setShowMemoModal] = useState(false)
  const [showHistorySection, setShowHistorySection] = useState(false)

  // Apply posture presets
  const applyPosture = (posture: 'conservative' | 'balanced' | 'full') => {
    setSelectedPosture(posture)
    const newValues: Record<number, number> = {}
    leversData.forEach(lever => {
      if (posture === 'conservative') newValues[lever.id] = lever.defaultConservative
      else if (posture === 'balanced') newValues[lever.id] = lever.defaultBalanced
      else newValues[lever.id] = lever.defaultFull
    })
    setLeverValues(newValues)
  }

  // Handle slider change
  const handleSliderChange = (leverId: number, value: number) => {
    setLeverValues(prev => ({ ...prev, [leverId]: value }))
    setSelectedPosture('custom')
  }

  // Calculate totals
  const totalDeployed = useMemo(() => {
    return Object.values(leverValues).reduce((sum, v) => sum + v, 0)
  }, [leverValues])

  const cappedDeployed = Math.min(totalDeployed, GAP_TO_CLOSE)
  const endingUtilization = ((SPENT_TO_DATE + cappedDeployed) / ALLOCATED) * 100
  const residualUnderspend = Math.max(0, GAP_TO_CLOSE - totalDeployed)

  // Audit exposure calculation
  const auditExposure = useMemo(() => {
    let weightedSum = 0
    let totalUsed = 0
    leversData.forEach(lever => {
      const value = leverValues[lever.id] || 0
      weightedSum += value * lever.auditWeight
      totalUsed += value
    })
    if (totalUsed === 0) return 'None'
    const score = weightedSum / totalUsed
    if (score < 0.4) return 'Very low'
    if (score < 1.2) return 'Low'
    if (score < 2.1) return 'Moderate'
    return 'Elevated'
  }, [leverValues])

  // Committed vs Budgeted breakdown
  const committedAmount = (leverValues[1] || 0) + (leverValues[2] || 0) + (leverValues[3] || 0)
  const budgetedAmount = (leverValues[4] || 0) + (leverValues[5] || 0) + (leverValues[6] || 0)

  if (!aiEnabled) {
    return (
      <AppShell title="Capital Deployment Planner" subtitle="Enable AI to access this feature" activeHref="/recommendations/capital-deployment">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-gold/20">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">AI Recommendations Required</h2>
            <p className="text-sm text-muted-foreground">Enable the AI toggle in the header to access capital deployment planning and optimization.</p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Capital Deployment Planner"
      subtitle={`Model how to deploy the remaining allocation on legitimate portfolio purposes before ${PERIOD} closes`}
      activeHref="/recommendations/capital-deployment"
      headerExtra={
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold/15 to-amber-500/10 border border-gold/20">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs font-bold text-gold">{PERIOD}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Model
          </div>
        </div>
      }
    >
      <motion.div className="space-y-8 w-full" variants={containerVariants} initial="hidden" animate="visible">

        {/* REGION 1 — Deployment Gap Summary (5 KPI cards) */}
        <motion.section variants={sectionVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Allocated', value: ALLOCATED, prefix: '$', suffix: 'M', sub: `${PERIOD} approved allocation`, color: 'foreground', bgClass: 'bg-slate-500/10', icon: Target },
            { label: 'Spent to date', value: SPENT_TO_DATE, prefix: '$', suffix: 'M', sub: 'Committed + actualised', color: 'teal', bgClass: 'bg-teal/10', icon: CheckCircle2 },
            { label: 'Gap to close', value: GAP_TO_CLOSE, prefix: '$', suffix: 'M', sub: `${((GAP_TO_CLOSE/ALLOCATED)*100).toFixed(1)}% of allocation`, color: 'amber', bgClass: 'bg-amber/10', icon: AlertTriangle },
            { label: 'Current utilization', value: CURRENT_UTILIZATION, prefix: '', suffix: '%', sub: 'Target by close: 98%+', color: 'teal', bgClass: 'bg-teal/10', icon: PieChart },
            { label: 'Time remaining', value: WEEKS_REMAINING, prefix: '', suffix: ' wks', sub: `Week ${WEEKS_ELAPSED} of ${TOTAL_WEEKS}`, color: 'gold', bgClass: 'bg-gold/10', icon: Clock, decimals: 0 },
          ].map((kpi, i) => (
            <motion.div 
              key={kpi.label}
              variants={cardVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', kpi.bgClass)}>
                  <kpi.icon className={cn('w-4 h-4', kpi.color === 'foreground' ? 'text-muted-foreground' : `text-${kpi.color}`)} />
                </div>
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className={cn('text-2xl font-bold font-mono tracking-tight', kpi.color === 'foreground' ? 'text-foreground' : `text-${kpi.color}`)}>
                <AnimatedCounter value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.decimals ?? 1} />
              </p>
              <p className="text-[10px] text-muted-foreground/70 mt-1.5">{kpi.sub}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* REGION 2 — Pacing Chart */}
        <motion.section variants={sectionVariants} className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center">
                <Activity className="w-4.5 h-4.5 text-amber" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Capital Pacing — {PERIOD}</h2>
                <p className="text-[10px] text-muted-foreground/70">Cumulative deployment vs. pace line ($M)</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-gold rounded" style={{ borderStyle: 'dashed' }} /> Pace Line</span>
              <span className="flex items-center gap-1.5"><span className="w-6 h-2 bg-blue-500 dark:bg-slate-400 rounded" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="w-6 h-2 bg-teal rounded opacity-70" /> Projected</span>
            </div>
          </div>
          <div className="p-6">
            {/* Pacing Chart */}
            {/* Pacing Chart */}
<motion.div 
  className="w-full h-96"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  <svg ref={svgRef} viewBox="0 0 1400 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="actualGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgb(37, 99, 235)" />
        <stop offset="100%" stopColor="rgb(59, 130, 246)" />
      </linearGradient>
      <linearGradient id="projectedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgb(20, 184, 166)" />
        <stop offset="100%" stopColor="rgb(52, 211, 153)" />
      </linearGradient>
    </defs>

    {/* Grid lines */}
    {[0, 25, 50, 75, 100].map((pct, idx) => (
      <motion.line
        key={`grid-${pct}`}
        x1="100" 
        y1={400 - (pct / 100) * 300} 
        x2="1350" 
        y2={400 - (pct / 100) * 300} 
        stroke="currentColor" 
        strokeWidth="1" 
        className="text-border/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.6, delay: idx * 0.08 }}
      />
    ))}

    {/* Y-axis labels */}
    {[0, 20.5, 41, 61.5, 82].map((val, i) => (
      <motion.text 
        key={`y-${i}`} 
        x="50" 
        y={400 - (i * 75)} 
        textAnchor="end" 
        className="text-[11px] fill-current text-muted-foreground/70" 
        dominantBaseline="middle"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
      >
        ${val.toFixed(1)}M
      </motion.text>
    ))}

    {/* 1. Pace Line - Gold Dashed (Draws first) */}
    <motion.polyline
      fill="none"
      stroke="rgb(234, 179, 8)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="8 4"
      points={paceLineData.map((d, i) => 
        `${100 + (i / (TOTAL_WEEKS - 1)) * 1250},${400 - (d.paceTarget / ALLOCATED) * 300}`
      ).join(' ')}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
    />

    {/* 2. Actual Spend Line - Blue (Draws after pace line) */}
    <motion.polyline
      fill="none"
      stroke="url(#actualGrad)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      points={paceLineData.filter(d => d.actual !== null).map((d, i) => 
        `${100 + (i / (TOTAL_WEEKS - 1)) * 1250},${400 - ((d.actual || 0) / ALLOCATED) * 300}`
      ).join(' ')}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 }}
    />

    {/* Actual Data Points */}
    {paceLineData.filter(d => d.actual !== null).map((d, i) => (
      <motion.circle
        key={`actual-point-${i}`}
        cx={100 + (i / (TOTAL_WEEKS - 1)) * 1250}
        cy={400 - ((d.actual || 0) / ALLOCATED) * 300}
        r="4"
        fill="rgb(59, 130, 246)"
        stroke="white"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.4 + i * 0.1 }}
      />
    ))}

    {/* 3. Projected Line - Teal (Draws last) */}
    <motion.polyline
      fill="none"
      stroke="url(#projectedGrad)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="6 3"
      points={`${100 + ((WEEKS_ELAPSED - 1) / (TOTAL_WEEKS - 1)) * 1250},${400 - (SPENT_TO_DATE / ALLOCATED) * 300} ${100 + 1250},${400 - ((SPENT_TO_DATE + cappedDeployed) / ALLOCATED) * 300}`}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.6 }}
    />

    {/* Today Marker */}
    <motion.line
      x1={100 + ((WEEKS_ELAPSED - 1) / (TOTAL_WEEKS - 1)) * 1250}
      y1={350}
      x2={100 + ((WEEKS_ELAPSED - 1) / (TOTAL_WEEKS - 1)) * 1250}
      y2={100}
      stroke="rgb(234, 179, 8)"
      strokeWidth="2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 0.8, delay: 2.2 }}
    />

    {/* TODAY Badge */}
    <motion.g
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2.4 }}
    >
      <rect
        x={100 + ((WEEKS_ELAPSED - 1) / (TOTAL_WEEKS - 1)) * 1250 - 30}
        y="50"
        width="60"
        height="28"
        rx="6"
        fill="rgb(234, 179, 8)"
        opacity="0.95"
      />
      <text
        x={100 + ((WEEKS_ELAPSED - 1) / (TOTAL_WEEKS - 1)) * 1250}
        y="68"
        textAnchor="middle"
        className="text-[11px] font-bold fill-white"
        dominantBaseline="middle"
      >
        TODAY
      </text>
    </motion.g>

    {/* End Target */}
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 2.6 }}
    >
      <circle 
        cx="1350" 
        cy={400 - (ALLOCATED / ALLOCATED) * 300} 
        r="6" 
        fill="rgb(234, 179, 8)" 
        stroke="white" 
        strokeWidth="2" 
      />
      <text 
        x="1365" 
        y={400 - (ALLOCATED / ALLOCATED) * 300} 
        className="text-[10px] fill-current text-gold font-bold" 
        dominantBaseline="middle"
      >
        ${ALLOCATED}M
      </text>
    </motion.g>

    {/* X-axis labels */}
    {paceLineData.filter((_, i) => i === 0 || i % 2 === 1 || i === TOTAL_WEEKS - 1).map((d, idx) => (
      <motion.g 
        key={`week-${d.week}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
      >
        <text
          x={100 + ((d.week - 1) / (TOTAL_WEEKS - 1)) * 1250}
          y="390"
          textAnchor="middle"
          className={cn('text-[11px] fill-current font-mono', d.week === WEEKS_ELAPSED ? 'text-gold font-bold' : 'text-muted-foreground/70')}
        >
          W{d.week}
        </text>
      </motion.g>
    ))}
  </svg>
</motion.div>

            {/* Annotation callout */}
            <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-foreground">Pacing gap detected week 5 by the Capital Pacing Agent</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{WEEKS_REMAINING} weeks of runway remain — act now, not at quarter-end. Current gap from pace line: <span className="font-bold text-gold">${PACE_GAP}M</span></p>
                </div>
              </div>
            </div>
            {/* Projection statement */}
            <p className="text-[12px] text-muted-foreground mt-4 leading-relaxed">
                If nothing changes, projected close is <span className="font-bold text-gold">${(SPENT_TO_DATE + 8).toFixed(1)}M</span> — a <span className="font-bold text-gold">${(ALLOCATED - SPENT_TO_DATE - 8).toFixed(1)}M underspend ({(((ALLOCATED - SPENT_TO_DATE - 8)/ALLOCATED)*100).toFixed(1)}%)</span>. Modelled scenarios below close this gap.
            </p>
          </div>
        </motion.section>

        {/* REGION 3 — Scenario Posture Selector */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Layers className="w-4.5 h-4.5 text-violet-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Scenario Posture</h2>
              <p className="text-[10px] text-muted-foreground/70">Select a deployment strategy or customize your own</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'conservative' as const, name: 'Conservative', desc: 'Execution only. Pull forward already-approved work; raise no new commitments.', deploys: 18, ends: 86.6, audit: 'Very low', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/30', textClass: 'text-emerald-500' },
              { id: 'balanced' as const, name: 'Balanced', desc: 'Execution plus design pull-forward. Closes the gap with zero waste.', deploys: 28, ends: 98.8, audit: 'Low', recommended: true, bgClass: 'bg-teal/10', borderClass: 'border-teal/30', textClass: 'text-teal' },
              { id: 'full' as const, name: 'Full Deployment', desc: 'Reaches into contingency pre-funding and ROI scope-adds to land at 100%.', deploys: 29, ends: 100, audit: 'Elevated', bgClass: 'bg-amber/10', borderClass: 'border-amber/30', textClass: 'text-amber' },
            ].map((posture) => (
              <motion.button
                key={posture.id}
                onClick={() => { setSelectedPosture(posture.id); applyPosture(posture.id) }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative text-left p-4 rounded-xl border transition-all',
                  selectedPosture === posture.id 
                    ? cn('ring-2 ring-teal border-teal', posture.bgClass)
                    : 'bg-card/80 dark:bg-card/60 border-border/50 hover:border-border'
                )}
              >
                {posture.recommended && (
                  <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-teal text-white text-[9px] font-semibold">Recommended</span>
                )}
                <h3 className="text-sm font-semibold text-foreground mb-1">{posture.name}</h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">{posture.desc}</p>
                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-border/30">
                  <span className="text-muted-foreground">Deploys: <span className="font-semibold text-teal">${posture.deploys}M</span></span>
                  <span className="text-muted-foreground">Ends: <span className="font-semibold text-foreground">{posture.ends}%</span></span>
                </div>
              </motion.button>
            ))}
          </div>
          {selectedPosture === 'custom' && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-muted-foreground mt-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Custom scenario �� adjust levers below to model your deployment plan.
            </motion.p>
          )}
        </motion.section>

        {/* REGION 4 — The Six Deployment Levers */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="w-4.5 h-4.5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Deployment Ladder — 6 Levers</h2>
                <p className="text-[10px] text-muted-foreground/70">Ranked most-defensible first. Adjust sliders to model scenarios.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Total deployment</p>
              <p className="text-xl font-bold font-mono text-gold">
                <AnimatedCounter value={totalDeployed} prefix="$" suffix="M" />
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {leversData.map((lever, index) => {
              const value = leverValues[lever.id] || 0
              const isExpanded = expandedLever === lever.id
              const percentage = (value / lever.capacity) * 100

              return (
                <motion.div
                  key={lever.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'rounded-2xl border overflow-hidden transition-all',
                    isExpanded ? 'bg-card border-border shadow-lg' : 'bg-card/60 dark:bg-card/40 border-border/50 hover:border-border'
                  )}
                >
                  {/* Lever Header */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedLever(isExpanded ? null : lever.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br', lever.gradient)}>
                        <lever.icon className="w-6 h-6 text-foreground/80" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-muted-foreground">L{lever.id}</span>
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-[9px] font-bold',
                            lever.confidenceTier === 'Committed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          )}>
                            {lever.confidenceTier}
                          </span>
                          <span className={cn(
                            'w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold',
                            lever.auditWeight === 0 ? 'bg-emerald-500/15 text-emerald-600' :
                            lever.auditWeight === 1 ? 'bg-blue-500/15 text-blue-600' :
                            lever.auditWeight === 2 ? 'bg-amber-500/15 text-amber-600' : 'bg-rose-500/15 text-rose-600'
                          )}>
                            {lever.auditWeight}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-foreground truncate">{lever.name}</p>
                      </div>

                      {/* Value and Slider */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold font-mono text-gold">${value.toFixed(1)}M</p>
                          <p className="text-[9px] text-muted-foreground">of ${lever.capacity}M</p>
                        </div>

                        {/* Mini progress bar */}
                        <div className="hidden sm:block w-24">
                          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                          </div>
                        </div>

                        {/* Expand button */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center"
                        >
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 space-y-4">
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{lever.description}</p>

                          {/* Slider */}
                          <div className="space-y-2">
                            <div className="relative">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-muted/50 w-full" />
                              <motion.div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-teal via-teal to-emerald-400 overflow-hidden"
                                initial={{ width: 0 }}
                                animate={{ width: `${(value / lever.capacity) * 100}%` }}
                                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                                  animate={{ x: ['-100%', '200%'] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />
                              </motion.div>
                              <input
                                type="range"
                                min={0}
                                max={lever.capacity}
                                step={0.5}
                                value={value}
                                onChange={(e) => handleSliderChange(lever.id, parseFloat(e.target.value))}
                                className="relative w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-gold [&::-webkit-slider-thumb]:to-amber-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-gold/30 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                              <span>$0M</span>
                              <span className="text-teal font-semibold">${value.toFixed(1)}M selected</span>
                              <span>${lever.capacity}M max</span>
                            </div>
                          </div>

                          {/* Projects Table */}
                          <div className="border border-border/50 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full text-[10px]">
                                <thead>
                                  <tr className="bg-muted/40">
                                    {lever.id === 1 && (
                                      <>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Project</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Region</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Scope</th>
                                        <th className="text-right p-2.5 font-semibold text-muted-foreground">Budgeted</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">PO Status</th>
                                      </>
                                    )}
                                    {lever.id === 2 && (
                                      <>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Item</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">For Project</th>
                                        <th className="text-center p-2.5 font-semibold text-muted-foreground">Lead Time</th>
                                        <th className="text-right p-2.5 font-semibold text-muted-foreground">Cost</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Price Trend</th>
                                      </>
                                    )}
                                    {lever.id === 3 && (
                                      <>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Project</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Milestone</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Contractor</th>
                                        <th className="text-center p-2.5 font-semibold text-muted-foreground">Earned</th>
                                        <th className="text-right p-2.5 font-semibold text-muted-foreground">Amount</th>
                                      </>
                                    )}
                                    {lever.id === 4 && (
                                      <>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Project</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Stage</th>
                                        <th className="text-center p-2.5 font-semibold text-muted-foreground">Region</th>
                                        <th className="text-center p-2.5 font-semibold text-muted-foreground">BDP</th>
                                        <th className="text-right p-2.5 font-semibold text-muted-foreground">Design Ask</th>
                                      </>
                                    )}
                                    {lever.id === 5 && (
                                      <>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Project</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Field Risk</th>
                                        <th className="text-center p-2.5 font-semibold text-muted-foreground">Likelihood</th>
                                        <th className="text-right p-2.5 font-semibold text-muted-foreground">Reserve Ask</th>
                                      </>
                                    )}
                                    {lever.id === 6 && (
                                      <>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Project</th>
                                        <th className="text-left p-2.5 font-semibold text-muted-foreground">Enhancement</th>
                                        <th className="text-center p-2.5 font-semibold text-muted-foreground">Payback</th>
                                        <th className="text-right p-2.5 font-semibold text-muted-foreground">Cost</th>
                                      </>
                                    )}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                  {lever.projects.map((project: Record<string, unknown>, i: number) => (
                                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                                      {lever.id === 1 && (
                                        <>
                                          <td className="p-2.5 font-medium text-foreground">{project.project as string}</td>
                                          <td className="p-2.5 text-muted-foreground">{project.region as string}</td>
                                          <td className="p-2.5 text-muted-foreground">{project.scope as string}</td>
                                          <td className="p-2.5 text-right font-mono text-teal">${project.budgeted as number}M</td>
                                          <td className="p-2.5">
                                            <span className={cn(
                                              'px-2 py-0.5 rounded-full text-[9px] font-semibold',
                                              project.poStatus === 'Drafted' ? 'bg-amber-500/15 text-amber-600' : 'bg-muted text-muted-foreground'
                                            )}>
                                              {project.poStatus as string}
                                            </span>
                                          </td>
                                        </>
                                      )}
                                      {lever.id === 2 && (
                                        <>
                                          <td className="p-2.5 font-medium text-foreground">{project.item as string}</td>
                                          <td className="p-2.5 text-muted-foreground">{project.forProject as string}</td>
                                          <td className="p-2.5 text-center font-mono">{project.leadTime as string}</td>
                                          <td className="p-2.5 text-right font-mono text-teal">${project.cost as number}M</td>
                                          <td className="p-2.5 text-rose-500 text-[9px]">{project.priceTrend as string}</td>
                                        </>
                                      )}
                                      {lever.id === 3 && (
                                        <>
                                          <td className="p-2.5 font-medium text-foreground">{project.project as string}</td>
                                          <td className="p-2.5 text-muted-foreground">{project.milestone as string}</td>
                                          <td className="p-2.5 text-muted-foreground">{project.contractor as string}</td>
                                          <td className="p-2.5 text-center">
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/15 text-emerald-600">{project.earned as string}</span>
                                          </td>
                                          <td className="p-2.5 text-right font-mono text-teal">${project.amount as number}M</td>
                                        </>
                                      )}
                                      {lever.id === 4 && (
                                        <>
                                          <td className="p-2.5 font-medium text-foreground">{project.project as string}</td>
                                          <td className="p-2.5 text-muted-foreground">{project.stage as string}</td>
                                          <td className="p-2.5 text-center">{project.region as string}</td>
                                          <td className="p-2.5 text-center">
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-teal/15 text-teal">{project.bdp as string}</span>
                                          </td>
                                          <td className="p-2.5 text-right font-mono text-teal">${project.designAsk as number}M</td>
                                        </>
                                      )}
                                      {lever.id === 5 && (
                                        <>
                                          <td className="p-2.5 font-medium text-foreground">{project.project as string}</td>
                                          <td className="p-2.5 text-muted-foreground">{project.fieldRisk as string}</td>
                                          <td className="p-2.5 text-center">
                                            <span className={cn(
                                              'px-2 py-0.5 rounded-full text-[9px] font-semibold',
                                              project.likelihood === 'High' ? 'bg-rose-500/15 text-rose-600' : 'bg-amber-500/15 text-amber-600'
                                            )}>
                                              {project.likelihood as string}
                                            </span>
                                          </td>
                                          <td className="p-2.5 text-right font-mono text-teal">${project.reserveAsk as number}M</td>
                                        </>
                                      )}
                                      {lever.id === 6 && (
                                        <>
                                          <td className="p-2.5 font-medium text-foreground">{project.project as string}</td>
                                          <td className="p-2.5 text-muted-foreground">{project.enhancement as string}</td>
                                          <td className="p-2.5 text-center font-mono">{project.payback as string}</td>
                                          <td className="p-2.5 text-right font-mono text-teal">${project.cost as number}M</td>
                                        </>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* REGION 5 — Scenario Outcome Panel */}
        <motion.section variants={sectionVariants} className="bg-gradient-to-br from-card via-card to-gold/5 border border-border/50 rounded-2xl p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/20">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Scenario Outcome</h2>
                <p className="text-[11px] text-muted-foreground/70">Real-time projection based on lever selections</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Deployed', value: cappedDeployed, prefix: '$', suffix: 'M', color: 'teal', bgGradient: 'from-teal/10 to-transparent' },
                { label: 'Ending utilization', value: endingUtilization, prefix: '', suffix: '%', color: endingUtilization >= 98 ? 'emerald' : endingUtilization >= 90 ? 'teal' : 'amber', bgGradient: endingUtilization >= 98 ? 'from-emerald-500/10 to-transparent' : endingUtilization >= 90 ? 'from-teal/10 to-transparent' : 'from-amber-500/10 to-transparent' },
                { label: 'Residual underspend', value: residualUnderspend, prefix: '$', suffix: 'M', color: residualUnderspend <= 2 ? 'emerald' : 'rose', bgGradient: residualUnderspend <= 2 ? 'from-emerald-500/10 to-transparent' : 'from-rose-500/10 to-transparent' },
                { label: 'Audit exposure', value: auditExposure, isText: true, color: auditExposure === 'Very low' || auditExposure === 'Low' ? 'emerald' : auditExposure === 'Moderate' ? 'amber' : 'rose', bgGradient: auditExposure === 'Very low' || auditExposure === 'Low' ? 'from-emerald-500/10 to-transparent' : auditExposure === 'Moderate' ? 'from-amber-500/10 to-transparent' : 'from-rose-500/10 to-transparent' },
              ].map((metric, i) => (
                <motion.div 
                  key={metric.label} 
                  className={cn('relative rounded-xl p-4 border border-border/30 overflow-hidden bg-card/50')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', metric.bgGradient)} />
                  <div className="relative">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</p>
                    {metric.isText ? (
                      <motion.p 
                        key={String(metric.value)}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn('text-xl font-bold', `text-${metric.color}-500`)}
                      >
                        {metric.value}
                      </motion.p>
                    ) : (
                      <p className={cn('text-xl font-bold font-mono', `text-${metric.color}-500`)}>
                        <AnimatedCounter value={metric.value as number} prefix={metric.prefix} suffix={metric.suffix} />
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Confidence bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-[10px] mb-2">
                <span className="text-muted-foreground">Confidence breakdown</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500" />
                    Committed ${committedAmount.toFixed(1)}M
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-500" />
                    Budgeted ${budgetedAmount.toFixed(1)}M
                  </span>
                </div>
              </div>
              <div className="h-4 bg-muted/30 rounded-full overflow-hidden flex relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalDeployed > 0 ? (committedAmount / totalDeployed) * 100 : 0}%` }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  />
                </motion.div>
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalDeployed > 0 ? (budgetedAmount / totalDeployed) * 100 : 0}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={() => setShowMemoModal(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-gold to-amber-600 hover:from-gold/90 hover:to-amber-600/90 text-white shadow-lg shadow-gold/25 gap-2"
              >
                <FileText className="w-4 h-4" />
                Generate Decision Memo
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none gap-2"
                onClick={() => {
                  const scenarioData = {
                    period: PERIOD,
                    posture: selectedPosture,
                    allocated: ALLOCATED,
                    spentToDate: SPENT_TO_DATE,
                    deployed: cappedDeployed,
                    endingUtilization,
                    residualUnderspend,
                    auditExposure,
                    levers: leversData.map(l => ({ id: l.id, name: l.name, value: leverValues[l.id] || 0 })),
                    generatedAt: new Date().toISOString(),
                  }
                  const blob = new Blob([JSON.stringify(scenarioData, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `capital-deployment-${PERIOD.replace(' ', '-')}-${selectedPosture}.json`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="w-4 h-4" />
                Export Scenario
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none gap-2" 
                onClick={() => {
                  setSelectedPosture('balanced')
                  applyPosture('balanced')
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </motion.section>

        {/* REGION 6 — Pacing History & Audit Trail */}
        <motion.section variants={sectionVariants}>
          <button
            onClick={() => setShowHistorySection(!showHistorySection)}
            className="w-full flex items-center justify-between p-4 bg-card/60 dark:bg-card/40 border border-border/50 rounded-2xl hover:border-border transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-bold text-foreground">Pacing History & Audit Trail</h2>
                <p className="text-[11px] text-muted-foreground/70">Historical quarter performance and decision records</p>
              </div>
            </div>
            <motion.div animate={{ rotate: showHistorySection ? 180 : 0 }}>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showHistorySection && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-5 bg-card/60 dark:bg-card/40 border border-border/50 rounded-2xl">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {historicalQuarters.map((q) => (
                      <div key={q.quarter} className="p-4 rounded-xl bg-muted/30 border border-border/30">
                        <p className="text-[10px] text-muted-foreground mb-1">{q.quarter}</p>
                        <p className={cn('text-xl font-bold font-mono', q.closed >= 95 ? 'text-emerald-500' : q.closed >= 90 ? 'text-amber-500' : 'text-rose-500')}>
                          {q.closed}%
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Residual: {q.residual}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* RM-03 Decision Memo Modal */}
        <AnimatePresence>
          {showMemoModal && (
            <DecisionMemoModal
              period={PERIOD}
              selectedPosture={selectedPosture}
              leverValues={leverValues}
              leversData={leversData}
              allocated={ALLOCATED}
              spentToDate={SPENT_TO_DATE}
              gap={GAP_TO_CLOSE}
              cappedDeployed={cappedDeployed}
              endingUtilization={endingUtilization}
              residualUnderspend={residualUnderspend}
              auditExposure={auditExposure}
              onClose={() => setShowMemoModal(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  )
}
