'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { AuditScheduler } from '@/components/controls/audit-scheduler'
import { Button } from '@/components/ui/button'
import { PulseIndicator } from '@/components/animated-primitives'
import {
  AlertTriangle, Download, CalendarDays, BarChart3, Target, FileSearch,
} from 'lucide-react'
import { AUDIT_SCHEDULES, AUDIT_SCHEDULE_KPIS } from '@/lib/controls-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const tabs = [
  { id: 'schedule', label: 'Audit Schedule', icon: CalendarDays },
  { id: 'overview', label: 'Exposure Overview', icon: BarChart3 },
] as const
type TabId = (typeof tabs)[number]['id']

export default function RiskAuditPage() {
  const [tab, setTab] = React.useState<TabId>('schedule')
  const riskAudits = AUDIT_SCHEDULES.filter((s) => s.category === 'RISK')
  const overdue = riskAudits.filter((s) => s.status === 'OVERDUE').length
  const inProgress = riskAudits.filter((s) => s.status === 'IN_PROGRESS').length
  const criticalFindings = riskAudits.reduce((sum, s) => sum + s.criticalFindings, 0)

  return (
    <AppShell
      title="Risk Audit"
      subtitle="Schedule and track recurring risk audits across all programs"
      activeHref="/risk-audit"
    >
      <div className="space-y-5 w-full">
        {/* Header */}
        <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 rounded-xl bg-red-bg flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5.5 h-5.5 text-red" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-bg border border-red/30 text-red text-[10px] font-bold tracking-wide uppercase">
                    Risk · Audit · Recurring Schedule
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-[10px] font-semibold">
                    <PulseIndicator color="bg-teal" size="w-1.5 h-1.5" /> {inProgress} in progress
                  </span>
                  {overdue > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-bg border border-red/30 text-red text-[10px] font-semibold">
                      {overdue} overdue
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-foreground mt-1.5 leading-tight">
                  Are our risks being audited at the right frequency, with findings tracked to resolution?
                </h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {riskAudits.length} risk audit schedules · {criticalFindings} critical findings open · portfolio-wide coverage
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" className="h-9 text-xs gap-1.5 border-line">
                <Download className="w-3.5 h-3.5" /> Export Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Context cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Risk Audits', value: riskAudits.length, sub: 'Total scheduled', color: 'text-gold', bg: 'bg-gold/15' },
            { label: 'In Progress', value: inProgress, sub: 'Currently running', color: 'text-teal', bg: 'bg-teal/10' },
            { label: 'Overdue', value: overdue, sub: 'Past due date', color: 'text-red', bg: 'bg-red-bg' },
            { label: 'Critical Findings', value: criticalFindings, sub: 'Requiring action', color: 'text-amber', bg: 'bg-amber-bg' },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease }}
              className="bg-card rounded-xl border border-line p-4 shadow-sm"
            >
              <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                <Target className={`w-4 h-4 ${c.color}`} />
              </div>
              <p className={`text-2xl font-mono font-bold ${c.color}`}>{c.value}</p>
              <p className="text-[12px] font-semibold text-foreground mt-1">{c.label}</p>
              <p className="text-[10.5px] text-muted-foreground">{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Rationale banner */}
        <div className="rounded-xl border border-amber/20 bg-amber-bg/30 px-5 py-4">
          <div className="flex items-start gap-3">
            <FileSearch className="w-4 h-4 text-amber mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-foreground mb-1">Why risk-specific audits matter</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Risk audits validate that scored risks remain accurate, mitigation actions are progressing, and escalated risks receive leadership attention.
                They close the loop between discovery and resolution — preventing risks from aging without accountability.
                Recurring schedules ensure portfolio coverage; event-triggered audits catch high-velocity changes before they materialise.
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
                  active ? 'bg-red text-white shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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
            <AuditScheduler categoryFilter="RISK" />
          )}
          {tab === 'overview' && (
            <div className="space-y-4">
              {/* Risk audit exposure by program */}
              <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
                <h3 className="text-base font-semibold text-foreground mb-4">Risk Audit Coverage by Program</h3>
                <div className="space-y-4">
                  {[
                    { program: 'EMEA', coverage: 60, audits: 2, criticalOpen: 1, status: 'In Progress' },
                    { program: 'APAC', coverage: 0, audits: 1, criticalOpen: 0, status: 'Scheduled' },
                    { program: 'NA-West / NA-East', coverage: 0, audits: 2, criticalOpen: 0, status: 'Scheduled' },
                    { program: 'Portfolio-Wide', coverage: 0, audits: 1, criticalOpen: 0, status: 'Overdue' },
                  ].map((row) => (
                    <div key={row.program} className="flex items-center gap-4">
                      <div className="w-32 shrink-0">
                        <p className="text-[12.5px] font-semibold text-foreground">{row.program}</p>
                        <p className="text-[10.5px] text-muted-foreground">{row.audits} audit{row.audits !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.coverage >= 80 ? 'bg-green' : row.coverage >= 50 ? 'bg-amber' : row.coverage > 0 ? 'bg-teal' : 'bg-secondary'}`}
                          style={{ width: `${Math.max(row.coverage, 3)}%` }}
                        />
                      </div>
                      <div className="w-12 text-right">
                        <span className="text-[12px] font-mono font-semibold text-foreground">{row.coverage}%</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
                        row.status === 'In Progress' ? 'bg-teal/10 text-teal border-teal/20' :
                        row.status === 'Overdue' ? 'bg-red-bg text-red border-red/30' :
                        'bg-secondary text-muted-foreground border-line'
                      }`}>
                        {row.status}
                      </span>
                      {row.criticalOpen > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-bg text-red border border-red/30 shrink-0">
                          {row.criticalOpen} critical
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key risk audit findings summary */}
              <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
                <h3 className="text-base font-semibold text-foreground mb-4">Open Risk Audit Findings</h3>
                <div className="space-y-3">
                  {[
                    { id: 'RAF-001', risk: 'RSK-1037', title: 'STB AHJ sustainability gap confirmed by bi-weekly scan', severity: 'Critical', audit: 'SCHED-007', program: 'EMEA', action: 'AHJ liaison engaged — design alternative in review' },
                    { id: 'RAF-002', risk: 'RSK-1037', title: 'Permit renewal orchestration not started — gate 24 days out', severity: 'High', audit: 'SCHED-007', program: 'EMEA', action: 'Orchestration task raised; milestone timer set' },
                  ].map((f) => (
                    <div key={f.id} className="flex items-start gap-3 p-3.5 rounded-lg border border-line bg-secondary/20">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${f.severity === 'Critical' ? 'bg-red' : 'bg-amber'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-mono text-muted-foreground">{f.id}</span>
                          <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${f.severity === 'Critical' ? 'bg-red-bg text-red border-red/30' : 'bg-amber-bg text-amber border-amber/30'}`}>
                            {f.severity}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-line text-[9px] font-mono">{f.audit}</span>
                          <span className="px-1.5 py-0.5 rounded bg-teal/10 text-teal border border-teal/20 text-[9px] font-mono">{f.risk}</span>
                        </div>
                        <p className="text-[13px] font-medium text-foreground leading-snug">{f.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          <span className="font-semibold">Remediation:</span> {f.action}
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
