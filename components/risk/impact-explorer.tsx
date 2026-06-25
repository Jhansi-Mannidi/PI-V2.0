'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Tag, Gauge, TrendingDown, Clock } from 'lucide-react'
import {
  IMPACT_BY_PROGRAM,
  IMPACT_BY_CATEGORY,
  IMPACT_BY_DRIVER,
  TOTAL_EXPOSURE_COST,
  type ImpactSlice,
} from '@/lib/risk-data'

type Lens = 'program' | 'category' | 'driver'

const LENSES: { id: Lens; label: string; icon: typeof Layers; data: ImpactSlice[] }[] = [
  { id: 'program', label: 'By Program', icon: Layers, data: IMPACT_BY_PROGRAM },
  { id: 'category', label: 'By Category', icon: Tag, data: IMPACT_BY_CATEGORY },
  { id: 'driver', label: 'By Score Driver', icon: Gauge, data: IMPACT_BY_DRIVER },
]

export function ImpactExplorer() {
  const [lens, setLens] = useState<Lens>('program')
  const active = LENSES.find((l) => l.id === lens)!
  const slices = [...active.data].sort((a, b) => b.cost - a.cost)
  const maxCost = Math.max(...slices.map((s) => s.cost))

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-amber-600" />
              Impact Explorer
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Decompose total portfolio exposure of{' '}
              <span className="font-mono font-semibold text-foreground">${TOTAL_EXPOSURE_COST.toFixed(1)}M</span> across
              different lenses to find where risk concentrates.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-line p-1 bg-muted/40 self-start">
            {LENSES.map((l) => {
              const Icon = l.icon
              const on = l.id === lens
              return (
                <button
                  key={l.id}
                  onClick={() => setLens(l.id)}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    on ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {l.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {slices.map((s, i) => {
            const pct = (s.cost / maxCost) * 100
            const sharePct = (s.cost / TOTAL_EXPOSURE_COST) * 100
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-28 sm:w-36 shrink-0 text-sm text-foreground truncate" title={s.label}>
                  {s.label}
                </div>
                <div className="flex-1 h-7 rounded-md bg-muted/50 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="h-full rounded-md bg-gradient-to-r from-amber-500/80 to-amber-600 flex items-center justify-end pr-2"
                  >
                    <span className="text-[11px] font-mono font-semibold text-white whitespace-nowrap">
                      ${s.cost.toFixed(1)}M
                    </span>
                  </motion.div>
                </div>
                <div className="w-24 shrink-0 flex items-center justify-end gap-2 text-xs">
                  <span className="font-mono text-muted-foreground">{sharePct.toFixed(0)}%</span>
                  <span className="flex items-center gap-0.5 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {s.days}d
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground px-1">
        Exposure = probability-weighted financial impact across open risks and issues. Switching lenses re-pivots the
        same exposure pool so totals reconcile to ${TOTAL_EXPOSURE_COST.toFixed(1)}M.
      </p>
    </div>
  )
}
