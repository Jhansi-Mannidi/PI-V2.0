'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { AuditScheduler } from '@/components/controls/audit-scheduler'
import { Button } from '@/components/ui/button'
import { PulseIndicator, GrowBar } from '@/components/animated-primitives'
import {
  Scale, Download, CalendarDays, CheckCircle2, BarChart3,
  AlertTriangle, ScrollText, FileCheck2,
} from 'lucide-react'
import { AUDIT_SCHEDULES, POLICIES, complianceBadge } from '@/lib/controls-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const tabs = [
  { id: 'schedule', label: 'Audit Schedule', icon: CalendarDays },
  { id: 'policies', label: 'Policy Coverage', icon: ScrollText },
] as const
type TabId = (typeof tabs)[number]['id']

export default function ComplianceAuditPage() {
  const [tab, setTab] = React.useState<TabId>('schedule')
  const complianceAudits = AUDIT_SCHEDULES.filter((s) => s.category === 'COMPLIANCE')
  const overdue = complianceAudits.filter((s) => s.status === 'OVERDUE').length
  const inProgress = complianceAudits.filter((s) => s.status === 'IN_PROGRESS').length
  const completed = complianceAudits.filter((s) => s.status === 'COMPLETED').length
  const criticalFindings = complianceAudits.reduce((sum, s) => sum + s.criticalFindings, 0)

  // Policy coverage stats
  const nonCompliant = POLICIES.filter((p) => p.complianceState === 'NON_COMPLIANT').length
  const atRisk = POLICIES.filter((p) => p.complianceState === 'AT_RISK').length
  const compliant = POLICIES.filter((p) => p.complianceState === 'COMPLIANT').length
  const avgCompliance = Math.round(POLICIES.reduce((sum, p) => sum + p.compliancePct, 0) / POLICIES.length)

  return (
    <AppShell
      title="Compliance Audit"
      subtitle="Schedule recurring compliance audits across regulatory, contractual, and internal obligations"
      activeHref="/compliance-audit"
    >
      <div className="space-y-5 w-full">
        {/* Header */}
        <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
                <Scale className="w-5.5 h-5.5 text-teal" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal/10 border border-teal/25 text-teal text-[10px] font-bold tracking-wide uppercase">
                    Compliance · Audit · Recurring Schedule
                  </span>
                  {inProgress > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-[10px] font-semibold">
                      <PulseIndicator color="bg-teal" size="w-1.5 h-1.5" /> {inProgress} in progress
                    </span>
                  )}
                  {overdue > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-bg border border-red/30 text-red text-[10px] font-semibold">
                      {overdue} overdue
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-foreground mt-1.5 leading-tight">
                  Are we meeting all regulatory, contractual, and internal compliance obligations on schedule?
                </h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {complianceAudits.length} compliance audit schedules · {POLICIES.length} active policies · avg compliance {avgCompliance}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" className="h-9 text-xs gap-1.5 border-line">
                <Download className="w-3.5 h-3.5" /> Export Evidence Pack
              </Button>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Compliant Policies', value: compliant, sub: 'of 8 policies', color: 'text-green', bg: 'bg-green-bg', icon: CheckCircle2 },
            { label: 'At Risk', value: atRisk, sub: 'require attention', color: 'text-amber', bg: 'bg-amber-bg', icon: AlertTriangle },
            { label: 'Non-Compliant', value: nonCompliant, sub: 'immediate action', color: 'text-red', bg: 'bg-red-bg', icon: AlertTriangle },
            { label: 'Avg Compliance', value: `${avgCompliance}%`, sub: 'portfolio-wide', color: 'text-gold', bg: 'bg-gold/15', icon: BarChart3 },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease }}
              className="bg-card rounded-xl border border-line p-4 shadow-sm flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-mono font-bold leading-none ${kpi.color}`}>{kpi.value}</p>
                <p className="text-[12px] font-semibold text-foreground mt-1">{kpi.label}</p>
                <p className="text-[10.5px] text-muted-foreground">{kpi.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rationale banner */}
        <div className="rounded-xl border border-teal/20 bg-teal/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <FileCheck2 className="w-4 h-4 text-teal mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-foreground mb-1">Real-time compliance audit posture</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Compliance audits validate that the portfolio is meeting its obligations — AHJ regulatory requirements, SLA contractual commitments, and internal governance standards.
                Recurring schedules ensure no obligation window is missed; findings link directly to controls and risk entries so remediation is tracked end-to-end.
                The portfolio currently has {nonCompliant} non-compliant and {atRisk} at-risk policy areas requiring scheduled audit cycles.
              </p>
            </div>
          </div>
        </div>

        {/* Tab strip */}
        <div className="flex items-center gap-1.5 p-1 bg-card border border-line rounded-xl overflow-x-auto shadow-sm">
          {tabs.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all ${
                  active ? 'bg-teal text-white shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          {tab === 'schedule' && (
            <AuditScheduler categoryFilter="COMPLIANCE" />
          )}
          {tab === 'policies' && (
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-line flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                    <ScrollText className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Policy Compliance Overview</h3>
                    <p className="text-[11px] text-muted-foreground">Current compliance status across all 8 active obligations</p>
                  </div>
                </div>
                <div className="divide-y divide-line">
                  {POLICIES.map((pol) => {
                    const cb = complianceBadge(pol.complianceState)
                    const sourceLabels: Record<string, string> = {
                      INTERNAL_STANDARD: 'Internal Standard',
                      REGULATORY: 'Regulatory',
                      CONTRACTUAL: 'Contractual',
                      BEST_PRACTICE: 'Best Practice',
                    }
                    const sourceCls: Record<string, string> = {
                      INTERNAL_STANDARD: 'bg-navy/10 text-navy border-navy/20',
                      REGULATORY: 'bg-red-bg text-red border-red/30',
                      CONTRACTUAL: 'bg-gold/15 text-gold border-gold/30',
                      BEST_PRACTICE: 'bg-teal/10 text-teal border-teal/25',
                    }
                    return (
                      <div key={pol.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/20 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-[10px] font-mono text-muted-foreground">{pol.id}</span>
                            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold ${sourceCls[pol.source]}`}>
                              {sourceLabels[pol.source]}
                            </span>
                          </div>
                          <p className="text-[13px] font-medium text-foreground truncate">{pol.title}</p>
                          <p className="text-[10.5px] text-muted-foreground mt-0.5">{pol.authority} · {pol.applicability}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 shrink-0">
                          <div className="min-w-[120px]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-muted-foreground">Compliance</span>
                              <span className="text-[11px] font-mono font-semibold text-foreground">{pol.compliancePct}%</span>
                            </div>
                            <div className="w-28 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <GrowBar
                                widthPct={pol.compliancePct}
                                className={`h-full rounded-full ${pol.compliancePct >= 85 ? 'bg-green' : pol.compliancePct >= 60 ? 'bg-amber' : 'bg-red'}`}
                              />
                            </div>
                          </div>
                          <span className={`shrink-0 px-2 py-1 rounded-md border text-[10px] font-semibold ${cb.cls}`}>
                            {cb.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Audit-to-policy mapping */}
              <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
                <h3 className="text-base font-semibold text-foreground mb-4">Audit-to-Policy Coverage Map</h3>
                <div className="space-y-3">
                  {complianceAudits.map((sched) => (
                    <div key={sched.id} className="flex items-start gap-3 p-3 rounded-lg border border-line bg-secondary/20">
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-semibold text-foreground">{sched.title}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {sched.linkedPolicyIds.map((pid) => (
                            <span key={pid} className="px-2 py-0.5 rounded bg-teal/10 text-teal border border-teal/20 text-[10px] font-mono font-semibold">{pid}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10.5px] text-muted-foreground">Next run</p>
                        <p className={`text-[12px] font-mono font-semibold ${sched.status === 'OVERDUE' ? 'text-red' : 'text-foreground'}`}>
                          {sched.nextRunDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  )
}
