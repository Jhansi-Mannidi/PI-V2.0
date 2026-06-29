'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ChevronDown, ChevronRight, Search, Filter, Plus,
  Shield, AlertTriangle, Scale, Calendar, Clock, User, Users,
  MapPin, FileText, CheckCircle2, AlertCircle, Pause, Ban,
  TrendingUp, Activity, ChevronUp, ExternalLink, MessageSquare,
  GitBranch, Layers, Info, Target, BookOpen, Building2,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  useAuditStore,
  type RichAuditSchedule,
  type LifecycleStage,
} from '@/lib/audit-store'
import {
  PROJECTS, USERS,
  CONTROLS, RISK_ITEMS, COMPLIANCE_ITEMS,
  type AuditType,
  type ScheduleStatus,
} from '@/lib/governance-data'

// ── Constants ────────────────────────────────────────────────────────────────
const ease = [0.25, 0.46, 0.45, 0.94] as const

const TYPE_META: Record<AuditType, { label: string; Icon: React.ElementType; color: string; bg: string; border: string }> = {
  controls:   { label: 'Controls Audit',   Icon: Shield,        color: 'text-gold',  bg: 'bg-gold/10',  border: 'border-gold/30' },
  risk:       { label: 'Risk Audit',        Icon: AlertTriangle, color: 'text-amber', bg: 'bg-amber-bg', border: 'border-amber/30' },
  compliance: { label: 'Compliance Audit',  Icon: Scale,         color: 'text-teal',  bg: 'bg-teal/10',  border: 'border-teal/30' },
}

const LIFECYCLE_META: Record<LifecycleStage, { color: string; bg: string; dot: string }> = {
  Draft:       { color: 'text-muted-foreground', bg: 'bg-secondary', dot: 'bg-muted-foreground' },
  Requested:   { color: 'text-amber',            bg: 'bg-amber-bg',  dot: 'bg-amber' },
  Approved:    { color: 'text-teal',             bg: 'bg-teal/10',   dot: 'bg-teal' },
  Scheduled:   { color: 'text-gold',             bg: 'bg-gold/10',   dot: 'bg-gold' },
  'In Progress':{ color: 'text-navy',            bg: 'bg-navy/8',    dot: 'bg-navy' },
  Completed:   { color: 'text-green',            bg: 'bg-green-bg',  dot: 'bg-green' },
  Paused:      { color: 'text-amber',            bg: 'bg-amber-bg',  dot: 'bg-amber' },
  Cancelled:   { color: 'text-red',              bg: 'bg-red-bg',    dot: 'bg-red' },
}

const STATUS_META: Record<ScheduleStatus, { color: string; bg: string }> = {
  Active: { color: 'text-green',             bg: 'bg-green-bg' },
  Paused: { color: 'text-amber',             bg: 'bg-amber-bg' },
  Ended:  { color: 'text-muted-foreground',  bg: 'bg-secondary' },
}

// ── Avatar helper ─────────────────────────────────────────────────────────
function Avatar({ name, initials, size = 'sm' }: { name: string; initials: string; size?: 'xs' | 'sm' | 'md' }) {
  const sz = size === 'xs' ? 'w-5 h-5 text-[9px]' : size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 text-xs'
  return (
    <div title={name} className={cn('rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center font-bold text-gold shrink-0', sz)}>
      {initials}
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className="w-3 h-3 text-gold shrink-0" />
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{children}</span>
    </div>
  )
}

// ── Scope Items Panel ─────────────────────────────────────────────────────
function ScopeItems({ s }: { s: RichAuditSchedule }) {
  const items = s.type === 'controls'
    ? s.scopeItemIds.map(id => ({ id, name: CONTROLS.find(c => c.id === id)?.name ?? id }))
    : s.type === 'risk'
    ? s.scopeItemIds.map(id => ({ id, name: RISK_ITEMS.find(r => r.id === id)?.title ?? id }))
    : s.scopeItemIds.map(id => ({ id, name: COMPLIANCE_ITEMS.find(c => c.id === id)?.requirement ?? id }))

  const projects = s.scopeProjects.map(id => PROJECTS.find(p => p.id === id)?.name ?? id)

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-1.5">Projects in scope</p>
        {projects.length === 0
          ? <p className="text-xs text-muted-foreground italic">All projects</p>
          : <div className="flex flex-wrap gap-1">
              {projects.map(p => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary border border-line text-foreground font-medium">{p}</span>
              ))}
            </div>
        }
      </div>
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-1.5">
          {s.type === 'controls' ? 'Controls' : s.type === 'risk' ? 'Risks' : 'Compliance items'} in scope ({items.length})
        </p>
        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-2 py-1 px-2 rounded-md bg-secondary/50 border border-line/60">
              <span className="text-[9px] font-mono font-bold text-gold shrink-0">{item.id}</span>
              <span className="text-[11px] text-foreground truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Audit Trail ───────────────────────────────────────────────────────────
function AuditTrail({ s }: { s: RichAuditSchedule }) {
  if (!s.trail || s.trail.length === 0) {
    return <p className="text-xs text-muted-foreground italic">No trail entries.</p>
  }
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-line" />
      <div className="space-y-3">
        {s.trail.map((entry, i) => (
          <div key={entry.id} className="flex items-start gap-3 relative pl-8">
            <div className="absolute left-0 w-7 h-7 rounded-full bg-card border border-line flex items-center justify-center z-10">
              <span className="text-[9px] font-bold text-gold">{entry.actorInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-foreground">{entry.actor}</span>
                <span className="text-[10px] text-muted-foreground">{entry.actorRole}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/10 text-gold font-semibold border border-gold/20">{entry.action}</span>
              </div>
              {entry.detail && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{entry.detail}</p>}
              <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(entry.ts).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Expandable Row Detail Panel ───────────────────────────────────────────
function DetailPanel({ s }: { s: RichAuditSchedule }) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'scope' | 'people' | 'trail' | 'comments'>('overview')
  const tm = TYPE_META[s.type]
  const lm = LIFECYCLE_META[s.lifecycle]
  const tabs = [
    { id: 'overview', label: 'Overview',  icon: Info },
    { id: 'scope',    label: 'Scope',     icon: Layers },
    { id: 'people',   label: 'People',    icon: Users },
    { id: 'trail',    label: 'Audit Trail', icon: GitBranch },
    { id: 'comments', label: 'Comments',  icon: MessageSquare },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease }}
      className="overflow-hidden border-t border-line bg-secondary/20"
    >
      <div className="px-5 pt-4 pb-5">
        {/* Tab bar */}
        <div className="flex items-center gap-0.5 mb-4 border-b border-line">
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold border-b-2 transition-all -mb-px',
                  active
                    ? 'border-gold text-gold'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {activeTab === 'overview' && (
            <>
              {/* WHAT */}
              <div className="space-y-3">
                <SectionLabel icon={Target}>What is this audit?</SectionLabel>
                <div className="rounded-xl border border-line bg-card p-4 space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mb-0.5">Audit ID</p>
                    <p className="text-sm font-mono font-bold text-gold">{s.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mb-0.5">Full Name</p>
                    <p className="text-sm font-semibold text-foreground leading-snug">{s.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mb-0.5">Type</p>
                    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold', tm.bg, tm.color, tm.border)}>
                      <tm.Icon className="w-3 h-3" />
                      {tm.label}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mb-0.5">Lifecycle stage</p>
                    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold', lm.bg, lm.color)}>
                      <div className={cn('w-1.5 h-1.5 rounded-full', lm.dot)} />
                      {s.lifecycle}
                    </div>
                  </div>
                </div>

                {/* WHY */}
                <SectionLabel icon={BookOpen}>Why does this audit exist?</SectionLabel>
                <div className="rounded-xl border border-line bg-card p-4 space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mb-1">Purpose</p>
                    <p className="text-[12px] text-foreground leading-relaxed">{s.purpose || 'No purpose defined.'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mb-0.5">Source module</p>
                    <p className="text-xs text-foreground">{s.sourceModule || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mb-0.5">Regulatory reference</p>
                    <p className="text-xs font-mono text-foreground">{s.regulatoryRef || '—'}</p>
                  </div>
                </div>
              </div>

              {/* WHEN & HOW */}
              <div className="space-y-3">
                <SectionLabel icon={Calendar}>When & how often?</SectionLabel>
                <div className="rounded-xl border border-line bg-card p-4 space-y-3">
                  {[
                    { label: 'Frequency',      value: s.frequency },
                    { label: 'Start date',     value: s.startDate },
                    { label: 'Time',           value: `${s.time} ${s.timezone}` },
                    { label: 'Next run',       value: s.nextRun, highlight: true },
                    { label: 'Last run',       value: s.lastRun ?? 'Not yet run' },
                    { label: 'Reminder lead',  value: `${s.reminderLeadDays} days before` },
                    { label: 'Grace period',   value: `${s.graceDays} days after due` },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-1 border-b border-line/50 last:border-0">
                      <span className="text-[11px] text-muted-foreground">{row.label}</span>
                      <span className={cn('text-[11px] font-semibold', row.highlight ? 'text-gold' : 'text-foreground')}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <SectionLabel icon={Activity}>Status & lifecycle</SectionLabel>
                <div className="rounded-xl border border-line bg-card p-4 space-y-3">
                  {[
                    { label: 'Schedule status', value: s.status },
                    { label: 'Created',         value: new Date(s.createdAt).toLocaleDateString() },
                    { label: 'Last updated',    value: new Date(s.updatedAt).toLocaleDateString() },
                    { label: 'Scope items',     value: `${s.scopeItemIds.length} ${s.type === 'controls' ? 'controls' : s.type === 'risk' ? 'risks' : 'obligations'}` },
                    { label: 'Projects',        value: s.scopeProjects.length === 0 ? 'All projects' : `${s.scopeProjects.length} project${s.scopeProjects.length !== 1 ? 's' : ''}` },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-1 border-b border-line/50 last:border-0">
                      <span className="text-[11px] text-muted-foreground">{row.label}</span>
                      <span className="text-[11px] font-semibold text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WHERE */}
              <div className="space-y-3">
                <SectionLabel icon={MapPin}>Where does this audit come from?</SectionLabel>
                <div className="rounded-xl border border-line bg-card p-4 space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mb-1">Scope description</p>
                    <p className="text-[12px] text-foreground leading-relaxed">{s.scopeDescription || 'No scope description.'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mb-1">Projects</p>
                    <div className="flex flex-wrap gap-1">
                      {s.scopeProjects.length === 0
                        ? <span className="text-xs text-muted-foreground italic">All projects</span>
                        : s.scopeProjects.map(id => {
                            const p = PROJECTS.find(p => p.id === id)
                            return (
                              <span key={id} className="text-[10px] px-2 py-0.5 rounded bg-secondary border border-line font-medium text-foreground">
                                {p?.name ?? id}
                              </span>
                            )
                          })
                      }
                    </div>
                  </div>
                </div>

                {/* NEXT ACTION */}
                <SectionLabel icon={TrendingUp}>Next action</SectionLabel>
                <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Upcoming run</p>
                      <p className="text-lg font-mono font-bold text-gold mt-0.5">{s.nextRun}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Auditor: <span className="font-semibold text-foreground">{s.assignedAuditorName}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Owner: <span className="font-semibold text-foreground">{s.accountableOwnerName}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'scope' && (
            <div className="lg:col-span-3">
              <ScopeItems s={s} />
            </div>
          )}

          {activeTab === 'people' && (
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { role: 'Created by',    name: s.createdByName,   role2: s.createdByRole,   id: s.createdById,    icon: User,    color: 'text-gold',  bg: 'bg-gold/10' },
                  { role: 'Requested by',  name: s.requestedByName, role2: s.requestedByRole, id: s.requestedById, icon: FileText, color: 'text-teal',  bg: 'bg-teal/10' },
                  { role: 'Approved by',   name: s.approvedByName,  role2: s.approvedByRole,  id: s.approvedById,  icon: CheckCircle2, color: 'text-green', bg: 'bg-green-bg' },
                  { role: 'Assigned auditor', name: s.assignedAuditorName, role2: 'Auditor', id: s.assignedAuditorId, icon: Shield, color: 'text-amber', bg: 'bg-amber-bg' },
                  { role: 'Accountable owner', name: s.accountableOwnerName, role2: 'Control/Risk Owner', id: s.accountableOwnerId, icon: Users, color: 'text-navy', bg: 'bg-navy/8' },
                ].map(person => {
                  const user = USERS.find(u => u.id === person.id)
                  const initials = user?.initials ?? person.name.slice(0, 2).toUpperCase()
                  const Icon = person.icon
                  return (
                    <div key={person.role} className="rounded-xl border border-line bg-card p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center shrink-0', person.bg)}>
                          <Icon className={cn('w-3 h-3', person.color)} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{person.role}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={person.name} initials={initials} size="md" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{person.name}</p>
                          <p className="text-[11px] text-muted-foreground">{person.role2}</p>
                          {user?.email && <p className="text-[10px] text-muted-foreground">{user.email}</p>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'trail' && (
            <div className="lg:col-span-3">
              <AuditTrail s={s} />
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="lg:col-span-3">
              {(!s.comments || s.comments.length === 0)
                ? <div className="flex flex-col items-center justify-center py-10 text-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm font-semibold text-foreground">No comments yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Comments added during schedule creation will appear here.</p>
                  </div>
                : <div className="space-y-3">
                    {s.comments.map(c => (
                      <div key={c.id} className="flex gap-3 rounded-xl border border-line bg-card p-4">
                        <Avatar name={c.author} initials={c.authorInitials} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{c.author}</span>
                            <span className="text-[10px] text-muted-foreground">{c.authorRole}</span>
                            <span className="text-[10px] text-muted-foreground ml-auto">{new Date(c.ts).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-foreground mt-1 leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Schedule Row ──────────────────────────────────────────────────────────
function ScheduleRow({ s, index }: { s: RichAuditSchedule; index: number }) {
  const [expanded, setExpanded] = React.useState(false)
  const tm = TYPE_META[s.type]
  const sm = STATUS_META[s.status]
  const lm = LIFECYCLE_META[s.lifecycle]
  const projectNames = s.scopeProjects
    .slice(0, 2)
    .map(id => PROJECTS.find(p => p.id === id)?.name ?? id)
  const moreProjects = Math.max(0, s.scopeProjects.length - 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03, ease }}
      className="border-b border-line last:border-0"
    >
      {/* Main row */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-5 py-3.5 hover:bg-secondary/40 transition-colors group"
      >
        <div className="flex items-center gap-4">
          {/* Expand toggle */}
          <div className={cn(
            'w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all',
            expanded ? 'bg-gold/15 text-gold' : 'text-muted-foreground group-hover:text-foreground',
          )}>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>

          {/* Type icon */}
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', tm.bg, tm.border, 'border')}>
            <tm.Icon className={cn('w-3.5 h-3.5', tm.color)} />
          </div>

          {/* ID + Name */}
          <div className="w-64 shrink-0">
            <p className="text-[10px] font-mono font-bold text-muted-foreground">{s.id}</p>
            <p className="text-sm font-semibold text-foreground leading-snug truncate">{s.name}</p>
          </div>

          {/* Type badge */}
          <div className="w-28 shrink-0 hidden lg:block">
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md border', tm.bg, tm.color, tm.border)}>
              {tm.label}
            </span>
          </div>

          {/* Frequency */}
          <div className="w-24 shrink-0 hidden md:block">
            <span className="text-xs px-2 py-0.5 rounded border border-line bg-secondary text-foreground font-medium">{s.frequency}</span>
          </div>

          {/* Projects */}
          <div className="flex-1 hidden lg:flex items-center gap-1 min-w-0">
            {projectNames.map(p => (
              <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary border border-line text-muted-foreground truncate max-w-[120px]">{p}</span>
            ))}
            {moreProjects > 0 && <span className="text-[10px] text-muted-foreground">+{moreProjects}</span>}
          </div>

          {/* Auditor */}
          <div className="w-28 shrink-0 hidden xl:flex items-center gap-1.5">
            <Avatar name={s.assignedAuditorName} initials={USERS.find(u => u.id === s.assignedAuditorId)?.initials ?? s.assignedAuditorName.slice(0,2)} size="xs" />
            <span className="text-xs text-foreground truncate">{s.assignedAuditorName.split(' ')[0]}</span>
          </div>

          {/* Next run */}
          <div className="w-24 shrink-0 hidden md:block">
            <span className="text-xs font-mono font-semibold text-gold">{s.nextRun}</span>
          </div>

          {/* Lifecycle */}
          <div className="w-24 shrink-0 hidden lg:flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', lm.dot)} />
            <span className={cn('text-[11px] font-semibold', lm.color)}>{s.lifecycle}</span>
          </div>

          {/* Status */}
          <div className="w-20 shrink-0">
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md', sm.bg, sm.color)}>
              {s.status}
            </span>
          </div>
        </div>
      </button>

      {/* Expandable detail */}
      <AnimatePresence>
        {expanded && <DetailPanel s={s} />}
      </AnimatePresence>
    </motion.div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────────────────
function KpiCard({ value, label, sub, color, bg }: {
  value: string | number; label: string; sub: string; color: string; bg: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease }}
      className="bg-card border border-line rounded-xl p-4 flex items-center gap-3"
    >
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', bg)}>
        <Activity className={cn('w-4 h-4', color)} />
      </div>
      <div>
        <p className={cn('text-2xl font-mono font-bold', color)}>{value}</p>
        <p className="text-xs font-semibold text-foreground mt-0.5">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function AuditHubPage() {
  const router = useRouter()
  const { allSchedules } = useAuditStore()

  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<AuditType | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState<ScheduleStatus | 'all'>('all')
  const [showNewMenu, setShowNewMenu] = React.useState(false)

  // Filtering
  const filtered = React.useMemo(() => {
    return allSchedules.filter(s => {
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.assignedAuditorName.toLowerCase().includes(search.toLowerCase()) ||
        s.accountableOwnerName.toLowerCase().includes(search.toLowerCase()) ||
        s.purpose.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'all' || s.type === typeFilter
      const matchStatus = statusFilter === 'all' || s.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [allSchedules, search, typeFilter, statusFilter])

  // KPIs
  const kpis = React.useMemo(() => ({
    total:      allSchedules.length,
    active:     allSchedules.filter(s => s.status === 'Active').length,
    controls:   allSchedules.filter(s => s.type === 'controls').length,
    risk:       allSchedules.filter(s => s.type === 'risk').length,
    compliance: allSchedules.filter(s => s.type === 'compliance').length,
    userAdded:  allSchedules.filter(s => s.id.startsWith('AS-0') && parseInt(s.id.replace('AS-','')) >= 7
                             || s.id.startsWith('AS-1') && parseInt(s.id.replace('AS-','')) >= 106
                             || s.id.startsWith('AS-2') && parseInt(s.id.replace('AS-','')) >= 206).length,
  }), [allSchedules])

  const NEW_LINKS = [
    { label: 'Controls Audit Schedule', href: '/controls-audit/schedule', Icon: Shield },
    { label: 'Risk Audit Schedule',     href: '/risk-audit/schedule',     Icon: AlertTriangle },
    { label: 'Compliance Audit Schedule', href: '/compliance-audit/schedule', Icon: Scale },
  ]

  return (
    <AppShell>
      <div className="min-h-screen bg-background">

        {/* ── Page Header ── */}
        <div className="border-b border-line bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-2">
                <span>Portfolio Intelligence Platform</span>
                <ChevronRight className="w-3 h-3" />
                <span>Governance & Audit</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-semibold">Audit Intelligence Hub</span>
              </div>
              <h1 className="text-lg font-bold text-foreground">Audit Intelligence Hub</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Single unified view of every audit schedule — who created it, who runs it, why it exists, what it covers, and where it stands.
              </p>
            </div>

            {/* New Schedule dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNewMenu(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-navy font-bold text-sm hover:bg-gold/90 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Audit Schedule
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showNewMenu && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {showNewMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease }}
                    className="absolute right-0 top-full mt-1.5 w-64 bg-card border border-line rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    {NEW_LINKS.map(link => (
                      <button
                        key={link.href}
                        onClick={() => { setShowNewMenu(false); router.push(link.href) }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors text-left"
                      >
                        <link.Icon className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-sm font-medium text-foreground">{link.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── KPI strip ── */}
        <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard value={kpis.total}      label="Total Schedules"     sub="all types"         color="text-gold"  bg="bg-gold/10" />
          <KpiCard value={kpis.active}     label="Active"              sub="running now"       color="text-green" bg="bg-green-bg" />
          <KpiCard value={kpis.controls}   label="Controls Audits"     sub="controls type"     color="text-gold"  bg="bg-gold/10" />
          <KpiCard value={kpis.risk}       label="Risk Audits"         sub="risk type"         color="text-amber" bg="bg-amber-bg" />
          <KpiCard value={kpis.compliance} label="Compliance Audits"   sub="compliance type"   color="text-teal"  bg="bg-teal/10" />
          <KpiCard value={kpis.userAdded}  label="User Created"        sub="added via forms"   color="text-navy"  bg="bg-navy/8" />
        </div>

        {/* ── Workflow pipeline visualiser ── */}
        <div className="px-6 pb-4">
          <div className="bg-card border border-line rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">Audit lifecycle flow</p>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {(['Draft', 'Requested', 'Approved', 'Scheduled', 'In Progress', 'Completed'] as LifecycleStage[]).map((stage, i, arr) => {
                const count = allSchedules.filter(s => s.lifecycle === stage).length
                const lm = LIFECYCLE_META[stage]
                return (
                  <React.Fragment key={stage}>
                    <div className={cn('flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[80px] border', lm.bg, lm.color, 'border-transparent')}>
                      <div className={cn('w-2 h-2 rounded-full', lm.dot)} />
                      <span className="text-[9px] font-bold uppercase tracking-[0.1em]">{stage}</span>
                      <span className="text-base font-mono font-bold">{count}</span>
                    </div>
                    {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Filter / search bar ── */}
        <div className="px-6 pb-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, auditor, purpose..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-line bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
            />
          </div>

          {/* Type filter pills */}
          <div className="flex items-center gap-1.5">
            {(['all', 'controls', 'risk', 'compliance'] as const).map(t => {
              const active = typeFilter === t
              const meta = t === 'all' ? null : TYPE_META[t]
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all',
                    active
                      ? meta ? cn(meta.bg, meta.color, meta.border) : 'bg-gold/10 text-gold border-gold/30'
                      : 'bg-background border-line text-muted-foreground hover:border-gold/30 hover:text-foreground',
                  )}
                >
                  {meta && <meta.Icon className="w-3 h-3" />}
                  {t === 'all' ? 'All types' : meta?.label}
                </button>
              )
            })}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ScheduleStatus | 'all')}
            className="px-3 py-2 text-sm rounded-lg border border-line bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
          >
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Ended">Ended</option>
          </select>

          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} of {allSchedules.length} schedules</span>
        </div>

        {/* ── Table header ── */}
        <div className="px-5 mx-6 mb-1">
          <div className="flex items-center gap-4 px-5 py-2 rounded-lg bg-secondary/60">
            <div className="w-5 shrink-0" />
            <div className="w-7 shrink-0" />
            <div className="w-64 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Schedule</span>
            </div>
            <div className="w-28 shrink-0 hidden lg:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Type</span>
            </div>
            <div className="w-24 shrink-0 hidden md:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Frequency</span>
            </div>
            <div className="flex-1 hidden lg:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Projects</span>
            </div>
            <div className="w-28 shrink-0 hidden xl:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Auditor</span>
            </div>
            <div className="w-24 shrink-0 hidden md:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Next run</span>
            </div>
            <div className="w-24 shrink-0 hidden lg:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Lifecycle</span>
            </div>
            <div className="w-20 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Status</span>
            </div>
          </div>
        </div>

        {/* ── Schedule rows ── */}
        <div className="mx-6 mb-6 rounded-xl border border-line bg-card overflow-hidden">
          {filtered.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Filter className="w-8 h-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-semibold text-foreground">No schedules match your filters</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting the search or filter criteria.</p>
              </div>
            )
            : filtered.map((s, i) => <ScheduleRow key={s.id} s={s} index={i} />)
          }
        </div>

      </div>
    </AppShell>
  )
}
