'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import {
  Zap, ArrowLeft, AlertTriangle, Clock, CheckCircle2, MapPin,
  TrendingUp, ChevronRight, ExternalLink, Activity, Gauge, Power
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

const interconnectionQueue = [
  {
    id: 'UTL-001',
    project: 'Henderson Substation',
    region: 'NA-W',
    utility: 'NV Energy',
    capacity: '45 MW',
    status: 'pending',
    targetDate: 'Q3 2026',
    queuePosition: 12,
    waitTime: '22 months',
    notes: 'Transformer on order. Interconnection agreement signed.',
    recommendation: null,
  },
  {
    id: 'UTL-002',
    project: 'ARA-Hub1-1&2',
    region: 'NA-E',
    utility: 'Dominion Energy',
    capacity: '120 MW',
    status: 'in_progress',
    targetDate: 'Q4 2026',
    queuePosition: 8,
    waitTime: '18 months',
    notes: 'Feeder upgrades in progress. On schedule.',
    recommendation: null,
  },
  {
    id: 'UTL-003',
    project: 'STB-Hub1-1',
    region: 'EMEA',
    utility: 'EirGrid',
    capacity: '60 MW',
    status: 'at_risk',
    targetDate: 'TBD',
    queuePosition: 'N/A',
    waitTime: 'Moratorium',
    notes: 'Dublin grid moratorium in effect. Review Q3 2026.',
    recommendation: 'REC-2026-0560',
  },
  {
    id: 'UTL-004',
    project: 'GBL-Hub2-1',
    region: 'EMEA',
    utility: 'TenneT',
    capacity: '80 MW',
    status: 'approved',
    targetDate: 'Q2 2026',
    queuePosition: 3,
    waitTime: '6 months',
    notes: 'Grid connection approved. Energization on track.',
    recommendation: null,
  },
  {
    id: 'UTL-005',
    project: 'CHB-Hub1-2',
    region: 'APAC',
    utility: 'Tenaga Nasional',
    capacity: '55 MW',
    status: 'pending',
    targetDate: 'Q1 2027',
    queuePosition: 15,
    waitTime: '14 months',
    notes: 'Substation upgrade required. Utility planning in progress.',
    recommendation: null,
  },
]

const outageTracking = [
  { date: 'May 12, 2026', site: 'Mesa Power Upgrade', duration: '2h 15m', cause: 'Scheduled maintenance', impact: 'No critical path impact', status: 'resolved' },
  { date: 'May 8, 2026', site: 'Council Bluffs', duration: '45m', cause: 'Feeder fault', impact: 'Backup generator activated', status: 'resolved' },
  { date: 'May 3, 2026', site: 'Ashburn Pod 6', duration: '0m', cause: 'Voltage sag', impact: 'UPS absorbed; no interruption', status: 'resolved' },
]

const energyPricing = [
  { region: 'Northern Virginia', rate: '$0.072/kWh', trend: 'up', change: '+4.2%', source: 'Dominion Energy tariff' },
  { region: 'Dallas / Red Oak', rate: '$0.068/kWh', trend: 'down', change: '-1.8%', source: 'ERCOT wholesale + margin' },
  { region: 'Phoenix Metro', rate: '$0.059/kWh', trend: 'flat', change: '+0.3%', source: 'APS commercial rate' },
  { region: 'Dublin, Ireland', rate: '€0.145/kWh', trend: 'up', change: '+8.6%', source: 'ESB Networks tariff' },
  { region: 'Frankfurt', rate: '€0.118/kWh', trend: 'up', change: '+5.2%', source: 'TenneT grid charges' },
  { region: 'Singapore', rate: 'S$0.284/kWh', trend: 'flat', change: '+1.1%', source: 'SP Group tariff' },
]

const utilityAlerts = [
  {
    id: 'UA-001',
    title: 'Northern Virginia Transformer Queue: 14 active ODC requests',
    region: 'NA-E',
    severity: 'amber',
    detail: 'Average wait time now 22 months for >10 MVA transformers. Dominion Energy capacity study underway.',
    affectedProjects: ['ARA-Hub1-1&2', 'CLB-Hub1-3', 'ADC-Hub1-3', 'SGR-Hub1-1'],
    source: 'Dominion Energy Generation Interconnection Queue',
    recommendation: null,
  },
  {
    id: 'UA-002',
    title: 'Texas ERCOT Load Study Windows Tightening',
    region: 'NA-W',
    severity: 'amber',
    detail: 'ERCOT requiring additional load studies for >100 MW facilities. May extend timeline by 60-90 days.',
    affectedProjects: ['KAS-Hub1-1&2', 'KNC-Hub2-1&3'],
    source: 'ERCOT Planning Notices',
    recommendation: 'REC-2026-0595',
  },
  {
    id: 'UA-003',
    title: 'EirGrid Moratorium Extension',
    region: 'EMEA',
    severity: 'red',
    detail: 'Grid connection moratorium for Dublin data centers extended through Q3 2026. CRU review scheduled September.',
    affectedProjects: ['STB-Hub1-1', 'LPP-Hub1-1'],
    source: 'EirGrid Official Notice · CRU Ireland',
    recommendation: 'REC-2026-0560',
  },
  {
    id: 'UA-004',
    title: 'Malaysia TNB Tariff Revision',
    region: 'APAC',
    severity: 'green',
    detail: 'New incentive tariff for data centers effective Q3 2026. Potential 8-12% savings on power costs.',
    affectedProjects: ['CHB-Hub1-2', 'BSN-Hub1-1'],
    source: 'TNB Regulatory Filings',
    recommendation: null,
  },
]

const statusConfig = {
  pending: { label: 'Pending', color: 'amber', bg: 'bg-amber/10', icon: Clock },
  in_progress: { label: 'In Progress', color: 'sky', bg: 'bg-sky-500/10', icon: Activity },
  at_risk: { label: 'At Risk', color: 'red', bg: 'bg-red/10', icon: AlertTriangle },
  approved: { label: 'Approved', color: 'green', bg: 'bg-green/10', icon: CheckCircle2 },
}

export default function UtilitySignalsPage() {
  const { aiEnabled } = useAI()
  const [expandedQueue, setExpandedQueue] = useState<string | null>('UTL-001')

  if (!aiEnabled) {
    return (
      <AppShell title="Utility Signals" subtitle="Enable AI to access this feature" activeHref="/recommendations/signals">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-gold" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">AI Recommendations Required</h2>
            <p className="text-sm text-muted-foreground">Enable the AI toggle to access utility monitoring.</p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Utility & Power Signals"
      subtitle="Grid connection timelines, transformer delivery, energization sequencing, and utility coordination"
      activeHref="/recommendations/signals"
    >
      <motion.div className="space-y-6 w-full" variants={containerVariants} initial="hidden" animate="visible">
        {/* Back Link */}
        <motion.div variants={sectionVariants}>
          <Link href="/recommendations/signals" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to External Signals
          </Link>
        </motion.div>

        {/* KPI Strip */}
        <motion.section variants={sectionVariants}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Active Requests', value: '14', sublabel: 'Interconnection queue', color: 'gold', icon: Zap },
              { label: 'At Risk', value: '2', sublabel: 'Dublin moratorium', color: 'red', icon: AlertTriangle },
              { label: 'Avg Wait Time', value: '18mo', sublabel: 'NA transformer queue', color: 'amber', icon: Clock },
              { label: 'On Track', value: '11', sublabel: 'Projects on schedule', color: 'green', icon: CheckCircle2 },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-xl border border-border/50 p-4 bg-card/80 dark:bg-card/60 backdrop-blur-sm overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">{kpi.label}</p>
                    <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{kpi.sublabel}</p>
                  </div>
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', `bg-${kpi.color}/10`)}>
                    <kpi.icon className={cn('w-4 h-4', `text-${kpi.color}`)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Interconnection Queue */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Power className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Interconnection Queue Status</h3>
                  <p className="text-[10px] text-muted-foreground/60">Grid connection requests and timeline tracking</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border/30">
              {interconnectionQueue.map((item, i) => {
                const config = statusConfig[item.status as keyof typeof statusConfig]
                const isExpanded = expandedQueue === item.id
                const StatusIcon = config.icon
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="cursor-pointer"
                    onClick={() => setExpandedQueue(isExpanded ? null : item.id)}
                  >
                    <div className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', config.bg, `text-${config.color}`)}>
                              <StatusIcon className="w-3 h-3" />
                              {config.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50">{item.id}</span>
                          </div>
                          <h4 className="text-sm font-bold text-foreground">{item.project}</h4>
                          <p className="text-xs text-muted-foreground/70">{item.utility} · {item.region} · {item.capacity}</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-semibold text-foreground">Target: {item.targetDate}</p>
                            <p className="text-[10px] text-muted-foreground/60">
                              Queue #{item.queuePosition} · {item.waitTime} wait
                            </p>
                          </div>
                          <ChevronRight className={cn('w-4 h-4 text-muted-foreground/40 transition-transform', isExpanded && 'rotate-90')} />
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="p-4 rounded-lg bg-muted/30 border border-border/30 space-y-3">
                          <p className="text-xs text-muted-foreground/80">{item.notes}</p>
                          {item.recommendation && (
                            <div className="flex items-center justify-end pt-2 border-t border-border/20">
                              <Link
                                href={`/recommendations?rec=${item.recommendation}`}
                                className="flex items-center gap-1 text-[10px] text-teal hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {item.recommendation}
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* Utility Alerts */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-amber/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Utility Alerts</h3>
                  <p className="text-[10px] text-muted-foreground/60">Grid constraints and regulatory changes</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {utilityAlerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={cn(
                    'p-4 rounded-lg border',
                    alert.severity === 'red' ? 'bg-red/5 border-red/20' :
                    alert.severity === 'amber' ? 'bg-amber/5 border-amber/20' :
                    'bg-green/5 border-green/20'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                      alert.severity === 'red' ? 'bg-red/10 text-red' :
                      alert.severity === 'amber' ? 'bg-amber/10 text-amber' :
                      'bg-green/10 text-green'
                    )}>
                      {alert.region}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50">{alert.id}</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground/80 mb-3">{alert.detail}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {alert.affectedProjects.map(p => (
                      <span key={p} className="text-[9px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/30">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/20 text-[10px]">
                    <span className="text-muted-foreground/50">Source: {alert.source}</span>
                    {alert.recommendation && (
                      <Link
                        href={`/recommendations?rec=${alert.recommendation}`}
                        className="flex items-center gap-1 text-teal hover:underline"
                      >
                        {alert.recommendation}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Energy Pricing Trends */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-teal/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                  <Gauge className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Energy Price Trends</h3>
                  <p className="text-[10px] text-muted-foreground/60">Regional power pricing by market</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Region</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Rate</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">YoY Change</th>
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {energyPricing.map((item) => (
                    <tr key={item.region} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-xs font-semibold text-foreground">{item.region}</td>
                      <td className="p-3 text-center text-xs font-mono font-bold">{item.rate}</td>
                      <td className="p-3 text-center">
                        <span className={cn(
                          'flex items-center justify-center gap-1 text-xs font-mono font-semibold',
                          item.trend === 'up' ? 'text-red' : item.trend === 'down' ? 'text-green' : 'text-muted-foreground'
                        )}>
                          {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : item.trend === 'down' ? <TrendingUp className="w-3 h-3 rotate-180" /> : null}
                          {item.change}
                        </span>
                      </td>
                      <td className="p-3 text-[10px] text-muted-foreground">{item.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Outage Tracking */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-slate/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-slate" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Recent Outage Events</h3>
                  <p className="text-[10px] text-muted-foreground/60">Power interruptions and resolutions (last 30 days)</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Date</th>
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Site</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Duration</th>
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Cause</th>
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Impact</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {outageTracking.map((outage, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-xs font-mono">{outage.date}</td>
                      <td className="p-3 text-xs font-semibold text-foreground">{outage.site}</td>
                      <td className="p-3 text-center text-xs font-mono">{outage.duration}</td>
                      <td className="p-3 text-xs text-muted-foreground">{outage.cause}</td>
                      <td className="p-3 text-xs text-muted-foreground">{outage.impact}</td>
                      <td className="p-3 text-center">
                        <span className="flex items-center justify-center gap-1 text-[10px] text-green">
                          <CheckCircle2 className="w-3 h-3" />
                          {outage.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Source Attribution */}
        <motion.section variants={sectionVariants}>
          <div className="text-center py-4 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground/50">
              Sources: Dominion Energy · NV Energy · ERCOT · EirGrid · TenneT · Tenaga Nasional · Regional utility interconnection queues
            </p>
            <p className="text-[10px] text-muted-foreground/40 mt-1">
              Queue status updated weekly. Outage data synced in real-time. Energy pricing updated monthly.
            </p>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  )
}
