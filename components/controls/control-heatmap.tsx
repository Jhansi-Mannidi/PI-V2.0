'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Grid3x3, Info } from 'lucide-react'
import { HEATMAP, PROGRAMS, scoreColor, coverageBadge, type Program } from '@/lib/controls-data'

interface Props {
  onSelectCell?: (domainId: string, program: Program | 'all') => void
}

export function ControlHeatmap({ onSelectCell }: Props) {
  const [active, setActive] = React.useState<{ d: string; p: Program } | null>(null)

  return (
    <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-line flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
            <Grid3x3 className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Portfolio Control-Health Heatmap</h3>
            <p className="text-[11px] text-muted-foreground">Criticality-weighted effectiveness · domain × program</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          {[
            { c: 'bg-green', l: '85+' },
            { c: 'bg-teal', l: '70–84' },
            { c: 'bg-amber', l: '55–69' },
            { c: 'bg-red', l: '<55' },
          ].map((x) => (
            <span key={x.l} className="flex items-center gap-1">
              <span className={cn('w-2.5 h-2.5 rounded-sm', x.c)} /> {x.l}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px] p-4">
          {/* Header row */}
          <div className="grid grid-cols-[200px_repeat(4,1fr)_120px] gap-2 mb-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-end pb-1">
              Control Domain
            </div>
            {PROGRAMS.map((p) => (
              <div key={p} className="text-center text-[11px] font-semibold text-foreground pb-1">{p}</div>
            ))}
            <div className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pb-1">Coverage</div>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {HEATMAP.map((row, ri) => {
              const cov = coverageBadge(row.coverage)
              return (
                <div key={row.domainId} className="grid grid-cols-[200px_repeat(4,1fr)_120px] gap-2 items-center">
                  <div className="text-[12.5px] font-medium text-foreground pr-2 leading-tight">{row.domain}</div>
                  {PROGRAMS.map((p, ci) => {
                    const score = row.scores[p]
                    const sc = scoreColor(score)
                    const isActive = active?.d === row.domainId && active?.p === p
                    return (
                      <motion.button
                        key={p}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: (ri * 4 + ci) * 0.02 }}
                        onClick={() => {
                          setActive(isActive ? null : { d: row.domainId, p })
                          onSelectCell?.(row.domainId, p)
                        }}
                        className={cn(
                          'relative h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all',
                          sc.bg, sc.text,
                          'hover:brightness-110 hover:-translate-y-0.5',
                          isActive && 'ring-2 ring-offset-2 ring-offset-card ring-foreground'
                        )}
                        title={`${row.domain} · ${p}: ${score} (${sc.label})`}
                      >
                        {score}
                      </motion.button>
                    )
                  })}
                  <div className="flex justify-center">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-semibold', cov.cls)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', cov.dot)} />
                      {cov.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-line bg-secondary/30 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {'Cells weight effectiveness by control criticality and blast radius. '}
          <span className="text-red font-medium">EMEA Permit / Compliance (38)</span>
          {' and '}
          <span className="text-red font-medium">APAC Data Provenance (35)</span>
          {' are the two material control breaks driving portfolio posture below target.'}
        </p>
      </div>
    </div>
  )
}
