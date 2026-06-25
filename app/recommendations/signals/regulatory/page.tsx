'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import {
  Landmark, ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle2,
  FileText, Shield, ChevronRight, ExternalLink, MapPin, Building2
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

const permits = [
  {
    id: 'REG-001',
    project: 'Henderson Substation',
    region: 'NA-W',
    jurisdiction: 'Henderson, NV',
    item: 'Building Permit Renewal',
    type: 'permit',
    status: 'urgent',
    dueDate: 'May 23, 2026',
    daysLeft: 3,
    owner: 'Sarah Chen',
    hasOrchestration: true,
    recommendation: 'HEN-001',
    notes: 'Renewal application submitted. Awaiting final approval from Building Dept.',
  },
  {
    id: 'REG-002',
    project: 'Council Bluffs Phase 4',
    region: 'NA-W',
    jurisdiction: 'Council Bluffs, IA',
    item: 'Safety Officer Certification',
    type: 'certification',
    status: 'in_progress',
    dueDate: 'Jun 7, 2026',
    daysLeft: 18,
    owner: 'Mike Rodriguez',
    hasOrchestration: true,
    recommendation: null,
    notes: 'Training scheduled for May 28. Certification expected by Jun 5.',
  },
  {
    id: 'REG-003',
    project: 'Pryor Creek',
    region: 'NA-W',
    jurisdiction: 'Mayes County, OK',
    item: 'Environmental Compliance Report',
    type: 'compliance',
    status: 'in_progress',
    dueDate: 'Jun 15, 2026',
    daysLeft: 26,
    owner: 'Jennifer Walsh',
    hasOrchestration: true,
    recommendation: null,
    notes: 'Q2 stormwater report in preparation. Site inspection completed.',
  },
  {
    id: 'REG-004',
    project: 'Mesa Power Upgrade',
    region: 'NA-W',
    jurisdiction: 'Mesa, AZ',
    item: 'Fire Safety Inspection',
    type: 'inspection',
    status: 'scheduled',
    dueDate: 'Jun 20, 2026',
    daysLeft: 31,
    owner: 'David Kim',
    hasOrchestration: true,
    recommendation: null,
    notes: 'Pre-inspection walkthrough scheduled for Jun 15.',
  },
  {
    id: 'REG-005',
    project: 'Atlanta DC-3',
    region: 'NA-E',
    jurisdiction: 'Douglas County, GA',
    item: 'AHJ Electrical Inspection',
    type: 'inspection',
    status: 'planning',
    dueDate: 'Jun 28, 2026',
    daysLeft: 39,
    owner: 'Tom Anderson',
    hasOrchestration: true,
    recommendation: null,
    notes: 'Switchgear installation must complete before scheduling.',
  },
  {
    id: 'REG-006',
    project: 'Ashburn Pod 6',
    region: 'NA-E',
    jurisdiction: 'Loudoun County, VA',
    item: 'Annual OSHA Audit',
    type: 'audit',
    status: 'planning',
    dueDate: 'Jul 1, 2026',
    daysLeft: 42,
    owner: 'Lisa Park',
    hasOrchestration: false,
    recommendation: null,
    notes: 'Documentation compilation in progress.',
  },
]

const regulatoryAlerts = [
  {
    id: 'RA-001',
    region: 'EMEA',
    title: 'Dublin Grid Moratorium Extension',
    jurisdiction: 'Ireland (EirGrid)',
    severity: 'red',
    effectiveDate: 'Q3 2026',
    detail: 'EirGrid has extended the grid connection moratorium for data centers in the Dublin area through Q3 2026. Review scheduled for September.',
    affectedProjects: ['STB-Hub1-1', 'LPP-Hub1-1'],
    source: 'EirGrid Official Notice · CRU Ireland',
    recommendation: 'REC-2026-0560',
  },
  {
    id: 'RA-002',
    region: 'EMEA',
    title: 'Frankfurt Fire Safety Addendum',
    jurisdiction: 'Germany (Bauaufsicht Frankfurt)',
    severity: 'amber',
    effectiveDate: 'Jul 1, 2026',
    detail: 'New fire safety requirements for data centers >10,000 sqm effective July 1. May require permit re-review.',
    affectedProjects: ['GBL-Hub2-1'],
    source: 'Bauaufsicht Frankfurt Published Guidance',
    recommendation: 'REC-2026-0565',
  },
  {
    id: 'RA-003',
    region: 'NA-E',
    title: 'Loudoun County Water Allocation Review',
    jurisdiction: 'Virginia (Loudoun BOS)',
    severity: 'amber',
    effectiveDate: 'Jun 15, 2026',
    detail: 'Water allocation review for data center cooling systems reopens. May affect future expansion permits.',
    affectedProjects: ['ARA-Hub1-1&2'],
    source: 'Loudoun BOS Agenda · Loudoun Water',
    recommendation: null,
  },
  {
    id: 'RA-004',
    region: 'APAC',
    title: 'Singapore PUE Standard',
    jurisdiction: 'Singapore (IMDA)',
    severity: 'green',
    effectiveDate: 'Q4 2026',
    detail: 'New energy efficiency standard requires PUE ≤1.3 for new data centers. Current designs compliant.',
    affectedProjects: ['CHB-Hub1-2', 'BSN-Hub1-1'],
    source: 'IMDA · Singapore Green Data Centre Roadmap',
    recommendation: null,
  },
]

const statusConfig = {
  urgent: { label: 'Urgent', color: 'red', bg: 'bg-red/10', border: 'border-red/20' },
  in_progress: { label: 'In Progress', color: 'amber', bg: 'bg-amber/10', border: 'border-amber/20' },
  scheduled: { label: 'Scheduled', color: 'sky', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  planning: { label: 'Planning', color: 'slate', bg: 'bg-slate/10', border: 'border-slate/20' },
  complete: { label: 'Complete', color: 'green', bg: 'bg-green/10', border: 'border-green/20' },
}

export default function RegulatorySignalsPage() {
  const { aiEnabled } = useAI()
  const [selectedPermit, setSelectedPermit] = useState<string | null>(null)

  if (!aiEnabled) {
    return (
      <AppShell title="Regulatory Signals" subtitle="Enable AI to access this feature" activeHref="/recommendations/signals">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-slate/10 flex items-center justify-center mx-auto">
              <Landmark className="w-8 h-8 text-slate" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">AI Recommendations Required</h2>
            <p className="text-sm text-muted-foreground">Enable the AI toggle to access regulatory monitoring.</p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Regulatory Signals"
      subtitle="Permits, inspections, compliance deadlines, and jurisdictional changes affecting the portfolio"
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
              { label: 'Active Items', value: '8', sublabel: '1 urgent · 3 upcoming', color: 'amber', icon: AlertTriangle },
              { label: 'Due in 30 Days', value: '3', sublabel: 'Permits & inspections', color: 'red', icon: Calendar },
              { label: 'Jurisdictions', value: '12', sublabel: 'Across 4 regions', color: 'sky', icon: MapPin },
              { label: 'Compliance Rate', value: '98%', sublabel: 'Rolling 12 months', color: 'green', icon: Shield },
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

        {/* Permits & Inspections Timeline */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-slate/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-slate" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Permits & Inspections</h3>
                  <p className="text-[10px] text-muted-foreground/60">Upcoming regulatory milestones (next 60 days)</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border/30">
              {permits.map((permit, i) => {
                const config = statusConfig[permit.status as keyof typeof statusConfig]
                const isExpanded = selectedPermit === permit.id
                return (
                  <motion.div
                    key={permit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedPermit(isExpanded ? null : permit.id)}
                  >
                    <div className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', config.bg, `text-${config.color}`)}>{config.label}</span>
                            <span className="text-[10px] text-muted-foreground/50">{permit.id}</span>
                          </div>
                          <h4 className="text-sm font-bold text-foreground">{permit.item}</h4>
                          <p className="text-xs text-muted-foreground/70">{permit.project} · {permit.jurisdiction}</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-semibold text-foreground">{permit.dueDate}</p>
                            <p className={cn(
                              'text-[10px] font-mono',
                              permit.daysLeft <= 7 ? 'text-red font-bold' : permit.daysLeft <= 30 ? 'text-amber' : 'text-muted-foreground'
                            )}>
                              {permit.daysLeft}d remaining
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
                          <p className="text-xs text-muted-foreground/80">{permit.notes}</p>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground/60">Owner: <span className="text-foreground font-medium">{permit.owner}</span></span>
                            <div className="flex items-center gap-2">
                              {permit.hasOrchestration && (
                                <span className="flex items-center gap-1 text-teal">
                                  <CheckCircle2 className="w-3 h-3" /> Orchestration Active
                                </span>
                              )}
                              {permit.recommendation && (
                                <Link
                                  href={`/recommendations?rec=${permit.recommendation}`}
                                  className="flex items-center gap-1 text-teal hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {permit.recommendation}
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* Regulatory Alerts */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-amber/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Regulatory Alerts</h3>
                  <p className="text-[10px] text-muted-foreground/60">Jurisdictional changes affecting portfolio</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {regulatoryAlerts.map((alert, i) => (
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
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
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
                      <h4 className="text-sm font-bold text-foreground">{alert.title}</h4>
                      <p className="text-[10px] text-muted-foreground/60">{alert.jurisdiction} · Effective {alert.effectiveDate}</p>
                    </div>
                  </div>
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

        {/* Source Attribution */}
        <motion.section variants={sectionVariants}>
          <div className="text-center py-4 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground/50">
              Sources: Local AHJ Portals · State/Provincial Regulatory Agencies · EirGrid · IMDA · EPA · OSHA
            </p>
            <p className="text-[10px] text-muted-foreground/40 mt-1">
              Permit data synced daily. Regulatory alerts pushed within 24 hours of publication.
            </p>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  )
}
