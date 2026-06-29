'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Users, UserCheck, Search, Filter, ChevronDown, AlertTriangle,
  Clock, CheckCircle2, ArrowUpRight, Layers, BarChart3, UserPlus,
  Edit3, Trash2, Shield, CalendarDays,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GrowBar, FadeUp } from '@/components/animated-primitives'
import {
  CONTROL_OWNERS, CONTROL_ASSIGNMENTS,
  coverageBadge, ownerStatusBadge, resultBadge,
  type ControlAssignment, type OwnerStatus,
} from '@/lib/controls-data'
import { useActionModal } from '@/hooks/use-action-modal'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const STATUS_FILTER_OPTIONS: { value: OwnerStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending Review' },
  { value: 'ESCALATED', label: 'Escalated' },
  { value: 'OVERDUE', label: 'Overdue' },
]

const PROGRAM_FILTER_OPTIONS = ['All', 'NA-East', 'NA-West', 'EMEA', 'APAC']

export function ControlsLibrary() {
  const action = useActionModal()
  const [view, setView] = React.useState<'assignments' | 'owners'>('assignments')
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<OwnerStatus | 'ALL'>('ALL')
  const [programFilter, setProgramFilter] = React.useState('All')
  const [expandedOwner, setExpandedOwner] = React.useState<string | null>(null)
  const [assignmentStates, setAssignmentStates] = React.useState<Record<string, OwnerStatus>>({})

  const filtered = CONTROL_ASSIGNMENTS.filter((a) => {
    const search_ = search.toLowerCase()
    const matchesSearch = !search ||
      a.controlTitle.toLowerCase().includes(search_) ||
      a.controlId.toLowerCase().includes(search_) ||
      a.ownerName.toLowerCase().includes(search_) ||
      a.projectCode.toLowerCase().includes(search_)
    const matchesStatus = statusFilter === 'ALL' || (assignmentStates[a.id] ?? a.status) === statusFilter
    const matchesProgram = programFilter === 'All' || a.program === programFilter || a.program === 'All'
    return matchesSearch && matchesStatus && matchesProgram
  })

  const overdueCount = CONTROL_ASSIGNMENTS.filter((a) => (assignmentStates[a.id] ?? a.status) === 'OVERDUE').length
  const escalatedCount = CONTROL_ASSIGNMENTS.filter((a) => (assignmentStates[a.id] ?? a.status) === 'ESCALATED').length
  const activeCount = CONTROL_ASSIGNMENTS.filter((a) => (assignmentStates[a.id] ?? a.status) === 'ACTIVE').length

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Assignments', value: CONTROL_ASSIGNMENTS.length, icon: Layers, tone: 'gold' as const },
          { label: 'Active', value: activeCount, icon: CheckCircle2, tone: 'green' as const },
          { label: 'Overdue', value: overdueCount, icon: AlertTriangle, tone: 'red' as const },
          { label: 'Escalated', value: escalatedCount, icon: ArrowUpRight, tone: 'amber' as const },
        ].map((kpi, i) => {
          const toneMap = {
            gold: { text: 'text-gold', bg: 'bg-gold/15', val: 'text-gold' },
            green: { text: 'text-green', bg: 'bg-green-bg', val: 'text-green' },
            red: { text: 'text-red', bg: 'bg-red-bg', val: 'text-red' },
            amber: { text: 'text-amber', bg: 'bg-amber-bg', val: 'text-amber' },
          }[kpi.tone]
          return (
            <FadeUp key={kpi.label} delay={i * 0.05}>
              <div className="bg-card rounded-xl border border-line p-4 shadow-sm flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', toneMap.bg)}>
                  <kpi.icon className={cn('w-4 h-4', toneMap.text)} />
                </div>
                <div>
                  <p className={cn('text-2xl font-mono font-bold leading-none', toneMap.val)}>{kpi.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{kpi.label}</p>
                </div>
              </div>
            </FadeUp>
          )
        })}
      </div>

      {/* Header + controls */}
      <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Controls Library — Owner Assignment</h3>
              <p className="text-[11px] text-muted-foreground">
                Assign control responsibility to owners for specific projects and programs
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="gap-1.5 shrink-0 bg-gold text-navy border border-gold font-semibold h-9 text-xs"
            onClick={() =>
              action.open({
                tone: 'primary',
                icon: UserPlus,
                title: 'Assign Control Owner',
                description: 'Assign a named owner to a specific control for a project or program. The owner will be responsible for attestation, monitoring, and escalation.',
                context: [
                  { label: 'Available owners', value: CONTROL_OWNERS.length },
                  { label: 'Unassigned controls', value: 0 },
                ],
                fields: [
                  {
                    type: 'select', name: 'control', label: 'Control', required: true,
                    defaultValue: 'CTRL-003',
                    options: [
                      { value: 'CTRL-003', label: 'CTRL-003 — No construction-start without permit' },
                      { value: 'CTRL-004', label: 'CTRL-004 — Certify data provenance' },
                      { value: 'CTRL-008', label: 'CTRL-008 — STB AHJ sustainability gate' },
                      { value: 'CTRL-012', label: 'CTRL-012 — Escalation fires on SLA breach' },
                    ],
                  },
                  {
                    type: 'select', name: 'owner', label: 'Assign Owner', required: true,
                    defaultValue: 'OWN-001',
                    options: CONTROL_OWNERS.map((o) => ({ value: o.id, label: `${o.name} — ${o.serviceRole}` })),
                  },
                  {
                    type: 'select', name: 'tier', label: 'Ownership Tier', required: true,
                    defaultValue: 'PRIMARY',
                    options: [
                      { value: 'PRIMARY', label: 'Primary — accountable owner' },
                      { value: 'SECONDARY', label: 'Secondary — backup coverage' },
                      { value: 'DELEGATE', label: 'Delegate — temporary cover' },
                    ],
                  },
                  {
                    type: 'textarea', name: 'notes', label: 'Assignment notes', rows: 2, required: false,
                    defaultValue: '',
                  },
                ],
                confirmLabel: 'Assign Owner',
                successToast: 'Control owner assigned',
                successDescription: 'The assignment has been recorded and the owner has been notified.',
                onConfirm: () => {},
              })
            }
          >
            <UserPlus className="w-3.5 h-3.5" /> Assign Owner
          </Button>
        </div>

        {/* View toggle + filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
            {(['assignments', 'owners'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1 rounded-md text-[12px] font-medium transition-all capitalize',
                  view === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {v === 'assignments' ? 'Assignments' : 'Owner Directory'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search controls, owners, projects…"
                className="w-full pl-8 pr-3 py-1 text-[11px] rounded-lg border border-line bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OwnerStatus | 'ALL')}
              className="text-[13px] rounded-lg border border-line bg-secondary text-foreground px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-gold"
            >
              {STATUS_FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="text-[13px] rounded-lg border border-line bg-secondary text-foreground px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-gold"
            >
              {PROGRAM_FILTER_OPTIONS.map((p) => (
                <option key={p} value={p}>{p === 'All' ? 'All Programs' : p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assignments Table View */}
      {view === 'assignments' && (
        <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-line flex items-center justify-between">
            <p className="text-[12px] font-semibold text-foreground">
              {filtered.length} assignment{filtered.length !== 1 ? 's' : ''} shown
            </p>
            <span className="text-[10px] text-muted-foreground">Sorted by priority · critical first</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line bg-secondary/30">
                  <th className="text-left px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Control</th>
                  <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Project / Program</th>
                  <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Owner</th>
                  <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Last Attestation</th>
                  <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Next Review</th>
                  <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <AnimatePresence initial={false}>
                  {filtered
                    .slice()
                    .sort((a, b) => b.priority - a.priority)
                    .map((asgn, i) => {
                      const status = assignmentStates[asgn.id] ?? asgn.status
                      const sb = ownerStatusBadge[status]
                      const tierCls = {
                        PRIMARY: 'bg-gold/15 text-gold border-gold/30',
                        SECONDARY: 'bg-teal/10 text-teal border-teal/20',
                        DELEGATE: 'bg-secondary text-muted-foreground border-line',
                      }[asgn.tier]
                      return (
                        <motion.tr
                          key={asgn.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.03, ease }}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-start gap-2">
                              <div className={cn(
                                'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0',
                                asgn.priority >= 5 ? 'bg-red' : asgn.priority >= 4 ? 'bg-amber' : 'bg-teal'
                              )} />
                              <div className="min-w-0">
                                <span className="text-[10px] font-mono text-muted-foreground block">{asgn.controlId}</span>
                                <p className="text-[12.5px] font-medium text-foreground leading-snug max-w-[280px] truncate">{asgn.controlTitle}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <p className="text-[12px] font-semibold text-foreground">{asgn.projectCode}</p>
                            <p className="text-[10.5px] text-muted-foreground">{asgn.program}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/35 flex items-center justify-center shrink-0">
                                <span className="text-[9px] font-bold text-gold">
                                  {asgn.ownerName.split(' ').map((n) => n[0]).join('')}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-foreground truncate">{asgn.ownerName}</p>
                                <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-semibold', tierCls)}>
                                  {asgn.tier}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            {asgn.lastAttestation ? (
                              <span className="text-[12px] text-foreground font-mono">{asgn.lastAttestation}</span>
                            ) : (
                              <span className="text-[11px] text-red italic">Never</span>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="text-[12px] text-foreground font-mono">{asgn.nextReview}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-semibold', sb.cls)}>
                              <span className={cn('w-1.5 h-1.5 rounded-full', sb.dot)} />
                              {sb.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  action.open({
                                    tone: status === 'OVERDUE' || status === 'ESCALATED' ? 'warning' : 'primary',
                                    icon: Edit3,
                                    title: `Update Assignment — ${asgn.controlId}`,
                                    description: `Manage ownership assignment for ${asgn.controlTitle}`,
                                    context: [
                                      { label: 'Current owner', value: asgn.ownerName },
                                      { label: 'Project', value: asgn.projectCode },
                                      { label: 'Status', value: status },
                                      { label: 'Last attestation', value: asgn.lastAttestation ?? 'Never' },
                                    ],
                                    fields: [
                                      {
                                        type: 'select', name: 'action', label: 'Action', required: true,
                                        defaultValue: 'attest',
                                        options: [
                                          { value: 'attest', label: 'Record attestation — mark as reviewed today' },
                                          { value: 'reassign', label: 'Reassign to new owner' },
                                          { value: 'escalate', label: 'Escalate to Portfolio Controls Lead' },
                                          { value: 'close', label: 'Mark resolved and close' },
                                        ],
                                      },
                                      {
                                        type: 'textarea', name: 'notes', label: 'Notes', rows: 2, required: false,
                                        defaultValue: asgn.notes,
                                      },
                                    ],
                                    confirmLabel: 'Update Assignment',
                                    successToast: 'Assignment updated',
                                    successDescription: `${asgn.controlId} assignment has been updated.`,
                                    onConfirm: (values) => {
                                      if (values.action === 'attest') {
                                        setAssignmentStates((prev) => ({ ...prev, [asgn.id]: 'ACTIVE' }))
                                      } else if (values.action === 'escalate') {
                                        setAssignmentStates((prev) => ({ ...prev, [asgn.id]: 'ESCALATED' }))
                                      } else if (values.action === 'close') {
                                        setAssignmentStates((prev) => ({ ...prev, [asgn.id]: 'ACTIVE' }))
                                      }
                                    },
                                  })
                                }
                                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-[12px] text-muted-foreground">
                      No assignments match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Owner Directory View */}
      {view === 'owners' && (
        <div className="space-y-3">
          {CONTROL_OWNERS.map((owner, idx) => {
            const ownerAssignments = CONTROL_ASSIGNMENTS.filter((a) => a.ownerId === owner.id)
            const isExpanded = expandedOwner === owner.id
            return (
              <motion.div
                key={owner.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04, ease }}
                className="bg-card rounded-xl border border-line overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setExpandedOwner(isExpanded ? null : owner.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/25 to-gold/10 border border-gold/35 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-gold">{owner.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{owner.name}</p>
                    <p className="text-[11px] text-muted-foreground">{owner.serviceRole} · {owner.program}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-[11px] text-muted-foreground mb-0.5">Controls</p>
                      <p className="text-[15px] font-mono font-bold text-foreground">{owner.activeControls}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] text-muted-foreground mb-0.5">Overdue</p>
                      <p className={cn('text-[15px] font-mono font-bold', owner.overdueControls > 0 ? 'text-red' : 'text-green')}>
                        {owner.overdueControls}
                      </p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <p className="text-[11px] text-muted-foreground mb-1">Workload</p>
                      <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', owner.capacity >= 85 ? 'bg-red' : owner.capacity >= 70 ? 'bg-amber' : 'bg-green')}
                          style={{ width: `${owner.capacity}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{owner.capacity}%</p>
                    </div>
                  </div>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform shrink-0', isExpanded && 'rotate-180')} />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-2 border-t border-line bg-secondary/20">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-[11px]">
                          <div>
                            <p className="text-muted-foreground">Region</p>
                            <p className="font-semibold text-foreground mt-0.5">{owner.region}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-semibold text-foreground mt-0.5">{owner.email}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Active Assignments</p>
                            <p className="font-semibold text-foreground mt-0.5">{ownerAssignments.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Capacity Utilization</p>
                            <p className={cn('font-bold mt-0.5', owner.capacity >= 85 ? 'text-red' : owner.capacity >= 70 ? 'text-amber' : 'text-green')}>
                              {owner.capacity}%
                            </p>
                          </div>
                        </div>
                        {ownerAssignments.length > 0 && (
                          <>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                              Assigned Controls ({ownerAssignments.length})
                            </p>
                            <div className="space-y-2">
                              {ownerAssignments.map((a) => {
                                const status = assignmentStates[a.id] ?? a.status
                                const sb = ownerStatusBadge[status]
                                return (
                                  <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-card border border-line">
                                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">{a.controlId}</span>
                                    <span className="text-[12px] text-foreground flex-1 min-w-0 truncate">{a.controlTitle}</span>
                                    <span className="text-[10px] text-muted-foreground hidden md:inline shrink-0">{a.projectCode}</span>
                                    <span className={cn('shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-semibold', sb.cls)}>
                                      <span className={cn('w-1 h-1 rounded-full', sb.dot)} />
                                      {sb.label}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </>
                        )}
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-[11px] gap-1.5 border-line"
                            onClick={() =>
                              action.open({
                                tone: owner.overdueControls > 0 ? 'warning' : 'primary',
                                icon: UserCheck,
                                title: `Manage Owner — ${owner.name}`,
                                description: 'Update workload, reassign controls, or escalate overdue items.',
                                context: [
                                  { label: 'Service role', value: owner.serviceRole },
                                  { label: 'Active controls', value: owner.activeControls },
                                  { label: 'Overdue', value: owner.overdueControls },
                                  { label: 'Capacity', value: `${owner.capacity}%` },
                                ],
                                fields: [
                                  {
                                    type: 'select', name: 'action', label: 'Action', required: true,
                                    defaultValue: 'review',
                                    options: [
                                      { value: 'review', label: 'Request owner workload review' },
                                      { value: 'redistribute', label: 'Redistribute overdue controls' },
                                      { value: 'escalate_all', label: 'Escalate all overdue to Portfolio Controls Lead' },
                                    ],
                                  },
                                ],
                                confirmLabel: 'Apply',
                                successToast: 'Owner action applied',
                                successDescription: `Action queued for ${owner.name}.`,
                                onConfirm: () => {},
                              })
                            }
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Manage Owner
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {action.element}
    </div>
  )
}
