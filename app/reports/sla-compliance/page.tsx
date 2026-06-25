'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { exportToPDF } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Bot,
  Download,
  Calendar,
  TrendingDown,
  TrendingUp,
  Minus,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Zap,
  Mail,
  UserCheck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'

// Animation variants
const ease = [0.22, 1, 0.36, 1]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
}

// ============================================================
// Mock Data
// ============================================================

const processData = [
  { id: 'P1', process: 'PO Workflow Initiation (LS)', active: 14, onTrack: 11, pastSLA: 2, severe: 1, target: '14d', avgDuration: '11d', trend: 'improving' as const },
  { id: 'P2', process: 'PO Funding Approval (Finance)', active: 22, onTrack: 14, pastSLA: 6, severe: 2, target: '21d', avgDuration: '19d', trend: 'flat' as const },
  { id: 'P3', process: 'Termsheet Review (PgM)', active: 18, onTrack: 16, pastSLA: 2, severe: 0, target: '5d', avgDuration: '4d', trend: 'improving' as const },
  { id: 'P4', process: 'Termsheet Review (Brian)', active: 6, onTrack: 4, pastSLA: 2, severe: 0, target: '7d', avgDuration: '6d', trend: 'flat' as const },
  { id: 'P5', process: 'Termsheet Review (Anu Final)', active: 3, onTrack: 2, pastSLA: 1, severe: 0, target: '5d', avgDuration: '5d', trend: 'flat' as const },
  { id: 'P6', process: 'Change Order Approval', active: 12, onTrack: 9, pastSLA: 2, severe: 1, target: '10d', avgDuration: '11d', trend: 'worsening' as const },
  { id: 'P7', process: 'Legal Review (Construction)', active: 8, onTrack: 1, pastSLA: 3, severe: 4, target: '30d', avgDuration: '74d', trend: 'worsening' as const, isSevere: true },
  { id: 'P8', process: 'RFI Lifecycle', active: 89, onTrack: 78, pastSLA: 8, severe: 3, target: '7d', avgDuration: '6d', trend: 'improving' as const },
  { id: 'P9', process: 'Contractor Onboarding', active: 14, onTrack: 12, pastSLA: 2, severe: 0, target: '21d', avgDuration: '18d', trend: 'improving' as const },
  { id: 'P10', process: 'Milestone Gate Review', active: 31, onTrack: 28, pastSLA: 2, severe: 1, target: '5d', avgDuration: '4d', trend: 'improving' as const },
  { id: 'P11', process: 'Field Condition PCO', active: 30, onTrack: 23, pastSLA: 1, severe: 6, target: '14d', avgDuration: '19d', trend: 'worsening' as const },
]

const pastSLADetails = [
  { id: 'D1', process: 'Legal Review', project: 'ARA-Hub1-1&2', owner: 'Legal team', stage: 'Internal Legal Review', timePast: '18d', lastActivity: 'May 12: redlines requested', autoAction: true, actionText: 'Escalated to GC Counsel' },
  { id: 'D2', process: 'Legal Review', project: 'STB-Hub1-1', owner: 'Legal team', stage: 'Hyperterm submission', timePast: '12d', lastActivity: 'May 8: docs returned', autoAction: true, actionText: 'Escalated to Legal Lead' },
  { id: 'D3', process: 'Field Condition PCO', project: 'WEN-Hub2-1', owner: 'Marcus', stage: 'Pending PgM review', timePast: '7d', lastActivity: 'May 11: PCO submitted', autoAction: false, actionText: 'Notification sent' },
  { id: 'D4', process: 'PO Funding Approval', project: 'EBP-Hub1-1', owner: 'Finance (AR)', stage: 'AR Final Approval', timePast: '6d', lastActivity: 'May 12: approver assigned', autoAction: true, actionText: 'SLA Sentinel alert' },
  { id: 'D5', process: 'Change Order Approval', project: 'ADC-Hub1-3', owner: 'Lauren Culp', stage: 'PgM signoff', timePast: '4d', lastActivity: 'May 14: CO submitted', autoAction: false, actionText: 'Notification sent' },
  { id: 'D6', process: 'PO Workflow Initiation', project: 'NCH-Hub1-1', owner: 'LS Team', stage: 'Initial review', timePast: '3d', lastActivity: 'May 15: assigned', autoAction: true, actionText: 'Reminder sent' },
  { id: 'D7', process: 'RFI Lifecycle', project: 'HDL-Hub1-2', owner: 'Field team', stage: 'Awaiting response', timePast: '2d', lastActivity: 'May 16: follow-up', autoAction: false, actionText: 'Pending' },
  { id: 'D8', process: 'Milestone Gate Review', project: 'CHB-Hub1-1', owner: 'Sophia Lamb', stage: 'Gate 3 review', timePast: '2d', lastActivity: 'May 15: docs uploaded', autoAction: true, actionText: 'Escalated to PM' },
]

// 13-week trend data
const trendData = [
  { week: 'Feb 24', onTrack: 185, pastSLA: 28, severe: 12 },
  { week: 'Mar 3', onTrack: 190, pastSLA: 25, severe: 10 },
  { week: 'Mar 10', onTrack: 188, pastSLA: 30, severe: 14 },
  { week: 'Mar 17', onTrack: 192, pastSLA: 26, severe: 11 },
  { week: 'Mar 24', onTrack: 195, pastSLA: 24, severe: 9 },
  { week: 'Mar 31', onTrack: 189, pastSLA: 32, severe: 15 },
  { week: 'Apr 7', onTrack: 194, pastSLA: 27, severe: 10 },
  { week: 'Apr 14', onTrack: 196, pastSLA: 25, severe: 8 },
  { week: 'Apr 21', onTrack: 193, pastSLA: 29, severe: 12 },
  { week: 'Apr 28', onTrack: 195, pastSLA: 28, severe: 11 },
  { week: 'May 6', onTrack: 197, pastSLA: 30, severe: 16, annotation: 'SLA Sentinel agent activated' },
  { week: 'May 13', onTrack: 196, pastSLA: 32, severe: 19 },
  { week: 'May 17', onTrack: 198, pastSLA: 31, severe: 18 },
]

// ============================================================
// Component
// ============================================================

export default function SLAComplianceReportPage() {
  const [expandedProcess, setExpandedProcess] = React.useState<string | null>(null)
  const [detailPage, setDetailPage] = React.useState(1)
  const itemsPerPage = 5

  const paginatedDetails = pastSLADetails.slice((detailPage - 1) * itemsPerPage, detailPage * itemsPerPage)
  const totalDetailPages = Math.ceil(pastSLADetails.length / itemsPerPage)

  const trendIcon = (trend: 'improving' | 'flat' | 'worsening') => {
    if (trend === 'improving') return <TrendingDown className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
    if (trend === 'worsening') return <TrendingUp className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />
  }

  // Calculate max for trend chart
  const maxTrendTotal = Math.max(...trendData.map(d => d.onTrack + d.pastSLA + d.severe))

  return (
    <AppShell title="SLA Compliance">
      <motion.div 
        className="space-y-6 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* ─── Header Band ─── */}
        <motion.div 
          variants={itemVariants}
          className="bg-card rounded-xl p-6 md:p-8 border border-border overflow-hidden relative"
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
          
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
                <h1 className="text-sm md:text-base font-semibold tracking-tight text-foreground">SLA Compliance Report</h1>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl ml-10">
                Service-level performance across orchestration instances · 11 process types monitored
              </p>
              <div className="ml-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gold text-navy text-[10px] font-mono uppercase tracking-wider">
                  SLA Compliance · Week Ending May 17, 2026
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <motion.button 
                onClick={() => exportToPDF({ filename: 'sla-compliance-may-2026', title: 'SLA Compliance Report' })}
                className="h-9 px-4 inline-flex items-center gap-2 text-xs font-medium rounded-lg bg-gold text-navy hover:bg-gold-soft transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" /> Export PDF
              </motion.button>
              <motion.button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-9 px-4 inline-flex items-center gap-2 text-xs font-medium rounded-lg bg-secondary text-foreground border border-line hover:bg-secondary/80 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-4 h-4" /> Schedule
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ─── KPI Strip ─── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Active SLAs This Week', value: '247', icon: Clock, color: 'from-slate-500/20 to-slate-500/5', borderColor: 'border-l-slate-400/60', iconBg: 'bg-slate-500/10', iconColor: 'text-slate-500' },
            { label: 'Within Target', value: '198', sub: '80%', icon: CheckCircle2, color: 'from-emerald-500/20 to-emerald-500/5', borderColor: 'border-l-emerald-400/60', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
            { label: 'Past SLA', value: '31', sub: '13%', icon: AlertTriangle, color: 'from-amber-500/20 to-amber-500/5', borderColor: 'border-l-amber-400/60', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500' },
            { label: 'Severe (>24h past)', value: '18', sub: '7%', icon: AlertCircle, color: 'from-red-500/20 to-red-500/5', borderColor: 'border-l-red-400/60', iconBg: 'bg-red-500/10', iconColor: 'text-red-500' },
            { label: 'Auto-resolved by Agents', value: '47', sub: 'this week', icon: Bot, color: 'from-teal-500/20 to-teal-500/5', borderColor: 'border-l-teal-400/60', iconBg: 'bg-teal-500/10', iconColor: 'text-teal-500' },
          ].map((kpi, i) => (
            <motion.div 
              key={i} 
              className={cn('bg-card border border-line rounded-xl p-4 border-l-4 relative overflow-hidden group cursor-pointer', kpi.borderColor)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease }}
              whileHover={{ y: -2, boxShadow: '0 8px 30px -12px rgba(0,0,0,0.15)' }}
            >
              {/* Gradient background */}
              <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300', kpi.color)} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', kpi.iconBg)}>
                    <kpi.icon className={cn('w-4 h-4', kpi.iconColor)} />
                  </div>
                </div>
                <motion.div 
                  className="text-2xl font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                >
                  {kpi.value}
                </motion.div>
                {kpi.sub && <div className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</div>}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Process-Level SLA Table ─── */}
        <motion.div variants={itemVariants} className="bg-card border border-line rounded-xl overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-line bg-gradient-to-r from-secondary/30 to-transparent">
            <h2 className="text-base font-semibold text-foreground">Process-Level SLA Performance</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Click any row to view active instances</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/50 dark:bg-secondary/30 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Process Type</th>
                  <th className="px-3 py-3 font-medium text-center hidden sm:table-cell">Active</th>
                  <th className="px-3 py-3 font-medium text-center">On Track</th>
                  <th className="px-3 py-3 font-medium text-center">Past SLA</th>
                  <th className="px-3 py-3 font-medium text-center">Severe</th>
                  <th className="px-3 py-3 font-medium text-center hidden md:table-cell">Target</th>
                  <th className="px-3 py-3 font-medium text-center hidden md:table-cell">Avg Duration</th>
                  <th className="px-3 py-3 font-medium text-center hidden lg:table-cell">Trend (7d)</th>
                  <th className="px-3 py-3 font-medium w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {processData.map((row) => {
                  const isExpanded = expandedProcess === row.id
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        onClick={() => setExpandedProcess(isExpanded ? null : row.id)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          row.isSevere ? 'bg-red-50/50 dark:bg-red-950/20' : 'hover:bg-secondary/30 dark:hover:bg-secondary/20',
                          isExpanded && 'bg-gold/5 dark:bg-gold/10'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{row.process}</div>
                          <div className="text-[10px] text-muted-foreground sm:hidden mt-0.5">
                            {row.active} active · Target: {row.target}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center hidden sm:table-cell text-foreground">{row.active}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="text-green-600 dark:text-green-400 font-medium">{row.onTrack}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn(row.pastSLA > 0 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-muted-foreground')}>
                            {row.pastSLA}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn(row.severe > 0 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-muted-foreground')}>
                            {row.severe}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center hidden md:table-cell text-muted-foreground">{row.target}</td>
                        <td className="px-3 py-3 text-center hidden md:table-cell">
                          <span className={cn(
                            'font-medium',
                            parseInt(row.avgDuration) > parseInt(row.target) ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                          )}>
                            {row.avgDuration}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center hidden lg:table-cell">
                          <div className="inline-flex items-center gap-1">
                            {trendIcon(row.trend)}
                            <span className={cn(
                              'text-[10px] capitalize',
                              row.trend === 'improving' && 'text-green-600 dark:text-green-400',
                              row.trend === 'worsening' && 'text-red-600 dark:text-red-400',
                              row.trend === 'flat' && 'text-muted-foreground'
                            )}>
                              {row.trend}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="bg-secondary/20 dark:bg-secondary/10 px-4 py-4">
                            <div className="text-xs text-muted-foreground">
                              Showing active instances for <span className="font-medium text-foreground">{row.process}</span>
                            </div>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-card border border-line rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">PRJ-Hub{n}-{row.id.slice(1)}</span>
                                    <span className={cn(
                                      'text-[10px] px-2 py-0.5 rounded-full',
                                      n === 1 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                      n === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    )}>
                                      {n === 1 ? 'On Track' : n === 2 ? '2d past' : '5d past'}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-muted-foreground mt-1">
                                    Owner: Team Member {n} · Stage: Step {n}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ─── Past SLA Detail Table ─── */}
        <motion.div variants={itemVariants} className="bg-card border border-line rounded-xl overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-line bg-gradient-to-r from-amber-500/5 to-transparent">
            <h2 className="text-base font-semibold text-foreground">Past SLA Detail</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pastSLADetails.length} instances currently past their service-level target
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/50 dark:bg-secondary/30 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Process</th>
                  <th className="px-3 py-3 font-medium">Project</th>
                  <th className="px-3 py-3 font-medium hidden sm:table-cell">Owner</th>
                  <th className="px-3 py-3 font-medium hidden md:table-cell">Stage</th>
                  <th className="px-3 py-3 font-medium text-center">Time Past</th>
                  <th className="px-3 py-3 font-medium hidden lg:table-cell">Last Activity</th>
                  <th className="px-3 py-3 font-medium">Auto-action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {paginatedDetails.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/30 dark:hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{row.process}</td>
                    <td className="px-3 py-3">
                      <a href="/projects" className="text-foreground hover:text-gold transition-colors">
                        {row.project}
                      </a>
                      <div className="text-[10px] text-muted-foreground sm:hidden">{row.owner}</div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell text-muted-foreground">{row.owner}</td>
                    <td className="px-3 py-3 hidden md:table-cell text-muted-foreground">{row.stage}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={cn(
                        'font-medium',
                        parseInt(row.timePast) >= 7 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                      )}>
                        {row.timePast}
                      </span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground">{row.lastActivity}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        {row.autoAction ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 text-[10px]">
                            <Bot className="w-3 h-3" /> Yes
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Pending</span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{row.actionText}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-line flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Page {detailPage} of {totalDetailPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDetailPage(p => Math.max(1, p - 1))}
                disabled={detailPage === 1}
                className="h-7 px-3 text-xs border border-line rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setDetailPage(p => Math.min(totalDetailPages, p + 1))}
                disabled={detailPage === totalDetailPages}
                className="h-7 px-3 text-xs border border-line rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>

        {/* ─── Agent Interventions Panel ─── */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-teal-500/5 via-card to-card border border-teal-500/20 rounded-xl p-4 md:p-6 relative overflow-hidden"
        >
          {/* Animated background pulse */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center border border-teal-500/20"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-6 h-6 text-teal-500" />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">SLA Sentinel Agent Interventions</h3>
                <p className="text-xs text-muted-foreground">
                  <motion.span 
                    className="font-semibold text-teal-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    47 SLA events
                  </motion.span> handled automatically this week
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Mail, label: 'Auto-escalations', value: 31, sub: 'Slack + Email notifications', color: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-blue-500', borderColor: 'border-blue-500/20' },
                { icon: UserCheck, label: 'Auto-reassignments', value: 9, sub: 'Proposed reassignments', color: 'from-violet-500/10 to-violet-600/5', iconColor: 'text-violet-500', borderColor: 'border-violet-500/20' },
                { icon: Zap, label: 'Auto-resolutions', value: 7, sub: 'Completed under agent guidance', color: 'from-amber-500/10 to-amber-600/5', iconColor: 'text-amber-500', borderColor: 'border-amber-500/20' },
              ].map((item, i) => (
                <motion.a 
                  key={i}
                  href="/reports/agent-activity" 
                  className={cn(
                    'group bg-gradient-to-br rounded-xl p-4 border transition-all duration-300',
                    item.color,
                    item.borderColor
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease }}
                  whileHover={{ y: -4, boxShadow: '0 12px 40px -12px rgba(0,0,0,0.2)' }}
                >
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <div className={cn('w-8 h-8 rounded-lg bg-white/50 dark:bg-white/10 flex items-center justify-center')}>
                      <item.icon className={cn('w-4 h-4', item.iconColor)} />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-medium">{item.label}</span>
                  </div>
                  <motion.div 
                    className="text-2xl font-bold text-foreground group-hover:text-gold transition-colors"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {item.value}
                  </motion.div>
                  <div className="text-[10px] text-muted-foreground mt-1">{item.sub}</div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── 13-Week Trend Chart ─── */}
        <motion.div 
          variants={itemVariants}
          className="bg-card border border-line rounded-xl p-4 md:p-6 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">13-Week SLA Trend</h3>
              <p className="text-xs text-muted-foreground">On Track / Past SLA / Severe distribution</p>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-300/50" /> On Track
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-300/50" /> Past SLA
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-300/50" /> Severe
              </span>
            </div>
          </div>

          <div className="h-56 flex items-end gap-1.5 px-2">
            {trendData.map((week, i) => {
              const total = week.onTrack + week.pastSLA + week.severe
              const heightPct = (total / maxTrendTotal) * 100
              const onTrackPct = (week.onTrack / total) * 100
              const pastPct = (week.pastSLA / total) * 100
              const severePct = (week.severe / total) * 100
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <motion.div 
                    className="w-full rounded-lg overflow-hidden flex flex-col-reverse shadow-sm"
                    style={{ height: `${heightPct}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.6, delay: 0.8 + i * 0.05, ease }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="bg-emerald-300/50 dark:bg-emerald-400/40" 
                      style={{ height: `${onTrackPct}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${onTrackPct}%` }}
                      transition={{ duration: 0.5, delay: 1 + i * 0.05 }}
                    />
                    <motion.div 
                      className="bg-amber-300/50 dark:bg-amber-400/40" 
                      style={{ height: `${pastPct}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${pastPct}%` }}
                      transition={{ duration: 0.5, delay: 1.1 + i * 0.05 }}
                    />
                    <motion.div 
                      className="bg-rose-300/50 dark:bg-rose-400/40" 
                      style={{ height: `${severePct}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${severePct}%` }}
                      transition={{ duration: 0.5, delay: 1.2 + i * 0.05 }}
                    />
                  </motion.div>
                  <span className="text-[9px] text-muted-foreground hidden sm:block font-mono">{week.week.split(' ')[1]}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-foreground text-background text-[10px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                      <div className="font-semibold mb-1">{week.week}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-emerald-300/60" />
                        On Track: {week.onTrack}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-amber-300/60" />
                        Past SLA: {week.pastSLA}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-rose-300/60" />
                        Severe: {week.severe}
                      </div>
                    </div>
                  </div>
                  
                  {/* Annotation marker */}
                  {week.annotation && (
                    <motion.div 
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
                    >
                      <span className="w-3 h-3 rounded-full bg-gold block shadow-lg ring-2 ring-gold/30" />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Annotation callout */}
          <motion.div 
            className="mt-5 flex items-center gap-2 text-xs text-muted-foreground bg-gold/5 rounded-lg px-3 py-2 border border-gold/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.4 }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            <span>May 6: SLA Sentinel agent activated for PO Workflow Initiation</span>
          </motion.div>
        </motion.div>

        {/* ─── Remediation Context ─── */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-navy/5 via-card to-card dark:from-navy-soft/10 border border-navy/10 dark:border-navy-soft/20 rounded-xl p-4 md:p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 dark:bg-navy-soft/10 rounded-full blur-2xl" />
          
          <div className="relative flex items-start gap-4">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-navy/10 dark:bg-navy-soft/20 flex items-center justify-center flex-shrink-0"
              whileHover={{ rotate: 5 }}
            >
              <ExternalLink className="w-5 h-5 text-navy dark:text-white/70" />
            </motion.div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Remediation Context</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Internal remediation goals from operational trackers: &quot;Aim to establish SLAs&quot; and 
                &quot;Aim to reduce by setting up automation.&quot; This report and the SLA Sentinel agent 
                are the direct implementation of those stated goals.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── Footer ─── */}
        <motion.div 
          variants={itemVariants}
          className="text-center text-[10px] text-muted-foreground py-4 border-t border-line"
        >
          Source: Orchestration engine SLA scheduler (15-min check interval) · odc_semantic.sla_lifecycle. All actions audit-logged.
        </motion.div>

      </motion.div>
    </AppShell>
  )
}
