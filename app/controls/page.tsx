'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import { ShieldCheck, Download, Bell, LayoutGrid, Activity, Scale, AlertOctagon, Users, CalendarDays, BookOpen, CheckCircle2, AlertTriangle as AlertTriangleIcon, Clock, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PulseIndicator } from '@/components/animated-primitives'
import { ControlsKpiStrip } from '@/components/controls/controls-kpi-strip'
import { ControlHeatmap } from '@/components/controls/control-heatmap'
import { AutoAuditConsole } from '@/components/controls/auto-audit-console'
import { ComplianceRegister } from '@/components/controls/compliance-register'
import { ControlGapExplorer } from '@/components/controls/control-gap-explorer'
import { ControlsLibrary } from '@/components/controls/controls-library'
import { AuditShell } from '@/components/governance/audit-shell'
import { useActionModal } from '@/hooks/use-action-modal'
import {
  CONTROL_GAPS,
  CONTROL_KPIS,
  CONTROLS,
  HEATMAP,
  POLICIES,
  RECENT_VERDICTS,
} from '@/lib/controls-data'
import {
  CONTROLS_AUDIT_SCHEDULES,
  CONTROLS_AUDIT_OCCURRENCES,
  getControlsAuditKpis,
} from '@/lib/governance-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const tabs = [
  { id: 'posture', label: 'Posture', icon: LayoutGrid },
  { id: 'library', label: 'Controls Library', icon: BookOpen },
  { id: 'audit', label: 'Auto-Audit', icon: Activity },
  { id: 'controls-audit', label: 'Controls Audit', icon: CalendarDays },
  { id: 'compliance', label: 'Compliance', icon: Scale },
  { id: 'gaps', label: 'Control Gaps', icon: AlertOctagon },
] as const

type TabId = (typeof tabs)[number]['id']

function ControlsAuditPanel() {
  const kpis = getControlsAuditKpis()
  const kpiCards = (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {[
        { label: 'This Month', value: kpis.thisMonth, sub: 'scheduled', icon: CalendarDays, tone: 'gold' },
        { label: 'Completed', value: kpis.completed, sub: 'occurrences', icon: CheckCircle2, tone: 'green' },
        { label: 'Overdue', value: kpis.overdue, sub: 'need action', icon: AlertTriangleIcon, tone: 'red' },
        { label: 'Pending Review', value: kpis.pendingReview, sub: 'awaiting sign-off', icon: Clock, tone: 'amber' },
        { label: 'Pass Rate', value: `${kpis.passRate}%`, sub: 'completed audits', icon: BarChart3, tone: 'teal' },
        { label: 'Open Findings', value: kpis.openFindings, sub: 'across audits', icon: AlertTriangleIcon, tone: kpis.openFindings > 0 ? 'red' : 'green' },
      ].map((k, i) => {
        const toneMap: Record<string, { bg: string; text: string }> = {
          gold: { bg: 'bg-gold/15', text: 'text-gold' },
          green: { bg: 'bg-green-bg', text: 'text-green' },
          red: { bg: 'bg-red-bg', text: 'text-red' },
          amber: { bg: 'bg-amber-bg', text: 'text-amber' },
          teal: { bg: 'bg-teal/10', text: 'text-teal' },
        }
        const t = toneMap[k.tone] ?? toneMap.gold
        return (
          <motion.div key={k.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.04, ease }} className="bg-card rounded-xl border border-line p-3.5 shadow-sm flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', t.bg)}>
              <k.icon className={cn('w-4 h-4', t.text)} />
            </div>
            <div>
              <p className={cn('text-xl font-mono font-bold leading-none', t.text)}>{k.value}</p>
              <p className="text-[11px] font-semibold text-foreground mt-0.5">{k.label}</p>
              <p className="text-[10px] text-muted-foreground">{k.sub}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
  return (
    <AuditShell
      type="controls"
      accentColor="text-gold"
      accentBg="bg-gold"
      accentBorder="border-gold"
      schedulePageHref="/controls-audit/schedule"
      schedules={CONTROLS_AUDIT_SCHEDULES}
      occurrences={CONTROLS_AUDIT_OCCURRENCES}
      kpis={[
        { label: 'This Month', value: kpis.thisMonth, sub: 'scheduled', icon: CalendarDays, tone: 'gold' },
        { label: 'Completed', value: kpis.completed, sub: 'occurrences', icon: CheckCircle2, tone: 'green' },
        { label: 'Overdue', value: kpis.overdue, sub: 'need action', icon: AlertTriangleIcon, tone: 'red' },
        { label: 'Pending Review', value: kpis.pendingReview, sub: 'awaiting sign-off', icon: Clock, tone: 'amber' },
        { label: 'Pass Rate', value: `${kpis.passRate}%`, sub: 'completed audits', icon: BarChart3, tone: 'teal' },
      ]}
      renderScheduleExtra={(s) => (
        <span className="text-[10px] text-muted-foreground">{s.scopeItemIds.length} controls</span>
      )}
    />
  )
}

export default function ControlsPage() {
  const action = useActionModal()
  const [tab, setTab] = React.useState<TabId>('posture')
  const [alertsOn, setAlertsOn] = React.useState(false)
  const [alertChannel, setAlertChannel] = React.useState<string>('in-app')
  const [exportQueued, setExportQueued] = React.useState(false)

  const downloadCompliancePack = (audience: string) => {
    const generatedAt = new Date()
    const fileDate = generatedAt.toISOString().slice(0, 10)
    const totalGapExposure = CONTROL_GAPS.reduce((sum, gap) => sum + gap.exposureValue, 0)
    const failedVerdicts = RECENT_VERDICTS.filter((verdict) => verdict.result === 'FAIL')

    const markdown = [
      '# Controls & Auto-Audit Evidence Pack',
      '',
      `Generated: ${generatedAt.toLocaleString()}`,
      `Audience: ${audience}`,
      '',
      '## Portfolio Posture',
      '',
      `- Compliance posture: ${CONTROL_KPIS.compliancePosture}`,
      `- Controls covered: ${CONTROL_KPIS.controlsCovered}% (${CONTROL_KPIS.totalControls} controls)`,
      `- Auto-audit precision: ${CONTROL_KPIS.autoAuditPrecision}%`,
      `- Open control gaps: ${CONTROL_KPIS.openGaps}`,
      `- Gap exposure: $${CONTROL_KPIS.gapExposure}M`,
      `- Tests today: ${CONTROL_KPIS.testsToday.toLocaleString()}`,
      '',
      '## Control-Health Heatmap',
      '',
      ...HEATMAP.map((row) => {
        const scores = Object.entries(row.scores)
          .map(([program, score]) => `${program}: ${score}`)
          .join(', ')
        return `- ${row.domain} (${row.coverage}): ${scores}`
      }),
      '',
      '## Critical Control Gaps',
      '',
      ...CONTROL_GAPS.map((gap) =>
        `- ${gap.controlId}: ${gap.title} | ${gap.coverageState} | ${gap.region} | ${gap.daysSinceTest}d since test | $${gap.exposureValue.toFixed(1)}M | ${gap.autoRaisedRisk ?? 'No linked risk'}`,
      ),
      '',
      `Total listed gap exposure: $${totalGapExposure.toFixed(1)}M`,
      '',
      '## Policy Compliance',
      '',
      ...POLICIES.map((policy) =>
        `- ${policy.id}: ${policy.title} | ${policy.complianceState} | ${policy.compliancePct}% | controls: ${policy.controlIds.join(', ')}`,
      ),
      '',
      '## Recent Auto-Audit Verdicts',
      '',
      ...RECENT_VERDICTS.map((verdict) =>
        `- ${verdict.controlId}: ${verdict.result} | ${verdict.confidence}% confidence | ${verdict.timeLabel} | ${verdict.evidence}`,
      ),
      '',
      '## Control Inventory Snapshot',
      '',
      ...CONTROLS.map((control) =>
        `- ${control.id}: ${control.title} | ${control.ownerRole} | ${control.lastResult} | effectiveness ${control.effectiveness}% | priority ${control.testPriority}`,
      ),
      '',
      '## Failed Verdict Summary',
      '',
      failedVerdicts.length > 0
        ? failedVerdicts.map((verdict) => `- ${verdict.controlId}: ${verdict.evidence}`).join('\n')
        : '- No failed verdicts in the current stream.',
      '',
    ].join('\n')

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `controls-auto-audit-pack-${audience}-${fileDate}.md`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell title="Controls & Auto-Audit" subtitle="Compliance posture, control health, owner assignments & audit scheduling" activeHref="/controls">
      <div className="space-y-4 sm:space-y-6 w-full">
        {/* ── Header ── */}
        <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5.5 h-5.5 text-gold" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-bold tracking-wide uppercase">
                    Controls · Compliance · Auto-Audit · Owner Assignment · Audit Schedule
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-bg border border-green/30 text-green text-[10px] font-semibold">
                    <PulseIndicator color="bg-green" size="w-1.5 h-1.5" /> Engine live
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-foreground mt-1.5 leading-tight">
                  Are our controls actually working — everywhere, right now?
                </h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  248 controls continuously generated, tested and scored across 4 programs · 12 owners assigned · 13 recurring audit schedules active
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() =>
                  action.open({
                    tone: 'info',
                    icon: Bell,
                    title: alertsOn ? 'Update Alert Subscription' : 'Enable Control Alerts',
                    description: 'Receive notifications when critical controls become stale, fail a test, or raise a risk.',
                    context: [
                      { label: 'Scope', value: 'Critical controls and auto-raised gaps' },
                      { label: 'Current status', value: alertsOn ? 'Enabled' : 'Not enabled' },
                    ],
                    fields: [
                      {
                        type: 'select',
                        name: 'channel',
                        label: 'Notification channel',
                        defaultValue: 'in-app',
                        required: true,
                        options: [
                          { value: 'in-app', label: 'In-app alerts' },
                          { value: 'email', label: 'Email digest' },
                          { value: 'slack', label: 'Slack + in-app alerts' },
                        ],
                      },
                    ],
                    confirmLabel: alertsOn ? 'Update Alerts' : 'Enable Alerts',
                    successToast: alertsOn ? 'Alert subscription updated' : 'Control alerts enabled',
                    successDescription: 'Critical control breaks will now notify the selected channel.',
                    onConfirm: (values) => {
                      setAlertsOn(true)
                      setAlertChannel(values.channel || 'in-app')
                    },
                  })
                }
                className="h-9 text-xs gap-1.5 border-line"
              >
                <Bell className="w-3.5 h-3.5" /> {alertsOn ? 'Alerts On' : 'Alerts'}
              </Button>
              <Button
                onClick={() =>
                  action.open({
                    tone: 'primary',
                    icon: Download,
                    title: 'Export Compliance Pack',
                    description: 'Generate a portfolio controls pack with posture, heatmap, gaps, and audit evidence.',
                    context: [
                      { label: 'Sections', value: 'Posture · Auto-Audit · Compliance · Gaps · Owner Assignments' },
                      { label: 'Format', value: 'PDF evidence pack' },
                    ],
                    fields: [
                      {
                        type: 'select',
                        name: 'audience',
                        label: 'Audience',
                        defaultValue: 'leadership',
                        required: true,
                        options: [
                          { value: 'leadership', label: 'Leadership summary' },
                          { value: 'audit', label: 'Audit-ready evidence pack' },
                          { value: 'controls', label: 'Controls team worklist' },
                        ],
                      },
                    ],
                    confirmLabel: 'Export Pack',
                    successToast: 'Compliance pack downloaded',
                    successDescription: 'The Markdown evidence pack has been saved through your browser downloads.',
                    onConfirm: (values) => {
                      downloadCompliancePack(values.audience || 'leadership')
                      setExportQueued(true)
                    },
                  })
                }
                className="h-9 text-xs gap-1.5 bg-gold text-navy border border-gold font-semibold"
              >
                <Download className="w-3.5 h-3.5" /> {exportQueued ? 'Downloaded' : 'Export Pack'}
              </Button>
            </div>
          </div>
        </div>

        {alertsOn && (
          <div className="rounded-xl border border-teal/20 bg-teal/5 px-4 py-3 flex items-center gap-3">
            <Bell className="w-4 h-4 text-teal shrink-0" />
            <p className="text-[12px] text-foreground">
              Control alerts are active via <span className="font-semibold text-teal">{alertChannel}</span>.
              Critical failed tests, stale controls, and auto-raised gaps will be surfaced here.
            </p>
          </div>
        )}

        {/* ── KPI Strip ── */}
        <ControlsKpiStrip />

        {/* ── Tab Strip ── */}
        <div className="sticky top-0 z-10 -mx-1 px-1">
          <div className="flex items-center gap-1 p-1 bg-card border border-line rounded-xl overflow-x-auto shadow-sm no-scrollbar">
            {tabs.map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition-all',
                    active ? 'bg-gold text-navy shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
          className="space-y-4 sm:space-y-6"
        >
          {tab === 'posture' && (
            <>
              <ControlHeatmap
                onSelectCell={(domainId, program) =>
                  action.open({
                    tone: 'info',
                    icon: LayoutGrid,
                    title: 'Control Cell Selected',
                    description: 'Open a focused review for this control domain and program slice.',
                    context: [
                      { label: 'Control domain', value: domainId },
                      { label: 'Program', value: program },
                    ],
                    fields: [
                      {
                        type: 'select',
                        name: 'review',
                        label: 'Next action',
                        defaultValue: 'drilldown',
                        required: true,
                        options: [
                          { value: 'drilldown', label: 'Open detailed control drilldown' },
                          { value: 'retest', label: 'Queue auto-audit retest' },
                          { value: 'owner', label: 'Notify control owner' },
                        ],
                      },
                    ],
                    confirmLabel: 'Continue',
                    successToast: 'Control review action queued',
                    successDescription: `${domainId} / ${program} has been added to the controls work queue.`,
                  })
                }
              />
              <ControlGapExplorer />
            </>
          )}
          {tab === 'library' && <ControlsLibrary />}
          {tab === 'audit' && <AutoAuditConsole />}
          {tab === 'controls-audit' && (
            <ControlsAuditPanel />
          )}
          {tab === 'compliance' && <ComplianceRegister />}
          {tab === 'gaps' && <ControlGapExplorer />}
        </motion.div>
        {action.element}
      </div>
    </AppShell>
  )
}
