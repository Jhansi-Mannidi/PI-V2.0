'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { AuditShell } from '@/components/governance/audit-shell'
import { FadeUp } from '@/components/animated-primitives'
import { cn } from '@/lib/utils'
import {
  AlertTriangle, CheckCircle2, Clock, BarChart3,
  CalendarDays, Target, Eye,
} from 'lucide-react'
import {
  RISK_AUDIT_SCHEDULES,
  RISK_AUDIT_OCCURRENCES,
  RISK_ITEMS,
  getRiskAuditKpis,
  type AuditSchedule,
} from '@/lib/governance-data'

export default function RiskAuditPage() {
  const kpis = getRiskAuditKpis()

  const kpiData = [
    { label: 'Reviewed', value: kpis.reviewed, sub: 'completed', icon: CheckCircle2, tone: 'green' as const },
    { label: 'Overdue', value: kpis.overdue, sub: 'past due', icon: AlertTriangle, tone: 'red' as const },
    { label: 'Pending Review', value: kpis.pendingReview, sub: 'awaiting sign-off', icon: Clock, tone: 'amber' as const },
    { label: 'Failing', value: kpis.failing, sub: 'audit fail result', icon: Target, tone: 'red' as const },
    { label: 'Stale Risks', value: kpis.stale, sub: '>90 days no review', icon: Eye, tone: 'amber' as const },
  ]

  const toneMap = {
    gold: { bg: 'bg-gold/15', text: 'text-gold' },
    green: { bg: 'bg-green-bg', text: 'text-green' },
    red: { bg: 'bg-red-bg', text: 'text-red' },
    amber: { bg: 'bg-amber-bg', text: 'text-amber' },
    teal: { bg: 'bg-teal/10', text: 'text-teal' },
  }

  const kpiStrip = (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {kpiData.map((k, i) => {
        const t = toneMap[k.tone]
        return (
          <FadeUp key={k.label} delay={i * 0.05}>
            <div className="bg-card rounded-xl border border-line p-4 shadow-sm flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', t.bg)}>
                <k.icon className={cn('w-4 h-4', t.text)} />
              </div>
              <div>
                <p className={cn('text-2xl font-mono font-bold leading-none', t.text)}>{k.value}</p>
                <p className="text-[12px] font-semibold text-foreground mt-0.5">{k.label}</p>
                <p className="text-[10.5px] text-muted-foreground">{k.sub}</p>
              </div>
            </div>
          </FadeUp>
        )
      })}
    </div>
  )

  function renderScopeCell(s: AuditSchedule) {
    const riskItems = RISK_ITEMS.filter((r) => s.scopeItemIds.includes(r.id))
    return (
      <div>
        <div className="text-[11px] font-medium text-foreground">{s.scopeItemIds.length} risk item{s.scopeItemIds.length !== 1 ? 's' : ''}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {riskItems.slice(0, 2).map((r) => (
            <span key={r.id} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-bg text-red border border-red/25 font-mono">{r.id}</span>
          ))}
          {riskItems.length > 2 && <span className="text-[10px] text-muted-foreground">+{riskItems.length - 2}</span>}
        </div>
      </div>
    )
  }

  return (
    <AppShell
      title="Risk Audit"
      subtitle="Schedule, track and review recurring risk audits across all programs"
      activeHref="/risk-audit"
    >
      <div className="space-y-4 w-full">
        {/* Page intro */}
        <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-bg flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground leading-snug">
                Are our risks being audited at the right frequency, with findings tracked to resolution?
              </h2>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">
                {RISK_AUDIT_SCHEDULES.length} risk audit schedules · {RISK_ITEMS.length} tracked risks · {kpis.openFindings} open findings
              </p>
            </div>
          </div>
        </div>

        <AuditShell
          type="risk"
          accentColor="text-red"
          accentBg="bg-red"
          accentBorder="border-red"
          schedulePageHref="/risk-audit/schedule"
          schedules={RISK_AUDIT_SCHEDULES}
          occurrences={RISK_AUDIT_OCCURRENCES}
          kpis={kpiData}
          renderScheduleExtra={renderScopeCell}
        />
      </div>
    </AppShell>
  )
}
