'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { AuditShell } from '@/components/governance/audit-shell'
import { FadeUp } from '@/components/animated-primitives'
import { cn } from '@/lib/utils'
import {
  ShieldCheck, CheckCircle2, AlertTriangle, Clock, BarChart3,
  CalendarDays,
} from 'lucide-react'
import {
  CONTROLS_AUDIT_SCHEDULES,
  CONTROLS_AUDIT_OCCURRENCES,
  getControlsAuditKpis,
  type AuditSchedule,
} from '@/lib/governance-data'

const LS_KEY = 'controls_audit_schedules_user'

export default function ControlsAuditPage() {
  const kpis = getControlsAuditKpis()

  const [userSchedules, setUserSchedules] = React.useState<AuditSchedule[]>([])

  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as AuditSchedule[]
      setUserSchedules(stored)
    } catch {
      setUserSchedules([])
    }
  }, [])

  const allSchedules = [...CONTROLS_AUDIT_SCHEDULES, ...userSchedules]

  const kpiData = [
    { label: 'This Month', value: kpis.thisMonth, sub: 'scheduled', icon: CalendarDays, tone: 'gold' as const },
    { label: 'Completed', value: kpis.completed, sub: 'occurrences', icon: CheckCircle2, tone: 'green' as const },
    { label: 'Overdue', value: kpis.overdue, sub: 'need action', icon: AlertTriangle, tone: 'red' as const },
    { label: 'Pending Review', value: kpis.pendingReview, sub: 'awaiting sign-off', icon: Clock, tone: 'amber' as const },
    { label: 'Pass Rate', value: `${kpis.passRate}%`, sub: 'completed audits', icon: BarChart3, tone: 'teal' as const },
  ]

  const toneMap = {
    gold: { bg: 'bg-gold/15', text: 'text-gold' },
    green: { bg: 'bg-green-bg', text: 'text-green' },
    red: { bg: 'bg-red-bg', text: 'text-red' },
    amber: { bg: 'bg-amber-bg', text: 'text-amber' },
    teal: { bg: 'bg-teal/10', text: 'text-teal' },
  }

  function renderScopeCell(s: AuditSchedule) {
    return (
      <span className="text-[10px] text-muted-foreground">{s.scopeItemIds.length} controls</span>
    )
  }

  return (
    <AppShell
      title="Controls Audit"
      subtitle="Schedule, track and review recurring control audits across all programs"
      activeHref="/controls-audit"
    >
      <div className="space-y-4 w-full">
        {/* Page intro */}
        <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground leading-snug">
                Are our controls being tested at the right frequency, with evidence properly maintained?
              </h2>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">
                {allSchedules.length} control audit schedules · {CONTROLS_AUDIT_OCCURRENCES.length} total occurrences · {kpis.openFindings} open findings
              </p>
            </div>
          </div>
        </div>

        <AuditShell
          type="controls"
          accentColor="text-gold"
          accentBg="bg-gold"
          accentBorder="border-gold"
          schedulePageHref="/controls-audit/schedule"
          schedules={allSchedules}
          occurrences={CONTROLS_AUDIT_OCCURRENCES}
          kpis={kpiData}
          renderScheduleExtra={renderScopeCell}
        />
      </div>
    </AppShell>
  )
}
