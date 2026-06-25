'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AlertOctagon, ArrowUpRight, Play, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTROL_GAPS, coverageBadge } from '@/lib/controls-data'
import { useToast } from '@/hooks/use-toast'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export function ControlGapExplorer() {
  const { toast } = useToast()
  const sorted = [...CONTROL_GAPS].sort((a, b) => b.exposureValue - a.exposureValue)
  const totalExposure = sorted.reduce((s, g) => s + g.exposureValue, 0)

  return (
    <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-line flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-bg flex items-center justify-center">
            <AlertOctagon className="w-4 h-4 text-red" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Control Gap Explorer</h3>
            <p className="text-[11px] text-muted-foreground">Unverified & stale controls, ranked by blast radius</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Gap Exposure</p>
            <p className="text-lg font-mono font-bold text-red leading-none">${totalExposure.toFixed(1)}M</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-line">
        {sorted.map((g, i) => {
          const cov = coverageBadge(g.coverageState)
          const maxExp = sorted[0].exposureValue
          return (
            <motion.div
              key={g.controlId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease }}
              className="px-4 sm:px-5 py-3.5 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center w-10 shrink-0 pt-0.5">
                  <span className="text-base font-mono font-bold text-foreground">{g.exposureValue.toFixed(1)}</span>
                  <span className="text-[8px] uppercase tracking-wide text-muted-foreground">$M</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-muted-foreground">{g.controlId}</span>
                    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-semibold', cov.cls)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', cov.dot)} /> {cov.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{g.region}</span>
                    {g.autoRaisedRisk && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 text-[9px] font-semibold">
                        <ArrowUpRight className="w-2.5 h-2.5" /> {g.autoRaisedRisk}
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] font-medium text-foreground mt-1 leading-snug">{g.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10.5px] text-muted-foreground">Last tested <span className="text-foreground font-medium">{g.daysSinceTest}d ago</span></span>
                    <span className="text-[10.5px] text-muted-foreground">·</span>
                    <span className="text-[10.5px] text-muted-foreground">{g.blastRadius}</span>
                  </div>
                  {/* exposure bar */}
                  <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-red" style={{ width: `${(g.exposureValue / maxExp) * 100}%` }} />
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast({ title: 'Re-test queued', description: `${g.controlId} scheduled for immediate auto-audit.` })}
                  className="shrink-0 h-8 text-[11px] gap-1 border-line hover:border-gold/40 hover:text-gold"
                >
                  <Play className="w-3 h-3" /> Test
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="px-5 py-3 border-t border-line bg-secondary/30 flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Stale critical controls auto-raise a risk in the Risk module — closing the controls → risk loop without manual triage.
        </p>
      </div>
    </div>
  )
}
