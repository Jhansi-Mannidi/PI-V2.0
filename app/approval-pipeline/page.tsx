'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  MailOpen,
  MessageSquare,
  RefreshCw,
  Send,
  TrendingUp,
  Upload,
  X,
  Zap,
  Flag,
} from 'lucide-react'
import { useActionModal } from '@/hooks/use-action-modal'
import { toast } from 'sonner'
import { AnimNum, FadeUp, GrowBar } from '@/components/animated-primitives'

type Tool = 'eBuilder' | 'Buying Hub' | 'SAP' | 'Multiple'
type StageStatus = 'completed' | 'current' | 'future'

interface ApprovalStage {
  num: number
  name: string
  shortName: string
  owner: string
  ownerEmail?: string
  tool: Tool
  status: StageStatus
  elapsedDays: number | null
  completedDate?: string
  expectedDuration: string
  startedAt?: string
  varianceDays?: number
  events?: { date: string; type: 'event' | 'email' | 'comment' | 'manual'; author?: string; content: string }[]
}

const stages: ApprovalStage[] = [
  {
    num: 1, name: 'Termsheet Drafting', shortName: 'Termsheet Draft',
    owner: 'Alice Cox', ownerEmail: 'alice.cox@linesight.io',
    tool: 'eBuilder', status: 'completed', elapsedDays: 5,
    completedDate: '2025-12-08', expectedDuration: '5-7 days',
    startedAt: '2025-12-03',
    events: [
      { date: '2025-12-03 09:14', type: 'event', content: 'Termsheet draft initiated from BDP scaffold' },
      { date: '2025-12-08 17:22', type: 'event', content: 'Submitted for internal review' },
    ],
  },
  {
    num: 2, name: 'Termsheet Review Internal', shortName: 'Internal Review',
    owner: 'Brian Smith + PgMs',
    tool: 'eBuilder', status: 'completed', elapsedDays: 7,
    completedDate: '2025-12-15', expectedDuration: '5-10 days',
    startedAt: '2025-12-08',
  },
  {
    num: 3, name: 'QA/QC Sign-off', shortName: 'QA/QC',
    owner: 'Alisha',
    tool: 'eBuilder', status: 'completed', elapsedDays: 2,
    completedDate: '2025-12-17', expectedDuration: '1-3 days',
    startedAt: '2025-12-15',
  },
  {
    num: 4, name: 'Anu Final Approval', shortName: 'Anu Approval',
    owner: 'Anu Reddy', ownerEmail: 'anu.reddi@portfolio.io',
    tool: 'eBuilder', status: 'completed', elapsedDays: 2,
    completedDate: '2025-12-19', expectedDuration: '1-3 days',
    startedAt: '2025-12-17',
  },
  {
    num: 5, name: 'NPR Submission', shortName: 'NPR',
    owner: 'Alice Cox',
    tool: 'eBuilder', status: 'completed', elapsedDays: 1,
    completedDate: '2025-12-20', expectedDuration: '1-2 days',
    startedAt: '2025-12-19',
  },
  {
    num: 6, name: 'YF Setup', shortName: 'YF Setup',
    owner: 'Cap Planning',
    tool: 'eBuilder', status: 'completed', elapsedDays: 4,
    completedDate: '2025-12-24', expectedDuration: '3-5 days',
    startedAt: '2025-12-20',
  },
  {
    num: 7, name: 'FP&A Review', shortName: 'FP&A Review',
    owner: 'Sophia Lam', ownerEmail: 'sophia.lamb@finance.io',
    tool: 'SAP', status: 'current', elapsedDays: 73,
    expectedDuration: '10-15 days median',
    startedAt: '2025-12-24',
    varianceDays: 58,
    events: [
      { date: '2025-12-24 10:00', type: 'event', content: 'Distributed to Finance approver pool (~7-8 reviewers)' },
      { date: '2026-01-12 14:30', type: 'email', author: 'Sophia Lam', content: 'Acknowledged receipt — routing through standard SAP queue' },
      { date: '2026-02-15 11:05', type: 'manual', author: 'Hasit Chetal', content: 'Sophia confirmed via Slack that her primary approver A is OOO until 2026-02-22 — task may rotate to backup B.' },
    ],
  },
  {
    num: 8, name: 'Buying Hub Approval', shortName: 'Buying Hub',
    owner: 'Allen',
    tool: 'Buying Hub', status: 'future', elapsedDays: null,
    expectedDuration: '5-8 days',
  },
  {
    num: 9, name: 'GFA (SAP) Approval', shortName: 'GFA',
    owner: 'Allen',
    tool: 'SAP', status: 'future', elapsedDays: null,
    expectedDuration: '7-12 days',
  },
  {
    num: 10, name: 'AR Final Approval', shortName: 'AR Final',
    owner: 'AR Committee',
    tool: 'SAP', status: 'future', elapsedDays: null,
    expectedDuration: '5-10 days',
  },
  {
    num: 11, name: 'PO Workflow Init', shortName: 'PO Init',
    owner: 'LineSight',
    tool: 'eBuilder', status: 'future', elapsedDays: null,
    expectedDuration: '2-4 days',
  },
  {
    num: 12, name: 'PO Issued', shortName: 'PO Issued',
    owner: 'Multiple',
    tool: 'Multiple', status: 'future', elapsedDays: null,
    expectedDuration: '1-2 days',
  },
]

// Allen appears in both Buying Hub (stage 8) and SAP (stage 9) — redundancy candidate
const redundancies = [
  {
    approver: 'Allen',
    fromStage: 8,
    toStage: 9,
    note: 'Allen approves the same ask in Buying Hub (stage 8) and again in SAP GFA (stage 9). Removing the duplicate could shave ~5-8 days off cycle time.',
  },
]

const tools: Tool[] = ['eBuilder', 'Buying Hub', 'SAP']

const toolColors: Record<Tool, string> = {
  'eBuilder': 'text-teal-600 dark:text-teal-300 bg-teal-500/10 border-teal-500/30',
  'Buying Hub': 'text-purple-600 dark:text-purple-300 bg-purple-500/10 border-purple-500/30',
  'SAP': 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30',
  'Multiple': 'text-muted-foreground bg-secondary border-line',
}

const toolShort: Record<Tool, string> = {
  'eBuilder': 'eB',
  'Buying Hub': 'BH',
  'SAP': 'SAP',
  'Multiple': 'Multi',
}

export default function ApprovalPipelinePage() {
  const [selectedStage, setSelectedStage] = React.useState<number | null>(7)
  const [showRedundancyTip, setShowRedundancyTip] = React.useState<number | null>(null)
  const [showAddContextModal, setShowAddContextModal] = React.useState(false)
  const [showNudgeModal, setShowNudgeModal] = React.useState(false)
  const [manualContextEntries, setManualContextEntries] = React.useState<typeof stages[number]['events']>(
    stages.find((s) => s.num === 7)?.events ?? []
  )
  const [newContext, setNewContext] = React.useState('')
  const [lastRefreshAt, setLastRefreshAt] = React.useState<Date>(() => new Date(Date.now() - 23_000))
  const [now, setNow] = React.useState<Date>(() => new Date())
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [exportConfirm, setExportConfirm] = React.useState<string | null>(null)
  const action = useActionModal()

  // Live "Nns ago" counter — ticks once per second.
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const liveAgo = React.useMemo(() => {
    const seconds = Math.max(0, Math.floor((now.getTime() - lastRefreshAt.getTime()) / 1000))
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }, [now, lastRefreshAt])

  const handleRefresh = React.useCallback(() => {
    if (isRefreshing) return
    setIsRefreshing(true)
    // Simulate a real refresh round-trip; in production this would re-fetch the pipeline.
    window.setTimeout(() => {
      setLastRefreshAt(new Date())
      setNow(new Date())
      setIsRefreshing(false)
    }, 750)
  }, [isRefreshing])

  const handleExport = React.useCallback(() => {
    const headers = [
      '#', 'Stage', 'Owner', 'Email', 'Tool', 'Status',
      'Started', 'Completed', 'Elapsed (d)', 'Expected', 'Variance (d)',
    ]
    const rows = stages.map((s) => [
      s.num,
      s.name,
      s.owner,
      s.ownerEmail ?? '',
      s.tool,
      s.status,
      s.startedAt ?? '',
      s.completedDate ?? '',
      s.elapsedDays ?? '',
      s.expectedDuration,
      s.varianceDays ?? '',
    ])
    const escape = (v: unknown) => {
      const str = String(v ?? '')
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
    }
    const csv = [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `approval-pipeline_NCH-Hub1-1_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExportConfirm('Exported as CSV')
    window.setTimeout(() => setExportConfirm(null), 2200)
  }, [])

  const stage = selectedStage ? stages.find((s) => s.num === selectedStage) : null
  const isSapBlackHole = stage?.tool === 'SAP' && stage.status === 'current'

  const handleAddContext = () => {
    if (!newContext.trim()) return
    setManualContextEntries((prev) => [
      ...(prev ?? []),
      {
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        type: 'manual',
        author: 'Hasit Chetal',
        content: newContext.trim(),
      },
    ])
    setNewContext('')
    setShowAddContextModal(false)
  }

  const copyStageHistory = () => {
    const text = stages
      .map((s) => `${s.num}. ${s.name} | ${s.owner} | ${s.tool} | ${s.status} | ${s.elapsedDays ?? '—'}d`)
      .join('\n')
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <AppShell title="Approval Pipeline" subtitle="NCH-Hub1-1 · Seed · $51.5M · Submitted by Alice Cox 2026-01-23" activeHref="/approval-pipeline">
      <TooltipProvider delayDuration={150}>
        {exportConfirm && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-20 right-6 z-[60] inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green/15 text-green border border-green/40 text-[11px] font-mono shadow-lg backdrop-blur"
          >
            <Check className="w-3.5 h-3.5" />
            {exportConfirm}
          </div>
        )}
        <motion.div 
          className="px-6 py-5 space-y-5"
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
          {/* HEADER strip */}
          <FadeUp delay={0}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 h-7 inline-flex items-center text-[11px] font-mono rounded-md bg-secondary border border-line">
                Project: <span className="font-semibold ml-1">NCH-Hub1-1</span>
              </span>
              <span className="px-2.5 h-7 inline-flex items-center text-[11px] font-mono rounded-md bg-secondary border border-line">
                Type: <span className="font-semibold ml-1">Seed</span>
              </span>
              <span className="px-2.5 h-7 inline-flex items-center text-[11px] font-mono rounded-md bg-secondary border border-line">
                Amount: <span className="font-semibold ml-1">$51.5M</span>
              </span>
              <button className="px-2.5 h-7 inline-flex items-center gap-1 text-[11px] rounded-md border border-line hover:bg-secondary/60">
                Switch ask <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 h-7 text-[11px] font-mono rounded-md bg-green/10 text-green border border-green/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" /> Live · {liveAgo}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px]"
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label="Refresh pipeline data"
              >
                <RefreshCw className={`w-3 h-3 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing…' : 'Refresh'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px]"
                onClick={handleExport}
                aria-label="Export pipeline as CSV"
              >
                <FileText className="w-3 h-3 mr-1.5" /> Export
              </Button>
            </div>
            </div>
          </FadeUp>

          {/* REGION 1 — Pipeline swimlane */}
          <FadeUp delay={0.1}>
            <div className="bg-card border border-line rounded-xl p-5 shadow-sm overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Pipeline · 12 Stages</h2>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">A-303 Pipeline Reconstructor</span>
            </div>

            <div className="relative" style={{ minWidth: '1400px' }}>
              {/* Tool Y-axis labels & swim rows */}
              {tools.map((tool) => (
                <div key={tool} className="flex items-stretch border-b border-line/60 last:border-b-0">
                  <div className="w-28 shrink-0 flex items-center px-3 py-3">
                    <span className={`text-[11px] font-mono font-semibold px-2 py-1 rounded-md border ${toolColors[tool]}`}>
                      {tool}
                    </span>
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-2 py-3">
                    {stages.map((s) => {
                      const matchesLane = s.tool === tool || (s.tool === 'Multiple' && tool === 'eBuilder')
                      if (!matchesLane) return <div key={s.num} className="h-[88px]" />
                      const isSelected = selectedStage === s.num
                      const baseClasses = 'relative h-[88px] rounded-lg border px-2 py-2 cursor-pointer transition-all flex flex-col justify-between'
                      const stateClasses =
                        s.status === 'completed'
                          ? 'bg-[#009689] text-white border-[#009689]'
                          : s.status === 'current'
                          ? 'bg-gold text-navy border-gold animate-pulse-soft ring-2 ring-gold/40'
                          : 'bg-card text-muted-foreground border-dashed border-line'
                      const selectedRing = isSelected ? 'ring-2 ring-offset-2 ring-foreground/40' : ''
                      return (
                        <button
                          key={s.num}
                          onClick={() => setSelectedStage(s.num)}
                          className={`${baseClasses} ${stateClasses} ${selectedRing} text-left`}
                          aria-label={`${s.name}, owned by ${s.owner}`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] font-mono opacity-70">#{s.num}</span>
                              <span className="text-[11px] font-semibold leading-tight truncate">{s.shortName}</span>
                            </div>
                            {s.status === 'completed' && <Check className="w-3.5 h-3.5 shrink-0" />}
                            {s.status === 'current' && <Zap className="w-3.5 h-3.5 shrink-0" />}
                            {s.status === 'future' && <span className="w-3.5 h-3.5 rounded-full border-2 border-current/40 shrink-0" />}
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[10px] font-mono truncate opacity-90">{s.owner}</span>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono">
                                {s.elapsedDays !== null ? `${s.elapsedDays}d` : '—'}
                              </span>
                              <span className="text-[9px] font-mono opacity-70">{toolShort[s.tool]}</span>
                            </div>
                          </div>
                          {s.status === 'current' && s.varianceDays && s.varianceDays > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                              +{s.varianceDays}d
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Redundancy markers (overlay) */}
              {redundancies.map((r) => (
                <div key={r.approver} className="relative">
                  <button
                    onClick={() => setShowRedundancyTip(showRedundancyTip === r.fromStage ? null : r.fromStage)}
                    className="absolute -top-2 right-[16%] inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red/10 text-red border border-dashed border-red text-[9px] font-mono font-semibold hover:bg-red/20 transition"
                    aria-label="Redundancy candidate"
                  >
                    <AlertTriangle className="w-2.5 h-2.5" /> Redundant approver
                  </button>
                  {showRedundancyTip === r.fromStage && (
                    <div className="absolute -top-2 right-[2%] w-72 p-3 rounded-lg bg-card border border-red shadow-lg z-10">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-foreground">Process Improvement Candidate</span>
                        <button onClick={() => setShowRedundancyTip(null)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">{r.approver}</span> reviews this ask at stage #{r.fromStage} ({stages[r.fromStage - 1].name}) and again at stage #{r.toStage} ({stages[r.toStage - 1].name}). {r.note}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-line text-[10px] font-mono text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#009689]" /> Completed</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gold" /> Current</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm border border-dashed border-line" /> Future</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm border border-dashed border-red" /> Redundancy candidate</span>
            </div>
            </div>
          </FadeUp>

          {/* REGION 3 — SAP Black-Hole Inset */}
          {isSapBlackHole && (
            <div className="rounded-xl border-2 border-red bg-red/5 dark:bg-red/10 p-5 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-red/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">SAP Black-Hole — Status Not Granular</h3>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Active stage: FP&A Review · {stage.elapsedDays}d elapsed</p>
                </div>
              </div>
              <p className="text-[12px] text-foreground/90 leading-relaxed mb-3">
                This stage is currently inside SAP&apos;s internal Finance approval flow. SAP distributes the
                Appropriation Request to approximately 7-8 internal approvers (Sophia Lam&apos;s team). The
                individual approver currently holding the task is not exposed by SAP.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="bg-card rounded-lg border border-line/60 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Elapsed since arrival at Finance</p>
                  <p className="text-base font-mono font-bold text-red">{stage.elapsedDays} days</p>
                </div>
                <div className="bg-card rounded-lg border border-line/60 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Last status signal from SAP</p>
                  <p className="text-[11px] font-mono text-foreground">FP&A step (rcvd 2025-12-24)</p>
                </div>
                <div className="bg-card rounded-lg border border-line/60 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Approver pool size</p>
                  <p className="text-base font-mono font-bold text-foreground">~7-8 reviewers</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground italic mb-3">
                This is one of the largest contributors to portfolio cycle time. PIP tracks the elapsed
                time as the actionable signal.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowNudgeModal(true)} className="h-8 text-[11px] bg-gold text-navy">
                  <Send className="w-3 h-3 mr-1.5" /> Nudge Sophia Lam
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-[11px]"
                  onClick={() =>
                    action.open({
                      tone: 'destructive',
                      icon: Flag,
                      title: 'Escalate to Brian Smith',
                      description: 'This stage has been pending in SAP for 73 days. Escalation will notify the Portfolio Director and log the event in the orchestration trail.',
                      context: [
                        { label: 'Project', value: 'NCH-Hub1-1' },
                        { label: 'Stage', value: 'FP&A Review (#7)' },
                        { label: 'Owner', value: 'Sophia Lam' },
                        { label: 'Elapsed', value: '73 days' },
                      ],
                      fields: [
                        {
                          type: 'select',
                          name: 'urgency',
                          label: 'Urgency Level',
                          required: true,
                          options: [
                            { value: 'high', label: 'High — same-day response needed' },
                            { value: 'urgent', label: 'Urgent — requires immediate attention' },
                            { value: 'critical', label: 'Critical — blocking portfolio milestone' },
                          ],
                        },
                        {
                          type: 'textarea',
                          name: 'note',
                          label: 'Escalation Note',
                          placeholder: 'Add context for Brian (optional)…',
                          rows: 3,
                        },
                      ],
                      confirmLabel: 'Escalate Now',
                      successToast: 'Escalation sent to Brian Smith',
                      successDescription: 'Logged in orchestration trail · NCH-Hub1-1 / Stage 7',
                    })
                  }
                >
                  <TrendingUp className="w-3 h-3 mr-1.5" /> Escalate to Brian Smith
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-[11px]"
                  onClick={() => {
                    toast.info('Opening SAP Finance Workbench…', {
                      description: 'AR ID 4571062 · FP&A Review queue',
                    })
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1.5" /> Open in SAP
                </Button>
              </div>
            </div>
          )}

          {/* REGION 2 — Stage detail */}
          {stage && (
            <div className="bg-card border border-line rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">
                  {stage.name} ·{' '}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="underline decoration-dotted underline-offset-2 hover:text-gold">{stage.owner}</button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-[11px]">
                        <p className="font-semibold mb-1">{stage.owner} · recent throughput</p>
                        <p>Last 90d: 12 similar asks · median 8d · p90 14d</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </h2>
                <span className={`text-[10px] font-mono px-2 py-1 rounded-md border ${toolColors[stage.tool]}`}>
                  {stage.tool}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* LEFT — metadata */}
                <div className="space-y-2.5">
                  <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground">Metadata</h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                    <dt className="text-muted-foreground">Owner</dt>
                    <dd className="font-mono text-foreground">{stage.owner}</dd>
                    {stage.ownerEmail && (<>
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="font-mono text-foreground">{stage.ownerEmail}</dd>
                    </>)}
                    <dt className="text-muted-foreground">Started at</dt>
                    <dd className="font-mono text-foreground">{stage.startedAt ?? '—'}</dd>
                    <dt className="text-muted-foreground">Elapsed</dt>
                    <dd className="font-mono text-foreground">{stage.elapsedDays !== null ? `${stage.elapsedDays}d` : '—'}</dd>
                    <dt className="text-muted-foreground">Expected duration</dt>
                    <dd className="font-mono text-foreground">{stage.expectedDuration}</dd>
                    {stage.varianceDays !== undefined && (<>
                      <dt className="text-muted-foreground">Variance</dt>
                      <dd className={`font-mono font-bold ${stage.varianceDays > 0 ? 'text-red' : 'text-green'}`}>
                        {stage.varianceDays > 0 ? '+' : ''}{stage.varianceDays} days
                      </dd>
                    </>)}
                    <dt className="text-muted-foreground">Tool of record</dt>
                    <dd className="font-mono text-foreground">{stage.tool}</dd>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className={`font-mono font-semibold uppercase ${
                      stage.status === 'completed' ? 'text-green' : stage.status === 'current' ? 'text-gold' : 'text-muted-foreground'
                    }`}>{stage.status}</dd>
                  </dl>
                </div>

                {/* RIGHT — activity / evidence */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground">Recent Activity & Evidence</h3>
                    {stage.num === 7 && (
                      <button
                        onClick={() => setShowAddContextModal(true)}
                        className="text-[11px] font-medium text-gold hover:underline inline-flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" /> Add manual context
                      </button>
                    )}
                  </div>
                  <ul className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {(() => {
                      const events = (stage.num === 7 ? manualContextEntries : stage.events) ?? []
                      if (events.length === 0) {
                        return <li className="text-[11px] text-muted-foreground italic">No events captured yet.</li>
                      }
                      return events.map((ev, idx) => {
                        const Icon =
                          ev.type === 'email' ? MailOpen : ev.type === 'comment' ? MessageSquare : ev.type === 'manual' ? FileText : Check
                        const color =
                          ev.type === 'manual' ? 'text-gold bg-gold/10 border-gold/30'
                          : ev.type === 'email' ? 'text-teal-600 dark:text-teal-300 bg-teal-500/10 border-teal-500/30'
                          : 'text-muted-foreground bg-secondary border-line'
                        return (
                          <li key={idx} className={`flex gap-2.5 p-2 rounded-lg border ${color}`}>
                            <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <span className="text-[10px] font-mono font-semibold text-foreground">{ev.author ?? 'System'}</span>
                                <span className="text-[10px] font-mono text-muted-foreground">{ev.date}</span>
                              </div>
                              <p className="text-[11px] text-foreground/90 leading-snug">{ev.content}</p>
                              {ev.type === 'manual' && (
                                <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">Immutable · audit trail</p>
                              )}
                            </div>
                          </li>
                        )
                      })
                    })()}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* REGION 4 — Action strip */}
          <div className="sticky bottom-0 bg-card/95 backdrop-blur border border-line rounded-xl p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px]"
                onClick={() =>
                  action.open({
                    tone: 'primary',
                    icon: Send,
                    title: `Nudge ${stage?.owner ?? 'owner'}`,
                    description: 'Sends a contextual reminder via email and logs the nudge against this orchestration.',
                    context: stage ? [
                      { label: 'Project', value: 'NCH-Hub1-1' },
                      { label: 'Stage', value: `${stage.name} (#${stage.num})` },
                      { label: 'Owner', value: stage.owner },
                      { label: 'Elapsed', value: stage.elapsedDays != null ? `${stage.elapsedDays} days` : '—' },
                    ] : undefined,
                    fields: [
                      {
                        type: 'textarea',
                        name: 'message',
                        label: 'Message',
                        placeholder: `Quick check-in on ${stage?.name ?? 'this stage'} — any blockers?`,
                        defaultValue: `Hi ${stage?.owner ?? 'there'} — checking in on ${stage?.name ?? 'this stage'} for NCH-Hub1-1. Could you share the latest status?`,
                        required: true,
                        rows: 4,
                      },
                    ],
                    confirmLabel: 'Send Nudge',
                    successToast: `Nudge sent to ${stage?.owner ?? 'owner'}`,
                    successDescription: 'Logged · email queued',
                  })
                }
              >
                <Send className="w-3 h-3 mr-1.5" /> Nudge Owner
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px]"
                onClick={() =>
                  action.open({
                    tone: 'info',
                    icon: MessageSquare,
                    title: 'Request Status Update',
                    description: 'Asks the stage owner for a written status update with their expected completion date.',
                    context: stage ? [
                      { label: 'Stage', value: `${stage.name} (#${stage.num})` },
                      { label: 'Owner', value: stage.owner },
                    ] : undefined,
                    fields: [
                      {
                        type: 'select',
                        name: 'deadline',
                        label: 'Response Deadline',
                        required: true,
                        options: [
                          { value: '24h', label: 'Within 24 hours' },
                          { value: '48h', label: 'Within 48 hours' },
                          { value: 'eow', label: 'End of week' },
                        ],
                      },
                      {
                        type: 'textarea',
                        name: 'questions',
                        label: 'Specific Questions',
                        placeholder: 'What are the current blockers? When do you expect completion?',
                        rows: 3,
                      },
                    ],
                    confirmLabel: 'Send Request',
                    successToast: 'Status request sent',
                    successDescription: `Owner: ${stage?.owner ?? 'stage owner'}`,
                  })
                }
              >
                <MessageSquare className="w-3 h-3 mr-1.5" /> Request Update
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px]"
                onClick={() =>
                  action.open({
                    tone: 'destructive',
                    icon: TrendingUp,
                    title: 'Escalate Stage',
                    description: 'Escalates this stage to the next level on the approval chain.',
                    context: stage ? [
                      { label: 'Stage', value: `${stage.name} (#${stage.num})` },
                      { label: 'Owner', value: stage.owner },
                      { label: 'Elapsed', value: stage.elapsedDays != null ? `${stage.elapsedDays} days` : '—' },
                    ] : undefined,
                    fields: [
                      {
                        type: 'select',
                        name: 'target',
                        label: 'Escalate To',
                        required: true,
                        options: [
                          { value: 'pm', label: 'Brian Steinberg — Program Manager' },
                          { value: 'pd', label: 'Brian Smith — Portfolio Director' },
                          { value: 'controls', label: 'Hasit Chetal — Controls Lead' },
                        ],
                      },
                      {
                        type: 'textarea',
                        name: 'reason',
                        label: 'Reason for Escalation',
                        required: true,
                        rows: 3,
                      },
                    ],
                    confirmLabel: 'Confirm Escalation',
                    successToast: 'Stage escalated',
                    successDescription: 'Notification sent · audit log updated',
                  })
                }
              >
                <TrendingUp className="w-3 h-3 mr-1.5" /> Escalate
              </Button>
              <span className="w-px h-5 bg-line mx-1" />
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px]"
                onClick={() => {
                  toast.info('Opening eBuilder…', {
                    description: 'Project NCH-Hub1-1 · Funding Approval Workflow',
                  })
                }}
              >
                <ExternalLink className="w-3 h-3 mr-1.5" /> Open in eBuilder
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px]"
                onClick={() => {
                  toast.info('Opening Buying Hub…', {
                    description: 'PR creation queue · Allen',
                  })
                }}
              >
                <ExternalLink className="w-3 h-3 mr-1.5" /> Open in Buying Hub
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={copyStageHistory}>
                <Copy className="w-3 h-3 mr-1.5" /> Copy Stage History
              </Button>
            </div>
          </div>
          {action.element}
        </motion.div>

        {/* Add manual context modal */}
        {showAddContextModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => setShowAddContextModal(false)}>
            <div className="w-full max-w-lg bg-card rounded-xl border border-line shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Add Manual Context — Hasit only</h3>
                <button onClick={() => setShowAddContextModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                Capture out-of-band context (Slack confirmations, phone calls, emails forwarded). Entries are <span className="font-semibold text-foreground">immutable</span> once posted.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Timestamp</label>
                  <input
                    type="text"
                    readOnly
                    value={new Date().toISOString().slice(0, 16).replace('T', ' ')}
                    className="w-full h-9 px-3 text-[11px] font-mono border border-line rounded-lg bg-secondary/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Context</label>
                  <textarea
                    value={newContext}
                    onChange={(e) => setNewContext(e.target.value)}
                    rows={4}
                    placeholder="e.g., Sophia confirmed via Slack 2026-02-15 that her approver A is OOO..."
                    className="w-full px-3 py-2 text-[11px] border border-line rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                  />
                </div>
                <button className="text-[11px] text-gold hover:underline inline-flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Attach email or document
                </button>
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setShowAddContextModal(false)}>Cancel</Button>
                <Button size="sm" className="h-8 text-[11px] bg-gold text-navy" onClick={handleAddContext}>Post Context</Button>
              </div>
            </div>
          </div>
        )}

        {/* Nudge Sophia modal */}
        {showNudgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => setShowNudgeModal(false)}>
            <div className="w-full max-w-lg bg-card rounded-xl border border-line shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Nudge Sophia Lam · Slack DM</h3>
                <button onClick={() => setShowNudgeModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                Templated message — review before sending.
              </p>
              <textarea
                rows={6}
                defaultValue={`Hi Sophia — checking in on NCH-Hub1-1 ($51.5M Seed). It's been ${stage?.elapsedDays}d at FP&A Review (median 10-15d). Could you confirm which approver is currently holding the task, or whether we need to re-route around an OOO? Thanks.`}
                className="w-full px-3 py-2 text-[11px] border border-line rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold leading-relaxed"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setShowNudgeModal(false)}>Cancel</Button>
                <Button size="sm" className="h-8 text-[11px] bg-gold text-navy" onClick={() => setShowNudgeModal(false)}>
                  <Send className="w-3 h-3 mr-1.5" /> Send Slack DM
                </Button>
              </div>
            </div>
          </div>
        )}
      </TooltipProvider>
    </AppShell>
  )
}
