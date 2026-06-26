'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { PulseIndicator, FadeUp, GrowBar } from '@/components/animated-primitives'
import { AuditSchedulerModal } from '@/components/governance/audit-scheduler-modal'
import { cn } from '@/lib/utils'
import {
  ShieldCheck, Search, Filter, Plus, UserPlus, Download, CalendarDays,
  ChevronDown, ChevronRight, BarChart2, Users, AlertTriangle, CheckCircle2,
  Clock, Edit2, FileText, X, History, RefreshCw, Sparkles,
} from 'lucide-react'
import {
  CONTROLS, USERS, PROJECTS,
  effectivenessBadge, controlTypeBadge, isOverdueControl, getControlsLibraryKpis,
  type Control, type ControlCategory, type ControlEffectiveness, type ControlStatus,
} from '@/lib/governance-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const CATEGORY_OPTIONS: ControlCategory[] = ['Financial', 'Operational', 'Safety', 'Cyber/IT', 'Schedule', 'Procurement', 'Environmental', 'Compliance']

function OwnerAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  return (
    <div className={cn(
      'rounded-full bg-gold/20 border border-gold/35 flex items-center justify-center shrink-0',
      size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
    )}>
      <span className={cn('font-bold text-gold', size === 'sm' ? 'text-[8px]' : 'text-[10px]')}>{initials}</span>
    </div>
  )
}

function ControlDrawer({ control, onClose, onScheduleAudit }: { control: Control; onClose: () => void; onScheduleAudit: (control: Control) => void }) {
  const [trailOpen, setTrailOpen] = React.useState(false)
  const eb = effectivenessBadge(control.effectiveness)
  const projects = PROJECTS.filter((p) => control.projects.includes(p.id))

  const testHistory = [
    { date: control.lastTested ?? '—', result: control.effectiveness === 'Effective' ? 'Pass' : control.effectiveness === 'Partially Effective' ? 'Partial' : control.effectiveness === 'Ineffective' ? 'Fail' : 'Not Run', by: control.ownerName ?? 'Unassigned' },
    { date: '2026-03-15', result: 'Pass', by: control.ownerName ?? 'Unassigned' },
    { date: '2025-12-15', result: 'Pass', by: control.ownerName ?? 'Unassigned' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.28, ease }}
        className="relative bg-card border-l border-line shadow-2xl w-full sm:w-[480px] flex flex-col h-full z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-line">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono text-muted-foreground font-semibold">{control.id}</span>
              <span className={cn('px-1.5 py-0.5 rounded border text-[9px] font-semibold', controlTypeBadge(control.type))}>{control.type}</span>
              <span className={cn('px-1.5 py-0.5 rounded border text-[9px] font-semibold', eb.cls)}>
                <span className={cn('w-1.5 h-1.5 rounded-full inline-block mr-1', eb.dot)} />{eb.label}
              </span>
            </div>
            <h3 className="text-[14px] font-semibold text-foreground leading-snug">{control.name}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{control.category} · {control.nature} · {control.framework}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground ml-2 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Objective */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Objective</p>
            <p className="text-[13px] text-foreground leading-relaxed">{control.objective}</p>
          </div>

          {/* Owner */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Accountable Owner</p>
            {control.ownerName ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl border border-line bg-secondary/30">
                <OwnerAvatar name={control.ownerName} size="lg" />
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{control.ownerName}</p>
                  <p className="text-[11px] text-muted-foreground">{USERS.find((u) => u.id === control.ownerId)?.role ?? ''}</p>
                </div>
                <button className="ml-auto text-[11px] text-gold hover:underline flex items-center gap-1">
                  <Edit2 className="w-3 h-3" />Reassign
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-red/30 bg-red-bg/30">
                <AlertTriangle className="w-4 h-4 text-red shrink-0" />
                <div>
                  <p className="text-[12.5px] font-semibold text-red">Unassigned</p>
                  <p className="text-[11px] text-muted-foreground">This control has no accountable owner — a control gap.</p>
                </div>
                <Button size="sm" className="ml-auto h-7 text-[11px] bg-gold text-navy font-semibold border border-gold">
                  <UserPlus className="w-3 h-3 mr-1" />Assign
                </Button>
              </div>
            )}
          </div>

          {/* Projects */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Projects ({projects.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {projects.map((p) => (
                <span key={p.id} className="px-2 py-1 rounded-lg bg-secondary border border-line text-[11px] font-medium text-foreground">{p.name}</span>
              ))}
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Test Frequency', value: control.testFrequency },
              { label: 'Last Tested', value: control.lastTested ?? 'Never' },
              { label: 'Next Due', value: control.nextDue },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl border border-line bg-secondary/20 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                <p className={cn('text-[12.5px] font-semibold', label === 'Next Due' && isOverdueControl(control) ? 'text-red' : 'text-foreground')}>{value}</p>
              </div>
            ))}
          </div>

          {/* Linked risks */}
          {control.linkedRiskIds.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Linked Risks</p>
              <div className="flex flex-wrap gap-1.5">
                {control.linkedRiskIds.map((r) => (
                  <span key={r} className="px-2 py-1 rounded-md bg-red-bg border border-red/25 text-red text-[10px] font-mono font-semibold">{r}</span>
                ))}
              </div>
            </div>
          )}

          {/* Test history */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Recent Test History</p>
            <div className="space-y-1.5">
              {testHistory.map((t, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-line last:border-0">
                  <span className={cn(
                    'px-2 py-0.5 rounded border text-[10px] font-semibold',
                    t.result === 'Pass' ? 'bg-green-bg text-green border-green/30' :
                    t.result === 'Partial' ? 'bg-amber-bg text-amber border-amber/30' :
                    t.result === 'Fail' ? 'bg-red-bg text-red border-red/30' :
                    'bg-secondary text-muted-foreground border-line'
                  )}>{t.result}</span>
                  <span className="text-[12px] font-mono text-foreground">{t.date}</span>
                  <span className="text-[11px] text-muted-foreground ml-auto">{t.by}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit trail */}
          <div>
            <button
              onClick={() => setTrailOpen((v) => !v)}
              className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <History className="w-3.5 h-3.5" />
              Trail (3)
              <ChevronDown className={cn('w-3.5 h-3.5 ml-auto transition-transform', trailOpen && 'rotate-180')} />
            </button>
            {trailOpen && (
              <div className="mt-2 space-y-2">
                {[
                  { action: 'Control created', user: 'Hasit Chetal', ts: '2026-01-10 08:00' },
                  { action: 'Owner assigned: ' + (control.ownerName ?? 'Unassigned'), user: 'Hasit Chetal', ts: '2026-01-10 08:05' },
                  { action: 'Status set to Active', user: 'Brian Smith', ts: '2026-01-12 09:00' },
                ].map((e, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[11.5px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">{e.action}</span>
                      <span className="text-muted-foreground"> · {e.user} · {e.ts}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-line flex items-center gap-2 bg-secondary/20">
          <Button
            size="sm"
            className="flex-1 h-9 text-[12px] bg-gold text-navy border border-gold font-semibold gap-1.5"
            onClick={() => onScheduleAudit(control)}
          >
            <CalendarDays className="w-3.5 h-3.5" />Schedule Audit
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-[12px] border-line gap-1.5">
            <Download className="w-3.5 h-3.5" />Export
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ControlsLibraryPage() {
  const kpis = getControlsLibraryKpis()
  const [search, setSearch] = React.useState('')
  const [filterCategory, setFilterCategory] = React.useState<ControlCategory | 'All'>('All')
  const [filterEffectiveness, setFilterEffectiveness] = React.useState<ControlEffectiveness | 'All'>('All')
  const [filterOwned, setFilterOwned] = React.useState(false)
  const [selectedControl, setSelectedControl] = React.useState<Control | null>(null)
  const [schedulerFor, setSchedulerFor] = React.useState<Control | null>(null)
  const [addSchedulerOpen, setAddSchedulerOpen] = React.useState(false)
  const [now] = React.useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))

  const filtered = CONTROLS.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || (c.ownerName ?? '').toLowerCase().includes(q)
    const matchCat = filterCategory === 'All' || c.category === filterCategory
    const matchEff = filterEffectiveness === 'All' || c.effectiveness === filterEffectiveness
    const matchOwned = !filterOwned || c.ownerId !== null
    return matchSearch && matchCat && matchEff && matchOwned
  })

  return (
    <AppShell title="Controls Library" subtitle="Internal control register with owner assignment per project" activeHref="/controls-library">
      <div className="space-y-5 w-full">

        {/* ── Page header ── */}
        <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-gold" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-bold tracking-wide uppercase">
                    GOVERNANCE &amp; AUDIT · Controls Library
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-bg border border-green/30 text-green text-[10px] font-semibold">
                    <PulseIndicator color="bg-green" size="w-1.5 h-1.5" />Data as of {now}
                  </span>
                  {kpis.unassigned > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-bg border border-red/30 text-red text-[10px] font-semibold">
                      <AlertTriangle className="w-3 h-3" />{kpis.unassigned} unassigned
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-foreground mt-1.5 leading-tight">
                  Is every control owned, active, and tested — across all 8 projects?
                </h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {kpis.total} controls · {kpis.effectivePct}% effective · {kpis.unassigned} unassigned (control gap) · {kpis.owners} owners
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" className="h-9 text-xs gap-1.5 border-line" onClick={() => setAddSchedulerOpen(true)}>
                <CalendarDays className="w-3.5 h-3.5" />Schedule Audit
              </Button>
              <Button className="h-9 text-xs gap-1.5 bg-gold text-navy border border-gold font-semibold">
                <Plus className="w-3.5 h-3.5" />Add Control
              </Button>
            </div>
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total Controls', value: kpis.total, icon: ShieldCheck, tone: 'gold' as const, sub: 'in register' },
            { label: 'Effective', value: `${kpis.effectivePct}%`, icon: CheckCircle2, tone: 'green' as const, sub: `${kpis.effective} controls` },
            { label: 'Unassigned', value: kpis.unassigned, icon: AlertTriangle, tone: 'red' as const, sub: 'control gap' },
            { label: 'Overdue Tests', value: kpis.overdueTests, icon: Clock, tone: 'amber' as const, sub: 'past next due' },
            { label: 'Active Owners', value: kpis.owners, icon: Users, tone: 'teal' as const, sub: 'accountable' },
          ].map((k, i) => {
            const tone = {
              gold: { bg: 'bg-gold/15', text: 'text-gold', val: 'text-gold' },
              green: { bg: 'bg-green-bg', text: 'text-green', val: 'text-green' },
              red: { bg: 'bg-red-bg', text: 'text-red', val: 'text-red' },
              amber: { bg: 'bg-amber-bg', text: 'text-amber', val: 'text-amber' },
              teal: { bg: 'bg-teal/10', text: 'text-teal', val: 'text-teal' },
            }[k.tone]
            return (
              <FadeUp key={k.label} delay={i * 0.05}>
                <div className="bg-card rounded-xl border border-line p-4 shadow-sm flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', tone.bg)}>
                    <k.icon className={cn('w-4 h-4', tone.text)} />
                  </div>
                  <div>
                    <p className={cn('text-2xl font-mono font-bold leading-none', tone.val)}>{k.value}</p>
                    <p className="text-[12px] font-semibold text-foreground mt-0.5">{k.label}</p>
                    <p className="text-[10.5px] text-muted-foreground">{k.sub}</p>
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>

        {/* ── Owner workload mini-bar ── */}
        <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-gold" />
            <h3 className="text-[13px] font-semibold text-foreground">Owner Workload</h3>
            <span className="text-[11px] text-muted-foreground">— controls assigned per owner</span>
          </div>
          <div className="space-y-2.5">
            {Array.from(
              CONTROLS.filter((c) => c.ownerId).reduce((acc, c) => {
                acc.set(c.ownerName!, (acc.get(c.ownerName!) ?? 0) + 1)
                return acc
              }, new Map<string, number>())
            )
              .sort((a, b) => b[1] - a[1])
              .map(([owner, count]) => (
                <div key={owner} className="flex items-center gap-3">
                  <OwnerAvatar name={owner} />
                  <span className="text-[12px] font-medium text-foreground w-28 truncate shrink-0">{owner}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <GrowBar
                      widthPct={(count / kpis.total) * 100}
                      className={cn('h-full rounded-full', count >= 4 ? 'bg-amber' : 'bg-teal')}
                    />
                  </div>
                  <span className="text-[12px] font-mono font-semibold text-foreground w-6 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* ── Filters & search ── */}
        <div className="bg-card rounded-xl border border-line p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search controls, owners…"
                className="w-full pl-9 pr-3 py-2 text-[12.5px] rounded-lg border border-line bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ControlCategory | 'All')}
              className="text-[12px] rounded-lg border border-line bg-secondary text-foreground px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="All">All Categories</option>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filterEffectiveness}
              onChange={(e) => setFilterEffectiveness(e.target.value as ControlEffectiveness | 'All')}
              className="text-[12px] rounded-lg border border-line bg-secondary text-foreground px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="All">All Effectiveness</option>
              <option value="Effective">Effective</option>
              <option value="Partially Effective">Partially Effective</option>
              <option value="Ineffective">Ineffective</option>
              <option value="Not Tested">Not Tested</option>
            </select>
            <label className="flex items-center gap-2 text-[12px] text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={filterOwned} onChange={(e) => setFilterOwned(e.target.checked)} className="accent-gold w-3.5 h-3.5" />
              <span className="font-medium">Owned only</span>
            </label>
            <span className="text-[11px] text-muted-foreground ml-auto">{filtered.length} of {CONTROLS.length} controls</span>
          </div>
        </div>

        {/* ── Controls table ── */}
        <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line bg-secondary/30">
                  {['Control', 'Category', 'Type', 'Owner', 'Projects', 'Framework', 'Effectiveness', 'Next Due', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <AnimatePresence initial={false}>
                  {filtered.map((ctrl, i) => {
                    const eb = effectivenessBadge(ctrl.effectiveness)
                    const overdue = isOverdueControl(ctrl)
                    const projectCount = ctrl.projects.length
                    const firstProject = PROJECTS.find((p) => p.id === ctrl.projects[0])
                    return (
                      <motion.tr
                        key={ctrl.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.02, ease }}
                        className="hover:bg-secondary/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedControl(ctrl)}
                      >
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-mono text-muted-foreground block">{ctrl.id}</span>
                          <p className="text-[12.5px] font-semibold text-foreground max-w-[220px] truncate">{ctrl.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] text-foreground">{ctrl.category}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={cn('px-1.5 py-0.5 rounded border text-[10px] font-semibold', controlTypeBadge(ctrl.type))}>
                            {ctrl.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {ctrl.ownerName ? (
                            <div className="flex items-center gap-1.5">
                              <OwnerAvatar name={ctrl.ownerName} />
                              <span className="text-[12px] font-medium text-foreground truncate max-w-[100px]">{ctrl.ownerName}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-red font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            {firstProject && (
                              <span className="px-1.5 py-0.5 rounded bg-secondary border border-line text-[10px] font-medium text-foreground">{firstProject.name}</span>
                            )}
                            {projectCount > 1 && (
                              <span className="px-1.5 py-0.5 rounded bg-secondary border border-line text-[10px] font-medium text-muted-foreground">+{projectCount - 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <span className="text-[11px] text-muted-foreground">{ctrl.framework}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold', eb.cls)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', eb.dot)} />{eb.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('text-[12px] font-mono', overdue ? 'text-red font-semibold' : 'text-foreground')}>
                            {ctrl.nextDue}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'px-1.5 py-0.5 rounded border text-[10px] font-semibold',
                            ctrl.status === 'Active' ? 'bg-green-bg text-green border-green/30' :
                            ctrl.status === 'Draft' ? 'bg-secondary text-muted-foreground border-line' :
                            'bg-secondary text-muted-foreground border-line'
                          )}>{ctrl.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSchedulerFor(ctrl) }}
                            className="p-1.5 rounded-lg hover:bg-gold/15 text-muted-foreground hover:text-gold transition-colors"
                            title="Schedule Audit"
                          >
                            <CalendarDays className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-5 py-10 text-center text-[12px] text-muted-foreground">
                      No controls match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Slide-over drawer ── */}
      <AnimatePresence>
        {selectedControl && (
          <ControlDrawer
            control={selectedControl}
            onClose={() => setSelectedControl(null)}
            onScheduleAudit={(c) => { setSelectedControl(null); setSchedulerFor(c) }}
          />
        )}
      </AnimatePresence>

      {/* ── Schedule audit modal ── */}
      {(schedulerFor || addSchedulerOpen) && (
        <AuditSchedulerModal
          type="controls"
          presetTitle={schedulerFor ? `${schedulerFor.testFrequency} Controls Audit — ${schedulerFor.name}` : ''}
          presetProjectIds={schedulerFor?.projects ?? []}
          onClose={() => { setSchedulerFor(null); setAddSchedulerOpen(false) }}
          onSave={() => { setSchedulerFor(null); setAddSchedulerOpen(false) }}
        />
      )}
    </AppShell>
  )
}
