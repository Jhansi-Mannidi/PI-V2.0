'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { exportToPDF, exportToXLSX } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  FileText,
  Download,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type TabType = 'seed' | 'construction' | 'clc'

interface PORow {
  id: string
  project: string
  region: string
  pgm: string
  gc: string
  termSheetCycle: string
  step1Days: number
  step2Days: number
  step3Days: number
  step4Days: number
  step5Days: number
  step6Days?: number // Only for construction
  totalDays: number
  cashflowRisk: boolean
  poStatus: 'PO Approved' | 'Pending' | 'In Progress'
  delayReason: string
  isOutlier: boolean
}

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────
const seedPOData: PORow[] = [
  { id: 'S1', project: 'UNO-Hub1-2', region: 'NA-W', pgm: 'Lisa McIntyre', gc: 'Turner/Meadowlark', termSheetCycle: 'Feb 2025', step1Days: 0, step2Days: 0, step3Days: 14, step4Days: 11, step5Days: 0, totalDays: 25, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'None', isOutlier: false },
  { id: 'S2', project: 'RED-Hub1-1&2', region: 'NA-W', pgm: 'Loren Smith', gc: 'GCON', termSheetCycle: 'Feb 2025', step1Days: 0, step2Days: 0, step3Days: 25, step4Days: 1, step5Days: 51, totalDays: 77, cashflowRisk: true, poStatus: 'PO Approved', delayReason: 'Finance', isOutlier: true },
  { id: 'S3', project: 'NBF-Hub1-2', region: 'NA-W', pgm: 'Lisa McIntyre', gc: 'BOYD JONES', termSheetCycle: 'Feb 2025', step1Days: 3, step2Days: 0, step3Days: 24, step4Days: 14, step5Days: 0, totalDays: 41, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'Finance', isOutlier: false },
  { id: 'S4', project: 'KNC-Hub1-1&2&3', region: 'NA-W', pgm: 'Lisa McIntyre', gc: 'JE Dunn', termSheetCycle: 'Apr 2025', step1Days: 3, step2Days: 0, step3Days: 8, step4Days: 17, step5Days: 4, totalDays: 32, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'None', isOutlier: false },
  { id: 'S5', project: 'ARA-Hub1-1&2', region: 'NA-E', pgm: 'Lauren Culp', gc: 'Trinity', termSheetCycle: 'May 2025', step1Days: 0, step2Days: 0, step3Days: 13, step4Days: 24, step5Days: 4, totalDays: 41, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'A/E proposal', isOutlier: false },
  { id: 'S6', project: 'EBP-Hub1-1', region: 'APAC', pgm: 'Sam Long', gc: 'Developer GC', termSheetCycle: 'Jul 2025', step1Days: 10, step2Days: 0, step3Days: 17, step4Days: 16, step5Days: 1, totalDays: 44, cashflowRisk: true, poStatus: 'Pending', delayReason: 'YF initiation', isOutlier: false },
  { id: 'S7', project: 'STY-Hub1-2&3', region: 'NA-W', pgm: 'Loren Smith', gc: 'Devcon', termSheetCycle: 'Aug 2025', step1Days: 5, step2Days: 8, step3Days: 8, step4Days: 7, step5Days: 2, totalDays: 30, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'None', isOutlier: false },
  { id: 'S8', project: 'GOR-Hub1-1&2', region: 'NA-W', pgm: 'Loren Smith', gc: 'GCON', termSheetCycle: 'Aug 2025', step1Days: 5, step2Days: 8, step3Days: 5, step4Days: 13, step5Days: 1, totalDays: 32, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'None', isOutlier: false },
  { id: 'S9', project: 'ADC-Hub1-3', region: 'NA-E', pgm: 'Lauren Culp', gc: 'GCON', termSheetCycle: 'Oct 2025', step1Days: 22, step2Days: 8, step3Days: 13, step4Days: 30, step5Days: 13, totalDays: 86, cashflowRisk: true, poStatus: 'PO Approved', delayReason: 'Multi-Step Delay', isOutlier: true },
  { id: 'S10', project: 'MNT-Hub1-1', region: 'EMEA', pgm: 'Brian Cox', gc: 'Skanska', termSheetCycle: 'Sep 2025', step1Days: 2, step2Days: 1, step3Days: 10, step4Days: 12, step5Days: 8, totalDays: 33, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'None', isOutlier: false },
  { id: 'S11', project: 'PLX-Hub2-1&2', region: 'NA-E', pgm: 'Lauren Culp', gc: 'Holder', termSheetCycle: 'Nov 2025', step1Days: 4, step2Days: 2, step3Days: 18, step4Days: 22, step5Days: 6, totalDays: 52, cashflowRisk: false, poStatus: 'In Progress', delayReason: 'Finance', isOutlier: false },
  { id: 'S12', project: 'VRN-Hub1-3', region: 'NA-W', pgm: 'Lisa McIntyre', gc: 'DPR', termSheetCycle: 'Dec 2025', step1Days: 1, step2Days: 0, step3Days: 9, step4Days: 15, step5Days: 3, totalDays: 28, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'None', isOutlier: false },
]

const constructionPOData: PORow[] = [
  { id: 'C1', project: 'GOR-Hub1-1&2', region: 'NA-W', pgm: 'Loren Smith', gc: 'GCON', termSheetCycle: 'Aug 2025', step1Days: 5, step2Days: 8, step3Days: 12, step4Days: 74, step5Days: 11, step6Days: 2, totalDays: 112, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'Legal review', isOutlier: false },
  { id: 'C2', project: 'NCH-Hub1-1', region: 'NA-W', pgm: 'Lisa McIntyre', gc: 'Turner', termSheetCycle: 'Jan 2026', step1Days: 3, step2Days: 5, step3Days: 15, step4Days: 87, step5Days: 14, step6Days: 3, totalDays: 127, cashflowRisk: true, poStatus: 'In Progress', delayReason: 'Legal review', isOutlier: false },
  { id: 'C3', project: 'HDL-Hub1-1&2&3', region: 'NA-W', pgm: 'Loren Smith', gc: 'Mortenson', termSheetCycle: 'Dec 2025', step1Days: 8, step2Days: 10, step3Days: 20, step4Days: 95, step5Days: 18, step6Days: 5, totalDays: 156, cashflowRisk: true, poStatus: 'Pending', delayReason: 'Legal review', isOutlier: true },
  { id: 'C4', project: 'CHB-Hub1-1&2&3', region: 'NA-E', pgm: 'Lauren Culp', gc: 'Holder', termSheetCycle: 'Feb 2026', step1Days: 4, step2Days: 6, step3Days: 14, step4Days: 68, step5Days: 12, step6Days: 2, totalDays: 106, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'None', isOutlier: false },
  { id: 'C5', project: 'EWD-Hub2-1&2&3', region: 'NA-W', pgm: 'Lisa McIntyre', gc: 'DPR', termSheetCycle: 'Mar 2026', step1Days: 6, step2Days: 4, step3Days: 18, step4Days: 112, step5Days: 15, step6Days: 4, totalDays: 159, cashflowRisk: true, poStatus: 'In Progress', delayReason: 'Legal review', isOutlier: true },
  { id: 'C6', project: 'BRK-Hub1-2', region: 'EMEA', pgm: 'Brian Cox', gc: 'Skanska', termSheetCycle: 'Apr 2026', step1Days: 2, step2Days: 3, step3Days: 10, step4Days: 58, step5Days: 10, step6Days: 2, totalDays: 85, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'Finance', isOutlier: false },
  { id: 'C7', project: 'MNT-Hub1-1', region: 'EMEA', pgm: 'Brian Cox', gc: 'BAM', termSheetCycle: 'May 2026', step1Days: 3, step2Days: 2, step3Days: 12, step4Days: 72, step5Days: 11, step6Days: 3, totalDays: 103, cashflowRisk: false, poStatus: 'In Progress', delayReason: 'Legal review', isOutlier: false },
]

const clcPOData: PORow[] = [
  { id: 'CLC1', project: 'CLC-Seed-Alpha', region: 'NA-W', pgm: 'Alice Cox', gc: 'N/A', termSheetCycle: 'Q1 2026', step1Days: 2, step2Days: 1, step3Days: 8, step4Days: 10, step5Days: 5, totalDays: 26, cashflowRisk: false, poStatus: 'PO Approved', delayReason: 'None', isOutlier: false },
  { id: 'CLC2', project: 'CLC-Seed-Beta', region: 'NA-E', pgm: 'Lauren Culp', gc: 'N/A', termSheetCycle: 'Q1 2026', step1Days: 3, step2Days: 2, step3Days: 12, step4Days: 14, step5Days: 8, totalDays: 39, cashflowRisk: false, poStatus: 'In Progress', delayReason: 'Finance', isOutlier: false },
  { id: 'CLC3', project: 'CLC-Const-Gamma', region: 'APAC', pgm: 'Sam Long', gc: 'Developer', termSheetCycle: 'Q2 2026', step1Days: 5, step2Days: 3, step3Days: 15, step4Days: 45, step5Days: 10, totalDays: 78, cashflowRisk: true, poStatus: 'Pending', delayReason: 'Legal review', isOutlier: false },
]

const seedProcessSteps = [
  { name: 'LT Approval', subtext: 'Anu Reddy', avgDays: 3, target: 5 },
  { name: 'Email to Cap Planning', subtext: 'NPR on eBuilder', avgDays: 1, target: 2 },
  { name: 'YF Setup + AR Init', subtext: 'Cap Planning', avgDays: 10, target: 10 },
  { name: 'FP&A · Buying · GFA · AR', subtext: '4 sub-steps', avgDays: 14, target: 14 },
  { name: 'eBuilder Workflow', subtext: 'LS initiates', avgDays: 11, target: 14 },
  { name: 'A/E Receives PO', subtext: 'Final step', avgDays: 2, target: 3 },
]

const constructionProcessSteps = [
  { name: 'LT Approval', subtext: 'Leadership', avgDays: 5, target: 5 },
  { name: 'GC Award', subtext: 'Selection', avgDays: 6, target: 7 },
  { name: 'Legal Intake', subtext: 'Hyperterm', avgDays: 14, target: 10 },
  { name: 'Legal Review', subtext: 'Internal + GC Redlines', avgDays: 74, target: 30 },
  { name: 'Final Contract', subtext: 'Execution', avgDays: 12, target: 14 },
  { name: 'PO Workflow', subtext: 'eBuilder', avgDays: 11, target: 14 },
  { name: 'GC Receives PO', subtext: 'Final step', avgDays: 3, target: 3 },
]

const seedDelayReasons = [
  { reason: 'No delay', pct: 44, color: 'bg-emerald-500', strokeColor: '#22c55e' },
  { reason: 'Finance', pct: 38, color: 'bg-gold', strokeColor: '#D4A04C' },
  { reason: 'A/E proposal', pct: 9, color: 'bg-violet-500', strokeColor: '#8b5cf6' },
  { reason: 'YF initiation', pct: 3, color: 'bg-purple-500', strokeColor: '#a855f7' },
  { reason: 'Project merging', pct: 3, color: 'bg-orange-500', strokeColor: '#f97316' },
  { reason: 'eBuilder', pct: 3, color: 'bg-red-500', strokeColor: '#ef4444' },
]

const constructionDelayReasons = [
  { reason: 'Legal review', pct: 87, color: 'bg-red-500', strokeColor: '#ef4444' },
  { reason: 'Finance', pct: 8, color: 'bg-gold', strokeColor: '#D4A04C' },
  { reason: 'GC Award', pct: 5, color: 'bg-teal-500', strokeColor: '#14b8a6' },
]

// Animation
const ease = [0.25, 0.46, 0.45, 0.94] as const

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function FundingPOCycleReportPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('seed')
  const [sortField, setSortField] = React.useState<string>('totalDays')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')
  const [expandedProcess, setExpandedProcess] = React.useState(true)

  const data = activeTab === 'seed' ? seedPOData : activeTab === 'construction' ? constructionPOData : clcPOData
  const processSteps = activeTab === 'construction' ? constructionProcessSteps : seedProcessSteps
  const delayReasons = activeTab === 'construction' ? constructionDelayReasons : seedDelayReasons

  // Sorting
  const sorted = React.useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField]
      const bVal = (b as unknown as Record<string, unknown>)[sortField]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      return sortDir === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [data, sortField, sortDir])

  // Column averages for outlier detection
  const avgByStep = React.useMemo(() => {
    const sum = { step1: 0, step2: 0, step3: 0, step4: 0, step5: 0 }
    data.forEach(row => {
      sum.step1 += row.step1Days
      sum.step2 += row.step2Days
      sum.step3 += row.step3Days
      sum.step4 += row.step4Days
      sum.step5 += row.step5Days
    })
    const len = data.length || 1
    return {
      step1: sum.step1 / len,
      step2: sum.step2 / len,
      step3: sum.step3 / len,
      step4: sum.step4 / len,
      step5: sum.step5 / len,
    }
  }, [data])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const getStepColor = (avg: number, target: number) => {
    if (avg > target * 1.5) return 'bg-red-500'
    if (avg > target) return 'bg-gold'
    return 'bg-emerald-500'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PO Approved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      case 'Pending':
        return 'bg-gold/10 text-gold border-gold/30'
      case 'In Progress':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  // KPIs based on tab
  const kpis = React.useMemo(() => {
    if (activeTab === 'seed') {
      return [
        { label: 'Seed POs Active', value: '55', status: 'neutral' as const },
        { label: 'Avg End-to-End Days', value: '64d', status: 'amber' as const },
        { label: 'eBuilder Workflow Avg', value: '11d', subtext: 'target 14d', status: 'green' as const },
        { label: 'Outlier Projects', value: '4', subtext: '>2× avg', status: 'red' as const },
        { label: 'POs Approved (30d)', value: '14', status: 'green' as const },
      ]
    } else if (activeTab === 'construction') {
      return [
        { label: 'Construction POs Active', value: '27', status: 'neutral' as const },
        { label: 'Avg End-to-End Days', value: '142d', status: 'red' as const },
        { label: 'Legal Review Avg', value: '74d', subtext: 'target 30d', status: 'red' as const },
        { label: 'Outlier Projects', value: '6', subtext: '>2× avg', status: 'red' as const },
        { label: 'POs Approved (30d)', value: '8', status: 'amber' as const },
      ]
    } else {
      return [
        { label: 'CLC POs Active', value: '12', status: 'neutral' as const },
        { label: 'Avg End-to-End Days', value: '48d', status: 'amber' as const },
        { label: 'eBuilder Workflow Avg', value: '8d', subtext: 'target 14d', status: 'green' as const },
        { label: 'Outlier Projects', value: '1', subtext: '>2× avg', status: 'amber' as const },
        { label: 'POs Approved (30d)', value: '5', status: 'green' as const },
      ]
    }
  }, [activeTab])

  return (
    <AppShell title="Funding & PO Cycle">
      <motion.div 
        className="space-y-5 max-w-[1600px]"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
        }}
      >
        {/* ─── Header Band ─── */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
          className="bg-card rounded-xl p-4 sm:p-5 border border-border"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Link 
                  href="/reports" 
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Back to Reports"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
                <h1 className="text-sm sm:text-base font-semibold text-foreground">
                  Funding &amp; PO Cycle Time Report
                </h1>
              </div>
              <p className="text-[10px] text-muted-foreground/60 ml-10 max-w-2xl">
                End-to-end PO workflow timeline analysis · 87 active projects · 6 PO process tabs consolidated
              </p>
              <div className="ml-10">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gold text-navy rounded-full text-[10px] font-mono uppercase tracking-wide">
                  <FileText className="w-3 h-3" />
                  Funding &amp; PO Cycle · Week Ending May 17, 2026
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => exportToPDF({ filename: 'funding-po-cycle-may-2026', title: 'Funding & PO Cycle Time Report' })}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-gold text-navy hover:bg-gold-soft rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span> PDF
              </button>
              <button 
                onClick={() => exportToXLSX({ filename: 'funding-po-cycle-may-2026', title: 'Funding & PO Cycle Time Report', data: [], headers: [] })}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-secondary border border-line text-foreground hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span> XLSX
              </button>
              <button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-gold/20 text-navy dark:text-foreground border border-gold hover:bg-gold/30 rounded-lg transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule
              </button>
            </div>
          </div>
        </motion.div>

        {/* ─── Tab Switcher ─── */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, ease } } }}
          className="flex items-center gap-1 p-1 bg-secondary/60 dark:bg-navy-soft/30 rounded-lg border border-line w-fit"
        >
          {(['seed', 'construction', 'clc'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-md transition-all',
                activeTab === tab
                  ? 'bg-gold text-navy shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {tab === 'seed' ? 'Seed POs' : tab === 'construction' ? 'Construction POs' : 'CLC POs'}
            </button>
          ))}
        </motion.div>

        {/* ─── KPI Strip ─── */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {kpis.map((kpi, i) => {
            const borderColor = kpi.status === 'green' ? 'border-l-emerald-500' 
              : kpi.status === 'red' ? 'border-l-red-500' 
              : kpi.status === 'amber' ? 'border-l-gold' 
              : 'border-l-muted-foreground'
            return (
              <div
                key={i}
                className={cn(
                  'bg-card border border-line rounded-lg p-3 border-l-4 hover:shadow-md transition-all hover:scale-[1.02]',
                  borderColor
                )}
              >
                <div className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wide mb-1">
                  {kpi.label}
                </div>
                <div className="text-lg sm:text-xl font-semibold text-foreground font-mono tabular-nums">{kpi.value}</div>
                {kpi.subtext && (
                  <div className="text-[10px] text-muted-foreground/60 mt-0.5">{kpi.subtext}</div>
                )}
              </div>
            )
          })}
        </motion.div>

        {/* ─── Process Flow Bar ─── */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
          className="bg-card border border-line rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setExpandedProcess(!expandedProcess)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium">
                {activeTab === 'construction' ? '7-Step Construction PO Process' : '6-Step Seed PO Process'}
              </span>
              <span className="text-xs text-muted-foreground">
                (avg duration per step, color = target compliance)
              </span>
            </div>
            {expandedProcess ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedProcess && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap lg:flex-nowrap items-stretch gap-2">
                {processSteps.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="flex-1 min-w-[120px] sm:min-w-[140px]">
                      <div className={cn(
                        'h-2 rounded-full mb-2',
                        getStepColor(step.avgDays, step.target)
                      )} />
                      <div className="text-xs font-medium text-foreground">{step.name}</div>
                      <div className="text-[10px] text-muted-foreground">{step.subtext}</div>
                      <div className="text-sm font-semibold text-foreground mt-1">
                        {step.avgDays}d
                        <span className="text-[10px] text-muted-foreground font-normal ml-1">
                          (target {step.target}d)
                        </span>
                      </div>
                    </div>
                    {i < processSteps.length - 1 && (
                      <div className="hidden lg:flex items-center">
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {activeTab === 'construction' && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                  Legal Review is the dominant bottleneck at 74d avg vs 30d target (2.5× over)
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ─── Main Content Grid ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
          {/* Main Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5, ease }}
            className="xl:col-span-4 bg-card border border-line rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-sm font-semibold">PO Workflow Details</h2>
              <span className="text-xs text-muted-foreground">
                {sorted.length} projects · sorted by {sortField} ({sortDir})
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-line bg-muted/30">
                    {[
                      { key: 'project', label: 'Project' },
                      { key: 'region', label: 'Region' },
                      { key: 'pgm', label: 'PgM', hideMobile: true },
                      { key: 'gc', label: 'GC', hideMobile: true },
                      { key: 'step1Days', label: 'Step 1' },
                      { key: 'step2Days', label: 'Step 2', hideMobile: true },
                      { key: 'step3Days', label: 'Step 3', hideMobile: true },
                      { key: 'step4Days', label: 'Step 4' },
                      { key: 'step5Days', label: 'Step 5' },
                      { key: 'totalDays', label: 'Total' },
                      { key: 'poStatus', label: 'Status' },
                      { key: 'delayReason', label: 'Delay', hideMobile: true },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className={cn(
                          'px-3 py-2.5 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors whitespace-nowrap',
                          col.hideMobile && 'hidden lg:table-cell'
                        )}
                      >
                        <span className="inline-flex items-center gap-1">
                          {col.label}
                          <ArrowUpDown className="w-3 h-3 opacity-50" />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {sorted.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        'hover:bg-muted/30 transition-colors',
                        row.cashflowRisk && 'bg-gold/5',
                        row.isOutlier && 'bg-red-500/5'
                      )}
                    >
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-foreground">{row.project}</div>
                        <div className="text-[10px] text-muted-foreground lg:hidden">{row.pgm}</div>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.region}</td>
                      <td className="px-3 py-2.5 text-muted-foreground hidden lg:table-cell">{row.pgm}</td>
                      <td className="px-3 py-2.5 text-muted-foreground hidden lg:table-cell">{row.gc}</td>
                      <td className="px-3 py-2.5">
                        <span className={cn(row.step1Days > avgByStep.step1 * 2 && 'text-red-500 font-semibold')}>
                          {row.step1Days}d
                          {row.step1Days > avgByStep.step1 * 2 && <span className="text-[10px] ml-0.5">▲</span>}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 hidden lg:table-cell">
                        <span className={cn(row.step2Days > avgByStep.step2 * 2 && 'text-red-500 font-semibold')}>
                          {row.step2Days}d
                        </span>
                      </td>
                      <td className="px-3 py-2.5 hidden lg:table-cell">
                        <span className={cn(row.step3Days > avgByStep.step3 * 2 && 'text-red-500 font-semibold')}>
                          {row.step3Days}d
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn(row.step4Days > avgByStep.step4 * 2 && 'text-red-500 font-semibold')}>
                          {row.step4Days}d
                          {row.step4Days > avgByStep.step4 * 2 && <span className="text-[10px] ml-0.5">▲</span>}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn(row.step5Days > avgByStep.step5 * 2 && 'text-red-500 font-semibold')}>
                          {row.step5Days}d
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn(
                          'font-semibold',
                          row.isOutlier ? 'text-red-500' : 'text-foreground'
                        )}>
                          {row.totalDays}d
                          {row.isOutlier && <span className="text-[10px] ml-1 text-red-500">outlier</span>}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap',
                          getStatusBadge(row.poStatus)
                        )}>
                          {row.poStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground hidden lg:table-cell">
                        {row.delayReason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Delay Breakdown Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease }}
            className="space-y-4"
          >
            {/* Donut Chart Card */}
            <div className="bg-card border border-line rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">Delay Reason Breakdown</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Rolling 30 days</p>
              
              {/* Animated donut visualization */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {(() => {
                    let cumulative = 0
                    return delayReasons.map((item, i) => {
                      const circumference = 2 * Math.PI * 40
                      const strokeLength = (item.pct / 100) * circumference
                      const rotation = cumulative
                      cumulative += item.pct
                      
                      return (
                        <motion.circle
                          key={i}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          strokeWidth="16"
                          stroke={item.strokeColor}
                          strokeLinecap="round"
                          strokeDasharray={`${strokeLength} ${circumference}`}
                          style={{ 
                            transformOrigin: '50% 50%',
                            rotate: `${rotation * 3.6}deg`
                          }}
                          initial={{ strokeDasharray: `0 ${circumference}` }}
                          animate={{ strokeDasharray: `${strokeLength} ${circumference}` }}
                          transition={{ 
                            duration: 0.8, 
                            delay: 0.4 + i * 0.1,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          whileHover={{ strokeWidth: 20 }}
                          className="cursor-pointer transition-all"
                        />
                      )
                    })
                  })()}
                  <circle cx="50" cy="50" r="28" className="fill-card" />
                </svg>
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1, type: "spring", stiffness: 200 }}
                >
                  <span className="text-lg font-semibold">{delayReasons.length}</span>
                </motion.div>
              </div>

              {/* Animated Legend */}
              <div className="space-y-2">
                {delayReasons.map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center justify-between text-xs group cursor-pointer hover:bg-secondary/50 rounded px-1 -mx-1 py-0.5 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className={cn('w-2.5 h-2.5 rounded-full', item.color)}
                        whileHover={{ scale: 1.3 }}
                      />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.reason}</span>
                    </div>
                    <span className="font-medium">{item.pct}%</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Annotation Card */}
            <div className="bg-gold/10 dark:bg-gold/5 border border-gold/30 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-xs text-foreground">
                  <span className="font-medium">Internal Goal:</span>
                  <span className="text-muted-foreground ml-1">
                    &quot;Aim to establish SLAs&quot; and &quot;Aim to reduce by setting up automation&quot; — PIP&apos;s SLA Sentinel and AI Agents are direct responses to these stated goals.
                  </span>
                </div>
              </div>
            </div>

            {/* Trend Mini Card */}
            <div className="bg-card border border-line rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-2">13-Week Trend</h3>
              <p className="text-[10px] text-muted-foreground mb-3">Avg PO Cycle Days</p>
              
              {/* Mini trend bars */}
              <div className="flex items-end gap-1 h-16">
                {[68, 72, 65, 70, 74, 69, 66, 64, 62, 65, 68, 64, 64].map((val, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex-1 rounded-t transition-all',
                      i === 12 ? 'bg-gold' : 'bg-muted-foreground/30'
                    )}
                    style={{ height: `${(val / 80) * 100}%` }}
                    title={`Week ${i + 1}: ${val}d`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <span>W1</span>
                <span>W13</span>
              </div>
              <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3 inline mr-1" />
                May 1: eBuilder workflow SLA reduced from 14d to 11d average
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Footer ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease }}
          className="text-center py-4 border-t border-line"
        >
          <p className="text-[10px] text-muted-foreground">
            Source: 2025-2026 HUBS PO Status &amp; Timeline Analysis (LineSight master) merged with eBuilder workflow telemetry via odc_semantic.po_lifecycle
          </p>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}
