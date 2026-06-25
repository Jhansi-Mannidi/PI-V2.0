'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { exportToPDF, exportToXLSX } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  FileText,
  Download,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Filter,
  Search,
} from 'lucide-react'

// Animation ease
const ease = [0.25, 0.46, 0.45, 0.94] as const

// Types
type BundleCategory = 'Bid' | 'Guardrail' | 'Guardrail+Civil' | 'Class 1 Estimate'
type BundleStatus = 'On track' | 'Amber' | 'Red'

interface Bundle {
  id: string
  category: BundleCategory
  projects: string
  region: string
  currentStage: string
  daysInStage: number
  daysInPipeline: number
  owner: string
  status: BundleStatus
}

// Pipeline stages with targets
const pipelineStages = [
  { name: 'Project ID', target: 5, count: 23 },
  { name: 'LS Issues Bundle', target: 4, count: 18 },
  { name: 'TS Trio Completion', target: 1, count: 16 },
  { name: 'LS Converts to Narrative', target: 2, count: 14 },
  { name: 'PgM + Biz Ops Review', target: 2, count: 11 },
  { name: 'PgM LGTM', target: 1, count: 9 },
  { name: 'Biz Ops LGTM', target: 3, count: 8 },
  { name: 'Alisha LGTM', target: 1, count: 6 },
  { name: 'Brian Review', target: 2, count: 6 },
  { name: 'Brian LGTM', target: 1, count: 4 },
  { name: 'Brian-to-Anu', target: 1, count: 3 },
  { name: 'Anu Approved', target: 0, count: 12 },
  { name: 'Cap Planning', target: 1, count: 12 },
  { name: 'Loan Approval', target: 0, count: 8 },
]

// Sample bundles data
const bundles: Bundle[] = [
  { id: 'TS-2026-04-001', category: 'Bid', projects: 'ARA-Hub1-1&2, NOL-Hub2-1', region: 'NA-W', currentStage: 'Brian Review', daysInStage: 3, daysInPipeline: 18, owner: 'Brian Chen', status: 'On track' },
  { id: 'TS-2026-04-002', category: 'Guardrail', projects: 'CHB-Hub1-2, BSN-Hub1-1', region: 'APAC', currentStage: 'Anu Final', daysInStage: 5, daysInPipeline: 24, owner: 'Anu Reddy', status: 'Amber' },
  { id: 'TS-2026-04-003', category: 'Guardrail+Civil', projects: 'STB-Hub1-1, VLB-Hub2-1', region: 'EMEA', currentStage: 'Biz Ops LGTM', daysInStage: 2, daysInPipeline: 12, owner: 'Brian Bts', status: 'On track' },
  { id: 'TS-2026-04-004', category: 'Class 1 Estimate', projects: 'KAS-Hub1-1&2', region: 'NA-W', currentStage: 'PgM Review', daysInStage: 1, daysInPipeline: 6, owner: 'Loren Smith', status: 'On track' },
  { id: 'TS-2026-04-005', category: 'Bid', projects: 'WEN-Hub2-1', region: 'NA-W', currentStage: 'Awaiting LS Narrative', daysInStage: 4, daysInPipeline: 11, owner: 'Sreya (LS)', status: 'Amber' },
  { id: 'TS-2026-04-006', category: 'Guardrail', projects: 'GBL-Hub2-1, LPP-Hub1-1', region: 'EMEA', currentStage: 'Approved', daysInStage: 0, daysInPipeline: 22, owner: 'Anu Reddy', status: 'On track' },
  { id: 'TS-2026-04-007', category: 'Bid', projects: 'UNO-Hub1-2, RED-Hub1-1&2', region: 'NA-W', currentStage: 'Cap Planning Pending', daysInStage: 6, daysInPipeline: 28, owner: 'Cap Planning', status: 'Red' },
  { id: 'TS-2026-04-008', category: 'Guardrail', projects: 'MNT-Hub1-1, PLK-Hub2-1', region: 'NA-E', currentStage: 'PgM LGTM', daysInStage: 1, daysInPipeline: 9, owner: 'Alice Cox', status: 'On track' },
  { id: 'TS-2026-04-009', category: 'Bid', projects: 'SFO-Hub1-2', region: 'NA-W', currentStage: 'LS Issues Bundle', daysInStage: 2, daysInPipeline: 5, owner: 'Sreya (LS)', status: 'On track' },
  { id: 'TS-2026-04-010', category: 'Class 1 Estimate', projects: 'DEN-Hub2-1, PHX-Hub1-1', region: 'NA-W', currentStage: 'Alisha LGTM', daysInStage: 1, daysInPipeline: 15, owner: 'Alisha', status: 'On track' },
]

// Review calendar events
const calendarEvents = [
  { date: 'Mon May 19', event: 'LineSight Issue TS Cycle Kickoff Email', type: 'kickoff' },
  { date: 'Wed May 21', event: 'PgM/LS Review Meeting (APAC)', type: 'review' },
  { date: 'Wed May 21', event: 'PgM/LS Review Meeting (EMEA)', type: 'review' },
  { date: 'Thu May 22', event: 'PgM Review Meeting', type: 'review' },
  { date: 'Mon May 26', event: 'Brian Review Meeting', type: 'brian' },
  { date: 'Wed May 28', event: 'Anu Pre Review Email (LS to Brian)', type: 'email' },
  { date: 'Fri May 30', event: 'Cap Planning Email Issuance — Anu Final Review', type: 'final' },
  { date: 'Mon Jun 2', event: 'DC Stat PgM Meeting', type: 'dcstat' },
  { date: 'Wed Jun 4', event: 'DC Stat Brian Review Meeting', type: 'dcstat' },
]

// Cycle comparison data
const cycleData = [
  { cycle: 'Dec 2025', bundles: 18, avgDays: 28, note: 'Holiday shift' },
  { cycle: 'Jan 2026', bundles: 15, avgDays: 26, note: 'Holiday shift' },
  { cycle: 'Feb 2026', bundles: 22, avgDays: 23 },
  { cycle: 'Mar 2026', bundles: 25, avgDays: 21 },
  { cycle: 'Apr 2026', bundles: 24, avgDays: 22 },
  { cycle: 'May 2026', bundles: 23, avgDays: 22 },
]

// Funding status breakdown
const fundingBreakdown = [
  { label: 'Approved by Anu (Seed)', value: 14, color: 'bg-emerald-500' },
  { label: 'ACTUALS Approved (Construction)', value: 5, color: 'bg-emerald-400' },
  { label: 'BUNDLE Approved GJ/AJ', value: 3, color: 'bg-emerald-300' },
  { label: 'In Cycle Pending Review', value: 6, color: 'bg-gold' },
  { label: 'Pending Final Revisions', value: 2, color: 'bg-amber-400' },
  { label: 'Moved to Later Month', value: 1, color: 'bg-slate-400' },
  { label: 'Moved Offline', value: 1, color: 'bg-slate-500' },
  { label: 'Merged', value: 1, color: 'bg-slate-300' },
  { label: 'Awaiting Bundle Approval', value: 3, color: 'bg-orange-400' },
]

const categoryColors: Record<BundleCategory, string> = {
  'Bid': 'bg-gold/20 text-gold border-gold/30',
  'Guardrail': 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  'Guardrail+Civil': 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  'Class 1 Estimate': 'bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30',
}

const statusConfig: Record<BundleStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  'On track': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 },
  'Amber': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle },
  'Red': { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', icon: XCircle },
}

const eventTypeColors: Record<string, string> = {
  'kickoff': 'bg-gold/20 text-gold border-l-gold',
  'review': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-emerald-500',
  'brian': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-l-cyan-500',
  'email': 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-l-slate-500',
  'final': 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-l-violet-500',
  'dcstat': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-l-orange-500',
}

export default function TermsheetBundleReportPage() {
  const [categoryFilter, setCategoryFilter] = React.useState<BundleCategory | 'All'>('All')
  const [regionFilter, setRegionFilter] = React.useState<string>('All')
  const [stageFilter, setStageFilter] = React.useState<string>('All')
  const [search, setSearch] = React.useState('')
  const [showCalendar, setShowCalendar] = React.useState(true)

  const categories: (BundleCategory | 'All')[] = ['All', 'Bid', 'Guardrail', 'Guardrail+Civil', 'Class 1 Estimate']
  const regions = ['All', 'NA-W', 'NA-E', 'EMEA', 'APAC']
  const stages = ['All', ...new Set(bundles.map(b => b.currentStage))]

  const filtered = React.useMemo(() => {
    return bundles.filter(b => {
      if (categoryFilter !== 'All' && b.category !== categoryFilter) return false
      if (regionFilter !== 'All' && b.region !== regionFilter) return false
      if (stageFilter !== 'All' && b.currentStage !== stageFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!b.id.toLowerCase().includes(q) && !b.projects.toLowerCase().includes(q) && !b.owner.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [categoryFilter, regionFilter, stageFilter, search])

  const totalFunding = fundingBreakdown.reduce((sum, f) => sum + f.value, 0)

  return (
    <AppShell title="Termsheet Bundle Status">
      <div className="min-h-screen">
        {/* Header Band */}
        <div className="bg-card border border-border rounded-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link 
                    href="/reports" 
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Back to Reports"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
                  <h1 className="text-sm sm:text-base font-semibold text-foreground">
                    Termsheet Bundle Status Report
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground max-w-2xl ml-10">
                  End-to-end termsheet pipeline from LineSight issuance through Anu approval and Cap Planning · 23 bundles in flight
                </p>
                <div className="ml-10 mt-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gold text-navy text-[10px] font-mono uppercase tracking-wider">
                    <FileText className="w-3 h-3" />
                    Termsheet Bundle Status · Cycle May 2026
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button 
                  onClick={() => exportToPDF({ filename: 'termsheet-bundle-status-may-2026', title: 'Termsheet Bundle Status Report' })}
                  className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-lg bg-gold text-navy hover:bg-gold-soft transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
                <button 
                  onClick={() => toast.info('Schedule feature coming soon')}
                  className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-lg bg-navy/10 dark:bg-white/10 text-navy dark:text-foreground hover:bg-navy/20 dark:hover:bg-white/20 transition-colors border border-navy/30 dark:border-white/30"
                >
                  <Calendar className="w-3.5 h-3.5" /> Schedule
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* KPI Strip */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              {[
                { label: 'Bundles In Flight', value: '23', status: 'neutral' },
                { label: 'Awaiting Brian Review', value: '6', status: 'amber' },
                { label: 'Awaiting Anu Final', value: '3', status: 'amber' },
                { label: 'Approved This Cycle', value: '12', status: 'green' },
                { label: 'Avg Pipeline Days', value: '22d', status: 'green', sub: 'Target: 25d' },
              ].map((kpi, i) => (
                <div
                  key={i}
                  className={cn(
                    'bg-card border rounded-xl p-4 shadow-sm',
                    kpi.status === 'green' && 'border-l-4 border-l-emerald-500 border-t-line border-r-line border-b-line',
                    kpi.status === 'amber' && 'border-l-4 border-l-amber-500 border-t-line border-r-line border-b-line',
                    kpi.status === 'neutral' && 'border-line'
                  )}
                >
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{kpi.value}</div>
                  {kpi.sub && <div className="text-[10px] text-muted-foreground mt-1">{kpi.sub}</div>}
                </div>
              ))}
            </motion.div>

            {/* Pipeline Funnel */}
            <motion.div
              className="bg-card border border-line rounded-xl p-4 sm:p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
            >
              <h2 className="text-sm font-semibold text-foreground mb-4">Pipeline Funnel</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="flex items-center gap-1 min-w-[900px]">
                  {pipelineStages.map((stage, i) => {
                    const isLast = i === pipelineStages.length - 1
                    const ratio = stage.count / 23
                    const bgColor = ratio >= 0.8 ? 'bg-emerald-500' : ratio >= 0.5 ? 'bg-gold' : 'bg-amber-500'
                    
                    return (
                      <React.Fragment key={stage.name}>
                        <div className="flex flex-col items-center min-w-[60px]">
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white',
                            bgColor
                          )}>
                            {stage.count}
                          </div>
                          <div className="text-[8px] text-muted-foreground text-center mt-1.5 leading-tight max-w-[70px]">
                            {stage.name}
                          </div>
                          {stage.target > 0 && (
                            <div className="text-[7px] text-muted-foreground/70 mt-0.5">{stage.target}d</div>
                          )}
                        </div>
                        {!isLast && (
                          <ArrowRight className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-line text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> On track (≥80%)</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gold" /> Moderate (50-80%)</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Attention ({'<'}50%)</span>
              </div>
            </motion.div>

            {/* Filters & Table */}
            <motion.div
              className="bg-card border border-line rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
            >
              {/* Filters */}
              <div className="p-4 border-b border-line">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as BundleCategory | 'All')}
                      className="h-8 px-2 text-xs bg-secondary border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                    >
                      {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                    </select>
                    <select
                      value={regionFilter}
                      onChange={(e) => setRegionFilter(e.target.value)}
                      className="h-8 px-2 text-xs bg-secondary border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                    >
                      {regions.map(r => <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>)}
                    </select>
                    <select
                      value={stageFilter}
                      onChange={(e) => setStageFilter(e.target.value)}
                      className="h-8 px-2 text-xs bg-secondary border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                    >
                      {stages.map(s => <option key={s} value={s}>{s === 'All' ? 'All Stages' : s}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search bundles..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-8 pl-8 pr-3 w-full sm:w-56 text-xs bg-secondary border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-line">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bundle ID</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Projects</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Region</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Current Stage</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell">Days in Stage</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell">Pipeline Days</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Owner</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filtered.map((bundle) => {
                      const statusCfg = statusConfig[bundle.status]
                      const StatusIcon = statusCfg.icon
                      return (
                        <tr
                          key={bundle.id}
                          className={cn(
                            'hover:bg-secondary/30 transition-colors',
                            bundle.status === 'Red' && 'bg-red-500/5'
                          )}
                        >
                          <td className="px-4 py-3 font-mono font-medium text-foreground">{bundle.id}</td>
                          <td className="px-4 py-3">
                            <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium border', categoryColors[bundle.category])}>
                              {bundle.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell max-w-[180px] truncate">{bundle.projects}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-secondary text-[10px] font-medium">{bundle.region}</span>
                          </td>
                          <td className="px-4 py-3 text-foreground">{bundle.currentStage}</td>
                          <td className="px-4 py-3 text-right font-mono hidden sm:table-cell">{bundle.daysInStage}d</td>
                          <td className={cn(
                            'px-4 py-3 text-right font-mono hidden sm:table-cell',
                            bundle.daysInPipeline > 25 && 'text-red-500 font-semibold'
                          )}>
                            {bundle.daysInPipeline}d
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{bundle.owner}</td>
                          <td className="px-4 py-3">
                            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium', statusCfg.bg, statusCfg.text)}>
                              <StatusIcon className="w-3 h-3" />
                              <span className="hidden sm:inline">{bundle.status}</span>
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-line bg-secondary/30 text-[10px] text-muted-foreground">
                Showing {filtered.length} of {bundles.length} bundles
              </div>
            </motion.div>

            {/* Two Column: Calendar & Funding Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Review Calendar */}
              <motion.div
                className="lg:col-span-2 bg-card border border-line rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease }}
              >
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    <h2 className="text-sm font-semibold text-foreground">Review Calendar — May/Jun 2026 Cycle</h2>
                  </div>
                  {showCalendar ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </button>
                {showCalendar && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2">
                      {calendarEvents.map((event, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border-l-4',
                            eventTypeColors[event.type]
                          )}
                        >
                          <div className="text-[10px] font-mono text-muted-foreground min-w-[80px]">{event.date}</div>
                          <div className="text-xs font-medium">{event.event}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Funding Breakdown */}
              <motion.div
                className="bg-card border border-line rounded-xl p-4 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease }}
              >
                <h2 className="text-sm font-semibold text-foreground mb-4">Funding Status Breakdown</h2>
                
                {/* Simple Donut Visualization */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {(() => {
                        let cumulative = 0
                        return fundingBreakdown.map((item, i) => {
                          const percent = (item.value / totalFunding) * 100
                          const strokeDasharray = `${percent} ${100 - percent}`
                          const strokeDashoffset = -cumulative
                          cumulative += percent
                          const colorClass = item.color.replace('bg-', 'stroke-')
                          return (
                            <circle
                              key={i}
                              cx="18"
                              cy="18"
                              r="15.5"
                              fill="none"
                              strokeWidth="3"
                              className={colorClass}
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              pathLength="100"
                            />
                          )
                        })
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-xl font-bold text-foreground">{totalFunding}</div>
                      <div className="text-[9px] text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {fundingBreakdown.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2.5 h-2.5 rounded-sm', item.color)} />
                        <span className="text-muted-foreground truncate max-w-[140px]">{item.label}</span>
                      </div>
                      <span className="font-mono font-medium text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Cycle Comparison Trend */}
            <motion.div
              className="bg-card border border-line rounded-xl p-4 sm:p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease }}
            >
              <h2 className="text-sm font-semibold text-foreground mb-4">Cycle Comparison — Last 6 Cycles</h2>
              <div className="flex items-end gap-2 sm:gap-4 h-40">
                {cycleData.map((cycle, i) => {
                  const maxBundles = Math.max(...cycleData.map(c => c.bundles))
                  const height = (cycle.bundles / maxBundles) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-[10px] font-mono text-muted-foreground">{cycle.avgDays}d avg</div>
                      <div className="w-full flex flex-col items-center">
                        <div
                          className={cn(
                            'w-full max-w-[40px] rounded-t-lg transition-all',
                            cycle.note ? 'bg-amber-500/70' : 'bg-gold'
                          )}
                          style={{ height: `${height}%`, minHeight: '20px' }}
                        />
                      </div>
                      <div className="text-[10px] font-medium text-foreground">{cycle.bundles}</div>
                      <div className="text-[9px] text-muted-foreground text-center">{cycle.cycle.split(' ')[0]}</div>
                      {cycle.note && (
                        <div className="absolute -top-6 text-[8px] text-amber-600 dark:text-amber-400">{cycle.note}</div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-line text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gold" /> Normal cycle</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500/70" /> Holiday-shifted</span>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="text-[10px] text-muted-foreground border-t border-line pt-4 mt-6">
              <p>
                Source: NEW_YAWN Bundle Tracker, Seed TS Calendar 25-26, Monthly Termsheet Kick Off Tracker via odc_semantic.termsheet_pipeline. 
                Bundle categories preserved from operational vocabulary.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
