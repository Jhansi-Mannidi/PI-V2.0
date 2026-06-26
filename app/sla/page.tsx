'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  Bot,
  ArrowUpRight,
  Search,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Timer,
  Users,
  Activity,
  UserCheck,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useActionModal } from '@/hooks/use-action-modal'
import { Badge } from '@/components/ui/badge'
import { AnimNum, FadeUp, GrowVertical } from '@/components/animated-primitives'
import { useAI } from '@/components/ai-provider'
import { usePIPStore } from '@/hooks/use-pip-store'
import { USERS } from '@/lib/governance-data'

/* ── SLA Definition Data ── */
const slaDefinitions = [
  { id: 'SLA-001', name: 'RFI Response Time', target: '3 business days', current: '3.8d avg', status: 'breach' as const, breachCount: 4, trend: -12 },
  { id: 'SLA-002', name: 'Change Order Approval', target: '5 business days', current: '4.2d avg', status: 'warning' as const, breachCount: 1, trend: -5 },
  { id: 'SLA-003', name: 'Monthly Status Report', target: '3 calendar days', current: '2.1d avg', status: 'ok' as const, breachCount: 0, trend: 8 },
  { id: 'SLA-004', name: 'Contractor Onboarding', target: '10 business days', current: '12.4d avg', status: 'breach' as const, breachCount: 2, trend: -18 },
  { id: 'SLA-005', name: 'Permit Processing', target: '15 business days', current: '14.2d avg', status: 'warning' as const, breachCount: 0, trend: -3 },
  { id: 'SLA-006', name: 'Inspection Sign-off', target: '2 business days', current: '1.4d avg', status: 'ok' as const, breachCount: 0, trend: 15 },
  { id: 'SLA-007', name: 'Budget Reconciliation', target: '5 business days', current: '3.8d avg', status: 'ok' as const, breachCount: 0, trend: 4 },
  { id: 'SLA-008', name: 'Safety Certification', target: '7 business days', current: '5.9d avg', status: 'ok' as const, breachCount: 0, trend: 2 },
]

const activeBreaches = [
  { id: 'B-001', sla: 'RFI Response Time', project: 'Pryor Creek', instance: 'RFI-1188', elapsed: '4d 06h 12m', owner: 'Mark Torres', agent: 'A-200', agentAction: 'Auto-nudge sent 2h ago' },
  { id: 'B-002', sla: 'RFI Response Time', project: 'Pryor Creek', instance: 'RFI-1192', elapsed: '3d 18h 44m', owner: 'Sarah Lin', agent: 'A-200', agentAction: 'Escalation recommended' },
  { id: 'B-003', sla: 'RFI Response Time', project: 'Mesa', instance: 'RFI-1205', elapsed: '3d 12h 20m', owner: 'David Kim', agent: null, agentAction: null },
  { id: 'B-004', sla: 'RFI Response Time', project: 'Henderson', instance: 'RFI-1210', elapsed: '3d 04h 55m', owner: 'Jennifer M.', agent: 'A-200', agentAction: 'Workload rebalance suggested' },
  { id: 'B-005', sla: 'Contractor Onboarding', project: 'Henderson', instance: 'ONB-0044', elapsed: '12d 08h 30m', owner: 'Jennifer M.', agent: 'A-200', agentAction: 'Legal review flagged as bottleneck' },
  { id: 'B-006', sla: 'Contractor Onboarding', project: 'Papillion', instance: 'ONB-0051', elapsed: '10d 22h 15m', owner: 'Robert Ng', agent: null, agentAction: null },
  { id: 'B-007', sla: 'Change Order Approval', project: 'Mesa', instance: 'CO-0087', elapsed: '5d 14h 00m', owner: 'Brian Smith', agent: 'A-200', agentAction: 'Priority bump recommended' },
]

const weeklyTrend = [
  { week: 'W14', breaches: 3, warnings: 2, ok: 27 },
  { week: 'W15', breaches: 4, warnings: 3, ok: 25 },
  { week: 'W16', breaches: 5, warnings: 2, ok: 25 },
  { week: 'W17', breaches: 4, warnings: 4, ok: 24 },
  { week: 'W18', breaches: 7, warnings: 2, ok: 23 },
]

type TabFilter = 'all' | 'breached' | 'warning' | 'ok'

function LiveBreachPanel() {
  const { openBreaches, resolveBreach, escalateBreach, reassignBreach, recentActivity } = usePIPStore()
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [resolveNote, setResolveNote] = React.useState<Record<string, string>>({})

  const slaActivity = recentActivity.filter(
    (a) => a.kind === 'SLA_BREACH_RESOLVED' || a.kind === 'SLA_ESCALATED' || a.kind === 'SLA_REASSIGNED'
  ).slice(0, 6)

  return (
    <div className="bg-card rounded-2xl border border-line p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red" /> Live Breach Management
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red/15 text-red text-[10px] font-bold">{openBreaches.length} open</span>
        </p>
      </div>

      {/* Breach rows */}
      <div className="space-y-2">
        {openBreaches.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">No open breaches. All SLAs on track.</div>
        )}
        {openBreaches.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: i * 0.04 }}
            className="border border-line rounded-xl overflow-hidden"
          >
            <button onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-secondary/40 transition-colors">
              <div className={cn('w-2 h-2 rounded-full shrink-0 mt-2',
                b.status === 'escalated' ? 'bg-red' : 'bg-amber'
              )} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-mono text-muted-foreground">{b.instance}</span>
                  <span className={cn('text-[9px] font-semibold px-1.5 py-0.5 rounded border',
                    b.status === 'escalated' ? 'bg-red/10 border-red/30 text-red' : 'bg-amber/10 border-amber/30 text-amber'
                  )}>{b.status}</span>
                </div>
                <p className="text-[13px] font-semibold text-foreground">{b.slaName} — {b.project}</p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {b.elapsed}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Owner: <strong className="text-foreground">{b.ownerName}</strong>
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Entered by: <strong className="text-foreground">{b.uploadedByName}</strong>
                  </span>
                  {b.reviewedByName && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green" /> Reviewed: <strong className="text-foreground">{b.reviewedByName}</strong>
                    </span>
                  )}
                </div>
                {b.affectedParties.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className="text-[9px] text-muted-foreground">Affected:</span>
                    {b.affectedParties.filter(Boolean).slice(0, 3).map((p) => (
                      <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-line">{p}</span>
                    ))}
                  </div>
                )}
              </div>
              <ChevronDown className={cn('w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform', expandedId === b.id && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {expandedId === b.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
                  className="border-t border-line bg-secondary/30 px-4 py-3 overflow-hidden"
                >
                  <p className="text-[11px] text-muted-foreground mb-2 italic">{b.notes}</p>
                  <div className="mb-2">
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">Resolve note</label>
                    <input
                      type="text"
                      placeholder="Describe resolution..."
                      value={resolveNote[b.id] ?? ''}
                      onChange={(e) => setResolveNote((prev) => ({ ...prev, [b.id]: e.target.value }))}
                      className="w-full text-xs border border-line rounded-lg px-2.5 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-gold/60"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" className="h-7 text-[11px] bg-green/90 text-white border-transparent"
                      disabled={!resolveNote[b.id]?.trim()}
                      onClick={() => { resolveBreach(b.id, resolveNote[b.id] ?? 'Resolved'); setExpandedId(null) }}>
                      Mark Resolved
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[11px] border-red/30 text-red hover:bg-red/10"
                      onClick={() => escalateBreach(b.id)}>
                      Escalate
                    </Button>
                    <select
                      className="text-[11px] border border-line rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none"
                      defaultValue=""
                      onChange={(e) => { if (e.target.value) reassignBreach(b.id, e.target.value) }}
                    >
                      <option value="" disabled>Reassign to...</option>
                      {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* SLA Activity trail */}
      {slaActivity.length > 0 && (
        <div className="border-t border-line pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <Activity className="w-3 h-3" /> SLA Activity — Who acted, who is affected
          </p>
          <div className="space-y-2">
            {slaActivity.map((act, i) => {
              const timeAgo = Math.round((Date.now() - act.at) / 60000)
              const label = timeAgo < 2 ? 'just now' : timeAgo < 60 ? `${timeAgo}m ago` : `${Math.round(timeAgo / 60)}h ago`
              return (
                <div key={act.id} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber/20 border border-amber/35 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-amber">{act.actorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-foreground">{act.actorName}</span>
                      <span className="text-[9px] text-muted-foreground">{label}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{act.detail}</p>
                    {act.affectedParties?.filter(Boolean).length > 0 && (
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {act.affectedParties.filter(Boolean).slice(0, 3).map((p) => (
                          <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{p}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SLATrackerPage() {
  const { aiEnabled } = useAI()
  const [tab, setTab] = React.useState<TabFilter>('all')
  const [expandedSla, setExpandedSla] = React.useState<string | null>(null)
  const [expandedBreach, setExpandedBreach] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const action = useActionModal()

  const filteredSLAs = slaDefinitions
    .filter((s) => tab === 'all' || (tab === 'breached' && s.status === 'breach') || (tab === 'warning' && s.status === 'warning') || (tab === 'ok' && s.status === 'ok'))
    .filter((s) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.target.toLowerCase().includes(q)
      )
    })

  const statusConfig = {
    breach: { label: 'Past SLA', color: 'text-red', bg: 'bg-red-bg', dot: 'bg-red', border: 'border-red/30', icon: XCircle },
    warning: { label: 'At Risk', color: 'text-amber', bg: 'bg-amber-bg', dot: 'bg-amber', border: 'border-amber/30', icon: AlertTriangle },
    ok: { label: 'On Track', color: 'text-green', bg: 'bg-green-bg', dot: 'bg-green', border: 'border-green/30', icon: CheckCircle2 },
  }

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All SLAs', count: slaDefinitions.length },
    { key: 'breached', label: 'Past SLA', count: slaDefinitions.filter((s) => s.status === 'breach').length },
    { key: 'warning', label: 'At Risk', count: slaDefinitions.filter((s) => s.status === 'warning').length },
    { key: 'ok', label: 'On Track', count: slaDefinitions.filter((s) => s.status === 'ok').length },
  ]

  return (
    <AppShell title="SLA Performance Tracker" subtitle="Are we meeting commitments?" activeHref="/sla">
      <div className="space-y-4 sm:space-y-6 w-full">

        {/* ── Summary Strip - Professional KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FadeUp delay={0}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total SLAs</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight"><AnimNum value={slaDefinitions.length} delay={200} /></p>
              <p className="text-xs text-muted-foreground mt-1">Tracked definitions</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.06}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-red/10 flex items-center justify-center">
                  <XCircle className="w-4.5 h-4.5 text-red" />
                </div>
                <span className="text-[11px] font-semibold text-red uppercase tracking-wider">Past SLA Items</span>
              </div>
              <p className="text-2xl font-bold text-red font-mono tracking-tight"><AnimNum value={activeBreaches.length} delay={280} /></p>
              <p className="text-xs text-muted-foreground mt-1">Across {slaDefinitions.filter((s) => s.status === 'breach').length} SLA types</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.12}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber" />
                </div>
                <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">At Risk</span>
              </div>
              <p className="text-2xl font-bold text-amber font-mono tracking-tight"><AnimNum value={slaDefinitions.filter((s) => s.status === 'warning').length} delay={360} /></p>
              <p className="text-xs text-muted-foreground mt-1">Approaching threshold</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.18}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-green/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4.5 h-4.5 text-green" />
                </div>
                <span className="text-[11px] font-semibold text-green uppercase tracking-wider">Compliance Rate</span>
              </div>
              <p className="text-2xl font-bold text-green font-mono tracking-tight"><AnimNum value="78%" delay={440} /></p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Down from 85% last week
              </p>
            </div>
          </FadeUp>
        </div>

        {/* ── Live Breach Management ── */}
        <LiveBreachPanel />

        {/* ── Weekly Trend Chart - Professional Horizontal Bars ── */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Weekly SLA Performance Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Compliance rate over the last 5 weeks</p>
            </div>
<div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E7F5EC] dark:bg-emerald-900/40 border border-[#A7D7B8] dark:border-emerald-700/50" />
                    <span className="text-xs font-medium text-muted-foreground">On Track</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FBF1E6] dark:bg-amber-900/40 border border-[#E8D5B5] dark:border-amber-700/50" />
                    <span className="text-xs font-medium text-muted-foreground">At Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FBE9E9] dark:bg-rose-900/40 border border-[#F0C0C0] dark:border-rose-700/50" />
                    <span className="text-xs font-medium text-muted-foreground">Past SLA</span>
                  </div>
                </div>
          </div>
          
          {/* Horizontal Stacked Bars */}
          <div className="space-y-3">
            {weeklyTrend.map((w, idx) => {
              const total = w.breaches + w.warnings + w.ok
              const onTrackPct = (w.ok / total) * 100
              const atRiskPct = (w.warnings / total) * 100
              const breachedPct = (w.breaches / total) * 100
              const isLatest = idx === weeklyTrend.length - 1
              
              return (
                <motion.div 
                  key={w.week} 
                  className="group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <div className="flex items-center gap-4">
                    {/* Week Label */}
                    <div className="w-16 flex items-center gap-2">
                      <span className={cn(
                        'text-sm font-semibold',
                        isLatest ? 'text-primary' : 'text-foreground'
                      )}>{w.week}</span>
                      {isLatest && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-bold rounded uppercase">Now</span>
                      )}
                    </div>
                    
                    {/* Stacked Bar - Soft Pastel Colors with Dark Mode */}
                    <div className="flex-1 h-8 flex rounded-lg overflow-hidden bg-muted/20 dark:bg-muted/10">
                      {/* On Track - Soft Mint Green */}
                      <motion.div 
                        className="relative h-full flex items-center justify-center overflow-hidden bg-[#E7F5EC] dark:bg-emerald-900/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${onTrackPct}%` }}
                        transition={{ delay: 0.3 + idx * 0.08, duration: 0.6, ease: 'easeOut' }}
                      >
                        {onTrackPct > 15 && (
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 drop-shadow-sm">{Math.round(onTrackPct)}%</span>
                        )}
                      </motion.div>
                      
                      {/* At Risk - Soft Cream Beige */}
                      <motion.div 
                        className="relative h-full flex items-center justify-center overflow-hidden bg-[#FBF1E6] dark:bg-amber-900/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${atRiskPct}%` }}
                        transition={{ delay: 0.4 + idx * 0.08, duration: 0.6, ease: 'easeOut' }}
                      >
                        {atRiskPct > 10 && (
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 drop-shadow-sm">{Math.round(atRiskPct)}%</span>
                        )}
                      </motion.div>
                      
                      {/* Breached - Soft Pink Rose */}
                      <motion.div 
                        className="relative h-full flex items-center justify-center overflow-hidden bg-[#FBE9E9] dark:bg-rose-900/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${breachedPct}%` }}
                        transition={{ delay: 0.5 + idx * 0.08, duration: 0.6, ease: 'easeOut' }}
                      >
                        {breachedPct > 8 && (
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 drop-shadow-sm">{Math.round(breachedPct)}%</span>
                        )}
                      </motion.div>
                    </div>
                    
                    {/* Stats - Mini badges with matching soft colors */}
                    <div className="hidden sm:flex items-center gap-2 w-28 justify-end">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded text-[10px] font-bold bg-[#E7F5EC] dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">{w.ok}</span>
                      <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded text-[10px] font-bold bg-[#FBF1E6] dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">{w.warnings}</span>
                      <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded text-[10px] font-bold bg-[#FBE9E9] dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">{w.breaches}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── SLA Definitions ── */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-line">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-base font-semibold text-foreground">SLA Definitions</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search SLAs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9 w-[220px] pl-9 pr-4 text-sm border border-line rounded-lg bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all" />
              </div>
            </div>
            <div className="flex gap-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                    tab === t.key
                      ? 'bg-gold text-navy shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                  )}
                >
                  {t.label}
                  <span className="ml-2 px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px]">{t.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Header - Wider first two columns */}
          <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.8fr] gap-0 bg-muted/30 dark:bg-navy-mid/30 border-b border-line text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            <div className="px-6 py-3">SLA Name</div>
            <div className="px-5 py-3">Target</div>
            <div className="px-3 py-3">Current</div>
            <div className="px-3 py-3">Trend</div>
            <div className="px-3 py-3">Status</div>
            <div className="px-3 py-3 text-center">Issues</div>
          </div>

          {/* SLA List */}
          <div className="divide-y divide-line">
            {filteredSLAs.map((sla) => {
              const cfg = statusConfig[sla.status]
              const StatusIcon = cfg.icon
              const relatedBreaches = activeBreaches.filter((b) => b.sla === sla.name)
              return (
                <div key={sla.id}>
                  <button
                    onClick={() => setExpandedSla(expandedSla === sla.id ? null : sla.id)}
                    className="w-full grid grid-cols-1 sm:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.8fr] gap-0 items-center text-left hover:bg-secondary/30 transition-colors group"
                  >
                    {/* SLA Name & ID */}
                    <div className="px-6 py-4 flex items-center gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        {relatedBreaches.length > 0 ? (
                          expandedSla === sla.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                        ) : <div className="w-4" />}
                        <StatusIcon className={cn('w-5 h-5', cfg.color)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-gold transition-colors">{sla.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{sla.id}</p>
                      </div>
                    </div>
                    
                    {/* Target */}
                    <div className="px-5 py-4 hidden sm:block">
                      <p className="text-sm font-mono text-foreground">{sla.target}</p>
                    </div>
                    
                    {/* Current */}
                    <div className="px-3 py-4">
                      <p className={cn('text-sm font-mono font-bold', cfg.color)}>{sla.current}</p>
                    </div>
                    
                    {/* Trend */}
                    <div className="px-3 py-4">
                      <div className="flex items-center gap-1.5">
                        {sla.trend < 0 ? <TrendingDown className="w-4 h-4 text-red" /> : <TrendingUp className="w-4 h-4 text-green" />}
                        <span className={cn('text-sm font-mono font-semibold', sla.trend < 0 ? 'text-red' : 'text-green')}>{sla.trend > 0 ? '+' : ''}{sla.trend}%</span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="px-3 py-4">
                      <Badge variant="outline" className={cn('text-[10px] font-semibold', cfg.border, cfg.color)}>{cfg.label}</Badge>
                    </div>
                    
                    {/* Breach Count */}
                    <div className="px-3 py-4 flex justify-center">
                      {sla.breachCount > 0 ? (
                        <span className="min-w-[28px] h-6 px-2 flex items-center justify-center rounded-full bg-red text-white text-xs font-bold shadow-sm">{sla.breachCount}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </button>

                  {/* Expanded: show related breaches */}
                  {expandedSla === sla.id && relatedBreaches.length > 0 && (
                    <div className="px-3 sm:px-5 pb-4 ml-4 sm:ml-9 space-y-2">
                      {relatedBreaches.map((breach) => (
                          <div
                          key={breach.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-red-bg/50 border border-red/10"
                        >
                          <div className="w-2 h-2 rounded-full bg-red animate-pulse-dot" />
                          <div className="min-w-[140px]">
                            <p className="text-sm font-semibold text-foreground">{breach.instance}</p>
                            <p className="text-[11px] text-muted-foreground">{breach.project}</p>
                          </div>
                          <div className="min-w-[100px]">
                            <p className="text-sm font-mono font-semibold text-red tabular-nums">{breach.elapsed}</p>
                          </div>
                          <div className="min-w-[100px]">
                            <p className="text-xs text-muted-foreground">{breach.owner}</p>
                          </div>
                          {aiEnabled && breach.agent && (
                            <Badge variant="outline" className="text-[10px] font-mono border-teal/20 text-teal">
                              <Bot className="w-3 h-3 mr-1" />{breach.agent}
                            </Badge>
                          )}
                          {aiEnabled && breach.agentAction && (
                            <span className="text-[10px] text-teal italic">{breach.agentAction}</span>
                          )}
                          <div className="ml-auto flex gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-[10px] gap-1 border-red/30 text-red"
                              onClick={() =>
                                action.open({
                                  tone: 'destructive',
                                  icon: ArrowUpRight,
                                  title: `Escalate SLA Breach — ${breach.id}`,
                                  description: 'Escalates this SLA breach to leadership for resolution.',
                                  context: [
                                    { label: 'Breach', value: breach.id },
                                    { label: 'Owner', value: breach.owner },
                                    { label: 'Project', value: breach.project },
                                    { label: 'Days Over', value: breach.elapsed },
                                  ],
                                  fields: [
                                    {
                                      type: 'select',
                                      name: 'target',
                                      label: 'Escalate To',
                                      required: true,
                                      options: [
                                        { value: 'pm', label: 'Brian Steinberg — Program Manager' },
                                        { value: 'pd', label: 'Brian Smith — Portfolio Director' },
                                      ],
                                    },
                                    { type: 'textarea', name: 'note', label: 'Reason', required: true, rows: 3 },
                                  ],
                                  confirmLabel: 'Escalate',
                                  successToast: `${breach.id} escalated`,
                                })
                              }
                            >
                              <ArrowUpRight className="w-3 h-3" />Escalate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-[10px] gap-1 border-teal/30 text-teal"
                              onClick={() =>
                                action.open({
                                  tone: 'info',
                                  icon: Timer,
                                  title: `Nudge ${breach.owner}`,
                                  description: 'Sends a quick reminder about the open SLA breach.',
                                  context: [
                                    { label: 'Breach', value: breach.id },
                                    { label: 'Owner', value: breach.owner },
                                  ],
                                  fields: [
                                    { type: 'textarea', name: 'note', label: 'Message', required: true, rows: 3, defaultValue: `Hi ${breach.owner} — quick reminder on ${breach.id}, currently ${breach.elapsed} elapsed (over SLA).` },
                                  ],
                                  confirmLabel: 'Send',
                                  successToast: 'Nudge sent',
                                })
                              }
                            >
                              <Timer className="w-3 h-3" />Nudge
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {action.element}
    </AppShell>
  )
}
