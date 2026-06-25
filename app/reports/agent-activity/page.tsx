'use client'

import * as React from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import { exportToPDF } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Download,
  Calendar,
  Bot,
  TrendingUp,
  Clock,
  DollarSign,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Activity,
  Target,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'

// Animated Counter Component
function AnimatedCounter({ value, duration = 2, prefix = '', suffix = '', decimals = 0 }: { value: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (current) => {
    if (decimals > 0) {
      return `${prefix}${current.toFixed(decimals)}${suffix}`
    }
    return `${prefix}${Math.round(current).toLocaleString()}${suffix}`
  })

  React.useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  return <motion.span ref={ref}>{display}</motion.span>
}

// Animated Currency Component
function AnimatedCurrency({ value, duration = 2 }: { value: number; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (current) => {
    const n = Math.round(current)
    if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`
    if (n >= 1000) return `$${Math.round(n / 1000)}K`
    return `$${n}`
  })

  React.useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  return <motion.span ref={ref}>{display}</motion.span>
}

const agents = [
  { id: 'A-201', name: 'PO Cycle Watchdog', tier: 'Process', status: 'Active', events30d: 847, interventions30d: 124, autoResolved: 89, escalated: 35, avgResponseTime: '4.2min', estimatedSavings: 186000, hoursReclaimed: 312, accuracy: 94.2, lastActive: '2 min ago' },
  { id: 'A-202', name: 'BDP Reconciler', tier: 'Process', status: 'Active', events30d: 412, interventions30d: 67, autoResolved: 51, escalated: 16, avgResponseTime: '8.1min', estimatedSavings: 94000, hoursReclaimed: 156, accuracy: 91.8, lastActive: '14 min ago' },
  { id: 'A-203', name: 'SLA Sentinel', tier: 'Process', status: 'Active', events30d: 1247, interventions30d: 198, autoResolved: 147, escalated: 51, avgResponseTime: '2.8min', estimatedSavings: 224000, hoursReclaimed: 428, accuracy: 96.1, lastActive: '1 min ago' },
  { id: 'A-204', name: 'Variance Explainer', tier: 'Portfolio', status: 'Active', events30d: 247, interventions30d: 89, autoResolved: 38, escalated: 51, avgResponseTime: '12.4min', estimatedSavings: 156000, hoursReclaimed: 267, accuracy: 88.7, lastActive: '8 min ago' },
  { id: 'A-205', name: 'Risk Horizon Scanner', tier: 'Portfolio', status: 'Active', events30d: 89, interventions30d: 34, autoResolved: 12, escalated: 22, avgResponseTime: '18.6min', estimatedSavings: 78000, hoursReclaimed: 134, accuracy: 85.4, lastActive: '23 min ago' },
  { id: 'A-206', name: 'Invoice Matcher', tier: 'Task', status: 'Active', events30d: 2341, interventions30d: 412, autoResolved: 389, escalated: 23, avgResponseTime: '1.2min', estimatedSavings: 312000, hoursReclaimed: 523, accuracy: 97.8, lastActive: '< 1 min ago' },
  { id: 'A-207', name: 'Document Classifier', tier: 'Task', status: 'Active', events30d: 1847, interventions30d: 287, autoResolved: 274, escalated: 13, avgResponseTime: '0.8min', estimatedSavings: 198000, hoursReclaimed: 334, accuracy: 98.2, lastActive: '< 1 min ago' },
  { id: 'A-208', name: 'Milestone Forecaster', tier: 'Portfolio', status: 'Paused', events30d: 0, interventions30d: 0, autoResolved: 0, escalated: 0, avgResponseTime: '-', estimatedSavings: 0, hoursReclaimed: 0, accuracy: 82.1, lastActive: 'Paused May 12' },
]

const roiSummary = { totalSavings: 1248000, hoursReclaimed: 2154, interventions: 1211, autoResolutionRate: 82.4, avgAccuracy: 93.6, costPerIntervention: 12.40, humanEquivalentFTE: 1.08 }
const weeklyTrend = [
  { week: 'W14', events: 4821, interventions: 687, savings: 278000 },
  { week: 'W15', events: 5124, interventions: 724, savings: 294000 },
  { week: 'W16', events: 4987, interventions: 698, savings: 286000 },
  { week: 'W17', events: 5341, interventions: 812, savings: 312000 },
  { week: 'W18', events: 5012, interventions: 756, savings: 298000 },
  { week: 'W19', events: 5247, interventions: 798, savings: 308000 },
]

const tierConfig: Record<string, { color: string; bg: string }> = {
  Task: { color: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-100 dark:bg-teal-900/40' },
  Process: { color: 'text-gold-700 dark:text-gold', bg: 'bg-gold/20 dark:bg-gold/10' },
  Portfolio: { color: 'text-navy dark:text-slate-200', bg: 'bg-navy/10 dark:bg-slate-700/40' },
}
const statusConfig: Record<string, { color: string; bg: string }> = {
  Active: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40' },
  Paused: { color: 'text-muted-foreground', bg: 'bg-secondary' },
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  }),
}

export default function AgentActivityPage() {
  const [expandedAgent, setExpandedAgent] = React.useState<string | null>(null)
  const [tierFilter, setTierFilter] = React.useState<'All' | 'Task' | 'Process' | 'Portfolio'>('All')
  const chartRef = React.useRef<HTMLDivElement>(null)
  const isChartInView = useInView(chartRef, { once: true, margin: '-100px' })

  const filtered = tierFilter === 'All' ? agents : agents.filter(a => a.tier === tierFilter)
  const totals = filtered.reduce((acc, a) => ({ events: acc.events + a.events30d, interventions: acc.interventions + a.interventions30d, autoResolved: acc.autoResolved + a.autoResolved, savings: acc.savings + a.estimatedSavings, hours: acc.hours + a.hoursReclaimed }), { events: 0, interventions: 0, autoResolved: 0, savings: 0, hours: 0 })

  const formatCurrency = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`

  return (
    <AppShell title="Agent Activity">
      <div className="space-y-6 w-full">
        {/* Header */}
        <motion.div 
          className="bg-card rounded-xl p-4 sm:p-6 border border-border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Link 
                href="/reports" 
                className="mt-0.5 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Back to Reports"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-1 h-5 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30"
                    initial={{ height: 0 }}
                    animate={{ height: 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                  <h1 className="text-sm sm:text-base font-semibold text-foreground">AI Agent Activity & ROI Report</h1>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-3">Performance metrics for {agents.length} deployed agents</p>
                <motion.div 
                  className="ml-3 mt-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-gold text-navy rounded-full">AI Agent Activity & ROI · May 2026</span>
                </motion.div>
              </div>
            </div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button 
                onClick={() => exportToPDF({ filename: 'agent-activity-may-2026', title: 'AI Agent Activity & ROI Report' })}
                className="h-8 px-3 text-xs font-medium bg-gold text-navy hover:bg-gold-soft rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
              <button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-8 px-3 text-xs font-medium bg-navy/10 dark:bg-white/10 text-navy dark:text-foreground border border-navy/30 dark:border-white/30 hover:bg-navy/20 dark:hover:bg-white/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* ROI Summary Cards */}
        <motion.div 
          className="bg-card border border-line rounded-xl p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div 
              className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </motion.div>
            <div>
              <h2 className="font-semibold text-foreground">Portfolio-Wide Agent ROI</h2>
              <p className="text-xs text-muted-foreground">30-day rolling performance</p>
            </div>
          </div>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants} className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40">
              <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Est. Savings
              </div>
              <div className="text-xl font-bold text-green-800 dark:text-green-300">
                <AnimatedCurrency value={roiSummary.totalSavings} duration={2.5} />
              </div>
            </motion.div>
            <motion.div variants={cardVariants} className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40">
              <div className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-400 mb-1">
                <Clock className="w-3.5 h-3.5" /> Hours Reclaimed
              </div>
              <div className="text-xl font-bold text-teal-800 dark:text-teal-300">
                <AnimatedCounter value={roiSummary.hoursReclaimed} duration={2} />
              </div>
            </motion.div>
            <motion.div variants={cardVariants} className="p-3 rounded-lg bg-gold/10 dark:bg-gold/5 border border-gold/30">
              <div className="flex items-center gap-1.5 text-xs text-gold-700 dark:text-gold mb-1">
                <Zap className="w-3.5 h-3.5" /> Interventions
              </div>
              <div className="text-xl font-bold text-gold-800 dark:text-gold">
                <AnimatedCounter value={roiSummary.interventions} duration={2} />
              </div>
            </motion.div>
            <motion.div variants={cardVariants} className="p-3 rounded-lg bg-secondary border border-line">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Resolved
              </div>
              <div className="text-xl font-bold text-foreground">
                <AnimatedCounter value={roiSummary.autoResolutionRate} duration={2} decimals={1} suffix="%" />
              </div>
            </motion.div>
            <motion.div variants={cardVariants} className="p-3 rounded-lg bg-secondary border border-line">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Target className="w-3.5 h-3.5" /> Avg Accuracy
              </div>
              <div className="text-xl font-bold text-foreground">
                <AnimatedCounter value={roiSummary.avgAccuracy} duration={2} decimals={1} suffix="%" />
              </div>
            </motion.div>
            <motion.div variants={cardVariants} className="p-3 rounded-lg bg-secondary border border-line">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Activity className="w-3.5 h-3.5" /> Cost/Intervention
              </div>
              <div className="text-xl font-bold text-foreground">
                <AnimatedCounter value={roiSummary.costPerIntervention} duration={2} prefix="$" decimals={2} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Agent Fleet Table */}
        <motion.div 
          className="bg-card border border-line rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-4 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
              >
                <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </motion.div>
              <div>
                <h2 className="font-semibold text-foreground">Agent Fleet Performance</h2>
                <p className="text-xs text-muted-foreground">{filtered.length} agents · {totals.interventions.toLocaleString()} interventions</p>
              </div>
            </div>
            <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-lg border border-line">
              {(['All', 'Task', 'Process', 'Portfolio'] as const).map(tier => (
                <button key={tier} onClick={() => setTierFilter(tier)} className={cn('px-3 h-7 text-[11px] font-medium rounded-md transition-colors', tierFilter === tier ? 'bg-gold text-navy' : 'text-muted-foreground hover:text-foreground')}>{tier}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/50 border-b border-line text-left text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-3 py-3 font-medium hidden sm:table-cell">Tier</th>
                  <th className="px-3 py-3 font-medium hidden md:table-cell">Status</th>
                  <th className="px-3 py-3 font-medium text-right">Events</th>
                  <th className="px-3 py-3 font-medium text-right hidden sm:table-cell">Interventions</th>
                  <th className="px-3 py-3 font-medium text-right hidden lg:table-cell">Auto-Resolved</th>
                  <th className="px-3 py-3 font-medium text-right">Savings</th>
                  <th className="px-3 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((agent, index) => {
                  const isExpanded = expandedAgent === agent.id
                  const tCfg = tierConfig[agent.tier], sCfg = statusConfig[agent.status]
                  return (
                    <React.Fragment key={agent.id}>
                      <motion.tr 
                        onClick={() => setExpandedAgent(isExpanded ? null : agent.id)} 
                        className={cn('hover:bg-secondary/30 cursor-pointer transition-colors', agent.status === 'Paused' && 'opacity-60')}
                        custom={index}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ backgroundColor: 'rgba(var(--secondary), 0.4)' }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <motion.div 
                              className={cn('w-7 h-7 rounded-lg flex items-center justify-center', tCfg.bg)}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            >
                              <Bot className={cn('w-3.5 h-3.5', tCfg.color)} />
                            </motion.div>
                            <div>
                              <div className="font-medium text-foreground">{agent.name}</div>
                              <div className="text-[10px] text-muted-foreground font-mono">{agent.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell">
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', tCfg.bg, tCfg.color)}>{agent.tier}</span>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', sCfg.bg, sCfg.color)}>{agent.status}</span>
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-foreground">{agent.events30d.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right font-mono text-foreground hidden sm:table-cell">{agent.interventions30d.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right font-mono hidden lg:table-cell">
                          <span className="text-green-600 dark:text-green-400">{agent.autoResolved}</span>
                          <span className="text-muted-foreground"> / {agent.escalated}</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="font-mono font-medium text-green-700 dark:text-green-400">{formatCurrency(agent.estimatedSavings)}</span>
                        </td>
                        <td className="px-3 py-3">
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </td>
                      </motion.tr>
                      {isExpanded && (
                        <motion.tr 
                          className="bg-secondary/20"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan={8} className="px-4 py-4">
                            <motion.div 
                              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <div>
                                <div className="text-[10px] text-muted-foreground uppercase mb-1">Avg Response</div>
                                <div className="font-mono font-medium text-foreground">{agent.avgResponseTime}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-muted-foreground uppercase mb-1">Hours Reclaimed</div>
                                <div className="font-mono font-medium text-teal-600 dark:text-teal-400">{agent.hoursReclaimed}h</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-muted-foreground uppercase mb-1">Accuracy</div>
                                <div className="font-mono font-medium text-foreground">{agent.accuracy}%</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-muted-foreground uppercase mb-1">Last Active</div>
                                <div className="font-mono text-foreground">{agent.lastActive}</div>
                              </div>
                            </motion.div>
                          </td>
                        </motion.tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
              <tfoot>
                <motion.tr 
                  className="bg-secondary/50 border-t border-line font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <td className="px-4 py-3 text-foreground">Total</td>
                  <td className="hidden sm:table-cell"></td>
                  <td className="hidden md:table-cell"></td>
                  <td className="px-3 py-3 text-right font-mono text-foreground">
                    <AnimatedCounter value={totals.events} duration={1.5} />
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-foreground hidden sm:table-cell">
                    <AnimatedCounter value={totals.interventions} duration={1.5} />
                  </td>
                  <td className="px-3 py-3 text-right font-mono hidden lg:table-cell text-green-600 dark:text-green-400">
                    <AnimatedCounter value={totals.autoResolved} duration={1.5} />
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-medium text-green-700 dark:text-green-400">
                    <AnimatedCurrency value={totals.savings} duration={1.5} />
                  </td>
                  <td></td>
                </motion.tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        {/* 6-Week Activity Trend Chart */}
        <motion.div 
          className="bg-card border border-line rounded-xl p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.7 }}
            >
              <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </motion.div>
            <div>
              <h2 className="font-semibold text-foreground">6-Week Activity Trend</h2>
              <p className="text-xs text-muted-foreground">Events monitored and interventions taken</p>
            </div>
          </div>
          <div ref={chartRef} className="grid grid-cols-6 gap-2 sm:gap-4">
            {weeklyTrend.map((week, index) => {
              const maxEvents = Math.max(...weeklyTrend.map(w => w.events))
              const barHeight = (week.events / maxEvents) * 100
              const interventionHeight = (week.interventions / week.events) * 100
              return (
                <div key={week.week} className="text-center">
                  <div className="h-24 sm:h-32 flex items-end justify-center mb-2">
                    <motion.div 
                      className="w-full max-w-[40px] bg-teal-500/20 dark:bg-teal-500/30 rounded-t relative group cursor-pointer hover:bg-teal-500/30 transition-colors overflow-hidden"
                      initial={{ height: 0 }}
                      animate={isChartInView ? { height: `${barHeight}%` } : { height: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: index * 0.15,
                        ease: [0.34, 1.56, 0.64, 1] // Custom spring-like easing
                      }}
                    >
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 bg-teal-500 dark:bg-teal-400 rounded-t"
                        initial={{ height: 0 }}
                        animate={isChartInView ? { height: `${interventionHeight}%` } : { height: 0 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: index * 0.15 + 0.4,
                          ease: [0.34, 1.56, 0.64, 1]
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-foreground text-background text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        <div>{week.events.toLocaleString()} events</div>
                        <div>{week.interventions} interventions</div>
                        <div className="text-green-400">{formatCurrency(week.savings)} saved</div>
                      </div>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="text-xs font-mono text-muted-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isChartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {week.week}
                  </motion.div>
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <motion.div 
            className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-line"
            initial={{ opacity: 0 }}
            animate={isChartInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-teal-500/30 dark:bg-teal-500/30" />
              <span className="text-xs text-muted-foreground">Events Monitored</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-teal-500 dark:bg-teal-400" />
              <span className="text-xs text-muted-foreground">Interventions</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ROI Methodology */}
        <motion.div 
          className="bg-gold/10 dark:bg-gold/5 border border-gold/30 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-start gap-3">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.9 }}
            >
              <AlertTriangle className="w-5 h-5 text-gold mt-0.5" />
            </motion.div>
            <div>
              <h3 className="font-medium text-foreground mb-1">ROI Calculation Methodology</h3>
              <p className="text-sm text-muted-foreground">Savings estimates based on internal time studies. Task agents save avg 12 min/intervention, Process agents 28 min, Portfolio agents 45 min. Hourly rate: $85/hr blended.</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-[10px] text-muted-foreground font-mono border-t border-line pt-4 flex flex-wrap items-center justify-between gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>Generated: {new Date().toLocaleString()} · v2.4.1</span>
          <span>Distribution: AI Ops Team, Finance</span>
        </motion.div>
      </div>
    </AppShell>
  )
}
