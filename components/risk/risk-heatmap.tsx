'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronDown, Grid3x3, Download } from 'lucide-react'
import {
  HEATMAP_CATEGORIES, PORTFOLIO_HEATMAP, PROGRAM_DRILLS,
  bandForScore, BAND_META, type ScoreBand,
} from '@/lib/risk-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

function cellColor(score: number): string {
  const band = bandForScore(score)
  return BAND_META[band].cell
}

interface Props {
  onCellSelect?: (program: string, category: string) => void
}

// R-01 Portfolio Risk Heatmap + R-02 Program drill (§8.2 / §8.3)
export function RiskHeatmap({ onCellSelect }: Props) {
  const [expanded, setExpanded] = React.useState<string | null>('NA-West')

  return (
    <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
      <div className="px-4 py-3.5 border-b border-line flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
            <Grid3x3 className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h3 className="font-sans text-[14px] font-semibold text-foreground">Portfolio Risk Heatmap</h3>
            <p className="text-[10px] text-muted-foreground">R-01 · Programs × categories · colour = aggregate 0–100 score</p>
          </div>
        </div>
        {/* Band legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {(['Low', 'Elevated', 'High', 'Critical'] as ScoreBand[]).map((b) => (
            <div key={b} className="flex items-center gap-1.5">
              <span className={cn('w-2.5 h-2.5 rounded-sm', BAND_META[b].cell.split(' ')[0])} />
              <span className="text-[9px] text-muted-foreground">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px] p-3.5">
          {/* header row */}
          <div className="grid items-center gap-1.5 mb-1.5" style={{ gridTemplateColumns: `150px repeat(${HEATMAP_CATEGORIES.length}, 1fr) 96px` }}>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold px-2">Program</div>
            {HEATMAP_CATEGORIES.map((c) => (
              <div key={c} className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold text-center">{c}</div>
            ))}
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold text-right px-2">Exposure</div>
          </div>

          {PORTFOLIO_HEATMAP.map((row, ri) => {
            const drill = PROGRAM_DRILLS.find((d) => d.program === row.program)
            const isOpen = expanded === row.program
            return (
              <div key={row.program}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: ri * 0.05, ease }}
                  className="grid items-center gap-1.5 mb-1.5"
                  style={{ gridTemplateColumns: `150px repeat(${HEATMAP_CATEGORIES.length}, 1fr) 96px` }}
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : row.program)}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-2 text-left rounded-lg transition-colors',
                      isOpen ? 'bg-secondary/60' : 'hover:bg-secondary/50',
                    )}
                  >
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform shrink-0', isOpen ? 'rotate-180 text-gold' : 'text-muted-foreground')} />
                    <span className="text-[12px] font-semibold text-foreground truncate">{row.program}</span>
                  </button>
                  {HEATMAP_CATEGORIES.map((c) => {
                    const score = row.scores[c] ?? 0
                    return (
                      <button
                        key={c}
                        onClick={() => onCellSelect?.(row.program, c)}
                        className={cn(
                          'h-10 rounded-lg flex items-center justify-center text-[12px] font-mono font-bold transition-all duration-200 ring-1 ring-inset ring-current/10 hover:ring-2 hover:ring-gold/60 hover:scale-[1.05] hover:shadow-md hover:z-10 relative',
                          cellColor(score),
                        )}
                        title={`${row.program} · ${c} · score ${score} (${bandForScore(score)})`}
                      >
                        {score}
                      </button>
                    )
                  })}
                  <div className="text-right px-2">
                    <span className="text-[12px] font-mono font-bold text-foreground tabular-nums">${row.exposure.toFixed(1)}M</span>
                  </div>
                </motion.div>

                {/* R-02 program drill */}
                <AnimatePresence initial={false}>
                  {isOpen && drill && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mb-2 pl-4 border-l-2 border-gold/30 space-y-1.5 py-1.5">
                        <p className="text-[9px] uppercase tracking-wider text-gold font-semibold mb-1">R-02 · Projects in {row.program}</p>
                        {drill.projects.map((proj) => (
                          <div
                            key={proj.project}
                            className="grid items-center gap-1.5"
                            style={{ gridTemplateColumns: `130px repeat(${HEATMAP_CATEGORIES.length}, 1fr) 96px` }}
                          >
                            <span className="text-[11px] font-mono font-semibold text-muted-foreground px-2 truncate">{proj.project}</span>
                            {HEATMAP_CATEGORIES.map((c) => {
                              const score = proj.scores[c] ?? 0
                              return (
                                <button
                                  key={c}
                                  onClick={() => onCellSelect?.(row.program, c)}
                                  className={cn('h-7 rounded-md flex items-center justify-center text-[11px] font-mono font-bold transition-all duration-200 ring-1 ring-inset ring-current/10 hover:ring-2 hover:ring-gold/50 hover:scale-[1.04]', cellColor(score))}
                                  title={`${proj.project} · ${c} · ${score}`}
                                >
                                  {score}
                                </button>
                              )
                            })}
                            <div className="text-right px-2">
                              <span className="text-[11px] font-mono font-semibold text-muted-foreground tabular-nums">${proj.exposure.toFixed(1)}M</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-line flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">Click any cell to drill into the underlying ranked register. Every number traces to the certified semantic layer.</p>
        <button className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <Download className="w-3.5 h-3.5" /> Board PDF
        </button>
      </div>
    </div>
  )
}
