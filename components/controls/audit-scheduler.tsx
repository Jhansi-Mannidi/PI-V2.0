'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  CalendarDays, Plus, Clock, CheckCircle2, AlertTriangle, ArrowUpRight,
  ChevronDown, Play, RefreshCw, Bell, ShieldCheck, Scale, Filter,
  BarChart3, Repeat, FileSearch,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeUp, GrowBar, PulseIndicator } from '@/components/animated-primitives'
import {
  AUDIT_SCHEDULES, AUDIT_SCHEDULE_KPIS,
  frequencyLabel, scheduledStatusBadge, categoryMeta,
  type AuditCategory, type ScheduledAuditStatus,
} from '@/lib/controls-data'
import { useActionModal } from '@/hooks/use-action-modal'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const CATEGORY_ICONS: Record<AuditCategory, React.ElementType> = {
  CONTROLS: ShieldCheck,
  RISK: AlertTriangle,
  COMPLIANCE: Scale,
}

interface AuditSchedulerProps {
  /** If set, only show audits for this category */
  categoryFilter?: AuditCategory
}

export function AuditScheduler({ categoryFilter }: AuditSchedulerProps) {
  const action = useActionModal()
  const [selectedCategory, setSelectedCategory] = React.useState<AuditCategory | 'ALL'>(categoryFilter ?? 'ALL')
  const [selectedStatus, setSelectedStatus] = React.useState<ScheduledAuditStatus | 'ALL'>('ALL')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [runQueued, setRunQueued] = React.useState<Set<string>>(new Set())
  const [scheduledStates, setScheduledStates] = React.useState<Record<string, ScheduledAuditStatus>>({})

  // If a categoryFilter is passed (from Risk/Compliance pages), lock to that category
  React.useEffect(() => {
    if (categoryFilter) setSelectedCategory(categoryFilter)
  }, [categoryFilter])

  const filtered = AUDIT_SCHEDULES.filter((s) => {
    const cat = selectedCategory === 'ALL' || s.category === selectedCategory
    const status = selectedStatus === 'ALL' || (scheduledStates[s.id] ?? s.status) === selectedStatus
    return cat && status
  })

  const kpis = [
    { label: 'Total Scheduled', value: AUDIT_SCHEDULE_KPIS.totalScheduled, icon: CalendarDays, tone: 'gold' as const },
    { label: 'In Progress', value: AUDIT_SCHEDULE_KPIS.inProgress, icon: Play, tone: 'teal' as const },
    { label: 'Overdue', value: AUDIT_SCHEDULE_KPIS.overdue, icon: AlertTriangle, tone: 'red' as const },
    { label: 'Critical Findings', value: AUDIT_SCHEDULE_KPIS.criticalFindings, icon: ArrowUpRight, tone: 'amber' as const },
  ]

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => {
          const toneMap = {
            gold: { text: 'text-gold', bg: 'bg-gold/15' },
            teal: { text: 'text-teal', bg: 'bg-teal/10' },
            red: { text: 'text-red', bg: 'bg-red-bg' },
            amber: { text: 'text-amber', bg: 'bg-amber-bg' },
          }[kpi.tone]
          return (
            <FadeUp key={kpi.label} delay={i * 0.05}>
              <div className="bg-card rounded-xl border border-line p-4 shadow-sm flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', toneMap.bg)}>
                  <kpi.icon className={cn('w-4 h-4', toneMap.text)} />
                </div>
                <div>
                  <p className={cn('text-2xl font-mono font-bold leading-none', toneMap.text)}>{kpi.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{kpi.label}</p>
                </div>
              </div>
            </FadeUp>
          )
        })}
      </div>

      {/* Header + schedule new */}
      <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Audit Scheduler</h3>
              <p className="text-[11px] text-muted-foreground">
                Schedule and manage recurring audits across Controls, Risk, and Compliance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-9 text-xs border-line"
              onClick={() =>
                action.open({
                  tone: 'info',
                  icon: Bell,
                  title: 'Audit Notification Settings',
                  description: 'Configure alerts for upcoming, overdue, or completed audits.',
                  context: [
                    { label: 'Next audit due', value: AUDIT_SCHEDULE_KPIS.nextAuditDue },
                    { label: 'Overdue count', value: AUDIT_SCHEDULE_KPIS.overdue },
                  ],
                  fields: [
                    {
                      type: 'select', name: 'channel', label: 'Notification channel', required: true,
                      defaultValue: 'in-app',
                      options: [
                        { value: 'in-app', label: 'In-app only' },
                        { value: 'email', label: 'Email digest' },
                        { value: 'slack', label: 'Slack + in-app' },
                      ],
                    },
                    {
                      type: 'select', name: 'trigger', label: 'Notify on', required: true,
                      defaultValue: 'all',
                      options: [
                        { value: 'all', label: 'All audit events' },
                        { value: 'overdue', label: 'Overdue only' },
                        { value: 'critical', label: 'Critical findings only' },
                      ],
                    },
                  ],
                  confirmLabel: 'Save Settings',
                  successToast: 'Notification settings saved',
                  successDescription: 'You will be notified based on your preferences.',
                  onConfirm: () => {},
                })
              }
            >
              <Bell className="w-3.5 h-3.5" /> Alerts
            </Button>
            <Button
              size="sm"
              className="gap-1.5 h-9 text-xs bg-gold text-navy border border-gold font-semibold"
              onClick={() =>
                action.open({
                  tone: 'primary',
                  icon: Plus,
                  title: 'Schedule New Audit',
                  description: 'Create a new recurring or one-time audit. Linked controls, policies, and risks will be included in the scope.',
                  context: [
                    { label: 'Existing schedules', value: AUDIT_SCHEDULES.length },
                  ],
                  fields: [
                    {
                      type: 'select', name: 'category', label: 'Audit category', required: true,
                      defaultValue: 'CONTROLS',
                      options: [
                        { value: 'CONTROLS', label: 'Controls Audit' },
                        { value: 'RISK', label: 'Risk Audit' },
                        { value: 'COMPLIANCE', label: 'Compliance Audit' },
                      ],
                    },
                    {
                      type: 'select', name: 'frequency', label: 'Recurrence', required: true,
                      defaultValue: 'MONTHLY',
                      options: [
                        { value: 'DAILY', label: 'Daily' },
                        { value: 'WEEKLY', label: 'Weekly' },
                        { value: 'BI_WEEKLY', label: 'Bi-Weekly' },
                        { value: 'MONTHLY', label: 'Monthly' },
                        { value: 'QUARTERLY', label: 'Quarterly' },
                        { value: 'ANNUAL', label: 'Annual' },
                        { value: 'PER_EVENT', label: 'Per Event (triggered)' },
                      ],
                    },
                    {
                      type: 'select', name: 'program', label: 'Program scope', required: true,
                      defaultValue: 'All',
                      options: [
                        { value: 'All', label: 'All Programs (Portfolio)' },
                        { value: 'NA-West', label: 'NA-West' },
                        { value: 'NA-East', label: 'NA-East' },
                        { value: 'EMEA', label: 'EMEA' },
                        { value: 'APAC', label: 'APAC' },
                      ],
                    },
                    {
                      type: 'textarea', name: 'scope', label: 'Audit scope description', rows: 2, required: true,
                      defaultValue: '',
                    },
                  ],
                  confirmLabel: 'Schedule Audit',
                  successToast: 'Audit scheduled',
                  successDescription: 'The new audit has been added to the schedule and owners have been notified.',
                  onConfirm: () => {},
                })
              }
            >
              <Plus className="w-3.5 h-3.5" /> Schedule Audit
            </Button>
          </div>
        </div>

        {/* Category + status filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 flex-wrap">
          {!categoryFilter && (
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
              {(['ALL', 'CONTROLS', 'RISK', 'COMPLIANCE'] as const).map((cat) => {
                const Icon = cat === 'ALL' ? BarChart3 : CATEGORY_ICONS[cat]
                const meta = cat !== 'ALL' ? categoryMeta[cat] : null
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all',
                      selectedCategory === cat ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat === 'ALL' ? 'All' : meta?.label.replace(' Audit', '') ?? cat}
                  </button>
                )
              })}
            </div>
          )}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ScheduledAuditStatus | 'ALL')}
            className="text-[12px] rounded-lg border border-line bg-secondary text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          <span className="text-[11px] text-muted-foreground ml-auto">
            {filtered.length} audit{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Audit schedule cards */}
      <div className="space-y-2.5">
        {filtered.map((sched, idx) => {
          const status = scheduledStates[sched.id] ?? sched.status
          const sb = scheduledStatusBadge[status]
          const cm = categoryMeta[sched.category]
          const CatIcon = CATEGORY_ICONS[sched.category]
          const isExpanded = expandedId === sched.id
          const isQueued = runQueued.has(sched.id)

          return (
            <motion.div
              key={sched.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04, ease }}
              className="bg-card rounded-xl border border-line overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : sched.id)}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left hover:bg-secondary/30 transition-colors"
              >
                <ChevronDown className={cn('w-4 h-4 text-muted-foreground shrink-0 transition-transform', isExpanded && 'rotate-180')} />

                {/* Category icon */}
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border', cm.cls)}>
                  <CatIcon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-muted-foreground">{sched.id}</span>
                    <span className={cn('px-1.5 py-0.5 rounded border text-[9px] font-semibold', cm.cls)}>{cm.label}</span>
                    <span className="px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-line text-[9px] font-semibold flex items-center gap-1">
                      <Repeat className="w-2.5 h-2.5" />
                      {frequencyLabel[sched.frequency]}
                    </span>
                    {sched.autoTrigger && (
                      <span className="px-1.5 py-0.5 rounded bg-teal/10 text-teal border border-teal/20 text-[9px] font-semibold flex items-center gap-1">
                        <PulseIndicator color="bg-teal" size="w-1 h-1" /> Auto
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate mt-0.5">{sched.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{sched.program} · {sched.assignedOwnerName} · Next: {sched.nextRunDate}</p>
                </div>

                {/* Status + completion */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  {sched.completionRate > 0 && (
                    <div className="min-w-[80px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-muted-foreground">Complete</span>
                        <span className="text-[11px] font-mono font-semibold text-foreground">{sched.completionRate}%</span>
                      </div>
                      <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <GrowBar
                          widthPct={sched.completionRate}
                          className={cn('h-full rounded-full', sched.completionRate >= 80 ? 'bg-green' : sched.completionRate >= 50 ? 'bg-amber' : 'bg-red')}
                        />
                      </div>
                    </div>
                  )}
                  {sched.findingsCount > 0 && (
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">Findings</p>
                      <p className={cn('text-sm font-mono font-bold', sched.criticalFindings > 0 ? 'text-red' : 'text-amber')}>
                        {sched.findingsCount}
                        {sched.criticalFindings > 0 && <span className="text-[10px] text-red ml-1">({sched.criticalFindings} crit)</span>}
                      </p>
                    </div>
                  )}
                  <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-semibold', sb.cls)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', sb.dot)} />
                    {sb.label}
                  </span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-line bg-secondary/10">
                      {/* Description */}
                      <p className="text-[12.5px] text-muted-foreground leading-relaxed mt-3 mb-4">{sched.description}</p>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Last Run</p>
                          <p className="text-[12.5px] font-medium text-foreground">{sched.lastRunDate ?? 'Not run yet'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Next Run</p>
                          <p className={cn('text-[12.5px] font-medium', status === 'OVERDUE' ? 'text-red' : 'text-foreground')}>{sched.nextRunDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Auditor Role</p>
                          <p className="text-[12.5px] font-medium text-foreground">{sched.auditorRole}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Notify On Complete</p>
                          <p className="text-[12px] text-foreground">{sched.notifyOnComplete.join(', ')}</p>
                        </div>
                      </div>

                      {/* Scope */}
                      <div className="rounded-lg border border-line bg-card p-3 mb-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Audit Scope</p>
                        <p className="text-[12.5px] text-foreground leading-snug">{sched.scope}</p>
                      </div>

                      {/* Linked entities */}
                      {(sched.linkedControlIds.length > 0 || sched.linkedPolicyIds.length > 0 || sched.linkedRiskIds.length > 0) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {sched.linkedControlIds.map((id) => (
                            <span key={id} className="px-2 py-1 rounded-md bg-gold/10 text-gold border border-gold/25 text-[10px] font-mono font-semibold">{id}</span>
                          ))}
                          {sched.linkedPolicyIds.map((id) => (
                            <span key={id} className="px-2 py-1 rounded-md bg-navy/10 text-navy dark:bg-navy/30 dark:text-foreground/70 border border-navy/20 text-[10px] font-mono font-semibold">{id}</span>
                          ))}
                          {sched.linkedRiskIds.map((id) => (
                            <span key={id} className="px-2 py-1 rounded-md bg-red-bg text-red border border-red/25 text-[10px] font-mono font-semibold">{id}</span>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[11px] gap-1.5 border-line"
                          onClick={() =>
                            action.open({
                              tone: 'info',
                              icon: RefreshCw,
                              title: `Edit Schedule — ${sched.id}`,
                              description: `Modify the recurrence, scope, or ownership of this audit.`,
                              context: [
                                { label: 'Current frequency', value: frequencyLabel[sched.frequency] },
                                { label: 'Next run', value: sched.nextRunDate },
                                { label: 'Assigned owner', value: sched.assignedOwnerName },
                              ],
                              fields: [
                                {
                                  type: 'select', name: 'frequency', label: 'Recurrence', required: true,
                                  defaultValue: sched.frequency,
                                  options: [
                                    { value: 'DAILY', label: 'Daily' },
                                    { value: 'WEEKLY', label: 'Weekly' },
                                    { value: 'BI_WEEKLY', label: 'Bi-Weekly' },
                                    { value: 'MONTHLY', label: 'Monthly' },
                                    { value: 'QUARTERLY', label: 'Quarterly' },
                                    { value: 'ANNUAL', label: 'Annual' },
                                    { value: 'PER_EVENT', label: 'Per Event' },
                                  ],
                                },
                                {
                                  type: 'textarea', name: 'notes', label: 'Change notes', rows: 2, required: false,
                                  defaultValue: '',
                                },
                              ],
                              confirmLabel: 'Save Changes',
                              successToast: 'Schedule updated',
                              successDescription: `${sched.id} has been updated.`,
                              onConfirm: () => {},
                            })
                          }
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Edit Schedule
                        </Button>
                        <Button
                          size="sm"
                          className={cn(
                            'h-8 text-[11px] gap-1.5 font-semibold',
                            isQueued ? 'bg-green/15 text-green border border-green/30' : 'bg-gold text-navy border border-gold'
                          )}
                          onClick={() =>
                            action.open({
                              tone: status === 'OVERDUE' ? 'warning' : 'primary',
                              icon: Play,
                              title: `Run Audit Now — ${sched.id}`,
                              description: `Trigger an immediate audit run for: ${sched.title}`,
                              context: [
                                { label: 'Category', value: categoryMeta[sched.category].label },
                                { label: 'Scope', value: sched.scope },
                                { label: 'Auditor', value: sched.auditorRole },
                                { label: 'Status', value: status },
                              ],
                              fields: [
                                {
                                  type: 'select', name: 'mode', label: 'Run mode', required: true,
                                  defaultValue: 'standard',
                                  options: [
                                    { value: 'standard', label: 'Standard — full scope as defined' },
                                    { value: 'express', label: 'Express — priority control points only' },
                                    { value: 'deep', label: 'Deep — include full evidence capture' },
                                  ],
                                },
                              ],
                              confirmLabel: 'Start Audit',
                              successToast: 'Audit run queued',
                              successDescription: `${sched.id} has been queued for immediate execution.`,
                              onConfirm: () => {
                                setRunQueued((prev) => new Set(prev).add(sched.id))
                                setScheduledStates((prev) => ({ ...prev, [sched.id]: 'IN_PROGRESS' }))
                              },
                            })
                          }
                        >
                          {isQueued ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {isQueued ? 'Queued' : 'Run Now'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-card rounded-xl border border-line p-8 text-center shadow-sm">
            <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-[13px] font-medium text-foreground mb-1">No audits match the current filters</p>
            <p className="text-[12px] text-muted-foreground">Try adjusting the category or status filters.</p>
          </div>
        )}
      </div>

      {action.element}
    </div>
  )
}
