'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  TrendingUp, DollarSign, Users, Calendar, AlertTriangle, ChevronDown,
  ChevronRight, ArrowUpRight, Clock, Shield, Bot, Activity, Target,
  BarChart3, Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePIPStore } from '@/hooks/use-pip-store'
import { computeScore, bandForScore, BAND_META, type RiskState } from '@/lib/risk-data'
import { USERS } from '@/lib/governance-data'
import { useAI } from '@/components/ai-provider'

const ease = [0.25, 0.46, 0.45, 0.94] as const

// ── State change modal ───────────────────────────────────────────────────────
function StateChangePanel({
  riskId, title, current, onClose,
}: { riskId: string; title: string; current: RiskState; onClose: () => void }) {
  const { changeRiskState } = usePIPStore()
  const [note, setNote] = React.useState('')
  const [selected, setSelected] = React.useState<RiskState | null>(null)
  const states: RiskState[] = ['Identified', 'Assessed', 'Mitigating', 'Escalated', 'Materialised', 'Resolved', 'Accepted']

  const handle = () => {
    if (!selected || !note.trim()) return
    changeRiskState(riskId, selected, note)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-line rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
        <p className="text-[11px] text-muted-foreground font-mono mb-1">{riskId}</p>
        <h3 className="text-sm font-semibold text-foreground mb-4 leading-snug">{title}</h3>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">New State</p>
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {states.filter((s) => s !== current).map((s) => (
            <button key={s} onClick={() => setSelected(s)} className={cn(
              'px-3 py-2 rounded-lg border text-[11px] font-semibold text-left transition-all',
              selected === s ? 'border-gold bg-gold/15 text-gold' : 'border-line bg-secondary/50 text-muted-foreground hover:border-gold/50'
            )}>{s}</button>
          ))}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Reason / Note</p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe what changed and why..." rows={3} className="w-full text-xs border border-line rounded-lg px-3 py-2 bg-background text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-gold/60 mb-4" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="flex-1 bg-gold text-navy" disabled={!selected || !note.trim()} onClick={handle}>Update State</Button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Financial loss spark chart (SVG) ─────────────────────────────────────────
function LossSparkline({ points, width = 120, height = 36 }: {
  points: { expectedLoss: number; mitigatedLoss: number }[]
  width?: number
  height?: number
}) {
  const maxVal = Math.max(...points.map((p) => p.expectedLoss), 0.01)
  const toY = (v: number) => height - (v / maxVal) * (height - 4) - 2
  const toX = (i: number) => (i / (points.length - 1)) * width

  const expPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.expectedLoss)}`).join(' ')
  const mitPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.mitigatedLoss)}`).join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={expPath} fill="none" stroke="var(--color-red, #ef4444)" strokeWidth={1.5} opacity={0.7} strokeDasharray="3 2" />
      <path d={mitPath} fill="none" stroke="var(--color-teal, #14b8a6)" strokeWidth={1.5} />
    </svg>
  )
}

// ── Risk row in the horizon list ─────────────────────────────────────────────
function HorizonRow({
  risk, index, expanded, onToggle, onStateChange,
}: {
  risk: ReturnType<typeof usePIPStore>['riskList'][number]
  index: number
  expanded: boolean
  onToggle: () => void
  onStateChange: (riskId: string) => void
}) {
  const score = computeScore(risk.drivers)
  const band = bandForScore(score)
  const meta = BAND_META[band]
  const timeline = risk.financialLossTimeline ?? []
  const totalExpectedLoss = timeline[timeline.length - 1]?.expectedLoss ?? risk.impactCost
  const totalMitigatedLoss = timeline[timeline.length - 1]?.mitigatedLoss ?? risk.impactCost * 0.4
  const nearestMonth = timeline[0]?.month ?? 'Unknown'
  const peakProb = Math.max(...(timeline.map((t) => t.probability)), risk.probability * 20)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03, ease }}
      className="border border-line rounded-xl overflow-hidden bg-card hover:border-gold/40 transition-colors"
    >
      {/* Row header */}
      <button onClick={onToggle} className="w-full flex items-start gap-3 px-4 py-3 text-left">
        {/* Score badge */}
        <div className={cn('w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 font-mono font-bold border', meta.bg, meta.ring)}>
          <span className={cn('text-sm leading-none', meta.text)}>{score}</span>
          <span className={cn('text-[8px] mt-0.5', meta.text)}>{band}</span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="text-[10px] font-mono text-muted-foreground">{risk.id}</span>
            <span className={cn('text-[9px] font-semibold px-1.5 py-0.5 rounded border', meta.cell)}>{risk.state}</span>
            <span className="text-[9px] text-muted-foreground">{risk.category}</span>
          </div>
          <p className="text-[13px] font-semibold text-foreground leading-snug line-clamp-1">{risk.title}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{risk.program} · {risk.project} · {risk.ownerRole}</p>
        </div>

        {/* Key metrics */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          {/* Financial loss */}
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-[11px] font-mono font-bold text-red">${totalExpectedLoss.toFixed(1)}M</span>
              <span className="text-[9px] text-muted-foreground">exp.</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-[11px] font-mono font-bold text-teal">${totalMitigatedLoss.toFixed(1)}M</span>
              <span className="text-[9px] text-muted-foreground">mit.</span>
            </div>
          </div>
          {/* Sparkline */}
          <LossSparkline points={timeline.length > 0 ? timeline : [{ expectedLoss: risk.impactCost, mitigatedLoss: risk.impactCost * 0.4 }]} />
          {/* Probability */}
          <div className="text-right w-14">
            <div className="text-[13px] font-mono font-bold text-amber">{peakProb}%</div>
            <div className="text-[9px] text-muted-foreground">probability</div>
          </div>
          {/* When */}
          <div className="text-right w-20">
            <div className="text-[11px] font-semibold text-foreground">{nearestMonth}</div>
            <div className="text-[9px] text-muted-foreground">impact window</div>
          </div>
        </div>

        <ChevronDown className={cn('w-4 h-4 text-muted-foreground shrink-0 ml-1 transition-transform', expanded && 'rotate-180')} />
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="overflow-hidden border-t border-line"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Col 1: Financial Loss Timeline */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3" /> Financial Loss Timeline
                </p>
                <div className="space-y-1.5">
                  {timeline.map((t, i) => {
                    const maxLoss = Math.max(...timeline.map((x) => x.expectedLoss), 0.01)
                    const expPct = (t.expectedLoss / maxLoss) * 100
                    const mitPct = (t.mitigatedLoss / maxLoss) * 100
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[10px] text-muted-foreground">{t.month}</span>
                          <div className="flex gap-2">
                            <span className="text-[10px] font-mono text-red">${t.expectedLoss.toFixed(1)}M</span>
                            <span className="text-[10px] font-mono text-teal">${t.mitigatedLoss.toFixed(1)}M</span>
                          </div>
                        </div>
                        <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${expPct}%` }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="absolute inset-y-0 left-0 bg-red/25 rounded-full"
                          />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${mitPct}%` }}
                            transition={{ duration: 0.4, delay: i * 0.05 + 0.1 }}
                            className="absolute inset-y-0 left-0 bg-teal/50 rounded-full"
                          />
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{t.driver} · P{Math.round(t.probability / 20)}</p>
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-3 mt-2">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red/60" /><span className="text-[9px] text-muted-foreground">Unmitigated</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-teal/60" /><span className="text-[9px] text-muted-foreground">Mitigated</span></div>
                </div>
              </div>

              {/* Col 2: Probability & Impact owners */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Activity className="w-3 h-3" /> Probability Progression
                </p>
                <div className="space-y-1.5 mb-4">
                  {timeline.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[9px] text-muted-foreground w-16 shrink-0">{t.month}</span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${t.probability}%` }}
                          transition={{ duration: 0.35, delay: i * 0.05 }}
                          className={cn('h-full rounded-full', t.probability >= 70 ? 'bg-red' : t.probability >= 40 ? 'bg-amber' : 'bg-green')}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold w-8 text-right text-foreground">{t.probability}%</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> Affected Parties
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {risk.affectedParties.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] text-muted-foreground border border-line">{p}</span>
                  ))}
                </div>
              </div>

              {/* Col 3: Activity & Actions */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Ownership & Activity
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Entered by</span>
                    <span className="text-[10px] font-semibold text-foreground">{risk.createdByName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Last updated by</span>
                    <span className="text-[10px] font-semibold text-foreground">{risk.lastModifiedByName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Reviewed by</span>
                    <span className="text-[10px] font-semibold text-foreground">{risk.reviewedByName ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Owner role</span>
                    <span className="text-[10px] font-semibold text-gold">{risk.ownerRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Target date</span>
                    <span className="text-[10px] font-semibold text-foreground">{risk.targetDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Schedule impact</span>
                    <span className="text-[10px] font-semibold text-foreground">{risk.impactDays}d</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Button size="sm" className="w-full bg-gold text-navy text-[11px] h-7" onClick={() => onStateChange(risk.id)}>
                    <ArrowUpRight className="w-3 h-3 mr-1" /> Update State
                  </Button>
                  {risk.response && (
                    <div className={cn('px-2 py-1.5 rounded-lg border text-[10px]',
                      risk.response === 'Mitigate' ? 'bg-amber/10 border-amber/30 text-amber' :
                      risk.response === 'Accept' ? 'bg-secondary border-line text-muted-foreground' :
                      'bg-teal/10 border-teal/30 text-teal'
                    )}>
                      <Shield className="w-3 h-3 inline mr-1" />
                      Response: <strong>{risk.response}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main Risk Horizon component ──────────────────────────────────────────────
export function RiskHorizonContent() {
  const { aiEnabled } = useAI()
  const { riskList, totalExposure, recentActivity } = usePIPStore()
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const [stateChangeRiskId, setStateChangeRiskId] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState<'all' | 'escalated' | 'high' | 'unresolved'>('all')
  const [sortBy, setSortBy] = React.useState<'score' | 'loss' | 'probability'>('score')

  // Filter & sort
  const filtered = riskList
    .filter((r) => {
      if (filter === 'escalated') return r.state === 'Escalated'
      if (filter === 'high') return computeScore(r.drivers) >= 70
      if (filter === 'unresolved') return r.state !== 'Resolved' && r.state !== 'Accepted'
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'score') return computeScore(b.drivers) - computeScore(a.drivers)
      if (sortBy === 'loss') return (b.impactCost ?? 0) - (a.impactCost ?? 0)
      if (sortBy === 'probability') return b.probability - a.probability
      return 0
    })

  const totalScheduleImpact = riskList.reduce((s, r) => s + (r.impactDays ?? 0), 0)
  const escalatedCount = riskList.filter((r) => r.state === 'Escalated').length
  const criticalCount = riskList.filter((r) => bandForScore(computeScore(r.drivers)) === 'Critical').length

  const stateChangeRisk = stateChangeRiskId ? riskList.find((r) => r.id === stateChangeRiskId) ?? null : null

  return (
    <>
      <div className="space-y-4">
        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: DollarSign, label: 'Total Exposure', value: `$${totalExposure.toFixed(1)}M`, sub: 'unmitigated portfolio', tone: 'red' },
            { icon: Calendar, label: 'Schedule Risk', value: `${totalScheduleImpact}d`, sub: 'aggregate impact days', tone: 'amber' },
            { icon: AlertTriangle, label: 'Escalated', value: escalatedCount, sub: 'needs leadership action', tone: 'red' },
            { icon: Target, label: 'Critical', value: criticalCount, sub: 'score ≥ 90', tone: 'red' },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.06 }}
              className="bg-card rounded-xl border border-line p-3.5 flex items-center gap-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                k.tone === 'red' ? 'bg-red-bg' : 'bg-amber-bg'
              )}>
                <k.icon className={cn('w-4 h-4', k.tone === 'red' ? 'text-red' : 'text-amber')} />
              </div>
              <div>
                <p className={cn('text-xl font-mono font-bold', k.tone === 'red' ? 'text-red' : 'text-amber')}>{k.value}</p>
                <p className="text-[11px] font-semibold text-foreground">{k.label}</p>
                <p className="text-[10px] text-muted-foreground">{k.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter + Sort bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            {(['all', 'escalated', 'high', 'unresolved'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn(
                'px-3 py-1 rounded-md text-[11px] font-semibold capitalize transition-all',
                filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}>{f}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Sort:</span>
            {(['score', 'loss', 'probability'] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)} className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-semibold capitalize border transition-all',
                sortBy === s ? 'border-gold bg-gold/10 text-gold' : 'border-line text-muted-foreground hover:border-gold/40'
              )}>{s}</button>
            ))}
          </div>
        </div>

        {/* Risk rows */}
        <div className="space-y-2">
          {filtered.map((risk, i) => (
            <HorizonRow
              key={risk.id}
              risk={risk}
              index={i}
              expanded={expanded === risk.id}
              onToggle={() => setExpanded(expanded === risk.id ? null : risk.id)}
              onStateChange={(id) => setStateChangeRiskId(id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No risks match the current filter.</div>
          )}
        </div>

        {/* Activity feed */}
        {recentActivity.length > 0 && (
          <div className="bg-card rounded-xl border border-line p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> Recent Activity — Who did what
            </p>
            <div className="space-y-2">
              {recentActivity.slice(0, 8).map((act) => {
                const timeAgo = Math.round((Date.now() - act.at) / 60000)
                const label = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.round(timeAgo / 60)}h ago`
                return (
                  <div key={act.id} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/35 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[8px] font-bold text-gold">{act.actorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-foreground">{act.actorName}</span>
                        <span className="text-[10px] text-muted-foreground">{act.actorRole}</span>
                        <span className="text-[9px] text-muted-foreground ml-auto">{label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{act.detail}</p>
                      {act.affectedParties.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1">
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

      {/* State change panel */}
      <AnimatePresence>
        {stateChangeRisk && (
          <StateChangePanel
            riskId={stateChangeRisk.id}
            title={stateChangeRisk.title}
            current={stateChangeRisk.state}
            onClose={() => setStateChangeRiskId(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
