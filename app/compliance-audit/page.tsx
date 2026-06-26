'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { AuditShell } from '@/components/governance/audit-shell'
import { FadeUp, GrowBar } from '@/components/animated-primitives'
import { cn } from '@/lib/utils'
import {
  Scale, CheckCircle2, AlertTriangle, Clock, BarChart3,
  CalendarDays, ShieldAlert,
} from 'lucide-react'
import {
  COMPLIANCE_AUDIT_SCHEDULES,
  COMPLIANCE_AUDIT_OCCURRENCES,
  COMPLIANCE_ITEMS,
  getComplianceAuditKpis,
  complianceStatusBadge,
  type AuditSchedule,
  type ComplianceItem,
} from '@/lib/governance-data'

export default function ComplianceAuditPage() {
  const kpis = getComplianceAuditKpis()

  const kpiData = [
    { label: 'Compliant', value: kpis.compliant, sub: 'of ' + kpis.total, icon: CheckCircle2, tone: 'green' as const },
    { label: 'Non-Compliant', value: kpis.nonCompliant, sub: 'immediate action', icon: AlertTriangle, tone: 'red' as const },
    { label: 'Expiring Soon', value: kpis.expiring30, sub: 'within 30 days', icon: Clock, tone: 'amber' as const },
    { label: 'Overdue Audits', value: kpis.overdueAudits, sub: 'past due', icon: ShieldAlert, tone: 'red' as const },
    { label: 'Compliance Rate', value: `${kpis.complianceRate}%`, sub: 'portfolio-wide', icon: BarChart3, tone: 'teal' as const },
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

  // Compliance item status table as extra content below the tabs
  const complianceRegister = (
    <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm mt-4">
      <div className="px-5 py-4 border-b border-line flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
          <Scale className="w-4 h-4 text-teal" />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">Compliance Item Register</h3>
          <p className="text-[11px] text-muted-foreground">{COMPLIANCE_ITEMS.length} active obligations tracked</p>
        </div>
      </div>
      <div className="divide-y divide-line">
        {COMPLIANCE_ITEMS.map((item: ComplianceItem) => {
          const badge = complianceStatusBadge(item.status)
          const daysLeft = item.daysToExpiry
          return (
            <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/20 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground font-semibold">{item.id}</span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-secondary border border-line text-muted-foreground">{item.framework}</span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-secondary border border-line text-muted-foreground">{item.projectName}</span>
                </div>
                <p className="text-[12.5px] font-medium text-foreground truncate">{item.requirement}</p>
                <p className="text-[10.5px] text-muted-foreground mt-0.5">{item.ownerName}</p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                {daysLeft !== null && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', daysLeft <= 0 ? 'bg-red' : daysLeft <= 30 ? 'bg-amber' : 'bg-green')}
                        style={{ width: `${Math.max(0, Math.min(100, (daysLeft / 365) * 100))}%` }}
                      />
                    </div>
                    <span className={cn('text-[10px] font-mono font-semibold', daysLeft <= 0 ? 'text-red' : daysLeft <= 30 ? 'text-amber' : 'text-muted-foreground')}>
                      {daysLeft <= 0 ? 'Expired' : `${daysLeft}d`}
                    </span>
                  </div>
                )}
                <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border', badge.cls)}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', badge.dot)} />
                  {badge.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  function renderScopeCell(s: AuditSchedule) {
    const items = COMPLIANCE_ITEMS.filter((c) => s.scopeItemIds.includes(c.id))
    return (
      <div>
        <div className="text-[11px] font-medium text-foreground">{s.scopeItemIds.length} obligation{s.scopeItemIds.length !== 1 ? 's' : ''}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {items.slice(0, 2).map((c) => (
            <span key={c.id} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-teal/10 text-teal border border-teal/25 font-mono">{c.id}</span>
          ))}
          {items.length > 2 && <span className="text-[10px] text-muted-foreground">+{items.length - 2}</span>}
        </div>
      </div>
    )
  }

  return (
    <AppShell
      title="Compliance Audit"
      subtitle="Schedule recurring compliance audits across regulatory, contractual, and internal obligations"
      activeHref="/compliance-audit"
    >
      <div className="space-y-4 w-full">
        {/* Page intro */}
        <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-teal" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground leading-snug">
                Are we meeting all regulatory, contractual, and internal compliance obligations on schedule?
              </h2>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">
                {COMPLIANCE_AUDIT_SCHEDULES.length} compliance schedules · {COMPLIANCE_ITEMS.length} tracked obligations · {kpis.openFindings} open findings
              </p>
            </div>
          </div>
        </div>

        <AuditShell
          type="compliance"
          accentColor="text-teal"
          accentBg="bg-teal"
          accentBorder="border-teal"
          schedulePageHref="/compliance-audit/schedule"
          schedules={COMPLIANCE_AUDIT_SCHEDULES}
          occurrences={COMPLIANCE_AUDIT_OCCURRENCES}
          kpis={kpiData}
          renderScheduleExtra={renderScopeCell}
          extraContent={complianceRegister}
        />
      </div>
    </AppShell>
  )
}
