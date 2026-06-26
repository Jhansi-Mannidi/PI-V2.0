'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useActionModal } from '@/hooks/use-action-modal'
import { useAI } from '@/components/ai-provider'
import {
  Bot, DollarSign, CalendarClock, Users, FileSearch, ArrowUpRight,
  ShieldCheck, Shuffle, Ban, CircleCheck, Activity, X, ChevronLeft,
  TrendingUp, Clock, Target, Zap, AlertTriangle, CheckCircle2,
} from 'lucide-react'
import {
  type RiskEntity, type RiskEvent, computeScore, bandForScore, BAND_META, DRIVER_WEIGHTS,
  RISK_STATES, RESPONSE_META, PI_MATRIX, type ResponseStrategy, type ScoreBand,
} from '@/lib/risk-data'

const RESPONSE_ICON: Record<ResponseStrategy, React.ElementType> = {
  Mitigate: ShieldCheck,
  Transfer: Shuffle,
  Avoid: Ban,
  Accept: CircleCheck,
}

const DRIVER_LABELS: { key: keyof typeof DRIVER_WEIGHTS; label: string; icon: React.ElementType }[] = [
  { key: 'severity', label: 'Severity (P×I)', icon: AlertTriangle },
  { key: 'financial', label: 'Financial ($)', icon: DollarSign },
  { key: 'velocity', label: 'Velocity', icon: Zap },
  { key: 'proximity', label: 'Proximity', icon: Target },
]

const matrixBandColor = (b: ScoreBand) => BAND_META[b].cell

export function RiskEntityDrawer({
  entity,
  onClose,
}: {
  entity: RiskEntity | null
  onClose: () => void
}) {
  const action = useActionModal()
  const { aiEnabled } = useAI()
  const [localState, setLocalState] = React.useState<RiskEntity['state'] | null>(null)
  const [localKind, setLocalKind] = React.useState<RiskEntity['kind'] | null>(null)
  const [localResponse, setLocalResponse] = React.useState<ResponseStrategy | null>(null)
  const [localEvents, setLocalEvents] = React.useState<RiskEntity['events']>([])
  const [mitigationQueued, setMitigationQueued] = React.useState(false)

  React.useEffect(() => {
    setLocalState(null)
    setLocalKind(null)
    setLocalResponse(null)
    setLocalEvents([])
    setMitigationQueued(false)
  }, [entity?.id])

  if (!entity) return null

  const score = computeScore(entity.drivers)
  const band = bandForScore(score)
  const displayState = localState ?? entity.state
  const displayKind = localKind ?? entity.kind
  const displayResponse = localResponse ?? entity.response
  const displayEvents = [...localEvents, ...entity.events]
  const stateIndex = RISK_STATES.findIndex((s) => s.id === displayState)

  const appendEvent = (type: RiskEvent['type'], detail: string, actor = 'Portfolio risk console') => {
    setLocalEvents((prev) => [{ type, at: 'now', detail, actor }, ...prev])
  }

  const openResponseAction = (response: ResponseStrategy) => {
    const meta = RESPONSE_META[response]
    const Icon = RESPONSE_ICON[response] as React.ComponentType<{ className?: string }>
    action.open({
      tone: response === 'Avoid' ? 'destructive' : response === 'Accept' ? 'warning' : 'primary',
      icon: Icon,
      title: `${response} response — ${entity.id}`,
      description: `${meta.action} This action is assigned to a service role, not an individual.`,
      context: [
        { label: 'Risk', value: entity.title },
        { label: 'Owner role', value: entity.ownerRole },
        { label: 'Current response', value: displayResponse },
        { label: 'Selected response', value: response },
      ],
      fields: [
        {
          type: 'textarea',
          name: 'note',
          label: 'Decision note',
          placeholder: `Why is ${response.toLowerCase()} the right response?`,
          defaultValue: meta.when,
          rows: 3,
          required: true,
        },
      ],
      confirmLabel: `Set ${response}`,
      successToast: `${response} response selected`,
      successDescription: `${entity.id} updated and event log appended.`,
      onConfirm: (values) => {
        setLocalResponse(response)
        appendEvent(response === 'Accept' ? 'ACCEPTED' : 'MITIGATING', `${response} selected — ${values.note}`)
      },
    })
  }

  const openMaterialiseAction = () => {
    action.open({
      tone: 'destructive',
      icon: ArrowUpRight,
      title: `Mark materialised — ${entity.id}`,
      description: 'Convert this risk into an issue while preserving its full risk history.',
      context: [
        { label: 'Risk', value: entity.title },
        { label: 'Current state', value: displayState },
        { label: 'Exposure', value: `$${entity.impactCost.toFixed(1)}M / ${entity.impactDays}d` },
        { label: 'Owner role', value: entity.ownerRole },
      ],
      fields: [
        {
          type: 'textarea',
          name: 'evidence',
          label: 'Materialisation evidence',
          placeholder: 'Summarize the event or signal that confirms this risk has materialised.',
          rows: 3,
          required: true,
        },
      ],
      confirmLabel: 'Mark materialised',
      successToast: 'Risk marked as materialised',
      successDescription: `${entity.id} is now tracked as an issue with its prior history retained.`,
      onConfirm: (values) => {
        setLocalKind('ISSUE')
        setLocalState('Materialised')
        appendEvent('MATERIALISED', values.evidence)
      },
    })
  }

  const openMitigationAction = () => {
    action.open({
      tone: 'primary',
      icon: ShieldCheck,
      title: `Open mitigation task — ${entity.id}`,
      description: 'Create an owner-facing mitigation task from this risk record.',
      context: [
        { label: 'Risk', value: entity.title },
        { label: 'Owner role', value: entity.ownerRole },
        { label: 'Target date', value: entity.targetDate },
        { label: 'Response', value: displayResponse },
      ],
      fields: [
        {
          type: 'select',
          name: 'priority',
          label: 'Task priority',
          defaultValue: score >= 75 ? 'critical' : 'high',
          options: [
            { value: 'critical', label: 'Critical', description: 'Immediate owner action required' },
            { value: 'high', label: 'High', description: 'Prioritize in the current work cycle' },
            { value: 'standard', label: 'Standard', description: 'Track in normal mitigation cadence' },
          ],
          required: true,
        },
        {
          type: 'input',
          inputType: 'date',
          name: 'dueDate',
          label: 'Due date',
          defaultValue: entity.targetDate,
          required: true,
        },
        {
          type: 'textarea',
          name: 'task',
          label: 'Mitigation task',
          defaultValue: entity.mitigation,
          rows: 3,
          required: true,
        },
      ],
      confirmLabel: 'Create task',
      successToast: 'Mitigation task opened',
      successDescription: `${entity.ownerRole} now owns the mitigation workflow.`,
      onConfirm: (values) => {
        setMitigationQueued(true)
        appendEvent('MITIGATING', `${values.priority.toUpperCase()} mitigation task due ${values.dueDate}: ${values.task}`)
      },
    })
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          key={entity.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col h-full min-h-0"
        >
          {/* ── Sticky top bar ─────────────────────────────────────── */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-line bg-card shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Risk Register</span>
            </button>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs font-mono text-muted-foreground">{entity.id}</span>

            <div className="flex items-center gap-1.5 ml-auto">
              {/* Kind badge */}
              <span className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border',
                displayKind === 'ISSUE'
                  ? 'bg-red-bg text-red border-red/30'
                  : displayKind === 'AUDIT'
                    ? 'bg-gold-pale text-gold border-gold/30'
                    : 'bg-secondary text-muted-foreground border-line',
              )}>
                {displayKind}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-muted-foreground border border-line">
                {entity.category}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary text-muted-foreground border border-line">
                {entity.project} · {entity.program}
              </span>
              {aiEnabled && entity.generator !== 'Manual' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal/10 text-teal border border-teal/20 inline-flex items-center gap-1">
                  <Bot className="w-3 h-3" /> {entity.generator}
                </span>
              )}
              <button
                onClick={onClose}
                className="ml-2 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Scrollable body ────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            {/* Title hero */}
            <div className="px-6 pt-6 pb-5 border-b border-line bg-card">
              <h1 className="text-xl font-semibold text-foreground leading-snug mb-1.5">
                {entity.title}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {entity.description}
              </p>
            </div>

            {/* ── Main content grid ─────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 divide-y xl:divide-y-0 xl:divide-x divide-line">

              {/* ── LEFT col: Score + Drivers + P×I + Lifecycle ──────── */}
              <div className="xl:col-span-1 p-6 space-y-6 bg-background">

                {/* Score metrics row */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Score */}
                  <div className={cn(
                    'rounded-2xl border-2 p-4 text-center flex flex-col items-center justify-center gap-0.5',
                    BAND_META[band].ring, BAND_META[band].bg,
                  )}>
                    <span className={cn('text-4xl font-mono font-bold leading-none', BAND_META[band].text)}>{score}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-wide">{band}</span>
                    <span className="text-[9px] text-muted-foreground">0–100</span>
                  </div>
                  {/* Exposure */}
                  <div className="rounded-2xl border border-line p-4 text-center flex flex-col items-center justify-center gap-0.5 bg-card">
                    <span className="text-2xl font-mono font-bold text-red leading-none">${entity.impactCost.toFixed(1)}M</span>
                    <span className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-wide">Quantified $</span>
                  </div>
                  {/* Schedule */}
                  <div className="rounded-2xl border border-line p-4 text-center flex flex-col items-center justify-center gap-0.5 bg-card">
                    <span className="text-2xl font-mono font-bold text-amber leading-none">{entity.impactDays}d</span>
                    <span className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-wide">Schedule</span>
                  </div>
                </div>

                {/* Score drivers */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Score Drivers
                  </h3>
                  <div className="space-y-3">
                    {DRIVER_LABELS.map(({ key, label, icon: Icon }) => {
                      const v = entity.drivers[key]
                      const weight = DRIVER_WEIGHTS[key]
                      const driverBand = bandForScore(v)
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <Icon className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn('text-xs font-mono font-bold', BAND_META[driverBand].text)}>{v}</span>
                              <span className="text-[10px] font-mono text-muted-foreground/60">×{weight}</span>
                            </div>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${v}%` }}
                              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                              className={cn('h-full rounded-full', BAND_META[driverBand].cell.split(' ')[0])}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                    Score recomputes automatically from new events — a worsening risk climbs the heatmap without anyone re-rating it.
                  </p>
                </div>

                {/* P×I Matrix */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Probability × Impact
                  </h3>
                  <div className="flex gap-2">
                    <div className="flex flex-col-reverse justify-between py-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((p) => (
                        <span key={p} className="h-7 flex items-center text-[10px] font-mono text-muted-foreground">P{p}</span>
                      ))}
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
                                  className={cn(
                                    'h-7 rounded-md flex items-center justify-center transition-all',
                                    matrixBandColor(cellBand).split(' ')[0],
                                    isHere
                                      ? 'ring-2 ring-offset-1 ring-foreground scale-110 z-10 shadow-md'
                                      : 'opacity-40',
                                  )}
                                >
                                  {isHere && (
                                    <div className="w-2 h-2 rounded-full bg-foreground" />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-5 gap-1 mt-1.5">
                        {['Insig', 'Minor', 'Mod', 'Major', 'Sev'].map((l) => (
                          <span key={l} className="text-[9px] text-muted-foreground text-center">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lifecycle state */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Lifecycle State
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {RISK_STATES.slice(0, 6).map((s, i) => {
                      const reached = i <= stateIndex && stateIndex < 5
                      const isCurrent = s.id === displayState
                      return (
                        <React.Fragment key={s.id}>
                          <span className={cn(
                            'px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all',
                            isCurrent
                              ? 'bg-gold text-navy shadow-sm ring-1 ring-gold/40'
                              : reached
                                ? 'bg-green-bg text-green'
                                : 'bg-secondary text-muted-foreground',
                          )}>
                            {s.id}
                          </span>
                          {i < 5 && (
                            <span className={cn(
                              'text-[10px]',
                              i < stateIndex ? 'text-green' : 'text-muted-foreground/30',
                            )}>→</span>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>
                </div>

                {/* AI reasoning trace */}
                {aiEnabled && entity.reasoning && (
                  <div className="rounded-xl bg-teal/5 border border-teal/15 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-3.5 h-3.5 text-teal" />
                      <span className="text-[10px] font-semibold text-teal uppercase tracking-widest">
                        Hash-chained reasoning trace
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/70 leading-relaxed font-mono">{entity.reasoning}</p>
                    {entity.signals && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {entity.signals.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded text-[9px] bg-teal/10 text-teal border border-teal/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── MIDDLE col: Event Log + Response ─────────────────── */}
              <div className="xl:col-span-1 p-6 space-y-6 bg-card">

                {/* Event log */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Event Log
                  </h3>
                  <div className="relative">
                    {/* vertical timeline line */}
                    <div className="absolute left-[7px] top-4 bottom-4 w-px bg-line" />
                    <div className="space-y-0">
                      {displayEvents.map((ev, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.04 }}
                          className="flex gap-4 pb-4 last:pb-0 relative"
                        >
                          {/* dot */}
                          <div className={cn(
                            'w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 z-10',
                            i === 0 && localEvents.length > 0
                              ? 'bg-teal/20 border-teal'
                              : 'bg-gold/10 border-gold',
                          )} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                              <span className="text-[11px] font-mono font-bold text-foreground tracking-wide">
                                {ev.type}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{ev.at}</span>
                            </div>
                            <p className="text-xs text-foreground/80 leading-relaxed">{ev.detail}</p>
                            <p className="text-[10px] text-muted-foreground/60 italic mt-0.5">— {ev.actor}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Response strategies */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Response Strategy
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {(Object.keys(RESPONSE_META) as ResponseStrategy[]).map((r) => {
                      const Icon = RESPONSE_ICON[r]
                      const active = displayResponse === r
                      const meta = RESPONSE_META[r]
                      return (
                        <button
                          key={r}
                          onClick={() => openResponseAction(r)}
                          className={cn(
                            'flex items-start gap-3 p-3 rounded-xl border text-left transition-all w-full',
                            active
                              ? 'border-gold bg-gold-pale shadow-sm'
                              : 'border-line hover:border-gold/40 hover:bg-secondary/50 bg-background',
                          )}
                        >
                          <div className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                            active ? 'bg-gold text-navy' : 'bg-secondary text-muted-foreground',
                          )}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold text-foreground">{r}</p>
                              {active && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-gold text-navy font-bold">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{meta.when}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ── RIGHT col: Owner + Details + Actions ─────────────── */}
              <div className="xl:col-span-1 p-6 space-y-6 bg-background">

                {/* Owner & support */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Ownership
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: Users, label: 'Owner role', value: entity.ownerRole, highlight: true },
                      { icon: ArrowUpRight, label: 'Support', value: entity.supportRequested, highlight: false },
                      { icon: Activity, label: 'Mitigation', value: entity.mitigation, highlight: false },
                      { icon: CalendarClock, label: 'Target date', value: entity.targetDate, mono: true },
                      ...(entity.linkedAudit
                        ? [{ icon: FileSearch, label: 'Linked audit', value: entity.linkedAudit, highlight: true, gold: true }]
                        : []),
                    ].map(({ icon: Icon, label, value, highlight, mono, gold }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                          gold ? 'bg-gold-pale' : 'bg-secondary',
                        )}>
                          <Icon className={cn('w-3.5 h-3.5', gold ? 'text-gold' : 'text-muted-foreground')} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                          <p className={cn(
                            'text-xs mt-0.5 leading-snug',
                            gold ? 'text-gold font-mono' : highlight ? 'text-foreground font-semibold' : 'text-foreground',
                            mono && 'font-mono',
                          )}>
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk metadata */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Risk Details
                  </h3>
                  <div className="rounded-xl border border-line bg-card overflow-hidden">
                    {[
                      { label: 'Risk ID', value: entity.id },
                      { label: 'Program', value: entity.program },
                      { label: 'Project', value: entity.project },
                      { label: 'Category', value: entity.category },
                      { label: 'Probability', value: `P${entity.probability}` },
                      { label: 'Impact', value: `I${entity.impact}` },
                      { label: 'Score', value: `${score} (${band})` },
                    ].map(({ label, value }, i, arr) => (
                      <div
                        key={label}
                        className={cn(
                          'flex items-center justify-between px-4 py-2.5 text-xs',
                          i < arr.length - 1 ? 'border-b border-line' : '',
                          i % 2 === 0 ? 'bg-secondary/30' : '',
                        )}
                      >
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold text-foreground font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary actions */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Actions
                  </h3>
                  <div className="space-y-2.5">
                    <Button
                      onClick={openMitigationAction}
                      className="w-full h-10 text-sm gap-2 bg-gold hover:bg-gold/90 text-navy font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {mitigationQueued ? 'Mitigation queued' : 'Open mitigation task'}
                    </Button>

                    {displayKind === 'RISK' && displayState !== 'Materialised' && (
                      <Button
                        variant="outline"
                        onClick={openMaterialiseAction}
                        className="w-full h-10 text-sm gap-2 border-red/30 text-red hover:bg-red-bg"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        Mark materialised
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {action.element}
    </>
  )
}
