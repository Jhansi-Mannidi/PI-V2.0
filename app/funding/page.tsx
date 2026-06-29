'use client'

import * as React from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Clock,
  AlertCircle,
  HelpCircle,
  Bot,
  Check,
  Download,
  RefreshCw,
  Zap,
  ExternalLink,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ============================================================
// Mock data — validated v2.0 stakeholder + project codes
// ============================================================

type Region = 'APAC' | 'EMEA' | 'NA-E' | 'NA-W'
type FundingType = 'Seed' | 'Construction' | 'CLC'

// Canonical 12-stage Approval Pipeline (Prompt 0)
const stages12 = [
  'NPR Authoring',
  'In Cycle Pending Review',
  'BDP Issue',
  'BDP Resolved',
  'QA/QC Sign-off',
  'FP&A Review',
  'Legal Review',
  'AR Final Approval',
  'GFA (SAP) Approval',
  'PO Workflow Init',
  'Buying Hub',
  'PO Issued',
] as const
type Stage = typeof stages12[number]

// SAP black-hole stages (no granular sub-status available)
const SAP_BLACKHOLE: Stage[] = ['FP&A Review', 'GFA (SAP) Approval', 'AR Final Approval']

// 18-value canonical delay-reason taxonomy (v2.0)
const DELAY_REASONS = [
  'None',
  'Finance',
  'Legal',
  'A/E Proposal',
  'Multi Step Delay',
  'YF Initiation',
  'Project Merging',
  'eBuilder Workflow',
  'BDP',
  'Strategic Change',
  'TBD In Progress',
  'Scope Change',
  'Budget Hold',
  'Compliance Review',
  'Vendor Onboarding',
  'Contract Drafting',
  'Tax Review',
  'Other',
] as const
type DelayReason = typeof DELAY_REASONS[number]

interface FundingAsk {
  id: string
  project: string
  region: Region
  fundingType: FundingType
  cycleMonth: string
  stage: Stage
  anuOnwardDays: number
  endToEndDays: number
  delayReason: DelayReason
  cashflowRisk: boolean
  amountUsd: number
  amountLocal?: { currency: string; value: number }
  owner: string
  ownerEmail: string
  ebuilderRef: string
}

const mockAsks: FundingAsk[] = [
  { id: '1', project: 'NCH-Hub1-1', region: 'NA-W', fundingType: 'Seed', cycleMonth: 'Jan 2026', stage: 'FP&A Review', anuOnwardDays: 73, endToEndDays: 138, delayReason: 'Multi Step Delay', cashflowRisk: true, amountUsd: 51.5, owner: 'Sophia Lam', ownerEmail: 'sophia.lamb@odc.com', ebuilderRef: 'NPR-09421' },
  { id: '2', project: 'HDL-Hub1-1&2&3', region: 'NA-W', fundingType: 'Seed', cycleMonth: 'Dec 2025', stage: 'FP&A Review', anuOnwardDays: 60, endToEndDays: 121, delayReason: 'Finance', cashflowRisk: true, amountUsd: 55.6, owner: 'Sophia Lam', ownerEmail: 'sophia.lamb@odc.com', ebuilderRef: 'NPR-09387' },
  { id: '3', project: 'GOR-Hub1-1&2', region: 'NA-W', fundingType: 'Construction', cycleMonth: 'Aug 2025', stage: 'Legal Review', anuOnwardDays: 64, endToEndDays: 244, delayReason: 'Strategic Change', cashflowRisk: true, amountUsd: 0.96, owner: 'Outside Legal', ownerEmail: 'outside.legal@odc.com', ebuilderRef: 'YF-08812' },
  { id: '4', project: 'EWD-Hub2-1&2&3', region: 'NA-W', fundingType: 'Seed', cycleMonth: 'Mar 2026', stage: 'AR Final Approval', anuOnwardDays: 52, endToEndDays: 89, delayReason: 'A/E Proposal', cashflowRisk: false, amountUsd: 1.99, owner: 'Accounting (SAP)', ownerEmail: 'sap.accounting@odc.com', ebuilderRef: 'NPR-09502' },
  { id: '5', project: 'SGR-Hub1-2&3', region: 'NA-E', fundingType: 'Seed', cycleMonth: 'May 2026', stage: 'FP&A Review', anuOnwardDays: 50, endToEndDays: 78, delayReason: 'Finance', cashflowRisk: false, amountUsd: 15.1, owner: 'Sophia Lam', ownerEmail: 'sophia.lamb@odc.com', ebuilderRef: 'NPR-09611' },
  { id: '6', project: 'MUS-Hub1-1&2&3', region: 'NA-W', fundingType: 'Seed', cycleMonth: 'May 2026', stage: 'In Cycle Pending Review', anuOnwardDays: 12, endToEndDays: 32, delayReason: 'None', cashflowRisk: false, amountUsd: 6.3, owner: 'ODC Internal Team', ownerEmail: 'internal.team@odc.com', ebuilderRef: 'NPR-09642' },
  { id: '7', project: 'GPR-Hub1-1&2&3', region: 'APAC', fundingType: 'Seed', cycleMonth: 'May 2026', stage: 'In Cycle Pending Review', anuOnwardDays: 12, endToEndDays: 28, delayReason: 'None', cashflowRisk: false, amountUsd: 15.1, amountLocal: { currency: 'SGD', value: 20.4 }, owner: 'ODC Internal Team', ownerEmail: 'internal.team@odc.com', ebuilderRef: 'NPR-09647' },
  { id: '8', project: 'HRF-Hub1-1&2&3', region: 'NA-W', fundingType: 'Seed', cycleMonth: 'May 2026', stage: 'BDP Issue', anuOnwardDays: 41, endToEndDays: 88, delayReason: 'BDP', cashflowRisk: false, amountUsd: 1.7, owner: 'Hasit Chetal', ownerEmail: 'hasit.chetal@odc.com', ebuilderRef: 'NPR-09588' },
  { id: '9', project: 'LCT-Hub1-3', region: 'NA-E', fundingType: 'Seed', cycleMonth: 'May 2026', stage: 'QA/QC Sign-off', anuOnwardDays: 9, endToEndDays: 14, delayReason: 'None', cashflowRisk: false, amountUsd: 6.3, owner: 'Alisha', ownerEmail: 'alisha@odc.com', ebuilderRef: 'NPR-09655' },
  { id: '10', project: 'LPP-Hub2-1&2', region: 'EMEA', fundingType: 'Construction', cycleMonth: 'Apr 2026', stage: 'PO Workflow Init', anuOnwardDays: 33, endToEndDays: 64, delayReason: 'None', cashflowRisk: false, amountUsd: 30.6, amountLocal: { currency: 'EUR', value: 28.1 }, owner: 'Alice Cox', ownerEmail: 'alice.cox@odc.com', ebuilderRef: 'YF-09301' },
  { id: '11', project: 'SAM-Hub1-1&2', region: 'EMEA', fundingType: 'Construction', cycleMonth: 'Apr 2026', stage: 'PO Issued', anuOnwardDays: 28, endToEndDays: 62, delayReason: 'None', cashflowRisk: false, amountUsd: 31.1, amountLocal: { currency: 'EUR', value: 28.5 }, owner: 'A/E (Aurecon)', ownerEmail: 'aurecon@partner.com', ebuilderRef: 'YF-09289' },
  { id: '12', project: 'CHB-Hub1-1&2&3', region: 'NA-E', fundingType: 'Construction', cycleMonth: 'Feb 2026', stage: 'Legal Review', anuOnwardDays: 49, endToEndDays: 91, delayReason: 'TBD In Progress', cashflowRisk: false, amountUsd: 21.2, owner: 'Outside Legal', ownerEmail: 'outside.legal@odc.com', ebuilderRef: 'YF-09112' },
  { id: '13', project: 'CLB-Hub2-1&2', region: 'NA-E', fundingType: 'Construction', cycleMonth: 'Feb 2026', stage: 'Legal Review', anuOnwardDays: 49, endToEndDays: 88, delayReason: 'TBD In Progress', cashflowRisk: false, amountUsd: 18.9, owner: 'Outside Legal', ownerEmail: 'outside.legal@odc.com', ebuilderRef: 'YF-09115' },
  { id: '14', project: 'SGW-Hub1-1&2', region: 'APAC', fundingType: 'Construction', cycleMonth: 'Jan 2026', stage: 'Buying Hub', anuOnwardDays: 18, endToEndDays: 56, delayReason: 'None', cashflowRisk: false, amountUsd: 6.6, amountLocal: { currency: 'SGD', value: 8.9 }, owner: 'Allen (DCS Director)', ownerEmail: 'allen@odc.com', ebuilderRef: 'YF-08991' },
  { id: '15', project: 'SML-Hub1-2', region: 'APAC', fundingType: 'Construction', cycleMonth: 'Jan 2026', stage: 'GFA (SAP) Approval', anuOnwardDays: 14, endToEndDays: 47, delayReason: 'None', cashflowRisk: false, amountUsd: 5.3, amountLocal: { currency: 'SGD', value: 7.1 }, owner: 'Accounting (SAP)', ownerEmail: 'sap.accounting@odc.com', ebuilderRef: 'YF-08983' },
]

// 18-value delay reason histogram (trailing 12 months)
const mockDelayReasons: { reason: DelayReason; pct: number }[] = [
  { reason: 'None', pct: 44 },
  { reason: 'Finance', pct: 38 },
  { reason: 'Legal', pct: 22 },
  { reason: 'A/E Proposal', pct: 9 },
  { reason: 'Multi Step Delay', pct: 7 },
  { reason: 'YF Initiation', pct: 3 },
  { reason: 'Project Merging', pct: 3 },
  { reason: 'eBuilder Workflow', pct: 3 },
  { reason: 'BDP', pct: 2 },
  { reason: 'Strategic Change', pct: 2 },
  { reason: 'TBD In Progress', pct: 2 },
  { reason: 'Scope Change', pct: 1 },
  { reason: 'Budget Hold', pct: 1 },
  { reason: 'Compliance Review', pct: 1 },
  { reason: 'Vendor Onboarding', pct: 1 },
  { reason: 'Contract Drafting', pct: 1 },
  { reason: 'Tax Review', pct: 0 },
  { reason: 'Other', pct: 0 },
]

const mockCycleTrend = [
  { month: 'Jun \'25', median: 72, count: 6, p90: 110 },
  { month: 'Jul \'25', median: 68, count: 5, p90: 102 },
  { month: 'Aug \'25', median: 51, count: 7, p90: 79 },
  { month: 'Sep \'25', median: 47, count: 8, p90: 71 },
  { month: 'Oct \'25', median: 49, count: 6, p90: 75 },
  { month: 'Nov \'25', median: 52, count: 7, p90: 81 },
  { month: 'Dec \'25', median: 75, count: 4, p90: 121 },
  { month: 'Jan \'26', median: 55, count: 9, p90: 87 },
  { month: 'Feb \'26', median: 49, count: 8, p90: 73 },
  { month: 'Mar \'26', median: 51, count: 7, p90: 76 },
  { month: 'Apr \'26', median: 48, count: 6, p90: 70 },
  { month: 'May \'26', median: 47, count: 8, p90: 69 },
]

const mockOutliers = [
  { project: 'NCH-Hub1-1', stage: 'FP&A Review', elapsed: 73, stageAvg: 28, multiplier: 2.6 },
  { project: 'HDL-Hub1-1&2&3', stage: 'FP&A Review', elapsed: 60, stageAvg: 28, multiplier: 2.1 },
  { project: 'GOR-Hub1-1&2', stage: 'Legal Review', elapsed: 64, stageAvg: 31, multiplier: 2.1 },
]

// ============================================================
// Visual helpers
// ============================================================

// Neutral styles for region and funding - no color noise
const regionStyles: Record<Region, string> = {
  APAC: 'bg-secondary text-muted-foreground border-line',
  EMEA: 'bg-secondary text-muted-foreground border-line',
  'NA-E': 'bg-secondary text-muted-foreground border-line',
  'NA-W': 'bg-secondary text-muted-foreground border-line',
}

const fundingTypeStyles: Record<FundingType, string> = {
  Seed: 'bg-secondary text-muted-foreground border-line',
  Construction: 'bg-secondary text-muted-foreground border-line',
  CLC: 'bg-secondary text-muted-foreground border-line',
}

// Stage chip color - only highlight issues (red/amber), otherwise neutral
function stageColor(stage: Stage, anuDays: number): string {
  if (stage === 'PO Issued') return 'bg-green/10 text-green border-green/30'
  if (anuDays > 60) return 'bg-red/10 text-red border-red/30'
  if (anuDays > 45) return 'bg-amber/10 text-amber border-amber/30'
  return 'bg-secondary text-foreground border-line'
}

function anuDaysColor(days: number): string {
  if (days > 50) return 'text-red font-bold'
  if (days >= 40) return 'text-amber font-semibold'
  return 'text-foreground font-medium'
}

// Delay reason - neutral by default, no color badges
function delayReasonColor(reason: DelayReason): string {
  return 'bg-secondary text-muted-foreground border-line'
}

// ============================================================
// Page
// ============================================================

const kpiContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

const kpiItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.18 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export default function FundingPOCyclePage() {
  const [region, setRegion] = React.useState<string>('all')
  const [fundingType, setFundingType] = React.useState<string>('all')
  const [cycle, setCycle] = React.useState<string>('current')
  const [sortBy, setSortBy] = React.useState<string>('severity')
  const [groupBy, setGroupBy] = React.useState<string>('none')
  const [delayFilter, setDelayFilter] = React.useState<DelayReason | null>(null)
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)
  const [hoverPoint, setHoverPoint] = React.useState<number | null>(null)

  // Live timestamp + Refresh wiring
  const [lastRefreshAt, setLastRefreshAt] = React.useState<Date>(() => new Date(Date.now() - 47_000))
  const [now, setNow] = React.useState<Date>(() => new Date())
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [exportConfirm, setExportConfirm] = React.useState<string | null>(null)

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
    window.setTimeout(() => {
      setLastRefreshAt(new Date())
      setNow(new Date())
      setIsRefreshing(false)
    }, 750)
  }, [isRefreshing])

  const handleExport = React.useCallback(() => {
    const headers = [
      'eBuilder Ref', 'Project', 'Region', 'Funding Type', 'Cycle Month',
      'Stage', 'Anu→PO (days)', 'End-to-End (days)', 'Delay Reason',
      'Cashflow Risk', 'Amount (USD M)', 'Local Currency', 'Local Amount',
      'Owner', 'Owner Email',
    ]
    const rows = mockAsks.map((a) => [
      a.ebuilderRef, a.project, a.region, a.fundingType, a.cycleMonth,
      a.stage, a.anuOnwardDays, a.endToEndDays, a.delayReason,
      a.cashflowRisk ? 'Yes' : 'No', a.amountUsd,
      a.amountLocal?.currency ?? '', a.amountLocal?.value ?? '',
      a.owner, a.ownerEmail,
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
    a.download = `funding-and-po-cycle_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExportConfirm(`Exported ${mockAsks.length} funding asks`)
    window.setTimeout(() => setExportConfirm(null), 2200)
  }, [])

  const filtered = mockAsks
    .filter((a) => region === 'all' || a.region === region)
    .filter((a) => fundingType === 'all' || a.fundingType === fundingType)
    .filter((a) => !delayFilter || a.delayReason === delayFilter)
    .sort((a, b) => {
      if (sortBy === 'severity') return b.anuOnwardDays - a.anuOnwardDays
      if (sortBy === 'elapsed') return b.endToEndDays - a.endToEndDays
      if (sortBy === 'project') return a.project.localeCompare(b.project)
      if (sortBy === 'stage') return a.stage.localeCompare(b.stage)
      if (sortBy === 'funding-type') return a.fundingType.localeCompare(b.fundingType)
      return 0
    })

  return (
    <AppShell title="Funding & PO Cycle" subtitle="Every active funding ask · ranked by SLA severity" activeHref="/funding">
      <AnimatePresence>
        {exportConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
            className="fixed top-20 right-6 z-[60] inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green/15 text-green border border-green/40 text-[11px] font-mono shadow-lg backdrop-blur"
          >
            <Check className="w-3.5 h-3.5" />
            {exportConfirm}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="APAC">APAC</SelectItem>
            <SelectItem value="EMEA">EMEA</SelectItem>
            <SelectItem value="NA-E">NA-East</SelectItem>
            <SelectItem value="NA-W">NA-West</SelectItem>
          </SelectContent>
        </Select>
        <Select value={fundingType} onValueChange={setFundingType}>
          <SelectTrigger className="h-9 w-[150px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Funding Types</SelectItem>
            <SelectItem value="Seed">Seed</SelectItem>
            <SelectItem value="Construction">Construction</SelectItem>
            <SelectItem value="CLC">CLC</SelectItem>
          </SelectContent>
        </Select>
        <Select value={cycle} onValueChange={setCycle}>
          <SelectTrigger className="h-9 w-[160px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current month</SelectItem>
            <SelectItem value="t3">Trailing 3</SelectItem>
            <SelectItem value="t12">Trailing 12</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1.5 px-3 h-9 rounded-md border border-line bg-secondary/40 text-[11px] text-muted-foreground font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          Live · {liveAgo}
        </div>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs gap-1.5"
          onClick={handleExport}
          aria-label="Export funding asks as CSV"
        >
          <Download className="w-3.5 h-3.5" /> Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs gap-1.5"
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh funding data"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      {/* REGION 1 — KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5"
        variants={kpiContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <KpiCard label="Active Asks" value="73" delta={{ dir: 'up', val: '4' }} accent="navy" />
        <KpiCard label="PO Approved YTD" value="87" delta={{ dir: 'flat', val: '—' }} accent="green" />
        <KpiCard label="Pending" value="19" delta={{ dir: 'up', val: '2' }} accent="amber" />
        <KpiCard
          label="Median Anu→PO"
          value="47d"
          delta={{ dir: 'down', val: '3' }}
          accent="green"
          dualTimeline={{ primary: 'Anu-onward', primaryNote: '56 asks closed YTD', target: 50 }}
        />
        <KpiCard
          label="Median End-to-End"
          value="82d"
          delta={{ dir: 'up', val: '5' }}
          accent="amber"
          dualTimeline={{ primary: 'End-to-End', primaryNote: 'Manual narrative: 35d / 43%' }}
        />
        <KpiCard label="Cashflow Risk Asks" value="3" delta={{ dir: 'up', val: '1' }} accent="red" />
      </motion.div>

      {/* REGION 2 — Ranked list */}
      <div className="bg-card border border-line rounded-xl overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Active Funding Asks</h3>
            <p className="text-[11px] text-muted-foreground">{filtered.length} of {mockAsks.length} asks shown</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="severity">Sort: Severity</SelectItem>
                <SelectItem value="elapsed">Sort: Elapsed</SelectItem>
                <SelectItem value="project">Sort: Project</SelectItem>
                <SelectItem value="stage">Sort: Stage</SelectItem>
                <SelectItem value="funding-type">Sort: Funding Type</SelectItem>
              </SelectContent>
            </Select>
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue placeholder="Group by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Group: None</SelectItem>
                <SelectItem value="region">Group: Region</SelectItem>
                <SelectItem value="funding-type">Group: Funding Type</SelectItem>
                <SelectItem value="cycle">Group: Cycle Month</SelectItem>
              </SelectContent>
            </Select>
            {delayFilter && (
              <button
                onClick={() => setDelayFilter(null)}
                className="text-[11px] text-gold hover:underline"
              >
                Clear "{delayFilter}" filter
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary/40 border-b border-line">
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Project</th>
                <th className="px-3 py-2.5 font-medium">Region</th>
                <th className="px-3 py-2.5 font-medium">Funding</th>
                <th className="px-3 py-2.5 font-medium">Cycle</th>
                <th className="px-3 py-2.5 font-medium">Current Stage</th>
                <th className="px-3 py-2.5 font-medium text-right">Anu→PO</th>
                <th className="px-3 py-2.5 font-medium text-right">End-to-End</th>
                <th className="px-3 py-2.5 font-medium">Delay Reason</th>
                <th className="px-3 py-2.5 font-medium text-center">Risk</th>
                <th className="px-3 py-2.5 font-medium text-right">Ask</th>
                <th className="px-3 py-2.5 font-medium">Owner</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ask, rowIdx) => {
                const isExpanded = expandedRow === ask.id
                const isBlackHole = SAP_BLACKHOLE.includes(ask.stage)
                return (
                  <React.Fragment key={ask.id}>
                    <motion.tr
                      custom={rowIdx}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      className={cn(
                        'border-b border-line/60 cursor-pointer transition-colors hover:bg-secondary/40',
                        isExpanded && 'bg-secondary/40'
                      )}
                      onClick={() => setExpandedRow(isExpanded ? null : ask.id)}
                    >
                      <td className="px-4 py-3 font-mono text-foreground font-medium">{ask.project}</td>
                      <td className="px-3 py-3"><Chip className={regionStyles[ask.region]}>{ask.region}</Chip></td>
                      <td className="px-3 py-3"><Chip className={fundingTypeStyles[ask.fundingType]}>{ask.fundingType}</Chip></td>
                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{ask.cycleMonth}</td>
                      <td className="px-3 py-3">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium', stageColor(ask.stage, ask.anuOnwardDays))}>
                          {ask.stage}
                          {isBlackHole && (
                            <span title="SAP Black-Hole: granular sub-status not available; elapsed-since-arrival only">
                              <HelpCircle className="w-3 h-3" />
                            </span>
                          )}
                        </span>
                      </td>
                      <td className={cn('px-3 py-3 text-right font-mono', anuDaysColor(ask.anuOnwardDays))} title="Per-stage breakdown available — click row to view">
                        {ask.anuOnwardDays}d
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-muted-foreground">{ask.endToEndDays}d</td>
                      <td className="px-3 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setDelayFilter(delayFilter === ask.delayReason ? null : ask.delayReason) }}
                          className={cn('inline-block px-2 py-0.5 rounded-md border text-[11px]', delayReasonColor(ask.delayReason))}
                        >
                          {ask.delayReason}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {ask.cashflowRisk && (
                          <button
                            onClick={(e) => { e.stopPropagation(); window.location.href = `/risk?ask=${ask.id}` }}
                            title="Cashflow Risk — open Risk Horizon"
                          >
                            <AlertCircle className="w-4 h-4 text-red inline" />
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-semibold text-foreground" title={ask.amountLocal ? `${ask.amountLocal.currency} ${ask.amountLocal.value}M / USD ${ask.amountUsd}M` : `USD ${ask.amountUsd}M`}>
                        ${ask.amountUsd}M
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-foreground">{ask.owner}</div>
                        <div className="text-[10px] text-muted-foreground">{ask.ownerEmail}</div>
                      </td>
                    </motion.tr>
                    {isExpanded && (
                      <tr className="bg-secondary/20 border-b border-line">
                        <td colSpan={11} className="px-4 py-4">
                          <StageHistoryTimeline ask={ask} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGION 3 — split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Panel A — delay reasons */}
        <div className="bg-card border border-line rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Delay Reason — Trailing 12 Months</h3>
            <p className="text-[11px] text-muted-foreground">Click any bar to filter the table above</p>
          </div>
          <div className="space-y-1.5">
            {mockDelayReasons.filter(d => d.pct > 0).map((d) => (
                <button
                  key={d.reason}
                  onClick={() => setDelayFilter(delayFilter === d.reason ? null : d.reason)}
                  className={cn(
                    'w-full flex items-center gap-3 group',
                    delayFilter === d.reason && 'bg-secondary/40 -mx-1 px-1 rounded'
                  )}
                >
                  <span className="text-[11px] text-muted-foreground w-32 text-left truncate">{d.reason}</span>
                  <div className="flex-1 h-4 bg-secondary/40 rounded overflow-hidden">
                    <div
                      className="h-full transition-all bg-gold/70"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-foreground w-10 text-right">{d.pct}%</span>
                </button>
            ))}
          </div>
        </div>

        {/* Panel B — cycle time trend */}
        <div className="bg-card border border-line rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Cycle-Time Trend — Anu-onward Median</h3>
            <p className="text-[11px] text-muted-foreground">Last 12 cycle months · target 50d (gold line)</p>
          </div>
          <CycleTrendChart data={mockCycleTrend} hoverPoint={hoverPoint} setHoverPoint={setHoverPoint} />
        </div>
      </div>

      {/* REGION 4 — outliers */}
      <div className="bg-card border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-line flex items-center gap-2">
          <Zap className="w-4 h-4 text-gold" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Asks at 2x Average Stage Duration</h3>
            <p className="text-[11px] text-muted-foreground">Agent A-202 Bottleneck Detector · Flagged for intervention</p>
          </div>
        </div>
        <div className="divide-y divide-line/60">
          {mockOutliers.map((o) => (
            <button
              key={o.project}
              onClick={() => window.location.href = `/approval-pipeline?ask=${encodeURIComponent(o.project)}`}
              className="w-full flex items-center gap-4 px-5 py-3 hover:bg-secondary/30 text-left"
            >
              <span className="font-mono text-xs font-medium text-foreground w-40">{o.project}</span>
              <span className="text-xs text-muted-foreground flex-1">{o.stage}</span>
              <span className="text-xs font-mono text-foreground w-20 text-right">{o.elapsed}d</span>
              <span className="text-xs font-mono text-muted-foreground w-24 text-right">avg {o.stageAvg}d</span>
              <span className={cn('text-xs font-mono font-bold w-16 text-right', o.multiplier >= 2.5 ? 'text-red' : 'text-amber')}>
                {o.multiplier}x
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

// ============================================================
// Sub-components
// ============================================================

function KpiCard({
  label,
  value,
  delta,
  accent,
  dualTimeline,
}: {
  label: string
  value: string
  delta: { dir: 'up' | 'down' | 'flat'; val: string }
  accent: 'navy' | 'green' | 'amber' | 'red'
  dualTimeline?: { primary: string; primaryNote: string; target?: number }
}) {
  const accentBar: Record<typeof accent, string> = {
    navy: 'bg-navy',
    green: 'bg-green',
    amber: 'bg-amber',
    red: 'bg-red',
  }
  const accentHoverBorder: Record<typeof accent, string> = {
    navy: 'hover:border-navy/40 dark:hover:border-gold/40',
    green: 'hover:border-green/50',
    amber: 'hover:border-amber/50',
    red: 'hover:border-red/50',
  }
  const deltaColor =
    delta.dir === 'up' ? (accent === 'green' ? 'text-green' : 'text-red') :
    delta.dir === 'down' ? 'text-green' :
    'text-muted-foreground'
  const DeltaIcon = delta.dir === 'up' ? TrendingUp : delta.dir === 'down' ? TrendingDown : Minus
  return (
    <motion.div
      variants={kpiItemVariants}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        'group bg-card border border-line rounded-xl p-4 relative overflow-hidden cursor-default',
        'transition-all duration-300 shadow-elevation-1 hover:shadow-elevation-3',
        accentHoverBorder[accent],
      )}
    >
      <motion.div
        className={cn('absolute top-0 left-0 h-full w-1', accentBar[accent])}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        style={{ transformOrigin: 'top' }}
      />
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 ml-1">{label}</p>
      <div className="flex items-baseline gap-2 ml-1">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-2xl font-mono font-bold text-foreground tabular-nums"
        >
          {value}
        </motion.span>
        <span className={cn('text-[11px] font-mono inline-flex items-center gap-0.5', deltaColor)}>
          <DeltaIcon className="w-3 h-3" />
          {delta.val}
        </span>
      </div>
      {dualTimeline && (
        <div className="mt-2 ml-1 pt-2 border-t border-line/60">
          <p className="text-[10px] text-muted-foreground">
            {dualTimeline.primary}
            {dualTimeline.target && (
              <span className="ml-1 text-green">· target: {dualTimeline.target}</span>
            )}
          </p>
          <p className="text-[10px] text-muted-foreground/80 mt-0.5">{dualTimeline.primaryNote}</p>
        </div>
      )}
    </motion.div>
  )
}

function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-block px-2 py-0.5 rounded-md border text-[10px] font-medium', className)}>
      {children}
    </span>
  )
}

function StageHistoryTimeline({ ask }: { ask: FundingAsk }) {
  const stageIdx = stages12.indexOf(ask.stage)
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] font-semibold text-foreground">Stage History — {ask.project}</p>
          <p className="text-[10px] text-muted-foreground">eBuilder ref: {ask.ebuilderRef} · Owner: {ask.owner}</p>
        </div>
        <a
          href={`/approval-pipeline?ask=${ask.id}`}
          className="text-[11px] text-gold hover:underline inline-flex items-center gap-1"
        >
          Open in Approval Pipeline <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {stages12.map((s, i) => {
          const completed = i < stageIdx
          const current = i === stageIdx
          const isBlackHole = SAP_BLACKHOLE.includes(s)
          return (
            <React.Fragment key={s}>
              <div className={cn(
                'flex flex-col items-center gap-1 min-w-[90px] px-2 py-2 rounded-md border text-center',
                current && 'bg-gold/10 border-gold/40',
                completed && 'bg-green/5 border-green/20',
                !current && !completed && 'bg-secondary/30 border-line/60'
              )}>
                <span className={cn(
                  'text-[10px] font-medium leading-tight inline-flex items-center gap-1',
                  current && 'text-gold',
                  completed && 'text-green',
                  !current && !completed && 'text-muted-foreground'
                )}>
                  {s}
                  {isBlackHole && current && <HelpCircle className="w-2.5 h-2.5" />}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {completed ? 'Completed' : current ? `${ask.anuOnwardDays}d in` : 'Pending'}
                </span>
              </div>
              {i < stages12.length - 1 && (
                <div className={cn('h-px w-3 shrink-0', i < stageIdx ? 'bg-green/40' : 'bg-line')} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

function CycleTrendChart({
  data,
  hoverPoint,
  setHoverPoint,
}: {
  data: typeof mockCycleTrend
  hoverPoint: number | null
  setHoverPoint: (i: number | null) => void
}) {
  const max = Math.max(...data.map((d) => d.median)) + 10
  const min = 30
  const range = max - min
  const targetY = ((max - 50) / range) * 100
  const W = 100
  const H = 100

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: ((max - d.median) / range) * H,
    ...d,
  }))

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="relative">
      <div className="relative h-44 w-full">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
          {/* Target line */}
          <line x1="0" y1={targetY} x2={W} y2={targetY} stroke="var(--gold)" strokeWidth="0.4" strokeDasharray="1.5 1" />
          {/* Path */}
          <path d={path} fill="none" stroke="var(--navy)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hoverPoint === i || i === points.length - 1 ? 1.6 : 1}
              fill={i === points.length - 1 ? 'var(--gold)' : 'var(--navy)'}
              stroke="var(--card)"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
              className="cursor-pointer"
              onMouseEnter={() => setHoverPoint(i)}
              onMouseLeave={() => setHoverPoint(null)}
            />
          ))}
        </svg>
        {/* Y-axis labels */}
        <span className="absolute left-0 top-0 text-[9px] font-mono text-muted-foreground">{max}d</span>
        <span className="absolute left-0 bottom-0 text-[9px] font-mono text-muted-foreground">{min}d</span>
        <span
          className="absolute right-0 text-[9px] font-mono text-gold"
          style={{ top: `calc(${targetY}% - 6px)` }}
        >
          target 50d
        </span>
        {/* Hover tooltip */}
        {hoverPoint !== null && (
          <div
            className="absolute bg-popover border border-line rounded px-2 py-1.5 text-[10px] shadow-md pointer-events-none"
            style={{
              left: `${points[hoverPoint].x}%`,
              top: `${points[hoverPoint].y}%`,
              transform: 'translate(-50%, -110%)',
            }}
          >
            <div className="font-semibold text-foreground">{points[hoverPoint].month}</div>
            <div className="text-muted-foreground">median {points[hoverPoint].median}d</div>
            <div className="text-muted-foreground">{points[hoverPoint].count} asks · p90 {points[hoverPoint].p90}d</div>
          </div>
        )}
      </div>
      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] font-mono text-muted-foreground">{d.month.split(' ')[0]}</span>
        ))}
      </div>
    </div>
  )
}
