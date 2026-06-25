'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { motion } from 'framer-motion'
import { exportToPDF, exportToXLSX } from '@/lib/export-utils'
import { toast } from 'sonner'
import { 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  ChevronDown, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Info,
  ArrowLeft,
  DollarSign,
  BarChart3,
  PieChart,
  History
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Animation ease
const ease = [0.25, 0.46, 0.45, 0.94] as const

// KPI data
const kpis = [
  { label: '2026 Annual Plan', value: '$677.55M', status: 'neutral' as const, icon: DollarSign },
  { label: 'May Cashflow Projected', value: '$534.03M', status: 'neutral' as const, icon: BarChart3 },
  { label: 'Variance vs Plan', value: '-$143.52M', sub: '-21%', status: 'red' as const, icon: TrendingDown },
  { label: 'High-Confidence (Committed)', value: '$248.39M', sub: '47%', status: 'green' as const, icon: PieChart },
  { label: 'Low-Confidence (Forecast)', value: '$156.01M', sub: '29%', status: 'amber' as const, icon: TrendingUp },
]

// Confidence breakdown - softer faded colors
const confidenceTiers = [
  { label: 'High – Committed', value: 248.39, percent: 47, color: 'bg-emerald-400/70', textColor: 'text-emerald-900' },
  { label: 'Medium – Budgeted', value: 129.63, percent: 24, color: 'bg-gold/60', textColor: 'text-amber-900' },
  { label: 'Low – Forecast', value: 156.01, percent: 29, color: 'bg-slate-300/70', textColor: 'text-slate-700' },
]

// Portfolio split data
const portfolioSplit = [
  { segment: 'Hubs', plan: 563.55, cashflow: 444.43, varianceAmt: -119.12, variancePct: -27, ytdWip: 65.36, ytdActuals: 65.38 },
  { segment: 'CLC', plan: 104.23, cashflow: 58.22, varianceAmt: -46.01, variancePct: -79, ytdWip: 2.25, ytdActuals: 0.72 },
  { segment: 'Prof. Fees', plan: 9.72, cashflow: 7.49, varianceAmt: -2.22, variancePct: -30, ytdWip: 2.42, ytdActuals: 1.52 },
]

// Variance decomposition
const varianceDrivers = [
  { 
    driver: 'Strategic changes', 
    detail: '2-Story, Enlarged Kitchen, Concurrent Build, Variant Design',
    impactType: 'Schedule', 
    variance: -123, 
    nasa: 'WEN (Marcus), SCF',
    emea: '—',
    apac: '—',
    projectCount: 2 
  },
  { 
    driver: 'YAWN/Campus driven', 
    detail: 'BDP, YAWN Schedule, new projects',
    impactType: 'Schedule', 
    variance: -22, 
    nasa: 'ARA, NOL, GVO, EWD, KAS, MOS, SKW, WCK, SGW, MUS',
    emea: 'CHY, BSN, FRD',
    apac: 'CHB, CHN, SGW, GEB, GPR, LKC, PYB, TXA, VJI, CRN',
    projectCount: 18 
  },
  { 
    driver: 'Leadership Approvals', 
    detail: 'Funding, Design, Feasibility & DC Ops, Guardrail, VE',
    impactType: 'Schedule', 
    variance: -22, 
    nasa: 'CLC Construction Funding postponed; SA Guardrail',
    emea: 'STB, VLB, WES, GBL, LPP, GRQ',
    apac: '—',
    projectCount: 8 
  },
  { 
    driver: 'Field Conditions & FFC', 
    detail: 'Permitting, Mobilization, PCOs, Bid update, Q4 Movement',
    impactType: 'Cost & Schedule', 
    variance: 28, 
    nasa: 'in-flight projects',
    emea: 'WXT, HGB',
    apac: 'EMB, EPB',
    projectCount: 6 
  },
  { 
    driver: 'Misc Pre-Con', 
    detail: 'RFP/Estimating, Contract/PO',
    impactType: 'Schedule', 
    variance: -5, 
    nasa: 'CLC Buyout, 2-Story estimating impact',
    emea: 'SAM, KAY, MDR, MOR, HDL',
    apac: '—',
    projectCount: 6 
  },
]

// Project attribution data
const projectAttribution = [
  { project: 'WEN-Hub2-1', region: 'NA-W', driver: 'Strategic changes', variance: -42, plan: 58, forecast: 16, tier: 'Forecast', owner: 'Marcus' },
  { project: 'SCF-Hub1-1', region: 'NA-W', driver: 'Strategic changes', variance: -31, plan: 44, forecast: 13, tier: 'Forecast', owner: 'Loren Smith' },
  { project: 'ARA-Hub1-1&2', region: 'NA-W', driver: 'YAWN/Campus', variance: -8, plan: 32, forecast: 24, tier: 'Budgeted', owner: 'Lisa McIntyre' },
  { project: 'STB-Hub1-1', region: 'EMEA', driver: 'Leadership Approvals', variance: -6, plan: 28, forecast: 22, tier: 'Budgeted', owner: 'Paul Cahill' },
  { project: 'WXT-Hub1-2', region: 'EMEA', driver: 'Field Conditions', variance: 4, plan: 19, forecast: 23, tier: 'Committed', owner: 'Paul Cahill' },
  { project: 'CLC Construction', region: 'NASA', driver: 'Leadership Approvals', variance: -15, plan: 52, forecast: 37, tier: 'Forecast', owner: 'Atishu Jain' },
  { project: 'NOL-Hub1-1', region: 'NA-W', driver: 'YAWN/Campus', variance: -5, plan: 24, forecast: 19, tier: 'Budgeted', owner: 'Marcus' },
  { project: 'GVO-Hub2-1', region: 'NA-E', driver: 'YAWN/Campus', variance: -4, plan: 18, forecast: 14, tier: 'Budgeted', owner: 'Alex Rivera' },
  { project: 'CHY-Hub1-1', region: 'EMEA', driver: 'YAWN/Campus', variance: -3, plan: 15, forecast: 12, tier: 'Committed', owner: 'Paul Cahill' },
  { project: 'PYB-Hub1-2', region: 'APAC', driver: 'YAWN/Campus', variance: -2, plan: 12, forecast: 10, tier: 'Budgeted', owner: 'Hasit Chetal' },
]

// FX Rates
const fxRates = [
  { currency: 'USD', rate: 1.00 },
  { currency: 'EUR', rate: 1.170138076 },
  { currency: 'MYR', rate: 0.218 },
  { currency: 'THB', rate: 0.027 },
  { currency: 'SEK', rate: 0.097 },
]

// YTD trend data
const ytdTrend = [
  { month: 'Jan', wip: 12.4, actuals: 12.1 },
  { month: 'Feb', wip: 28.6, actuals: 27.9 },
  { month: 'Mar', wip: 48.2, actuals: 47.1 },
  { month: 'Apr', wip: 70.0, actuals: 67.6 },
]

export default function CashflowVarianceReportPage() {
  const [fxExpanded, setFxExpanded] = React.useState(false)
  const [auditExpanded, setAuditExpanded] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const pageSize = 6

  const totalPages = Math.ceil(projectAttribution.length / pageSize)
  const paginatedProjects = projectAttribution.slice((page - 1) * pageSize, page * pageSize)

  const totalVariance = varianceDrivers.reduce((sum, d) => sum + d.variance, 0)
  const portfolioTotal = portfolioSplit.reduce((acc, r) => ({
    plan: acc.plan + r.plan,
    cashflow: acc.cashflow + r.cashflow,
    varianceAmt: acc.varianceAmt + r.varianceAmt,
    ytdWip: acc.ytdWip + r.ytdWip,
    ytdActuals: acc.ytdActuals + r.ytdActuals,
  }), { plan: 0, cashflow: 0, varianceAmt: 0, ytdWip: 0, ytdActuals: 0 })

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Committed': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
      case 'Budgeted': return 'bg-gold/10 text-amber-700 dark:text-gold border-gold/30'
      case 'Forecast': return 'bg-muted text-muted-foreground border-line'
      default: return 'bg-muted text-muted-foreground border-line'
    }
  }

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'NA-W': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      case 'NA-E': return 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
      case 'EMEA': return 'bg-violet-500/10 text-violet-700 dark:text-violet-400'
      case 'APAC': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
      case 'NASA': return 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <AppShell title="Cashflow Variance">
      <motion.div 
        className="space-y-5 max-w-[1600px]"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
        }}
      >
        {/* Header Band */}
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
                <h1 className="text-sm sm:text-base font-semibold text-foreground">Cashflow Variance & Confidence Report</h1>
              </div>
              <p className="text-[10px] text-muted-foreground/60 ml-10 max-w-2xl">
                2026 Annual Plan $677.55M · May Cashflow $534.03M · Variance -$143.52M (-21%)
              </p>
              <div className="ml-10">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gold text-navy rounded-full">
                  <span className="text-[10px] font-semibold uppercase tracking-wide">Cashflow Variance & Confidence · May 2026</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 lg:mt-6">
              <button 
                onClick={() => exportToPDF({ filename: 'cashflow-variance-may-2026', title: 'Cashflow Variance & Confidence Report' })}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-gold text-navy hover:bg-gold-soft rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export</span> PDF
              </button>
              <button 
                onClick={() => exportToXLSX({ filename: 'cashflow-variance-may-2026', title: 'Cashflow Variance & Confidence Report', data: [], headers: [] })}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-secondary border border-line text-foreground hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export</span> XLSX
              </button>
              <button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-gold/20 text-navy dark:text-foreground border border-gold hover:bg-gold/30 rounded-lg transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule
              </button>
            </div>
          </div>
        </motion.div>

        {/* KPI Strip */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon
            const borderColor = kpi.status === 'red' ? 'border-l-red-500' : kpi.status === 'green' ? 'border-l-emerald-500' : kpi.status === 'amber' ? 'border-l-gold' : 'border-l-muted-foreground/30'
            return (
              <div 
                key={i} 
                className={cn(
                  'bg-card border border-line rounded-xl p-3 border-l-4 hover:shadow-md transition-all hover:scale-[1.02]',
                  borderColor
                )}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide">{kpi.label}</span>
                  <Icon className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    'text-lg sm:text-xl font-bold font-mono tabular-nums',
                    kpi.status === 'red' ? 'text-red-600 dark:text-red-400' : 
                    kpi.status === 'green' ? 'text-emerald-600 dark:text-emerald-400' : 
                    kpi.status === 'amber' ? 'text-amber-600 dark:text-gold' : 
                    'text-foreground'
                  )}>
                    {kpi.value}
                  </span>
                  {kpi.sub && (
                    <span className={cn(
                      'text-xs font-medium',
                      kpi.status === 'red' ? 'text-red-500' : 
                      kpi.status === 'green' ? 'text-emerald-500' : 
                      kpi.status === 'amber' ? 'text-amber-500' : 
                      'text-muted-foreground'
                    )}>
                      {kpi.sub}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Cashflow Confidence Breakdown */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
          className="bg-card border border-line rounded-xl p-4 sm:p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-teal via-teal/70 to-teal/30" />
            <h2 className="text-sm font-semibold text-foreground">Cashflow Confidence Breakdown</h2>
          </div>
          
          {/* Stacked bar with animations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>Total Cashflow: <strong className="text-foreground">$534.03M</strong></span>
            </div>
            <div className="h-10 md:h-12 rounded-xl overflow-hidden flex bg-secondary/30 shadow-inner">
              {confidenceTiers.map((tier, i) => (
                <motion.div 
                  key={i}
                  className={cn(
                    'h-full flex items-center justify-center cursor-pointer transition-all',
                    tier.color
                  )}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: `${tier.percent}%`, opacity: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3 + i * 0.15,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    filter: 'brightness(1.05)'
                  }}
                  title={`${tier.label}: $${tier.value}M (${tier.percent}%)`}
                >
                  <motion.span 
                    className={cn('text-[10px] md:text-xs font-semibold drop-shadow-sm', tier.textColor)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                  >
                    {tier.percent}%
                  </motion.span>
                </motion.div>
              ))}
            </div>
            
            {/* Animated Legend */}
            <motion.div 
              className="flex flex-wrap items-center gap-4 mt-3 text-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              {confidenceTiers.map((tier, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-2 group cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.08 }}
                  whileHover={{ x: 2 }}
                >
                  <motion.span 
                    className={cn('w-3 h-3 rounded-sm', tier.color)}
                    whileHover={{ scale: 1.2 }}
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">{tier.label}:</span>
                  <span className="font-medium">${tier.value}M</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Annotation */}
          <div className="mt-4 p-3 bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-line">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Confidence tier definitions:</strong> PO-approved → Committed, Funded but not PO&apos;ed → Budgeted, In termsheet → Forecast. From Finance Pre-Approval baseline.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Split Table */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
          className="bg-card border border-line rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-line">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
              <h2 className="text-sm font-semibold text-foreground">Portfolio Split</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/50 dark:bg-secondary/30 border-b border-line">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Segment</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Plan</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Cashflow</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Variance ($)</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Variance (%)</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground hidden md:table-cell">YTD Apr WIP</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground hidden md:table-cell">YTD Apr Actuals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {portfolioSplit.map((row, i) => (
                  <motion.tr 
                    key={i} 
                    className="hover:bg-secondary/30 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <td className="px-4 py-3 font-medium">{row.segment}</td>
                    <td className="px-4 py-3 text-right font-mono">${row.plan.toFixed(2)}M</td>
                    <td className="px-4 py-3 text-right font-mono">${row.cashflow.toFixed(2)}M</td>
                    <td className={cn('px-4 py-3 text-right font-mono font-semibold', row.varianceAmt < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
                      {row.varianceAmt > 0 ? '+' : ''}{row.varianceAmt.toFixed(2)}M
                    </td>
                    <td className={cn('px-4 py-3 text-right font-mono', row.variancePct < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
                      {row.variancePct}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground hidden md:table-cell">${row.ytdWip.toFixed(2)}M</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground hidden md:table-cell">${row.ytdActuals.toFixed(2)}M</td>
                  </motion.tr>
                ))}
                {/* Total row */}
                <motion.tr 
                  className="bg-secondary/50 dark:bg-secondary/30 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                >
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-right font-mono">${portfolioTotal.plan.toFixed(2)}M</td>
                  <td className="px-4 py-3 text-right font-mono">${portfolioTotal.cashflow.toFixed(2)}M</td>
                  <td className="px-4 py-3 text-right font-mono text-red-600 dark:text-red-400">{portfolioTotal.varianceAmt.toFixed(2)}M</td>
                  <td className="px-4 py-3 text-right font-mono text-red-600 dark:text-red-400">-25%</td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground hidden md:table-cell">${portfolioTotal.ytdWip.toFixed(2)}M</td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground hidden md:table-cell">${portfolioTotal.ytdActuals.toFixed(2)}M</td>
                </motion.tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Variance Decomposition */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease }}
          className="bg-card border border-line rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-line">
            <h2 className="text-sm font-semibold">Variance Decomposition by Key Driver</h2>
            <p className="text-[10px] text-muted-foreground mt-1">Deep attribution of the -$143M variance to named driver categories</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/50 dark:bg-secondary/30 border-b border-line">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Key Driver</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Impact Type</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Variance</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">NASA/NA</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">EMEA</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">APAC</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground"># Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {varianceDrivers.map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.driver}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{row.detail}</div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="px-2 py-0.5 bg-secondary rounded text-[10px] font-medium">{row.impactType}</span>
                    </td>
                    <td className={cn('px-4 py-3 text-right font-mono font-semibold', row.variance < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
                      {row.variance > 0 ? '+' : ''}{row.variance}M
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate hidden md:table-cell" title={row.nasa}>{row.nasa}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{row.emea}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{row.apac}</td>
                    <td className="px-4 py-3 text-right font-mono">{row.projectCount}</td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-secondary/50 dark:bg-secondary/30 font-semibold">
                  <td className="px-4 py-3" colSpan={2}>Total Movement</td>
                  <td className="px-4 py-3 text-right font-mono text-red-600 dark:text-red-400">{totalVariance}M</td>
                  <td className="px-4 py-3 hidden md:table-cell" colSpan={3}></td>
                  <td className="px-4 py-3 text-right font-mono">40</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Project-Level Attribution + FX Rates Side Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          {/* Main Table */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
            className="xl:col-span-3 bg-card border border-line rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber via-amber/70 to-amber/30" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Project-Level Attribution</h2>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">Showing {paginatedProjects.length} of {projectAttribution.length} projects</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/50 dark:bg-secondary/30 border-b border-line">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Project</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Region</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Driver</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Variance</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground hidden sm:table-cell">Plan</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground hidden sm:table-cell">Forecast</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Tier</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {paginatedProjects.map((row, i) => (
                    <tr key={i} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                      <td className="px-4 py-3 font-medium">{row.project}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', getRegionColor(row.region))}>
                          {row.region}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{row.driver}</td>
                      <td className={cn('px-4 py-3 text-right font-mono font-semibold', row.variance < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
                        {row.variance > 0 ? '+' : ''}{row.variance}M
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-muted-foreground hidden sm:table-cell">${row.plan}M</td>
                      <td className="px-4 py-3 text-right font-mono text-muted-foreground hidden sm:table-cell">${row.forecast}M</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded border text-[10px] font-medium', getTierColor(row.tier))}>
                          {row.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{row.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="p-3 border-t border-line flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 px-2 text-xs border border-line rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-7 px-2 text-xs border border-line rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>

          {/* FX Rates + YTD Trend Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease }}
            className="space-y-4"
          >
            {/* FX Rates Panel */}
            <div className="bg-card border border-line rounded-xl overflow-hidden">
              <button 
                onClick={() => setFxExpanded(!fxExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
              >
                <span className="text-sm font-semibold">FX Rates</span>
                {fxExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {fxExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {fxRates.map((fx, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-mono font-medium">{fx.currency}</span>
                      <span className="font-mono text-muted-foreground">{fx.rate.toFixed(fx.currency === 'EUR' ? 9 : 3)}</span>
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground mt-3 pt-3 border-t border-line">
                    Rates from May 1, 2026 Finance baseline; refreshed monthly.
                  </p>
                </div>
              )}
            </div>

            {/* YTD Actuals vs WIP Trend */}
            <div className="bg-card border border-line rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">YTD Actuals vs WIP</h3>
              <div className="space-y-2">
                {ytdTrend.map((m, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-medium">{m.month}</span>
                      <span className="text-muted-foreground">WIP: ${m.wip}M / Actuals: ${m.actuals}M</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: `${(m.actuals / m.wip) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded border border-amber-500/30">
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  <strong>Apr note:</strong> First month of {'>'}$1M divergence in CLC segment.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Audit Trail */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="bg-card border border-line rounded-xl overflow-hidden"
        >
          <button 
            onClick={() => setAuditExpanded(!auditExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Audit Trail</span>
            </div>
            {auditExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {auditExpanded && (
            <div className="px-4 pb-4">
              <p className="text-xs text-muted-foreground">
                All variance attributions logged with source event (eBuilder milestone, SAP PO update, Finance termsheet change). Click any row to see the originating event chain.
              </p>
              <div className="mt-3 space-y-2">
                {[
                  { event: 'WEN-Hub2-1 Strategic change logged', source: 'Finance Termsheet', date: 'May 12, 2026' },
                  { event: 'SCF-Hub1-1 Variant Design update', source: 'eBuilder Milestone', date: 'May 10, 2026' },
                  { event: 'CLC Construction Funding postponed', source: 'SAP PO Update', date: 'May 8, 2026' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-secondary/30 rounded">
                    <div>
                      <span className="font-medium">{item.event}</span>
                      <span className="text-muted-foreground ml-2">via {item.source}</span>
                    </div>
                    <span className="text-muted-foreground font-mono">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, ease } } }}
          className="text-center py-4 border-t border-line"
        >
          <p className="text-[10px] text-muted-foreground/60">
            Source: SAP financial actuals + eBuilder commitments + Finance Pre-Approval baseline via odc_semantic.cashflow_v2. Reconciled monthly with Finance team.
          </p>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}
