'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Bot, Check, X, Gauge, TrendingUp, GitMerge, EyeOff, ShieldQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  RISK_ENTITIES, ARCHETYPE_META, computeScore, bandForScore, BAND_META,
  type Archetype,
} from '@/lib/risk-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const ARCHETYPE_ICON: Record<Archetype, React.ElementType> = {
  Threshold: Gauge, Trend: TrendingUp, Correlation: GitMerge, Absence: EyeOff,
}

// §4 AI-Driven Risk Discovery — candidates with archetype, signals, reasoning trace
export function DiscoveryFeed() {
  const { toast } = useToast()
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set())
  const [decisions, setDecisions] = React.useState<Record<string, 'accepted' | 'rejected'>>({})
  const [filter, setFilter] = React.useState<Archetype | 'all'>('all')

  const discovered = RISK_ENTITIES.filter(
    (r) => r.generator !== 'Manual' && r.archetype && !dismissed.has(r.id),
  )
  const shown = filter === 'all' ? discovered : discovered.filter((r) => r.archetype === filter)

  const decide = (id: string, accept: boolean) => {
    setDecisions((prev) => ({ ...prev, [id]: accept ? 'accepted' : 'rejected' }))
    window.setTimeout(() => {
      setDismissed((prev) => new Set(prev).add(id))
    }, 900)
    toast({
      title: accept ? 'Risk accepted into register' : 'Candidate rejected',
      description: accept
        ? `${id} surfaced on the heatmap and rolled into program exposure. Decision logged to the Outcome Ledger.`
        : `${id} dismissed. The accept/reject decision becomes a training example — discovery precision improves on ODC's own portfolio.`,
    })
  }

  return (
    <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
      <div className="px-4 py-3.5 border-b border-line">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-soft flex items-center justify-center">
              <Bot className="w-4 h-4 text-teal" />
            </div>
            <div>
              <h3 className="font-sans text-[14px] font-semibold text-foreground">AI Risk Discovery</h3>
              <p className="text-[10px] text-muted-foreground">Rules Engine + Agent A-305 · surfacing latent risk across four archetypes</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal/10 border border-teal/20 text-teal text-[9.5px] font-semibold">
            {shown.length} candidates · ≥3 signals gated
          </span>
        </div>

        {/* archetype filter */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={cn('px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all', filter === 'all' ? 'bg-gold text-navy' : 'bg-secondary text-muted-foreground hover:text-foreground')}
          >
            All
          </button>
          {(Object.keys(ARCHETYPE_META) as Archetype[]).map((a) => {
            const Icon = ARCHETYPE_ICON[a]
            return (
              <button
                key={a}
                onClick={() => setFilter(a)}
                className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all', filter === a ? 'bg-gold text-navy' : 'bg-secondary text-muted-foreground hover:text-foreground')}
              >
                <Icon className="w-3 h-3" /> {a}
              </button>
            )
          })}
        </div>
      </div>

      <div className="divide-y divide-line">
        {shown.length === 0 && (
          <div className="px-5 py-10 text-center">
            <ShieldQuestion className="w-7 h-7 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No open candidates for this archetype.</p>
          </div>
        )}
        {shown.map((r, i) => {
          const Icon = ARCHETYPE_ICON[r.archetype!]
          const score = computeScore(r.drivers)
          const band = bandForScore(score)
          const decision = decisions[r.id]
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease }}
              className="p-4"
            >
              <div className="flex items-start gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', BAND_META[band].bg)}>
                  <Icon className={cn('w-4 h-4', BAND_META[band].text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-muted-foreground">{r.id}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-secondary text-muted-foreground border border-line">{r.archetype}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-teal/10 text-teal border border-teal/20">{r.generator}</span>
                    {r.confidence && <span className="text-[10px] font-mono text-muted-foreground ml-auto">conf {r.confidence}%</span>}
                  </div>
                  <h4 className="text-[12.5px] font-semibold text-foreground mt-1 leading-snug">{r.title}</h4>

                  {/* signals */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {r.signals?.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-[9.5px] font-medium bg-secondary text-muted-foreground border border-line">{s}</span>
                    ))}
                  </div>

                  {/* reasoning trace */}
                  <div className="mt-2.5 bg-teal/5 rounded-lg p-3 border border-teal/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Bot className="w-3.5 h-3.5 text-teal" />
                      <span className="text-[10px] font-semibold text-teal uppercase tracking-wide">Hash-chained reasoning trace</span>
                    </div>
                    <p className="text-[11px] text-foreground/75 leading-relaxed font-mono">{r.reasoning}</p>
                  </div>

                  {/* score + impact + decisions */}
                  <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('text-base font-mono font-bold', BAND_META[band].text)}>{score}</span>
                        <span className="text-[10px] text-muted-foreground">/ 100 · {band}</span>
                      </div>
                      <span className="text-[10.5px] font-mono text-red">${r.impactCost.toFixed(1)}M{r.impactDays ? ` · ${r.impactDays}d` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {decision && (
                        <span className={cn(
                          'h-7 inline-flex items-center px-2 rounded-md border text-[11px] font-semibold',
                          decision === 'accepted' ? 'border-green/30 bg-green-bg text-green' : 'border-red/30 bg-red-bg text-red',
                        )}>
                          {decision === 'accepted' ? 'Accepted' : 'Rejected'}
                        </span>
                      )}
                      <Button size="sm" variant="outline" disabled={!!decision} onClick={() => decide(r.id, false)} className="h-7 text-[11px] gap-1 border-line text-muted-foreground">
                        <X className="w-3 h-3" /> Reject
                      </Button>
                      <Button size="sm" disabled={!!decision} onClick={() => decide(r.id, true)} className="h-7 text-[11px] gap-1 bg-gold text-navy font-semibold">
                        <Check className="w-3 h-3" /> Accept into register
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
