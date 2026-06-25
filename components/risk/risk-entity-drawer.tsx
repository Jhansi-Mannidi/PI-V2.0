'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Bot, DollarSign, CalendarClock, Users, FileSearch, ArrowUpRight,
  ShieldCheck, Shuffle, Ban, CircleCheck, Activity, Dot,
} from 'lucide-react'
import {
  type RiskEntity, computeScore, bandForScore, BAND_META, DRIVER_WEIGHTS,
  RISK_STATES, RESPONSE_META, PI_MATRIX, type ResponseStrategy, type ScoreBand,
} from '@/lib/risk-data'

const RESPONSE_ICON: Record<ResponseStrategy, React.ElementType> = {
  Mitigate: ShieldCheck, Transfer: Shuffle, Avoid: Ban, Accept: CircleCheck,
}

const DRIVER_LABELS: { key: keyof typeof DRIVER_WEIGHTS; label: string }[] = [
  { key: 'severity', label: 'Severity (P×I)' },
  { key: 'financial', label: 'Financial ($)' },
  { key: 'velocity', label: 'Velocity' },
  { key: 'proximity', label: 'Proximity' },
]

const matrixBandColor = (b: ScoreBand) => BAND_META[b].cell

export function RiskEntityDrawer({ entity, onClose }: { entity: RiskEntity | null; onClose: () => void }) {
  const { toast } = useToast()
  if (!entity) return null

  const score = computeScore(entity.drivers)
  const band = bandForScore(score)
  const stateIndex = RISK_STATES.findIndex((s) => s.id === entity.state)

  const act = (msg: string, desc: string) => toast({ title: msg, description: desc })

  return (
    <Sheet open={!!entity} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-line text-left space-y-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-muted-foreground">{entity.id}</span>
            <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border',
              entity.kind === 'ISSUE' ? 'bg-red-bg text-red border-red/30' : entity.kind === 'AUDIT' ? 'bg-gold-pale text-gold border-gold/30' : 'bg-secondary text-muted-foreground border-line')}>
              {entity.kind}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-secondary text-muted-foreground border border-line">{entity.category}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-secondary text-muted-foreground border border-line">{entity.project} · {entity.program}</span>
            {entity.generator !== 'Manual' && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-teal/10 text-teal border border-teal/20 inline-flex items-center gap-1">
                <Bot className="w-2.5 h-2.5" /> {entity.generator}
              </span>
            )}
          </div>
          <SheetTitle className="text-base font-semibold text-foreground leading-snug pt-1.5">{entity.title}</SheetTitle>
          <SheetDescription className="text-[12px] text-muted-foreground leading-relaxed">{entity.description}</SheetDescription>
        </SheetHeader>

        <div className="px-5 pt-4 pb-24 space-y-5">
          {/* Score + impact */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className={cn('rounded-xl border p-3 text-center', BAND_META[band].ring, BAND_META[band].bg)}>
              <p className={cn('text-2xl font-mono font-bold', BAND_META[band].text)}>{score}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{band} · 0–100</p>
            </div>
            <div className="rounded-xl border border-line p-3 text-center bg-secondary/30">
              <p className="text-2xl font-mono font-bold text-red">${entity.impactCost.toFixed(1)}M</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Quantified $</p>
            </div>
            <div className="rounded-xl border border-line p-3 text-center bg-secondary/30">
              <p className="text-2xl font-mono font-bold text-amber">{entity.impactDays}d</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Schedule</p>
            </div>
          </div>

          {/* Score driver breakdown (§5.2) */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Score drivers</h4>
            <div className="space-y-2">
              {DRIVER_LABELS.map(({ key, label }) => {
                const v = entity.drivers[key]
                const weight = DRIVER_WEIGHTS[key]
                return (
                  <div key={key} className="flex items-center gap-2.5">
                    <span className="text-[11px] text-muted-foreground w-28 shrink-0">{label}</span>
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className={cn('h-full rounded-full', BAND_META[bandForScore(v)].cell.split(' ')[0])} style={{ width: `${v}%` }} />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-foreground w-8 text-right">{v}</span>
                    <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">×{weight}</span>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
              Score recomputes automatically from new events — a worsening risk climbs the heatmap without anyone re-rating it.
            </p>
          </div>

          {/* P×I matrix position (§5.1) */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Probability × Impact</h4>
            <div className="flex gap-2">
              <div className="flex flex-col-reverse justify-between text-[8px] text-muted-foreground py-0.5">
                {[1, 2, 3, 4, 5].map((p) => <span key={p} className="h-5 flex items-center">P{p}</span>)}
              </div>
              <div className="flex-1">
                <div className="grid grid-rows-5 gap-1">
                  {[5, 4, 3, 2, 1].map((p) => (
                    <div key={p} className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((imp) => {
                        const cellBand = PI_MATRIX[p - 1][imp - 1]
                        const isHere = entity.probability === p && entity.impact === imp
                        return (
                          <div
                            key={imp}
                            className={cn('h-5 rounded flex items-center justify-center transition-all', matrixBandColor(cellBand).split(' ')[0],
                              isHere ? 'ring-2 ring-foreground scale-110 z-10' : 'opacity-50')}
                          >
                            {isHere && <Dot className="w-4 h-4 text-foreground" />}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-1 mt-1 text-[8px] text-muted-foreground text-center">
                  {['Insig', 'Minor', 'Mod', 'Major', 'Sev'].map((l) => <span key={l}>{l}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning trace */}
          {entity.reasoning && (
            <div className="bg-teal/5 rounded-lg p-3 border border-teal/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Bot className="w-3.5 h-3.5 text-teal" />
                <span className="text-[10px] font-semibold text-teal uppercase tracking-wide">Hash-chained reasoning trace</span>
              </div>
              <p className="text-[12px] text-foreground/75 leading-relaxed font-mono">{entity.reasoning}</p>
              {entity.signals && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {entity.signals.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded text-[9px] bg-teal/10 text-teal border border-teal/20">{s}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* State machine */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Lifecycle state</h4>
            <div className="flex items-center gap-1 flex-wrap">
              {RISK_STATES.slice(0, 6).map((s, i) => {
                const reached = i <= stateIndex && stateIndex < 5
                const isCurrent = s.id === entity.state
                return (
                  <React.Fragment key={s.id}>
                    <span className={cn('px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap',
                      isCurrent ? 'bg-gold text-navy' : reached ? 'bg-green-bg text-green' : 'bg-secondary text-muted-foreground')}>
                      {s.id}
                    </span>
                    {i < 5 && <span className="text-muted-foreground/40 text-[10px]">→</span>}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* Event timeline */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Event log</h4>
            <div className="space-y-0">
              {entity.events.map((ev, i) => (
                <div key={i} className="flex gap-3 pb-3 last:pb-0 relative">
                  {i < entity.events.length - 1 && <span className="absolute left-[7px] top-4 bottom-0 w-px bg-line" />}
                  <div className="w-3.5 h-3.5 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center shrink-0 mt-0.5 z-10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-semibold text-foreground">{ev.type}</span>
                      <span className="text-[10px] text-muted-foreground">{ev.at}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{ev.detail}</p>
                    <p className="text-[10px] text-muted-foreground/70 italic">— {ev.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Owner / support / mitigation (ODC schema) */}
          <div className="grid grid-cols-1 gap-2 text-[12px]">
            <div className="flex items-start gap-2"><Users className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" /><span className="text-muted-foreground">Owner role:</span><span className="text-foreground font-medium">{entity.ownerRole}</span></div>
            <div className="flex items-start gap-2"><ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" /><span className="text-muted-foreground">Support:</span><span className="text-foreground">{entity.supportRequested}</span></div>
            <div className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" /><span className="text-muted-foreground">Mitigation:</span><span className="text-foreground">{entity.mitigation}</span></div>
            <div className="flex items-start gap-2"><CalendarClock className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" /><span className="text-muted-foreground">Target:</span><span className="text-foreground font-mono">{entity.targetDate}</span></div>
            {entity.linkedAudit && <div className="flex items-start gap-2"><FileSearch className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" /><span className="text-muted-foreground">Linked audit:</span><span className="text-gold font-mono">{entity.linkedAudit}</span></div>}
          </div>

          {/* Response strategies (§6.1) */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Response strategy</h4>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(RESPONSE_META) as ResponseStrategy[]).map((r) => {
                const Icon = RESPONSE_ICON[r]
                const active = entity.response === r
                return (
                  <button
                    key={r}
                    onClick={() => act(`${r} selected`, `${RESPONSE_META[r].action} Task opens on a Service Role, never an individual.`)}
                    className={cn('flex items-start gap-2 p-2.5 rounded-lg border text-left transition-all',
                      active ? 'border-gold bg-gold-pale' : 'border-line hover:border-gold/40 bg-card')}
                  >
                    <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', active ? 'text-gold' : 'text-muted-foreground')} />
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">{r}{active && ' ·'}</p>
                      <p className="text-[10px] text-muted-foreground leading-snug">{RESPONSE_META[r].when}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sticky footer actions */}
        <div className="sticky bottom-0 bg-card border-t border-line px-5 py-3 flex items-center gap-2">
          {entity.kind === 'RISK' && entity.state !== 'Materialised' && (
            <Button
              variant="outline"
              onClick={() => act('Marked as materialised', `${entity.id} → ISSUE. Pre-history retained; corrective-action plan pre-filled from mitigations.`)}
              className="flex-1 h-9 text-xs gap-1.5 border-red/30 text-red"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Mark materialised
            </Button>
          )}
          <Button
            onClick={() => act('Action queued', `Workflow Task opened on ${entity.ownerRole}. Outcome Subscriber will measure actual vs predicted.`)}
            className="flex-1 h-9 text-xs gap-1.5 bg-gold text-navy font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Open mitigation task
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
