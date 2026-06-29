'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  CalendarDays, List, ChevronLeft, ChevronRight, Bot, AlertTriangle,
  CheckCircle2, Clock, Eye, Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeUp } from '@/components/animated-primitives'
import { OccurrenceDetail } from '@/components/governance/occurrence-detail'
import {
  type AuditSchedule, type AuditOccurrence, type AuditType,
  occurrenceStatusBadge, overallResultBadge, scheduleStatusBadge,
} from '@/lib/governance-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

interface KPI {
  label: string
  value: string | number
  sub: string
  tone: 'gold' | 'green' | 'red' | 'amber' | 'teal' | 'navy'
  icon: React.ElementType
}

interface AuditShellProps {
  type: AuditType
  accentColor: string      // Tailwind class e.g. "text-gold" for active tab
  accentBg: string         // e.g. "bg-gold"
  accentBorder: string     // e.g. "border-gold"
  schedules: AuditSchedule[]
  occurrences: AuditOccurrence[]
  kpis: KPI[]
  schedulePageHref: string // Path to schedule page, e.g. "/controls-audit/schedule"
  currentUserRole?: string
  renderScheduleExtra?: (s: AuditSchedule) => React.ReactNode
  extraContent?: React.ReactNode
}

function SchedulesTab({ schedules, type, renderExtra, schedulePageHref }: { schedules: AuditSchedule[]; type: AuditType; renderExtra?: (s: AuditSchedule) => React.ReactNode; schedulePageHref: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-muted-foreground">{schedules.length} active schedule{schedules.length !== 1 ? 's' : ''}</p>
        <Link href={schedulePageHref}>
          <Button
            size="sm"
            className="h-9 text-[12px] bg-gold text-navy border border-gold font-semibold gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />New Audit Schedule
          </Button>
        </Link>
      </div>
      <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-secondary/30">
                {['Schedule', 'Scope', 'Frequency', 'Next Run', 'Auditor', 'Owner', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {schedules.map((s, i) => {
                const ssb = scheduleStatusBadge(s.status)
                return (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03, ease }}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-mono text-muted-foreground block">{s.id}</span>
                      <p className="text-[12.5px] font-semibold text-foreground max-w-[220px] truncate">{s.name}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-[11.5px] text-muted-foreground">{s.scopeProjects.length} project{s.scopeProjects.length !== 1 ? 's' : ''}</p>
                      <p className="text-[11px] text-muted-foreground">{s.scopeItemIds.length} item{s.scopeItemIds.length !== 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-secondary border border-line text-[10.5px] font-semibold text-foreground">{s.frequency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-mono text-foreground">{s.nextRun}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-[12px] text-foreground">{s.assignedAuditorName}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-[12px] text-foreground">{s.accountableOwnerName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded border text-[10px] font-semibold', ssb.cls)}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {renderExtra?.(s)}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function OccurrencesTab({ occurrences, currentUserRole }: { occurrences: AuditOccurrence[]; currentUserRole?: string }) {
  const [selected, setSelected] = React.useState<AuditOccurrence | null>(null)
  const [statusFilter, setStatusFilter] = React.useState('All')

  const filtered = statusFilter === 'All' ? occurrences : occurrences.filter((o) => o.status === statusFilter)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-[12px] rounded-lg border border-line bg-secondary text-foreground px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <option value="All">All Statuses</option>
          {['Scheduled', 'In Progress', 'Pending Review', 'Completed', 'Overdue'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-[11px] text-muted-foreground">{filtered.length} occurrence{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-secondary/30">
                {['ID', 'Scope', 'Due Date', 'Auditor', 'Status', 'Result', 'Findings', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((occ, i) => {
                const sb = occurrenceStatusBadge(occ.status)
                return (
                  <motion.tr
                    key={occ.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03, ease }}
                    className="hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => setSelected(occ)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-muted-foreground">{occ.id}</span>
                        {occ.isAutoGenerated && (
                          <span className="px-1 py-0.5 rounded bg-teal/10 text-teal border border-teal/20 text-[8.5px] font-semibold flex items-center gap-0.5">
                            <Bot className="w-2 h-2" />A-206
                          </span>
                        )}
                        {occ.isAtRisk && (
                          <span className="px-1 py-0.5 rounded bg-amber-bg text-amber border border-amber/30 text-[8.5px] font-semibold">At Risk</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-medium text-foreground truncate max-w-[160px]">{occ.scheduleName}</p>
                      <p className="text-[11px] text-muted-foreground">{occ.projectNames.slice(0, 2).join(', ')}{occ.projectNames.length > 2 ? ` +${occ.projectNames.length - 2}` : ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[12px] font-mono', occ.status === 'Overdue' ? 'text-red font-semibold' : 'text-foreground')}>{occ.dueDate}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[12px] text-foreground">{occ.auditorName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold', sb.cls)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sb.dot)} />{sb.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {occ.overallResult ? (
                        <span className={cn('px-2 py-0.5 rounded border text-[10px] font-semibold', overallResultBadge(occ.overallResult).cls)}>
                          {occ.overallResult}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {occ.findings.length > 0 ? (
                        <span className={cn(
                          'text-[12px] font-mono font-bold',
                          occ.findings.some((f) => f.severity === 'Critical') ? 'text-red' : 'text-amber'
                        )}>
                          {occ.findings.length}
                        </span>
                      ) : <span className="text-[11px] text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(occ) }}
                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <OccurrenceDetail
            occurrence={selected}
            onClose={() => setSelected(null)}
            currentUserRole={currentUserRole}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CalendarTab({ occurrences }: { occurrences: AuditOccurrence[] }) {
  const [year, setYear] = React.useState(2026)
  const [month, setMonth] = React.useState(6) // 0-based: 6 = July
  const [selected, setSelected] = React.useState<AuditOccurrence | null>(null)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1)

  const byDay = occurrences.reduce<Record<number, AuditOccurrence[]>>((acc, o) => {
    const d = new Date(o.dueDate)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      acc[day] = [...(acc[day] ?? []), o]
    }
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-line px-5 py-3 shadow-sm">
        <button
          onClick={() => { if (month === 0) { setMonth(11); setYear(year - 1) } else setMonth(month - 1) }}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <p className="text-[14px] font-semibold text-foreground">{MONTHS[month]} {year}</p>
        <button
          onClick={() => { if (month === 11) { setMonth(0); setYear(year + 1) } else setMonth(month + 1) }}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Grid */}
      <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-line">
          {DAYS_SHORT.map((d) => (
            <div key={d} className="py-2 text-center text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{d}</div>
          ))}
        </div>
        {/* Cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dayOccs = day ? (byDay[day] ?? []) : []
            const hasOverdue = dayOccs.some((o) => o.status === 'Overdue')
            const hasInProgress = dayOccs.some((o) => o.status === 'In Progress')
            return (
              <div
                key={idx}
                className={cn(
                  'min-h-[72px] border-b border-r border-line p-1.5 text-[11px]',
                  day ? 'hover:bg-secondary/30 cursor-pointer' : 'bg-secondary/10',
                  !day && 'text-transparent'
                )}
                onClick={() => day && dayOccs.length > 0 && setSelected(dayOccs[0])}
              >
                <span className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center font-semibold mb-1 text-[11px]',
                  hasOverdue ? 'bg-red text-white' : hasInProgress ? 'bg-amber text-white' : dayOccs.length > 0 ? 'bg-gold text-navy' : 'text-foreground'
                )}>
                  {day ?? ''}
                </span>
                <div className="space-y-0.5">
                  {dayOccs.slice(0, 2).map((o) => {
                    const sb = occurrenceStatusBadge(o.status)
                    return (
                      <div key={o.id} className={cn('rounded px-1 py-0.5 text-[9px] font-semibold truncate border', sb.cls)}>
                        {o.scheduleName.slice(0, 18)}
                      </div>
                    )
                  })}
                  {dayOccs.length > 2 && (
                    <span className="text-[9px] text-muted-foreground">+{dayOccs.length - 2} more</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <OccurrenceDetail occurrence={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export function AuditShell({
  type, accentColor, accentBg, schedules, occurrences, kpis, schedulePageHref, currentUserRole, renderScheduleExtra, extraContent,
}: AuditShellProps) {
  const [tab, setTab] = React.useState<'schedules' | 'occurrences' | 'calendar'>('schedules')
  const tabs = [
    { id: 'schedules' as const, label: 'Schedules', icon: CalendarDays },
    { id: 'occurrences' as const, label: 'Occurrences', icon: List },
    { id: 'calendar' as const, label: 'Calendar', icon: CalendarDays },
  ]

  const toneMap = {
    gold: { bg: 'bg-gold/15', text: 'text-gold' },
    green: { bg: 'bg-green-bg', text: 'text-green' },
    red: { bg: 'bg-red-bg', text: 'text-red' },
    amber: { bg: 'bg-amber-bg', text: 'text-amber' },
    teal: { bg: 'bg-teal/10', text: 'text-teal' },
    navy: { bg: 'bg-navy/10', text: 'text-navy' },
  }

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {kpis.map((k, i) => {
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

      {/* Tab strip */}
      <div className="flex items-center gap-1 p-1 bg-card border border-line rounded-xl shadow-sm overflow-x-auto">
        {tabs.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition-all',
                active ? `${accentBg} text-white shadow-sm` : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <t.icon className="w-3.5 h-3.5" />
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
        {tab === 'schedules' && <SchedulesTab schedules={schedules} type={type} renderExtra={renderScheduleExtra} schedulePageHref={schedulePageHref} />}
        {tab === 'occurrences' && <OccurrencesTab occurrences={occurrences} currentUserRole={currentUserRole} />}
        {tab === 'calendar' && <CalendarTab occurrences={occurrences} />}
      </motion.div>

      {/* Extra content (compliance register, etc.) */}
      {extraContent}
    </div>
  )
}
