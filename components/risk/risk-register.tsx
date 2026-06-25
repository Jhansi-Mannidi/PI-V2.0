'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Search, Bot, ArrowUpDown, ChevronRight } from 'lucide-react'
import { RiskEntityDrawer } from '@/components/risk/risk-entity-drawer'
import {
  RISK_ENTITIES, computeScore, bandForScore, BAND_META,
  PROGRAMS, type RiskEntity, type RiskState,
} from '@/lib/risk-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const STATE_STYLE: Record<RiskState, string> = {
  Identified: 'bg-secondary text-muted-foreground border-line',
  Assessed: 'bg-teal/10 text-teal border-teal/20',
  Mitigating: 'bg-gold-pale text-gold border-gold/30',
  Escalated: 'bg-red-bg text-red border-red/30',
  Materialised: 'bg-red-bg text-red border-red/40',
  Resolved: 'bg-green-bg text-green border-green/30',
  Accepted: 'bg-secondary text-muted-foreground border-line',
}

interface Props {
  initialProgram?: string | null
  initialCategory?: string | null
  onCapture?: () => void
}

// R-03 Project Risk Register — ODC schema, scored & event-sourced
export function RiskRegister({ initialProgram, initialCategory, onCapture }: Props) {
  const [query, setQuery] = React.useState('')
  const [program, setProgram] = React.useState<string>(initialProgram ?? 'all')
  const [category, setCategory] = React.useState<string>(initialCategory ?? 'all')
  const [sortDesc, setSortDesc] = React.useState(true)
  const [selected, setSelected] = React.useState<RiskEntity | null>(null)

  React.useEffect(() => { if (initialProgram) setProgram(initialProgram) }, [initialProgram])
  React.useEffect(() => { if (initialCategory) setCategory(initialCategory) }, [initialCategory])

  const rows = RISK_ENTITIES
    .filter((r) => program === 'all' || r.program === program)
    .filter((r) => category === 'all' || r.category === category)
    .filter((r) => {
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return r.title.toLowerCase().includes(q) || r.project.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.ownerRole.toLowerCase().includes(q)
    })
    .map((r) => ({ ...r, _score: computeScore(r.drivers) }))
    .sort((a, b) => (sortDesc ? b._score - a._score : a._score - b._score))

  return (
    <>
      <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
        {/* Header + filters */}
        <div className="px-5 py-4 border-b border-line">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-sans text-base font-semibold text-foreground">Risk Register</h3>
              <p className="text-[11px] text-muted-foreground">R-03 · {rows.length} entities · ODC schema, scored & event-sourced</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search risks, owners, projects…"
                className="w-full h-8 pl-8 pr-3 text-xs border border-line rounded-lg bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <select value={program} onChange={(e) => setProgram(e.target.value)} className="h-8 px-2.5 text-xs border border-line rounded-lg bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-gold">
              <option value="all">All programs</option>
              {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-8 px-2.5 text-xs border border-line rounded-lg bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-gold">
              <option value="all">All categories</option>
              {['Cost', 'Schedule', 'Supply-chain', 'Legal', 'Safety', 'Resource'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => setSortDesc((s) => !s)} className="h-8 px-2.5 text-xs border border-line rounded-lg bg-secondary/50 hover:bg-secondary inline-flex items-center gap-1.5 text-muted-foreground">
              <ArrowUpDown className="w-3.5 h-3.5" /> Score
            </button>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-line">
          {rows.map((r, i) => {
            const band = bandForScore(r._score)
            return (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03, ease }}
                onClick={() => setSelected(r)}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 text-left hover:bg-secondary/30 transition-colors"
              >
                {/* score chip */}
                <div className={cn('w-11 h-11 rounded-lg flex flex-col items-center justify-center shrink-0 border', BAND_META[band].ring, BAND_META[band].bg)}>
                  <span className={cn('text-base font-mono font-bold leading-none', BAND_META[band].text)}>{r._score}</span>
                  <span className="text-[8px] text-muted-foreground mt-0.5">{band}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-muted-foreground">{r.id}</span>
                    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-semibold border', STATE_STYLE[r.state])}>{r.state}</span>
                    {r.kind === 'ISSUE' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-bg text-red border border-red/30">Issue</span>}
                    {r.generator !== 'Manual' && <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-teal/10 text-teal border border-teal/20 inline-flex items-center gap-0.5"><Bot className="w-2.5 h-2.5" />{r.archetype}</span>}
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate mt-0.5">{r.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{r.project} · {r.program} · {r.category} · {r.ownerRole}</p>
                </div>

                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-sm font-mono font-semibold text-red">${r.impactCost.toFixed(1)}M</p>
                  <p className="text-[10px] text-muted-foreground">{r.impactDays}d · {r.targetDate}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </motion.button>
            )
          })}
          {rows.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">No risks match the current filters.</div>
          )}
        </div>
      </div>

      <RiskEntityDrawer entity={selected} onClose={() => setSelected(null)} />
    </>
  )
}
