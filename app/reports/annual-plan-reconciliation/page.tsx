'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { exportToPDF, exportToXLSX } from '@/lib/export-utils'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  Calendar,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ArrowLeft,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const kpis = [
  { label: 'Approved Annual Plan', value: '$677.55M', status: 'neutral' },
  { label: 'Current Forecast', value: '$510.14M', status: 'neutral' },
  { label: 'Net Movement', value: '-$167.35M', sub: '-25%', status: 'red' },
  { label: 'Reallocations Within 2026', value: '$84.2M', status: 'neutral' },
  { label: 'New Adds Since Plan', value: '$12.4M', status: 'green' },
]

const waterfallSteps = [
  { label: 'Approved Plan', value: 677.55, cumulative: 677.55, type: 'start' },
  { label: 'Strategic Changes', value: -123, cumulative: 554.55, type: 'decrease' },
  { label: 'YAWN/Campus Shifts', value: -22, cumulative: 532.55, type: 'decrease' },
  { label: 'Leadership Approval Delays', value: -22, cumulative: 510.55, type: 'decrease' },
  { label: 'Field Conditions Favorable', value: 28, cumulative: 538.55, type: 'increase' },
  { label: 'Misc Pre-Con', value: -5, cumulative: 533.55, type: 'decrease' },
  { label: 'Within-Year Reallocations', value: 0, cumulative: 533.55, type: 'neutral' },
  { label: 'New Adds Since Plan', value: 12.4, cumulative: 545.95, type: 'increase' },
  { label: 'Drops Since Plan', value: -35.79, cumulative: 510.16, type: 'decrease' },
  { label: 'Current Forecast', value: 510.14, cumulative: 510.14, type: 'end' },
]

const programReconciliation = [
  { program: 'Hubs Plan (Total)', approved: 563.55, forecast: 444.43, change: -119.12, pctVariance: 71, topDriver: 'WEN-Hub2-1', driverType: 'Strategic changes' },
  { program: 'CLC', approved: 104.23, forecast: 58.22, change: -46.01, pctVariance: 27, topDriver: 'Multiple', driverType: 'Leadership Approvals' },
  { program: 'Professional Fees Overheads', approved: 9.72, forecast: 7.49, change: -2.22, pctVariance: 1, topDriver: '—', driverType: 'Trailing actuals' },
  { program: 'Retrofit Portfolio (Marcus)', approved: null, forecast: null, change: null, pctVariance: null, topDriver: 'WEN', driverType: 'Strategic' },
]

const quarterlyDistribution = [
  { quarter: 'Q1', actual: true, committed: 128, budgeted: 0, forecast: 0, total: 128 },
  { quarter: 'Q2', actual: true, committed: 162, budgeted: 20, forecast: 0, total: 182 },
  { quarter: 'Q3', actual: false, committed: 22, budgeted: 65, forecast: 51, total: 138 },
  { quarter: 'Q4', actual: false, committed: 4, budgeted: 18, forecast: 40, total: 62 },
]

const projectReconciliation = [
  { project: 'WEN-Hub2-1', region: 'NA-W', approved: 58.0, forecast: 16.0, change: -42.0, changePct: -72, driver: 'Strategic', qtrOrig: 'Q3', qtrNow: '2027 Q1', confidence: 'Forecast' },
  { project: 'SCF-Hub1-1', region: 'NA-W', approved: 44.0, forecast: 13.0, change: -31.0, changePct: -70, driver: 'Strategic', qtrOrig: 'Q4', qtrNow: '2027 Q2', confidence: 'Forecast' },
  { project: 'ARA-Hub1-1&2', region: 'NA-W', approved: 32.0, forecast: 24.0, change: -8.0, changePct: -25, driver: 'YAWN', qtrOrig: 'Q2', qtrNow: 'Q3', confidence: 'Budgeted' },
  { project: 'STB-Hub1-1', region: 'EMEA', approved: 28.0, forecast: 22.0, change: -6.0, changePct: -21, driver: 'Leadership', qtrOrig: 'Q3', qtrNow: 'Q4', confidence: 'Budgeted' },
  { project: 'WXT-Hub1-2', region: 'EMEA', approved: 19.0, forecast: 23.0, change: 4.0, changePct: 21, driver: 'FFC', qtrOrig: 'Q2', qtrNow: 'Q2', confidence: 'Committed' },
  { project: 'KNC-Hub2-1&3', region: 'NA-W', approved: 42.0, forecast: 38.0, change: -4.0, changePct: -10, driver: 'AE PO Delay', qtrOrig: 'Q3', qtrNow: 'Q3', confidence: 'Budgeted' },
  { project: 'KAS-Hub1-1&2', region: 'NA-W', approved: 36.0, forecast: 33.0, change: -3.0, changePct: -8, driver: 'Enlarged Kitchen', qtrOrig: 'Q3', qtrNow: 'Q4', confidence: 'Forecast' },
  { project: 'CLC Construction (NASA)', region: 'NASA', approved: 52.0, forecast: 37.0, change: -15.0, changePct: -29, driver: 'Leadership', qtrOrig: 'Q3', qtrNow: 'Q4', confidence: 'Forecast' },
  { project: 'MHT-Hub1-1', region: 'NA-E', approved: 24.0, forecast: 22.0, change: -2.0, changePct: -8, driver: 'Permitting', qtrOrig: 'Q2', qtrNow: 'Q3', confidence: 'Budgeted' },
  { project: 'DFW-Hub2-1', region: 'NA-W', approved: 38.0, forecast: 35.0, change: -3.0, changePct: -8, driver: 'Design', qtrOrig: 'Q3', qtrNow: 'Q3', confidence: 'Committed' },
]

const newAdds = [
  { project: 'HJS-Hub2-1', amount: 5.2, reason: 'Variant design pilot' },
  { project: 'NCH-Hub1-1', amount: 4.1, reason: 'POR Variant' },
  { project: 'Three smaller adds', amount: 3.1, reason: 'Various' },
]

const drops = [
  { project: 'Two strategic-change-driven drops', amount: -28.4, reason: 'Strategic changes' },
  { project: 'Four bundling consolidations', amount: -7.39, reason: 'Bundling' },
]

const confidenceMigration = [
  { from: 'Committed', to: 'Committed', value: 148 },
  { from: 'Committed', to: 'Budgeted', value: 40 },
  { from: 'Budgeted', to: 'Committed', value: 32 },
  { from: 'Budgeted', to: 'Forecast', value: 25 },
  { from: 'Forecast', to: 'Committed', value: 18 },
  { from: 'Forecast', to: 'Forecast', value: 113 },
]

const decisionCapture = [
  { date: 'May 12', project: 'WEN-Hub2-1', decision: 'Hold pending configuration', owner: 'Brian Chen', impact: '-$42M' },
  { date: 'May 8', project: 'CLC Construction NASA', decision: 'Defer to Q4', owner: 'Atishu Jain', impact: '-$15M' },
  { date: 'Apr 25', project: 'KAS-Hub1-1&2', decision: 'Accept Enlarged Kitchen delay', owner: 'Loren Smith', impact: '-$3M' },
  { date: 'Apr 18', project: 'WXT-Hub1-2', decision: 'Approve PCO for FFC', owner: 'Paul Cahill', impact: '+$4M' },
  { date: 'Apr 10', project: 'HJS-Hub2-1', decision: 'Approve variant pilot add', owner: 'Brian Chen', impact: '+$5.2M' },
]

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatCurrency(val: number | null, showSign = false): string {
  if (val === null) return '—'
  const sign = showSign && val > 0 ? '+' : ''
  return `${sign}$${Math.abs(val).toFixed(val % 1 === 0 ? 0 : 2)}M`
}

const confidenceColors: Record<string, string> = {
  Committed: 'bg-green-500',
  Budgeted: 'bg-gold',
  Forecast: 'bg-slate-400 dark:bg-slate-500',
}

const confidenceBadgeColors: Record<string, string> = {
  Committed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Budgeted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Forecast: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

// ───────────────────────────────────────────────���������─────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function AnnualPlanReconciliationPage() {
  const [sortField, setSortField] = React.useState<string>('change')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc')
  const [page, setPage] = React.useState(1)
  const perPage = 10

  const sorted = React.useMemo(() => {
    return [...projectReconciliation].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField]
      const bVal = (b as unknown as Record<string, unknown>)[sortField]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [sortField, sortDir])

  const paginated = sorted.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(sorted.length / perPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const maxWaterfall = Math.max(...waterfallSteps.map(s => s.cumulative))

  return (
    <AppShell title="Annual Plan Reconciliation">
      <div className="space-y-6 w-full">

        {/* ─── Header Band ─── */}
        <header className="relative bg-card rounded-xl px-4 sm:px-6 py-6 sm:py-8 border border-border overflow-hidden">
          <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
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
                <h1 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">2026 Annual Plan Reconciliation</h1>
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl ml-10">
                Approved Plan <span className="text-foreground font-medium">$677.55M</span> · 
                Current Forecast <span className="text-foreground font-medium">$510.14M</span> · 
                Net Movement <span className="text-gold font-medium">-$167.35M</span> to Future Years
              </p>
              <div className="ml-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold text-navy text-[10px] font-semibold tracking-wide uppercase">
                  <FileText className="w-3 h-3" />
                  Annual Plan Reconciliation · Q2 2026
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => exportToPDF({ filename: 'annual-plan-reconciliation-q2-2026', title: '2026 Annual Plan Reconciliation' })}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-lg bg-gold text-navy hover:bg-gold-soft transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button 
                onClick={() => exportToXLSX({ filename: 'annual-plan-reconciliation-q2-2026', title: '2026 Annual Plan Reconciliation', data: [], headers: [] })}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-lg bg-navy/10 dark:bg-white/10 text-navy dark:text-foreground hover:bg-navy/20 dark:hover:bg-white/20 border border-navy/30 dark:border-white/30 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> XLSX
              </button>
              <button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-lg bg-gold/20 text-navy dark:text-foreground border border-gold hover:bg-gold/30 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule Quarterly
              </button>
            </div>
          </div>
        </header>

        {/* ─── KPI Strip ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={cn(
                'bg-card border rounded-xl p-4 shadow-sm',
                kpi.status === 'red' ? 'border-l-4 border-l-gold border-t-line border-r-line border-b-line' :
                kpi.status === 'green' ? 'border-l-4 border-l-green border-t-line border-r-line border-b-line' :
                'border-line'
              )}
            >
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">{kpi.label}</p>
              <p className={cn(
                'text-lg sm:text-xl font-semibold tracking-tight',
                  kpi.status === 'red' ? 'text-gold' :
                kpi.status === 'green' ? 'text-green' :
                'text-foreground'
              )}>
                {kpi.value}
              </p>
              {kpi.sub && <p className="text-xs text-gold mt-0.5">{kpi.sub}</p>}
            </motion.div>
          ))}
        </div>

        {/* ─── Plan vs Forecast Waterfall ─── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card border border-line rounded-xl p-4 sm:p-6 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">Plan vs Forecast Waterfall</h2>
          <div className="space-y-2">
            {waterfallSteps.map((step, i) => {
              const barWidth = (step.cumulative / maxWaterfall) * 100
              const isStart = step.type === 'start'
              const isEnd = step.type === 'end'
              const isIncrease = step.type === 'increase'
              const isDecrease = step.type === 'decrease'
              
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-36 sm:w-44 text-xs text-muted-foreground truncate flex-shrink-0">{step.label}</div>
                  <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: `${barWidth}%`, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-lg bg-gradient-to-r from-gold/90 via-gold/70 to-gold/50"
                    />
                    <span className="absolute inset-y-0 right-2 flex items-center text-[10px] font-mono text-foreground/80">
                      ${step.cumulative.toFixed(1)}M
                    </span>
                  </div>
                  <div className={cn(
                    'w-16 text-xs font-medium text-right flex-shrink-0',
                    isIncrease ? 'text-green' :
                    isDecrease ? 'text-gold' :
                    'text-muted-foreground'
                  )}>
                    {step.type === 'start' || step.type === 'end' ? '' :
                     step.value === 0 ? '$0' :
                     `${step.value > 0 ? '+' : ''}$${step.value}M`}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* ─── Reconciliation by Program ─── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border border-line rounded-xl overflow-hidden shadow-sm"
        >
          <div className="px-4 sm:px-6 py-4 border-b border-line">
            <h2 className="text-sm font-semibold text-foreground">Reconciliation by Program</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/40 text-muted-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Program</th>
                  <th className="px-4 py-2.5 text-right font-medium hidden sm:table-cell">Approved Plan</th>
                  <th className="px-4 py-2.5 text-right font-medium hidden sm:table-cell">Current Forecast</th>
                  <th className="px-4 py-2.5 text-right font-medium">Net Change</th>
                  <th className="px-4 py-2.5 text-right font-medium hidden md:table-cell">% of Variance</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden lg:table-cell">Top Driver</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden lg:table-cell">Driver Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {programReconciliation.map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{row.program}</td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">{row.approved !== null ? `$${row.approved}M` : '(sep. budgeted)'}</td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">{row.forecast !== null ? `$${row.forecast}M` : '(sep. budgeted)'}</td>
                    <td className={cn(
                      'px-4 py-3 text-right font-medium',
                      row.change !== null && row.change < 0 ? 'text-gold' : 'text-muted-foreground'
                    )}>
                      {formatCurrency(row.change, true)}
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">{row.pctVariance !== null ? `${row.pctVariance}%` : '—'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">{row.topDriver}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-secondary text-muted-foreground">{row.driverType}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* ─── Quarterly Distribution ─── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card border border-line rounded-xl p-6 sm:p-8 shadow-sm overflow-hidden"
        >
          {/* Header with subtle accent */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-gold to-gold/40 rounded-full" />
              <h2 className="text-base font-semibold text-foreground">Quarterly Distribution</h2>
            </div>
            <motion.div 
              className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              FY 2026 Total: <span className="font-semibold text-foreground">${quarterlyDistribution.reduce((a, b) => a + b.total, 0)}M</span>
            </motion.div>
          </div>
          
          {/* Chart area with background grid */}
          <div className="relative">
            {/* Subtle grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((_, i) => (
                <div key={i} className="border-b border-dashed border-slate-200/50 dark:border-slate-700/30" />
              ))}
            </div>
            
            <div className="grid grid-cols-4 gap-4 sm:gap-8 relative z-10">
              {quarterlyDistribution.map((q, i) => {
                const maxTotal = Math.max(...quarterlyDistribution.map(d => d.total))
                const barHeight = 200
                const scaledHeight = (q.total / maxTotal) * barHeight
                const percentage = Math.round((q.total / quarterlyDistribution.reduce((a, b) => a + b.total, 0)) * 100)
                
                return (
                  <motion.div 
                    key={i} 
                    className="flex flex-col items-center group cursor-pointer"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Bar container */}
                    <div className="relative w-full flex justify-center" style={{ height: barHeight }}>
                      {/* Background track */}
                      <div className="absolute bottom-0 w-16 sm:w-20 h-full bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl" />
                      
                      {/* Main bar */}
                      <motion.div 
                        className="absolute bottom-0 w-16 sm:w-20 rounded-2xl overflow-hidden"
                        initial={{ height: 0 }}
                        animate={{ height: scaledHeight }}
                        transition={{ 
                          duration: 1, 
                          delay: 0.8 + i * 0.12, 
                          ease: [0.22, 1, 0.36, 1] 
                        }}
                        style={{
                          boxShadow: '0 -4px 20px -4px rgba(212, 160, 76, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                        }}
                      >
                        {/* Gradient fill */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gold via-gold/85 to-gold/50" />
                        
                        {/* Glossy top highlight */}
                        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/30 to-transparent rounded-t-2xl" />
                        
                        {/* Subtle side shadows for 3D effect */}
                        <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/10 to-transparent" />
                        <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-black/5 to-transparent" />
                        
                        {/* Animated shimmer on hover */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                        />
                        
                        {/* Inner percentage indicator */}
                        <motion.div 
                          className="absolute inset-x-0 top-3 flex justify-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 + i * 0.1 }}
                        >
                          <span className="text-navy text-xs font-bold drop-shadow-sm">{percentage}%</span>
                        </motion.div>
                      </motion.div>
                      
                      {/* Floating tooltip */}
                      <motion.div 
                        className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                      >
                        <div className="bg-navy dark:bg-slate-800 text-white text-xs font-mono px-3 py-2 rounded-lg shadow-xl relative">
                          <span className="font-bold">${q.total}M</span>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-navy dark:bg-slate-800 rotate-45" />
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Labels */}
                    <motion.div 
                      className="text-center mt-6 space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                    >
                      <p className="text-lg font-bold text-foreground tracking-tight">{q.quarter}</p>
                      <p className="text-sm font-mono text-muted-foreground">${q.total}M</p>
                      {q.actual ? (
                        <motion.span 
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-gold/10 text-gold border border-gold/20"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 1.3 + i * 0.1, type: "spring", stiffness: 200 }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                          Actual
                        </motion.span>
                      ) : (
                        <motion.span 
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 1.3 + i * 0.1 }}
                        >
                          Forecast
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          
          {/* Enhanced Legend */}
          <motion.div 
            className="flex items-center justify-center gap-8 mt-10 pt-6 border-t border-line"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.4 }}
          >
            <span className="inline-flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="w-4 h-4 rounded-lg bg-gradient-to-br from-gold/70 to-gold shadow-sm ring-2 ring-gold/20" /> 
              <span className="font-medium">Quarterly Spend</span>
            </span>
            <span className="inline-flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-medium">Actual</span>
            </span>
            <span className="inline-flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="w-3 h-3 rounded border-2 border-dashed border-slate-300 dark:border-slate-600" />
              <span className="font-medium">Forecast</span>
            </span>
          </motion.div>
        </motion.section>

        {/* ─── Project-Level Reconciliation ─── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-card border border-line rounded-xl overflow-hidden shadow-sm"
        >
          <div className="px-4 sm:px-6 py-4 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">Project-Level Reconciliation</h2>
            <p className="text-xs text-muted-foreground">Showing {paginated.length} of {sorted.length} projects</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/40 text-muted-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Project</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden sm:table-cell">Region</th>
                  <th className="px-4 py-2.5 text-right font-medium hidden md:table-cell">Approved</th>
                  <th className="px-4 py-2.5 text-right font-medium hidden md:table-cell">Forecast</th>
                  <th 
                    className="px-4 py-2.5 text-right font-medium cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('change')}
                  >
                    Change ($) {sortField === 'change' && (sortDir === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium hidden lg:table-cell">Change (%)</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden lg:table-cell">Driver</th>
                  <th className="px-4 py-2.5 text-center font-medium hidden xl:table-cell">Qtr Orig</th>
                  <th className="px-4 py-2.5 text-center font-medium hidden xl:table-cell">Qtr Now</th>
                  <th className="px-4 py-2.5 text-left font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {paginated.map((row, i) => (
                  <tr 
                    key={i} 
                    className={cn(
                      'hover:bg-secondary/20 transition-colors cursor-pointer',
                      row.change < -20 && 'bg-gold-pale'
                    )}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{row.project}</span>
                      <span className="sm:hidden text-muted-foreground ml-1">({row.region})</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">{row.region}</span>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">${row.approved}M</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">${row.forecast}M</td>
                    <td className={cn(
                      'px-4 py-3 text-right font-medium',
                      row.change > 0 ? 'text-green' : 'text-gold'
                    )}>
                      <span className="inline-flex items-center gap-1">
                        {row.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        ${Math.abs(row.change)}M
                      </span>
                    </td>
                    <td className={cn(
                      'px-4 py-3 text-right hidden lg:table-cell',
                      row.changePct > 0 ? 'text-green' : 'text-gold'
                    )}>
                      {row.changePct > 0 ? '+' : ''}{row.changePct}%
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-secondary text-muted-foreground">{row.driver}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden xl:table-cell text-muted-foreground">{row.qtrOrig}</td>
                    <td className="px-4 py-3 text-center hidden xl:table-cell">
                      {row.qtrNow !== row.qtrOrig ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">{row.qtrNow}</span>
                      ) : row.qtrNow}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', confidenceBadgeColors[row.confidence])}>
                        {row.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-3 border-t border-line flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs border border-line rounded-lg disabled:opacity-50 hover:bg-secondary transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs border border-line rounded-lg disabled:opacity-50 hover:bg-secondary transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </motion.section>

        {/* ─── New Adds / Drops Panel ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-card border border-line rounded-xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <h2 className="text-sm font-semibold text-foreground">New Adds Since Plan</h2>
              <span className="ml-auto text-sm font-semibold text-green-600 dark:text-green-400">+$12.4M</span>
            </div>
            <div className="space-y-3">
              {newAdds.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.project}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <span className="text-sm font-medium text-green">+${item.amount}M</span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-card border border-line rounded-xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4 text-gold" />
              <h2 className="text-sm font-semibold text-foreground">Drops Since Plan</h2>
              <span className="ml-auto text-sm font-semibold text-gold">-$35.79M</span>
            </div>
            <div className="space-y-3">
              {drops.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.project}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <span className="text-sm font-medium text-gold">{item.amount}M</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* ─── Confidence Migration ─── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-card border border-line rounded-xl p-4 sm:p-6 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">Confidence Tier Migration</h2>
          <p className="text-xs text-muted-foreground mb-4">How dollars have migrated between confidence tiers since plan approval</p>
          <div className="space-y-2">
            {confidenceMigration.map((flow, i) => {
              const maxVal = Math.max(...confidenceMigration.map(f => f.value))
              const widthPct = (flow.value / maxVal) * 100
              const isUpgrade = (flow.from === 'Forecast' && flow.to === 'Committed') || 
                               (flow.from === 'Budgeted' && flow.to === 'Committed') ||
                               (flow.from === 'Forecast' && flow.to === 'Budgeted')
              const isDowngrade = (flow.from === 'Committed' && flow.to === 'Budgeted') ||
                                 (flow.from === 'Budgeted' && flow.to === 'Forecast')
              
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 sm:w-32 flex items-center gap-1 text-xs flex-shrink-0">
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px]', confidenceBadgeColors[flow.from])}>{flow.from}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px]', confidenceBadgeColors[flow.to])}>{flow.to}</span>
                  </div>
                  <div className="flex-1 h-5 bg-secondary/30 rounded overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded transition-all',
                        isUpgrade ? 'bg-green' : isDowngrade ? 'bg-gold' : 'bg-slate-400'
                      )}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="w-16 text-xs font-medium text-right flex-shrink-0">${flow.value}M</span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-400" /> Upgraded</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400" /> Downgraded</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-400" /> No Change</span>
          </div>
        </motion.section>

        {/* ─── Decision Capture Panel ─── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="bg-card border border-line rounded-xl overflow-hidden shadow-sm"
        >
          <div className="px-4 sm:px-6 py-4 border-b border-line bg-gold/5 dark:bg-gold/10">
            <h2 className="text-sm font-semibold text-foreground">Decision Capture</h2>
            <p className="text-xs text-muted-foreground mt-1">
              All material movements (&gt;$1M or quarter-shifting) require a structured Change Decision record. 
              <span className="text-gold font-medium ml-1">47 Decision records logged this quarter.</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/40 text-muted-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Date</th>
                  <th className="px-4 py-2.5 text-left font-medium">Project</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden sm:table-cell">Decision</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden md:table-cell">Owner</th>
                  <th className="px-4 py-2.5 text-right font-medium">Material Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {decisionCapture.map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{row.project}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{row.decision}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{row.owner}</td>
                    <td className={cn(
                      'px-4 py-3 text-right font-medium',
                      row.impact.startsWith('+') ? 'text-green' : 'text-gold'
                    )}>
                      {row.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* ─── Footer ─── */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="bg-secondary/30 border border-line rounded-xl px-4 sm:px-6 py-4 text-xs text-muted-foreground"
        >
          <p>
            <span className="font-medium text-foreground">Source:</span> Approved 2026 Annual Plan baseline (locked Dec 2025) reconciled against current odc_semantic.cashflow_v2. 
            Change Decisions from structured capture (Cost Benchmarks tab feeds historical baseline).
          </p>
          <p className="mt-2">Generated May 19, 2026 · v2.1 · Distribution: Finance Leadership, Portfolio Directors</p>
        </motion.footer>

      </div>
    </AppShell>
  )
}
